"use client";

import allServices from '../public/data/services.json';
import {useState, useEffect, useMemo, useCallback, useRef} from "react";
import Image from "next/image";
import Link from "next/link";
import {Search, X, Plus, Sparkles, ExternalLink, ShieldCheck, ShieldAlert, AlertTriangle, Info, ArrowRight} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {useLanguage} from "@/context/LanguageContext";
import {useSearchParams} from "next/navigation";
import permissionsDataRawEn from '../public/data/compare/permissions.json';
import permissionsDataRawFr from '../public/data/compare/permissions_fr.json';
import trackersDataRaw from '../public/data/compare/trackers.json';

// Interfaces
interface Service {
    mode: number;
    slug: string;
    name: string;
    logo: string;
    short_description: string;
    risk_level: number;
    accessibility: number;
    need_account: number;
    need_id_card: boolean;
    contact_mail_export: string;
    contact_mail_delete: string;
    how_to_export: string;
    country_name: string;
    country_code: string;
    number_app: number;
    number_breach: number;
    number_permission: number;
    number_website: number;
    number_website_cookie: number;
    tosdr?: string;
    exodus?: string;
}

interface AppPermissions {
    handle: string;
    app_name: string;
    permissions: string[];
    trackers: number[];
}

interface ServicePoint {
    title: string;
    case: {
        title: string;
        localized_title: string;
        classification: "bad" | "neutral" | "good" | "blocker";
    };
    status: string;
}

interface ServiceData {
    id?: number;
    name: string;
    rating?: string;
    logo: string;
    points: ServicePoint[];
}

interface Permission {
    name: string;
    description: string;
    label: string;
    protection_level: string;
}

interface Tracker {
    id: number;
    name: string;
    country: string;
}

interface ComparatifComponentProps {
    locale: 'fr' | 'en';
}

// Translations
const translations = {
    fr: {
        title: "Comparatif personnalisé de services",
        subtitle: "Recherchez et comparez jusqu'à 3 services pour analyser leurs permissions, trackers et points positifs",
        experimentalWarning: "Ce comparatif est <strong>expérimental</strong>. Les données peuvent contenir des inexactitudes.",
        suggestCorrections: "faire des suggestions de modification",
        quickComparison: "Lancer un comparatif rapide",
        quickSuggestions: "Suggestions rapides",
        orSearchManually: "ou recherchez manuellement",
        searchPlaceholder: "Rechercher un service...",
        selectedServices: "Services sélectionnés",
        startOver: "Recommencer",
        useSearchBar: "Utilisez la barre de recherche pour ajouter des services à comparer",
        quickVerdict: "Verdict Rapide",
        fairlyReliable: "Plutôt fiable",
        critical: "Critique",
        monitorClosely: "À surveiller",
        moderateRisk: "Risque modéré",
        unknownData: "Données inconnues",
        sensitivePermissions: "permissions sensibles",
        permissionAccess: "Accès micro, caméra, contacts...",
        adTrackers: "pisteurs publicitaires",
        trackingActivity: "Surveillance de votre activité",
        legalIssues: "points juridiques",
        abusiveTerms: "Conditions d'utilisation abusives",
        viewDetails: "Consulter la fiche",
        whyDeleteData: "Pourquoi supprimer vos données ?",
        whyDeleteDataDesc: "Si un service collecte trop d'informations ou présente des risques pour votre vie privée, le meilleur moyen de vous protéger est souvent de supprimer votre compte et vos données. Notre outil vous guide étape par étape.",
        dataAccessPrivacy: "Accès aux données & Confidentialité",
        dataAccessEase: "Facilité d'accès aux données",
        dataAccessEaseDesc: "Note sur 5 de la facilité à récupérer vos infos",
        notSpecified: "Non renseigné",
        idDocuments: "Documents d'identité requis",
        idDocumentsDesc: "Faut-il envoyer sa carte d'identité ?",
        yes: "Oui",
        no: "Non",
        documentDetails: "Détails des documents",
        storageOutsideEU: "Stockage hors UE",
        storageOutsideEUDesc: "Vos données quittent-elles l'Europe ?",
        destinationCountries: "Pays de destination",
        sanctioned: "Déjà sanctionné (CNIL/GDPR)",
        sanctionedDesc: "L'entreprise a-t-elle déjà été condamnée ?",
        sanctionDetails: "Détails des sanctions",
        avgResponseTime: "Délai de réponse moyen",
        sensitivePermissionsTitle: "Permissions Sensibles",
        sensitivePermissionsDesc: "Accès aux fonctionnalités critiques de votre téléphone",
        totalDangerousPermissions: "TOTAL Permissions Dangereuses",
        access: "ACCÈS",
        trackersTitle: "Pisteurs (Trackers)",
        trackersDesc: "Mouchards publicitaires et analytiques",
        totalTrackers: "TOTAL Pisteurs",
        present: "Présent",
        warningPoints: "Points de vigilance (ToS;DR)",
        warningPointsDesc: "Problèmes dans les conditions d'utilisation",
        totalNegativePoints: "TOTAL Points Négatifs",
        addMoreServices: "Ajoutez au moins un autre service pour commencer la comparaison",
        takeControl: "Vous souhaitez reprendre le contrôle ?",
        takeControlDesc: "Si ces résultats vous inquiètent, sachez que vous avez le droit de demander la suppression de vos données personnelles. Nous avons créé un outil pour vous faciliter la tâche.",
        accessDeletionTool: "Accéder à l'outil de suppression",
        unknown: "Inconnu",
        categories: {
            messaging: "Messagerie",
            socialNetworks: "Réseaux sociaux",
            gps: "GPS",
            streaming: "Streaming",
            cloud: "Cloud",
            ecommerce: "E-commerce",
            businessChat: "Messages entreprises",
            gaming: "Jeu-vidéo",
            ai: "IA"
        },
        suggestionCategories: {
            whatsapp: "Messagerie",
            instagram: "Réseau social",
            netflix: "Streaming",
            zoom: "Visioconférence",
            tiktok: "Vidéo"
        },
        countries: {
            france: "France",
            "united states": "États-Unis",
            china: "Chine",
            "south korea": "Corée du Sud",
            japan: "Japon",
            russia: "Russie",
            germany: "Allemagne",
            brazil: "Brésil",
            vietnam: "Vietnam",
            netherlands: "Pays-Bas",
            switzerland: "Suisse",
            panama: "Panama",
            israel: "Israël",
            india: "Inde",
            "united kingdom": "Royaume-Uni",
            ireland: "Irlande",
            singapore: "Singapour"
        },
        links: {
            serviceDetail: "/liste-applications",
            deleteMyData: "/supprimer-mes-donnees",
            contribute: "/contribuer"
        }
    },
    en: {
        title: "Custom Service Comparison",
        subtitle: "Search and compare up to 3 services to analyze their permissions, trackers and privacy points",
        experimentalWarning: "This comparison is <strong>experimental</strong>. Data may contain inaccuracies.",
        suggestCorrections: "suggest corrections",
        quickComparison: "Start a quick comparison",
        quickSuggestions: "Quick suggestions",
        orSearchManually: "or search manually",
        searchPlaceholder: "Search for a service...",
        selectedServices: "Selected services",
        startOver: "Start over",
        useSearchBar: "Use the search bar to add services to compare",
        quickVerdict: "Quick Verdict",
        fairlyReliable: "Fairly reliable",
        critical: "Critical",
        monitorClosely: "Monitor closely",
        moderateRisk: "Moderate risk",
        unknownData: "Unknown data",
        sensitivePermissions: "sensitive permissions",
        permissionAccess: "Microphone, camera, contacts access...",
        adTrackers: "advertising trackers",
        trackingActivity: "Tracking your activity",
        legalIssues: "legal issues",
        abusiveTerms: "Abusive terms of service",
        viewDetails: "View details",
        whyDeleteData: "Why delete your data?",
        whyDeleteDataDesc: "If a service collects too much information or poses risks to your privacy, the best way to protect yourself is often to delete your account and data. Our tool guides you step by step.",
        dataAccessPrivacy: "Data Access & Privacy",
        dataAccessEase: "Data access ease",
        dataAccessEaseDesc: "Rating out of 5 for ease of retrieving your info",
        notSpecified: "Not specified",
        idDocuments: "ID documents required",
        idDocumentsDesc: "Do you need to send your ID card?",
        yes: "Yes",
        no: "No",
        documentDetails: "Document details",
        storageOutsideEU: "Storage outside EU",
        storageOutsideEUDesc: "Does your data leave Europe?",
        destinationCountries: "Destination countries",
        sanctioned: "Previously sanctioned (CNIL/GDPR)",
        sanctionedDesc: "Has the company been fined before?",
        sanctionDetails: "Sanction details",
        avgResponseTime: "Average response time",
        sensitivePermissionsTitle: "Sensitive Permissions",
        sensitivePermissionsDesc: "Access to critical features of your phone",
        totalDangerousPermissions: "TOTAL Dangerous Permissions",
        access: "ACCESS",
        trackersTitle: "Trackers",
        trackersDesc: "Advertising and analytics trackers",
        totalTrackers: "TOTAL Trackers",
        present: "Present",
        warningPoints: "Warning Points (ToS;DR)",
        warningPointsDesc: "Issues in terms of service",
        totalNegativePoints: "TOTAL Negative Points",
        addMoreServices: "Add at least one more service to start the comparison",
        takeControl: "Want to take back control?",
        takeControlDesc: "If these results concern you, know that you have the right to request the deletion of your personal data. We have created a tool to help you with this process.",
        accessDeletionTool: "Access the deletion tool",
        unknown: "Unknown",
        categories: {
            messaging: "Messaging",
            socialNetworks: "Social networks",
            gps: "GPS",
            streaming: "Streaming",
            cloud: "Cloud",
            ecommerce: "E-commerce",
            businessChat: "Business chat",
            gaming: "Gaming",
            ai: "AI"
        },
        suggestionCategories: {
            whatsapp: "Messaging",
            instagram: "Social network",
            netflix: "Streaming",
            zoom: "Video conferencing",
            tiktok: "Video"
        },
        countries: {
            france: "France",
            "united states": "United States",
            china: "China",
            "south korea": "South Korea",
            japan: "Japan",
            russia: "Russia",
            germany: "Germany",
            brazil: "Brazil",
            vietnam: "Vietnam",
            netherlands: "Netherlands",
            switzerland: "Switzerland",
            panama: "Panama",
            israel: "Israel",
            india: "India",
            "united kingdom": "United Kingdom",
            ireland: "Ireland",
            singapore: "Singapore"
        },
        links: {
            serviceDetail: "/list-app",
            deleteMyData: "/delete-my-data",
            contribute: "/contribute"
        }
    }
};

function capitalizeFirstLetter(val: string) {
    return String(val).trim().charAt(0).toUpperCase() + String(val).slice(1);
}

export default function ComparatifComponent({ locale }: ComparatifComponentProps) {
    const t = translations[locale];
    const permissionsDataRaw = locale === 'fr' ? permissionsDataRawFr : permissionsDataRawEn;
    const searchParams = useSearchParams();

    const availableServices: Service[] = allServices as unknown as Service[];
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [initialized, setInitialized] = useState(false);

    // Comparison data
    const [permissions, setPermissions] = useState<{ [key: string]: AppPermissions }>({});
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [dangerousPermissionsList, setDangerousPermissionsList] = useState<Permission[]>([]);
    const [servicesData, setServicesData] = useState<{ [key: string]: ServiceData }>({});
    const [manualDataCache, setManualDataCache] = useState<{ [key: string]: any }>({});
    const comparisonRef = useRef<HTMLDivElement>(null);

    // Quick suggestions
    const quickSuggestions = useMemo(() => [
        {name: "WhatsApp", slug: "whatsapp", category: t.suggestionCategories.whatsapp},
        {name: "Instagram", slug: "instagram", category: t.suggestionCategories.instagram},
        {name: "Netflix", slug: "netflix", category: t.suggestionCategories.netflix},
        {name: "Zoom", slug: "zoom", category: t.suggestionCategories.zoom},
        {name: "TikTok", slug: "tiktok", category: t.suggestionCategories.tiktok}
    ], [t.suggestionCategories]);

    // Pre-configured popular comparisons
    const popularComparisons = useMemo(() => [
        {
            name: t.categories.messaging,
            services: ["whatsapp", "telegram", "signal"],
            icon: "💬",
            color: "bg-green-50 text-green-600 border-green-200"
        },
        {
            name: t.categories.socialNetworks,
            services: ["instagram", "tiktok", "snapchat"],
            icon: "📱",
            color: "bg-pink-50 text-pink-600 border-pink-200"
        },
        {
            name: t.categories.gps,
            services: ["google-maps", "waze", "osmand"],
            icon: "🗺️",
            color: "bg-blue-50 text-blue-600 border-blue-200"
        },
        {
            name: t.categories.streaming,
            services: ["netflix", "disneyplus", "amazon-prime-video"],
            icon: "🎬",
            color: "bg-purple-50 text-purple-600 border-purple-200"
        },
        {
            name: t.categories.cloud,
            services: ["google-drive", "proton-drive", "onedrive"],
            icon: "☁️",
            color: "bg-sky-50 text-sky-600 border-sky-200"
        },
        {
            name: t.categories.ecommerce,
            services: ["amazon", "aliexpress", "temu"],
            icon: "🛒",
            color: "bg-orange-50 text-orange-600 border-orange-200"
        },
        {
            name: t.categories.businessChat,
            services: ["slack", "rocketchat", "microsoft-teams"],
            icon: "💼",
            color: "bg-blue-50 text-blue-600 border-blue-200"
        },
        {
            name: t.categories.gaming,
            services: ["rockstar-games", "pokemon-go", "candy-crush"],
            icon: "🎮",
            color: "bg-red-50 text-red-600 border-red-200"
        },
        {
            name: t.categories.ai,
            services: ["chatgpt", "claude", "gemini"],
            icon: "🤖",
            color: "bg-indigo-50 text-indigo-600 border-indigo-200"
        }
    ], [t.categories]);

    // Initialize from URL params
    useEffect(() => {
        if (initialized) return;

        const servicesParam = searchParams.get('services');
        if (servicesParam) {
            const slugs = servicesParam.split(',').map(s => s.trim()).filter(Boolean);
            let servicesToAdd = availableServices.filter(service =>
                slugs.includes(service.slug)
            );

            // If only one service is provided, try to find alternatives
            if (servicesToAdd.length === 1) {
                const slug = servicesToAdd[0].slug;

                // 1. Try from hardcoded ALTERNATIVES
                let alts = getAlternatives(slug);

                // 2. If nothing found, try from popularComparisons
                if (alts.length === 0) {
                     const group = popularComparisons.find(g => g.services.includes(slug));
                     if (group) {
                         alts = group.services.filter(s => s !== slug);
                     }
                }

                if (alts.length > 0) {
                    const altServices = availableServices.filter(s => alts.includes(s.slug));
                    // Prioritize finding 2 alternatives to reach 3 total
                    servicesToAdd = [...servicesToAdd, ...altServices.slice(0, 2)];
                }
            }

            servicesToAdd = servicesToAdd.slice(0, 3);

            if (servicesToAdd.length > 0) {
                setSelectedServices(servicesToAdd);
            }
        }
        setInitialized(true);
    }, [searchParams, availableServices, initialized, popularComparisons]);

    const addService = useCallback(async (service: Service) => {
        if (selectedServices.length < 3 && !selectedServices.some(s => s.slug === service.slug)) {
            setSelectedServices(prev => [...prev, service]);
            setSearchTerm("");
            setShowSuggestions(false);
        }
    }, [selectedServices]);

    // Function to load a pre-configured comparison
    const loadPreConfiguredComparison = useCallback((comparisonServices: string[]) => {
        const servicesToAdd = availableServices.filter(service =>
            comparisonServices.includes(service.slug)
        );
        const validServices = servicesToAdd.slice(0, 3);
        setSelectedServices(validServices);

        setTimeout(() => {
            comparisonRef.current?.scrollIntoView({behavior: "smooth"});
        }, 300);
    }, [availableServices]);

    // Function to add a quick suggestion
    const addQuickSuggestion = useCallback((slug: string) => {
        const service = availableServices.find(s => s.slug === slug);
        if (service) {
            addService(service);
        }
    }, [availableServices, addService]);

    // Filter quick suggestions
    const availableQuickSuggestions = useMemo(() => {
        const selectedSlugs = new Set(selectedServices.map(s => s.slug));
        const availableSlugs = new Set(availableServices.map(s => s.slug));

        return quickSuggestions.filter(suggestion =>
            availableSlugs.has(suggestion.slug) && !selectedSlugs.has(suggestion.slug)
        );
    }, [selectedServices, availableServices, quickSuggestions]);

    // Fetch comparison data
    useEffect(() => {
        const fetchComparisonData = async () => {
            if (selectedServices.length === 0) return;

            try {
                const permissionsData = permissionsDataRaw;
                const trackersData = trackersDataRaw;

                const dangerousPerms = Object.values(permissionsData[0].permissions)
                    .filter((perm: any) => perm.protection_level.includes("dangerous"))
                    .map((perm: any) => ({
                        ...perm,
                        description: perm.description || perm.name,
                    }));

                setDangerousPermissionsList(dangerousPerms);
                setTrackers(trackersData as unknown as Tracker[]);

                const serviceDataPromises = selectedServices.map(async (service) => {
                    const [compareModule, tosdrModule, manualModule] = await Promise.all([
                        import(`../public/data/compare/${service.slug}.json`).catch(() => null),
                        import(`../public/data/compare/tosdr/${service.slug}.json`).catch(() => null),
                        import(`../public/data/manual/${service.slug}.json`).catch(() => null)
                    ]);

                    const results: {
                        permissions?: AppPermissions;
                        serviceData?: ServiceData;
                        manualData?: any;
                    } = {};

                    if (compareModule) {
                        results.permissions = compareModule.default || compareModule;
                    }

                    if (tosdrModule) {
                        const tosdrData = tosdrModule.default || tosdrModule;
                        results.serviceData = {
                            name: tosdrData.name ? tosdrData.name.replace("apps", "").trim() : service.name,
                            logo: service.logo,
                            points: tosdrData.points?.filter(
                                (point: ServicePoint) =>
                                    point.status === "approved" &&
                                    ["bad", "neutral", "good", "blocker"].includes(point.case.classification)
                            ) || [],
                        };
                    }

                    if (manualModule) {
                        results.manualData = manualModule.default || manualModule;
                    }

                    return {slug: service.slug, ...results};
                });

                const results = await Promise.all(serviceDataPromises);

                const newPermissions: { [key: string]: AppPermissions } = {};
                const newServicesData: { [key: string]: ServiceData } = {};
                const newManualDataCache: { [key: string]: any } = {};

                results.forEach(({slug, permissions, serviceData, manualData}) => {
                    if (permissions) newPermissions[slug] = permissions;
                    if (serviceData) newServicesData[slug] = serviceData;
                    if (manualData) newManualDataCache[slug] = manualData;
                });

                setPermissions(newPermissions);
                setServicesData(newServicesData);
                setManualDataCache(newManualDataCache);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        fetchComparisonData();
    }, [selectedServices, permissionsDataRaw]);

    // Memoized filtering
    const filteredServices = useMemo(() => {
        if (!searchTerm || searchTerm.length < 2) return [];

        const lowerSearchTerm = searchTerm.toLowerCase();
        const selectedSlugs = new Set(selectedServices.map(s => s.slug));

        return availableServices
            .filter(service =>
                service.name.toLowerCase().includes(lowerSearchTerm) &&
                !selectedSlugs.has(service.slug)
            )
            .slice(0, 5);
    }, [searchTerm, availableServices, selectedServices]);

    const removeService = useCallback((slug: string) => {
        setSelectedServices(prev => prev.filter(service => service.slug !== slug));
    }, []);

    const getCountryFlagUrl = (countryName: string): { url: string; formattedName: string } => {
        const countryISOCodes: { [key: string]: { code: string } } = {
            france: {code: "fr"},
            "united states": {code: "us"},
            china: {code: "cn"},
            "south korea": {code: "kr"},
            japan: {code: "jp"},
            russia: {code: "ru"},
            germany: {code: "de"},
            brazil: {code: "br"},
            vietnam: {code: "vn"},
            netherlands: {code: "nl"},
            switzerland: {code: "ch"},
            panama: {code: "pa"},
            israel: {code: "il"},
            india: {code: "in"},
            "united kingdom": {code: "gb"},
            ireland: {code: "ie"},
            singapore: {code: "sg"},
        };

        const countryKey = countryName.toLowerCase();
        const countryInfo = countryISOCodes[countryKey];
        const localizedName = t.countries[countryKey as keyof typeof t.countries] || t.unknown;

        return {
            url: countryInfo ? `https://flagcdn.com/w20/${countryInfo.code}.png` : "/images/globe-icon.png",
            formattedName: localizedName,
        };
    };

    // Memoized unique bad point titles
    const uniqueBadPointTitles = useMemo(() => {
        const titles = Object.values(servicesData)
            .flatMap(service =>
                service.points
                    .filter(point => point.case.classification === "bad")
                    .map(point => point.case.localized_title || point.case.title)
            );
        return Array.from(new Set(titles));
    }, [servicesData]);

    const dangerousCounts = selectedServices.map(service => {
        if (!service.exodus || !permissions[service.slug]) {
            return {
                slug: service.slug,
                name: service.name,
                count: null
            };
        }
        return {
            slug: service.slug,
            name: service.name,
            count: dangerousPermissionsList.filter(permission =>
                permissions[service.slug]?.permissions.includes(permission.name)
            ).length
        };
    });

    const trackerCounts = selectedServices.map(service => {
        if (!service.exodus || !permissions[service.slug]) {
            return {
                slug: service.slug,
                name: service.name,
                count: null
            };
        }
        return {
            slug: service.slug,
            name: service.name,
            count: trackers.filter(tracker =>
                permissions[service.slug]?.trackers?.includes(tracker.id)
            ).length
        };
    });

    const badPointCounts = selectedServices.map(service => {
        if ("" === service.tosdr || !servicesData[service.slug]) {
            return {
                slug: service.slug,
                name: service.name,
                count: null
            };
        }
        return {
            slug: service.slug,
            name: service.name,
            count: servicesData[service.slug]?.points.filter(
                point => point.case.classification === "bad"
            ).length || 0
        };
    });

    const {setLang} = useLanguage();
    useEffect(() => {
        setLang(locale);
    }, [locale, setLang]);

    // Helper to get localized manual data field
    const getManualField = (manualData: any, fieldName: string) => {
        if (!manualData) return null;
        if (locale === 'en') {
            return manualData[`${fieldName}_en`] ?? manualData[fieldName];
        }
        return manualData[fieldName];
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {t.title}
                </h1>
                <p className="text-gray-600 mb-6">
                    {t.subtitle}
                </p>

                <div className="inline-flex items-center justify-center bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 max-w-2xl mx-auto">
                    <Info className="w-5 h-5 mr-3 flex-shrink-0 text-amber-600" />
                    <p>
                        <span dangerouslySetInnerHTML={{ __html: t.experimentalWarning }} /> <br className="hidden sm:block"/>
                        {locale === 'fr' ? "Si vous constatez des erreurs, n'hésitez pas à " : "If you notice any errors, feel free to "}
                        <Link href={t.links.contribute} className="underline font-semibold hover:text-amber-900">
                            {t.suggestCorrections}
                        </Link>.
                    </p>
                </div>
            </div>

            {/* Pre-configured comparisons */}
            <div className="mb-10">
                <div className="flex items-center justify-center mb-6">
                    <Sparkles className="w-5 h-5 text-blue-600 mr-2"/>
                    <h2 className="text-xl font-semibold text-gray-800">{t.quickComparison}</h2>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3 mb-6">
                    {popularComparisons.map((comparison, index) => (
                        <button
                            key={index}
                            className={`cursor-pointer aspect-square flex flex-col items-center justify-center p-2 rounded-xl border hover:shadow-md transition-all hover:-translate-y-1 ${comparison.color}`}
                            onClick={() => loadPreConfiguredComparison(comparison.services)}
                        >
                            <span className="text-2xl mb-2">{comparison.icon}</span>
                            <span className="text-xs font-bold text-center leading-tight">{comparison.name}</span>
                        </button>
                    ))}
                </div>

                {/* Quick suggestions */}
                {availableQuickSuggestions.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">{t.quickSuggestions}</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableQuickSuggestions.slice(0, 8).map((suggestion) => (
                                <button
                                    key={suggestion.slug}
                                    onClick={() => addQuickSuggestion(suggestion.slug)}
                                    disabled={selectedServices.length >= 3}
                                    className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-3 h-3 mr-1"/>
                                    {suggestion.name}
                                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                        {suggestion.category}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Separator */}
                <div className="flex items-center mb-6">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500 bg-white">{t.orSearchManually}</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
            </div>

            {/* Search bar */}
            <div className="relative mb-8 max-w-md mx-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={selectedServices.length >= 3}
                    />
                </div>

                {/* Autocomplete suggestions */}
                {showSuggestions && filteredServices.length > 0 && selectedServices.length < 3 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                        {filteredServices.map((service) => (
                            <button
                                key={service.slug}
                                onClick={() => addService(service)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                            >
                                <Image
                                    src={service.logo}
                                    alt={service.name}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                                <div>
                                    <div className="font-medium">{service.name}</div>
                                    {service.short_description && (
                                        <div className="text-sm text-gray-500">{service.short_description}</div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected services */}
            {selectedServices.length > 0 && (
                <div ref={comparisonRef} className="mb-8">
                    <div className={"flex flex-row items-center align-middle justify-between" + (selectedServices.length >= 3 ? " mb-4" : "")}>
                        <h2 className="text-xl font-semibold mb-4">{t.selectedServices} ({selectedServices.length}/3)</h2>
                        <button
                            onClick={() => setSelectedServices([])}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                            {t.startOver}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {selectedServices.map((service) => (
                            <div key={service.slug} className="flex items-center bg-blue-100 rounded-full px-4 py-2">
                                <Image
                                    src={service.logo}
                                    alt={service.name}
                                    width={20}
                                    height={20}
                                    className="object-contain mr-2"
                                />
                                <span className="text-sm font-medium">{service.name}</span>
                                <button
                                    onClick={() => removeService(service.slug)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    <X className="w-4 h-4"/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Message if no service selected */}
            {selectedServices.length === 0 && (
                <div className="text-center py-5">
                    <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                    <p className="text-gray-500 text-lg">
                        {t.useSearchBar}
                    </p>
                </div>
            )}

            {/* Comparison */}
            {selectedServices.length >= 2 && (
                <div className="space-y-8">
                    {/* Quick Verdict */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <Sparkles className="w-5 h-5 text-blue-600 mr-2"/>
                            {t.quickVerdict}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {selectedServices.map(service => {
                                const dCount = dangerousCounts.find(c => c.slug === service.slug)?.count || 0;
                                const tCount = trackerCounts.find(c => c.slug === service.slug)?.count || 0;
                                const bCount = badPointCounts.find(c => c.slug === service.slug)?.count || 0;

                                let riskScore = 0;
                                if (dCount > 0) riskScore += 1;
                                if (dCount > 5) riskScore += 2;
                                if (dCount > 9) riskScore += 4;
                                if (tCount > 0) riskScore += 1;
                                if (tCount > 3) riskScore += 2;
                                if (tCount > 5) riskScore += 4;
                                if (tCount > 10) riskScore += 8;
                                if (bCount > 5) riskScore += 1;
                                if (bCount > 10) riskScore += 2;
                                if (bCount > 20) riskScore += 5;

                                let status = {
                                    label: t.fairlyReliable,
                                    color: "text-green-700",
                                    bg: "bg-green-50",
                                    icon: ShieldCheck
                                };
                                if (riskScore > 10) {
                                    status = {
                                        label: t.critical,
                                        color: "text-red-700",
                                        bg: "bg-red-50",
                                        icon: ShieldAlert
                                    };
                                } else if (riskScore > 5) {
                                    status = {
                                        label: t.monitorClosely,
                                        color: "text-amber-700",
                                        bg: "bg-orange-50",
                                        icon: AlertTriangle
                                    };
                                } else if (riskScore > 2) {
                                    status = {
                                        label: t.moderateRisk,
                                        color: "text-orange-700",
                                        bg: "bg-amber-50",
                                        icon: AlertTriangle
                                    };
                                }

                                const StatusIcon = status.icon;

                                return (
                                    <div key={service.slug}
                                         className={`p-4 rounded-lg border ${status.bg} border-opacity-50 flex flex-col items-center text-center`}>
                                        <Image src={service.logo} alt={service.name} width={48} height={48}
                                               className="mb-3 object-contain"/>
                                        <h3 className="font-bold text-lg mb-1">{service.name}</h3>

                                        <div className={`flex items-center space-x-1 mb-3 ${status.color} font-bold`}>
                                            <StatusIcon className="w-4 h-4"/>
                                            <span>{status.label}</span>
                                        </div>

                                        <div className="text-sm text-gray-600 mb-4 space-y-2 w-full text-left">
                                            <div className="flex items-start">
                                                <span className={`mr-2 ${dCount === null ? "text-gray-400" : dCount > 0 ? "text-red-500" : "text-green-500"}`}>
                                                    {dCount === null ? "❓" : dCount > 0 ? "⚠️" : "✅"}
                                                </span>
                                                <p className="text-xs leading-tight">
                                                    <span className="font-semibold">{dCount === null ? t.unknownData : `${dCount} ${t.sensitivePermissions}`}</span>
                                                    {dCount !== null && dCount > 0 && <span className="block text-gray-500 text-[10px]">{t.permissionAccess}</span>}
                                                </p>
                                            </div>
                                            <div className="flex items-start">
                                                <span className={`mr-2 ${tCount === null ? "text-gray-400" : tCount > 0 ? "text-red-500" : "text-green-500"}`}>
                                                    {tCount === null ? "❓" : tCount > 0 ? "👁️" : "✅"}
                                                </span>
                                                <p className="text-xs leading-tight">
                                                    <span className="font-semibold">{tCount === null ? t.unknownData : `${tCount} ${t.adTrackers}`}</span>
                                                    {tCount !== null && tCount > 0 && <span className="block text-gray-500 text-[10px]">{t.trackingActivity}</span>}
                                                </p>
                                            </div>
                                            <div className="flex items-start">
                                                <span className={`mr-2 ${bCount === null ? "text-gray-400" : bCount > 0 ? "text-orange-500" : "text-green-500"}`}>
                                                    {bCount === null ? "❓" : bCount > 0 ? "⚖️" : "✅"}
                                                </span>
                                                <p className="text-xs leading-tight">
                                                    <span className="font-semibold">{bCount === null || service.tosdr === "" ? t.unknownData : `${bCount} ${t.legalIssues}`}</span>
                                                    {bCount !== null && bCount > 0 && <span className="block text-gray-500 text-[10px]">{t.abusiveTerms}</span>}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`${t.links.serviceDetail}/${service.slug}`}
                                            className="mt-auto w-full py-2 px-4 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                                        >
                                            {t.viewDetails}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 bg-blue-50 p-4 rounded-lg flex items-start">
                            <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-blue-600"/>
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-900 text-sm mb-1">{t.whyDeleteData}</h4>
                                <p className="text-sm text-blue-800">
                                    {t.whyDeleteDataDesc}
                                </p>
                            </div>
                        </div>
                    </div>

                    <section id={"privacy-data-access"} className="p-4">
                        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                            <table className="w-full border-collapse bg-white text-sm">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-left font-semibold text-gray-900 border-b border-gray-200 w-1/3">
                                        <div className="flex items-center">
                                            <ShieldCheck className="w-5 h-5 mr-2 text-blue-600"/>
                                            {t.dataAccessPrivacy}
                                        </div>
                                    </th>
                                    {selectedServices.map((service) => (
                                        <th key={service.slug}
                                            className="p-4 text-center border-b border-gray-200 min-w-[140px] align-middle">
                                            <div className="flex flex-col items-center space-y-2">
                                                <div className="relative w-12 h-12 bg-white rounded-lg shadow-sm p-1 border border-gray-100">
                                                    <Image
                                                        src={service.logo}
                                                        alt={service.name}
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                </div>
                                                <span className="font-bold text-gray-800">{service.name}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {/* Data access ease */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        {t.dataAccessEase}
                                        <p className="text-xs text-gray-400 font-normal mt-0.5">{t.dataAccessEaseDesc}</p>
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        let easyAccess = manualData?.easy_access_data;

                                        let displayValue = t.notSpecified;

                                        if (easyAccess !== undefined && easyAccess !== null) {
                                            if (typeof easyAccess === 'string' && easyAccess.includes('/5')) {
                                                displayValue = easyAccess;
                                            } else if (typeof easyAccess === 'number') {
                                                displayValue = `${easyAccess}/5`;
                                            } else if (typeof easyAccess === 'string' && !isNaN(Number(easyAccess))) {
                                                const numericValue = Number(easyAccess);
                                                displayValue = `${numericValue}/5`;
                                                if (0 === numericValue) {
                                                    displayValue = ''
                                                }
                                            }
                                        }

                                        let classColor = 'bg-gray-100 text-gray-500';
                                        if("5/5" === displayValue){
                                            classColor = 'bg-green-100 text-green-900';
                                        }
                                        else if("4/5" === displayValue){
                                            classColor = "bg-green-100 text-green-700";
                                        }
                                        else if("3/5" === displayValue){
                                            classColor = "bg-yellow-100 text-yellow-700";
                                        }
                                        else if("2/5" === displayValue){
                                            classColor =  'bg-red-100 text-red-700'
                                        }
                                        else if("1/5" === displayValue){
                                            classColor = 'bg-red-100 text-red-900'
                                        }

                                        return (
                                            <td key={service.slug} className="p-4 text-center align-middle">
                                                <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold ${classColor}`}>
                                                    {capitalizeFirstLetter(displayValue)}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Required documents */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        {t.idDocuments}
                                        <p className="text-xs text-gray-400 font-normal mt-0.5">{t.idDocumentsDesc}</p>
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const needIdCard = manualData?.need_id_card;

                                        return (
                                            <td key={service.slug} className="p-4 text-center">
                                                {needIdCard === true ? (
                                                    <span className="inline-flex items-center text-red-600 bg-red-50 px-2 py-1 rounded">
                                                        <X className="w-4 h-4 mr-1" /> {t.yes}
                                                    </span>
                                                ) : needIdCard === false ? (
                                                    <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                                        <ShieldCheck className="w-4 h-4 mr-1" /> {t.no}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Document details */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        {t.documentDetails}
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const details = getManualField(manualData, 'details_required_documents');

                                        return (
                                            <td key={service.slug} className="p-4 text-center text-gray-600 text-xs">
                                                {capitalizeFirstLetter(details) || '-'}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Data transfer outside EU */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        {t.storageOutsideEU}
                                        <p className="text-xs text-gray-400 font-normal mt-0.5">{t.storageOutsideEUDesc}</p>
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const outsideEU = manualData?.outside_eu_storage;

                                        return (
                                            <td key={service.slug} className="p-4 text-center">
                                                {outsideEU === true ? (
                                                    <span className="inline-flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                                        ⚠️ {t.yes}
                                                    </span>
                                                ) : outsideEU === false ? (
                                                    <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                                        <ShieldCheck className="w-4 h-4 mr-1" /> {t.no}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Destination countries */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        {t.destinationCountries}
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const transferCountries = getManualField(manualData, 'transfer_destination_countries');

                                        return (
                                            <td key={service.slug} className="p-4 text-center text-xs text-gray-600">
                                                {transferCountries || '-'}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* CNIL/GDPR Sanctions */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        {t.sanctioned}
                                        <p className="text-xs text-gray-400 font-normal mt-0.5">{t.sanctionedDesc}</p>
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const sanctioned = manualData?.sanctioned_by_cnil;

                                        return (
                                            <td key={service.slug} className="p-4 text-center">
                                                {sanctioned === true ? (
                                                    <span className="inline-flex items-center text-red-600 bg-red-50 px-2 py-1 rounded font-bold">
                                                        ⚠️ {t.yes.toUpperCase()}
                                                    </span>
                                                ) : sanctioned === false ? (
                                                    <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                                        {t.no}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Sanction details */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        {t.sanctionDetails}
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const sanctionDetails = getManualField(manualData, 'sanction_details');

                                        return (
                                            <td key={service.slug} className="p-4 text-center text-xs text-gray-600">
                                                {sanctionDetails ? (
                                                    <div className="max-w-xs mx-auto text-left">
                                                        <ReactMarkdown>{sanctionDetails.replaceAll('<br>', '\n').replaceAll('\n', ' \n ')}</ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Response time */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        {t.avgResponseTime}
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const responseDelay = getManualField(manualData, 'response_delay') ?? "";

                                        return (
                                            <td key={service.slug} className="p-4 text-center text-sm font-medium text-gray-700">
                                                {capitalizeFirstLetter(responseDelay) || '-'}
                                            </td>
                                        );
                                    })}
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Dangerous permissions */}
                    {Object.keys(permissions).length > 0 && (
                        <section id={"permissions"} className="p-4">
                            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                                <table className="w-full border-collapse bg-white text-sm">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-left font-semibold text-gray-900 border-b border-gray-200 w-1/3">
                                            <div className="flex items-center">
                                                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600"/>
                                                {t.sensitivePermissionsTitle}
                                            </div>
                                            <p className="text-xs text-gray-500 font-normal mt-1">{t.sensitivePermissionsDesc}</p>
                                        </th>
                                        {selectedServices.map((service) => (
                                            <th key={service.slug}
                                                className="p-4 text-center border-b border-gray-200 min-w-[140px]">
                                                <div className="flex flex-col items-center">
                                                    <div className="relative w-8 h-8 mb-2">
                                                        <Image
                                                            src={service.logo}
                                                            alt={service.name}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{service.name}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    <tr className="bg-red-50">
                                        <td className="p-4 font-bold text-red-800">
                                            {t.totalDangerousPermissions}
                                        </td>
                                        {dangerousCounts.map(({slug, count}) => (
                                            <td key={slug}
                                                className={`p-4 text-center font-bold text-lg ${count === null ? "text-gray-400" : count > 0 ? "text-red-600" : "text-green-600"}`}>
                                                {count === null ? "?" : count}
                                            </td>
                                        ))}
                                    </tr>
                                    {dangerousPermissionsList
                                        .filter((permission) =>
                                            selectedServices.some((service) =>
                                                permissions[service.slug]?.permissions.includes(permission.name)
                                            )
                                        )
                                        .map((permission) => (
                                            <tr key={permission.name} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 text-gray-700 font-medium">
                                                    {capitalizeFirstLetter(permission.label || permission.name)}
                                                    <p className="text-xs text-gray-400 font-normal mt-0.5">{permission.description}</p>
                                                </td>
                                                {selectedServices.map((service) => (
                                                    <td key={service.slug} className="p-4 text-center">
                                                        {permissions[service.slug]?.permissions.includes(permission.name) ? (
                                                            <div className="flex flex-col items-center">
                                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 mb-1">
                                                                    <AlertTriangle className="w-5 h-5" />
                                                                </span>
                                                                <span className="text-xs font-bold text-red-600">{t.access}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mb-1">
                                                                    <ShieldCheck className="w-5 h-5" />
                                                                </span>
                                                                <span className="text-xs font-medium text-green-600">{t.no}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Trackers */}
                    {trackers.length > 0 && Object.keys(permissions).length > 0 && (
                        <section id={"trackers"} className="p-4">
                            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                                <table className="w-full border-collapse bg-white text-sm">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-left font-semibold text-gray-900 border-b border-gray-200 w-1/3">
                                            <div className="flex items-center">
                                                <ExternalLink className="w-5 h-5 mr-2 text-purple-600"/>
                                                {t.trackersTitle}
                                            </div>
                                            <p className="text-xs text-gray-500 font-normal mt-1">{t.trackersDesc}</p>
                                        </th>
                                        {selectedServices.map((service) => (
                                            <th key={service.slug}
                                                className="p-4 text-center border-b border-gray-200 min-w-[140px]">
                                                <div className="flex flex-col items-center">
                                                    <div className="relative w-8 h-8 mb-2">
                                                        <Image
                                                            src={service.logo}
                                                            alt={service.name}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{service.name}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    <tr className="bg-purple-50">
                                        <td className="p-4 font-bold text-purple-800">
                                            {t.totalTrackers}
                                        </td>
                                        {trackerCounts.map(({slug, count}) => (
                                            <td key={slug}
                                                className={`p-4 text-center font-bold text-lg ${count === null ? "text-gray-400" : count > 0 ? "text-purple-700" : "text-green-600"}`}>
                                                {count === null ? "?" : count}
                                            </td>
                                        ))}
                                    </tr>
                                    {trackers
                                        .filter((tracker) =>
                                            selectedServices.some((service) =>
                                                permissions[service.slug]?.trackers?.includes(tracker.id)
                                            )
                                        )
                                        .map((tracker) => (
                                            <tr key={tracker.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 text-gray-700 font-medium">
                                                    <div className="flex items-center">
                                                        <div className="relative w-5 h-4 mr-2 flex-shrink-0">
                                                            <Image
                                                                src={getCountryFlagUrl(tracker.country).url}
                                                                alt={`${locale === 'fr' ? 'Drapeau de' : 'Flag of'} ${getCountryFlagUrl(tracker.country).formattedName}`}
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                        <p>
                                                            {tracker.name}
                                                        </p>
                                                    </div>
                                                </td>
                                                {selectedServices.map((service) => (
                                                    <td key={service.slug} className="p-4 text-center">
                                                        {permissions[service.slug]?.trackers?.includes(tracker.id) ? (
                                                            <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold">
                                                                {t.present}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-300">-</span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Negative points */}
                    {Object.keys(servicesData).length > 0 && (
                        <section id={locale === 'fr' ? "points-negatifs" : "negative-points"} className="p-4">
                            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                                <table className="w-full border-collapse bg-white text-sm">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-left font-semibold text-gray-900 border-b border-gray-200 w-1/3">
                                            <div className="flex items-center">
                                                <AlertTriangle className="w-5 h-5 mr-2 text-red-600"/>
                                                {t.warningPoints}
                                            </div>
                                            <p className="text-xs text-gray-500 font-normal mt-1">{t.warningPointsDesc}</p>
                                        </th>
                                        {selectedServices.map((service) => (
                                            <th key={service.slug}
                                                className="p-4 text-center border-b border-gray-200 min-w-[140px]">
                                                <div className="flex flex-col items-center">
                                                    <div className="relative w-8 h-8 mb-2">
                                                        <Image
                                                            src={service.logo}
                                                            alt={service.name}
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{service.name}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    <tr className="bg-red-50">
                                        <td className="p-4 font-bold text-red-800">
                                            {t.totalNegativePoints}
                                        </td>
                                        {badPointCounts.map(({slug, count}) => (
                                            <td key={slug}
                                                className={`p-4 text-center font-bold text-lg ${count === null ? "text-gray-400" : count > 0 ? "text-red-600" : "text-green-600"}`}>
                                                {count === null ? "?" : count}
                                            </td>
                                        ))}
                                    </tr>
                                    {uniqueBadPointTitles.map((title) => (
                                        <tr key={title} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-gray-700 font-medium text-xs">
                                                {title}
                                            </td>
                                            {selectedServices.map((service) => (
                                                <td key={service.slug} className="p-4 text-center">
                                                    {servicesData[service.slug]?.points.some(
                                                        (point) =>
                                                            point.case.classification === "bad" &&
                                                            (point.case.localized_title === title || point.case.title === title)
                                                    ) ? (
                                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                                                            <X className="w-4 h-4" />
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-300">-</span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* Message if only one service */}
            {selectedServices.length === 1 && (
                <div className="text-center py-8 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700">
                        {t.addMoreServices}
                    </p>
                </div>
            )}

            {/* Hide suggestions when clicking elsewhere */}
            {showSuggestions && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowSuggestions(false)}
                />
            )}

            {/* Deletion CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white shadow-lg mt-12">
                <h2 className="text-2xl font-bold mb-4">{t.takeControl}</h2>
                <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                    {t.takeControlDesc}
                </p>
                <Link
                    href={t.links.deleteMyData}
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-md"
                >
                    {t.accessDeletionTool}
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
