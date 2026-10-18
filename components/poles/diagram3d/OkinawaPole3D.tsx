import { GuyWire, GWCapGeneric, PLATE, PlateFrame, PlateMark, PoleBody, StripedGuyGuard, Transformer } from "./Shared3D";

// 罫線が引かれており、「沖縄電力/沖電」の表記が明記されるプレート。
function RuledOkidenPlate() {
  return (
    <PlateFrame faceColor="#ffffff">
      {[0.15, 0.02].map((y) => (
        <PlateMark key={y} y={y} w={0.28} h={0.006} color="#ccc" />
      ))}
      <PlateMark y={-0.18} w={0.2} h={0.09} color={PLATE} />
    </PlateFrame>
  );
}

export function OkinawaPole() {
  return (
    <>
      <PoleBody />
      <GWCapGeneric />

      {/* 変圧器: 特有の取付方法は報告されていないため汎用の構成 */}
      <Transformer />
      <RuledOkidenPlate />

      {/* 支線: 黒黄ストライプ(中部と共通の柄) */}
      <GuyWire Guard={StripedGuyGuard} />
    </>
  );
}
