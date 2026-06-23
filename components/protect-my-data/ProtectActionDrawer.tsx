"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import {
  X,
  ArrowRight,
  ShieldCheck,
  Lightbulb,
  BarChart3,
  BookOpenText,
  Trash2,
  Copy,
  Check,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Service } from "@/constants/protectData";
import { EMAIL_TEMPLATES } from "@/constants/emailTemplates";
import { flagEmoji, localizedCountry, isServiceEU } from "@/lib/geo/serviceGeo";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";

export type DrawerMode = "compare" | "guide" | "delete";

interface ProtectActionDrawerProps {
  lang: string;
  mode: DrawerMode;
  service: Service;
  alt: (Service & { better_alternative_explication?: string; better_alternative_explication_en?: string }) | null;
  onClose: () => void;
  onMode: (mode: DrawerMode) => void;
}

export default function ProtectActionDrawer({
  lang,
  mode,
  service,
  alt,
  onClose,
  onMode,
}: ProtectActionDrawerProps) {
  const t = new Translator(dict, lang);
  const [copied, setCopied] = useState<"subject" | "body" | null>(null);
  const [cleanGuide, setCleanGuide] = useState<string>("");

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Load the curated cleanup guide (markdown) for this service, when one exists.
  useEffect(() => {
    let alive = true;
    setCleanGuide("");
    const slug = service.slug;
    const key = lang === "fr" ? "clean_guide_fr" : "clean_guide_en";
    (async () => {
      let path = `/data/cleanup/${slug}/clean.${lang === "fr" ? "fr" : "en"}.md`;
      try {
        const res = await fetch(`/data/manual/${slug}.json`);
        if (res.ok) {
          const data = await res.json();
          if (data[key]) path = data[key];
        }
      } catch {
        /* fall back to default path */
      }
      try {
        const md = await fetch(path);
        if (md.ok && alive) {
          const text = (await md.text()).trim();
          // Guard against SPA fallback returning an HTML page for a missing file.
          if (!text.startsWith("<")) setCleanGuide(text);
        }
      } catch {
        /* no guide — leave empty */
      }
    })();
    return () => {
      alive = false;
    };
  }, [service.slug, lang]);

  const cleanGuideBlock = cleanGuide ? (
    <div className="border-t border-umd-slate-100 pt-5">
      <h3 className="mb-3 font-display text-sm font-bold text-umd-indigo-900">
        {t.t("drawerCleanTitle", { name: service.name })}
      </h3>
      <div className="prose prose-sm max-w-none text-umd-slate-600 prose-headings:font-display prose-headings:text-umd-indigo-900 prose-strong:text-umd-indigo-900 prose-a:text-umd-indigo-700">
        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{cleanGuide}</ReactMarkdown>
      </div>
    </div>
  ) : null;

  const country = (s: Service) =>
    `${flagEmoji(s.country_code)} ${localizedCountry(lang, s.country_code, s.country_name || s.nationality)}`.trim();

  const altWhy = (a: NonNullable<ProtectActionDrawerProps["alt"]>) => {
    const text = lang === "fr" ? a.better_alternative_explication : a.better_alternative_explication_en || a.better_alternative_explication;
    return text || t.t("planWhyFallback");
  };

  // --- Deletion email --------------------------------------------------------
  const tpl = EMAIL_TEMPLATES[lang === "fr" ? "fr" : "en"];
  const subject = tpl.subject;
  const body = tpl.body(service.name);
  const recipient = service.contact_mail_delete || "";
  const compareBase = lang === "fr" ? "/comparer" : "/compare";

  const copy = (which: "subject" | "body", text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  };

  const Avatar = ({ s, indigo = false }: { s?: Service; indigo?: boolean }) => (
    <span
      className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg ${
        indigo ? "bg-umd-indigo-700 text-white" : "border border-umd-slate-100 bg-white"
      }`}
    >
      {indigo ? (
        <ShieldCheck className="h-4 w-4" />
      ) : s?.logo ? (
        <Image src={s.logo} alt={s.name} fill className="object-contain p-1" sizes="36px" />
      ) : (
        <span className="font-display text-sm font-extrabold text-umd-indigo-700">
          {s?.name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Scrim */}
      <div className="absolute inset-0 bg-umd-indigo-950/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-umd-slate-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar s={service} />
            {(mode === "compare" || mode === "guide") && alt && (
              <>
                <ArrowRight className="h-4 w-4 shrink-0 text-umd-indigo-500" />
                <Avatar s={alt} />
                <span className="truncate font-display text-sm font-bold text-umd-indigo-900">
                  {alt.name}
                </span>
              </>
            )}
            {mode === "delete" && (
              <span className="truncate font-display text-sm font-bold text-umd-indigo-900">
                {service.name}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label={t.t("drawerClose")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-umd-slate-400 transition-colors hover:bg-umd-slate-100 hover:text-umd-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* COMPARE */}
          {mode === "compare" && alt && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-lg font-bold text-umd-indigo-900">
                  {t.t("drawerCompareTitle")}
                </h2>
                <p className="mt-1 text-[15px] font-bold text-umd-indigo-700">
                  {alt.name} <span className="font-medium text-umd-slate-500">· {country(alt)}</span>
                </p>
              </div>

              {isServiceEU(alt.country_code) && (
                <div className="flex items-center gap-2 rounded-xl bg-umd-green-50 px-4 py-3 text-sm font-medium text-umd-green-700">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  {t.t("drawerCompareHosted")}
                </div>
              )}

              <div className="rounded-xl bg-umd-indigo-50 px-4 py-3.5">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-umd-indigo-700">
                  <Lightbulb className="h-3.5 w-3.5" />
                  {t.t("drawerWhy")}
                </p>
                <p className="text-[13.5px] leading-relaxed text-umd-slate-600">{altWhy(alt)}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onMode("guide")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-umd-indigo-800 px-5 py-3 font-display font-bold text-white transition-colors hover:bg-umd-indigo-900"
                >
                  <BookOpenText className="h-4 w-4" />
                  {t.t("drawerCompareSwitchGuide")}
                </button>
                <a
                  href={`${compareBase}?services=${service.slug},${alt.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-umd-slate-200 px-5 py-2.5 text-sm font-medium text-umd-slate-700 transition-colors hover:border-umd-indigo-300"
                >
                  <BarChart3 className="h-4 w-4" />
                  {t.t("drawerCompareFullLink")}
                </a>
              </div>
            </div>
          )}

          {/* GUIDE */}
          {mode === "guide" && alt && (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-bold text-umd-indigo-900">
                {t.t("planMigrateTo", { name: alt.name })}{" "}
                <span className="font-medium text-umd-slate-500">· {country(alt)}</span>
              </h2>

              <div className="flex items-start gap-2.5 rounded-xl bg-umd-indigo-50 px-4 py-3.5">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-umd-indigo-600" />
                <p className="text-[13.5px] leading-relaxed text-umd-slate-600">{altWhy(alt)}</p>
              </div>

              <div>
                <h3 className="mb-3 font-display text-sm font-bold text-umd-indigo-900">
                  {t.t("drawerGuideSteps")}
                </h3>
                <ol className="flex flex-col gap-3">
                  {[
                    t.t("drawerGuideStep1", { name: alt.name }),
                    t.t("drawerGuideStep2", { from: service.name }),
                    t.t("drawerGuideStep3"),
                    t.t("drawerGuideStep4", { from: service.name }),
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13.5px] leading-snug text-umd-slate-600">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-umd-indigo-100 font-display text-xs font-bold text-umd-indigo-700">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <button
                onClick={() => onMode("delete")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-umd-red-600 px-5 py-3 font-display font-bold text-white transition-colors hover:bg-umd-red-700"
              >
                <Trash2 className="h-4 w-4" />
                {t.t("drawerGuideLeave", { from: service.name })}
              </button>

              {cleanGuideBlock}
            </div>
          )}

          {/* DELETE */}
          {mode === "delete" && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-lg font-bold text-umd-indigo-900">
                  {t.t("drawerDeleteTitle")}
                </h2>
                <p className="mt-1 text-[13.5px] leading-relaxed text-umd-slate-500">
                  {t.t("drawerDeleteIntro")}
                </p>
              </div>

              {/* Recipient */}
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-umd-slate-500">
                  {t.t("drawerDeleteRecipient")}
                </p>
                {recipient ? (
                  <p className="rounded-lg bg-umd-slate-100 px-3 py-2 text-sm text-umd-slate-700">{recipient}</p>
                ) : (
                  <p className="text-[13px] italic leading-relaxed text-umd-slate-500">
                    {t.t("drawerDeleteNoRecipient")}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-umd-slate-500">
                    {t.t("drawerDeleteSubject")}
                  </p>
                  <button
                    onClick={() => copy("subject", subject)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-umd-indigo-700 hover:text-umd-indigo-900"
                  >
                    {copied === "subject" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied === "subject" ? t.t("drawerCopied") : t.t("drawerCopy")}
                  </button>
                </div>
                <p className="rounded-lg bg-umd-slate-100 px-3 py-2 text-sm text-umd-slate-700">{subject}</p>
              </div>

              {/* Body */}
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-umd-slate-500">
                    {t.t("drawerDeleteBody")}
                  </p>
                  <button
                    onClick={() => copy("body", body)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-umd-indigo-700 hover:text-umd-indigo-900"
                  >
                    {copied === "body" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied === "body" ? t.t("drawerCopied") : t.t("drawerCopy")}
                  </button>
                </div>
                <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg bg-umd-slate-100 px-3 py-2 font-sans text-[13px] leading-relaxed text-umd-slate-700">
                  {body}
                </pre>
              </div>

              {service.url_delete && (
                <a
                  href={service.url_delete}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-umd-indigo-700 hover:text-umd-indigo-900"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t.t("drawerDeleteUrl")}
                </a>
              )}

              {cleanGuideBlock}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between gap-3 border-t border-umd-slate-100 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2.5 text-sm font-bold text-umd-slate-600 transition-colors hover:bg-umd-slate-100"
          >
            {t.t("drawerLater")}
          </button>
          {mode === "delete" && (
            <a
              href={`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
              className="inline-flex items-center gap-2 rounded-full bg-umd-indigo-800 px-5 py-2.5 font-display text-sm font-bold text-white transition-colors hover:bg-umd-indigo-900"
            >
              <Mail className="h-4 w-4" />
              {t.t("drawerSendMail")}
            </a>
          )}
        </footer>
      </aside>
    </div>
  );
}
