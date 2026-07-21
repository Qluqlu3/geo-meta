"use client";

import {
  ArmInsulatorsAndWires,
  CrossArm,
  GWCapGeneric,
  METAL,
  PLATE,
  PoleShaft,
  SceneShell,
  Segment,
  StripedGuyGuard,
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

// 罫線が引かれており、「沖縄電力/沖電」の表記が明記されるプレート。
function RuledOkidenPlate() {
  return (
    <group position={[0, 1.55, 0.16]}>
      <mesh castShadow>
        <boxGeometry args={[0.42, 0.74, 0.03]} />
        <meshStandardMaterial color={PLATE} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <boxGeometry args={[0.36, 0.68, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.75} />
      </mesh>
      {[0.15, 0.02].map((y) => (
        <mesh key={y} position={[0, y, 0.023]}>
          <boxGeometry args={[0.28, 0.006, 0.004]} />
          <meshStandardMaterial color="#ccc" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, -0.18, 0.024]}>
        <boxGeometry args={[0.2, 0.09, 0.005]} />
        <meshStandardMaterial color={PLATE} roughness={0.7} />
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
      <GWCapGeneric />

      <GenericTransformer />
      <RuledOkidenPlate />

      {/* 支線: 黒黄ストライプ(中部と共通の柄) */}
      <Segment from={guyFrom} to={guyTo} radius={0.015} color="#9a9890" />
      <StripedGuyGuard from={guyFrom} to={guyTo} />
    </group>
  );
}

export function OkinawaPole3D() {
  return (
    <SceneShell>
      <Pole />
    </SceneShell>
  );
}
