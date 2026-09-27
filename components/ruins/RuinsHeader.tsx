import { ThemeToggle } from "../ThemeToggle";

// 地域見分けメタ(電柱・路面標示・道路標識)とは動線を分けるため、ナビには
// 廃墟アーカイブ内の見出しとサイトマップだけを置き、メタ図鑑への直リンクは持たない。
export function RuinsHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <a className="brand" href="#top">
          <svg className="brand-mark" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 11 12 4l8 7" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinejoin="round" />
            <path
              d="M6 10v10h4v-5h2l1-2 1 3v4h4V10"
              fill="none"
              stroke="var(--rn-haikyo)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="m13 13 1.5-2.5" stroke="var(--text-muted)" strokeWidth="1.4" />
          </svg>
          <span>廃墟アーカイブ</span>
        </a>
        <nav className="header-nav" aria-label="廃墟アーカイブ ショートカット">
          <a href="#explorer">新旧比較マップ</a>
          <a href="#database">データベース</a>
          <a href="#method">探し方</a>
          <a href="#symbols">消えた寺社記号</a>
          <a href="#layers">比較できる年代</a>
          <a href="#caution">注意事項</a>
          <a href="/sitemap">サイトマップ</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
