import { ThemeToggle } from "../ThemeToggle";

export function RoadSignsHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <a className="brand" href="#top">
          <svg className="brand-mark" viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="12,3 21,19 3,19" fill="none" stroke="var(--rs-horizontal)" strokeWidth="2" />
            <line x1="12" y1="9" x2="12" y2="14" stroke="var(--text-secondary)" strokeWidth="2" />
            <circle cx="12" cy="16.5" r="0.9" fill="var(--text-secondary)" />
          </svg>
          <span>道路標識メタ図鑑</span>
        </a>
        <nav className="header-nav" aria-label="道路標識メタ ショートカット">
          <a href="#route-number">国道番号</a>
          <a href="#signal-map">信号機マップ</a>
          <a href="#signal-notes">信号機の強いネタ</a>
          <a href="#koan">公安委員会シール</a>
          <a href="#animal">動物注意標識</a>
          <a href="#chain">チェーン規制</a>
          <a href="#reference">参考程度</a>
          <a href="/">電柱メタ図鑑</a>
          <a href="/road-markings">路面標示メタ</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
