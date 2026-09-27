"use client";

import { useMemo, useState } from "react";
import { batchOf, nationalRoutes, prefName, routeByNumber } from "@/data/nationalRoutes";
import { RouteMap } from "./RouteMap";
import { RouteNumberChart } from "./RouteNumberChart";
import { RouteShield } from "./RouteShield";

const EXAMPLES = [5, 58, 101, 229, 339, 390, 452, 505];
const ALL_NUMBERS = nationalRoutes.map((r) => r.n);

export function RouteLookup() {
  const [input, setInput] = useState("229");
  const [picked, setPicked] = useState<number | null>(null);

  const n = Number.parseInt(input, 10);
  const route = Number.isInteger(n) ? routeByNumber.get(n) : undefined;
  const batch = Number.isInteger(n) ? batchOf(n) : undefined;
  const passing = useMemo(() => new Set(route?.prefs ?? []), [route]);
  const routesInPicked = useMemo(
    () => (picked === null ? [] : nationalRoutes.filter((r) => r.prefs.includes(picked)).map((r) => r.n)),
    [picked],
  );

  const select = (next: number) => {
    setInput(String(next));
    setPicked(null);
  };
  const step = (dir: 1 | -1) => {
    const base = Number.isInteger(n) ? n : 0;
    const next = dir === 1 ? ALL_NUMBERS.find((x) => x > base) : ALL_NUMBERS.findLast((x) => x < base);
    if (next !== undefined) select(next);
  };

  return (
    <div className="route-lookup">
      <div className="route-controls">
        <RouteShield n={Number.isInteger(n) ? n : null} size={72} />
        <div className="route-input">
          <label htmlFor="route-number">おにぎり標識の番号</label>
          <div className="route-input-row">
            <button type="button" onClick={() => step(-1)} aria-label="前の番号">
              ◀
            </button>
            <input
              id="route-number"
              type="number"
              inputMode="numeric"
              min={1}
              max={507}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setPicked(null);
              }}
            />
            <button type="button" onClick={() => step(1)} aria-label="次の番号">
              ▶
            </button>
          </div>
          <div className="route-examples">
            {EXAMPLES.map((x) => (
              <button key={x} type="button" className={x === n ? "active" : ""} onClick={() => select(x)}>
                {x}号
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="map-wrap route-body">
        <figure className="map-figure">
          <RouteMap
            passing={passing}
            picked={picked}
            onPick={(id) => setPicked((cur) => (cur === id ? null : id))}
            label={route ? `国道${route.n}号が通過する都道府県の地図` : "都道府県地図"}
          />
          <div className="map-legend">
            <span>
              <i className="dot" style={{ background: "var(--nr-route)" }} />
              {route ? `国道${route.n}号が通過` : "該当なし"}
            </span>
            <span>
              <i className="dot" style={{ border: "2px solid var(--text-primary)" }} />
              クリックした県(逆引き)
            </span>
          </div>
        </figure>

        <div className="route-result" aria-live="polite">
          {route ? (
            <>
              <h3>国道{route.n}号</h3>
              <dl className="route-facts">
                <dt>起点 → 終点</dt>
                <dd>
                  {route.from} → {route.to}
                </dd>
                <dt>通過都道府県</dt>
                <dd>
                  <span className="area-tags">
                    {route.prefs.map((p) => (
                      <span key={p}>{prefName(p)}</span>
                    ))}
                  </span>
                </dd>
                {route.hokkaido && (
                  <>
                    <dt>北海道の振興局</dt>
                    <dd>{route.hokkaido.join(" → ")}</dd>
                  </>
                )}
                <dt>指定年</dt>
                <dd>
                  {route.year}年{batch ? `(${batch.label}の番号帯: ${batch.from}〜${batch.to}号 / ${batch.order})` : ""}
                </dd>
                {route.km && (
                  <>
                    <dt>実延長</dt>
                    <dd>{route.km.toLocaleString("ja-JP")} km</dd>
                  </>
                )}
              </dl>
              {route.prefs.length === 1 && (
                <p className="route-verdict">
                  <strong>この標識1枚で{prefName(route.prefs[0])}に確定</strong>
                  {route.hokkaido && route.hokkaido.length <= 2 ? `(振興局は${route.hokkaido.join("・")}まで絞れる)` : ""}。
                </p>
              )}
            </>
          ) : (
            <>
              <h3>{Number.isInteger(n) ? `国道${n}号` : "番号を入力"}</h3>
              <p className="route-verdict">
                {Number.isInteger(n)
                  ? n >= 59 && n <= 100
                    ? "59〜100号は欠番です。1965年に一級・二級国道の区分が廃止された後、新しい国道は3桁の番号で指定されることになったため(58号は沖縄復帰時の特例)。"
                    : n >= 1 && n <= 507
                      ? "欠番です。1963年の一級・二級国道の再編で統合されました(109号→108号、110号→48号、111号→45号、214〜216号→57号)。"
                      : "国道は1〜507号です。"
                  : "標識に書かれた数字を入力してください。"}
              </p>
            </>
          )}

          {picked !== null && (
            <div className="route-reverse">
              <h4>
                {prefName(picked)}を通る国道({routesInPicked.length}路線)
              </h4>
              <div className="route-examples">
                {routesInPicked.map((x) => (
                  <button key={x} type="button" onClick={() => select(x)}>
                    {x}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <figure className="route-chart-figure">
        <figcaption>
          <strong>番号と緯度の関係</strong>
          <span>
            点1つが1路線(縦位置=起点・終点の緯度の中点)。指定年の帯ごとに右下がり(北→南)に並ぶ。点にカーソルを合わせると詳細、クリックで選択、←→キーで順送り。
          </span>
        </figcaption>
        <RouteNumberChart selected={route?.n ?? null} onSelect={select} />
      </figure>
    </div>
  );
}
