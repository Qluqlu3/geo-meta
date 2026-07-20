import type { Company } from "@/data/companies";

export function CompareTable({ companies }: { companies: Company[] }) {
  return (
    <div className="table-scroll">
      <table className="compare">
        <thead>
          <tr>
            <th>電力会社</th>
            <th>主な供給エリア</th>
            <th>支線プレート</th>
            <th>電柱本体</th>
            <th>変圧器</th>
            <th>がいし</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td className="company-cell">
                <span className="chip">
                  <span className="dot" style={{ background: `var(${c.colorVar})` }} />
                  {c.name}
                </span>
              </td>
              <td>{c.compare.area}</td>
              <td>{c.compare.guyWire}</td>
              <td>{c.compare.pole}</td>
              <td>{c.compare.transformer}</td>
              <td>{c.compare.insulator}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
