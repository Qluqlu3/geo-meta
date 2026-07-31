import type { BollardKind } from "@/data/landscape";

// ボラード(視線誘導標)を正面から見た様子を模したオリジナルの模式図。
// 実物の正確な縮尺・書体ではなく、資料から読み取れる縞模様・反射板の形状/色の
// 傾向を分かりやすくするための簡略化した図。
function BollardGlyph({ kind }: { kind: BollardKind }) {
  switch (kind) {
    case "hokkaido":
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="13" y={8 + i * 8} width="14" height="8" fill={i % 2 === 0 ? "#d63b2f" : "#f5f5f5"} />
          ))}
          <g transform="translate(28,10)">
            <rect x="0" y="0" width="6" height="6" fill="#e0e0e0" stroke="#8a8a8a" strokeWidth="0.8" />
            <rect x="0" y="9" width="6" height="6" fill="#e0e0e0" stroke="#8a8a8a" strokeWidth="0.8" />
            <text x="3" y="24" textAnchor="middle" fontSize="4.6" fill="var(--text-muted)">
              or 連続設置
            </text>
          </g>
        </g>
      );
    case "aomori":
      return (
        <g>
          <rect x="13" y="8" width="14" height="32" fill="#f7f7f7" />
          <circle cx="20" cy="16" r="4.2" fill="#fff" stroke="#8a8a8a" strokeWidth="1" />
          <rect x="13" y="26" width="14" height="3.2" fill="#f2c400" />
          <rect x="13" y="33" width="14" height="3.2" fill="#f2c400" />
        </g>
      );
    case "akita":
      return (
        <g>
          <rect x="13" y="8" width="14" height="32" fill="#f7f7f7" />
          <polygon
            points="20,10.5 24.2,12.8 24.2,17.4 20,19.7 15.8,17.4 15.8,12.8"
            fill="#fff"
            stroke="#8a8a8a"
            strokeWidth="1"
          />
          <rect x="13" y="30" width="14" height="2.6" fill="#f2c400" />
          <rect x="13" y="34.4" width="14" height="2.6" fill="#f2c400" />
        </g>
      );
    case "toyama":
      return (
        <g>
          <rect x="13" y="8" width="14" height="32" fill="#f7f7f7" />
          <rect x="27" y="15.5" width="7" height="2.6" fill="#fff" stroke="#8a8a8a" strokeWidth="0.8" />
          <text x="36" y="17.6" fontSize="4.4" fill="var(--text-muted)">
            水平
          </text>
          <rect x="13" y="34" width="14" height="3.2" fill="#d63b2f" />
        </g>
      );
    case "chugoku":
      return (
        <g>
          <rect x="13" y="8" width="14" height="32" fill="#f7f7f7" />
          <rect x="13" y="14" width="14" height="2.6" fill="#d63b2f" />
          <circle cx="20" cy="24" r="4.6" fill="#fff" stroke="#8a8a8a" strokeWidth="1" />
        </g>
      );
    case "shikoku":
      return (
        <g>
          <rect x="13" y="8" width="14" height="32" fill="#f7f7f7" />
          <circle cx="20" cy="18" r="4.2" fill="#fff" stroke="#8a8a8a" strokeWidth="1" />
          <rect x="13" y="24" width="14" height="2.8" fill="#1a1a1a" />
        </g>
      );
    case "kyushu":
      return (
        <g>
          <rect x="13" y="8" width="14" height="32" fill="#f7f7f7" />
          <rect x="14.5" y="12" width="11" height="6.5" fill="#f28c1a" />
          <rect x="24" y="12" width="1.5" height="6.5" fill="#fff" />
          <rect x="13" y="30" width="14" height="4" fill="#2f9e44" />
        </g>
      );
    default:
      return null;
  }
}

export function BollardIcon({ kind }: { kind: BollardKind }) {
  return (
    <svg className="icon" viewBox="0 0 46 64" aria-hidden="true">
      <rect x="12" y="7" width="16" height="34" rx="2" fill="none" stroke="var(--border-strong)" strokeWidth="1.2" />
      <BollardGlyph kind={kind} />
      <rect x="18" y="41" width="4" height="14" fill="var(--text-muted)" />
      <ellipse cx="20" cy="57" rx="11" ry="3" fill="var(--border)" opacity="0.6" />
    </svg>
  );
}
