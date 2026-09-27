"use client";

import { useEffect, useState } from "react";
import {
  checkLabel,
  discoveryLabel,
  PAST_LAYERS,
  pastLayerById,
  prefNameOf,
  type Ruin,
  type RuinCategory,
  type RuinStatus,
  ruinCategoryInfo,
  statusLabel,
} from "@/data/ruins";
import { CopyButton } from "./CopyButton";
import {
  fetchElevation,
  formatDms,
  formatLatLon,
  googleMapsUrl,
  gsiMapUrl,
  konjakuUrl,
  type PlaceHint,
  reverseGeocode,
} from "./geo";
import type { Candidate } from "./useCandidates";

const CATEGORIES = Object.keys(ruinCategoryInfo) as RuinCategory[];
const STATUSES = Object.keys(statusLabel) as RuinStatus[];
const round6 = (x: number) => Math.round(x * 1e6) / 1e6;

export function CategoryChip({ category, kind }: { category: RuinCategory; kind?: string }) {
  const info = ruinCategoryInfo[category];
  return (
    <span className="chip">
      <span className={`ruins-swatch ruins-swatch--${info.shape}`} style={{ background: `var(${info.colorVar})` }} />
      {info.label}
      {kind && kind !== info.label && <span className="ruins-muted">({kind})</span>}
    </span>
  );
}

function Coordinates({ lat, lon, precision }: { lat: number; lon: number; precision?: Ruin["precision"] }) {
  const dec = formatLatLon(lat, lon);
  return (
    <div className="ruins-coord">
      <div className="ruins-coord-row">
        <code>{dec}</code>
        <CopyButton text={dec} />
      </div>
      <div className="ruins-coord-row ruins-muted">
        <span>{formatDms(lat, lon)}</span>
        {precision && <span>・{precision === "area" ? "範囲のおおよその中心" : "建物・社殿の位置"}</span>}
      </div>
    </div>
  );
}

function ExternalLinks({ lat, lon, pastId }: { lat: number; lon: number; pastId: string }) {
  const past = pastLayerById.get(pastId);
  // 地理院地図は国土地理院のタイルしか重ねられないので、今昔マップのレイヤー選択時は1974〜78年写真で開く
  const gsiLayer = past?.source === "gsi" ? past.id : "gazo1";
  return (
    <div className="ruins-links">
      <a href={gsiMapUrl(lat, lon, gsiLayer)} target="_blank" rel="noreferrer">
        地理院地図で開く
      </a>
      <a href={konjakuUrl(lat, lon)} target="_blank" rel="noreferrer">
        今昔マップで旧版地形図と比較
      </a>
      <a href={googleMapsUrl(lat, lon)} target="_blank" rel="noreferrer">
        Googleマップ
      </a>
    </div>
  );
}

function placeText(r: Pick<Ruin, "pref" | "municipality" | "locality">) {
  return [prefNameOf.get(r.pref) ?? "", r.municipality ?? "", r.locality ?? ""].join(" ").trim() || "不明";
}

// ---------------------------------------------------------------------------

export function RuinDetail({ ruin, pastId }: { ruin: Ruin; pastId: string }) {
  return (
    <div className="ruins-panel-body">
      <div className="ruins-panel-head">
        <CategoryChip category={ruin.category} kind={ruin.kind} />
        <span className={`detail-badge ${ruin.discovery === "comparison" ? "confirmed" : "reference"}`}>
          {discoveryLabel[ruin.discovery]}
        </span>
      </div>
      <h3>{ruin.name}</h3>
      <dl className="route-facts">
        <dt>緯度経度</dt>
        <dd>
          <Coordinates lat={ruin.lat} lon={ruin.lon} precision={ruin.precision} />
        </dd>
        <dt>付近の地名</dt>
        <dd>
          {placeText(ruin)}
          <span className="ruins-muted">(国土地理院 逆ジオコーダーによる参考値)</span>
        </dd>
        {ruin.elevation != null && (
          <>
            <dt>標高</dt>
            <dd>約{Math.round(ruin.elevation)}m</dd>
          </>
        )}
        <dt>現状</dt>
        <dd>{statusLabel[ruin.status]}</dd>
        {ruin.abandoned && (
          <>
            <dt>放棄・消失の時期</dt>
            <dd>{ruin.abandoned}</dd>
          </>
        )}
        <dt>確認状況</dt>
        <dd>{checkLabel[ruin.check]}</dd>
      </dl>
      {ruin.evidence && ruin.evidence.length > 0 && (
        <div className="ruins-evidence">
          <h4>新旧比較の根拠</h4>
          <ul>
            {ruin.evidence.map((e) => (
              <li key={e.past}>
                <strong>{pastLayerById.get(e.past)?.label ?? e.past}:</strong> {e.pastNote}
                <br />
                <strong>現在:</strong> {e.nowNote}
              </li>
            ))}
          </ul>
        </div>
      )}
      {ruin.note && <p className="ruins-note">{ruin.note}</p>}
      {ruin.sources.length > 0 && (
        <ul className="source-list">
          {ruin.sources.map((s) => (
            <li key={s.label}>
              {s.url ? (
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ) : (
                s.label
              )}
            </li>
          ))}
        </ul>
      )}
      <ExternalLinks lat={ruin.lat} lon={ruin.lon} pastId={pastId} />
    </div>
  );
}

// ---------------------------------------------------------------------------

/** 地図の任意の地点をクリックしたときのパネル: 地名・標高を引き、候補として保存する */
export function PointPanel({
  lat,
  lon,
  pastId,
  onAdd,
}: {
  lat: number;
  lon: number;
  pastId: string;
  onAdd: (c: Candidate) => void;
}) {
  const [hint, setHint] = useState<PlaceHint | null | "loading">("loading");
  const [elevation, setElevation] = useState<number | null>(null);
  const [category, setCategory] = useState<RuinCategory>("village");
  const [name, setName] = useState("");
  const [pastNote, setPastNote] = useState("");
  const [nowNote, setNowNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    setHint("loading");
    setElevation(null);
    reverseGeocode(lat, lon)
      .then((h) => !cancelled && setHint(h))
      .catch(() => !cancelled && setHint(null));
    fetchElevation(lat, lon)
      .then((e) => !cancelled && setElevation(e))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  const place = hint === "loading" ? null : hint;

  function add() {
    const label = ruinCategoryInfo[category].label;
    onAdd({
      id: `cand-${Date.now().toString(36)}`,
      name: name.trim() || `${place?.locality ?? place?.municipality ?? "無名"}の${label}(候補)`,
      category,
      lat: round6(lat),
      lon: round6(lon),
      precision: category === "village" ? "area" : "point",
      pref: place?.prefCode ?? 0,
      municipality: place?.municipality,
      locality: place?.locality,
      elevation: elevation ?? undefined,
      discovery: "comparison",
      check: "desk",
      status: "unknown",
      evidence: pastNote || nowNote ? [{ past: pastId, pastNote, nowNote }] : [],
      sources: [],
      addedAt: new Date().toISOString().slice(0, 10),
    });
    setName("");
    setPastNote("");
    setNowNote("");
  }

  return (
    <div className="ruins-panel-body">
      <div className="ruins-panel-head">
        <span className="detail-badge region">クリックした地点</span>
      </div>
      <dl className="route-facts">
        <dt>緯度経度</dt>
        <dd>
          <Coordinates lat={lat} lon={lon} />
        </dd>
        <dt>付近の地名</dt>
        <dd>
          {hint === "loading"
            ? "取得中…"
            : place
              ? `${place.pref} ${place.municipality} ${place.locality ?? ""}`
              : "取得できませんでした(海上・境界付近など)"}
        </dd>
        <dt>標高</dt>
        <dd>{elevation == null ? "—" : `約${Math.round(elevation)}m`}</dd>
      </dl>
      <ExternalLinks lat={lat} lon={lon} pastId={pastId} />

      <form
        className="ruins-form"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <h4>候補リストに追加</h4>
        <label>
          分類
          <select value={category} onChange={(e) => setCategory(e.target.value as RuinCategory)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {ruinCategoryInfo[c].label}
              </option>
            ))}
          </select>
        </label>
        <label>
          名称(分かれば)
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="空欄なら大字名から自動で付けます" />
        </label>
        <label>
          過去の様子({pastLayerById.get(pastId)?.label})
          <input value={pastNote} onChange={(e) => setPastNote(e.target.value)} placeholder="例: 家屋5〜6棟と段々畑、神社記号" />
        </label>
        <label>
          現在の様子
          <input value={nowNote} onChange={(e) => setNowNote(e.target.value)} placeholder="例: 屋根は見えず杉林。道も途切れる" />
        </label>
        <button type="submit" className="ruins-primary-btn">
          候補に追加(このブラウザに保存)
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function CandidateEditor({
  candidate,
  onChange,
  onRemove,
}: {
  candidate: Candidate;
  onChange: (patch: Partial<Candidate>) => void;
  onRemove: () => void;
}) {
  const ev = candidate.evidence?.[0] ?? { past: "gazo1", pastNote: "", nowNote: "" };
  const setEvidence = (patch: Partial<typeof ev>) => onChange({ evidence: [{ ...ev, ...patch }] });

  return (
    <div className="ruins-panel-body">
      <div className="ruins-panel-head">
        <CategoryChip category={candidate.category} />
        <span className="detail-badge likely">候補(未登録)</span>
      </div>
      <dl className="route-facts">
        <dt>緯度経度</dt>
        <dd>
          <Coordinates lat={candidate.lat} lon={candidate.lon} precision={candidate.precision} />
        </dd>
        <dt>付近の地名</dt>
        <dd>{placeText(candidate)}</dd>
        {candidate.elevation != null && (
          <>
            <dt>標高</dt>
            <dd>約{Math.round(candidate.elevation)}m</dd>
          </>
        )}
      </dl>
      <div className="ruins-form">
        <label>
          名称
          <input value={candidate.name} onChange={(e) => onChange({ name: e.target.value })} />
        </label>
        <label>
          分類
          <select
            value={candidate.category}
            onChange={(e) => {
              const category = e.target.value as RuinCategory;
              onChange({ category, precision: category === "village" ? "area" : "point" });
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {ruinCategoryInfo[c].label}
              </option>
            ))}
          </select>
        </label>
        <label>
          現状
          <select value={candidate.status} onChange={(e) => onChange({ status: e.target.value as RuinStatus })}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          放棄・消失の推定時期
          <input
            value={candidate.abandoned ?? ""}
            onChange={(e) => onChange({ abandoned: e.target.value || undefined })}
            placeholder="例: 1974〜78年写真にはあり、1988〜2008年地形図で消える"
          />
        </label>
        <label>
          比較した過去の地図・写真
          <select value={ev.past} onChange={(e) => setEvidence({ past: e.target.value })}>
            {PAST_LAYERS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          過去の様子
          <input value={ev.pastNote} onChange={(e) => setEvidence({ pastNote: e.target.value })} />
        </label>
        <label>
          現在の様子
          <input value={ev.nowNote} onChange={(e) => setEvidence({ nowNote: e.target.value })} />
        </label>
        <label>
          メモ
          <textarea rows={3} value={candidate.note ?? ""} onChange={(e) => onChange({ note: e.target.value || undefined })} />
        </label>
        <button type="button" className="ruins-ghost-btn ruins-danger" onClick={onRemove}>
          この候補を削除
        </button>
      </div>
      <ExternalLinks lat={candidate.lat} lon={candidate.lon} pastId={ev.past} />
    </div>
  );
}

// ---------------------------------------------------------------------------

export function CandidateList({
  candidates,
  selectedId,
  onSelect,
  onClear,
}: {
  candidates: Candidate[];
  selectedId: string | null;
  onSelect: (c: Candidate) => void;
  onClear: () => void;
}) {
  const json = JSON.stringify(candidates, null, 2);

  function download() {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `ruins-candidates-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="ruins-candidates">
      <div className="ruins-candidates-head">
        <h3>候補リスト({candidates.length}件)</h3>
        {candidates.length > 0 && (
          <div className="ruins-links">
            <CopyButton text={json} label="JSONをコピー" />
            <button type="button" className="ruins-copy" onClick={download}>
              JSONを保存
            </button>
            <button
              type="button"
              className="ruins-copy ruins-danger"
              onClick={() => window.confirm("候補リストをすべて削除しますか?") && onClear()}
            >
              全削除
            </button>
          </div>
        )}
      </div>
      {candidates.length === 0 ? (
        <p className="ruins-muted">
          地図をクリックして「候補に追加」すると、ここに溜まります(このブラウザ内だけに保存され、どこにも送信されません)。
        </p>
      ) : (
        <ul className="ruins-candidate-list">
          {candidates.map((c) => (
            <li key={c.id}>
              <button type="button" className={c.id === selectedId ? "active" : ""} onClick={() => onSelect(c)}>
                <CategoryChip category={c.category} />
                <span>{c.name}</span>
                <code className="ruins-muted">{formatLatLon(c.lat, c.lon)}</code>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
