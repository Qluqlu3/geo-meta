import {
  GuyWire,
  GWCapGeneric,
  METAL,
  PlateBox,
  PoleBody,
  RED_ACCENT,
  RoundBottomGuyGuard,
  Segment,
  Transformer,
} from "./Shared3D";

// 変圧器(缶・やや小ぶり): 三角形金具で固定された十字型バー。底面や側面に
// 朱色の数字シールが貼られる。
function CrossBarTransformer() {
  return (
    <Transformer radius={0.24} height={0.6}>
      {/* 朱色(赤)の数字シール */}
      <mesh position={[0, -0.16, 0.245]}>
        <boxGeometry args={[0.12, 0.08, 0.006]} />
        <meshStandardMaterial color={RED_ACCENT} roughness={0.6} />
      </mesh>
      {/* 十字型バー+三角形金具: 缶の正面(表面のすぐ手前)に重ねて描き、缶に
          隠れて途切れて見えないようにする */}
      <Segment from={[-0.34, 0.02, 0.26]} to={[0.34, 0.02, 0.26]} radius={0.02} color={METAL} />
      <Segment from={[0, -0.16, 0.26]} to={[0, 0.2, 0.26]} radius={0.02} color={METAL} />
      <Segment from={[0, -0.4, 0.35]} to={[-0.3, 0.02, 0.35]} radius={0.018} color={METAL} />
      <Segment from={[0, -0.4, 0.35]} to={[0.3, 0.02, 0.35]} radius={0.018} color={METAL} />
    </Transformer>
  );
}

// 縦型プレート+ENERGIAロゴ。1本の柱に3枚以上貼付されがちなので重ねて表現。
function StackedPlates() {
  return (
    <>
      <PlateBox position={[0, 1.55, 0.1]} faceColor="#dcdad4" />
      <PlateBox position={[0, 1.55, 0.14]} />
      <PlateBox position={[0, 1.55, 0.18]} logo />
    </>
  );
}

export function ChugokuPole() {
  return (
    <>
      <PoleBody />
      <GWCapGeneric />

      <CrossBarTransformer />
      <StackedPlates />

      {/* 支線ガードの下部が丸みを帯びた形状 */}
      <GuyWire Guard={RoundBottomGuyGuard} />
    </>
  );
}
