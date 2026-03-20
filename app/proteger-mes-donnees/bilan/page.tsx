"use client";

import { useProtectData } from "@/context/ProtectDataContext";
import ProtectDataHero from "@/components/protect-my-data/ProtectDataHero";
import ProtectDataNav from "@/components/protect-my-data/ProtectDataNav";
import ProtectDataSummary from "@/components/protect-my-data/ProtectDataSummary";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BilanPage() {
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
    serviceProgress,
    selectedServices,
    serviceDetails,
    goToSpecificAction,
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

  // Sort services by risk for summary
  const sortedServices = [...selectedServices].sort((a, b) => {
    const scoreA = serviceDetails[a.slug]?.riskScore ?? 0;
    const scoreB = serviceDetails[b.slug]?.riskScore ?? 0;
    return scoreB - scoreA;
  });

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
          step={4}
          setStep={setStep}
          selectedSlugsSize={selectedSlugs.size}
          hasAnalysisResult={!!analysisResult}
          hasActions={actionsToProcess.length > 0}
          goToAnalysis={goToAnalysis}
          goToActions={goToActions}
          lang={lang}
        />

        <ProtectDataSummary
          lang={lang}
          completedServicesLength={serviceProgress.completedServices.length}
          selectedSlugsSize={selectedSlugs.size}
          sortedServices={sortedServices}
          serviceDetails={serviceDetails}
          completedServices={serviceProgress.completedServices}
          skippedServices={serviceProgress.skippedServices}
          alternativesSkipped={serviceProgress.alternativesSkipped}
          notes={serviceProgress.notes}
          setCurrentServiceIndex={() => {}} // Not used as we navigate by URL now
          setStep={setStep}
          saveToFile={saveToFile}
          restart={resetAllData}
          alternativesAdopted={serviceProgress.alternativesAdopted}
          onResume={(slug) => {
            goToSpecificAction(slug, "delete_account"); // Or generic action
          }}
        />
      </div>
    </div>
  );
}
