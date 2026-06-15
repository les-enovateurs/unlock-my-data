"use client";

import allServices from '../public/data/services.json';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Plus, Sparkles, ExternalLink, ShieldCheck, ShieldAlert, AlertTriangle, Info, ArrowRight, BarChart3, ScanLine, Table2, Check } from "lucide-react";
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
    // Two reading levels, like the design Compare.jsx: "easy" = verdict only,
    // "detailed" = every criterion grouped by theme.
    const [mode, setMode] = useState<"easy" | "detailed">("easy");

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
            color: "bg-green-50 text-green-700 border-green-200"
        },
        {
            name: t.t("categories.socialNetworks"),
            services: ["instagram", "tiktok", "mastodon"],
            icon: "📱",
            color: "bg-pink-50 text-pink-700 border-pink-200"
        },
        {
            name: t.t("categories.gps"),
            services: ["google-maps", "waze", "osmand"],
            icon: "🗺️",
            color: "bg-blue-50 text-blue-700 border-blue-200"
        },
        {
            name: t.t("categories.streaming"),
            services: ["netflix", "disneyplus", "amazon-prime-video"],
            icon: "🎬",
            color: "bg-purple-50 text-purple-700 border-purple-200"
        },
        {
            name: t.t("categories.cloud"),
            services: ["google-drive", "proton-drive", "onedrive"],
            icon: "☁️",
            color: "bg-sky-50 text-sky-700 border-sky-200"
        },
        {
            name: t.t("categories.ecommerce"),
            services: ["amazon", "boulanger", "alibaba"],
            icon: "🛒",
            color: "bg-orange-50 text-orange-700 border-orange-200"
        },
        {
            name: t.t("categories.businessChat"),
            services: ["slack", "mattermost", "microsoft-teams"],
            icon: "💼",
            color: "bg-blue-50 text-blue-700 border-blue-200"
        },
        {
            name: t.t("categories.gaming"),
            services: ["rockstar-games", "pokemon-go", "candy-crush"],
            icon: "🎮",
            color: "bg-red-50 text-red-700 border-red-200"
        },
        {
            name: t.t("categories.ai"),
            services: ["chatgpt", "claude", "gemini"],
            icon: "🤖",
            color: "bg-indigo-50 text-indigo-700 border-indigo-200"
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
                    const [compareModule, manualModule] = await Promise.all([
                        import(`../public/data/compare/${service.slug}.json`).catch(() => null),
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
        if (!servicesData[service.slug]) {
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
        <div className="mx-auto max-w-7xl px-4 py-10">
            {/* Header */}
            <div className="mb-8 text-center">
                <span className="umd-pill umd-pill-indigo mb-4">
                    <BarChart3 aria-hidden="true" />
                    {locale === 'fr' ? 'Comparer' : 'Compare'}
                </span>
                <h1 className="umd-heading-1 mb-3">
                    {t.t('title')}
                </h1>
                <p className="umd-lead-text mx-auto mb-6 max-w-2xl">
                    {t.t('subtitle')}
                </p>

                <div className="umd-alert umd-alert-warn mx-auto max-w-2xl text-left">
                    <span className="umd-alert-ic"><Info aria-hidden="true" /></span>
                    <p className="umd-alert-desc">
                        <span dangerouslySetInnerHTML={{ __html: t.t('experimentalWarning') }} />{' '}
                        {locale === 'fr' ? "Si vous constatez des erreurs, n'hésitez pas à " : "If you notice any errors, feel free to "}
                        <Link href={t.t('links.contribute')} className="font-semibold text-umd-indigo-700 underline">
                            {t.t('suggestCorrections')}
                        </Link>.
                    </p>
                </div>
            </div>

            {/* Pre-configured comparisons */}
            <div className="mb-10">
                <div className="mb-6 flex items-center justify-center">
                    <Sparkles className="mr-2 h-5 w-5 text-umd-indigo-600" aria-hidden="true" />
                    <h2 className="umd-heading-3 text-xl">{t.t('quickComparison')}</h2>
                </div>
                <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9">
                    {popularComparisons.map((comparison, index) => (
                        <button
                            key={index}
                            className="umd-card umd-card-hover flex aspect-square cursor-pointer flex-col items-center justify-center p-2 text-umd-slate-700"
                            onClick={() => loadPreConfiguredComparison(comparison.services)}
                        >
                            <span className="mb-2 text-2xl">{comparison.icon}</span>
                            <span className="text-center text-xs font-bold leading-tight">{comparison.name}</span>
                        </button>
                    ))}
                </div>

                {/* Quick suggestions */}
                {availableQuickSuggestions.length > 0 && (
                    <div className="mb-6">
                        <h3 className="umd-heading-3 mb-3 text-base">{t.t('quickSuggestions')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableQuickSuggestions.slice(0, 8).map((suggestion) => (
                                <button
                                    key={suggestion.slug}
                                    onClick={() => addQuickSuggestion(suggestion.slug)}
                                    className="umd-chip umd-chip-neutral cursor-pointer hover:border-umd-indigo-300 hover:bg-umd-indigo-50"
                                >
                                    <Plus className="h-3 w-3" aria-hidden="true" />
                                    {suggestion.name}
                                    <span className="ml-1 rounded bg-umd-slate-100 px-2 py-0.5 text-xs text-umd-slate-500">
                                        {suggestion.category}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Separator */}
                <div className="mb-6 flex items-center">
                    <div className="flex-1 border-t border-umd-slate-200"></div>
                    <span className="bg-white px-4 text-sm text-umd-slate-400">{t.t('orSearchManually')}</span>
                    <div className="flex-1 border-t border-umd-slate-200"></div>
                </div>
            </div>

            {/* Search bar */}
            <div className="relative mx-auto mb-8 max-w-md">
                <div className="umd-field">
                    <Search aria-hidden="true" />
                    <input
                        type="text"
                        placeholder={t.t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="umd-input umd-has-ic"
                    />
                </div>

                {/* Autocomplete suggestions */}
                {showSuggestions && filteredServices.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-umd-slate-200 bg-white shadow-lg">
                        {filteredServices.map((service) => (
                            <button
                                key={service.slug}
                                onClick={() => addService(service)}
                                className="flex w-full items-center space-x-3 border-b border-umd-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-umd-slate-50"
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
                                        <div className="text-sm text-umd-slate-500">{service.short_description}</div>
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
                        <h2 className="umd-heading-3 mb-4 text-xl">{t.t('selectedServices')} ({selectedServices.length}/3)</h2>

                        <button
                            onClick={() => setSelectedServices([])}
                            className="umd-btn umd-btn-danger umd-btn-sm"
                        >
                            {t.t('startOver')}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {selectedServices.map((service) => (
                            <div key={service.slug} className="umd-pill umd-pill-indigo">
                                <Image
                                    src={service.logo}
                                    alt={service.name}
                                    width={20}
                                    height={20}
                                    className="mr-1 object-contain"
                                />
                                <span className="text-sm font-medium">{service.name}</span>
                                <button
                                    onClick={() => removeService(service.slug)}
                                    className="ml-1 text-umd-indigo-700 hover:text-umd-red-600"
                                    aria-label={`${t.t('startOver')} ${service.name}`}
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Message if no service selected */}
            {selectedServices.length === 0 && (
                <div className="py-5 text-center">
                    <Plus className="mx-auto mb-4 h-16 w-16 text-umd-slate-300" aria-hidden="true" />
                    <p className="text-lg text-umd-slate-400">
                        {t.t('useSearchBar')}
                    </p>
                </div>
            )}

            {/* Comparison */}
            {selectedServices.length >= 2 && (
                <div className="space-y-8">
                    {/* Reading-level toggle: easy (verdict) vs detailed (all criteria) */}
                    <div className="grid gap-3 sm:grid-cols-2" role="tablist" aria-label={locale === 'fr' ? 'Niveau de détail' : 'Detail level'}>
                        {([
                            ["easy", ScanLine, locale === 'fr' ? "Mode facile" : "Easy mode", locale === 'fr' ? "L'essentiel + verdict" : "The essentials + verdict"],
                            ["detailed", Table2, locale === 'fr' ? "Mode détaillé" : "Detailed mode", locale === 'fr' ? "Tous les critères, par thème" : "Every criterion, by theme"],
                        ] as const).map(([id, Ic, title, sub]) => {
                            const active = mode === id;
                            return (
                                <button
                                    key={id}
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => setMode(id)}
                                    className={`umd-card flex cursor-pointer items-center gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300 ${active ? "border-umd-indigo-500 bg-umd-indigo-50" : "umd-card-hover"}`}
                                >
                                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${active ? "bg-umd-indigo-800 text-white" : "bg-umd-indigo-50 text-umd-indigo-700"}`}>
                                        <Ic className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <span className="flex-1">
                                        <span className="block font-display text-base font-bold">{title}</span>
                                        <span className="block text-[13px] text-umd-slate-500">{sub}</span>
                                    </span>
                                    {active && <Check className="h-[17px] w-[17px] text-umd-indigo-600" aria-hidden="true" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick Verdict — shown in both modes */}
                    <ComparatifVerdictCards
                        selectedServices={selectedServices}
                        dangerousCounts={dangerousCounts}
                        trackerCounts={trackerCounts}
                        badPointCounts={badPointCounts}
                        servicesData={servicesData}
                        t={t}
                    />

                    {mode === "easy" && (
                        <div className="flex justify-center">
                            <button onClick={() => setMode("detailed")} className="umd-btn umd-btn-outline">
                                <Table2 className="h-[18px] w-[18px]" aria-hidden="true" />
                                {locale === 'fr' ? "Voir tout le détail" : "See all the detail"}
                            </button>
                        </div>
                    )}

                    {mode === "detailed" && (
                        <>
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

                            <p className="flex items-start gap-2 text-xs leading-relaxed text-umd-slate-400">
                                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                {locale === 'fr'
                                    ? "Comparaison fondée sur des critères factuels et vérifiables."
                                    : "Comparison based on factual, verifiable criteria."}
                            </p>
                        </>
                    )}
                </div>
            )}

            {/* Message if only one service */}
            {selectedServices.length === 1 && (
                <div className="umd-alert umd-alert-info">
                    <span className="umd-alert-ic"><Info aria-hidden="true" /></span>
                    <p className="umd-alert-desc">
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
            <div className="mt-12 rounded-3xl bg-umd-indigo-900 p-8 text-center text-white">
                <h2 className="umd-heading-2 mb-4 text-2xl text-white">{t.t('takeControl')}</h2>
                <p className="mx-auto mb-8 max-w-2xl text-white/80">
                    {t.t('takeControlDesc')}
                </p>
                <Link
                    href={t.t('links.deleteMyData')}
                    className="umd-btn bg-white text-umd-indigo-800 hover:bg-umd-indigo-50"
                >
                    {t.t('accessDeletionTool')}
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
            </div>
        </div>
    );
}
