import { FORM_OPTIONS } from "@/constants/formOptions";

// Countries the transfer radar can place. A destination missing here drops
// out of the radar, so every country of FORM_OPTIONS.countries needs a row.

export interface CountryCoordinate {
  name: string;
  nameEn: string;
  code: string;
  isEU: boolean;
}

export const countryCoordinates: Record<string, CountryCoordinate> = {
  // Europe - EU/EEA
  fr: { name: "France", nameEn: "France", code: "fr", isEU: true },
  de: { name: "Allemagne", nameEn: "Germany", code: "de", isEU: true },
  it: { name: "Italie", nameEn: "Italy", code: "it", isEU: true },
  es: { name: "Espagne", nameEn: "Spain", code: "es", isEU: true },
  pt: { name: "Portugal", nameEn: "Portugal", code: "pt", isEU: true },
  nl: { name: "Pays-Bas", nameEn: "Netherlands", code: "nl", isEU: true },
  be: { name: "Belgique", nameEn: "Belgium", code: "be", isEU: true },
  lu: { name: "Luxembourg", nameEn: "Luxembourg", code: "lu", isEU: true },
  at: { name: "Autriche", nameEn: "Austria", code: "at", isEU: true },
  ie: { name: "Irlande", nameEn: "Ireland", code: "ie", isEU: true },
  fi: { name: "Finlande", nameEn: "Finland", code: "fi", isEU: true },
  se: { name: "Suède", nameEn: "Sweden", code: "se", isEU: true },
  dk: { name: "Danemark", nameEn: "Denmark", code: "dk", isEU: true },
  pl: { name: "Pologne", nameEn: "Poland", code: "pl", isEU: true },
  cz: { name: "Tchéquie", nameEn: "Czech Republic", code: "cz", isEU: true },
  sk: { name: "Slovaquie", nameEn: "Slovakia", code: "sk", isEU: true },
  hu: { name: "Hongrie", nameEn: "Hungary", code: "hu", isEU: true },
  ro: { name: "Roumanie", nameEn: "Romania", code: "ro", isEU: true },
  bg: { name: "Bulgarie", nameEn: "Bulgaria", code: "bg", isEU: true },
  hr: { name: "Croatie", nameEn: "Croatia", code: "hr", isEU: true },
  si: { name: "Slovénie", nameEn: "Slovenia", code: "si", isEU: true },
  ee: { name: "Estonie", nameEn: "Estonia", code: "ee", isEU: true },
  lv: { name: "Lettonie", nameEn: "Latvia", code: "lv", isEU: true },
  lt: { name: "Lituanie", nameEn: "Lithuania", code: "lt", isEU: true },
  mt: { name: "Malte", nameEn: "Malta", code: "mt", isEU: true },
  cy: { name: "Chypre", nameEn: "Cyprus", code: "cy", isEU: true },
  gr: { name: "Grèce", nameEn: "Greece", code: "gr", isEU: true },

  // EEA + Adequacy
  no: { name: "Norvège", nameEn: "Norway", code: "no", isEU: true },
  is: { name: "Islande", nameEn: "Iceland", code: "is", isEU: true },
  li: { name: "Liechtenstein", nameEn: "Liechtenstein", code: "li", isEU: true },
  ch: { name: "Suisse", nameEn: "Switzerland", code: "ch", isEU: true },
  gb: { name: "Royaume-Uni", nameEn: "United Kingdom", code: "gb", isEU: true },
  uk: { name: "Royaume-Uni", nameEn: "United Kingdom", code: "uk", isEU: true },

  // North America
  us: { name: "États-Unis", nameEn: "United States", code: "us", isEU: false },
  ca: { name: "Canada", nameEn: "Canada", code: "ca", isEU: false },
  mx: { name: "Mexique", nameEn: "Mexico", code: "mx", isEU: false },

  // Asia
  cn: { name: "Chine", nameEn: "China", code: "cn", isEU: false },
  jp: { name: "Japon", nameEn: "Japan", code: "jp", isEU: false },
  kr: { name: "Corée du Sud", nameEn: "South Korea", code: "kr", isEU: false },
  in: { name: "Inde", nameEn: "India", code: "in", isEU: false },
  sg: { name: "Singapour", nameEn: "Singapore", code: "sg", isEU: false },
  hk: { name: "Hong Kong", nameEn: "Hong Kong", code: "hk", isEU: false },
  tw: { name: "Taïwan", nameEn: "Taiwan", code: "tw", isEU: false },
  my: { name: "Malaisie", nameEn: "Malaysia", code: "my", isEU: false },
  th: { name: "Thaïlande", nameEn: "Thailand", code: "th", isEU: false },
  vn: { name: "Vietnam", nameEn: "Vietnam", code: "vn", isEU: false },
  id: { name: "Indonésie", nameEn: "Indonesia", code: "id", isEU: false },
  ph: { name: "Philippines", nameEn: "Philippines", code: "ph", isEU: false },
  ae: { name: "Émirats arabes unis", nameEn: "United Arab Emirates", code: "ae", isEU: false },
  il: { name: "Israël", nameEn: "Israel", code: "il", isEU: false },

  // Russia & Eastern Europe
  ru: { name: "Russie", nameEn: "Russia", code: "ru", isEU: false },
  ua: { name: "Ukraine", nameEn: "Ukraine", code: "ua", isEU: false },
  by: { name: "Biélorussie", nameEn: "Belarus", code: "by", isEU: false },

  // Oceania
  au: { name: "Australie", nameEn: "Australia", code: "au", isEU: false },
  nz: { name: "Nouvelle-Zélande", nameEn: "New Zealand", code: "nz", isEU: false },

  // South America
  br: { name: "Brésil", nameEn: "Brazil", code: "br", isEU: false },
  ar: { name: "Argentine", nameEn: "Argentina", code: "ar", isEU: false },
  cl: { name: "Chili", nameEn: "Chile", code: "cl", isEU: false },
  co: { name: "Colombie", nameEn: "Colombia", code: "co", isEU: false },

  // Africa
  za: { name: "Afrique du Sud", nameEn: "South Africa", code: "za", isEU: false },
  ng: { name: "Nigeria", nameEn: "Nigeria", code: "ng", isEU: false },
  eg: { name: "Égypte", nameEn: "Egypt", code: "eg", isEU: false },
  ma: { name: "Maroc", nameEn: "Morocco", code: "ma", isEU: false },

  // Other destinations named in the fiches
  af: { name: "Afghanistan", nameEn: "Afghanistan", code: "af", isEU: false },
  al: { name: "Albanie", nameEn: "Albania", code: "al", isEU: false },
  dz: { name: "Algérie", nameEn: "Algeria", code: "dz", isEU: false },
  ad: { name: "Andorre", nameEn: "Andorra", code: "ad", isEU: false },
  ao: { name: "Angola", nameEn: "Angola", code: "ao", isEU: false },
  am: { name: "Arménie", nameEn: "Armenia", code: "am", isEU: false },
  lb: { name: "Liban", nameEn: "Lebanon", code: "lb", isEU: false },
  mc: { name: "Monaco", nameEn: "Monaco", code: "mc", isEU: false },
  pk: { name: "Pakistan", nameEn: "Pakistan", code: "pk", isEU: false },
  ps: { name: "Palestine", nameEn: "Palestine", code: "ps", isEU: false },
  qa: { name: "Qatar", nameEn: "Qatar", code: "qa", isEU: false },
  tn: { name: "Tunisie", nameEn: "Tunisia", code: "tn", isEU: false },
  tr: { name: "Turquie", nameEn: "Turkey", code: "tr", isEU: false },
  mu: { name: "Ile Maurice", nameEn: "Mauritius", code: "mu", isEU: false },
  sa: { name: "Arabie saoudite", nameEn: "Saudi Arabia", code: "sa", isEU: false },
  bj: { name: "Bénin", nameEn: "Benin", code: "bj", isEU: false },
  ci: { name: "Côte d'Ivoire", nameEn: "Ivory Coast", code: "ci", isEU: false },
  gt: { name: "Guatemala", nameEn: "Guatemala", code: "gt", isEU: false },
  mk: { name: "Macédoine du Nord", nameEn: "North Macedonia", code: "mk", isEU: false },
  mg: { name: "Madagascar", nameEn: "Madagascar", code: "mg", isEU: false },
  sn: { name: "Sénégal", nameEn: "Senegal", code: "sn", isEU: false },
  tg: { name: "Togo", nameEn: "Togo", code: "tg", isEU: false },
};

/**
 * Country codes of the transfer destinations, French or English labels alike.
 * Regions and "Autres pays non listés" resolve to codes with no row above,
 * so getCountryByCode drops them from the radar.
 */
export function parseTransferCountries(transfer: string[] | undefined | null): string[] {
  return (transfer ?? [])
    .map((value) => FORM_OPTIONS.countries.find((c) => c.label === value || c.country_name === value)?.country_code)
    .filter((code): code is string => !!code);
}

/**
 * Get country info by code
 */
export function getCountryByCode(code: string): CountryCoordinate | null {
  return countryCoordinates[code.toLowerCase()] || null;
}
