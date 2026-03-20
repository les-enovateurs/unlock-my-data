"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  PROTECT_DATA_SELECTION_KEY,
  getAlternatives,
  type Service,
  type ServiceDetails,
  type AnalysisResult,
  type SaveData
} from "@/constants/protectData";
import { useRiskData } from "@/hooks/useRiskData";
import { useServiceProgress } from "@/hooks/useServiceProgress";
import { EU_COUNTRIES } from "@/constants/euCountries";
import Translator from "@/components/tools/t";
import dict from "@/i18n/ProtectMyData.json";
import { useRouter } from "next/navigation";

export type SubStep = "alternative" | "export" | "delete";

interface ActionToProcess {
  slug: string;
  type: "find_alternative" | "change_password" | "export_data" | "delete_account";
  priority: "urgent" | "recommended" | "optional";
}

interface ProtectDataContextType {
  // State
  services: Service[];
  selectedSlugs: Set<string>;
  searchQuery: string;
  loading: boolean;
  analyzing: boolean;
  analysisResult: AnalysisResult | null;
  serviceDetails: Record<string, ServiceDetails>;
  currentActionIndex: number;
  currentSubStep: SubStep;
  showDataMap: boolean;
  lang: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  step: number;
  savedNotification: boolean;
  loadedNotification: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedSlugs: React.Dispatch<React.SetStateAction<Set<string>>>;
  toggleService: (slug: string) => void;
  setCurrentActionIndex: (index: number) => void;
  setCurrentSubStep: (subStep: SubStep) => void;
  setShowDataMap: (show: boolean) => void;
  goToAnalysis: () => void;
  goToActions: () => void;
  goToSpecificAction: (slug: string, type: string) => void;
  restart: () => void;
  resetAllData: () => void;
  saveToFile: () => void;
  loadFromFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setStep: (step: number) => void;
  
  // Computed
  filteredServices: Service[];
  selectedServices: Service[];
  actionsToProcess: ActionToProcess[];
  riskStats: any;
  serviceProgress: any;
  quickRiskCache: Record<string, "high" | "medium" | "low" | "unknown">;
  manualAlternativesMap: Record<string, string[]>;
}

const ProtectDataContext = createContext<ProtectDataContextType | undefined>(undefined);

export function ProtectDataProvider({ children, lang = "fr", preselectedSlug }: { children: React.ReactNode, lang?: string, preselectedSlug?: string }) {
  const router = useRouter();
  const t = useMemo(() => new Translator(dict, lang), [lang]);

  // Core state
  const [services, setServices] = useState<Service[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [serviceDetails, setServiceDetails] = useState<Record<string, ServiceDetails>>({});
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState<SubStep>("alternative");
  const [showDataMap, setShowDataMap] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [savedNotification, setSavedNotification] = useState(false);
  const [loadedNotification, setLoadedNotification] = useState(false);

  // Custom hooks
  const serviceProgress = useServiceProgress();
  const { quickRiskCache, quickRiskScoreCache, breachData, manualData } = useRiskData(services);

  // Load services
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/services.json");
        const data = await response.json();
        setServices(data);

        // Load saved selection from localStorage
        const saved = localStorage.getItem(PROTECT_DATA_SELECTION_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setSelectedSlugs(new Set(parsed));
            } else if (parsed.selectedServices) {
              setSelectedSlugs(new Set(parsed.selectedServices));
              serviceProgress.loadState(parsed);
            }
          } catch { }
        }

        // Handle preselected slug
        if (preselectedSlug) {
          const serviceExists = data.some((s: Service) => s.slug === preselectedSlug);
          if (serviceExists) {
            setSelectedSlugs(prev => new Set([...prev, preselectedSlug]));
          }
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedSlug]);

  // Auto-save selection
  useEffect(() => {
    if (services.length > 0 && selectedSlugs.size > 0) {
      const saveData: SaveData = {
        selectedServices: Array.from(selectedSlugs),
        completedServices: serviceProgress.completedServices,
        skippedServices: serviceProgress.skippedServices,
        notes: serviceProgress.notes,
        alternativesAdopted: serviceProgress.alternativesAdopted,
        alternativesSkipped: serviceProgress.alternativesSkipped,
        passwordsChanged: serviceProgress.passwordsChanged,
        dataExported: serviceProgress.dataExported,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(PROTECT_DATA_SELECTION_KEY, JSON.stringify(saveData));
    }
  }, [selectedSlugs, serviceProgress, services.length]);

  // Computed values
  const filteredServices = useMemo(() => {
    if (!searchQuery) return services;
    const query = searchQuery.toLowerCase();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.slug.toLowerCase().includes(query)
    );
  }, [services, searchQuery]);

  const selectedServices = useMemo(() => {
    return services.filter((s) => selectedSlugs.has(s.slug));
  }, [services, selectedSlugs]);

  const manualAlternativesMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const slug of selectedSlugs) {
      if (manualData[slug]?.alternatives) {
        map[slug] = manualData[slug].alternatives!;
      }
    }
    return map;
  }, [manualData, selectedSlugs]);

  const actionsToProcess = useMemo(() => {
    if (!analysisResult) return [];

    const serviceMap = new Map<string, ActionToProcess>();
    const priorityOrder: Record<ActionToProcess["priority"], number> = { urgent: 0, recommended: 1, optional: 2 };

    const upsert = (slug: string, type: ActionToProcess["type"], priority: ActionToProcess["priority"]) => {
      const existing = serviceMap.get(slug);
      if (!existing || priorityOrder[priority] < priorityOrder[existing.priority]) {
        serviceMap.set(slug, { slug, type, priority });
      }
    };

    for (const action of analysisResult.actions) {
      if (action.type === "find_alternative" || action.type === "change_password" || action.type === "delete_account") {
        upsert(action.slug, action.type, action.priority);
      }
    }

    for (const slug of selectedSlugs) {
      if (!serviceMap.has(slug)) {
        upsert(slug, "delete_account", "optional");
      }
    }

    const actions = Array.from(serviceMap.values());
    actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return actions;
  }, [analysisResult, selectedSlugs]);

  const riskStats = useMemo(() => {
    const stats = {
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      unknownCount: 0,
      breachCount: 0,
      cnilCount: 0,
      outsideEUCount: 0,
      noDeletionMethodCount: 0,
      gaugePercent: 0,
    };

    for (const slug of selectedSlugs) {
      const risk = quickRiskCache[slug];
      if (risk === "high") stats.highCount++;
      else if (risk === "medium") stats.mediumCount++;
      else if (risk === "low") stats.lowCount++;
      else stats.unknownCount++;

      const service = services.find(s => s.slug === slug);
      if (breachData[slug]?.length > 0) stats.breachCount++;
      if (manualData[slug]?.sanctioned_by_cnil) stats.cnilCount++;
      if (service?.country_code && !EU_COUNTRIES.has(service.country_code.toLowerCase())) stats.outsideEUCount++;
      if (service && !service.url_delete && !service.contact_mail_delete) stats.noDeletionMethodCount++;
    }

    if (selectedSlugs.size > 0) {
      const maxRisk = selectedSlugs.size * 100;
      const actualRisk = (stats.highCount * 100) + (stats.mediumCount * 50) + (stats.lowCount * 10);
      stats.gaugePercent = Math.min(100, Math.round((actualRisk / maxRisk) * 100));
    }

    return stats;
  }, [selectedSlugs, quickRiskCache, breachData, manualData, services]);

  // Actions
  const toggleService = useCallback((slug: string) => {
    setSelectedSlugs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  }, []);

  const analyzeFootprint = useCallback(async () => {
    if (selectedSlugs.size === 0) return;
    setAnalyzing(true);

    const details: Record<string, ServiceDetails> = {};
    const allTrackers = new Set<number>();
    let totalBreaches = 0;
    let totalSanctions = 0;
    let outsideEUCount = 0;

    const analysisPromises = Array.from(selectedSlugs).map(async (slug) => {
      const service = services.find((s) => s.slug === slug);
      if (!service) return;

      const serviceDetail: ServiceDetails = { riskScore: 0 };

      if (service.exodus) {
        try {
          const exodusPath = typeof service.exodus === "string" ? service.exodus : `/data/compare/${slug}.json`;
          const exodusRes = await fetch(exodusPath);
          if (exodusRes.ok) {
            const exodusData = await exodusRes.json();
            serviceDetail.trackers = exodusData.trackers || [];
            exodusData.trackers?.forEach((t: number) => allTrackers.add(t));
            serviceDetail.riskScore! += Math.min((exodusData.trackers?.length || 0) * 2.5, 30);
          }
        } catch { }
      }

      const manualContext = manualData[slug];
      if (manualContext) {
        serviceDetail.sanctionedByCnil = manualContext.sanctioned_by_cnil;
        serviceDetail.outsideEU = manualContext.outside_eu_storage;
        if (manualContext.sanctioned_by_cnil) {
          totalSanctions++;
          serviceDetail.riskScore! += 30;
        }
        if (manualContext.outside_eu_storage) {
          outsideEUCount++;
          serviceDetail.riskScore! += 10;
        }
      }

      const breaches = breachData[slug];
      if (breaches?.length > 0) {
        serviceDetail.breaches = breaches.length;
        totalBreaches += breaches.length;
        serviceDetail.riskScore! += Math.min(breaches.length * 10, 40);
      }

      serviceDetail.riskScore = Math.min(100, serviceDetail.riskScore!);
      details[slug] = serviceDetail;
    });

    await Promise.all(analysisPromises);

    // After all fetches, collect trackers safely
    Object.values(details).forEach(detail => {
      detail.trackers?.forEach((t: number) => allTrackers.add(t));
    });

    setServiceDetails(details);

    const result = calculateAnalysis(
      selectedServices,
      details,
      allTrackers,
      totalBreaches,
      totalSanctions,
      outsideEUCount,
      quickRiskScoreCache,
      manualAlternativesMap,
      t
    );

    setAnalysisResult(result);
    setAnalyzing(false);
  }, [selectedSlugs, services, manualData, breachData, selectedServices, quickRiskScoreCache, manualAlternativesMap, t]);

  const goToAnalysis = useCallback(() => {
    if (selectedSlugs.size > 0) {
      analyzeFootprint();
      const basePath = lang === 'fr' ? '/proteger-mes-donnees' : '/protect-my-data';
      router.push(`${basePath}/analyse`);
    }
  }, [selectedSlugs.size, analyzeFootprint, lang, router]);

  const goToActions = useCallback(() => {
    if (actionsToProcess.length > 0) {
      const basePath = lang === 'fr' ? '/proteger-mes-donnees' : '/protect-my-data';
      router.push(`${basePath}/actions/${actionsToProcess[0].slug}`);
    } else {
      const basePath = lang === 'fr' ? '/proteger-mes-donnees' : '/protect-my-data';
      const summaryPath = lang === 'fr' ? 'bilan' : 'summary';
      router.push(`${basePath}/${summaryPath}`);
    }
  }, [actionsToProcess, lang, router]);

  const goToSpecificAction = useCallback((slug: string, type: string) => {
    const basePath = lang === 'fr' ? '/proteger-mes-donnees' : '/protect-my-data';
    
    // Map action type to sub-step
    let subStep: SubStep = "alternative";
    if (type === "delete_account") subStep = "delete";
    else if (type === "find_alternative") subStep = "alternative";
    else if (type === "change_password" || type === "export_data") subStep = "export";
    
    setCurrentSubStep(subStep);
    router.push(`${basePath}/actions/${slug}`);
  }, [lang, router]);

  const restart = useCallback(() => {
    setSelectedSlugs(new Set());
    serviceProgress.reset();
    setAnalysisResult(null);
    setSearchQuery("");
    const basePath = lang === 'fr' ? '/proteger-mes-donnees' : '/protect-my-data';
    router.push(basePath);
  }, [serviceProgress, lang, router]);

  const resetAllData = useCallback(() => {
    localStorage.removeItem(PROTECT_DATA_SELECTION_KEY);
    restart();
  }, [restart]);

  const saveToFile = useCallback(() => {
    const saveData: SaveData = {
      selectedServices: Array.from(selectedSlugs),
      completedServices: serviceProgress.completedServices,
      skippedServices: serviceProgress.skippedServices,
      notes: serviceProgress.notes,
      alternativesAdopted: serviceProgress.alternativesAdopted,
      alternativesSkipped: serviceProgress.alternativesSkipped,
      passwordsChanged: serviceProgress.passwordsChanged,
      dataExported: serviceProgress.dataExported,
      timestamp: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(saveData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `proteger-donnees-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  }, [selectedSlugs, serviceProgress]);

  const loadFromFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data: SaveData = JSON.parse(e.target?.result as string);
          if (data.selectedServices && Array.isArray(data.selectedServices)) {
            const validSlugs = data.selectedServices.filter(slug =>
              services.some(s => s.slug === slug)
            );
            setSelectedSlugs(new Set(validSlugs));
            serviceProgress.loadState(data);
            
            setLoadedNotification(true);
            setTimeout(() => setLoadedNotification(false), 3000);
          }
        } catch (error) {
          console.error("Error loading file:", error);
        }
      };
      reader.readAsText(file);
    }
  }, [services, serviceProgress]);

  const value = {
    services,
    selectedSlugs,
    searchQuery,
    loading,
    analyzing,
    analysisResult,
    serviceDetails,
    currentActionIndex,
    currentSubStep,
    showDataMap,
    lang,
    fileInputRef,
    step,
    savedNotification,
    loadedNotification,
    setSearchQuery,
    setSelectedSlugs,
    toggleService,
    setCurrentActionIndex,
    setCurrentSubStep,
    setShowDataMap,
    goToAnalysis,
    goToActions,
    goToSpecificAction,
    restart,
    resetAllData,
    saveToFile,
    loadFromFile,
    setStep,
    filteredServices,
    selectedServices,
    actionsToProcess,
    riskStats,
    serviceProgress,
    quickRiskCache,
    manualAlternativesMap,
  };

  return (
    <ProtectDataContext.Provider value={value}>
      {children}
    </ProtectDataContext.Provider>
  );
}

export function useProtectData() {
  const context = useContext(ProtectDataContext);
  if (context === undefined) {
    throw new Error("useProtectData must be used within a ProtectDataProvider");
  }
  return context;
}

// Helper for analysis calculation (moved from component)
function calculateAnalysis(
  services: Service[],
  details: Record<string, ServiceDetails>,
  allTrackers: Set<number>,
  totalBreaches: number,
  totalSanctions: number,
  outsideEUCount: number,
  quickRiskScoreCache: Record<string, number>,
  manualAlternativesMap: Record<string, string[]>,
  t: Translator
): AnalysisResult {
  let totalScore = 0;
  let maxServiceScore = 0;
  const worstServices: AnalysisResult["worstServices"] = [];
  const actions: AnalysisResult["actions"] = [];

  for (const service of services) {
    const detail = details[service.slug] || {};
    const serviceScore = detail.riskScore ?? 0;
    totalScore += serviceScore;
    if (serviceScore > maxServiceScore) maxServiceScore = serviceScore;

    const reasons: string[] = [];
    const serviceActions: Array<{ text: string, type: any, payload?: any, priority?: "urgent" | "recommended" | "optional" }> = [];
    let highestPriority: "urgent" | "recommended" | "optional" = "optional";

    const alternatives = getAlternatives(service.slug, manualAlternativesMap);
    let isBestInCategory = false;
    if (alternatives.length > 0) {
      let isBest = true;
      const currentScore = quickRiskScoreCache[service.slug] ?? serviceScore;
      for (const altSlug of alternatives) {
        const altScore = quickRiskScoreCache[altSlug];
        if (altScore !== undefined && altScore < currentScore) {
          isBest = false;
          break;
        }
      }
      isBestInCategory = isBest;
    }

    const trackerCount = detail.trackers?.length || 0;
    if (trackerCount > 5) reasons.push(`${trackerCount} ${t.t("trackerCountSuffix")}`);
    if (detail.sanctionedByCnil) {
      reasons.push(t.t("sanctionedByCnilDetected"));
      highestPriority = "urgent";
    }
    if (detail.outsideEU) {
      reasons.push(t.t("outsideEUServicesInfo"));
      if (highestPriority !== "urgent") highestPriority = "recommended";
    }
    if (detail.breaches && detail.breaches > 0) {
      reasons.push(`${detail.breaches} ${t.t("breachCountSuffix")}`);
      serviceActions.push({ text: t.t("actionChangePassword"), type: "change_password", priority: "recommended" });
      if (highestPriority !== "urgent") highestPriority = "recommended";
    }

    if (reasons.length === 0 && !isBestInCategory && alternatives.length > 0) {
      reasons.push(t.t("betterAlternativeAvailable"));
    }

    if (reasons.length > 0 && (!isBestInCategory || detail.outsideEU) && alternatives.length > 0) {
      serviceActions.push({
        text: t.t("actionFindAlternative"),
        type: "find_alternative",
        payload: { alternatives },
        priority: highestPriority === "urgent" ? "urgent" : (highestPriority === "recommended" ? "recommended" : "optional")
      });
    }

    if (detail.sanctionedByCnil || trackerCount > 10) {
      serviceActions.push({ text: t.t("actionDeleteAccount"), type: "delete_account", priority: "urgent" });
      highestPriority = "urgent";
    }

    for (const act of serviceActions) {
      actions.push({
        service: service.name,
        slug: service.slug,
        priority: act.priority || highestPriority,
        action: act.text,
        reason: reasons.join(" • "),
        type: act.type,
        payload: act.payload
      });
    }

    if (reasons.length > 0) {
      worstServices.push({ slug: service.slug, name: service.name, score: serviceScore, reasons });
    }
  }

  worstServices.sort((a, b) => b.score - a.score);
  const priorityOrder = { urgent: 0, recommended: 1, optional: 2 };
  actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const rawAvgScore = services.length > 0 ? totalScore / services.length : 0;
  const avgScore = Math.round((rawAvgScore * 0.4) + (maxServiceScore * 0.6));

  let riskLevel: string;
  if (avgScore >= 80) riskLevel = t.t("critical");
  else if (avgScore >= 60) riskLevel = t.t("high");
  else if (avgScore >= 40) riskLevel = t.t("medium");
  else if (avgScore >= 20) riskLevel = t.t("low");
  else riskLevel = t.t("excellent");

  return {
    score: avgScore,
    riskLevel,
    totalTrackers: allTrackers.size,
    uniqueTrackers: allTrackers,
    breachCount: totalBreaches,
    sanctionCount: totalSanctions,
    outsideEUCount,
    worstServices: worstServices.slice(0, 5),
    actions: actions,
  };
}
