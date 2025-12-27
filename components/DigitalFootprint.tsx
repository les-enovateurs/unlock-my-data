"use client";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Shield,
  ShieldAlert,
  Eye,
  Trash2,
  AlertTriangle,
  Zap,
  Globe,
  Server,
  ArrowRight,
} from "lucide-react";

// File format compatible with deletion tool
interface SaveData {
  selectedServices: string[];
  completedServices?: string[];
  skippedServices?: string[];
  notes?: { [key: string]: string };
  timestamp: string;
}

// Translations
const translations: Record<string, Record<string, string>> = {
  fr: {
    title: "Évaluer mes risques",
    subtitle: "Analysez votre exposition aux risques de confidentialité",
    searchPlaceholder: "Rechercher un service...",
    selectedServices: "Services sélectionnés",
    noServicesSelected: "Aucun service sélectionné",
    addServices: "Ajoutez des services pour commencer l'analyse",
    analyze: "Analyser mes risques",
    yourScore: "Votre score de confidentialité",
    riskLevel: "Niveau de risque",
    critical: "Critique",
    high: "Élevé",
    medium: "Moyen",
    low: "Faible",
    excellent: "Excellent",
    trackers: "Traqueurs actifs",
    dataBreaches: "Fuites de données",
    cnilSanctions: "Sanctions CNIL",
    outsideEU: "Transferts hors UE",
    actionPlan: "Plan d'action personnalisé",
    priority: "Priorité",
    urgent: "Urgent",
    recommended: "Recommandé",
    optional: "Optionnel",
    deleteAccount: "Supprimer ce compte",
    deleteAllAccounts: "Supprimer tous ces comptes",
    findAlternative: "Trouver une alternative",
    checkBreaches: "Vérifier les fuites",
    worstServices: "Services les plus risqués",
    stats: "Statistiques détaillées",
    calculating: "Calcul en cours...",
    servicesAnalyzed: "services analysés",
    averageRating: "Note moyenne ToSDR",
    totalTrackers: "Traqueurs uniques",
    saveSelection: "💾 Sauvegarder",
    loadSelection: "📂 Charger",
    selectionSaved: "Sélection sauvegardée !",
    clearAll: "Tout effacer",
    categories: "Catégories",
    all: "Tous",
    bulkDeleteInfo: "Supprimez tous vos comptes sélectionnés en une seule fois",
    fileLoaded: "Fichier chargé !",
    fileLoadError: "Erreur lors du chargement",
    stepSelection: "Sélection",
    stepResults: "Résultats",
    continueToResults: "Voir les résultats",
    backToSelection: "← Retour à la sélection",
    selectServicesTitle: "📋 Sélectionnez les services que vous utilisez",
    selectServicesDesc: "Cochez tous les services pour lesquels vous avez un compte actif.",
  },
  en: {
    title: "Evaluate my risks",
    subtitle: "Analyze your privacy risk exposure",
    searchPlaceholder: "Search for a service...",
    selectedServices: "Selected services",
    noServicesSelected: "No services selected",
    addServices: "Add services to start the analysis",
    analyze: "Analyze my risks",
    yourScore: "Your privacy score",
    riskLevel: "Risk level",
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
    excellent: "Excellent",
    trackers: "Active trackers",
    dataBreaches: "Data breaches",
    cnilSanctions: "CNIL sanctions",
    outsideEU: "Transfers outside EU",
    actionPlan: "Personalized action plan",
    priority: "Priority",
    urgent: "Urgent",
    recommended: "Recommended",
    optional: "Optional",
    deleteAccount: "Delete this account",
    deleteAllAccounts: "Delete all these accounts",
    findAlternative: "Find an alternative",
    checkBreaches: "Check breaches",
    worstServices: "Riskiest services",
    stats: "Detailed statistics",
    calculating: "Calculating...",
    servicesAnalyzed: "services analyzed",
    averageRating: "Average ToSDR rating",
    totalTrackers: "Unique trackers",
    saveSelection: "💾 Save",
    loadSelection: "📂 Load",
    selectionSaved: "Selection saved!",
    clearAll: "Clear all",
    categories: "Categories",
    all: "All",
    bulkDeleteInfo: "Delete all your selected accounts at once",
    fileLoaded: "File loaded!",
    fileLoadError: "Error loading file",
    stepSelection: "Selection",
    stepResults: "Results",
    continueToResults: "View results",
    backToSelection: "← Back to selection",
    selectServicesTitle: "📋 Select the services you use",
    selectServicesDesc: "Check all services for which you have an active account.",
  },
};

function t(lang: string, key: string) {
  return translations[lang]?.[key] || translations["fr"][key] || key;
}

interface Service {
  slug: string;
  name: string;
  logo: string;
  nationality?: string;
  country_code?: string;
  tosdr?: boolean | string;
  exodus?: boolean | string;
}

interface ServiceDetails {
  tosdrRating?: string;
  trackers?: number[];
  sanctionedByCnil?: boolean;
  outsideEU?: boolean;
  breaches?: number;
}

interface AnalysisResult {
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
  }>;
}

export const RISK_SELECTION_KEY = "risk-analysis-selection";

export default function DigitalFootprint({ lang = "fr" }: { lang?: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [serviceDetails, setServiceDetails] = useState<Record<string, ServiceDetails>>({});
  const [step, setStep] = useState(1); // 1 = Selection, 2 = Results
  const [savedNotification, setSavedNotification] = useState(false);
  const [loadedNotification, setLoadedNotification] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("actions");

  // Load services
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/services.json");
        const data = await response.json();
        setServices(data);

        // Load saved selection from localStorage
        const saved = localStorage.getItem(RISK_SELECTION_KEY);
        if (saved) {
          setSelectedSlugs(new Set(JSON.parse(saved)));
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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

  // Toggle service selection
  const toggleService = (slug: string) => {
    setSelectedSlugs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };

  // Analyze when moving to step 2
  useEffect(() => {
    if (step === 2 && selectedSlugs.size > 0 && !analysisResult) {
      analyzeFootprint();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Go to results step
  const goToResults = () => {
    if (selectedSlugs.size > 0) {
      setAnalysisResult(null); // Reset to force re-analysis
      setStep(2);
    }
  };

  // Save selection to localStorage
  const saveSelection = () => {
    localStorage.setItem(RISK_SELECTION_KEY, JSON.stringify([...selectedSlugs]));
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  // Save to file (compatible with deletion tool format)
  const saveToFile = () => {
    const saveData: SaveData = {
      selectedServices: [...selectedSlugs],
      timestamp: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(saveData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analyse-risques-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Load from file
  const loadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            setLoadedNotification(true);
            setTimeout(() => setLoadedNotification(false), 2000);
          }
        } catch (error) {
          console.error("Error loading file:", error);
          alert(t(lang, "fileLoadError"));
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Clear all
  const clearAll = () => {
    setSelectedSlugs(new Set());
    setStep(1);
    setAnalysisResult(null);
  };

  // Navigate to bulk delete
  const goToBulkDelete = () => {
    // Save selection first
    localStorage.setItem(RISK_SELECTION_KEY, JSON.stringify([...selectedSlugs]));
    // Navigate to deletion tool with flag
    const basePath = lang === "fr" ? "/supprimer-mes-donnees" : "/delete-my-data";
    router.push(`${basePath}?from=risks&bulk=true`);
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

      const serviceDetail: ServiceDetails = {};

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
          if (manualData.sanctioned_by_cnil) totalSanctions++;
          if (manualData.outside_eu_storage) outsideEUCount++;
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
          }
        }
      } catch {}

      details[slug] = serviceDetail;
    }

    setServiceDetails(details);

    // Calculate score and generate analysis
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
    let totalScore = 100;
    const worstServices: AnalysisResult["worstServices"] = [];
    const actions: AnalysisResult["actions"] = [];

    const ratingPenalty: Record<string, number> = {
      A: 0,
      B: 5,
      C: 10,
      D: 20,
      E: 35,
    };

    for (const service of services) {
      const detail = details[service.slug] || {};
      let serviceScore = 100;
      const reasons: string[] = [];

      // ToSDR rating penalty
      if (detail.tosdrRating) {
        const penalty = ratingPenalty[detail.tosdrRating] || 0;
        serviceScore -= penalty;
        totalScore -= penalty / services.length;
        if (detail.tosdrRating === "E") {
          reasons.push(lang === "fr" ? "CGU très problématiques (E)" : "Very problematic ToS (E)");
          actions.push({
            service: service.name,
            slug: service.slug,
            priority: "urgent",
            action: lang === "fr" ? "Supprimer ce compte" : "Delete this account",
            reason: lang === "fr" ? "Conditions d'utilisation classées E" : "Terms of service rated E",
          });
        } else if (detail.tosdrRating === "D") {
          reasons.push(lang === "fr" ? "CGU problématiques (D)" : "Problematic ToS (D)");
        }
      }

      // Tracker penalty
      const trackerCount = detail.trackers?.length || 0;
      if (trackerCount > 0) {
        const trackerPenalty = Math.min(trackerCount * 2, 20);
        serviceScore -= trackerPenalty;
        totalScore -= trackerPenalty / services.length;
        if (trackerCount > 5) {
          reasons.push(
            lang === "fr" ? `${trackerCount} traqueurs` : `${trackerCount} trackers`
          );
        }
      }

      // CNIL sanction penalty
      if (detail.sanctionedByCnil) {
        serviceScore -= 25;
        totalScore -= 25 / services.length;
        reasons.push(lang === "fr" ? "Sanctionné par la CNIL" : "Sanctioned by CNIL");
        actions.push({
          service: service.name,
          slug: service.slug,
          priority: "urgent",
          action: lang === "fr" ? "Envisager une alternative" : "Consider an alternative",
          reason: lang === "fr" ? "Service sanctionné par la CNIL" : "Service sanctioned by CNIL",
        });
      }

      // Breach penalty
      if (detail.breaches && detail.breaches > 0) {
        const breachPenalty = Math.min(detail.breaches * 10, 30);
        serviceScore -= breachPenalty;
        totalScore -= breachPenalty / services.length;
        reasons.push(
          lang === "fr"
            ? `${detail.breaches} fuite(s) de données`
            : `${detail.breaches} data breach(es)`
        );
        actions.push({
          service: service.name,
          slug: service.slug,
          priority: "recommended",
          action: lang === "fr" ? "Changer de mot de passe" : "Change password",
          reason:
            lang === "fr"
              ? "Données potentiellement compromises"
              : "Data potentially compromised",
        });
      }

      // Outside EU penalty
      if (detail.outsideEU) {
        serviceScore -= 5;
        totalScore -= 5 / services.length;
      }

      if (reasons.length > 0) {
        worstServices.push({
          slug: service.slug,
          name: service.name,
          score: Math.max(0, serviceScore),
          reasons,
        });
      }
    }

    // Sort worst services
    worstServices.sort((a, b) => a.score - b.score);

    // Add general recommendations
    if (outsideEUCount > services.length / 2) {
      actions.push({
        service: "Général",
        slug: "",
        priority: "optional",
        action:
          lang === "fr"
            ? "Privilégier les services européens"
            : "Prefer European services",
        reason:
          lang === "fr"
            ? "Majorité de vos services transfèrent vos données hors UE"
            : "Most of your services transfer data outside EU",
      });
    }

    // Determine risk level
    const finalScore = Math.max(0, Math.min(100, Math.round(totalScore)));
    let riskLevel: string;
    if (finalScore < 20) riskLevel = t(lang, "critical");
    else if (finalScore < 40) riskLevel = t(lang, "high");
    else if (finalScore < 60) riskLevel = t(lang, "medium");
    else if (finalScore < 80) riskLevel = t(lang, "low");
    else riskLevel = t(lang, "excellent");

    return {
      score: finalScore,
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

  // Get score color
  const getScoreColor = (score: number) => {
    if (score < 20) return "text-red-600";
    if (score < 40) return "text-orange-600";
    if (score < 60) return "text-yellow-600";
    if (score < 80) return "text-blue-600";
    return "text-green-600";
  };

  const getScoreBg = (score: number) => {
    if (score < 20) return "from-red-500 to-red-600";
    if (score < 40) return "from-orange-500 to-orange-600";
    if (score < 60) return "from-yellow-500 to-yellow-600";
    if (score < 80) return "from-blue-500 to-blue-600";
    return "from-green-500 to-green-600";
  };

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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">{t(lang, "title")}</h1>
          <p className="text-xl max-w-3xl mx-auto mb-6">
            {t(lang, "subtitle")}
          </p>

          <div className="flex justify-center gap-4">
            {savedNotification && (
              <span className="text-green-600 text-sm animate-pulse">
                {t(lang, "selectionSaved")}
              </span>
            )}
            {loadedNotification && (
              <span className="text-blue-600 text-sm animate-pulse">
                {t(lang, "fileLoaded")}
              </span>
            )}
            <button
              onClick={saveToFile}
              className="btn btn-outline gap-2"
              title={t(lang, "saveSelection")}
            >
              {t(lang, "saveSelection")}
            </button>
            <label
              className="btn btn-outline gap-2 cursor-pointer"
              title={t(lang, "loadSelection")}
            >
              {t(lang, "loadSelection")}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={loadFromFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Step Navigator */}
        <nav className="bg-base-100 border border-base-300 rounded-box shadow-sm mb-8">
          <div className="px-4 py-4">
            <ul className="steps steps-horizontal w-full">
              <li
                className={`step ${step >= 1 ? "step-primary" : ""} cursor-pointer`}
                onClick={() => setStep(1)}
                role="button"
                tabIndex={0}
              >
                {t(lang, "stepSelection")}
              </li>
              <li
                className={`step ${step >= 2 ? "step-primary" : ""} ${selectedSlugs.size > 0 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                onClick={() => selectedSlugs.size > 0 && goToResults()}
                role="button"
                tabIndex={selectedSlugs.size > 0 ? 0 : -1}
              >
                {t(lang, "stepResults")}
              </li>
            </ul>
          </div>
        </nav>

        {/* Step 1: Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl">
                  {t(lang, "selectServicesTitle")}
                </h2>
                <p className="text-base-content/70">
                  {t(lang, "selectServicesDesc")}
                </p>

                {/* Search */}
                <div className="form-control mt-4">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      className="px-5 py-3 pl-12 bg-white rounded-xl border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 w-full"
                      placeholder={t(lang, "searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {selectedSlugs.size > 0 && (
                  <div className="alert alert-info mt-4">
                    <span>✓ {selectedSlugs.size} {selectedSlugs.size > 1 ? (lang === "fr" ? "services sélectionnés" : "services selected") : (lang === "fr" ? "service sélectionné" : "service selected")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => {
                const isSelected = selectedSlugs.has(service.slug);
                return (
                  <div
                    key={service.slug}
                    className={`card shadow-lg bg-white hover:shadow-xl cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}
                    onClick={() => toggleService(service.slug)}
                  >
                    <div className="card-body p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="checkbox checkbox-success text-white mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="relative w-24 h-12">
                              {service.logo ? (
                                <Image
                                  fill
                                  src={service.logo}
                                  alt={service.name}
                                  className="object-contain"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                                  <Globe className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                              {service.nationality || "International"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Sticky Continue Button - only on step 1 */}
        {step === 1 && selectedSlugs.size > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <button
              className="btn btn-primary btn-lg shadow-2xl gap-2"
              onClick={goToResults}
            >
              {t(lang, "continueToResults")} ({selectedSlugs.size})
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Results */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Back button */}
            <button
              onClick={() => setStep(1)}
              className="btn btn-ghost gap-2"
            >
              {t(lang, "backToSelection")}
            </button>

            {analyzing ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center py-16">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <h2 className="card-title">{t(lang, "calculating")}</h2>
                  <p className="text-base-content/70">{selectedSlugs.size} {t(lang, "servicesAnalyzed")}</p>
                </div>
              </div>
            ) : analysisResult ? (
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Score & Stats */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Score Card */}
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body text-center">
                      <h3 className="text-sm text-base-content/70 mb-4">
                        {t(lang, "yourScore")}
                      </h3>
                      <div className="flex items-center justify-center mb-4">
                        <div className={`text-7xl font-bold ${getScoreColor(analysisResult.score)}`}>
                          {analysisResult.score}
                        </div>
                        <span className="text-2xl text-base-content/50 ml-1">/100</span>
                      </div>
                      <div className={`py-2 px-4 rounded-lg bg-gradient-to-r ${getScoreBg(analysisResult.score)}`}>
                        <span className="font-bold text-white">
                          {t(lang, "riskLevel")}: {analysisResult.riskLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="card bg-base-100 shadow-sm">
                      <div className="card-body p-4">
                        <Eye className="w-5 h-5 text-orange-500 mb-2" />
                        <div className="text-2xl font-bold">{analysisResult.totalTrackers}</div>
                        <div className="text-xs text-base-content/70">{t(lang, "trackers")}</div>
                      </div>
                    </div>
                    <div className="card bg-base-100 shadow-sm">
                      <div className="card-body p-4">
                        <AlertTriangle className="w-5 h-5 text-red-500 mb-2" />
                        <div className="text-2xl font-bold">{analysisResult.breachCount}</div>
                        <div className="text-xs text-base-content/70">{t(lang, "dataBreaches")}</div>
                      </div>
                    </div>
                    <div className="card bg-base-100 shadow-sm">
                      <div className="card-body p-4">
                        <ShieldAlert className="w-5 h-5 text-yellow-500 mb-2" />
                        <div className="text-2xl font-bold">{analysisResult.sanctionCount}</div>
                        <div className="text-xs text-base-content/70">{t(lang, "cnilSanctions")}</div>
                      </div>
                    </div>
                    <div className="card bg-base-100 shadow-sm">
                      <div className="card-body p-4">
                        <Server className="w-5 h-5 text-blue-500 mb-2" />
                        <div className="text-2xl font-bold">{analysisResult.outsideEUCount}</div>
                        <div className="text-xs text-base-content/70">{t(lang, "outsideEU")}</div>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Delete Button */}
                  <button
                    onClick={goToBulkDelete}
                    className="btn btn-error btn-block gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    {t(lang, "deleteAllAccounts")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Worst Services */}
                  {analysisResult.worstServices.length > 0 && (
                    <div className="card bg-base-100 shadow-xl">
                      <div className="card-body">
                        <h3 className="card-title text-lg gap-2">
                          <ShieldAlert className="w-5 h-5 text-red-500" />
                          {t(lang, "worstServices")}
                        </h3>
                        <div className="space-y-3 mt-4">
                          {analysisResult.worstServices.map((service) => (
                            <div
                              key={service.slug}
                              className="flex items-center justify-between p-4 bg-base-200 rounded-lg"
                            >
                              <div>
                                <div className="font-medium">{service.name}</div>
                                <div className="text-sm text-base-content/70">
                                  {service.reasons.join(" • ")}
                                </div>
                              </div>
                              <div className={`text-2xl font-bold ${getScoreColor(service.score)}`}>
                                {service.score}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Plan */}
                  {analysisResult.actions.length > 0 && (
                    <div className="card bg-base-100 shadow-xl">
                      <div className="card-body">
                        <h3 className="card-title text-lg gap-2">
                          <Zap className="w-5 h-5 text-green-500" />
                          {t(lang, "actionPlan")}
                        </h3>
                        <div className="space-y-3 mt-4">
                          {analysisResult.actions.map((action, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-base-200 rounded-lg border-l-4"
                              style={{
                                borderLeftColor:
                                  action.priority === "urgent"
                                    ? "#ef4444"
                                    : action.priority === "recommended"
                                    ? "#f59e0b"
                                    : "#9ca3af",
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{action.service}</span>
                                <span
                                  className={`badge ${
                                    action.priority === "urgent"
                                      ? "badge-error"
                                      : action.priority === "recommended"
                                      ? "badge-warning"
                                      : "badge-ghost"
                                  }`}
                                >
                                  {t(lang, action.priority)}
                                </span>
                              </div>
                              <div className="text-sm text-success font-medium mb-1">
                                → {action.action}
                              </div>
                              <div className="text-sm text-base-content/70">
                                {action.reason}
                              </div>
                              {action.slug && (
                                <div className="mt-3 flex gap-2">
                                  <Link
                                    href={`/${lang === "fr" ? "supprimer-mes-donnees" : "delete-my-data"}/${action.slug}`}
                                    className="btn btn-error btn-sm gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    {t(lang, "deleteAccount")}
                                  </Link>
                                  <Link
                                    href={`/${lang === "fr" ? "comparer" : "compare"}?services=${action.slug}`}
                                    className="btn btn-info btn-sm"
                                  >
                                    {t(lang, "findAlternative")}
                                  </Link>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
