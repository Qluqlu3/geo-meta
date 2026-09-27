// 廃墟アーカイブ: 旧版地形図にある寺社記号のうち、現在の地理院地図から消えているものを拾い、
// data/ruinsOldMapSymbols.json を作る。入力は scripts/detect-old-map-symbols.py の出力。
//
//   node scripts/find-vanished-shrines.mjs --in=old-map-symbols.json [--radius=250] [--min-match=0.8]
//
// 「今もある」の判定: 現行の地理院ベクトルタイル(ズーム14)で、半径 --radius m 以内に同じ種類の
// 地図記号(神社 ftCode 3231 / 寺院 3232)か名称の注記(神社名 annoCtg 661 / 寺院名 662)があること。
// 大きな寺社は記号ではなく名称の注記で表されるため、両方を見る。
// 旧版地形図は現在の座標に合わせて変形されているが数十m〜200mほどずれることがあるため、半径は既定で250m。
// 消えた理由(廃絶・合祀・移転・現行図での省略)はこの判定では区別できない。
//
// --min-match: 旧図の記号の一致度(正例との相関)の下限。2026-09 の目視確認では、0.80 以上は検出した
// 記号がすべて本物だったのに対し、0.70〜0.80 は地名の漢字や市街地の建物の並びへの誤検出が半数近く
// あったため、既定では 0.80 以上だけを載せる。

import { readFileSync, writeFileSync } from "node:fs";
import { VectorTile } from "@mapbox/vector-tile";
import Pbf from "pbf";

const UA = "haikyo-archive-symbol-script/0.1";
const Z = 14;
const OUT = new URL("../data/ruinsOldMapSymbols.json", import.meta.url);
const arg = (name, fallback) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const input = JSON.parse(readFileSync(arg("in", "old-map-symbols.json"), "utf8"));
const RADIUS = Number(arg("radius", "250"));
const MIN_MATCH = Number(arg("min-match", "0.8"));
// 首都圏(1都7県)と静岡県
const TARGET_PREFS = new Set([8, 9, 10, 11, 12, 13, 14, 19, 22]);
const CURRENT = {
  shrine: { symbol: 3231, label: 661 },
  temple: { symbol: 3232, label: 662 },
};
const ERA_LAYER = { "kanto-02": "kanto-02" };
const eraId = `${input.dataset}-${input.era}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const meters = (lat1, lon1, lat2, lon2) =>
  Math.hypot((lon2 - lon1) * 111320 * Math.cos((lat1 * Math.PI) / 180), (lat2 - lat1) * 110540);
const tileOf = (lat, lon) => {
  const n = 2 ** Z;
  const r = (lat * Math.PI) / 180;
  return [((lon + 180) / 360) * n, ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n];
};

// ---------------------------------------------------------------------------
// 現行の寺社(記号・注記)をタイル単位で読み込む
// ---------------------------------------------------------------------------

const tileCache = new Map();
async function currentFeatures(x, y) {
  const key = `${x}/${y}`;
  if (tileCache.has(key)) return tileCache.get(key);
  let feats = [];
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/${Z}/${x}/${y}.pbf`, {
        headers: { "User-Agent": UA },
      });
      if (res.status === 404) break;
      if (!res.ok) throw new Error(String(res.status));
      const t = new VectorTile(new Pbf(new Uint8Array(await res.arrayBuffer())));
      for (const [layer, prop] of [
        ["symbol", "ftCode"],
        ["label", "annoCtg"],
      ]) {
        const l = t.layers[layer];
        for (let i = 0; i < (l?.length ?? 0); i++) {
          const f = l.feature(i);
          const code = f.properties[prop];
          const kind = Object.entries(CURRENT).find(([, c]) => c[layer] === code)?.[0];
          if (!kind) continue;
          const g = f.toGeoJSON(x, y, Z).geometry;
          if (g.type === "Point") feats.push({ kind, lon: g.coordinates[0], lat: g.coordinates[1] });
        }
      }
      break;
    } catch {
      feats = [];
      await sleep(1000 * (attempt + 1));
    }
  }
  tileCache.set(key, feats);
  await sleep(50);
  return feats;
}

async function nearestCurrent(sym) {
  // 半径ぶんの広がりを持つタイルをすべて見る
  const d = RADIUS / 111000 + 0.002;
  const [xa, ya] = tileOf(sym.lat + d, sym.lon - d);
  const [xb, yb] = tileOf(sym.lat - d, sym.lon + d);
  let same = Number.POSITIVE_INFINITY;
  for (let x = Math.floor(xa); x <= Math.floor(xb); x++)
    for (let y = Math.floor(ya); y <= Math.floor(yb); y++)
      for (const f of await currentFeatures(x, y)) {
        if (f.kind === sym.kind) same = Math.min(same, meters(sym.lat, sym.lon, f.lat, f.lon));
      }
  return same;
}

// ---------------------------------------------------------------------------

// 旧版地形図の同じ記号がタイル境界などで二重に拾われたものをまとめる
const symbols = [];
for (const s of input.symbols.filter((x) => x.match >= MIN_MATCH).sort((a, b) => b.match - a.match)) {
  if (!symbols.some((o) => o.kind === s.kind && meters(o.lat, o.lon, s.lat, s.lon) < 40)) symbols.push(s);
}
console.error(`${symbols.length} old-map symbols`);

const vanished = [];
let done = 0;
for (const s of symbols) {
  const same = await nearestCurrent(s);
  if (same > RADIUS) vanished.push({ ...s, nearestSameM: Number.isFinite(same) ? Math.round(same) : null });
  if (++done % 200 === 0) console.error(`  ${done}/${symbols.length}, vanished ${vanished.length}`);
}
console.error(`vanished: ${vanished.length}`);

// 市区町村・大字・標高
const muni = JSON.parse(readFileSync(new URL("../data/gsiMuni.json", import.meta.url), "utf8"));
const items = [];
for (const v of vanished) {
  const rg = await fetch(`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${v.lat}&lon=${v.lon}`)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  const m = rg?.results ? muni[rg.results.muniCd.padStart(5, "0")] : undefined;
  if (!m || !TARGET_PREFS.has(m[0])) {
    await sleep(100);
    continue;
  }
  const el = await fetch(
    `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${v.lon}&lat=${v.lat}&outtype=JSON`,
  )
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  const locality = rg.results.lv01Nm && rg.results.lv01Nm !== "－" ? rg.results.lv01Nm : undefined;
  items.push({
    id: `sym-${v.kind[0]}-${v.lat.toFixed(5)}-${v.lon.toFixed(5)}`,
    kind: v.kind,
    lat: v.lat,
    lon: v.lon,
    pref: m[0],
    municipality: m[2],
    locality,
    elevation: typeof el?.elevation === "number" ? Math.round(el.elevation) : undefined,
    match: v.match,
    nearestSameM: v.nearestSameM,
  });
  await sleep(120);
}

items.sort((a, b) => a.pref - b.pref || a.municipality.localeCompare(b.municipality, "ja") || a.lat - b.lat);
const out = {
  source: "今昔マップ on the web(埼玉大学 谷謙二)の旧版地形図から記号を自動検出 / 現状: 地理院ベクトルタイル",
  past: ERA_LAYER[eraId] ?? eraId,
  radius: RADIUS,
  minMatch: MIN_MATCH,
  bbox: input.bbox,
  generatedAt: new Date().toISOString().slice(0, 10),
  oldSymbols: symbols.length,
  items,
};
writeFileSync(OUT, `${JSON.stringify(out, null, 1)}\n`);
const count = (k) => items.filter((i) => i.kind === k).length;
console.error(`wrote ${items.length} (shrine ${count("shrine")}, temple ${count("temple")}) to data/ruinsOldMapSymbols.json`);
