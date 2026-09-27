"use client";

import { type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { type NationalRoute, nationalRoutes, prefName, routeBatches, routeLatitude } from "@/data/nationalRoutes";

// 横軸 = 路線番号、縦軸 = 起点・終点の緯度(北が上)の散布図。指定年ごとの番号帯の中で
// 点が「北→南」へ右肩下がりに並ぶ、3桁国道の付番規則(ノコギリ状)を見せるのが目的。
// 1〜58号と101号以降の間(59〜100号は欠番)は横軸を詰めて表示する。

const HEIGHT = 280;
const M = { top: 30, right: 12, bottom: 30, left: 40 };
const LAT_MIN = 24;
const LAT_MAX = 46;
const GAP = 14;
const SEGMENTS: [number, number][] = [
  [1, 58],
  [101, 507],
];

const plotted = nationalRoutes
  .map((r) => ({ r, lat: routeLatitude(r) }))
  .filter((p): p is { r: NationalRoute; lat: number } => p.lat !== null);

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(720);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(320, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

export function RouteNumberChart({ selected, onSelect }: { selected: number | null; onSelect: (n: number) => void }) {
  const [wrapRef, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<NationalRoute | null>(null);

  const scale = useMemo(() => {
    const inner = width - M.left - M.right - GAP;
    const units = SEGMENTS.reduce((acc, [a, b]) => acc + (b - a + 1), 0);
    const perUnit = inner / units;
    const x = (n: number) => {
      const [a1, b1] = SEGMENTS[0];
      if (n <= b1) return M.left + (n - a1 + 0.5) * perUnit;
      const [a2] = SEGMENTS[1];
      return M.left + (b1 - a1 + 1) * perUnit + GAP + (n - a2 + 0.5) * perUnit;
    };
    const y = (lat: number) => M.top + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (HEIGHT - M.top - M.bottom);
    return { x, y };
  }, [width]);

  const nearest = (px: number) => {
    let best: NationalRoute | null = null;
    let bestD = Number.POSITIVE_INFINITY;
    for (const { r } of plotted) {
      const d = Math.abs(scale.x(r.n) - px);
      if (d < bestD) {
        bestD = d;
        best = r;
      }
    }
    return best;
  };

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHover(nearest(e.clientX - rect.left));
  };

  const step = (dir: 1 | -1) => {
    const ns = plotted.map((p) => p.r.n);
    const i = selected === null ? -1 : ns.indexOf(selected);
    const next = ns[Math.min(ns.length - 1, Math.max(0, i + dir))];
    if (next !== undefined) onSelect(next);
  };

  const sel = plotted.find((p) => p.r.n === selected);
  const hov = hover ? plotted.find((p) => p.r.n === hover.n) : undefined;
  const yTicks = [25, 30, 35, 40, 45];
  const tooltipLeft = hov ? Math.min(Math.max(scale.x(hov.r.n) - 110, 4), width - 224) : 0;

  return (
    <div
      className="route-chart"
      ref={wrapRef}
      role="slider"
      aria-label="国道番号と路線の緯度の散布図(←→キーで路線を順送り)。指定年ごとに北から南へ番号が振られている"
      aria-valuemin={1}
      aria-valuemax={507}
      aria-valuenow={selected ?? undefined}
      aria-valuetext={sel ? `国道${sel.r.n}号(${sel.r.prefs.map(prefName).join("・")})` : "未選択"}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        }
      }}
    >
      <svg
        width={width}
        height={HEIGHT}
        aria-hidden="true"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onClick={() => hover && onSelect(hover.n)}
      >
        {/* 指定年の帯(背景)。幅が狭い帯はラベルを省略し、下の早見表に任せる */}
        {routeBatches.map((b, i) => {
          const x0 = scale.x(b.from) - (scale.x(b.from + 1) - scale.x(b.from)) / 2;
          const x1 = scale.x(b.to) + (scale.x(b.from + 1) - scale.x(b.from)) / 2;
          return (
            <g key={b.id}>
              <rect
                x={x0}
                y={M.top}
                width={x1 - x0}
                height={HEIGHT - M.top - M.bottom}
                fill={i % 2 === 0 ? "var(--surface-2)" : "transparent"}
              />
              {x1 - x0 > 34 && (
                <text x={(x0 + x1) / 2} y={M.top - 10} className="route-chart-band">
                  {b.id}
                </text>
              )}
            </g>
          );
        })}

        {yTicks.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={width - M.right} y1={scale.y(t)} y2={scale.y(t)} className="route-chart-grid" />
            <text x={M.left - 6} y={scale.y(t) + 4} className="route-chart-tick" textAnchor="end">
              {t}°N
            </text>
          </g>
        ))}
        {[1, 58, 101, 200, 300, 400, 507].map((n) => (
          <text key={n} x={scale.x(n)} y={HEIGHT - M.bottom + 16} className="route-chart-tick" textAnchor="middle">
            {n}
          </text>
        ))}
        <text x={scale.x(58) + GAP / 2 + 3} y={HEIGHT - M.bottom + 16} className="route-chart-tick" textAnchor="middle">
          ≈
        </text>

        {plotted.map(({ r, lat }) => (
          <circle key={r.n} cx={scale.x(r.n)} cy={scale.y(lat)} r={3} className="route-chart-dot" />
        ))}

        {hov && (
          <line x1={scale.x(hov.r.n)} x2={scale.x(hov.r.n)} y1={M.top} y2={HEIGHT - M.bottom} className="route-chart-crosshair" />
        )}
        {sel && (
          <g>
            <line
              x1={scale.x(sel.r.n)}
              x2={scale.x(sel.r.n)}
              y1={M.top}
              y2={HEIGHT - M.bottom}
              className="route-chart-selected-line"
            />
            <circle cx={scale.x(sel.r.n)} cy={scale.y(sel.lat)} r={6} className="route-chart-selected" />
          </g>
        )}
      </svg>
      {hov && (
        <div className="route-chart-tooltip" style={{ left: tooltipLeft }} aria-hidden="true">
          <strong>国道{hov.r.n}号</strong>
          <span>{hov.r.prefs.map(prefName).join("・")}</span>
          <span className="muted">
            {hov.r.year}年指定 · {hov.r.from} → {hov.r.to}
          </span>
        </div>
      )}
    </div>
  );
}
