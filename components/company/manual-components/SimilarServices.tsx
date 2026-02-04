import Image from 'next/image';
import Link from 'next/link';
import { Building } from 'lucide-react';
import { t } from './i18n';
import { EntrepriseData } from './types';

interface SimilarServicesProps {
    similarServices: EntrepriseData[];
    lang: string;
}

export default function SimilarServices({ similarServices, lang }: SimilarServicesProps) {
    if (!similarServices || similarServices.length === 0) {
        return null;
    }

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t(lang, 'similarServices')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {similarServices.map((service, idx) => (
                    <Link href={lang === 'fr' ? `/liste-applications/${(service as any).slug}` : `/list-app/${(service as any).slug}`} key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all flex items-center space-x-4">
                        <div className="relative w-12 h-12 shrink-0">
                                {service.logo ? (
                                <Image src={service.logo} alt={service.name} fill className="object-contain rounded-md" unoptimized />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                        <Building className="h-6 w-6" />
                                    </div>
                                )}
                            </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                            <p className="text-xs text-gray-500">{service.nationality || service.country_name}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

