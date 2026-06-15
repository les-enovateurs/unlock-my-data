"use client";

import statsData from "../public/data/contributors-stats.json";
import { useState, useMemo } from 'react';
import { Trophy, Edit3, Users, Calendar, Sparkles, Medal, Star, ShieldCheck } from 'lucide-react';
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

export default function ContributorsHallOfFame({ lang = "fr" }: Props) {
    const t = useMemo(() => new Translator(dict, lang), [lang]);
    const [selectedCreator, setSelectedCreator] = useState<Contributor | null>(null);
    const [selectedUpdater, setSelectedUpdater] = useState<Contributor | null>(null);
    const [selectedReviewer, setSelectedReviewer] = useState<Contributor | null>(null);

    // Single gold accent for #1, neutral slate for the rest — no multi-hue gradients.
    const podiumBar = ['bg-umd-gold-300', 'bg-umd-slate-300', 'bg-umd-slate-200'];
    const podiumHeights = ['h-48', 'h-40', 'h-36'];

    const formatDate = (dateString: string) => {
        const localeDate = lang === 'fr' ? 'fr-FR' : 'en-US';
        return new Date(dateString).toLocaleDateString(localeDate);
    };

    const getAutonomyText = (score: number, reviews?: number) => {
        if (reviews !== undefined && reviews > 0) {
            return t.t("autonomyDetails", { score: score.toString(), reviews: reviews.toString() });
        }
        return t.t("autonomyNoReviews", { score: score.toString() });
    };

    // Compute global leaderboard
    const globalLeaderboard = useMemo(() => {
        const scores = new Map<string, number>();

        const addPoints = (contributors: Contributor[] | undefined) => {
            if (!contributors) return;
            contributors.forEach(c => {
                if (c.suggestedPoints) {
                    scores.set(c.name, (scores.get(c.name) || 0) + c.suggestedPoints);
                }
            });
        };

        addPoints(stats.topCreators);
        addPoints(stats.topUpdaters);
        addPoints(stats.topReviewers);

        return Array.from(scores.entries())
            .map(([name, points]) => ({ name, points }))
            .sort((a, b) => b.points - a.points);
    }, []);

    const rankCircle = (top: boolean) => top ? "bg-umd-gold-100 text-umd-gold-600" : "bg-umd-slate-100 text-umd-slate-500";

    const renderContributorCard = (
        c: Contributor,
        index: number,
        selected: Contributor | null,
        setSelected: (c: Contributor | null) => void,
        countLabel: string,
        listLabel: string,
        topIcon: React.ReactNode,
    ) => {
        const isSelected = selected?.name === c.name;
        return (
            <button
                key={c.name}
                type="button"
                onClick={() => setSelected(isSelected ? null : c)}
                className={`umd-card umd-card-hover w-full p-6 text-left ${isSelected ? "border-umd-indigo-500 bg-umd-indigo-50" : ""}`}
            >
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${rankCircle(index < 3)}`}>
                            {index + 1}
                        </div>
                        <div>
                            <div className="font-bold text-umd-slate-900">{c.name}</div>
                            <div className="text-sm text-umd-slate-500">{c.count} {countLabel}</div>
                        </div>
                    </div>
                    {index < 3 && topIcon}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    {c.autonomyScore !== undefined && (
                        <span className="umd-chip umd-chip-info" title="Score d'autonomie basé sur la qualité des contributions">
                            <Sparkles className="h-3 w-3" aria-hidden="true" />
                            {getAutonomyText(c.autonomyScore, c.reviewsReceived)}
                        </span>
                    )}
                    {c.suggestedPoints !== undefined && (
                        <span className="umd-pill umd-pill-gold">
                            +{c.suggestedPoints} {t.t("points")}
                        </span>
                    )}
                </div>

                {isSelected && (
                    <div className="mt-4 border-t border-umd-slate-200 pt-4">
                        <div className="mb-3 text-xs font-bold uppercase tracking-widest text-umd-slate-400">{listLabel}</div>
                        <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
                            {c.companies.map((company, idx) => (
                                <div key={idx} className="flex items-center justify-between rounded bg-umd-slate-50 p-2 text-sm">
                                    <span className="font-medium">{company.name}</span>
                                    <span className="text-xs text-umd-slate-400">{formatDate(company.date)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-white text-umd-slate-900">
            {/* Hero */}
            <div className="border-b border-umd-slate-200 bg-gradient-to-b from-umd-indigo-50 to-white px-4 pb-16 pt-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl text-center">
                    <span className="umd-pill umd-pill-indigo mb-8">
                        <Trophy className="h-4 w-4" aria-hidden="true" />
                        {t.t("pageTitle")}
                    </span>

                    <h1 className="umd-h-hero mb-6">
                        {t.t("pageTitle").split(" ").map((word: string, i: number, arr: string[]) => (
                            <span key={i} className={i === arr.length - 1 ? "ml-2 text-umd-indigo-600" : "mr-2"}>{word}</span>
                        ))}
                    </h1>

                    <p className="umd-lead-text mx-auto mb-12 max-w-2xl">
                        {t.t("pageSubtitle")}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-umd-slate-600">
                        <span className="flex items-center gap-2 rounded-lg bg-umd-slate-50 px-4 py-2">
                            <Users className="h-4 w-4" aria-hidden="true" />
                            {stats.totalFiles} {t.t("totalCompanies")}
                        </span>
                        <span className="flex items-center gap-2 rounded-lg bg-umd-slate-50 px-4 py-2">
                            <Calendar className="h-4 w-4" aria-hidden="true" />
                            {t.t("updatedAt")} {formatDate(stats.generatedAt)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
                {/* Stats overview */}
                <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: Users, value: stats.totalFiles, label: t.t("totalCompaniesStat") },
                        { icon: Sparkles, value: stats.topCreators.length, label: t.t("creatorsStat") },
                        { icon: Edit3, value: stats.topUpdaters.length, label: t.t("updatersStat") },
                        { icon: ShieldCheck, value: stats.topReviewers ? stats.topReviewers.length : 0, label: t.t("reviewersStat") },
                    ].map(({ icon: Ic, value, label }, i) => (
                        <div key={i} className="umd-card flex flex-col items-center p-6 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-umd-indigo-50 text-umd-indigo-700">
                                <Ic className="h-8 w-8" aria-hidden="true" />
                            </div>
                            <div className="data text-4xl font-bold text-umd-indigo-700">{value}</div>
                            <div className="font-medium text-umd-slate-500">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Global leaderboard */}
                {globalLeaderboard.length > 0 && (
                    <div className="mb-24">
                        <h2 className="umd-heading-2 mb-12 flex items-center justify-center gap-3 text-3xl">
                            <Trophy className="h-8 w-8 text-umd-gold-500" aria-hidden="true" />
                            {t.t("globalLeaderboard")}
                        </h2>

                        <div className="mb-12 flex items-end justify-center gap-4 md:gap-8">
                            {globalLeaderboard.slice(0, 3).map((contributor, index) => {
                                const positions = [0, 1, 2];
                                const actualIndex = positions[index];
                                const displayPosition = actualIndex + 1;

                                return (
                                    <div
                                        key={contributor.name}
                                        className={`flex flex-col items-center ${index === 1 ? 'order-1 z-10' : index === 0 ? 'order-2' : 'order-3'}`}
                                    >
                                        <div className="mb-4 text-center">
                                            <div className="mb-2 text-4xl">
                                                {displayPosition === 1 ? '🥇' : displayPosition === 2 ? '🥈' : '🥉'}
                                            </div>
                                            <div className="text-lg font-bold text-umd-slate-900">{contributor.name}</div>
                                            <div className="data text-2xl font-bold text-umd-indigo-700">{contributor.points}</div>
                                            <div className="text-xs uppercase tracking-wider text-umd-slate-400">{t.t("points")}</div>
                                        </div>
                                        <div className={`w-24 md:w-40 ${podiumHeights[actualIndex]} ${podiumBar[actualIndex]} flex items-center justify-center rounded-t-2xl text-3xl font-bold text-umd-slate-900`}>
                                            #{displayPosition}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {globalLeaderboard.slice(3, 12).map((contributor, index) => (
                                <div key={contributor.name} className="umd-card flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-umd-slate-100 font-bold text-umd-slate-500">
                                            {index + 4}
                                        </div>
                                        <span className="font-bold">{contributor.name}</span>
                                    </div>
                                    <span className="umd-pill umd-pill-gold">
                                        {contributor.points} {t.t("points")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Top creators */}
                <div className="mb-24">
                    <h2 className="umd-heading-2 mb-12 flex items-center gap-3 text-3xl">
                        <Trophy className="h-8 w-8 text-umd-gold-500" aria-hidden="true" />
                        {t.t("topCreators")}
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {stats.topCreators.map((creator, index) => renderContributorCard(
                            creator, index, selectedCreator, setSelectedCreator,
                            t.t("companiesCreated"), t.t("companiesCreatedList"),
                            <Trophy className="h-5 w-5 text-umd-gold-500" aria-hidden="true" />,
                        ))}
                    </div>
                </div>

                {/* Top updaters */}
                <div className="mb-24">
                    <h2 className="umd-heading-2 mb-12 flex items-center gap-3 text-3xl">
                        <Edit3 className="h-8 w-8 text-umd-indigo-600" aria-hidden="true" />
                        {t.t("topUpdaters")}
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {stats.topUpdaters.map((updater, index) => renderContributorCard(
                            updater, index, selectedUpdater, setSelectedUpdater,
                            t.t("companiesUpdated"), t.t("companiesUpdatedList"),
                            <Medal className="h-5 w-5 text-umd-indigo-500" aria-hidden="true" />,
                        ))}
                    </div>
                </div>

                {/* Top reviewers */}
                {stats.topReviewers && stats.topReviewers.length > 0 && (
                    <div>
                        <h2 className="umd-heading-2 mb-12 flex items-center gap-3 text-3xl">
                            <ShieldCheck className="h-8 w-8 text-umd-indigo-600" aria-hidden="true" />
                            {t.t("topReviewers")}
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {stats.topReviewers.map((reviewer, index) => renderContributorCard(
                                reviewer, index, selectedReviewer, setSelectedReviewer,
                                t.t("reviewsDone"), t.t("reviewsDoneList"),
                                <Star className="h-5 w-5 fill-current text-umd-indigo-500" aria-hidden="true" />,
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-24 mb-12 overflow-hidden rounded-3xl bg-umd-indigo-900 text-white">
                    <div className="px-8 py-16 text-center md:py-20">
                        <h2 className="umd-heading-2 mb-6 text-white">{t.t("wantToSeeYourName")}</h2>
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 md:text-xl">
                            {t.t("everyContributionCounts")}
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link href={t.t("addServiceLink")} className="umd-btn umd-btn-lg bg-white text-umd-indigo-800 hover:bg-umd-indigo-50">
                                <Sparkles className="h-5 w-5 text-umd-gold-500" aria-hidden="true" />
                                {t.t("addService")}
                            </Link>
                            <Link href={t.t("howToContributeLink")} className="umd-btn umd-btn-lg border-white text-white hover:bg-white/10">
                                {t.t("howToContribute")}
                            </Link>
                        </div>
                    </div>
                </div>

                {lang === 'en' && (
                    <div className="mt-16 pb-8 text-center text-sm text-umd-slate-400">
                        <p>{t.t("thankYou")}</p>
                        <p className="mt-2">{t.t("toContributeMore")} <Link href={t.t("howToContributeLink")} className="font-semibold text-umd-indigo-700 underline underline-offset-4" prefetch={false}>{t.t("readEverythingNeeded")}</Link></p>
                    </div>
                )}
            </div>
        </div>
    );
}
