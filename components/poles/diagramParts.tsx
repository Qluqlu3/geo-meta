// 会社別の模式図(CompanyDiagram)で共通に使う部品と部位色。電柱本体・腕金・がいし・
// 変圧器の缶など、どの会社の図にも出てくるものをここに置く。

export const GUYWIRE = "var(--part-guywire)";
export const TRANSFORMER = "var(--part-transformer)";
export const PLATE = "var(--part-plate)";
const INSULATOR = "var(--part-insulator)";

export function Ground() {
  return <ellipse cx="70" cy="193" rx="24" ry="3.5" fill="#000" opacity=".18" />;
}

// がいし(碍子)の共通パーツ。単色の円に加え、左上に半透明の白いハイライトを
// 重ねてつや(グロス感)を出す。INSULATOR色はテーマごとに変わるため、色そのものを
// 変えずに白の半透明レイヤーを重ねる方式でどのテーマでも安全に光沢を表現する。
export function InsulatorGlossy({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={INSULATOR} />
      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.35} rx={r * 0.4} ry={r * 0.28} fill="#fff" opacity=".35" />
    </>
  );
}

// 東京電力の四角めのがいし用。InsulatorGlossyの角丸長方形版。
export function InsulatorSquareGlossy({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <>
      <rect x={x} y={y} width={size} height={size} rx={size * 0.18} fill={INSULATOR} />
      <ellipse cx={x + size * 0.32} cy={y + size * 0.3} rx={size * 0.22} ry={size * 0.16} fill="#fff" opacity=".35" />
    </>
  );
}

// 九州電力の三角めのがいし用。InsulatorGlossyの三角形版。
export function InsulatorTriangleGlossy({ cx }: { cx: number }) {
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
export function TransformerCan({
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
export function MountArm({ canCx, canR, y, poleEdge = 74 }: { canCx: number; canR: number; y: number; poleEdge?: number }) {
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

export function PoleBase() {
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
