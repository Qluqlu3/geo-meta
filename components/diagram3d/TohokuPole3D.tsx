"use client";

import {
  ArmInsulatorsAndWires,
  ConeTop,
  CrossArm,
  METAL,
  PLATE,
  PoleShaft,
  SceneShell,
  Segment,
  SpiralCylinderGuyGuard,
  TRANSFORMER,
} from "./Shared3D";

// 変圧器(缶)+四角ブラケット+ロゴ。高圧引き下げ線がブラケット上部から
// 延びる(関西とは対照的)。
function BracketTransformer() {
  return (
    <group position={[0.55, 2.9, 0]}>
      {/* 缶を背負う四角(長方形)ブラケット。四辺とも閉じた枠にし、缶の外径より
          外側を通して缶に隠れないようにする */}
      <Segment from={[-0.32, -0.36, 0.15]} to={[-0.32, 0.44, 0.15]} radius={0.02} color={METAL} />
      <Segment from={[-0.32, 0.44, 0.15]} to={[0.32, 0.44, 0.15]} radius={0.02} color={METAL} />
      <Segment from={[0.32, 0.44, 0.15]} to={[0.32, -0.36, 0.15]} radius={0.02} color={METAL} />
      <Segment from={[0.32, -0.36, 0.15]} to={[-0.32, -0.36, 0.15]} radius={0.02} color={METAL} />
      {/* 高圧引き下げ線: ブラケット上部から延びる */}
      <Segment from={[0, 0.44, 0.15]} to={[-0.1, 0.78, 0.05]} radius={0.014} color="#6f8db3" />

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
      {/* 東北電力のロゴ(丸バッジ、商標の忠実な再現ではなく識別用の模式)。
          円柱を正面(+Z)に向けて立てるため90°回転させる */}
      <mesh position={[0, 0.05, 0.275]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.01, 20]} />
        <meshStandardMaterial color="#1a56b0" roughness={0.4} />
      </mesh>

      <Segment from={[-0.9, 0, 0]} to={[-0.28, 0, 0]} radius={0.035} color={METAL} />
    </group>
  );
}

// 灰色地・横長プレート+左上ロゴ+幹線名の帯。縦長のプレートとは向きが違う。
function WideGrayPlate() {
  return (
    <group position={[0, 1.55, 0.16]} rotation={[0, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.66, 0.4, 0.03]} />
        <meshStandardMaterial color={PLATE} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <boxGeometry args={[0.6, 0.34, 0.01]} />
        <meshStandardMaterial color="#c9c8c2" roughness={0.75} />
      </mesh>
      {/* 左上のロゴ */}
      <mesh position={[-0.2, 0.1, 0.024]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.006, 16]} />
        <meshStandardMaterial color={PLATE} roughness={0.5} />
      </mesh>
      {/* 幹線名(小さい帯) */}
      <mesh position={[0.05, 0.1, 0.024]}>
        <boxGeometry args={[0.22, 0.03, 0.005]} />
        <meshStandardMaterial color="#555" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.05, 0.024]}>
        <boxGeometry args={[0.4, 0.07, 0.005]} />
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
      {/* 円錐形の頭部構造(北海道と似た系統) */}
      <ConeTop />

      <BracketTransformer />
      <WideGrayPlate />

      {/* 支線: 円柱+黒テープ螺旋巻き(東北特有・ボトル型ではない) */}
      <Segment from={guyFrom} to={guyTo} radius={0.015} color="#9a9890" />
      <SpiralCylinderGuyGuard from={guyFrom} to={guyTo} />
    </group>
  );
}

export function TohokuPole3D() {
  return (
    <SceneShell>
      <Pole />
    </SceneShell>
  );
}
