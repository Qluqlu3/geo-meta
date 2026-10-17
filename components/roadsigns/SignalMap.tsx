import { signalOrientationByPrefecture, signalOrientationInfo } from "@/data/roadSigns";
import { PrefectureMap, type PrefFeature } from "../PrefectureMap";

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
  return <PrefectureMap label="都道府県別 信号機の縦型/横型タイプ地図" renderPrefecture={(f) => <Prefecture feature={f} />} />;
}
