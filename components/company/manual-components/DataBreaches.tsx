import Link from 'next/link';
import { AlertTriangle, ShieldAlert, Check, ExternalLink } from 'lucide-react';
import { t } from './i18n';
import { formatPwnCount, formatBreachDate, translateDataClass, ucfirst } from './helpers';
import { EntrepriseData, Breach } from './types';

interface DataBreachesProps {
    entreprise: EntrepriseData;
    breaches: Breach[];
    lang: string;
}

export default function DataBreaches({ entreprise, breaches, lang }: DataBreachesProps) {
    const hasBreachData = breaches.length > 0;

    // Sort breaches by breachDate descending (newest first) without mutating original array
    const sortedBreaches = [...breaches].sort((a, b) => {
        const ta = new Date(a.breachDate).getTime() || 0;
        const tb = new Date(b.breachDate).getTime() || 0;
        return tb - ta;
    });

    if (!hasBreachData && !(lang === 'fr' && entreprise.data_breaches && entreprise.data_breaches.length > 0)) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow mt-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-50 to-purple-50 p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{t(lang, 'dataBreaches')}</h2>
                    </div>
                    <span className="ml-3 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {breaches.length + (lang === 'fr' && entreprise.data_breaches ? entreprise.data_breaches.length : 0)}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* HIBP Breaches */}
                {hasBreachData && (
                    <div>
                        {/* HIBP Section Header */}
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-100">
                            <div className="bg-red-100 p-1.5 rounded">
                                <ShieldAlert className="h-4 w-4 text-red-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800">{t(lang, 'hibpSource')}</h3>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {breaches.length}
                            </span>
                        </div>

                        {/* HIBP Breaches List */}
                        <div className="space-y-3">
                            {sortedBreaches.map((breach, idx) => (
                                <div key={`hibp-${idx}`} className=" rounded-lg border border-red-100 p-4 hover:border-red-200 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 text-base">{breach.title}</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                📅 {formatBreachDate(breach.breachDate, lang)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-red-600">{formatPwnCount(breach.pwnCount, lang)}</span>
                                            <p className="text-xs text-gray-500">{t(lang, 'accounts')}</p>
                                        </div>
                                    </div>

                                    {/* Description (partielle ou complète) - Attention au dangerouslySetInnerHTML si présent */}
                                    <div className="mb-3 prose prose-sm max-w-none text-gray-700 text-xs" dangerouslySetInnerHTML={{ __html: breach.description }} />

                                    {/* Types de données compromises */}
                                    <div className="mb-3">
                                        <p className="text-xs font-medium text-gray-600 mb-2">{t(lang, 'compromisedData')} :</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {breach.dataClasses.map((dataClass, i) => (
                                                <span
                                                    key={i}
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                                                        ['Passwords', 'Credit cards', 'Bank account numbers'].includes(dataClass)
                                                            ? 'bg-red-200 text-red-900 border border-red-300'
                                                            : ['Email addresses', 'Phone numbers', 'Physical addresses'].includes(dataClass)
                                                                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                    }`}
                                                >
                                                    {translateDataClass(dataClass, lang)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Indicateur de vérification */}
                                    {breach.isVerified && (
                                        <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 w-fit">
                                            <Check className="h-3 w-3 mr-1" />
                                            <span>{t(lang, 'verifiedBreach')}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* HIBP Footer */}
                        <div className="pt-3 text-right">
                            <Link
                                href="https://haveibeenpwned.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-gray-500 hover:text-red-600 hover:underline"
                            >
                                Source : Have I Been Pwned <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Bonjour la Fuite Breaches (French only) */}
                {lang === 'fr' && entreprise.data_breaches && entreprise.data_breaches.length > 0 && (
                    <div>
                        {/* Séparateur si HIBP existe aussi */}
                        {hasBreachData && (
                            <div className="my-6 border-t-2 border-dashed border-gray-200"></div>
                        )}

                        {/* Bonjour la Fuite Section Header */}
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-100">
                            <div className="bg-purple-100 p-1.5 rounded">
                                <ShieldAlert className="h-4 w-4 text-purple-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800">{t(lang, 'bonjourLaFuiteSource')}</h3>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {entreprise.data_breaches.length}
                            </span>
                        </div>

                        {/* Bonjour la Fuite Breaches List */}
                        <div className="space-y-3">
                            {entreprise.data_breaches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((breach, idx) => (
                                <div key={`blf-${idx}`} className="bg-purple-50 rounded-lg border border-purple-100 p-4 hover:border-purple-200 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            {breach.processor && (
                                                <h4 className="font-semibold text-gray-900 text-base">{breach.processor}</h4>
                                            )}
                                            <p className="text-sm text-gray-500 mt-1">
                                                📅 {new Date(breach.date).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        {breach.sensitive && (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                {t(lang, 'sensitiveData')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Volume */}
                                    {breach.volume && (
                                        <div className="mb-3 bg-white p-2 rounded border border-purple-200">
                                            <p className="text-xs font-medium text-gray-600 mb-1">{t(lang, 'dataVolume')} :</p>
                                            <span className="text-sm font-semibold text-purple-700">📊 {breach.volume}</span>
                                        </div>
                                    )}

                                    {/* Types de données avec ucfirst */}
                                    {breach.data_types && breach.data_types.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-xs font-medium text-gray-600 mb-2">{t(lang, 'leakedDataTypes')} :</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {breach.data_types.map((dataType, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
                                                    >
                                                        {ucfirst(dataType)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {breach.description && (
                                        <div className="mb-3 p-2 bg-white rounded border-l-2 border-purple-400">
                                            <p className="text-sm text-gray-700 italic">{breach.description}</p>
                                        </div>
                                    )}

                                    {/* Sources et liens */}
                                    <div className="mt-3 pt-3 border-t border-purple-200">
                                        <div className="space-y-2">
                                            {/* Liens additionnels */}
                                            {breach.links && breach.links.length > 0 && (
                                                <div className="flex items-start gap-2">
                                                    <span className="text-xs font-medium text-gray-600 min-w-fit">
                                                        {breach.links.length > 1 ? 'Références :' : 'Référence :'}
                                                    </span>
                                                    <div className="flex flex-col gap-1">
                                                        {breach.links.map((link, i) => {
                                                            let displayText = 'Lien';
                                                            try {
                                                                const url = new URL(typeof link === 'string' ? link : link.href || '');
                                                                displayText = url.hostname.replace('www.', '');
                                                            } catch (e) {
                                                                displayText = (breach.links?.length || 0) > 1 ? `Lien ${i + 1}` : 'Lien';
                                                            }

                                                            const linkHref = typeof link === 'string' ? link : link.href;
                                                            const linkText = typeof link === 'object' && link.text ? link.text : displayText;

                                                            return (
                                                                <Link
                                                                    key={i}
                                                                    href={(linkHref.indexOf('img/') >= 0 && !!linkHref.indexOf('https') ? "https://bonjourlafuite.eu.org/" : "" ) + linkHref || '#'}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                                                >
                                                                    {linkText} &nbsp;<ExternalLink className="h-3 w-3 mr-1" />
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                            {/* Source principale */}
                                            {breach.source_name && breach.source && (
                                                <div className="flex items-start gap-2">
                                                    <span className="text-xs font-medium text-gray-600 min-w-fit">Origine :</span>
                                                    <Link
                                                        href={breach.source}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-xs text-purple-600 hover:text-purple-800 hover:underline font-medium"
                                                    >
                                                        {breach.source_name}
                                                        <ExternalLink className="h-3 w-3 ml-1" />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

