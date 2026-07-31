import { bollardCaveat, bollardPatterns, bollardSources, confidenceLabel } from "@/data/landscape";
import { RichText } from "../RichText";
import { BollardIcon } from "./BollardIcon";

export function BollardShowcase() {
  return (
    <div>
      <div className="legend-grid">
        {bollardPatterns.map((p) => (
          <div className="legend-item" key={p.id}>
            <BollardIcon kind={p.id} />
            <h4>
              {p.area}
              <span className={`detail-badge ${p.confidence}`} style={{ marginLeft: 8 }}>
                {confidenceLabel[p.confidence]}
              </span>
            </h4>
            <p>
              <strong>{p.title}</strong>
              <br />
              {p.desc}
            </p>
            <p>
              <RichText text={`**見分けのコツ:** ${p.tip}`} />
            </p>
          </div>
        ))}
      </div>
      <p className="diagram-caption" style={{ marginTop: 10, textAlign: "left" }}>
        {bollardCaveat}
      </p>
      <ul className="source-list">
        {bollardSources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
