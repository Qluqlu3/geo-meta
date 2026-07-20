# 電柱メタ図鑑 — 作業まとめ

GeoGuessr日本メタ「電柱で電力会社(≒地域)を見分ける」ための静的リファレンスサイト。
**Next.js (App Router) の SSG (`output: "export"`) で静的HTMLに書き出す構成**に移行済み。

## 成果物(Next.js版)

| パス | 内容 |
|---|---|
| `app/page.tsx` / `app/layout.tsx` | ページ本体・メタデータ |
| `app/globals.css` | デザイントークン・レイアウト・ライト/ダーク対応(内容は旧版と同一) |
| `data/companies.ts` | 10電力会社ぶんのデータ(エリア・比較表・特徴・混同注意・地図座標など) |
| `components/` | `Header` `AppShell`(検索state) `JapanMap` `CompareTable` `CompanyCard` `CompanyDiagram` `Legend` `ThemeToggle` `BackToTop` `Footer` `MarkerDefs` `RichText` |
| `next.config.ts` | `output: "export"` (静的書き出し) + `images.unoptimized` |
| `legacy-static/` | 移行前の素のHTML/CSS/JS版(参考保存、ビルドには含まれない) |

### ビルド・確認方法

```bash
pnpm install
pnpm build   # next build → out/ に静的HTMLを書き出し
pnpm dev     # 開発サーバー(http://localhost:3000)
```

### コンポーネント設計のポイント

- 10社ぶんのカード・比較表は **`data/companies.ts` 1箇所を編集すれば全箇所に反映**される(旧版はHTMLを10箇所コピペしていた)
- 地図は `data/japanPrefectures.json`(実際の都道府県境界データ、後述)を電力会社IDでグルーピングして描画。色は `companies.ts` の `colorVar` を引く
- 識別図(SVG)は各社ごとに描画内容が異なる一点物のため `components/CompanyDiagram.tsx` に個別実装として残置(データ化はしていない)。ポール(電柱本体)のグラデーションと接地影は共通コンポーネント化(`Ground`, `#pole-gradient`)
- 検索絞り込み・テーマ切替・地図クリック・back-to-topはクライアントコンポーネント(`"use client"`)、それ以外はサーバーコンポーネントのままSSGされる

## サイト構成

1. **見分け方の基本カテゴリ** — 支線プレート/電柱本体/変圧器/番号プレート/がいしの5観点を説明
2. **供給エリア地図** — 実際の都道府県境界データを電力会社ごとに色分けしたクリック可能な地図(下記「地図データについて」参照)
3. **早見比較表** — プレイ中にサッと見返す一覧
4. **電力会社別詳細ガイド** — 北海道電力〜沖縄電力の10社カード(識別図+特徴リスト+混同注意)

## 地図データについて

- 出典: 「地球地図日本」(国土地理院)由来のデータを [dataofjapan/land](https://github.com/dataofjapan/land)(MIT相当で配布)経由で取得した `japan.topojson`(都道府県ポリゴン)
- **利用条件**: 非営利目的のため出典表示のみで利用可(フッターに明記済み)。地球地図日本自体は国土地理院のデータで、営利利用の場合は別途利用報告が必要
- 生成手順(`topojson-client` + `topojson-simplify` + `d3-geo` で一度だけ変換、Node不要な静的JSONとして `data/japanPrefectures.json` に保存):
  1. 都道府県(47) を10電力会社にグルーピング(新潟→東北、山梨・静岡→中部/TEPCO跨ぎは簡略化のため県単位で代表社に寄せている等の限界あり)
  2. 東京都・鹿児島県などが持つ大きく離れた属島(小笠原・奄美群島など)は地図のバウンディングボックスを不要に広げるため除外(本土から3度以上離れた島を機械的にドロップ)
  3. 沖縄県は本島のみを抽出し、別枠(点線ボックス)に簡略表示。地理的忠実性より視認性を優先
  4. `topojson-simplify` で座標点を間引き(約1MB→約45KBまで削減)、座標も小数点以下を丸めてファイルサイズを圧縮
- 実装は `components/JapanMap.tsx`。都道府県ごとに `<path>` を1つ描画し、クリック/Enterキーで該当電力会社のカードへスクロール

## 調査方法と注意点

- deep-researchワークフローで一次調査 → 組織の月間利用上限に到達し、統合(synthesis)ステップと一部の検証投票が失敗。
- 得られた「確証済み(confirmed)」「反証済み(refuted)」claimに加え、`plonkit.net/japan`・`wikiwiki.jp`(GeoGuessr Japan Wiki)を個別に直接取得して補完。
- 主な参照元: plonkit.net/japan、wikiwiki.jp「電柱/日本」、note.com記事2本、mititt.jp、sloor.hatenablog.com、geopinning.space、learnablemeta.com
- **すべてコミュニティ発の非公式情報**。情報源間で食い違う記述(例: 中部電力のプレート形状が「楕円」か「角丸の縦型」か)は本文中に両論併記。
- 図版はすべて識別ポイントを示す**オリジナルの模式図(SVG)**。実写真は使用していない(著作権・配信元不明写真の転載を避けるため)。

## 既知の混同ペア(サイト内にも記載)

- 中部電力 ⇔ 沖縄電力: 支線ガードの黒黄ストライプが共通
- 関西電力 ⇔ 中国電力: 縦書きプレート書式が類似
- 北陸電力 ⇔ 九州電力: 「カタカナ+数字」の縦書きプレートが類似(支線ガードの有無で区別)
- 北海道電力 ⇔ 東京電力: 変圧器の2本バー構成が類似(木製取付板の有無で区別)

## 技術メモ

- Next.js 16 (App Router) + React 19 + TypeScript。パッケージマネージャは **pnpm**(`pnpm-lock.yaml` / `pnpm-workspace.yaml`)。`pnpm build` で `out/` に静的HTML一式を出力(Node/サーバー不要でどこにでもデプロイ可能な点は移行前と同じ)
- `pnpm-workspace.yaml` の `onlyBuiltDependencies: [sharp]` は、Next.jsの依存(未使用・`images.unoptimized: true`のため実行時には不要)のpostinstallスクリプトをpnpmの安全機構が止めるのを許可するための設定
- 配色は10社分のカテゴリカルカラーを使用。data-vizパレット検証スクリプトで8色を検証済み、残り2社(九州・沖縄)は地理的に離れており混同リスクがないため既存色を再利用
- 電柱識別図は共通の`<linearGradient id="pole-gradient">`で電柱本体に円柱状の陰影を、`<ellipse>`で接地影を追加し質感を向上
- レスポンシブ: 760px(地図)/700px(会社カード)/480px(特徴リスト)でブレークポイント
- ライト/ダーク: `prefers-color-scheme` + 手動トグル(`localStorage`に保存)
- 移行前の素のHTML/CSS/JS版は `legacy-static/` にそのまま残してあり、`npm`/`pnpm`環境なしでも `legacy-static/index.html` を直接開けば動作する(地図は旧来の簡略模式図のまま)

## 今後の改善案(未着手)

- 実際の電柱写真・GeoGuessr内スクリーンショットの追加(権利確認が取れた場合のみ)
- 変圧器・がいしなど、資料が少ない項目(北海道・四国など)の追加調査
- 都道府県クイズ形式のミニゲーム化
- 山梨・静岡・福井など供給エリアが県境で分割される地域の、より精緻な(市町村単位の)地図表現
