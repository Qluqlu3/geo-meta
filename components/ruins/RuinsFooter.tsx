import { oldMapSymbolSource, osmSource, osmTimestamp } from "@/data/ruins";

export function RuinsFooter() {
  return (
    <footer>
      <div className="container">
        <p>
          廃墟アーカイブは、地図と空中写真の新旧比較から放棄された建物・集落・寺社を記録する非公式のデータベースです。掲載地点の多くは私有地や立入禁止区域で、倒壊・落石などの危険があります。掲載は立ち入りを勧めるものではありません。現地を訪れる場合は所有者・管理者の許可を得て、法令と地域のルールに従ってください。
        </p>
        <p>
          地図タイル:{" "}
          <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noreferrer">
            地理院タイル
          </a>
          (国土地理院)/{" "}
          <a href="https://ktgis.net/kjmapw/" target="_blank" rel="noreferrer">
            今昔マップ on the web
          </a>
          (埼玉大学教育学部 谷謙二)。地名・標高: 国土地理院 逆ジオコーダー・標高API。
        </p>
        <p>
          既存情報のレコード: {osmSource}(データ取得 {osmTimestamp.slice(0, 10)})。OpenStreetMap 由来のレコードは ODbL
          で提供します。詳しい調査手順・出典は同リポジトリの RESEARCH_ruins.md を参照。
        </p>
        <p>消えた寺社記号: {oldMapSymbolSource}。自動検出のため、各地点は未確認です。</p>
        <p>
          <a href="/sitemap">サイトマップ</a>
        </p>
      </div>
    </footer>
  );
}
