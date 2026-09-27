"use client";

import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
import { useEffect, useRef, useState } from "react";
import {
  CURRENT_LAYERS,
  type MapLayer,
  type MarkerShape,
  METRO_BOUNDS,
  PAST_LAYERS,
  type Ruin,
  type RuinCategory,
  ruinCategoryInfo,
} from "@/data/ruins";

export type MapSelection =
  | { type: "ruin"; id: string }
  | { type: "candidate"; id: string }
  | { type: "point"; lat: number; lon: number };

/** 表の行クリックなどで地図を移動させる指示。nonce を変えると同じ地点でも再度移動する */
export type MapFocus = { lat: number; lon: number; zoom: number; nonce: number };

export type MapCandidate = { id: string; name: string; category: RuinCategory; lat: number; lon: number };

type Props = {
  ruins: Ruin[];
  candidates: MapCandidate[];
  selection: MapSelection | null;
  focus: MapFocus | null;
  pastId: string;
  currentId: string;
  onSelectRuin: (id: string) => void;
  onSelectCandidate: (id: string) => void;
  onPickPoint: (lat: number, lon: number) => void;
};

const SHAPE_PATH: Record<MarkerShape, string> = {
  circle: '<circle cx="12" cy="12" r="6.5"/>',
  square: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
  diamond: '<path d="M12 4.2 19.8 12 12 19.8 4.2 12Z"/>',
  triangle: '<path d="M12 4.5 19.5 18H4.5Z"/>',
};

function markerHtml(category: RuinCategory, variant: "ruin" | "candidate") {
  const info = ruinCategoryInfo[category];
  return `<svg viewBox="0 0 24 24" width="24" height="24" style="--mk:var(${info.colorVar})" class="ruin-mk ruin-mk--${variant}">${SHAPE_PATH[info.shape]}</svg>`;
}

function tileLayer(L: typeof Leaflet, layer: MapLayer, pane?: string) {
  return L.tileLayer(layer.url, {
    // pane: undefined を渡すと既定の tilePane を上書きしてしまうため、指定時だけ渡す
    ...(pane ? { pane } : {}),
    tms: layer.tms,
    minZoom: layer.minZoom,
    maxNativeZoom: layer.maxNativeZoom,
    maxZoom: 18,
    attribution:
      layer.source === "konjaku"
        ? '<a href="https://ktgis.net/kjmapw/" target="_blank" rel="noreferrer">今昔マップ on the web</a>(埼玉大学 谷謙二)'
        : '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noreferrer">地理院タイル</a>',
  });
}

function selectionKey(selection: MapSelection | null): string | null {
  if (selection?.type === "ruin") return `r:${selection.id}`;
  if (selection?.type === "candidate") return `c:${selection.id}`;
  return null;
}

/** 過去レイヤーのペインを、スワイプ位置より左だけ見えるように切り抜く(透過モードでは全面) */
function applyClip(map: Leaflet.Map, ratio: number, mode: "swipe" | "fade") {
  const pane = map.getPane("past");
  if (!pane) return;
  if (mode === "fade") {
    pane.style.clip = "";
    return;
  }
  const nw = map.containerPointToLayerPoint([0, 0]);
  const se = map.containerPointToLayerPoint(map.getSize());
  const x = nw.x + (se.x - nw.x) * ratio;
  pane.style.clip = `rect(${nw.y}px, ${x}px, ${se.y}px, ${nw.x}px)`;
}

export function RuinsMap({
  ruins,
  candidates,
  selection,
  focus,
  pastId,
  currentId,
  onSelectRuin,
  onSelectCandidate,
  onPickPoint,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [L, setL] = useState<typeof Leaflet | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markersRef = useRef<Leaflet.LayerGroup | null>(null);
  const markerById = useRef(new Map<string, Leaflet.Marker>());
  const pickRef = useRef<Leaflet.Marker | null>(null);

  const [mode, setMode] = useState<"swipe" | "fade">("swipe");
  const [ratio, setRatio] = useState(0.5);
  const [opacity, setOpacity] = useState(0.6);
  const [zoom, setZoom] = useState(0);
  // 地図のイベント(パン・ズーム)から最新の値を読むための ref
  const view = useRef({ ratio, mode, opacity });
  view.current = { ratio, mode, opacity };

  // コールバックは最新のものを ref 経由で呼ぶ(地図のイベント登録は初回だけ)
  const handlers = useRef({ onSelectRuin, onSelectCandidate, onPickPoint });
  handlers.current = { onSelectRuin, onSelectCandidate, onPickPoint };
  const selectedKey = selectionKey(selection);
  const selectedKeyRef = useRef(selectedKey);
  selectedKeyRef.current = selectedKey;

  const past = PAST_LAYERS.find((l) => l.id === pastId) ?? PAST_LAYERS[0];
  const current = CURRENT_LAYERS.find((l) => l.id === currentId) ?? CURRENT_LAYERS[0];

  // 初期化(Leaflet は window を参照するため、クライアント側で動的に読み込む)
  useEffect(() => {
    let disposed = false;
    import("leaflet").then((mod) => {
      const Lf = (mod as unknown as { default?: typeof Leaflet }).default ?? (mod as typeof Leaflet);
      if (disposed || !containerRef.current) return;
      const map = Lf.map(containerRef.current, {
        minZoom: 7,
        maxZoom: 18,
        scrollWheelZoom: false,
        zoomSnap: 0.5,
      });
      map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noreferrer">Leaflet</a>');
      map.fitBounds(METRO_BOUNDS);
      // ページのスクロール中に地図が勝手に拡大縮小しないよう、地図をクリック(フォーカス)した時だけホイール操作を有効にする
      map.on("focus", () => map.scrollWheelZoom.enable());
      map.on("blur", () => map.scrollWheelZoom.disable());
      map.createPane("past").style.zIndex = "250";
      map.on("move zoomend resize viewreset", () => applyClip(map, view.current.ratio, view.current.mode));
      map.on("click", (e: Leaflet.LeafletMouseEvent) => handlers.current.onPickPoint(e.latlng.lat, e.latlng.lng));
      map.on("zoomend", () => setZoom(map.getZoom()));
      markersRef.current = Lf.layerGroup().addTo(map);
      mapRef.current = map;
      setZoom(map.getZoom());
      setL(Lf);
    });
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // 現在側レイヤー
  useEffect(() => {
    const map = mapRef.current;
    if (!L || !map) return;
    const layer = tileLayer(L, current).addTo(map);
    return () => {
      layer.remove();
    };
  }, [L, current]);

  // 過去側レイヤー(専用ペインに置き、ペインごと切り抜く)
  const pastLayerRef = useRef<Leaflet.TileLayer | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!L || !map) return;
    const layer = tileLayer(L, past, "past").addTo(map);
    layer.setOpacity(view.current.mode === "fade" ? view.current.opacity : 1);
    pastLayerRef.current = layer;
    return () => {
      layer.remove();
      pastLayerRef.current = null;
    };
  }, [L, past]);

  useEffect(() => {
    pastLayerRef.current?.setOpacity(mode === "fade" ? opacity : 1);
  }, [mode, opacity]);

  useEffect(() => {
    if (L && mapRef.current) applyClip(mapRef.current, ratio, mode);
  }, [L, ratio, mode]);

  // マーカー(登録済みの地点 + 手元の候補)
  useEffect(() => {
    const group = markersRef.current;
    if (!L || !group) return;
    group.clearLayers();
    markerById.current.clear();
    const add = (key: string, lat: number, lon: number, name: string, category: RuinCategory, variant: "ruin" | "candidate") => {
      const icon = L.divIcon({ html: markerHtml(category, variant), className: "ruin-marker", iconSize: [24, 24] });
      const selected = key === selectedKeyRef.current;
      const m = L.marker([lat, lon], { icon, keyboard: true, title: name, alt: name, zIndexOffset: selected ? 1000 : 0 })
        .bindTooltip(`${variant === "candidate" ? "候補: " : ""}${name}`, { direction: "top", offset: [0, -10] })
        .on("click", () =>
          variant === "ruin" ? handlers.current.onSelectRuin(key.slice(2)) : handlers.current.onSelectCandidate(key.slice(2)),
        );
      m.addTo(group);
      m.getElement()?.classList.toggle("is-selected", selected);
      markerById.current.set(key, m);
    };
    for (const r of ruins) add(`r:${r.id}`, r.lat, r.lon, r.name, r.category, "ruin");
    for (const c of candidates) add(`c:${c.id}`, c.lat, c.lon, c.name || "(名称未入力)", c.category, "candidate");
  }, [L, ruins, candidates]);

  // 選択中のマーカーを強調し、地点クリック時は十字マーカーを置く
  useEffect(() => {
    const map = mapRef.current;
    if (!L || !map) return;
    const key = selectionKey(selection);
    for (const [k, m] of markerById.current) {
      const on = k === key;
      m.getElement()?.classList.toggle("is-selected", on);
      m.setZIndexOffset(on ? 1000 : 0);
    }
    pickRef.current?.remove();
    pickRef.current = null;
    if (selection?.type === "point") {
      const icon = L.divIcon({ html: "", className: "ruin-pick", iconSize: [28, 28] });
      pickRef.current = L.marker([selection.lat, selection.lon], { icon, interactive: false }).addTo(map);
    }
  }, [L, selection]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focus) return;
    const zoom = Math.max(map.getZoom(), focus.zoom);
    // スワイプ中は地点が境界線に重ならないよう、過去側(境界より左)の真ん中に来るように中心をずらす
    const { mode, ratio } = view.current;
    const shift = mode === "swipe" ? (0.5 - ratio / 2) * map.getSize().x : 0;
    const center = map.unproject(map.project([focus.lat, focus.lon], zoom).add([shift, 0]), zoom);
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [focus]);

  function dragTo(clientX: number) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setRatio(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
  }

  return (
    <div className="ruins-map-block">
      <div className="ruins-map-toolbar">
        <fieldset className="ruins-seg">
          <legend className="visually-hidden">比較の表示方法</legend>
          <button type="button" className={mode === "swipe" ? "active" : ""} onClick={() => setMode("swipe")}>
            スワイプ
          </button>
          <button type="button" className={mode === "fade" ? "active" : ""} onClick={() => setMode("fade")}>
            重ねて透過
          </button>
        </fieldset>
        {mode === "fade" && (
          <label className="ruins-opacity">
            過去の濃さ
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
            />
          </label>
        )}
        <button type="button" className="ruins-ghost-btn" onClick={() => mapRef.current?.flyToBounds(METRO_BOUNDS)}>
          全体を表示
        </button>
      </div>
      <div className="ruins-map-frame" ref={frameRef}>
        <div className="ruins-map" ref={containerRef} id="explorer-map" />
        {!L && <div className="ruins-map-loading">地図を読み込み中…</div>}
        <div className="ruins-map-tag ruins-map-tag--past">
          過去: {past.label}
          {L && past.minZoom && zoom < past.minZoom ? `(ズーム${past.minZoom}以上で表示)` : ""}
        </div>
        <div className="ruins-map-tag ruins-map-tag--now">現在: {current.label}</div>
        {mode === "swipe" && (
          <div
            className="ruins-swipe"
            style={{ left: `${ratio * 100}%` }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              dragTo(e.clientX);
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) dragTo(e.clientX);
            }}
          >
            <button
              type="button"
              className="ruins-swipe-knob"
              role="slider"
              aria-label="過去と現在の境界"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(ratio * 100)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setRatio((r) => Math.max(0, r - 0.05));
                if (e.key === "ArrowRight") setRatio((r) => Math.min(1, r + 0.05));
              }}
            >
              ◀▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
