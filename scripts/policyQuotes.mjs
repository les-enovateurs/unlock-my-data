// Publication rule for what an AI agent proposes about a policy: the key quotes
// of public/data/policy-quotes.json (sidecar items `keyquote/<i>`) and the
// change memos of public/data/policy-history.json (`history/<i>`).
//
// An item goes live once a named person validates it in the review tool — the
// person who ran the agent included. If nobody answers within FORCE_AFTER_DAYS,
// it can be published anyway from the same tool — the fiche then says so. A
// rejection always wins.
export const FORCE_AFTER_DAYS = 7;

export const keyQuoteKey = (i) => `keyquote/${i}`;
export const historyKey = (i) => `history/${i}`;

/** First day (YYYY-MM-DD) the author may force publication. */
export function forceAllowedFrom(createdAt) {
    const d = new Date(`${createdAt}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + FORCE_AFTER_DAYS);
    return d.toISOString().slice(0, 10);
}

export function validatorOf(sidecar, key) {
    const v = sidecar?.items?.[key];
    return v?.verdict === "validated" ? v.by : null;
}

/** Publishing goes through the review tool like the rest of the analysis: a
 *  `reviewers` entry, credited like any other action. It covers every item
 *  proposed at least FORCE_AFTER_DAYS before the click. */
export const PUBLISH_ACTION = "published_key_quotes";
export function isForcedSince(proposedAt, sidecar) {
    const from = forceAllowedFrom(proposedAt);
    return (sidecar?.reviewers || []).some((r) => r.action === PUBLISH_ACTION && r.date >= from);
}
/** The key quotes are one proposal: any change to it restarts the delay. */
export const keyQuotesProposedAt = (entry) => entry.updated_at || entry.created_at;
export const isForced = (entry, sidecar) => isForcedSince(keyQuotesProposedAt(entry), sidecar);

function isShown(sidecar, key, proposedAt) {
    const verdict = sidecar?.items?.[key]?.verdict;
    return verdict !== "rejected" && (verdict === "validated" || isForcedSince(proposedAt, sidecar));
}
function isPending(sidecar, key, proposedAt) {
    return !sidecar?.items?.[key] && !isForcedSince(proposedAt, sidecar);
}

/** The "En clair" line as last rewritten in the review tool, else as proposed. */
export function plainOf(q, sidecar, i) {
    const p = sidecar?.key_quote_plain?.[keyQuoteKey(i)];
    return p ? { fr: p.fr, en: p.en } : q.plain;
}

/** The quotes a visitor may see, each saying who checked it (null = forced). */
export function publishedKeyQuotes(entry, sidecar) {
    const proposedAt = keyQuotesProposedAt(entry);
    return entry.quotes
        .map((q, i) => ({ ...q, ...(q.plain && { plain: plainOf(q, sidecar, i) }),
            ...(sidecar?.key_quote_plain?.[keyQuoteKey(i)] && { plain_by: sidecar.key_quote_plain[keyQuoteKey(i)].by }),
            validated_by: validatorOf(sidecar, keyQuoteKey(i)) }))
        .filter((_, i) => isShown(sidecar, keyQuoteKey(i), proposedAt));
}

/** Quotes nobody has ruled on yet: what keeps a service in the "à relire" tab. */
export function pendingKeyQuotes(entry, sidecar) {
    if (!entry) return 0;
    const proposedAt = keyQuotesProposedAt(entry);
    return entry.quotes.filter((_, i) => isPending(sidecar, keyQuoteKey(i), proposedAt)).length;
}

/** The policy changes a visitor may see, newest first. Each entry has its own
 *  delay: a change detected later is a new proposal. */
export function publishedHistory(entries = [], sidecar) {
    return entries
        .map((e, i) => ({ ...e, validated_by: validatorOf(sidecar, historyKey(i)) }))
        .filter((e, i) => isShown(sidecar, historyKey(i), e.created_at))
        .reverse();
}

export function pendingHistory(entries = [], sidecar) {
    return entries.filter((e, i) => isPending(sidecar, historyKey(i), e.created_at)).length;
}

/** What a key quote is about, from a closed list, so a reader sees at a glance
 *  how serious it is. "high" = data a person cannot change or did not give
 *  (body, private messages, inferences, data bought elsewhere, children). */
export const KEY_QUOTE_TOPICS = {
    biometrie: { level: "high", fr: "Corps et biométrie", en: "Body and biometrics" },
    messages_prives: { level: "high", fr: "Messages privés", en: "Private messages" },
    deductions: { level: "high", fr: "Déductions sur vous", en: "Inferences about you" },
    ia: { level: "high", fr: "IA nourrie de vos données", en: "AI fed on your data" },
    donnees_achetees: { level: "high", fr: "Données venues d'ailleurs", en: "Data from elsewhere" },
    scoring: { level: "high", fr: "Notation", en: "Scoring" },
    decision_automatisee: { level: "high", fr: "Décision automatique", en: "Automated decision" },
    mineurs: { level: "high", fr: "Enfants", en: "Children" },
    collecte_cachee: { level: "medium", fr: "Collecte à votre insu", en: "Collection you don't see" },
    non_utilisateurs: { level: "medium", fr: "Personnes sans compte", en: "People without an account" },
    partage_commercial: { level: "medium", fr: "Partage commercial", en: "Commercial sharing" },
    transferts: { level: "medium", fr: "Accès depuis l'étranger", en: "Access from abroad" },
    conservation: { level: "medium", fr: "Conservation sans limite", en: "Kept without limit" },
};
