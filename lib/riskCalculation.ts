import type { Service } from "@/constants/protectData";
import { EU_COUNTRIES, HIGH_RISK_COUNTRIES, MEDIUM_RISK_COUNTRIES } from "@/constants/euCountries";

export type RiskLevel = "high" | "medium" | "low" | "unknown";

interface BreachInfo {
  pwnCount: number;
  dataClasses: string[];
}

interface ManualServiceData {
  sanctioned_by_cnil?: boolean;
  outside_eu_storage?: boolean;
}

export interface RiskCalculationInput {
  service: Service;
  breaches?: BreachInfo[];
  manualData?: ManualServiceData;
}

/**
 * Calculate risk score for a service (0-100+, higher = more risk)
 * Eco-conception: Centralized logic, no duplication
 */
export function calculateServiceRiskScore(input: RiskCalculationInput): number {
  const { service, breaches, manualData } = input;
  let riskScore = 0;

  // 1. Country-based risk
  const countryCode = service.country_code?.toLowerCase();
  if (countryCode && !EU_COUNTRIES.has(countryCode)) {
    if (HIGH_RISK_COUNTRIES.has(countryCode)) {
      riskScore += 20;
    } else if (MEDIUM_RISK_COUNTRIES.has(countryCode)) {
      riskScore += 10;
    } else {
      riskScore += 5;
    }
  }

  // 2. Deletion difficulty
  const hasUrlDelete = !!service.url_delete;
  const hasEmailDelete = !!service.contact_mail_delete;
  if (!hasUrlDelete && !hasEmailDelete) {
    riskScore += 25;
  } else if (!hasUrlDelete && hasEmailDelete) {
    riskScore += 5;
  }

  // 3. ID card requirement
  if (service.need_id_card === true) {
    riskScore += 10;
  }

  // 4. Easy access data score
  const easyAccess = service.easy_access_data;
  if (easyAccess != null) {
    // Convert to string to handle both string and number types
    const easyAccessStr = String(easyAccess);

    // Handle both "X/5" format and plain number format
    const match = easyAccessStr.match(/(\d)\/5/);
    let score: number;

    if (match) {
      score = parseInt(match[1], 10);
    } else {
      // Try parsing as a plain number
      score = parseInt(easyAccessStr, 10);
    }

    if (!isNaN(score)) {
      if (score <= 2) riskScore += 15;
      else if (score <= 3) riskScore += 5;
    }
  }

  // 5. Breach penalties
  if (breaches && breaches.length > 0) {
    riskScore += 25; // Base penalty

    const totalPwned = breaches.reduce((sum, b) => sum + (b.pwnCount || 0), 0);
    if (totalPwned > 1000000) riskScore += 15;
    else if (totalPwned > 100000) riskScore += 5;

    const hasSensitiveData = breaches.some(b =>
      b.dataClasses?.some(dc => {
        const dcLower = dc.toLowerCase();
        return dcLower.includes("password") ||
               dcLower.includes("credit") ||
               dcLower.includes("financial");
      })
    );
    if (hasSensitiveData) riskScore += 10;
  }

  // 6. CNIL sanctions
  if (manualData?.sanctioned_by_cnil) {
    riskScore += 20;
  }

  return riskScore;
}

/**
 * Convert risk score to risk level
 */
export function getRiskLevel(riskScore: number): RiskLevel {
  if (riskScore >= 35) return "high";
  if (riskScore >= 15) return "medium";
  if (riskScore > 0) return "low";
  return "unknown";
}

/**
 * Calculate risk for multiple services efficiently
 * Eco-conception: Batch processing, single iteration
 */
export function calculateBatchRisks(
  services: Service[],
  breachData: Record<string, BreachInfo[]>,
  manualData: Record<string, ManualServiceData>
): { levels: Record<string, RiskLevel>; scores: Record<string, number> } {
  const levels: Record<string, RiskLevel> = {};
  const scores: Record<string, number> = {};

  for (const service of services) {
    const riskScore = calculateServiceRiskScore({
      service,
      breaches: breachData[service.slug],
      manualData: manualData[service.slug],
    });
    levels[service.slug] = getRiskLevel(riskScore);
    scores[service.slug] = riskScore;
  }

  return { levels, scores };
}

