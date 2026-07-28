import type { KoanPlate } from "@/data/roadSigns";

// 規制標識の下に付く「◯◯県公安委員会」補助標識を模した簡易プレート。
// 実物の正確な書体・配置ではなく、資料から読み取れる色・文字の向きの傾向を表現したもの。
export function KoanPlateIcon({ plate }: { plate: KoanPlate }) {
  const short = plate.pref.replace(/[都道府県]$/, "");
  return (
    <svg className="icon" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="2" y="2" width="36" height="36" rx="5" fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth="1.4" />
      {plate.textOrientation === "vertical" ? (
        <text
          x="20"
          y="19"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="13"
          fontWeight="700"
          fill={plate.colorHex}
          style={{ writingMode: "vertical-rl" }}
        >
          {short}
        </text>
      ) : (
        <text x="20" y="19" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="700" fill={plate.colorHex}>
          {short}
        </text>
      )}
      <text x="20" y="33" textAnchor="middle" fontSize="6" fontWeight="600" fill="var(--text-muted)">
        公安委員会
      </text>
    </svg>
  );
}
