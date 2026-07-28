// チェーン規制標識(タイヤ+チェーンのピクトグラム)を模したオリジナルの簡易アイコン。
export function ChainSignIcon() {
  return (
    <svg className="icon" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#1a4fa0" stroke="var(--text-secondary)" strokeWidth="1" />
      <circle cx="20" cy="20" r="10" fill="none" stroke="#fff" strokeWidth="3.4" />
      <circle cx="20" cy="20" r="4" fill="none" stroke="#fff" strokeWidth="2" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (Math.PI / 4) * i;
        const x1 = 20 + 6.5 * Math.cos(angle);
        const y1 = 20 + 6.5 * Math.sin(angle);
        const x2 = 20 + 13.5 * Math.cos(angle);
        const y2 = 20 + 13.5 * Math.sin(angle);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="1.6" />;
      })}
    </svg>
  );
}
