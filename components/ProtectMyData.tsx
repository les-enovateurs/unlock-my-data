"use client";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ChevronLeft,
  Map,
} from "lucide-react";
import DataTransferMap from "./DataTransferMap";

// Storage key for selection persistence
export const PROTECT_DATA_SELECTION_KEY = "protect-data-selection";

// Translations
const translations: Record<string, Record<string, string>> = {
  fr: {
    title: "Protéger mes données",
    subtitle: "Analysez vos risques et supprimez vos données personnelles",
    searchPlaceholder: "Rechercher un service...",
    selectedServices: "Services sélectionnés",
    noServicesSelected: "Aucun service sélectionné",
    addServices: "Ajoutez des services pour commencer l'analyse",
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
    urgent: "Important",
    recommended: "Recommandé",
    optional: "Optionnel",
    deleteAccount: "Supprimer ce compte",
    findAlternative: "Trouver une alternative",
    worstServices: "Services les plus risqués",
    stats: "Statistiques détaillées",
    calculating: "Calcul en cours...",
    servicesAnalyzed: "services analysés",
    averageRating: "Note moyenne ToSDR",
    totalTrackers: "Traqueurs uniques",
    saveSelection: "Sauvegarder",
    loadSelection: "Charger",
    selectionSaved: "Sélection sauvegardée !",
    clearAll: "Tout effacer",
    fileLoaded: "Fichier chargé !",
    fileLoadError: "Erreur lors du chargement",
    stepSelection: "Sélection",
    stepAnalysis: "Analyse",
    stepDeletion: "Suppression",
    stepSummary: "Récapitulatif",
    continueToAnalysis: "Analyser mes risques",
    continueToDelete: "Supprimer mes données",
    backToSelection: "Retour à la sélection",
    backToAnalysis: "Retour à l'analyse",
    selectServicesTitle: "Sélectionnez les services que vous utilisez",
    selectServicesDesc: "Cochez tous les services pour lesquels vous avez un compte actif.",
    riskIndicator: "Indicateur de risque",
    highRisk: "Risque élevé",
    mediumRisk: "Risque moyen",
    lowRisk: "Risque faible",
    unknownRisk: "Non évalué",
    atRiskServices: "services à risque",
    deletionWarningTitle: "La suppression de vos données est définitive et irréversible.",
    noInfo: "Nous n'avons pas d'information précise pour supprimer les données de ce service.",
    tipsTitle: "Conseils pour supprimer vos données :",
    suggestEdit: "Suggérer une modification",
    onlineDeleteAvailable: "Suppression en ligne disponible",
    accessForm: "Accéder au formulaire de suppression",
    emailTemplateTitle: "Modèle d'email personnalisable",
    subjectLabel: "Objet du mail",
    bodyLabel: "Corps du message",
    recipientLabel: "Destinataire",
    copyEmail: "Copier l'adresse email",
    sendEmail: "Envoyer l'email",
    orCopyManually: "OU COPIER MANUELLEMENT",
    copySubject: "Copier l'objet",
    copyBody: "Copier le message",
    modelInfo: "Ce modèle inclut les références aux articles 17.1, 19 et 12.3 du RGPD pour garantir le traitement de votre demande.",
    idRequired: "Une pièce d'identité peut être requise pour cette demande",
    notesLabel: "Notes personnelles",
    previous: "Précédent",
    skipForLater: "Passer pour plus tard",
    markCompleted: "Marquer comme traité",
    next: "Suivant",
    serviceXofY: "Service {index} sur {total}",
    quickNav: "Navigation rapide",
    summary: "Récapitulatif",
    treatedAll: "Vous avez traité tous les services sélectionnés pour la suppression de vos données.",
    sessionSummary: "Vous avez traité {completed} service(s) sur {total}.",
    servicesTreated: "Services traités",
    skippedServicesHeading: "Services en attente",
    nextStepsTitle: "Prochaines étapes",
    nextStepsList1: "Surveillez vos emails pour les confirmations",
    nextStepsList2: "Les entreprises ont généralement 30 jours pour répondre (RGPD)",
    nextStepsList3: "Conservez vos preuves de demandes",
    nextStepsList4: "En cas de non-réponse, vous pouvez saisir la CNIL",
    restart: "Recommencer",
    saveProgress: "Sauvegarder mon suivi",
    selectedOf: "sur {total} sélectionnés",
    badgeTreated: "Traité",
    badgePending: "En attente",
    badgeTodo: "À faire",
    sortedByRisk: "Triés par niveau de risque (les plus préoccupants en premier)",
    riskScore: "Score de risque",
    estimatedRisk: "Risque estimé",
    addMoreServices: "Ajoutez tous vos services pour une analyse précise",
    breachDetected: "fuite(s) de données",
    cnilSanctionDetected: "sanction(s) CNIL",
    outsideEUServices: "hors Union Européenne",
    noDeletionMethod: "sans méthode de suppression claire",
    progressGlobal: "Progression globale",
    processedXofY: "{completed} sur {total} services traités",
    opensMailClient: "(ouvre votre messagerie)",
    emailCopied: "Email copié !",
    subjectCopied: "Objet copié !",
    messageCopied: "Message copié !",
    congratulations: "Félicitations !",
    sessionBilan: "Bilan de la session",
    showDataMap: "Voir la carte des transferts",
    hideDataMap: "Masquer la carte",
    dataTransferMap: "Carte des transferts de données",
  },
  en: {
    title: "Protect my data",
    subtitle: "Analyze your risks and delete your personal data",
    searchPlaceholder: "Search for a service...",
    selectedServices: "Selected services",
    noServicesSelected: "No services selected",
    addServices: "Add services to start the analysis",
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
    urgent: "Important",
    recommended: "Recommended",
    optional: "Optional",
    deleteAccount: "Delete this account",
    findAlternative: "Find an alternative",
    worstServices: "Riskiest services",
    stats: "Detailed statistics",
    calculating: "Calculating...",
    servicesAnalyzed: "services analyzed",
    averageRating: "Average ToSDR rating",
    totalTrackers: "Unique trackers",
    saveSelection: "Save",
    loadSelection: "Load",
    selectionSaved: "Selection saved!",
    clearAll: "Clear all",
    fileLoaded: "File loaded!",
    fileLoadError: "Error loading file",
    stepSelection: "Selection",
    stepAnalysis: "Analysis",
    stepDeletion: "Deletion",
    stepSummary: "Summary",
    continueToAnalysis: "Analyze my risks",
    continueToDelete: "Delete my data",
    backToSelection: "Back to selection",
    backToAnalysis: "Back to analysis",
    selectServicesTitle: "Select the services you use",
    selectServicesDesc: "Check all services for which you have an active account.",
    riskIndicator: "Risk indicator",
    highRisk: "High risk",
    mediumRisk: "Medium risk",
    lowRisk: "Low risk",
    unknownRisk: "Not rated",
    atRiskServices: "at-risk services",
    deletionWarningTitle: "Deleting your data is final and irreversible.",
    noInfo: "We don't have precise instructions to delete data for this service.",
    tipsTitle: "Tips to delete your data:",
    suggestEdit: "Suggest an edit",
    onlineDeleteAvailable: "Online deletion available",
    accessForm: "Open deletion form",
    emailTemplateTitle: "Customizable email template",
    subjectLabel: "Email subject",
    bodyLabel: "Message body",
    recipientLabel: "Recipient",
    copyEmail: "Copy email address",
    sendEmail: "Send email",
    orCopyManually: "OR COPY MANUALLY",
    copySubject: "Copy subject",
    copyBody: "Copy message",
    modelInfo: "This template includes references to GDPR articles to ensure proper handling of your request.",
    idRequired: "An ID may be required for this request",
    notesLabel: "Personal notes",
    previous: "Previous",
    skipForLater: "Skip for later",
    markCompleted: "Mark as done",
    next: "Next",
    serviceXofY: "Service {index} of {total}",
    quickNav: "Quick navigation",
    summary: "Summary",
    treatedAll: "You processed all selected services for data deletion.",
    sessionSummary: "You processed {completed} service(s) of {total}.",
    servicesTreated: "Services processed",
    skippedServicesHeading: "Pending services",
    nextStepsTitle: "Next steps",
    nextStepsList1: "Monitor your emails for confirmations",
    nextStepsList2: "Companies usually have 30 days to reply (GDPR)",
    nextStepsList3: "Keep proof of your requests",
    nextStepsList4: "If no reply, you can file a complaint with the data protection authority",
    restart: "Restart",
    saveProgress: "Save my progress",
    selectedOf: "of {total} selected",
    badgeTreated: "Done",
    badgePending: "Pending",
    badgeTodo: "To do",
    sortedByRisk: "Sorted by risk level (most concerning first)",
    riskScore: "Risk score",
    estimatedRisk: "Estimated risk",
    addMoreServices: "Add all your services for an accurate analysis",
    breachDetected: "data breach(es)",
    cnilSanctionDetected: "CNIL sanction(s)",
    outsideEUServices: "outside European Union",
    noDeletionMethod: "no clear deletion method",
    progressGlobal: "Overall progress",
    processedXofY: "{completed} of {total} services processed",
    opensMailClient: "(opens your mail client)",
    emailCopied: "Email copied!",
    subjectCopied: "Subject copied!",
    messageCopied: "Message copied!",
    congratulations: "Congratulations!",
    sessionBilan: "Session summary",
    showDataMap: "Show data transfer map",
    hideDataMap: "Hide map",
    dataTransferMap: "Data transfer map",
  },
};

function t(lang: string, key: string): string {
  return translations[lang]?.[key] || translations["fr"][key] || key;
}

interface Service {
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
  easy_access_data?: string;
}

interface ServiceDetails {
  tosdrRating?: string;
  trackers?: number[];
  sanctionedByCnil?: boolean;
  outsideEU?: boolean;
  breaches?: number;
  riskScore?: number;
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

interface SaveData {
  selectedServices: string[];
  completedServices?: string[];
  skippedServices?: string[];
  notes?: { [key: string]: string };
  timestamp: string;
}

interface Props {
  lang?: string;
  preselectedSlug?: string;
}

export default function ProtectMyData({ lang = "fr", preselectedSlug }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const serviceCardRef = useRef<HTMLDivElement>(null);

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

  // Deletion state
  const [completedServices, setCompletedServices] = useState<string[]>([]);
  const [skippedServices, setSkippedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [showDataMap, setShowDataMap] = useState(true);

  // Quick risk cache for real-time display
  const [quickRiskCache, setQuickRiskCache] = useState<Record<string, "high" | "medium" | "low" | "unknown">>({});
  const [breachData, setBreachData] = useState<Record<string, Array<{ pwnCount: number; dataClasses: string[] }>>>({});
  const [manualData, setManualData] = useState<Record<string, { sanctioned_by_cnil?: boolean; outside_eu_storage?: boolean }>>({});

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
              if (parsed.completedServices) setCompletedServices(parsed.completedServices);
              if (parsed.skippedServices) setSkippedServices(parsed.skippedServices);
              if (parsed.notes) setNotes(parsed.notes);
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
  }, [preselectedSlug]);

  // Load quick risk data for display (based on country, deletion difficulty, breaches, CNIL)
  useEffect(() => {
    const loadQuickRisks = async () => {
      const cache: Record<string, "high" | "medium" | "low" | "unknown"> = {};
      let breaches: Record<string, Array<{ pwnCount: number; dataClasses: string[] }>> = {};
      const manualCache: Record<string, { sanctioned_by_cnil?: boolean; outside_eu_storage?: boolean }> = {};

      // EU/EEA country codes (considered safer for GDPR)
      const euCountries = new Set([
        "fr", "de", "it", "es", "pt", "nl", "be", "lu", "at", "ie", "fi", "se",
        "dk", "pl", "cz", "sk", "hu", "ro", "bg", "hr", "si", "ee", "lv", "lt",
        "mt", "cy", "gr", "no", "is", "li", "ch" // + EEA & Switzerland
      ]);

      // Load breach data
      try {
        const breachRes = await fetch("/data/compare/breach-mapping.json");
        if (breachRes.ok) {
          breaches = await breachRes.json();
          setBreachData(breaches);
        }
      } catch {}

      // Load manual data for each service (in parallel for performance)
      const manualPromises = services.map(async (service) => {
        try {
          const res = await fetch(`/data/manual/${service.slug}.json`);
          if (res.ok) {
            const data = await res.json();
            manualCache[service.slug] = {
              sanctioned_by_cnil: data.sanctioned_by_cnil,
              outside_eu_storage: data.outside_eu_storage,
            };
          }
        } catch {}
      });
      await Promise.all(manualPromises);
      setManualData(manualCache);

      // Calculate risk for each service
      for (const service of services) {
        let riskScore = 0; // Higher = more risk

        // 1. Country-based risk (available for all services)
        const countryCode = service.country_code?.toLowerCase();
        if (countryCode) {
          if (!euCountries.has(countryCode)) {
            // Outside EU = higher risk for GDPR compliance
            if (countryCode === "cn" || countryCode === "ru") {
              riskScore += 20; // High-risk countries
            } else if (countryCode === "us") {
              riskScore += 10; // US = medium risk (no adequacy but common)
            } else {
              riskScore += 5; // Other non-EU countries
            }
          }
        }

        // 2. Deletion difficulty (available for all services)
        const hasUrlDelete = !!service.url_delete;
        const hasEmailDelete = !!service.contact_mail_delete;
        if (!hasUrlDelete && !hasEmailDelete) {
          riskScore += 25; // No easy way to delete = high risk
        } else if (!hasUrlDelete && hasEmailDelete) {
          riskScore += 5; // Email only = slightly harder
        }
        // url_delete available = easy = no penalty

        // 3. ID card required (available for all services)
        if (service.need_id_card === true) {
          riskScore += 10; // Barrier to exercise rights
        }

        // 4. easy_access_data score (when available)
        const easyAccess = service.easy_access_data;
        if (easyAccess) {
          const match = easyAccess.match(/(\d)\/5/);
          if (match) {
            const score = parseInt(match[1]);
            if (score <= 2) riskScore += 15; // Hard to access = risk
            else if (score <= 3) riskScore += 5;
            // 4-5 = good, no penalty
          }
        }

        // 5. Check breaches (bonus data when available)
        const serviceBreaches = breaches[service.slug];
        if (serviceBreaches && serviceBreaches.length > 0) {
          riskScore += 25; // Base penalty for any breach

          // Extra penalty for large breaches
          const totalPwned = serviceBreaches.reduce((sum, b) => sum + (b.pwnCount || 0), 0);
          if (totalPwned > 1000000) riskScore += 15;
          else if (totalPwned > 100000) riskScore += 5;

          // Extra penalty for sensitive data (passwords, financial)
          const hasSensitiveData = serviceBreaches.some(b =>
            b.dataClasses?.some(dc =>
              dc.toLowerCase().includes("password") ||
              dc.toLowerCase().includes("credit") ||
              dc.toLowerCase().includes("financial")
            )
          );
          if (hasSensitiveData) riskScore += 10;
        }

        // 6. Check CNIL sanctions (bonus data when available)
        if (manualCache[service.slug]?.sanctioned_by_cnil) {
          riskScore += 20;
        }

        // Determine risk level (adjusted thresholds)
        let risk: "high" | "medium" | "low" | "unknown";
        if (riskScore >= 35) {
          risk = "high";
        } else if (riskScore >= 15) {
          risk = "medium";
        } else {
          risk = "low";
        }

        cache[service.slug] = risk;
      }

      setQuickRiskCache(cache);
    };

    if (services.length > 0) {
      loadQuickRisks();
    }
  }, [services]);

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
      const scoreA = serviceDetails[a.slug]?.riskScore ?? 100;
      const scoreB = serviceDetails[b.slug]?.riskScore ?? 100;
      return scoreA - scoreB; // Lower score = higher risk = first
    });
  }, [selectedServices, serviceDetails, analysisResult]);

  // Count at-risk services
  const atRiskCount = useMemo(() => {
    return [...selectedSlugs].filter(slug =>
      quickRiskCache[slug] === "high" || quickRiskCache[slug] === "medium"
    ).length;
  }, [selectedSlugs, quickRiskCache]);

  // Calculate detailed risk stats for the gauge
  const riskStats = useMemo(() => {
    // EU/EEA country codes
    const euCountries = new Set([
      "fr", "de", "it", "es", "pt", "nl", "be", "lu", "at", "ie", "fi", "se",
      "dk", "pl", "cz", "sk", "hu", "ro", "bg", "hr", "si", "ee", "lv", "lt",
      "mt", "cy", "gr", "no", "is", "li", "ch"
    ]);

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
      if (service?.country_code && !euCountries.has(service.country_code.toLowerCase())) {
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

  // Update email template when current service changes
  useEffect(() => {
    const currentService = sortedServicesForDeletion[currentServiceIndex];
    if (currentService) {
      const subject = lang === "en"
        ? `Request for deletion of personal data (GDPR - Art. 17)`
        : `Demande de suppression de données personnelles (RGPD - Art. 17)`;
      const body = lang === "en"
        ? `Dear Sir or Madam,\n\nUnder Article 17.1 of the General Data Protection Regulation (GDPR), I request that you erase my personal data associated with my account on ${currentService.name}.\n\nI request deletion because I no longer use this service and wish to exercise my right to erasure.\n\nPlease also notify any third parties to whom you have disclosed my data (Article 19 GDPR).\n\nPlease inform me of the actions taken within one month of receipt of this request (Article 12.3 GDPR).\n\nIf you fail to respond or provide an incomplete response, I will file a complaint with the competent data protection authority.\n\nSincerely.`
        : `Madame, Monsieur,\n\nEn application de l'article 17.1 du Règlement général sur la protection des données (RGPD), je vous prie d'effacer de vos fichiers les données personnelles suivantes me concernant :\n\nToutes les données personnelles associées à mon compte et mon utilisation de ${currentService.name}.\n\nJe demande que ces informations soient supprimées car :\n\nJe n'utilise plus ce service et souhaite exercer mon droit à l'effacement.\n\nVous voudrez bien également notifier cette demande d'effacement de mes données aux organismes auxquels vous les auriez communiquées (article 19 du RGPD).\n\nEnfin, je vous prie de m'informer de ces éléments dans les meilleurs délais et au plus tard dans un délai d'un mois à compter de la réception de ce courrier (article 12.3 du RGPD).\n\nÀ défaut de réponse de votre part dans les délais impartis ou en cas de réponse incomplète, je saisirai la Commission nationale de l'informatique et des libertés (CNIL) d'une réclamation.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`;
      setEmailSubject(subject);
      setEmailBody(body);
    }
  }, [currentServiceIndex, sortedServicesForDeletion, lang]);

  // Scroll to service card on index change
  useEffect(() => {
    if (step === 3 && serviceCardRef.current) {
      serviceCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentServiceIndex, step]);

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
          markAsCompleted(currentSlug);
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
  }, [step, selectedSlugs.size, analysisResult, currentServiceIndex, sortedServicesForDeletion]);

  // Go to analysis step
  const goToAnalysis = () => {
    if (selectedSlugs.size > 0) {
      setAnalysisResult(null);
      setStep(2);
    }
  };

  // Go to deletion step
  const goToDeletion = () => {
    setCurrentServiceIndex(0);
    setStep(3);
  };

  // Save selection to file
  const saveToFile = () => {
    const saveData: SaveData = {
      selectedServices: [...selectedSlugs],
      completedServices,
      skippedServices,
      notes,
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
            if (data.completedServices) setCompletedServices(data.completedServices);
            if (data.skippedServices) setSkippedServices(data.skippedServices);
            if (data.notes) setNotes(data.notes);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Mark service as completed
  const markAsCompleted = (slug: string) => {
    if (!completedServices.includes(slug)) {
      setCompletedServices((prev) => [...prev, slug]);
    }
    if (skippedServices.includes(slug)) {
      setSkippedServices((prev) => prev.filter((s) => s !== slug));
    }
  };

  // Mark service as skipped
  const markAsSkipped = (slug: string) => {
    if (!skippedServices.includes(slug)) {
      setSkippedServices((prev) => [...prev, slug]);
    }
    if (completedServices.includes(slug)) {
      setCompletedServices((prev) => prev.filter((s) => s !== slug));
    }
  };

  // Restart
  const restart = () => {
    setStep(1);
    setSelectedSlugs(new Set());
    setCompletedServices([]);
    setSkippedServices([]);
    setNotes({});
    setCurrentServiceIndex(0);
    setAnalysisResult(null);
    setSearchQuery("");
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
      C: 10,
      D: 20,
      E: 35,
    };

    // Load details for each selected service
    for (const slug of selectedSlugs) {
      const service = services.find((s) => s.slug === slug);
      if (!service) continue;

      const serviceDetail: ServiceDetails = { riskScore: 100 };

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
            serviceDetail.riskScore! -= ratingPenalty[tosdrData.rating] || 0;
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
            const trackerPenalty = Math.min((exodusData.trackers?.length || 0) * 2, 20);
            serviceDetail.riskScore! -= trackerPenalty;
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
            serviceDetail.riskScore! -= 25;
          }
          if (manualData.outside_eu_storage) {
            outsideEUCount++;
            serviceDetail.riskScore! -= 5;
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
            const breachPenalty = Math.min(breachData[slug].length * 10, 30);
            serviceDetail.riskScore! -= breachPenalty;
          }
        }
      } catch {}

      serviceDetail.riskScore = Math.max(0, serviceDetail.riskScore!);
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
    const worstServices: AnalysisResult["worstServices"] = [];
    const actions: AnalysisResult["actions"] = [];

    for (const service of services) {
      const detail = details[service.slug] || {};
      const serviceScore = detail.riskScore ?? 100;
      totalScore += serviceScore;
      const reasons: string[] = [];
      const serviceActions: string[] = [];
      let highestPriority: "urgent" | "recommended" | "optional" = "optional";

      if (detail.tosdrRating === "E") {
        reasons.push(lang === "fr" ? "CGU très problématiques (E)" : "Very problematic ToS (E)");
        serviceActions.push(lang === "fr" ? "Supprimer ce compte" : "Delete this account");
        highestPriority = "urgent";
      } else if (detail.tosdrRating === "D") {
        reasons.push(lang === "fr" ? "CGU problématiques (D)" : "Problematic ToS (D)");
        if (highestPriority !== "urgent") highestPriority = "recommended";
      }

      const trackerCount = detail.trackers?.length || 0;
      if (trackerCount > 5) {
        reasons.push(lang === "fr" ? `${trackerCount} traqueurs` : `${trackerCount} trackers`);
      }

      if (detail.sanctionedByCnil) {
        reasons.push(lang === "fr" ? "Sanctionné par la CNIL" : "Sanctioned by CNIL");
        serviceActions.push(lang === "fr" ? "Trouver une alternative" : "Find an alternative");
        highestPriority = "urgent";
      }

      if (detail.breaches && detail.breaches > 0) {
        reasons.push(
          lang === "fr"
            ? `${detail.breaches} fuite(s) de données`
            : `${detail.breaches} data breach(es)`
        );
        serviceActions.push(lang === "fr" ? "Changer de mot de passe" : "Change password");
        if (highestPriority !== "urgent") highestPriority = "recommended";
      }

      // Add single action entry per service with all reasons grouped
      if (serviceActions.length > 0) {
        actions.push({
          service: service.name,
          slug: service.slug,
          priority: highestPriority,
          action: serviceActions.join(" • "),
          reason: reasons.join(" • "),
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

    // Sort worst services by score (lowest first)
    worstServices.sort((a, b) => a.score - b.score);

    // Sort actions by priority (urgent first, then recommended, then optional)
    const priorityOrder = { urgent: 0, recommended: 1, optional: 2 };
    actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Calculate average score
    const avgScore = services.length > 0 ? Math.round(totalScore / services.length) : 100;

    // Determine risk level
    let riskLevel: string;
    if (avgScore < 20) riskLevel = t(lang, "critical");
    else if (avgScore < 40) riskLevel = t(lang, "high");
    else if (avgScore < 60) riskLevel = t(lang, "medium");
    else if (avgScore < 80) riskLevel = t(lang, "low");
    else riskLevel = t(lang, "excellent");

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

  // Get risk badge for service card
  const getRiskBadge = (slug: string) => {
    const risk = quickRiskCache[slug];
    if (risk === "high") return { color: "badge-error", text: t(lang, "highRisk") };
    if (risk === "medium") return { color: "badge-warning", text: t(lang, "mediumRisk") };
    if (risk === "low") return { color: "badge-success", text: t(lang, "lowRisk") };
    return { color: "badge-ghost", text: t(lang, "unknownRisk") };
  };

  // Progress calculation for deletion step
  const progress = selectedSlugs.size > 0
    ? Math.round((completedServices.length / selectedSlugs.size) * 100)
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">{t(lang, "title")}</h1>
          <p className="text-xl max-w-3xl mx-auto mb-6">
            {t(lang, "subtitle")}
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
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
              <span>💾</span> {t(lang, "saveSelection")}
            </button>
            <label
              className="btn btn-outline gap-2 cursor-pointer"
              title={t(lang, "loadSelection")}
            >
              <span>📂</span> {t(lang, "loadSelection")}
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
                onClick={() => selectedSlugs.size > 0 && goToAnalysis()}
                role="button"
                tabIndex={selectedSlugs.size > 0 ? 0 : -1}
              >
                {t(lang, "stepAnalysis")}
              </li>
              <li
                className={`step ${step >= 3 ? "step-primary" : ""} ${analysisResult ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                onClick={() => analysisResult && goToDeletion()}
                role="button"
                tabIndex={analysisResult ? 0 : -1}
              >
                {t(lang, "stepDeletion")}
              </li>
              <li
                className={`step ${step >= 4 ? "step-primary" : ""} ${step === 4 ? "" : "cursor-not-allowed opacity-50"}`}
              >
                {t(lang, "stepSummary")}
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
                  📋 {t(lang, "selectServicesTitle")}
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
                  <div className="mt-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Selected services */}
                      <div className="bg-primary/10 rounded-xl p-4 text-center border border-primary/20">
                        <div className="text-3xl font-bold text-primary">{selectedSlugs.size}</div>
                        <div className="text-xs text-primary/70 mt-1">
                          {lang === "fr" ? "services sélectionnés" : "services selected"}
                        </div>
                      </div>

                      {/* High risk */}
                      {riskStats.highCount > 0 && (
                        <div className="bg-error/10 rounded-xl p-4 text-center border border-error/20">
                          <div className="text-3xl font-bold text-error">{riskStats.highCount}</div>
                          <div className="text-xs text-error/70 mt-1">{t(lang, "highRisk")}</div>
                        </div>
                      )}

                      {/* Medium risk */}
                      {riskStats.mediumCount > 0 && (
                        <div className="bg-warning/10 rounded-xl p-4 text-center border border-warning/20">
                          <div className="text-3xl font-bold text-warning">{riskStats.mediumCount}</div>
                          <div className="text-xs text-warning/70 mt-1">{t(lang, "mediumRisk")}</div>
                        </div>
                      )}

                      {/* Data breaches */}
                      {riskStats.breachCount > 0 && (
                        <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                          <div className="text-3xl font-bold text-red-600">{riskStats.breachCount}</div>
                          <div className="text-xs text-red-600/70 mt-1">{t(lang, "breachDetected")}</div>
                        </div>
                      )}

                      {/* CNIL sanctions */}
                      {riskStats.cnilCount > 0 && (
                        <div className="bg-orange-500/10 rounded-xl p-4 text-center border border-orange-500/20">
                          <div className="text-3xl font-bold text-orange-600">{riskStats.cnilCount}</div>
                          <div className="text-xs text-orange-600/70 mt-1">{t(lang, "cnilSanctionDetected")}</div>
                        </div>
                      )}

                      {/* No deletion method */}
                      {riskStats.noDeletionMethodCount > 0 && (
                        <div className="bg-yellow-500/10 rounded-xl p-4 text-center border border-yellow-500/20">
                          <div className="text-3xl font-bold text-yellow-600">{riskStats.noDeletionMethodCount}</div>
                          <div className="text-xs text-yellow-600/70 mt-1">{t(lang, "noDeletionMethod")}</div>
                        </div>
                      )}

                      {/* Outside EU */}
                      {riskStats.outsideEUCount > 0 && (
                        <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                          <div className="text-3xl font-bold text-blue-600">{riskStats.outsideEUCount}</div>
                          <div className="text-xs text-blue-600/70 mt-1">{t(lang, "outsideEUServices")}</div>
                        </div>
                      )}

                      {/* Low risk (only if there are some) */}
                      {riskStats.lowCount > 0 && (
                        <div className="bg-success/10 rounded-xl p-4 text-center border border-success/20">
                          <div className="text-3xl font-bold text-success">{riskStats.lowCount}</div>
                          <div className="text-xs text-success/70 mt-1">{t(lang, "lowRisk")}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => {
                const isSelected = selectedSlugs.has(service.slug);
                const riskBadge = getRiskBadge(service.slug);
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
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                                {service.nationality || "International"}
                              </span>
                              {riskBadge.color !== "badge-ghost" && <span className={`badge badge-xs ${riskBadge.color}`}>
                                {riskBadge.text}
                              </span>}
                            </div>
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

        {/* Sticky Continue Button - Step 1 */}
        {step === 1 && selectedSlugs.size > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <button
              className="btn btn-primary btn-lg shadow-2xl gap-2"
              onClick={goToAnalysis}
            >
              {t(lang, "continueToAnalysis")} ({selectedSlugs.size})
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Analysis Results */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Back button */}
            <button
              onClick={() => setStep(1)}
              className="btn btn-ghost gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
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
              <div className="space-y-6">
                {/* Data Transfer Map */}
                {showDataMap && (
                  <DataTransferMap
                    lang={lang}
                    selectedServices={selectedServices}
                  />
                )}

                {/* Toggle Map Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowDataMap(!showDataMap)}
                    className="btn btn-sm btn-ghost gap-2"
                  >
                    <Map className="w-4 h-4" />
                    {showDataMap ? t(lang, "hideDataMap") : t(lang, "showDataMap")}
                  </button>
                </div>

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

                  {/* Continue to Delete Button */}
                  <button
                    onClick={goToDeletion}
                    className="btn btn-error btn-block gap-2 text-white"
                  >
                    <Trash2 className="w-5 h-5" />
                    {t(lang, "continueToDelete")}
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
                              className="p-4 bg-base-200 rounded-lg border-1"
                              style={{
                                borderColor:
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
                                      ? "badge-error text-white"
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
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Step 3: Deletion Process */}
        {step === 3 && currentService && (
          <div className="space-y-6">
            {/* Back button */}
            <button
              onClick={() => setStep(2)}
              className="btn btn-ghost gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {t(lang, "backToAnalysis")}
            </button>

            {/* Progress */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">{t(lang, "progressGlobal")}</span>
                  <span className="text-sm">{progress}%</span>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={progress}
                  max="100"
                ></progress>
                <p className="text-xs text-base-content/70 mt-1">
                  {t(lang, "processedXofY").replace("{completed}", String(completedServices.length)).replace("{total}", String(selectedSlugs.size))}
                </p>
                <p className="text-xs text-base-content/50 mt-1 italic">
                  {t(lang, "sortedByRisk")}
                </p>
              </div>
            </div>

            {/* Current Service */}
            <div ref={serviceCardRef} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start gap-4 mb-4">
                  {currentService.logo && (
                    <div className="relative w-44 h-20 rounded-2xl">
                      <Image
                        src={currentService.logo}
                        alt={currentService.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="card-title text-3xl">{currentService.name}</h2>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="badge">{currentService.nationality || "International"}</span>
                      {serviceDetails[currentService.slug] && (
                        <span className={`badge ${getScoreColor(serviceDetails[currentService.slug].riskScore || 100).replace("text-", "badge-")}`}>
                          {t(lang, "riskScore")}: {serviceDetails[currentService.slug].riskScore}
                        </span>
                      )}
                      {completedServices.includes(currentService.slug) && (
                        <span className="badge badge-success">✓ {t(lang, "badgeTreated")}</span>
                      )}
                      {skippedServices.includes(currentService.slug) && (
                        <span className="badge badge-warning">⚠ {t(lang, "badgePending")}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="space-y-4">
                  <div className="alert alert-warning alert-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <span className={"text-black"}>{t(lang, "deletionWarningTitle")}</span>
                  </div>

                  {!currentService.url_delete && !currentService.contact_mail_delete && (
                    <div className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-4">
                      <div className="alert alert-info">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span className={"text-white"}>{t(lang, "noInfo")}</span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-bold">{t(lang, "tipsTitle")}</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>{lang === "en" ? "Check Account settings > Privacy or Security." : "Vérifiez les Paramètres du compte > Confidentialité ou Sécurité."}</li>
                          <li>{lang === "en" ? "Look for a contact email in the site's legal notice or privacy policy." : "Recherchez une adresse email de contact dans les Mentions Légales ou la Politique de Confidentialité du site."}</li>
                          <li>{lang === "en" ? "Try sending an email to privacy@..., dpo@... or contact@... using the service domain." : "Essayez d'envoyer un email à privacy@..., dpo@... ou contact@... avec le nom de domaine du service."}</li>
                        </ul>
                      </div>

                      <div className="card bg-base-100 shadow-sm">
                        <div className="card-body p-4">
                          <h4 className="font-bold text-sm">🤝 {lang === "en" ? "Contribute to the project" : "Contribuez au projet"}</h4>
                          <p className="text-xs">{lang === "en" ? "If you find how to delete this account, help other users!" : "Si vous trouvez comment supprimer ce compte, aidez les autres utilisateurs !"}</p>
                          <Link
                            href={`/contribuer/modifier-fiche?slug=${currentService.slug}`}
                            target="_blank"
                            prefetch={false}
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm gap-2 mt-2 w-64"
                          >
                            ✏️ {t(lang, "suggestEdit")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentService.url_delete && (
                    <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <span>✓</span> {t(lang, "onlineDeleteAvailable")}
                      </h3>
                      <a
                        href={currentService.url_delete}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success btn-sm"
                      >
                        {t(lang, "accessForm")} →
                      </a>
                    </div>
                  )}

                  {currentService.contact_mail_delete && (
                    <div className="bg-base-200/50 p-6 rounded-xl border border-base-300">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Editable Template */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">✉️</span>
                            <h3 className="font-bold text-lg">{t(lang, "emailTemplateTitle")}</h3>
                          </div>

                          <div className="form-control w-full">
                            <label className="label">
                              <span className="label-text font-semibold mb-2">{t(lang, "subjectLabel")}</span>
                            </label>
                            <input
                              type="text"
                              className="input input-bordered w-full"
                              value={emailSubject}
                              onChange={(e) => setEmailSubject(e.target.value)}
                            />
                          </div>

                          <div className="form-control w-full">
                            <label className="label w-full mb-2">
                              <span className="label-text font-semibold">{t(lang, "bodyLabel")}</span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered h-96 text-sm leading-relaxed w-full"
                              value={emailBody}
                              onChange={(e) => setEmailBody(e.target.value)}
                            ></textarea>
                          </div>
                        </div>

                        {/* Right Column: Recipient & Actions */}
                        <div className="space-y-6 lg:pt-12">
                          <div className="card bg-base-100 shadow-sm border border-base-200">
                            <div className="card-body p-5">
                              <h4 className="font-bold text-sm uppercase text-base-content/70 mb-3">{t(lang, "recipientLabel")}</h4>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  readOnly
                                  className="input input-bordered w-full bg-base-200 font-mono text-sm"
                                  value={currentService.contact_mail_delete}
                                />
                                <button
                                  className="btn btn-square btn-ghost border-base-300"
                                  onClick={() => {
                                    navigator.clipboard.writeText(currentService.contact_mail_delete!);
                                    alert(t(lang, "emailCopied"));
                                  }}
                                  title={t(lang, "copyEmail")}
                                >
                                  📋
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <a
                              href={`mailto:${currentService.contact_mail_delete}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                              className="btn btn-primary btn-block btn-lg shadow-lg hover:shadow-xl transition-all"
                            >
                              🚀 {t(lang, "sendEmail")}
                              <span className="text-xs font-normal opacity-80 block">{t(lang, "opensMailClient")}</span>
                            </a>

                            <div className="divider text-xs text-base-content/50 font-medium">{t(lang, "orCopyManually")}</div>

                            <div className="grid grid-cols-2 gap-3">
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(emailSubject);
                                  alert(t(lang, "subjectCopied"));
                                }}
                              >
                                {t(lang, "copySubject")}
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(emailBody);
                                  alert(t(lang, "messageCopied"));
                                }}
                              >
                                {t(lang, "copyBody")}
                              </button>
                            </div>
                          </div>

                          <div className="alert alert-info text-xs mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span className={"text-white"}>{t(lang, "modelInfo")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentService.need_id_card && (
                    <div className="alert alert-info">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{t(lang, "idRequired")}</span>
                    </div>
                  )}

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold w-full mb-2">📝 {t(lang, "notesLabel")}</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24 w-full"
                      placeholder={lang === "en" ? "Date of request, reference number, remarks..." : "Date de la demande, numéro de référence, remarques..."}
                      value={notes[currentService.slug] || ""}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [currentService.slug]: e.target.value,
                        }))
                      }
                    ></textarea>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="flex justify-between items-center">
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      if (currentServiceIndex > 0) {
                        setCurrentServiceIndex(currentServiceIndex - 1);
                      }
                    }}
                    disabled={currentServiceIndex === 0}
                  >
                    ← {t(lang, "previous")}
                  </button>

                  <p className="text-sm text-base-content/60 mx-4">
                    {t(lang, "serviceXofY").replace("{index}", String(currentServiceIndex + 1)).replace("{total}", String(sortedServicesForDeletion.length))}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick navigation */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-4">
                <h3 className="font-semibold text-sm mb-2">{t(lang, "quickNav")}</h3>
                <div className="flex flex-wrap gap-2">
                  {sortedServicesForDeletion.map((service, index) => (
                    <button
                      key={service.slug}
                      className={`btn btn-xs ${
                        index === currentServiceIndex
                          ? "btn-primary"
                          : completedServices.includes(service.slug)
                            ? "btn-success"
                            : skippedServices.includes(service.slug)
                              ? "btn-warning"
                              : "btn-ghost"
                      }`}
                      onClick={() => setCurrentServiceIndex(index)}
                    >
                      {completedServices.includes(service.slug) && "✓ "}
                      {skippedServices.includes(service.slug) && "⚠ "}
                      {service.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Action Buttons - Step 3 */}
        {step === 3 && currentService && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex gap-3 bg-base-100 p-3 rounded-box shadow-2xl border border-base-300 items-center">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  markAsSkipped(currentService.slug);
                  if (currentServiceIndex < sortedServicesForDeletion.length - 1) {
                    setCurrentServiceIndex(currentServiceIndex + 1);
                  } else {
                    setStep(4);
                  }
                }}
              >
                {t(lang, "skipForLater")}
              </button>
              <button
                className="btn btn-primary btn-lg shadow-lg"
                onClick={() => {
                  markAsCompleted(currentService.slug);
                  if (currentServiceIndex < sortedServicesForDeletion.length - 1) {
                    setCurrentServiceIndex(currentServiceIndex + 1);
                  } else {
                    setStep(4);
                  }
                }}
              >
                {completedServices.includes(currentService.slug) ? t(lang, "next") : t(lang, "markCompleted")}
                →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-6xl mb-4">
                  {completedServices.length === selectedSlugs.size ? "🎉" : "📊"}
                </div>
                <h2 className="card-title text-3xl justify-center">
                  {completedServices.length === selectedSlugs.size ? t(lang, "congratulations") : t(lang, "sessionBilan")}
                </h2>
                <p className="text-lg">
                  {completedServices.length === selectedSlugs.size
                    ? t(lang, "treatedAll")
                    : t(lang, "sessionSummary").replace("{completed}", String(completedServices.length)).replace("{total}", String(selectedSlugs.size))}
                </p>

                <div className="stats shadow mt-6">
                  <div className="stat">
                    <div className="stat-title">{t(lang, "servicesTreated")}</div>
                    <div className="stat-value text-primary">{completedServices.length}</div>
                    <div className="stat-desc">{t(lang, "selectedOf").replace("{total}", String(selectedSlugs.size))}</div>
                  </div>
                </div>

                {/* Summary Table */}
                {selectedSlugs.size > 0 && (
                  <div className="card bg-base-100 shadow-lg mt-6">
                    <div className="card-body">
                      <h3 className="card-title">📋 {t(lang, "summary")}</h3>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <thead>
                            <tr>
                              <th>{lang === "en" ? "Service" : "Service"}</th>
                              <th>{t(lang, "riskScore")}</th>
                              <th>{lang === "en" ? "Status" : "Statut"}</th>
                              <th>{lang === "en" ? "Notes" : "Notes"}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedServicesForDeletion.map((service) => (
                              <tr key={service.slug}>
                                <td className="font-medium">{service.name}</td>
                                <td>
                                  <span className={`font-bold ${getScoreColor(serviceDetails[service.slug]?.riskScore || 100)}`}>
                                    {serviceDetails[service.slug]?.riskScore || "?"}
                                  </span>
                                </td>
                                <td>
                                  {completedServices.includes(service.slug) ? (
                                    <span className="badge badge-success text-white">✓ {t(lang, "badgeTreated")}</span>
                                  ) : skippedServices.includes(service.slug) ? (
                                    <button
                                      className="badge badge-warning gap-1 cursor-pointer hover:scale-105 transition-transform"
                                      onClick={() => {
                                        const index = sortedServicesForDeletion.findIndex(
                                          (s) => s.slug === service.slug
                                        );
                                        setCurrentServiceIndex(index);
                                        setStep(3);
                                      }}
                                    >
                                      ⚠ {t(lang, "badgePending")}
                                    </button>
                                  ) : (
                                    <span className="badge badge-ghost">{t(lang, "badgeTodo")}</span>
                                  )}
                                </td>
                                <td className="text-sm text-base-content/70">
                                  {notes[service.slug] || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                <div className="alert alert-info mt-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div className="text-left text-white">
                    <h3 className="font-bold">{t(lang, "nextStepsTitle")}</h3>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>{t(lang, "nextStepsList1")}</li>
                      <li>{t(lang, "nextStepsList2")}</li>
                      <li>{t(lang, "nextStepsList3")}</li>
                      <li>{t(lang, "nextStepsList4")}</li>
                    </ul>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="btn btn-primary"
                    onClick={saveToFile}
                  >
                    💾 {t(lang, "saveProgress")}
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={restart}
                  >
                    🔄 {t(lang, "restart")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
