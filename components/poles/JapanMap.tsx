"use client";

import { type Company, isCompanyId } from "@/data/companies";
import { PrefectureMap, type PrefFeature } from "../PrefectureMap";

function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Prefecture({ feature, colorVar, companyName }: { feature: PrefFeature; colorVar: string; companyName: string }) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: scroll-jump map region, not a real navigation link; role+onKeyDown already give it link-like keyboard behavior
    <path
      d={feature.d}
      className="map-region"
      tabIndex={0}
      role="link"
      aria-label={`${companyName}エリアへ(${feature.nameJa})`}
      fill={`var(${colorVar})`}
      onClick={() => jumpTo(feature.region)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          jumpTo(feature.region);
        }
      }}
    >
      <title>{`${feature.nameJa} — ${companyName}`}</title>
    </path>
  );
}

export function JapanMap({ companies }: { companies: Company[] }) {
  const companyById = new Map(companies.map((c) => [c.id, c]));
  // 地図データ(JSON)の region は文字列なので、CompanyId か確かめてから引く。
  const companyOf = (region: string) => (isCompanyId(region) ? companyById.get(region) : undefined);

  return (
    <PrefectureMap
      label="日本の電力会社供給エリア地図(都道府県境入り)"
      renderPrefecture={(f) => {
        const company = companyOf(f.region);
        return <Prefecture feature={f} colorVar={company?.colorVar ?? "--text-muted"} companyName={company?.name ?? f.region} />;
      }}
    />
  );
}
