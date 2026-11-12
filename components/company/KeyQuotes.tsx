import type { ReactNode } from "react";
import { KEY_QUOTE_TOPICS } from "@/scripts/policyQuotes.mjs";

/** One published entry of public/data/policy-analysis/_quotes.json — built by
 *  `npm run build-policy-index` from the proposals in policy-quotes.json and
 *  the review sidecars (scripts/policyQuotes.mjs decides what is shown). */
export type KeyQuote = { quote: string; quote_en?: string; topic: keyof typeof KEY_QUOTE_TOPICS; plain: { fr: string; en: string }; validated_by: string | null; plain_by?: string | null };
export type KeyQuoteEntry = {
    name: string;
    agent?: string;
    created_by: string;
    created_at: string;
    updated_at?: string | null;
    archive_url: string | null;
    /** The English version of the policy, when one exists: `quote_en` is a verbatim slice of it. */
    en?: { policy_url: string; text_sha256: string; archive_url?: string | null } | null;
    live_check: { at: string; reachable: boolean; found?: boolean[] } | null;
    quotes: KeyQuote[];
};

/** English readers get the English policy's own sentence when one matches; otherwise the French one, labelled as such. */
export function quoteIn(q: KeyQuote, lang: string) {
    const en = lang !== "fr";
    return { text: en && q.quote_en ? q.quote_en : q.quote, frenchOnly: en && !q.quote_en };
}

const T = {
    fr: {
        plain: "En clair :", plainBy: (n: string) => ` · « En clair » réécrit par ${n}`, source: (n: string) => `Politique de confidentialité de ${n}`,
        by: (a: string | undefined, v: string | null) => `Proposée par ${a || "un agent IA"} · ${v ? `validée par ${v}` : "publiée sans validation humaine"}`,
    },
    en: {
        plain: "In plain words:", plainBy: (n: string) => ` · plain-words line rewritten by ${n}`, source: (n: string) => `${n} privacy policy`, frenchOnly: " (French version: no matching sentence in the English one)",
        by: (a: string | undefined, v: string | null) => `Proposed by ${a || "an AI agent"} · ${v ? `validated by ${v}` : "published without human validation"}`,
    },
};

export function KeyQuoteCard({ q, name, agent, lang, action }: {
    q: KeyQuote; name: string; agent?: string; lang: string; action?: ReactNode;
}) {
    const l = lang === "fr" ? "fr" : "en";
    const topic = KEY_QUOTE_TOPICS[q.topic];
    const shown = quoteIn(q, l);
    return (
        <figure className="umd-card umd-keyquote h-full">
            <span aria-hidden="true" className="umd-keyquote-mark">«</span>
            {topic && <span className={"umd-chip w-fit " + (topic.level === "high" ? "umd-chip-danger" : "umd-chip-warn")}>{topic[l]}</span>}
            <blockquote lang={shown.frenchOnly ? "fr" : undefined}>{shown.text}</blockquote>
            <figcaption>— {T[l].source(name)}{shown.frenchOnly && T.en.frenchOnly}</figcaption>
            <p className="umd-keyquote-plain"><b>{T[l].plain}</b> {q.plain[l]}</p>
            <p className="umd-keyquote-credit">{T[l].by(agent, q.validated_by)}{q.plain_by && T[l].plainBy(q.plain_by)}</p>
            {action}
        </figure>
    );
}
