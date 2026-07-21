"use client";

import {
  ArmInsulatorsAndWires,
  CrossArm,
  METAL,
  PinInsulatorTriangleCap,
  PlateBox,
  PoleShaft,
  SceneShell,
  Segment,
  TRANSFORMER,
} from "./Shared3D";

// 変圧器(缶): 特有の取付方法は報告されていないため、柱からの単純な
// アームで固定する汎用の構成。
function GenericTransformer() {
  return (
    <group position={[0.55, 2.9, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.27, 0.27, 0.66, 28]} />
        <meshStandardMaterial color={TRANSFORMER} roughness={0.55} metalness={0.15} />
      </mesh>
      {[0.33, -0.33].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.27, 0.02, 8, 28]} />
          <meshStandardMaterial color="#c14e22" roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
      <Segment from={[-0.9, 0, 0]} to={[-0.28, 0, 0]} radius={0.035} color={METAL} />
    </group>
  );
}

function Pole() {
  return (
    <group>
      <PoleShaft />
      <CrossArm />
      {/* 黒い三角キャップのがいし(九州特有) */}
      <ArmInsulatorsAndWires Insulator={PinInsulatorTriangleCap} />
      {/* GWキャップはほとんど使われていない(九州特有)ためポールトップは
          ワイヤーのみのシンプルな構成 */}

      <GenericTransformer />
      {/* 縦型でやや厚みのあるプレート+上部に社章 */}
      <PlateBox faceColor="#eceae2" logo />

      {/* 支線: ボトル型のキャップが無く、細い支線がそのまま柱の中央付近に
          直接差し込まれているタイプ(ガードなし) */}
      <Segment from={[-0.02, 2.5, 0.02]} to={[-1.7, 0.03, 0]} radius={0.014} color="#9a9890" />
    </group>
  );
}

export function KyushuPole3D() {
  return (
    <SceneShell>
      <Pole />
    </SceneShell>
  );
}
