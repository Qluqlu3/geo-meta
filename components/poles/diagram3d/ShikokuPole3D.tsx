import {
  BottleGuyGuard,
  GuyWire,
  LBracketTop,
  PlateFrame,
  PoleBody,
  Segment,
  STICKER_YELLOW,
  Transformer,
  WIRE,
} from "./Shared3D";

// 変圧器(缶): 高圧引き下げ線が直角(90°)に曲がる+底面にシール。
function BentDropTransformer() {
  return (
    <Transformer>
      {/* 底面のシール(下向きの円板) */}
      <mesh position={[0, -0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial color={STICKER_YELLOW} roughness={0.6} />
      </mesh>
      {/* 引き下げ線が直角(90°)に曲がる */}
      <Segment from={[0.05, -0.33, 0.24]} to={[0.05, -0.6, 0.24]} radius={0.014} color={WIRE} />
      <Segment from={[0.05, -0.6, 0.24]} to={[0.4, -0.6, 0.24]} radius={0.014} color={WIRE} />
    </Transformer>
  );
}

export function ShikokuPole() {
  return (
    <>
      <PoleBody />
      {/* L字型の腕金(四国電力の代名詞) */}
      <LBracketTop rotationY={Math.PI / 2} />

      <BentDropTransformer />
      {/* 隙間の狭い小型プレート2枚(左右に並べる。狭い間隔を強調) */}
      {[-0.16, 0.02].map((x) => (
        <PlateFrame key={x} position={[x, 1.55, 0.16]} width={0.16} height={0.32} inset={0.02} />
      ))}

      {/* 支線: ボトル型+黒テープ螺旋巻き(関西・北陸と共通) */}
      <GuyWire Guard={BottleGuyGuard} />
    </>
  );
}
