"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCleanUpContext } from "@/context/CleanUpContext";
import { ChevronLeft, ArrowRight, HardDrive } from "lucide-react";
import GuideViewer from "@/components/digital-clean-up/GuideViewer";

export default function CleanUpAuditClient({ params }: { params: { suiteId: string } }) {
    const router = useRouter();
    const { suiteId } = params;
    const { getOrderedSuites, getNextRoute, usedVolumes, setUsedVolumes } = useCleanUpContext();
    const [mounted, setMounted] = useState(false);

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

    return (
        <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">

                <button onClick={handleBack} className="btn btn-ghost gap-2 -ml-4 mb-2">
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-3">Audit : {currentSuite.name}</h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">
                        Évaluez l'espace de stockage consommé par ce service avant de procéder au nettoyage.
                    </p>
                </div>

                <div className="w-full bg-base-300 rounded-full h-2.5 mb-8 overflow-hidden">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="bg-white p-6 sm:p-10 rounded-3xl border border-base-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>

                    <h4 className="font-bold text-xl mb-6 flex items-center gap-3 text-primary border-b border-primary/20 pb-4">
                        <HardDrive className="w-6 h-6" />
                        Évaluer l'espace global
                    </h4>

                    <div className="flex flex-col xl:flex-row gap-8">
                        <div className="flex-1">
                            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 mb-8">
                                <label className="block text-base font-bold text-primary mb-3">Volume utilisé total actuel :</label>
                                <div className="flex items-center gap-3 w-full sm:max-w-sm">
                                    <input
                                        type="number"
                                        step="any"
                                        placeholder="Ex: 15"
                                        className="input input-lg input-bordered input-primary w-full shadow-inner font-bold text-xl"
                                        value={usedVolumes[currentSuite.id] || ""}
                                        onChange={e => setUsedVolumes({ ...usedVolumes, [currentSuite.id]: e.target.value })}
                                    />
                                    <span className="font-bold text-primary text-2xl">Go</span>
                                </div>
                            </div>

                            <GuideViewer slug={currentSuite.id} type="volume" lang="fr" />
                        </div>

                        {/* Live Graph on the Right */}
                        {currentSuite.children.length > 0 && (
                            <div className="w-full xl:w-[350px] shrink-0 bg-base-50 p-6 sm:p-8 rounded-3xl border border-base-200 flex flex-col justify-start">
                                <h5 className="font-bold mb-6 text-center text-lg">Répartition par service</h5>
                                <div className="flex-1 flex flex-col gap-6">
                                    {currentSuite.children.map(child => {
                                        const childStr = usedVolumes[child.slug];
                                        const childUsed = childStr ? parseFloat(childStr) || 0 : 0;
                                        const parentStr = usedVolumes[currentSuite.id];
                                        const parentUsed = parentStr ? parseFloat(parentStr) || 0 : 0;
                                        const sumChildren = currentSuite.children.reduce((acc, c) => acc + (parseFloat(usedVolumes[c.slug]) || 0), 0);
                                        const maxVal = Math.max(parentUsed, sumChildren);
                                        const percent = maxVal > 0 ? Math.min(100, Math.round((childUsed / maxVal) * 100)) : 0;

                                        return (
                                            <div key={child.slug} className="w-full">
                                                <div className="flex justify-between items-center text-sm font-bold mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {child.logo ? <img src={child.logo} alt="" className="w-5 h-5 object-contain" /> : <div className="w-5 h-5 rounded bg-base-300"></div>}
                                                        <span className="text-base">{child.name}</span>
                                                    </div>
                                                    <span className="text-secondary">{childUsed > 0 ? `${childUsed} Go` : '-'}</span>
                                                </div>
                                                <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden shadow-inner">
                                                    <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        className="input input-xs input-bordered w-full"
                                                        placeholder="Saisir en Go"
                                                        value={usedVolumes[child.slug] || ""}
                                                        onChange={e => setUsedVolumes({ ...usedVolumes, [child.slug]: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-center text-base-content/50 mt-6 italic bg-white p-3 rounded-xl border border-base-200">
                                    Saisissez l'espace utilisé de chaque sous-service ci-dessus pour visualiser la répartition.
                                </p>
                            </div>
                        )}
                    </div>
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
                            className="btn btn-primary btn-lg rounded-full px-10 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all gap-3 ml-auto"
                        >
                            Étape suivante : Nettoyage <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
