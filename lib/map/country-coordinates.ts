import { COUNTRIES } from "@/lib/countries";
import { FORM_OPTIONS } from "@/constants/formOptions";

export interface CountryCoordinate {
  name: string;
  nameEn: string;
  code: string;
  isEU: boolean;
  /** Capital, where the transfer map anchors the country. */
  lonLat: [number, number];
}

/** Countries the transfer radar can place: those of countries.json with a capital. */
export const countryCoordinates: Record<string, CountryCoordinate> = Object.fromEntries(
  Object.entries(COUNTRIES)
    .filter(([, c]) => c.lon_lat)
    .map(([code, c]) => [
      code,
      { name: c.name_fr, nameEn: c.name_en, code, isEU: c.is_eu, lonLat: c.lon_lat! },
    ]),
);

// Labels the fiches still store from the list countries.json replaced.
// ponytail: delete once the fiches hold codes (#367).
const LEGACY_LABELS: Record<string, string> = {
  "Ile Maurice": "mu",
  "République tchèque": "cz",
  "Vietnam": "vn",
  "Arabie saoudite": "sa",
};

const findTransferOption = (value: string) =>
  FORM_OPTIONS.transferDestinations.find(
    (c) =>
      c.value === value || c.label === value || c.label_en === value || c.value === LEGACY_LABELS[value],
  );

/**
 * Code of a transfer destination. Fiches still store French or English labels
 * until the data moves to codes (#367); an unknown value is kept as is so a
 * save never drops it.
 */
export const toTransferCode = (value: string): string =>
  findTransferOption(value)?.value ?? value;

/** Display name of a transfer destination, whether stored as code or label. */
export const transferCountryName = (value: string, lang: string): string => {
  const option = findTransferOption(value);
  if (!option) return value;
  return lang === "fr" ? option.label : option.label_en;
};

/**
 * Known codes of the transfer destinations. Regions and "other" resolve to
 * codes with no coordinates, so getCountryByCode drops them from the radar.
 */
export function parseTransferCountries(transfer: string[] | undefined | null): string[] {
  return (transfer ?? [])
    .map((value) => findTransferOption(value)?.value)
    .filter((code): code is string => !!code);
}

export function getCountryByCode(code: string): CountryCoordinate | null {
  return countryCoordinates[code.toLowerCase()] || null;
}
