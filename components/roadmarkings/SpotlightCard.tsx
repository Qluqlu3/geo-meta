import type { Spotlight } from "@/data/roadMarkings";
import { confidenceLabel } from "@/data/roadMarkings";
import { RichText } from "../RichText";
import { SpotlightIcon } from "./SpotlightIcon";

export function SpotlightCard({ spotlight }: { spotlight: Spotlight }) {
  return (
    <article className="company-card" id={spotlight.id}>
      <div className="company-head">
        <h3>{spotlight.title}</h3>
        <span className={`detail-badge ${spotlight.confidence}`}>{confidenceLabel[spotlight.confidence]}</span>
      </div>
      <div className="area-tags">
        {spotlight.areas.map((a) => (
          <span key={a}>{a}</span>
        ))}
      </div>
      <div className="company-body">
        <div className="diagram-box">
          <SpotlightIcon kind={spotlight.icon} />
          <p className="diagram-caption">{spotlight.summary}</p>
        </div>
        <div>
          <ul className="feature-list">
            {spotlight.points.map((p) => (
              <li key={p.k}>
                <span className="k">{p.k}</span>
                <span>
                  <RichText text={p.v} />
                </span>
              </li>
            ))}
          </ul>
          <div className="confuse-note">
            <RichText text={spotlight.note} />
          </div>
          <ul className="source-list">
            {spotlight.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
