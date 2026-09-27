import type { Metadata } from "next";
import { BackToTop } from "@/components/BackToTop";
import { RuinsExplorer } from "@/components/ruins/RuinsExplorer";
import { RuinsFooter } from "@/components/ruins/RuinsFooter";
import { RuinsHeader } from "@/components/ruins/RuinsHeader";
import { CURRENT_LAYERS, PAST_LAYERS, ruinCategoryInfo, ruins } from "@/data/ruins";

export const metadata: Metadata = {
  title: "廃墟アーカイブ(首都圏) | 新旧の地図比較で埋もれた廃墟・廃集落・廃寺社を記録する",
  description:
    "2010年より前の空中写真・旧版地形図と現在の地図を見比べ、首都圏(1都7県)の廃墟・廃集落・廃寺・廃神社を緯度経度で記録するデータベース(β)。",
};

export default function RuinsPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>
      <RuinsHeader />
      <main id="main">
        <div className="container">
          <section className="hero" id="top">
            <span className="tagline">Haikyo Archive · 首都圏 · β</span>
            <h1>新旧の地図を見比べて、埋もれた廃墟を記録する</h1>
            <p>
              昔の空中写真や地形図には家屋・田畑・寺社の記号が写っているのに、今の地図では森や更地になっている——そんな「名前も情報も残っていない場所」を掘り起こし、緯度経度で残していくデータベースです。山中の廃集落や廃寺社には住所がないことが多いため、位置はすべて緯度経度(WGS84)で記録し、市区町村・大字は国土地理院の逆ジオコーダーによる参考表示にしています。
            </p>
            <p>
              まずは首都圏(1都7県)から着手しています。現在 {ruins.length}件(
              {(Object.keys(ruinCategoryInfo) as (keyof typeof ruinCategoryInfo)[])
                .map((c) => `${ruinCategoryInfo[c].label}${ruins.filter((r) => r.category === c).length}`)
                .join("・")}
              )を収録。
            </p>
            <div className="callout">
              <strong>立ち入りについて:</strong>{" "}
              掲載地点の多くは私有地・立入禁止区域で、倒壊や落石の危険があります。このアーカイブは記録と机上調査のためのもので、訪問を勧めるものではありません(
              <a href="#caution">注意事項</a>)。
            </div>
          </section>

          <RuinsExplorer />

          <section id="method">
            <h2 className="section-title">埋もれた廃墟の探し方</h2>
            <p className="section-sub">
              航空写真の新旧比較は、現地に行かずに「かつて人が暮らしていた痕跡」を見つける方法です。次の順に見ていくと効率よく候補を拾えます。
            </p>
            <div className="legend-grid">
              <div className="legend-item">
                <h4>① 1974〜78年の写真で集落を探す</h4>
                <p>
                  基準は国土地理院の1974〜78年カラー空中写真。首都圏の山間部までほぼ全域が撮影されています。尾根や谷あいの明るい屋根の集まり、段々畑の縞模様、細い道のつながりを探します。
                </p>
              </div>
              <div className="legend-item">
                <h4>② 現在の写真で「消えたもの」を見る</h4>
                <p>
                  スワイプで同じ場所の今を確認。屋根が見えず杉・檜の植林や雑木林に置き換わっていれば廃集落の候補です。屋根が残っていても、道が藪に消えていれば放棄された建物かもしれません。
                </p>
              </div>
              <div className="legend-item">
                <h4>③ 旧版地形図で寺社・集落名を確かめる</h4>
                <p>
                  過去側を「旧版地形図(今昔マップ)」に切り替え、寺院(卍)・神社(鳥居)の記号や集落名を確認。今の標準地図から記号が消えていれば廃寺・廃神社、地名だけが残っていれば廃集落の可能性が高まります。
                </p>
              </div>
              <div className="legend-item">
                <h4>④ 消えた時期を挟み撃ちで絞る</h4>
                <p>
                  1928〜45年・1972〜82年・1988〜2008年の地形図、1979〜90年の写真を順に見て、どの年代の間に消えたかを「放棄・消失の推定時期」に記録します。
                </p>
              </div>
              <div className="legend-item">
                <h4>⑤ 候補に追加して書き出す</h4>
                <p>
                  地図をクリックすると緯度経度・大字・標高が自動で入ります。見えたものを「過去の様子/現在の様子」に書いて保存し、候補リストの
                  JSON を data/ruins.ts に貼れば正式な記録になります。
                </p>
              </div>
            </div>
            <div className="callout">
              <strong>見間違えやすいもの:</strong>{" "}
              ダム湖に沈んだ集落(小河内ダム・宮ヶ瀬ダムなど)は「廃集落」ですが水没のため現地に痕跡はありません。採石場・ゴルフ場・林道工事の造成地は、写真上で集落跡のような更地に見えます。また、古い写真は位置が数十mずれることがあるので、道路や川の形で位置合わせをしてから座標を取ってください。
            </div>
          </section>

          <section id="layers">
            <h2 className="section-title">比較できる年代</h2>
            <p className="section-sub">
              過去側に選べるのは、すべて2010年より前に撮影・作図されたものです。年代によって撮影範囲が違い、範囲外では灰色や空白になります。
            </p>
            <div className="table-scroll">
              <table className="compare">
                <thead>
                  <tr>
                    <th>年代</th>
                    <th>種類</th>
                    <th>範囲・特徴</th>
                    <th>提供元</th>
                  </tr>
                </thead>
                <tbody>
                  {PAST_LAYERS.map((l) => (
                    <tr key={l.id}>
                      <td className="company-cell">{l.years}</td>
                      <td>{l.group}</td>
                      <td>{l.coverage}</td>
                      <td>{l.source === "gsi" ? "国土地理院" : "今昔マップ on the web"}</td>
                    </tr>
                  ))}
                  {CURRENT_LAYERS.map((l) => (
                    <tr key={l.id}>
                      <td className="company-cell">現在</td>
                      <td>{l.label}</td>
                      <td>{l.coverage}</td>
                      <td>国土地理院</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="caution">
            <h2 className="section-title">注意事項</h2>
            <p className="section-sub">記録を続けるための約束事です。</p>
            <div className="reference-list">
              <div className="reference-item">
                <div className="reference-item-head">
                  <h4>私有地・立入禁止</h4>
                </div>
                <p>
                  廃集落の土地や建物にも所有者がいます。無断で立ち入ると住居侵入・建造物侵入などに問われることがあります。現地を訪れる場合は所有者・管理者の許可を取ってください。
                </p>
              </div>
              <div className="reference-item">
                <div className="reference-item-head">
                  <h4>危険</h4>
                </div>
                <p>
                  廃屋の床抜け・倒壊、石垣の崩落、山道の滑落、クマ・スズメバチなど、廃墟・廃集落には危険が多くあります。単独行や悪天候時の訪問は避けてください。
                </p>
              </div>
              <div className="reference-item">
                <div className="reference-item-head">
                  <h4>信仰の場・文化財</h4>
                </div>
                <p>
                  「廃寺」「廃神社」とされていても、地元の方が今もお参りしている祠や墓地があります。石仏・石碑の持ち出しや落書きは厳禁です。盗掘・荒らしの恐れがある場所は、位置精度を「範囲のおおよその中心」に落として記録してください。
                </p>
              </div>
              <div className="reference-item">
                <div className="reference-item-head">
                  <h4>記録の確かさ</h4>
                </div>
                <p>
                  「OSM登録済み」はOpenStreetMapの登録内容を機械的に取り込んだもので、本アーカイブでは未確認です。「新旧比較で発見」も机上の判断で、現地・文献での確認が済むまでは候補として扱ってください。すでに解体された建物が含まれることがあります。
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <RuinsFooter />
      <BackToTop />
    </>
  );
}
