"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCleanUpContext } from "@/context/CleanUpContext";
import { ChevronLeft, ArrowRight, TriangleAlert } from "lucide-react";
import GuideViewer from "@/components/digital-clean-up/GuideViewer";
import CleanUpStepper from "@/components/digital-clean-up/CleanUpStepper";
import Translator from "@/components/tools/t";
import dict from "@/i18n/DigitalCleanUp.json";
import { useLanguage } from "@/context/LanguageContext";
import { CLEAN_UP_CONCERNED_CHILDREN_BY_SUITE } from "@/constants/digitalCleanUp";

export default function CleanUpAuditClient({ params }: { params: { suiteId: string } }) {
    const router = useRouter();
    const { suiteId } = params;
    const { getOrderedSuites, getNextRoute, usedVolumes, setUsedVolumes } = useCleanUpContext();
    const { lang } = useLanguage();
    const t = new Translator(dict, lang);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleEnterToNext = (event: KeyboardEvent) => {
            if (event.key !== "Enter" || event.isComposing) return;

            const target = event.target as HTMLElement | null;
            if (target?.tagName === "TEXTAREA" || target?.tagName === "BUTTON") {
                return;
            }

            event.preventDefault();
            router.push(getNextRoute("audit", suiteId) || "/digital-clean-up");
        };

        window.addEventListener("keydown", handleEnterToNext);
        return () => window.removeEventListener("keydown", handleEnterToNext);
    }, [getNextRoute, router, suiteId]);

    if (!mounted) return null;

    const suites = getOrderedSuites();
    const currentSuite = suites.find(s => s.id === suiteId);

    if (!currentSuite) {
        if (suites.length > 0) router.push(`/digital-clean-up/audit/${suites[0].id}`);
        else router.push("/digital-clean-up");
        return null;
    }

    const currentIndex = suites.findIndex(s => s.id === suiteId);

    const handleBack = () => {
        if (currentIndex === 0) {
            router.push("/digital-clean-up");
        } else {
            const prevSuite = suites[currentIndex - 1];
            router.push(`/digital-clean-up/clean/${prevSuite.id}`);
        }
    };

    const handleNext = () => {
        router.push(getNextRoute("audit", suiteId) || "/digital-clean-up");
    };

    const handleSuiteNavigation = (direction: -1 | 1) => {
        const nextIndex = Math.max(0, Math.min(suites.length - 1, currentIndex + direction));
        const nextSuite = suites[nextIndex];
        if (!nextSuite || nextSuite.id === suiteId) return;
        router.push(`/digital-clean-up/audit/${nextSuite.id}`);
    };

    const handleSuiteSelectChange = (nextSuiteId: string) => {
        if (!nextSuiteId || nextSuiteId === suiteId) return;
        router.push(`/digital-clean-up/audit/${nextSuiteId}`);
    };

    const handleChildVolumeChange = (childSlug: string, value: string) => {
        const newVolumes = { ...usedVolumes, [childSlug]: value };
        const relevantSlugs = currentSuite.id in CLEAN_UP_CONCERNED_CHILDREN_BY_SUITE
            ? CLEAN_UP_CONCERNED_CHILDREN_BY_SUITE[currentSuite.id]
            : currentSuite.children.map(c => c.slug);
        const sum = relevantSlugs.reduce((acc, slug) => acc + (parseFloat(newVolumes[slug]) || 0), 0);
        if (sum > 0) {
            newVolumes[currentSuite.id] = String(sum);
        }
        setUsedVolumes(newVolumes);
    };

    const displayedChildren = currentSuite.id in CLEAN_UP_CONCERNED_CHILDREN_BY_SUITE
        ? currentSuite.children.filter(c => CLEAN_UP_CONCERNED_CHILDREN_BY_SUITE[currentSuite.id].includes(c.slug))
        : currentSuite.children;

    const parentTotal = parseFloat(usedVolumes[currentSuite.id]) || 0;
    const sumChildren = displayedChildren.reduce((acc, c) => acc + (parseFloat(usedVolumes[c.slug]) || 0), 0);
    const isOverflow = parentTotal > 0 && sumChildren > parentTotal;
    const childCount = displayedChildren.length;

    return (
        <div className="min-h-screen bg-umd-slate-50">
            <div className="max-w-[860px] mx-auto px-6 pt-8 pb-28">
                <CleanUpStepper current="audit" lang={lang} />

                <div className="mb-[22px]">
                    <h2 className="umd-heading-2 text-[clamp(22px,2.6vw,30px)] mb-2">{t.t("auditPageTitle", { name: currentSuite.name })}</h2>
                    <p className="text-[14.5px] leading-[1.55] text-umd-slate-500 max-w-[680px]">{t.t("auditPageDesc")}</p>
                </div>

                {/* SuitePanel */}
                <div className="umd-card p-0 overflow-hidden">
                    <div className="flex items-center gap-3.5 px-[22px] py-[18px] border-b border-umd-slate-100">
                        <span className="w-11 h-11 rounded-xl bg-white border border-umd-slate-200 flex items-center justify-center overflow-hidden p-2 shadow-sm shrink-0">
                            {currentSuite.logo ? (
                                <img src={currentSuite.logo} alt={currentSuite.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="font-display font-extrabold text-lg">{currentSuite.name.charAt(0)}</span>
                            )}
                        </span>
                        <div className="flex-1 min-w-0">
                            <div className="font-display font-bold text-lg">{currentSuite.name}</div>
                            <div className="text-[12.5px] text-umd-slate-500">
                                {childCount} {childCount > 1 ? "services concernés" : "service concerné"}
                            </div>
                        </div>
                        {parentTotal > 0 && (
                            <span className="umd-chip umd-chip-safe font-extrabold">{parentTotal.toFixed(1)} {t.t("auditUnit")}</span>
                        )}
                    </div>

                    <div className="p-[22px] flex flex-col gap-[18px]">
                        {/* Volume total */}
                        <div className="bg-umd-green-50 border border-umd-green-200 rounded-2xl p-4">
                            <label className="block font-bold text-sm text-umd-green-700 mb-2.5">{t.t("auditTotalLabel")}</label>
                            <div className="flex items-center gap-2.5 max-w-[300px]">
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Ex : 15"
                                    className="umd-input font-bold text-lg"
                                    value={usedVolumes[currentSuite.id] || ""}
                                    onChange={e => setUsedVolumes({ ...usedVolumes, [currentSuite.id]: e.target.value })}
                                />
                                <span className="font-extrabold text-lg text-umd-green-700">{t.t("auditUnit")}</span>
                            </div>
                        </div>

                        <GuideViewer slug={currentSuite.id} type="volume" lang={lang} variant="card" />

                        {/* Répartition par service */}
                        {childCount > 0 && (
                            <div>
                                <div className="font-display font-bold text-sm mb-3">{t.t("auditDistribution")}</div>

                                {isOverflow && (
                                    <div className="umd-chip umd-chip-warn w-full !justify-start mb-3 whitespace-normal leading-[1.4]">
                                        <TriangleAlert className="w-3.5 h-3.5 shrink-0" />
                                        {t.t("auditOverflowWarning", {
                                            sum: sumChildren.toFixed(1),
                                            total: parentTotal.toFixed(1),
                                            unit: t.t("auditUnit"),
                                        })}
                                    </div>
                                )}

                                <div className="flex flex-col gap-3.5">
                                    {displayedChildren.map(child => {
                                        const childUsed = parseFloat(usedVolumes[child.slug]) || 0;
                                        const base = parentTotal > 0 ? parentTotal : sumChildren;
                                        const percent = base > 0 ? Math.min(100, Math.round((childUsed / base) * 100)) : 0;

                                        return (
                                            <div key={child.slug} className="flex items-center gap-3.5">
                                                <span className="flex items-center gap-2.5 w-[150px] shrink-0 font-bold text-[13.5px]">
                                                    <span className="w-6 h-6 rounded-md bg-white border border-umd-slate-200 flex items-center justify-center overflow-hidden p-0.5 shrink-0">
                                                        {child.logo ? (
                                                            <img src={child.logo} alt="" className="w-full h-full object-contain" />
                                                        ) : (
                                                            <span className="text-[10px] font-extrabold">{child.name.charAt(0)}</span>
                                                        )}
                                                    </span>
                                                    <span className="truncate">{child.name}</span>
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="h-2.5 bg-umd-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-umd-green-500 rounded-full" style={{ width: `${percent}%` }} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 w-[130px] shrink-0">
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        className="umd-input !px-2.5 !py-[7px] !text-[13px]"
                                                        placeholder={t.t("auditUnit")}
                                                        value={usedVolumes[child.slug] || ""}
                                                        onChange={e => handleChildVolumeChange(child.slug, e.target.value)}
                                                    />
                                                    {parentTotal > 0 && childUsed > 0 && (
                                                        <span className="text-xs text-umd-slate-500 w-[34px] text-right">{percent}%</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* NAV */}
                <div className="flex justify-between items-center gap-3.5 mt-7">
                    <button onClick={handleBack} className="umd-btn umd-btn-ghost cursor-pointer">
                        <ChevronLeft className="w-4 h-4" />
                        {t.t("back")}
                    </button>

                    <div className="flex items-center gap-2.5">
                        {suites.length > 1 && (
                            <div className="hidden md:flex items-center gap-1.5">
                                <button
                                    onClick={() => handleSuiteNavigation(-1)}
                                    className="umd-btn umd-btn-ghost umd-btn-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    disabled={currentIndex <= 0}
                                    aria-label={t.t("parentPrev")}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <select
                                    className="umd-input !py-2 !text-[13px] max-w-[200px] cursor-pointer"
                                    value={suiteId}
                                    onChange={(e) => handleSuiteSelectChange(e.target.value)}
                                    aria-label={t.t("parentSelect")}
                                >
                                    {suites.map((suite) => (
                                        <option key={suite.id} value={suite.id}>{suite.name}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleSuiteNavigation(1)}
                                    className="umd-btn umd-btn-ghost umd-btn-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    disabled={currentIndex >= suites.length - 1}
                                    aria-label={t.t("parentNext")}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <button onClick={handleNext} className="umd-btn umd-btn-safe umd-btn-lg cursor-pointer">
                            {t.t("auditNextBtn")} <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
