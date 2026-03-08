import { Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { EntrepriseData } from './types';
import { t } from './i18n';

interface BetterAlternativeProps {
    entreprise: EntrepriseData;
    lang: string;
}

export default function BetterAlternative({ entreprise, lang }: BetterAlternativeProps) {
    if (!entreprise.better_alternative) return null;

    const explication = lang === 'en'
        ? entreprise.better_alternative_explication_en
        : entreprise.better_alternative_explication;

    return (
        <div className="bg-base-50 border border-success/30 rounded-xl p-5 mb-8 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-success fill-success/20" />
                <h2 className="text-base font-semibold text-base-content">
                    {t(lang, 'recommendedAlternative')}
                </h2>
            </div>
            {explication && (
                <div className="prose prose-sm max-w-none text-base-content/80 leading-relaxed text-sm">
                    <ReactMarkdown
                        components={{
                            a: ({ node, ...props }) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-success font-medium hover:underline transition-colors" />
                            ),
                            p: ({ node, ...props }) => (
                                <p {...props} className="m-0 mb-2 last:mb-0" />
                            )
                        }}
                    >
                        {explication.replace(/\\n/g, '\n')}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
}
