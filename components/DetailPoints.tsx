// Per-company "識別ポイント" panels: small labelled illustrations of the
// confirmed identification patterns, grouped by confidence. Bespoke per
// company (currently TEPCO), matching the community cheat-sheet layout.
import type { ReactNode } from "react";

const T = "var(--part-transformer)";
const P = "var(--part-plate)";
const I = "var(--part-insulator)";
const M = "var(--text-secondary)";
const SURFACE = "var(--surface-2)";
const GUYWIRE_G = "var(--part-guywire)";

function TepcoMark() {
  // 赤い社章(東電マーク)を模した赤い円のクラスタ(商標の忠実な再現ではなく識別用の模式)
  return (
    <svg viewBox="0 0 64 60">
      <circle cx="32" cy="16" r="6" fill="#d23c3c" />
      <circle cx="23" cy="29" r="6" fill="#d23c3c" />
      <circle cx="41" cy="29" r="6" fill="#d23c3c" />
      <circle cx="32" cy="40" r="6" fill="#d23c3c" />
      <circle cx="32" cy="28" r="4" fill="#fff" />
    </svg>
  );
}

function BoardTransformer() {
  // 変圧器(缶)を横から見た円筒形として描く(上から見た図にしない)
  return (
    <svg viewBox="0 0 64 60">
      <ellipse cx="32" cy="13" rx="12" ry="3.5" fill={SURFACE} stroke={T} strokeWidth="2.5" />
      <rect x="20" y="13" width="24" height="22" rx="3" fill={SURFACE} stroke={T} strokeWidth="2.5" />
      <circle cx="28" cy="9" r="2" fill={I} />
      <circle cx="36" cy="9" r="2" fill={I} />
      <rect x="14" y="35" width="36" height="6" rx="1.5" fill="#8a5a2b" />
    </svg>
  );
}

function TArm() {
  // 変圧器の下から斜めに伸びる支持アーム(板/取付金具からはみ出す長さで描く)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="8" y="30" width="20" height="7" rx="1.5" fill="#8a5a2b" />
      <ellipse cx="24" cy="9" rx="12" ry="3.5" fill={SURFACE} stroke={T} strokeWidth="2.5" />
      <rect x="12" y="9" width="24" height="20" rx="3" fill={SURFACE} stroke={T} strokeWidth="2.5" />
      <line x1="32" y1="26" x2="54" y2="50" stroke={T} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function HandwrittenPlate() {
  return (
    <svg viewBox="0 0 64 60">
      <rect x="23" y="8" width="18" height="44" rx="2" fill="#cfcdc6" stroke={P} strokeWidth="2" />
      <path d="M27 20 q4 -4 7 0 t7 0" stroke="#333" strokeWidth="1.5" fill="none" />
      <path d="M27 31 q4 -4 7 0 t7 0" stroke="#333" strokeWidth="1.5" fill="none" />
      <path d="M27 42 q4 -3 7 0" stroke="#333" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function DArm() {
  // 角のある(直角の)腕金…滑らかな円弧ではなく直線+直角で構成
  return (
    <svg viewBox="0 0 64 60">
      <rect x="29" y="4" width="5" height="52" fill={M} />
      <path d="M34 14 L48 14 L48 42 L34 42" fill="none" stroke={M} strokeWidth="2.5" strokeLinejoin="miter" />
    </svg>
  );
}

function PoleTop() {
  return (
    <svg viewBox="0 0 64 60">
      <rect x="29" y="16" width="5" height="40" fill={M} />
      <circle cx="31.5" cy="13" r="5" fill={M} />
      <path d="M40 22 q9 2 5 13 q-4 7 -11 2" fill="none" stroke={M} strokeWidth="2.5" />
    </svg>
  );
}

function YokoKanjiPlate() {
  return (
    <svg viewBox="0 0 64 60">
      <rect x="23" y="7" width="18" height="46" rx="2" fill="#fff" stroke={P} strokeWidth="2" />
      <line x1="27" y1="18" x2="37" y2="18" stroke="#333" strokeWidth="2.6" />
      <line x1="27" y1="30" x2="37" y2="30" stroke="#333" strokeWidth="2.6" />
      <line x1="27" y1="42" x2="37" y2="42" stroke="#333" strokeWidth="2.6" />
    </svg>
  );
}

function Streetlight({ band }: { band: "white" | "yellow" }) {
  return (
    <svg viewBox="0 0 64 60">
      <rect x="18" y="6" width="5" height="50" fill={M} />
      <path d="M20 12 q18 -2 24 10" fill="none" stroke={M} strokeWidth="3" />
      <rect x="41" y="20" width="13" height="6" rx="2" fill="var(--text-muted)" />
      <rect
        x="16"
        y="30"
        width="9"
        height="12"
        rx="1.5"
        fill={band === "yellow" ? "#f5c518" : "#ffffff"}
        stroke="var(--border-strong)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// 変圧器(缶)を横から見た円筒形として描く共通パーツ(他社アイコンでも使い回す)。
function Can({ cx = 32, cy = 20, r = 12, strokeWidth = 2.5 }: { cx?: number; cy?: number; r?: number; strokeWidth?: number }) {
  const capRy = r * 0.3;
  const bodyTop = cy - r + capRy;
  return (
    <>
      <rect
        x={cx - r}
        y={bodyTop}
        width={r * 2}
        height={r * 2 - capRy}
        rx={r * 0.22}
        fill={SURFACE}
        stroke={T}
        strokeWidth={strokeWidth}
      />
      <ellipse cx={cx} cy={bodyTop} rx={r} ry={capRy} fill={SURFACE} stroke={T} strokeWidth={strokeWidth * 0.85} />
    </>
  );
}

// ボトル型(下太・上細)の支線ガード+黒テープ螺旋巻き。関西・北陸・四国で共通の柄。
function BottleGuard() {
  return (
    <svg viewBox="0 0 64 60">
      <use href="#mk-bottle" x="18" y="8" width="28" height="44" fill={GUYWIRE_G} />
      <path d="M22 16 q10 4 20 0" fill="none" stroke="#000" strokeOpacity=".4" strokeWidth="1.4" />
      <path d="M22 26 q10 4 20 0" fill="none" stroke="#000" strokeOpacity=".4" strokeWidth="1.4" />
      <path d="M22 36 q10 4 20 0" fill="none" stroke="#000" strokeOpacity=".4" strokeWidth="1.4" />
    </svg>
  );
}

// 黒黄ストライプの支線ガード。中部電力・沖縄電力で共通の柄。
function StripedGuard() {
  return (
    <svg viewBox="0 0 64 60">
      <rect
        x="20"
        y="8"
        width="24"
        height="42"
        rx="6"
        fill="url(#stripe-pattern)"
        stroke="var(--border-strong)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// 円錐形のポールトップ(雪対策・北海道/東北系)。
function ConeTop() {
  return (
    <svg viewBox="0 0 64 60">
      <rect x="29" y="20" width="5" height="36" fill={M} />
      <polygon points="31.5,6 40,22 23,22" fill={M} />
    </svg>
  );
}

function PlusBarTransformer() {
  // プラス(+)字型のバーで側面固定・木製の取付板は使わない(北海道特有)
  return (
    <svg viewBox="0 0 64 60">
      <Can cx={32} cy={32} r={13} />
      <line x1="14" y1="32" x2="50" y2="32" stroke={M} strokeWidth="4.5" />
      <line x1="32" y1="14" x2="32" y2="50" stroke={M} strokeWidth="4.5" />
    </svg>
  );
}

function KuKakuZuPlate() {
  // 縦長・上から「区/画/図」の順に数字が並ぶ独特の書式
  return (
    <svg viewBox="0 0 64 60">
      <rect x="21" y="5" width="22" height="50" rx="2" fill="#fff" stroke={P} strokeWidth="2" />
      <text x="32" y="19" fontSize="8" textAnchor="middle" fill="#333" fontWeight="700">
        41
      </text>
      <text x="32" y="32" fontSize="8" textAnchor="middle" fill="#333" fontWeight="700">
        08
      </text>
      <text x="32" y="45" fontSize="8" textAnchor="middle" fill="#333" fontWeight="700">
        3
      </text>
    </svg>
  );
}

function SparseTop() {
  // 架空地線がほぼ無く、頭部の配線がシンプル(北海道)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="29" y="22" width="5" height="34" fill={M} />
      <rect x="12" y="16" width="40" height="5" rx="2" fill={M} />
      <line x1="12" y1="30" x2="52" y2="30" stroke={GUYWIRE_G} strokeWidth="2" />
    </svg>
  );
}

function WideGrayPlate() {
  // 横長・やや縦幅のあるタイプ。左上に社名ロゴ、灰色地
  return (
    <svg viewBox="0 0 64 60">
      <rect x="8" y="18" width="48" height="24" rx="2" fill="#c9c8c2" stroke={P} strokeWidth="2" />
      <circle cx="15" cy="25" r="3.5" fill={P} />
      <line x1="22" y1="25" x2="40" y2="25" stroke="#555" strokeWidth="1.4" />
      <line x1="14" y1="35" x2="50" y2="35" stroke="#333" strokeWidth="2.4" />
    </svg>
  );
}

function TopExitTransformer() {
  // 変圧器の枠(四角ブラケット)+高圧引き下げ線が上部から延びる(関西とは対照的)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="16" y="6" width="20" height="26" fill="none" stroke={M} strokeWidth="2.2" />
      <Can cx={34} cy={30} r={11} />
      <line x1="26" y1="6" x2="26" y2="-2" stroke={T} strokeWidth="2.2" />
    </svg>
  );
}

function SpiralCylinderGuard() {
  // 円柱+黒テープ螺旋巻き(東北特有・ボトル型ではない点がポイント)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="22" y="8" width="20" height="44" rx="4" fill={GUYWIRE_G} />
      <path d="M22 16 L42 22 M22 26 L42 32 M22 36 L42 42 M22 46 L42 50" stroke="#000" strokeOpacity=".45" strokeWidth="1.6" />
    </svg>
  );
}

function NiigataPlate() {
  // 新潟県内で見られるNTTの横長プレート(東北電力エリアだが新潟のみの手がかり)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="8" y="20" width="48" height="20" rx="2" fill="#fff" stroke="var(--border-strong)" strokeWidth="2" />
      <text x="32" y="34" fontSize="11" textAnchor="middle" fill="#333" fontWeight="700">
        NTT
      </text>
    </svg>
  );
}

function RoundedLogoPlate() {
  // 縦長・角が丸い札、上部に中部電力ロゴ(「楕円」ではない点を修正)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="21" y="6" width="22" height="48" rx="8" fill="#fff" stroke={P} strokeWidth="2.2" />
      <circle cx="32" cy="16" r="4" fill={P} />
      <line x1="26" y1="30" x2="38" y2="30" stroke="#333" strokeWidth="2" />
      <line x1="26" y1="40" x2="38" y2="40" stroke="#333" strokeWidth="2" />
    </svg>
  );
}

function LBracketTop() {
  // 直角に曲がったGWキャップ(中部特有・ボトル型/鳥居型と対照的)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="29" y="20" width="5" height="36" fill={M} />
      <path d="M31.5 20 L31.5 8 L46 8" fill="none" stroke={M} strokeWidth="3" strokeLinecap="square" />
    </svg>
  );
}

function TriangleArm() {
  // 三角形の形をした腕金(中部特有)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="29" y="24" width="5" height="32" fill={M} />
      <polygon points="31.5,10 46,32 17,32" fill="none" stroke={M} strokeWidth="2.6" />
    </svg>
  );
}

function TapTransformer() {
  // 黄色の手書き風数字+黒いタップ端子(中部)
  return (
    <svg viewBox="0 0 64 60">
      <Can cx={30} cy={30} r={13} />
      <text x="30" y="33" fontSize="9" textAnchor="middle" fill="#e0b400" fontWeight="700">
        15
      </text>
      <rect x="42" y="22" width="5" height="5" fill="#111" />
    </svg>
  );
}

function NarrowKatakanaPlate() {
  // 幅がやや狭い横長タイプ。カタカナ+4桁数字(北陸)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="10" y="22" width="44" height="16" rx="2" fill={SURFACE} stroke={P} strokeWidth="2" />
      <text x="32" y="34" fontSize="9" textAnchor="middle" fill="#333" fontWeight="700">
        イ2500
      </text>
    </svg>
  );
}

function TentArm() {
  // テント状にGW(支線)を支える腕金(北陸)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="29" y="24" width="5" height="32" fill={M} />
      <path d="M18 24 L31.5 10 L45 24" fill="none" stroke={M} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function TateKanjiPlate() {
  // 縦長の白いプレート、標識名は漢字/カタカナの縦書き(関西)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="23" y="7" width="18" height="46" rx="2" fill="#fff" stroke={P} strokeWidth="2" />
      <line x1="29" y1="12" x2="29" y2="48" stroke="#333" strokeWidth="2.2" />
      <line x1="36" y1="18" x2="36" y2="40" stroke="#333" strokeWidth="2.2" />
    </svg>
  );
}

function AngleArm() {
  // 120°に角度のついた腕金(関西)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="29" y="26" width="5" height="30" fill={M} />
      <path d="M14 14 L31.5 26 L49 14" fill="none" stroke={M} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function BottomExitTransformer() {
  // 高圧引き下げ線が変圧器の枠の下側から延びる(関西・東北とは対照的)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="18" y="8" width="20" height="24" fill="none" stroke={M} strokeWidth="2.2" />
      <Can cx={30} cy={30} r={11} />
      <line x1="34" y1="42" x2="46" y2="54" stroke={T} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function EnergiaPlate() {
  // 縦型でENERGIAロゴが上部に入り、1本の柱に3枚以上貼付されがち(中国)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="30" y="9" width="18" height="42" rx="2" fill="#fff" stroke={P} strokeWidth="1.6" opacity=".65" />
      <rect x="24" y="6" width="18" height="44" rx="2" fill="#fff" stroke={P} strokeWidth="2" />
      <circle cx="33" cy="14" r="3" fill="#e07b1a" />
      <line x1="28" y1="30" x2="38" y2="30" stroke="#333" strokeWidth="2" />
      <line x1="28" y1="40" x2="38" y2="40" stroke="#333" strokeWidth="2" />
    </svg>
  );
}

function RedNumeralTransformer() {
  // 十字バー+三角固定、朱色(赤)の数字シールが側面/底面に付く(中国)
  return (
    <svg viewBox="0 0 64 60">
      <polygon points="30,8 40,20 20,20" fill="none" stroke={M} strokeWidth="2" />
      <Can cx={30} cy={32} r={12} />
      <rect x="24" y="38" width="10" height="6" rx="1" fill="#d23c3c" />
    </svg>
  );
}

function RoundBottomGuard() {
  // 支線ガードの下部が丸みを帯びた形状(中国)
  return (
    <svg viewBox="0 0 64 60">
      <path d="M24 8 h16 v28 a8 8 0 0 1 -16 0 z" fill={GUYWIRE_G} />
    </svg>
  );
}

function YellowArrowTag() {
  // 黄色の矢印形プレート(昇降表示札)。大分でも見られるため単独では確定できない(中国)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="20" y="24" width="5" height="30" fill={M} />
      <polygon points="30,24 46,32 30,40" fill="#f5c518" stroke="var(--border-strong)" strokeWidth="1.2" />
    </svg>
  );
}

function LArm() {
  // L字型の腕金(四国電力の代表的特徴、Tokyo電力のD字より短い横アーム)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="29" y="4" width="5" height="42" fill={M} />
      <path d="M34 14 L46 14 L46 30" fill="none" stroke={M} strokeWidth="2.6" strokeLinejoin="miter" />
    </svg>
  );
}

function BentDropTransformer() {
  // 高圧引き下げ線が直角(90°)に曲がる派手な形状+底面にシール(四国)
  return (
    <svg viewBox="0 0 64 60">
      <Can cx={28} cy={26} r={12} />
      <path d="M28 38 L28 48 L44 48" fill="none" stroke={T} strokeWidth="2.4" />
      <rect x="20" y="38" width="10" height="6" fill={T} opacity=".5" />
    </svg>
  );
}

function TightPlates() {
  // 隙間を狭くして取り付けられた小型プレートが複数並ぶ(四国)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="14" y="20" width="16" height="16" rx="2" fill={SURFACE} stroke={P} strokeWidth="1.8" />
      <rect x="32" y="20" width="16" height="16" rx="2" fill={SURFACE} stroke={P} strokeWidth="1.8" />
    </svg>
  );
}

function ThickPlateLogo() {
  // 縦型でやや厚みのある札、上部に社章(青丸+電気マーク)を刻印(九州)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="22" y="6" width="20" height="48" rx="2" fill={SURFACE} stroke={P} strokeWidth="2.4" />
      <circle cx="32" cy="15" r="4" fill="none" stroke="#1a5fd6" strokeWidth="1.6" />
      <line x1="27" y1="32" x2="27" y2="46" stroke="#333" strokeWidth="2" />
      <line x1="37" y1="32" x2="37" y2="46" stroke="#333" strokeWidth="2" />
    </svg>
  );
}

function TriangleCapInsulator() {
  // 黒いキャップが被さった三角めの形状(九州)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="26" y="26" width="12" height="20" rx="2" fill={I} />
      <polygon points="32,10 41,26 23,26" fill="#1a1a1a" />
    </svg>
  );
}

function DirectGuyWire() {
  // ボトル型キャップが無く、細い支線が柱の中央付近に直接差し込まれる(九州)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="29" y="6" width="5" height="48" fill={M} />
      <line x1="31.5" y1="26" x2="52" y2="50" stroke={GUYWIRE_G} strokeWidth="2" />
    </svg>
  );
}

function ContinuousBlueWires() {
  // 高圧引き下げ線が隙間なく延び、青みがかった電線が多い。GWキャップはほぼ使われない(九州)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="29" y="10" width="5" height="46" fill={M} />
      <line x1="12" y1="16" x2="52" y2="16" stroke="#5b7fb5" strokeWidth="3" />
      <line x1="29" y1="16" x2="29" y2="40" stroke="#5b7fb5" strokeWidth="3" />
    </svg>
  );
}

function OkidenPlate() {
  // プレートに「沖縄電力」表記が明記される(沖縄)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="22" y="8" width="20" height="44" rx="2" fill="#fff" stroke={P} strokeWidth="2" />
      <line x1="26" y1="14" x2="38" y2="14" stroke="var(--border-strong)" strokeWidth="1" opacity=".5" />
      <text x="32" y="35" fontSize="8.5" textAnchor="middle" fill="#333" fontWeight="700">
        沖電
      </text>
    </svg>
  );
}

function ConcretePole() {
  // コンクリート柱(識別力は低いが目安程度・本州でも標準化が進んでいる点に注意)
  return (
    <svg viewBox="0 0 64 60">
      <rect x="27" y="4" width="10" height="52" rx="1" fill="#b7b5ad" stroke="var(--border-strong)" strokeWidth="1" />
      <line x1="27" y1="20" x2="37" y2="20" stroke="var(--border-strong)" strokeWidth="1" opacity=".5" />
      <line x1="27" y1="38" x2="37" y2="38" stroke="var(--border-strong)" strokeWidth="1" opacity=".5" />
    </svg>
  );
}

type DetailItem = { icon: ReactNode; label: string };
type DetailCategory = { cat: string; badge: "confirmed" | "likely" | "region"; items: DetailItem[] };

const DETAILS: Record<string, DetailCategory[]> = {
  tepco: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <TepcoMark />, label: "東電マーク(赤い社章)" },
        { icon: <BoardTransformer />, label: "木の板に載る変圧器" },
        { icon: <TArm />, label: "変圧器からT字アーム" },
        { icon: <HandwrittenPlate />, label: "灰色・手書きプレート" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [
        { icon: <DArm />, label: "D字アーム" },
        { icon: <PoleTop />, label: "GWキャップ・も字腕金" },
        { icon: <YokoKanjiPlate />, label: "地名が横書き漢字" },
      ],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [
        { icon: <Streetlight band="white" />, label: "白い街灯番号札 → 東京(7割)" },
        { icon: <Streetlight band="yellow" />, label: "黄色い街灯番号札 → 神奈川(9割)" },
      ],
    },
  ],
  hokkaido: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <KuKakuZuPlate />, label: "縦長プレート「区/画/図」書式" },
        { icon: <PlusBarTransformer />, label: "プラス字バー固定・木製板なし" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [
        { icon: <ConeTop />, label: "円錐形ポールトップ(雪対策)" },
        { icon: <SparseTop />, label: "架空地線がほぼ無く頭部が簡素" },
      ],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [{ icon: <Streetlight band="yellow" />, label: "黄色縦長の街灯番号札 → 札幌市" }],
    },
  ],
  tohoku: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <WideGrayPlate />, label: "灰色地・横長プレート+左上ロゴ" },
        { icon: <TopExitTransformer />, label: "引き下げ線が枠の上部から延びる" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [
        { icon: <SpiralCylinderGuard />, label: "円柱+黒テープ螺旋巻きの支線ガード" },
        { icon: <ConeTop />, label: "円錐形ポールトップ(北海道と同系統)" },
      ],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [{ icon: <NiigataPlate />, label: "横長NTTプレート → 新潟県(確定)" }],
    },
  ],
  chubu: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <RoundedLogoPlate />, label: "縦長・角丸プレート+上部に中部ロゴ" },
        { icon: <LBracketTop />, label: "直角に曲がったGWキャップ" },
        { icon: <TriangleArm />, label: "三角形の腕金" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [{ icon: <TapTransformer />, label: "黄色手書き数字+黒タップ端子" }],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [{ icon: <StripedGuard />, label: "黒黄ストライプの支線ガード(沖縄と共通)" }],
    },
  ],
  hokuriku: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [{ icon: <NarrowKatakanaPlate />, label: "カタカナ+4桁の横長プレート" }],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [
        { icon: <BottleGuard />, label: "ボトル型+黒テープ螺旋(関西・四国と共通)" },
        { icon: <TentArm />, label: "テント状のGW支持腕金" },
      ],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [{ icon: <NarrowKatakanaPlate />, label: "番号帯で県特定(富山0000-3999/石川4000-7999/福井8000-9999)" }],
    },
  ],
  kansai: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <TateKanjiPlate />, label: "縦長・白プレート+漢字/カタカナ縦書き" },
        { icon: <AngleArm />, label: "120°に角度のついた腕金" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [
        { icon: <BottomExitTransformer />, label: "引き下げ線が枠の下部から延びる" },
        { icon: <BottleGuard />, label: "ボトル型+黒テープ螺旋(北陸・四国と共通)" },
      ],
    },
  ],
  chugoku: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <EnergiaPlate />, label: "縦型プレート+ENERGIAロゴ・3枚以上" },
        { icon: <RedNumeralTransformer />, label: "十字バー固定+朱色数字シール" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [{ icon: <RoundBottomGuard />, label: "支線ガードの下部が丸型" }],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [{ icon: <YellowArrowTag />, label: "黄色矢印の昇降表示札(大分でも見られ注意)" }],
    },
  ],
  shikoku: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [{ icon: <LArm />, label: "L字型の腕金(四国電力の代名詞)" }],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [
        { icon: <BentDropTransformer />, label: "引き下げ線が90°に曲がる+底面シール" },
        { icon: <TightPlates />, label: "隙間の狭い小型プレート+ロゴ" },
        { icon: <BottleGuard />, label: "ボトル型+黒テープ螺旋(関西・北陸と共通)" },
      ],
    },
  ],
  kyushu: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <ThickPlateLogo />, label: "厚手の縦型プレート+上部に社章" },
        { icon: <TriangleCapInsulator />, label: "黒い三角キャップのがいし" },
        { icon: <DirectGuyWire />, label: "支線が中央付近に直接差し込まれる" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [{ icon: <ContinuousBlueWires />, label: "青い電線+GWキャップほぼ無し" }],
    },
  ],
  okinawa: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [{ icon: <OkidenPlate />, label: "プレートに「沖電/沖縄電力」表記" }],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [{ icon: <StripedGuard />, label: "黒黄ストライプの支線ガード(中部と共通)" }],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [{ icon: <ConcretePole />, label: "コンクリート柱(識別力は低め・目安程度)" }],
    },
  ],
};

const BADGE_LABEL: Record<DetailCategory["badge"], string> = {
  confirmed: "確定",
  likely: "7割",
  region: "地域別",
};

export function hasDetailPoints(id: string): boolean {
  return id in DETAILS;
}

export function DetailPoints({ id }: { id: string }) {
  const categories = DETAILS[id];
  if (!categories) return null;
  return (
    <div className="detail-points">
      {categories.map((c) => (
        <div key={c.cat}>
          <div className="detail-cat-head">
            <h5>{c.cat}</h5>
            <span className={`detail-badge ${c.badge}`}>{BADGE_LABEL[c.badge]}</span>
          </div>
          <div className="detail-grid">
            {c.items.map((it) => (
              <div key={it.label} className="detail-item">
                {it.icon}
                <span>{it.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
