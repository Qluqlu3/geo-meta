// 一般国道(1〜507号)の「番号 → 通過都道府県」データを日本語版Wikipediaから生成する
// 一度きりの変換スクリプト。出力は data/nationalRoutes.json(ビルド時にはネットワーク不要)。
//
//   node scripts/fetch-national-routes.mjs
//
// 取得元:
// - 「日本の一般国道一覧」: 路線番号・起点/終点の市区町村コード(JIS)・実延長
// - 各路線の記事「国道N号」: 制定年(Infobox)、起点/終点の座標(Infobox の {{Coord}})、
//   「通過する自治体」節の都道府県(* 行)と北海道の振興局(** 行)
// 路線の起終点・経過地は「一般国道の路線を指定する政令」(e-Gov)に基づく事実情報だが、
// 通過都道府県の列挙はWikipedia記事の記述に依存するため、出典としてWikipediaを明記する。

import { writeFileSync } from "node:fs";

const API = "https://ja.wikipedia.org/w/api.php";
const UA = "denchu-meta-zukan-data-script/0.1 (static reference site build step)";
const OUT = new URL("../data/nationalRoutes.json", import.meta.url);

const PREFS = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];
const prefCode = (name) => PREFS.indexOf(name) + 1;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: "json", formatversion: "2", ...params })}`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return res.json();
    if (res.status !== 429 || attempt >= 5) throw new Error(`${res.status} ${url}`);
    await sleep(Number(res.headers.get("retry-after")) * 1000 || 5000 * (attempt + 1));
  }
}

// "[[北海道]][[札幌市]][[中央区 (札幌市)|中央区]]" → "北海道札幌市中央区"
function plainPlace(wiki) {
  return wiki.replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, "$1");
}

// {{Coord|43|11|42.4|N|140|59|45.6|E|...}} / {{Coord|43.19|N|140.99|E}} → [lat, lon]
function parseCoord(field) {
  const m = field?.match(/\{\{Coord\|([^}]*)\}\}/i);
  if (!m) return null;
  const parts = m[1].split("|").map((s) => s.trim());
  const ns = parts.findIndex((p) => p === "N" || p === "S");
  const ew = parts.findIndex((p) => p === "E" || p === "W");
  if (ns < 0 || ew < 0) return null;
  const dms = (arr) => arr.reduce((acc, v, i) => acc + Number(v) / 60 ** i, 0);
  const lat = dms(parts.slice(0, ns));
  const lon = dms(parts.slice(ns + 1, ew));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return [Math.round(lat * 100) / 100, Math.round(lon * 100) / 100];
}

function infoboxField(text, key) {
  const m = text.match(new RegExp(`^\\|\\s*${key}\\s*=(.*)$`, "m"));
  return m ? m[1].trim() : undefined;
}

// 「通過する自治体」節から、* 行の都道府県と ** 行の北海道振興局を順に拾う
function parsePassing(text) {
  const m = text.match(/==+\s*通過する?(?:自治体|市町村)\s*==+([\s\S]*?)(?:\n==|$)/);
  if (!m) return null;
  const prefs = [];
  const hokkaido = [];
  for (const line of m[1].split("\n")) {
    const top = line.match(/^\*\s*(?:\[\[)?([^\]|\s（(]+)/);
    if (top && PREFS.includes(top[1])) {
      if (!prefs.includes(top[1])) prefs.push(top[1]);
      continue;
    }
    const sub = line.match(/^\*\*\s*(?:\[\[)?([^\]|\s]+?(?:総合)?振興局)/);
    if (sub && prefs.at(-1) === "北海道") {
      const short = sub[1].replace(/(総合)?振興局$/, "");
      if (!hokkaido.includes(short)) hokkaido.push(short);
    }
  }
  return prefs.length ? { prefs, hokkaido } : null;
}

async function main() {
  const list = await api({ action: "parse", prop: "wikitext", page: "日本の一般国道一覧", redirects: "1" });
  const items = [];
  for (const m of list.parse.wikitext.matchAll(/\{\{日本の一般国道一覧\/item\|([^\n]*)\}\}/g)) {
    const f = m[1].split("|");
    // item|番号|起点コード|起点|終点コード|終点|総延長|実延長|...
    // 起点・終点の表記は [[..|..]] を含むので、コード列の位置から再結合する
    const raw = m[1];
    const cells = [];
    let depth = 0;
    let cur = "";
    for (const ch of raw) {
      if (ch === "[") depth++;
      if (ch === "]") depth--;
      if (ch === "|" && depth === 0) {
        cells.push(cur);
        cur = "";
      } else cur += ch;
    }
    cells.push(cur);
    const n = Number(cells[0]);
    if (!Number.isInteger(n) || f.length < 6) continue;
    items.push({
      n,
      fromCode: Number(cells[1]),
      from: plainPlace(cells[2]),
      toCode: Number(cells[3]),
      to: plainPlace(cells[4]),
      km: Number(cells[6]) || Number(cells[5]) || null,
    });
  }
  console.error(`list: ${items.length} routes`);

  const byTitle = new Map(items.map((it) => [`国道${it.n}号`, it]));
  const titles = [...byTitle.keys()];
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50);
    // 本文つきの複数記事取得は1回の応答に収まらないことがあるので continue を辿る
    const pages = [];
    const redirectTo = new Map();
    let cont = {};
    do {
      const res = await api({
        action: "query",
        prop: "revisions",
        rvprop: "content",
        rvslots: "main",
        redirects: "1",
        titles: batch.join("|"),
        ...cont,
      });
      for (const r of res.query.redirects ?? []) redirectTo.set(r.to, r.from);
      pages.push(...res.query.pages.filter((p) => p.revisions));
      cont = res.continue ?? null;
      await sleep(1500);
    } while (cont);
    for (const page of pages) {
      const title = redirectTo.get(page.title) ?? page.title;
      const it = byTitle.get(title);
      const text = page.revisions?.[0]?.slots?.main?.content;
      if (!it || !text) {
        console.error(`missing article: ${page.title}`);
        continue;
      }
      const year = infoboxField(text, "制定年")?.match(/(\d{4})年/)?.[1];
      it.year = year ? Number(year) : null;
      it.fromLatLon = parseCoord(infoboxField(text, "起点"));
      it.toLatLon = parseCoord(infoboxField(text, "終点"));
      const passing = parsePassing(text);
      it.passing = passing;
    }
  }

  const routes = items.map((it) => {
    // 「通過する自治体」節が無い/解析できない記事は、起点・終点コードの都道府県で代用
    const fallback = [...new Set([Math.floor(it.fromCode / 1000), Math.floor(it.toCode / 1000)])];
    const prefs = it.passing ? it.passing.prefs.map(prefCode) : fallback;
    const route = {
      n: it.n,
      year: it.year ?? null,
      from: it.from,
      to: it.to,
      prefs,
      km: it.km,
    };
    if (!it.passing) route.prefsFromEndpointsOnly = true;
    if (it.passing?.hokkaido.length) route.hokkaido = it.passing.hokkaido;
    if (it.fromLatLon) route.a = it.fromLatLon;
    if (it.toLatLon) route.b = it.toLatLon;
    return route;
  });

  const fallbacks = routes.filter((r) => r.prefsFromEndpointsOnly).map((r) => r.n);
  const noYear = routes.filter((r) => !r.year).map((r) => r.n);
  const noCoord = routes.filter((r) => !r.a && !r.b).map((r) => r.n);
  console.error(`prefs from endpoints only: ${fallbacks.join(",") || "none"}`);
  console.error(`no year: ${noYear.join(",") || "none"}`);
  console.error(`no coords: ${noCoord.join(",") || "none"}`);

  const body = routes.map((r) => `    ${JSON.stringify(r)}`).join(",\n");
  writeFileSync(
    OUT,
    `{\n  "source": "日本語版Wikipedia「日本の一般国道一覧」および各路線記事(${new Date().toISOString().slice(0, 10)}取得)",\n  "routes": [\n${body}\n  ]\n}\n`,
  );
  console.error(`wrote ${routes.length} routes → ${OUT.pathname}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
