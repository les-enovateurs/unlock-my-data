import { Search, ArrowRight, ShieldCheck, ListChecks } from "lucide-react";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";
import { Service } from "@/constants/protectData";
import { DeletionServiceCard } from "../shared";

interface ProtectDataSelectionProps {
  lang: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSlugs: Set<string>;
  riskStats: {
    highCount: number;
    mediumCount: number;
    lowCount: number;
    breachCount: number;
    cnilCount: number;
    noDeletionMethodCount: number;
    outsideEUCount: number;
    gaugePercent: number;
  };
  filteredServices: Service[];
  toggleService: (slug: string) => void;
  quickRiskCache: Record<string, "high" | "medium" | "low" | "unknown">;
  goToAnalysis: () => void;
}

export default function ProtectDataSelection({
  lang,
  searchQuery,
  setSearchQuery,
  selectedSlugs,
  riskStats,
  filteredServices,
  toggleService,
  goToAnalysis,
}: ProtectDataSelectionProps) {
  const t = new Translator(dict, lang);

  // Stat tiles — mirrors the "analyse" summary of the design (tinted bg, big number, label, sub).
  const statTiles = [
    {
      show: true,
      value: selectedSlugs.size,
      label: t.t("servicesSelected"),
      sub: null,
      text: "text-umd-indigo-700",
      bg: "bg-umd-indigo-50",
    },
    {
      show: riskStats.highCount > 0,
      value: riskStats.highCount,
      label: t.t("highRisk"),
      sub: null,
      text: "text-umd-red-700",
      bg: "bg-umd-red-50",
    },
    {
      show: riskStats.mediumCount > 0,
      value: riskStats.mediumCount,
      label: t.t("mediumRisk"),
      sub: null,
      text: "text-[#9a6a00]",
      bg: "bg-umd-amber-50",
    },
    {
      show: riskStats.breachCount > 0,
      value: riskStats.breachCount,
      label: t.t("breachDetected"),
      sub: null,
      text: "text-umd-red-700",
      bg: "bg-umd-red-50",
    },
    {
      show: riskStats.cnilCount > 0,
      value: riskStats.cnilCount,
      label: t.t("cnilSanctionDetected"),
      sub: null,
      text: "text-[#9a6a00]",
      bg: "bg-umd-amber-50",
    },
    {
      show: riskStats.noDeletionMethodCount > 0,
      value: riskStats.noDeletionMethodCount,
      label: t.t("noDeletionMethod"),
      sub: null,
      text: "text-[#9a6a00]",
      bg: "bg-umd-amber-50",
    },
    {
      show: riskStats.outsideEUCount > 0,
      value: riskStats.outsideEUCount,
      label: t.t("outsideEUServices"),
      sub: null,
      text: "text-umd-red-700",
      bg: "bg-umd-red-50",
    },
    {
      show: riskStats.lowCount > 0,
      value: riskStats.lowCount,
      label: t.t("lowRisk"),
      sub: null,
      text: "text-umd-green-700",
      bg: "bg-umd-green-50",
    },
  ].filter((tile) => tile.show);

  return (
    <div className="space-y-7">
      {/* Header + search */}
      <div>
        <h2 className="font-display text-2xl font-bold text-umd-indigo-900 flex items-center gap-2.5">
          <ListChecks className="w-6 h-6 text-umd-indigo-600 shrink-0" />
          {t.t("selectAppsTitle")}
        </h2>
        <p className="mt-1.5 text-umd-slate-600 text-[15px]">
          {t.t("selectAppsDesc")}{" "}
          <span className="text-umd-slate-500">{t.t("nothingSent")}</span>
        </p>

        {/* Search */}
        <div className="relative mt-5 flex items-center">
          <input
            type="text"
            className="w-full rounded-xl border border-umd-slate-200 bg-white py-3 pl-12 pr-5 text-umd-slate-700 placeholder-umd-slate-400 transition-all duration-200 focus:border-umd-indigo-500 focus:outline-none focus:ring-2 focus:ring-umd-indigo-200"
            placeholder={t.t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-umd-slate-400" />
        </div>
      </div>

      {/* Stat tiles */}
      {selectedSlugs.size > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {statTiles.map((tile) => (
            <div
              key={tile.label}
              className={`rounded-xl px-4 py-4 text-center ${tile.bg}`}
            >
              <div
                className={`font-display text-3xl font-bold leading-none ${tile.text}`}
              >
                {tile.value}
              </div>
              <div className="mt-2 text-xs font-bold text-umd-slate-700">
                {tile.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => {
          const isSelected = selectedSlugs.has(service.slug);
          return (
            <div key={service.slug} className="relative">
              <DeletionServiceCard
                service={{
                  slug: service.slug,
                  name: service.name,
                  logo: service.logo,
                  nationality:
                    service.nationality ||
                    service.country_name ||
                    t.t("international"),
                }}
                isSelected={isSelected}
                onToggle={toggleService}
              />
            </div>
          );
        })}
      </div>

      {/* Footer action bar — count + analyse (design "select" footer) */}
      {selectedSlugs.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-umd-indigo-200 bg-umd-indigo-50 px-5 py-4">
          <span className="flex items-center gap-2 text-sm font-medium text-umd-indigo-900">
            <ShieldCheck className="h-5 w-5 text-umd-indigo-600 shrink-0" />
            {selectedSlugs.size} {t.t("servicesSelected")}
          </span>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-umd-indigo-800 px-6 py-3 font-display font-bold text-white transition-colors duration-200 hover:bg-umd-indigo-900"
            onClick={goToAnalysis}
          >
            {t.t("continueToAnalysis")}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Sticky continue button (kept for long grids) */}
      {selectedSlugs.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-umd-indigo-800 px-6 py-3 font-display font-bold text-white shadow-2xl transition-colors duration-200 hover:bg-umd-indigo-900"
            onClick={goToAnalysis}
          >
            {t.t("continueToAnalysis")} ({selectedSlugs.size})
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
