"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCleanUpContext } from "@/context/CleanUpContext";
import { ChevronLeft, ArrowRight, Trash, ChevronDown, ExternalLink, CheckCircle } from "lucide-react";
import GuideViewer from "@/components/digital-clean-up/GuideViewer";

export default function CleanUpCleanClient({ params }: { params: { suiteId: string } }) {
    const router = useRouter();
    const { suiteId } = params;
    const { getOrderedSuites, getNextRoute, usedVolumes, setUsedVolumes, savedVolumes, setSavedVolumes } = useCleanUpContext();
    const [mounted, setMounted] = useState(false);
    const [expandedChild, setExpandedChild] = useState<string | null>(null);
    const [localVolumes, setLocalVolumes] = useState<Record<string, string>>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const suites = getOrderedSuites();
    const currentSuite = suites.find(s => s.id === suiteId);

    if (!currentSuite) {
        if (suites.length > 0) router.push(`/digital-clean-up/audit/${suites[0].id}`);
        else router.push("/digital-clean-up");
        return null;
    }

    const currentIndex = suites.findIndex(s => s.id === suiteId);
    // Add 0.5 to progress because we are halfway through this suite
    const progress = ((currentIndex + 0.5) / suites.length) * 100;

    const handleBack = () => {
        router.push(`/digital-clean-up/audit/${suiteId}`);
    };

    const handleNext = () => {
        router.push(getNextRoute("clean", suiteId) || "/digital-clean-up");
    };

    const handleSaveVolume = (slug: string) => {
        const val = parseFloat(localVolumes[slug]);
        if (!isNaN(val) && val >= 0) {
            setSavedVolumes({ ...savedVolumes, [slug]: val });
        }
    };

    const groupSavedVol = currentSuite.children.reduce((sum, child) => sum + (savedVolumes[child.slug] || 0), 0);
    const hasAnySaved = currentSuite.children.some(child => savedVolumes[child.slug] !== undefined);

    return (
        <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">

                <button onClick={handleBack} className="btn btn-ghost gap-2 -ml-4 mb-2">
                    <ChevronLeft className="w-4 h-4" />
                    Retour à l'audit
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-3">Nettoyage : {currentSuite.name}</h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Suivez les guides pour les services de ce groupe. Videz les corbeilles et notez l'espace libéré.
                    </p>
                </div>

                <div className="w-full bg-base-300 rounded-full h-2.5 mb-8 overflow-hidden relative">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>

                {hasAnySaved && (
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                        <span className="font-bold text-primary">Volume total libéré pour {currentSuite.name} :</span>
                        <span className="badge badge-primary badge-lg font-bold px-4 py-4">{groupSavedVol} Go</span>
                    </div>
                )}

                <div className="bg-white p-6 sm:p-10 rounded-3xl border border-base-200 shadow-sm">
                    <h4 className="font-bold text-xl mb-6 flex items-center gap-3 text-secondary border-b border-secondary/20 pb-4">
                        <Trash className="w-6 h-6" />
                        Actions détaillées
                    </h4>

                    {currentSuite.children.length === 0 ? (
                        <p className="text-base-content/70 italic text-center py-8">Aucun sous-service trouvé pour ce groupe.</p>
                    ) : (
                        <div className="space-y-4">
                            {currentSuite.children.map(child => {
                                const isChildExpanded = expandedChild === child.slug || (currentSuite.children.length === 1);
                                return (
                                    <div key={child.slug} className={`border rounded-2xl bg-white overflow-hidden transition-all ${isChildExpanded ? "border-secondary/40 shadow-md ring-1 ring-secondary/10" : "border-base-200 hover:border-base-300"}`}>
                                        <button
                                            onClick={() => setExpandedChild(isChildExpanded ? null : child.slug)}
                                            className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-base-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-base-100 flex items-center justify-center border border-base-200 p-2 shadow-sm">
                                                    {child.logo ? <img src={child.logo} alt="" className="w-full h-full object-contain" /> : <span className="font-bold text-xl">{child.name.charAt(0)}</span>}
                                                </div>
                                                <span className="font-bold text-base-content/90 text-lg sm:text-xl">{child.name}</span>
                                            </div>
                                            {currentSuite.children.length > 1 && (
                                                <div className={`p-2 rounded-full ${isChildExpanded ? "bg-secondary/10 text-secondary" : "text-base-content/40 bg-base-100"}`}>
                                                    <ChevronDown className={`w-6 h-6 transition-transform ${isChildExpanded ? "rotate-180" : ""}`} />
                                                </div>
                                            )}
                                        </button>

                                        {isChildExpanded && (
                                            <div className="p-4 sm:p-8 border-t border-base-100 bg-secondary/5">
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-base-200">
                                                    <GuideViewer slug={child.slug} type="clean" lang="fr" />
                                                </div>

                                                {(child as any).export && (
                                                    <div className="mt-8 mb-4">
                                                        <a
                                                            href={(child as any).export}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-outline border-secondary/30 text-secondary hover:bg-secondary hover:text-secondary-content gap-2 bg-white rounded-xl shadow-sm"
                                                        >
                                                            <ExternalLink className="w-5 h-5" />
                                                            Accéder à {child.name} pour nettoyer
                                                        </a>
                                                    </div>
                                                )}

                                                <div className="mt-8 pt-8 border-t border-secondary/20">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        {/* Used Space Input (Reference) */}
                                                        <div className="bg-white p-5 rounded-2xl border border-base-200 shadow-sm">
                                                            <label className="block font-bold text-base-content text-sm mb-3">Volume utilisé avant nettoyage</label>
                                                            <div className="flex items-center gap-3">
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    placeholder="Ex: 5"
                                                                    className="input input-bordered w-full"
                                                                    value={usedVolumes[child.slug] || ""}
                                                                    onChange={e => setUsedVolumes({ ...usedVolumes, [child.slug]: e.target.value })}
                                                                />
                                                                <span className="font-bold text-base-content/60">Go</span>
                                                            </div>
                                                        </div>

                                                        {/* Saved Space Input */}
                                                        <div className="bg-white p-5 rounded-2xl border border-secondary/30 shadow-md relative overflow-hidden">
                                                            <div className="absolute left-0 top-0 w-1.5 h-full bg-secondary"></div>
                                                            <label className="block font-bold text-secondary text-sm mb-3">Volume libéré après nettoyage</label>
                                                            <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3">
                                                                <div className="flex items-center gap-3 grow">
                                                                    <input
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="Ex: 1.5"
                                                                        className="input input-bordered w-full focus:ring-2 focus:ring-secondary/20 font-bold"
                                                                        value={localVolumes[child.slug] !== undefined ? localVolumes[child.slug] : (savedVolumes[child.slug] || "")}
                                                                        onChange={e => setLocalVolumes({ ...localVolumes, [child.slug]: e.target.value })}
                                                                    />
                                                                    <span className="font-bold text-base-content/60">Go</span>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleSaveVolume(child.slug)}
                                                                    className="btn btn-secondary whitespace-nowrap"
                                                                >
                                                                    Enregistrer
                                                                </button>
                                                            </div>
                                                            {savedVolumes[child.slug] !== undefined && (
                                                                <div className="text-success text-sm font-bold mt-3 flex items-center gap-1">
                                                                    <CheckCircle className="w-4 h-4" /> Enregistré !
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-base-100/90 backdrop-blur-md border-t border-base-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50 transition-transform duration-500 flex justify-center">
                    <div className="max-w-4xl w-full flex items-center justify-between">
                        <div className="hidden sm:flex flex-col gap-1">
                            <span className="font-bold text-base-content/70 text-sm">
                                Étape {currentIndex + 1} sur {suites.length}
                            </span>
                        </div>
                        <button
                            onClick={handleNext}
                            className={`btn btn-lg rounded-full px-10 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all gap-3 ml-auto ${currentIndex === suites.length - 1 ? "btn-success text-white" : "btn-primary"
                                }`}
                        >
                            {currentIndex === suites.length - 1 ? (
                                <>Terminer le nettoyage <CheckCircle className="w-5 h-5" /></>
                            ) : (
                                <>Suite Suivante <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
