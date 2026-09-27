import { AngleArm120Top, BottleGuyGuard, GuyWire, PlateFrame, PlateMark, PoleBody, Segment, Transformer, WIRE } from "./Shared3D";

// 変圧器(缶): 高圧引き下げ線が枠の下側から延びる(東北とは対照的)。
function BottomExitTransformer() {
  return (
    <Transformer>
      <Segment from={[0.1, -0.33, 0.2]} to={[0.35, -0.65, 0.3]} radius={0.014} color={WIRE} />
    </Transformer>
  );
}

// 縦長・白プレート。標識名は漢字/カタカナの縦書き(縦の帯で表現)。
function VerticalWhitePlate() {
  return (
    <PlateFrame faceColor="#ffffff">
      <PlateMark x={-0.06} w={0.05} h={0.5} />
      <PlateMark x={0.06} y={0.05} w={0.05} h={0.32} />
    </PlateFrame>
  );
}

export function KansaiPole() {
  return (
    <>
      <PoleBody />
      {/* 120°に角度のついた腕金 */}
      <AngleArm120Top />

      <BottomExitTransformer />
      <VerticalWhitePlate />

      {/* 支線: ボトル型+黒テープ螺旋巻き(北陸・四国と共通) */}
      <GuyWire Guard={BottleGuyGuard} />
    </>
  );
}
