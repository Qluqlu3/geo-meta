import { chainSections, chainSectionsNote, chainSectionsSources } from "@/data/roadSigns";
import { ChainSignIcon } from "./ChainSignIcon";

const AREAS = Array.from(new Set(chainSections.flatMap((c) => c.prefectures)));

export function ChainRegulationTable() {
  return (
    <article className="company-card" id="chain">
      <div className="company-head">
        <h3>チェーン規制標識</h3>
        <span className="detail-badge confirmed">複数ソースで確認</span>
      </div>
      <div className="area-tags">
        {AREAS.map((a) => (
          <span key={a}>{a}</span>
        ))}
      </div>
      <div className="company-body">
        <div className="diagram-box">
          <ChainSignIcon />
          <p className="diagram-caption">タイヤ+チェーンのピクトグラムを描いた青色の指示標識(2018年新設)</p>
        </div>
        <div>
          <div className="confuse-note">{chainSectionsNote}</div>
          <ul className="source-list">
            {chainSectionsSources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="table-scroll" style={{ marginTop: 16 }}>
        <table className="compare">
          <thead>
            <tr>
              <th>路線</th>
              <th>区間</th>
              <th>都道府県</th>
            </tr>
          </thead>
          <tbody>
            {chainSections.map((c) => (
              <tr key={`${c.road}-${c.section}`}>
                <td className="company-cell">{c.road}</td>
                <td>{c.section}</td>
                <td>{c.prefectures.join("・")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
