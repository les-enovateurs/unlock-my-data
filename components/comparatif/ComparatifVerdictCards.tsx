import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { Service, ServiceData, Permission, AppPermissions, Tracker } from "./types";
import Translator from "@/components/tools/t";

interface ComparatifVerdictCardsProps {
    selectedServices: Service[];
    dangerousCounts: { slug: string; name: string; count: number | null }[];
    trackerCounts: { slug: string; name: string; count: number | null }[];
    badPointCounts: { slug: string; name: string; count: number | null }[];
    servicesData: { [key: string]: ServiceData };
    t: Translator;
}

export default function ComparatifVerdictCards({
    selectedServices,
    dangerousCounts,
    trackerCounts,
    badPointCounts,
    servicesData,
    t
}: ComparatifVerdictCardsProps) {
    return (
        <div className="umd-card p-6">
            <h2 className="text-xl font-bold text-umd-slate-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 text-umd-indigo-700 mr-2" />
                {t.t('quickVerdict')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedServices.map(service => {
                    const dCount = dangerousCounts.find(c => c.slug === service.slug)?.count || 0;
                    const tCount = trackerCounts.find(c => c.slug === service.slug)?.count || 0;
                    const bCount = badPointCounts.find(c => c.slug === service.slug)?.count || 0;

                    let riskScore = 0;
                    if (dCount > 0) riskScore += 1;
                    if (dCount > 5) riskScore += 2;
                    if (dCount > 9) riskScore += 4;
                    if (tCount > 0) riskScore += 1;
                    if (tCount > 3) riskScore += 2;
                    if (tCount > 5) riskScore += 4;
                    if (tCount > 10) riskScore += 8;
                    if (bCount > 5) riskScore += 1;
                    if (bCount > 10) riskScore += 2;
                    if (bCount > 20) riskScore += 5;

                    if (service.better_alternative) {
                        riskScore -= 10;
                    }

                    let status = {
                        label: t.t('fairlyReliable'),
                        color: "text-umd-green-800",
                        bg: "bg-umd-green-50",
                        icon: ShieldCheck
                    };
                    if (riskScore > 10) {
                        status = {
                            label: t.t('critical'),
                            color: "text-umd-red-800",
                            bg: "bg-umd-red-50",
                            icon: ShieldAlert
                        };
                    } else if (riskScore > 5) {
                        status = {
                            label: t.t('monitorClosely'),
                            color: "text-umd-amber-800",
                            bg: "bg-umd-amber-50",
                            icon: AlertTriangle
                        };
                    } else if (riskScore > 2) {
                        status = {
                            label: t.t('moderateRisk'),
                            color: "text-umd-amber-800",
                            bg: "bg-umd-amber-50",
                            icon: AlertTriangle
                        };
                    }

                    if (service.better_alternative) {
                        status = {
                            label: t.t('betterAlternativeBadge') || 'Alternative Recommandée',
                            color: "text-umd-green-800",
                            bg: "bg-umd-green-50",
                            icon: Sparkles
                        };
                    }

                    const StatusIcon = status.icon;

                    return (
                        <div key={service.slug}
                            className={`p-4 rounded-lg border ${status.bg} border-opacity-50 flex flex-col items-center text-center relative`}>
                            <Image src={service.logo} alt={service.name} width={48} height={48}
                                className="mb-3 object-contain" />
                            <h3 className="font-bold text-lg mb-1 text-umd-slate-900">{service.name}</h3>

                            <div className={`flex items-center space-x-1 mb-3 ${status.color} font-bold`}>
                                <StatusIcon className="w-4 h-4" />
                                <span>{status.label}</span>
                            </div>

                            <div className="text-sm text-umd-slate-600 mb-4 space-y-2 w-full text-left">
                                <div className="flex items-start">
                                    <span className={`mr-2 ${dCount === null ? "text-umd-slate-400" : dCount > 0 ? "text-umd-red-700" : "text-umd-green-700"}`}>
                                        {dCount === null ? "❓" : dCount > 0 ? "⚠️" : "✅"}
                                    </span>
                                    <p className="text-xs leading-tight">
                                        <span className="font-semibold text-umd-slate-900">{dCount === null ? t.t('unknownData') : `${dCount} ${t.t('sensitivePermissions')}`}</span>
                                        {dCount !== null && dCount > 0 && <span className="block text-umd-slate-400 text-[10px]">{t.t('permissionAccess')}</span>}
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <span className={`mr-2 ${tCount === null ? "text-umd-slate-400" : tCount > 0 ? "text-umd-red-700" : "text-umd-green-700"}`}>
                                        {tCount === null ? "❓" : tCount > 0 ? "👁️" : "✅"}
                                    </span>
                                    <p className="text-xs leading-tight">
                                        <span className="font-semibold text-umd-slate-900">{tCount === null ? t.t('unknownData') : `${tCount} ${t.t('adTrackers')}`}</span>
                                        {tCount !== null && tCount > 0 && <span className="block text-umd-slate-400 text-[10px]">{t.t('trackingActivity')}</span>}
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <span className={`mr-2 ${bCount === null ? "text-umd-slate-400" : bCount > 0 ? "text-umd-amber-700" : "text-umd-green-700"}`}>
                                        {bCount === null ? "❓" : bCount > 0 ? "⚖️" : "✅"}
                                    </span>
                                    <p className="text-xs leading-tight">
                                        <span className="font-semibold text-umd-slate-900">{bCount === null ? t.t('unknownData') : `${bCount} ${t.t('legalIssues')}`}</span>
                                        {bCount !== null && bCount > 0 && <span className="block text-umd-slate-400 text-[10px]">{t.t('abusiveTerms')}</span>}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={`${t.t('links.serviceDetail')}/${service.slug}`}
                                className="mt-auto w-full py-2 px-4 bg-white border border-umd-slate-200 hover:border-umd-indigo-200 hover:text-umd-indigo-700 text-umd-slate-600 rounded-lg text-sm font-medium flex items-center justify-center"
                            >
                                {t.t('viewDetails')}
                            </Link>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 bg-umd-indigo-50 p-4 rounded-lg flex items-start">
                <div className="bg-umd-indigo-50 p-2 rounded-full mr-3 flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-umd-indigo-700" />
                </div>
                <div>
                    <h4 className="font-semibold text-umd-indigo-700 text-sm mb-1">{t.t('whyDeleteData')}</h4>
                    <p className="text-sm text-umd-indigo-700">
                        {t.t('whyDeleteDataDesc')}
                    </p>
                </div>
            </div>
        </div>
    );
}
