import Link from 'next/link';
import { AlertTriangle, ExternalLink, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { t } from './i18n';
import { EntrepriseData } from './types';

interface VulnerabilitiesProps {
    entreprise: EntrepriseData;
    lang: string;
}

export default function Vulnerabilities({ entreprise, lang }: VulnerabilitiesProps) {
    if (!entreprise.vulnerabilities || entreprise.vulnerabilities.length === 0) {
        return null;
    }

    // Sort vulnerabilities by date (newest first)
    const sortedVulns = [...entreprise.vulnerabilities].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow my-6">
            <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-orange-600">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{t(lang, 'vulnerabilities')}</h2>

                    </div>
                    <span className="ml-3 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {entreprise.vulnerabilities.length}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-4">

                {sortedVulns.map((vuln, idx) => {
                    const title = lang === 'en' && vuln.title_en ? vuln.title_en : vuln.title;
                    const description = lang === 'en' && vuln.description_en ? vuln.description_en : vuln.description;
                    const mitigation = lang === 'en' && vuln.mitigation_en ? vuln.mitigation_en : vuln.mitigation;
                    const risk = lang === 'en' && vuln.risk_en ? vuln.risk_en : vuln.risk;

                    return (
                        <div key={idx} className="rounded-lg border border-orange-100 p-4">
                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
                                <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
                                <span className="text-xs font-medium bg-white text-gray-500 px-2 py-1 rounded border border-gray-200 whitespace-nowrap">
                                    {new Date(vuln.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            {/* Description - Content only (flattened) */}
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-800 mb-1">{t(lang, 'howItWorks')}</h4>
                                <div className="text-sm text-gray-700">
                                    <ReactMarkdown>{description.replaceAll('\n', '  \n')}</ReactMarkdown>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mt-4">
                                {/* Risk - Simple content */}
                                {risk && (
                                    <div className="text-sm">
                                        <div className="flex items-center gap-2 mb-1 text-red-700 font-medium text-sm">
                                            <ShieldAlert className="h-4 w-4" />
                                            {t(lang, 'risk')}
                                        </div>
                                        <div className="text-gray-600">
                                            <ReactMarkdown>{risk.replaceAll('\n', '  \n')}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}

                                {/* Mitigation - Simple content */}
                                {mitigation && (
                                    <div className="text-sm">
                                        <div className="flex items-center gap-2 mb-1 text-green-700 font-medium text-sm">
                                            <CheckCircle className="h-4 w-4" />
                                            {t(lang, 'mitigation')}
                                        </div>
                                        <div className="text-gray-600">
                                             <ReactMarkdown>{mitigation.replaceAll('\n', '  \n')}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer info: Reporter & Source */}
                            {(vuln.reporter || vuln.media_link) && (
                                <div className="mt-4 pt-3 border-t border-orange-200/50 flex flex-wrap gap-4 text-xs text-gray-500">
                                    {vuln.reporter && (
                                        <div className="flex items-center gap-1">
                                            <Info className="h-3 w-3" />
                                            <span className="font-medium">{t(lang, 'reporter')}:</span> {vuln.reporter}
                                        </div>
                                    )}
                                    {vuln.media_link && (
                                        <Link
                                            href={vuln.media_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-auto inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            {t(lang, 'source')} <ExternalLink className="h-3 w-3 ml-1" />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
