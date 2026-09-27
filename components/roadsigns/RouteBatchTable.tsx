import { routeBatches } from "@/data/nationalRoutes";

// 指定年ごとの番号帯の早見表。チャートの表形式の代替も兼ねる。
export function RouteBatchTable() {
  return (
    <div className="table-scroll">
      <table className="compare">
        <thead>
          <tr>
            <th>指定年</th>
            <th>番号帯</th>
            <th>並び方</th>
            <th>番号 → 地域の目安</th>
          </tr>
        </thead>
        <tbody>
          {routeBatches.map((b) => (
            <tr key={b.id}>
              <td className="company-cell">{b.label}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                {b.from}〜{b.to}号
              </td>
              <td>{b.order}</td>
              <td>{b.tip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
