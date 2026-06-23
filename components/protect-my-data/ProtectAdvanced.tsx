"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ListChecks,
  Search,
  ListTodo,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Repeat,
  Settings,
  AlertTriangle,
  BookOpenText,
  BarChart3,
  Trash2,
} from "lucide-react";
import { useProtectData } from "@/context/ProtectDataContext";
import {
  Service,
  SERVICE_CATEGORIES,
  getAlternatives,
} from "@/constants/protectData";
import { flagEmoji, localizedCountry, isServiceEU } from "@/lib/geo/serviceGeo";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";
import ProtectDataSelection from "./ProtectDataSelection";
import ProtectActionDrawer, { DrawerMode } from "./ProtectActionDrawer";

type RichService = Service & {
  better_alternative?: boolean;
  better_alternative_explication?: string;
  better_alternative_explication_en?: string;
};

type Step = "select" | "analyse" | "plan";

const STEPS: { id: Step; labelKey: string; icon: typeof ListChecks }[] = [
  { id: "select", labelKey: "stepApps", icon: ListChecks },
  { id: "analyse", labelKey: "stepAnalysis", icon: Search },
  { id: "plan", labelKey: "stepPlan", icon: ListTodo },
];

function categoryLabel(t: Translator, slug: string): string {
  for (const key in SERVICE_CATEGORIES) {
    if (SERVICE_CATEGORIES[key].includes(slug)) return t.t(`cat_${key}`);
  }
  return "";
}

export default function ProtectAdvanced({ lang }: { lang: string }) {
  const t = new Translator(dict, lang);
  const {
    services,
    selectedSlugs,
    selectedServices,
    serviceDetails,
    manualAlternativesMap,
    searchQuery,
    setSearchQuery,
    riskStats,
    quickRiskCache,
    filteredServices,
    toggleService,
  } = useProtectData();

  const [step, setStep] = useState<Step>("select");
  const [drawer, setDrawer] = useState<{ mode: DrawerMode; service: Service; alt: RichService | null } | null>(null);
  const reachable = (s: Step) => (s === "select" ? true : selectedSlugs.size > 0);
  const idx = STEPS.findIndex((s) => s.id === step);

  // --- Derived data ----------------------------------------------------------
  const country = (s: Service) =>
    `${flagEmoji(s.country_code)} ${localizedCountry(lang, s.country_code, s.country_name || s.nationality)}`.trim();

  const ranked = [...selectedServices].sort(
    (a, b) => (serviceDetails[b.slug]?.riskScore ?? 0) - (serviceDetails[a.slug]?.riskScore ?? 0)
  );

  const outEU = selectedServices.filter((s) => !isServiceEU(s.country_code));
  const breachCount = selectedServices.filter((s) => (serviceDetails[s.slug]?.breaches ?? 0) > 0).length;
  const trackersTotal = selectedServices.reduce(
    (n, s) => n + (serviceDetails[s.slug]?.trackers?.length ?? 0),
    0
  );

  const bestAlt = (s: Service): RichService | null => {
    const altServices = getAlternatives(s.slug, manualAlternativesMap)
      .map((slug) => services.find((x) => x.slug === slug) as RichService | undefined)
      .filter(Boolean) as RichService[];
    const euAlts = altServices.filter((a) => isServiceEU(a.country_code));
    return (
      euAlts.find((a) => a.better_alternative) ??
      euAlts[0] ??
      altServices.find((a) => a.better_alternative) ??
      null
    );
  };

  const altWhy = (alt: RichService): string => {
    const fr = alt.better_alternative_explication;
    const en = alt.better_alternative_explication_en;
    const text = lang === "fr" ? fr : en || fr;
    return text || t.t("planWhyFallback");
  };

  // --- Logo / avatar tile ----------------------------------------------------
  const Avatar = ({ s, size = 38 }: { s: Service; size?: number }) => (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-umd-slate-100 bg-white"
      style={{ width: size, height: size }}
    >
      {s.logo ? (
        <Image src={s.logo} alt={s.name} fill className="object-contain p-1" sizes={`${size}px`} />
      ) : (
        <span className="font-display text-sm font-extrabold text-umd-indigo-700">
          {s.name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );

  // --- Risk-level chip -------------------------------------------------------
  const levelChip = (slug: string) => {
    const lvl = quickRiskCache[slug];
    if (lvl === "high")
      return { label: t.t("highRisk"), cls: "text-umd-red-700 bg-umd-red-50 border-umd-red-200" };
    if (lvl === "medium")
      return { label: t.t("mediumRisk"), cls: "text-[#9a6a00] bg-umd-amber-50 border-[#f3d27a]" };
    return { label: t.t("lowRisk"), cls: "text-umd-green-700 bg-umd-green-50 border-umd-green-200" };
  };

  return (
    <div>
      {/* Step nav */}
      <nav className="mb-7 flex items-center justify-center gap-1" aria-label={t.t("progressGlobal")}>
        {STEPS.map((s, i) => {
          const active = step === s.id;
          const done = i < idx;
          const can = reachable(s.id);
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center">
              {i > 0 && (
                <span className={`mx-1 h-px w-6 sm:w-10 ${i <= idx ? "bg-umd-indigo-300" : "bg-umd-slate-200"}`} />
              )}
              <button
                type="button"
                disabled={!can}
                onClick={() => can && setStep(s.id)}
                aria-current={active ? "step" : undefined}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold transition-colors ${
                  active
                    ? "bg-umd-indigo-700 text-white"
                    : done
                      ? "text-umd-indigo-700 hover:bg-umd-indigo-50"
                      : can
                        ? "text-umd-slate-600 hover:bg-umd-slate-100"
                        : "cursor-not-allowed text-umd-slate-400"
                }`}
              >
                <span
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-xs ${
                    active ? "bg-white/20" : done ? "bg-umd-indigo-100 text-umd-indigo-700" : "bg-umd-slate-100 text-umd-slate-500"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </span>
                <span className="whitespace-nowrap">{t.t(s.labelKey)}</span>
              </button>
            </div>
          );
        })}
      </nav>

      {/* STEP: select */}
      {step === "select" && (
        <ProtectDataSelection
          lang={lang}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSlugs={selectedSlugs}
          riskStats={riskStats}
          filteredServices={filteredServices}
          toggleService={toggleService}
          quickRiskCache={quickRiskCache}
          goToAnalysis={() => setStep("analyse")}
        />
      )}

      {/* STEP: analyse */}
      {step === "analyse" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { value: outEU.length, label: t.t("outsideEU"), danger: outEU.length > 0 },
              { value: breachCount, label: t.t("dataBreaches"), danger: breachCount > 0 },
              { value: trackersTotal, label: t.t("trackers"), amber: true },
            ].map((tile) => {
              const tone = tile.amber
                ? { text: "text-[#9a6a00]", bg: "bg-umd-amber-50" }
                : tile.danger
                  ? { text: "text-umd-red-700", bg: "bg-umd-red-50" }
                  : { text: "text-umd-green-700", bg: "bg-umd-green-50" };
              return (
                <div key={tile.label} className={`rounded-2xl px-5 py-4 ${tone.bg}`}>
                  <div className={`font-display text-3xl font-bold leading-none ${tone.text}`}>{tile.value}</div>
                  <div className="mt-1.5 text-[13px] font-bold text-umd-slate-700">{tile.label}</div>
                </div>
              );
            })}
          </div>

          {/* Ranked list w/ signals */}
          <div className="overflow-hidden rounded-2xl border border-umd-slate-200 bg-white shadow-sm">
            {ranked.map((s, i) => {
              const eu = isServiceEU(s.country_code);
              const breaches = serviceDetails[s.slug]?.breaches ?? 0;
              const trackers = serviceDetails[s.slug]?.trackers?.length ?? 0;
              const chip = levelChip(s.slug);
              return (
                <div
                  key={s.slug}
                  className={`flex items-center gap-3.5 px-4 py-3.5 ${i < ranked.length - 1 ? "border-b border-umd-slate-100" : ""}`}
                >
                  <Avatar s={s} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[15px] font-bold text-umd-indigo-900">{s.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {breaches > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-umd-red-50 px-2 py-0.5 text-[11px] font-medium text-umd-red-700">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          {t.t("sigBreach")}
                        </span>
                      )}
                      {trackers > 0 && (
                        <span className="rounded-full bg-umd-amber-50 px-2 py-0.5 text-[11px] font-medium text-[#9a6a00]">
                          {t.t("sigTrackers", { n: String(trackers) })}
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          eu ? "bg-umd-green-50 text-umd-green-700" : "bg-umd-red-50 text-umd-red-700"
                        }`}
                      >
                        {country(s)} · {eu ? t.t("sigEU") : t.t("sigOutEU")}
                      </span>
                    </div>
                  </div>
                  <span className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11.5px] font-medium ${chip.cls}`}>
                    {chip.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep("select")}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-umd-slate-600 transition-colors hover:bg-umd-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.t("editSelection")}
            </button>
            <button
              type="button"
              onClick={() => setStep("plan")}
              className="inline-flex items-center gap-2 rounded-full bg-umd-indigo-800 px-6 py-3 font-display font-bold text-white transition-colors hover:bg-umd-indigo-900"
            >
              {t.t("viewPlan")}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP: plan */}
      {step === "plan" && (
        <div className="space-y-6">
          {outEU.length > 0 ? (
            <p className="text-base text-umd-slate-700">
              {t.t(outEU.length > 1 ? "planLeadRiskPlural" : "planLeadRisk", { count: String(outEU.length) })}
            </p>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-umd-green-200 bg-umd-green-50 px-5 py-4 text-umd-green-700">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">{t.t("planAllGood")}</span>
            </div>
          )}

          <div className="flex flex-col gap-3.5">
            {ranked.map((s) => {
              const eu = isServiceEU(s.country_code);
              const alt = eu ? null : bestAlt(s);
              const cat = categoryLabel(t, s.slug);
              return (
                <div key={s.slug} className="rounded-2xl border border-umd-slate-200 bg-white p-5 shadow-sm">
                  <div className={`flex items-center gap-3 ${eu ? "" : "mb-3.5"}`}>
                    <Avatar s={s} size={38} />
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-base font-bold text-umd-indigo-900">{s.name}</div>
                      <div className="truncate text-xs text-umd-slate-500">
                        {cat ? `${cat} · ` : ""}
                        {country(s)}
                      </div>
                    </div>
                    {eu ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-umd-green-50 px-3 py-1 text-xs font-medium text-umd-green-700">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {t.t("planChipSovereign")}
                      </span>
                    ) : alt ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-umd-indigo-50 px-3 py-1 text-xs font-medium text-umd-indigo-700">
                        <Repeat className="h-3.5 w-3.5" />
                        {t.t("planChipAlternative")}
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-umd-amber-50 px-3 py-1 text-xs font-medium text-[#9a6a00]">
                        <Settings className="h-3.5 w-3.5" />
                        {t.t("planChipCustom")}
                      </span>
                    )}
                  </div>

                  {/* Alternative available */}
                  {!eu && alt && (
                    <div className="flex flex-wrap items-center gap-4 rounded-xl bg-umd-indigo-50 px-4 py-3.5">
                      <ArrowRight className="h-4 w-4 shrink-0 text-umd-indigo-600" />
                      <div className="min-w-[180px] flex-1">
                        <div className="text-[14.5px] font-bold text-umd-indigo-900">
                          {t.t("planMigrateTo", { name: alt.name })}{" "}
                          <span className="font-medium text-umd-slate-600">· {country(alt)}</span>
                        </div>
                        <div className="mt-0.5 text-[13px] leading-relaxed text-umd-slate-600">{altWhy(alt)}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setDrawer({ mode: "compare", service: s, alt })}
                          className="inline-flex items-center gap-1.5 rounded-full border border-umd-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-umd-slate-700 transition-colors hover:border-umd-indigo-300"
                        >
                          <BarChart3 className="h-4 w-4" />
                          {t.t("planCompare")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDrawer({ mode: "guide", service: s, alt })}
                          className="inline-flex items-center gap-1.5 rounded-full bg-umd-indigo-800 px-3.5 py-2 text-sm font-display font-bold text-white transition-colors hover:bg-umd-indigo-900"
                        >
                          <BookOpenText className="h-4 w-4" />
                          {t.t("planGuide")}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* No alternative — custom steps */}
                  {!eu && !alt && (
                    <div>
                      <p className="mb-2.5 text-[13px] leading-relaxed text-umd-slate-500">{t.t("planNoAltIntro")}</p>
                      <ul className="mb-3.5 flex flex-col gap-2">
                        {[t.t("planStep1"), t.t("planStep2"), t.t("planStep3")].map((txt, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-[13px] leading-snug text-umd-slate-600">
                            <span className="font-display font-bold text-umd-indigo-600">{i + 1}.</span>
                            {txt}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => setDrawer({ mode: "delete", service: s, alt: null })}
                        className="inline-flex items-center gap-1.5 rounded-full border border-umd-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-umd-slate-700 transition-colors hover:border-umd-red-200 hover:text-umd-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t.t("planGenerateDeletion")}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex pt-1">
            <button
              type="button"
              onClick={() => setStep("analyse")}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-umd-slate-600 transition-colors hover:bg-umd-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.t("reviewAnalysis")}
            </button>
          </div>
        </div>
      )}

      {drawer && (
        <ProtectActionDrawer
          lang={lang}
          mode={drawer.mode}
          service={drawer.service}
          alt={drawer.alt}
          onClose={() => setDrawer(null)}
          onMode={(mode) => setDrawer((d) => (d ? { ...d, mode } : d))}
        />
      )}
    </div>
  );
}
