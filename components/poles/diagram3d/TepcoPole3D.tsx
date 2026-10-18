import { useMemo } from "react";
import * as THREE from "three";
import {
  GuyWire,
  GWCapGeneric,
  METAL,
  OverheadGroundWire,
  PinInsulatorSquareCap,
  PlateBox,
  PoleBody,
  RED_ACCENT,
  Segment,
  Transformer,
  type V3,
  WOOD,
} from "./Shared3D";

// ポールトップの「も」の字型の腕金: a curved GW-support bracket whose
// silhouette resembles the hiragana も (vertical stroke with a bottom curl
// plus two crossbars).
function MoArm({ position }: { position: V3 }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.3, 0),
        new THREE.Vector3(0.03, 0.08, 0),
        new THREE.Vector3(0.02, -0.1, 0),
        new THREE.Vector3(-0.08, -0.22, 0),
        new THREE.Vector3(-0.01, -0.3, 0),
        new THREE.Vector3(0.08, -0.26, 0),
      ]),
    [],
  );
  return (
    <group position={position}>
      <mesh>
        <tubeGeometry args={[curve, 40, 0.02, 8, false]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>
      {[0.15, 0.0].map((y) => (
        <Segment key={y} from={[-0.12, y, 0]} to={[0.12, y, 0]} radius={0.018} color={METAL} metal />
      ))}
    </group>
  );
}

// ポールトップのD字型の腕金: an angular bracket with square corners (NOT a
// smooth curve) — a horizontal top arm, a vertical outer arm, and a
// horizontal bottom arm, forming the silhouette of a squared-off "D".
function DArm({ position, rotation }: { position: V3; rotation?: V3 }) {
  const R = 0.24;
  const H = 0.26;
  return (
    <group position={position} rotation={rotation}>
      <Segment from={[0, H, 0]} to={[R, H, 0]} radius={0.02} color={METAL} metal />
      <Segment from={[R, H, 0]} to={[R, -H, 0]} radius={0.02} color={METAL} metal />
      <Segment from={[R, -H, 0]} to={[0, -H, 0]} radius={0.02} color={METAL} metal />
    </group>
  );
}

// 変圧器の缶を載せる木の板(東京電力特有)と、板を支えるT字金具。金具は柱から
// 板の全長を通って奥の縁の先まで伸び、そこで直交する横棒と「T」を作る
// (板の下に隠れず、はみ出して見えるのが識別点)。
function WoodBoardMount() {
  return (
    <>
      <mesh position={[0.5, 2.53, 0]}>
        <boxGeometry args={[0.85, 0.08, 0.56]} />
        <meshStandardMaterial color={WOOD} roughness={0.9} />
      </mesh>
      <Segment from={[0.11, 2.45, 0]} to={[1.05, 2.45, 0]} radius={0.04} color={METAL} metal />
      <Segment from={[1.05, 2.45, -0.2]} to={[1.05, 2.45, 0.2]} radius={0.04} color={METAL} metal />
    </>
  );
}

// 東電マーク(赤い社章): a small red decal on the pole front. 商標の忠実な
// 再現ではなく識別用の模式。
function TepcoMark() {
  const dots = [
    [0, 0.05],
    [-0.045, -0.03],
    [0.045, -0.03],
  ];
  return (
    <>
      {dots.map(([dx, dy]) => (
        <mesh key={`${dx}`} position={[dx, 2.15 + dy, 0.115]}>
          <circleGeometry args={[0.032, 16]} />
          <meshStandardMaterial color={RED_ACCENT} roughness={0.6} />
        </mesh>
      ))}
    </>
  );
}

export function TepcoPole() {
  return (
    <>
      {/* 高圧がいし: 黒いキャップ+四角め */}
      <PoleBody insulator={PinInsulatorSquareCap} />

      {/* ポールトップ: 架空地線+GWキャップ、も字型(+Z側)とD字型(-Z側)の腕金 */}
      <OverheadGroundWire />
      <GWCapGeneric />
      <MoArm position={[0, 3.92, 0.12]} />
      <DArm position={[0, 4.0, -0.12]} rotation={[0, Math.PI, 0]} />

      {/* 変圧器: 缶が木の板の上に載る(柱からの取付アームは使わない) */}
      <WoodBoardMount />
      <Transformer position={[0.5, 2.9, 0]} bushings mountArm={false} />

      {/* 番号プレート: 縦長・灰色ブリキ・漢字横書き・青枠 */}
      <PlateBox />
      <TepcoMark />

      {/* 支線: 東京電力特有の支線ガードの記述はないため無地の支線のみ */}
      <GuyWire />
    </>
  );
}
