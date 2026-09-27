"use client";

import { useMemo, useState } from "react";
import {
  CURRENT_LAYERS,
  checkLabel,
  type Discovery,
  discoveryLabel,
  METRO_PREFS,
  PAST_LAYERS,
  prefNameOf,
  type Ruin,
  type RuinCategory,
  ruinCategoryInfo,
  ruins,
} from "@/data/ruins";
import { CopyButton } from "./CopyButton";
import { formatLatLon, gsiMapUrl, konjakuUrl } from "./geo";
import { type MapFocus, type MapSelection, RuinsMap } from "./RuinsMap";
import { CandidateEditor, CandidateList, CategoryChip, PointPanel, RuinDetail } from "./RuinsPanel";
import { type Candidate, useCandidates } from "./useCandidates";

const CATEGORIES = Object.keys(ruinCategoryInfo) as RuinCategory[];
const PAST_GROUPS = [...new Set(PAST_LAYERS.map((l) => l.group))];
const TABLE_PAGE = 120;

type PrefFilter = "all" | "core" | number;

export function RuinsExplorer() {
  const [cats, setCats] = useState<Set<RuinCategory>>(() => new Set(CATEGORIES));
  const [pref, setPref] = useState<PrefFilter>("all");
  const [discovery, setDiscovery] = useState<"all" | Discovery>("all");
  const [query, setQuery] = useState("");
  const [pastId, setPastId] = useState("gazo1");
  const [currentId, setCurrentId] = useState("seamlessphoto");
  const [selection, setSelection] = useState<MapSelection | null>(null);
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { candidates, add, addMany, update, remove, clear } = useCandidates();

  const filtered = useMemo(() => {
    const q = query.trim();
    const corePrefs = new Set(METRO_PREFS.filter((p) => p.core).map((p) => p.code));
    return ruins.filter(
      (r) =>
        cats.has(r.category) &&
        (pref === "all" || (pref === "core" ? corePrefs.has(r.pref) : r.pref === pref)) &&
        (discovery === "all" || r.discovery === discovery) &&
        (!q || [r.name, r.kind, r.municipality, r.locality, r.note].some((v) => v?.includes(q))),
    );
  }, [cats, pref, discovery, query]);

  const counts = useMemo(() => {
    const c = Object.fromEntries(CATEGORIES.map((k) => [k, 0])) as Record<RuinCategory, number>;
    for (const r of filtered) c[r.category]++;
    return c;
  }, [filtered]);

  const selectedRuin = selection?.type === "ruin" ? ruins.find((r) => r.id === selection.id) : undefined;
  const selectedCandidate = selection?.type === "candidate" ? candidates.find((c) => c.id === selection.id) : undefined;

  function toggleCat(c: RuinCategory) {
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  function flyTo(lat: number, lon: number, zoom = 16) {
    setFocus({ lat, lon, zoom, nonce: Date.now() });
  }

  function selectRuinFromTable(r: Ruin) {
    setSelection({ type: "ruin", id: r.id });
    flyTo(r.lat, r.lon);
    document.getElementById("explorer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectCandidate(c: Candidate) {
    setSelection({ type: "candidate", id: c.id });
    flyTo(c.lat, c.lon);
  }

  const rows = showAll ? filtered : filtered.slice(0, TABLE_PAGE);

  return (
    <>
      <section id="explorer">
        <h2 className="section-title">新旧比較マップ</h2>
        <p className="section-sub">
          左側に2010年より前の空中写真・旧版地形図、右側に現在の地図を重ね、境界の「◀▶」を左右に動かして見比べます。昔は家屋や寺社記号があったのに、今は森や更地になっている場所が「埋もれた廃墟」の候補です。気になる地点をクリックすると緯度経度・付近の地名・標高が表示され、候補として保存できます。
        </p>

        <div className="ruins-filters">
          <fieldset className="ruins-cat-filter">
            <legend className="visually-hidden">分類で絞り込み</legend>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={cats.has(c) ? "active" : ""}
                aria-pressed={cats.has(c)}
                onClick={() => toggleCat(c)}
              >
                <CategoryChip category={c} />
                <span className="ruins-count">{counts[c]}</span>
              </button>
            ))}
          </fieldset>
          <label>
            <span className="visually-hidden">都県</span>
            <select
              value={String(pref)}
              onChange={(e) => {
                const v = e.target.value;
                setPref(v === "all" || v === "core" ? v : Number(v));
              }}
            >
              <option value="all">すべて(1都7県・静岡県)</option>
              <option value="core">1都3県のみ</option>
              {METRO_PREFS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="visually-hidden">出どころ</span>
            <select value={discovery} onChange={(e) => setDiscovery(e.target.value as "all" | Discovery)}>
              <option value="all">出どころ: すべて</option>
              {(Object.keys(discoveryLabel) as Discovery[]).map((d) => (
                <option key={d} value={d}>
                  {discoveryLabel[d]}
                </option>
              ))}
            </select>
          </label>
          <label className="ruins-search">
            <span className="visually-hidden">名称・地名で検索</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="名称・地名で検索" />
          </label>
        </div>

        <div className="ruins-layer-pickers">
          <label>
            過去(左)
            <select value={pastId} onChange={(e) => setPastId(e.target.value)}>
              {PAST_GROUPS.map((g) => (
                <optgroup key={g} label={g}>
                  {PAST_LAYERS.filter((l) => l.group === g).map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label>
            現在(右)
            <select value={currentId} onChange={(e) => setCurrentId(e.target.value)}>
              {CURRENT_LAYERS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
          <p className="ruins-muted">{PAST_LAYERS.find((l) => l.id === pastId)?.coverage}</p>
        </div>

        <div className="ruins-explorer">
          <div className="ruins-explorer-map">
            <RuinsMap
              ruins={filtered}
              candidates={candidates}
              selection={selection}
              focus={focus}
              pastId={pastId}
              currentId={currentId}
              onSelectRuin={(id) => setSelection({ type: "ruin", id })}
              onSelectCandidate={(id) => setSelection({ type: "candidate", id })}
              onPickPoint={(lat, lon) => setSelection({ type: "point", lat, lon })}
            />
            <div className="map-legend">
              {CATEGORIES.map((c) => (
                <span key={c}>
                  <CategoryChip category={c} />
                </span>
              ))}
              <span>
                <span className="ruins-swatch ruins-swatch--auto" />
                中抜き = 旧版地形図の記号から自動検出(未確認)
              </span>
              <span>
                <span className="ruins-swatch ruins-swatch--candidate" />
                白抜き = 手元の候補
              </span>
              <span className="ruins-muted">
                表示中 {filtered.length}
                件。過去側が灰色・空白のときは、その年代の撮影・図化範囲外です。地図をクリックするとホイールで拡大縮小できます。
              </span>
            </div>
          </div>

          <aside className="ruins-panel" aria-live="polite">
            {selectedRuin ? (
              <RuinDetail
                ruin={selectedRuin}
                pastId={pastId}
                onShowPast={(id) => {
                  setPastId(id);
                  flyTo(selectedRuin.lat, selectedRuin.lon, 16);
                }}
              />
            ) : selectedCandidate ? (
              <CandidateEditor
                candidate={selectedCandidate}
                onChange={(patch) => update(selectedCandidate.id, patch)}
                onRemove={() => {
                  remove(selectedCandidate.id);
                  setSelection(null);
                }}
              />
            ) : selection?.type === "point" ? (
              <PointPanel
                lat={selection.lat}
                lon={selection.lon}
                pastId={pastId}
                onAdd={(c) => {
                  add(c);
                  setSelection({ type: "candidate", id: c.id });
                }}
              />
            ) : (
              <div className="ruins-panel-body ruins-panel-empty">
                <h3>地点を選んでください</h3>
                <ol>
                  <li>ズーム14〜16まで寄せて、境界「◀▶」を左右に動かす</li>
                  <li>昔の家屋・田畑・寺社記号が、今は森や更地になっている所を探す</li>
                  <li>地図をクリック → 緯度経度・地名・標高を確認して「候補に追加」</li>
                  <li>登録済みの地点はマーカーをクリックすると詳細が出ます</li>
                </ol>
              </div>
            )}
            <CandidateList
              candidates={candidates}
              selectedId={selectedCandidate?.id ?? null}
              onSelect={selectCandidate}
              onImport={addMany}
              onClear={() => {
                clear();
                if (selection?.type === "candidate") setSelection(null);
              }}
            />
          </aside>
        </div>
      </section>

      <section id="database">
        <h2 className="section-title">データベース</h2>
        <p className="section-sub">
          上のフィルターと連動した一覧です(現在 {filtered.length}
          件)。行をクリックすると地図がその地点へ移動します。緯度経度は世界測地系(WGS84)の十進表記で、Googleマップ・地理院地図の検索欄にそのまま貼り付けられます。
        </p>
        <div className="table-scroll">
          <table className="compare ruins-table">
            <thead>
              <tr>
                <th>名称</th>
                <th>分類</th>
                <th>付近の地名</th>
                <th>緯度経度</th>
                <th>出どころ・確認</th>
                <th>比較リンク</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={selectedRuin?.id === r.id ? "is-selected" : ""}>
                  <td className="company-cell">
                    <button type="button" className="ruins-row-btn" onClick={() => selectRuinFromTable(r)}>
                      {r.name}
                    </button>
                  </td>
                  <td>
                    <CategoryChip category={r.category} kind={r.kind} />
                  </td>
                  <td>
                    {prefNameOf.get(r.pref)} {r.municipality} {r.locality}
                  </td>
                  <td className="ruins-coord-cell">
                    <code>{formatLatLon(r.lat, r.lon)}</code>
                    <CopyButton text={formatLatLon(r.lat, r.lon)} />
                  </td>
                  <td>
                    {discoveryLabel[r.discovery]}
                    <br />
                    <span className="ruins-muted">{checkLabel[r.check]}</span>
                  </td>
                  <td className="ruins-links">
                    <a href={gsiMapUrl(r.lat, r.lon)} target="_blank" rel="noreferrer">
                      地理院
                    </a>
                    <a href={konjakuUrl(r.lat, r.lon)} target="_blank" rel="noreferrer">
                      今昔
                    </a>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="ruins-muted">
                    条件に合う地点はありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > TABLE_PAGE && (
          <button type="button" className="ruins-ghost-btn ruins-more" onClick={() => setShowAll((v) => !v)}>
            {showAll ? `先頭${TABLE_PAGE}件だけ表示` : `残り${filtered.length - TABLE_PAGE}件も表示`}
          </button>
        )}
      </section>
    </>
  );
}
