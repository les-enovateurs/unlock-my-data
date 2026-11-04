import data from "@/constants/countries.json";
import extraCodes from "@/constants/transfer-extra-codes.json";

/** One row of constants/countries.json, keyed by lowercase ISO 3166-1 alpha-2 code (#480). */
export type Country = {
  name_fr: string;
  name_en: string;
  nationality_fr?: string;
  nationality_en?: string;
  is_eu: boolean;
  /** Capital, where the transfer map anchors the country. */
  lon_lat?: [number, number];
};

type Names = Pick<Country, "name_fr" | "name_en">;

export const COUNTRIES = data as unknown as Record<string, Country>;

/**
 * Values `transfer_destination_countries` accepts besides country codes (#367).
 * They are not countries: no flag, no map position, so the radar skips them.
 */
export const TRANSFER_EXTRA_CODES: Record<string, Names> = extraCodes;

/** Name of a country or transfer code in the reader's language, or undefined if unknown. */
export function countryName(code: string, lang: string): string | undefined {
  const key = code.toLowerCase();
  const row: Names | undefined = COUNTRIES[key] ?? TRANSFER_EXTRA_CODES[key];
  if (!row) return undefined;
  return lang === "fr" ? row.name_fr : row.name_en;
}
