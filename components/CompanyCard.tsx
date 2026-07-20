import type { Company } from "@/data/companies";
import { DiagramView } from "./DiagramView";
import { RichText } from "./RichText";

const PART_COLOR_VAR: Record<string, string> = {
  支線プレート: "--part-guywire",
  変圧器: "--part-transformer",
  番号プレート: "--part-plate",
  がいし: "--part-insulator",
};

export function CompanyCard({ company }: { company: Company }) {
  return (
    <article className="company-card" id={company.id}>
      <div className="company-head">
        <span className="swatch" style={{ background: `var(${company.colorVar})` }} />
        <h3>{company.name}</h3>
        <span className="romaji">{company.romaji}</span>
      </div>
      <div className="area-tags">
        {company.areas.map((a) => (
          <span key={a}>{a}</span>
        ))}
      </div>
      <div className="company-body">
        <div className="diagram-box">
          <DiagramView id={company.id} caption={company.diagramCaption} />
        </div>
        <div>
          <ul className="feature-list">
            {company.features.map((f) => {
              const partVar = PART_COLOR_VAR[f.k];
              return (
                <li key={f.k}>
                  <span className="k">
                    {partVar && <span className="part-dot" style={{ background: `var(${partVar})` }} />}
                    {f.k}
                  </span>
                  <span>
                    <RichText text={f.v} />
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="confuse-note">
            <strong>{company.confuseLabel ?? "混同注意"}:</strong> <RichText text={company.confuseNote} />
          </div>
        </div>
      </div>
    </article>
  );
}
