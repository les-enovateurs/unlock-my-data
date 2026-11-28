import Link from "next/link";
import Image from "next/image";
import services from "@/public/data/services.json";
import publishedQuotes from "@/public/data/policy-analysis/_quotes.json";
import publishedHistory from "@/public/data/policy-analysis/_history.json";
import { PUBLISHED_RELEASES } from "@/data/pressReleases";
import { getEntrepriseData } from "@/components/company/manual-components/data";
import { ficheHref } from "@/components/company/ficheTabs";
import type { KeyQuoteEntry } from "@/components/company/KeyQuotes";
import type { PolicyChange } from "@/components/company/PolicyHistory";

type Kind = "fiches" | "quotes" | "policy" | "press";
type Lang = "fr" | "en";
type EntryLink = { label: string; href: string; logo?: string };
type Entry = { date: string; kind: Kind; links: EntryLink[] };

const T = {
    fr: {
        title: "Récemment sur Unlock My Data",
        fiches: "Nouvelles fiches",
        quotes: "Citations clés",
        policy: "Politique modifiée",
        press: "Communiqué",
        more: (n: number) => `+${n}`,
        catalog: "/liste-applications/",
    },
    en: {
        title: "Recently on Unlock My Data",
        fiches: "New records",
        quotes: "Key quotes",
        policy: "Policy changed",
        press: "Press release",
        more: (n: number) => `+${n}`,
        catalog: "/list-app/",
    },
};
const MAX_ROWS = 5;
const MAX_LINKS = 4;
// An "activity" block whose newest line is months old says the opposite of what it is for.
const STALE_AFTER_DAYS = 60;

/** Services added or quoted the same day share one row: a batch import is one event, not six. */
function groupByDay(kind: Kind, items: (EntryLink & { date: string })[]): Entry[] {
    const days = new Map<string, Entry>();
    for (const { date, ...link } of items) {
        const day = date.slice(0, 10);
        const entry = days.get(day) ?? { date: day, kind, links: [] };
        entry.links.push(link);
        days.set(day, entry);
    }
    return [...days.values()];
}

async function recentEntries(lang: Lang): Promise<Entry[]> {
    const fiches = await Promise.all(services.map(async ({ slug }) => ({
        date: (await getEntrepriseData(slug))?.created_at as string | undefined,
        ...serviceLink(lang, slug),
    })));
    const quotes = Object.entries(publishedQuotes as Record<string, KeyQuoteEntry>).map(([slug, q]) => ({
        date: q.created_at,
        ...serviceLink(lang, slug, "donnees"),
    }));
    const policy = Object.entries(publishedHistory as Record<string, PolicyChange[]>).flatMap(([slug, changes]) =>
        changes.map((c) => ({ date: c.detected_at.slice(0, 10), kind: "policy" as const, links: [serviceLink(lang, slug, "donnees")] })));
    const press = PUBLISHED_RELEASES.map((r) => ({
        date: r.iso, kind: "press" as const, links: [{ label: r[lang].title, href: `/${lang === "fr" ? "presse" : "press"}/${r.slug}/` }],
    }));
    const dated = <X extends { date?: string }>(xs: X[]) => xs.filter((x): x is X & { date: string } => Boolean(x.date));
    const entries = [...groupByDay("fiches", dated(fiches)), ...groupByDay("quotes", dated(quotes)), ...policy, ...press]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, MAX_ROWS);
    const ageDays = entries.length ? (Date.now() - Date.parse(entries[0].date)) / 86_400_000 : Infinity;
    return ageDays > STALE_AFTER_DAYS ? [] : entries;
}

function serviceLink(lang: Lang, slug: string, tab?: "donnees"): EntryLink {
    const s = services.find((x) => x.slug === slug);
    return { label: s?.name.trim() ?? slug, href: ficheHref(lang, slug, tab), logo: s?.logo || undefined };
}

export default async function HomeRecentActivity({ lang }: { lang: string }) {
    const l: Lang = lang === "fr" ? "fr" : "en";
    const entries = await recentEntries(l);
    if (!entries.length) return null;
    const fmt = new Intl.DateTimeFormat(l === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "short", year: "numeric" });

    return (
        <section aria-labelledby="recent-heading" className="py-14 md:py-16 border-t border-umd-slate-200" style={{ background: "var(--slate-50)" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 id="recent-heading" className="umd-heading-2 mb-6">{T[l].title}</h2>
                <ol className="list-none p-0 m-0">
                    {entries.map((e) => {
                        const extra = e.links.length - MAX_LINKS;
                        return (
                            <li key={`${e.kind}-${e.date}-${e.links[0].href}`} className="umd-home-recent">
                                <time dateTime={e.date} className="text-sm text-umd-slate-600 tabular-nums">{fmt.format(new Date(e.date))}</time>
                                <span className="font-bold text-umd-slate-900">{T[l][e.kind]}</span>
                                {e.kind === "press" ? (
                                    <Link href={e.links[0].href} prefetch={false} className="font-semibold underline underline-offset-2" style={{ color: "var(--indigo-700)" }}>
                                        {e.links[0].label}
                                    </Link>
                                ) : (
                                    <ul className="list-none p-0 m-0 flex flex-wrap gap-2">
                                        {e.links.slice(0, MAX_LINKS).map((link) => (
                                            <li key={link.href}><ServiceChip link={link} /></li>
                                        ))}
                                        {extra > 0 && (
                                            <li><ServiceChip link={{ label: T[l].more(extra), href: T[l].catalog }} /></li>
                                        )}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}

function ServiceChip({ link }: { link: EntryLink }) {
    return (
        <Link href={link.href} prefetch={false} className="umd-home-chip">
            {link.logo && <Image src={link.logo} alt="" width={22} height={22} unoptimized loading="lazy" />}
            {link.label}
        </Link>
    );
}
