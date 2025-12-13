"use client";

import allServices from '../../public/data/services.json';
import {useState, useEffect, useMemo, useCallback, useRef} from "react";
import Image from "next/image";
import Link from "next/link";
import {Search, X, Plus, Sparkles, ExternalLink, ShieldCheck, ShieldAlert, AlertTriangle, Info, ArrowRight} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {useLanguage} from "@/context/LanguageContext";
import permissionsDataRaw from '../../public/data/compare/permissions_fr.json';
import trackersDataRaw from '../../public/data/compare/trackers.json';

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

function capitalizeFirstLetter(val: string) {
    return String(val).trim().charAt(0).toUpperCase() + String(val).slice(1);
}

// Quick suggestions based on categories
const quickSuggestions = [
    {name: "WhatsApp", slug: "whatsapp", category: "Messagerie"},
    {name: "Instagram", slug: "instagram", category: "Réseau social"},
    {name: "Netflix", slug: "netflix", category: "Streaming"},
    {name: "Zoom", slug: "zoom", category: "Visioconférence"},
    {name: "TikTok", slug: "tiktok", category: "Vidéo"}
];

export default function ComparatifPersonnalise() {
    const availableServices: Service[] = allServices as unknown as Service[];
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Données de comparaison
    const [permissions, setPermissions] = useState<{ [key: string]: AppPermissions }>({});
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [dangerousPermissionsList, setDangerousPermissionsList] = useState<Permission[]>([]);
    const [servicesData, setServicesData] = useState<{ [key: string]: ServiceData }>({});
    const [manualDataCache, setManualDataCache] = useState<{ [key: string]: any }>({});
    const comparisonRef = useRef<HTMLDivElement>(null);

    // Pre-configured popular comparisons
    const popularComparisons = [
        {
            name: "Messagerie",
            services: ["whatsapp", "telegram", "signal"],
            icon: "💬",
            color: "bg-green-50 text-green-600 border-green-200"
        },
        {
            name: "Réseaux sociaux",
            services: ["instagram", "tiktok", "snapchat"],
            icon: "📱",
            color: "bg-pink-50 text-pink-600 border-pink-200"
        },
        {
            name: "GPS",
            services: ["google-maps", "waze", "osmand"],
            icon: "🗺️",
            color: "bg-blue-50 text-blue-600 border-blue-200"
        },
        {
            name: "Streaming",
            services: ["netflix", "disneyplus", "amazon-prime-video"],
            icon: "🎬",
            color: "bg-purple-50 text-purple-600 border-purple-200"
        },
        {
            name: "Cloud",
            services: ["google-drive", "proton-drive", "onedrive"],
            icon: "☁️",
            color: "bg-sky-50 text-sky-600 border-sky-200"
        },
        {
            name: "E-commerce",
            services: ["amazon", "aliexpress", "temu"],
            icon: "🛒",
            color: "bg-orange-50 text-orange-600 border-orange-200"
        },
        // {
        //     name: "Rencontre",
        //     services: ["tinder", "bumble", "hinge"],
        //     icon: "❤️",
        //     color: "bg-rose-50 text-rose-600 border-rose-200"
        // },
        // {
        //     name: "Musique",
        //     services: ["spotify", "deezer", "apple-music"],
        //     icon: "🎵",
        //     color: "bg-teal-50 text-teal-600 border-teal-200"
        // },
        {
            name: "IA",
            services: ["chatgpt", "claude", "gemini"],
            icon: "🤖",
            color: "bg-indigo-50 text-indigo-600 border-indigo-200"
        }
    ];

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

        // Scroll after a short delay to ensure state update
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

    // Filter quick suggestions to show only available ones not already selected
    const availableQuickSuggestions = useMemo(() => {
        const selectedSlugs = new Set(selectedServices.map(s => s.slug));
        const availableSlugs = new Set(availableServices.map(s => s.slug));

        return quickSuggestions.filter(suggestion =>
            availableSlugs.has(suggestion.slug) && !selectedSlugs.has(suggestion.slug)
        );
    }, [selectedServices, availableServices]);

    // Optimized: Parallel API calls for comparison data
    useEffect(() => {
        const fetchComparisonData = async () => {
            if (selectedServices.length === 0) return;

            try {
                // Use static imports
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

                // Fetch service-specific data in parallel
                const serviceDataPromises = selectedServices.map(async (service) => {
                    const [compareModule, tosdrModule, manualModule] = await Promise.all([
                        import(`../../public/data/compare/${service.slug}.json`).catch(() => null),
                        import(`../../public/data/compare/tosdr/${service.slug}.json`).catch(() => null),
                        import(`../../public/data/manual/${service.slug}.json`).catch(() => null)
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

                // Update state once with all results
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
                console.error("Erreur lors du chargement des données:", error);
            }
        };

        fetchComparisonData();
    }, [selectedServices]);

    // Memoized and optimized filtering
    const filteredServices = useMemo(() => {
        if (!searchTerm || searchTerm.length < 2) return []; // Only search after 2 chars

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
        const countryISOCodes: { [key: string]: { code: string; name: string } } = {
            france: {code: "fr", name: "France"},
            "united states": {code: "us", name: "États-Unis"},
            china: {code: "cn", name: "Chine"},
            "south korea": {code: "kr", name: "Corée du Sud"},
            japan: {code: "jp", name: "Japon"},
            russia: {code: "ru", name: "Russie"},
            germany: {code: "de", name: "Allemagne"},
            brazil: {code: "br", name: "Brésil"},
            vietnam: {code: "vn", name: "Vietnam"},
            netherlands: {code: "nl", name: "Pays-Bas"},
            switzerland: {code: "ch", name: "Suisse"},
            panama: {code: "pa", name: "Panama"},
            israel: {code: "il", name: "Israël"},
            india: {code: "in", name: "Inde"},
            "united kingdom": {code: "gb", name: "Royaume-Uni"},
            ireland: {code: "ie", name: "Irlande"},
            singapore: {code: "sg", name: "Singapour"},
        };

        const countryInfo = countryISOCodes[countryName.toLowerCase()];
        return {
            url: countryInfo ? `https://flagcdn.com/w20/${countryInfo.code}.png` : "/images/globe-icon.png",
            formattedName: countryInfo ? countryInfo.name : "Inconnu",
        };
    };

    // Memoized unique good point titles
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

    // Trackers stats
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

    // Bad points stats
    const badPointCounts = selectedServices.map(service => {
        if (!service.tosdr || !servicesData[service.slug]) {
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
    setLang('fr')

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* En-tête */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Comparatif personnalisé de services
                </h1>
                <p className="text-gray-600 mb-6">
                    Recherchez et comparez jusqu&apos;à 3 services pour analyser leurs permissions, trackers et points
                    positifs
                </p>

                <div className="inline-flex items-center justify-center bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 max-w-2xl mx-auto">
                    <Info className="w-5 h-5 mr-3 flex-shrink-0 text-amber-600" />
                    <p>
                        Ce comparatif est <strong>expérimental</strong>. Les données peuvent contenir des inexactitudes. <br className="hidden sm:block"/>
                        Si vous constatez des erreurs, n&apos;hésitez pas à{" "}
                        <Link href="/contribuer" className="underline font-semibold hover:text-amber-900">
                            faire des suggestions de modification
                        </Link>.
                    </p>
                </div>
            </div>

            {/* Pre-configured comparisons - Show only when no services selected */}
            {/*{selectedServices.length === 0 && (*/}
            <div className="mb-10">
                <div className="flex items-center justify-center mb-6">
                    <Sparkles className="w-5 h-5 text-blue-600 mr-2"/>
                    <h2 className="text-xl font-semibold text-gray-800">Lancer un comparatif rapide</h2>
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
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Suggestions rapides</h3>
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
                    <span className="px-4 text-sm text-gray-500 bg-white">ou recherchez manuellement</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
            </div>
            {/*)}*/}


            {/* Barre de recherche */}
            <div className="relative mb-8 max-w-md mx-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                    <input
                        type="text"
                        placeholder="Rechercher un service..."
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

                {/* Suggestions d'autocomplétion */}
                {showSuggestions && filteredServices.length > 0 && selectedServices.length < 3 && (
                    <div
                        className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
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

            {/* Services sélectionnés */}
            {selectedServices.length > 0 && (
                <div ref={comparisonRef} className="mb-8">
                    <div
                        className={"flex flex-row items-center align-middle justify-between" + (selectedServices.length >= 3 ? " mb-4" : "")}>
                        <h2 className="text-xl font-semibold mb-4">Services sélectionnés
                            ({selectedServices.length}/3)</h2>
                        <button
                            onClick={() => setSelectedServices([])}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                            Recommencer
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

            {/* Message si aucun service sélectionné */}
            {selectedServices.length === 0 && (
                <div className="text-center py-5">
                    <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                    <p className="text-gray-500 text-lg">
                        Utilisez la barre de recherche pour ajouter des services à comparer
                    </p>
                </div>
            )}

            {/* Comparaison */}
            {selectedServices.length >= 2 && (
                <div className="space-y-8">
                    {/* Verdict Simplifié */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <Sparkles className="w-5 h-5 text-blue-600 mr-2"/>
                            Verdict Rapide
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
                                    label: "Plutôt fiable",
                                    color: "text-green-700",
                                    bg: "bg-green-50",
                                    icon: ShieldCheck
                                };
                                if (riskScore > 10) {
                                    status = {
                                        label: "Critique",
                                        color: "text-red-700",
                                        bg: "bg-red-50",
                                        icon: ShieldAlert
                                    };
                                }
                                else if (riskScore > 5) {
                                        status = {
                                            label: "À surveiller",
                                            color: "text-amber-700",
                                            bg: "bg-orange-50",
                                            icon: AlertTriangle
                                        };
                                } else if (riskScore > 2) {
                                    status = {
                                        label: "Risque modéré",
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
                                               className="mb-3 object-contain"/>{riskScore}
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
                                                    <span className="font-semibold">{dCount === null ? "Données inconnues" : `${dCount} permissions sensibles`}</span>
                                                    {dCount !== null && dCount > 0 && <span className="block text-gray-500 text-[10px]">Accès micro, caméra, contacts...</span>}
                                                </p>
                                            </div>
                                            <div className="flex items-start">
                                                <span className={`mr-2 ${tCount === null ? "text-gray-400" : tCount > 0 ? "text-red-500" : "text-green-500"}`}>
                                                    {tCount === null ? "❓" : tCount > 0 ? "👁️" : "✅"}
                                                </span>
                                                <p className="text-xs leading-tight">
                                                    <span className="font-semibold">{tCount === null ? "Données inconnues" : `${tCount} pisteurs publicitaires`}</span>
                                                    {tCount !== null && tCount > 0 && <span className="block text-gray-500 text-[10px]">Surveillance de votre activité</span>}
                                                </p>
                                            </div>
                                            <div className="flex items-start">
                                                <span className={`mr-2 ${bCount === null ? "text-gray-400" : bCount > 0 ? "text-orange-500" : "text-green-500"}`}>
                                                    {bCount === null ? "❓" : bCount > 0 ? "⚖️" : "✅"}
                                                </span>
                                                <p className="text-xs leading-tight">
                                                    <span className="font-semibold">{bCount === null || service.tosdr === "" ? "Données inconnues" : `${bCount} points juridiques`}</span>
                                                    {bCount !== null && bCount > 0 && <span className="block text-gray-500 text-[10px]">Conditions d&apos;utilisation abusives</span>}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/liste-applications/${service.slug}`}
                                            className="mt-auto w-full py-2 px-4 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                                        >
                                            Consulter la fiche
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
                                <h4 className="font-semibold text-blue-900 text-sm mb-1">Pourquoi supprimer vos données
                                    ?</h4>
                                <p className="text-sm text-blue-800">
                                    Si un service collecte trop d&apos;informations ou présente des risques pour votre vie
                                    privée,
                                    le meilleur moyen de vous protéger est souvent de supprimer votre compte et vos
                                    données.
                                    Notre outil vous guide étape par étape.
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
                                            Accès aux données & Confidentialité
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
                                {/* Facilité d'accès aux données */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        Facilité d&apos;accès aux données
                                        <p className="text-xs text-gray-400 font-normal mt-0.5">Note sur 5 de la facilité à récupérer vos infos</p>
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        let easyAccess = manualData?.easy_access_data;

                                        // Handle different formats: "3/5" (string) or 1 (number)
                                        let displayValue = 'Non renseigné';
                                        let numericValue = 0;

                                        if (easyAccess !== undefined && easyAccess !== null) {
                                            if (typeof easyAccess === 'string' && easyAccess.includes('/5')) {
                                                // Already formatted like "3/5"
                                                displayValue = easyAccess;
                                                numericValue = parseInt(easyAccess.split('/')[0]) || 0;
                                            } else if (typeof easyAccess === 'number') {
                                                // Just a number, add /5
                                                displayValue = `${easyAccess}/5`;
                                                numericValue = easyAccess;
                                            } else if (typeof easyAccess === 'string' && !isNaN(Number(easyAccess))) {
                                                // String number, convert and add /5
                                                numericValue = Number(easyAccess);
                                                displayValue = `${numericValue}/5`;
                                                if (0 === numericValue) {
                                                    displayValue = ''
                                                }
                                            }
                                        }

                                        // Calculate best/worst only for services with actual data
                                        const allValues = selectedServices
                                            .map((s) => {
                                                const data = manualDataCache[s.slug]?.easy_access_data;
                                                if (data === undefined || data === null) return null;

                                                if (typeof data === "string" && data.includes("/5")) {
                                                    return parseInt(data.split("/")[0]) || 0;
                                                } else if (typeof data === "number") {
                                                    return data;
                                                } else if (
                                                    typeof data === "string" &&
                                                    !isNaN(Number(data))
                                                ) {
                                                    return Number(data);
                                                }
                                                return null;
                                            })
                                            .filter((v) => v !== null && v > 0) as number[];

                                        const isWorst =
                                            allValues.length > 0 &&
                                            numericValue > 0 &&
                                            numericValue === Math.min(...allValues);
                                        const isBest =
                                            allValues.length > 0 &&
                                            numericValue > 0 &&
                                            numericValue === Math.max(...allValues);

                                        return (
                                            <td key={service.slug} className="p-4 text-center align-middle">
                                                <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold ${
                                                    displayValue === 'Non renseigné'
                                                        ? 'bg-gray-100 text-gray-500'
                                                        : isBest
                                                            ? 'bg-green-100 text-green-700'
                                                            : isWorst
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-blue-50 text-blue-700'
                                                }`}>
                                                    {capitalizeFirstLetter(displayValue)}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>


                                {/* Documents requis */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        Documents d&apos;identité requis
                                        <p className="text-xs text-gray-400 font-normal mt-0.5">Faut-il envoyer sa carte d&apos;identité ?</p>
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const needIdCard = manualData?.need_id_card;

                                        return (
                                            <td key={service.slug} className="p-4 text-center">
                                                {needIdCard === true ? (
                                                    <span className="inline-flex items-center text-red-600 bg-red-50 px-2 py-1 rounded">
                                                        <X className="w-4 h-4 mr-1" /> Oui
                                                    </span>
                                                ) : needIdCard === false ? (
                                                    <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                                        <ShieldCheck className="w-4 h-4 mr-1" /> Non
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Détails des documents requis */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        Détails des documents
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const details = manualData?.details_required_documents;

                                        return (
                                            <td key={service.slug} className="p-4 text-center text-gray-600 text-xs">
                                                {capitalizeFirstLetter(details) || '-'}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Transfert de données hors UE */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        Stockage hors UE
                                        <p className="text-xs text-gray-400 font-normal mt-0.5">Vos données quittent-elles l&apos;Europe ?</p>
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const outsideEU = manualData?.outside_eu_storage;

                                        return (
                                            <td key={service.slug} className="p-4 text-center">
                                                {outsideEU === true ? (
                                                    <span className="inline-flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                                        ⚠️ Oui
                                                    </span>
                                                ) : outsideEU === false ? (
                                                    <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                                        <ShieldCheck className="w-4 h-4 mr-1" /> Non
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Pays de destination des transferts */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        Pays de destination
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const transferCountries = manualData?.transfer_destination_countries;

                                        return (
                                            <td key={service.slug} className="p-4 text-center text-xs text-gray-600">
                                                {transferCountries || '-'}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Sanctions CNIL */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        Déjà sanctionné (CNIL/GDPR)
                                        <p className="text-xs text-gray-400 font-normal mt-0.5">L&apos;entreprise a-t-elle déjà été condamnée ?</p>
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const sanctioned = manualData?.sanctioned_by_cnil;

                                        return (
                                            <td key={service.slug} className="p-4 text-center">
                                                {sanctioned === true ? (
                                                    <span className="inline-flex items-center text-red-600 bg-red-50 px-2 py-1 rounded font-bold">
                                                        ⚠️ OUI
                                                    </span>
                                                ) : sanctioned === false ? (
                                                    <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                                        Non
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Détails des sanctions */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        Détails des sanctions
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const sanctionDetails = manualData?.sanction_details;

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

                                {/* Délai de réponse */}
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 font-medium">
                                        Délai de réponse moyen
                                    </td>
                                    {selectedServices.map((service) => {
                                        const manualData = manualDataCache[service.slug];
                                        const responseDelay = manualData?.response_delay ?? "";

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
                    {/* Permissions dangereuses */}
                    {Object.keys(permissions).length > 0 && (
                        <section id={"permissions"} className="p-4">
                            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                                <table className="w-full border-collapse bg-white text-sm">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-left font-semibold text-gray-900 border-b border-gray-200 w-1/3">
                                            <div className="flex items-center">
                                                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600"/>
                                                Permissions Sensibles
                                            </div>
                                            <p className="text-xs text-gray-500 font-normal mt-1">Accès aux fonctionnalités critiques de votre téléphone</p>
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
                                            TOTAL Permissions Dangereuses
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
                                                    <td key={service.slug}
                                                        className="p-4 text-center">
                                                        {permissions[service.slug]?.permissions.includes(permission.name) ? (
                                                            <div className="flex flex-col items-center">
                                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 mb-1">
                                                                    <AlertTriangle className="w-5 h-5" />
                                                                </span>
                                                                <span className="text-xs font-bold text-red-600">ACCÈS</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mb-1">
                                                                    <ShieldCheck className="w-5 h-5" />
                                                                </span>
                                                                <span className="text-xs font-medium text-green-600">Non</span>
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
                                                Pisteurs (Trackers)
                                            </div>
                                            <p className="text-xs text-gray-500 font-normal mt-1">Mouchards publicitaires et analytiques</p>
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
                                            TOTAL Pisteurs
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
                                                                alt={`Drapeau de ${getCountryFlagUrl(tracker.country).formattedName}`}
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                        <Link
                                                            href={"https://reports.exodus-privacy.eu.org/fr/trackers/" + tracker.id}
                                                            target={"_blank"}
                                                            className={"hover:text-blue-600 hover:underline flex items-center"}
                                                            rel="noopener noreferrer"
                                                        >
                                                            {tracker.name}
                                                            <ExternalLink className="ml-1 h-3 w-3 text-gray-400"/>
                                                        </Link>
                                                    </div>
                                                </td>
                                                {selectedServices.map((service) => (
                                                    <td key={service.slug}
                                                        className="p-4 text-center">
                                                        {permissions[service.slug]?.trackers?.includes(tracker.id) ? (
                                                            <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold">
                                                                Présent
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

                    {/* Points négatifs */}
                    {Object.keys(servicesData).length > 0 && (
                        <section id={"points-negatifs"} className="p-4">
                            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                                <table className="w-full border-collapse bg-white text-sm">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-4 text-left font-semibold text-gray-900 border-b border-gray-200 w-1/3">
                                            <div className="flex items-center">
                                                <AlertTriangle className="w-5 h-5 mr-2 text-red-600"/>
                                                Points de vigilance (ToS;DR)
                                            </div>
                                            <p className="text-xs text-gray-500 font-normal mt-1">Problèmes dans les conditions d&apos;utilisation</p>
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
                                            TOTAL Points Négatifs
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
                                                <td key={service.slug}
                                                    className="p-4 text-center">
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
            )
            }

            {/* Message si un seul service */
            }
            {
                selectedServices.length === 1 && (
                    <div className="text-center py-8 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-700">
                            Ajoutez au moins un autre service pour commencer la comparaison
                        </p>
                    </div>
                )
            }

            {/* Cacher les suggestions quand on clique ailleurs */
            }
            {
                showSuggestions && (
                    <div
                        className="fixed inset-0 z-0"
                        onClick={() => setShowSuggestions(false)}
                    />
                )
            }

            {/* CTA Suppression */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-center text-white shadow-lg mt-12">
                <h2 className="text-2xl font-bold mb-4">Vous souhaitez reprendre le contrôle ?</h2>
                <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                    Si ces résultats vous inquiètent, sachez que vous avez le droit de demander la suppression de vos données personnelles. Nous avons créé un outil pour vous faciliter la tâche.
                </p>
                <Link
                    href="/supprimer-mes-donnees"
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-md"
                >
                    Accéder à l&apos;outil de suppression
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </div>
        </div>
    )
        ;
}