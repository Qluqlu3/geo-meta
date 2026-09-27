// 国道の路線番号標識(通称「おにぎり」)を模したオリジナルの模式図。
// 青地・白縁の逆おにぎり形に、上部の「国道」と大きな路線番号を載せる。
// 実物の寸法・書体の再現ではなく、番号を読む練習用の見た目。
export function RouteShield({ n, size = 64 }: { n: number | null; size?: number }) {
  const label = n === null ? "?" : String(n);
  const fontSize = label.length >= 3 ? 34 : 40;
  return (
    <svg className="route-shield" viewBox="0 0 100 92" width={size} height={size * 0.92} role="img" aria-label={`国道${label}号`}>
      <path
        d="M10 8 Q50 0 90 8 Q97 9.5 94 17 L58 84 Q50 95 42 84 L6 17 Q3 9.5 10 8 Z"
        fill="#1d4f9c"
        stroke="#fff"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M10 8 Q50 0 90 8 Q97 9.5 94 17 L58 84 Q50 95 42 84 L6 17 Q3 9.5 10 8 Z"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth="1"
      />
      <text x="50" y="25" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" letterSpacing="2">
        国道
      </text>
      <text x="50" y="58" textAnchor="middle" fontSize={fontSize} fontWeight="800" fill="#fff" letterSpacing="-1">
        {label}
      </text>
    </svg>
  );
}
