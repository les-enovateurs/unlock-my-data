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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
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

                    let status = {
                        label: t.t('fairlyReliable'),
                        color: "text-green-700",
                        bg: "bg-green-50",
                        icon: ShieldCheck
                    };
                    if (riskScore > 10) {
                        status = {
                            label: t.t('critical'),
                            color: "text-red-700",
                            bg: "bg-red-50",
                            icon: ShieldAlert
                        };
                    } else if (riskScore > 5) {
                        status = {
                            label: t.t('monitorClosely'),
                            color: "text-amber-700",
                            bg: "bg-orange-50",
                            icon: AlertTriangle
                        };
                    } else if (riskScore > 2) {
                        status = {
                            label: t.t('moderateRisk'),
                            color: "text-orange-700",
                            bg: "bg-amber-50",
                            icon: AlertTriangle
                        };
                    }

                    const StatusIcon = status.icon;

                    return (
                        <div key={service.slug}
                            className={`p-4 rounded-lg border ${status.bg} border-opacity-50 flex flex-col items-center text-center`}>
                            <Image src={service.logo} alt={service.name} width={48} height={48}
                                className="mb-3 object-contain" />
                            <h3 className="font-bold text-lg mb-1">{service.name}</h3>

                            <div className={`flex items-center space-x-1 mb-3 ${status.color} font-bold`}>
                                <StatusIcon className="w-4 h-4" />
                                <span>{status.label}</span>
                            </div>

                            <div className="text-sm text-gray-600 mb-4 space-y-2 w-full text-left">
                                <div className="flex items-start">
                                    <span className={`mr-2 ${dCount === null ? "text-gray-400" : dCount > 0 ? "text-red-500" : "text-green-500"}`}>
                                        {dCount === null ? "❓" : dCount > 0 ? "⚠️" : "✅"}
                                    </span>
                                    <p className="text-xs leading-tight">
                                        <span className="font-semibold">{dCount === null ? t.t('unknownData') : `${dCount} ${t.t('sensitivePermissions')}`}</span>
                                        {dCount !== null && dCount > 0 && <span className="block text-gray-500 text-[10px]">{t.t('permissionAccess')}</span>}
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <span className={`mr-2 ${tCount === null ? "text-gray-400" : tCount > 0 ? "text-red-500" : "text-green-500"}`}>
                                        {tCount === null ? "❓" : tCount > 0 ? "👁️" : "✅"}
                                    </span>
                                    <p className="text-xs leading-tight">
                                        <span className="font-semibold">{tCount === null ? t.t('unknownData') : `${tCount} ${t.t('adTrackers')}`}</span>
                                        {tCount !== null && tCount > 0 && <span className="block text-gray-500 text-[10px]">{t.t('trackingActivity')}</span>}
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <span className={`mr-2 ${bCount === null ? "text-gray-400" : bCount > 0 ? "text-orange-500" : "text-green-500"}`}>
                                        {bCount === null ? "❓" : bCount > 0 ? "⚖️" : "✅"}
                                    </span>
                                    <p className="text-xs leading-tight">
                                        <span className="font-semibold">{bCount === null || service.tosdr === "" ? t.t('unknownData') : `${bCount} ${t.t('legalIssues')}`}</span>
                                        {bCount !== null && bCount > 0 && <span className="block text-gray-500 text-[10px]">{t.t('abusiveTerms')}</span>}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={`${t.t('links.serviceDetail')}/${service.slug}`}
                                className="mt-auto w-full py-2 px-4 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                            >
                                {t.t('viewDetails')}
                            </Link>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">{t.t('whyDeleteData')}</h4>
                    <p className="text-sm text-blue-800">
                        {t.t('whyDeleteDataDesc')}
                    </p>
                </div>
            </div>
        </div>
    );
}
