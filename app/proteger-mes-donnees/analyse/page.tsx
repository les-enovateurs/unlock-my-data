"use client";

import { useProtectData } from "@/context/ProtectDataContext";
import ProtectDataHero from "@/components/protect-my-data/ProtectDataHero";
import ProtectDataNav from "@/components/protect-my-data/ProtectDataNav";
import ProtectDataAnalysis from "@/components/protect-my-data/ProtectDataAnalysis";
import { Shield } from "lucide-react";

export default function AnalysePage() {
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
    analyzing,
    selectedServices,
    showDataMap,
    setShowDataMap,
    goToSpecificAction,
    services,
    savedNotification,
    loadedNotification,
  } = useProtectData();

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-primary-600 font-medium flex items-center gap-3">
          <Shield className="animate-pulse" />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  // Handle clicking on an action in the analysis result
  const handleActionClick = (action: any) => {
    goToSpecificAction(action.slug, action.type);
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
          step={2}
          setStep={setStep}
          selectedSlugsSize={selectedSlugs.size}
          hasAnalysisResult={!!analysisResult}
          hasActions={actionsToProcess.length > 0}
          goToAnalysis={goToAnalysis}
          goToActions={goToActions}
          lang={lang}
        />

        <ProtectDataAnalysis
          lang={lang}
          analyzing={analyzing}
          analysisResult={analysisResult}
          selectedSlugsSize={selectedSlugs.size}
          setStep={setStep}
          selectedServices={selectedServices}
          showDataMap={showDataMap}
          setShowDataMap={setShowDataMap}
          goToActions={goToActions}
          actionsCount={actionsToProcess.length}
          handleActionClick={handleActionClick}
        />
      </div>
    </div>
  );
}
