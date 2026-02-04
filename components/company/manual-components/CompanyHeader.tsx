import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ArrowRight, Scale, Edit } from 'lucide-react';
import { t } from './i18n';
import { EntrepriseData } from './types';

interface CompanyHeaderProps {
    entreprise: EntrepriseData;
    lang: string;
    slug: string;
    compareServicesParam: string;
}

export default function CompanyHeader({ entreprise, lang, slug, compareServicesParam }: CompanyHeaderProps) {
    // Check for delete option availability
    const hasDeleteOption = !!(entreprise.contact_mail_delete || entreprise.url_delete || entreprise.contact_mail_export);
    const deleteLink = lang === 'fr' ? `/supprimer-mes-donnees/${slug}` : `/delete-my-data/${slug}`;

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
            {/* Logo */}
            {entreprise.logo && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-48 h-48 flex items-center justify-center shrink-0">
                    <div className="relative w-full h-full">
                        <Image src={entreprise.logo} alt={`Logo ${entreprise.name}`} fill className="object-contain" unoptimized />
                    </div>
                </div>
            )}

            {/* Title and Quick Actions */}
            <div className="grow w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">{entreprise.name}</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Delete Action */}
                    {hasDeleteOption ? (
                        <div className="p-4 rounded-xl border border-red-100 bg-red-50 hover:shadow-md transition-all duration-200 cursor-pointer group relative">
                            <div className="flex items-start justify-between mb-2">
                                <div className="p-2 rounded-lg bg-red-100 text-red-600">
                                    <Trash2 className="h-5 w-5" />
                                </div>
                                <ArrowRight className="h-4 w-4 text-red-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h3 className="font-semibold text-gray-900">{t(lang, 'deleteDataAction')}</h3>
                            <p className="text-xs text-gray-500 mt-1">{t(lang, 'deleteDataDesc')}</p>
                            <Link href={deleteLink} className="absolute inset-0" />
                        </div>
                    ) : (
                         <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed">
                            <div className="flex items-start justify-between mb-2">
                                <div className="p-2 rounded-lg bg-gray-200 text-gray-500">
                                    <Trash2 className="h-5 w-5" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900">{t(lang, 'deleteNotAvailable')}</h3>
                            <p className="text-xs text-gray-500 mt-1">{t(lang, 'deleteNotAvailableDesc')}</p>
                        </div>
                    )}

                    {/* Compare Action */}
                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50 hover:shadow-md transition-all duration-200 cursor-pointer group relative">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <Scale className="h-5 w-5" />
                            </div>
                            <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{t(lang, 'compareAction')}</h3>
                        <p className="text-xs text-gray-500 mt-1">{t(lang, 'compareDesc')}</p>
                        <Link href={lang === 'fr' ? `/comparer?services=${compareServicesParam}` : `/compare?services=${compareServicesParam}`} className="absolute inset-0" />
                    </div>

                    {/* Modify Action */}
                    <div className="p-4 rounded-xl border border-yellow-100 bg-yellow-50 hover:shadow-md transition-all duration-200 cursor-pointer group relative">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                                <Edit className="h-5 w-5" />
                            </div>
                            <ArrowRight className="h-4 w-4 text-yellow-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{t(lang, 'modifyAction')}</h3>
                        <p className="text-xs text-gray-500 mt-1">{t(lang, 'modifyDesc')}</p>
                        <Link href={`/contribuer/modifier-fiche?slug=${slug}`} className="absolute inset-0" />
                    </div>
                </div>
            </div>
        </div>
    );
}

