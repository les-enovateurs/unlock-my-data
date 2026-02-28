"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    CheckCircle,
    Target,
    TrendingUp,
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
    ExternalLink,
    Sparkles,
    Trophy,
    Flame,
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
    Filter,
    X,
    Clock,
    GitPullRequest
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
        priorityApps: 'Applications',
        priority: 'prioritaires',
        heroDescription: 'Voici les applications les plus téléchargées sur le Play Store qui nécessitent une analyse RGPD. Choisissez-en une et contribuez au projet !',
        analyzeApp: 'Analyser une app',
        overallProgress: 'Progression globale',
        appsAnalyzed: 'Applications analysées',
        of: 'sur',
        apps: 'applications',
        completed: 'complété',
        searchPlaceholder: 'Rechercher une app...',
        allCategories: 'Toutes les catégories',
        categories: 'Catégories',
        clearFilters: 'Effacer les filtres',
        filtering: 'Filtre :',
        analyzed: 'analysées',
        view: 'Voir',
        analyze: 'Analyser',
        noResults: 'Aucun résultat',
        noAppMatches: 'Aucune application ne correspond à',
        clearSearch: 'Effacer la recherche',
        yourImpact: 'Votre impact',
        everyAnalysisCounts: 'Chaque analyse compte',
        ctaDescription: 'Ces applications sont utilisées par des millions de personnes chaque jour. En les analysant, vous aidez la communauté à comprendre comment leurs données sont traitées.',
        startAnalysis: 'Commencer une analyse',
        viewGuide: 'Voir le guide',
        priorityHigh: 'Prioritaire',
        priorityMedium: 'Moyen',
        priorityLow: 'Faible',
        pendingReview: 'En relecture',
        viewPR: 'Relire',
        newFormPath: '/contribuer/nouvelle-fiche',
        listAppPath: '/liste-applications',
        contributePath: '/contribuer'
    },
    en: {
        missions: 'Missions',
        priorityApps: '',
        priority: 'Priority Applications',
        heroDescription: 'Here are the most downloaded apps on the Play Store that need GDPR analysis. Pick one and contribute to the project!',
        analyzeApp: 'Analyze an app',
        overallProgress: 'Overall Progress',
        appsAnalyzed: 'Apps analyzed',
        of: 'of',
        apps: 'apps',
        completed: 'completed',
        searchPlaceholder: 'Search an app...',
        allCategories: 'All categories',
        categories: 'Categories',
        clearFilters: 'Clear filters',
        filtering: 'Filtering:',
        analyzed: 'analyzed',
        view: 'View',
        analyze: 'Analyze',
        noResults: 'No results found',
        noAppMatches: 'No app matches',
        clearSearch: 'Clear search',
        yourImpact: 'Your Impact',
        everyAnalysisCounts: 'Every analysis counts',
        ctaDescription: 'These apps are used by millions of people every day. By analyzing them, you help the community understand how their data is handled.',
        startAnalysis: 'Start an analysis',
        viewGuide: 'View the guide',
        priorityHigh: 'Priority',
        priorityMedium: 'Medium',
        priorityLow: 'Low',
        pendingReview: 'In review',
        viewPR: 'Review',
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

const getAppLogo = (slug: string): string => {
    return `https://www.google.com/s2/favicons?domain=${slug}.com&sz=64`;
};

const colorMap: { [key: string]: string } = {
    error: 'bg-error text-error-content',
    success: 'bg-success text-success-content',
    info: 'bg-info text-info-content',
    warning: 'bg-warning text-warning-content',
    secondary: 'bg-secondary text-secondary-content',
    primary: 'bg-primary text-primary-content',
    accent: 'bg-accent text-accent-content'
};

const borderColorMap: { [key: string]: string } = {
    error: 'border-error/30 hover:border-error',
    success: 'border-success/30 hover:border-success',
    info: 'border-info/30 hover:border-info',
    warning: 'border-warning/30 hover:border-warning',
    secondary: 'border-secondary/30 hover:border-secondary',
    primary: 'border-primary/30 hover:border-primary',
    accent: 'border-accent/30 hover:border-accent'
};

const progressColorMap: { [key: string]: string } = {
    error: 'progress-error',
    success: 'progress-success',
    info: 'progress-info',
    warning: 'progress-warning',
    secondary: 'progress-secondary',
    primary: 'progress-primary',
    accent: 'progress-accent'
};

export default function MissionsComponent({ lang }: MissionsComponentProps) {
    const t = translations[lang];
    const [missions, setMissions] = useState<Mission[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [pendingApps, setPendingApps] = useState<PendingApp[]>([]);
    const [internalReviews, setInternalReviews] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
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
            .replace(/[\u0300-\u036f]/g, '')
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

    const getTotalStats = () => {
        const allApps = missions.flatMap(m => m.apps);
        const done = allApps.filter(app => isServiceDone(app.name)).length;
        const total = allApps.length;
        const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
        return { done, total, percentage };
    };

    const getCategoryName = (mission: Mission) => {
        return lang === 'fr' ? mission.category : mission.category_en;
    };

    const getCategoryDescription = (mission: Mission) => {
        return lang === 'fr' ? mission.description : mission.description_en;
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <span className="badge badge-error gap-1"><Flame className="w-3 h-3" /> {t.priorityHigh}</span>;
            case 'medium':
                return <span className="badge badge-warning gap-1">{t.priorityMedium}</span>;
            default:
                return <span className="badge badge-ghost gap-1">{t.priorityLow}</span>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const totalStats = getTotalStats();

    const filteredMissions = missions
        .filter(mission => !selectedCategory || mission.id === selectedCategory)
        .filter(mission => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return mission.apps.some(app =>
                app.name.toLowerCase().includes(query)
            );
        });

    return (
        <div className="bg-base-100 text-base-content min-h-screen">
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 bg-gradient-to-br from-base-100 via-base-200 to-accent/10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>

                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
                                <Target className="w-4 h-4" />
                                <span className="font-bold text-sm tracking-wide uppercase">{t.missions}</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-base-content tracking-tight leading-tight">
                                {lang === 'fr' ? (
                                    <>
                                        {t.priorityApps} <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">{t.priority}</span>
                                    </>
                                ) : (
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">{t.priority}</span>
                                )}
                            </h1>

                            <p className="text-xl text-base-content/70 mb-8 leading-relaxed max-w-xl">
                                {t.heroDescription}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link href={t.newFormPath} className="btn btn-primary btn-lg shadow-lg hover:shadow-primary/50 transition-all">
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    {t.analyzeApp}
                                </Link>
                            </div>
                        </div>

                        {/* Global Progress Card */}
                        <div className="card bg-base-100 shadow-2xl border border-base-200 w-full lg:w-80">
                            <div className="card-body p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-accent text-accent-content p-3 rounded-xl">
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{t.overallProgress}</h3>
                                        <p className="text-base-content/60 text-sm">{t.appsAnalyzed}</p>
                                    </div>
                                </div>

                                <div className="text-center mb-4">
                                    <div className="text-5xl font-extrabold text-accent">{totalStats.done}</div>
                                    <div className="text-base-content/60">{t.of} {totalStats.total} {t.apps}</div>
                                </div>

                                <progress
                                    className="progress progress-accent w-full h-3"
                                    value={totalStats.percentage}
                                    max="100"
                                ></progress>
                                <div className="text-right text-sm text-base-content/60 mt-1">
                                    {totalStats.percentage}% {t.completed}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content with Sidebar */}
            <section className="py-8">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Sidebar - Categories */}
                        <aside className="w-full lg:w-72 shrink-0">
                            <div className="sticky top-4 space-y-4">
                                {/* Search Input */}
                                <div className="join w-full">
                                    <div className="join-item flex items-center justify-center bg-base-200 px-3">
                                        <Search className="w-4 h-4 text-base-content/50" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={t.searchPlaceholder}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="input input-bordered join-item flex-1"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="btn btn-ghost join-item"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Categories Card */}
                                <div className="bg-base-100 rounded-box shadow-lg border border-base-300">
                                    {/* Header */}
                                    <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-4 h-4 text-primary" />
                                            <span className="font-semibold text-sm">{t.categories}</span>
                                        </div>
                                        <div className="badge badge-primary badge-sm">{missions.length}</div>
                                    </div>

                                    {/* Categories List */}
                                    <div className="p-2 max-h-[50vh] overflow-y-auto">
                                        {/* All categories button */}
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory
                                                ? 'bg-primary text-primary-content'
                                                : 'hover:bg-base-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Target className="w-4 h-4" />
                                                <span>{t.allCategories}</span>
                                            </div>
                                        </button>

                                        {/* Divider */}
                                        <div className="divider my-2 text-xs text-base-content/50">
                                            {lang === 'fr' ? 'Par catégorie' : 'By category'}
                                        </div>

                                        {/* Category buttons */}
                                        <div className="space-y-1">
                                            {missions.map(mission => {
                                                const Icon = iconMap[mission.icon] || Target;
                                                const stats = getCategoryStats(mission);
                                                const isSelected = selectedCategory === mission.id;

                                                return (
                                                    <button
                                                        key={mission.id}
                                                        onClick={() => setSelectedCategory(isSelected ? null : mission.id)}
                                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isSelected
                                                            ? 'bg-primary text-primary-content'
                                                            : 'hover:bg-base-200'
                                                            }`}
                                                    >
                                                        <div className={`p-1.5 rounded-md ${isSelected ? 'bg-primary-content/20' : colorMap[mission.color]}`}>
                                                            <Icon className="w-3.5 h-3.5" />
                                                        </div>
                                                        <span className="flex-1 text-left truncate">{getCategoryName(mission)}</span>
                                                        <div className="flex items-center gap-1.5">
                                                            {mission.priority === 'high' && (
                                                                <Flame className={`w-3 h-3 ${isSelected ? 'text-primary-content' : 'text-error'}`} />
                                                            )}
                                                            <span className={`badge badge-xs ${isSelected
                                                                ? ''
                                                                : stats.done === stats.total
                                                                    ? 'badge-success'
                                                                    : 'badge-ghost'
                                                                }`}>
                                                                {stats.done}/{stats.total}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Clear filters */}
                                    {(selectedCategory || searchQuery) && (
                                        <div className="px-2 pb-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(null);
                                                    setSearchQuery('');
                                                }}
                                                className="btn btn-ghost btn-sm w-full"
                                            >
                                                <X className="w-3 h-3" />
                                                {t.clearFilters}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Legend */}
                                <div className="bg-base-200/50 rounded-lg p-3 text-xs text-base-content/60 space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <Flame className="w-3 h-3 text-error" />
                                        <span>{lang === 'fr' ? 'Priorité haute' : 'High priority'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-success" />
                                        <span>{lang === 'fr' ? 'Analysée' : 'Analyzed'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-warning" />
                                        <span>{lang === 'fr' ? 'En relecture' : 'In review'}</span>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Right Content - Missions Grid */}
                        <main className="flex-1 min-w-0">
                            {/* Active filter indicator */}
                            {(selectedCategory || searchQuery) && (
                                <div className="mb-6 flex flex-wrap items-center gap-2">
                                    <span className="text-sm text-base-content/60">{t.filtering}</span>
                                    {selectedCategory && (
                                        <div className="badge badge-primary gap-2">
                                            {(() => {
                                                const mission = missions.find(m => m.id === selectedCategory);
                                                const Icon = mission ? iconMap[mission.icon] || Target : Target;
                                                return (
                                                    <>
                                                        <Icon className="w-3 h-3" />
                                                        {mission ? getCategoryName(mission) : ''}
                                                    </>
                                                );
                                            })()}
                                            <button onClick={() => setSelectedCategory(null)} className="hover:text-primary-content/70">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                    {searchQuery && (
                                        <div className="badge badge-secondary gap-2">
                                            <Search className="w-3 h-3" />
                                            &quot;{searchQuery}&quot;
                                            <button onClick={() => setSearchQuery('')} className="hover:text-secondary-content/70">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-8">
                                {filteredMissions.map(mission => {
                                    const filteredApps = searchQuery
                                        ? mission.apps.filter(app =>
                                            app.name.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        : mission.apps;
                                    const Icon = iconMap[mission.icon] || Target;
                                    const stats = getCategoryStats(mission);

                                    return (
                                        <div
                                            key={mission.id}
                                            className={`card bg-base-100 shadow-xl border-2 ${borderColorMap[mission.color]} transition-all duration-300`}
                                        >
                                            <div className="card-body p-8">
                                                {/* Category Header */}
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-4 rounded-2xl ${colorMap[mission.color]}`}>
                                                            <Icon className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h2 className="text-2xl font-bold">{getCategoryName(mission)}</h2>
                                                                {getPriorityBadge(mission.priority)}
                                                            </div>
                                                            <p className="text-base-content/60">{getCategoryDescription(mission)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-3xl font-bold">{stats.done}/{stats.total}</div>
                                                        <div className="text-sm text-base-content/60">{t.analyzed}</div>
                                                        <progress
                                                            className={`progress ${progressColorMap[mission.color]} w-32 h-2 mt-2`}
                                                            value={stats.percentage}
                                                            max="100"
                                                        ></progress>
                                                    </div>
                                                </div>

                                                {/* Apps Grid */}
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                    {filteredApps.map(app => {
                                                        const isDone = isServiceDone(app.name);
                                                        const slug = getServiceSlug(app.name);
                                                        const pendingPR = getPendingPR(app.name);
                                                        const internalReview = isInternalReview(app.name);
                                                        const internalSlug = getInternalReviewSlug(app.name);
                                                        const isPending = !isDone && (pendingPR !== null || internalReview);

                                                        return (
                                                            <div
                                                                key={app.name}
                                                                className={`card relative group transition-all duration-300 hover:scale-105 hover:shadow-xl ${isDone
                                                                    ? 'bg-success/10 border-2 border-success/30'
                                                                    : isPending
                                                                        ? 'bg-warning/10 border-2 border-warning/30'
                                                                        : 'bg-base-200/50 border-2 border-base-300 hover:border-primary/50'
                                                                    }`}
                                                            >
                                                                {isDone && (
                                                                    <div className="absolute -top-2 -right-2 bg-success text-success-content rounded-full p-1 shadow-lg z-10">
                                                                        <CheckCircle className="w-4 h-4" />
                                                                    </div>
                                                                )}
                                                                {isPending && (
                                                                    <div className="absolute -top-2 -right-2 bg-warning text-warning-content rounded-full p-1 shadow-lg z-10">
                                                                        <Clock className="w-4 h-4" />
                                                                    </div>
                                                                )}

                                                                <div className="card-body p-4 items-center text-center">
                                                                    {/* Logo */}
                                                                    <div className="w-14 h-14 rounded-xl bg-base-100 shadow-md flex items-center justify-center overflow-hidden mb-2">
                                                                        <Image
                                                                            src={getAppLogo(app.slug)}
                                                                            alt={app.name}
                                                                            width={48}
                                                                            height={48}
                                                                            className="object-contain"
                                                                            unoptimized
                                                                        />
                                                                    </div>

                                                                    {/* Title */}
                                                                    <h3 className="font-semibold text-sm line-clamp-2 leading-tight min-h-10">
                                                                        {app.name}
                                                                    </h3>

                                                                    {/* Action button */}
                                                                    <div className="mt-2 w-full">
                                                                        {isDone && slug ? (
                                                                            <Link
                                                                                href={`${t.listAppPath}/${slug}`}
                                                                                className="btn btn-sm btn-success w-full gap-1"
                                                                            >
                                                                                <ExternalLink className="w-3 h-3" />
                                                                                {t.view}
                                                                            </Link>
                                                                        ) : isPending && (pendingPR || internalReview) ? (
                                                                            <Link
                                                                                href={internalReview ? `/contribuer/fiches-a-revoir#review-${internalSlug}` : `/contribuer/fiches-a-revoir`}
                                                                                className="btn btn-sm btn-warning w-full gap-1"
                                                                            >
                                                                                <Clock className="w-3 h-3" />
                                                                                {t.viewPR}
                                                                            </Link>
                                                                        ) : (
                                                                            <Link
                                                                                href={`${t.newFormPath}?name=${encodeURIComponent(app.name)}`}
                                                                                className="btn btn-sm btn-outline btn-primary w-full gap-1"
                                                                            >
                                                                                <Sparkles className="w-3 h-3" />
                                                                                {t.analyze}
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* No results message */}
                                {searchQuery && filteredMissions.length === 0 && (
                                    <div className="text-center py-16">
                                        <Search className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold mb-2">{t.noResults}</h3>
                                        <p className="text-base-content/60 mb-6">
                                            {t.noAppMatches} &quot;{searchQuery}&quot;
                                        </p>
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="btn btn-primary"
                                        >
                                            {t.clearSearch}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-base-200/50">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-bold text-sm">{t.yourImpact}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        {t.everyAnalysisCounts}
                    </h2>
                    <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
                        {t.ctaDescription}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href={t.newFormPath} className="btn btn-primary btn-lg">
                            <Sparkles className="w-5 h-5 mr-2" />
                            {t.startAnalysis}
                        </Link>
                        <Link href={t.contributePath} className="btn btn-outline btn-lg">
                            {t.viewGuide}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
