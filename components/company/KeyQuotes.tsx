import type { ReactNode } from "react";

/** One published entry of public/data/policy-analysis/_quotes.json — built by
 *  `npm run build-policy-index` from the proposals in policy-quotes.json and
 *  the review sidecars (scripts/policyQuotes.mjs decides what is shown). */
export type KeyQuote = { quote: string; plain: { fr: string; en: string }; validated_by: string | null };
export type KeyQuoteEntry = {
    name: string;
    created_by: string;
    created_at: string;
    archive_url: string | null;
    live_check: { at: string; reachable: boolean; found?: boolean[] } | null;
    quotes: KeyQuote[];
};

const T = {
    fr: {
        plain: "En clair :", source: (n: string) => `Politique de confidentialité de ${n}`,
        by: (a: string, v: string | null) => `Proposée par ${a} · ${v ? `relue par ${v}` : "publiée sans relecture par une autre personne"}`,
    },
    en: {
        plain: "In plain words:", source: (n: string) => `${n} privacy policy`,
        by: (a: string, v: string | null) => `Proposed by ${a} · ${v ? `checked by ${v}` : "published without a second reviewer"}`,
    },
};

export function KeyQuoteCard({ q, name, author, lang, action }: {
    q: KeyQuote; name: string; author: string; lang: string; action?: ReactNode;
}) {
    const l = lang === "fr" ? "fr" : "en";
    return (
        <figure className="umd-card umd-keyquote h-full">
            <span aria-hidden="true" className="umd-keyquote-mark">«</span>
            <blockquote>{q.quote}</blockquote>
            <figcaption>— {T[l].source(name)}</figcaption>
            <p className="umd-keyquote-plain"><b>{T[l].plain}</b> {q.plain[l]}</p>
            <p className="umd-keyquote-credit">{T[l].by(author, q.validated_by)}</p>
            {action}
        </figure>
    );
}
