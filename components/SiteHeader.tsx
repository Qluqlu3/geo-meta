import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

// 全ページ共通のヘッダー枠。ナビには自系統内のリンクだけを置き、系統をまたぐ移動は
// /sitemap に任せる(PLAN.md「動線の分離」)。mark は 24x24 の viewBox に描くロゴの中身。
export function SiteHeader({
  title,
  mark,
  navLabel,
  children,
}: {
  title: string;
  mark?: ReactNode;
  navLabel: string;
  children: ReactNode;
}) {
  return (
    <header className="site-header">
      <div className="container">
        <a className="brand" href="#top">
          {mark && (
            <svg className="brand-mark" viewBox="0 0 24 24" aria-hidden="true">
              {mark}
            </svg>
          )}
          <span>{title}</span>
        </a>
        <nav className="header-nav" aria-label={navLabel}>
          {children}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
