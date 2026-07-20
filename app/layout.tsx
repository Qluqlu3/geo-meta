import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "日本電柱メタ図鑑 | GeoGuessr 電力会社 見分け方ガイド",
  description:
    "GeoGuessr日本メタ:電柱・支線プレート・変圧器の形や色から10電力会社を見分けるための図鑑。電力会社別に識別ポイントをまとめています。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
