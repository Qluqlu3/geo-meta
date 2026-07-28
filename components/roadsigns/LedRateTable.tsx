import { ledRateNote } from "@/data/roadSigns";

function fmt(v: number | undefined): string {
  return v === undefined ? "—" : `${v.toFixed(1)}%`;
}

export function LedRateTable() {
  const { title, summary, rows, average, source } = ledRateNote;
  const sorted = [...rows].sort((a, b) => (a.vehicle ?? 999) - (b.vehicle ?? 999));
  return (
    <article className="company-card" id="led-rate">
      <div className="company-head">
        <h3>{title}</h3>
        <span className="detail-badge confirmed">複数ソースで確認</span>
      </div>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: 0 }}>{summary}</p>
      <div className="table-scroll">
        <table className="compare">
          <thead>
            <tr>
              <th>都道府県</th>
              <th>車両用LED化率</th>
              <th>歩行者用LED化率</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="company-cell">全国平均</td>
              <td>{fmt(average.vehicle)}</td>
              <td>{fmt(average.pedestrian)}</td>
            </tr>
            {sorted.map((r) => (
              <tr key={r.pref}>
                <td className="company-cell">{r.pref}</td>
                <td>{fmt(r.vehicle)}</td>
                <td>{fmt(r.pedestrian)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="source-list">
        <li>
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.label}
          </a>
        </li>
      </ul>
    </article>
  );
}
