import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ShieldAlert, ExternalLink } from 'lucide-react';
import { t } from './i18n';
import { getBooleanIcon } from './helpers';
import { EntrepriseData } from './types';

interface SanctionsTransfersProps {
    entreprise: EntrepriseData;
    lang: string;
}

export default function SanctionsTransfers({ entreprise, lang }: SanctionsTransfersProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-gray-700">
                    <ShieldAlert className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{t(lang,'sanctionsAndTransfer')}</h2>
            </div>
            <div className="divide-y divide-gray-50">
                <div className="p-4">
                    {/* Affichage structuré des sanctions si disponibles */}
                    {entreprise.sanctions && entreprise.sanctions.length > 0 ? (
                        <div className="mb-4">
                            <div className="text-sm text-gray-600 mb-2">{t(lang, 'cnilSanctions')}</div>
                            <div className="space-y-3">
                                {entreprise.sanctions.map((sanction, idx) => {
                                    const isReminder = sanction.type === 'reminder';
                                    const bgColor = isReminder ? 'bg-orange-50' : 'bg-red-50';
                                    const borderColor = isReminder ? 'border-orange-100' : 'border-red-100';
                                    const amountColor = isReminder ? 'text-orange-700' : 'text-red-700';

                                    return (
                                    <div key={idx} className={`${bgColor} border ${borderColor} rounded-lg p-3`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 text-sm">
                                                    {lang === 'en' && sanction.title_en ? sanction.title_en : sanction.title}
                                                </div>
                                                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                                                    {sanction.amount_euros !== null && (
                                                        <span className="inline-flex items-center">
                                                        <span className="font-medium">{t(lang, 'sanctionAmount')}:</span>
                                                        <span className={`ml-1 ${amountColor} font-semibold`}>
                                                            {new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(sanction.amount_euros)}
                                                        </span>
                                                    </span>
                                                    )}
                                                    {isReminder && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100/50 text-orange-800 border border-orange-200">
                                                             {t(lang, 'reminder')}
                                                        </span>
                                                    )}
                                                    <span className="inline-flex items-center">
                                                    <span className="font-medium">{t(lang, 'sanctionDate')}:</span>
                                                    <span className="ml-1">{sanction.date}</span>
                                                </span>
                                                    {sanction.deliberation && (
                                                        <span className="text-gray-500">
                                                        {sanction.deliberation}
                                                    </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {sanction.source_url && (
                                            <div className="mt-2">
                                                <Link
                                                    href={sanction.source_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    {t(lang, 'viewDecision')}
                                                    <ExternalLink className="ml-1 h-3 w-3" />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )})}
                            </div>
                        </div>
                    ) : entreprise.sanctioned_by_cnil === false ? (
                        <div className="mb-4">
                            {/*<div className="text-sm text-gray-600 mb-1">{t(lang, 'cnilSanctions')}</div>*/}
                            {/*<div className="text-gray-500 text-sm italic">{t(lang, 'noSanction')}</div>*/}
                        </div>
                    ) : (
                        <>
                            {/* Fallback vers l'ancien affichage si pas de tableau sanctions */}
                            {entreprise.sanction_details && 'fr' === lang && (
                                <div className="mt-2 text-gray-900">
                                    <div className="text-sm text-gray-600 mb-1">{t(lang,'sanctionDetails')}</div>
                                    <ReactMarkdown>{entreprise.sanction_details.replaceAll('<br>', "\n").replaceAll("/n", " \n ").replaceAll("\n"," \n ")}</ReactMarkdown>
                                </div>
                            )}
                            {entreprise.sanction_details_en && 'en' === lang && (
                                <div className="mt-2 text-gray-900">
                                    <div className="text-sm text-gray-600 mb-1">{t(lang,'sanctionDetails')}</div>
                                    <ReactMarkdown>{entreprise.sanction_details_en.replaceAll('<br>', "  \n")}</ReactMarkdown>
                                </div>
                            )}
                        </>
                    )}
                    <div className="flex items-center mt-2">
                        <div className="text-sm text-gray-600 mb-1">{t(lang,'transferPolicy')}</div>
                        <span className="ml-2">{getBooleanIcon(entreprise.data_transfer_policy,true,lang)}</span>
                    </div>
                    {entreprise.privacy_policy_quote && 'fr' === lang && (
                        <div className="mt-2 text-gray-900">
                            <div className="text-sm text-gray-600 mb-1">{t(lang,'policyExcerpt')}</div>
                            <ReactMarkdown>{entreprise.privacy_policy_quote.replaceAll('<br>', "  \n")}</ReactMarkdown>
                        </div>
                    )}
                    {entreprise.privacy_policy_quote_en && 'en' === lang && (
                        <div className="mt-2 text-gray-900">
                            <div className="text-sm text-gray-600 mb-1">{t(lang,'policyExcerpt')}</div>
                            <ReactMarkdown>{entreprise.privacy_policy_quote_en.replaceAll('<br>', "  \n")}</ReactMarkdown>
                        </div>
                    )}
                    {entreprise.transfer_destination_countries && 'fr' === lang && (
                        <div className="mt-2">
                            <div className="text-gray-600 mb-1">{t(lang,'transferCountries')}</div>
                            <span>{entreprise.transfer_destination_countries}</span>
                        </div>
                    )}
                    {entreprise.transfer_destination_countries_en && 'en' === lang && (
                        <div className="mt-2">
                            <div className="text-sm text-gray-600 mb-1">{t(lang,'transferCountries')}</div>
                            <span>{entreprise.transfer_destination_countries_en}</span>
                        </div>
                    )}
                    {typeof entreprise.outside_eu_storage !== 'undefined' && 'fr' === lang && (
                        <div className="mt-2">
                            <div className="text-sm text-gray-600 mb-1">{t(lang,'outsideEuStorage')}</div>
                            <span>{typeof entreprise.outside_eu_storage === 'boolean' ? getBooleanIcon(entreprise.outside_eu_storage,true,lang) : entreprise.outside_eu_storage}</span>
                        </div>
                    )}
                    {typeof entreprise.outside_eu_storage_en !== 'undefined' && 'en' === lang && (
                        <div className="mt-2">
                            <div className="text-sm text-gray-600 mb-1">{t(lang,'outsideEuStorage')}</div>
                            <span>{typeof entreprise.outside_eu_storage_en === 'boolean' ? getBooleanIcon(entreprise.outside_eu_storage_en,true,lang) : entreprise.outside_eu_storage_en}</span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

