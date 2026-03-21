"use client";

import { useProtectData } from "@/context/ProtectDataContext";
import ProtectDataHero from "@/components/protect-my-data/ProtectDataHero";
import ProtectDataNav from "@/components/protect-my-data/ProtectDataNav";
import ProtectDataSelection from "@/components/protect-my-data/ProtectDataSelection";
import { Shield } from "lucide-react";

export default function SelectionPage() {
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
    searchQuery,
    setSearchQuery,
    riskStats,
    filteredServices,
    toggleService,
    quickRiskCache,
    savedNotification,
    loadedNotification,
  } = useProtectData();

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-primary-600 font-medium flex items-center gap-3">
          <Shield className="animate-pulse" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

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
          step={1}
          setStep={setStep}
          selectedSlugsSize={selectedSlugs.size}
          hasAnalysisResult={!!analysisResult}
          hasActions={actionsToProcess.length > 0}
          goToAnalysis={goToAnalysis}
          goToActions={goToActions}
          lang={lang}
        />

        <ProtectDataSelection
          lang={lang}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSlugs={selectedSlugs}
          riskStats={riskStats}
          filteredServices={filteredServices}
          toggleService={toggleService}
          quickRiskCache={quickRiskCache}
          goToAnalysis={goToAnalysis}
        />
      </div>
    </div>
  );
}
