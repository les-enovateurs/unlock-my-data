import Link from 'next/link';
import { FileText, ExternalLink } from 'lucide-react';
import { t, translations } from './i18n';
import { getBooleanIcon } from './helpers';
import { EntrepriseData } from './types';

interface DataAccessProps {
    entreprise: EntrepriseData;
    lang: string;
}

export default function DataAccess({ entreprise, lang }: DataAccessProps) {
    const mailTo = entreprise?.contact_mail_export && entreprise?.data_access_via_email
        ? `mailto:${entreprise.contact_mail_export}?subject=${encodeURIComponent(t(lang,'emailSubject'))}&body=${translations[lang]?.emailBody || translations['fr'].emailBody}`
        : undefined;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-gray-700">
                    <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{t(lang,'dataAccess')}</h2>
            </div>
            <div className="divide-y divide-gray-50">
                {entreprise.need_id_card && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'requiresId')}</div>
                        <div>{getBooleanIcon(entreprise.need_id_card,true,lang)}</div>
                    </div>
                )}
                {entreprise.details_required_documents && 'fr' === lang && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'requiredDocumentsDetails')}</div>
                        <div>{entreprise.details_required_documents}</div>
                    </div>
                )}
                {entreprise.details_required_documents_en && 'en' === lang && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'requiredDocumentsDetails')}</div>
                        <div>{entreprise.details_required_documents_en}</div>
                    </div>
                )}
                {/* Logic for url_export visibility: if url_export exists OR (url_export exists AND no English url AND en lang) */}
                {/* Simplified: if url_export exists and we are in FR OR if url_export exists and no EN url and we are in EN */}
                {((entreprise.url_export && lang === 'fr') || (entreprise.url_export && !entreprise.url_export_en && lang === 'en')) && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'accessViaForm')}</div>
                        <div className="flex flex-row items-center">
                            <Link href={entreprise.url_export!} target="_blank" className="underline hover:no-underline" rel="noopener noreferrer">{entreprise.url_export}</Link>
                        </div>
                    </div>
                )}
                {entreprise.url_export_en && 'en' === lang && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'accessViaForm')}</div>
                        <div className="flex flex-row items-center">
                            <Link href={entreprise.url_export_en} target="_blank" className="underline hover:no-underline" rel="noopener noreferrer">{entreprise.url_export_en}</Link>
                        </div>
                    </div>
                )}
                {mailTo && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'accessViaEmail')}</div>
                        <div className="flex flex-row items-center text-primary-600">
                            <Link href={mailTo}>{entreprise.contact_mail_export}</Link>
                        </div>
                    </div>
                )}
                {entreprise.data_access_via_postal && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'accessViaPostal')}</div>
                        <div className="flex flex-row items-center">
                            <address>{entreprise.address_export}</address>
                        </div>
                    </div>
                )}
                {entreprise.data_access_type && 'fr' === lang && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'otherAccessType')}</div>
                        <div>{entreprise.data_access_type}</div>
                    </div>
                )}
                {entreprise.data_access_type_en && 'en' === lang && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'otherAccessType')}</div>
                        <div>{entreprise.data_access_type_en}</div>
                    </div>
                )}
                {entreprise.example_form_export && entreprise.example_form_export.length > 0 && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700 mb-2">{t(lang,'exportFormExamples')}</div>
                        <div className="space-y-2">
                            {entreprise.example_form_export.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-2 rounded">
                                    <Link href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline">
                                        <FileText className="h-4 w-4 mr-1" />
                                        {'fr' === lang ? item.description : item.description_en} ({item.type})
                                        <ExternalLink className="ml-1 h-3 w-3" />
                                    </Link>
                                    <div className="text-xs text-gray-500 mt-1">{t(lang,'date')}: {item.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {entreprise.message_exchange && entreprise.message_exchange.length > 0 && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700 mb-2">{t(lang,'messageExchange')}</div>
                        <div className="space-y-2">
                            {entreprise.message_exchange.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-2 rounded">
                                    <Link href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline">
                                        <FileText className="h-4 w-4 mr-1" />
                                        {'fr' === lang ? item.description : item.description_en} ({item.type})
                                        <ExternalLink className="ml-1 h-3 w-3" />
                                    </Link>
                                    <div className="text-xs text-gray-500 mt-1">{t(lang,'date')}: {item.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {entreprise.response_delay && 'fr' === lang && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'responseDelay')}</div>
                        <div>{entreprise.response_delay}</div>
                    </div>
                )}
                {entreprise.response_delay_en && 'en' === lang && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'responseDelay')}</div>
                        <div>{entreprise.response_delay_en}</div>
                    </div>
                )}
                {entreprise.comments && 'fr' === lang && (
                    <div className="p-4">
                        <div className="text-sm text-gray-600 mb-1">{t(lang,'comments')}</div>
                        <div className="text-gray-900">{entreprise.comments}</div>
                    </div>
                )}
                {entreprise.comments_en && 'en' === lang && (
                    <div className="p-4">
                        <div className="text-sm text-gray-600 mb-1">{t(lang,'comments')}</div>
                        <div className="text-gray-900">{entreprise.comments_en}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

