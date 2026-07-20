import type { Company } from "@/data/companies";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ companies }: { companies: Company[] }) {
  return (
    <header className="site-header">
      <div className="container">
        <a className="brand" href="#top">
          <svg className="brand-mark" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="10.5" y="2" width="3" height="20" rx="1" fill="var(--c-kansai)" />
            <line x1="3" y1="8" x2="21" y2="8" stroke="var(--text-secondary)" strokeWidth="2" />
            <line x1="4" y1="20" x2="9" y2="10" stroke="var(--text-muted)" strokeWidth="1.6" />
            <circle cx="4" cy="20" r="1.8" fill="var(--c-tepco)" />
          </svg>
          <span>電柱メタ図鑑</span>
        </a>
        <nav className="header-nav" aria-label="電力会社ショートカット">
          <a href="#map-section">地図</a>
          <a href="#compare">比較表</a>
          {companies.map((c) => (
            <a key={c.id} href={`#${c.id}`}>
              <span className="dot" style={{ background: `var(${c.colorVar})` }} />
              {c.name}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
