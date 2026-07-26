import { type DiamondNote, diamondNotes, diamondSourceNote, diamondSources } from "@/data/roadMarkings";

// 菱形の頂点(上/右/下/左)。実物は横1.5m×縦5m程度で縦長のため、模式図も縦長比率にしている。
// viewBoxを菱形の実寸に近い縦長(22x40)にタイトに合わせることで、表示を大きくしたときに
// 余白ではなく菱形そのもの・切れ込みが大きく見えるようにしている。
const TOP = { x: 11, y: 3 };
const RIGHT = { x: 18, y: 20 };
const BOTTOM = { x: 11, y: 37 };
const LEFT = { x: 4, y: 20 };

function lerp(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

// 資料の線幅の記述(30cm/20cm程度/細めなど)を模式図のstrokeWidthに反映する
function strokeWidthFor(width: string): number {
  if (width.includes("30cm")) return 2.2;
  if (width.includes("20cm")) return 1.5;
  if (width.includes("細")) return 1.3;
  return 1.8;
}

// notches: 0=切れ込みなしの単純な菱形、1=上下の間に1箇所の切れ込み、4=各頂点付近に計4箇所の切れ込み
// (いずれも報道内容から読み取れる範囲のオリジナル模式図で、実物の正確なトレースではない)
function DiamondGlyph({ notches, strokeWidth }: { notches: 0 | 1 | 4; strokeWidth: number }) {
  const stroke = "var(--part-plate)";
  if (notches === 0) {
    return (
      <polygon
        points={`${TOP.x},${TOP.y} ${RIGHT.x},${RIGHT.y} ${BOTTOM.x},${BOTTOM.y} ${LEFT.x},${LEFT.y}`}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }
  if (notches === 1) {
    // 「∧」(上半分)と「∨」(下半分)を、左右の頂点ではっきり離して1箇所の隙間を作る
    const leftUp = lerp(LEFT, TOP, 0.16);
    const rightUp = lerp(RIGHT, TOP, 0.16);
    const leftDown = lerp(LEFT, BOTTOM, 0.16);
    const rightDown = lerp(RIGHT, BOTTOM, 0.16);
    return (
      <>
        <polyline
          points={`${leftUp.x},${leftUp.y} ${TOP.x},${TOP.y} ${rightUp.x},${rightUp.y}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        <polyline
          points={`${leftDown.x},${leftDown.y} ${BOTTOM.x},${BOTTOM.y} ${rightDown.x},${rightDown.y}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </>
    );
  }
  // notches === 4: 各辺を頂点手前ではっきり止め、4つの頂点それぞれに目立つ隙間を作る
  const edges: [{ x: number; y: number }, { x: number; y: number }][] = [
    [TOP, RIGHT],
    [RIGHT, BOTTOM],
    [BOTTOM, LEFT],
    [LEFT, TOP],
  ];
  return (
    <>
      {edges.map(([a, b]) => {
        const p1 = lerp(a, b, 0.24);
        const p2 = lerp(a, b, 0.76);
        return <line key={`${a.x}-${a.y}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={stroke} strokeWidth={strokeWidth} />;
      })}
    </>
  );
}

function DiamondItem({ note }: { note: DiamondNote }) {
  return (
    <div className="diamond-item">
      <svg viewBox="0 0 22 40" aria-hidden="true">
        <DiamondGlyph notches={note.notches} strokeWidth={strokeWidthFor(note.width)} />
      </svg>
      <span>
        <strong>{note.area}</strong>
        <br />
        {note.shape}(線幅目安: {note.width})
      </span>
    </div>
  );
}

export function DiamondShowcase() {
  return (
    <div>
      <div className="diamond-grid">
        {diamondNotes.map((note) => (
          <DiamondItem key={note.area} note={note} />
        ))}
      </div>
      <p className="diagram-caption" style={{ marginTop: 10, textAlign: "left" }}>
        {diamondSourceNote}
      </p>
      <ul className="source-list">
        {diamondSources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
