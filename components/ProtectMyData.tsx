"use client";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Shield } from "lucide-react";
import {
  PROTECT_DATA_SELECTION_KEY,
  getAlternatives,
  type Service,
  type ServiceDetails,
  type AnalysisResult,
  type SaveData
} from "@/constants/protectData";
import ProtectDataHero from "./protect-my-data/ProtectDataHero";
import ProtectDataNav from "./protect-my-data/ProtectDataNav";
import ProtectDataSelection from "./protect-my-data/ProtectDataSelection";
import ProtectDataAnalysis from "./protect-my-data/ProtectDataAnalysis";
import ProtectDataActions from "./protect-my-data/ProtectDataActions";
import ProtectDataSummary from "./protect-my-data/ProtectDataSummary";
import dict from "../i18n/ProtectMyData.json";
import Translator from "./tools/t";
import { useRiskData } from "@/hooks/useRiskData";
import { useServiceProgress } from "@/hooks/useServiceProgress";
import { EU_COUNTRIES } from "@/constants/euCountries";

interface Props {
  lang?: string;
  preselectedSlug?: string;
}

export default function ProtectMyData({ lang = "fr", preselectedSlug }: Props) {
  const t = useMemo(() => new Translator(dict, lang), [lang]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const serviceCardRef = useRef<HTMLDivElement>(null);

  // Core state
  const [services, setServices] = useState<Service[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [serviceDetails, setServiceDetails] = useState<Record<string, ServiceDetails>>({});
  const [step, setStep] = useState(1); // 1=Selection, 2=Analysis, 3=Actions, 4=Summary
  const [savedNotification, setSavedNotification] = useState(false);
  const [loadedNotification, setLoadedNotification] = useState(false);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [showDataMap, setShowDataMap] = useState(true);

  // Custom hooks for grouped functionality
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

  // Auto-save selection to localStorage when it changes
  useEffect(() => {
    if (services.length > 0) {
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
  }, [selectedSlugs, serviceProgress.completedServices, serviceProgress.skippedServices, serviceProgress.notes, serviceProgress.alternativesAdopted, serviceProgress.alternativesSkipped, serviceProgress.passwordsChanged, serviceProgress.dataExported, services.length]);

  // Filter services based on search
  const filteredServices = useMemo(() => {
    if (!searchQuery) return services;
    const query = searchQuery.toLowerCase();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.slug.toLowerCase().includes(query)
    );
  }, [services, searchQuery]);

  // Selected services list
  const selectedServices = useMemo(() => {
    return services.filter((s) => selectedSlugs.has(s.slug));
  }, [services, selectedSlugs]);

  // Services sorted by risk for deletion step
  const sortedServicesForDeletion = useMemo(() => {
    if (!analysisResult) return selectedServices;

    return [...selectedServices].sort((a, b) => {
      const scoreA = serviceDetails[a.slug]?.riskScore ?? 0;
      const scoreB = serviceDetails[b.slug]?.riskScore ?? 0;
      return scoreB - scoreA; // Higher score = higher risk = first
    });
  }, [selectedServices, serviceDetails, analysisResult]);

  // Services that actually need to be deleted (filtering out those with adopted alternatives)
  /*
  const servicesPendingDeletion = useMemo(() => {
    return sortedServicesForDeletion.filter(
      (s) => !serviceProgress.alternativesAdopted[s.slug] && !serviceProgress.alternativesSkipped.includes(s.slug)
    );
  }, [sortedServicesForDeletion, serviceProgress.alternativesAdopted, serviceProgress.alternativesSkipped]);
  */

  // Actions to process: one entry per service, grouped and sorted by priority.
  // The ProtectDataActions component handles sub-steps (alternative → export → delete) internally.
  const actionsToProcess = useMemo(() => {
    if (!analysisResult) return [];

    // Collect all unique service slugs that need attention, with their best priority
    const serviceMap = new Map<string, {
      slug: string;
      type: "find_alternative" | "change_password" | "export_data" | "delete_account";
      priority: "urgent" | "recommended" | "optional";
    }>();

    const priorityOrder = { urgent: 0, recommended: 1, optional: 2 };

    const upsert = (slug: string, type: "find_alternative" | "change_password" | "export_data" | "delete_account", priority: "urgent" | "recommended" | "optional") => {
      const existing = serviceMap.get(slug);
      if (!existing || priorityOrder[priority] < priorityOrder[existing.priority]) {
        serviceMap.set(slug, { slug, type, priority });
      }
    };

    // Add services from analysis result (problematic ones)
    for (const action of analysisResult.actions) {
      if (action.type === "find_alternative" || action.type === "change_password" || action.type === "delete_account") {
        upsert(action.slug, action.type, action.priority);
      }
    }

    // Add all selected services that aren't yet in the map (for deletion)
    for (const slug of selectedSlugs) {
      if (!serviceMap.has(slug)) {
        upsert(slug, "delete_account", "optional");
      }
    }

    const actions = Array.from(serviceMap.values());
    actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return actions;
  }, [analysisResult, selectedSlugs]);


  // Calculate detailed risk stats for the gauge
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
      gaugePercent: 0, // 0-100, higher = more risk
    };

    for (const slug of selectedSlugs) {
      const risk = quickRiskCache[slug];
      if (risk === "high") stats.highCount++;
      else if (risk === "medium") stats.mediumCount++;
      else if (risk === "low") stats.lowCount++;
      else stats.unknownCount++;

      const service = services.find(s => s.slug === slug);

      // Count specific issues
      if (breachData[slug] && breachData[slug].length > 0) {
        stats.breachCount++;
      }
      if (manualData[slug]?.sanctioned_by_cnil) {
        stats.cnilCount++;
      }
      if (service?.country_code && !EU_COUNTRIES.has(service.country_code.toLowerCase())) {
        stats.outsideEUCount++;
      }
      if (service && !service.url_delete && !service.contact_mail_delete) {
        stats.noDeletionMethodCount++;
      }
    }

    // Calculate gauge percentage (weighted)
    if (selectedSlugs.size > 0) {
      const maxRisk = selectedSlugs.size * 100;
      const actualRisk = (stats.highCount * 100) + (stats.mediumCount * 50) + (stats.lowCount * 10);
      stats.gaugePercent = Math.min(100, Math.round((actualRisk / maxRisk) * 100));
    }

    return stats;
  }, [selectedSlugs, quickRiskCache, breachData, manualData, services]);

  // Toggle service selection
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

  // Analyze when moving to step 2
  useEffect(() => {
    if (step === 2 && selectedSlugs.size > 0 && !analysisResult) {
      analyzeFootprint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Wrapper for setNotes to adapt to the component's expected signature
  // This bridges the gap between the standard React setState and our custom hook
  /*
  const setNotesWrapper = useCallback((updater: React.SetStateAction<Record<string, string>>) => {
    if (typeof updater === 'function') {
      const newNotes = updater(serviceProgress.notes);
      // Update each changed note individually
      Object.entries(newNotes).forEach(([slug, note]) => {
        if (note !== serviceProgress.notes[slug]) {
          serviceProgress.updateNote(slug, note);
        }
      });
    } else {
      // Direct value - update all notes
      Object.entries(updater).forEach(([slug, note]) => {
        serviceProgress.updateNote(slug, note);
      });
    }
  }, [serviceProgress]);
  */

  // Scroll to service card on index change
  useEffect(() => {
    if ((step === 3) && serviceCardRef.current) {
      serviceCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentServiceIndex, currentActionIndex, step]);


  // Go to analysis step
  const goToAnalysis = useCallback(() => {
    if (selectedSlugs.size > 0) {
      setAnalysisResult(null);
      setStep(2);
    }
  }, [selectedSlugs.size]);

  // Go to actions or deletion step based on whether there are actions to process
  const goToActions = useCallback(() => {
    setCurrentActionIndex(0);
    setCurrentServiceIndex(0);

    // Will be determined by actionsToProcess.length in the render
    if (actionsToProcess.length > 0) {
      setStep(3); // Go to actions
    } else {
      setStep(4); // Go directly to summary (all migrated)
    }
  }, [actionsToProcess.length]);

  // Handle Enter key to navigate between steps
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      if (event.key === "Enter") {
        if (step === 1 && selectedSlugs.size > 0) {
          goToAnalysis();
        } else if (step === 2 && analysisResult) {
          goToActions();
        } else if (step === 3 && actionsToProcess[currentActionIndex]) {
          // In actions step, pressing Enter should move to next action or to summary
          if (currentActionIndex < actionsToProcess.length - 1) {
            setCurrentActionIndex(currentActionIndex + 1);
          } else {
            setStep(4);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, selectedSlugs.size, analysisResult, currentServiceIndex, currentActionIndex, actionsToProcess, goToAnalysis, goToActions]);

  // Analyze when moving to step 2
  const saveToFile = useCallback(() => {
    const saveData: SaveData = {
      selectedServices: [...selectedSlugs],
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

    // Also save to localStorage
    localStorage.setItem(PROTECT_DATA_SELECTION_KEY, JSON.stringify(saveData));
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  }, [selectedSlugs, serviceProgress.completedServices, serviceProgress.skippedServices, serviceProgress.notes, serviceProgress.alternativesAdopted, serviceProgress.alternativesSkipped, serviceProgress.passwordsChanged, serviceProgress.dataExported]);

  // Load from file
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
            setTimeout(() => setLoadedNotification(false), 2000);
          }
        } catch (error) {
          console.error("Error loading file:", error);
          alert(t.t("fileLoadError"));
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [services, serviceProgress, t]);

  // Restart
  const restart = useCallback(() => {
    setStep(1);
    setSelectedSlugs(new Set());
    serviceProgress.reset();
    setCurrentServiceIndex(0);
    setAnalysisResult(null);
    setSearchQuery("");
  }, [serviceProgress]);

  // Reset all data
  const resetAllData = useCallback(() => {
    localStorage.removeItem(PROTECT_DATA_SELECTION_KEY);
    restart();
  }, [restart]);

  // Handle action click
  const handleActionClick = (action: AnalysisResult["actions"][0]) => {
    // Determine app base URL: prefer NEXT_PUBLIC_BASE_URL, fallback to window.location.origin
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/$/, "");

    if (action.type === "delete_account") {
      const service = services.find(s => s.slug === action.slug);
      if (service?.url_delete) {
        // if url_delete is absolute, open it directly
        window.open(service.url_delete, "_blank");
      } else {
        const deletePath = lang === 'fr' ? `supprimer-mes-donnees/${action.slug}` : `delete-my-data/${action.slug}`;
        const deleteUrl = baseUrl ? new URL(`/${deletePath}`, baseUrl).href : `/${deletePath}`;
        window.open(deleteUrl, "_blank");
      }
    } else if (action.type === "find_alternative") {
      const alternatives = action.payload?.alternatives || [];
      const comparerPath = lang === 'fr' ? `comparer` : `compare`;

      if (alternatives.length > 0) {
        const servicesParam = encodeURIComponent([action.slug, ...alternatives].slice(0, 3).join(","));
        const url = baseUrl ? new URL(`/${comparerPath}?services=${servicesParam}`, baseUrl).href : `/${comparerPath}?services=${servicesParam}`;
        window.open(url, "_blank");
      } else {
        // Fallback: try to find services with similar name or just open with this service
        const servicesParam = encodeURIComponent(action.slug);
        const url = baseUrl ? new URL(`/${comparerPath}?services=${servicesParam}`, baseUrl).href : `/${comparerPath}?services=${servicesParam}`;
        window.open(url, "_blank");
      }
    } else if (action.type === "change_password") {
      /*  const service = services.find(s => s.slug === action.slug);
        if (service?.url_delete) {
            window.open(service.url_delete, "_blank");
        } else {*/
      // Fallback
      alert(t.t("pleaseLogInChangePassword"));
      // }
    }
  };

  // Analyze footprint
  const analyzeFootprint = async () => {
    if (selectedSlugs.size === 0) return;

    setAnalyzing(true);

    const details: Record<string, ServiceDetails> = {};
    const allTrackers = new Set<number>();
    let totalBreaches = 0;
    let totalSanctions = 0;
    let outsideEUCount = 0;

    // Load details for each selected service
    for (const slug of selectedSlugs) {
      const service = services.find((s) => s.slug === slug);
      if (!service) continue;

      const serviceDetail: ServiceDetails = { riskScore: 0 };

      // Load Exodus data
      if (service.exodus) {
        try {
          const exodusPath =
            typeof service.exodus === "string"
              ? service.exodus
              : `/data/compare/${slug}.json`;
          const exodusRes = await fetch(exodusPath);
          if (exodusRes.ok) {
            const exodusData = await exodusRes.json();
            serviceDetail.trackers = exodusData.trackers || [];
            exodusData.trackers?.forEach((t: number) => allTrackers.add(t));
            const trackerPenalty = Math.min((exodusData.trackers?.length || 0) * 2.5, 30);
            serviceDetail.riskScore! += trackerPenalty;
          }
        } catch { }
      }

      // Load manual data for CNIL sanctions, EU transfer, and alternatives
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

      // Load breach data
      const breaches = breachData[slug];
      if (breaches && breaches.length > 0) {
        serviceDetail.breaches = breaches.length;
        totalBreaches += breaches.length;
        const breachPenalty = Math.min(breaches.length * 10, 40);
        serviceDetail.riskScore! += breachPenalty;
      }

      serviceDetail.riskScore = Math.min(100, serviceDetail.riskScore!);
      details[slug] = serviceDetail;
    }

    setServiceDetails(details);

    // Build manualAlternatives map
    const manualAlternativesMap: Record<string, string[]> = {};
    for (const s of selectedSlugs) {
      if (manualData[s]?.alternatives) {
        manualAlternativesMap[s] = manualData[s].alternatives!;
      }
    }

    // Calculate overall analysis
    const result = calculateAnalysis(
      selectedServices,
      details,
      allTrackers,
      totalBreaches,
      totalSanctions,
      outsideEUCount,
      lang,
      quickRiskScoreCache,
      manualAlternativesMap
    );

    setAnalysisResult(result);
    setAnalyzing(false);
  };

  // Score calculation
  const calculateAnalysis = (
    services: Service[],
    details: Record<string, ServiceDetails>,
    allTrackers: Set<number>,
    totalBreaches: number,
    totalSanctions: number,
    outsideEUCount: number,
    lang: string,
    quickRiskScoreCache: Record<string, number>,
    manualAlternativesMap: Record<string, string[]>
  ): AnalysisResult => {
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
      const serviceActions: Array<{ text: string, type: "delete_account" | "find_alternative" | "change_password" | "check_settings", payload?: any, priority?: "urgent" | "recommended" | "optional" }> = [];
      let highestPriority: "urgent" | "recommended" | "optional" = "optional";

      // Check if service is the best in its category
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
      if (trackerCount > 5) {
        reasons.push(`${trackerCount} ${t.t("trackerCountSuffix")}`);
      }

      if (detail.sanctionedByCnil) {
        reasons.push(t.t("sanctionedByCnilDetected"));
        highestPriority = "urgent";
      }

      if (detail.breaches && detail.breaches > 0) {
        reasons.push(`${detail.breaches} ${t.t("breachCountSuffix")}`);
        serviceActions.push({
          text: t.t("actionChangePassword"),
          type: "change_password",
          priority: "recommended"
        });
        if (highestPriority !== "urgent") highestPriority = "recommended";
      }

      // If there are reasons to act and it's not the best in category, suggest alternative
      if (reasons.length > 0 && !isBestInCategory && alternatives.length > 0) {
        serviceActions.push({
          text: t.t("actionFindAlternative"),
          type: "find_alternative",
          payload: { alternatives },
          priority: highestPriority === "urgent" ? "urgent" : "recommended"
        });
      }

      // If there are severe reasons, suggest deletion
      if (detail.sanctionedByCnil || trackerCount > 10) {
        serviceActions.push({
          text: t.t("actionDeleteAccount"),
          type: "delete_account",
          priority: "urgent"
        });
        highestPriority = "urgent";
      }

      // Add actions
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
        worstServices.push({
          slug: service.slug,
          name: service.name,
          score: serviceScore,
          reasons,
        });
      }
    }

    // Sort worst services by score (highest first)
    worstServices.sort((a, b) => b.score - a.score);

    // Sort actions by priority (urgent first, then recommended, then optional)
    const priorityOrder = { urgent: 0, recommended: 1, optional: 2 };
    actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Calculate average score
    // We weight the worst service heavily so that one very risky service impacts the global score significantly
    const rawAvgScore = services.length > 0 ? totalScore / services.length : 0;
    const avgScore = Math.round((rawAvgScore * 0.4) + (maxServiceScore * 0.6));

    // Determine risk level
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
      actions: actions, // Removed slice limit to show all relevant actions
    };
  };

  // Progress calculation for deletion step
  /*
  const progress = selectedSlugs.size > 0
    ? Math.round((serviceProgress.completedServices.length / selectedSlugs.size) * 100)
    : 0;

  // Current service for deletion
  const currentService = servicesPendingDeletion[currentServiceIndex];
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-primary-600 font-medium flex items-center gap-3">
          <Shield className="animate-pulse" />
          <span>{t.t("loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-12">
        <ProtectDataHero
          lang={lang}
          savedNotification={savedNotification}
          loadedNotification={loadedNotification}
          saveToFile={saveToFile}
          loadFromFile={loadFromFile}
          fileInputRef={fileInputRef}
          resetAllData={resetAllData}
        />

        <ProtectDataNav
          step={step}
          setStep={setStep}
          selectedSlugsSize={selectedSlugs.size}
          hasAnalysisResult={!!analysisResult}
          hasActions={actionsToProcess.length > 0}
          goToAnalysis={goToAnalysis}
          goToActions={goToActions}
          lang={lang}
        />

        {step === 1 && (
          <ProtectDataSelection
            lang={lang}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSlugs={selectedSlugs}
            riskStats={riskStats}
            filteredServices={filteredServices}
            toggleService={toggleService}
            quickRiskCache={quickRiskCache}
            goToAnalysis={goToAnalysis}
          />
        )}

        {step === 2 && (
          <ProtectDataAnalysis
            lang={lang}
            analyzing={analyzing}
            analysisResult={analysisResult}
            selectedSlugsSize={selectedSlugs.size}
            setStep={setStep}
            selectedServices={selectedServices}
            showDataMap={showDataMap}
            setShowDataMap={setShowDataMap}
            goToActions={goToActions}
            actionsCount={actionsToProcess.length}
            handleActionClick={handleActionClick}
          />
        )}

        {step === 3 && actionsToProcess.length > 0 && (
          <ProtectDataActions
            lang={lang}
            services={services}
            setStep={setStep}
            currentActionIndex={currentActionIndex}
            setCurrentActionIndex={setCurrentActionIndex}
            actionsToProcess={actionsToProcess}
            alternativesAdopted={serviceProgress.alternativesAdopted}
            alternativesSkipped={serviceProgress.alternativesSkipped}
            markAlternativeAdopted={serviceProgress.markAlternativeAdopted}
            markAlternativeSkipped={serviceProgress.markAlternativeSkipped}
            passwordsChanged={serviceProgress.passwordsChanged}
            markPasswordChanged={serviceProgress.markPasswordChanged}
            dataExported={serviceProgress.dataExported}
            markDataExported={serviceProgress.markDataExported}
            // completedServices={serviceProgress.completedServices}
            markAsCompleted={serviceProgress.markAsCompleted}
            cardRef={serviceCardRef}
          />
        )}

        {step === 4 && (
          <ProtectDataSummary
            lang={lang}
            completedServicesLength={serviceProgress.completedServices.length}
            selectedSlugsSize={selectedSlugs.size}
            sortedServices={sortedServicesForDeletion}
            serviceDetails={serviceDetails}
            completedServices={serviceProgress.completedServices}
            skippedServices={serviceProgress.skippedServices}
            alternativesSkipped={serviceProgress.alternativesSkipped}
            notes={serviceProgress.notes}
            setCurrentServiceIndex={setCurrentServiceIndex}
            setStep={setStep}
            saveToFile={saveToFile}
            restart={resetAllData}
            alternativesAdopted={serviceProgress.alternativesAdopted}
            onResume={(slug) => {
              // Resume logic needs update since we don't have step 4 anymore
              // Find index of action for this slug
              const idx = actionsToProcess.findIndex(a => a.slug === slug);
              if (idx !== -1) {
                setCurrentActionIndex(idx);
                setStep(3);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
