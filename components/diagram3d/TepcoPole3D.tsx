"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

// Part colors mirror the 2D SVG legend (globals.css --part-*), so a part
// reads as the same color in the schematic and the 3D view.
const INSULATOR = "#4a3aa7"; // がいし・絶縁体 (violet legend color)
const INSULATOR_CAP = "#241f38"; // the described 黒いキャップ (dark cap on top)
const TRANSFORMER = "#eb6834"; // 変圧器
const PLATE = "#2a78d6"; // 番号プレート frame
const METAL = "#8a8a86"; // 電柱本体・腕金 (structural gray)
const POLE = "#b7b5ad";
const WIRE = "#6f8db3"; // 青みがかった電線 (bluish conductors)
const WOOD = "#8a5a2b";

type V3 = [number, number, number];

// A cylinder aligned between two arbitrary points (for wires/struts that
// run at an angle). Computes the midpoint, length, and orientation so both
// ends land exactly where specified.
function Segment({ from, to, radius = 0.014, color = "#9a9890" }: { from: V3; to: V3; radius?: number; color?: string }) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const length = dir.length();
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { pos: [mid.x, mid.y, mid.z] as V3, quat: [q.x, q.y, q.z, q.w] as [number, number, number, number], len: length };
  }, [from, to]);
  return (
    <mesh position={pos} quaternion={quat} castShadow>
      <cylinderGeometry args={[radius, radius, len, 8]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

// 高圧ピンがいし: a squarish body with a dark cap on top
// ("黒いキャップが被さった四角めの形状").
function PinInsulator({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.12, 12]} />
        <meshStandardMaterial color={INSULATOR} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.14, 0.08, 0.14]} />
        <meshStandardMaterial color={INSULATOR} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.16, 0.05, 0.16]} />
        <meshStandardMaterial color={INSULATOR_CAP} roughness={0.45} />
      </mesh>
    </group>
  );
}

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
      <mesh castShadow>
        <tubeGeometry args={[curve, 40, 0.02, 8, false]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>
      {[0.15, 0.0].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.24, 8]} />
          <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
        </mesh>
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
      <mesh position={[R / 2, H, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, R, 8]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[R, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, H * 2, 8]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[R / 2, -H, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, R, 8]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Pole() {
  const armInsulatorX = [-0.62, 0, 0.62];
  return (
    <group>
      {/* 電柱本体 (pole), spanning y 0–4.3 */}
      <mesh position={[0, 2.15, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 4.3, 20]} />
        <meshStandardMaterial color={POLE} roughness={0.85} />
      </mesh>

      {/* 腕金 (cross-arm) */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[1.7, 0.1, 0.13]} />
        <meshStandardMaterial color={METAL} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* 高圧がいし x3 on the cross-arm (黒いキャップ+四角め) */}
      {armInsulatorX.map((x) => (
        <PinInsulator key={x} position={[x, 3.62, 0]} />
      ))}

      {/* 青みがかった電線 (bluish conductors) resting on each insulator, run along Z */}
      {armInsulatorX.map((x) => (
        <mesh key={x} position={[x, 3.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 6, 6]} />
          <meshStandardMaterial color={WIRE} roughness={0.6} metalness={0.2} />
        </mesh>
      ))}

      {/* ---- ポールトップ hardware ---- */}
      {/* 架空地線 (GW) at the very top */}
      <mesh position={[0, 4.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 6, 6]} />
        <meshStandardMaterial color={WIRE} roughness={0.6} />
      </mesh>
      {/* GWキャップ at the pole top */}
      <group position={[0, 4.16, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.12, 14]} />
          <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.07, 0]} castShadow>
          <sphereGeometry args={[0.07, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
      {/* も字型の腕金 (facing +Z) と D字型の腕金 (facing -Z) */}
      <MoArm position={[0, 3.92, 0.12]} />
      <DArm position={[0, 4.0, -0.12]} rotation={[0, Math.PI, 0]} />

      {/* ---- 変圧器 assembly: the can SITS ON a wooden board (東京電力特有) ---- */}
      {/* 木の板 (horizontal plank under the can, extending from the pole) */}
      <mesh position={[0.5, 2.53, 0]} castShadow>
        <boxGeometry args={[0.85, 0.08, 0.56]} />
        <meshStandardMaterial color={WOOD} roughness={0.9} />
      </mesh>
      {/* 板を支えるT字金具: a horizontal beam from the pole, running the full
          length of the board and out past its far edge, capped there by a
          perpendicular crossbar forming a "T" that clearly overhangs the
          board rather than staying under its footprint */}
      <mesh position={[0.58, 2.45, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.94, 10]} />
        <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[1.05, 2.45, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 10]} />
        <meshStandardMaterial color={METAL} roughness={0.5} metalness={0.3} />
      </mesh>
      <group position={[0.5, 2.9, 0]}>
        {/* 変圧器 (upright can) resting on the board */}
        <mesh castShadow>
          <cylinderGeometry args={[0.27, 0.27, 0.66, 28]} />
          <meshStandardMaterial color={TRANSFORMER} roughness={0.55} metalness={0.15} />
        </mesh>
        {/* top & bottom rims (horizontal rings hugging the upright can) */}
        {[0.33, -0.33].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.27, 0.02, 8, 28]} />
            <meshStandardMaterial color="#c14e22" roughness={0.4} metalness={0.3} />
          </mesh>
        ))}
        {/* 絶縁体2〜3個 (bushings) on the can top */}
        {[-0.1, 0.1].map((z) => (
          <group key={z} position={[0, 0.33, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.04, 0.045, 0.12, 10]} />
              <meshStandardMaterial color={INSULATOR} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.08, 0]} castShadow>
              <sphereGeometry args={[0.042, 10, 8]} />
              <meshStandardMaterial color={INSULATOR_CAP} roughness={0.45} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 番号プレート: 縦長・灰色ブリキ・漢字横書き・青枠 */}
      <group position={[0, 1.55, 0.16]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.74, 0.03]} />
          <meshStandardMaterial color={PLATE} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.017]}>
          <boxGeometry args={[0.36, 0.68, 0.01]} />
          <meshStandardMaterial color="#eceae2" roughness={0.75} />
        </mesh>
        {/* 漢字・横書き rows */}
        {[0.19, 0.03, -0.13].map((y) => (
          <mesh key={y} position={[0, y, 0.024]}>
            <boxGeometry args={[0.24, 0.05, 0.005]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* 東電マーク(赤い社章): a small red decal on the pole front */}
      {[
        [0, 0.05],
        [-0.045, -0.03],
        [0.045, -0.03],
      ].map(([dx, dy]) => (
        <mesh key={`${dx}`} position={[dx, 2.15 + dy, 0.115]}>
          <circleGeometry args={[0.032, 16]} />
          <meshStandardMaterial color="#d23c3c" roughness={0.6} />
        </mesh>
      ))}

      {/* 支線 (guy wire): emerges from the pole surface, runs down to a ground
          anchor. 東京電力特有の支線ガードの記述はないため無地の支線のみ描画。 */}
      <Segment from={[-0.11, 2.5, 0]} to={[-1.7, 0.03, 0]} radius={0.015} color="#9a9890" />
    </group>
  );
}

export function TepcoPole3D() {
  return (
    <Canvas camera={{ position: [3.4, 2.9, 4.6], fov: 38 }} shadows dpr={[1, 2]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 2, -4]} intensity={0.35} />
      <Pole />
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={8} blur={2} far={2} />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={2.6}
        maxDistance={8}
        target={[0.1, 2.2, 0]}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}
