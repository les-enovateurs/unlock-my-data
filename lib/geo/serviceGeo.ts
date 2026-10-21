import { EU_COUNTRIES } from "@/constants/euCountries";
import { getCountryByCode } from "@/lib/map/country-coordinates";

/** Unicode flag emoji from a 2-letter ISO country code. */
export function flagEmoji(code?: string | null): string {
  if (!code || code.length !== 2) return "";
  return String.fromCodePoint(
    ...[...code.toLowerCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 97)
  );
}

/** Country name from the static fr/en table: Intl.DisplayNames depends on the
 *  ICU build, so Node and the browser disagree ("Hong Kong" vs "Hong Kong SAR
 *  China") and hydration fails. */
export function localizedCountry(lang: string, code?: string | null, fallback?: string | null): string {
  const country = code ? getCountryByCode(code) : null;
  if (country) return lang === "fr" ? country.name : country.nameEn;
  return fallback ?? code ?? "";
}

/** Is the service hosted in the EU/EEA? */
export function isServiceEU(code?: string): boolean {
  return !!code && EU_COUNTRIES.has(code.toLowerCase());
}
