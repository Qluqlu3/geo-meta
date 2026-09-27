// 廃墟アーカイブ(首都圏と静岡県): 廃墟・廃集落・廃寺・廃神社を緯度経度で記録するデータベース。
// 地域見分けメタ(電柱・路面標示・道路標識)とは目的が異なる独立したセクションで、
// 「2010年より前の地図・空中写真には写っているのに、今の地図では森や更地に埋もれて
// 情報がない場所」を新旧比較で掘り起こして残すことを主眼にしている。
//
// - curatedRuins: 新旧比較や文献で本アーカイブが独自に記録した地点(ここを手で編集する)
// - ruinsOsm.json: OpenStreetMap に登録済みの地点(scripts/fetch-ruins-osm.mjs で生成、ODbL)
// - ruinsOldMapSymbols.json: 旧版地形図にあって現行の地図から消えた寺社記号の地点
//   (scripts/detect-old-map-symbols.py → scripts/find-vanished-shrines.mjs で生成。自動検出で未確認)
// 住所は廃集落・山中の寺社では特定しづらいため、位置は世界測地系(WGS84)の緯度経度を
// 小数6桁(約10cm単位)で持ち、市区町村・大字は国土地理院の逆ジオコーダーによる参考表示に留める。
// 詳しい調査手順・出典は RESEARCH_ruins.md を参照。

import oldMap from "./ruinsOldMapSymbols.json";
import osm from "./ruinsOsm.json";

// ---------------------------------------------------------------------------
// 分類
// ---------------------------------------------------------------------------

export type RuinCategory = "haikyo" | "village" | "temple" | "shrine";

// マーカーの色は地図タイル(航空写真・地形図)の上に載るため、ページのライト/ダークでは
// 切り替えない(globals.css の --rn-* を参照)。色覚多様性に配慮して形も併用する。
export const ruinCategoryInfo: Record<RuinCategory, { label: string; colorVar: string; shape: MarkerShape; desc: string }> = {
  haikyo: {
    label: "廃墟",
    colorVar: "--rn-haikyo",
    shape: "square",
    desc: "放棄された建物・施設。ホテル・学校・駅舎・鉱山施設・軍事遺構など。",
  },
  village: {
    label: "廃集落",
    colorVar: "--rn-village",
    shape: "circle",
    desc: "住民がいなくなった集落。家屋が残る場所から、石垣や段々畑の跡だけが森に残る場所まで。",
  },
  temple: {
    label: "廃寺",
    colorVar: "--rn-temple",
    shape: "diamond",
    desc: "無住・廃絶した寺院やお堂。本堂が残るもの、礎石や墓地だけが残るものを含む。",
  },
  shrine: {
    label: "廃神社",
    colorVar: "--rn-shrine",
    shape: "triangle",
    desc: "祭祀が途絶えた、または合祀で移された神社・祠。石段や鳥居だけが残る例が多い。",
  },
};

export type MarkerShape = "circle" | "square" | "diamond" | "triangle";

/** 情報の出どころ */
export type Discovery = "comparison" | "symbol" | "literature" | "osm";
export const discoveryLabel: Record<Discovery, string> = {
  comparison: "新旧比較で発見",
  symbol: "旧版地形図の記号から検出",
  literature: "文献・記事",
  osm: "OSM登録済み",
};

/** 本アーカイブ側でどこまで確かめたか */
export type Check = "field" | "desk" | "none";
export const checkLabel: Record<Check, string> = {
  field: "現地確認済み",
  desk: "机上確認(新旧比較)",
  none: "未確認",
};

/** 現在の状態 */
export type RuinStatus = "remains" | "traces" | "gone" | "unknown";
export const statusLabel: Record<RuinStatus, string> = {
  remains: "建物が残る",
  traces: "石垣・石段などの痕跡のみ",
  gone: "撤去・消失",
  unknown: "不明",
};

// ---------------------------------------------------------------------------
// 都県(首都圏整備法の「首都圏」= 1都7県に、隣接する静岡県を加える。JISコード)
// ---------------------------------------------------------------------------

export const METRO_PREFS: { code: number; name: string; core: boolean }[] = [
  { code: 13, name: "東京都", core: true },
  { code: 14, name: "神奈川県", core: true },
  { code: 11, name: "埼玉県", core: true },
  { code: 12, name: "千葉県", core: true },
  { code: 8, name: "茨城県", core: false },
  { code: 9, name: "栃木県", core: false },
  { code: 10, name: "群馬県", core: false },
  { code: 19, name: "山梨県", core: false },
  { code: 22, name: "静岡県", core: false },
];
export const prefNameOf = new Map(METRO_PREFS.map((p) => [p.code, p.name]));

/** 首都圏と静岡県東部が収まる初期表示範囲 [南西, 北東] */
export const METRO_BOUNDS: [[number, number], [number, number]] = [
  [34.6, 138.1],
  [37.15, 140.9],
];

// ---------------------------------------------------------------------------
// 比較レイヤー(地図タイル)
// ---------------------------------------------------------------------------

export type TileSource = "gsi" | "konjaku";

export type MapLayer = {
  id: string;
  label: string;
  group: string;
  url: string;
  source: TileSource;
  minZoom?: number;
  maxNativeZoom: number;
  /** 今昔マップは TMS(タイル原点が南西)なので y を反転する */
  tms?: boolean;
  /** 撮影・測量年の目安(2010年より前かの判定と表示に使う) */
  years?: string;
  coverage: string;
};

const gsi = (id: string, ext: "png" | "jpg") => `https://cyberjapandata.gsi.go.jp/xyz/${id}/{z}/{x}/{y}.${ext}`;
const konjaku = (dataset: string, era: string) => `https://ktgis.net/kjmapw/kjtilemap/${dataset}/${era}/{z}/{x}/{y}.png`;

/** 現在側(スワイプの右側) */
export const CURRENT_LAYERS: MapLayer[] = [
  {
    id: "seamlessphoto",
    label: "最新の空中写真",
    group: "現在",
    url: gsi("seamlessphoto", "jpg"),
    source: "gsi",
    maxNativeZoom: 18,
    coverage: "全国。撮影年は場所により異なる(おおむね直近数年)",
  },
  {
    id: "std",
    label: "標準地図",
    group: "現在",
    url: gsi("std", "png"),
    source: "gsi",
    maxNativeZoom: 18,
    coverage: "全国。建物・寺社記号・集落名の現状確認に",
  },
];

/** 過去側(スワイプの左側)。すべて2010年より前 */
export const PAST_LAYERS: MapLayer[] = [
  {
    id: "gazo1",
    label: "空中写真 1974〜1978年",
    group: "空中写真(国土地理院)",
    url: gsi("gazo1", "jpg"),
    source: "gsi",
    minZoom: 10,
    maxNativeZoom: 17,
    years: "1974〜1978",
    coverage: "首都圏の山間部まで広く撮影されたカラー写真。比較の基準にする年代",
  },
  {
    id: "ort_old10",
    label: "空中写真 1961〜1969年",
    group: "空中写真(国土地理院)",
    url: gsi("ort_old10", "png"),
    source: "gsi",
    maxNativeZoom: 17,
    years: "1961〜1969",
    coverage: "モノクロ。平野部・丘陵中心で、奥多摩・秩父の奥は欠ける",
  },
  {
    id: "ort_USA10",
    label: "空中写真 1945〜1950年(米軍)",
    group: "空中写真(国土地理院)",
    url: gsi("ort_USA10", "png"),
    source: "gsi",
    maxNativeZoom: 17,
    years: "1945〜1950",
    coverage: "モノクロ。整備済みの範囲は限られる",
  },
  {
    id: "gazo2",
    label: "空中写真 1979〜1983年",
    group: "空中写真(国土地理院)",
    url: gsi("gazo2", "jpg"),
    source: "gsi",
    minZoom: 10,
    maxNativeZoom: 17,
    years: "1979〜1983",
    coverage: "主に市街地周辺。山間部は欠けることが多い",
  },
  {
    id: "gazo3",
    label: "空中写真 1984〜1986年",
    group: "空中写真(国土地理院)",
    url: gsi("gazo3", "jpg"),
    source: "gsi",
    minZoom: 10,
    maxNativeZoom: 17,
    years: "1984〜1986",
    coverage: "主に市街地周辺",
  },
  {
    id: "gazo4",
    label: "空中写真 1987〜1990年",
    group: "空中写真(国土地理院)",
    url: gsi("gazo4", "jpg"),
    source: "gsi",
    minZoom: 10,
    maxNativeZoom: 17,
    years: "1987〜1990",
    coverage: "主に市街地周辺",
  },
  {
    id: "nendophoto2008",
    label: "空中写真 2008年",
    group: "空中写真(国土地理院)",
    url: gsi("nendophoto2008", "png"),
    source: "gsi",
    minZoom: 14,
    maxNativeZoom: 18,
    years: "2008",
    coverage: "撮影範囲がまだら。ズーム14以上で表示",
  },
  {
    id: "kanto-01",
    label: "旧版地形図 関東 1928〜1945年",
    group: "旧版地形図(今昔マップ)",
    url: konjaku("kanto", "01"),
    source: "konjaku",
    tms: true,
    minZoom: 8,
    maxNativeZoom: 15,
    years: "1928〜1945",
    coverage: "関東全域と山梨県・静岡県の大井川以東(秩父・群馬・房総・伊豆を含む)。寺社記号(卍・鳥居)と集落の家屋が描かれる",
  },
  {
    id: "kanto-02",
    label: "旧版地形図 関東 1972〜1982年",
    group: "旧版地形図(今昔マップ)",
    url: konjaku("kanto", "02"),
    source: "konjaku",
    tms: true,
    minZoom: 8,
    maxNativeZoom: 15,
    years: "1972〜1982",
    coverage:
      "関東全域と山梨県・静岡県の大井川以東。空中写真 1974〜78年と同じ時代の地図記号で確認できる。寺社記号の自動検出にも使っている",
  },
  {
    id: "kanto-03",
    label: "旧版地形図 関東 1988〜2008年",
    group: "旧版地形図(今昔マップ)",
    url: konjaku("kanto", "03"),
    source: "konjaku",
    tms: true,
    minZoom: 8,
    maxNativeZoom: 15,
    years: "1988〜2008",
    coverage: "関東全域と山梨県・静岡県の大井川以東。消えた時期を絞り込むための中間の年代",
  },
  {
    id: "kanto-00",
    label: "旧版地形図 関東 1894〜1915年",
    group: "旧版地形図(今昔マップ)",
    url: konjaku("kanto", "00"),
    source: "konjaku",
    tms: true,
    minZoom: 8,
    maxNativeZoom: 15,
    years: "1894〜1915",
    coverage: "関東全域と山梨県・静岡県の大井川以東。明治期の集落・寺社の分布",
  },
  {
    id: "tokyo50-03",
    label: "旧版地形図 首都圏 1965〜1968年",
    group: "旧版地形図(今昔マップ)",
    url: konjaku("tokyo50", "03"),
    source: "konjaku",
    tms: true,
    minZoom: 8,
    maxNativeZoom: 15,
    years: "1965〜1968",
    coverage: "都心からおおむね50km圏(八王子・飯能・厚木まで。秩父・奥多摩の奥は範囲外)",
  },
  {
    id: "tokyo50-05",
    label: "旧版地形図 首都圏 1983〜1987年",
    group: "旧版地形図(今昔マップ)",
    url: konjaku("tokyo50", "05"),
    source: "konjaku",
    tms: true,
    minZoom: 8,
    maxNativeZoom: 15,
    years: "1983〜1987",
    coverage: "都心からおおむね50km圏",
  },
  {
    id: "tokyo50-07",
    label: "旧版地形図 首都圏 1998〜2005年",
    group: "旧版地形図(今昔マップ)",
    url: konjaku("tokyo50", "07"),
    source: "konjaku",
    tms: true,
    minZoom: 8,
    maxNativeZoom: 15,
    years: "1998〜2005",
    coverage: "都心からおおむね50km圏",
  },
];

export const pastLayerById = new Map(PAST_LAYERS.map((l) => [l.id, l]));

// ---------------------------------------------------------------------------
// データ本体
// ---------------------------------------------------------------------------

/** 新旧比較の根拠: どの年代の地図・写真で何が見え、今はどうなっているか */
export type Evidence = {
  /** PAST_LAYERS の id */
  past: string;
  pastNote: string;
  nowNote: string;
};

export type Ruin = {
  id: string;
  name: string;
  category: RuinCategory;
  /** 細分類(ホテル・学校・小集落など) */
  kind?: string;
  /** WGS84 緯度経度(小数6桁) */
  lat: number;
  lon: number;
  /** point = 建物・社殿そのものの位置 / area = 集落などの範囲のおおよその中心 / symbol = 旧版地形図上の記号の位置 */
  precision: "point" | "area" | "symbol";
  /** 都県の JIS コード */
  pref: number;
  municipality?: string;
  /** 大字(国土地理院 逆ジオコーダーによる参考値) */
  locality?: string;
  /** 標高(m、国土地理院 標高API) */
  elevation?: number;
  discovery: Discovery;
  check: Check;
  status: RuinStatus;
  /** 放棄・消失の推定時期 */
  abandoned?: string;
  evidence?: Evidence[];
  note?: string;
  sources: { label: string; url?: string }[];
  /** 記録日(YYYY-MM-DD) */
  addedAt?: string;
  /** OpenStreetMap の要素("node/123" など)。同じ要素の OSM 由来レコードはこちらで置き換える */
  osm?: string;
};

// 2026-09-27 の試行: 地理院ベクトルタイル(現行)で「集落名(小字)の注記はあるのに半径200m以内に
// 建物がない」地点を首都圏の山間部7地域から機械的に拾い、旧版地形図 1972〜82年・空中写真
// 1974〜78年・最新写真を並べて目視で確かめたもの。座標は集落名注記の位置で、家屋跡そのものでは
// ないため precision は "area"。1988〜2008年版の地形図では8件とも家屋記号がまだ描かれていた。
const COMPARISON_SOURCES: Ruin["sources"] = [
  { label: "国土地理院 空中写真 1974〜1978年・最新写真(地理院タイル)" },
  { label: "今昔マップ on the web 関東 1972〜1982年・1988〜2008年" },
  { label: "地理院ベクトルタイル(現行の集落名注記と建物)" },
];
const AFTER_MID = "1988〜2008年版の地形図以降(それまでは家屋記号あり)";

/**
 * 本アーカイブが独自に記録した地点。ページの「候補リスト」から書き出した JSON を
 * この配列に貼り付け、根拠(evidence)と確認状況(check)を埋めてから追加する。
 */
export const curatedRuins: Ruin[] = [
  {
    id: "cmp-hanno-yamanaka",
    name: "山中(上名栗)",
    category: "village",
    kind: "山間の小集落",
    lat: 35.92539,
    lon: 139.12591,
    precision: "area",
    pref: 11,
    municipality: "飯能市",
    locality: "大字上名栗",
    elevation: 592,
    discovery: "comparison",
    check: "desk",
    status: "unknown",
    abandoned: AFTER_MID,
    evidence: [
      {
        past: "kanto-02",
        pastNote: "「山中」の注記と、道沿いに家屋記号が数戸",
        nowNote: "現行の地図に集落名は残るが、半径1km以内に建物がない",
      },
      { past: "gazo1", pastNote: "道沿いに畑とみられる開けた土地が点在", nowNote: "一帯が森林に覆われ、屋根は確認できない" },
    ],
    sources: COMPARISON_SOURCES,
    addedAt: "2026-09-27",
  },
  {
    id: "cmp-ogano-takazasu",
    name: "高指(両神小森)",
    category: "village",
    kind: "山間の小集落",
    lat: 35.98918,
    lon: 138.94185,
    precision: "area",
    pref: 11,
    municipality: "小鹿野町",
    locality: "両神小森",
    elevation: 648,
    discovery: "comparison",
    check: "desk",
    status: "unknown",
    abandoned: AFTER_MID,
    evidence: [
      { past: "kanto-02", pastNote: "「高指」の注記と家屋記号1戸、山道", nowNote: "集落名は残るが、半径約500m以内に建物がない" },
      { past: "gazo1", pastNote: "斜面に畑地とみられる明るい区画が点在", nowNote: "ほぼ森林。小さな空き地がわずかに残る" },
    ],
    sources: COMPARISON_SOURCES,
    addedAt: "2026-09-27",
  },
  {
    id: "cmp-uenomura-oodaira",
    name: "大平(楢原)",
    category: "village",
    kind: "山上の小集落",
    lat: 36.10982,
    lon: 138.73667,
    precision: "area",
    pref: 10,
    municipality: "上野村",
    locality: "大字楢原",
    elevation: 1106,
    discovery: "comparison",
    check: "desk",
    status: "unknown",
    abandoned: AFTER_MID,
    evidence: [
      { past: "kanto-02", pastNote: "「大平」の注記と家屋記号2〜3戸", nowNote: "集落名は残るが、半径約600m以内に建物がない" },
      { past: "gazo1", pastNote: "段々畑と家屋が写る", nowNote: "森林と伐採跡地・作業道。家屋は見えない" },
    ],
    note: "標高約1,100mの尾根上にある山上集落の跡の候補。",
    sources: COMPARISON_SOURCES,
    addedAt: "2026-09-27",
  },
  {
    id: "cmp-minamiboso-minakura",
    name: "皆倉(珠師ケ谷)",
    category: "village",
    kind: "谷あいの小集落",
    lat: 35.06307,
    lon: 139.98196,
    precision: "area",
    pref: 12,
    municipality: "南房総市",
    locality: "珠師ケ谷",
    elevation: 230,
    discovery: "comparison",
    check: "desk",
    status: "unknown",
    abandoned: AFTER_MID,
    evidence: [
      { past: "kanto-02", pastNote: "「皆倉」の注記、家屋記号と水田記号", nowNote: "集落名は残るが、半径約450m以内に建物がない" },
      { past: "gazo1", pastNote: "谷あいに棚田と家屋がはっきり写る", nowNote: "棚田の跡を含め一面の森林" },
    ],
    sources: COMPARISON_SOURCES,
    addedAt: "2026-09-27",
  },
  {
    id: "cmp-hitachiota-tenryuin",
    name: "天竜院(折橋町)",
    category: "village",
    kind: "谷あいの小集落",
    lat: 36.7495,
    lon: 140.5487,
    precision: "area",
    pref: 8,
    municipality: "常陸太田市",
    locality: "折橋町",
    elevation: 582,
    discovery: "comparison",
    check: "desk",
    status: "unknown",
    abandoned: AFTER_MID,
    evidence: [
      { past: "kanto-02", pastNote: "道路沿いに家屋記号数戸と水田記号", nowNote: "集落名は残るが、半径約400m以内に建物がない" },
      {
        past: "gazo1",
        pastNote: "谷沿いに家屋と水田がはっきり写る",
        nowNote: "水田跡は藪・森林になり、屋根は確認できない(写真の継ぎ目にかかる)",
      },
    ],
    note: "地名の「院」から、かつて寺院(院号の堂)があった可能性もある。廃寺の手がかりとしても要調査。",
    sources: COMPARISON_SOURCES,
    addedAt: "2026-09-27",
  },
  {
    id: "cmp-hitachiota-nameshiiri",
    name: "行石入(小妻町)",
    category: "village",
    kind: "小集落",
    lat: 36.78528,
    lon: 140.50379,
    precision: "area",
    pref: 8,
    municipality: "常陸太田市",
    locality: "小妻町",
    elevation: 531,
    discovery: "comparison",
    check: "desk",
    status: "gone",
    abandoned: AFTER_MID,
    evidence: [
      { past: "kanto-02", pastNote: "川沿いの道路脇に家屋記号2戸", nowNote: "集落名は残るが、半径1km以上建物がない" },
      { past: "gazo1", pastNote: "家屋と畑が写る", nowNote: "裸地と新しい道路からなる大規模な造成地に変わっている" },
    ],
    note: "造成(開発事業)に伴って消えた可能性が高い。事業の内容は未確認。",
    sources: COMPARISON_SOURCES,
    addedAt: "2026-09-27",
  },
  {
    id: "cmp-nikko-hitotsuishi",
    name: "一ッ石(西川)",
    category: "village",
    kind: "水没集落",
    lat: 36.94219,
    lon: 139.62863,
    precision: "area",
    pref: 9,
    municipality: "日光市",
    locality: "西川",
    elevation: 687,
    discovery: "comparison",
    check: "desk",
    status: "gone",
    abandoned: AFTER_MID,
    evidence: [
      { past: "kanto-02", pastNote: "川沿いの道路に家屋記号が並ぶ", nowNote: "集落名だけが残る" },
      { past: "gazo1", pastNote: "道沿いの家屋と畑", nowNote: "ダム湖の水面と湖岸、付け替えられた道路と橋" },
    ],
    note: "湯西川ダム(日光市西川)の湛水域に入ったとみられる(ダム名は未確認)。水没のため現地に痕跡は期待できない。",
    sources: COMPARISON_SOURCES,
    addedAt: "2026-09-27",
  },
  {
    id: "cmp-kanuma-kajimata",
    name: "梶又(上南摩町)",
    category: "village",
    kind: "移転集落",
    lat: 36.56039,
    lon: 139.64397,
    precision: "area",
    pref: 9,
    municipality: "鹿沼市",
    locality: "上南摩町",
    elevation: 213,
    discovery: "comparison",
    check: "desk",
    status: "gone",
    abandoned: AFTER_MID,
    evidence: [
      { past: "kanto-02", pastNote: "道路沿いに家屋記号が並ぶ集落", nowNote: "集落名だけが残る" },
      { past: "gazo1", pastNote: "谷沿いの家屋と田畑", nowNote: "大規模な造成地と新しい道路。家屋は見えない" },
    ],
    note: "南摩ダム(思川開発事業、鹿沼市上南摩町)の建設地に当たるとみられる(未確認)。",
    sources: COMPARISON_SOURCES,
    addedAt: "2026-09-27",
  },
];

type OsmItem = {
  id: string;
  osm: string;
  name: string;
  category: RuinCategory;
  kind?: string;
  lat: number;
  lon: number;
  pref: number;
  municipality?: string;
  locality?: string;
  note?: string;
  endDate?: string;
  wikipedia?: string;
};

export const osmSource = osm.source;
export const osmTimestamp = osm.osmTimestamp;

const osmRuins: Ruin[] = (osm.items as OsmItem[]).map((o) => ({
  id: o.id,
  name: o.name,
  category: o.category,
  kind: o.kind,
  lat: o.lat,
  lon: o.lon,
  precision: o.category === "village" ? "area" : "point",
  pref: o.pref,
  municipality: o.municipality,
  locality: o.locality,
  discovery: "osm",
  check: "none",
  status: "unknown",
  abandoned: o.endDate,
  note: o.note,
  osm: o.osm,
  sources: [
    { label: `OpenStreetMap ${o.osm}`, url: `https://www.openstreetmap.org/${o.osm}` },
    ...(o.wikipedia ? [{ label: `Wikipedia「${o.wikipedia}」`, url: `https://ja.wikipedia.org/wiki/${o.wikipedia}` }] : []),
  ],
}));

type OldMapSymbol = {
  id: string;
  kind: "shrine" | "temple";
  lat: number;
  lon: number;
  pref: number;
  municipality: string;
  locality?: string;
  elevation?: number;
  match: number;
  nearestSameM: number | null;
};

export const oldMapSymbolSource = oldMap.source;
export const oldMapSymbolCount = oldMap.oldSymbols;

const KIND_LABEL = { shrine: "神社", temple: "寺院" } as const;
const SYMBOL_LABEL = { shrine: "鳥居", temple: "卍" } as const;

const oldMapRuins: Ruin[] = (oldMap.items as OldMapSymbol[]).map((o) => ({
  id: o.id,
  name: `旧図の${KIND_LABEL[o.kind]}(${o.locality ?? o.municipality})`,
  category: o.kind,
  kind: "旧版地形図にのみ記号",
  lat: o.lat,
  lon: o.lon,
  precision: "symbol",
  pref: o.pref,
  municipality: o.municipality,
  locality: o.locality,
  elevation: o.elevation,
  discovery: "symbol",
  check: "none",
  status: "unknown",
  evidence: [
    {
      past: oldMap.past,
      pastNote: `${KIND_LABEL[o.kind]}の記号(${SYMBOL_LABEL[o.kind]})がある`,
      nowNote: `現行の地理院地図では半径${oldMap.radius}m以内に${KIND_LABEL[o.kind]}の記号・名称がない(${
        o.nearestSameM == null ? "近くに同種の記号なし" : `最寄りの同種の記号まで約${o.nearestSameM}m`
      })`,
    },
  ],
  note: "旧版地形図の記号を画像照合で自動検出した地点。廃絶のほか、合祀・移転や、現行の地図で小さな社寺が省略されている可能性がある。位置は旧図の記号の位置で、数十mずれることがある。",
  sources: [
    { label: "今昔マップ on the web 関東 1972〜1982年(記号の自動検出)" },
    { label: "地理院ベクトルタイル(現行の寺社記号・名称の注記)" },
  ],
  addedAt: oldMap.generatedAt,
}));

const curatedOsmIds = new Set(curatedRuins.flatMap((r) => (r.osm ? [r.osm] : [])));
const namedRuins = [...curatedRuins, ...osmRuins.filter((r) => !curatedOsmIds.has(r.osm ?? "") && prefNameOf.has(r.pref))];
// 自動検出の地点のうち、同じ分類の登録済みレコードが近くにあるものは重複として外す
const nearNamed = (r: Ruin) =>
  namedRuins.some(
    (n) =>
      n.category === r.category &&
      Math.hypot((n.lat - r.lat) * 111000, (n.lon - r.lon) * 111000 * Math.cos((r.lat * Math.PI) / 180)) < 150,
  );

/** 全レコード。独自記録 → OSM → 旧版地形図の記号の順。同じ OSM 要素の重複は独自記録を優先 */
export const ruins: Ruin[] = [...namedRuins, ...oldMapRuins.filter((r) => prefNameOf.has(r.pref) && !nearNamed(r))];
