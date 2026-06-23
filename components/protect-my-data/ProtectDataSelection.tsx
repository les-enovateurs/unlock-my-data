"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Search, ArrowRight, ShieldCheck, ListChecks, Check, CornerDownLeft } from "lucide-react";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";
import { Service } from "@/constants/protectData";

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

/**
 * Selection step — design "select" port with a sticky right summary panel so the
 * "Analyser" action stays in view no matter how long the service grid scrolls.
 * Pressing Enter (with at least one app selected) advances to the analysis.
 */
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
  const count = selectedSlugs.size;

  // Enter anywhere on the step advances to analysis when something is selected.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && count > 0) {
        e.preventDefault();
        goToAnalysis();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, goToAnalysis]);

  // Compact stats shown in the panel (only the meaningful, non-zero ones).
  const panelStats = [
    { show: riskStats.highCount > 0, value: riskStats.highCount, label: t.t("highRisk"), text: "text-umd-red-700" },
    { show: riskStats.outsideEUCount > 0, value: riskStats.outsideEUCount, label: t.t("outsideEUServices"), text: "text-umd-red-700" },
    { show: riskStats.breachCount > 0, value: riskStats.breachCount, label: t.t("breachDetected"), text: "text-[#9a6a00]" },
  ].filter((s) => s.show);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
      {/* Left: header + search + grid */}
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-umd-indigo-900 flex items-center gap-2.5">
            <ListChecks className="w-6 h-6 text-umd-indigo-600 shrink-0" />
            {t.t("selectAppsTitle")}
          </h2>
          <p className="mt-1.5 text-umd-slate-600 text-[15px] leading-relaxed">
            {t.t("selectAppsDesc")}{" "}
            <span className="text-umd-slate-500">{t.t("nothingSent")}</span>
          </p>

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

        {/* Service grid */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {filteredServices.map((service) => {
            const on = selectedSlugs.has(service.slug);
            const country = service.nationality || service.country_name || t.t("international");
            return (
              <button
                key={service.slug}
                type="button"
                onClick={() => toggleService(service.slug)}
                aria-pressed={on}
                className={`flex items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-left transition-colors duration-150 ${
                  on
                    ? "border-umd-indigo-500 bg-umd-indigo-50"
                    : "border-umd-slate-200 bg-white hover:border-umd-slate-300"
                }`}
              >
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-umd-slate-100 bg-white">
                  <Image src={service.logo} alt={service.name} fill className="object-contain p-1" sizes="36px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[14.5px] font-bold text-umd-indigo-900">
                    {service.name}
                  </span>
                  <span className="block truncate text-xs text-umd-slate-500">{country}</span>
                </span>
                <span
                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md ${
                    on ? "bg-umd-indigo-600 text-white" : "border-2 border-umd-slate-300 bg-white"
                  }`}
                >
                  {on && <Check className="h-3.5 w-3.5" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: sticky summary panel (desktop) */}
      <aside className="hidden lg:block lg:sticky lg:top-24">
        <div className="rounded-2xl border border-umd-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-umd-slate-500">
            {t.t("selectionPanelTitle")}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold leading-none text-umd-indigo-900">{count}</span>
            <span className="text-sm text-umd-slate-500">{t.t("servicesSelected")}</span>
          </div>

          {panelStats.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-umd-slate-100 pt-4">
              {panelStats.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-[13px]">
                  <span className="text-umd-slate-600">{s.label}</span>
                  <span className={`font-display font-bold ${s.text}`}>{s.value}</span>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            disabled={count === 0}
            onClick={goToAnalysis}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-umd-indigo-800 px-6 py-3 font-display font-bold text-white transition-colors duration-200 hover:bg-umd-indigo-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.t("continueToAnalysis")}
            <ArrowRight className="h-5 w-5" />
          </button>

          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-umd-slate-400">
            {count > 0 ? (
              <>
                <CornerDownLeft className="h-3.5 w-3.5" />
                {t.t("enterHint")}
              </>
            ) : (
              t.t("selectAtLeastOne")
            )}
          </p>
        </div>
      </aside>

      {/* Mobile: sticky bottom action bar */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-umd-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-medium text-umd-indigo-900">
              <ShieldCheck className="h-5 w-5 shrink-0 text-umd-indigo-600" />
              {count} {t.t("servicesSelected")}
            </span>
            <button
              type="button"
              onClick={goToAnalysis}
              className="inline-flex items-center gap-2 rounded-full bg-umd-indigo-800 px-5 py-2.5 font-display font-bold text-white transition-colors hover:bg-umd-indigo-900"
            >
              {t.t("continueToAnalysis")}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
