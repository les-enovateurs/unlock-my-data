"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCleanUpContext } from "@/context/CleanUpContext";
import { ChevronLeft, ArrowRight, HardDrive } from "lucide-react";
import GuideViewer from "@/components/digital-clean-up/GuideViewer";
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
    const progress = ((currentIndex) / suites.length) * 100;

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
        // Auto-sum children into parent total
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

    return (
        <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">

                <button onClick={handleBack} className="btn btn-ghost gap-2 -ml-4 mb-2">
                    <ChevronLeft className="w-4 h-4" />
                    {t.t("back")}
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-3">{t.t("auditPageTitle", { name: currentSuite.name })}</h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        {t.t("auditPageDesc")}
                    </p>
                </div>

                <div className="w-full bg-base-300 rounded-full h-2.5 mb-8 overflow-hidden">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="bg-white p-6 sm:p-10 rounded-3xl border border-base-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>

                    <h4 className="font-bold text-xl mb-6 flex items-center gap-3 text-primary border-b border-primary/20 pb-4">
                        <HardDrive className="w-6 h-6" />
                        {t.t("auditGlobalSpace")}
                    </h4>

                    <div className="flex flex-col xl:flex-row gap-8">
                        <div className="flex-1">
                            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 mb-8">
                                <label className="block text-base font-bold text-primary mb-3">{t.t("auditTotalLabel")}</label>
                                <div className="flex items-center gap-3 w-full sm:max-w-sm">
                                    <input
                                        type="number"
                                        step="any"
                                        placeholder="Ex: 15"
                                        className="input input-lg input-bordered input-primary w-full shadow-inner font-bold text-xl"
                                        value={usedVolumes[currentSuite.id] || ""}
                                        onChange={e => setUsedVolumes({ ...usedVolumes, [currentSuite.id]: e.target.value })}
                                    />
                                    <span className="font-bold text-primary text-2xl">{t.t("auditUnit")}</span>
                                </div>
                            </div>

                            <GuideViewer slug={currentSuite.id} type="volume" lang={lang} variant="card" />
                        </div>

                        {/* Live Graph on the Right */}
                        {displayedChildren.length > 0 && (
                            <div className="w-full xl:w-[350px] shrink-0 bg-base-50 p-6 sm:p-8 rounded-3xl border border-base-200 flex flex-col justify-start">
                                <h5 className="font-bold mb-6 text-center text-lg">{t.t("auditDistribution")}</h5>
                                {(() => {
                                    const parentTotal = parseFloat(usedVolumes[currentSuite.id]) || 0;
                                    const sumChildren = displayedChildren.reduce((acc, c) => acc + (parseFloat(usedVolumes[c.slug]) || 0), 0);
                                    const isOverflow = parentTotal > 0 && sumChildren > parentTotal;
                                    return (
                                        <>
                                            {isOverflow && (
                                                <div className="mb-4 flex items-start gap-2 bg-warning/10 border border-warning/30 text-warning-content rounded-xl p-3 text-xs font-semibold">
                                                    <span className="mt-0.5 text-warning text-base">⚠️</span>
                                                    <span className="text-warning">
                                                        {t.t("auditOverflowWarning", {
                                                            sum: sumChildren.toFixed(1),
                                                            total: parentTotal.toFixed(1),
                                                            unit: t.t("auditUnit")
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1 flex flex-col gap-6">
                                                {displayedChildren.map(child => {
                                                    const childUsed = parseFloat(usedVolumes[child.slug]) || 0;
                                                    // If global total is set, show % of total; otherwise show proportion between children
                                                    const base = parentTotal > 0 ? parentTotal : sumChildren;
                                                    const percent = base > 0 ? Math.min(100, Math.round((childUsed / base) * 100)) : 0;
                                                    const isOverBar = parentTotal > 0 && childUsed > parentTotal;

                                                    return (
                                                        <div key={child.slug} className="w-full">
                                                            <div className="flex justify-between items-center text-sm font-bold mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    {child.logo ? <img src={child.logo} alt="" className="w-5 h-5 object-contain" /> : <div className="w-5 h-5 rounded bg-base-300"></div>}
                                                                    <span className="text-base">{child.name}</span>
                                                                </div>
                                                                <span className={isOverBar ? "text-error font-bold" : "text-secondary"}>
                                                                    {childUsed > 0 ? `${childUsed} ${t.t("auditUnit")}` : '-'}
                                                                    {parentTotal > 0 && childUsed > 0 && <span className="ml-1 font-normal opacity-70">({percent}%)</span>}
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden shadow-inner">
                                                                <div
                                                                    className={`h-full rounded-full transition-all duration-500 ${isOverBar ? 'bg-error' : 'bg-secondary'}`}
                                                                    style={{ width: `${percent}%` }}
                                                                />
                                                            </div>
                                                            <div className="mt-2 flex items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    className="input input-xs input-bordered w-full"
                                                                    placeholder={t.t("auditChildPlaceholder")}
                                                                    value={usedVolumes[child.slug] || ""}
                                                                    onChange={e => handleChildVolumeChange(child.slug, e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    );
                                })()}
                                <p className="text-xs text-center text-base-content/50 mt-6 italic bg-white p-3 rounded-xl border border-base-200">
                                    {t.t("auditChildHint")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-base-100/90 backdrop-blur-md border-t border-base-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 transition-transform duration-500 flex justify-center">
                    <div className="max-w-4xl w-full flex items-center justify-between gap-3">
                        <div className="hidden md:flex items-center gap-2 min-w-0">
                            <button
                                onClick={() => handleSuiteNavigation(-1)}
                                className="btn btn-ghost btn-sm"
                                disabled={currentIndex <= 0}
                                aria-label={t.t("parentPrev")}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <select
                                className="select select-bordered select-sm max-w-[220px]"
                                value={suiteId}
                                onChange={(e) => handleSuiteSelectChange(e.target.value)}
                                aria-label={t.t("parentSelect")}
                            >
                                {suites.map((suite) => (
                                    <option key={suite.id} value={suite.id}>
                                        {suite.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => handleSuiteNavigation(1)}
                                className="btn btn-ghost btn-sm"
                                disabled={currentIndex >= suites.length - 1}
                                aria-label={t.t("parentNext")}
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="hidden sm:flex flex-col gap-1 md:hidden">
                            <span className="font-bold text-base-content/70 text-sm">
                                {t.t("auditStepLabel", { current: String(currentIndex + 1), total: String(suites.length) })}
                            </span>
                        </div>
                        <button
                            onClick={handleNext}
                            className="btn btn-primary btn-lg rounded-full px-10 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all gap-3 ml-auto"
                        >
                            {t.t("auditNextBtn")} <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
