"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const formatMonthLabel = (value: string, lang: "fr" | "en"): string => {
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

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
            <section className="mb-10 print:hidden">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{t.t("title")}</h1>
                <p className="text-base-content/70 max-w-3xl">{t.t("subtitle")}</p>
            </section>

            <section className="bg-base-100 border border-base-300 rounded-2xl p-4 md:p-6 shadow-sm print:hidden">
                <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
                    <label className="form-control">
                        <select
                            className="select select-bordered w-full"
                            value={selectedName}
                            onChange={(event) => setSelectedName(event.target.value)}
                        >
                            {contributorNames.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </label>
                    <button className="btn btn-primary md:mb-0" onClick={printCertificate} disabled={!report}>
                        {t.t("printPdf")}
                    </button>
                </div>
            </section>

            {report && (
                <section id="certificate" className="mt-8 bg-base-100 border border-base-300 rounded-2xl p-6 md:p-8 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-300 pb-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">{t.t("certificateTitle")}</h2>
                            <p className="text-base-content/70 mt-1">
                                {t.t("certificateText", {
                                    name: report.contributorName,
                                })}
                            </p>
                        </div>
                        <div className="text-sm text-base-content/70">
                            <p>{t.t("generatedAt")} {formatDate(new Date().toISOString(), lang)}</p>
                            {verificationSourceUrl && (
                                <p className="mt-1 break-all">
                                    <span className="font-semibold">{t.t("sourceLinkLabel")}: </span>
                                    <a href={verificationSourceUrl} className="underline">
                                        {verificationSourceUrl}
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                        <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                            <p className="text-sm text-green-700">{t.t("created")}</p>
                            <p className="text-2xl font-bold text-green-900">{report.created.length}</p>
                        </div>
                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                            <p className="text-sm text-blue-700">{t.t("updated")}</p>
                            <p className="text-2xl font-bold text-blue-900">{report.updated.length}</p>
                        </div>
                        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                            <p className="text-sm text-amber-700">{t.t("reviewed")}</p>
                            <p className="text-2xl font-bold text-amber-900">{report.reviewed.length}</p>
                        </div>
                        <div className="rounded-xl bg-base-200 border border-base-300 p-4">
                            <p className="text-sm text-base-content/70">{t.t("total")}</p>
                            <p className="text-2xl font-bold">{report.total}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-3">{t.t("activityOverTime")}</h3>
                        {report.monthlyActivity.length > 0 ? (
                            <div className="rounded-xl border border-base-300 p-4 overflow-x-auto">
                                <svg width="100%" height="180" viewBox="0 0 820 180" role="img" aria-label={t.t("activityOverTime")}>
                                    {report.monthlyActivity.map((item, index) => {
                                        const chartWidth = 760;
                                        const x = 30 + (index * (chartWidth / Math.max(report.monthlyActivity.length, 1)));
                                        const barWidth = Math.max(16, chartWidth / Math.max(report.monthlyActivity.length * 1.7, 1));
                                        const barHeight = Math.max(8, (item.count / maxBar) * 110);
                                        const y = 130 - barHeight;

                                        return (
                                            <g key={item.month}>
                                                <rect x={x} y={y} width={barWidth} height={barHeight} rx={6} className="fill-primary/80" />
                                                <text x={x + (barWidth / 2)} y={148} textAnchor="middle" fontSize="10" className="fill-base-content/70">
                                                    {formatMonthLabel(item.month, lang)}
                                                </text>
                                                <text x={x + (barWidth / 2)} y={y - 6} textAnchor="middle" fontSize="11" className="fill-base-content">
                                                    {item.count}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        ) : (
                            <p className="text-base-content/60">{t.t("noData")}</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-3">{t.t("listTitle")}</h3>
                        {mergedActivities.length > 0 ? (
                            <div className="border border-base-300 rounded-xl overflow-hidden">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>{lang === "fr" ? "Type" : "Type"}</th>
                                            <th>{lang === "fr" ? "Fiche" : "Form"}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mergedActivities.map((item, index) => (
                                            <tr key={`${item.type}-${item.company}-${item.date}-${index}`}>
                                                <td>{formatDate(item.date, lang)}</td>
                                                <td>{typeLabel(item, t)}</td>
                                                <td>{item.company}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-base-content/60">{t.t("noData")}</p>
                        )}
                    </div>
                </section>
            )}

            <div id="print-logo-footer" className="hidden print:flex items-center gap-2 text-xs text-gray-700">
                <img src="/logoUMD.webp" alt="Unlock My Data" className="h-6 w-auto" />
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
