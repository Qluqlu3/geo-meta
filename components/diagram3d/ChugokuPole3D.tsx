"use client";

import {
  ArmInsulatorsAndWires,
  CrossArm,
  GWCapGeneric,
  METAL,
  PlateBox,
  PoleShaft,
  RED_ACCENT,
  RoundBottomGuyGuard,
  SceneShell,
  Segment,
  TRANSFORMER,
} from "./Shared3D";

// 変圧器(缶): 三角形金具で固定された十字型バー。底面や側面に朱色の
// 数字シールが貼られる。
function CrossBarTransformer() {
  return (
    <group position={[0.55, 2.9, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.6, 28]} />
        <meshStandardMaterial color={TRANSFORMER} roughness={0.55} metalness={0.15} />
      </mesh>
      {[0.3, -0.3].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.24, 0.018, 8, 28]} />
          <meshStandardMaterial color="#c14e22" roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
      {/* 朱色(赤)の数字シール */}
      <mesh position={[0, -0.16, 0.245]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.006]} />
        <meshStandardMaterial color={RED_ACCENT} roughness={0.6} />
      </mesh>
      {/* 十字型バー+三角形金具: 缶の正面(表面のすぐ手前)に重ねて描き、缶に
          隠れて途切れて見えないようにする */}
      <Segment from={[-0.34, 0.02, 0.26]} to={[0.34, 0.02, 0.26]} radius={0.02} color={METAL} />
      <Segment from={[0, -0.16, 0.26]} to={[0, 0.2, 0.26]} radius={0.02} color={METAL} />
      <Segment from={[0, -0.4, 0.35]} to={[-0.3, 0.02, 0.35]} radius={0.018} color={METAL} />
      <Segment from={[0, -0.4, 0.35]} to={[0.3, 0.02, 0.35]} radius={0.018} color={METAL} />
      <Segment from={[-0.9, 0, 0]} to={[-0.24, 0, 0]} radius={0.035} color={METAL} />
    </group>
  );
}

// 縦型プレート+ENERGIAロゴ。1本の柱に3枚以上貼付されがちなので重ねて表現。
function StackedPlates() {
  return (
    <>
      <PlateBox position={[0, 1.55, 0.1]} faceColor="#dcdad4" />
      <PlateBox position={[0, 1.55, 0.14]} faceColor="#eceae2" />
      <PlateBox position={[0, 1.55, 0.18]} logo />
    </>
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

      <CrossBarTransformer />
      <StackedPlates />

      {/* 支線ガードの下部が丸みを帯びた形状 */}
      <Segment from={guyFrom} to={guyTo} radius={0.015} color="#9a9890" />
      <RoundBottomGuyGuard from={guyFrom} to={guyTo} />
    </group>
  );
}

export function ChugokuPole3D() {
  return (
    <SceneShell>
      <Pole />
    </SceneShell>
  );
}
