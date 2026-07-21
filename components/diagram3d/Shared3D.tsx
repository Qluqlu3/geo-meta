"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { ComponentType, ReactNode } from "react";
import { useMemo } from "react";
import * as THREE from "three";

// Shared parts for all 10 companies' 3D pole models. Colors mirror the 2D
// SVG legend (globals.css --part-*) so a part reads as the same color in
// both views. Company-specific hardware (transformer mount, guy-wire guard,
// pole-top bracket) lives in each company's own file and composes these.
export const INSULATOR = "#4a3aa7"; // がいし・絶縁体 (violet legend color)
export const INSULATOR_CAP = "#241f38"; // 黒いキャップ
export const TRANSFORMER = "#eb6834"; // 変圧器
export const PLATE = "#2a78d6"; // 番号プレート frame
export const GUYWIRE = "#1baf7a"; // 支線ガード
export const METAL = "#8a8a86"; // 電柱本体・腕金 (structural gray)
export const POLE_COLOR = "#b7b5ad";
export const WIRE = "#6f8db3"; // 青みがかった電線
export const WOOD = "#8a5a2b";
export const STRIPE_DARK = "#1a1a19";
export const STRIPE_YELLOW = "#f0b400";
export const RED_ACCENT = "#d23c3c";

export type V3 = [number, number, number];

// A cylinder aligned between two arbitrary points (for wires/struts that
// run at an angle). Computes the midpoint, length, and orientation so both
// ends land exactly where specified.
export function Segment({ from, to, radius = 0.014, color = "#9a9890" }: { from: V3; to: V3; radius?: number; color?: string }) {
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

export function PoleShaft() {
  return (
    <mesh position={[0, 2.15, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.14, 4.3, 20]} />
      <meshStandardMaterial color={POLE_COLOR} roughness={0.85} />
    </mesh>
  );
}

export function CrossArm({ y = 3.5 }: { y?: number }) {
  return (
    <mesh position={[0, y, 0]} castShadow>
      <boxGeometry args={[1.7, 0.1, 0.13]} />
      <meshStandardMaterial color={METAL} roughness={0.6} metalness={0.3} />
    </mesh>
  );
}

// 汎用の高圧ピンがいし(丸みのあるスプール形): 特有の形状が報告されていない
// 会社のデフォルト。特有の形状がある会社は個別のバリアントを使う。
export function PinInsulatorGeneric({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.055, 0.07, 0.16, 14]} />
        <meshStandardMaterial color={INSULATOR} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.06, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={INSULATOR} roughness={0.35} />
      </mesh>
    </group>
  );
}

// 東京電力の四角めのがいし: 黒いキャップが被さった四角い形状。
export function PinInsulatorSquareCap({ position }: { position: V3 }) {
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

// 九州電力の三角めのがいし: 黒いキャップが被さった三角(円錐)の形状。
export function PinInsulatorTriangleCap({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.12, 12]} />
        <meshStandardMaterial color={INSULATOR} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.15, 0]} castShadow>
        <coneGeometry args={[0.09, 0.14, 4]} />
        <meshStandardMaterial color={INSULATOR_CAP} roughness={0.45} />
      </mesh>
    </group>
  );
}

// 腕金上の高圧がいし3個+電線。がいしの形状は会社ごとに差し替え可能。
export function ArmInsulatorsAndWires({
  Insulator = PinInsulatorGeneric,
  y = 3.62,
}: {
  Insulator?: ComponentType<{ position: V3 }>;
  y?: number;
}) {
  const xs = [-0.62, 0, 0.62];
  return (
    <>
      {xs.map((x) => (
        <Insulator key={x} position={[x, y, 0]} />
      ))}
      {xs.map((x) => (
        <mesh key={x} position={[x, y + 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 6, 6]} />
          <meshStandardMaterial color={WIRE} roughness={0.6} metalness={0.2} />
        </mesh>
      ))}
    </>
  );
}

export function OverheadGroundWire() {
  return (
    <mesh position={[0, 4.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.01, 0.01, 6, 6]} />
      <meshStandardMaterial color={WIRE} roughness={0.6} />
    </mesh>
  );
}

// 汎用GWキャップ(円柱+半球ドーム)。特有の形状が報告されていない会社の
// デフォルトのポールトップ。
export function GWCapGeneric() {
  return (
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
  );
}

// 円錐形のポールトップ(雪対策・北海道/東北系)。
export function ConeTop() {
  return (
    <mesh position={[0, 4.22, 0]} castShadow>
      <coneGeometry args={[0.13, 0.28, 16]} />
      <meshStandardMaterial color={METAL} metalness={0.3} roughness={0.5} />
    </mesh>
  );
}

// 直角に曲がったL字型の腕金(中部電力・四国電力)。
export function LBracketTop({ rotationY = 0 }: { rotationY?: number }) {
  return (
    <group position={[0, 4.08, 0]} rotation={[0, rotationY, 0]}>
      <Segment from={[0, 0, 0]} to={[0.32, 0, 0]} radius={0.018} color={METAL} />
      <Segment from={[0.32, 0, 0]} to={[0.32, 0.22, 0]} radius={0.018} color={METAL} />
    </group>
  );
}

// 120°に角度のついた腕金(関西電力)。
export function AngleArm120Top() {
  return (
    <group position={[0, 4.1, 0]}>
      <Segment from={[0, 0, 0]} to={[-0.34, 0.18, 0]} radius={0.02} color={METAL} />
      <Segment from={[0, 0, 0]} to={[0.34, 0.18, 0]} radius={0.02} color={METAL} />
    </group>
  );
}

// テント状にGW(支線)を支える腕金(北陸電力)。脚の根元を腕金(CrossArm)の
// 上面まで伸ばし、宙に浮いて見えないようにする。
export function TentArmTop() {
  return (
    <group position={[0, 4.05, 0]}>
      <Segment from={[-0.26, -0.5, 0]} to={[0, 0.24, 0]} radius={0.018} color={METAL} />
      <Segment from={[0.26, -0.5, 0]} to={[0, 0.24, 0]} radius={0.018} color={METAL} />
    </group>
  );
}

// 番号プレート(縦長・共通の青枠+面+横書き風の帯)。会社ごとに面の色や
// 行数、ロゴの有無を変えられる。
export function PlateBox({
  position = [0, 1.55, 0.16],
  faceColor = "#eceae2",
  rows = 3,
  logo = false,
}: {
  position?: V3;
  faceColor?: string;
  rows?: number;
  logo?: boolean;
}) {
  const rowYs = Array.from({ length: rows }, (_, i) => 0.22 - i * (0.4 / Math.max(rows - 1, 1)));
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.42, 0.74, 0.03]} />
        <meshStandardMaterial color={PLATE} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <boxGeometry args={[0.36, 0.68, 0.01]} />
        <meshStandardMaterial color={faceColor} roughness={0.75} />
      </mesh>
      {logo && (
        <mesh position={[0, 0.27, 0.024]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.006, 16]} />
          <meshStandardMaterial color={PLATE} roughness={0.5} />
        </mesh>
      )}
      {rowYs.map((y) => (
        <mesh key={y} position={[0, y, 0.024]}>
          <boxGeometry args={[0.24, 0.05, 0.005]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// 黒テープを螺旋状に巻いた質感を表す帯(実際にヘリックス曲線+チューブで
// 生成する)。半径は下端(rBottom)から上端(rTop)へ線形に変化させられるので、
// ボトル型のような先細りの胴体にもぴったり沿わせられる。
function SpiralTape({
  rTop,
  rBottom,
  height,
  turns = 9,
  surfaceOffset = 0.006,
}: {
  rTop: number;
  rBottom: number;
  height: number;
  turns?: number;
  surfaceOffset?: number;
}) {
  const steps = Math.max(96, turns * 12);
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * turns * Math.PI * 2;
      const r = rBottom + (rTop - rBottom) * t + surfaceOffset;
      const y = t * height - height / 2;
      points.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [rTop, rBottom, height, turns, surfaceOffset, steps]);
  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, steps, 0.007, 6, false]} />
      <meshStandardMaterial color="#111" roughness={0.6} />
    </mesh>
  );
}

// ボトル型(下太・上細)の支線ガード+黒テープ螺旋巻き。関西・北陸・四国で
// 共通の柄。支線本体(Segment)は呼び出し側で別途描画し、このパーツは
// 支線に沿った位置に「太さの変わるガード」だけを重ねて描く。
export function BottleGuyGuard({ from, to, t = 0.28 }: { from: V3; to: V3; t?: number }) {
  const { pos, quat } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const point = a.clone().addScaledVector(dir, t);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { pos: [point.x, point.y, point.z] as V3, quat: [q.x, q.y, q.z, q.w] as [number, number, number, number] };
  }, [from, to, t]);
  return (
    <group position={pos} quaternion={quat}>
      <mesh castShadow>
        <cylinderGeometry args={[0.03, 0.055, 0.4, 12]} />
        <meshStandardMaterial color={GUYWIRE} roughness={0.55} />
      </mesh>
      <SpiralTape rTop={0.03} rBottom={0.055} height={0.4} turns={14} />
    </group>
  );
}

// 円柱+黒テープ螺旋巻きの支線ガード(東北特有・ボトル型ではなく太さが一定)。
export function SpiralCylinderGuyGuard({ from, to, t = 0.28 }: { from: V3; to: V3; t?: number }) {
  const { pos, quat } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const point = a.clone().addScaledVector(dir, t);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { pos: [point.x, point.y, point.z] as V3, quat: [q.x, q.y, q.z, q.w] as [number, number, number, number] };
  }, [from, to, t]);
  return (
    <group position={pos} quaternion={quat}>
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.42, 12]} />
        <meshStandardMaterial color={GUYWIRE} roughness={0.55} />
      </mesh>
      <SpiralTape rTop={0.04} rBottom={0.04} height={0.42} turns={14} />
    </group>
  );
}

// 黒黄ストライプの支線ガード(中部・沖縄で共通)。
export function StripedGuyGuard({ from, to, t = 0.28 }: { from: V3; to: V3; t?: number }) {
  const { pos, quat } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const point = a.clone().addScaledVector(dir, t);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { pos: [point.x, point.y, point.z] as V3, quat: [q.x, q.y, q.z, q.w] as [number, number, number, number] };
  }, [from, to, t]);
  const bands = [-0.15, -0.05, 0.05, 0.15];
  return (
    <group position={pos} quaternion={quat}>
      {bands.map((y, i) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.11, 12]} />
          <meshStandardMaterial color={i % 2 === 0 ? STRIPE_YELLOW : STRIPE_DARK} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// 支線ガードの下部が丸みを帯びた形状(中国電力)。
export function RoundBottomGuyGuard({ from, to, t = 0.28 }: { from: V3; to: V3; t?: number }) {
  const { pos, quat } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const point = a.clone().addScaledVector(dir, t);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { pos: [point.x, point.y, point.z] as V3, quat: [q.x, q.y, q.z, q.w] as [number, number, number, number] };
  }, [from, to, t]);
  return (
    <group position={pos} quaternion={quat}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.32, 12]} />
        <meshStandardMaterial color={GUYWIRE} roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.14, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[0.045, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={GUYWIRE} roughness={0.55} />
      </mesh>
    </group>
  );
}

// 縦長の黄色い支線ガード(北海道)。
export function TallYellowGuyGuard({ from, to, t = 0.24 }: { from: V3; to: V3; t?: number }) {
  const { pos, quat } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const point = a.clone().addScaledVector(dir, t);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return { pos: [point.x, point.y, point.z] as V3, quat: [q.x, q.y, q.z, q.w] as [number, number, number, number] };
  }, [from, to, t]);
  return (
    <group position={pos} quaternion={quat}>
      <mesh castShadow>
        <capsuleGeometry args={[0.045, 0.5, 6, 12]} />
        <meshStandardMaterial color={STRIPE_YELLOW} roughness={0.55} />
      </mesh>
    </group>
  );
}

export function SceneShell({ children, target = [0.1, 2.2, 0] as V3 }: { children: ReactNode; target?: V3 }) {
  return (
    <Canvas camera={{ position: [3.4, 2.9, 4.6], fov: 38 }} shadows dpr={[1, 2]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={1.3} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 2, -4]} intensity={0.35} />
      {children}
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={8} blur={2} far={2} />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={2.6}
        maxDistance={8}
        target={target}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}
