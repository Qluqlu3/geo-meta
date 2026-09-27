import {
  ConeTop,
  GuyWire,
  METAL,
  PlateFrame,
  PlateLogo,
  PlateMark,
  PoleBody,
  Segment,
  SpiralCylinderGuyGuard,
  Transformer,
  WIRE,
} from "./Shared3D";

// 変圧器(缶)+四角ブラケット+ロゴ。高圧引き下げ線がブラケット上部から
// 延びる(関西とは対照的)。
function BracketTransformer() {
  return (
    <Transformer>
      {/* 缶を背負う四角(長方形)ブラケット。四辺とも閉じた枠にし、缶の外径より
          外側を通して缶に隠れないようにする */}
      <Segment from={[-0.32, -0.36, 0.15]} to={[-0.32, 0.44, 0.15]} radius={0.02} color={METAL} />
      <Segment from={[-0.32, 0.44, 0.15]} to={[0.32, 0.44, 0.15]} radius={0.02} color={METAL} />
      <Segment from={[0.32, 0.44, 0.15]} to={[0.32, -0.36, 0.15]} radius={0.02} color={METAL} />
      <Segment from={[0.32, -0.36, 0.15]} to={[-0.32, -0.36, 0.15]} radius={0.02} color={METAL} />
      {/* 高圧引き下げ線: ブラケット上部から延びる */}
      <Segment from={[0, 0.44, 0.15]} to={[-0.1, 0.78, 0.05]} radius={0.014} color={WIRE} />
      {/* 東北電力のロゴ(丸バッジ、商標の忠実な再現ではなく識別用の模式)。
          円柱を正面(+Z)に向けて立てるため90°回転させる */}
      <mesh position={[0, 0.05, 0.275]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.01, 20]} />
        <meshStandardMaterial color="#1a56b0" roughness={0.4} />
      </mesh>
    </Transformer>
  );
}

// 灰色地・横長プレート+左上ロゴ+幹線名の帯。縦長のプレートとは向きが違う。
function WideGrayPlate() {
  return (
    <PlateFrame width={0.66} height={0.4} faceColor="#c9c8c2">
      <PlateLogo x={-0.2} y={0.1} />
      {/* 幹線名(小さい帯) */}
      <PlateMark x={0.05} y={0.1} w={0.22} h={0.03} color="#555" />
      <PlateMark y={-0.05} w={0.4} h={0.07} />
    </PlateFrame>
  );
}

export function TohokuPole() {
  return (
    <>
      <PoleBody />
      {/* 円錐形の頭部構造(北海道と似た系統) */}
      <ConeTop />

      <BracketTransformer />
      <WideGrayPlate />

      {/* 支線: 円柱+黒テープ螺旋巻き(東北特有・ボトル型ではない) */}
      <GuyWire Guard={SpiralCylinderGuyGuard} />
    </>
  );
}
