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
            <div className="overflow-hidden umd-card">
                <table className="w-full border-collapse bg-white text-sm">
                    <thead className="bg-umd-slate-50">
                        <tr>
                            <th className="p-4 text-left font-semibold text-umd-slate-900 border-b border-umd-slate-200 w-1/3">
                                <div className="flex items-center">
                                    <ShieldCheck className="w-5 h-5 mr-2 text-umd-indigo-700" />
                                    {t.t('dataAccessPrivacy')}
                                </div>
                            </th>
                            {selectedServices.map((service) => (
                                <th key={service.slug}
                                    className="p-4 text-center border-b border-umd-slate-200 min-w-[140px] align-middle">
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="relative w-12 h-12 bg-white rounded-lg shadow-sm p-1 border border-umd-slate-100">
                                            <Image
                                                src={service.logo}
                                                alt={service.name}
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>
                                        <span className="font-bold text-umd-slate-900">{service.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-umd-slate-100">
                        {/* Data access ease */}
                        <tr className="hover:bg-umd-slate-50">
                            <td className="p-4 text-umd-slate-600 font-medium">
                                {t.t('dataAccessEase')}
                                <p className="text-xs text-umd-slate-400 font-normal mt-0.5">{t.t('dataAccessEaseDesc')}</p>
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const manualEasyAccess = manualData?.easy_access_data;
                                const serviceEasyAccess = service.easy_access_data;
                                const easyAccess = (manualEasyAccess !== undefined && manualEasyAccess !== null && String(manualEasyAccess).trim() !== "")
                                    ? manualEasyAccess
                                    : serviceEasyAccess;

                                let displayValue = t.t('notSpecified');

                                if (easyAccess !== undefined && easyAccess !== null) {
                                    const normalizedEasyAccess = String(easyAccess).trim();

                                    if (normalizedEasyAccess !== "") {
                                        if (normalizedEasyAccess.includes('/5')) {
                                            const [rawScore] = normalizedEasyAccess.split('/');
                                            const numericValue = Number(rawScore.replace(',', '.'));
                                            if (!isNaN(numericValue) && numericValue > 0) {
                                                displayValue = `${numericValue}/5`;
                                            }
                                        } else {
                                            const numericValue = Number(normalizedEasyAccess.replace(',', '.'));
                                            if (!isNaN(numericValue) && numericValue > 0) {
                                                displayValue = `${numericValue}/5`;
                                            }
                                        }
                                    }
                                }

                                let classColor = 'bg-umd-slate-200 text-umd-slate-900';
                                if ("5/5" === displayValue) {
                                    classColor = 'bg-umd-green-100 text-umd-green-900';
                                }
                                else if ("4/5" === displayValue) {
                                    classColor = "bg-umd-green-100 text-umd-green-800";
                                }
                                else if ("3/5" === displayValue) {
                                    classColor = "bg-umd-amber-100 text-umd-amber-900";
                                }
                                else if ("2/5" === displayValue) {
                                    classColor = 'bg-umd-red-100 text-umd-red-800'
                                }
                                else if ("1/5" === displayValue) {
                                    classColor = 'bg-umd-red-100 text-umd-red-900'
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
                        <tr className="hover:bg-umd-slate-50">
                            <td className="p-4 text-umd-slate-600 font-medium">
                                {t.t('idDocuments')}
                                <p className="text-xs text-umd-slate-400 font-normal mt-0.5">{t.t('idDocumentsDesc')}</p>
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const needIdCard = manualData?.need_id_card;

                                return (
                                    <td key={service.slug} className="p-4 text-center">
                                        {needIdCard === true ? (
                                            <span className="inline-flex items-center text-umd-red-700 bg-umd-red-50 px-2 py-1 rounded">
                                                <X className="w-4 h-4 mr-1" /> {t.t('yes')}
                                            </span>
                                        ) : needIdCard === false ? (
                                            <span className="inline-flex items-center text-umd-green-700 bg-umd-green-50 px-2 py-1 rounded">
                                                <ShieldCheck className="w-4 h-4 mr-1" /> {t.t('no')}
                                            </span>
                                        ) : (
                                            <span className="text-umd-slate-400">-</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Document details */}
                        <tr className="hover:bg-umd-slate-50">
                            <td className="p-4 text-umd-slate-600 font-medium">
                                {t.t('documentDetails')}
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const details = getManualField(manualData, 'details_required_documents');

                                return (
                                    <td key={service.slug} className="p-4 text-center text-umd-slate-600 text-xs">
                                        {details ? capitalizeFirstLetter(details) : '-'}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Data transfer outside EU */}
                        <tr className="hover:bg-umd-slate-50">
                            <td className="p-4 text-umd-slate-600 font-medium">
                                {t.t('storageOutsideEU')}
                                <p className="text-xs text-umd-slate-400 font-normal mt-0.5">{t.t('storageOutsideEUDesc')}</p>
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const outsideEU = manualData?.outside_eu_storage;

                                return (
                                    <td key={service.slug} className="p-4 text-center">
                                        {outsideEU === true ? (
                                            <span className="inline-flex items-center text-umd-amber-700 bg-umd-amber-50 px-2 py-1 rounded">
                                                ⚠️ {t.t('yes')}
                                            </span>
                                        ) : outsideEU === false ? (
                                            <span className="inline-flex items-center text-umd-green-700 bg-umd-green-50 px-2 py-1 rounded">
                                                <ShieldCheck className="w-4 h-4 mr-1" /> {t.t('no')}
                                            </span>
                                        ) : (
                                            <span className="text-umd-slate-400">-</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Destination countries */}
                        <tr className="hover:bg-umd-slate-50">
                            <td className="p-4 text-umd-slate-600 font-medium">
                                {t.t('destinationCountries')}
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const transferCountries = getManualField(manualData, 'transfer_destination_countries');

                                return (
                                    <td key={service.slug} className="p-4 text-center text-xs text-umd-slate-600">
                                        {transferCountries || '-'}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* CNIL/GDPR Sanctions */}
                        <tr className="hover:bg-umd-slate-50">
                            <td className="p-4 text-umd-slate-600 font-medium">
                                {t.t('sanctioned')}
                                <p className="text-xs text-umd-slate-400 font-normal mt-0.5">{t.t('sanctionedDesc')}</p>
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const sanctioned = manualData?.sanctioned_by_cnil;

                                return (
                                    <td key={service.slug} className="p-4 text-center">
                                        {sanctioned === true ? (
                                            <span className="inline-flex items-center text-umd-red-700 bg-umd-red-50 px-2 py-1 rounded font-bold">
                                                ⚠️ {t.t('yes').toUpperCase()}
                                            </span>
                                        ) : sanctioned === false ? (
                                            <span className="inline-flex items-center text-umd-green-700 bg-umd-green-50 px-2 py-1 rounded">
                                                {t.t('no')}
                                            </span>
                                        ) : (
                                            <span className="text-umd-slate-400">-</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Sanction details */}
                        <tr className="hover:bg-umd-slate-50">
                            <td className="p-4 text-umd-slate-600 font-medium">
                                {t.t('sanctionDetails')}
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const sanctionDetails = getManualField(manualData, 'sanction_details');

                                return (
                                    <td key={service.slug} className="p-4 text-center text-xs text-umd-slate-600">
                                        {sanctionDetails ? (
                                            <div className="max-w-xs mx-auto text-left">
                                                <ReactMarkdown>{sanctionDetails.replaceAll('<br>', '\n').replaceAll('\n', ' \n ')}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <span className="text-umd-slate-400">-</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Response time */}
                        <tr className="hover:bg-umd-slate-50">
                            <td className="p-4 text-umd-slate-600 font-medium">
                                {t.t('avgResponseTime')}
                            </td>
                            {selectedServices.map((service) => {
                                const manualData = manualDataCache[service.slug];
                                const responseDelay = getManualField(manualData, 'response_delay') ?? "";

                                return (
                                    <td key={service.slug} className="p-4 text-center text-sm font-medium text-umd-slate-600">
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
