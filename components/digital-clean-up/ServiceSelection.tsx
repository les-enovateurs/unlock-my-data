"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import Translator from "../tools/t";
import dict from "../../i18n/DigitalCleanUp.json";
import { CLEAN_UP_CONCERNED_CHILDREN_BY_SUITE, DIGITAL_CLEAN_UP_SUITES, ServiceSuite } from "@/constants/digitalCleanUp";
import { Service } from "@/constants/protectData";

interface ServiceSelectionProps {
    lang: string;
    selectedServices: string[];
    setSelectedServices: (services: string[]) => void;
    onNext: () => void;
}

export default function ServiceSelection({
    lang,
    selectedServices,
    setSelectedServices,
    onNext,
}: ServiceSelectionProps) {
    const t = new Translator(dict, lang);
    const [allServices, setAllServices] = useState<Service[]>([]);

    const hasInitDefaults = useRef(false);
    const availableServiceSlugs = useMemo(() => new Set(allServices.map((s) => s.slug)), [allServices]);

    const getSuiteAvailableChildren = (suite: ServiceSuite) => {
        const concernedChildren = CLEAN_UP_CONCERNED_CHILDREN_BY_SUITE[suite.id] || suite.children;
        if (availableServiceSlugs.size === 0) {
            return concernedChildren;
        }
        return concernedChildren.filter((slug) => availableServiceSlugs.has(slug));
    };

    // Fetch all services from the existing JSON
    useEffect(() => {
        let mounted = true;
        fetch("/data/services.json")
            .then((res) => res.json())
            .then((data: Service[]) => {
                if (mounted) {
                    setAllServices(data);

                    // Load from local storage on first mount
                    if (!hasInitDefaults.current) {
                        try {
                            const cached = localStorage.getItem("digitalCleanUp_selected");
                            if (cached) {
                                const parsed = JSON.parse(cached);
                                if (Array.isArray(parsed)) {
                                    const validSlugs = new Set(data.map((service) => service.slug));
                                    const suiteByChild = new Map<string, ServiceSuite>();
                                    DIGITAL_CLEAN_UP_SUITES.forEach((suite) => {
                                        suite.children.forEach((childSlug) => {
                                            suiteByChild.set(childSlug, suite);
                                        });
                                    });

                                    const filteredSelection = parsed.filter((slug) => {
                                        if (typeof slug !== "string" || !validSlugs.has(slug)) return false;
                                        const parentSuite = suiteByChild.get(slug);
                                        if (!parentSuite) return true;
                                        const concernedChildren = CLEAN_UP_CONCERNED_CHILDREN_BY_SUITE[parentSuite.id] || parentSuite.children;
                                        return concernedChildren.includes(slug);
                                    });

                                    setSelectedServices(filteredSelection);
                                }
                            }
                        } catch (e) {
                            console.error("Failed to parse local storage digital clean up");
                        }
                        hasInitDefaults.current = true;
                    }
                }
            })
            .catch((err) => console.error("Failed to fetch services:", err));

        return () => { mounted = false; };
    }, [setSelectedServices]);

    // Save to local storage whenever selected services changes (if init has passed)
    useEffect(() => {
        if (hasInitDefaults.current) {
            localStorage.setItem("digitalCleanUp_selected", JSON.stringify(selectedServices));
        }
    }, [selectedServices]);

    const toggleSuite = (suite: ServiceSuite) => {
        const suiteCurrentChildren = getSuiteAvailableChildren(suite);
        const allSelected = suiteCurrentChildren.every(slug => selectedServices.includes(slug));

        if (allSelected) {
            // Deselect all
            setSelectedServices(selectedServices.filter((s) => !suiteCurrentChildren.includes(s)));
        } else {
            // Select all
            const toAdd = suiteCurrentChildren.filter(slug => !selectedServices.includes(slug));
            setSelectedServices([...selectedServices, ...toAdd]);
        }
    };

    const isSuiteFullySelected = (suite: ServiceSuite) => {
        const suiteChildren = getSuiteAvailableChildren(suite);
        return suiteChildren.length > 0 && suiteChildren.every(slug => selectedServices.includes(slug));
    };

    const isSuitePartiallySelected = (suite: ServiceSuite) => {
        const suiteChildren = getSuiteAvailableChildren(suite);
        const selectedCount = suiteChildren.filter(slug => selectedServices.includes(slug)).length;
        return selectedCount > 0 && selectedCount < suiteChildren.length;
    };


    useEffect(() => {
        const handleEnterToNext = (event: KeyboardEvent) => {
            if (event.key !== "Enter" || event.isComposing) return;

            const target = event.target as HTMLElement | null;
            if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.tagName === "SELECT") {
                return;
            }

            if (selectedServices.length === 0) {
                return;
            }

            event.preventDefault();
            onNext();
        };

        window.addEventListener("keydown", handleEnterToNext);
        return () => window.removeEventListener("keydown", handleEnterToNext);
    }, [onNext, selectedServices.length]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{t.t("selectServicesTitle")}</h2>
                <p className="text-base-content/70">{t.t("selectServicesDesc")}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {DIGITAL_CLEAN_UP_SUITES.map((suite) => {
                    const isSelected = isSuiteFullySelected(suite);
                    const isPartial = isSuitePartiallySelected(suite);
                    const suiteAvailableChildrenCount = getSuiteAvailableChildren(suite).length;

                    return (
                        <button
                            key={suite.id}
                            type="button"
                            onClick={() => toggleSuite(suite)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (selectedServices.length > 0) onNext();
                                }
                            }}
                            className={`relative group flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-300 ${isSelected
                                ? "border-primary bg-primary/10 shadow-lg scale-105"
                                : isPartial
                                    ? "border-primary/50 bg-primary/5 shadow-md scale-[1.02]"
                                    : "border-base-200 bg-base-100 hover:border-primary/40 hover:bg-base-200/50 hover:shadow-md"
                                }`}
                        >
                            <div className="absolute top-4 right-4 z-10">
                                <CheckCircle
                                    className={`w-6 h-6 transition-all duration-300 ${isSelected ? "text-primary scale-100 opacity-100"
                                        : isPartial ? "text-primary/60 scale-90 opacity-100"
                                            : "text-base-content/20 scale-75 opacity-0 group-hover:opacity-50"
                                        }`}
                                />
                            </div>

                            <div className="w-16 h-16 mb-4 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border border-base-200 p-2 relative">
                                {suite.logo ? (
                                    <img
                                        src={suite.logo}
                                        alt={suite.name}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-base-content/50">{suite.name.charAt(0)}</span>
                                )}
                            </div>
                            <h3 className="font-bold text-lg text-center w-full truncate">
                                {suite.name}
                            </h3>
                            <p className="text-sm opacity-60 mt-1 line-clamp-1">{suiteAvailableChildrenCount} {t.t('services') || 'services'}</p>
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-center pt-6 border-t border-base-200">
                <button
                    type="button"
                    onClick={onNext}
                    disabled={selectedServices.length === 0}
                    className="btn btn-primary btn-lg rounded-full px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-base gap-2"
                >
                    {t.t("startCleanUp")}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
