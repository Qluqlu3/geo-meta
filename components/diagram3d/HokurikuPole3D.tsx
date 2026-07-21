"use client";

import {
  ArmInsulatorsAndWires,
  BottleGuyGuard,
  CrossArm,
  METAL,
  PLATE,
  PoleShaft,
  SceneShell,
  Segment,
  TentArmTop,
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

// 幅がやや狭い横長プレート。カタカナ+4桁数字。
function NarrowWidePlate() {
  return (
    <group position={[0, 1.55, 0.16]}>
      <mesh castShadow>
        <boxGeometry args={[0.56, 0.32, 0.03]} />
        <meshStandardMaterial color={PLATE} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <boxGeometry args={[0.5, 0.26, 0.01]} />
        <meshStandardMaterial color="#eceae2" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0, 0.024]}>
        <boxGeometry args={[0.36, 0.07, 0.005]} />
        <meshStandardMaterial color="#333" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Pole() {
  const guyFrom: [number, number, number] = [-0.11, 2.5, 0];
  const guyTo: [number, number, number] = [-1.7, 0.03, 0];
  return (
    <group>
      <PoleShaft />
      <CrossArm />
      <ArmInsulatorsAndWires />
      {/* テント状にGW(支線)を支える腕金 */}
      <TentArmTop />

      <GenericTransformer />
      <NarrowWidePlate />

      {/* 支線: ボトル型+黒テープ螺旋巻き(関西・四国と共通) */}
      <Segment from={guyFrom} to={guyTo} radius={0.015} color="#9a9890" />
      <BottleGuyGuard from={guyFrom} to={guyTo} />
    </group>
  );
}

export function HokurikuPole3D() {
  return (
    <SceneShell>
      <Pole />
    </SceneShell>
  );
}
