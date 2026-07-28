import { animalSignCaveat, animalSignSources, animalSigns } from "@/data/roadSigns";
import { AnimalSignIcon } from "./AnimalSignIcon";

export function AnimalSignShowcase() {
  return (
    <div>
      <div className="diamond-grid">
        {animalSigns.map((sign) => (
          <div className="diamond-item" key={sign.id}>
            <AnimalSignIcon kind={sign.iconKind} flip={sign.flip} />
            <span>
              <strong>
                {sign.area} — {sign.animal}
              </strong>
              <br />
              {sign.note}
            </span>
          </div>
        ))}
      </div>
      <p className="diagram-caption" style={{ marginTop: 10, textAlign: "left" }}>
        {animalSignCaveat}
      </p>
      <ul className="source-list">
        {animalSignSources.map((s) => (
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
