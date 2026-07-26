import { confidenceLabel, snowPipeNote } from "@/data/roadMarkings";
import { RichText } from "../RichText";

function SnowPipeIcon() {
  return (
    <svg className="icon" viewBox="0 0 40 40" aria-hidden="true">
      <line x1="4" y1="30" x2="36" y2="30" stroke="var(--text-muted)" strokeWidth="2" />
      {[8, 16, 24, 32].map((x) => (
        <circle key={x} cx={x} cy="30" r="2.6" fill="var(--rm-tokyo)" />
      ))}
      {/* 稼働中の散水をノズル(x=16)から上方向に噴出しているイメージで表現 */}
      <path d="M16 27 Q13 18 9 9" stroke="var(--rm-tokyo)" strokeWidth="1.6" fill="none" opacity="0.55" />
      <path d="M16 27 Q17 17 16 7" stroke="var(--rm-tokyo)" strokeWidth="1.6" fill="none" opacity="0.55" />
      <path d="M16 27 Q19 18 23 9" stroke="var(--rm-tokyo)" strokeWidth="1.6" fill="none" opacity="0.55" />
    </svg>
  );
}

export function SnowPipeCard() {
  const n = snowPipeNote;
  return (
    <article className="company-card" id="snow-pipe">
      <div className="company-head">
        <h3>{n.title}</h3>
        <span className={`detail-badge ${n.confidence}`}>{confidenceLabel[n.confidence]}</span>
      </div>
      <div className="area-tags">
        {n.areas.map((a) => (
          <span key={a}>{a}</span>
        ))}
      </div>
      <div className="company-body">
        <div className="diagram-box">
          <SnowPipeIcon />
          <p className="diagram-caption">{n.summary}</p>
        </div>
        <div>
          <ul className="feature-list">
            {n.points.map((p) => (
              <li key={p.k}>
                <span className="k">{p.k}</span>
                <span>
                  <RichText text={p.v} />
                </span>
              </li>
            ))}
          </ul>
          <div className="confuse-note">
            <RichText text={n.note} />
          </div>
          <ul className="source-list">
            {n.sources.map((s) => (
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
