"use client";

import { useState } from "react";
import { Layers, ArrowRight, ShieldCheck, SlidersHorizontal } from "lucide-react";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";

interface ProtectEasyProps {
  lang: string;
  onSwitchAdvanced: () => void;
}

// protective:true → answering "no" is the risky choice; false → "yes" is risky.
const PROT_Q: { id: string; protective: boolean }[] = [
  { id: "pwdmgr", protective: true },
  { id: "2fa", protective: true },
  { id: "reuse", protective: false },
  { id: "inactive", protective: true },
  { id: "breach", protective: true },
  { id: "geoloc", protective: false },
];

type Answer = "yes" | "no";

function Segmented({
  value,
  onChange,
  yesLabel,
  noLabel,
}: {
  value?: Answer;
  onChange: (v: Answer) => void;
  yesLabel: string;
  noLabel: string;
}) {
  const opts: { v: Answer; label: string }[] = [
    { v: "yes", label: yesLabel },
    { v: "no", label: noLabel },
  ];
  return (
    <div
      role="radiogroup"
      className="inline-flex shrink-0 overflow-hidden rounded-full border-[1.5px] border-umd-slate-200"
    >
      {opts.map((o) => {
        const on = value === o.v;
        return (
          <button
            key={o.v}
            role="radio"
            aria-checked={on}
            type="button"
            onClick={() => onChange(o.v)}
            className={`px-4 py-[7px] text-[13.5px] font-bold transition-colors ${
              on
                ? "bg-umd-indigo-700 text-white"
                : "bg-white text-umd-slate-600 hover:bg-umd-slate-50"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ProtectEasy({ lang, onSwitchAdvanced }: ProtectEasyProps) {
  const t = new Translator(dict, lang);
  const [ans, setAns] = useState<Record<string, Answer>>({});
  const set = (id: string, v: Answer) => setAns((p) => ({ ...p, [id]: v }));

  const answered = PROT_Q.filter((q) => ans[q.id]);
  const risks = PROT_Q.filter(
    (q) => ans[q.id] && (q.protective ? ans[q.id] === "no" : ans[q.id] === "yes")
  );
  const pct = answered.length
    ? Math.round((risks.length / PROT_Q.length) * 100)
    : 0;

  const level = !answered.length
    ? { t: t.t("levelToEvaluate"), text: "text-umd-slate-400", bar: "bg-umd-slate-300" }
    : risks.length <= 1
      ? { t: t.t("levelLow"), text: "text-umd-green-700", bar: "bg-umd-green-500" }
      : risks.length <= 3
        ? { t: t.t("levelModerate"), text: "text-[#9a6a00]", bar: "bg-umd-amber-400" }
        : { t: t.t("levelHigh"), text: "text-umd-red-700", bar: "bg-umd-red-600" };

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[1.3fr_1fr]">
      {/* Questions */}
      <div>
        <div className="rounded-2xl border border-umd-slate-200 bg-white p-2 shadow-sm">
          {PROT_Q.map((q, i) => (
            <div
              key={q.id}
              className={`flex items-center gap-4 px-4 py-4 ${
                i < PROT_Q.length - 1 ? "border-b border-umd-slate-100" : ""
              }`}
            >
              <span className="flex-1 text-[14.5px] leading-snug text-umd-slate-700">
                {t.t(`protQuiz_${q.id}_q`)}
              </span>
              <Segmented
                value={ans[q.id]}
                onChange={(v) => set(q.id, v)}
                yesLabel={t.t("answerYes")}
                noLabel={t.t("answerNo")}
              />
            </div>
          ))}
        </div>

        {/* Upsell to advanced */}
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-umd-indigo-200 bg-umd-indigo-50 px-5 py-4">
          <Layers className="h-5 w-5 shrink-0 text-umd-indigo-700" />
          <p className="m-0 min-w-[220px] flex-1 text-[13.5px] leading-relaxed text-umd-slate-600">
            {t.t("goAdvancedPrompt")}
          </p>
          <button
            type="button"
            onClick={onSwitchAdvanced}
            className="inline-flex items-center gap-2 rounded-full bg-umd-indigo-800 px-5 py-2.5 font-display text-sm font-bold text-white transition-colors hover:bg-umd-indigo-900"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t.t("passAdvanced")}
          </button>
        </div>
      </div>

      {/* Risk gauge (sticky) */}
      <div className="rounded-2xl border border-umd-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <p className="m-0 mb-3 text-xs font-bold uppercase tracking-[0.1em] text-umd-slate-500">
          {t.t("riskLevelTitle")}
        </p>
        <div className="flex items-baseline gap-2.5">
          <span className={`font-display text-[40px] font-bold leading-none ${level.text}`}>
            {pct}%
          </span>
          <span className={`font-display font-bold ${level.text}`}>{level.t}</span>
        </div>
        <div className="mt-3.5 mb-1 h-2 overflow-hidden rounded-full bg-umd-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-300 ${level.bar}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-[12.5px] text-umd-slate-500">
          {t.t("questionsAnswered", {
            answered: String(answered.length),
            total: String(PROT_Q.length),
          })}
        </p>

        {risks.length > 0 && (
          <div className="mt-[18px] border-t border-umd-slate-200 pt-[18px]">
            <p className="m-0 mb-2.5 text-[13px] font-bold text-umd-slate-700">
              {t.t("recommendationsTitle")}
            </p>
            <ul className="flex flex-col gap-2.5">
              {risks.map((r) => (
                <li
                  key={r.id}
                  className="flex items-start gap-2.5 text-[13px] leading-snug text-umd-slate-600"
                >
                  <ArrowRight className="mt-0.5 h-[15px] w-[15px] shrink-0 text-umd-indigo-600" />
                  {t.t(`protQuiz_${r.id}_tip`)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {answered.length === PROT_Q.length && risks.length === 0 && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-umd-green-50 px-3 py-1.5 text-[13px] font-medium text-umd-green-700">
            <ShieldCheck className="h-4 w-4" />
            {t.t("excellentHabits")}
          </p>
        )}
      </div>
    </div>
  );
}
