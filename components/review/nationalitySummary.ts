export type NationalitySummaryInput = {
  nationality?: string;
  countryName?: string;
  countryCode?: string;
};

const normalizeValue = (value?: string): string => (value || "").trim();

export const buildNationalitySummary = ({
  nationality,
  countryName,
  countryCode
}: NationalitySummaryInput): string => {
  const normalizedNationality = normalizeValue(nationality);
  const normalizedCountryName = normalizeValue(countryName);
  const normalizedCountryCode = normalizeValue(countryCode);

  if (!normalizedNationality && !normalizedCountryName && !normalizedCountryCode) {
    return "";
  }

  const primary = normalizedNationality || normalizedCountryName || normalizedCountryCode;
  let secondary = "";

  if (normalizedCountryName && normalizedCountryName !== primary) {
    secondary = normalizedCountryName;
  }

  if (normalizedCountryCode && normalizedCountryCode !== primary) {
    secondary = secondary
      ? `${secondary} (${normalizedCountryCode})`
      : normalizedCountryCode;
  }

  return secondary ? `${primary} - ${secondary}` : primary;
};
