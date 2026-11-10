// Publication rule for the key quotes of public/data/policy-quotes.json.
//
// The author proposes (created_by); a quote goes live once someone else
// validates it in the review tool (sidecar item `keyquote/<i>`). If nobody
// answers within FORCE_AFTER_DAYS, it can be published anyway from the same
// tool — the quote then says so on the fiche. A rejection always wins.
export const FORCE_AFTER_DAYS = 7;

export const keyQuoteKey = (i) => `keyquote/${i}`;

const sameName = (a, b) => (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase();

/** First day (YYYY-MM-DD) the author may force publication. */
export function forceAllowedFrom(createdAt) {
    const d = new Date(`${createdAt}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + FORCE_AFTER_DAYS);
    return d.toISOString().slice(0, 10);
}

/** An independent validation: by anyone but the author. */
export function validatorOf(entry, sidecar, i) {
    const v = sidecar?.items?.[keyQuoteKey(i)];
    return v?.verdict === "validated" && !sameName(v.by, entry.created_by) ? v.by : null;
}

/** Publishing goes through the review tool like the rest of the analysis: a
 *  `reviewers` entry, credited like any other action. It counts once the delay
 *  has passed since the proposal (or the last change to it). */
export const PUBLISH_ACTION = "published_key_quotes";
export function isForced(entry, sidecar) {
    const from = forceAllowedFrom(entry.updated_at || entry.created_at);
    return (sidecar?.reviewers || []).some((r) => r.action === PUBLISH_ACTION && r.date >= from);
}

/** The quotes a visitor may see, each saying who checked it (null = forced). */
export function publishedKeyQuotes(entry, sidecar) {
    const forced = isForced(entry, sidecar);
    return entry.quotes
        .map((q, i) => ({ ...q, validated_by: validatorOf(entry, sidecar, i), rejected: sidecar?.items?.[keyQuoteKey(i)]?.verdict === "rejected" }))
        .filter((q) => !q.rejected && (q.validated_by || forced))
        .map(({ rejected, ...q }) => q);
}
