import type { Metadata } from "next";
import { BackToTop } from "@/components/BackToTop";
import { AnimalSignShowcase } from "@/components/roadsigns/AnimalSignShowcase";
import { ChainRegulationTable } from "@/components/roadsigns/ChainRegulationTable";
import { KoanShowcase } from "@/components/roadsigns/KoanShowcase";
import { LedRateTable } from "@/components/roadsigns/LedRateTable";
import { ReferenceList } from "@/components/roadsigns/ReferenceList";
import { RoadSignsFooter } from "@/components/roadsigns/RoadSignsFooter";
import { RoadSignsHeader } from "@/components/roadsigns/RoadSignsHeader";
import { RoadSignsLegend } from "@/components/roadsigns/RoadSignsLegend";
import { SignalMap } from "@/components/roadsigns/SignalMap";
import { SignalSpotlightCard } from "@/components/roadsigns/SignalSpotlightCard";
import { SignalTypeTable } from "@/components/roadsigns/SignalTypeTable";
import { signalOrientationInfo, signalSpotlights } from "@/data/roadSigns";

export const metadata: Metadata = {
  title: "道路標識メタ図鑑 | GeoGuessr 日本 標識・信号機の見分け方ガイド(β)",
  description:
    "GeoGuessr日本メタ: ポール設置の標識板・信号機(縦型/横型、公安委員会シール、動物注意標識、チェーン規制標識など)の地域差をまとめたリファレンス。",
};

export default function RoadSignsPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>
      <RoadSignsHeader />
      <main id="main">
        <div className="container">
          <section className="hero" id="top">
            <span className="tagline">GeoGuessr Japan Meta · β</span>
            <h1>標識・信号機で地域を絞り込む「道路標識メタ」図鑑</h1>
            <p>
              「電柱メタ」「路面標示メタ」に続く第3弾。今回はポールに設置された標識板と信号機が対象です。国の統一規格が基本にある分野ですが、
              <a href="#signal-map">積雪対策による信号機の形の違い</a>、<a href="#koan">公安委員会シールの字体差</a>、
              <a href="#animal">動物注意標識の絵柄</a>など、統一の"隙間"に地域差が残っています。
            </p>
            <div className="callout">
              <strong>使い方のコツ:</strong>{" "}
              単独の標識だけで断定せず、電柱メタ・路面標示メタと組み合わせて判断してください。各項目には確度バッジ(複数ソースで確認/有力/参考程度)を付けています。
            </div>
          </section>

          <RoadSignsLegend />

          <section id="signal-map">
            <h2 className="section-title">信号機の縦型/横型マップ</h2>
            <p className="section-sub">
              積雪により灯器のアーム(腕金)に雪が積もる負荷を避けるため、日本海側・豪雪地帯では「縦型」信号機が標準になっています。個別に確認できたのは一部県のみで、それ以外は全国的なデフォルトである「横型」と仮定して表示しています。
            </p>
            <div className="map-wrap">
              <figure className="map-figure">
                <SignalMap />
                <div className="map-legend">
                  {(Object.keys(signalOrientationInfo) as (keyof typeof signalOrientationInfo)[]).map((key) => (
                    <span key={key}>
                      <i className="dot" style={{ background: `var(${signalOrientationInfo[key].colorVar})` }} />
                      {signalOrientationInfo[key].label}
                    </span>
                  ))}
                </div>
              </figure>
              <div className="map-side">
                <h3>この地図の読み方</h3>
                <ol>
                  <li>縦型が標準: 北海道・秋田・山形・新潟・富山</li>
                  <li>縦型・横型が混在: 青森(東西)・長野(南北)・福島/岐阜(山間部)</li>
                  <li>それ以外は全国デフォルトの横型(未確認の県を含む)</li>
                  <li>「縦型のみ」を見たら太平洋側(東京・大阪など)である可能性はかなり低い</li>
                </ol>
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <SignalTypeTable />
            </div>
          </section>

          <section id="signal-notes">
            <h2 className="section-title">信号機のその他の強いネタ</h2>
            <p className="section-sub">
              縦型/横型以外にも、警察庁の規格変更や各県警の更新方針の違いから生まれた、信号機まわりの強い識別ポイント。
            </p>
            {signalSpotlights.map((s) => (
              <SignalSpotlightCard key={s.id} spotlight={s} />
            ))}
            <LedRateTable />
          </section>

          <section id="koan">
            <h2 className="section-title">公安委員会の補助標識(シール)</h2>
            <p className="section-sub">
              一時停止・駐車禁止などの規制標識の下に付く「◯◯県公安委員会」の補助標識。都道府県名が直接書かれる最強の識別要素だが、Street
              View解像度では文字が読めないことも多く、実戦では字体・色・取付位置の差で判別するのが現実的。出典は単一の個人ブログによる観察のため、確度は「有力」程度に留めています。
            </p>
            <KoanShowcase />
          </section>

          <section id="animal">
            <h2 className="section-title">動物注意警戒標識の絵柄バリエーション</h2>
            <p className="section-sub">
              黄色ひし形の警戒標識「動物が飛び出すおそれあり」は、シカ・サル・ウサギ・タヌキ以外は道路管理者が任意にシルエットを差し替えてよく、全国で160種類以上のローカルバリエーションがあります。電柱・路面標示に次ぐ第3の柱になりうる、現役の強いネタです。
            </p>
            <AnimalSignShowcase />
          </section>

          <section id="chain">
            <h2 className="section-title">チェーン規制標識</h2>
            <p className="section-sub">
              2018年に新設された、タイヤチェーンの装着を義務付ける標識。過去に大規模な立ち往生が発生した峠区間、全国13区間にのみ限定設置されています。
            </p>
            <ChainRegulationTable />
          </section>

          <section id="reference">
            <h2 className="section-title">参考程度(採用保留の弱いネタ)</h2>
            <p className="section-sub">
              裏付け不足・未開拓・既存の結論と矛盾するなどの理由で主要コンテンツにはしていないが、記録として残している事例。
            </p>
            <ReferenceList />
          </section>
        </div>
      </main>
      <RoadSignsFooter />
      <BackToTop />
    </>
  );
}
