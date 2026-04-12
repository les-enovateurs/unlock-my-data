"use client";
import Link from "next/link";
import Image from "next/image";
import Translator from "@/components/tools/t";
import dict from "@/i18n/Home.json";
import type { Lang } from "@/context/LanguageContext";

type Props = { lang: Lang };

const DATA_SOURCES = [
    { name: "Gmail", color: "bg-red-50 text-red-700 border-red-200" },
    { name: "Google Drive", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    { name: "Outlook", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { name: "iCloud", color: "bg-sky-50 text-sky-700 border-sky-200" },
    { name: "Microsoft OneDrive", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
];

export default function HomePageContent({ lang }: Props) {
    const t = new Translator(dict, lang);
    const coreTools = [
        {
            icon: "📊",
            title: t.t("pillars.analyze.title"),
            desc: t.t("pillars.analyze.desc"),
            cta: t.t("pillars.analyze.cta"),
            href: t.t("routes.catalog"),
            accent: "text-blue-700",
            bg: "bg-blue-50",
            border: "border-blue-100",
        },
        {
            icon: "⚖️",
            title: t.t("pillars.compare.title"),
            desc: t.t("pillars.compare.desc"),
            cta: t.t("pillars.compare.cta"),
            href: t.t("routes.compare"),
            accent: "text-violet-700",
            bg: "bg-violet-50",
            border: "border-violet-100",
        },
        {
            icon: "🗑️",
            title: t.t("pillars.delete.title"),
            desc: t.t("pillars.delete.desc"),
            cta: t.t("pillars.delete.cta"),
            href: t.t("routes.delete"),
            accent: "text-rose-700",
            bg: "bg-rose-50",
            border: "border-rose-100",
        },
        {
            icon: "🌿",
            title: t.t("cleanup.tagline"),
            desc: t.t("cleanup.card.desc"),
            cta: t.t("cleanup.cta"),
            href: t.t("routes.cleanup"),
            accent: "text-emerald-700",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
        },
    ];

    return (
        <main>
            {/* ── HERO ─────────────────────────────────────────────── */}
            <section
                aria-label="Introduction"
                className="hero min-h-[70vh] bg-gradient-to-b from-blue-50 to-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-100 blur-3xl opacity-50" aria-hidden="true" />

                <div className="hero-content text-center relative z-10">
                    <div className="max-w-4xl">
                        <p className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                            {t.t("hero.badge")}
                        </p>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
                            {t.t("hero.title1")}{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                {t.t("hero.title2")}
                            </span>
                        </h1>
                        <p
                            className="py-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: t.t("hero.description") }}
                        />
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                            <Link
                                href={t.t("routes.protect")}
                                className="btn btn-primary text-white btn-lg rounded-full px-8 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-green-500 to-cyan-500 border-0 text-gray-900"
                            >
                                {t.t("hero.cta.protect")}
                            </Link>
                            <Link
                                href={t.t("routes.compare")}
                                className="btn btn-outline btn-lg rounded-full px-8 bg-white hover:bg-gray-50"
                            >
                                {t.t("hero.cta.compare")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CORE TOOLS CARDS ──────────────────────────────────── */}
            <section aria-labelledby="core-tools-heading" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 id="core-tools-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                {t.t("core.title")}
                            </h2>
                        </div>
                        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0">
                            {coreTools.map((tool) => (
                                <li key={tool.title}>
                                    <Link
                                        href={tool.href}
                                        prefetch={false}
                                        className={`h-full rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-700 ${tool.bg} ${tool.border}`}
                                    >
                                        <div>
                                            <p className="text-3xl mb-4" aria-hidden="true">{tool.icon}</p>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.title}</h3>
                                            <p className="text-sm text-gray-700 leading-relaxed">{tool.desc}</p>
                                        </div>
                                        <p className={`mt-5 text-sm font-semibold ${tool.accent}`}>{tool.cta} →</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── CONTEXT / CNIL ALERT ─────────────────────────────── */}
            <section
                aria-labelledby="context-heading"
                className="py-20 bg-gray-900 text-white"
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="md:w-1/2">
                                <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-red-400 uppercase border border-red-400 rounded-full">
                                    {t.t("context.badge")}
                                </div>
                                <h2
                                    id="context-heading"
                                    className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
                                >
                                    {t.t("context.title")}{" "}
                                    <span className="text-red-400">{t.t("context.title.accent")}</span>
                                    {t.t("context.title.end")}
                                </h2>
                                <p className="text-gray-400 text-lg mb-6">
                                    {t.t("context.desc")}
                                </p>
                                <a
                                    href="https://www.cert.ssi.gouv.fr/cti/CERTFR-2026-CTI-002/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white underline decoration-red-400 underline-offset-4 hover:text-red-400 transition-colors"
                                >
                                    {t.t("context.link")}
                                    <span className="sr-only"> (opens in a new tab)</span>
                                </a>
                            </div>
                            <div className="md:w-1/2 w-full">
                                <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-500 blur-3xl opacity-20" aria-hidden="true" />
                                    <div className="grid grid-cols-2 gap-6 text-center">
                                        <div>
                                            <p className="text-4xl font-bold text-white mb-2">{t.t("context.stat1.number")}</p>
                                            <p className="text-sm text-gray-400">{t.t("context.stat1.label")}</p>
                                        </div>
                                        <div>
                                            <p className="text-4xl font-bold text-red-400 mb-2">{t.t("context.stat2.number")}</p>
                                            <p className="text-sm text-gray-400">{t.t("context.stat2.label")}</p>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-gray-700">
                                        <blockquote className="text-sm text-gray-300 italic">
                                            {t.t("context.quote")}
                                        </blockquote>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── NEWS ─────────────────────────────────────────────── */}
            <section aria-labelledby="news-heading" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 id="news-heading" className="text-3xl font-bold text-gray-900">
                                {t.t("news.title")}
                            </h2>
                            <p className="text-gray-600 mt-4">{t.t("news.subtitle")}</p>
                        </div>

                        <ul className="grid md:grid-cols-3 gap-8 list-none p-0">
                            {[
                                {
                                    href: lang === "fr"
                                        ? "https://les-enovateurs.com/fuite-donnees-personnelles-comment-reagir-sans-paniquer"
                                        : "https://les-enovateurs.com/fuite-donnees-personnelles-comment-reagir-sans-paniquer",
                                    src: "https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffuite-donnees-personnelles-comment-reagir-sans-paniquer.9d09d7bb.webp&w=1920&q=75",
                                    alt: t.t("news.article1.title"),
                                    title: t.t("news.article1.title"),
                                    desc: t.t("news.article1.desc"),
                                },
                                {
                                    href: lang === "fr"
                                        ? "https://les-enovateurs.com/rien-a-cacher-5-bonnes-raison-proteger-donnees-en-ligne"
                                        : "https://les-enovateurs.com/nothing-to-hide-5-good-reasons-to-protect-online-data",
                                    src: "https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frien-a-cacher-5-bonnes-raison-proteger-donnees-en-ligne.802ee5bf.webp&w=3840&q=75",
                                    alt: t.t("news.article2.title"),
                                    title: t.t("news.article2.title"),
                                    desc: t.t("news.article2.desc"),
                                },
                                {
                                    href: lang === "fr"
                                        ? "https://les-enovateurs.com/mort-numerique-quand-donnees-nous-survivent"
                                        : "https://les-enovateurs.com/mort-numerique-quand-donnees-nous-survivent",
                                    src: "https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmort-numerique-quand-donnees-nous-survivent.93af2110.webp&w=3840&q=75",
                                    alt: t.t("news.article3.title"),
                                    title: t.t("news.article3.title"),
                                    desc: t.t("news.article3.desc"),
                                },
                            ].map((article) => (
                                <li key={article.href}>
                                    <a
                                        href={article.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
                                    >
                                        <div className="h-48 overflow-hidden relative shrink-0">
                                            <Image
                                                alt={article.alt}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                src={article.src}
                                            />
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm flex-1">{article.desc}</p>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── DIGITAL CLEAN UP (featured tool) ─────────────────── */}
            <section
                aria-labelledby="cleanup-heading"
                className="relative overflow-hidden bg-[#163122] text-white"
            >
                {/* Organic background textures */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute -top-32 -left-32 w-[560px] h-[560px] rounded-full bg-green-900 opacity-40 blur-[120px]" />
                    <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-emerald-800 opacity-30 blur-[100px]" />
                    <svg
                        className="absolute bottom-0 left-0 w-full opacity-5"
                        viewBox="0 0 1440 160"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path d="M0,64 C360,160 1080,0 1440,96 L1440,160 L0,160 Z" fill="white" />
                    </svg>
                </div>

                <div className="relative z-10 container mx-auto px-4 py-16 lg:py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Copy */}
                        <div>
                            <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">
                                {t.t("cleanup.tagline")}
                            </p>

                            <h2
                                id="cleanup-heading"
                                className="text-4xl md:text-5xl font-extrabold leading-tight mb-6"
                            >
                                {t.t("cleanup.title")}
                            </h2>

                            <p className="text-gray-200 text-lg leading-relaxed mb-6">
                                {t.t("cleanup.subtitle")}
                            </p>

                            <Link
                                href={t.t("routes.cleanup")}
                                className="inline-flex items-center bg-green-500 hover:bg-green-400 text-gray-900 font-bold px-8 py-4 rounded-full transition-colors shadow-lg shadow-green-900/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-300"
                            >
                                {t.t("cleanup.cta")}
                            </Link>
                        </div>

                        {/* Right: visual panel */}
                        <div className="space-y-8">

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-3">
                                    {t.t("cleanup.quickTitle")}
                                </p>
                                <ul className="space-y-2 text-sm text-gray-200">
                                    <li>{t.t("cleanup.quickItem1")}</li>
                                    <li>{t.t("cleanup.quickItem2")}</li>
                                    <li>{t.t("cleanup.quickItem3")}</li>
                                </ul>
                            </div>

                            {/* Target data sources */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                                    {t.t("cleanup.targets.title")}
                                </p>
                                <ul
                                    className="flex flex-wrap gap-2 list-none"
                                    aria-label={t.t("cleanup.targets.title")}
                                >
                                    {DATA_SOURCES.map((source) => (
                                        <li key={source.name}>
                                            <span
                                                className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium ${source.color}`}
                                            >
                                                {source.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ───────────────────────────────────────────────── */}
            <section aria-labelledby="faq-heading" className="py-24 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {t.t("faq.title")}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="collapse collapse-plus bg-gray-50 border border-gray-200 rounded-2xl">
                                    <input type="radio" name="my-accordion-3" defaultChecked={i === 1} aria-label={t.t(`faq.q${i}.question`)} />
                                    <div className="collapse-title text-xl font-bold text-gray-900">
                                        {t.t(`faq.q${i}.question`)}
                                    </div>
                                    <div className="collapse-content text-gray-700 leading-relaxed">
                                        <p dangerouslySetInnerHTML={{ __html: t.t(`faq.q${i}.answer`) }} />
                                        {i === 3 && (
                                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <a
                                                    href={t.t("routes.contribute")}
                                                    className="btn btn-outline btn-sm rounded-xl"
                                                >
                                                    🔍 {t.t("contribute.analyze.label")}
                                                </a>
                                                <a
                                                    href="https://github.com/les-enovateurs/unlock-my-data"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline btn-sm rounded-xl"
                                                >
                                                    💻 {t.t("contribute.code.label")}
                                                </a>
                                                <Link
                                                    href={lang === "fr" ? "/contributeurs" : "/contributors"}
                                                    className="btn btn-outline btn-sm rounded-xl"
                                                >
                                                    🤝 {t.t("contribute.community.label")}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

