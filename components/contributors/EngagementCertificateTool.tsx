"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Award, Printer } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/EngagementCertificate.json";
import {
    getContributorNames,
    getEngagementReport,
    type ActivityItem,
} from "@/lib/contributorEngagement";

interface Props {
    lang: "fr" | "en";
}

const formatDate = (value: string, lang: "fr" | "en"): string => {
    const locale = lang === "fr" ? "fr-FR" : "en-US";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString(locale);
};

const formatMonthLabel = (value: string): string => {
    const [year, month] = value.split("-");
    if (!year || !month || year.length < 4 || month.length < 2) {
        return value;
    }

    const yy = year.slice(-2);
    const mm = month.padStart(2, "0");

    return `${mm}/${yy}`;
};

const typeLabel = (item: ActivityItem, t: Translator): string => {
    if (item.type === "created") return t.t("typeCreated");
    if (item.type === "updated") return t.t("typeUpdated");
    return t.t("typeReviewed");
};

const typeChipClass = (item: ActivityItem): string => {
    if (item.type === "created") return "umd-chip-safe";
    if (item.type === "reviewed") return "umd-chip-warn";
    return "umd-chip-info";
};

export default function EngagementCertificateTool({ lang }: Props) {
    const t = useMemo(() => new Translator(dict, lang), [lang]);
    const searchParams = useSearchParams();
    const contributorNames = useMemo(() => getContributorNames(), []);
    const hasAppliedSearchParam = useRef(false);

    const [selectedName, setSelectedName] = useState(contributorNames[0] || "");

    useEffect(() => {
        if (hasAppliedSearchParam.current) {
            return;
        }

        const pseudoParam = searchParams.get("pseudo") || searchParams.get("name");
        if (!pseudoParam) {
            return;
        }

        const normalized = pseudoParam.trim().toLowerCase();
        const matched = contributorNames.find((name) => name.trim().toLowerCase() === normalized);

        if (matched && matched !== selectedName) {
            setSelectedName(matched);
        }

        hasAppliedSearchParam.current = true;
    }, [contributorNames, searchParams, selectedName]);

    const report = useMemo(() => getEngagementReport(selectedName), [selectedName]);

    const verificationSourceUrl = useMemo(() => {
        if (!report) {
            return "";
        }

        const pathname = lang === "fr" ? "/contribuer/attestation-engagement/" : "/contribute/engagement-certificate/";
        const search = new URLSearchParams({ pseudo: report.contributorName });

        if (typeof window === "undefined") {
            return `${pathname}?${search.toString()}`;
        }

        return `${window.location.origin}${pathname}?${search.toString()}`;
    }, [lang, report]);

    const printCertificate = () => {
        window.print();
    };

    const mergedActivities = useMemo(() => {
        if (!report) {
            return [];
        }

        return [...report.created, ...report.updated, ...report.reviewed].sort((a, b) => a.date.localeCompare(b.date));
    }, [report]);

    const maxBar = Math.max(...(report?.monthlyActivity.map((item) => item.count) || [1]));

    const tiles = report
        ? [
              { label: t.t("created"), value: report.created.length, bg: "var(--green-50)", bd: "var(--green-100)", fg: "var(--green-700)" },
              { label: t.t("updated"), value: report.updated.length, bg: "var(--indigo-50)", bd: "var(--indigo-100)", fg: "var(--indigo-800)" },
              { label: t.t("reviewed"), value: report.reviewed.length, bg: "var(--gold-50)", bd: "var(--gold-100)", fg: "var(--gold-600)" },
              { label: t.t("total"), value: report.total, bg: "var(--slate-50)", bd: "var(--slate-200)", fg: "var(--fg1)" },
          ]
        : [];

    const deliveredParts: string[] = String(t.t("deliveredTo")).split("{name}");

    return (
        <main className="min-h-screen bg-white text-umd-slate-900">
            {/* ---- Hero ---- */}
            <section className="border-b border-umd-slate-200 bg-gradient-to-b from-umd-indigo-50 to-white print:hidden">
                <div className="mx-auto max-w-5xl px-6 pb-10 pt-12">
                    <span className="umd-pill umd-pill-indigo mb-4">
                        <Award className="h-4 w-4" aria-hidden="true" />
                        {t.t("pill")}
                    </span>
                    <h1 className="umd-heading-1 mb-3 max-w-3xl">{t.t("heroTitle")}</h1>
                    <p className="umd-lead-text max-w-2xl">{t.t("heroLead")}</p>
                </div>
            </section>

            <section className="px-6 pb-20 pt-8">
                <div className="mx-auto max-w-4xl">
                    {/* ---- Toolbar ---- */}
                    <div className="umd-card mb-5 flex flex-wrap items-center gap-3 p-4 print:hidden">
                        <label htmlFor="attest-name" className="text-[13.5px] font-bold text-umd-slate-900">
                            {t.t("contributorLabel")}
                        </label>
                        <select
                            id="attest-name"
                            className="umd-input w-full sm:w-64"
                            value={selectedName}
                            onChange={(event) => setSelectedName(event.target.value)}
                        >
                            {contributorNames.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <span className="flex-1" />
                        <button className="umd-btn umd-btn-primary" onClick={printCertificate} disabled={!report}>
                            <Printer className="h-[18px] w-[18px]" aria-hidden="true" />
                            {t.t("printPdf")}
                        </button>
                    </div>

                    {report && (
                        <div id="certificate" className="umd-card px-6 py-8 md:px-9 md:py-8">
                            {/* ---- Certificate header ---- */}
                            <div className="mb-6 flex flex-wrap justify-between gap-5 border-b border-umd-slate-200 pb-5">
                                <div>
                                    <img src="/umd-logo-symbol.svg" alt="Unlock My Data" className="mb-3 h-7 w-auto" />
                                    <h2 className="umd-heading-3 mb-1">{t.t("certificateSubtitle")}</h2>
                                    <p className="m-0 text-[14.5px] text-umd-slate-600">
                                        {deliveredParts.map((part, i) => (
                                            <span key={i}>
                                                {part}
                                                {i < deliveredParts.length - 1 && (
                                                    <strong className="text-umd-slate-900">{report.contributorName}</strong>
                                                )}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                                <div className="text-right text-[12.5px] leading-relaxed text-umd-slate-500">
                                    <div>
                                        {t.t("generatedAt")} <span className="umd-data">{formatDate(new Date().toISOString(), lang)}</span>
                                    </div>
                                    {verificationSourceUrl && (
                                        <div className="mt-1">
                                            {t.t("verificationLabel")}
                                            <br />
                                            <a href={verificationSourceUrl} className="umd-data break-all text-umd-indigo-700 underline">
                                                {verificationSourceUrl}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ---- Stat tiles ---- */}
                            <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4">
                                {tiles.map((tile) => (
                                    <div
                                        key={tile.label}
                                        className="rounded-2xl border p-4"
                                        style={{ background: tile.bg, borderColor: tile.bd }}
                                    >
                                        <div className="text-[12.5px] font-semibold opacity-85" style={{ color: tile.fg }}>
                                            {tile.label}
                                        </div>
                                        <div className="umd-data mt-1 text-[28px] font-bold" style={{ color: tile.fg }}>
                                            {tile.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ---- Activity over time ---- */}
                            <h3 className="mb-3 text-[15.5px] font-bold text-umd-slate-900">{t.t("activityOverTime")}</h3>
                            {report.monthlyActivity.length > 0 ? (
                                <div className="mb-7 rounded-2xl border border-umd-slate-200 px-5 pb-3 pt-5">
                                    <div className="flex h-[120px] items-end gap-3.5">
                                        {report.monthlyActivity.map((item) => (
                                            <div
                                                key={item.month}
                                                className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                                            >
                                                <span className="umd-data text-[11.5px] text-umd-slate-600">{item.count}</span>
                                                <div
                                                    className="w-full max-w-[38px] rounded-t-md bg-umd-indigo-400"
                                                    style={{ height: Math.max(8, (item.count / maxBar) * 78) }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-0 flex gap-3.5 border-t border-umd-slate-100 pt-2">
                                        {report.monthlyActivity.map((item) => (
                                            <span
                                                key={item.month}
                                                className="umd-data flex-1 text-center text-[10.5px] text-umd-slate-500"
                                            >
                                                {formatMonthLabel(item.month)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="mb-7 text-umd-slate-500">{t.t("noData")}</p>
                            )}

                            {/* ---- Contribution detail ---- */}
                            <h3 className="mb-3 text-[15.5px] font-bold text-umd-slate-900">{t.t("listTitle")}</h3>
                            {mergedActivities.length > 0 ? (
                                <div className="overflow-hidden rounded-2xl border border-umd-slate-200">
                                    <table className="w-full border-collapse text-left text-[13.5px]">
                                        <thead>
                                            <tr className="bg-umd-slate-50 text-umd-slate-600">
                                                <th className="px-4 py-2.5 font-semibold">{t.t("colDate")}</th>
                                                <th className="px-4 py-2.5 font-semibold">{t.t("colType")}</th>
                                                <th className="px-4 py-2.5 font-semibold">{t.t("colForm")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mergedActivities.map((item, index) => (
                                                <tr
                                                    key={`${item.type}-${item.company}-${item.date}-${index}`}
                                                    className="border-t border-umd-slate-100"
                                                >
                                                    <td className="umd-data whitespace-nowrap px-4 py-2.5 text-umd-slate-600">
                                                        {formatDate(item.date, lang)}
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <span className={`umd-chip ${typeChipClass(item)} !px-2.5 !py-0.5 !text-[11px]`}>
                                                            {typeLabel(item, t)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 font-semibold text-umd-slate-900">{item.company}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-umd-slate-500">{t.t("noData")}</p>
                            )}

                            <p className="mt-3.5 text-[12px] leading-relaxed text-umd-slate-500">{t.t("footerNote")}</p>
                        </div>
                    )}
                </div>
            </section>

            <div id="print-logo-footer" className="hidden items-center gap-2 text-xs text-gray-700 print:flex">
                <img src="/umd-logo-symbol.svg" alt="Unlock My Data" className="h-6 w-auto" />
                <span>unlock-my-data.com/</span>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        margin: 12mm 12mm 18mm 12mm;
                    }

                    header,
                    footer {
                        display: none !important;
                    }

                    main {
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        padding-bottom: 20mm !important;
                    }

                    #certificate {
                        margin-top: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        padding: 0 !important;
                        break-inside: avoid-page;
                        page-break-inside: avoid;
                    }

                    #print-logo-footer {
                        display: flex !important;
                        position: fixed;
                        right: 0;
                        bottom: 0;
                        width: 100%;
                        justify-content: center;
                        padding: 4mm 0;
                        border-top: 1px solid #e5e7eb;
                        background: #ffffff;
                    }
                }
            `}</style>
        </main>
    );
}
