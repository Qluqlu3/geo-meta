"use client";

import { useMemo, useState } from "react";
import type { Company } from "@/data/companies";
import { CompanyCard } from "./CompanyCard";
import { CompareTable } from "./CompareTable";
import { JapanMap } from "./JapanMap";
import { Legend } from "./Legend";

function searchBlob(c: Company): string {
  return [
    c.name,
    c.romaji,
    ...c.areas,
    c.compare.area,
    c.compare.guyWire,
    c.compare.pole,
    c.compare.transformer,
    c.compare.insulator,
    ...c.features.map((f) => `${f.k} ${f.v}`),
    c.confuseNote,
  ]
    .join(" ")
    .toLowerCase();
}

export function AppShell({ companies }: { companies: Company[] }) {
  const [query, setQuery] = useState("");

  const blobs = useMemo(() => new Map(companies.map((c) => [c.id, searchBlob(c)])), [companies]);
  const q = query.trim().toLowerCase();
  const filtered = q ? companies.filter((c) => blobs.get(c.id)?.includes(q)) : companies;

  return (
    <>
      <section className="hero" id="top">
        <span className="tagline">GeoGuessr Japan Meta</span>
        <h1>電柱・電力設備で都道府県を当てる「電柱メタ」図鑑</h1>
        <p>
          日本国内では電力会社ごとに電柱・支線プレート(guy-wire marker)・変圧器・がいしなどの規格が異なり、これが GeoGuessr
          で地域を絞り込む強力な手がかりになります。このサイトは10電力会社ごとに視覚的な識別ポイントを整理した早見リファレンスです。
        </p>
        <p>
          まずは下の <a href="#compare">比較表</a>{" "}
          でざっくり全体像をつかみ、気になる会社があれば詳細セクションへジャンプしてください。
        </p>
        <div className="callout">
          <strong>使い方のコツ:</strong> 色・形だけで断定せず、複数の特徴(支線プレートの形 + 電柱の色 +
          ナンバープレートの書式など)を組み合わせて判断すると精度が上がります。曇天・逆光・拡大不可の場面もあるため、100%当たる指標ではない点に注意してください。
        </div>
        <div style={{ marginTop: 14 }}>
          <label
            htmlFor="quick-search"
            style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "block", marginBottom: 4 }}
          >
            🔍 会社名・キーワードで絞り込み
          </label>
          <input
            id="quick-search"
            type="search"
            placeholder="例: 支線プレート, 三角, TEPCO..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 360,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--border-strong)",
              background: "var(--surface-2)",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
            }}
          />
        </div>
      </section>

      <Legend />

      <section id="map-section">
        <h2 className="section-title">供給エリア地図</h2>
        <p className="section-sub">
          実際の都道府県境界データを使用しています。クリック(タップ)すると各社の詳細セクションにジャンプします。※供給エリアが県内で分かれる静岡・福井は簡略化のため県単位で代表する電力会社の色にしています(詳細は各社カード参照)。沖縄は別枠に本島のみ簡略表示。
        </p>
        <div className="map-wrap">
          <figure className="map-figure">
            <JapanMap companies={companies} />
            <div className="map-legend">
              {companies.map((c) => (
                <span key={c.id}>
                  <i className="dot" style={{ background: `var(${c.colorVar})` }} />
                  {c.name}
                </span>
              ))}
            </div>
          </figure>
          <div className="map-side">
            <h3>この地図の読み方</h3>
            <ol>
              <li>まず色でざっくりエリアを絞り込む</li>
              <li>気になる地域をクリックして詳細カードへ</li>
              <li>詳細カードの識別図と特徴リストを確認</li>
              <li>迷ったら「混同しやすい会社」の注記もチェック</li>
            </ol>
          </div>
        </div>
      </section>

      <section id="compare">
        <h2 className="section-title">早見比較表</h2>
        <p className="section-sub">プレイ中にサッと見返すための一覧。詳細は各社カードへ。</p>
        <CompareTable companies={filtered} />
      </section>

      <section id="companies">
        <h2 className="section-title">電力会社別 詳細ガイド</h2>
        <p className="section-sub">北から順に10電力会社を掲載しています。</p>
        <div className="company-nav-grid">
          {companies.map((c) => (
            <a key={c.id} href={`#${c.id}`}>
              <span className="dot" style={{ background: `var(${c.colorVar})` }} />
              {c.name}
            </a>
          ))}
        </div>
        {filtered.map((c) => (
          <CompanyCard key={c.id} company={c} />
        ))}
      </section>
    </>
  );
}
