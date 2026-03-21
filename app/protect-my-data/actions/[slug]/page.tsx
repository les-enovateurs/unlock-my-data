"use client";

import { useProtectData } from "@/context/ProtectDataContext";
import ProtectDataHero from "@/components/protect-my-data/ProtectDataHero";
import ProtectDataNav from "@/components/protect-my-data/ProtectDataNav";
import ProtectDataActions from "@/components/protect-my-data/ProtectDataActions";
import { Shield } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ActionsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const {
    lang,
    loading,
    saveToFile,
    loadFromFile,
    fileInputRef,
    resetAllData,
    setStep,
    selectedSlugs,
    analysisResult,
    actionsToProcess,
    goToAnalysis,
    goToActions,
    services,
    serviceProgress,
    manualAlternativesMap,
    savedNotification,
    loadedNotification,
  } = useProtectData();

  const serviceCardRef = useRef<HTMLDivElement>(null);

  // Find the index of the current slug in actionsToProcess
  const currentActionIndex = actionsToProcess.findIndex(a => a.slug === slug);

  useEffect(() => {
    if (!loading && currentActionIndex === -1 && actionsToProcess.length > 0) {
      // If slug not found in actions, but there are actions, redirect to the first one
      const basePath = lang === 'fr' ? '/proteger-mes-donnees' : '/protect-my-data';
      router.push(`${basePath}/actions/${actionsToProcess[0].slug}`);
    } else if (!loading && actionsToProcess.length === 0 && selectedSlugs.size > 0) {
        // If no actions to process, go to summary
        const basePath = lang === 'fr' ? '/proteger-mes-donnees' : '/protect-my-data';
        router.push(`${basePath}/summary`);
    }
  }, [currentActionIndex, actionsToProcess, loading, lang, router, selectedSlugs.size]);

  if (loading || currentActionIndex === -1) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-primary-600 font-medium flex items-center gap-3">
          <Shield className="animate-pulse" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const handleSetCurrentActionIndex = (index: number) => {
    const nextSlug = actionsToProcess[index]?.slug;
    if (nextSlug) {
      const basePath = lang === 'fr' ? '/proteger-mes-donnees' : '/protect-my-data';
      router.push(`${basePath}/actions/${nextSlug}`);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-12">
        <ProtectDataHero
          lang={lang}
          savedNotification={savedNotification}
          loadedNotification={loadedNotification}
          saveToFile={saveToFile}
          loadFromFile={loadFromFile}
          fileInputRef={fileInputRef}
          resetAllData={resetAllData}
        />

        <ProtectDataNav
          step={3}
          setStep={setStep}
          selectedSlugsSize={selectedSlugs.size}
          hasAnalysisResult={!!analysisResult}
          hasActions={actionsToProcess.length > 0}
          goToAnalysis={goToAnalysis}
          goToActions={goToActions}
          lang={lang}
        />

        <ProtectDataActions
          lang={lang}
          services={services}
          setStep={setStep}
          currentActionIndex={currentActionIndex}
          setCurrentActionIndex={handleSetCurrentActionIndex}
          actionsToProcess={actionsToProcess}
          alternativesAdopted={serviceProgress.alternativesAdopted}
          alternativesSkipped={serviceProgress.alternativesSkipped}
          markAlternativeAdopted={serviceProgress.markAlternativeAdopted}
          markAlternativeSkipped={serviceProgress.markAlternativeSkipped}
          passwordsChanged={serviceProgress.passwordsChanged}
          markPasswordChanged={serviceProgress.markPasswordChanged}
          dataExported={serviceProgress.dataExported}
          markDataExported={serviceProgress.markDataExported}
          markAsCompleted={serviceProgress.markAsCompleted}
          cardRef={serviceCardRef}
          manualAlternativesMap={manualAlternativesMap}
        />
      </div>
    </div>
  );
}
