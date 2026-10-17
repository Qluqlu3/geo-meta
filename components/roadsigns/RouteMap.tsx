import { PrefectureMap, type PrefFeature } from "../PrefectureMap";

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
  const region = (f: PrefFeature) => {
    const hit = passing.has(f.prefId);
    return (
      // biome-ignore lint/a11y/useSemanticElements: an SVG <path> can't be a <button>; role+tabIndex+key handler give it button semantics
      <path
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

  return <PrefectureMap label={label} renderPrefecture={region} />;
}
