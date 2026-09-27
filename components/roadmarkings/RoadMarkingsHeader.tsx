import { ThemeToggle } from "../ThemeToggle";

export function RoadMarkingsHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <a className="brand" href="#top">
          <svg className="brand-mark" viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="12,2 21,12 12,22 3,12" fill="none" stroke="var(--rm-tokyo)" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="16" stroke="var(--text-secondary)" strokeWidth="2" />
          </svg>
          <span>路面標示メタ図鑑</span>
        </a>
        <nav className="header-nav" aria-label="路面標示メタ ショートカット">
          <a href="#map-section">字体マップ</a>
          <a href="#spotlights">強いネタ</a>
          <a href="#diamond">ダイヤマーク</a>
          <a href="#snow-pipe">消雪パイプ</a>
          <a href="#reference">参考程度</a>
          <a href="/poles">電柱メタ図鑑</a>
          <a href="/road-signs">道路標識メタ</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
