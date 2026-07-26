import { confidenceLabel, referenceNotes } from "@/data/roadMarkings";

export function ReferenceList() {
  return (
    <div className="reference-list">
      {referenceNotes.map((r) => (
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
          <ul className="source-list">
            {r.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
