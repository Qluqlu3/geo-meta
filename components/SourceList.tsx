import type { Source } from "@/data/metaCommon";

// メタ図鑑の各カード下に置く出典リンク一覧。出典がなければ何も出さない。
export function SourceList({ sources }: { sources: readonly Source[] }) {
  if (sources.length === 0) return null;
  return (
    <ul className="source-list">
      {sources.map((s) => (
        <li key={s.url}>
          <a href={s.url} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
