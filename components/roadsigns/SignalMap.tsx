import prefData from "@/data/japanPrefectures.json";
import { signalOrientationByPrefecture, signalOrientationInfo } from "@/data/roadSigns";

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
  const type = signalOrientationByPrefecture.get(feature.nameJa);
  const info = type ? signalOrientationInfo[type] : undefined;
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

// 電柱メタ・路面標示メタと同じ都道府県境界データを使い回すが、色分けの軸は
// 信号機の縦型/横型タイプ(都道府県別)。
export function SignalMap() {
  const { width, height, inset, prefectures } = DATA;

  return (
    // biome-ignore lint/a11y/useSemanticElements: this is a map graphic, not a form group; <fieldset> doesn't apply
    <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label="都道府県別 信号機の縦型/横型タイプ地図">
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
