import type { ReactNode } from "react";

// 全ページ共通のフッター枠。各ページのフッターから系統をまたぐ案内(/sitemap)へ戻れるようにする。
export function SiteFooter({ children, sitemapLink = true }: { children: ReactNode; sitemapLink?: boolean }) {
  return (
    <footer>
      <div className="container">
        {children}
        {sitemapLink && (
          <p>
            <a href="/sitemap">サイトマップ</a>
          </p>
        )}
      </div>
    </footer>
  );
}
