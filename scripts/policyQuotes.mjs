// Publication rule for the key quotes of public/data/policy-quotes.json.
//
// An AI agent proposes; a quote goes live once a named person validates it in
// the review tool (sidecar item `keyquote/<i>`) — the person who ran the agent
// included. If nobody answers within FORCE_AFTER_DAYS, it can be published
// anyway from the same tool — the quote then says so on the fiche. A rejection
// always wins.
export const FORCE_AFTER_DAYS = 7;

export const keyQuoteKey = (i) => `keyquote/${i}`;

/** First day (YYYY-MM-DD) the author may force publication. */
export function forceAllowedFrom(createdAt) {
    const d = new Date(`${createdAt}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + FORCE_AFTER_DAYS);
    return d.toISOString().slice(0, 10);
}

/** An independent validation: by anyone but the author. */
export function validatorOf(entry, sidecar, i) {
    const v = sidecar?.items?.[keyQuoteKey(i)];
    return v?.verdict === "validated" ? v.by : null;
}

/** Publishing goes through the review tool like the rest of the analysis: a
 *  `reviewers` entry, credited like any other action. It counts once the delay
 *  has passed since the proposal (or the last change to it). */
export const PUBLISH_ACTION = "published_key_quotes";
export function isForced(entry, sidecar) {
    const from = forceAllowedFrom(entry.updated_at || entry.created_at);
    return (sidecar?.reviewers || []).some((r) => r.action === PUBLISH_ACTION && r.date >= from);
}

/** The "En clair" line as last rewritten in the review tool, else as proposed. */
export function plainOf(q, sidecar, i) {
    const p = sidecar?.key_quote_plain?.[keyQuoteKey(i)];
    return p ? { fr: p.fr, en: p.en } : q.plain;
}

/** The quotes a visitor may see, each saying who checked it (null = forced). */
export function publishedKeyQuotes(entry, sidecar) {
    const forced = isForced(entry, sidecar);
    return entry.quotes
        .map((q, i) => ({ ...q, ...(q.plain && { plain: plainOf(q, sidecar, i) }),
            ...(sidecar?.key_quote_plain?.[keyQuoteKey(i)] && { plain_by: sidecar.key_quote_plain[keyQuoteKey(i)].by }),
            validated_by: validatorOf(entry, sidecar, i), rejected: sidecar?.items?.[keyQuoteKey(i)]?.verdict === "rejected" }))
        .filter((q) => !q.rejected && (q.validated_by || forced))
        .map(({ rejected, ...q }) => q);
}

/** Quotes nobody has ruled on yet: what keeps a service in the "à relire" tab. */
export function pendingKeyQuotes(entry, sidecar) {
    if (!entry || isForced(entry, sidecar)) return 0;
    return entry.quotes.filter((_, i) => !sidecar?.items?.[keyQuoteKey(i)]).length;
}

/** What a key quote is about, from a closed list, so a reader sees at a glance
 *  how serious it is. "high" = data a person cannot change or did not give
 *  (body, private messages, inferences, data bought elsewhere, children). */
export const KEY_QUOTE_TOPICS = {
    biometrie: { level: "high", fr: "Corps et biométrie", en: "Body and biometrics" },
    messages_prives: { level: "high", fr: "Messages privés", en: "Private messages" },
    deductions: { level: "high", fr: "Déductions sur vous", en: "Inferences about you" },
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
