import Image from "next/image";
import { ShieldCheck, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Service } from "./types";
import Translator from "@/components/tools/t";

interface ComparatifDataAccessProps {
    selectedServices: Service[];
    manualDataCache: { [key: string]: any };
    getManualField: (manualData: any, fieldName: string) => any;
    capitalizeFirstLetter: (val: string) => string;
    t: Translator;
}

export default function ComparatifDataAccess({
    selectedServices,
    manualDataCache,
    getManualField,
    capitalizeFirstLetter,
    t
}: ComparatifDataAccessProps) {
    return (
        <section id="privacy-data-access" className="p-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full border-collapse bg-white text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left font-semibold text-gray-900 border-b border-gray-200 w-1/3">
                                <div className="flex items-center">
                                    <ShieldCheck className="w-5 h-5 mr-2 text-blue-600" />
                                    {t.t('dataAccessPrivacy')}
                                </div>
                            </th>
                            {selectedServices.map((service) => (
                                <th key={service.slug}
                                    className="p-4 text-center border-b border-gray-200 min-w-[140px] align-middle">
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="relative w-12 h-12 bg-white rounded-lg shadow-sm p-1 border border-gray-100">
                                            <Image
                                                src={service.logo}
                                                alt={service.name}
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>
                                        <span className="font-bold text-gray-800">{service.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {/* Data access ease */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-600 font-medium">
                                {t.t('dataAccessEase')}
                                <p className="text-xs text-gray-400 font-normal mt-0.5">{t.t('dataAccessEaseDesc')}</p>
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                let easyAccess = manualData?.easy_access_data;

                                let displayValue = t.t('notSpecified');

                                if (easyAccess !== undefined && easyAccess !== null) {
                                    if (typeof easyAccess === 'string' && easyAccess.includes('/5')) {
                                        displayValue = easyAccess;
                                    } else if (typeof easyAccess === 'number') {
                                        displayValue = `${easyAccess}/5`;
                                    } else if (typeof easyAccess === 'string' && !isNaN(Number(easyAccess))) {
                                        const numericValue = Number(easyAccess);
                                        displayValue = `${numericValue}/5`;
                                        if (0 === numericValue) {
                                            displayValue = ''
                                        }
                                    }
                                }

                                let classColor = 'bg-gray-100 text-gray-500';
                                if ("5/5" === displayValue) {
                                    classColor = 'bg-green-100 text-green-900';
                                }
                                else if ("4/5" === displayValue) {
                                    classColor = "bg-green-100 text-green-700";
                                }
                                else if ("3/5" === displayValue) {
                                    classColor = "bg-yellow-100 text-yellow-700";
                                }
                                else if ("2/5" === displayValue) {
                                    classColor = 'bg-red-100 text-red-700'
                                }
                                else if ("1/5" === displayValue) {
                                    classColor = 'bg-red-100 text-red-900'
                                }

                                return (
                                    <td key={service.slug} className="p-4 text-center align-middle">
                                        <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold ${classColor}`}>
                                            {capitalizeFirstLetter(displayValue)}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Required documents */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-600 font-medium">
                                {t.t('idDocuments')}
                                <p className="text-xs text-gray-400 font-normal mt-0.5">{t.t('idDocumentsDesc')}</p>
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const needIdCard = manualData?.need_id_card;

                                return (
                                    <td key={service.slug} className="p-4 text-center">
                                        {needIdCard === true ? (
                                            <span className="inline-flex items-center text-red-600 bg-red-50 px-2 py-1 rounded">
                                                <X className="w-4 h-4 mr-1" /> {t.t('yes')}
                                            </span>
                                        ) : needIdCard === false ? (
                                            <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                                <ShieldCheck className="w-4 h-4 mr-1" /> {t.t('no')}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Document details */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-600 font-medium">
                                {t.t('documentDetails')}
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const details = getManualField(manualData, 'details_required_documents');

                                return (
                                    <td key={service.slug} className="p-4 text-center text-gray-600 text-xs">
                                        {details ? capitalizeFirstLetter(details) : '-'}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Data transfer outside EU */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-600 font-medium">
                                {t.t('storageOutsideEU')}
                                <p className="text-xs text-gray-400 font-normal mt-0.5">{t.t('storageOutsideEUDesc')}</p>
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const outsideEU = manualData?.outside_eu_storage;

                                return (
                                    <td key={service.slug} className="p-4 text-center">
                                        {outsideEU === true ? (
                                            <span className="inline-flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                                ⚠️ {t.t('yes')}
                                            </span>
                                        ) : outsideEU === false ? (
                                            <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                                <ShieldCheck className="w-4 h-4 mr-1" /> {t.t('no')}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Destination countries */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-600 font-medium">
                                {t.t('destinationCountries')}
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const transferCountries = getManualField(manualData, 'transfer_destination_countries');

                                return (
                                    <td key={service.slug} className="p-4 text-center text-xs text-gray-600">
                                        {transferCountries || '-'}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* CNIL/GDPR Sanctions */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-600 font-medium">
                                {t.t('sanctioned')}
                                <p className="text-xs text-gray-400 font-normal mt-0.5">{t.t('sanctionedDesc')}</p>
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const sanctioned = manualData?.sanctioned_by_cnil;

                                return (
                                    <td key={service.slug} className="p-4 text-center">
                                        {sanctioned === true ? (
                                            <span className="inline-flex items-center text-red-600 bg-red-50 px-2 py-1 rounded font-bold">
                                                ⚠️ {t.t('yes').toUpperCase()}
                                            </span>
                                        ) : sanctioned === false ? (
                                            <span className="inline-flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                                {t.t('no')}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Sanction details */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-600 font-medium">
                                {t.t('sanctionDetails')}
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const sanctionDetails = getManualField(manualData, 'sanction_details');

                                return (
                                    <td key={service.slug} className="p-4 text-center text-xs text-gray-600">
                                        {sanctionDetails ? (
                                            <div className="max-w-xs mx-auto text-left">
                                                <ReactMarkdown>{sanctionDetails.replaceAll('<br>', '\n').replaceAll('\n', ' \n ')}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Response time */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-600 font-medium">
                                {t.t('avgResponseTime')}
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const responseDelay = getManualField(manualData, 'response_delay') ?? "";

                                return (
                                    <td key={service.slug} className="p-4 text-center text-sm font-medium text-gray-700">
                                        {responseDelay ? capitalizeFirstLetter(responseDelay) : '-'}
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}
