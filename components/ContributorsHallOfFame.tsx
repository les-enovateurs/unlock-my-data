"use client";

import statsData from "../public/data/contributors-stats.json";
import { useState, useMemo, useEffect } from 'react';
import {
    Trophy, Users, Crown, Sparkles, PenLine, ShieldCheck,
    FilePlus2, Target,
} from 'lucide-react';
import Link from "next/link";
import Translator from "./tools/t";
import dict from "../i18n/Contributors.json";

interface CompanyDate {
    name: string;
    date: string;
}

interface Contributor {
    name: string;
    count: number;
    companies: CompanyDate[];
    autonomyScore?: number;
    reviewsReceived?: number;
    suggestedPoints?: number;
}

interface StatsData {
    totalFiles: number;
    generatedAt: string;
    totalContributions?: number;
    uniqueContributors?: number;
    topCreators: Contributor[];
    topUpdaters: Contributor[];
    topReviewers?: Contributor[];
}

const stats = statsData as StatsData;

interface Props {
    lang?: string;
}

// Initials avatar — mirrors ContribAvatar from the UI kit (indigo tokens, no animation).
function ContribAvatar({ name, size = 38 }: { name: string; size?: number }) {
    const init =
        name.replace(/[^\p{L}\s]/gu, "").trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
    return (
        <span
            className="inline-flex flex-shrink-0 items-center justify-center rounded-full border border-umd-indigo-200 bg-umd-indigo-50 font-bold text-umd-indigo-800"
            style={{ width: size, height: size, fontSize: size * 0.38, fontFamily: "var(--font-display)" }}
        >
            {init}
        </span>
    );
}

export default function ContributorsHallOfFame({ lang = "fr" }: Props) {
    const t = useMemo(() => new Translator(dict, lang), [lang]);
    const [openFamily, setOpenFamily] = useState<string | null>(null);

    // Catalogues that let each published entry chip link somewhere — a live
    // fiche if published, otherwise the in-review page (draft) or the open PR.
    const [services, setServices] = useState<{ name: string; slug: string }[]>([]);
    const [reviews, setReviews] = useState<{ name: string; slug: string }[]>([]);
    const [pending, setPending] = useState<{ name: string; pr_url: string }[]>([]);
    useEffect(() => {
        const grab = <T,>(url: string, fallback: T): Promise<T> =>
            fetch(url).then(r => (r.ok ? r.json() : fallback)).catch(() => fallback);
        grab<{ name: string; slug: string }[]>('/data/services.json', []).then(setServices);
        grab<{ name: string; slug: string }[]>('/data/reviews.json', []).then(setReviews);
        grab<{ pending_apps?: { name: string; pr_url: string }[] }>('/data/pending-reviews.json', {})
            .then(d => setPending(d.pending_apps || []));
    }, []);

    const listAppPath = lang === 'fr' ? '/liste-applications' : '/list-app';
    const reviewPath = lang === 'fr' ? '/contribuer/fiches-a-revoir' : '/contribute/forms-to-review';
    const normalize = (name: string) =>
        name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
    const matchBy = <T extends { name: string }>(list: T[], name: string): T | undefined => {
        const n = normalize(name);
        return list.find(s => {
            const sn = normalize(s.name);
            return sn === n || sn.includes(n) || n.includes(sn);
        });
    };
    // Resolve a chip target: published fiche → in-review page → open PR → none.
    const linkFor = (name: string): { href: string; external: boolean } | null => {
        const published = matchBy(services, name);
        if (published) return { href: `${listAppPath}/${published.slug}`, external: false };
        const review = matchBy(reviews, name);
        if (review) return { href: `${reviewPath}#review-${review.slug}`, external: false };
        const pr = matchBy(pending, name);
        if (pr?.pr_url) return { href: pr.pr_url, external: true };
        return null;
    };

    const formatDate = (dateString: string) => {
        const localeDate = lang === 'fr' ? 'fr-FR' : 'en-US';
        return new Date(dateString).toLocaleDateString(localeDate);
    };

    // Global leaderboard — sum of suggested points across all roles, plus a
    // contribution-count detail line for each contributor.
    const leaderboard = useMemo(() => {
        const points = new Map<string, number>();
        const counts = new Map<string, number>();

        const add = (contributors: Contributor[] | undefined) => {
            if (!contributors) return;
            contributors.forEach(c => {
                if (c.suggestedPoints) points.set(c.name, (points.get(c.name) || 0) + c.suggestedPoints);
                counts.set(c.name, (counts.get(c.name) || 0) + c.count);
            });
        };
        add(stats.topCreators);
        add(stats.topUpdaters);
        add(stats.topReviewers);

        return Array.from(points.entries())
            .map(([name, pts]) => ({ name, points: pts, count: counts.get(name) || 0 }))
            .sort((a, b) => b.points - a.points);
    }, []);

    // Latest entries — flatten every created company, newest first.
    const recent = useMemo(() => {
        return stats.topCreators
            .flatMap(c => c.companies.map(co => ({ service: co.name, by: c.name, date: co.date })))
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .slice(0, 14);
    }, []);

    const families = [
        {
            key: "creators", Icon: Sparkles, title: t.t("familyCreators"), pts: t.t("familyCreatorsPts"),
            desc: t.t("familyCreatorsDesc"), unit: t.t("companiesCreated"), list: stats.topCreators,
        },
        {
            key: "updaters", Icon: PenLine, title: t.t("familyUpdaters"), pts: t.t("familyUpdatersPts"),
            desc: t.t("familyUpdatersDesc"), unit: t.t("companiesUpdated"), list: stats.topUpdaters,
        },
        {
            key: "reviewers", Icon: ShieldCheck, title: t.t("familyReviewers"), pts: t.t("familyReviewersPts"),
            desc: t.t("familyReviewersDesc"), unit: t.t("reviewsDone"), list: stats.topReviewers || [],
        },
    ];

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3, 12);
    const maxPoints = top3[0]?.points || 1;
    const nextRank = leaderboard.length + 1;

    // Podium slot order: 2nd · 1st · 3rd, with the kit's bar heights.
    const podiumSlots = top3.length >= 3 ? [
        { c: top3[1], rank: 2, h: 102, bar: "bg-umd-slate-200 text-umd-indigo-900" },
        { c: top3[0], rank: 1, h: 148, bar: "bg-umd-indigo-800 text-white" },
        { c: top3[2], rank: 3, h: 76, bar: "bg-umd-indigo-50 text-umd-indigo-800" },
    ] : top3.map((c, i) => ({ c, rank: i + 1, h: 148 - i * 36, bar: "bg-umd-indigo-100 text-umd-indigo-900" }));

    return (
        <div className="min-h-screen bg-white text-umd-slate-900">
            {/* ---- Hero ---- */}
            <section className="border-b border-umd-slate-200 bg-gradient-to-b from-umd-indigo-50 to-white">
                <div className="mx-auto max-w-5xl px-6 pb-14 pt-16 text-center">
                    <span className="umd-pill umd-pill-indigo mb-5">
                        <Users className="h-4 w-4" aria-hidden="true" />
                        {t.t("communityPill")}
                    </span>
                    <h1 className="umd-h-hero mx-auto mb-4 max-w-3xl">
                        {t.t("heroTitle", {
                            fiches: stats.totalFiles.toString(),
                            contributeurs: (stats.uniqueContributors ?? leaderboard.length).toString(),
                        })}{" "}
                        <span className="text-umd-indigo-600">{t.t("heroAndYou")}</span>
                    </h1>
                    <p className="umd-lead-text mx-auto mb-7 max-w-xl">{t.t("heroLead")}</p>

                    <div className="mb-11 flex flex-wrap justify-center gap-3.5">
                        <a href="#contrib-cta" className="umd-btn umd-btn-primary umd-btn-lg">
                            <PenLine className="h-4 w-4" aria-hidden="true" />
                            {t.t("startContributing")}
                        </a>
                        <a href="#classement" className="umd-btn umd-btn-outline umd-btn-lg">
                            <Trophy className="h-4 w-4" aria-hidden="true" />
                            {t.t("seeLeaderboard")}
                        </a>
                    </div>

                    <div className="flex flex-wrap justify-center">
                        {[
                            [stats.totalFiles, t.t("statAnalysed")],
                            [stats.totalContributions ?? stats.totalFiles, t.t("statContributions")],
                            [stats.uniqueContributors ?? leaderboard.length, t.t("statContributors")],
                            ["100 %", t.t("statOpenSource")],
                        ].map(([value, label], i) => (
                            <div
                                key={label as string}
                                className={`px-7 text-center ${i ? "border-l border-umd-slate-200" : ""}`}
                            >
                                <div className="data text-4xl font-bold leading-none text-umd-indigo-800">{value}</div>
                                <div className="mt-2 text-[13px] text-umd-slate-600">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---- Podium / leaderboard ---- */}
            {leaderboard.length > 0 && (
                <section id="classement" className="px-6 py-16">
                    <div className="mx-auto max-w-5xl">
                        <p className="umd-eyebrow mb-2 text-center">{t.t("season")}</p>
                        <h2 className="umd-heading-2 mb-2 text-center">{t.t("leaderboardHeading")}</h2>
                        <p className="mx-auto mb-11 max-w-xl text-center text-umd-slate-500">{t.t("baremeNote")}</p>

                        <div className="flex items-end justify-center gap-4 md:gap-8">
                            {podiumSlots.map(s => (
                                <div key={s.rank} className="flex w-24 flex-col items-center justify-end gap-3 text-center md:w-40">
                                    <div>
                                        {s.rank === 1 && <Crown className="mx-auto h-6 w-6 text-umd-gold-500" aria-hidden="true" />}
                                        <div className="mb-2 mt-1.5 flex justify-center"><ContribAvatar name={s.c.name} size={46} /></div>
                                        <div className="text-[15px] font-bold text-umd-slate-900">{s.c.name}</div>
                                        <div className="data mt-1.5 text-2xl font-bold text-umd-indigo-700">
                                            {s.c.points} <span className="text-xs font-medium text-umd-slate-400">{t.t("points")}</span>
                                        </div>
                                    </div>
                                    <div
                                        className={`flex w-full items-center justify-center rounded-t-2xl text-3xl font-bold ${s.bar}`}
                                        style={{ height: s.h }}
                                    >
                                        {s.rank}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-2">
                            {rest.map((c, i) => (
                                <div key={c.name} className="umd-card flex items-center gap-4 p-3">
                                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-umd-slate-100 text-sm font-bold text-umd-slate-500">
                                        {i + 4}
                                    </span>
                                    <ContribAvatar name={c.name} size={32} />
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[15px] font-bold">{c.name}</span>
                                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-umd-slate-100">
                                            <span
                                                className="block h-full rounded-full bg-umd-indigo-400"
                                                style={{ width: `${Math.round((c.points / maxPoints) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="data flex-shrink-0 text-[15px] font-bold text-umd-indigo-700">
                                        {c.points}<span className="text-[11px] font-medium text-umd-slate-400"> {t.t("points")}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ---- Three families ---- */}
            <section className="border-y border-umd-slate-200 bg-umd-slate-50 px-6 py-16">
                <div className="mx-auto max-w-5xl">
                    <h2 className="umd-heading-2 mb-2 text-center">{t.t("familiesTitle")}</h2>
                    <p className="mx-auto mb-9 max-w-xl text-center text-umd-slate-500">{t.t("familiesSubtitle")}</p>
                    <div className="grid gap-4 md:grid-cols-3">
                        {families.map(f => {
                            const isOpen = openFamily === f.key;
                            const visible = isOpen ? f.list : f.list.slice(0, 5);
                            return (
                                <div key={f.key} className="umd-card flex flex-col gap-3.5 p-5">
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-[var(--umd-radius-md)] bg-umd-indigo-50 text-umd-indigo-700">
                                            <f.Icon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        <h3 className="flex-1 text-[16.5px] font-bold">{f.title}</h3>
                                        <span className="umd-pill umd-pill-gold text-xs">{f.pts}</span>
                                    </div>
                                    <p className="m-0 text-[13.5px] leading-relaxed text-umd-slate-500">{f.desc}</p>
                                    <ul className="flex flex-col gap-1.5 border-t border-umd-slate-100 pt-3">
                                        {visible.map((p, i) => (
                                            <li key={p.name} className="flex items-center gap-2.5 text-[13.5px]">
                                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-umd-slate-100 text-[11.5px] font-bold text-umd-slate-500">
                                                    {i + 1}
                                                </span>
                                                <span className="min-w-0 flex-1 truncate font-semibold text-umd-slate-900" title={p.name}>{p.name}</span>
                                                {p.autonomyScore !== undefined && p.autonomyScore >= 95 && (
                                                    <span className="umd-chip umd-chip-safe flex-shrink-0 px-2 py-0.5 text-[11px]">{t.t("autonomous")}</span>
                                                )}
                                                <span className="data flex-shrink-0 text-[13px] text-umd-slate-600" title={`${p.count} ${f.unit}`}>{p.count}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {f.list.length > 5 && (
                                        <button
                                            type="button"
                                            onClick={() => setOpenFamily(isOpen ? null : f.key)}
                                            className="umd-btn umd-btn-ghost umd-btn-sm self-start"
                                        >
                                            {isOpen ? "−" : "+"} {f.list.length - 5}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ---- Recent ---- */}
            <section className="px-6 py-14">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4">
                        <h2 className="umd-heading-3">{t.t("recentTitle")}</h2>
                        <span className="data text-[13px] text-umd-slate-400">{t.t("updatedAt")} {formatDate(stats.generatedAt)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {recent.map(r => {
                            const link = linkFor(r.service);
                            const cls = "umd-card umd-card-hover inline-flex items-center gap-2.5 rounded-full px-3.5 py-2 shadow-none";
                            const inner = (
                                <>
                                    <span className="text-[13.5px] font-bold">{r.service}</span>
                                    <span className="text-xs text-umd-slate-400">{t.t("recentBy")} {r.by} · {formatDate(r.date)}</span>
                                </>
                            );
                            if (!link) {
                                return (
                                    <span key={r.service + r.date} className="umd-card inline-flex items-center gap-2.5 rounded-full px-3.5 py-2 shadow-none">
                                        {inner}
                                    </span>
                                );
                            }
                            return link.external ? (
                                <a key={r.service + r.date} href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
                                    {inner}
                                </a>
                            ) : (
                                <Link key={r.service + r.date} href={link.href} className={cls}>
                                    {inner}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ---- CTA ---- */}
            <section id="contrib-cta" className="px-6 pb-20 pt-2">
                <div className="mx-auto max-w-5xl">
                    <div className="overflow-hidden rounded-[var(--umd-radius-xl)] bg-umd-indigo-950 px-8 py-12 text-white md:px-11">
                        <div className="grid items-center gap-12 md:grid-cols-[1.25fr_1fr]">
                            <div>
                                <span className="mb-4 inline-flex items-center gap-2 border-l-[3px] border-umd-gold-400 pl-3 text-[11.5px] font-bold uppercase tracking-[0.08em] text-umd-gold-400">
                                    {t.t("ctaEyebrow")}
                                </span>
                                <h2 className="umd-heading-2 mb-4 text-white">
                                    {t.t("ctaTitlePre")} <span className="text-umd-gold-400">{t.t("ctaTitleHighlight")}</span>
                                </h2>
                                <p className="mb-6 text-[17px] leading-relaxed text-white/70">{t.t("ctaText")}</p>
                                <div className="flex flex-wrap gap-3">
                                    <Link href={t.t("addServiceLink")} className="umd-btn umd-btn-lg bg-white text-umd-indigo-900 hover:bg-umd-indigo-50">
                                        <FilePlus2 className="h-5 w-5" aria-hidden="true" />
                                        {t.t("ctaCreateFirst")}
                                    </Link>
                                    <Link href={t.t("howToContributeLink")} className="umd-btn umd-btn-lg border-white/35 bg-transparent text-white hover:bg-white/10">
                                        <Target className="h-5 w-5" aria-hidden="true" />
                                        {t.t("howToContribute")}
                                    </Link>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3.5 rounded-[var(--umd-radius-lg)] border border-white/10 bg-white/5 px-4 py-4">
                                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 font-bold text-white">
                                        {nextRank - 1}
                                    </span>
                                    <div className="flex-1">
                                        <div className="text-[14.5px] font-bold">{leaderboard[leaderboard.length - 1]?.name}</div>
                                        <div className="text-[12.5px] text-white/70">{leaderboard[leaderboard.length - 1]?.count} {t.t("companies")}</div>
                                    </div>
                                    <span className="data font-bold">{leaderboard[leaderboard.length - 1]?.points} {t.t("points")}</span>
                                </div>
                                <div className="flex items-center gap-3.5 rounded-[var(--umd-radius-lg)] border-[1.5px] border-dashed border-white/40 px-4 py-4">
                                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-umd-gold-400 font-bold text-umd-indigo-950">
                                        {nextRank}
                                    </span>
                                    <div className="flex-1">
                                        <div className="text-[14.5px] font-bold text-umd-gold-400">{t.t("ctaYourNameHere")}</div>
                                        <div className="text-[12.5px] text-white/70">{t.t("ctaNextRankDetail")}</div>
                                    </div>
                                    <span className="data font-bold text-umd-gold-400">+10 {t.t("points")}</span>
                                </div>
                                <p className="mt-1.5 px-0.5 text-[12.5px] leading-relaxed text-white/70">{t.t("ctaCertificate")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {lang === 'en' && (
                <div className="mx-auto max-w-5xl px-6 pb-10 text-center text-sm text-umd-slate-400">
                    <p>{t.t("thankYou")}</p>
                    <p className="mt-2">
                        {t.t("toContributeMore")}{" "}
                        <Link href={t.t("howToContributeLink")} className="font-semibold text-umd-indigo-700 underline underline-offset-4" prefetch={false}>
                            {t.t("readEverythingNeeded")}
                        </Link>
                    </p>
                </div>
            )}
        </div>
    );
}
