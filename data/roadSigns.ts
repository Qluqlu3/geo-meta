// 道路標識メタ: 電柱メタ・路面標示メタと同じ方針で「ポール設置の標識板・信号機」の
// 地域差を整理したデータ。路面に直接ペイントされたもの(止まれの字体・ダイヤマーク等)は
// data/roadMarkings.ts を参照。詳しい調査経緯は RESEARCH_road-signs.md を参照。

export type { Confidence } from "./roadMarkings";
export { confidenceLabel } from "./roadMarkings";

// ---------------------------------------------------------------------------
// 信号機の縦型/横型(都道府県別・47都道府県ぶん)
// 出典: note「道路標識マニア」、中日新聞の長野県内取材ほか。積雪による着雪負荷を
// 避けるため、日本海側・豪雪地帯で縦型が標準という説。個別に確認できたのは
// 一部県のみで、それ以外は「全国的なデフォルトである横型」と仮定して表示している。
// ---------------------------------------------------------------------------

export type SignalOrientation = "vertical" | "mixed" | "horizontal";

export const signalOrientationInfo: Record<SignalOrientation, { label: string; colorVar: string; desc: string }> = {
  vertical: {
    label: "縦型が標準",
    colorVar: "--rs-vertical",
    desc: "積雪による着雪負荷を避けるため、灯器が縦に並ぶ「縦型」が標準の地域。",
  },
  mixed: {
    label: "縦型・横型が混在",
    colorVar: "--rs-mixed",
    desc: "県内でも山間部・日本海側は縦型、平野部・太平洋側は横型というように混在する地域。",
  },
  horizontal: {
    label: "横型が標準(全国デフォルト)",
    colorVar: "--rs-horizontal",
    desc: "積雪の少ない太平洋側を中心に、灯器が横に並ぶ「横型」が標準の地域。個別未確認の県はこの区分にしている。",
  },
};

export const signalOrientationPrefectures: { nameJa: string; type: SignalOrientation }[] = [
  { nameJa: "北海道", type: "vertical" },
  { nameJa: "青森県", type: "mixed" },
  { nameJa: "岩手県", type: "horizontal" },
  { nameJa: "宮城県", type: "horizontal" },
  { nameJa: "秋田県", type: "vertical" },
  { nameJa: "山形県", type: "vertical" },
  { nameJa: "福島県", type: "mixed" },
  { nameJa: "茨城県", type: "horizontal" },
  { nameJa: "栃木県", type: "horizontal" },
  { nameJa: "群馬県", type: "horizontal" },
  { nameJa: "埼玉県", type: "horizontal" },
  { nameJa: "千葉県", type: "horizontal" },
  { nameJa: "東京都", type: "horizontal" },
  { nameJa: "神奈川県", type: "horizontal" },
  { nameJa: "新潟県", type: "vertical" },
  { nameJa: "富山県", type: "vertical" },
  { nameJa: "石川県", type: "horizontal" },
  { nameJa: "福井県", type: "horizontal" },
  { nameJa: "山梨県", type: "horizontal" },
  { nameJa: "長野県", type: "mixed" },
  { nameJa: "岐阜県", type: "mixed" },
  { nameJa: "静岡県", type: "horizontal" },
  { nameJa: "愛知県", type: "horizontal" },
  { nameJa: "三重県", type: "horizontal" },
  { nameJa: "滋賀県", type: "horizontal" },
  { nameJa: "京都府", type: "horizontal" },
  { nameJa: "大阪府", type: "horizontal" },
  { nameJa: "兵庫県", type: "horizontal" },
  { nameJa: "奈良県", type: "horizontal" },
  { nameJa: "和歌山県", type: "horizontal" },
  { nameJa: "鳥取県", type: "horizontal" },
  { nameJa: "島根県", type: "horizontal" },
  { nameJa: "岡山県", type: "horizontal" },
  { nameJa: "広島県", type: "horizontal" },
  { nameJa: "山口県", type: "horizontal" },
  { nameJa: "徳島県", type: "horizontal" },
  { nameJa: "香川県", type: "horizontal" },
  { nameJa: "愛媛県", type: "horizontal" },
  { nameJa: "高知県", type: "horizontal" },
  { nameJa: "福岡県", type: "horizontal" },
  { nameJa: "佐賀県", type: "horizontal" },
  { nameJa: "長崎県", type: "horizontal" },
  { nameJa: "熊本県", type: "horizontal" },
  { nameJa: "大分県", type: "horizontal" },
  { nameJa: "宮崎県", type: "horizontal" },
  { nameJa: "鹿児島県", type: "horizontal" },
  { nameJa: "沖縄県", type: "horizontal" },
];

export const signalOrientationByPrefecture = new Map(signalOrientationPrefectures.map((p) => [p.nameJa, p.type]));

export const signalOrientationSources = [
  { label: "note「道路標識マニア」縦型信号機", url: "https://note.com/roadsign/n/nd97552f78d21" },
  { label: "中日新聞(長野県内取材)", url: "https://www.chunichi.co.jp/article/409294" },
];

// ---------------------------------------------------------------------------
// 信号機のその他の強いネタ(電柱メタの「ウインカー促進標示」に相当するカード群)
// ---------------------------------------------------------------------------

export type SignalSpotlight = {
  id: string;
  icon: "no-hood" | "flash";
  title: string;
  areas: string[];
  confidence: import("./roadMarkings").Confidence;
  summary: string;
  points: { k: string; v: string }[];
  note: string;
  sources: { label: string; url: string }[];
};

export const signalSpotlights: SignalSpotlight[] = [
  {
    id: "no-hood",
    icon: "no-hood",
    title: "庇(ひさし)なし薄型信号機・東京都の特殊性",
    areas: ["大阪府(発祥)", "千葉県", "岐阜県高山市", "富山県富山市", "東京都(長らく例外)"],
    confidence: "likely",
    summary:
      "2017年、警察庁が車両用灯器を「表示面直径300mm→250mm」に縮小し、庇のない薄型(フラット型)灯器を規格化。全国第一号は2017年6月、大阪市鶴見区。",
    points: [
      { k: "発祥", v: "2017年6月22日、大阪市鶴見区の交差点に全国第一号が設置。" },
      { k: "導入が進む地域", v: "千葉県(船橋市・市川市)、岐阜県高山市、富山県富山市など。" },
      {
        k: "東京都の特殊性",
        v: "警視庁管内独自の規格「警管仕」を採用し、かつ全国最速でLED化を終えたため薄型化のメリットが薄く、フラット型信号機は**2025年9月に西東京市で初めて設置**されたばかり。それまでは庇付きの旧型(300mm)がほぼ100%だった。",
      },
    ],
    note: "「関西=庇なし標準」は正確には「大阪発祥で西日本中心に普及が進行中」という段階的な現象。関西全域で完全に統一されているわけではない点に注意。",
    sources: [
      { label: "note「道路標識マニア」庇なし信号機", url: "https://note.com/roadsign/n/nee0ec9502879" },
      { label: "note「道路標識マニア」東京都の独自規格", url: "https://note.com/roadsign/n/n7db32674ed82" },
    ],
  },
  {
    id: "flash-signal",
    icon: "flash",
    title: "一灯点滅式信号機",
    areas: ["福岡県"],
    confidence: "confirmed",
    summary: "黄/赤が交互に点滅するだけの一灯点滅式信号機は、1984年12月に福岡市南区で発祥し、長らく全国最多の設置数を誇った。",
    points: [
      { k: "発祥", v: "1984年12月、福岡市南区。" },
      {
        k: "見た目",
        v: "通常の3灯式ではなく、黄または赤のどちらか1灯だけが点滅する小型の信号機。交通量の少ない交差点に設置される。",
      },
      {
        k: "希少化の傾向",
        v: "全国的に撤去が進行中(2015年度末 約6,000基 → 2024年度末 2,351基)。見つかれば強いヒントだが、経年で出現頻度が下がっていく点に注意。",
      },
    ],
    note: "路面標示メタの「止まれ」字体と同じく、経年で薄れていくタイプのメタ。",
    sources: [{ label: "西日本新聞", url: "https://www.nishinippon.co.jp/item/826920/" }],
  },
];

// ---------------------------------------------------------------------------
// 信号機のLED化率(都道府県別統計、警察庁公式資料ベース)
// ---------------------------------------------------------------------------

export type LedRateRow = { pref: string; vehicle?: number; pedestrian?: number };

export const ledRateNote = {
  title: "信号機のLED化率(都道府県別)",
  average: { vehicle: 80.2, pedestrian: 75.2 },
  summary:
    "警察庁公表の令和6年度末(2025年3月末)時点の統計。積雪地域(北海道・富山・新潟)がむしろLED化率が低い側に偏っているのが意外な点(縦型信号機の採用=気候対策とLED化予算は別軸ということ)。",
  rows: [
    { pref: "北海道", vehicle: 44.7, pedestrian: 43.6 },
    { pref: "富山県", vehicle: 53.1, pedestrian: 44.3 },
    { pref: "広島県", vehicle: 60.6, pedestrian: 49.9 },
    { pref: "新潟県", vehicle: 63.7, pedestrian: 52.3 },
    { pref: "兵庫県", vehicle: 65.5 },
    { pref: "静岡県", vehicle: 67.0 },
    { pref: "福島県", vehicle: 69.3 },
    { pref: "埼玉県", pedestrian: 55.1 },
    { pref: "大阪府", vehicle: 87.4 },
    { pref: "福岡県", vehicle: 99.9, pedestrian: 99.9 },
    { pref: "長崎県", vehicle: 99.7, pedestrian: 99.9 },
    { pref: "沖縄県", vehicle: 98.5, pedestrian: 99.3 },
    { pref: "東京都", vehicle: 100, pedestrian: 100 },
    { pref: "宮城県", vehicle: 100, pedestrian: 100 },
    { pref: "岐阜県", vehicle: 100, pedestrian: 100 },
  ] as LedRateRow[],
  source: {
    label: "警察庁 都道府県別交通信号機ストック数(令和6年度末・PDF)",
    url: "https://www.npa.go.jp/bureau/traffic/seibi2/annzen-shisetu/hyoushiki-shingouki/2025_shingoukistock.pdf",
  },
};

// ---------------------------------------------------------------------------
// 規制標識の「◯◯県公安委員会」補助標識・標識柱シール
// 出典は単一の個人ブログ(GeoGuessrプレイヤーの一次観察)のため信頼度は中程度。
// ---------------------------------------------------------------------------

export type KoanPlate = {
  id: string;
  pref: string;
  title: string;
  colorHex: string;
  textOrientation: "vertical" | "horizontal";
  desc: string;
  tip: string;
};

export const koanPlates: KoanPlate[] = [
  {
    id: "aomori",
    pref: "青森県",
    title: "黒文字・縦書き",
    colorHex: "#1a1a1a",
    textOrientation: "vertical",
    desc: "「青森県公安委員会」を黒文字で縦書き。文字が小さく、遠くからは黒い線のように見える。",
    tip: "単独では地味な部類。他の特徴と併用推奨。",
  },
  {
    id: "miyagi",
    pref: "宮城県",
    title: "青文字・丸い書体",
    colorHex: "#1f6fb2",
    textOrientation: "horizontal",
    desc: "文字が青色で、丸みのある教科書体のようなフォント。他県との違いが遠目にもわかりやすい。",
    tip: "7件の中で最も判別しやすいとされる。",
  },
  {
    id: "fukushima",
    pref: "福島県",
    title: "白地黒文字+「自転車も止まれ」",
    colorHex: "#1a1a1a",
    textOrientation: "horizontal",
    desc: "シール自体は青森県とほぼ同じ白地黒文字だが、一時停止標識に「自転車も止まれ」の補助標識が付くことが多く、これで区別する。",
    tip: "シールの見た目より、併設される別の補助標識で見分けるのがコツ。",
  },
  {
    id: "gunma",
    pref: "群馬県",
    title: "太字・文字間が広い",
    colorHex: "#1a1a1a",
    textOrientation: "horizontal",
    desc: "文字間に隙間がある太字。関東(東京電力管内)でこの表示が目立つのは群馬県だけとされる。",
    tip: "電柱メタ(東京電力管内と判定できている場合)と組み合わせると群馬県だけが該当し確定できる。",
  },
  {
    id: "shiga",
    pref: "滋賀県",
    title: "白地黒文字(シンプル)",
    colorHex: "#1a1a1a",
    textOrientation: "horizontal",
    desc: "白地に黒文字のシンプルな表示。関西電力管内でこの表示が目立つのは滋賀県だけとされる。",
    tip: "電柱メタ(関西電力管内)と組み合わせて確定できる。",
  },
  {
    id: "nagasaki",
    pref: "長崎県",
    title: "白地黒文字・取付位置が高め",
    colorHex: "#1a1a1a",
    textOrientation: "horizontal",
    desc: "白地黒文字だが、シールの取付位置が他県より高い。九州電力管内でこの表示が目立つのは長崎県だけとされる。",
    tip: "電柱メタ(九州電力管内)と組み合わせて確定できる。",
  },
  {
    id: "okinawa",
    pref: "沖縄県",
    title: "シール・文字が小さめ",
    colorHex: "#1a1a1a",
    textOrientation: "horizontal",
    desc: "他県と比べてシールと文字が小さく、識別難度が高い。",
    tip: "沖縄電力管内は他に混同する県がないため、電柱メタ側で先に絞り込める。",
  },
];

export const koanSources = [
  { label: "GeoGuesser 公安委員会シール特徴一覧(ameblo)", url: "https://ameblo.jp/geoguesser-info/entry-12943359190.html" },
];

// ---------------------------------------------------------------------------
// 動物注意警戒標識(黄色ひし形)の絵柄バリエーション
// 「シカ・サル・ウサギ・タヌキ」以外は道路管理者が任意にシルエットを差し替えて
// よい規定になっており、全国で160種類以上のローカルバリエーションがある。
// ---------------------------------------------------------------------------

export type AnimalIconKind = "deer" | "bear" | "stork" | "yanbaru" | "goat";

export type AnimalSign = {
  id: string;
  area: string;
  animal: string;
  iconKind: AnimalIconKind;
  flip?: boolean;
  note: string;
};

export const animalSigns: AnimalSign[] = [
  {
    id: "hokkaido-deer",
    area: "北海道",
    animal: "エゾシカ",
    iconKind: "deer",
    note: "本州のシカ標識とは体形・角の描き方が異なるとされる、北海道の代表的な動物注意標識。",
  },
  {
    id: "hokkaido-bear",
    area: "北海道",
    animal: "ヒグマ",
    iconKind: "bear",
    note: "本州のツキノワグマ版よりもいかつい輪郭で描かれることが多い。",
  },
  {
    id: "nara-deer",
    area: "奈良県(奈良公園周辺)",
    animal: "シカ(角が逆向き)",
    iconKind: "deer",
    flip: true,
    note: "角が国際標準とは逆の「後ろ向き」に県独自でリメイクされている。国交省担当者も「道路管理者の判断で別図柄を設置する例がある」とコメント。",
  },
  {
    id: "hyogo-stork",
    area: "兵庫県",
    animal: "コウノトリ",
    iconKind: "stork",
    note: "2021年から導入。兵庫県豊岡市周辺で進められているコウノトリの野生復帰の取り組みにちなむ。",
  },
  {
    id: "okinawa-yanbaru",
    area: "沖縄県(本島北部)",
    animal: "ヤンバルクイナ",
    iconKind: "yanbaru",
    note: "沖縄本島北部だけに生息する飛べない鳥。本土には存在しない固有種で、一意性が非常に高い。",
  },
  {
    id: "ogasawara-goat",
    area: "東京都小笠原村",
    animal: "ヤギ",
    iconKind: "goat",
    note: "小笠原諸島特有の標識。行政区分としては東京都だが、本土の東京都とはまったく異なる絵柄が見られる。",
  },
];

export const animalSignCaveat =
  "「1県1絵柄」ではなく、同一県内でも道路管理者(国道事務所・都道府県・市町村)ごとに図柄が乱立する場合がある。過度な一般化(「タヌキ標識=関東」等の断定)は誤答リスクがあるため、あくまで代表例として扱うこと。";

export const animalSignSources = [
  { label: "道路標識「動物注意」地域の特色反映(乗りものニュース)", url: "https://trafficnews.jp/post/75949" },
  { label: "160種類以上!? 地方色豊かな動物注意標識(note)", url: "https://note.com/roadsign/n/nb9a5c6a85b6c" },
  { label: "シカ、タヌキ、サル…標識は地域で絵柄が違う(ウォーカープラス)", url: "https://www.walkerplus.com/article/1206019/" },
  { label: "奈良公園のシカ標識(note)", url: "https://note.com/roadsign/n/n7ec43420d37e" },
];

// ---------------------------------------------------------------------------
// チェーン規制標識(2018年新設、全国13区間に限定設置)
// ---------------------------------------------------------------------------

export type ChainSection = { road: string; section: string; prefectures: string[] };

export const chainSections: ChainSection[] = [
  { road: "上信越自動車道", section: "信濃町IC 〜 新井PA", prefectures: ["長野県", "新潟県"] },
  { road: "中央自動車道", section: "須玉IC 〜 長坂IC", prefectures: ["山梨県"] },
  { road: "中央自動車道", section: "飯田山本IC 〜 園原IC", prefectures: ["長野県"] },
  { road: "北陸自動車道", section: "丸岡IC 〜 加賀IC", prefectures: ["福井県", "石川県"] },
  { road: "北陸自動車道", section: "木之本IC 〜 今庄IC", prefectures: ["滋賀県", "福井県"] },
  { road: "米子自動車道", section: "湯原IC 〜 江府IC", prefectures: ["岡山県", "鳥取県"] },
  { road: "浜田自動車道", section: "大朝IC 〜 旭IC", prefectures: ["広島県", "島根県"] },
  { road: "国道112号(月山道路)", section: "月山周辺", prefectures: ["山形県"] },
  { road: "国道138号", section: "籠坂峠周辺", prefectures: ["山梨県", "静岡県"] },
  { road: "国道7号", section: "新潟県内", prefectures: ["新潟県"] },
  { road: "国道8号", section: "福井・石川県内", prefectures: ["福井県", "石川県"] },
  { road: "国道54号", section: "赤名峠", prefectures: ["広島県", "島根県"] },
  { road: "国道56号", section: "鳥坂峠", prefectures: ["愛媛県"] },
];

export const chainSectionsNote =
  "過去に大規模な立ち往生が発生した峠区間に限定して設置されており、全国でこの13区間のみ(2018年12月の命令改正で新設)。設置区間が限られる分、標識が見えれば逆にどの峠かをほぼ一意特定できる。ただし出現頻度自体はかなり低い。";

export const chainSectionsSources = [
  { label: "チェーン規制標識(GAZOO)", url: "https://gazoo.com/ilovecars/useful/19/01/09/" },
  { label: "ウェザーニュース", url: "https://weathernews.jp/s/topics/202012/240255/" },
];

// ---------------------------------------------------------------------------
// 参考程度(採用保留・弱いネタ): 裏付け不足/未開拓/既存の結論と矛盾するなどの
// 理由で主要コンテンツにはしていないが、記録として残しておく事例
// ---------------------------------------------------------------------------

export type ReferenceNote = {
  id: string;
  title: string;
  areas: string[];
  note: string;
  sources: { label: string; url: string }[];
};

export const referenceNotes: ReferenceNote[] = [
  {
    id: "signal-maker",
    title: "灯器メーカー(小糸工業/コイト電工・京三製作所・日本信号)の都道府県相関",
    areas: ["静岡県・長崎県(未検証)"],
    note: "コイト電工(本社: 静岡県)は静岡県・長崎県でシェアが高いという情報があるが、専門図鑑サイトへの直接アクセスができず未検証。電柱プレートのような「都道府県警発注=メーカー固定」の明確な構造は今回確認できなかった。",
    sources: [],
  },
  {
    id: "lens-color",
    title: "信号機のレンズ色合い(青寄り/緑寄り)",
    areas: ["旧型灯器が残る地域全般"],
    note: "都道府県差というより、製造メーカー・製造年代による差が主因という説が優勢。都道府県別の系統だった色差の一次情報は見つからなかった。",
    sources: [{ label: "日本の交通信号機 - Wikipedia", url: "https://ja.wikipedia.org/wiki/日本の交通信号機" }],
  },
  {
    id: "pole-band",
    title: "標識柱(支柱)の帯色",
    areas: ["四国4県", "熊本県以南"],
    note: "四国は黄・赤・黄の3色帯、熊本県以南(九州南部)は赤帯という言及がコミュニティ側にあるが、一次資料への到達はできておらず、独立した裏取りが必要。",
    sources: [],
  },
  {
    id: "delineator",
    title: "視線誘導標(ボラード)の形状・色",
    areas: ["福島県(八角形+黄色帯という言及あり)"],
    note: "路面標示メタ調査時点では「進行方向左=白、右=黄という全国統一基準で、地域差ではなく向きの違い」と結論づけたが、今回「福島県は八角形+黄色帯、他地域は丸型+黒帯」という言及も見つかり、両者の情報が矛盾している可能性がある。要再検証のため採用保留。",
    sources: [],
  },
  {
    id: "kilometer-post",
    title: "キロポスト(距離標)の道路管理者ごとの規格差",
    areas: ["北海道(方角記号付き)", "東京都(独自規格)"],
    note: "道路管理者(国交省地方整備局・都道府県・NEXCO各社)ごとに規格が細分化されていること自体は資料上確認できるが、GeoGuessr日本コミュニティの主要メタ資料ではほぼ言及がなく、文字が小さくStreet View解像度では読み取りづらいことが要因と推測される。理論上は差があるが実戦での活用例に乏しい未開拓領域。",
    sources: [
      { label: "カシムラ 距離標仕様(国道)", url: "https://www.kashimura.com/rd/content/a810-KOKUDO-KP.html" },
      { label: "距離標 - Wikipedia", url: "https://ja.wikipedia.org/wiki/距離標" },
    ],
  },
  {
    id: "city-expressway-code",
    title: "都市高速道路の路線記号(C/L等)",
    areas: ["首都高速・福岡高速(C)", "阪神高速(L)"],
    note: "首都高速・福岡高速は環状線を「C」、阪神高速は「L」と表記するなど会社ごとの差はあるが、都市高速の走行シーン自体の出現頻度が低く、決定力は限定的。",
    sources: [{ label: "国土交通省 高速道路ナンバリング", url: "https://www.mlit.go.jp/road/sign/numbering/about/index.html" }],
  },
  {
    id: "country-sign",
    title: "カントリーサイン(県境・市町村境の観光案内看板)",
    areas: ["全国"],
    note: "都道府県章・市町村章・ご当地マスコットのデザインが自治体単位でバラバラで、見えれば一意特定に近い強さだが、Street Viewが県境をちょうど通過する瞬間しか写り込まないため出現頻度は低い。",
    sources: [
      {
        label: "カントリーサイン - Wikipedia",
        url: "https://ja.wikipedia.org/wiki/%E3%82%AB%E3%83%B3%E3%83%88%E3%83%AA%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%B3",
      },
    ],
  },
  {
    id: "okinawa-signs",
    title: "沖縄県特有の標識事情",
    areas: ["沖縄県"],
    note: "1978年「730」の切替で米統治時代のマイル表示標識は現存しない。米軍基地周辺の英語併記(STOP/SLOW)標識は密度が高いが、他県の観光地にも存在するため確定要素ではない。",
    sources: [{ label: "730(交通) - Wikipedia", url: "https://ja.wikipedia.org/wiki/730_(%E4%BA%A4%E9%80%9A)" }],
  },
];
