import Image from "next/image";
import { AlertTriangle, X } from "lucide-react";
import { Service, ServiceData } from "./types";
import Translator from "@/components/tools/t";

interface ComparatifWarningPointsProps {
    selectedServices: Service[];
    servicesData: { [key: string]: ServiceData };
    badPointCounts: { slug: string; name: string; count: number | null }[];
    uniqueBadPointTitles: string[];
    locale: string;
    t: Translator;
}

export default function ComparatifWarningPoints({
    selectedServices,
    servicesData,
    badPointCounts,
    uniqueBadPointTitles,
    locale,
    t
}: ComparatifWarningPointsProps) {
    if (Object.keys(servicesData).length === 0) return null;

    return (
        <section id={locale === 'fr' ? "points-negatifs" : "negative-points"} className="p-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full border-collapse bg-white text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left font-semibold text-gray-900 border-b border-gray-200 w-1/3">
                                <div className="flex items-center">
                                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                                    {t.t('warningPoints')}
                                </div>
                                <p className="text-xs text-gray-500 font-normal mt-1">{t.t('warningPointsDesc')}</p>
                            </th>
                            {selectedServices.map((service) => (
                                <th key={service.slug}
                                    className="p-4 text-center border-b border-gray-200 min-w-[140px]">
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-8 h-8 mb-2">
                                            <Image
                                                src={service.logo}
                                                alt={service.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{service.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr className="bg-red-50">
                            <td className="p-4 font-bold text-red-800">
                                {t.t('totalNegativePoints')}
                            </td>
                            {badPointCounts.map(({ slug, count }) => (
                                <td key={slug}
                                    className={`p-4 text-center font-bold text-lg ${count === null ? "text-gray-400" : count > 0 ? "text-red-600" : "text-green-600"}`}>
                                    {count === null ? "?" : count}
                                </td>
                            ))}
                        </tr>
                        {uniqueBadPointTitles.map((title) => (
                            <tr key={title} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-700 font-medium text-xs">
                                    {title}
                                </td>
                                {selectedServices.map((service) => (
                                    <td key={service.slug} className="p-4 text-center">
                                        {servicesData[service.slug]?.points.some(
                                            (point) =>
                                                point.case.classification === "bad" &&
                                                (point.case.localized_title === title || point.case.title === title)
                                        ) ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                                                <X className="w-4 h-4" />
                                            </span>
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
