import Link from "next/link";
import { ArrowRight } from "lucide-react";
import publishedQuotes from "@/public/data/policy-analysis/_quotes.json";
import { KeyQuoteCard, type KeyQuoteEntry } from "@/components/company/KeyQuotes";
import { ficheHref } from "@/components/company/ficheTabs";

const T = {
    fr: {
        title: "Ce qu'ils écrivent vraiment",
        sub: "Des phrases copiées mot pour mot dans leurs politiques de confidentialité, et relues par notre équipe.",
        show: "Voir dans la politique",
    },
    en: {
        title: "What they actually write",
        sub: "Sentences copied word for word from their privacy policies, checked by our team.",
        show: "Show in the policy",
    },
};
const MAX_CARDS = 3;

/** One quote per service — the first, which the skill orders as the strongest. */
export default function HomeKeyQuotes({ lang }: { lang: string }) {
    const l = lang === "fr" ? "fr" : "en";
    const cards = Object.entries(publishedQuotes as Record<string, KeyQuoteEntry>).slice(0, MAX_CARDS);
    if (!cards.length) return null;
    return (
        <section aria-labelledby="key-quotes-heading" className="py-16 md:py-20" style={{ background: "var(--slate-50)" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 id="key-quotes-heading" className="umd-heading-2 text-center mb-2">{T[l].title}</h2>
                <p className="text-center text-umd-slate-600 mb-10">{T[l].sub}</p>
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0">
                    {cards.map(([slug, entry]) => (
                        <li key={slug} className="h-full">
                            <KeyQuoteCard q={entry.quotes[0]} name={entry.name} author={entry.created_by} lang={l} action={
                                <Link href={`${ficheHref(l, slug, "donnees")}#quote/0`} prefetch={false}
                                    className="text-sm font-bold flex items-center gap-1.5 mt-auto" style={{ color: "var(--indigo-700)" }}>
                                    {T[l].show} <ArrowRight size={15} aria-hidden="true" />
                                </Link>
                            } />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
