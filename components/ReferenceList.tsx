import { confidenceLabel } from "@/data/roadMarkings";
import { type Source, SourceList } from "./SourceList";

export type ReferenceNoteContent = {
  id: string;
  title: string;
  areas: string[];
  note: string;
  sources: Source[];
};

// 路面標示メタ・道路標識メタ末尾の「参考程度(採用保留)」一覧。
export function ReferenceList({ notes }: { notes: readonly ReferenceNoteContent[] }) {
  return (
    <div className="reference-list">
      {notes.map((r) => (
        <div className="reference-item" key={r.id}>
          <div className="reference-item-head">
            <h4>{r.title}</h4>
            <span className="detail-badge reference">{confidenceLabel.reference}</span>
          </div>
          <div className="area-tags">
            {r.areas.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
          <p>{r.note}</p>
          <SourceList sources={r.sources} />
        </div>
      ))}
    </div>
  );
}
