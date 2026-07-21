"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { CompanyDiagram } from "./CompanyDiagram";
import { DetailPoints, hasDetailPoints } from "./DetailPoints";

const loadingFallback = () => <div className="diagram-3d-loading">読み込み中…</div>;

const DIAGRAM_3D: Record<string, ReturnType<typeof dynamic>> = {
  hokkaido: dynamic(() => import("./diagram3d/HokkaidoPole3D").then((m) => m.HokkaidoPole3D), {
    ssr: false,
    loading: loadingFallback,
  }),
  tohoku: dynamic(() => import("./diagram3d/TohokuPole3D").then((m) => m.TohokuPole3D), {
    ssr: false,
    loading: loadingFallback,
  }),
  tepco: dynamic(() => import("./diagram3d/TepcoPole3D").then((m) => m.TepcoPole3D), {
    ssr: false,
    loading: loadingFallback,
  }),
  chubu: dynamic(() => import("./diagram3d/ChubuPole3D").then((m) => m.ChubuPole3D), {
    ssr: false,
    loading: loadingFallback,
  }),
  hokuriku: dynamic(() => import("./diagram3d/HokurikuPole3D").then((m) => m.HokurikuPole3D), {
    ssr: false,
    loading: loadingFallback,
  }),
  kansai: dynamic(() => import("./diagram3d/KansaiPole3D").then((m) => m.KansaiPole3D), {
    ssr: false,
    loading: loadingFallback,
  }),
  chugoku: dynamic(() => import("./diagram3d/ChugokuPole3D").then((m) => m.ChugokuPole3D), {
    ssr: false,
    loading: loadingFallback,
  }),
  shikoku: dynamic(() => import("./diagram3d/ShikokuPole3D").then((m) => m.ShikokuPole3D), {
    ssr: false,
    loading: loadingFallback,
  }),
  kyushu: dynamic(() => import("./diagram3d/KyushuPole3D").then((m) => m.KyushuPole3D), {
    ssr: false,
    loading: loadingFallback,
  }),
  okinawa: dynamic(() => import("./diagram3d/OkinawaPole3D").then((m) => m.OkinawaPole3D), {
    ssr: false,
    loading: loadingFallback,
  }),
};

type Mode = "2d" | "3d" | "detail";

export function DiagramView({ id, caption }: { id: string; caption: string }) {
  const [mode, setMode] = useState<Mode>("2d");
  const Diagram3D = DIAGRAM_3D[id];
  const hasDetail = hasDetailPoints(id);

  if (!Diagram3D && !hasDetail) {
    return (
      <>
        <CompanyDiagram id={id} />
        <p className="diagram-caption">{caption}</p>
      </>
    );
  }

  return (
    <>
      <div className="diagram-tabs" role="tablist" aria-label="識別図の表示切り替え">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "2d"}
          className={mode === "2d" ? "active" : ""}
          onClick={() => setMode("2d")}
        >
          模式図
        </button>
        {Diagram3D && (
          <button
            type="button"
            role="tab"
            aria-selected={mode === "3d"}
            className={mode === "3d" ? "active" : ""}
            onClick={() => setMode("3d")}
          >
            3D <span className="badge-beta">Beta</span>
          </button>
        )}
        {hasDetail && (
          <button
            type="button"
            role="tab"
            aria-selected={mode === "detail"}
            className={mode === "detail" ? "active" : ""}
            onClick={() => setMode("detail")}
          >
            識別ポイント
          </button>
        )}
      </div>

      {mode === "2d" && (
        <>
          <CompanyDiagram id={id} />
          <p className="diagram-caption">{caption}</p>
        </>
      )}
      {mode === "3d" && Diagram3D && (
        <>
          <div className="diagram-3d-canvas">
            <Diagram3D />
          </div>
          <p className="diagram-caption">{caption}(3D・ドラッグで回転/ピンチでズーム)</p>
        </>
      )}
      {mode === "detail" && hasDetail && <DetailPoints id={id} />}
    </>
  );
}
