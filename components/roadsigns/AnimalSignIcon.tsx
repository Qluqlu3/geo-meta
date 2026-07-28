import type { AnimalIconKind } from "@/data/roadSigns";

// 動物注意警戒標識(黄色ひし形+黒シルエット)を模したオリジナルの模式図。
// 実際の標識の正確なトレースではなく、体形・特徴的なパーツ(角・くちばし等)の
// 違いを分かりやすくするための簡略化したシルエット。
function AnimalGlyph({ kind }: { kind: AnimalIconKind }) {
  const fill = "#1a1a1a";
  switch (kind) {
    case "deer":
      return (
        <g fill={fill}>
          <ellipse cx="17" cy="24" rx="7.5" ry="4.4" />
          <rect x="20.5" y="14" width="2.6" height="9" rx="1.2" transform="rotate(18 21.8 18.5)" />
          <circle cx="26.5" cy="15.5" r="3.1" />
          <path
            d="M27 12.5 L30 6.5 M27 12.5 L31 9.5 M25.5 12 L27 5.5 M25.5 12 L29 8"
            stroke={fill}
            strokeWidth="1.1"
            fill="none"
          />
          {[11, 15, 20, 24].map((x, i) => (
            <rect key={x} x={x} y="27" width="1.6" height={i % 2 === 0 ? 7 : 6} rx="0.6" />
          ))}
        </g>
      );
    case "bear":
      return (
        <g fill={fill}>
          <ellipse cx="19" cy="25" rx="10" ry="6" />
          <circle cx="10.5" cy="18" r="4.6" />
          <circle cx="7.6" cy="14.3" r="1.6" />
          <circle cx="12.6" cy="14.3" r="1.6" />
          {[10, 15, 22, 27].map((x) => (
            <rect key={x} x={x} y="29" width="2.2" height="5.5" rx="1" />
          ))}
        </g>
      );
    case "stork":
      return (
        <g fill={fill}>
          <ellipse cx="19" cy="17" rx="6.5" ry="4.2" />
          <path d="M25 16 Q30 13 33 9" stroke={fill} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <rect x="17.5" y="20" width="1.6" height="11" rx="0.6" />
          <rect x="22" y="20" width="1.6" height="11" rx="0.6" transform="rotate(8 22.8 25.5)" />
        </g>
      );
    case "yanbaru":
      return (
        <g fill={fill}>
          <ellipse cx="19" cy="21" rx="8.5" ry="6.5" />
          <path d="M27 19 L32 16.5 L27 21.5 Z" />
          <rect x="16" y="27" width="1.8" height="6" rx="0.7" />
          <rect x="21" y="27" width="1.8" height="6" rx="0.7" />
          <path d="M11 17 Q9 14 12 12" stroke={fill} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>
      );
    case "goat":
      return (
        <g fill={fill}>
          <ellipse cx="18" cy="24" rx="8" ry="4.6" />
          <circle cx="26" cy="17" r="3.4" />
          <path
            d="M25 14 Q27 10 24 7.5 M27.5 14 Q30.5 11 28.5 8"
            stroke={fill}
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M23.5 20 L21.5 24" stroke={fill} strokeWidth="1.2" strokeLinecap="round" />
          {[10, 14, 21, 25].map((x) => (
            <rect key={x} x={x} y="27" width="1.7" height="6.5" rx="0.6" />
          ))}
        </g>
      );
    default:
      return null;
  }
}

export function AnimalSignIcon({ kind, flip }: { kind: AnimalIconKind; flip?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <polygon points="20,2 38,20 20,38 2,20" fill="#f2c400" stroke="#1a1a1a" strokeWidth="2" />
      <g transform={flip ? "scale(-1,1) translate(-40,0)" : undefined}>
        <AnimalGlyph kind={kind} />
      </g>
    </svg>
  );
}
