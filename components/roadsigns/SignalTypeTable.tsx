import { type SignalOrientation, signalOrientationInfo, signalOrientationPrefectures } from "@/data/roadSigns";

const ORDER: SignalOrientation[] = ["vertical", "mixed", "horizontal"];

function examplesFor(type: SignalOrientation): string {
  const names = signalOrientationPrefectures.filter((p) => p.type === type).map((p) => p.nameJa);
  if (type !== "horizontal" || names.length <= 6) return names.join("・");
  return `${names.slice(0, 6).join("・")} など${names.length}都道府県`;
}

export function SignalTypeTable() {
  return (
    <div className="table-scroll">
      <table className="compare">
        <thead>
          <tr>
            <th>タイプ</th>
            <th>特徴</th>
            <th>該当都道府県(例)</th>
          </tr>
        </thead>
        <tbody>
          {ORDER.map((type) => {
            const info = signalOrientationInfo[type];
            return (
              <tr key={type}>
                <td className="company-cell">
                  <span className="chip">
                    <span className="dot" style={{ background: `var(${info.colorVar})` }} />
                    {info.label}
                  </span>
                </td>
                <td>{info.desc}</td>
                <td>{examplesFor(type)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
