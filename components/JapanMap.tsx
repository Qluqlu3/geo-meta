"use client";

import type { Company } from "@/data/companies";
import prefData from "@/data/japanPrefectures.json";

type PrefFeature = {
  prefId: number;
  nameJa: string;
  region: string;
  d: string;
  inset?: boolean;
};

const DATA = prefData as {
  width: number;
  height: number;
  inset: { x: number; y: number; w: number; h: number };
  prefectures: PrefFeature[];
};

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
  const { width, height, inset, prefectures } = DATA;

  return (
    // biome-ignore lint/a11y/useSemanticElements: this is a map graphic, not a form group; <fieldset> doesn't apply
    <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label="日本の電力会社供給エリア地図(都道府県境入り)">
      {prefectures
        .filter((f) => !f.inset)
        .map((f) => (
          <Prefecture
            key={f.prefId}
            feature={f}
            colorVar={colorByRegion.get(f.region) ?? "--text-muted"}
            companyName={nameByRegion.get(f.region) ?? f.region}
          />
        ))}
      <rect
        x={inset.x + 0.5}
        y={inset.y + 0.5}
        width={inset.w - 1}
        height={inset.h - 1}
        fill="none"
        stroke="var(--text-muted)"
        strokeDasharray="4 3"
        pointerEvents="none"
      />
      <g transform={`translate(${inset.x}, ${inset.y})`}>
        <g transform="translate(8, 8)">
          {prefectures
            .filter((f) => f.inset)
            .map((f) => (
              <Prefecture
                key={f.prefId}
                feature={f}
                colorVar={colorByRegion.get(f.region) ?? "--text-muted"}
                companyName={nameByRegion.get(f.region) ?? f.region}
              />
            ))}
        </g>
      </g>
      <text
        x={inset.x + inset.w / 2}
        y={inset.y + inset.h - 6}
        className="map-label"
        style={{ fill: "var(--text-muted)", stroke: "none", fontWeight: 700, fontSize: "7.5px" }}
      >
        沖縄(別枠・主島のみ簡略表示)
      </text>
    </svg>
  );
}
