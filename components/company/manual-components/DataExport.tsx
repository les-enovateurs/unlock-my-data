import Link from 'next/link';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { t } from './i18n';
import { EntrepriseData } from './types';

interface DataExportProps {
    entreprise: EntrepriseData;
    lang: string;
}

export default function DataExport({ entreprise, lang }: DataExportProps) {
    if (!entreprise.example_data_export || entreprise.example_data_export.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow mt-6">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-gray-700">
                    <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{t(lang,'dataExport')}</h2>
            </div>
            <div className="divide-y divide-gray-50">
                <div className="p-4">
                    <div className="font-medium text-gray-700 mb-2">{t(lang,'dataExportExamples')}</div>
                    <div className="space-y-2">
                        {entreprise.example_data_export.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded">
                                <Link href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline">
                                    <Download className="h-4 w-4 mr-1" />
                                    {'fr' === lang ? item.description : item.description_en} ({item.type})
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                </Link>
                                <div className="text-xs text-gray-500 mt-1">{t(lang,'date')}: {item.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {entreprise.response_format && 'fr' === lang && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'responseFormat')}</div>
                        <div>{entreprise.response_format}</div>
                    </div>
                )}
                {entreprise.response_format_en && 'en' === lang && (
                    <div className="p-4">
                        <div className="font-medium text-gray-700">{t(lang,'responseFormat')}</div>
                        <div>{entreprise.response_format_en}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

