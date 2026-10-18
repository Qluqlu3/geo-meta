import {
  GuyWire,
  LBracketTop,
  METAL,
  PlateBox,
  PoleBody,
  Segment,
  STICKER_YELLOW,
  StripedGuyGuard,
  Transformer,
} from "./Shared3D";

// 変圧器(缶)+三角形金具+横棒。黄色手書き風の数字+黒いタップ端子付き。
function TriangleBracketTransformer() {
  return (
    <Transformer>
      {/* 手書き風の黄色数字(簡易表現の板) */}
      <mesh position={[0, 0, 0.275]}>
        <boxGeometry args={[0.16, 0.1, 0.006]} />
        <meshStandardMaterial color={STICKER_YELLOW} roughness={0.6} />
      </mesh>
      {/* 黒いタップ端子 */}
      <mesh position={[0.24, 0.15, 0.16]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>
      {/* 三角形金具+横棒(缶の外径より外側を通す) */}
      <Segment from={[-0.32, -0.4, 0.2]} to={[0, 0.3, 0.32]} radius={0.02} color={METAL} />
      <Segment from={[0.32, -0.4, 0.2]} to={[0, 0.3, 0.32]} radius={0.02} color={METAL} />
      <Segment from={[-0.36, -0.4, 0.2]} to={[0.36, -0.4, 0.2]} radius={0.025} color={METAL} />
    </Transformer>
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

export function ChubuPole() {
  return (
    <>
      <PoleBody />
      {/* 直角に曲がったGWキャップ+三角形の腕金 */}
      <LBracketTop />
      <TriangleArmTop />

      <TriangleBracketTransformer />
      {/* 縦長・角丸プレート+上部に中部電力ロゴ */}
      <PlateBox logo />

      {/* 支線: 黒黄ストライプ(沖縄と共通の柄) */}
      <GuyWire Guard={StripedGuyGuard} />
    </>
  );
}
