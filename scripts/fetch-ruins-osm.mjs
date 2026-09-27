// 廃墟アーカイブ: 首都圏(1都7県)の「既存情報」シードを OpenStreetMap から生成する変換スクリプト。
// 出力は data/ruinsOsm.json と data/gsiMuni.json(ビルド時にネットワークは不要)。
//
//   node scripts/fetch-ruins-osm.mjs
//   node scripts/fetch-ruins-osm.mjs --input=保存済みのOverpass応答.json [--input=…]
//
// 公開 Overpass サーバーが混雑して時間切れになる場合は、Overpass Turbo 等で取得した
// 応答 JSON(out center tags)を --input で渡すと、問い合わせを省いて同じ処理を行う。
// 取得元:
// - Overpass API: 首都圏を覆う矩形(4分割)内で、廃集落・廃寺社・廃墟を示すタグを持つ要素
//   (行政界 area での絞り込みは公開サーバーで時間切れになりやすいため使わない)
// - 国土地理院 逆ジオコーダー(LonLatToAddress): 各地点の市区町村コードと大字名。
//   ここで得た都道府県で 1都7県 以外(長野・静岡・福島など矩形のはみ出し)を落とす
// - 国土地理院 muni.js: 市区町村コード → 名称の対応表(ページ側のクリック地点の逆引きでも使う)
//
// OSM のデータは ODbL(© OpenStreetMap contributors)。data/ruinsOsm.json はその派生
// データベースなので、同じく ODbL で提供する(ページのフッターに明記)。
// 城跡・古墳・史跡の碑など「跡地の記念物」は廃墟アーカイブの対象外として除外し、
// 名称のない建物(building=ruins のみ)は私有の廃屋である可能性が高いため取り込まない。

import { readFileSync, writeFileSync } from "node:fs";

const UA = "haikyo-archive-data-script/0.1 (static reference site build step)";
const OUT = new URL("../data/ruinsOsm.json", import.meta.url);
const MUNI_OUT = new URL("../data/gsiMuni.json", import.meta.url);
// 本家が混雑していることが多いため、応答の速いミラーから順に試す
const ENDPOINTS = [
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

// 首都圏整備法の「首都圏」= 1都7県(JIS コード)
const METRO_PREFS = new Set([8, 9, 10, 11, 12, 13, 14, 19]);
// 1都7県を覆う矩形 [south, west, north, east] を4分割して問い合わせる
const BBOXES = [
  [34.85, 138.15, 36.0, 139.55],
  [34.85, 139.55, 36.0, 140.9],
  [36.0, 138.15, 37.2, 139.55],
  [36.0, 139.55, 37.2, 140.9],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function overpass(query) {
  for (const endpoint of ENDPOINTS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ data: query }),
          signal: AbortSignal.timeout(200_000),
        });
        const text = await res.text();
        if (res.ok && text.startsWith("{")) return JSON.parse(text);
        console.warn(`  ${endpoint}: ${res.status} ${text.slice(0, 80).replace(/\s+/g, " ")}`);
      } catch (e) {
        console.warn(`  ${endpoint}: ${e.message}`);
      }
      await sleep(5000);
    }
  }
  throw new Error("all Overpass endpoints failed");
}

// relation まで含めて center を求めると公開サーバーで 504 になりやすいため、node と way に限る
function bboxQuery([south, west, north, east]) {
  const b = `(${south},${west},${north},${east})`;
  const filters = [
    '["abandoned:place"]',
    '["place"]["abandoned"="yes"]',
    '["disused:amenity"="place_of_worship"]',
    '["abandoned:amenity"="place_of_worship"]',
    '["abandoned:building"]',
    '["building"="ruins"]["name"]',
    '["historic"="ruins"]["name"]',
    '["ruins"]["name"]',
    '["abandoned"="yes"]["building"]["name"]',
    '["disused:tourism"]["name"]',
    '["disused:amenity"="school"]["name"]',
  ];
  const sel = filters.flatMap((f) => [`node${f}${b}`, `way${f}${b}`]);
  return `[out:json][timeout:170];(${sel.join(";")};);out center tags;`;
}

// ---------------------------------------------------------------------------
// 分類: 廃集落(village) / 廃寺(temple) / 廃神社(shrine) / 廃墟(haikyo)。対象外は null
// ---------------------------------------------------------------------------

// 跡地の記念物・遺跡・土木遺構など、廃墟アーカイブの対象外
const EXCLUDE_NAME = /城|砦|天守|館跡|古墳|遺跡|貝塚|一里塚|見附|本陣|刑場|井戸|用水|土手|樋管|門樋|発祥|塚$|碑$|空き家/;
// 個人宅の敷地内にあると注記されたものは載せない
const PRIVATE_NOTE = /民家|個人宅|私有地|敷地内/;
const EXCLUDE_HISTORIC = new Set(["castle", "archaeological_site", "memorial", "sluice", "Sluice", "tomb", "boundary_stone"]);
const EXCLUDE_RUINS = new Set(["castle", "fort", "tree", "no", "bridge", "廃橋"]);
// historic=ruins / ruins=yes のうち、建物として残るものだけを拾うための名称パターン
const BUILDING_NAME =
  /駅|学校|分校|分教場|幼稚園|ホテル|旅館|国民宿舎|館|工場|鉱|坑|選炭|砲台|砲座|観測所|兵舎|送信所|病院|ビル|宿舎|寮|会館|山荘|小屋|施設|倉庫|発電所|ドライブイン|レストラン|ウエスタン|パーク|ランド|遊園/;
const TEMPLE_NAME = /寺|院|堂|庵|坊|観音|地蔵|不動/;
const SHRINE_NAME = /神社|宮|社|稲荷|権現|明神|八幡|祠/;

function classify(t) {
  const name = t.name ?? "";
  if (name && EXCLUDE_NAME.test(name)) return null;
  if (PRIVATE_NOTE.test(`${t.note ?? ""}${t["note:ja"] ?? ""}${t.description ?? ""}`)) return null;
  if (EXCLUDE_HISTORIC.has(t.historic)) return null;
  if (EXCLUDE_RUINS.has(t.ruins)) return null;

  if (t["abandoned:place"] || (t.place && t.abandoned === "yes") || t.historic === "abandoned_village") {
    return { category: "village", kind: t["abandoned:place"] === "hamlet" || t.place === "hamlet" ? "小集落" : "集落" };
  }

  const worship =
    t["disused:amenity"] === "place_of_worship" ||
    t["abandoned:amenity"] === "place_of_worship" ||
    t["was:amenity"] === "place_of_worship";
  const ab = t["abandoned:building"];
  if (worship || ab === "temple" || ab === "shrine" || t.ruins === "temple" || t.ruins === "shrine") {
    if (t.religion === "buddhist" || ab === "temple" || t.ruins === "temple") return { category: "temple", kind: "寺院" };
    if (t.religion === "shinto" || ab === "shrine" || t.ruins === "shrine") return { category: "shrine", kind: "神社" };
    if (t.religion === "christian") return { category: "haikyo", kind: "教会" };
    if (SHRINE_NAME.test(name)) return { category: "shrine", kind: "神社" };
    if (TEMPLE_NAME.test(name)) return { category: "temple", kind: "寺院・堂" };
    return null;
  }

  // 「旧〇〇村跡」は廃村そのものの印。「〜寺跡」「〜神社跡」「〜奥社跡」のような跡地は廃寺社として扱う
  // (「日輪寺幼稚園跡」のように施設名に寺名を含むものは廃墟側で拾う)
  if (t.historic === "ruins" && /^旧.+村跡?$/.test(name)) return { category: "village", kind: "廃村" };
  if (t.historic === "ruins" && name && !/学校|幼稚園|病院|駅/.test(name)) {
    if (/神社|奥社|宮|稲荷|権現|八幡/.test(name)) return { category: "shrine", kind: "神社跡" };
    if (/寺|堂|庵/.test(name) || (/院/.test(name) && !/病院/.test(name))) return { category: "temple", kind: "寺院・堂跡" };
  }

  if (!name) return null;
  const kind = haikyoKind(t, name);
  const buildingLike =
    t.building === "ruins" ||
    ["building", "house", "hotel", "station", "industrial", "military", "school", "mine"].includes(t.ruins) ||
    (t.abandoned === "yes" && t.building) ||
    t["disused:tourism"] ||
    t["abandoned:tourism"] ||
    t["disused:amenity"] === "school" ||
    t["abandoned:amenity"] === "school" ||
    ab ||
    t.historic === "bunker" ||
    t.historic === "observation_post" ||
    BUILDING_NAME.test(name);
  return buildingLike ? { category: "haikyo", kind } : null;
}

function haikyoKind(t, name) {
  if (t.ruins === "station" || /駅/.test(name)) return "駅・鉄道施設";
  if (/学校|分校|分教場|幼稚園/.test(name) || /school/.test(t["disused:amenity"] ?? "")) return "学校";
  if (
    t["disused:tourism"] ||
    t["abandoned:tourism"] ||
    /ホテル|旅館|国民宿舎|山荘|ドライブイン|ウエスタン|パーク|ランド|遊園/.test(name)
  )
    return "宿泊・観光施設";
  if (
    t.historic === "bunker" ||
    t.historic === "observation_post" ||
    t.ruins === "military" ||
    /砲台|砲座|観測所|兵舎|陸軍|海軍/.test(name)
  )
    return "軍事遺構";
  if (t.ruins === "mine" || t.industrial === "mine" || /鉱|坑|選炭|工場|発電所/.test(name)) return "鉱山・産業施設";
  return "建物";
}

// ---------------------------------------------------------------------------
// 国土地理院: 市区町村コード表と逆ジオコーディング
// ---------------------------------------------------------------------------

async function fetchMuni() {
  const res = await fetch("https://maps.gsi.go.jp/js/muni.js", { headers: { "User-Agent": UA } });
  const js = await res.text();
  const muni = {};
  for (const m of js.matchAll(/MUNI_ARRAY\["(\d+)"\]\s*=\s*'(\d+),([^,]+),(\d+),([^']+)'/g)) {
    // 「西多摩郡　奥多摩町」「札幌市　中央区」の全角スペースは表示用に詰める
    muni[m[1].padStart(5, "0")] = [Number(m[2]), m[3], m[5].replace(/　/g, "")];
  }
  return muni;
}

async function reverseGeocode(lat, lon) {
  const url = `https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${lat}&lon=${lon}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.ok) {
        const body = await res.json();
        return body.results ?? null;
      }
    } catch {}
    await sleep(1000 * (attempt + 1));
  }
  return null;
}

// ---------------------------------------------------------------------------

const round = (x) => Math.round(x * 1e6) / 1e6;

const muni = await fetchMuni();
writeFileSync(MUNI_OUT, `${JSON.stringify(muni)}\n`);
console.log(`gsiMuni.json: ${Object.keys(muni).length} municipalities`);

const inputs = process.argv.filter((a) => a.startsWith("--input=")).map((a) => a.slice("--input=".length));
const responses = inputs.length
  ? inputs.map((file) => async () => {
      console.log(`reading ${file} ...`);
      return JSON.parse(readFileSync(file, "utf8"));
    })
  : BBOXES.map((bbox) => async () => {
      console.log(`fetching ${bbox.join(",")} ...`);
      const data = await overpass(bboxQuery(bbox));
      await sleep(3000);
      return data;
    });

const items = [];
const seen = new Set();
let osmBase = "";
for (const load of responses) {
  const data = await load();
  osmBase = data.osm3s?.timestamp_osm_base ?? osmBase;
  let kept = 0;
  for (const e of data.elements) {
    const id = `${e.type}/${e.id}`;
    if (seen.has(id)) continue;
    const t = e.tags ?? {};
    const c = classify(t);
    if (!c) continue;
    const lat = e.lat ?? e.center?.lat;
    const lon = e.lon ?? e.center?.lon;
    if (lat == null || lon == null) continue;
    seen.add(id);
    kept++;
    items.push({
      id: `osm-${e.type[0]}${e.id}`,
      osm: id,
      name: t.name ?? `名称不明の${{ village: "廃集落", temple: "廃寺", shrine: "廃神社", haikyo: "廃墟" }[c.category]}`,
      category: c.category,
      kind: c.kind,
      lat: round(lat),
      lon: round(lon),
      pref: 0,
      note: t["note:ja"] ?? t.note ?? t.description ?? undefined,
      endDate: t.end_date ?? t["abandoned:date"] ?? t["disused:date"] ?? undefined,
      wikipedia: t.wikipedia?.startsWith("ja:") ? t.wikipedia.slice(3) : undefined,
    });
  }
  console.log(`  ${data.elements.length} elements → kept ${kept}`);
}

console.log(`reverse geocoding ${items.length} points ...`);
for (const it of items) {
  const r = await reverseGeocode(it.lat, it.lon);
  const m = r ? muni[r.muniCd.padStart(5, "0")] : undefined;
  if (m) {
    it.pref = m[0];
    it.municipality = m[2];
    if (r.lv01Nm && r.lv01Nm !== "－") it.locality = r.lv01Nm;
  }
  await sleep(150);
}
const metroItems = items.filter((it) => METRO_PREFS.has(it.pref));
console.log(`  in 1都7県: ${metroItems.length} / ${items.length}`);

metroItems.sort((a, b) => a.pref - b.pref || a.category.localeCompare(b.category) || a.name.localeCompare(b.name, "ja"));
const out = {
  source: "OpenStreetMap (© OpenStreetMap contributors, ODbL) / 市区町村名: 国土地理院 逆ジオコーダー",
  osmTimestamp: osmBase,
  items: metroItems,
};
writeFileSync(OUT, `${JSON.stringify(out, null, 1)}\n`);
const byCat = Object.groupBy(metroItems, (i) => i.category);
console.log(
  `ruinsOsm.json: ${metroItems.length} items`,
  Object.fromEntries(Object.entries(byCat).map(([k, v]) => [k, v.length])),
);
