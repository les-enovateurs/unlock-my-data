"use client";

import { Gauge, SlidersHorizontal, Check } from "lucide-react";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";

export type ProtectMode = "easy" | "advanced";

interface ProtectModeTabsProps {
  lang: string;
  mode: ProtectMode;
  setMode: (m: ProtectMode) => void;
}

export default function ProtectModeTabs({ lang, mode, setMode }: ProtectModeTabsProps) {
  const t = new Translator(dict, lang);

  const tabs: { id: ProtectMode; icon: typeof Gauge; title: string; sub: string }[] = [
    { id: "easy", icon: Gauge, title: t.t("modeEasy"), sub: t.t("modeEasySub") },
    {
      id: "advanced",
      icon: SlidersHorizontal,
      title: t.t("modeAdvanced"),
      sub: t.t("modeAdvancedSub"),
    },
  ];

  return (
    <div role="tablist" className="grid gap-3 sm:grid-cols-2">
      {tabs.map((tab) => {
        const active = mode === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => setMode(tab.id)}
            className={`flex items-center gap-3.5 rounded-2xl border-2 px-5 py-4 text-left transition-colors ${
              active
                ? "border-umd-indigo-500 bg-umd-indigo-50"
                : "border-umd-slate-200 bg-white hover:border-umd-slate-300"
            }`}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                active ? "bg-umd-indigo-600 text-white" : "bg-umd-slate-100 text-umd-slate-500"
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block font-display text-base font-bold text-umd-indigo-900">
                {tab.title}
              </span>
              <span className="mt-0.5 block text-[12.5px] text-umd-slate-500">{tab.sub}</span>
            </span>
            {active && <Check className="h-[17px] w-[17px] text-umd-indigo-600" />}
          </button>
        );
      })}
    </div>
  );
}
