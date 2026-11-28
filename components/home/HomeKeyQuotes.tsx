import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import services from "@/public/data/services.json";
import publishedQuotes from "@/public/data/policy-analysis/_quotes.json";
import { quoteIn, type KeyQuoteEntry } from "@/components/company/KeyQuotes";
import { ficheHref } from "@/components/company/ficheTabs";
import { KEY_QUOTE_TOPICS } from "@/scripts/policyQuotes.mjs";

const T = {
    fr: {
        title: "Lu dans leurs politiques de confidentialité",
        sub: "Des phrases recopiées mot pour mot, avec leur traduction en clair.",
        plain: "En clair :",
        checked: (v: string | null) => v ? `Vérifiée par ${v}` : "Pas encore relue par un bénévole",
        show: (n: string) => `Le passage dans la politique de ${n}`,
    },
    en: {
        title: "Read in their privacy policies",
        sub: "Sentences copied word for word, with a plain-words translation.",
        plain: "In plain words:",
        checked: (v: string | null) => v ? `Checked by ${v}` : "Not yet reviewed by a volunteer",
        show: (n: string) => `The passage in ${n}'s policy`,
    },
};
const MAX_QUOTES = 3;

/** Quotes are verbatim slices; one cut mid-sentence gets the usual ellipsis rather than a rewritten capital. */
function startsMidSentence(text: string) {
    const c = text.charAt(0);
    return c !== c.toUpperCase();
}

/** The newest quoted services first, so the block changes as volunteers publish. */
export default function HomeKeyQuotes({ lang }: { lang: string }) {
    const l = lang === "fr" ? "fr" : "en";
    const entries = Object.entries(publishedQuotes as Record<string, KeyQuoteEntry>)
        .sort(([, a], [, b]) => b.created_at.localeCompare(a.created_at))
        .slice(0, MAX_QUOTES);
    if (!entries.length) return null;
    return (
        <section aria-labelledby="key-quotes-heading" className="py-14 md:py-16 bg-white border-t border-umd-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 id="key-quotes-heading" className="umd-heading-2 mb-2">{T[l].title}</h2>
                <p className="text-umd-slate-600 mb-8">{T[l].sub}</p>
                <ul className="list-none p-0 m-0">
                    {entries.map(([slug, entry]) => {
                        const q = entry.quotes[0];
                        const shown = quoteIn(q, l);
                        const topic = KEY_QUOTE_TOPICS[q.topic];
                        const logo = services.find((s) => s.slug === slug)?.logo;
                        return (
                            <li key={slug} className="umd-home-quote">
                                <div className="flex md:flex-col items-center md:items-start gap-3">
                                    <span className="umd-home-logo">
                                        {logo ? <Image src={logo} alt="" width={40} height={40} unoptimized />
                                            : <span aria-hidden="true">{entry.name.charAt(0)}</span>}
                                    </span>
                                    <div>
                                        <p className="m-0 font-display font-bold text-umd-slate-900">{entry.name}</p>
                                        {topic && <p className="m-0 text-sm text-umd-slate-600">{topic[l]}</p>}
                                    </div>
                                </div>
                                <figure className="m-0">
                                    <blockquote lang={shown.frenchOnly ? "fr" : undefined} className="umd-home-excerpt">
                                        <mark>{startsMidSentence(shown.text) && "… "}{shown.text}</mark>
                                    </blockquote>
                                    <figcaption className="mt-4">
                                        <p className="m-0 mb-3 text-umd-slate-800 leading-relaxed"><b>{T[l].plain}</b> {q.plain[l]}</p>
                                        <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                            <Link href={`${ficheHref(l, slug, "donnees")}#quote/0`} prefetch={false}
                                                className="inline-flex items-center gap-1.5 font-bold" style={{ color: "var(--indigo-700)" }}>
                                                {T[l].show(entry.name)} <ArrowRight size={15} aria-hidden="true" />
                                            </Link>
                                            <span className="text-umd-slate-600">{T[l].checked(q.validated_by)}</span>
                                        </p>
                                    </figcaption>
                                </figure>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
