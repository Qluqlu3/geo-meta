// 3Dモデルがある会社ID。DiagramView が three.js を読み込まずに「3D」タブを
// 出すかどうか判断できるよう、モデル本体(Pole3D.tsx)とは別の軽いモジュールに置く。
import type { CompanyId } from "@/data/companies";

export const POLE_3D_IDS = [
  "hokkaido",
  "tohoku",
  "tepco",
  "chubu",
  "hokuriku",
  "kansai",
  "chugoku",
  "shikoku",
  "kyushu",
  "okinawa",
] as const satisfies readonly CompanyId[];

export type Pole3DId = (typeof POLE_3D_IDS)[number];

export function hasPole3D(id: CompanyId): id is Pole3DId {
  return (POLE_3D_IDS as readonly string[]).includes(id);
}
