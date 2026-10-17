import { tomareByPrefecture, tomareTypeInfo } from "@/data/roadMarkings";
import { PrefectureMap, type PrefFeature } from "../PrefectureMap";

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
  return (
    <PrefectureMap label="都道府県別「止まれ」路面標示の字体タイプ地図" renderPrefecture={(f) => <Prefecture feature={f} />} />
  );
}
