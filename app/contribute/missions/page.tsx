"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft,
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
    Flame
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
    Dumbbell
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

export default function MissionsPage() {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [missionsRes, servicesRes] = await Promise.all([
                    fetch('/data/missions.json'),
                    fetch('/data/services.json')
                ]);
                const missionsData = await missionsRes.json();
                const servicesData = await servicesRes.json();
                setMissions(missionsData);
                setServices(servicesData);
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

    const getCategoryStats = (mission: Mission) => {
        const done = mission.apps.filter(app => isServiceDone(app.name)).length;
        const total = mission.apps.length;
        const percentage = Math.round((done / total) * 100);
        return { done, total, percentage };
    };

    const getTotalStats = () => {
        const allApps = missions.flatMap(m => m.apps);
        const done = allApps.filter(app => isServiceDone(app.name)).length;
        const total = allApps.length;
        const percentage = Math.round((done / total) * 100);
        return { done, total, percentage };
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <span className="badge badge-error gap-1"><Flame className="w-3 h-3" /> Priority</span>;
            case 'medium':
                return <span className="badge badge-warning gap-1">Medium</span>;
            default:
                return <span className="badge badge-ghost gap-1">Low</span>;
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
                                <span className="font-bold text-sm tracking-wide uppercase">Missions</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-base-content tracking-tight leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Priority</span> Applications
                            </h1>

                            <p className="text-xl text-base-content/70 mb-8 leading-relaxed max-w-xl">
                                Here are the most downloaded apps on the Play Store that need GDPR analysis.
                                Pick one and contribute to the project!
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/contribute/new-form" className="btn btn-primary btn-lg shadow-lg hover:shadow-primary/50 transition-all">
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Analyze an app
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
                                        <h3 className="font-bold text-lg">Overall Progress</h3>
                                        <p className="text-base-content/60 text-sm">Apps analyzed</p>
                                    </div>
                                </div>

                                <div className="text-center mb-4">
                                    <div className="text-5xl font-extrabold text-accent">{totalStats.done}</div>
                                    <div className="text-base-content/60">of {totalStats.total} apps</div>
                                </div>

                                <progress
                                    className="progress progress-accent w-full h-3"
                                    value={totalStats.percentage}
                                    max="100"
                                ></progress>
                                <div className="text-right text-sm text-base-content/60 mt-1">
                                    {totalStats.percentage}% completed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-base-200/50 sticky top-0 z-30 backdrop-blur-sm border-b border-base-200">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`btn btn-sm ${!selectedCategory ? 'btn-primary' : 'btn-ghost'}`}
                        >
                            All categories
                        </button>
                        {missions.map(mission => {
                            const Icon = iconMap[mission.icon] || Target;
                            const stats = getCategoryStats(mission);
                            return (
                                <button
                                    key={mission.id}
                                    onClick={() => setSelectedCategory(mission.id)}
                                    className={`btn btn-sm gap-2 ${selectedCategory === mission.id ? 'btn-primary' : 'btn-ghost'}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {mission.category_en}
                                    <span className="badge badge-sm">{stats.done}/{stats.total}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Missions Grid */}
            <section className="py-16">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="space-y-12">
                        {missions
                            .filter(mission => !selectedCategory || mission.id === selectedCategory)
                            .map(mission => {
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
                                                            <h2 className="text-2xl font-bold">{mission.category_en}</h2>
                                                            {getPriorityBadge(mission.priority)}
                                                        </div>
                                                        <p className="text-base-content/60">{mission.description_en}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-3xl font-bold">{stats.done}/{stats.total}</div>
                                                    <div className="text-sm text-base-content/60">analyzed</div>
                                                    <progress
                                                        className={`progress ${progressColorMap[mission.color]} w-32 h-2 mt-2`}
                                                        value={stats.percentage}
                                                        max="100"
                                                    ></progress>
                                                </div>
                                            </div>

                                            {/* Apps Grid */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                {mission.apps.map(app => {
                                                    const isDone = isServiceDone(app.name);
                                                    const slug = getServiceSlug(app.name);

                                                    return (
                                                        <div
                                                            key={app.name}
                                                            className={`relative group p-4 rounded-xl border-2 transition-all duration-300 ${
                                                                isDone
                                                                    ? 'bg-success/5 border-success/30'
                                                                    : 'bg-base-200/50 border-base-300 hover:border-primary/50 hover:bg-base-200'
                                                            }`}
                                                        >
                                                            {isDone && (
                                                                <div className="absolute -top-2 -right-2 bg-success text-success-content rounded-full p-1 shadow-lg">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </div>
                                                            )}

                                                            <div className="flex flex-col items-center text-center">
                                                                <div className="w-12 h-12 mb-3 rounded-xl bg-base-100 shadow flex items-center justify-center overflow-hidden">
                                                                    <Image
                                                                        src={getAppLogo(app.slug)}
                                                                        alt={app.name}
                                                                        width={40}
                                                                        height={40}
                                                                        className="object-contain"
                                                                        unoptimized
                                                                    />
                                                                </div>
                                                                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{app.name}</h3>

                                                                <div className="mt-auto">
                                                                    {isDone && slug ? (
                                                                        <Link
                                                                            href={`/list-app/${slug}`}
                                                                            className="btn btn-xs btn-success gap-1"
                                                                        >
                                                                            <ExternalLink className="w-3 h-3" />
                                                                            View
                                                                        </Link>
                                                                    ) : (
                                                                        <Link
                                                                            href={`/contribute/new-form?name=${encodeURIComponent(app.name)}`}
                                                                            className="btn btn-xs btn-outline btn-primary gap-1"
                                                                        >
                                                                            <Sparkles className="w-3 h-3" />
                                                                            Analyze
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
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-base-200/50">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-bold text-sm">Your Impact</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Every analysis counts
                    </h2>
                    <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
                        These apps are used by millions of people every day.
                        By analyzing them, you help the community understand how their data is handled.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/contribute/new-form" className="btn btn-primary btn-lg">
                            <Sparkles className="w-5 h-5 mr-2" />
                            Start an analysis
                        </Link>
                        <Link href="/contribute" className="btn btn-outline btn-lg">
                            View the guide
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
