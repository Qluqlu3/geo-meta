import prefData from "@/data/japanPrefectures.json";

type PrefFeature = {
  prefId: number;
  nameJa: string;
  d: string;
  inset?: boolean;
};

const DATA = prefData as {
  width: number;
  height: number;
  inset: { x: number; y: number; w: number; h: number };
  prefectures: PrefFeature[];
};

// 電柱メタ・「止まれ」マップと同じ都道府県境界データを使い、選択中の国道が通過する
// 都道府県だけを塗る。県をクリックすると「その県を通る国道」の逆引きに切り替わる。
export function RouteMap({
  passing,
  picked,
  onPick,
  label,
}: {
  passing: ReadonlySet<number>;
  picked: number | null;
  onPick: (prefId: number) => void;
  label: string;
}) {
  const { width, height, inset, prefectures } = DATA;

  const region = (f: PrefFeature) => {
    const hit = passing.has(f.prefId);
    return (
      // biome-ignore lint/a11y/useSemanticElements: an SVG <path> can't be a <button>; role+tabIndex+key handler give it button semantics
      <path
        key={f.prefId}
        d={f.d}
        className={`map-region route-map-region${hit ? " hit" : ""}${picked === f.prefId ? " picked" : ""}`}
        role="button"
        tabIndex={0}
        aria-pressed={picked === f.prefId}
        aria-label={`${f.nameJa}${hit ? "(通過)" : ""}を通る国道を一覧`}
        onClick={() => onPick(f.prefId)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPick(f.prefId);
          }
        }}
      >
        <title>{f.nameJa}</title>
      </path>
    );
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: this is a map graphic, not a form group; <fieldset> doesn't apply
    <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label={label}>
      {prefectures.filter((f) => !f.inset).map(region)}
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
        <g transform="translate(8, 8)">{prefectures.filter((f) => f.inset).map(region)}</g>
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
