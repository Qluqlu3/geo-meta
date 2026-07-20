import { AppShell } from "@/components/AppShell";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MarkerDefs } from "@/components/MarkerDefs";
import { companies } from "@/data/companies";

export default function Home() {
  return (
    <>
      <MarkerDefs />
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>
      <Header companies={companies} />
      <main id="main">
        <div className="container">
          <AppShell companies={companies} />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
