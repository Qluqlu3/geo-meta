// 廃墟アーカイブ: 緯度経度の書式・外部地図へのリンク・国土地理院 API の呼び出し

/** 地図アプリへそのまま貼れる十進表記(小数6桁 ≒ 10cm単位) */
export function formatLatLon(lat: number, lon: number): string {
  return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
}

/** 度分秒表記(紙の地形図・古い資料と照合する用) */
export function formatDms(lat: number, lon: number): string {
  const dms = (v: number, pos: string, neg: string) => {
    const a = Math.abs(v);
    const d = Math.floor(a);
    const m = Math.floor((a - d) * 60);
    const s = ((a - d) * 60 - m) * 60;
    return `${d}°${String(m).padStart(2, "0")}′${s.toFixed(1).padStart(4, "0")}″${v >= 0 ? pos : neg}`;
  };
  return `${dms(lat, "N", "S")} ${dms(lon, "E", "W")}`;
}

/** 地理院地図: 標準地図の上に比較レイヤー(国土地理院タイルのみ)を重ねた状態で開く */
export function gsiMapUrl(lat: number, lon: number, layerId = "gazo1", zoom = 16): string {
  return `https://maps.gsi.go.jp/#${zoom}/${lat.toFixed(6)}/${lon.toFixed(6)}/&base=std&ls=std%7C${layerId}&disp=11`;
}

/** 今昔マップ on the web: 旧版地形図と現在の地図の2画面表示で開く(データセットは座標から自動判定) */
export function konjakuUrl(lat: number, lon: number, zoom = 15): string {
  return `https://ktgis.net/kjmapw/kjmapw.html?lat=${lat.toFixed(6)}&lng=${lon.toFixed(6)}&zoom=${zoom}&screen=2`;
}

export function googleMapsUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lon.toFixed(6)}`;
}

// ---------------------------------------------------------------------------
// 国土地理院 API(どちらも CORS 許可済みでブラウザから直接呼べる)
// ---------------------------------------------------------------------------

type MuniTable = Record<string, [number, string, string]>;
let muniTable: Promise<MuniTable> | null = null;

export type PlaceHint = { prefCode: number; pref: string; municipality: string; locality?: string };

/** 逆ジオコーディング: 市区町村と大字(廃集落の「かつての住所」の手がかり)。海上などでは null */
export async function reverseGeocode(lat: number, lon: number): Promise<PlaceHint | null> {
  muniTable ??= import("@/data/gsiMuni.json").then((m) => m.default as unknown as MuniTable);
  const res = await fetch(`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${lat}&lon=${lon}`);
  if (!res.ok) return null;
  const body: { results?: { muniCd: string; lv01Nm: string } } = await res.json();
  if (!body.results) return null;
  const m = (await muniTable)[body.results.muniCd.padStart(5, "0")];
  if (!m) return null;
  const locality = body.results.lv01Nm && body.results.lv01Nm !== "－" ? body.results.lv01Nm : undefined;
  return { prefCode: m[0], pref: m[1], municipality: m[2], locality };
}

/** 標高(m)。取得できない地点(海上・データ欠損)では null */
export async function fetchElevation(lat: number, lon: number): Promise<number | null> {
  const res = await fetch(
    `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${lon}&lat=${lat}&outtype=JSON`,
  );
  if (!res.ok) return null;
  const body: { elevation: number | string } = await res.json();
  return typeof body.elevation === "number" ? body.elevation : null;
}
