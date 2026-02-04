import Link from 'next/link';
import { FileText, ExternalLink } from 'lucide-react';
import { t } from './i18n';
import { TermsMemo } from './types';

interface TermsChangesProps {
    termsMemos: TermsMemo[];
    lang: string;
}

export default function TermsChanges({ termsMemos, lang }: TermsChangesProps) {
    if (!termsMemos || termsMemos.length === 0) {
        return null;
    }

    // Sort terms memos by their first date descending (newest first)
    const sortedTermsMemos = [...termsMemos].sort((a, b) => {
        const da = a.dates && a.dates.length > 0 ? new Date(a.dates[0]).getTime() || 0 : 0;
        const db = b.dates && b.dates.length > 0 ? new Date(b.dates[0]).getTime() || 0 : 0;
        return db - da;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow mt-6">
            <div className="bg-amber-50 p-4 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-amber-600">
                        <FileText className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">{t(lang, 'termsChanges')}</h2>
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {termsMemos.length}
                    </span>
                </div>
            </div>
            <div className="p-4 space-y-4">
                <p className="text-sm text-gray-500 mb-4">{t(lang, 'termsChangesDesc')}</p>

                {sortedTermsMemos.map((memo, idx) => {
                    const memoDate = memo.dates?.[0] ? new Date(memo.dates[0]).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }) : '';
                    const memoTitle = lang === 'fr' ? memo.title_fr : memo.title;
                    const memoDesc = lang === 'fr' ? (memo.description_fr || memo.description) : memo.description;

                    return (
                        <div key={idx} className="bg-gray-50 rounded-lg border border-gray-100 p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium text-gray-900 text-sm leading-snug pr-4">{memoTitle}</h3>
                                {memoDate && (
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{memoDate}</span>
                                )}
                            </div>

                            {memoDesc && (
                                <p className="text-sm text-gray-600 mb-3">{memoDesc}</p>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                    {memo.terms_types?.map((type, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800"
                                        >
                                            {type}
                                        </span>
                                    ))}
                                </div>
                                <Link
                                    href={memo.url}
                                    target="_blank"
                                    className="text-xs text-amber-600 hover:text-amber-800 hover:underline inline-flex items-center"
                                >
                                    {t(lang, 'readMore')} <ExternalLink className="h-3 w-3 ml-1" />
                                </Link>
                            </div>
                        </div>
                    );
                })}

                <div className="pt-2 text-right border-t border-gray-100">
                    <Link
                        href="https://opentermsarchive.org/en/memos/"
                        target="_blank"
                        className="text-xs text-gray-500 hover:text-amber-600 hover:underline inline-flex items-center"
                    >
                        Source: Open Terms Archive <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

