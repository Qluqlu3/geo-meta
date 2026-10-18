"use client";

import type { ComponentType } from "react";
import { ChubuPole } from "./ChubuPole3D";
import { ChugokuPole } from "./ChugokuPole3D";
import { HokkaidoPole } from "./HokkaidoPole3D";
import { HokurikuPole } from "./HokurikuPole3D";
import type { Pole3DId } from "./ids";
import { KansaiPole } from "./KansaiPole3D";
import { KyushuPole } from "./KyushuPole3D";
import { OkinawaPole } from "./OkinawaPole3D";
import { SceneShell } from "./Shared3D";
import { ShikokuPole } from "./ShikokuPole3D";
import { TepcoPole } from "./TepcoPole3D";
import { TohokuPole } from "./TohokuPole3D";

// 3D識別図の入口。DiagramView から next/dynamic(ssr: false)で1回だけ読み込まれ、
// three.js と10社ぶんのモデルが1つのチャンクにまとまる(モデル自体は数KBずつ)。
// Pole3DId を網羅する Record にしているので、ids.ts に会社を足してモデルを
// 登録し忘れると型エラーになる。
const MODELS: Record<Pole3DId, ComponentType> = {
  hokkaido: HokkaidoPole,
  tohoku: TohokuPole,
  tepco: TepcoPole,
  chubu: ChubuPole,
  hokuriku: HokurikuPole,
  kansai: KansaiPole,
  chugoku: ChugokuPole,
  shikoku: ShikokuPole,
  kyushu: KyushuPole,
  okinawa: OkinawaPole,
};

export function Pole3D({ id }: { id: Pole3DId }) {
  const Model = MODELS[id];
  return (
    <SceneShell>
      <Model />
    </SceneShell>
  );
}
