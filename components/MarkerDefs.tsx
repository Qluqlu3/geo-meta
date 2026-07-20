// Shared <symbol>/<pattern> defs referenced via <use href="#mk-..."> in company diagrams.
export function MarkerDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="mk-triangle" viewBox="0 0 20 20">
          <polygon points="10,2 18,17 2,17" />
        </symbol>
        <symbol id="mk-circle" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" />
        </symbol>
        <symbol id="mk-diamond" viewBox="0 0 20 20">
          <polygon points="10,1 19,10 10,19 1,10" />
        </symbol>
        <symbol id="mk-bottle" viewBox="0 0 20 20">
          <path d="M8 1h4v5l3 3v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9l3-3z" />
        </symbol>
        <symbol id="mk-stripe" viewBox="0 0 20 20">
          <rect x="2" y="6" width="16" height="8" rx="4" />
        </symbol>
        <symbol id="mk-square" viewBox="0 0 20 20">
          <rect x="3" y="3" width="14" height="14" rx="2" />
        </symbol>
        <pattern id="stripe-pattern" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#1a1a19" />
          <rect width="4" height="8" fill="#f0b400" />
        </pattern>
        <linearGradient id="pole-gradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--baseline)" />
          <stop offset="0.45" stopColor="var(--text-muted)" />
          <stop offset="1" stopColor="var(--baseline)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
