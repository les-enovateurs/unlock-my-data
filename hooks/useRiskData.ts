import { useState, useEffect, useCallback } from "react";
import type { Service } from "@/constants/protectData";
import { calculateBatchRisks, type RiskLevel } from "@/lib/riskCalculation";

interface BreachInfo {
  pwnCount: number;
  dataClasses: string[];
}

interface ManualServiceData {
  sanctioned_by_cnil?: boolean;
  outside_eu_storage?: boolean;
}

/**
 * Custom hook to load and cache risk data
 * Eco-conception: Single source of truth, optimized fetches
 */
export function useRiskData(services: Service[]) {
  const [quickRiskCache, setQuickRiskCache] = useState<Record<string, RiskLevel>>({});
  const [breachData, setBreachData] = useState<Record<string, BreachInfo[]>>({});
  const [manualData, setManualData] = useState<Record<string, ManualServiceData>>({});
  const [loading, setLoading] = useState(false);

  const loadRiskData = useCallback(async () => {
    if (services.length === 0) return;

    setLoading(true);
    let breaches: Record<string, BreachInfo[]> = {};
    const manualCache: Record<string, ManualServiceData> = {};

    try {
      // Load breach data (single fetch)
      const breachRes = await fetch("/data/compare/breach-mapping.json");
      if (breachRes.ok) {
        breaches = await breachRes.json();
        setBreachData(breaches);
      }
    } catch (error) {
      console.error("Failed to load breach data:", error);
    }

    // Load manual data in parallel (max 10 concurrent requests for eco-conception)
    const batchSize = 10;
    for (let i = 0; i < services.length; i += batchSize) {
      const batch = services.slice(i, i + batchSize);
      const promises = batch.map(async (service) => {
        try {
          const res = await fetch(`/data/manual/${service.slug}.json`);
          if (res.ok) {
            const data = await res.json();
            manualCache[service.slug] = {
              sanctioned_by_cnil: data.sanctioned_by_cnil,
              outside_eu_storage: data.outside_eu_storage,
            };
          }
        } catch (error) {
          // Silently fail for individual services
        }
      });
      await Promise.all(promises);
    }

    setManualData(manualCache);

    // Calculate risks efficiently
    const riskCache = calculateBatchRisks(services, breaches, manualCache);
    setQuickRiskCache(riskCache);
    setLoading(false);
  }, [services]);

  useEffect(() => {
    loadRiskData();
  }, [loadRiskData]);

  return {
    quickRiskCache,
    breachData,
    manualData,
    loading,
    reload: loadRiskData,
  };
}

