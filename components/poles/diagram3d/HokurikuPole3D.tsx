import { BottleGuyGuard, GuyWire, PlateFrame, PlateMark, PoleBody, TentArmTop, Transformer } from "./Shared3D";

// 幅がやや狭い横長プレート。カタカナ+4桁数字。
function NarrowWidePlate() {
  return (
    <PlateFrame width={0.56} height={0.32}>
      <PlateMark w={0.36} h={0.07} />
    </PlateFrame>
  );
}

export function HokurikuPole() {
  return (
    <>
      <PoleBody />
      {/* テント状にGW(支線)を支える腕金 */}
      <TentArmTop />

      {/* 変圧器: 特有の取付方法は報告されていないため汎用の構成 */}
      <Transformer />
      <NarrowWidePlate />

      {/* 支線: ボトル型+黒テープ螺旋巻き(関西・四国と共通) */}
      <GuyWire Guard={BottleGuyGuard} />
    </>
  );
}
