import type { ReactNode } from "react";
import { confidenceLabel, type Spotlight } from "@/data/metaCommon";
import { RichText } from "./RichText";
import { SourceList } from "./SourceList";

// 路面標示メタ・道路標識メタの「強いネタ」カード。図(アイコン)だけページごとに差し替える。
export function SpotlightCard({ spotlight, icon }: { spotlight: Spotlight; icon: ReactNode }) {
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
          {icon}
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
          <SourceList sources={spotlight.sources} />
        </div>
      </div>
    </article>
  );
}
