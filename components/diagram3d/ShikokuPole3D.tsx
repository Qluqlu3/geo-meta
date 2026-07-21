"use client";

import {
  ArmInsulatorsAndWires,
  BottleGuyGuard,
  CrossArm,
  LBracketTop,
  METAL,
  PoleShaft,
  SceneShell,
  Segment,
  TRANSFORMER,
} from "./Shared3D";

// 変圧器(缶): 高圧引き下げ線が直角(90°)に曲がる+底面にシール。
function BentDropTransformer() {
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
      {/* 底面のシール */}
      <mesh position={[0, -0.34, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial color="#e0b400" roughness={0.6} />
      </mesh>
      {/* 引き下げ線が直角(90°)に曲がる */}
      <Segment from={[0.05, -0.33, 0.24]} to={[0.05, -0.6, 0.24]} radius={0.014} color="#6f8db3" />
      <Segment from={[0.05, -0.6, 0.24]} to={[0.4, -0.6, 0.24]} radius={0.014} color="#6f8db3" />
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
      {/* L字型の腕金(四国電力の代名詞) */}
      <LBracketTop rotationY={Math.PI / 2} />

      <BentDropTransformer />
      {/* 隙間の狭い小型プレート2枚(左右に並べる。狭い間隔を強調) */}
      {[-0.16, 0.02].map((x) => (
        <group key={x} position={[x, 1.55, 0.16]}>
          <mesh castShadow>
            <boxGeometry args={[0.16, 0.32, 0.03]} />
            <meshStandardMaterial color="#2a78d6" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.017]}>
            <boxGeometry args={[0.12, 0.26, 0.01]} />
            <meshStandardMaterial color="#eceae2" roughness={0.75} />
          </mesh>
        </group>
      ))}

      {/* 支線: ボトル型+黒テープ螺旋巻き(関西・北陸と共通) */}
      <Segment from={guyFrom} to={guyTo} radius={0.015} color="#9a9890" />
      <BottleGuyGuard from={guyFrom} to={guyTo} />
    </group>
  );
}

export function ShikokuPole3D() {
  return (
    <SceneShell>
      <Pole />
    </SceneShell>
  );
}
