import { GuyWire, PinInsulatorTriangleCap, PlateBox, PoleBody, Transformer } from "./Shared3D";

export function KyushuPole() {
  return (
    <>
      {/* 黒い三角キャップのがいし(九州特有) */}
      <PoleBody insulator={PinInsulatorTriangleCap} />
      {/* GWキャップはほとんど使われていない(九州特有)ためポールトップは
          ワイヤーのみのシンプルな構成 */}

      {/* 変圧器: 特有の取付方法は報告されていないため汎用の構成 */}
      <Transformer />
      {/* 縦型でやや厚みのあるプレート+上部に社章 */}
      <PlateBox logo />

      {/* 支線: ボトル型のキャップが無く、細い支線がそのまま柱の中央付近に
          直接差し込まれているタイプ(ガードなし) */}
      <GuyWire from={[-0.02, 2.5, 0.02]} radius={0.014} />
    </>
  );
}
