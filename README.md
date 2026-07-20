# 電柱メタ図鑑

GeoGuessr日本メタ「電柱の見た目で電力会社(≒地域)を見分ける」ための静的リファレンスサイト。
Next.js (App Router) の SSG で静的HTMLに書き出しています。

## 必要環境

- Node.js 20 以上(開発時は v22 で確認)
- pnpm ([https://pnpm.io/installation](https://pnpm.io/installation))

## セットアップ

```bash
pnpm install
```

## 開発サーバーを起動

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000) を開く。

## 静的ビルド(本番用)

```bash
pnpm build
```

`out/` ディレクトリに静的HTML一式が書き出されます。サーバー不要でそのまま配置できます(GitHub Pages, Netlify, S3 など)。

生成物を手元で確認する場合:

```bash
pnpm dlx serve out
# または
cd out && python3 -m http.server 8000
```

## ビルド不要の代替版

`legacy-static/` に、Node/npmなしで動く素のHTML/CSS/JS版を参考として残しています。`legacy-static/index.html` をブラウザで直接開くだけで動作します(内容は現行版と同一ですが、以後の更新は反映されません)。

## ディレクトリ構成

| パス | 内容 |
|---|---|
| `app/` | ページ本体・レイアウト・グローバルCSS |
| `components/` | UIコンポーネント一式 |
| `data/companies.ts` | 10電力会社ぶんのデータ(編集はここ1箇所でOK) |
| `data/japanPrefectures.json` | 都道府県境界の地図データ(地球地図日本より生成、要出典表示) |
| `legacy-static/` | 移行前の静的HTML/CSS/JS版 |
| `PLAN.md` | 作業まとめ・調査の出典・技術メモ |

詳しい経緯やコンポーネント設計は [PLAN.md](./PLAN.md) を参照してください。
