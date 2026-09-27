import type { Metadata } from "next";
import { BackToTop } from "@/components/BackToTop";
import { RuinsExplorer } from "@/components/ruins/RuinsExplorer";
import { RuinsFooter } from "@/components/ruins/RuinsFooter";
import { RuinsHeader } from "@/components/ruins/RuinsHeader";
import { CURRENT_LAYERS, oldMapSymbolCount, PAST_LAYERS, ruinCategoryInfo, ruins } from "@/data/ruins";

export const metadata: Metadata = {
  title: "廃墟アーカイブ(首都圏・静岡) | 新旧の地図比較で埋もれた廃墟・廃集落・廃寺社を記録する",
  description:
    "2010年より前の空中写真・旧版地形図と現在の地図を見比べ、首都圏(1都7県)と静岡県の廃墟・廃集落・廃寺・廃神社を緯度経度で記録するデータベース(β)。",
};

export default function RuinsPage() {
  const symbolRuins = ruins.filter((r) => r.discovery === "symbol");
  return (
    <>
      <a className="skip-link" href="#main">
        本文へスキップ
      </a>
      <RuinsHeader />
      <main id="main">
        <div className="container">
          <section className="hero" id="top">
            <span className="tagline">Haikyo Archive · 首都圏・静岡 · β</span>
            <h1>新旧の地図を見比べて、埋もれた廃墟を記録する</h1>
            <p>
              昔の空中写真や地形図には家屋・田畑・寺社の記号が写っているのに、今の地図では森や更地になっている——そんな「名前も情報も残っていない場所」を掘り起こし、緯度経度で残していくデータベースです。山中の廃集落や廃寺社には住所がないことが多いため、位置はすべて緯度経度(WGS84)で記録し、市区町村・大字は国土地理院の逆ジオコーダーによる参考表示にしています。
            </p>
            <p>
              首都圏(1都7県)と、隣接する静岡県から着手しています。現在 {ruins.length}件(
              {(Object.keys(ruinCategoryInfo) as (keyof typeof ruinCategoryInfo)[])
                .map((c) => `${ruinCategoryInfo[c].label}${ruins.filter((r) => r.category === c).length}`)
                .join("・")}
              )を収録。
            </p>
            <p>
              このうち {symbolRuins.length}件は、1972〜82年の旧版地形図から画像照合で拾った神社(鳥居)・寺院(卍)の記号
              {oldMapSymbolCount.toLocaleString()}
              か所のうち、今の地理院地図から消えていたものです(現在は山梨県と静岡県の大井川以東の、カラー印刷の図幅のみ。
              <a href="#symbols">詳しく</a>)。地図では中抜きの記号で表示しています。
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

          <section id="symbols">
            <h2 className="section-title">旧版地形図から消えた寺社記号</h2>
            <p className="section-sub">
              旧版地形図には、小さな村の神社やお堂まで記号で描かれています。その記号が今の地図から消えている場所は、廃神社・廃寺の手がかりになります。1枚ずつ見比べるのは大変なので、機械的に拾いました。
            </p>
            <div className="legend-grid">
              <div className="legend-item">
                <h4>① 旧図の記号を拾う</h4>
                <p>
                  今昔マップの「関東
                  1972〜1982年」の地形図から、神社(鳥居)と寺院(卍)の記号を画像照合で検出。目視で確かめた実例・誤検出例(地名の漢字や黒い等高線など)と照らし合わせてふるい分け、一致度の高いものだけを使っています。抜き取りで目視した一致度0.80以上の検出は、すべて実際の記号でした。等高線まで黒一色で印刷された図幅(富士・沼津周辺、静岡市南部〜焼津、伊豆東海岸、奥多摩・秩父など)は、記号と等高線を区別できないため対象外です。
                </p>
              </div>
              <div className="legend-item">
                <h4>② 今の地図と突き合わせる</h4>
                <p>
                  現在の地理院地図で、半径250m以内に同じ種類の記号(神社・寺院)も名称の注記もない地点だけを残しました。大きな寺社は記号ではなく名称で描かれるため、両方を見ています。旧図は数十m〜200mほどずれることがあるため、半径を広めにとっています。
                </p>
              </div>
              <div className="legend-item">
                <h4>③ 候補として読む</h4>
                <p>
                  消えた理由は区別できません。廃絶のほか、合祀・移転、今の地図で小さな社寺が省略されただけのこともあります。地図で「過去」を旧版地形図
                  1972〜1982年にして記号を確かめ、現地や文献で確認できたものから正式な記録にしてください。
                </p>
              </div>
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
