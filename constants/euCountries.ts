// EU/EEA country codes (considered safer for GDPR compliance)
export const EU_COUNTRIES = new Set([
  "fr", "de", "it", "es", "pt", "nl", "be", "lu", "at", "ie", "fi", "se",
  "dk", "pl", "cz", "sk", "hu", "ro", "bg", "hr", "si", "ee", "lv", "lt",
  "mt", "cy", "gr", "no", "is", "li", "ch" // + EEA & Switzerland
]);

// High-risk countries for data protection
export const HIGH_RISK_COUNTRIES = new Set(["cn", "ru"]);

// Medium-risk countries (no adequacy but common)
export const MEDIUM_RISK_COUNTRIES = new Set(["us"]);

