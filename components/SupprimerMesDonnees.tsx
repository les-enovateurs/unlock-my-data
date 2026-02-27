"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import services from "../public/data/services.json"
import Link from "next/link";
import { ServiceSearchBar, DeletionFlow } from "./shared";
import DeletionServiceCard from "./shared/DeletionServiceCard";
import { useServiceFilter } from "@/hooks/useServiceFilter";
import { PROTECT_DATA_SELECTION_KEY } from "@/constants/protectData";
import Translator from "./tools/t";
import dict from "../i18n/DeleteMyData.json";

interface Service {
    mode: number;
    slug: string;
    name: string;
    logo: string;
    easy_access_data: string | number;
    contact_mail_export: string;
    contact_mail_delete: string;
    recipient_address: string | null;
    how_to_export: string;
    url_delete: string | null;
    url_export: string | null;
    need_id_card: boolean | null;
    data_access_via_postal: boolean | null;
    data_access_via_form: boolean | null | string;
    data_access_via_email: boolean | null;
    last_update_breach: string | null;
    country_name: string;
    country_code: string;
    nationality: string;
    exodus?: boolean;
    tosdr?: any;
}

interface SaveData {
    selectedServices: string[];
    completedServices: string[];
    skippedServices?: string[];
    notes: { [key: string]: string };
    timestamp: string;
}

export default function SupprimerMesDonnees({ preselectedSlug, locale = 'fr' }: { preselectedSlug?: string, locale?: 'fr' | 'en' }) {
    const t = useMemo(() => new Translator(dict, locale), [locale]);

    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [completedServices, setCompletedServices] = useState<string[]>([]);
    const [skippedServices, setSkippedServices] = useState<string[]>([]);
    const [notes, setNotes] = useState<{ [key: string]: string }>({});
    const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
    const [fromRiskAnalysis, setFromRiskAnalysis] = useState(false);
    const [isSingleServiceMode, setIsSingleServiceMode] = useState(false);
    const [protectDataAvailable, setProtectDataAvailable] = useState(false);
    const [protectDataCount, setProtectDataCount] = useState(0);
    const [protectDataLoaded, setProtectDataLoaded] = useState(false);
    const serviceCardRef = useRef<HTMLDivElement>(null);
    const isNavigatingHistory = useRef(false);
    const isFirstRender = useRef(true);

    // Use optimized filtering hook for eco-design
    const allServices = useMemo(() => services as unknown as Service[], []);
    const filteredServices = useServiceFilter(allServices, {
        searchQuery: searchTerm,
        selectedCategory: "",
        searchFields: ["name", "slug"]
    });


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(PROTECT_DATA_SELECTION_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    let slugs: string[] = [];

                    if (Array.isArray(parsed)) {
                        slugs = parsed;
                    } else if (parsed.selectedServices && Array.isArray(parsed.selectedServices)) {
                        slugs = parsed.selectedServices;
                    }

                    if (slugs.length > 0) {
                        setProtectDataAvailable(true);
                        setProtectDataCount(slugs.length);
                    }
                } catch (e) {
                    console.error('Failed to parse protect data selection:', e);
                }
            }
        }
    }, []);

    // Load services from Protect My Data
    const loadFromProtectData = useCallback(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(PROTECT_DATA_SELECTION_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    let slugs: string[] = [];

                    if (Array.isArray(parsed)) {
                        slugs = parsed;
                    } else if (parsed.selectedServices && Array.isArray(parsed.selectedServices)) {
                        slugs = parsed.selectedServices;
                    }

                    const validSlugs = slugs.filter(slug =>
                        (services as unknown as Service[]).some(s => s.slug === slug)
                    );

                    if (validSlugs.length > 0) {
                        setSelectedServices(validSlugs);
                        setFromRiskAnalysis(false);
                        setProtectDataLoaded(true);
                    }
                } catch (e) {
                    console.error('Failed to load protect data selection:', e);
                    alert(t.t("errorLoadingProtectData"));
                }
            }
        }
    }, [t]);

    // Reset current selection (not the Protect My Data storage)
    const resetCurrentSelection = useCallback(() => {
        setSelectedServices([]);
        setCompletedServices([]);
        setSkippedServices([]);
        setNotes({});
        setCurrentServiceIndex(0);
        setStep(1);
        setFromRiskAnalysis(false);
        setIsSingleServiceMode(false);
        setProtectDataLoaded(false);
    }, []);


    // Handle URL params for pre-selection
    useEffect(() => {
        let serviceSlug: string | undefined = preselectedSlug;

        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);


            const fromRisks = params.get('from') === 'risks';
            const isBulk = params.get('bulk') === 'true';

            if (fromRisks && isBulk) {
                setFromRiskAnalysis(true);
                // Load services from localStorage using unified key
                const saved = localStorage.getItem(PROTECT_DATA_SELECTION_KEY);
                if (saved) {
                    try {
                        const slugs = JSON.parse(saved) as string[];
                        const validSlugs = slugs.filter(slug =>
                            (services as unknown as Service[]).some(s => s.slug === slug)
                        );
                        if (validSlugs.length > 0) {
                            setSelectedServices(validSlugs);
                            setStep(2);
                        }
                    } catch (e) {
                        console.error('Failed to parse risk selection:', e);
                    }
                }
                return;
            }

            // Single service param
            if (!serviceSlug) {
                const param = params.get('service');
                if (param) {
                    serviceSlug = param;
                }
            }
        }

        if (serviceSlug) {
            const serviceExists = (services as unknown as Service[]).some(s => s.slug === serviceSlug);
            if (serviceExists) {
                setSelectedServices(prev => {
                    if (!prev.includes(serviceSlug!)) {
                        return [...prev, serviceSlug!];
                    }
                    return prev;
                });
                // Auto-start if coming from a specific service link
                setStep(2);
                // Enable single service mode (no progress bar, simplified UI)
                setIsSingleServiceMode(true);
            }
        }
    }, [preselectedSlug]);

    // Warn before unload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (selectedServices.length > 0 && step < 3) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [selectedServices, step]);

    // History management
    useEffect(() => {
        // Initial state
        if (typeof window !== 'undefined') {
            window.history.replaceState({ step: 1, serviceIndex: 0 }, "");
        }

        const handlePopState = (event: PopStateEvent) => {
            if (event.state) {
                isNavigatingHistory.current = true;
                setStep(event.state.step);
                if (event.state.serviceIndex !== undefined) {
                    setCurrentServiceIndex(event.state.serviceIndex);
                }
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (isNavigatingHistory.current) {
            isNavigatingHistory.current = false;
            return;
        }
        const state = { step, serviceIndex: step === 2 ? currentServiceIndex : undefined };
        window.history.pushState(state, "");
    }, [step, currentServiceIndex]);

    useEffect(() => {
        if (step === 2 && serviceCardRef.current) {
            serviceCardRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [currentServiceIndex, step]);

    // Calculate selected services list and current service
    const selectedServicesList = useMemo(
        () => (services as unknown as Service[]).filter((s) => selectedServices.includes(s.slug)),
        [selectedServices]
    );

    const currentService = useMemo(
        () => selectedServicesList[currentServiceIndex],
        [selectedServicesList, currentServiceIndex]
    );

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if user is typing in an input or textarea
            const target = event.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
                return;
            }

            if (event.key === "Enter") {
                if (step === 1 && selectedServices.length > 0) {
                    setStep(2);
                } else if (step === 2 && currentService) {
                    const currentSlug = currentService.slug;
                    if (!completedServices.includes(currentSlug)) {
                        setCompletedServices((prev) => [...prev, currentSlug]);
                    }
                    if (skippedServices.includes(currentSlug)) {
                        setSkippedServices((prev) => prev.filter((s) => s !== currentSlug));
                    }
                    if (currentServiceIndex < selectedServices.length - 1) {
                        setCurrentServiceIndex(currentServiceIndex + 1);
                    } else {
                        setStep(3);
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [step, selectedServices, currentServiceIndex, currentService, completedServices, skippedServices]);

    const toggleServiceSelection = useCallback((slug: string) => {
        setSelectedServices((prev) =>
            prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        );
    }, []);

    const markAsCompleted = useCallback((slug: string) => {
        if (!completedServices.includes(slug)) {
            setCompletedServices((prev) => [...prev, slug]);
        }
        // Remove from skipped if it was there
        if (skippedServices.includes(slug)) {
            setSkippedServices((prev) => prev.filter((s) => s !== slug));
        }
    }, [completedServices, skippedServices]);

    const markAsSkipped = useCallback((slug: string) => {
        if (!skippedServices.includes(slug)) {
            setSkippedServices((prev) => [...prev, slug]);
        }
        // Remove from completed if it was there (though unlikely in this flow)
        if (completedServices.includes(slug)) {
            setCompletedServices((prev) => prev.filter((s) => s !== slug));
        }
    }, [skippedServices, completedServices]);

    const saveProgress = () => {
        const saveData: SaveData = {
            selectedServices,
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
        link.download = `suppression-donnees-${new Date().toISOString().split("T")[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const loadProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data: SaveData = JSON.parse(e.target?.result as string);
                    setSelectedServices(data.selectedServices || []);
                    setCompletedServices(data.completedServices || []);
                    setSkippedServices(data.skippedServices || []);
                    setNotes(data.notes || {});
                    alert("Progression chargée avec succès !");
                } catch (error) {
                    alert("Erreur lors du chargement du fichier");
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">{t.t("title")}</h1>
                    <p className="text-xl max-w-3xl mx-auto mb-6">
                        {t.t("description")}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {protectDataAvailable && !protectDataLoaded && (
                            <button
                                onClick={loadFromProtectData}
                                className="btn btn-success gap-2"
                                title={t.t("loadFromProtectDataTitle").replace('{count}', String(protectDataCount))}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                {t.t("loadFromProtectData").replace('{count}', String(protectDataCount))}
                            </button>
                        )}
                        {selectedServices.length > 0 && (
                            <button
                                onClick={resetCurrentSelection}
                                className="btn btn-error btn-outline gap-2"
                                title={t.t("clearCurrentSelection")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {t.t("resetSelection")}
                            </button>
                        )}
                        <button
                            onClick={saveProgress}
                            className="btn btn-outline gap-2"
                            title={t.t("save")}
                        >
                            {t.t("save")}
                        </button>
                        <label
                            className="btn btn-outline gap-2 cursor-pointer"
                            title={t.t("load")}
                        >
                            {t.t("load")}
                            <input
                                type="file"
                                accept=",.json"
                                onChange={loadProgress}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Banner when coming from risk analysis */}
                    {fromRiskAnalysis && (
                        <div className="alert alert-info mt-6 max-w-2xl mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <div>
                                <h3 className="font-bold">{t.t("bulkDeleteTitle")}</h3>
                                <p className="text-sm">{selectedServices.length} {t.t("bulkDeleteDesc")}</p>
                            </div>
                            <Link
                                href={locale === 'fr' ? '/evaluer-mes-risques' : '/evaluate-my-risks'}
                                className="btn btn-sm btn-ghost"
                            >
                                {t.t("backToRiskAnalysis")}
                            </Link>
                        </div>
                    )}
                </div>


                {/* Step 1: Service Selection */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-2xl">
                                    {t.t("selectServicesTitle")}
                                </h2>
                                <p className="text-base-content/70">
                                    {t.t("selectServicesDesc")}
                                </p>

                                <ServiceSearchBar
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    placeholder={t.t("searchPlaceholder")}
                                    className="mt-4"
                                    lang={locale}
                                />

                                {selectedServices.length > 0 && (
                                    <div className="alert alert-info mt-4">
                                        <span>✓ {selectedServices.length} {selectedServices.length > 1 ? t.t("selectedInfo").split('|')[1] : t.t("selectedInfo").split('|')[0]}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredServices.map((service) => (
                                <DeletionServiceCard
                                    key={service.slug}
                                    service={service}
                                    isSelected={selectedServices.includes(service.slug)}
                                    onToggle={toggleServiceSelection}
                                />
                            ))}
                        </div>

                    </div>
                )}

                {/* Step 2: Deletion Process */}
                {step === 2 && currentService && (
                    <DeletionFlow
                        services={selectedServicesList as any}
                        currentServiceIndex={currentServiceIndex}
                        completedServices={completedServices}
                        skippedServices={skippedServices}
                        notes={notes}
                        lang={locale}
                        showBackButton={false}
                        showPreviousButton={!isSingleServiceMode}
                        showSkipButton={!isSingleServiceMode}
                        totalSelected={selectedServices.length}
                        cardRef={serviceCardRef}
                        onPrevious={() => {
                            if (currentServiceIndex > 0) {
                                setCurrentServiceIndex(currentServiceIndex - 1);
                            }
                        }}
                        onSkip={(slug: string) => {
                            markAsSkipped(slug);
                            if (currentServiceIndex < selectedServicesList.length - 1) {
                                setCurrentServiceIndex(currentServiceIndex + 1);
                            } else {
                                setStep(3);
                            }
                        }}
                        onComplete={(slug: string) => {
                            markAsCompleted(slug);
                            if (currentServiceIndex < selectedServicesList.length - 1) {
                                setCurrentServiceIndex(currentServiceIndex + 1);
                            } else {
                                setStep(3);
                            }
                        }}
                        onNavigate={(index: number) => setCurrentServiceIndex(index)}
                        setNotes={setNotes}
                    />
                )}


                {/* Step 3: Completion */}
                {step === 3 && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body text-center">
                                <div className="text-6xl mb-4">
                                    {completedServices.length === selectedServices.length ? "🎉" : "📊"}
                                </div>
                                <h2 className="card-title text-3xl justify-center">
                                    {completedServices.length === selectedServices.length ? t.t("congratulations") : t.t("sessionSummaryTitle")}
                                </h2>
                                <p className="text-lg">
                                    {completedServices.length === selectedServices.length
                                        ? t.t("treatedAll")
                                        : t.t("sessionSummary").replace('{completed}', String(completedServices.length)).replace('{total}', String(selectedServices.length))}
                                </p>

                                <div className="stats shadow mt-6">
                                    <div className="stat">
                                        <div className="stat-title">{t.t("servicesTreated")}</div>
                                        <div className="stat-value text-primary">{completedServices.length}</div>
                                        <div className="stat-desc">{t.t("selectedOf").replace('{total}', String(selectedServices.length))}</div>
                                    </div>
                                </div>


                                {/* Summary */}
                                {selectedServices.length > 0 && (
                                    <div className="card bg-base-100 shadow-lg">
                                        <div className="card-body">
                                            <h3 className="card-title">{t.t("summary")}</h3>
                                            <div className="overflow-x-auto">
                                                <table className="table table-zebra">
                                                    <thead>
                                                        <tr>
                                                            <th>{t.t("tableHeaderService")}</th>
                                                            <th>{t.t("tableHeaderStatus")}</th>
                                                            <th>{t.t("tableHeaderNotes")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedServicesList.map((service) => (
                                                            <tr key={service.slug}>
                                                                <td className="font-medium">{service.name}</td>
                                                                <td>
                                                                    {completedServices.includes(service.slug) ? (
                                                                        <span className="badge badge-success">✓ {t.t("badgeTreated")}</span>
                                                                    ) : skippedServices.includes(service.slug) ? (
                                                                        <button
                                                                            className="badge badge-warning gap-1 cursor-pointer hover:scale-105 transition-transform"
                                                                            onClick={() => {
                                                                                const index = selectedServicesList.findIndex(
                                                                                    (s) => s.slug === service.slug
                                                                                );
                                                                                setCurrentServiceIndex(index);
                                                                                setStep(2);
                                                                            }}
                                                                        >
                                                                            ⚠ {t.t("badgePending")}
                                                                        </button>
                                                                    ) : (
                                                                        <span className="badge badge-ghost">{t.t("badgeTodo")}</span>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        className="stroke-current shrink-0 w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <div className="text-left text-white ">
                                        <h3 className="font-bold">{t.t("nextStepsTitle")}</h3>
                                        <ul className="text-sm mt-2 space-y-1">
                                            <li>{t.t("nextStepsList1")}</li>
                                            <li>{t.t("nextStepsList2")}</li>
                                            <li>{t.t("nextStepsList3")}</li>
                                            <li>{t.t("nextStepsList4")}</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        className="btn btn-primary"
                                        onClick={saveProgress}
                                    >
                                        {t.t("saveProgress")}
                                    </button>
                                    {fromRiskAnalysis && (
                                        <Link
                                            href={locale === 'fr' ? '/evaluer-mes-risques' : '/evaluate-my-risks'}
                                            className="btn btn-secondary"
                                        >
                                            {t.t("updateRiskAnalysis")}
                                        </Link>
                                    )}
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => {
                                            setStep(1);
                                            setSelectedServices([]);
                                            setCompletedServices([]);
                                            setNotes({});
                                            setCurrentServiceIndex(0);
                                            setSearchTerm("");
                                            setFromRiskAnalysis(false);
                                        }}
                                    >
                                        {t.t("restart")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sticky Continue Button */}
                {step === 1 && selectedServices.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                        <button
                            className="btn btn-primary btn-lg shadow-2xl gap-2"
                            onClick={() => setStep(2)}
                        >
                            {t.t("continueWith")} {selectedServices.length} {t.t("servicesLabel")}
                            →
                        </button>
                    </div>
                )}

                {step === 2 && currentService && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                        <div className={`flex gap-3 bg-base-100 p-3 rounded-box shadow-2xl border border-base-300 ${isSingleServiceMode ? 'justify-center' : ''}`}>
                            {/* Skip button - Hidden in single service mode */}
                            {!isSingleServiceMode && (
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => {
                                        markAsSkipped(currentService.slug);
                                        if (currentServiceIndex < selectedServicesList.length - 1) {
                                            setCurrentServiceIndex(currentServiceIndex + 1);
                                        } else {
                                            setStep(3);
                                        }
                                    }}
                                >
                                    {t.t("skipForLater")}
                                </button>
                            )}
                            <button
                                className="btn btn-primary btn-lg shadow-lg"
                                onClick={() => {
                                    markAsCompleted(currentService.slug);
                                    if (currentServiceIndex < selectedServicesList.length - 1) {
                                        setCurrentServiceIndex(currentServiceIndex + 1);
                                    } else {
                                        setStep(3);
                                    }
                                }}
                            >
                                {completedServices.includes(currentService.slug) ? t.t("next") : t.t("markCompleted")}
                                {!isSingleServiceMode && " →"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
