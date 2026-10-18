// Per-company "識別ポイント" panels: small labelled illustrations of the
// confirmed identification patterns, grouped by confidence, matching the
// community cheat-sheet layout.
import type { ReactNode } from "react";
import type { CompanyId } from "@/data/companies";
import {
  AngleArm,
  BentDropTransformer,
  BoardTransformer,
  BottleGuard,
  BottomExitTransformer,
  ConcretePole,
  ConeTop,
  ContinuousBlueWires,
  DArm,
  DirectGuyWire,
  EnergiaPlate,
  HandwrittenPlate,
  KuKakuZuPlate,
  LArm,
  LBracketTop,
  NarrowKatakanaPlate,
  NiigataPlate,
  OkidenPlate,
  PlusBarTransformer,
  PoleTop,
  RedNumeralTransformer,
  RoundBottomGuard,
  RoundedLogoPlate,
  SparseTop,
  SpiralCylinderGuard,
  Streetlight,
  StripedGuard,
  TArm,
  TapTransformer,
  TateKanjiPlate,
  TentArm,
  TepcoMark,
  ThickPlateLogo,
  TightPlates,
  TohokuLogo,
  TopExitTransformer,
  TriangleArm,
  TriangleCapInsulator,
  WideGrayPlate,
  YellowArrowTag,
  YokoKanjiPlate,
} from "./detailIcons";

type DetailItem = { icon: ReactNode; label: string };
type DetailCategory = { cat: string; badge: "confirmed" | "likely" | "region"; items: DetailItem[] };

// 識別ポイントは任意(ない会社は模式図だけを出す)。キーは CompanyId で綴りを検査する。
const DETAILS: Partial<Record<CompanyId, DetailCategory[]>> = {
  tepco: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <TepcoMark />, label: "東電マーク(赤い社章)" },
        { icon: <BoardTransformer />, label: "木の板に載る変圧器" },
        { icon: <TArm />, label: "変圧器からT字アーム" },
        { icon: <HandwrittenPlate />, label: "灰色・手書きプレート" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [
        { icon: <DArm />, label: "D字アーム" },
        { icon: <PoleTop />, label: "GWキャップ・も字腕金" },
        { icon: <YokoKanjiPlate />, label: "地名が横書き漢字" },
      ],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [
        { icon: <Streetlight band="white" />, label: "白い街灯番号札 → 東京(7割)" },
        { icon: <Streetlight band="yellow" />, label: "黄色い街灯番号札 → 神奈川(9割)" },
      ],
    },
  ],
  hokkaido: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <KuKakuZuPlate />, label: "縦長プレート「区/画/図」書式" },
        { icon: <PlusBarTransformer />, label: "プラス字バー固定・木製板なし" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [
        { icon: <ConeTop />, label: "円錐形ポールトップ(雪対策)" },
        { icon: <SparseTop />, label: "架空地線がほぼ無く頭部が簡素" },
      ],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [{ icon: <Streetlight band="yellow" />, label: "黄色縦長の街灯番号札 → 札幌市" }],
    },
  ],
  tohoku: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <WideGrayPlate />, label: "灰色地・横長プレート+左上ロゴ" },
        { icon: <TopExitTransformer />, label: "引き下げ線が枠の上部から延びる" },
        { icon: <TohokuLogo />, label: "変圧器に東北電力のロゴが付く" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [
        { icon: <SpiralCylinderGuard />, label: "円柱+黒テープ螺旋巻きの支線ガード" },
        { icon: <ConeTop />, label: "円錐形ポールトップ(北海道と同系統)" },
      ],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [{ icon: <NiigataPlate />, label: "横長NTTプレート → 新潟県(確定)" }],
    },
  ],
  chubu: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <RoundedLogoPlate />, label: "縦長・角丸プレート+上部に中部ロゴ" },
        { icon: <LBracketTop />, label: "直角に曲がったGWキャップ" },
        { icon: <TriangleArm />, label: "三角形の腕金" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [{ icon: <TapTransformer />, label: "黄色手書き数字+黒タップ端子" }],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [{ icon: <StripedGuard />, label: "黒黄ストライプの支線ガード(沖縄と共通)" }],
    },
  ],
  hokuriku: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [{ icon: <NarrowKatakanaPlate />, label: "カタカナ+4桁の横長プレート" }],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [
        { icon: <BottleGuard />, label: "ボトル型+黒テープ螺旋(関西・四国と共通)" },
        { icon: <TentArm />, label: "テント状のGW支持腕金" },
      ],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [{ icon: <NarrowKatakanaPlate />, label: "番号帯で県特定(富山0000-3999/石川4000-7999/福井8000-9999)" }],
    },
  ],
  kansai: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <TateKanjiPlate />, label: "縦長・白プレート+漢字/カタカナ縦書き" },
        { icon: <AngleArm />, label: "120°に角度のついた腕金" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [
        { icon: <BottomExitTransformer />, label: "引き下げ線が枠の下部から延びる" },
        { icon: <BottleGuard />, label: "ボトル型+黒テープ螺旋(北陸・四国と共通)" },
      ],
    },
  ],
  chugoku: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <EnergiaPlate />, label: "縦型プレート+ENERGIAロゴ・3枚以上" },
        { icon: <RedNumeralTransformer />, label: "十字バー固定+朱色数字シール" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [{ icon: <RoundBottomGuard />, label: "支線ガードの下部が丸型" }],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [{ icon: <YellowArrowTag />, label: "黄色矢印の昇降表示札(大分でも見られ注意)" }],
    },
  ],
  shikoku: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [{ icon: <LArm />, label: "L字型の腕金(四国電力の代名詞)" }],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [
        { icon: <BentDropTransformer />, label: "引き下げ線が90°に曲がる+底面シール" },
        { icon: <TightPlates />, label: "隙間の狭い小型プレート+ロゴ" },
        { icon: <BottleGuard />, label: "ボトル型+黒テープ螺旋(関西・北陸と共通)" },
      ],
    },
  ],
  kyushu: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [
        { icon: <ThickPlateLogo />, label: "厚手の縦型プレート+上部に社章" },
        { icon: <TriangleCapInsulator />, label: "黒い三角キャップのがいし" },
        { icon: <DirectGuyWire />, label: "支線が中央付近に直接差し込まれる" },
      ],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [{ icon: <ContinuousBlueWires />, label: "青い電線+GWキャップほぼ無し" }],
    },
  ],
  okinawa: [
    {
      cat: "確定情報",
      badge: "confirmed",
      items: [{ icon: <OkidenPlate />, label: "プレートに「沖電/沖縄電力」表記" }],
    },
    {
      cat: "7割確定",
      badge: "likely",
      items: [{ icon: <StripedGuard />, label: "黒黄ストライプの支線ガード(中部と共通)" }],
    },
    {
      cat: "地域ヒント",
      badge: "region",
      items: [{ icon: <ConcretePole />, label: "コンクリート柱(識別力は低め・目安程度)" }],
    },
  ],
};

const BADGE_LABEL: Record<DetailCategory["badge"], string> = {
  confirmed: "確定",
  likely: "7割",
  region: "地域別",
};

export function hasDetailPoints(id: CompanyId): boolean {
  return id in DETAILS;
}

export function DetailPoints({ id }: { id: CompanyId }) {
  const categories = DETAILS[id];
  if (!categories) return null;
  return (
    <div className="detail-points">
      {categories.map((c) => (
        <div key={c.cat}>
          <div className="detail-cat-head">
            <h5>{c.cat}</h5>
            <span className={`detail-badge ${c.badge}`}>{BADGE_LABEL[c.badge]}</span>
          </div>
          <div className="detail-grid">
            {c.items.map((it) => (
              <div key={it.label} className="detail-item">
                {it.icon}
                <span>{it.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
