type Kind = "star" | "olive" | "balloon";

const COLOR: Record<Kind, string> = {
  star: "#caa000",
  olive: "#4f8a3d",
  balloon: "#d1495b",
};

const LABEL: Record<Kind, string> = {
  star: "合図",
  olive: "合図",
  balloon: "ウインカー",
};

// 5点星のポリゴン座標(外接半径14・内接半径5.5、中心20,17)を生成。
// ハードコードだと調整しづらいため、実際の道路標示に合わせて角度から算出している。
function starPoints(cx: number, cy: number, rOuter: number, rInner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const angle = (Math.PI / 180) * (-90 + i * 36);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

// オリジナルの模式アイコン(実際の路面標示の写真・正確な縮尺ではない)。
// 各標示は「図柄+文字」の組み合わせなので、アイコン側にも文字を必ず添える。
export function SpotlightIcon({ kind }: { kind: Kind }) {
  const color = COLOR[kind];
  return (
    <svg className="icon" viewBox="0 0 40 44" aria-hidden="true">
      {kind === "star" && <polygon points={starPoints(20, 16, 13, 5.2)} fill={color} />}
      {kind === "olive" && (
        <g transform="rotate(-18 20 16)">
          {/* オリーブの実: 上下が尖ったレンズ形(円ではなく先細り) */}
          <path d="M20 3 C25.5 6 28 12 28 17 C28 23 25.5 28 20 31 C14.5 28 12 23 12 17 C12 12 14.5 6 20 3 Z" fill={color} />
          <rect x="18.7" y="0" width="2.6" height="4.5" rx="1.2" fill={color} />
        </g>
      )}
      {kind === "balloon" && (
        <g transform="rotate(14 20 17)">
          {/* 気球本体: 上部が丸く下部がすぼまる釣鐘形 */}
          <path
            d="M20 2 C27 2 31.5 9 31.5 16 C31.5 22.5 28 27.5 23 29 L17 29 C12 27.5 8.5 22.5 8.5 16 C8.5 9 13 2 20 2 Z"
            fill={color}
          />
          {/* バスケットと吊りロープ */}
          <line x1="17.3" y1="29" x2="16" y2="34" stroke={color} strokeWidth="1.4" />
          <line x1="22.7" y1="29" x2="24" y2="34" stroke={color} strokeWidth="1.4" />
          <rect x="16" y="34" width="8" height="4.5" rx="0.8" fill="none" stroke={color} strokeWidth="1.4" />
        </g>
      )}
      <text x="20" y="41.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="var(--text-primary)">
        {LABEL[kind]}
      </text>
    </svg>
  );
}
