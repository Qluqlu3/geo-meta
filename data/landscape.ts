// 風景・植生メタ: 電柱メタ・路面標示メタ・道路標識メタと同じ方針で「標識・信号機以外の
// 風景に写り込むもの」の地域差を整理していくデータ層。最初の1分野として、コミュニティで
// 電柱プレートに匹敵するレベルで体系化されている「ボラード(視線誘導標)の縞模様・反射板
// パターン」を収録している。詳しい調査経緯は RESEARCH_landscape.md を参照。

export type { Confidence } from "./roadMarkings";
export { confidenceLabel } from "./roadMarkings";

// ---------------------------------------------------------------------------
// ボラード(視線誘導標)の縞模様・反射板パターン
// 出典: wikiwiki.jp「Geoguessr Japan Wiki」日本(WebFetchで内容確認済み)。
// コミュニティ知見としては詳細だが、一次の写真検証までは追い切れていないため、
// 個別項目の確度はいずれも「likely」としている。
// ---------------------------------------------------------------------------

export type BollardKind = "hokkaido" | "aomori" | "akita" | "toyama" | "chugoku" | "shikoku" | "kyushu";

export type BollardPattern = {
  id: BollardKind;
  area: string;
  title: string;
  desc: string;
  tip: string;
  confidence: import("./roadMarkings").Confidence;
};

export const bollardPatterns: BollardPattern[] = [
  {
    id: "hokkaido",
    area: "北海道",
    title: "赤白ストライプ / 四角リフレクター連続設置",
    desc: "支柱全体に赤白の太いストライプが入るタイプと、四角いリフレクターを連続して並べるタイプの2系統が見られる。",
    tip: "電柱メタ(北海道電力)・格子状防風林・竹林の欠如と組み合わせるとほぼ確定できる。",
    confidence: "likely",
  },
  {
    id: "aomori",
    area: "青森県",
    title: "黄色の縞2本 + 円形反射板",
    desc: "白地に黄色の横縞が2本入り、反射板は円形。",
    tip: "岩木山(津軽富士)のシルエットが見えれば津軽地方でほぼ確定できる。",
    confidence: "likely",
  },
  {
    id: "akita",
    area: "秋田県",
    title: "八角形反射板 + 黄色二重線(反射板なしタイプもあり)",
    desc: "東北一般型と同じ八角形の反射板を持つが、下部の黄色い線が二重線になっているのが特徴。赤白ストライプのみで反射板がないタイプも見られる。",
    tip: "「八角形+二重線」を確認できれば秋田県。反射板がない個体も多く、その場合は他の東北県との誤認に注意。",
    confidence: "likely",
  },
  {
    id: "toyama",
    area: "富山県",
    title: "リフレクター水平配置 + 赤色の下線",
    desc: "反射板が水平向きに取り付けられており、歩道側からは見えない(車道側のみ視認可能)という珍しい配置。下部の線は赤色。",
    tip: "反射板の向き自体には気付きにくいため、実戦では下部の赤線の方が判別しやすい。",
    confidence: "likely",
  },
  {
    id: "chugoku",
    area: "中国地方(山口県を除く)",
    title: "丸い白反射板 + 上部の赤線",
    desc: "丸く白い反射板の上に赤い線が入る。ガードレール端にも赤黄の縞模様ステッカーが貼られる。",
    tip: "山口県はこのパターンに含まれない(ガードレール自体が夏みかん色になる別メタあり)点に注意。",
    confidence: "likely",
  },
  {
    id: "shikoku",
    area: "四国",
    title: "リフレクター下に黒線",
    desc: "反射板の下に黒い線が入るのが特徴。",
    tip: "単独ではやや地味な差のため、他の四国要素と併用したい。",
    confidence: "likely",
  },
  {
    id: "kyushu",
    area: "九州",
    title: "四角リフレクター連続設置(表オレンジ・裏白) + 支柱の緑帯",
    desc: "四角い反射板を連続して設置し、表面がオレンジ、裏面が白。ガードレール支柱に緑の帯が入る例が特に大分県・宮崎県で見られる。",
    tip: "緑帯まで確認できれば大分県・宮崎県の可能性が高まる。",
    confidence: "likely",
  },
];

export const bollardCaveat =
  "路面標示メタの調査時点では「ボラードの色は進行方向左右による全国統一基準で、地域差ではない」と結論づけていたが、今回wikiwiki.jp「日本」ページで上記の県・地方別パターンが見つかったため、地域差メタとして採用した。ただし一次の写真検証までは追い切れておらず、確度は「有力」止まりとして扱う。";

export const bollardSources = [
  { label: "wikiwiki.jp「Geoguessr Japan Wiki」日本", url: "https://wikiwiki.jp/geoguessr/%E6%97%A5%E6%9C%AC" },
];
