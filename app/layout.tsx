import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "地域見分けメタ図鑑 / 廃墟アーカイブ",
  description: "GeoGuessr向けの地域見分けメタ図鑑と、首都圏・静岡の廃墟アーカイブの2系統のページ一覧。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
