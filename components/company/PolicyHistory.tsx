type Lang = "fr" | "en";

/** One change of public/data/policy-history.json: found by the weekly watch
 *  (.claude/skills/policy-quotes/watch.py), summed up by an agent, validated in
 *  the review tool. The site reads the published ones from _history.json. */
export type PolicyChange = {
    detected_at: string;
    langs: Lang[];
    /** As the publisher prints it; null when the policy shows no date. */
    policy_date_before: string | null;
    policy_date_after: string | null;
    /** Paragraphs added / removed, per language. */
    added: Partial<Record<Lang, number>>;
    removed: Partial<Record<Lang, number>>;
    /** Key quotes no longer found in the live policy, verbatim. */
    quotes_missing: string[];
    memo: Record<Lang, string>;
    agent?: string;
    created_by: string;
    created_at: string;
    text_sha256_before: string;
    text_sha256_after: string;
    archive_url: string | null;
    validated_by?: string | null;
};

const VISIBLE = 2;

const T = {
    fr: {
        title: "Ce qui a changé dans sa politique",
        sub: "Changements repérés par notre veille hebdomadaire, résumés en clair et relus avant publication.",
        detected: (d: string) => `Repéré le ${d}`,
        printed: (a: string, b: string) => `date affichée : ${a} → ${b}`,
        added: (n: number) => `${n} passage${n > 1 ? "s" : ""} ajouté${n > 1 ? "s" : ""}`,
        removed: (n: number) => `${n} passage${n > 1 ? "s" : ""} retiré${n > 1 ? "s" : ""}`,
        gone: (n: number) => (n > 1 ? "Phrases citées ici qui ont disparu" : "Phrase citée ici qui a disparu"),
        by: (a: string | undefined, v: string | null | undefined) => `Proposé par ${a || "un agent IA"} · ${v ? `validé par ${v}` : "publié sans validation humaine"}`,
        archive: "copie archivée",
        more: (n: number) => `Voir ${n > 1 ? `les ${n} changements précédents` : "le changement précédent"}`,
        less: "Masquer les changements précédents",
    },
    en: {
        title: "What changed in its policy",
        sub: "Changes found by our weekly watch, summed up in plain words and checked before publication.",
        detected: (d: string) => `Found on ${d}`,
        printed: (a: string, b: string) => `printed date: ${a} → ${b}`,
        added: (n: number) => `${n} passage${n > 1 ? "s" : ""} added`,
        removed: (n: number) => `${n} passage${n > 1 ? "s" : ""} removed`,
        gone: (n: number) => (n > 1 ? "Sentences quoted here that are gone" : "Sentence quoted here that is gone"),
        by: (a: string | undefined, v: string | null | undefined) => `Proposed by ${a || "an AI agent"} · ${v ? `validated by ${v}` : "published without human validation"}`,
        archive: "archived copy",
        more: (n: number) => `See ${n > 1 ? `the ${n} earlier changes` : "the earlier change"}`,
        less: "Hide earlier changes",
    },
};

function fmtDay(iso: string, l: Lang) {
    const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
    return isNaN(d.getTime()) ? iso
        : d.toLocaleDateString(l === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function ChangeItem({ c, l }: { c: PolicyChange; l: Lang }) {
    const t = T[l];
    // The reader's language when the change touched it, else the one it touched.
    const side = c.langs.includes(l) ? l : c.langs[0];
    const facts = [c.added[side] ? t.added(c.added[side]!) : null, c.removed[side] ? t.removed(c.removed[side]!) : null]
        .filter((x): x is string => Boolean(x));
    return (
        <li className="umd-tl-item">
            <div className="umd-tl-head">
                <b>{t.detected(fmtDay(c.detected_at, l))}</b>
                {(c.policy_date_before || c.policy_date_after) && (
                    <span>{t.printed(c.policy_date_before || "—", c.policy_date_after || "—")}</span>
                )}
            </div>
            <p className="umd-tl-memo">{c.memo[l]}</p>
            {facts.length > 0 && (
                <div className="umd-tl-group"><ul>{facts.map((f) => <li key={f}>{f}</li>)}</ul></div>
            )}
            {c.quotes_missing.length > 0 && (
                <div className="umd-tl-group">
                    <h5>{t.gone(c.quotes_missing.length)}</h5>
                    {c.quotes_missing.map((q) => <blockquote key={q} className="umd-tl-gone">« {q} »</blockquote>)}
                </div>
            )}
            <p className="umd-tl-credit">
                {t.by(c.agent, c.validated_by)}
                {c.archive_url && <> · <a href={c.archive_url} rel="noopener noreferrer" target="_blank">{t.archive}</a></>}
            </p>
        </li>
    );
}

/** Newest first: the two latest changes, the rest behind a native <details>
 *  (keyboard-operable, no script). Renders nothing for a service without history. */
export default function PolicyHistory({ changes, lang }: { changes: PolicyChange[]; lang: string }) {
    if (!changes.length) return null;
    const l: Lang = lang === "fr" ? "fr" : "en";
    const t = T[l];
    const rest = changes.slice(VISIBLE);
    return (
        <section className="mb-7">
            <div className="mt-9 mb-4">
                <h3 className="umd-heading-3 !text-[19px]">{t.title}</h3>
                <p className="text-umd-slate-600 text-[13.5px] mt-1 m-0">{t.sub}</p>
            </div>
            <ol className="umd-tl">
                {changes.slice(0, VISIBLE).map((c) => <ChangeItem key={c.created_at + c.detected_at} c={c} l={l} />)}
            </ol>
            {rest.length > 0 && (
                <details className="umd-tl-more">
                    <summary className="umd-btn umd-btn-ghost umd-btn-sm">
                        <span className="umd-tl-more-closed">{t.more(rest.length)}</span>
                        <span className="umd-tl-more-open">{t.less}</span>
                    </summary>
                    <ol className="umd-tl">
                        {rest.map((c) => <ChangeItem key={c.created_at + c.detected_at} c={c} l={l} />)}
                    </ol>
                </details>
            )}
        </section>
    );
}
