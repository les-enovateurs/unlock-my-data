import Link from 'next/link';
import { AlertTriangle, ShieldAlert, Check, ExternalLink, User, FileText, Camera } from 'lucide-react';
import { t } from './i18n';
import { formatPwnCount, formatBreachDate, translateDataClass, ucfirst } from './helpers';
import { EntrepriseData, Breach } from './types';

interface DataBreachesProps {
    entreprise: EntrepriseData;
    breaches: Breach[];
    lang: string;
}

export default function DataBreaches({ entreprise, breaches, lang }: DataBreachesProps) {
    const hasHibpBreaches = breaches.length > 0;
    
    // Explicitly hide BLF breaches replaced by manual leaks
    const replacedBreachDates = entreprise.leaks?.map(l => l.replaces_breach_date).filter(Boolean) as string[];
    
    // Filter out BLF breaches that are already covered by manual leaks
    const blfBreaches = (lang === 'fr' && entreprise.data_breaches) 
        ? entreprise.data_breaches.filter(b => {
            if (b.verified_by_manual) return false;
            
            // Check if this breach date is explicitly replaced by a manual leak
            const bDateStr = b.date ? new Date(b.date).toISOString().split('T')[0] : null;
            if (bDateStr && replacedBreachDates.includes(bDateStr)) return false;
            
            return true;
        }) 
        : [];
    const hasBlfBreaches = blfBreaches.length > 0;
    const hasManualLeaks = entreprise.leaks && entreprise.leaks.length > 0;

    // Sort breaches by breachDate descending (newest first)
    const sortedHibpBreaches = [...breaches].sort((a, b) => {
        const ta = new Date(a.breachDate).getTime() || 0;
        const tb = new Date(b.breachDate).getTime() || 0;
        return tb - ta;
    });

    if (!hasHibpBreaches && !hasBlfBreaches && !hasManualLeaks) {
        return null;
    }

    const formattedUpdateDate = entreprise.updated_at ? new Date(entreprise.updated_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : null;

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
                        {formattedUpdateDate && (
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                                {t(lang, 'updatedOn')} {formattedUpdateDate}
                            </p>
                        )}
                    </div>
                    <span className="ml-3 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {breaches.length + blfBreaches.length + (entreprise.leaks?.length || 0)}
                    </span>
                </div>
            </div>

            <div className="p-4 space-y-8">
                {/* Manual Leaks (Priority) */}
                {hasManualLeaks && (
                    <div className="animate-fadeIn">
                        {/* Manual Section Header */}
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-blue-100">
                            <div className="bg-blue-100 p-1.5 rounded">
                                <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-800">
                                {lang === 'fr' ? 'Contributions de la communauté' : 'Community Contributions'}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                                {entreprise.leaks!.length}
                            </span>
                        </div>

                        {/* Manual Leaks List */}
                        <div className="space-y-4">
                            {entreprise.leaks!.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((leak, idx) => {
                                const typeToDisplay = (lang === 'en' && leak.type_en) ? leak.type_en : leak.type;
                                
                                return (
                                    <div key={`manual-${idx}`} className="bg-blue-50/50 rounded-xl border-2 border-blue-100 p-5 hover:border-blue-300 transition-all shadow-xs">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <ShieldAlert className="h-4 w-4 text-blue-500" />
                                                    <h4 className="font-bold text-blue-900 text-base">
                                                        {lang === 'fr' ? 'Fuite signalée' : 'Reported Leak'}
                                                    </h4>
                                                </div>
                                                <p className="text-sm text-blue-700/70 font-medium">
                                                    📅 {new Date(leak.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Data Type Badges */}
                                        <div className="mt-3 mb-4">
                                            <p className="text-xs font-medium text-gray-600 mb-2">{t(lang, 'leakedDataTypes')} :</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {typeToDisplay.split(',').map((typePart, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                                    >
                                                        {ucfirst(typePart.trim())}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="text-xs text-gray-400 mb-4">
                                            {t(lang, 'createdOn')}&nbsp;{leak.date} {leak.contributor}
                                        </div>

                                        <div className="flex flex-wrap gap-3 pt-4 border-t border-blue-100">
                                            {leak.proof_url && (
                                                <Link
                                                    href={leak.proof_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
                                                >
                                                    <Camera className="h-3.5 w-3.5 mr-1.5" />
                                                    {lang === 'fr' ? 'Voir la preuve' : 'View Proof'}
                                                </Link>
                                            )}
                                            {leak.media_link && (
                                                <Link
                                                    href={leak.media_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                                    {t(lang, 'source')}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* HIBP Breaches */}
                {hasHibpBreaches && (
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
                            {sortedHibpBreaches.map((breach, idx) => (
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

                                    {/* Description */}
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

                {/* Bonjour la Fuite Breaches */}
                {hasBlfBreaches && (
                    <div>
                        {/* Séparateur si d'autres sources existent */}
                        {(hasHibpBreaches || hasManualLeaks) && (
                            <div className="my-6 border-t-2 border-dashed border-gray-200"></div>
                        )}

                        {/* Bonjour la Fuite Section Header */}
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-100">
                            <div className="bg-purple-100 p-1.5 rounded">
                                <ShieldAlert className="h-4 w-4 text-purple-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800">{t(lang, 'bonjourLaFuiteSource')}</h3>
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {blfBreaches.length}
                            </span>
                        </div>

                        {/* Bonjour la Fuite Breaches List */}
                        <div className="space-y-3">
                            {blfBreaches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((breach, idx) => (
                                <div key={`blf-${idx}`} className="bg-purple-50 rounded-lg border border-purple-100 p-4 hover:border-purple-200 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                {breach.processor && (
                                                    <h4 className="font-semibold text-gray-900 text-base">{breach.processor}</h4>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                📅 {new Date(breach.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
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

                                    {/* Types de données */}
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
                                                                const url = new URL(typeof link === 'string' ? link : (link as any).href || '');
                                                                displayText = url.hostname.replace('www.', '');
                                                            } catch (e) {
                                                                displayText = (breach.links?.length || 0) > 1 ? `Lien ${i + 1}` : 'Lien';
                                                            }

                                                            const linkHref = typeof link === 'string' ? link : (link as any).href;
                                                            const linkText = typeof link === 'object' && (link as any).text ? (link as any).text : displayText;

                                                            return (
                                                                <Link
                                                                    key={i}
                                                                    href={(linkHref.indexOf('img/') >= 0 && !linkHref.startsWith('http') ? "https://bonjourlafuite.eu.org/" : "" ) + linkHref || '#'}
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
