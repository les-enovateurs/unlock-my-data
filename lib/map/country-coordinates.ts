import { FORM_OPTIONS } from "@/constants/formOptions";

// Countries the transfer radar can place. A destination missing here drops
// out of the radar, so every country of FORM_OPTIONS.countries needs a row.

export interface CountryCoordinate {
  name: string;
  nameEn: string;
  code: string;
  isEU: boolean;
  /** Capital, where the transfer map anchors the country. */
  lonLat: [number, number];
}

export const countryCoordinates: Record<string, CountryCoordinate> = {
  // Europe - EU/EEA
  fr: { name: "France", nameEn: "France", code: "fr", isEU: true , lonLat: [2.35, 48.85] },
  de: { name: "Allemagne", nameEn: "Germany", code: "de", isEU: true , lonLat: [13.4, 52.52] },
  it: { name: "Italie", nameEn: "Italy", code: "it", isEU: true , lonLat: [12.5, 41.9] },
  es: { name: "Espagne", nameEn: "Spain", code: "es", isEU: true , lonLat: [-3.7, 40.42] },
  pt: { name: "Portugal", nameEn: "Portugal", code: "pt", isEU: true , lonLat: [-9.14, 38.72] },
  nl: { name: "Pays-Bas", nameEn: "Netherlands", code: "nl", isEU: true , lonLat: [4.9, 52.37] },
  be: { name: "Belgique", nameEn: "Belgium", code: "be", isEU: true , lonLat: [4.35, 50.85] },
  lu: { name: "Luxembourg", nameEn: "Luxembourg", code: "lu", isEU: true , lonLat: [6.13, 49.61] },
  at: { name: "Autriche", nameEn: "Austria", code: "at", isEU: true , lonLat: [16.37, 48.21] },
  ie: { name: "Irlande", nameEn: "Ireland", code: "ie", isEU: true , lonLat: [-6.26, 53.35] },
  fi: { name: "Finlande", nameEn: "Finland", code: "fi", isEU: true , lonLat: [24.94, 60.17] },
  se: { name: "Suède", nameEn: "Sweden", code: "se", isEU: true , lonLat: [18.07, 59.33] },
  dk: { name: "Danemark", nameEn: "Denmark", code: "dk", isEU: true , lonLat: [12.57, 55.68] },
  pl: { name: "Pologne", nameEn: "Poland", code: "pl", isEU: true , lonLat: [21.01, 52.23] },
  cz: { name: "Tchéquie", nameEn: "Czech Republic", code: "cz", isEU: true , lonLat: [14.42, 50.08] },
  sk: { name: "Slovaquie", nameEn: "Slovakia", code: "sk", isEU: true , lonLat: [17.11, 48.15] },
  hu: { name: "Hongrie", nameEn: "Hungary", code: "hu", isEU: true , lonLat: [19.04, 47.5] },
  ro: { name: "Roumanie", nameEn: "Romania", code: "ro", isEU: true , lonLat: [26.1, 44.43] },
  bg: { name: "Bulgarie", nameEn: "Bulgaria", code: "bg", isEU: true , lonLat: [23.32, 42.7] },
  hr: { name: "Croatie", nameEn: "Croatia", code: "hr", isEU: true , lonLat: [15.98, 45.81] },
  si: { name: "Slovénie", nameEn: "Slovenia", code: "si", isEU: true , lonLat: [14.51, 46.06] },
  ee: { name: "Estonie", nameEn: "Estonia", code: "ee", isEU: true , lonLat: [24.75, 59.44] },
  lv: { name: "Lettonie", nameEn: "Latvia", code: "lv", isEU: true , lonLat: [24.11, 56.95] },
  lt: { name: "Lituanie", nameEn: "Lithuania", code: "lt", isEU: true , lonLat: [25.28, 54.69] },
  mt: { name: "Malte", nameEn: "Malta", code: "mt", isEU: true , lonLat: [14.51, 35.9] },
  cy: { name: "Chypre", nameEn: "Cyprus", code: "cy", isEU: true , lonLat: [33.38, 35.17] },
  gr: { name: "Grèce", nameEn: "Greece", code: "gr", isEU: true , lonLat: [23.73, 37.98] },

  // EEA + Adequacy
  no: { name: "Norvège", nameEn: "Norway", code: "no", isEU: true , lonLat: [10.75, 59.91] },
  is: { name: "Islande", nameEn: "Iceland", code: "is", isEU: true , lonLat: [-21.9, 64.15] },
  li: { name: "Liechtenstein", nameEn: "Liechtenstein", code: "li", isEU: true , lonLat: [9.52, 47.14] },
  ch: { name: "Suisse", nameEn: "Switzerland", code: "ch", isEU: true , lonLat: [7.45, 46.95] },
  gb: { name: "Royaume-Uni", nameEn: "United Kingdom", code: "gb", isEU: true , lonLat: [-0.13, 51.51] },
  uk: { name: "Royaume-Uni", nameEn: "United Kingdom", code: "uk", isEU: true , lonLat: [-0.13, 51.51] },

  // North America
  us: { name: "États-Unis", nameEn: "United States", code: "us", isEU: false , lonLat: [-77.04, 38.9] },
  ca: { name: "Canada", nameEn: "Canada", code: "ca", isEU: false , lonLat: [-75.7, 45.42] },
  mx: { name: "Mexique", nameEn: "Mexico", code: "mx", isEU: false , lonLat: [-99.13, 19.43] },

  // Asia
  cn: { name: "Chine", nameEn: "China", code: "cn", isEU: false , lonLat: [116.4, 39.9] },
  jp: { name: "Japon", nameEn: "Japan", code: "jp", isEU: false , lonLat: [139.69, 35.69] },
  kr: { name: "Corée du Sud", nameEn: "South Korea", code: "kr", isEU: false , lonLat: [126.98, 37.57] },
  in: { name: "Inde", nameEn: "India", code: "in", isEU: false , lonLat: [77.21, 28.61] },
  sg: { name: "Singapour", nameEn: "Singapore", code: "sg", isEU: false , lonLat: [103.82, 1.35] },
  hk: { name: "Hong Kong", nameEn: "Hong Kong", code: "hk", isEU: false , lonLat: [114.17, 22.32] },
  tw: { name: "Taïwan", nameEn: "Taiwan", code: "tw", isEU: false , lonLat: [121.56, 25.03] },
  my: { name: "Malaisie", nameEn: "Malaysia", code: "my", isEU: false , lonLat: [101.69, 3.14] },
  th: { name: "Thaïlande", nameEn: "Thailand", code: "th", isEU: false , lonLat: [100.5, 13.76] },
  vn: { name: "Vietnam", nameEn: "Vietnam", code: "vn", isEU: false , lonLat: [105.85, 21.03] },
  id: { name: "Indonésie", nameEn: "Indonesia", code: "id", isEU: false , lonLat: [106.85, -6.21] },
  ph: { name: "Philippines", nameEn: "Philippines", code: "ph", isEU: false , lonLat: [120.98, 14.6] },
  ae: { name: "Émirats arabes unis", nameEn: "United Arab Emirates", code: "ae", isEU: false , lonLat: [54.37, 24.45] },
  il: { name: "Israël", nameEn: "Israel", code: "il", isEU: false , lonLat: [34.78, 32.08] },

  // Russia & Eastern Europe
  ru: { name: "Russie", nameEn: "Russia", code: "ru", isEU: false , lonLat: [37.62, 55.75] },
  ua: { name: "Ukraine", nameEn: "Ukraine", code: "ua", isEU: false , lonLat: [30.52, 50.45] },
  by: { name: "Biélorussie", nameEn: "Belarus", code: "by", isEU: false , lonLat: [27.56, 53.9] },

  // Oceania
  au: { name: "Australie", nameEn: "Australia", code: "au", isEU: false , lonLat: [149.13, -35.28] },
  nz: { name: "Nouvelle-Zélande", nameEn: "New Zealand", code: "nz", isEU: false , lonLat: [174.78, -41.29] },

  // South America
  br: { name: "Brésil", nameEn: "Brazil", code: "br", isEU: false , lonLat: [-47.88, -15.79] },
  ar: { name: "Argentine", nameEn: "Argentina", code: "ar", isEU: false , lonLat: [-58.38, -34.6] },
  cl: { name: "Chili", nameEn: "Chile", code: "cl", isEU: false , lonLat: [-70.67, -33.45] },
  co: { name: "Colombie", nameEn: "Colombia", code: "co", isEU: false , lonLat: [-74.07, 4.71] },

  // Africa
  za: { name: "Afrique du Sud", nameEn: "South Africa", code: "za", isEU: false , lonLat: [28.19, -25.75] },
  ng: { name: "Nigeria", nameEn: "Nigeria", code: "ng", isEU: false , lonLat: [7.49, 9.06] },
  eg: { name: "Égypte", nameEn: "Egypt", code: "eg", isEU: false , lonLat: [31.24, 30.04] },
  ma: { name: "Maroc", nameEn: "Morocco", code: "ma", isEU: false , lonLat: [-6.84, 34.02] },

  // Other destinations named in the fiches
  af: { name: "Afghanistan", nameEn: "Afghanistan", code: "af", isEU: false , lonLat: [69.21, 34.56] },
  al: { name: "Albanie", nameEn: "Albania", code: "al", isEU: false , lonLat: [19.82, 41.33] },
  dz: { name: "Algérie", nameEn: "Algeria", code: "dz", isEU: false , lonLat: [3.06, 36.75] },
  ad: { name: "Andorre", nameEn: "Andorra", code: "ad", isEU: false , lonLat: [1.52, 42.51] },
  ao: { name: "Angola", nameEn: "Angola", code: "ao", isEU: false , lonLat: [13.23, -8.84] },
  am: { name: "Arménie", nameEn: "Armenia", code: "am", isEU: false , lonLat: [44.51, 40.18] },
  lb: { name: "Liban", nameEn: "Lebanon", code: "lb", isEU: false , lonLat: [35.5, 33.89] },
  mc: { name: "Monaco", nameEn: "Monaco", code: "mc", isEU: false , lonLat: [7.42, 43.74] },
  pk: { name: "Pakistan", nameEn: "Pakistan", code: "pk", isEU: false , lonLat: [73.05, 33.68] },
  ps: { name: "Palestine", nameEn: "Palestine", code: "ps", isEU: false , lonLat: [35.2, 31.9] },
  qa: { name: "Qatar", nameEn: "Qatar", code: "qa", isEU: false , lonLat: [51.53, 25.29] },
  tn: { name: "Tunisie", nameEn: "Tunisia", code: "tn", isEU: false , lonLat: [10.18, 36.81] },
  tr: { name: "Turquie", nameEn: "Turkey", code: "tr", isEU: false , lonLat: [32.85, 39.93] },
  mu: { name: "Ile Maurice", nameEn: "Mauritius", code: "mu", isEU: false , lonLat: [57.5, -20.16] },
  sa: { name: "Arabie saoudite", nameEn: "Saudi Arabia", code: "sa", isEU: false , lonLat: [46.68, 24.71] },
  bj: { name: "Bénin", nameEn: "Benin", code: "bj", isEU: false , lonLat: [2.63, 6.5] },
  ci: { name: "Côte d'Ivoire", nameEn: "Ivory Coast", code: "ci", isEU: false , lonLat: [-4.02, 5.35] },
  gt: { name: "Guatemala", nameEn: "Guatemala", code: "gt", isEU: false , lonLat: [-90.51, 14.63] },
  mk: { name: "Macédoine du Nord", nameEn: "North Macedonia", code: "mk", isEU: false , lonLat: [21.43, 42.0] },
  mg: { name: "Madagascar", nameEn: "Madagascar", code: "mg", isEU: false , lonLat: [47.52, -18.88] },
  sn: { name: "Sénégal", nameEn: "Senegal", code: "sn", isEU: false , lonLat: [-17.44, 14.69] },
  tg: { name: "Togo", nameEn: "Togo", code: "tg", isEU: false , lonLat: [1.22, 6.13] },
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
