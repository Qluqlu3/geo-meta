"use client";

import {
  ArmInsulatorsAndWires,
  CrossArm,
  LBracketTop,
  METAL,
  PlateBox,
  PoleShaft,
  SceneShell,
  Segment,
  StripedGuyGuard,
  TRANSFORMER,
} from "./Shared3D";

// 変圧器(缶)+三角形金具+横棒。黄色手書き風の数字+黒いタップ端子付き。
function TriangleBracketTransformer() {
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
      {/* 手書き風の黄色数字(簡易表現の板) */}
      <mesh position={[0, 0, 0.275]} castShadow>
        <boxGeometry args={[0.16, 0.1, 0.006]} />
        <meshStandardMaterial color="#e0b400" roughness={0.6} />
      </mesh>
      {/* 黒いタップ端子 */}
      <mesh position={[0.24, 0.15, 0.16]} castShadow>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>
      {/* 三角形金具+横棒(缶の外径より外側を通す) */}
      <Segment from={[-0.32, -0.4, 0.2]} to={[0, 0.3, 0.32]} radius={0.02} color={METAL} />
      <Segment from={[0.32, -0.4, 0.2]} to={[0, 0.3, 0.32]} radius={0.02} color={METAL} />
      <Segment from={[-0.36, -0.4, 0.2]} to={[0.36, -0.4, 0.2]} radius={0.025} color={METAL} />
      <Segment from={[-0.9, 0, 0]} to={[-0.28, 0, 0]} radius={0.035} color={METAL} />
    </group>
  );
}

// 三角形の腕金(中部特有)
function TriangleArmTop() {
  return (
    <group position={[0, 4.05, 0]}>
      <Segment from={[-0.22, 0, 0]} to={[0.22, 0, 0]} radius={0.016} color={METAL} />
      <Segment from={[-0.22, 0, 0]} to={[0, 0.26, 0]} radius={0.016} color={METAL} />
      <Segment from={[0.22, 0, 0]} to={[0, 0.26, 0]} radius={0.016} color={METAL} />
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
      {/* 直角に曲がったGWキャップ+三角形の腕金 */}
      <LBracketTop />
      <TriangleArmTop />

      <TriangleBracketTransformer />
      {/* 縦長・角丸プレート+上部に中部電力ロゴ */}
      <PlateBox logo />

      {/* 支線: 黒黄ストライプ(沖縄と共通の柄) */}
      <Segment from={guyFrom} to={guyTo} radius={0.015} color="#9a9890" />
      <StripedGuyGuard from={guyFrom} to={guyTo} />
    </group>
  );
}

export function ChubuPole3D() {
  return (
    <SceneShell>
      <Pole />
    </SceneShell>
  );
}
