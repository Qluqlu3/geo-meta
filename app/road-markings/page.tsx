import type { Metadata } from "next";
import { BackToTop } from "@/components/BackToTop";
import { DiamondShowcase } from "@/components/roadmarkings/DiamondShowcase";
import { ReferenceList } from "@/components/roadmarkings/ReferenceList";
import { RoadMarkingsFooter } from "@/components/roadmarkings/RoadMarkingsFooter";
import { RoadMarkingsHeader } from "@/components/roadmarkings/RoadMarkingsHeader";
import { SnowPipeCard } from "@/components/roadmarkings/SnowPipeCard";
import { SpotlightCard } from "@/components/roadmarkings/SpotlightCard";
import { TomareMap } from "@/components/roadmarkings/TomareMap";
import { TomareTypeTable } from "@/components/roadmarkings/TomareTypeTable";
import { spotlights, tomareTypeInfo } from "@/data/roadMarkings";

export const metadata: Metadata = {
  title: "路面標示メタ図鑑 | GeoGuessr 日本 路面標示の見分け方ガイド(β)",
  description:
    "GeoGuessr日本メタ: 道路に直接ペイント・施工された路面標示(止まれの字体、ダイヤマークの形、ウインカー促進標示、消雪パイプなど)の地域差をまとめたリファレンス。",
};

export default function RoadMarkingsPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>
      <RoadMarkingsHeader />
      <main id="main">
        <div className="container">
          <section className="hero" id="top">
            <span className="tagline">GeoGuessr Japan Meta · β</span>
            <h1>路面標示で地域を絞り込む「路面標示メタ」図鑑</h1>
            <p>
              「電柱メタ」の路面標示版。電柱と違い、路面標示は都道府県(公安委員会)ごとに仕様が決まっており、電力会社のようなきれいな地方区分にはなりません。また法定標示の地域差の多くは全国統一化が進む過程の「名残」で、経年で薄れていくタイプの手がかりです。まずは今も現役で地域固有の強いネタ(
              <a href="#spotlights">ウインカー促進標示</a>
              )を押さえ、次に薄れつつある字体差・形状差を補助的に使うのがおすすめです。
            </p>
            <div className="callout">
              <strong>使い方のコツ:</strong>{" "}
              単独の標示だけで断定せず、複数の手がかり(字体タイプ+ダイヤマークの形+気候由来の設備など)を組み合わせて判断してください。各項目には確度バッジ(複数ソースで確認/有力/参考程度)を付けています。
            </div>
          </section>

          <section id="map-section">
            <h2 className="section-title">「止まれ」路面標示 字体タイプマップ</h2>
            <p className="section-sub">
              一時停止の路面標示「止まれ」は、「れ」の字の書き方などが都道府県で異なります。警察庁は1998年前後から全国統一化を進めており、東京タイプへの収束が進行中です。出典は単一の個人サイト(set333.net)によるまとめのため、他ソースでの裏取りは一部の県のみである点に注意してください。
            </p>
            <div className="map-wrap">
              <figure className="map-figure">
                <TomareMap />
                <div className="map-legend">
                  {(Object.keys(tomareTypeInfo) as (keyof typeof tomareTypeInfo)[]).map((key) => (
                    <span key={key}>
                      <i className="dot" style={{ background: `var(${tomareTypeInfo[key].colorVar})` }} />
                      {tomareTypeInfo[key].label}
                    </span>
                  ))}
                </div>
              </figure>
              <div className="map-side">
                <h3>この地図の読み方</h3>
                <ol>
                  <li>大多数は「東京タイプ」へ収束済み・収束中</li>
                  <li>関西の一部県(大阪タイプ)がまだ独自字体を残す</li>
                  <li>北海道は路面標示の「止まれ」自体が少ない</li>
                  <li>「移行中」の県は新旧字体が混在するため確実性は下がる</li>
                </ol>
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <TomareTypeTable />
            </div>
          </section>

          <section id="spotlights">
            <h2 className="section-title">今も現役の強いネタ: ウインカー点灯促進標示</h2>
            <p className="section-sub">
              電柱プレートに近い、地域が一意に特定できるタイプの法定外表示。JAFの調査で「ウインカーを出さない県」の上位に挙がった県が中心です。
            </p>
            {spotlights.map((s) => (
              <SpotlightCard key={s.id} spotlight={s} />
            ))}
          </section>

          <section id="diamond">
            <h2 className="section-title">ダイヤマーク(横断歩道予告標示)の形状差</h2>
            <p className="section-sub">
              「◇」マークの大きさ・設置間隔は全国共通だが、線の太さと切れ込みの数・位置は都道府県ごとに異なる。47都道府県を網羅した資料は見つかっておらず、確認できた事例のみ掲載。
            </p>
            <DiamondShowcase />
          </section>

          <section id="snow-pipe">
            <h2 className="section-title">気候区分メタ: 積雪地域の融雪設備</h2>
            <p className="section-sub">都道府県よりも気候・地形区分に近いタイプの手がかり。</p>
            <SnowPipeCard />
          </section>

          <section id="reference">
            <h2 className="section-title">参考程度(採用保留の弱いネタ)</h2>
            <p className="section-sub">
              再現性が低い・範囲が広すぎる・廃止方向にあるなどの理由で主要コンテンツにはしていないが、記録として残している事例。
            </p>
            <ReferenceList />
          </section>
        </div>
      </main>
      <RoadMarkingsFooter />
      <BackToTop />
    </>
  );
}
