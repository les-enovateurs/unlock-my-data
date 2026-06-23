import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Service, Tracker, AppPermissions } from "./types";
import Translator from "@/components/tools/t";

interface ComparatifTrackersProps {
    selectedServices: Service[];
    trackers: Tracker[];
    permissions: { [key: string]: AppPermissions };
    trackerCounts: { slug: string; name: string; count: number | null }[];
    getCountryFlagUrl: (countryName: string) => { url: string; formattedName: string };
    locale: string;
    t: Translator;
}

export default function ComparatifTrackers({
    selectedServices,
    trackers,
    permissions,
    trackerCounts,
    getCountryFlagUrl,
    locale,
    t
}: ComparatifTrackersProps) {
    if (trackers.length === 0 || Object.keys(permissions).length === 0) return null;

    return (
        <section id="trackers" className="p-4">
            <div className="umd-card overflow-hidden p-0">
                <table className="w-full border-collapse bg-white text-sm">
                    <thead className="bg-umd-slate-50">
                        <tr>
                            <th className="p-4 text-left font-semibold text-umd-slate-900 border-b border-umd-slate-200 w-1/3">
                                <div className="flex items-center">
                                    <ExternalLink className="w-5 h-5 mr-2 text-purple-600" />
                                    {t.t('trackersTitle')}
                                </div>
                                <p className="text-xs text-umd-slate-400 font-normal mt-1">{t.t('trackersDesc')}</p>
                            </th>
                            {selectedServices.map((service) => (
                                <th key={service.slug}
                                    className="p-4 text-center border-b border-umd-slate-200 min-w-[140px]">
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-8 h-8 mb-2">
                                            <Image
                                                src={service.logo}
                                                alt={service.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-umd-slate-600">{service.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-umd-slate-100">
                        <tr className="bg-purple-50">
                            <td className="p-4 font-bold text-purple-800">
                                {t.t('totalTrackers')}
                            </td>
                            {trackerCounts.map(({ slug, count }) => (
                                <td key={slug}
                                    className={`p-4 text-center font-bold text-lg ${count === null ? "text-umd-slate-400" : count > 0 ? "text-purple-700" : "text-umd-green-600"}`}>
                                    {count === null ? "?" : count}
                                </td>
                            ))}
                        </tr>
                        {trackers
                            .filter((tracker) =>
                                selectedServices.some((service) =>
                                    permissions[service.slug]?.trackers?.includes(tracker.id)
                                )
                            )
                            .map((tracker) => (
                                <tr key={tracker.id} className="hover:bg-umd-slate-50">
                                    <td className="p-4 text-umd-slate-600 font-medium">
                                        <div className="flex items-center">
                                            <div className="relative w-5 h-4 mr-2 flex-shrink-0">
                                                <Image
                                                    src={getCountryFlagUrl(tracker.country).url}
                                                    alt={`${locale === 'fr' ? 'Drapeau de' : 'Flag of'} ${getCountryFlagUrl(tracker.country).formattedName}`}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <p>
                                                {tracker.name}
                                            </p>
                                        </div>
                                    </td>
                                    {selectedServices.map((service) => (
                                        <td key={service.slug} className="p-4 text-center">
                                            {permissions[service.slug]?.trackers?.includes(tracker.id) ? (
                                                <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold">
                                                    {t.t('present')}
                                                </span>
                                            ) : (
                                                <span className="text-umd-slate-200">-</span>
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
