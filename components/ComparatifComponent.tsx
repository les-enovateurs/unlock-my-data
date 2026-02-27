"use client";

import allServices from '../public/data/services.json';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Plus, Sparkles, ExternalLink, ShieldCheck, ShieldAlert, AlertTriangle, Info, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams } from "next/navigation";
import permissionsDataRawEn from '../public/data/compare/permissions.json';
import permissionsDataRawFr from '../public/data/compare/permissions_fr.json';
import trackersDataRaw from '../public/data/compare/trackers.json';
import Translator from "@/components/tools/t";
import dict from "@/i18n/Comparatif.json";
import ComparatifVerdictCards from "./comparatif/ComparatifVerdictCards";
import ComparatifDataAccess from "./comparatif/ComparatifDataAccess";
import ComparatifPermissions from "./comparatif/ComparatifPermissions";
import ComparatifTrackers from "./comparatif/ComparatifTrackers";
import ComparatifWarningPoints from "./comparatif/ComparatifWarningPoints";

// Service categories and alternatives

const ALTERNATIVES: Record<string, string[]> = {
    "google-maps": ["osmand", "waze"],
    "waze": ["osmand", "google-maps"],
    "whatsapp": ["signal", "telegram"],
    "messenger": ["signal", "telegram"],
    "telegram": ["signal", "whatsapp"],
};

// Import canonical SERVICE_CATEGORIES
import { SERVICE_CATEGORIES, getAlternatives } from '../constants/protectData';

// Generate slug-to-category mapping
const SLUG_TO_CATEGORY: Record<string, string> = {};
for (const [category, slugs] of Object.entries(SERVICE_CATEGORIES)) {
    slugs.forEach(slug => {
        SLUG_TO_CATEGORY[slug] = category;
    });
}

function capitalizeFirstLetter(val: string) {
    return String(val).trim().charAt(0).toUpperCase() + String(val).slice(1);
}

import { ComparatifComponentProps, ServiceData, ServicePoint, Permission, AppPermissions, Tracker, Service } from "./comparatif/types";

export default function ComparatifComponent({ locale }: ComparatifComponentProps) {
    const t = new Translator(dict as any, locale);
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
        { name: "WhatsApp", slug: "whatsapp", category: t.t("suggestionCategories.whatsapp") },
        { name: "Instagram", slug: "instagram", category: t.t("suggestionCategories.instagram") },
        { name: "Netflix", slug: "netflix", category: t.t("suggestionCategories.netflix") },
        { name: "Zoom", slug: "zoom", category: t.t("suggestionCategories.zoom") },
        { name: "TikTok", slug: "tiktok", category: t.t("suggestionCategories.tiktok") }
    ], [t]);

    // Pre-configured popular comparisons
    const popularComparisons = useMemo(() => [
        {
            name: t.t("categories.messaging"),
            services: ["whatsapp", "telegram", "signal"],
            icon: "💬",
            color: "bg-green-50 text-green-600 border-green-200"
        },
        {
            name: t.t("categories.socialNetworks"),
            services: ["instagram", "tiktok", "mastodon"],
            icon: "📱",
            color: "bg-pink-50 text-pink-600 border-pink-200"
        },
        {
            name: t.t("categories.gps"),
            services: ["google-maps", "waze", "osmand"],
            icon: "🗺️",
            color: "bg-blue-50 text-blue-600 border-blue-200"
        },
        {
            name: t.t("categories.streaming"),
            services: ["netflix", "disneyplus", "amazon-prime-video"],
            icon: "🎬",
            color: "bg-purple-50 text-purple-600 border-purple-200"
        },
        {
            name: t.t("categories.cloud"),
            services: ["google-drive", "proton-drive", "onedrive"],
            icon: "☁️",
            color: "bg-sky-50 text-sky-600 border-sky-200"
        },
        {
            name: t.t("categories.ecommerce"),
            services: ["amazon", "boulanger", "alibaba"],
            icon: "🛒",
            color: "bg-orange-50 text-orange-600 border-orange-200"
        },
        {
            name: t.t("categories.businessChat"),
            services: ["slack", "mattermost", "microsoft-teams"],
            icon: "💼",
            color: "bg-blue-50 text-blue-600 border-blue-200"
        },
        {
            name: t.t("categories.gaming"),
            services: ["rockstar-games", "pokemon-go", "candy-crush"],
            icon: "🎮",
            color: "bg-red-50 text-red-600 border-red-200"
        },
        {
            name: t.t("categories.ai"),
            services: ["chatgpt", "claude", "gemini"],
            icon: "🤖",
            color: "bg-indigo-50 text-indigo-600 border-indigo-200"
        }
    ], [t]);

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
                setTimeout(() => {
                    comparisonRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 300);
            }
        }
        setInitialized(true);
    }, [searchParams, availableServices, initialized, popularComparisons]);

    const addService = useCallback(async (service: Service) => {

        if (selectedServices.some(s => s.slug === service.slug)) {
            return;
        }

        if (selectedServices.length < 3) {
            // Add normally if less than 3
            setSelectedServices(prev => [...prev, service]);
        } else {
            // Replace last service if we already have 3
            setSelectedServices(prev => [...prev.slice(0, 2), service]);
        }

        setSearchTerm("");
        setShowSuggestions(false);
    }, [selectedServices]);


    const loadPreConfiguredComparison = useCallback((comparisonServices: string[]) => {
        const servicesToAdd = availableServices.filter(service =>
            comparisonServices.includes(service.slug)
        );
        const validServices = servicesToAdd.slice(0, 3);
        setSelectedServices(validServices);

        setTimeout(() => {
            comparisonRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 300);
    }, [availableServices]);


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

                    return { slug: service.slug, ...results };
                });

                const results = await Promise.all(serviceDataPromises);

                const newPermissions: { [key: string]: AppPermissions } = {};
                const newServicesData: { [key: string]: ServiceData } = {};
                const newManualDataCache: { [key: string]: any } = {};

                results.forEach(({ slug, permissions, serviceData, manualData }) => {
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
            france: { code: "fr" },
            "united states": { code: "us" },
            china: { code: "cn" },
            "south korea": { code: "kr" },
            japan: { code: "jp" },
            russia: { code: "ru" },
            germany: { code: "de" },
            brazil: { code: "br" },
            vietnam: { code: "vn" },
            netherlands: { code: "nl" },
            switzerland: { code: "ch" },
            panama: { code: "pa" },
            israel: { code: "il" },
            india: { code: "in" },
            "united kingdom": { code: "gb" },
            ireland: { code: "ie" },
            singapore: { code: "sg" },
        };

        const countryKey = countryName.toLowerCase();
        const countryInfo = countryISOCodes[countryKey];
        const localizedName = t.t(`countries.${countryKey}`) || t.t('unknown');

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

    const { setLang } = useLanguage();
    useEffect(() => {
        setLang(locale as 'fr' | 'en');
    }, [locale, setLang]);


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
                    {t.t('title')}
                </h1>
                <p className="text-gray-600 mb-6">
                    {t.t('subtitle')}
                </p>

                <div className="inline-flex items-center justify-center bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 max-w-2xl mx-auto">
                    <Info className="w-5 h-5 mr-3 flex-shrink-0 text-amber-600" />
                    <p>
                        <span dangerouslySetInnerHTML={{ __html: t.t('experimentalWarning') }} /> <br className="hidden sm:block" />
                        {locale === 'fr' ? "Si vous constatez des erreurs, n'hésitez pas à " : "If you notice any errors, feel free to "}
                        <Link href={t.t('links.contribute')} className="underline font-semibold hover:text-amber-900">
                            {t.t('suggestCorrections')}
                        </Link>.
                    </p>
                </div>
            </div>

            {/* Pre-configured comparisons */}
            <div className="mb-10">
                <div className="flex items-center justify-center mb-6">
                    <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">{t.t('quickComparison')}</h2>
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
                        <h3 className="text-lg font-medium text-gray-700 mb-3">{t.t('quickSuggestions')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableQuickSuggestions.slice(0, 8).map((suggestion) => (
                                <button
                                    key={suggestion.slug}
                                    onClick={() => addQuickSuggestion(suggestion.slug)}
                                    className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 hover:border-blue-300 transition-colors"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
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
                    <span className="px-4 text-sm text-gray-500 bg-white">{t.t('orSearchManually')}</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
            </div>

            {/* Search bar */}
            <div className="relative mb-8 max-w-md mx-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={t.t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Autocomplete suggestions */}
                {showSuggestions && filteredServices.length > 0 && (
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
                    <div className={"flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" + (selectedServices.length >= 3 ? " mb-4" : "")}>
                        <h2 className="text-xl font-semibold mb-4">{t.t('selectedServices')} ({selectedServices.length}/3)</h2>

                        <button
                            onClick={() => setSelectedServices([])}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                            {t.t('startOver')}
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
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Message if no service selected */}
            {selectedServices.length === 0 && (
                <div className="text-center py-5">
                    <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                        {t.t('useSearchBar')}
                    </p>
                </div>
            )}

            {/* Comparison */}
            {selectedServices.length >= 2 && (
                <div className="space-y-8">
                    {/* Quick Verdict */}
                    {/* Quick Verdict */}
                    <ComparatifVerdictCards
                        selectedServices={selectedServices}
                        dangerousCounts={dangerousCounts}
                        trackerCounts={trackerCounts}
                        badPointCounts={badPointCounts}
                        servicesData={servicesData}
                        t={t}
                    />

                    {/* Data access privacy */}
                    <ComparatifDataAccess
                        selectedServices={selectedServices}
                        manualDataCache={manualDataCache}
                        getManualField={getManualField}
                        capitalizeFirstLetter={capitalizeFirstLetter}
                        t={t}
                    />

                    {/* Dangerous permissions */}
                    <ComparatifPermissions
                        selectedServices={selectedServices}
                        permissions={permissions}
                        dangerousPermissionsList={dangerousPermissionsList}
                        dangerousCounts={dangerousCounts}
                        capitalizeFirstLetter={capitalizeFirstLetter}
                        t={t}
                    />

                    {/* Trackers */}
                    <ComparatifTrackers
                        selectedServices={selectedServices}
                        trackers={trackers}
                        permissions={permissions}
                        trackerCounts={trackerCounts}
                        getCountryFlagUrl={getCountryFlagUrl}
                        locale={locale}
                        t={t}
                    />

                    {/* Negative points */}
                    <ComparatifWarningPoints
                        selectedServices={selectedServices}
                        servicesData={servicesData}
                        badPointCounts={badPointCounts}
                        uniqueBadPointTitles={uniqueBadPointTitles}
                        locale={locale}
                        t={t}
                    />
                </div>
            )}

            {/* Message if only one service */}
            {selectedServices.length === 1 && (
                <div className="text-center py-8 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700">
                        {t.t('addMoreServices')}
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
                <h2 className="text-2xl font-bold mb-4">{t.t('takeControl')}</h2>
                <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                    {t.t('takeControlDesc')}
                </p>
                <Link
                    href={t.t('links.deleteMyData')}
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-md"
                >
                    {t.t('accessDeletionTool')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
