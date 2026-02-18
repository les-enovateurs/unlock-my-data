import { RefObject } from "react";
import { Service, ServiceDetails } from "@/constants/protectData";
import DeletionFlow from "../shared/DeletionFlow";

interface ProtectDataDeletionProps {
  lang: string;
  setStep: (step: number) => void;
  completedServices: string[];
  selectedSlugsSize: number;
  cardRef: RefObject<HTMLDivElement>;
  serviceDetails: Record<string, ServiceDetails>;
  skippedServices: string[];
  notes: Record<string, string>;
  setNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  currentServiceIndex: number;
  setCurrentServiceIndex: (idx: number) => void;
  sortedServicesLength: number;
  sortedServices: Service[];
  markAsSkipped: (slug: string) => void;
  markAsCompleted: (slug: string) => void;
}

export default function ProtectDataDeletion({
  lang,
  setStep,
  completedServices,
  selectedSlugsSize,
  cardRef,
  serviceDetails,
  skippedServices,
  notes,
  setNotes,
  currentServiceIndex,
  setCurrentServiceIndex,
  sortedServicesLength,
  sortedServices,
  markAsSkipped,
  markAsCompleted,
}: ProtectDataDeletionProps) {

  return (
    <DeletionFlow
      services={sortedServices as any}
      currentServiceIndex={currentServiceIndex}
      completedServices={completedServices}
      skippedServices={skippedServices}
      notes={notes}
      lang={lang}
      showBackButton={true}
      showPreviousButton={true}
      showSkipButton={true}
      totalSelected={selectedSlugsSize}
      serviceDetails={serviceDetails}
      cardRef={cardRef}
      onBack={() => setStep(2)}
      onPrevious={() => {
        if (currentServiceIndex > 0) {
          setCurrentServiceIndex(currentServiceIndex - 1);
        }
      }}
      onSkip={(slug: string) => {
        markAsSkipped(slug);
        if (currentServiceIndex < sortedServicesLength - 1) {
          setCurrentServiceIndex(currentServiceIndex + 1);
        } else {
          setStep(4);
        }
      }}
      onComplete={(slug: string) => {
        markAsCompleted(slug);
        if (currentServiceIndex < sortedServicesLength - 1) {
          setCurrentServiceIndex(currentServiceIndex + 1);
        } else {
          setStep(4);
        }
      }}
      onNavigate={(index: number) => setCurrentServiceIndex(index)}
      setNotes={setNotes}
    />
  );
}

