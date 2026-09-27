import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { ComponentType, ReactNode } from "react";
import { useMemo } from "react";
import * as THREE from "three";

// Shared parts for all 10 companies' 3D pole models. Colors mirror the 2D
// SVG legend (globals.css --part-*) so a part reads as the same color in
// both views. Company-specific hardware (transformer mount, guy-wire guard,
// pole-top bracket, plate layout) lives in each company's own file and
// composes these.
export const INSULATOR = "#4a3aa7"; // がいし・絶縁体 (violet legend color)
export const INSULATOR_CAP = "#241f38"; // 黒いキャップ
export const TRANSFORMER = "#eb6834"; // 変圧器
const TRANSFORMER_RIM = "#c14e22";
export const PLATE = "#2a78d6"; // 番号プレート frame
const PLATE_FACE = "#eceae2";
const PLATE_INK = "#333"; // プレート上の文字(帯で表現)
export const GUYWIRE = "#1baf7a"; // 支線ガード
export const METAL = "#8a8a86"; // 電柱本体・腕金 (structural gray)
const POLE_COLOR = "#b7b5ad";
export const WIRE = "#6f8db3"; // 青みがかった電線
const GUY_STEEL = "#9a9890"; // 支線(鋼より線)
export const WOOD = "#8a5a2b";
const STRIPE_DARK = "#1a1a19";
const STRIPE_YELLOW = "#f0b400";
export const RED_ACCENT = "#d23c3c";
export const STICKER_YELLOW = "#e0b400";

export type V3 = [number, number, number];
type Quat = [number, number, number, number];

const Y_UP = new THREE.Vector3(0, 1, 0);

// from→to の線分上、割合 t (0=from, 1=to) の点の位置と、ローカルY軸を線分の
// 向きに合わせる回転。円柱(既定でY軸方向)を斜めの線分に沿わせるのに使う。
function alongSegment(from: V3, to: V3, t: number) {
  const a = new THREE.Vector3(...from);
  const dir = new THREE.Vector3(...to).sub(a);
  const length = dir.length();
  const p = a.addScaledVector(dir, t);
  const q = new THREE.Quaternion().setFromUnitVectors(Y_UP, dir.normalize());
  return { position: [p.x, p.y, p.z] as V3, quaternion: [q.x, q.y, q.z, q.w] as Quat, length };
}

// A cylinder aligned between two arbitrary points (for wires/struts that
// run at an angle), so both ends land exactly where specified. `metal` gives
// the shinier finish used for pole-top brackets.
export function Segment({
  from,
  to,
  radius = 0.014,
  color = GUY_STEEL,
  metal = false,
}: {
  from: V3;
  to: V3;
  radius?: number;
  color?: string;
  metal?: boolean;
}) {
  const { position, quaternion, length } = alongSegment(from, to, 0.5);
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshStandardMaterial color={color} roughness={metal ? 0.4 : 0.8} metalness={metal ? 0.6 : 0} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// 電柱本体・腕金・がいし・電線
// ---------------------------------------------------------------------------

function PoleShaft() {
  return (
    <mesh position={[0, 2.15, 0]}>
      <cylinderGeometry args={[0.1, 0.14, 4.3, 20]} />
      <meshStandardMaterial color={POLE_COLOR} roughness={0.85} />
    </mesh>
  );
}

function CrossArm() {
  return (
    <mesh position={[0, 3.5, 0]}>
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
      <mesh>
        <cylinderGeometry args={[0.055, 0.07, 0.16, 14]} />
        <meshStandardMaterial color={INSULATOR} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
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
      <mesh>
        <cylinderGeometry args={[0.05, 0.06, 0.12, 12]} />
        <meshStandardMaterial color={INSULATOR} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.14, 0.08, 0.14]} />
        <meshStandardMaterial color={INSULATOR} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
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
      <mesh>
        <cylinderGeometry args={[0.05, 0.06, 0.12, 12]} />
        <meshStandardMaterial color={INSULATOR} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.09, 0.14, 4]} />
        <meshStandardMaterial color={INSULATOR_CAP} roughness={0.45} />
      </mesh>
    </group>
  );
}

// 腕金上の高圧がいし3個+電線(Z方向に張る)。
function ArmInsulatorsAndWires({ Insulator }: { Insulator: ComponentType<{ position: V3 }> }) {
  const y = 3.62;
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

// 全社共通の骨格: 電柱本体+腕金+高圧がいし3個+電線。がいしの形状だけ
// 会社ごとに差し替えられる。
export function PoleBody({ insulator = PinInsulatorGeneric }: { insulator?: ComponentType<{ position: V3 }> }) {
  return (
    <>
      <PoleShaft />
      <CrossArm />
      <ArmInsulatorsAndWires Insulator={insulator} />
    </>
  );
}

// ---------------------------------------------------------------------------
// ポールトップ
// ---------------------------------------------------------------------------

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
      <mesh>
        <cylinderGeometry args={[0.07, 0.09, 0.12, 14]} />
        <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <sphereGeometry args={[0.07, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

// 円錐形のポールトップ(雪対策・北海道/東北系)。
export function ConeTop() {
  return (
    <mesh position={[0, 4.22, 0]}>
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

// ---------------------------------------------------------------------------
// 変圧器
// ---------------------------------------------------------------------------

const TRANSFORMER_POS: V3 = [0.55, 2.9, 0];

// 変圧器(缶)+上下のリム。既定では柱から缶の側面までの取付アームも描く。
// 会社特有の取付金具・シール・引き下げ線は children として缶のローカル座標
// (缶の中心が原点)で重ねる。
export function Transformer({
  position = TRANSFORMER_POS,
  radius = 0.27,
  height = 0.66,
  bushings = false,
  mountArm = true,
  children,
}: {
  position?: V3;
  radius?: number;
  height?: number;
  /** 缶の上面の絶縁体(ブッシング)2個 */
  bushings?: boolean;
  mountArm?: boolean;
  children?: ReactNode;
}) {
  const top = height / 2;
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[radius, radius, height, 28]} />
        <meshStandardMaterial color={TRANSFORMER} roughness={0.55} metalness={0.15} />
      </mesh>
      {[top, -top].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.02, 8, 28]} />
          <meshStandardMaterial color={TRANSFORMER_RIM} roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
      {bushings &&
        [-0.1, 0.1].map((z) => (
          <group key={z} position={[0, top, z]}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.045, 0.12, 10]} />
              <meshStandardMaterial color={INSULATOR} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.042, 10, 8]} />
              <meshStandardMaterial color={INSULATOR_CAP} roughness={0.45} />
            </mesh>
          </group>
        ))}
      {mountArm && <Segment from={[-0.9, 0, 0]} to={[-radius - 0.01, 0, 0]} radius={0.035} color={METAL} />}
      {children}
    </group>
  );
}

// ---------------------------------------------------------------------------
// 番号プレート
// ---------------------------------------------------------------------------

const PLATE_POS: V3 = [0, 1.55, 0.16];

// 青枠+面のプレート。面は枠から inset ぶん内側。文字・ロゴ(PlateMark /
// PlateLogo)は children としてプレートのローカル座標で重ねる。
export function PlateFrame({
  position = PLATE_POS,
  width = 0.42,
  height = 0.74,
  inset = 0.03,
  faceColor = PLATE_FACE,
  children,
}: {
  position?: V3;
  width?: number;
  height?: number;
  inset?: number;
  faceColor?: string;
  children?: ReactNode;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[width, height, 0.03]} />
        <meshStandardMaterial color={PLATE} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <boxGeometry args={[width - inset * 2, height - inset * 2, 0.01]} />
        <meshStandardMaterial color={faceColor} roughness={0.75} />
      </mesh>
      {children}
    </group>
  );
}

// プレート面上の文字・罫線を表す薄い帯。
export function PlateMark({
  x = 0,
  y = 0,
  w,
  h,
  color = PLATE_INK,
}: {
  x?: number;
  y?: number;
  w: number;
  h: number;
  color?: string;
}) {
  return (
    <mesh position={[x, y, 0.024]}>
      <boxGeometry args={[w, h, 0.005]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

// プレート面上の丸い社章(商標の忠実な再現ではなく識別用の模式)。
export function PlateLogo({ x = 0, y }: { x?: number; y: number }) {
  return (
    <mesh position={[x, y, 0.024]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.045, 0.045, 0.006, 16]} />
      <meshStandardMaterial color={PLATE} roughness={0.5} />
    </mesh>
  );
}

// 縦長の標準プレート(横書きの行を帯で表現)。会社ごとに面の色・行数・
// ロゴの有無を変えられる。
export function PlateBox({
  position,
  faceColor,
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
    <PlateFrame position={position} faceColor={faceColor}>
      {logo && <PlateLogo y={0.27} />}
      {rowYs.map((y) => (
        <PlateMark key={y} y={y} w={0.24} h={0.05} />
      ))}
    </PlateFrame>
  );
}

// ---------------------------------------------------------------------------
// 支線と支線ガード
// ---------------------------------------------------------------------------

const GUY_FROM: V3 = [-0.11, 2.5, 0];
const GUY_TO: V3 = [-1.7, 0.03, 0];

type GuardProps = { from: V3; to: V3; t?: number };

// 支線に沿った位置 t に、ローカルY軸を支線の向きに合わせたグループを置く。
// ガードの形状はこの中にY軸方向の立体として描けばよい。
function AlongWire({ from, to, t, children }: { from: V3; to: V3; t: number; children: ReactNode }) {
  const { position, quaternion } = alongSegment(from, to, t);
  return (
    <group position={position} quaternion={quaternion}>
      {children}
    </group>
  );
}

// 支線(柱の中腹から地面のアンカーまで)+任意の支線ガード。
export function GuyWire({
  Guard,
  from = GUY_FROM,
  to = GUY_TO,
  radius = 0.015,
}: {
  Guard?: ComponentType<GuardProps>;
  from?: V3;
  to?: V3;
  radius?: number;
}) {
  return (
    <>
      <Segment from={from} to={to} radius={radius} />
      {Guard && <Guard from={from} to={to} />}
    </>
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
    <mesh>
      <tubeGeometry args={[curve, steps, 0.007, 6, false]} />
      <meshStandardMaterial color="#111" roughness={0.6} />
    </mesh>
  );
}

// ボトル型(下太・上細)の支線ガード+黒テープ螺旋巻き。関西・北陸・四国で
// 共通の柄。
export function BottleGuyGuard({ from, to, t = 0.28 }: GuardProps) {
  return (
    <AlongWire from={from} to={to} t={t}>
      <mesh>
        <cylinderGeometry args={[0.03, 0.055, 0.4, 12]} />
        <meshStandardMaterial color={GUYWIRE} roughness={0.55} />
      </mesh>
      <SpiralTape rTop={0.03} rBottom={0.055} height={0.4} turns={14} />
    </AlongWire>
  );
}

// 円柱+黒テープ螺旋巻きの支線ガード(東北特有・ボトル型ではなく太さが一定)。
export function SpiralCylinderGuyGuard({ from, to, t = 0.28 }: GuardProps) {
  return (
    <AlongWire from={from} to={to} t={t}>
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 0.42, 12]} />
        <meshStandardMaterial color={GUYWIRE} roughness={0.55} />
      </mesh>
      <SpiralTape rTop={0.04} rBottom={0.04} height={0.42} turns={14} />
    </AlongWire>
  );
}

// 黒黄ストライプの支線ガード(中部・沖縄で共通)。
export function StripedGuyGuard({ from, to, t = 0.28 }: GuardProps) {
  const bands = [-0.15, -0.05, 0.05, 0.15];
  return (
    <AlongWire from={from} to={to} t={t}>
      {bands.map((y, i) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.11, 12]} />
          <meshStandardMaterial color={i % 2 === 0 ? STRIPE_YELLOW : STRIPE_DARK} roughness={0.6} />
        </mesh>
      ))}
    </AlongWire>
  );
}

// 支線ガードの下部が丸みを帯びた形状(中国電力)。
export function RoundBottomGuyGuard({ from, to, t = 0.28 }: GuardProps) {
  return (
    <AlongWire from={from} to={to} t={t}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.32, 12]} />
        <meshStandardMaterial color={GUYWIRE} roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.14, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.045, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={GUYWIRE} roughness={0.55} />
      </mesh>
    </AlongWire>
  );
}

// 縦長の黄色い支線ガード(北海道)。
export function TallYellowGuyGuard({ from, to, t = 0.24 }: GuardProps) {
  return (
    <AlongWire from={from} to={to} t={t}>
      <mesh>
        <capsuleGeometry args={[0.045, 0.5, 6, 12]} />
        <meshStandardMaterial color={STRIPE_YELLOW} roughness={0.55} />
      </mesh>
    </AlongWire>
  );
}

// ---------------------------------------------------------------------------
// シーン
// ---------------------------------------------------------------------------

// 静止した模型なので、描画は操作中だけ(frameloop="demand"。OrbitControls が
// 変化のたびに再描画を要求する)。接地影も初回の1フレームで焼けば足りる。
// three.js のシャドウマップは、影を受ける面(receiveShadow)が無く何も
// 描かれないため使わない。
export function SceneShell({ children }: { children: ReactNode }) {
  return (
    <Canvas camera={{ position: [3.4, 2.9, 4.6], fov: 38 }} frameloop="demand" dpr={[1, 2]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={1.3} />
      <directionalLight position={[-3, 2, -4]} intensity={0.35} />
      {children}
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={8} blur={2} far={2} frames={1} />
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
