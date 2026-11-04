import { COUNTRIES } from "@/lib/countries";

// EU/EEA and adequacy countries (considered safer for GDPR compliance)
export const EU_COUNTRIES = new Set(
  Object.entries(COUNTRIES).filter(([, c]) => c.is_eu).map(([code]) => code),
);

// High-risk countries for data protection
export const HIGH_RISK_COUNTRIES = new Set(["cn", "ru"]);

export const MEDIUM_RISK_COUNTRIES = new Set(["us"]);
