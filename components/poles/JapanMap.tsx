"use client";

import type { Company } from "@/data/companies";
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
  const colorByRegion = new Map(companies.map((c) => [c.id, c.colorVar]));
  const nameByRegion = new Map(companies.map((c) => [c.id, c.name]));

  return (
    <PrefectureMap
      label="日本の電力会社供給エリア地図(都道府県境入り)"
      renderPrefecture={(f) => (
        <Prefecture
          feature={f}
          colorVar={colorByRegion.get(f.region) ?? "--text-muted"}
          companyName={nameByRegion.get(f.region) ?? f.region}
        />
      )}
    />
  );
}
