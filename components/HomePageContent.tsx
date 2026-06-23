"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, BarChart3, Hand, Scale, Search, Shield, Trash2 } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/Home.json";
import BrandLogo from "@/components/BrandLogo";
import type { Lang } from "@/context/LanguageContext";

type Props = { lang: Lang };

export default function HomePageContent({ lang }: Props) {
    const t = new Translator(dict, lang);

    const pillars = [
        {
            icon: Search,
            title: t.t("pillars.analyze.title"),
            desc: t.t("pillars.analyze.desc"),
            cta: t.t("pillars.analyze.cta"),
            href: t.t("routes.catalog"),
        },
        {
            icon: Scale,
            title: t.t("pillars.compare.title"),
            desc: t.t("pillars.compare.desc"),
            cta: t.t("pillars.compare.cta"),
            href: t.t("routes.compare"),
        },
        {
            icon: Trash2,
            title: t.t("pillars.delete.title"),
            desc: t.t("pillars.delete.desc"),
            cta: t.t("pillars.delete.cta"),
            href: t.t("routes.delete"),
        },
    ];

    const articles = [
        {
            href: "https://les-enovateurs.com/fuite-donnees-personnelles-comment-reagir-sans-paniquer",
            src: "https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffuite-donnees-personnelles-comment-reagir-sans-paniquer.9d09d7bb.webp&w=1920&q=75",
            title: t.t("news.article1.title"),
            desc: t.t("news.article1.desc"),
        },
        {
            href: lang === "fr"
                ? "https://les-enovateurs.com/rien-a-cacher-5-bonnes-raison-proteger-donnees-en-ligne"
                : "https://les-enovateurs.com/nothing-to-hide-5-good-reasons-to-protect-online-data",
            src: "https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frien-a-cacher-5-bonnes-raison-proteger-donnees-en-ligne.802ee5bf.webp&w=3840&q=75",
            title: t.t("news.article2.title"),
            desc: t.t("news.article2.desc"),
        },
        {
            href: "https://les-enovateurs.com/mort-numerique-quand-donnees-nous-survivent",
            src: "https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmort-numerique-quand-donnees-nous-survivent.93af2110.webp&w=3840&q=75",
            title: t.t("news.article3.title"),
            desc: t.t("news.article3.desc"),
        },
    ];

    return (
        <main>
            {/* ── HERO ─────────────────────────────────────────────── */}
            <section
                aria-label="Introduction"
                className="border-b border-umd-slate-200"
                style={{ background: "linear-gradient(180deg, var(--indigo-50), #fff)" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
                    <span className="umd-pill umd-pill-indigo mb-6">
                        <Hand aria-hidden="true" />
                        {t.t("hero.badge")}
                    </span>
                    <h1 className="umd-h-hero max-w-4xl mx-auto mb-6">
                        {t.t("hero.title1")}{" "}
                        <span style={{ color: "var(--indigo-600)" }}>{t.t("hero.title2")}</span>
                    </h1>
                    <p
                        className="umd-lead-text max-w-2xl mx-auto mb-8 [&_strong]:text-umd-slate-900"
                        dangerouslySetInnerHTML={{ __html: t.t("hero.description") }}
                    />
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={t.t("routes.protect")} className="umd-btn umd-btn-primary umd-btn-lg">
                            <Shield aria-hidden="true" />
                            {t.t("hero.cta.protect")}
                        </Link>
                        <Link href={t.t("routes.compare")} className="umd-btn umd-btn-outline umd-btn-lg">
                            <BarChart3 aria-hidden="true" />
                            {t.t("hero.cta.compare")}
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── PILLARS ──────────────────────────────────────────── */}
            <section aria-labelledby="core-tools-heading" className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 id="core-tools-heading" className="umd-heading-2 text-center mb-2">
                        {t.t("core.title")}
                    </h2>
                    <p className="text-center text-umd-slate-600 mb-10">{t.t("core.subtitle")}</p>
                    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0">
                        {pillars.map((pillar, i) => {
                            const PillarIcon = pillar.icon;
                            return (
                                <li key={pillar.title} className="h-full">
                                    <Link
                                        href={pillar.href}
                                        prefetch={false}
                                        className="umd-card umd-card-hover h-full p-5 flex flex-col gap-2.5 no-underline text-inherit focus-visible:outline-none"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="w-10 h-10 rounded-(--umd-radius-md) flex items-center justify-center"
                                            style={{ background: "var(--indigo-50)", color: "var(--indigo-700)" }}
                                        >
                                            <PillarIcon size={22} />
                                        </span>
                                        <h3 className="umd-heading-3 flex items-baseline gap-2">
                                            <span className="font-mono text-[13px] font-bold" style={{ color: "#8a6d00" }}>
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            {pillar.title}
                                        </h3>
                                        <p className="text-umd-slate-600 text-sm leading-relaxed m-0 flex-1">{pillar.desc}</p>
                                        <span className="text-sm font-bold flex items-center gap-1.5" style={{ color: "var(--indigo-700)" }}>
                                            {pillar.cta} <ArrowRight size={15} aria-hidden="true" />
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>

            {/* ── THREAT PANEL (Cybermenace — CERT-FR) ─────────────── */}
            <section aria-labelledby="context-heading" className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div
                        className="relative overflow-hidden rounded-(--umd-radius-xl) text-white px-7 py-10 md:px-11 md:py-12"
                        style={{ background: "var(--indigo-950)" }}
                    >
                        {/* Branded motif: oversized open-lock mark, very subtle */}
                        <div className="absolute -right-7 -bottom-9 opacity-[0.06] pointer-events-none" aria-hidden="true">
                            <BrandLogo size={294} dark withWordmark={false} />
                        </div>
                        <div className="relative grid md:grid-cols-[1.25fr_1fr] gap-8 md:gap-12 items-center">
                            <div>
                                <span
                                    className="inline-flex items-center gap-2 text-[11.5px] font-bold uppercase mb-4 pl-3"
                                    style={{ color: "var(--gold-400)", letterSpacing: ".08em", borderLeft: "3px solid var(--gold-400)" }}
                                >
                                    {t.t("context.badge")}
                                </span>
                                <h2 id="context-heading" className="umd-heading-2 mb-4" style={{ color: "#fff" }}>
                                    {t.t("context.title")}{" "}
                                    <span style={{ color: "var(--gold-400)" }}>{t.t("context.title.accent")}</span>
                                    {t.t("context.title.end")}
                                </h2>
                                <p className="text-[17px] leading-relaxed mb-4" style={{ color: "var(--fg2-on-dark)" }}>
                                    {t.t("context.desc")}
                                </p>
                                <a
                                    href="https://www.cert.ssi.gouv.fr/cti/CERTFR-2026-CTI-002/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-white font-semibold text-[14.5px] underline underline-offset-4 hover:text-umd-gold-300"
                                    style={{ textDecorationColor: "var(--gold-400)" }}
                                >
                                    {t.t("context.link")}
                                    <ArrowUpRight size={16} aria-hidden="true" />
                                    <span className="sr-only"> (opens in a new tab)</span>
                                </a>
                            </div>
                            <div
                                className="rounded-(--umd-radius-lg) px-7 py-7"
                                style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)" }}
                            >
                                <div className="mb-5">
                                    <p className="font-mono text-[44px] font-bold leading-none text-white m-0">
                                        {t.t("context.stat1.number")}
                                    </p>
                                    <p className="text-[13px] mt-1.5 m-0" style={{ color: "var(--fg2-on-dark)" }}>
                                        {t.t("context.stat1.label")}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-mono text-[44px] font-bold leading-none m-0" style={{ color: "var(--gold-400)" }}>
                                        {t.t("context.stat2.number")}
                                    </p>
                                    <p className="text-[13px] mt-1.5 m-0" style={{ color: "var(--fg2-on-dark)" }}>
                                        {t.t("context.stat2.label")}
                                    </p>
                                </div>
                                <blockquote
                                    className="mt-6 pt-5 italic text-[13.5px] m-0"
                                    style={{ color: "var(--fg2-on-dark)", borderTop: "1px solid rgba(255,255,255,.14)" }}
                                >
                                    {t.t("context.quote")}
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── NEWS ─────────────────────────────────────────────── */}
            {/*<section aria-labelledby="news-heading" className="py-16 md:py-20" style={{ background: "var(--slate-50)" }}>*/}
            {/*    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">*/}
            {/*        <div className="text-center mb-12">*/}
            {/*            <h2 id="news-heading" className="umd-heading-2">{t.t("news.title")}</h2>*/}
            {/*            <p className="text-umd-slate-600 mt-3">{t.t("news.subtitle")}</p>*/}
            {/*        </div>*/}
            {/*        <ul className="grid md:grid-cols-3 gap-6 list-none p-0 m-0">*/}
            {/*            {articles.map((article) => (*/}
            {/*                <li key={article.href} className="h-full">*/}
            {/*                    <a*/}
            {/*                        href={article.href}*/}
            {/*                        target="_blank"*/}
            {/*                        rel="noopener noreferrer"*/}
            {/*                        className="umd-card umd-card-hover overflow-hidden flex flex-col h-full no-underline text-inherit focus-visible:outline-none"*/}
            {/*                    >*/}
            {/*                        <div className="h-48 relative shrink-0">*/}
            {/*                            <Image alt={article.title} fill className="object-cover" src={article.src} />*/}
            {/*                        </div>*/}
            {/*                        <div className="p-5 flex-1 flex flex-col">*/}
            {/*                            <h3 className="umd-heading-3 !text-lg mb-2">{article.title}</h3>*/}
            {/*                            <p className="text-umd-slate-600 text-sm flex-1 m-0">{article.desc}</p>*/}
            {/*                        </div>*/}
            {/*                    </a>*/}
            {/*                </li>*/}
            {/*            ))}*/}
            {/*        </ul>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* ── FAQ ──────────────────────────────────────────────── */}
            <section aria-labelledby="faq-heading" className="py-16 md:py-20 bg-white border-t border-umd-slate-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 id="faq-heading" className="umd-heading-2 text-center mb-12">
                        {t.t("faq.title")}
                    </h2>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <details key={i} className="umd-card group" open={i === 1}>
                                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5 font-display font-bold text-lg text-umd-slate-900 [&::-webkit-details-marker]:hidden">
                                    {t.t(`faq.q${i}.question`)}
                                    <span aria-hidden="true" className="text-umd-indigo-600 font-mono shrink-0 group-open:hidden">+</span>
                                    <span aria-hidden="true" className="text-umd-indigo-600 font-mono shrink-0 hidden group-open:inline">−</span>
                                </summary>
                                <div className="px-5 pb-5 text-umd-slate-600 leading-relaxed">
                                    <p dangerouslySetInnerHTML={{ __html: t.t(`faq.q${i}.answer`) }} />
                                    {i === 3 && (
                                        <div className="mt-5 flex flex-wrap gap-3">
                                            <a href={t.t("routes.contribute")} className="umd-btn umd-btn-outline umd-btn-sm">
                                                {t.t("contribute.analyze.label")}
                                            </a>
                                            <a
                                                href="https://github.com/les-enovateurs/unlock-my-data"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="umd-btn umd-btn-outline umd-btn-sm"
                                            >
                                                {t.t("contribute.code.label")}
                                            </a>
                                            <Link
                                                href={lang === "fr" ? "/contributeurs" : "/contributors"}
                                                className="umd-btn umd-btn-outline umd-btn-sm"
                                            >
                                                {t.t("contribute.community.label")}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
