import type { FicheBreach } from "./FicheAvancee";

type HibpBreach = { title?: string; name?: string; breachDate: string; pwnCount?: number; description?: string; dataClasses?: string[] };
type BlfBreach = {
    date: string; processor?: string | null; volume?: string | null; sensitive?: boolean; data_types?: string[];
    description?: string | null; links?: (string | { text?: string; href: string })[];
    source?: string | null; verified_by_manual?: boolean;
};
type ContributedLeak = {
    date: string; type?: string; type_en?: string; proof_url?: string; media_link?: string;
    contributor?: string; replaces_breach_date?: string;
};

const day = (iso: string) => (iso || "").slice(0, 10);

/**
 * One list from the three breach sources: Have I Been Pwned, Bonjour la Fuite (scraped into
 * `data_breaches`) and contributor reports (`leaks`). A contributor report supersedes the
 * Bonjour la Fuite entry it was written from, either flagged on that entry or named by date.
 */
export function mergeBreaches(
    serviceName: string,
    lang: string,
    hibp: HibpBreach[],
    blf: BlfBreach[] | null | undefined,
    leaks: ContributedLeak[] | null | undefined,
    stripHtml: (s: string) => string,
): FicheBreach[] {
    const replaced = new Set((leaks ?? []).map((l) => l.replaces_breach_date).filter(Boolean).map((d) => day(d!)));
    const fromHibp = hibp.map((b): FicheBreach => ({
        source: "hibp",
        name: b.title || b.name || serviceName,
        date: b.breachDate,
        count: b.pwnCount || 0,
        kind: /scrap/i.test(`${b.title} ${b.name} ${b.description}`) ? "scrape" : "intrusion",
        classes: b.dataClasses || [],
        desc: b.description ? stripHtml(b.description) : "",
        links: [],
    }));
    const fromBlf = (blf ?? [])
        .filter((b) => !b.verified_by_manual && !replaced.has(day(b.date)))
        .map((b): FicheBreach => ({
            source: "blf",
            name: b.processor || serviceName,
            date: day(b.date),
            volume: b.volume || undefined,
            sensitive: b.sensitive || undefined,
            classes: b.data_types || [],
            desc: b.description || "",
            links: (b.links || []).map((l) => (typeof l === "string" ? l : l.href)),
        }));
    const fromLeaks = (leaks ?? []).map((l): FicheBreach => ({
        source: "contributor",
        name: serviceName,
        date: day(l.date),
        classes: [],
        desc: (lang === "fr" ? l.type : l.type_en || l.type) || "",
        links: [l.media_link, l.proof_url].filter((u): u is string => Boolean(u)),
        contributor: l.contributor,
    }));
    return [...fromHibp, ...fromBlf, ...fromLeaks].sort((a, b) => (a.date < b.date ? 1 : -1));
}
