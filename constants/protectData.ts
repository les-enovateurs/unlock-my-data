// Unified localStorage key for both protect-my-data and delete-my-data features
export const PROTECT_DATA_SELECTION_KEY = "protect-data-selection";

// Legacy key for backward compatibility (used by delete-my-data)
export const RISK_SELECTION_KEY = "risk_analysis_selection";

export const SERVICE_CATEGORIES: Record<string, string[]> = {
  messaging: ["whatsapp", "telegram", "signal", "messenger", "discord", "skype", "slack", "mattermost", "rocketchat", "wechat"],
  social: ["facebook", "instagram", "tiktok", "snapchat", "x-twitter", "linkedin", "pinterest", "reddit", "mastodon", "bumble", "tinder"],
  streaming: ["netflix", "disneyplus", "amazon-prime-video", "youtube", "twitch", "spotify", "deezer", "appletv"],
  cloud: ["google-drive", "dropbox", "onedrive", "icloud", "mega", "box", "proton-drive"],
  email: ["gmail", "outlook", "yahoo", "protonmail", "tutanota"],
  gps: ["google-maps", "waze", "apple-maps", "citymapper", "osmand", "strava"],
  search: ["google", "bing", "duckduckgo", "qwant", "ecosia"],
  browser: ["chrome", "firefox", "edge", "safari", "brave", "opera"],
  shopping: ["amazon", "aliexpress", "ebay", "leboncoin", "vinted", "alibaba", "boulanger", "carrefour", "ikea", "rue-du-commerce", "shein", "temu", "zalando"],
  meeting: ["zoom", "teams", "google-meet", "skype", "microsoft-teams"],
  ai: ["chatgpt", "claude", "gemini", "mistral", "perplexity"],
  travel: ["booking", "airbnb-inc", "opodo", "ryanair"],
  health: ["doctolib", "caisse-nationale-dassurance-maladie"],
  education: ["kahoot", "moodle", "pronote"],
  gaming: ["candy-crush", "playstation", "pokemon-go", "rockstar-games", "steam"],
  food: ["marmiton", "reddit"],
  services: ["la-poste", "revolut", "indeed"]
};

export const getAlternatives = (slug: string): string[] => {
  for (const category in SERVICE_CATEGORIES) {
    if (SERVICE_CATEGORIES[category].includes(slug)) {
       return SERVICE_CATEGORIES[category].filter(s => s !== slug);
    }
  }
  return [];
};

export interface Service {
  slug: string;
  name: string;
  logo: string;
  nationality?: string;
  country_code?: string;
  country_name?: string;
  tosdr?: boolean | string;
  exodus?: boolean | string;
  url_delete?: string | null;
  contact_mail_delete?: string;
  need_id_card?: boolean | null;
  easy_access_data?: string | number;
}

export interface ServiceDetails {
  tosdrRating?: string;
  trackers?: number[];
  sanctionedByCnil?: boolean;
  outsideEU?: boolean;
  breaches?: number;
  riskScore?: number;
}

export interface AnalysisResult {
  score: number;
  riskLevel: string;
  totalTrackers: number;
  uniqueTrackers: Set<number>;
  breachCount: number;
  sanctionCount: number;
  outsideEUCount: number;
  worstServices: Array<{ slug: string; name: string; score: number; reasons: string[] }>;
  actions: Array<{
    service: string;
    slug: string;
    priority: "urgent" | "recommended" | "optional";
    action: string;
    reason: string;
    type: "delete_account" | "find_alternative" | "change_password" | "check_settings";
    payload?: any;
  }>;
}

export interface SaveData {
  selectedServices: string[];
  completedServices?: string[];
  skippedServices?: string[];
  notes?: { [key: string]: string };
  timestamp: string;
  alternativesAdopted?: { [key: string]: string }; // slug -> alternative slug
  alternativesSkipped?: string[]; // slugs where alternative finding was skipped
  passwordsChanged?: string[]; // slugs where password was changed
  dataExported?: string[]; // slugs where data was exported
}
