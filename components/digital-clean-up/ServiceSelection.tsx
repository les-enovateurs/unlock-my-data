"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Check, ArrowRight } from "lucide-react";
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
        <div>
            <div className="mb-[22px]">
                <h2 className="umd-heading-2 text-[clamp(22px,2.6vw,30px)] mb-2">{t.t("selectServicesTitle")}</h2>
                <p className="text-[14.5px] leading-[1.55] text-umd-slate-600 max-w-[680px]">{t.t("selectServicesDesc")}</p>
            </div>

            <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
                {DIGITAL_CLEAN_UP_SUITES.map((suite) => {
                    const isSelected = isSuiteFullySelected(suite);
                    const isPartial = isSuitePartiallySelected(suite);
                    const on = isSelected || isPartial;
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
                            className={`umd-card relative flex flex-col items-center gap-3 px-[18px] py-6 text-center cursor-pointer border-2 ${on
                                ? "border-umd-green-500 bg-umd-green-50"
                                : "border-umd-slate-200 bg-white"
                                }`}
                        >
                            <span
                                className={`absolute top-3 right-3 w-6 h-6 rounded-[7px] flex items-center justify-center ${on
                                    ? "bg-umd-green-600 text-white"
                                    : "border-2 border-umd-slate-300 bg-white"
                                    }`}
                            >
                                {on && <Check className="w-4 h-4" />}
                            </span>

                            <span className="w-14 h-14 rounded-xl bg-white border border-umd-slate-200 flex items-center justify-center overflow-hidden p-2.5 shadow-sm shrink-0">
                                {suite.logo ? (
                                    <img src={suite.logo} alt={suite.name} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="font-display font-extrabold text-2xl text-umd-slate-500">{suite.name.charAt(0)}</span>
                                )}
                            </span>
                            <span className="font-display font-bold text-[17px]">{suite.name}</span>
                            <span className="text-[12.5px] text-umd-slate-500">
                                {suiteAvailableChildrenCount} {suiteAvailableChildrenCount > 1 ? "services" : "service"}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-between items-center gap-3.5 mt-7">
                <span />
                <button
                    type="button"
                    onClick={onNext}
                    disabled={selectedServices.length === 0}
                    className={`umd-btn umd-btn-safe umd-btn-lg ${selectedServices.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                    {t.t("startCleanUp")}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
