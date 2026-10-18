import type { Metadata } from "next";
import { BackToTop } from "@/components/BackToTop";
import { AppShell } from "@/components/poles/AppShell";
import { MarkerDefs } from "@/components/poles/MarkerDefs";
import { PolesFooter } from "@/components/poles/PolesFooter";
import { PolesHeader } from "@/components/poles/PolesHeader";
import { companies } from "@/data/companies";

export const metadata: Metadata = {
  title: "日本電柱メタ図鑑 | GeoGuessr 電力会社 見分け方ガイド",
  description:
    "GeoGuessr日本メタ:電柱・支線プレート・変圧器の形や色から10電力会社を見分けるための図鑑。電力会社別に識別ポイントをまとめています。",
};

export default function PolesPage() {
  return (
    <>
      <MarkerDefs />
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>
      <PolesHeader companies={companies} />
      <main id="main">
        <div className="container">
          <AppShell companies={companies} />
        </div>
      </main>
      <PolesFooter />
      <BackToTop />
    </>
  );
}
