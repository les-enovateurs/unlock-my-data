"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Target,
    Heart,
    Activity,
    Users,
    ShoppingBag,
    ShoppingCart,
    Play,
    Wallet,
    Car,
    Utensils,
    Gamepad2,
    Brain,
    Dumbbell,
    Camera,
    GraduationCap,
    Cloud,
    BookOpen,
    Search,
    HeartHandshake,
    Plane,
    Newspaper,
    MessageCircle,
    Package,
    Recycle,
    Landmark,
    Music,
    ChefHat,
    CreditCard,
    Flame,
    Check,
    CircleDashed,
    CheckCircle2,
    Plus,
    X,
    Clock,
    Compass,
    ArrowRight,
    FilePlus2
} from 'lucide-react';

interface App {
    name: string;
    slug: string;
}

interface Mission {
    id: string;
    category: string;
    category_en: string;
    icon: string;
    color: string;
    description: string;
    description_en: string;
    priority: string;
    apps: App[];
}

interface Service {
    name: string;
    slug: string;
}

interface PendingApp {
    name: string;
    normalized: string;
    pr_number: number;
    pr_url: string;
}

interface MissionsComponentProps {
    lang: 'fr' | 'en';
}

const translations = {
    fr: {
        missions: 'Missions',
        heroTitle: 'Les services qui attendent leur fiche',
        heroLeadA: 'La communauté a identifié',
        heroLeadB: 'applications prioritaires, classées par sensibilité des données. Ouvrez une catégorie pour voir les apps à faire et en adopter une.',
        analyzed: 'analysées',
        filterAll: 'Toutes',
        filterHigh: 'Prioritaires',
        filterMedium: 'Moyennes',
        filterLow: 'Faibles',
        priorityHigh: 'Prioritaire',
        priorityMedium: 'Moyenne',
        priorityLow: 'Faible',
        toDo: 'à faire',
        complete: 'Complète',
        viewApps: 'Voir les apps',
        drawerTodo: 'À faire',
        drawerDone: 'Déjà analysées',
        drawerAllDone: '🎉 Toutes les apps de cette catégorie sont analysées.',
        createSheet: 'Créer la fiche',
        viewSheet: 'Voir',
        reviewSheet: 'Relire',
        drawerFootNote: 'La première fiche est relue avec vous — aucune compétence technique requise.',
        howItWorks: 'Comment ça marche',
        close: 'Fermer',
        ctaNote: 'Un service vous tient à cœur ? Lancez-vous — la première fiche est relue avec vous.',
        createSheetBtn: 'Créer une fiche',
        newFormPath: '/contribuer/nouvelle-fiche',
        listAppPath: '/liste-applications',
        contributePath: '/contribuer'
    },
    en: {
        missions: 'Missions',
        heroTitle: 'Services waiting for their report',
        heroLeadA: 'The community has identified',
        heroLeadB: 'priority apps, ranked by data sensitivity. Open a category to see the apps to do and adopt one.',
        analyzed: 'analyzed',
        filterAll: 'All',
        filterHigh: 'Priority',
        filterMedium: 'Medium',
        filterLow: 'Low',
        priorityHigh: 'Priority',
        priorityMedium: 'Medium',
        priorityLow: 'Low',
        toDo: 'to do',
        complete: 'Complete',
        viewApps: 'View apps',
        drawerTodo: 'To do',
        drawerDone: 'Already analyzed',
        drawerAllDone: '🎉 All apps in this category are analyzed.',
        createSheet: 'Create report',
        viewSheet: 'View',
        reviewSheet: 'Review',
        drawerFootNote: 'Your first report is reviewed with you — no technical skills required.',
        howItWorks: 'How it works',
        close: 'Close',
        ctaNote: 'A service you care about? Get started — your first report is reviewed with you.',
        createSheetBtn: 'Create a report',
        newFormPath: '/contribute/new-form',
        listAppPath: '/list-app',
        contributePath: '/contribute'
    }
};

const iconMap: { [key: string]: React.ElementType } = {
    Heart,
    Activity,
    Users,
    ShoppingBag,
    ShoppingCart,
    Play,
    Wallet,
    Car,
    Utensils,
    Gamepad2,
    Brain,
    Dumbbell,
    Camera,
    GraduationCap,
    Cloud,
    BookOpen,
    Search,
    HeartHandshake,
    Plane,
    Newspaper,
    MessageCircle,
    Package,
    Recycle,
    Landmark,
    Music,
    ChefHat,
    CreditCard
};

const PRIO_ORDER = ['all', 'high', 'medium', 'low'] as const;

function Bar({ pct, className = '' }: { pct: number; className?: string }) {
    return (
        <div className={`h-2 overflow-hidden rounded-full bg-umd-slate-200 ${className}`}>
            <div className="h-full rounded-full bg-umd-indigo-500" style={{ width: `${pct}%` }} />
        </div>
    );
}

export default function MissionsComponent({ lang }: MissionsComponentProps) {
    const t = translations[lang];
    const [missions, setMissions] = useState<Mission[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [pendingApps, setPendingApps] = useState<PendingApp[]>([]);
    const [internalReviews, setInternalReviews] = useState<any[]>([]);
    const [prio, setPrio] = useState<string>('all');
    const [openId, setOpenId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const safeFetch = async (url: string, fallback: any) => {
                    try {
                        const res = await fetch(url);
                        if (!res.ok) return fallback;
                        const text = await res.text();
                        return text ? JSON.parse(text) : fallback;
                    } catch (e) {
                        console.error(`Failed to fetch or parse ${url}:`, e);
                        return fallback;
                    }
                };

                const [missionsData, servicesData, pendingData, reviewsData] = await Promise.all([
                    safeFetch('/data/missions.json', []),
                    safeFetch('/data/services.json', []),
                    safeFetch('/data/pending-reviews.json', { pending_apps: [] }),
                    safeFetch('/data/reviews.json', [])
                ]);

                setMissions(missionsData);
                setServices(servicesData);
                setPendingApps(pendingData?.pending_apps || []);
                setInternalReviews(reviewsData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const normalizeServiceName = (name: string): string => {
        return name.toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]/g, '');
    };

    const isServiceDone = (appName: string): boolean => {
        const normalizedAppName = normalizeServiceName(appName);
        return services.some(service => {
            const normalizedServiceName = normalizeServiceName(service.name);
            return normalizedServiceName.includes(normalizedAppName) ||
                normalizedAppName.includes(normalizedServiceName);
        });
    };

    const getServiceSlug = (appName: string): string | null => {
        const normalizedAppName = normalizeServiceName(appName);
        const found = services.find(service => {
            const normalizedServiceName = normalizeServiceName(service.name);
            return normalizedServiceName.includes(normalizedAppName) ||
                normalizedAppName.includes(normalizedServiceName);
        });
        return found?.slug || null;
    };

    const getPendingPR = (appName: string): PendingApp | null => {
        const normalizedAppName = normalizeServiceName(appName);
        return pendingApps.find(pending => {
            return pending.normalized.includes(normalizedAppName) ||
                normalizedAppName.includes(pending.normalized);
        }) || null;
    };

    const isInternalReview = (appName: string): boolean => {
        const normalizedAppName = normalizeServiceName(appName);
        return internalReviews.some(review => {
            const normalizedReviewName = normalizeServiceName(review.name);
            return normalizedReviewName.includes(normalizedAppName) ||
                normalizedAppName.includes(normalizedReviewName);
        });
    };

    const getInternalReviewSlug = (appName: string): string | null => {
        const normalizedAppName = normalizeServiceName(appName);
        const review = internalReviews.find(review => {
            const normalizedReviewName = normalizeServiceName(review.name);
            return normalizedReviewName.includes(normalizedAppName) ||
                normalizedAppName.includes(normalizedReviewName);
        });
        return review?.slug || null;
    };

    const getCategoryStats = (mission: Mission) => {
        const done = mission.apps.filter(app => isServiceDone(app.name)).length;
        const total = mission.apps.length;
        const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
        return { done, total, percentage };
    };

    const getCategoryName = (mission: Mission) => lang === 'fr' ? mission.category : mission.category_en;
    const getCategoryDescription = (mission: Mission) => lang === 'fr' ? mission.description : mission.description_en;

    const PriorityBadge = ({ priority }: { priority: string }) => {
        if (priority === 'high') {
            return (
                <span className="umd-chip umd-chip-danger px-[10px] py-[3px] text-[11px]">
                    <Flame className="h-3 w-3" /> {t.priorityHigh}
                </span>
            );
        }
        if (priority === 'medium') {
            return <span className="umd-chip umd-chip-warn px-[10px] py-[3px] text-[11px]">{t.priorityMedium}</span>;
        }
        return <span className="umd-chip umd-chip-neutral px-[10px] py-[3px] text-[11px]">{t.priorityLow}</span>;
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <Target className="h-10 w-10 animate-pulse text-umd-indigo-500" />
            </div>
        );
    }

    const totalApps = missions.reduce((s, m) => s + m.apps.length, 0);
    const totalDone = missions.reduce((s, m) => s + getCategoryStats(m).done, 0);
    const totalPct = totalApps > 0 ? Math.round((totalDone / totalApps) * 100) : 0;

    const list = prio === 'all' ? missions : missions.filter(m => m.priority === prio);
    const openM = missions.find(m => m.id === openId) || null;

    const prioCount = (p: string) => p === 'all' ? missions.length : missions.filter(m => m.priority === p).length;
    const prioLabel = (p: string) =>
        p === 'all' ? t.filterAll : p === 'high' ? t.filterHigh : p === 'medium' ? t.filterMedium : t.filterLow;

    return (
        <div className="bg-white text-umd-slate-900">
            {/* Hero */}
            <section className="border-b border-umd-slate-200 bg-gradient-to-b from-umd-indigo-50 to-white">
                <div className="mx-auto max-w-6xl px-6 pb-11 pt-[52px]">
                    <span className="umd-pill umd-pill-gold mb-[18px]">
                        <Target className="h-4 w-4" aria-hidden="true" />
                        {t.missions}
                    </span>
                    <h1 className="umd-heading-1 mb-[14px] max-w-[720px]">{t.heroTitle}</h1>
                    <p className="umd-lead-text mb-[22px] max-w-[640px]">
                        {t.heroLeadA} {totalApps} {t.heroLeadB}
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                        <Bar pct={totalPct} className="w-[260px]" />
                        <span className="umd-data text-[14px] text-umd-slate-600">
                            <strong className="text-umd-indigo-800">{totalDone}</strong> / {totalApps} {t.analyzed}
                        </span>
                    </div>
                </div>
            </section>

            {/* Filters + grid */}
            <section className="pb-[72px] pt-9">
                <div className="mx-auto max-w-6xl px-6">
                    {/* Priority filters */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {PRIO_ORDER.map(p => (
                            <button
                                key={p}
                                onClick={() => setPrio(p)}
                                className={`umd-btn umd-btn-sm ${prio === p
                                    ? 'border-umd-indigo-800 bg-umd-indigo-800 text-white'
                                    : 'border-umd-slate-200 bg-white text-umd-slate-600'
                                    }`}
                            >
                                {prioLabel(p)}
                                <span className="umd-data text-[11px] opacity-75">{prioCount(p)}</span>
                            </button>
                        ))}
                    </div>

                    {/* Category cards */}
                    <div className="grid grid-cols-3 gap-[14px] max-md:grid-cols-1">
                        {list.map(m => {
                            const { done, total } = getCategoryStats(m);
                            const todo = total - done;
                            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                            const Icon = iconMap[m.icon] || Target;
                            const high = m.priority === 'high';

                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setOpenId(m.id)}
                                    className="umd-card umd-card-hover flex cursor-pointer flex-col gap-[11px] px-5 py-[18px] text-left"
                                >
                                    <div className="flex items-center gap-[11px]">
                                        <span className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] ${high ? 'bg-umd-red-50 text-umd-red-600' : 'bg-umd-indigo-50 text-umd-indigo-700'}`}>
                                            <Icon className="h-[19px] w-[19px]" aria-hidden="true" />
                                        </span>
                                        <h3 className="flex-1 text-[15.5px] font-bold leading-[1.25] font-display">{getCategoryName(m)}</h3>
                                        <PriorityBadge priority={m.priority} />
                                    </div>
                                    <p className="m-0 flex-1 text-[13px] leading-[1.5] text-umd-slate-500">{getCategoryDescription(m)}</p>
                                    <div className="flex items-center gap-2">
                                        {todo > 0
                                            ? <span className="inline-flex items-center gap-1 rounded-full border border-umd-gold-100 bg-umd-gold-50 px-[10px] py-[3px] text-[11.5px] font-semibold text-[#8a6d00]"><CircleDashed className="h-3 w-3" />{todo} {t.toDo}</span>
                                            : <span className="umd-chip umd-chip-safe px-[10px] py-[3px] text-[11.5px]"><Check className="h-3 w-3" />{t.complete}</span>}
                                        <span className="flex-1" />
                                        <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-umd-indigo-700">
                                            {t.viewApps}<ArrowRight className="h-[14px] w-[14px]" />
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-[10px] border-t border-umd-slate-100 pt-[11px]">
                                        <Bar pct={pct} className="flex-1" />
                                        <span className="umd-data whitespace-nowrap text-[12px] text-umd-slate-500">{done}/{total}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="mt-9 text-center">
                        <p className="mb-[14px] text-umd-slate-500">{t.ctaNote}</p>
                        <Link href={t.newFormPath} className="umd-btn umd-btn-primary umd-btn-lg">
                            <FilePlus2 className="h-5 w-5" aria-hidden="true" />
                            {t.createSheetBtn}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Drawer */}
            {openM && (
                <div
                    className="fixed inset-0 z-50 flex justify-end bg-umd-slate-900/40"
                    onClick={() => setOpenId(null)}
                >
                    <div
                        className="flex h-full w-full max-w-[560px] flex-col bg-white shadow-lg"
                        onClick={e => e.stopPropagation()}
                    >
                        {(() => {
                            const apps = openM.apps;
                            const done = apps.filter(a => isServiceDone(a.name));
                            const todo = apps.filter(a => !isServiceDone(a.name));
                            const total = apps.length;
                            const pct = total > 0 ? Math.round((done.length / total) * 100) : 0;
                            const high = openM.priority === 'high';

                            return (
                                <>
                                    {/* Head */}
                                    <div className="flex items-start gap-[14px] border-b border-umd-slate-200 px-6 py-5">
                                        <span className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] ${high ? 'bg-umd-red-50 text-umd-red-600' : 'bg-umd-indigo-50 text-umd-indigo-700'}`}>
                                            {(() => { const Ic = iconMap[openM.icon] || Target; return <Ic className="h-[21px] w-[21px]" aria-hidden="true" />; })()}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-[9px]">
                                                <h2 className="text-[19px] font-bold font-display">{getCategoryName(openM)}</h2>
                                                <PriorityBadge priority={openM.priority} />
                                            </div>
                                            <p className="mt-[3px] text-[13px] text-umd-slate-500">{getCategoryDescription(openM)}</p>
                                        </div>
                                        <button
                                            onClick={() => setOpenId(null)}
                                            aria-label={t.close}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-umd-slate-500 hover:bg-umd-slate-50"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Body */}
                                    <div className="flex-1 overflow-y-auto px-6 py-5">
                                        <div className="mb-[22px] flex items-center gap-3">
                                            <Bar pct={pct} className="flex-1" />
                                            <span className="umd-data whitespace-nowrap text-[13px] text-umd-slate-600">
                                                <strong className="text-umd-indigo-800">{done.length}</strong> / {total} {t.analyzed}
                                            </span>
                                        </div>

                                        {/* To do */}
                                        <div className="mb-3 flex items-center gap-[9px]">
                                            <CircleDashed className="h-4 w-4 text-umd-gold-600" />
                                            <h3 className="text-[14px] font-bold">{t.drawerTodo}</h3>
                                            <span className="umd-data text-[12px] text-umd-slate-500">{todo.length}</span>
                                        </div>
                                        {todo.length === 0 ? (
                                            <p className="mb-[22px] text-[13.5px] text-umd-slate-500">{t.drawerAllDone}</p>
                                        ) : (
                                            <div className="mb-6 grid grid-cols-2 gap-2 max-md:grid-cols-1">
                                                {todo.map(a => {
                                                    const pendingPR = getPendingPR(a.name);
                                                    const internalReview = isInternalReview(a.name);
                                                    const internalSlug = getInternalReviewSlug(a.name);
                                                    const isPending = pendingPR !== null || internalReview;

                                                    return (
                                                        <div key={a.name} className="flex items-center gap-2 rounded-[10px] border border-umd-slate-200 bg-white px-3 py-2">
                                                            <span className={`h-2 w-2 shrink-0 rounded-full ${isPending ? 'bg-umd-amber-400' : 'bg-umd-gold-400'}`} />
                                                            <span className="flex-1 truncate text-[13.5px] font-semibold">{a.name}</span>
                                                            {isPending ? (
                                                                <Link
                                                                    href={internalReview ? `/contribuer/fiches-a-revoir#review-${internalSlug}` : `/contribuer/fiches-a-revoir`}
                                                                    className="umd-btn umd-btn-sm umd-btn-outline px-3 py-[6px] text-[12.5px]"
                                                                >
                                                                    <Clock className="h-[13px] w-[13px]" />{t.reviewSheet}
                                                                </Link>
                                                            ) : (
                                                                <Link
                                                                    href={`${t.newFormPath}?name=${encodeURIComponent(a.name)}`}
                                                                    className="umd-btn umd-btn-sm umd-btn-primary px-3 py-[6px] text-[12.5px]"
                                                                >
                                                                    <Plus className="h-[13px] w-[13px]" />{t.createSheet}
                                                                </Link>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Done */}
                                        {done.length > 0 && (
                                            <>
                                                <div className="mb-3 flex items-center gap-[9px]">
                                                    <CheckCircle2 className="h-4 w-4 text-umd-green-600" />
                                                    <h3 className="text-[14px] font-bold">{t.drawerDone}</h3>
                                                    <span className="umd-data text-[12px] text-umd-slate-500">{done.length}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-[7px]">
                                                    {done.map(a => {
                                                        const slug = getServiceSlug(a.name);
                                                        const chip = (
                                                            <>
                                                                <Check className="h-[13px] w-[13px]" />{a.name}
                                                            </>
                                                        );
                                                        return slug ? (
                                                            <Link
                                                                key={a.name}
                                                                href={`${t.listAppPath}/${slug}`}
                                                                className="umd-chip umd-chip-safe px-[10px] py-[5px] text-[12.5px]"
                                                            >
                                                                {chip}
                                                            </Link>
                                                        ) : (
                                                            <span key={a.name} className="umd-chip umd-chip-safe px-[10px] py-[5px] text-[12.5px]">
                                                                {chip}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Foot */}
                                    <div className="flex flex-wrap items-center gap-3 border-t border-umd-slate-200 px-6 py-4">
                                        <p className="m-0 min-w-[180px] flex-1 text-[12.5px] leading-[1.5] text-umd-slate-500">
                                            {t.drawerFootNote}
                                        </p>
                                        <Link href={t.contributePath} className="umd-btn umd-btn-outline umd-btn-sm">
                                            <Compass className="h-4 w-4" aria-hidden="true" />
                                            {t.howItWorks}
                                        </Link>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}
