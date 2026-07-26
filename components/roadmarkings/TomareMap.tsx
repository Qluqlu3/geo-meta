import prefData from "@/data/japanPrefectures.json";
import { tomareByPrefecture, tomareTypeInfo } from "@/data/roadMarkings";

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

function Prefecture({ feature }: { feature: PrefFeature }) {
  const type = tomareByPrefecture.get(feature.nameJa);
  const info = type ? tomareTypeInfo[type] : undefined;
  return (
    <path
      d={feature.d}
      className="map-region"
      fill={info ? `var(${info.colorVar})` : "var(--text-muted)"}
      style={{ cursor: "default" }}
    >
      <title>{`${feature.nameJa} — ${info?.label ?? "不明"}`}</title>
    </path>
  );
}

// 電柱メタの JapanMap と同じ都道府県境界データを使い回すが、色分けの軸は
// 電力会社(region)ではなく「止まれ」字体タイプ(都道府県別)。
export function TomareMap() {
  const { width, height, inset, prefectures } = DATA;

  return (
    // biome-ignore lint/a11y/useSemanticElements: this is a map graphic, not a form group; <fieldset> doesn't apply
    <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label="都道府県別「止まれ」路面標示の字体タイプ地図">
      {prefectures
        .filter((f) => !f.inset)
        .map((f) => (
          <Prefecture key={f.prefId} feature={f} />
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
              <Prefecture key={f.prefId} feature={f} />
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
