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
import ProtectDataDeletion from "./protect-my-data/ProtectDataDeletion";
import ProtectDataSummary from "./protect-my-data/ProtectDataSummary";
import dict from "../i18n/ProtectMyData.json";
import Translator from "./tools/t";
import { useRiskData } from "@/hooks/useRiskData";
import { useServiceProgress } from "@/hooks/useServiceProgress";
import { EU_COUNTRIES } from "@/constants/euCountries";
import { getEmailTemplate } from "@/constants/emailTemplates";

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
  const [step, setStep] = useState(1); // 1=Selection, 2=Analysis, 3=Deletion, 4=Summary
  const [savedNotification, setSavedNotification] = useState(false);
  const [loadedNotification, setLoadedNotification] = useState(false);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [showDataMap, setShowDataMap] = useState(true);

  // Custom hooks for grouped functionality
  const serviceProgress = useServiceProgress();
  const { quickRiskCache, breachData, manualData } = useRiskData(services);

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
          } catch {}
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

  // Email template state (computed from current service)
  const emailTemplate = useMemo(() => {
    const currentService = sortedServicesForDeletion[currentServiceIndex];
    if (!currentService) return { subject: "", body: "" };
    return getEmailTemplate(lang, currentService.name);
  }, [currentServiceIndex, sortedServicesForDeletion, lang]);

  // Wrapper for setNotes to adapt to the component's expected signature
  // This bridges the gap between the standard React setState and our custom hook
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

  // Scroll to service card on index change
  useEffect(() => {
    if (step === 3 && serviceCardRef.current) {
      serviceCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentServiceIndex, step]);

  // Go to analysis step
  const goToAnalysis = useCallback(() => {
    if (selectedSlugs.size > 0) {
      setAnalysisResult(null);
      setStep(2);
    }
  }, [selectedSlugs.size]);

  // Go to deletion step
  const goToDeletion = useCallback(() => {
    setCurrentServiceIndex(0);
    setStep(3);
  }, []);

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
          goToDeletion();
        } else if (step === 3 && sortedServicesForDeletion[currentServiceIndex]) {
          const currentSlug = sortedServicesForDeletion[currentServiceIndex].slug;
          serviceProgress.markAsCompleted(currentSlug);
          if (currentServiceIndex < sortedServicesForDeletion.length - 1) {
            setCurrentServiceIndex(currentServiceIndex + 1);
          } else {
            setStep(4);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, selectedSlugs.size, analysisResult, currentServiceIndex, sortedServicesForDeletion, serviceProgress, goToAnalysis, goToDeletion]);

  // Analyze when moving to step 2
  const saveToFile = useCallback(() => {
    const saveData: SaveData = {
      selectedServices: [...selectedSlugs],
      completedServices: serviceProgress.completedServices,
      skippedServices: serviceProgress.skippedServices,
      notes: serviceProgress.notes,
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
  }, [selectedSlugs, serviceProgress.completedServices, serviceProgress.skippedServices, serviceProgress.notes]);

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
             alert(lang === "fr" ? "Veuillez vous connecter sur le site du service pour changer votre mot de passe." : "Please log in to the service website to change your password.");
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

    const ratingPenalty: Record<string, number> = {
      A: 0,
      B: 5,
      C: 15,
      D: 30,
      E: 50,
    };

    // Load details for each selected service
    for (const slug of selectedSlugs) {
      const service = services.find((s) => s.slug === slug);
      if (!service) continue;

      const serviceDetail: ServiceDetails = { riskScore: 0 };

      // Load ToSDR data
      if (service.tosdr) {
        try {
          const tosdrPath =
            typeof service.tosdr === "string"
              ? service.tosdr
              : `/data/compare/tosdr/${slug}.json`;
          const tosdrRes = await fetch(tosdrPath);
          if (tosdrRes.ok) {
            const tosdrData = await tosdrRes.json();
            serviceDetail.tosdrRating = tosdrData.rating;
            serviceDetail.riskScore! += ratingPenalty[tosdrData.rating] || 0;
          }
        } catch {}
      }

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
        } catch {}
      }

      // Load manual data for CNIL sanctions and EU transfer
      try {
        const manualRes = await fetch(`/data/manual/${slug}.json`);
        if (manualRes.ok) {
          const manualData = await manualRes.json();
          serviceDetail.sanctionedByCnil = manualData.sanctioned_by_cnil;
          serviceDetail.outsideEU = manualData.outside_eu_storage;
          if (manualData.sanctioned_by_cnil) {
            totalSanctions++;
            serviceDetail.riskScore! += 30;
          }
          if (manualData.outside_eu_storage) {
            outsideEUCount++;
            serviceDetail.riskScore! += 10;
          }
        }
      } catch {}

      // Load breach data
      try {
        const breachRes = await fetch("/data/compare/breach-mapping.json");
        if (breachRes.ok) {
          const breachData = await breachRes.json();
          if (breachData[slug]) {
            serviceDetail.breaches = breachData[slug].length;
            totalBreaches += breachData[slug].length;
            const breachPenalty = Math.min(breachData[slug].length * 10, 40);
            serviceDetail.riskScore! += breachPenalty;
          }
        }
      } catch {}

      serviceDetail.riskScore = Math.min(100, serviceDetail.riskScore!);
      details[slug] = serviceDetail;
    }

    setServiceDetails(details);

    // Calculate overall analysis
    const result = calculateAnalysis(
      selectedServices,
      details,
      allTrackers,
      totalBreaches,
      totalSanctions,
      outsideEUCount,
      lang
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
    lang: string
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

      if (detail.tosdrRating === "E") {
        reasons.push(lang === "fr" ? "CGU très problématiques (E)" : "Very problematic ToS (E)");
        serviceActions.push({
            text: lang === "fr" ? "Supprimer ce compte" : "Delete this account",
            type: "delete_account",
            priority: "urgent"
        });
        highestPriority = "urgent";
      } else if (detail.tosdrRating === "D") {
        reasons.push(lang === "fr" ? "CGU problématiques (D)" : "Problematic ToS (D)");
        highestPriority = "recommended";
      }

      const trackerCount = detail.trackers?.length || 0;
      if (trackerCount > 5) {
        reasons.push(lang === "fr" ? `${trackerCount} traqueurs` : `${trackerCount} trackers`);
      }

      if (detail.sanctionedByCnil) {
        reasons.push(lang === "fr" ? "Sanctionné par la CNIL" : "Sanctioned by CNIL");
        const alternatives = getAlternatives(service.slug);
        serviceActions.push({
            text: lang === "fr" ? "Trouver une alternative" : "Find an alternative",
            type: "find_alternative",
            payload: { alternatives },
            priority: "urgent"
        });
        highestPriority = "urgent";
      }

      if (detail.breaches && detail.breaches > 0) {
        reasons.push(
          lang === "fr"
            ? `${detail.breaches} fuite(s) de données`
            : `${detail.breaches} data breach(es)`
        );
        serviceActions.push({
            text: lang === "fr" ? "Changer de mot de passe" : "Change password",
            type: "change_password",
            priority: "recommended"
        });
        if (highestPriority !== "urgent") highestPriority = "recommended";
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
      actions: actions.slice(0, 10),
    };
  };

  // Progress calculation for deletion step
  const progress = selectedSlugs.size > 0
    ? Math.round((serviceProgress.completedServices.length / selectedSlugs.size) * 100)
    : 0;

  // Current service for deletion
  const currentService = sortedServicesForDeletion[currentServiceIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-primary-600 font-medium flex items-center gap-3">
          <Shield className="animate-pulse" />
          <span>{lang === "fr" ? "Chargement..." : "Loading..."}</span>
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
        />

        <ProtectDataNav
          step={step}
          setStep={setStep}
          selectedSlugsSize={selectedSlugs.size}
          hasAnalysisResult={!!analysisResult}
          goToAnalysis={goToAnalysis}
          goToDeletion={goToDeletion}
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
            goToDeletion={goToDeletion}
            handleActionClick={handleActionClick}
          />
        )}

        {step === 3 && currentService && (
          <ProtectDataDeletion
            lang={lang}
            currentService={currentService}
            setStep={setStep}
            progress={progress}
            completedServices={serviceProgress.completedServices}
            selectedSlugsSize={selectedSlugs.size}
            cardRef={serviceCardRef}
            serviceDetails={serviceDetails}
            skippedServices={serviceProgress.skippedServices}
            emailSubject={emailTemplate.subject}
            setEmailSubject={() => {}} // Controlled by emailTemplate now
            emailBody={emailTemplate.body}
            setEmailBody={() => {}} // Controlled by emailTemplate now
            notes={serviceProgress.notes}
            setNotes={setNotesWrapper}
            currentServiceIndex={currentServiceIndex}
            setCurrentServiceIndex={setCurrentServiceIndex}
            sortedServicesLength={sortedServicesForDeletion.length}
            sortedServices={sortedServicesForDeletion}
            markAsSkipped={serviceProgress.markAsSkipped}
            markAsCompleted={serviceProgress.markAsCompleted}
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
            notes={serviceProgress.notes}
            setCurrentServiceIndex={setCurrentServiceIndex}
            setStep={setStep}
            saveToFile={saveToFile}
            restart={restart}
          />
        )}
      </div>
    </div>
  );
}
