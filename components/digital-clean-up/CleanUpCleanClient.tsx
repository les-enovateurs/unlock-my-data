"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCleanUpContext } from "@/context/CleanUpContext";
import { ChevronLeft, ArrowRight, Check, Leaf } from "lucide-react";
import GuideViewer from "@/components/digital-clean-up/GuideViewer";
import CleanUpStepper from "@/components/digital-clean-up/CleanUpStepper";
import Translator from "@/components/tools/t";
import dict from "@/i18n/DigitalCleanUp.json";
import { useLanguage } from "@/context/LanguageContext";
import { CLEAN_UP_CONCERNED_CHILDREN_BY_SUITE } from "@/constants/digitalCleanUp";

export default function CleanUpCleanClient({ params }: { params: { suiteId: string } }) {
    const router = useRouter();
    const { suiteId } = params;
    const { getOrderedSuites, getNextRoute, usedVolumes, setUsedVolumes, savedVolumes, setSavedVolumes } = useCleanUpContext();
    const { lang } = useLanguage();
    const t = new Translator(dict, lang);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const suites = getOrderedSuites();
    const currentSuite = suites.find(s => s.id === suiteId);

    const displayedChildren = useMemo(() => {
        if (!currentSuite) return [];
        return currentSuite.id in CLEAN_UP_CONCERNED_CHILDREN_BY_SUITE
            ? currentSuite.children.filter(c => CLEAN_UP_CONCERNED_CHILDREN_BY_SUITE[currentSuite.id].includes(c.slug))
            : currentSuite.children;
    }, [currentSuite]);

    if (!mounted) return null;

    if (!currentSuite) {
        if (suites.length > 0) router.push(`/digital-clean-up/audit/${suites[0].id}`);
        else router.push("/digital-clean-up");
        return null;
    }

    const currentIndex = suites.findIndex(s => s.id === suiteId);
    const isLastSuite = currentIndex === suites.length - 1;

    const handleBack = () => {
        router.push(`/digital-clean-up/audit/${suiteId}`);
    };

    const handleNext = () => {
        router.push(getNextRoute("clean", suiteId) || "/digital-clean-up");
    };

    const handleSavedVolumeChange = (slug: string, rawValue: string) => {
        const nextSaved = { ...savedVolumes };
        const trimmedValue = rawValue.trim();
        if (trimmedValue === "") {
            delete nextSaved[slug];
        } else {
            const val = parseFloat(trimmedValue);
            if (!isNaN(val) && val >= 0) {
                nextSaved[slug] = val;
            }
        }
        setSavedVolumes(nextSaved);
    };

    const handleSuiteNavigation = (direction: -1 | 1) => {
        const nextIndex = Math.max(0, Math.min(suites.length - 1, currentIndex + direction));
        const nextSuite = suites[nextIndex];
        if (!nextSuite || nextSuite.id === suiteId) return;
        router.push(`/digital-clean-up/clean/${nextSuite.id}`);
    };

    const handleSuiteSelectChange = (nextSuiteId: string) => {
        if (!nextSuiteId || nextSuiteId === suiteId) return;
        router.push(`/digital-clean-up/clean/${nextSuiteId}`);
    };

    const groupSavedVol = displayedChildren.reduce((sum, child) => sum + (savedVolumes[child.slug] || 0), 0);
    const childCount = displayedChildren.length;

    return (
        <div className="min-h-screen bg-umd-slate-50">
            <div className="max-w-[860px] mx-auto px-6 pt-8 pb-28">
                <CleanUpStepper current="clean" lang={lang} />

                <div className="mb-[22px]">
                    <h2 className="umd-heading-2 text-[clamp(22px,2.6vw,30px)] mb-2">{t.t("cleanPageTitle", { name: currentSuite.name })}</h2>
                    <p className="text-[14.5px] leading-[1.55] text-umd-slate-500 max-w-[680px]">{t.t("cleanPageDesc")}</p>
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
                        {groupSavedVol > 0 && (
                            <span className="umd-chip umd-chip-safe font-extrabold">
                                <Leaf className="w-[13px] h-[13px]" />
                                {groupSavedVol.toFixed(1)} {t.t("auditUnit")}
                            </span>
                        )}
                    </div>

                    <div className="p-[22px] flex flex-col gap-[18px]">
                        {childCount === 0 ? (
                            <p className="text-umd-slate-500 italic text-center py-8">{t.t("cleanNoSubservices")}</p>
                        ) : (
                            displayedChildren.map(child => (
                                <div key={child.slug} className="border border-umd-slate-200 rounded-2xl overflow-hidden">
                                    <div className="flex items-center gap-3 px-4 py-3 bg-umd-slate-50 border-b border-umd-slate-100">
                                        <span className="w-[30px] h-[30px] rounded-lg bg-white border border-umd-slate-200 flex items-center justify-center overflow-hidden p-1 shrink-0">
                                            {child.logo ? (
                                                <img src={child.logo} alt="" className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-xs font-extrabold">{child.name.charAt(0)}</span>
                                            )}
                                        </span>
                                        <span className="font-display font-bold text-base flex-1">{child.name}</span>
                                        {savedVolumes[child.slug] !== undefined && (
                                            <span className="umd-chip umd-chip-safe !text-[11.5px]">
                                                <Check className="w-3 h-3" />
                                                {savedVolumes[child.slug]} {t.t("auditUnit")}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col gap-4">
                                        <GuideViewer slug={child.slug} type="clean" lang={lang} variant="card" />

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            <div className="bg-white border border-umd-slate-200 rounded-xl p-3.5">
                                                <label className="block font-bold text-[12.5px] mb-2">{t.t("cleanUsedBefore")}</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="Ex : 5"
                                                        className="umd-input !px-2.5 !py-2"
                                                        value={usedVolumes[child.slug] || ""}
                                                        onChange={e => setUsedVolumes({ ...usedVolumes, [child.slug]: e.target.value })}
                                                    />
                                                    <span className="font-bold text-umd-slate-500">{t.t("auditUnit")}</span>
                                                </div>
                                            </div>

                                            <div className="bg-umd-green-50 border border-umd-green-300 rounded-xl p-3.5">
                                                <label className="block font-bold text-[12.5px] text-umd-green-700 mb-2">{t.t("cleanFreedAfter")} ✨</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        placeholder="Ex : 1.5"
                                                        className="umd-input !px-2.5 !py-2 font-bold"
                                                        value={savedVolumes[child.slug] ?? ""}
                                                        onChange={e => handleSavedVolumeChange(child.slug, e.target.value)}
                                                    />
                                                    <span className="font-bold text-umd-slate-500">{t.t("auditUnit")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* NAV */}
                <div className="flex justify-between items-center gap-3.5 mt-7">
                    <button onClick={handleBack} className="umd-btn umd-btn-ghost cursor-pointer">
                        <ChevronLeft className="w-4 h-4" />
                        {t.t("cleanBackToAudit")}
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
                            {isLastSuite ? (
                                <>{t.t("cleanFinish")} <Check className="w-5 h-5" /></>
                            ) : (
                                <>{t.t("cleanNextSuite")} <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
