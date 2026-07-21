// Bespoke identification-diagram illustrations, one per power company.
// Kept as hand-authored SVG (not data-driven) since each depicts a different
// real-world detail (plate shape, guy-wire marker, transformer mount, etc).
//
// Every diagram uses the same 4 fixed "part" colors (--part-guywire,
// --part-transformer, --part-plate, --part-insulator) instead of the
// company's own brand color, so a given part always reads as the same
// color across all 10 companies (see Legend for the color key).
import type { ComponentType } from "react";

const GUYWIRE = "var(--part-guywire)";
const TRANSFORMER = "var(--part-transformer)";
const PLATE = "var(--part-plate)";
const INSULATOR = "var(--part-insulator)";

function Ground() {
  return <ellipse cx="70" cy="193" rx="24" ry="3.5" fill="#000" opacity=".18" />;
}

// がいし(碍子)の共通パーツ。単色の円に加え、左上に半透明の白いハイライトを
// 重ねてつや(グロス感)を出す。INSULATOR色はテーマごとに変わるため、色そのものを
// 変えずに白の半透明レイヤーを重ねる方式でどのテーマでも安全に光沢を表現する。
function InsulatorGlossy({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={INSULATOR} />
      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.35} rx={r * 0.4} ry={r * 0.28} fill="#fff" opacity=".35" />
    </>
  );
}

// 東京電力の四角めのがいし用。InsulatorGlossyの角丸長方形版。
function InsulatorSquareGlossy({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <>
      <rect x={x} y={y} width={size} height={size} rx={size * 0.18} fill={INSULATOR} />
      <ellipse cx={x + size * 0.32} cy={y + size * 0.3} rx={size * 0.22} ry={size * 0.16} fill="#fff" opacity=".35" />
    </>
  );
}

// 九州電力の三角めのがいし用。InsulatorGlossyの三角形版。
function InsulatorTriangleGlossy({ cx }: { cx: number }) {
  return (
    <>
      <polygon points={`${cx},16 ${cx + 5},24 ${cx - 5},24`} fill={INSULATOR} />
      <ellipse cx={cx - 1.2} cy={20.5} rx={1.8} ry={1.3} fill="#fff" opacity=".35" />
    </>
  );
}

// 変圧器(缶)を横から見た円筒形として描く共通パーツ。上から見た円ではなく、
// 側面図の他要素と視点を揃えるため、平らな上面(楕円)+胴体(角丸長方形)で構成する。
// 呼び出し側は元の circle と同じ (cx, cy, r) を渡せば同じ外形(上下左右の端)になる。
function TransformerCan({
  cx = 100,
  cy = 58,
  r = 14,
  strokeWidth = 3,
}: {
  cx?: number;
  cy?: number;
  r?: number;
  strokeWidth?: number;
}) {
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
        fill="url(#pole-gradient)"
        stroke={TRANSFORMER}
        strokeWidth={strokeWidth}
      />
      <ellipse
        cx={cx}
        cy={bodyTop}
        rx={r}
        ry={capRy}
        fill="url(#pole-gradient)"
        stroke={TRANSFORMER}
        strokeWidth={strokeWidth * 0.85}
      />
    </>
  );
}

// 柱から変圧器(缶)まで届く取り付けアーム。缶が柱から離れて浮いて見えないよう、
// 柱の右端(x=74)から缶の左端(少し重なる位置)まで橋渡しする。
function MountArm({ canCx, canR, y, poleEdge = 74 }: { canCx: number; canR: number; y: number; poleEdge?: number }) {
  const x2 = canCx - canR + 5;
  return (
    <rect
      x={poleEdge}
      y={y - 3}
      width={x2 - poleEdge}
      height={6}
      rx={3}
      fill="url(#beam-gradient)"
      stroke="var(--border-strong)"
      strokeWidth="0.5"
    />
  );
}

function PoleBase() {
  return (
    <>
      <Ground />
      <rect
        x="66"
        y="8"
        width="8"
        height="184"
        rx="3"
        fill="url(#pole-gradient)"
        stroke="var(--border-strong)"
        strokeWidth="0.5"
      />
      <rect
        x="38"
        y="28"
        width="64"
        height="6"
        rx="3"
        fill="url(#beam-gradient)"
        stroke="var(--border-strong)"
        strokeWidth="0.5"
      />
      <InsulatorGlossy cx={44} cy={20} r={5} />
      <InsulatorGlossy cx={70} cy={20} r={5} />
      <InsulatorGlossy cx={96} cy={20} r={5} />
    </>
  );
}

function Hokkaido() {
  return (
    <svg viewBox="0 0 140 200">
      <Ground />
      <rect
        x="66"
        y="8"
        width="8"
        height="184"
        rx="3"
        fill="url(#pole-gradient)"
        stroke="var(--border-strong)"
        strokeWidth="0.5"
      />
      <rect
        x="38"
        y="28"
        width="64"
        height="6"
        rx="3"
        fill="url(#beam-gradient)"
        stroke="var(--border-strong)"
        strokeWidth="0.5"
      />
      <InsulatorGlossy cx={44} cy={20} r={5} />
      <InsulatorGlossy cx={70} cy={20} r={5} />
      <InsulatorGlossy cx={96} cy={20} r={5} />
      <MountArm canCx={100} canR={14} y={58} />
      <TransformerCan cx={100} cy={58} r={14} />
      <line x1="90" y1="51" x2="90" y2="65" stroke={TRANSFORMER} strokeWidth="4" />
      <line x1="83" y1="58" x2="97" y2="58" stroke={TRANSFORMER} strokeWidth="4" />
      <line x1="70" y1="95" x2="24" y2="182" stroke="var(--text-muted)" strokeWidth="2" />
      <use href="#mk-diamond" x="12" y="171" width="24" height="24" fill={GUYWIRE} />
      <rect x="80" y="150" width="24" height="34" rx="2" fill="var(--surface-2)" stroke={PLATE} strokeWidth="2" />
      <line x1="84" y1="159" x2="100" y2="159" stroke={PLATE} strokeWidth="1.5" />
      <line x1="84" y1="167" x2="100" y2="167" stroke={PLATE} strokeWidth="1.5" />
      <line x1="84" y1="175" x2="100" y2="175" stroke={PLATE} strokeWidth="1.5" />
    </svg>
  );
}

function Tohoku() {
  return (
    <svg viewBox="0 0 140 200">
      <PoleBase />
      <MountArm canCx={100} canR={14} y={58} />
      <TransformerCan cx={100} cy={58} r={14} />
      {/* 東北電力のロゴ(模式化した丸バッジ)…変圧器の缶に貼られたロゴマーク */}
      <circle cx="94" cy="53" r="5" fill="#1a56b0" />
      <path d="M91 53 q3 -3 6 0" stroke="#fff" strokeWidth="1.2" fill="none" />
      <line x1="70" y1="95" x2="24" y2="182" stroke="var(--text-muted)" strokeWidth="2" />
      <use href="#mk-diamond" x="12" y="171" width="24" height="24" fill={GUYWIRE} />
      <rect x="72" y="156" width="40" height="16" rx="2" fill="var(--surface-2)" stroke={PLATE} strokeWidth="2" />
      <circle cx="79" cy="164" r="2" fill={PLATE} />
    </svg>
  );
}

function Tepco() {
  return (
    <svg viewBox="0 0 140 200">
      <Ground />
      <rect
        x="66"
        y="8"
        width="8"
        height="184"
        rx="3"
        fill="url(#pole-gradient)"
        stroke="var(--border-strong)"
        strokeWidth="0.5"
      />
      <rect
        x="38"
        y="28"
        width="64"
        height="6"
        rx="3"
        fill="url(#beam-gradient)"
        stroke="var(--border-strong)"
        strokeWidth="0.5"
      />
      <InsulatorSquareGlossy x={40} y={16} size={8} />
      <InsulatorSquareGlossy x={66} y={16} size={8} />
      <InsulatorSquareGlossy x={92} y={16} size={8} />
      {/* 絶縁体2〜3個(変圧器上部) */}
      <InsulatorGlossy cx={88} cy={38} r={2.2} />
      <InsulatorGlossy cx={95} cy={37} r={2.2} />
      <InsulatorGlossy cx={102} cy={38} r={2.2} />
      {/* 変圧器(缶)…横から見た円筒形、木の板の上に載る */}
      <ellipse cx="95" cy="44" rx="14" ry="4" fill="url(#pole-gradient)" stroke={TRANSFORMER} strokeWidth="2.5" />
      <rect x="81" y="44" width="28" height="24" rx="3" fill="url(#pole-gradient)" stroke={TRANSFORMER} strokeWidth="3" />
      {/* 木の板(この上に変圧器が載る・東京電力特有)…柱に重なるまで伸ばして浮いて見えないようにする */}
      <rect x="69" y="68" width="47" height="7" rx="1.5" fill="#8a5a2b" />
      {/* 板を支えるT字金具(柱から板を支持) */}
      <line x1="70" y1="71.5" x2="95" y2="71.5" stroke={TRANSFORMER} strokeWidth="3" />
      <line x1="95" y1="68" x2="95" y2="75" stroke={TRANSFORMER} strokeWidth="2" />
      {/* 支線(柱面から地面へ)。東京電力特有の支線ガードの記述はないため無地 */}
      <line x1="66" y1="96" x2="26" y2="184" stroke="var(--text-muted)" strokeWidth="2" />
      <rect x="82" y="150" width="24" height="36" rx="2" fill="#fff" stroke={PLATE} strokeWidth="2" />
      <line x1="86" y1="160" x2="102" y2="160" stroke={PLATE} strokeWidth="1.5" />
      <line x1="86" y1="170" x2="102" y2="170" stroke={PLATE} strokeWidth="1.5" />
      {/* 東電マーク(赤い社章)…柱に貼られた小さな赤いマーク */}
      <circle cx="70" cy="118" r="2.4" fill="#d23c3c" />
      <circle cx="66.5" cy="123" r="2.4" fill="#d23c3c" />
      <circle cx="73.5" cy="123" r="2.4" fill="#d23c3c" />
    </svg>
  );
}

function Chubu() {
  return (
    <svg viewBox="0 0 140 200">
      <PoleBase />
      <MountArm canCx={100} canR={13} y={58} />
      <TransformerCan cx={100} cy={58} r={13} />
      <polygon points="86,74 114,74 100,44" fill="none" stroke={TRANSFORMER} strokeWidth="2.5" />
      <line x1="82" y1="74" x2="118" y2="74" stroke={TRANSFORMER} strokeWidth="3" />
      <rect x="116" y="50" width="5" height="5" fill="#111" />
      <text x="100" y="61" fontSize="9" textAnchor="middle" fill={TRANSFORMER} fontWeight="700">
        15
      </text>
      <line x1="70" y1="95" x2="24" y2="182" stroke="var(--text-muted)" strokeWidth="2" />
      <rect x="10" y="168" width="26" height="18" rx="4" fill="url(#stripe-pattern)" stroke={GUYWIRE} strokeWidth="2" />
      <rect x="76" y="147" width="32" height="40" rx="12" fill="var(--surface-2)" stroke={PLATE} strokeWidth="2" />
      {/* 上部に入る中部電力ロゴ */}
      <circle cx="92" cy="156" r="3" fill={PLATE} />
    </svg>
  );
}

function Hokuriku() {
  return (
    <svg viewBox="0 0 140 200">
      <PoleBase />
      <MountArm canCx={100} canR={14} y={58} />
      <TransformerCan cx={100} cy={58} r={14} />
      <line x1="70" y1="95" x2="24" y2="182" stroke="var(--text-muted)" strokeWidth="2" />
      <use href="#mk-bottle" x="10" y="166" width="28" height="28" fill={GUYWIRE} />
      <path d="M14 172 q10 4 20 0" fill="none" stroke="#000" strokeOpacity=".4" strokeWidth="1.4" />
      <path d="M14 178 q10 4 20 0" fill="none" stroke="#000" strokeOpacity=".4" strokeWidth="1.4" />
      <rect x="70" y="158" width="38" height="16" rx="3" fill="var(--surface-2)" stroke={PLATE} strokeWidth="2" />
    </svg>
  );
}

function Kansai() {
  return (
    <svg viewBox="0 0 140 200">
      <Ground />
      <rect
        x="66"
        y="8"
        width="8"
        height="184"
        rx="3"
        fill="url(#pole-gradient)"
        stroke="var(--border-strong)"
        strokeWidth="0.5"
      />
      <line x1="38" y1="34" x2="70" y2="24" stroke="var(--baseline)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="70" y1="24" x2="102" y2="34" stroke="var(--baseline)" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="39" y1="32.7" x2="69" y2="23.3" stroke="var(--text-muted)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="71" y1="23.3" x2="101" y2="32.7" stroke="var(--text-muted)" strokeWidth="1.4" strokeLinecap="round" />
      <InsulatorGlossy cx={44} cy={24} r={5} />
      <InsulatorGlossy cx={70} cy={16} r={5} />
      <InsulatorGlossy cx={96} cy={24} r={5} />
      <MountArm canCx={100} canR={14} y={58} />
      <TransformerCan cx={100} cy={58} r={14} />
      <line x1="100" y1="72" x2="112" y2="90" stroke={TRANSFORMER} strokeWidth="2" />
      <line x1="70" y1="95" x2="24" y2="182" stroke="var(--text-muted)" strokeWidth="2" />
      {/* ボトル型+黒テープ螺旋巻きの支線ガード(北陸・四国と共通) */}
      <use href="#mk-bottle" x="12" y="171" width="24" height="24" fill={GUYWIRE} />
      <path d="M16 177 q10 4 20 0" fill="none" stroke="#000" strokeOpacity=".4" strokeWidth="1.4" />
      <path d="M16 183 q10 4 20 0" fill="none" stroke="#000" strokeOpacity=".4" strokeWidth="1.4" />
      <rect x="82" y="152" width="24" height="34" rx="2" fill="#fff" stroke={PLATE} strokeWidth="2" />
      <text x="94" y="172" fontSize="10" textAnchor="middle" fill={PLATE} fontWeight="700" writingMode="vertical-rl">
        カ
      </text>
    </svg>
  );
}

function Chugoku() {
  return (
    <svg viewBox="0 0 140 200">
      <PoleBase />
      <TransformerCan cx={100} cy={58} r={12} strokeWidth={2.5} />
      <line x1="74" y1="58" x2="110" y2="58" stroke={TRANSFORMER} strokeWidth="2.5" />
      <line x1="100" y1="48" x2="100" y2="68" stroke={TRANSFORMER} strokeWidth="2.5" />
      <polygon points="100,44 108,58 92,58" fill="none" stroke={TRANSFORMER} strokeWidth="2" />
      <circle cx="100" cy="66" r="3" fill="#c0392b" />
      <line x1="70" y1="95" x2="24" y2="182" stroke="var(--text-muted)" strokeWidth="2" />
      <circle cx="24" cy="178" r="11" fill="none" stroke={GUYWIRE} strokeWidth="3" />
      <rect x="80" y="148" width="26" height="36" rx="3" fill="var(--surface-2)" stroke={PLATE} strokeWidth="2" />
      <rect x="76" y="152" width="26" height="36" rx="3" fill="var(--surface-2)" stroke={PLATE} strokeWidth="1.5" opacity=".7" />
      {/* 上部に入るENERGIAロゴ */}
      <circle cx="93" cy="156" r="3" fill={PLATE} />
    </svg>
  );
}

function Shikoku() {
  return (
    <svg viewBox="0 0 140 200">
      <PoleBase />
      {/* L字型の腕金(四国電力の代名詞) */}
      <path d="M104 22 L120 22 L120 38" fill="none" stroke="var(--text-secondary)" strokeWidth="2.4" strokeLinejoin="miter" />
      <MountArm canCx={100} canR={13} y={58} />
      <TransformerCan cx={100} cy={58} r={13} />
      <path d="M100 71 L100 80 L114 80" fill="none" stroke={TRANSFORMER} strokeWidth="2.2" />
      <rect x="94" y="76" width="10" height="6" fill={TRANSFORMER} opacity=".5" />
      <line x1="70" y1="95" x2="24" y2="182" stroke="var(--text-muted)" strokeWidth="2" />
      {/* ボトル型+黒テープ螺旋巻きの支線ガード(関西・北陸と共通) */}
      <use href="#mk-bottle" x="12" y="171" width="24" height="24" fill={GUYWIRE} />
      <path d="M16 177 q10 4 20 0" fill="none" stroke="#000" strokeOpacity=".4" strokeWidth="1.4" />
      <path d="M16 183 q10 4 20 0" fill="none" stroke="#000" strokeOpacity=".4" strokeWidth="1.4" />
      <rect x="66" y="156" width="18" height="14" rx="2" fill="var(--surface-2)" stroke={PLATE} strokeWidth="1.6" />
      <rect x="87" y="156" width="18" height="14" rx="2" fill="var(--surface-2)" stroke={PLATE} strokeWidth="1.6" />
    </svg>
  );
}

function Kyushu() {
  return (
    <svg viewBox="0 0 140 200">
      <Ground />
      <rect
        x="66"
        y="8"
        width="8"
        height="184"
        rx="3"
        fill="url(#pole-gradient)"
        stroke="var(--border-strong)"
        strokeWidth="0.5"
      />
      <rect
        x="38"
        y="28"
        width="64"
        height="6"
        rx="3"
        fill="url(#beam-gradient)"
        stroke="var(--border-strong)"
        strokeWidth="0.5"
      />
      <InsulatorTriangleGlossy cx={44} />
      <InsulatorTriangleGlossy cx={70} />
      <InsulatorTriangleGlossy cx={96} />
      <circle cx="80" cy="46" r="2" fill={TRANSFORMER} />
      <circle cx="86" cy="46" r="2" fill={TRANSFORMER} />
      <MountArm canCx={100} canR={14} y={58} />
      <TransformerCan cx={100} cy={58} r={14} />
      <line x1="70" y1="95" x2="24" y2="182" stroke="var(--text-muted)" strokeWidth="2.4" />
      <rect x="82" y="150" width="22" height="38" rx="2" fill="var(--surface-2)" stroke={PLATE} strokeWidth="2.4" />
    </svg>
  );
}

function Okinawa() {
  return (
    <svg viewBox="0 0 140 200">
      <PoleBase />
      <MountArm canCx={100} canR={14} y={58} />
      <TransformerCan cx={100} cy={58} r={14} />
      <line x1="70" y1="95" x2="24" y2="182" stroke="var(--text-muted)" strokeWidth="2" />
      <rect x="10" y="168" width="26" height="18" rx="4" fill="url(#stripe-pattern)" stroke={GUYWIRE} strokeWidth="2" />
      <rect x="76" y="148" width="28" height="40" rx="2" fill="var(--surface-2)" stroke={PLATE} strokeWidth="1.8" />
      <line x1="80" y1="158" x2="100" y2="158" stroke={PLATE} strokeWidth="1" opacity=".5" />
      <line x1="80" y1="168" x2="100" y2="168" stroke={PLATE} strokeWidth="1" opacity=".5" />
      <text x="90" y="182" fontSize="8" textAnchor="middle" fill={PLATE} fontWeight="700">
        沖電
      </text>
    </svg>
  );
}

const DIAGRAMS: Record<string, ComponentType> = {
  hokkaido: Hokkaido,
  tohoku: Tohoku,
  tepco: Tepco,
  chubu: Chubu,
  hokuriku: Hokuriku,
  kansai: Kansai,
  chugoku: Chugoku,
  shikoku: Shikoku,
  kyushu: Kyushu,
  okinawa: Okinawa,
};

export function CompanyDiagram({ id }: { id: string }) {
  const Diagram = DIAGRAMS[id];
  if (!Diagram) return null;
  return <Diagram />;
}
