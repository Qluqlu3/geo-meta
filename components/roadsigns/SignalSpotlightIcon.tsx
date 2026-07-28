type Kind = "no-hood" | "flash";

// オリジナルの模式アイコン(実際の信号機の写真・正確な縮尺ではない)。
// 「no-hood」は庇の有無を左右で比較、「flash」は一灯点滅式信号機を表現している。
export function SignalSpotlightIcon({ kind }: { kind: Kind }) {
  if (kind === "no-hood") {
    return (
      <svg className="icon" viewBox="0 0 100 48" aria-hidden="true">
        {/* 左: 庇(ひさし)付きの従来型 */}
        <g transform="translate(6,4)">
          <rect x="-4" y="-4" width="38" height="8" rx="2" fill="var(--text-muted)" />
          <rect x="0" y="4" width="30" height="30" rx="6" fill="none" stroke="var(--text-secondary)" strokeWidth="2" />
          {["#e2483d", "#e0b400", "#1f9d55"].map((c, i) => (
            <circle key={c} cx={15} cy={11 + i * 8.5} r="3.1" fill={c} />
          ))}
          <text x="15" y="46" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="var(--text-muted)">
            庇あり(旧)
          </text>
        </g>
        {/* 右: 庇なしの薄型(フラット型) */}
        <g transform="translate(58,4)">
          <rect
            x="0"
            y="4"
            width="30"
            height="26"
            rx="5"
            fill="none"
            stroke="var(--rs-horizontal, var(--part-transformer))"
            strokeWidth="2"
          />
          {["#e2483d", "#e0b400", "#1f9d55"].map((c, i) => (
            <circle key={c} cx={15} cy={11 + i * 7.5} r="3" fill={c} />
          ))}
          <text x="15" y="46" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="var(--part-transformer)">
            庇なし(新)
          </text>
        </g>
        <path d="M40 18 L54 18" stroke="var(--text-muted)" strokeWidth="1.6" markerEnd="url(#rs-arrow)" />
        <defs>
          <marker id="rs-arrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--text-muted)" />
          </marker>
        </defs>
      </svg>
    );
  }

  return (
    <svg className="icon" viewBox="0 0 40 46" aria-hidden="true">
      <rect x="12" y="4" width="16" height="16" rx="4" fill="none" stroke="var(--text-secondary)" strokeWidth="2" />
      <circle cx="20" cy="12" r="4.6" fill="var(--part-transformer)" />
      <circle
        cx="20"
        cy="12"
        r="8.4"
        fill="none"
        stroke="var(--part-transformer)"
        strokeWidth="1.4"
        opacity="0.55"
        strokeDasharray="2.5 3"
      />
      <circle
        cx="20"
        cy="12"
        r="12"
        fill="none"
        stroke="var(--part-transformer)"
        strokeWidth="1.2"
        opacity="0.3"
        strokeDasharray="2.5 3.5"
      />
      <line x1="20" y1="20" x2="20" y2="30" stroke="var(--text-muted)" strokeWidth="2" />
      <text x="20" y="41" textAnchor="middle" fontSize="7" fontWeight="700" fill="var(--text-primary)">
        1灯点滅
      </text>
    </svg>
  );
}
