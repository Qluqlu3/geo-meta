// 路面標示メタ: 電柱メタと同じ方針で「道路に直接ペイント・施工されたもの」の地域差を整理したデータ。
// 電柱と違い管理主体が都道府県(公安委員会)単位でバラバラなため、電力会社のような
// きれいな地方区分にはならない。詳細は RESEARCH_road-markings.md を参照。

export type Confidence = "confirmed" | "likely" | "reference";

export const confidenceLabel: Record<Confidence, string> = {
  confirmed: "複数ソースで確認",
  likely: "有力(裏取り一部)",
  reference: "参考程度",
};

// ---------------------------------------------------------------------------
// 「止まれ」路面標示の字体タイプ(都道府県別・47都道府県ぶん)
// 出典: set333.net「道路上の白字『止まれ』、東京タイプが全国統一へ」ほか(単一の
// 個人サイトが根拠のため、他ソースでの裏取りは一部の県のみ。詳細は出典参照)
// ---------------------------------------------------------------------------

export type TomareType = "tokyo" | "osaka" | "nagoya" | "transition" | "hokkaido";

export const tomareTypeInfo: Record<TomareType, { label: string; colorVar: string; desc: string }> = {
  tokyo: {
    label: "東京タイプ",
    colorVar: "--rm-tokyo",
    desc: "「れ」の2画目を省略した簡略字体。全国的に採用が広がっている主流タイプ。",
  },
  osaka: {
    label: "大阪タイプ",
    colorVar: "--rm-osaka",
    desc: "「れ」の1画目(縦棒)と2画目(短い横棒)が離れている字体。関西の一部で現役。",
  },
  nagoya: {
    label: "名古屋(福島)タイプ",
    colorVar: "--rm-nagoya",
    desc: "「れ」の1画目が左寄りで、折り返しが鋭く尖った字体。東京タイプへの切替が進行中。",
  },
  transition: {
    label: "東京タイプへ移行中",
    colorVar: "--rm-transition",
    desc: "従来の字体から東京タイプへの塗り替えが進行中で、新旧が混在している。",
  },
  hokkaido: {
    label: "ほぼ見られない",
    colorVar: "--rm-hokkaido",
    desc: "路面標示の「止まれ」自体がほとんど設置されず、標識板(ポール)のみで対応する例が多い。",
  },
};

export const tomarePrefectures: { nameJa: string; type: TomareType }[] = [
  { nameJa: "北海道", type: "hokkaido" },
  { nameJa: "青森県", type: "tokyo" },
  { nameJa: "岩手県", type: "tokyo" },
  { nameJa: "宮城県", type: "tokyo" },
  { nameJa: "秋田県", type: "tokyo" },
  { nameJa: "山形県", type: "tokyo" },
  { nameJa: "福島県", type: "nagoya" },
  { nameJa: "茨城県", type: "transition" },
  { nameJa: "栃木県", type: "osaka" },
  { nameJa: "群馬県", type: "tokyo" },
  { nameJa: "埼玉県", type: "tokyo" },
  { nameJa: "千葉県", type: "tokyo" },
  { nameJa: "東京都", type: "tokyo" },
  { nameJa: "神奈川県", type: "tokyo" },
  { nameJa: "新潟県", type: "transition" },
  { nameJa: "富山県", type: "tokyo" },
  { nameJa: "石川県", type: "osaka" },
  { nameJa: "福井県", type: "tokyo" },
  { nameJa: "山梨県", type: "tokyo" },
  { nameJa: "長野県", type: "tokyo" },
  { nameJa: "岐阜県", type: "tokyo" },
  { nameJa: "静岡県", type: "tokyo" },
  { nameJa: "愛知県", type: "nagoya" },
  { nameJa: "三重県", type: "tokyo" },
  { nameJa: "滋賀県", type: "osaka" },
  { nameJa: "京都府", type: "tokyo" },
  { nameJa: "大阪府", type: "transition" },
  { nameJa: "兵庫県", type: "osaka" },
  { nameJa: "奈良県", type: "osaka" },
  { nameJa: "和歌山県", type: "osaka" },
  { nameJa: "鳥取県", type: "tokyo" },
  { nameJa: "島根県", type: "tokyo" },
  { nameJa: "岡山県", type: "tokyo" },
  { nameJa: "広島県", type: "tokyo" },
  { nameJa: "山口県", type: "tokyo" },
  { nameJa: "徳島県", type: "tokyo" },
  { nameJa: "香川県", type: "tokyo" },
  { nameJa: "愛媛県", type: "tokyo" },
  { nameJa: "高知県", type: "tokyo" },
  { nameJa: "福岡県", type: "tokyo" },
  { nameJa: "佐賀県", type: "tokyo" },
  { nameJa: "長崎県", type: "tokyo" },
  { nameJa: "熊本県", type: "tokyo" },
  { nameJa: "大分県", type: "tokyo" },
  { nameJa: "宮崎県", type: "tokyo" },
  { nameJa: "鹿児島県", type: "tokyo" },
  { nameJa: "沖縄県", type: "tokyo" },
];

export const tomareByPrefecture = new Map(tomarePrefectures.map((p) => [p.nameJa, p.type]));

// ---------------------------------------------------------------------------
// スポットライト事例: 電柱プレートに近い「今も現役で地域固有」の強いネタ
// ---------------------------------------------------------------------------

export type Spotlight = {
  id: string;
  icon: "star" | "olive" | "balloon";
  title: string;
  areas: string[];
  confidence: Confidence;
  summary: string;
  points: { k: string; v: string }[];
  note: string;
  sources: { label: string; url: string }[];
};

export const spotlights: Spotlight[] = [
  {
    id: "okayama-star",
    icon: "star",
    title: "☆合図(星形+文字)",
    areas: ["岡山県"],
    confidence: "confirmed",
    summary: "ウインカー点灯を促すための、岡山県独自の法定外路面標示。2005年から設置。",
    points: [
      { k: "図柄", v: "星形のイラストと「合図」の文字を組み合わせた標示。" },
      { k: "設置場所", v: "事故多発交差点を中心に、交差点の手前に設置。" },
      { k: "導入理由", v: "JAFのアンケート調査で「全国で最もウインカーを出さない県」と指摘されたことがきっかけ。" },
    ],
    note: "岡山県・香川県は同アンケートで「とても思う」回答が50%を超えた数少ない県で、独自標示導入の背景が明確な点で信頼度が高い。",
    sources: [
      { label: "webCARTOP", url: "https://www.webcartop.jp/2022/09/961611/" },
      { label: "Jタウンネット", url: "https://j-town.net/2016/05/21226239.html?p=all" },
    ],
  },
  {
    id: "kagawa-olive",
    icon: "olive",
    title: "オリーブ合図",
    areas: ["香川県"],
    confidence: "confirmed",
    summary: "香川県の特産品オリーブをモチーフにした「合図」標示。実の傾きで右左折方向を示す。2007年から設置。",
    points: [
      { k: "図柄", v: "オリーブの実(右折・左折で傾きが変わる)+「合図」の文字。" },
      { k: "設置場所", v: "交差点の30m手前が目安。高松市内の室新町交差点など複数箇所で確認。" },
      { k: "導入理由", v: "ウインカー不使用率がJAF調査で全国ワースト2位だったための施策。" },
    ],
    note: "岡山の☆合図とセットで語られることが多く、報道での裏取りも多い。GeoGuessr的には両者を「見えたら岡山 or 香川」の二択まで絞れる点が強み。",
    sources: [
      { label: "webCARTOP", url: "https://www.webcartop.jp/2022/09/961611/" },
      { label: "autopostjp", url: "https://www.autopostjp.com/car-life/article/54888/" },
    ],
  },
  {
    id: "saga-balloon",
    icon: "balloon",
    title: "気球+「ウインカー」",
    areas: ["佐賀県"],
    confidence: "confirmed",
    summary: "右左折方向に傾いた気球イラストと「ウインカー」の文字を組み合わせた標示。2018年、佐賀市内の事故多発交差点に設置。",
    points: [
      { k: "図柄", v: "右折レーン・左折レーンでそれぞれ進行方向に傾いた気球イラスト+「ウインカー」の文字。" },
      { k: "設置場所", v: "佐賀北警察署前交差点など、県内有数の事故多発交差点。" },
      { k: "導入理由", v: "2018年の県・県警アンケートで「ウインカーを出さない/出すのが遅い」との回答が最多だったための対策。" },
    ],
    note: "気球は佐賀の熱気球フェスタ(バルーンフェスタ)にちなむご当地モチーフ。岡山・香川と合わせて3県セットで覚えると良い。",
    sources: [
      { label: "乗りものニュース", url: "https://trafficnews.jp/post/564254" },
      { label: "佐賀経済新聞", url: "https://saga.keizai.biz/headline/524/" },
    ],
  },
];

// ---------------------------------------------------------------------------
// ダイヤマーク(横断歩道・自転車横断帯予告標示「◇」)の形状差
// 全国統一ルールがなく、切れ込みの有無・数・位置、線の太さが都道府県で異なる。
// 47都道府県の網羅データではなく、確認できた事例のみ。
// ---------------------------------------------------------------------------

export type DiamondNote = { area: string; shape: string; width: string; notches: 0 | 1 | 4 };

export const diamondNotes: DiamondNote[] = [
  { area: "東京都", shape: "切れ込みなし(単純な菱形)", width: "30cm", notches: 0 },
  { area: "島根県", shape: "「∧」と「∨」を重ねた形で、上下の間に1箇所の切れ込み", width: "30cm", notches: 1 },
  { area: "滋賀県", shape: "4箇所の切れ込み(山梨県とは位置が異なる)", width: "30cm", notches: 4 },
  { area: "山梨県", shape: "4箇所の切れ込み(滋賀県とは位置が異なる)", width: "細め", notches: 4 },
  { area: "山口県", shape: "資料からは切れ込みの記載なし、線が細いのが特徴", width: "20cm程度", notches: 0 },
  { area: "広島県", shape: "小ぶりで4箇所の切れ込み", width: "資料なし", notches: 4 },
];

export const diamondSourceNote =
  "大きさ・設置間隔(横断歩道の30m/40〜50m手前に対で設置)は全国共通ルールがあるが、線の太さと切れ込みの数・位置は都道府県ごとにバラバラ。全都道府県を網羅した一次資料は見つかっていない。";

export const diamondSources = [
  { label: "山陰中央新報デジタル", url: "https://www.sanin-chuo.co.jp/articles/-/600916" },
  { label: "同じに見えてちょっと違う?(urban-development.jp)", url: "https://urban-development.jp/blog/other/difference/" },
];

// ---------------------------------------------------------------------------
// 気候区分メタ: 消雪パイプ(積雪地域特有、都道府県より気候・地形区分向き)
// ---------------------------------------------------------------------------

export const snowPipeNote = {
  title: "消雪パイプ・融雪装置(路面の丸いノズル列)",
  areas: ["新潟県", "富山県", "石川県", "福井県", "山陰(鳥取・島根)", "長野県北部", "東北の平野部"],
  confidence: "likely" as Confidence,
  summary:
    "道路に埋設した散水管とノズルから地下水を散水して雪を溶かす設備。稼働中は路面が濡れている/水が噴き出している様子が見えることもある。1961年に新潟県長岡市で発祥。",
  points: [
    { k: "見た目", v: "道路の中央や路肩に、丸い蓋・継ぎ目状のノズルが等間隔に連続して埋め込まれている。" },
    { k: "分布", v: "積雪はあるが地下水位が高く水温を確保しやすい、北陸・山陰・長野県北部・東北平野部の幹線道路に多い。" },
    {
      k: "北海道との違い",
      v: "北海道は地下水が凍結してしまうため消雪パイプが機能しにくく、電熱線や温水管で融雪する「ロードヒーティング」が主流。消雪パイプが見えたら北海道の可能性は低く、北陸・山陰・信州北部・東北平野部側に絞り込める。",
    },
  ],
  note: "都道府県単位というより気候・地形区分(積雪はあるが厳寒すぎない地域)に近いメタ。境界は学術的にも議論があり、正確な設置密度の一次資料までは追い切れていない。",
  sources: [
    { label: "国交省 北陸雪害対策技術センター", url: "https://www.hrr.mlit.go.jp/road/toprunner/pdf/deve04_all.pdf" },
    { label: "消雪パイプ - Wikipedia", url: "https://ja.wikipedia.org/wiki/%E6%B6%88%E9%9B%AA%E3%83%91%E3%82%A4%E3%83%97" },
  ],
};

// ---------------------------------------------------------------------------
// 参考程度(採用保留・弱いネタ): 再現性が低い/範囲が広すぎる/廃止方向などの理由で
// 主要コンテンツにはしていないが、記録として残しておく事例
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
    id: "atsu",
    title: "「あっ!」注意喚起標示",
    areas: ["神奈川県川崎市", "大阪府", "福岡県", "島根県"],
    note: "「あっ、危ない」という気持ちをそのまま文字にした法定外標示。複数の地域にまたがって設置されており、単独では地域の一意特定はできない。「見えたら日本のどこか」程度の弱いヒント。",
    sources: [{ label: "autopostjp", url: "https://www.autopostjp.com/car-life/article/54888/" }],
  },
  {
    id: "tochigi-clearzone",
    title: "「クリアゾーン」(橙色の路面文字)",
    areas: ["栃木県"],
    note: "幅員不足の交差点手前での駐車を抑制するための法定外標示。一般ドライバーに浸透せず、今後の新設は行わない方針とされており、既存箇所も今後減っていく可能性が高い。",
    sources: [{ label: "道路標示 - Wikipedia", url: "https://ja.wikipedia.org/wiki/%E9%81%93%E8%B7%AF%E6%A8%99%E7%A4%BA" }],
  },
  {
    id: "3d-crosswalk",
    title: "3D(立体錯視)横断歩道",
    areas: ["京都府亀岡市 千代川小学校前ほか"],
    note: "減速を促す目的で一部の通学路に試験導入されている、影を描いて立体的に見せる横断歩道。導入例が極めて少なく、地域を見分けるというより「知っていれば分かる」ピンポイントなトリビアに近い。",
    sources: [{ label: "IDEAS FOR GOOD", url: "https://ideasforgood.jp/2017/11/01/3d-zebra-crossing/" }],
  },
  {
    id: "green-belt",
    title: "通学路グリーンベルト(路側帯の緑色着色)",
    areas: ["全国の多数の自治体"],
    note: "歩道のない通学路の路側帯を緑色に着色する対策。全国的に広く採用されており、導入基準も自治体ごとにまちまちなため、地域を絞り込む手がかりとしては弱い。",
    sources: [
      {
        label: "加古川市公式サイト",
        url: "https://www.city.kakogawa.lg.jp/soshikikarasagasu/kyouiku/kakuka/kyoikusomubu/gakumuka/tuugakuro/32856.html",
      },
    ],
  },
];
