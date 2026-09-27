import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "サイトマップ | 地域見分けメタ図鑑 / 廃墟アーカイブ",
  description: "GeoGuessr向けの地域見分けメタ図鑑と、首都圏・静岡の廃墟アーカイブの2系統のページ一覧。",
};

type Page = { href: string; title: string; desc: string; anchors: { id: string; label: string }[] };

// このサイトは目的の異なる2系統に分かれている。系統をまたぐリンクはこのページだけに置き、
// 各ページのヘッダーは自系統内の移動に絞る。
const TRACKS: { id: string; title: string; lead: string; pages: Page[] }[] = [
  {
    id: "meta",
    title: "地域見分けメタ図鑑(GeoGuessr)",
    lead: "ストリートビューに写る設備の見た目から、日本のどの地域かを絞り込むためのリファレンス。",
    pages: [
      {
        href: "/",
        title: "電柱メタ図鑑",
        desc: "支線プレート・変圧器・番号プレートの形や色から、10電力会社(≒地域)を見分ける。",
        anchors: [
          { id: "map-section", label: "供給エリア地図" },
          { id: "compare", label: "早見比較表" },
          { id: "companies", label: "電力会社別ガイド" },
        ],
      },
      {
        href: "/road-markings",
        title: "路面標示メタ図鑑(β)",
        desc: "「止まれ」の字体、ダイヤマークの形、ウインカー促進標示など、路面にペイントされた標示の地域差。",
        anchors: [
          { id: "map-section", label: "「止まれ」字体マップ" },
          { id: "spotlights", label: "ウインカー促進標示" },
          { id: "diamond", label: "ダイヤマーク" },
          { id: "snow-pipe", label: "消雪パイプ" },
        ],
      },
      {
        href: "/road-signs",
        title: "道路標識メタ図鑑(β)",
        desc: "国道番号、信号機の縦型/横型、公安委員会シール、動物注意標識など、標識・信号機の地域差。",
        anchors: [
          { id: "route-number", label: "国道番号" },
          { id: "signal-map", label: "信号機マップ" },
          { id: "koan", label: "公安委員会シール" },
          { id: "animal", label: "動物注意標識" },
          { id: "chain", label: "チェーン規制" },
        ],
      },
    ],
  },
  {
    id: "ruins",
    title: "廃墟アーカイブ(首都圏・静岡・β)",
    lead: "2010年より前の空中写真・旧版地形図と現在の地図を見比べ、埋もれた廃墟・廃集落・廃寺社を緯度経度で記録するデータベース。",
    pages: [
      {
        href: "/ruins",
        title: "廃墟アーカイブ(首都圏・静岡)",
        desc: "1都7県と静岡県の廃墟・廃集落・廃寺・廃神社。新旧比較マップで候補を探して記録できる。旧版地形図から消えた寺社記号の自動検出も。",
        anchors: [
          { id: "explorer", label: "新旧比較マップ" },
          { id: "database", label: "データベース" },
          { id: "method", label: "探し方" },
          { id: "symbols", label: "消えた寺社記号" },
          { id: "layers", label: "比較できる年代" },
          { id: "caution", label: "注意事項" },
        ],
      },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <a className="brand" href="#top">
            <span>サイトマップ</span>
          </a>
          <nav className="header-nav" aria-label="系統">
            {TRACKS.map((t) => (
              <a key={t.id} href={`#${t.id}`}>
                {t.title}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main id="main">
        <div className="container">
          <section className="hero" id="top">
            <h1>サイトマップ</h1>
            <p>このサイトは目的の異なる2つの系統に分かれています。それぞれの系統の中でページを行き来できます。</p>
          </section>
          <div className="sitemap-tracks">
            {TRACKS.map((t) => (
              <section key={t.id} id={t.id} className="sitemap-track">
                <h2 className="section-title">{t.title}</h2>
                <p className="section-sub">{t.lead}</p>
                <ul className="sitemap-pages">
                  {t.pages.map((p) => (
                    <li key={p.href}>
                      <a className="sitemap-page-link" href={p.href}>
                        {p.title}
                      </a>
                      <p>{p.desc}</p>
                      <div className="area-tags">
                        {p.anchors.map((a) => (
                          <a key={a.id} href={`${p.href}#${a.id}`}>
                            {a.label}
                          </a>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>
      <footer>
        <div className="container">
          <p>各ページの出典・利用条件は、それぞれのページのフッターを参照してください。</p>
        </div>
      </footer>
    </>
  );
}
