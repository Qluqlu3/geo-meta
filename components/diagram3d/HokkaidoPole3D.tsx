import { ConeTop, GuyWire, METAL, PlateBox, PoleBody, Segment, TallYellowGuyGuard, Transformer } from "./Shared3D";

// 変圧器(缶): プラス(+)字型のバーで側面固定。木製の取付板は使わない
// (北海道特有・関東の木製板+2本バー構成との識別点)。
function PlusBarTransformer() {
  return (
    <Transformer bushings>
      {/* プラス字固定バー: 缶の正面に直接重ねて固定される十字金具 */}
      <Segment from={[0, -0.2, 0.27]} to={[0, 0.2, 0.27]} radius={0.035} color={METAL} />
      <Segment from={[-0.2, 0, 0.27]} to={[0.2, 0, 0.27]} radius={0.035} color={METAL} />
    </Transformer>
  );
}

export function HokkaidoPole() {
  return (
    <>
      <PoleBody />
      {/* 架空地線がほぼ無く頭部が簡素(北海道特有) */}
      <ConeTop />

      <PlusBarTransformer />
      <PlateBox />

      {/* 支線: 黄色く縦長のガード(黒黄トラ柄の報告もある) */}
      <GuyWire Guard={TallYellowGuyGuard} />
    </>
  );
}
