// Publication rule for what an AI agent proposes about a policy: the key quotes
// of public/data/policy-quotes.json (sidecar items `keyquote/<i>`) and the
// change memos of public/data/policy-history.json (`history/<i>`).
//
// An item goes live once a named person validates it in the review tool — the
// person who ran the agent included. If nobody answers within FORCE_AFTER_DAYS,
// the next build publishes it anyway and the fiche says so. A rejection always
// wins.
export const FORCE_AFTER_DAYS = 7;

export const keyQuoteKey = (i) => `keyquote/${i}`;
export const historyKey = (i) => `history/${i}`;

/** First day (YYYY-MM-DD) an unanswered proposal is published. */
export function forceAllowedFrom(createdAt) {
    const d = new Date(`${createdAt}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + FORCE_AFTER_DAYS);
    return d.toISOString().slice(0, 10);
}

export const todayIso = () => new Date().toISOString().slice(0, 10);

export function validatorOf(sidecar, key) {
    const v = sidecar?.items?.[key];
    return v?.verdict === "validated" ? v.by : null;
}

export const isForcedSince = (proposedAt, today = todayIso()) => today >= forceAllowedFrom(proposedAt);
/** The key quotes are one proposal: any change to it restarts the delay. */
export const keyQuotesProposedAt = (entry) => entry.updated_at || entry.created_at;

function isShown(sidecar, key, proposedAt, today) {
    const verdict = sidecar?.items?.[key]?.verdict;
    return verdict !== "rejected" && (verdict === "validated" || isForcedSince(proposedAt, today));
}
function isPending(sidecar, key, proposedAt, today) {
    return !sidecar?.items?.[key] && !isForcedSince(proposedAt, today);
}

/** The agent writes every candidate (up to 8) and volunteers pick: publishing
 *  without review keeps only the strongest few, never the whole list. */
export const FORCED_MAX = 3;

/** Quote indexes in the order volunteers set in the review tool, else the
 *  agent's. An order saved before the proposal last changed points at other
 *  quotes, so it is ignored. */
export function keyQuoteOrder(entry, sidecar) {
    const all = entry.quotes.map((_, i) => i);
    const saved = sidecar?.key_quote_order;
    if (!saved || saved.at < keyQuotesProposedAt(entry)) return all;
    const kept = saved.order.filter((i) => all.includes(i));
    return [...new Set([...kept, ...all])];
}

/** The "En clair" line as last rewritten in the review tool, else as proposed. */
export function plainOf(q, sidecar, i) {
    const p = sidecar?.key_quote_plain?.[keyQuoteKey(i)];
    return p ? { fr: p.fr, en: p.en } : q.plain;
}

/** The quotes a visitor may see, in the volunteers' order (the first one is
 *  featured), each saying who checked it (null = forced). */
export function publishedKeyQuotes(entry, sidecar, today = todayIso()) {
    const forced = isForcedSince(keyQuotesProposedAt(entry), today);
    const verdictOf = (i) => sidecar?.items?.[keyQuoteKey(i)]?.verdict;
    return keyQuoteOrder(entry, sidecar)
        .filter((i) => verdictOf(i) !== "rejected")
        .filter((i, rank) => verdictOf(i) === "validated" || (forced && rank < FORCED_MAX))
        .map((i) => {
            const q = entry.quotes[i];
            const rewrite = sidecar?.key_quote_plain?.[keyQuoteKey(i)];
            return { ...q, ...(q.plain && { plain: plainOf(q, sidecar, i) }),
                ...(rewrite && { plain_by: rewrite.by }),
                validated_by: validatorOf(sidecar, keyQuoteKey(i)) };
        });
}

/** Quotes nobody has ruled on yet: what keeps a service in the "à relire" tab. */
export function pendingKeyQuotes(entry, sidecar, today = todayIso()) {
    if (!entry) return 0;
    const proposedAt = keyQuotesProposedAt(entry);
    return entry.quotes.filter((_, i) => isPending(sidecar, keyQuoteKey(i), proposedAt, today)).length;
}

/** The policy changes a visitor may see, newest first. Each entry has its own
 *  delay: a change detected later is a new proposal. */
export function publishedHistory(entries = [], sidecar, today = todayIso()) {
    return entries
        .map((e, i) => ({ ...e, validated_by: validatorOf(sidecar, historyKey(i)) }))
        .filter((e, i) => isShown(sidecar, historyKey(i), e.created_at, today))
        .reverse();
}

export function pendingHistory(entries = [], sidecar, today = todayIso()) {
    return entries.filter((e, i) => isPending(sidecar, historyKey(i), e.created_at, today)).length;
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
