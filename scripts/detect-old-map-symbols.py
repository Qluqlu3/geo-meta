"""廃墟アーカイブ: 旧版地形図(今昔マップ on the web「関東」1972〜1982年)から寺院(卍)・神社(鳥居)の
地図記号を検出し、緯度経度の一覧を書き出す。

    python3 scripts/detect-old-map-symbols.py --bbox=34.60,138.18,35.97,139.18 --out=symbols.json

必要なもの: Python 3.10+、opencv-python-headless、numpy(pip install opencv-python-headless numpy)

仕組み:
1. ズーム15のタイル(記号は約13px)を10x10枚ずつつなぎ、黒インク以外(茶色の等高線・青の水部)を白に飛ばす
2. 基準テンプレート(卍2種・鳥居1種)で正規化相関をとり、しきい値以上の位置を候補にする
3. 候補を、目視でラベルを付けた正例(実際の記号)・負例(建物の塗りつぶし・漢字の一画・等高線の交差など)と
   ±2px ずらしながら比べ、正例により近いものだけを残す
   (2026-09 の検証: 採用しきい値 0.60/0.62 の時点で、学習に使っていない大月・富士宮の2図幅の採用44件は
   すべて実際の記号、見落としは1割程度。全域では地名の漢字などへの誤検出が 0.70〜0.80 に残るため、
   掲載用の絞り込みは find-vanished-shrines.mjs の --min-match で行う)
4. 白黒印刷の図幅や、等高線が黒い図幅(黒い等高線が記号と紛れる)にある候補は捨てる
   負例には、全域の試行で目視により誤検出と判定した地名の漢字(「地」「原」「湖」など)・黒い等高線も加えている

テンプレートと正例・負例は scripts/data/old-map-symbols.npz(14x14 の小片)。
今昔マップのタイルは谷謙二氏(埼玉大学)が運営するサーバーから配信されているため、同時接続は既定で3本
(ブラウザで地図を眺めるのと同程度)に抑え、取得したタイルは --cache に保存して再実行時に取り直さない。
"""

import argparse
import json
import math
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import cv2
import numpy as np

Z = 15
BLOCK = 10
MARGIN = 16  # 隣のブロックとの境目にかかる記号を拾うための重なり(px)
UA = "haikyo-archive-symbol-script/0.1"
DATA = np.load(Path(__file__).parent / "data" / "old-map-symbols.npz")
BASE_THR = {"temple": 0.58, "shrine": 0.62}
# 正例との一致度の下限。0.60〜0.70 は山間部の本物もあるが、現行図に対応物がない(=「消えた」扱いになる)
# 誤検出が集中する帯だったため、全体の精度を優先して 0.70 にしている
ACCEPT_THR = {"temple": 0.70, "shrine": 0.70}
MARGIN_OVER_NEG = 0.03
# 1972〜82年版でも奥多摩・秩父・飯能・箱根などの図幅は白黒印刷で、黒い等高線が記号と区別できない。
# 記号のまわり(192px四方)に彩色(茶色の等高線・青の水部)がほとんどない図幅は対象外にする
MONO_HALF = 96
MIN_COLOR_FRACTION = 0.002
# 水部だけ青く、等高線は黒のままの図幅もある。まわりの黒い画素が多すぎる(等高線が黒い)候補も捨てる
MAX_DARK_FRACTION = 0.21


def templates(prefix, kind, crop=False):
    ts = [DATA[k] for k in DATA.files if k.startswith(f"{prefix}_{kind}_")]
    return [t[1:13, 1:13] for t in ts] if crop else ts


BASE = {k: templates("base", k) for k in BASE_THR}
POS = {k: templates("pos", k, crop=True) for k in BASE_THR}
NEG = {k: templates("neg", k, crop=True) for k in BASE_THR}


def ink(img):
    """黒インク以外を白に飛ばしたグレースケール"""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    g[hsv[:, :, 1] >= 90] = 255
    return g


def tile_range(s, w, n, e):
    count = 2**Z

    def xy(lat, lon):
        r = math.radians(lat)
        return int((lon + 180) / 360 * count), int((1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * count)

    x0, y0 = xy(n, w)
    x1, y1 = xy(s, e)
    return x0, x1, y0, y1


def pixel_to_latlon(px, py):
    count = 2**Z * 256
    lon = px / count * 360 - 180
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * py / count))))
    return lat, lon


class Tiles:
    def __init__(self, dataset, era, cache):
        self.dataset, self.era = dataset, era
        self.cache = Path(cache) / f"{dataset}-{era}"
        self.cache.mkdir(parents=True, exist_ok=True)
        self.fetched = 0

    def get(self, x, y):
        f = self.cache / f"{x}-{y}.png"
        miss = self.cache / f"{x}-{y}.none"
        if miss.exists():
            return None
        if not f.exists():
            url = f"https://ktgis.net/kjmapw/kjtilemap/{self.dataset}/{self.era}/{Z}/{x}/{2**Z - 1 - y}.png"
            # Python 標準の urllib は環境によって証明書の検証で失敗するため curl を使う
            for attempt in range(3):
                r = subprocess.run(
                    ["curl", "-s", "-A", UA, "-o", str(f), "-w", "%{http_code}", url], capture_output=True, text=True
                )
                if r.stdout == "200":
                    break
                f.unlink(missing_ok=True)
                if r.stdout == "404":  # 図化範囲外(海上など)
                    miss.touch()
                    return None
                time.sleep(2 * (attempt + 1))
            self.fetched += 1
            time.sleep(0.1)
        return cv2.imread(str(f), cv2.IMREAD_COLOR) if f.exists() else None


def best_match(region, exs):
    s = -1.0
    for e in exs:
        if e.std() >= 1:
            s = max(s, float(cv2.matchTemplate(region, e, cv2.TM_CCOEFF_NORMED).max()))
    return s


def window_mean(mask, x, y):
    win = mask[max(0, y - MONO_HALF) : y + MONO_HALF, max(0, x - MONO_HALF) : x + MONO_HALF]
    return float(win.mean()) if win.size else 0.0


def detect_block(img):
    """ブロック画像の中の記号を [(kind, x, y, score)] で返す"""
    g = ink(img)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    sat = hsv[:, :, 1] >= 90
    dark = hsv[:, :, 2] < 100
    found = []
    pad = cv2.copyMakeBorder(g, 12, 12, 12, 12, cv2.BORDER_CONSTANT, value=255)
    for kind, ts in BASE.items():
        r = None
        for t in ts:
            m = cv2.matchTemplate(g, t, cv2.TM_CCOEFF_NORMED)
            r = m if r is None else np.maximum(r, m)
        ys, xs = np.where(r >= BASE_THR[kind])
        cands = sorted(((float(r[y, x]), x + 7, y + 7) for y, x in zip(ys, xs)), reverse=True)
        taken = []
        for s, x, y in cands:
            if any((x - tx) ** 2 + (y - ty) ** 2 <= 100 for _, tx, ty in taken):
                continue
            taken.append((s, x, y))
            region = pad[y + 12 - 8 : y + 12 + 8, x + 12 - 8 : x + 12 + 8]
            p = best_match(region, POS[kind])
            n = best_match(region, NEG[kind])
            if (
                p >= ACCEPT_THR[kind]
                and p > n + MARGIN_OVER_NEG
                and window_mean(sat, x, y) >= MIN_COLOR_FRACTION
                and window_mean(dark, x, y) <= MAX_DARK_FRACTION
            ):
                found.append((kind, x, y, round(p, 3)))
    # 同じ場所に卍と鳥居の両方が反応したら、正例との一致度が高い方を残す
    found.sort(key=lambda h: -h[3])
    out = []
    for h in found:
        if all((h[1] - o[1]) ** 2 + (h[2] - o[2]) ** 2 > 64 for o in out):
            out.append(h)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--bbox", required=True, help="south,west,north,east")
    ap.add_argument("--dataset", default="kanto")
    ap.add_argument("--era", default="02", help="今昔マップの時期フォルダ(関東: 02 = 1972〜1982年)")
    ap.add_argument("--cache", default=".tile-cache")
    ap.add_argument("--out", default="old-map-symbols.json")
    ap.add_argument("--workers", type=int, default=3, help="タイル取得の同時接続数")
    a = ap.parse_args()
    s, w, n, e = map(float, a.bbox.split(","))
    x0, x1, y0, y1 = tile_range(s, w, n, e)
    tiles = Tiles(a.dataset, a.era, a.cache)
    blank = np.full((256, 256, 3), 255, np.uint8)
    results = []
    blocks = [(bx, by) for by in range(y0, y1 + 1, BLOCK) for bx in range(x0, x1 + 1, BLOCK)]
    print(f"{(x1 - x0 + 1) * (y1 - y0 + 1)} tiles in {len(blocks)} blocks", flush=True)
    # 先にタイルをまとめて取得しておく(照合は後段で1ブロックずつ)
    coords = [(x, y) for y in range(y0, y1 + 1) for x in range(x0, x1 + 1)]
    with ThreadPoolExecutor(max_workers=a.workers) as pool:
        for k, _ in enumerate(pool.map(lambda c: tiles.get(*c) is not None, coords)):
            if (k + 1) % 1000 == 0:
                print(f"  prefetched {k + 1}/{len(coords)} ({tiles.fetched} downloaded)", flush=True)
    for i, (bx, by) in enumerate(blocks):
        # ブロックの外周1枚ぶんも読み込み、MARGIN px だけ重ねて切り出す
        grid = []
        empty = True
        for ty in range(by - 1, by + BLOCK + 1):
            row = []
            for tx in range(bx - 1, bx + BLOCK + 1):
                inside = bx <= tx < bx + BLOCK and by <= ty < by + BLOCK and tx <= x1 and ty <= y1
                img = tiles.get(tx, ty) if inside or (x0 <= tx <= x1 and y0 <= ty <= y1) else None
                if img is not None and inside:
                    empty = False
                row.append(img if img is not None else blank)
            grid.append(np.hstack(row))
        if empty:
            continue
        big = np.vstack(grid)
        off = 256 - MARGIN
        crop = big[off : off + BLOCK * 256 + 2 * MARGIN, off : off + BLOCK * 256 + 2 * MARGIN]
        for kind, x, y, p in detect_block(crop):
            if not (MARGIN <= x < MARGIN + BLOCK * 256 and MARGIN <= y < MARGIN + BLOCK * 256):
                continue  # 重なり部分は隣のブロックで数える
            gx = bx * 256 + x - MARGIN
            gy = by * 256 + y - MARGIN
            lat, lon = pixel_to_latlon(gx + 0.5, gy + 0.5)
            results.append({"kind": kind, "lat": round(lat, 6), "lon": round(lon, 6), "match": p})
        print(f"  block {i + 1}/{len(blocks)}: {len(results)} symbols, {tiles.fetched} tiles fetched", flush=True)
    meta = {"dataset": a.dataset, "era": a.era, "zoom": Z, "bbox": [s, w, n, e], "symbols": results}
    Path(a.out).write_text(json.dumps(meta, ensure_ascii=False) + "\n")
    print(f"wrote {len(results)} symbols to {a.out}")


if __name__ == "__main__":
    main()
