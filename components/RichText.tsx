// Renders plain strings that may contain **bold** segments, e.g. from data/companies.ts
export function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        // biome-ignore lint/suspicious/noArrayIndexKey: parts is a deterministic split of a fixed string, order never changes
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
      )}
    </>
  );
}
