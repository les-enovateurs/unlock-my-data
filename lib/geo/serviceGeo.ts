import { EU_COUNTRIES } from "@/constants/euCountries";

/** Unicode flag emoji from a 2-letter ISO country code. */
export function flagEmoji(code?: string): string {
  if (!code || code.length !== 2) return "";
  return String.fromCodePoint(
    ...[...code.toLowerCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 97)
  );
}

/** Localized country name (Intl.DisplayNames), with fallback. */
export function localizedCountry(lang: string, code?: string, fallback?: string): string {
  if (!code || code.length !== 2) return fallback ?? "";
  try {
    return (
      new Intl.DisplayNames([lang], { type: "region" }).of(code.toUpperCase()) ??
      fallback ??
      code
    );
  } catch {
    return fallback ?? code;
  }
}

/** Is the service hosted in the EU/EEA? */
export function isServiceEU(code?: string): boolean {
  return !!code && EU_COUNTRIES.has(code.toLowerCase());
}
