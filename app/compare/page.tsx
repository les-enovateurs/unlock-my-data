"use client";

import allServices from "../../public/data/services.json";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Plus, Sparkles, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {useLanguage} from "@/context/LanguageContext";

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

export default function CustomComparison() {
    const availableServices: Service[] = allServices as Service[];
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Comparison data
    const [permissions, setPermissions] = useState<{ [key: string]: AppPermissions }>({});
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [dangerousPermissionsList, setDangerousPermissionsList] = useState<Permission[]>([]);
    const [servicesData, setServicesData] = useState<{ [key: string]: ServiceData }>({});
    const [manualDataCache, setManualDataCache] = useState<{ [key: string]: any }>({});
    const comparisonRef = useRef<HTMLDivElement>(null);

    // Pre-configured popular comparisons
    const popularComparisons = [
        {
            title: "Popular messaging apps",
            description: "WhatsApp vs Telegram vs Signal",
            services: ["whatsapp", "telegram", "signal"],
            icon: "💬",
        },
        {
            title: "Social networks",
            description: "Instagram vs TikTok vs Mastodon",
            services: ["instagram", "tiktok", "mastodon"],
            icon: "📱",
        },
        {
            title: "Cloud storage",
            description: "Google Drive vs Proton Drive vs OneDrive",
            services: ["google-drive", "proton-drive", "onedrive"],
            icon: "☁️",
        },
        {
            title: "GPS navigation",
            description: "Google Maps vs Waze vs OsmAnd",
            services: ["google-maps", "waze", "osmand"],
            icon: "🗺️",
        },
        {
            title: "Video streaming",
            description: "Netflix vs Disney+ vs Amazon Prime",
            services: ["netflix", "disneyplus", "amazon-prime-video"],
            icon: "🎬",
        },
        {
            title: "E‑commerce",
            description: "Amazon vs Temu vs AliExpress",
            services: ["amazon", "temu", "aliexpress"],
            icon: "🛒",
        },
    ];

    // Quick suggestions based on categories
    const quickSuggestions = [
        { name: "WhatsApp", slug: "whatsapp", category: "Messaging" },
        { name: "Instagram", slug: "instagram", category: "Social network" },
        { name: "Netflix", slug: "netflix", category: "Streaming" },
        { name: "Zoom", slug: "zoom", category: "Video conferencing" },
        { name: "TikTok", slug: "tiktok", category: "Video" },
    ];

    const addService = useCallback(
        async (service: Service) => {
            if (selectedServices.length < 3 && !selectedServices.some((s) => s.slug === service.slug)) {
                setSelectedServices((prev) => [...prev, service]);
                setSearchTerm("");
                setShowSuggestions(false);
            }
        },
        [selectedServices]
    );

    // Function to load a pre-configured comparison
    const loadPreConfiguredComparison = useCallback(
        (comparisonServices: string[]) => {
            const servicesToAdd = availableServices.filter((service) =>
                comparisonServices.includes(service.slug)
            );
            const validServices = servicesToAdd.slice(0, 3);
            setSelectedServices(validServices);

            // Scroll after a short delay to ensure state update
            setTimeout(() => {
                comparisonRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 300);
        },
        [availableServices]
    );

    // Function to add a quick suggestion
    const addQuickSuggestion = useCallback(
        (slug: string) => {
            const service = availableServices.find((s) => s.slug === slug);
            if (service) {
                addService(service);
            }
        },
        [availableServices, addService]
    );

    // Filter quick suggestions to show only available ones not already selected
    const availableQuickSuggestions = useMemo(() => {
        const selectedSlugs = new Set(selectedServices.map((s) => s.slug));
        const availableSlugs = new Set(availableServices.map((s) => s.slug));

        return quickSuggestions.filter(
            (suggestion) =>
                availableSlugs.has(suggestion.slug) && !selectedSlugs.has(suggestion.slug)
        );
    }, [selectedServices, availableServices]);

    // Optimized: Parallel API calls for comparison data
    useEffect(() => {
        const fetchComparisonData = async () => {
            if (selectedServices.length === 0) return;

            try {
                // Fetch shared data once
                const [permissionsResponse, trackersResponse] = await Promise.all([
                    fetch("/data/compare/permissions.json"),
                    fetch("/data/compare/trackers.json"),
                ]);

                const [permissionsData, trackersData] = await Promise.all([
                    permissionsResponse.json(),
                    trackersResponse.json(),
                ]);

                const dangerousPerms = Object.values(permissionsData[0].permissions)
                    .filter((perm: any) => perm.protection_level.includes("dangerous"))
                    .map((perm: any) => ({
                        ...perm,
                        description: perm.description || perm.name,
                    }));

                setDangerousPermissionsList(dangerousPerms);
                setTrackers(trackersData);

                // Fetch service-specific data in parallel
                const serviceDataPromises = selectedServices.map(async (service) => {
                    const [compareResponse, tosdrResponse, manualResponse] = await Promise.all([
                        fetch(`/data/compare/${service.slug}.json`).catch(() => ({ ok: false } as any)),
                        fetch(`/data/compare/tosdr/${service.slug}.json`).catch(
                            () => ({ ok: false } as any)
                        ),
                        fetch(`/data/manual/${service.slug}.json`).catch(() => ({ ok: false } as any)),
                    ]);

                    const results: {
                        permissions?: AppPermissions;
                        serviceData?: ServiceData;
                        manualData?: any;
                    } = {};

                    if (compareResponse.ok) {
                        if ("json" in compareResponse) {
                            results.permissions = await compareResponse.json();
                        }
                    }

                    if (tosdrResponse.ok) {
                        let tosdrData;
                        if ("json" in tosdrResponse) {
                            tosdrData = await tosdrResponse.json();
                        }
                        results.serviceData = {
                            name: tosdrData.name.replace("apps", "").trim(),
                            logo: service.logo,
                            points: tosdrData.points.filter(
                                (point: ServicePoint) =>
                                    point.status === "approved" &&
                                    ["bad", "neutral", "good", "blocker"].includes(point.case.classification)
                            ),
                        };
                    }

                    if (manualResponse.ok) {
                        if ("json" in manualResponse) {
                            results.manualData = await manualResponse.json();
                        }
                    }

                    return { slug: service.slug, ...results };
                });

                const results = await Promise.all(serviceDataPromises);

                // Update state once with all results
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
                console.error("Error while loading comparison data:", error);
            }
        };

        fetchComparisonData();
    }, [selectedServices]);

    // Memoized and optimized filtering
    const filteredServices = useMemo(() => {
        if (!searchTerm || searchTerm.length < 2) return []; // Only search after 2 chars

        const lowerSearchTerm = searchTerm.toLowerCase();
        const selectedSlugs = new Set(selectedServices.map((s) => s.slug));

        return availableServices
            .filter(
                (service) =>
                    service.name.toLowerCase().includes(lowerSearchTerm) &&
                    !selectedSlugs.has(service.slug)
            )
            .slice(0, 5);
    }, [searchTerm, availableServices, selectedServices]);

    const removeService = useCallback((slug: string) => {
        setSelectedServices((prev) => prev.filter((service) => service.slug !== slug));
    }, []);

    const getCountryFlagUrl = (
        countryName: string
    ): { url: string; formattedName: string } => {
        const countryISOCodes: { [key: string]: { code: string; name: string } } = {
            france: { code: "fr", name: "France" },
            "united states": { code: "us", name: "United States" },
            china: { code: "cn", name: "China" },
            "south korea": { code: "kr", name: "South Korea" },
            japan: { code: "jp", name: "Japan" },
            russia: { code: "ru", name: "Russia" },
            germany: { code: "de", name: "Germany" },
            brazil: { code: "br", name: "Brazil" },
            vietnam: { code: "vn", name: "Vietnam" },
            netherlands: { code: "nl", name: "Netherlands" },
            switzerland: { code: "ch", name: "Switzerland" },
            panama: { code: "pa", name: "Panama" },
            israel: { code: "il", name: "Israel" },
            india: { code: "in", name: "India" },
            "united kingdom": { code: "gb", name: "United Kingdom" },
            ireland: { code: "ie", name: "Ireland" },
            singapore: { code: "sg", name: "Singapore" },
        };

        const countryInfo = countryISOCodes[countryName.toLowerCase()];
        return {
            url: countryInfo ? `https://flagcdn.com/w20/${countryInfo.code}.png` : "/images/globe-icon.png",
            formattedName: countryInfo ? countryInfo.name : "Unknown",
        };
    };

    // Memoized unique bad point titles
    const uniqueBadPointTitles = useMemo(() => {
        const titles = Object.values(servicesData).flatMap((service) =>
            service.points
                .filter((point) => point.case.classification === "bad")
                .map((point) => point.case.title)
        );
        return Array.from(new Set(titles));
    }, [servicesData]);

    const dangerousCounts = selectedServices.map((service) => ({
        slug: service.slug,
        name: service.name,
        count: dangerousPermissionsList.filter((permission) =>
            permissions[service.slug]?.permissions.includes(permission.name)
        ).length,
    }));

    const maxDangerousCount = Math.max(...dangerousCounts.map((s) => s.count), 0);

    // Trackers stats
    const trackerCounts = selectedServices.map((service) => ({
        slug: service.slug,
        name: service.name,
        count: trackers.filter((tracker) =>
            permissions[service.slug]?.trackers?.includes(tracker.id)
        ).length,
    }));
    const maxTrackerCount = Math.max(...trackerCounts.map((s) => s.count), 0);

    // Bad points stats
    const badPointCounts = selectedServices.map((service) => ({
        slug: service.slug,
        name: service.name,
        count:
            servicesData[service.slug]?.points.filter(
                (point) => point.case.classification === "bad"
            ).length || 0,
    }));
    const maxBadPointCount = Math.max(...badPointCounts.map((s) => s.count), 0);


    const { setLang } = useLanguage();
    setLang('en')

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Custom service comparison
                </h1>
                <p className="text-gray-600">
                    Search and compare up to 3 services to analyze their permissions, trackers and negative
                    points
                </p>
            </div>

            {/* Pre-configured comparisons - Show even if services selected */}
            <div className="mb-8">
                <div className="flex items-center mb-4">
                    <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">
                        Popular comparisons
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {popularComparisons.map((comparison, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => loadPreConfiguredComparison(comparison.services)}
                        >
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">{comparison.icon}</span>
                                <h3 className="font-semibold text-gray-800">{comparison.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{comparison.description}</p>
                            <div className="flex items-center text-xs text-blue-600">
                                <Plus className="w-3 h-3 mr-1" />
                                Compare now
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick suggestions */}
                {availableQuickSuggestions.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">
                            Quick suggestions
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {availableQuickSuggestions.slice(0, 8).map((suggestion) => (
                                <button
                                    key={suggestion.slug}
                                    onClick={() => addQuickSuggestion(suggestion.slug)}
                                    disabled={selectedServices.length >= 3}
                                    className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <span className="px-4 text-sm text-gray-500 bg-white">
            or search manually
          </span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>
            </div>

            {/* Search bar */}
            <div className="relative mb-8 max-w-md mx-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search for a service..."
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
                {showSuggestions &&
                    filteredServices.length > 0 &&
                    selectedServices.length < 3 && (
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
                                            <div className="text-sm text-gray-500">
                                                {service.short_description}
                                            </div>
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
                    <div
                        className={
                            "flex flex-row items-center align-middle justify-between" +
                            (selectedServices.length >= 3 ? " mb-4" : "")
                        }
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            Selected services ({selectedServices.length}/3)
                        </h2>
                        <button
                            onClick={() => setSelectedServices([])}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {selectedServices.map((service) => (
                            <div
                                key={service.slug}
                                className="flex items-center bg-blue-100 rounded-full px-4 py-2"
                            >
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
                        Use the search bar to add services to compare
                    </p>
                </div>
            )}

            {/* Comparison */}
            {selectedServices.length >= 2 && (
                <div className="space-y-8">
                    <section id={"privacy-data-access"} className="p-4">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="sticky top-0 bg-white">
                            <tr>
                                <th className="border border-gray-300 p-3 bg-gray-50 text-left sticky left-0 z-10">
                                    <h2>Data access and privacy</h2>
                                </th>
                                {selectedServices.map((service) => (
                                    <th
                                        key={service.slug}
                                        className="border border-gray-300 p-3 bg-gray-50 text-center min-w-[120px]"
                                    >
                                        <div className="flex flex-col items-center space-y-1">
                                            <Link
                                                href={`/list-app/${service.slug}`}
                                                target="_blank"
                                            >
                                                <Image
                                                    src={service.logo}
                                                    alt={service.name}
                                                    width={24}
                                                    height={24}
                                                    className="object-contain hover:scale-110 transition-transform"
                                                />
                                            </Link>
                                            <Link
                                                href={`/list-app/${service.slug}`}
                                                target="_blank"
                                                className="text-xs text-primary-600 underline hover:no-underline"
                                            >
                                                {service.name}
                                            </Link>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {/* Ease of data access */}
                            <tr>
                                <td className="border border-gray-300 p-3 sticky left-0 bg-white font-semibold">
                                    Ease of access to your data
                                </td>
                                {selectedServices.map((service) => {
                                    const manualData = manualDataCache[service.slug];
                                    let easyAccess = manualData?.easy_access_data;

                                    // Handle different formats: "3/5" (string) or 1 (number)
                                    let displayValue = "Not provided";
                                    let numericValue = 0;

                                    if (easyAccess !== undefined && easyAccess !== null) {
                                        if (typeof easyAccess === "string" && easyAccess.includes("/5")) {
                                            // Already formatted like "3/5"
                                            displayValue = easyAccess;
                                            numericValue = parseInt(easyAccess.split("/")[0]) || 0;
                                        } else if (typeof easyAccess === "number") {
                                            // Just a number, add /5
                                            displayValue = `${easyAccess}/5`;
                                            numericValue = easyAccess;
                                        } else if (
                                            typeof easyAccess === "string" &&
                                            !isNaN(Number(easyAccess))
                                        ) {
                                            // String number, convert and add /5
                                            numericValue = Number(easyAccess);
                                            displayValue = `${numericValue}/5`;
                                            if (numericValue === 0) {
                                                displayValue = "";
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
                                        <td
                                            key={service.slug}
                                            className="border border-gray-300 p-3 text-center"
                                        >
                        <span
                            className={`${
                                displayValue === "Not provided"
                                    ? "text-gray-500"
                                    : isBest
                                        ? "text-green-600 text-lg font-medium"
                                        : isWorst
                                            ? "text-red-600 text-lg font-medium"
                                            : "font-medium"
                            }`}
                        >
                          {capitalizeFirstLetter(displayValue)}
                        </span>
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* Identity documents required */}
                            <tr>
                                <td className="border border-gray-300 p-3 sticky left-0 bg-white font-semibold">
                                    Identity documents required
                                </td>
                                {selectedServices.map((service) => {
                                    const manualData = manualDataCache[service.slug];
                                    const needIdCard = manualData?.need_id_card;

                                    return (
                                        <td
                                            key={service.slug}
                                            className="border border-gray-300 p-3 text-center"
                                        >
                                            {needIdCard === true ? (
                                                <span className="text-red-600 font-medium">Yes</span>
                                            ) : needIdCard === false ? (
                                                <span className="text-green-600 font-medium">No</span>
                                            ) : (
                                                <span className="text-gray-500">Not provided</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* Details of required documents */}
                            <tr>
                                <td className="border border-gray-300 p-3 sticky left-0 bg-white font-semibold">
                                    Details of required documents
                                </td>
                                {selectedServices.map((service) => {
                                    const manualData = manualDataCache[service.slug];
                                    const details = manualData?.details_required_documents_en;

                                    return (
                                        <td
                                            key={service.slug}
                                            className="border border-gray-300 p-3 text-center"
                                        >
                        <span className="text-xs">
                          {capitalizeFirstLetter(details) || ""}
                        </span>
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* Data storage outside EU */}
                            <tr>
                                <td className="border border-gray-300 p-3 sticky left-0 bg-white font-semibold">
                                    Data stored outside the European Union
                                </td>
                                {selectedServices.map((service) => {
                                    const manualData = manualDataCache[service.slug];
                                    const outsideEU = manualData?.outside_eu_storage;

                                    return (
                                        <td
                                            key={service.slug}
                                            className="border border-gray-300 p-3 text-center"
                                        >
                                            {outsideEU === true ? (
                                                <span className="text-red-600 font-medium">Yes</span>
                                            ) : outsideEU === false ? (
                                                <span className="text-green-600 font-medium">No</span>
                                            ) : (
                                                <span className="text-gray-500"></span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* Transfer destination countries */}
                            <tr>
                                <td className="border border-gray-300 p-3 sticky left-0 bg-white font-semibold">
                                    Destination countries for data transfers
                                </td>
                                {selectedServices.map((service) => {
                                    const manualData = manualDataCache[service.slug];
                                    const transferCountries =
                                        manualData?.transfer_destination_countries_en;

                                    return (
                                        <td
                                            key={service.slug}
                                            className="border border-gray-300 p-3 text-center"
                                        >
                                            <span className="text-xs">{transferCountries}</span>
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* CNIL sanctions */}
                            <tr>
                                <td className="border border-gray-300 p-3 sticky left-0 bg-white font-semibold">
                                    Sanctioned by CNIL (French data protection authority)
                                </td>
                                {selectedServices.map((service) => {
                                    const manualData = manualDataCache[service.slug];
                                    const sanctioned = manualData?.sanctioned_by_cnil;

                                    return (
                                        <td
                                            key={service.slug}
                                            className="border border-gray-300 p-3 text-center"
                                        >
                                            {sanctioned === true ? (
                                                <span className="text-red-600 font-medium">Yes</span>
                                            ) : sanctioned === false ? (
                                                <span className="text-green-600 font-medium">No</span>
                                            ) : (
                                                <span className="text-gray-500"></span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* Details of sanctions */}
                            <tr>
                                <td className="border border-gray-300 p-3 sticky left-0 bg-white font-semibold">
                                    Details of sanctions
                                </td>
                                {selectedServices.map((service) => {
                                    const manualData = manualDataCache[service.slug];
                                    const sanctionDetails = manualData?.sanction_details_en;

                                    return (
                                        <td
                                            key={service.slug}
                                            className="border border-gray-300 p-3 text-center"
                                        >
                                            {sanctionDetails ? (
                                                <span className="text-xs text-left block max-w-xs">
                                                    <ReactMarkdown>{sanctionDetails.replaceAll('<br>', '  \n')}</ReactMarkdown>
                          </span>
                                            ) : (
                                                <span className="text-gray-500 text-xs"></span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* Response time */}
                            <tr>
                                <td className="border border-gray-300 p-3 sticky left-0 bg-white font-semibold">
                                    Response time
                                </td>
                                {selectedServices.map((service) => {
                                    const manualData = manualDataCache[service.slug];
                                    const responseDelay = manualData?.response_delay_en ?? "";

                                    return (
                                        <td
                                            key={service.slug}
                                            className="border border-gray-300 p-3 text-center"
                                        >
                        <span className="text-xs">
                          {capitalizeFirstLetter(responseDelay)}
                        </span>
                                        </td>
                                    );
                                })}
                            </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* Dangerous permissions */}
                    {Object.keys(permissions).length > 0 && (
                        <section id={"permissions"} className="p-4">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="sticky top-0 bg-white">
                                <tr>
                                    <th className="border border-gray-300 p-3 bg-gray-50 text-left sticky left-0 z-10">
                                        <h2>Access to sensitive features on your phone</h2>
                                    </th>
                                    {selectedServices.map((service) => (
                                        <th
                                            key={service.slug}
                                            className="border border-gray-300 p-3 bg-gray-50 text-center min-w-[120px]"
                                        >
                                            <div className="flex flex-col items-center space-y-1">
                                                <Link
                                                    href={`/list-app/${service.slug}`}
                                                    target="_blank"
                                                >
                                                    <Image
                                                        src={service.logo}
                                                        alt={service.name}
                                                        width={24}
                                                        height={24}
                                                        className="object-contain hover:scale-110 transition-transform"
                                                    />
                                                </Link>
                                                <Link
                                                    href={`/list-app/${service.slug}`}
                                                    target="_blank"
                                                    className="text-xs hover:no-underline underline text-primary-600"
                                                >
                                                    {service.name}
                                                </Link>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="border border-gray-300 p-3 font-semibold bg-red-100 text-red-700 sticky left-0">
                                        Number of dangerous permissions
                                    </td>
                                    {dangerousCounts.map(({ slug, count }) => (
                                        <td
                                            key={slug}
                                            className={
                                                "border border-gray-300 p-3 text-center text-red-600 " +
                                                (count === maxDangerousCount && count > 0
                                                    ? "font-bold text-lg"
                                                    : "")
                                            }
                                        >
                                            {count}
                                        </td>
                                    ))}
                                </tr>
                                {dangerousPermissionsList
                                    .filter((permission) =>
                                        selectedServices.some((service) =>
                                            permissions[service.slug]?.permissions.includes(
                                                permission.name
                                            )
                                        )
                                    )
                                    .map((permission) => (
                                        <tr key={permission.name}>
                                            <td className="border border-gray-300 p-3 sticky left-0 bg-white font-medium">
                                                {capitalizeFirstLetter(
                                                    permission.label || permission.name
                                                )}
                                            </td>
                                            {selectedServices.map((service) => (
                                                <td
                                                    key={service.slug}
                                                    className="border border-gray-300 p-3 text-center"
                                                >
                                                    {permissions[service.slug]?.permissions.includes(
                                                        permission.name
                                                    ) ? (
                                                        <span className="text-red-600 text-sm">
                                Allowed
                              </span>
                                                    ) : (
                                                        <span className="text-green-600 text-xl"></span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}

                    {/* Trackers */}
                    {trackers.length > 0 && Object.keys(permissions).length > 0 && (
                        <section id={"trackers"} className="p-4">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="sticky top-0 bg-white">
                                <tr>
                                    <th className="border border-gray-300 p-3 bg-gray-50 text-left sticky left-0 z-10">
                                        <h2>Trackers</h2>
                                    </th>
                                    {selectedServices.map((service) => (
                                        <th
                                            key={service.slug}
                                            className="border border-gray-300 p-3 bg-gray-50 text-center min-w-[120px]"
                                        >
                                            <div className="flex flex-col items-center space-y-1">
                                                <Link
                                                    href={`/list-app/${service.slug}`}
                                                    target="_blank"
                                                >
                                                    <Image
                                                        src={service.logo}
                                                        alt={service.name}
                                                        width={24}
                                                        height={24}
                                                        className="object-contain hover:scale-110 transition-transform"
                                                    />
                                                </Link>
                                                <Link
                                                    href={`/list-app/${service.slug}`}
                                                    target="_blank"
                                                    className="text-xs text-primary-600 underline hover:no-underline"
                                                >
                                                    {service.name}
                                                </Link>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="border border-gray-300 p-3 font-semibold bg-red-100 text-red-700 sticky left-0">
                                        Number of trackers
                                    </td>
                                    {trackerCounts.map(({ slug, count }) => (
                                        <td
                                            key={slug}
                                            className={
                                                "border border-gray-300 p-3 text-center text-red-600 " +
                                                (count === maxTrackerCount && count > 0
                                                    ? "font-bold text-lg"
                                                    : "")
                                            }
                                        >
                                            {count}
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
                                        <tr key={tracker.id}>
                                            <td className="border border-gray-300 p-3 sticky left-0 bg-white font-medium">
                                                <div className="flex items-center">
                                                    <img
                                                        src={getCountryFlagUrl(tracker.country).url}
                                                        alt={`Flag of ${
                                                            getCountryFlagUrl(tracker.country).formattedName
                                                        }`}
                                                        className="inline-block mr-2 w-5 h-auto"
                                                    />
                                                    <Link
                                                        href={
                                                            "https://reports.exodus-privacy.eu.org/fr/trackers/" +
                                                            tracker.id
                                                        }
                                                        target={"_blank"}
                                                        className={
                                                            "underline hover:no-underline flex items-center"
                                                        }
                                                        rel="noopener noreferrer"
                                                    >
                                                        {tracker.name} - Exodus
                                                        <ExternalLink className="ml-1 h-3 w-3" />
                                                    </Link>
                                                </div>
                                            </td>
                                            {selectedServices.map((service) => (
                                                <td
                                                    key={service.slug}
                                                    className="border border-gray-300 p-3 text-center"
                                                >
                                                    {permissions[service.slug]?.trackers?.includes(
                                                        tracker.id
                                                    ) ? (
                                                        <span className="text-red-600 text-sm">
                                Included
                              </span>
                                                    ) : (
                                                        <span className="text-green-600 text-xl"></span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}

                    {/* Negative points */}
                    {Object.keys(servicesData).length > 0 && (
                        <section id={"points-negatifs"} className="p-4">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="sticky top-0 bg-white">
                                <tr>
                                    <th className="border border-gray-300 p-3 bg-gray-50 text-left sticky left-0 z-10">
                                        <h2>Negative points</h2>
                                    </th>
                                    {selectedServices.map((service) => (
                                        <th
                                            key={service.slug}
                                            className="border border-gray-300 p-3 bg-gray-50 text-center min-w-[120px]"
                                        >
                                            <div className="flex flex-col items-center space-y-1">
                                                <Link
                                                    href={`/list-app/${service.slug}`}
                                                    target="_blank"
                                                >
                                                    <Image
                                                        src={service.logo}
                                                        alt={service.name}
                                                        width={24}
                                                        height={24}
                                                        className="object-contain hover:scale-110 transition-transform"
                                                    />
                                                </Link>
                                                <Link
                                                    href={`/list-app/${service.slug}`}
                                                    target="_blank"
                                                    className="text-xs hover:text-blue-600 hover:underline"
                                                >
                                                    {service.name}
                                                </Link>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="border border-gray-300 p-3 font-semibold bg-red-100 text-red-700 sticky left-0">
                                        Number of negative points
                                    </td>
                                    {badPointCounts.map(({ slug, count }) => (
                                        <td
                                            key={slug}
                                            className={
                                                "border border-gray-300 p-3 text-center text-red-600 " +
                                                (count === maxBadPointCount && count > 0
                                                    ? "font-bold text-lg"
                                                    : "")
                                            }
                                        >
                                            {count}
                                        </td>
                                    ))}
                                </tr>
                                {uniqueBadPointTitles.map((title) => (
                                    <tr key={title}>
                                        <td className="border border-gray-300 p-3 sticky left-0 bg-white font-medium">
                                            {title}
                                        </td>
                                        {selectedServices.map((service) => (
                                            <td
                                                key={service.slug}
                                                className="border border-gray-300 p-3 text-center"
                                            >
                                                {servicesData[service.slug]?.points.some(
                                                    (point) =>
                                                        point.case.classification === "bad" && point.case.title === title
                                                ) ? (
                                                    <span className="text-red-600 text-xl">✓</span>
                                                ) : (
                                                    <span className="text-gray-300 text-xl">?</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </section>
                    )}
                </div>
            )}

            {/* Message if only one service */}
            {selectedServices.length === 1 && (
                <div className="text-center py-8 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700">
                        Add at least one more service to start the comparison
                    </p>
                </div>
            )}

            {/* Hide suggestions when clicking outside */}
            {showSuggestions && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowSuggestions(false)}
                />
            )}
        </div>
    );
}
