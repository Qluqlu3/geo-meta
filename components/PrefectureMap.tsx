import { Fragment, type ReactNode } from "react";
import prefData from "@/data/japanPrefectures.json";

export type PrefFeature = {
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

// 電柱・「止まれ」・信号機・国道の各地図で共通の都道府県境界SVG。沖縄は別枠(破線枠)に
// 置く。県ごとの塗り分け・クリック動作は renderPrefecture で呼び出し側が決める。
export function PrefectureMap({
  label,
  renderPrefecture,
}: {
  label: string;
  renderPrefecture: (feature: PrefFeature) => ReactNode;
}) {
  const { width, height, inset, prefectures } = DATA;
  const render = (f: PrefFeature) => <Fragment key={f.prefId}>{renderPrefecture(f)}</Fragment>;

  return (
    // biome-ignore lint/a11y/useSemanticElements: this is a map graphic, not a form group; <fieldset> doesn't apply
    <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label={label}>
      {prefectures.filter((f) => !f.inset).map(render)}
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
        <g transform="translate(8, 8)">{prefectures.filter((f) => f.inset).map(render)}</g>
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
