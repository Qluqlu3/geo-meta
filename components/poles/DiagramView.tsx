"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { CompanyDiagram } from "./CompanyDiagram";
import { DetailPoints, hasDetailPoints } from "./DetailPoints";
import { hasPole3D } from "./diagram3d/ids";

// three.js を含む3D識別図は、3Dタブを開いたときに初めて読み込む(SSRしない)。
const Pole3D = dynamic(() => import("./diagram3d/Pole3D").then((m) => m.Pole3D), {
  ssr: false,
  loading: () => <div className="diagram-3d-loading">読み込み中…</div>,
});

type Mode = "2d" | "3d" | "detail";

export function DiagramView({ id, caption }: { id: string; caption: string }) {
  const [mode, setMode] = useState<Mode>("2d");
  const has3D = hasPole3D(id);
  const hasDetail = hasDetailPoints(id);

  if (!has3D && !hasDetail) {
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
        {has3D && (
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
      {mode === "3d" && has3D && (
        <>
          <div className="diagram-3d-canvas">
            <Pole3D id={id} />
          </div>
          <p className="diagram-caption">{caption}(3D・ドラッグで回転/ピンチでズーム)</p>
        </>
      )}
      {mode === "detail" && hasDetail && <DetailPoints id={id} />}
    </>
  );
}
