/**
 * Country coordinates for data transfer visualization
 * Coordinates are [longitude, latitude] for react-simple-maps
 */

export interface CountryCoordinate {
  name: string;
  nameEn: string;
  code: string;
  coordinates: [number, number]; // [longitude, latitude]
  isEU: boolean;
}

export const countryCoordinates: Record<string, CountryCoordinate> = {
  // Europe - EU/EEA
  fr: { name: "France", nameEn: "France", code: "fr", coordinates: [2.3522, 48.8566], isEU: true },
  de: { name: "Allemagne", nameEn: "Germany", code: "de", coordinates: [13.4050, 52.5200], isEU: true },
  it: { name: "Italie", nameEn: "Italy", code: "it", coordinates: [12.4964, 41.9028], isEU: true },
  es: { name: "Espagne", nameEn: "Spain", code: "es", coordinates: [-3.7038, 40.4168], isEU: true },
  pt: { name: "Portugal", nameEn: "Portugal", code: "pt", coordinates: [-9.1393, 38.7223], isEU: true },
  nl: { name: "Pays-Bas", nameEn: "Netherlands", code: "nl", coordinates: [4.9041, 52.3676], isEU: true },
  be: { name: "Belgique", nameEn: "Belgium", code: "be", coordinates: [4.3517, 50.8503], isEU: true },
  lu: { name: "Luxembourg", nameEn: "Luxembourg", code: "lu", coordinates: [6.1319, 49.6116], isEU: true },
  at: { name: "Autriche", nameEn: "Austria", code: "at", coordinates: [16.3738, 48.2082], isEU: true },
  ie: { name: "Irlande", nameEn: "Ireland", code: "ie", coordinates: [-6.2603, 53.3498], isEU: true },
  fi: { name: "Finlande", nameEn: "Finland", code: "fi", coordinates: [24.9384, 60.1699], isEU: true },
  se: { name: "Suède", nameEn: "Sweden", code: "se", coordinates: [18.0686, 59.3293], isEU: true },
  dk: { name: "Danemark", nameEn: "Denmark", code: "dk", coordinates: [12.5683, 55.6761], isEU: true },
  pl: { name: "Pologne", nameEn: "Poland", code: "pl", coordinates: [21.0122, 52.2297], isEU: true },
  cz: { name: "Tchéquie", nameEn: "Czech Republic", code: "cz", coordinates: [14.4378, 50.0755], isEU: true },
  sk: { name: "Slovaquie", nameEn: "Slovakia", code: "sk", coordinates: [17.1077, 48.1486], isEU: true },
  hu: { name: "Hongrie", nameEn: "Hungary", code: "hu", coordinates: [19.0402, 47.4979], isEU: true },
  ro: { name: "Roumanie", nameEn: "Romania", code: "ro", coordinates: [26.1025, 44.4268], isEU: true },
  bg: { name: "Bulgarie", nameEn: "Bulgaria", code: "bg", coordinates: [23.3219, 42.6977], isEU: true },
  hr: { name: "Croatie", nameEn: "Croatia", code: "hr", coordinates: [15.9819, 45.8150], isEU: true },
  si: { name: "Slovénie", nameEn: "Slovenia", code: "si", coordinates: [14.5058, 46.0569], isEU: true },
  ee: { name: "Estonie", nameEn: "Estonia", code: "ee", coordinates: [24.7536, 59.4370], isEU: true },
  lv: { name: "Lettonie", nameEn: "Latvia", code: "lv", coordinates: [24.1052, 56.9496], isEU: true },
  lt: { name: "Lituanie", nameEn: "Lithuania", code: "lt", coordinates: [25.2798, 54.6872], isEU: true },
  mt: { name: "Malte", nameEn: "Malta", code: "mt", coordinates: [14.5146, 35.8989], isEU: true },
  cy: { name: "Chypre", nameEn: "Cyprus", code: "cy", coordinates: [33.3823, 35.1856], isEU: true },
  gr: { name: "Grèce", nameEn: "Greece", code: "gr", coordinates: [23.7275, 37.9838], isEU: true },

  // EEA + Adequacy
  no: { name: "Norvège", nameEn: "Norway", code: "no", coordinates: [10.7522, 59.9139], isEU: true },
  is: { name: "Islande", nameEn: "Iceland", code: "is", coordinates: [-21.8954, 64.1466], isEU: true },
  li: { name: "Liechtenstein", nameEn: "Liechtenstein", code: "li", coordinates: [9.5209, 47.1410], isEU: true },
  ch: { name: "Suisse", nameEn: "Switzerland", code: "ch", coordinates: [8.5417, 47.3769], isEU: true },
  gb: { name: "Royaume-Uni", nameEn: "United Kingdom", code: "gb", coordinates: [-0.1276, 51.5074], isEU: true },
  uk: { name: "Royaume-Uni", nameEn: "United Kingdom", code: "uk", coordinates: [-0.1276, 51.5074], isEU: true },

  // North America
  us: { name: "États-Unis", nameEn: "United States", code: "us", coordinates: [-95.7129, 37.0902], isEU: false },
  ca: { name: "Canada", nameEn: "Canada", code: "ca", coordinates: [-106.3468, 56.1304], isEU: false },
  mx: { name: "Mexique", nameEn: "Mexico", code: "mx", coordinates: [-99.1332, 19.4326], isEU: false },

  // Asia
  cn: { name: "Chine", nameEn: "China", code: "cn", coordinates: [116.4074, 39.9042], isEU: false },
  jp: { name: "Japon", nameEn: "Japan", code: "jp", coordinates: [139.6917, 35.6895], isEU: false },
  kr: { name: "Corée du Sud", nameEn: "South Korea", code: "kr", coordinates: [126.9780, 37.5665], isEU: false },
  in: { name: "Inde", nameEn: "India", code: "in", coordinates: [77.2090, 28.6139], isEU: false },
  sg: { name: "Singapour", nameEn: "Singapore", code: "sg", coordinates: [103.8198, 1.3521], isEU: false },
  hk: { name: "Hong Kong", nameEn: "Hong Kong", code: "hk", coordinates: [114.1694, 22.3193], isEU: false },
  tw: { name: "Taïwan", nameEn: "Taiwan", code: "tw", coordinates: [121.5654, 25.0330], isEU: false },
  my: { name: "Malaisie", nameEn: "Malaysia", code: "my", coordinates: [101.6869, 3.1390], isEU: false },
  th: { name: "Thaïlande", nameEn: "Thailand", code: "th", coordinates: [100.5018, 13.7563], isEU: false },
  vn: { name: "Vietnam", nameEn: "Vietnam", code: "vn", coordinates: [105.8542, 21.0285], isEU: false },
  id: { name: "Indonésie", nameEn: "Indonesia", code: "id", coordinates: [106.8456, -6.2088], isEU: false },
  ph: { name: "Philippines", nameEn: "Philippines", code: "ph", coordinates: [120.9842, 14.5995], isEU: false },
  ae: { name: "Émirats arabes unis", nameEn: "United Arab Emirates", code: "ae", coordinates: [55.2708, 25.2048], isEU: false },
  il: { name: "Israël", nameEn: "Israel", code: "il", coordinates: [35.2137, 31.7683], isEU: false },

  // Russia & Eastern Europe
  ru: { name: "Russie", nameEn: "Russia", code: "ru", coordinates: [37.6173, 55.7558], isEU: false },
  ua: { name: "Ukraine", nameEn: "Ukraine", code: "ua", coordinates: [30.5234, 50.4501], isEU: false },
  by: { name: "Biélorussie", nameEn: "Belarus", code: "by", coordinates: [27.5615, 53.9045], isEU: false },

  // Oceania
  au: { name: "Australie", nameEn: "Australia", code: "au", coordinates: [151.2093, -33.8688], isEU: false },
  nz: { name: "Nouvelle-Zélande", nameEn: "New Zealand", code: "nz", coordinates: [174.7633, -41.2865], isEU: false },

  // South America
  br: { name: "Brésil", nameEn: "Brazil", code: "br", coordinates: [-47.9292, -15.7801], isEU: false },
  ar: { name: "Argentine", nameEn: "Argentina", code: "ar", coordinates: [-58.3816, -34.6037], isEU: false },
  cl: { name: "Chili", nameEn: "Chile", code: "cl", coordinates: [-70.6693, -33.4489], isEU: false },
  co: { name: "Colombie", nameEn: "Colombia", code: "co", coordinates: [-74.0721, 4.7110], isEU: false },

  // Africa
  za: { name: "Afrique du Sud", nameEn: "South Africa", code: "za", coordinates: [28.0473, -26.2041], isEU: false },
  ng: { name: "Nigeria", nameEn: "Nigeria", code: "ng", coordinates: [3.3792, 6.5244], isEU: false },
  eg: { name: "Égypte", nameEn: "Egypt", code: "eg", coordinates: [31.2357, 30.0444], isEU: false },
  ma: { name: "Maroc", nameEn: "Morocco", code: "ma", coordinates: [-6.8498, 34.0209], isEU: false },
};

/**
 * Parse transfer destination string and extract country codes
 */
export function parseTransferCountries(transferString: string | undefined | null, lang: string = "fr"): string[] {
  if (!transferString || transferString.toLowerCase().includes("non indiqué") || transferString.toLowerCase().includes("not specified")) {
    return [];
  }

  const countryCodes: string[] = [];
  const normalizedString = transferString.toLowerCase();

  // Map of common country names to codes
  const countryNameMappings: Record<string, string> = {
    // French names
    "états-unis": "us",
    "etats-unis": "us",
    "usa": "us",
    "amérique": "us",
    "amerique": "us",
    "france": "fr",
    "allemagne": "de",
    "royaume-uni": "gb",
    "royaumeuni": "gb",
    "angleterre": "gb",
    "irlande": "ie",
    "pays-bas": "nl",
    "suisse": "ch",
    "belgique": "be",
    "espagne": "es",
    "italie": "it",
    "portugal": "pt",
    "autriche": "at",
    "pologne": "pl",
    "suède": "se",
    "danemark": "dk",
    "finlande": "fi",
    "norvège": "no",
    "chine": "cn",
    "japon": "jp",
    "corée": "kr",
    "inde": "in",
    "singapour": "sg",
    "malaisie": "my",
    "australie": "au",
    "canada": "ca",
    "brésil": "br",
    "russie": "ru",
    "israel": "il",
    "israël": "il",
    "émirats": "ae",
    "emirats": "ae",
    "hong kong": "hk",
    "taïwan": "tw",
    "taiwan": "tw",

    // English names
    "united states": "us",
    "united kingdom": "gb",
    "germany": "de",
    "netherlands": "nl",
    "switzerland": "ch",
    "belgium": "be",
    "spain": "es",
    "italy": "it",
    "austria": "at",
    "poland": "pl",
    "sweden": "se",
    "denmark": "dk",
    "finland": "fi",
    "norway": "no",
    "china": "cn",
    "japan": "jp",
    "korea": "kr",
    "south korea": "kr",
    "india": "in",
    "singapore": "sg",
    "malaysia": "my",
    "australia": "au",
    "brazil": "br",
    "russia": "ru",

    // Special cases
    "espace économique européen": "eea",
    "espace economique europeen": "eea",
    "european economic area": "eea",
    "eea": "eea",
    "eee": "eea",
    "union européenne": "eu",
    "european union": "eu",
  };

  // Check each country mapping
  for (const [name, code] of Object.entries(countryNameMappings)) {
    if (normalizedString.includes(name)) {
      if (code === "eea" || code === "eu") {
        // For EEA/EU, we could add multiple countries or skip
        // For now, we'll skip as it's too broad
        continue;
      }
      if (!countryCodes.includes(code)) {
        countryCodes.push(code);
      }
    }
  }

  return countryCodes;
}

/**
 * Get country info by code
 */
export function getCountryByCode(code: string): CountryCoordinate | null {
  return countryCoordinates[code.toLowerCase()] || null;
}

/**
 * Get user's default location (France by default)
 */
export function getUserLocation(): CountryCoordinate {
  return countryCoordinates.fr;
}

/**
 * Calculate the arc path between two points for curved lines
 */
export function calculateArcPath(
  start: [number, number],
  end: [number, number]
): string {
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;

  // Calculate perpendicular offset for curve
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Curve intensity based on distance
  const curveOffset = Math.min(distance * 0.3, 20);

  // Perpendicular direction (rotate 90 degrees)
  const perpX = -dy / distance;
  const perpY = dx / distance;

  // Control point
  const ctrlX = midX + perpX * curveOffset;
  const ctrlY = midY + perpY * curveOffset;

  return `M ${start[0]} ${start[1]} Q ${ctrlX} ${ctrlY} ${end[0]} ${end[1]}`;
}
