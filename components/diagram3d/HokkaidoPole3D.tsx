"use client";

import {
  ArmInsulatorsAndWires,
  ConeTop,
  CrossArm,
  METAL,
  PlateBox,
  PoleShaft,
  SceneShell,
  Segment,
  TallYellowGuyGuard,
  TRANSFORMER,
} from "./Shared3D";

// 変圧器(缶): プラス(+)字型のバーで側面固定。木製の取付板は使わない
// (北海道特有・関東の木製板+2本バー構成との識別点)。
function PlusBarTransformer() {
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
      {[-0.1, 0.1].map((z) => (
        <group key={z} position={[0, 0.33, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.045, 0.12, 10]} />
            <meshStandardMaterial color="#4a3aa7" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.08, 0]} castShadow>
            <sphereGeometry args={[0.042, 10, 8]} />
            <meshStandardMaterial color="#241f38" roughness={0.45} />
          </mesh>
        </group>
      ))}
      {/* 柱から缶側面までの取り付けアーム */}
      <Segment from={[-0.9, 0, 0]} to={[-0.28, 0, 0]} radius={0.035} color={METAL} />
      {/* プラス字固定バー: 缶の正面に直接重ねて固定される十字金具 */}
      <Segment from={[0, -0.2, 0.27]} to={[0, 0.2, 0.27]} radius={0.035} color={METAL} />
      <Segment from={[-0.2, 0, 0.27]} to={[0.2, 0, 0.27]} radius={0.035} color={METAL} />
    </group>
  );
}

function Pole() {
  return (
    <group>
      <PoleShaft />
      <CrossArm />
      <ArmInsulatorsAndWires />
      {/* 架空地線がほぼ無く頭部が簡素(北海道特有) */}
      <ConeTop />

      <PlusBarTransformer />
      <PlateBox />

      {/* 支線: 黄色く縦長のガード(黒黄トラ柄の報告もある) */}
      <Segment from={[-0.11, 2.5, 0]} to={[-1.7, 0.03, 0]} radius={0.015} color="#9a9890" />
      <TallYellowGuyGuard from={[-0.11, 2.5, 0]} to={[-1.7, 0.03, 0]} />
    </group>
  );
}

export function HokkaidoPole3D() {
  return (
    <SceneShell>
      <Pole />
    </SceneShell>
  );
}
