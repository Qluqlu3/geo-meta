"use client";

import {
  AngleArm120Top,
  ArmInsulatorsAndWires,
  BottleGuyGuard,
  CrossArm,
  METAL,
  PoleShaft,
  SceneShell,
  Segment,
  TRANSFORMER,
} from "./Shared3D";

// 変圧器(缶): 高圧引き下げ線が枠の下側から延びる(東北とは対照的)。
function BottomExitTransformer() {
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
      {/* 高圧引き下げ線: 枠の下側から延びる */}
      <Segment from={[0.1, -0.33, 0.2]} to={[0.35, -0.65, 0.3]} radius={0.014} color="#6f8db3" />
      <Segment from={[-0.9, 0, 0]} to={[-0.28, 0, 0]} radius={0.035} color={METAL} />
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
      {/* 120°に角度のついた腕金 */}
      <AngleArm120Top />

      <BottomExitTransformer />
      {/* 縦長・白プレート。標識名は漢字/カタカナの縦書き(縦の帯で表現) */}
      <group position={[0, 1.55, 0.16]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.74, 0.03]} />
          <meshStandardMaterial color="#2a78d6" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.017]}>
          <boxGeometry args={[0.36, 0.68, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.75} />
        </mesh>
        <mesh position={[-0.06, 0, 0.024]}>
          <boxGeometry args={[0.05, 0.5, 0.005]} />
          <meshStandardMaterial color="#333" roughness={0.8} />
        </mesh>
        <mesh position={[0.06, 0.05, 0.024]}>
          <boxGeometry args={[0.05, 0.32, 0.005]} />
          <meshStandardMaterial color="#333" roughness={0.8} />
        </mesh>
      </group>

      {/* 支線: ボトル型+黒テープ螺旋巻き(北陸・四国と共通) */}
      <Segment from={guyFrom} to={guyTo} radius={0.015} color="#9a9890" />
      <BottleGuyGuard from={guyFrom} to={guyTo} />
    </group>
  );
}

export function KansaiPole3D() {
  return (
    <SceneShell>
      <Pole />
    </SceneShell>
  );
}
