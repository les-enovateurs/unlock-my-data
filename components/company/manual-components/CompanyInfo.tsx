import { Building } from 'lucide-react';
import { t } from './i18n';
import { EntrepriseData } from './types';

interface CompanyInfoProps {
    entreprise: EntrepriseData;
    lang: string;
}

export default function CompanyInfo({ entreprise, lang }: CompanyInfoProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center">
                <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-gray-700">
                    <Building className="h-5 w-5" />
                </div>
                <h1 className="text-lg font-semibold text-gray-800">{entreprise.name}</h1>
            </div>
            <div className="divide-y divide-gray-50">
                {entreprise.nationality && 'fr' === lang && (
                    <div className="p-4">
                        <div className="text-sm text-gray-600 mb-1">{t(lang,'nationality')}</div>
                        <div className="text-gray-900 font-medium">{entreprise.nationality}</div>
                    </div>
                )}
                {entreprise.country_name && 'en' === lang && (
                    <div className="p-4">
                        <div className="text-sm text-gray-600 mb-1">{t(lang,'nationality')}</div>
                        <div className="text-gray-900 font-medium">{entreprise.country_name}</div>
                    </div>
                )}
                {entreprise.group_name && (
                    <div className="p-4">
                        <div className="text-sm text-gray-600 mb-1">{t(lang,'belongsToGroup')}</div>
                        <div className="text-gray-900 font-medium">{entreprise.group_name}</div>
                    </div>
                )}
                {(entreprise.created_at || entreprise.updated_at) && (
                    <div className="p-4 text-xs text-gray-400">
                        {entreprise.created_at && <>{t(lang,'createdOn')}&nbsp;{entreprise.created_at} {entreprise.created_by}<br/></>}
                        {entreprise.updated_at && <>{t(lang,'updatedOn')}&nbsp;{entreprise.updated_at} {entreprise.updated_by}</>}
                    </div>
                )}
            </div>
        </div>
    );
}

