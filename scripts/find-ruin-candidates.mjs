// 廃墟アーカイブ: 廃集落の「候補」を機械的に拾うスクリプト。
// 地理院ベクトルタイル(現行の地図)で、集落名(小字)の注記があるのに周囲に建物が1棟もない
// 地点を探す。集落がなくなっても地名の注記は地図に残りやすい、という性質を利用している。
//
//   node scripts/find-ruin-candidates.mjs --bbox=35.62,138.82,36.05,139.25 [--radius=200] [--out=candidates.json]
//
// 出力はページ(/ruins)の候補リストの「JSONを読み込む」でそのまま取り込める形式。
// 機械的な抽出なので、「もともと集落ではない地名」や「家屋が注記から離れている」ものが多く混ざる
// (2026-09 の試行では7地域で45件 → 目視で残ったのは8件)。必ず新旧比較マップで確かめてから登録する。
// 大字(annoCtg 210)の注記は広い範囲の中央に置かれるだけなので対象にしない。

import { writeFileSync } from "node:fs";
import { VectorTile } from "@mapbox/vector-tile";
import Pbf from "pbf";

const UA = "haikyo-archive-candidate-script/0.1";
const Z = 15; // 建物が省略されずに入る最小のズーム
const SETTLEMENT_LABEL = 220; // 注記分類: 小字・集落名

const arg = (name, fallback) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const bboxArg = arg("bbox");
if (!bboxArg) {
  console.error("usage: node scripts/find-ruin-candidates.mjs --bbox=south,west,north,east [--radius=200] [--out=file.json]");
  process.exit(1);
}
const [S, W, N, E] = bboxArg.split(",").map(Number);
const RADIUS = Number(arg("radius", "200"));
const OUT = arg("out", "ruin-candidates.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lon2x = (lon) => ((lon + 180) / 360) * 2 ** Z;
const lat2y = (lat) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** Z;
};
const meters = (lat, lon1, lat1, lon2, lat2) =>
  Math.hypot((lon2 - lon1) * 111320 * Math.cos((lat * Math.PI) / 180), (lat2 - lat1) * 110540);

async function tile(x, y) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/${Z}/${x}/${y}.pbf`, {
        headers: { "User-Agent": UA },
      });
      if (res.status === 404) return null;
      if (res.ok) return new VectorTile(new Pbf(new Uint8Array(await res.arrayBuffer())));
    } catch {}
    await sleep(1000 * (attempt + 1));
  }
  return null;
}

// ---------------------------------------------------------------------------
// 1. 範囲内のタイルから集落名の注記と建物の重心を集める
// ---------------------------------------------------------------------------

const jobs = [];
for (let x = Math.floor(lon2x(W)); x <= Math.floor(lon2x(E)); x++)
  for (let y = Math.floor(lat2y(N)); y <= Math.floor(lat2y(S)); y++) jobs.push([x, y]);
console.error(`${jobs.length} tiles`);

const labels = [];
const buildings = [];
let done = 0;
async function worker() {
  while (jobs.length) {
    const [x, y] = jobs.shift();
    const t = await tile(x, y);
    if (++done % 200 === 0) console.error(`  ${done} tiles`);
    if (!t) continue;
    const lab = t.layers.label;
    for (let i = 0; i < (lab?.length ?? 0); i++) {
      const f = lab.feature(i);
      if (f.properties.annoCtg !== SETTLEMENT_LABEL) continue;
      const g = f.toGeoJSON(x, y, Z).geometry;
      if (g.type === "Point") labels.push({ name: f.properties.knj, lon: g.coordinates[0], lat: g.coordinates[1] });
    }
    const b = t.layers.building;
    for (let i = 0; i < (b?.length ?? 0); i++) {
      const g = b.feature(i).toGeoJSON(x, y, Z).geometry;
      const ring = g.type === "Polygon" ? g.coordinates[0] : g.type === "MultiPolygon" ? g.coordinates[0][0] : null;
      if (!ring) continue;
      const [sx, sy] = ring.reduce(([a, c], [lo, la]) => [a + lo, c + la], [0, 0]);
      buildings.push([sx / ring.length, sy / ring.length]);
    }
    await sleep(80);
  }
}
// 国土地理院のタイル配信に負荷をかけすぎないよう、同時接続は3本まで
await Promise.all([worker(), worker(), worker()]);

// ---------------------------------------------------------------------------
// 2. 注記から半径 RADIUS m 以内に建物がないものを候補にする
// ---------------------------------------------------------------------------

const CELL = 0.005;
const grid = new Map();
for (const p of buildings) {
  const k = `${Math.floor(p[0] / CELL)},${Math.floor(p[1] / CELL)}`;
  if (!grid.has(k)) grid.set(k, []);
  grid.get(k).push(p);
}
function nearestBuilding(lon, lat) {
  let best = Number.POSITIVE_INFINITY;
  const cx = Math.floor(lon / CELL);
  const cy = Math.floor(lat / CELL);
  for (let dx = -2; dx <= 2; dx++)
    for (let dy = -2; dy <= 2; dy++)
      for (const [lo, la] of grid.get(`${cx + dx},${cy + dy}`) ?? []) best = Math.min(best, meters(lat, lon, lat, lo, la));
  return best;
}

const seen = new Set();
const hits = [];
for (const l of labels) {
  const key = `${l.name}@${l.lon.toFixed(3)},${l.lat.toFixed(3)}`;
  if (seen.has(key)) continue; // タイル境界で同じ注記が重複する
  seen.add(key);
  const d = nearestBuilding(l.lon, l.lat);
  if (d > RADIUS) hits.push({ ...l, d });
}
console.error(`${seen.size} settlement labels, ${buildings.length} buildings → ${hits.length} candidates`);

// ---------------------------------------------------------------------------
// 3. 市区町村・大字を付けて、ページの候補リスト形式で書き出す
// ---------------------------------------------------------------------------

const muniJs = await (await fetch("https://maps.gsi.go.jp/js/muni.js", { headers: { "User-Agent": UA } })).text();
const muni = Object.fromEntries(
  [...muniJs.matchAll(/MUNI_ARRAY\["(\d+)"\]\s*=\s*'(\d+),([^,]+),(\d+),([^']+)'/g)].map((m) => [
    m[1].padStart(5, "0"),
    [Number(m[2]), m[5].replace(/　/g, "")],
  ]),
);
const today = new Date().toISOString().slice(0, 10);
const round = (x) => Math.round(x * 1e6) / 1e6;
const out = [];
for (const h of hits.sort((a, b) => b.d - a.d)) {
  const res = await fetch(`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${h.lat}&lon=${h.lon}`);
  const r = res.ok ? (await res.json()).results : null;
  const m = r ? muni[r.muniCd.padStart(5, "0")] : null;
  const far = Number.isFinite(h.d) ? `最寄りの建物まで約${Math.round(h.d)}m` : "半径1km以上建物なし";
  out.push({
    id: `vt-${round(h.lat)}-${round(h.lon)}`,
    name: `${h.name}(${r?.lv01Nm && r.lv01Nm !== "－" ? r.lv01Nm : "候補"})`,
    category: "village",
    lat: round(h.lat),
    lon: round(h.lon),
    precision: "area",
    pref: m?.[0] ?? 0,
    municipality: m?.[1],
    locality: r?.lv01Nm && r.lv01Nm !== "－" ? r.lv01Nm : undefined,
    discovery: "comparison",
    check: "none",
    status: "unknown",
    evidence: [],
    note: `現行の地図に集落名「${h.name}」の注記があるが、半径${RADIUS}m以内に建物がない(${far})。新旧比較で要確認。`,
    sources: [{ label: "地理院ベクトルタイル(現行の集落名注記と建物)" }],
    addedAt: today,
  });
  console.log(`${h.name}\t${m?.[1] ?? ""}\t${round(h.lat)},${round(h.lon)}\t${far}`);
  await sleep(150);
}
writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);
console.error(`wrote ${out.length} candidates to ${OUT}`);
