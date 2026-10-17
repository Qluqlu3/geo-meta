import { koanPlates, koanSources } from "@/data/roadSigns";
import { RichText } from "../RichText";
import { SourceList } from "../SourceList";
import { KoanPlateIcon } from "./KoanPlateIcon";

export function KoanShowcase() {
  return (
    <div>
      <div className="legend-grid">
        {koanPlates.map((plate) => (
          <div className="legend-item" key={plate.id}>
            <KoanPlateIcon plate={plate} />
            <h4>
              {plate.pref} — {plate.title}
            </h4>
            <p>{plate.desc}</p>
            <p>
              <RichText text={`**見分けのコツ:** ${plate.tip}`} />
            </p>
          </div>
        ))}
      </div>
      <SourceList sources={koanSources} />
    </div>
  );
}
