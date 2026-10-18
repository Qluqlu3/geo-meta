// 地域見分けメタ(路面標示・道路標識・風景)で共通の型とラベル。
// 各分野のデータ(roadMarkings.ts / roadSigns.ts / landscape.ts)はここから型を借りる。

export type Confidence = "confirmed" | "likely" | "reference";

export const confidenceLabel: Record<Confidence, string> = {
  confirmed: "複数ソースで確認",
  likely: "有力(裏取り一部)",
  reference: "参考程度",
};

export type Source = { label: string; url: string };

// 電柱プレートに近い「今も現役で地域固有」の強いネタ。Icon は分野ごとの模式アイコンの種類。
export type Spotlight<Icon extends string = string> = {
  id: string;
  icon: Icon;
  title: string;
  areas: string[];
  confidence: Confidence;
  summary: string;
  points: { k: string; v: string }[];
  note: string;
  sources: Source[];
};

// 参考程度(採用保留・弱いネタ)として記録だけ残しておく事例。
export type ReferenceNote = {
  id: string;
  title: string;
  areas: string[];
  note: string;
  sources: Source[];
};
