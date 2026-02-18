import {
  CheckCircle,
  Download,
  AlertTriangle,
  RefreshCcw,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import Image from "next/image";
import { type Service, type ServiceDetails } from "@/constants/protectData";
import dict from "../../i18n/ProtectMyData.json"
import Translator from "../tools/t";

interface Props {
  lang: string;
  completedServicesLength: number;
  selectedSlugsSize: number;
  sortedServices: Service[];
  serviceDetails: Record<string, ServiceDetails>;
  completedServices: string[];
  skippedServices: string[];
  notes: Record<string, string>;
  setCurrentServiceIndex: (index: number) => void;
  setStep: (step: number) => void;
  saveToFile: () => void;
  restart: () => void;
}

export default function ProtectDataSummary({
  lang,
  completedServicesLength,
  selectedSlugsSize,
  sortedServices,
  serviceDetails,
  completedServices,
  skippedServices,
  notes,
  setCurrentServiceIndex,
  setStep,
  saveToFile,
  restart
}: Props) {
    const t = new Translator(dict, lang);
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero / Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full text-green-600 mb-4">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold">
          {t.t("operationCompleted")}
        </h2>
        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
          {t.t("progressProcessed") // Note: Translator doesn't support placeholders out of the box, need manual replace
            .replace("{completed}", String(completedServicesLength))
            .replace("{total}", String(selectedSlugsSize))}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <button onClick={saveToFile} className="btn btn-primary gap-2">
            <Download className="w-4 h-4" />
            {t.t("downloadReport")}
          </button>
          <button onClick={restart} className="btn btn-outline gap-2">
            <RefreshCcw className="w-4 h-4" />
            {t.t("restart")}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-success">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="stat-title">
              {t.t("securedServices")}
            </div>
            <div className="stat-value text-success">{completedServicesLength}</div>
            <div className="stat-desc">
              {t.t("servicesTreated")}
            </div>
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-warning">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="stat-title">
              {t.t("skippedServices")}
            </div>
            <div className="stat-value text-warning">{skippedServices.length}</div>
            <div className="stat-desc">
              {t.t("skippedDescription")}
            </div>
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="stat-title">
              {t.t("riskReduced")}
            </div>
            <div className="stat-value text-primary">
              {Math.round((completedServicesLength / (selectedSlugsSize || 1)) * 100)}%
            </div>
            <div className="stat-desc">
              {t.t("overallProgress")}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed List */}
      <div className="bg-base-100 rounded-box shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6">
          {t.t("actionDetails")}
        </h3>

        <div className="space-y-4">
          {sortedServices.map((service) => {
            const isCompleted = completedServices.includes(service.slug);
            const isSkipped = skippedServices.includes(service.slug);
            const hasNote = notes[service.slug];
            const detail = serviceDetails[service.slug];

            return (
              <div
                key={service.slug}
                className={`p-4 rounded-xl border ${
                  isCompleted 
                    ? "border-success/20 bg-success/5" 
                    : isSkipped 
                      ? "border-warning/20 bg-warning/5" 
                      : "border-base-300"
                } transition-all`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-base-200 shrink-0">
                      {service.logo ? (
                        <Image
                          src={service.logo}
                          alt={service.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                          {service.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold flex items-center gap-2">
                        {service.name}
                      </h4>
                      <div className="text-sm opacity-70 flex items-center gap-2">
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-black">
                            <CheckCircle className="w-3 h-3" />
                            {t.t("processed")}
                          </span>
                        )}
                        {isSkipped && (
                          <span className="text-warning flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {t.t("skipped")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* Retry/Edit button for skipped items */}
                    {isSkipped && (
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => {
                          const idx = sortedServices.findIndex(s => s.slug === service.slug);
                          if (idx !== -1) {
                            setCurrentServiceIndex(idx);
                            setStep(3);
                          }
                        }}
                      >
                        {t.t("resume")}
                      </button>
                    )}
                  </div>
                </div>

                {/* Notes Display */}
                {hasNote && (
                  <div className="mt-3 p-3 bg-base-200/50 rounded-lg text-sm italic">
                    <span className="font-semibold not-italic mr-2">{lang === "fr" ? "Note :" : "Note:"}</span>
                    {hasNote}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="alert bg-base-200">
        <ShieldCheck className="w-5 h-5" />
        <div>
          <h3 className="font-bold">{t.t("whatsNext")}</h3>
          <div className="text-xs">
            {t.t("whatsNextDesc")}
          </div>
        </div>
      </div>
    </div>
  );
}

