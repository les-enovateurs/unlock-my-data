import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/Home.json";
import services from "@/public/data/services.json";
import HomeKeyQuotes from "@/components/home/HomeKeyQuotes";
import HomeRecentActivity from "@/components/home/HomeRecentActivity";
import { ficheHref } from "@/components/company/ficheTabs";
import type { Lang } from "@/context/LanguageContext";

const POPULAR = ["whatsapp", "tiktok", "instagram", "leboncoin", "doctolib", "pronote"];

export default function HomePageContent({ lang }: { lang: Lang }) {
    const t = new Translator(dict, lang);
    const n = { n: String(services.length) };
    const popular = POPULAR.map((slug) => services.find((s) => s.slug === slug)).filter((s) => s !== undefined);
    const tools = [
        { key: "analyze", href: t.t("routes.catalog") },
        { key: "compare", href: `${t.t("routes.compare")}?services=whatsapp,signal` },
        { key: "delete", href: t.t("routes.delete") },
    ];

    return (
        <div>
            <section aria-labelledby="home-title" className="umd-home-hero">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
                    <div>
                        <h1 id="home-title" className="umd-h-hero mb-5">{t.t("hero.title")}</h1>
                        <p className="umd-lead-text mb-5 max-w-xl">{t.t("hero.lead", n)}</p>
                        <p className="text-sm text-umd-slate-600 m-0">{t.t("hero.trust")}</p>
                    </div>
                    <div className="umd-home-finder">
                        <form action={t.t("routes.catalog")} method="get" role="search">
                            <label htmlFor="home-search" className="block font-display font-bold text-lg text-umd-slate-900 mb-3">
                                {t.t("hero.search.label")}
                            </label>
                            <div className="flex gap-2">
                                <div className="umd-field flex-1">
                                    <Search aria-hidden="true" />
                                    <input id="home-search" name="q" type="search" autoComplete="off"
                                        className="umd-input umd-has-ic" placeholder={t.t("hero.search.placeholder")} />
                                </div>
                                <button type="submit" className="umd-btn umd-btn-primary">{t.t("hero.search.submit")}</button>
                            </div>
                        </form>
                        <p className="text-sm text-umd-slate-600 mt-5 mb-2">{t.t("hero.popular")}</p>
                        <ul className="list-none p-0 m-0 flex flex-wrap gap-2">
                            {popular.map((s) => (
                                <li key={s.slug}>
                                    <Link href={ficheHref(lang, s.slug)} prefetch={false} className="umd-home-chip">
                                        {s.logo && <Image src={s.logo} alt="" width={22} height={22} unoptimized />}
                                        {s.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Link href={t.t("routes.protect")} prefetch={false}
                            className="inline-flex items-center gap-1.5 mt-6 text-sm font-bold" style={{ color: "var(--indigo-700)" }}>
                            {t.t("hero.guided")} <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>

            <HomeKeyQuotes lang={lang} />

            <HomeRecentActivity lang={lang} />

            <section aria-labelledby="tools-heading" className="py-14 md:py-16 bg-white border-t border-umd-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 id="tools-heading" className="umd-heading-2 mb-8">{t.t("tools.title")}</h2>
                    <ul className="umd-home-tools list-none p-0 m-0 grid md:grid-cols-3">
                        {tools.map(({ key, href }) => (
                            <li key={key}>
                                <h3 className="umd-heading-3 mb-2">{t.t(`tools.${key}.title`)}</h3>
                                <p className="text-umd-slate-600 leading-relaxed mb-3">{t.t(`tools.${key}.desc`)}</p>
                                <Link href={href} prefetch={false} className="inline-flex items-center gap-1.5 font-bold" style={{ color: "var(--indigo-700)" }}>
                                    {t.t(`tools.${key}.cta`, n)} <ArrowRight size={15} aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section aria-labelledby="faq-heading" className="py-14 md:py-16 border-t border-umd-slate-200" style={{ background: "var(--slate-50)" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 id="faq-heading" className="umd-heading-2 mb-8">{t.t("faq.title")}</h2>
                    <div className="space-y-3 max-w-3xl">
                        {[1, 2, 3, 4].map((i) => (
                            <details key={i} className="umd-card group">
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
                                            <a href="https://github.com/les-enovateurs/unlock-my-data" target="_blank" rel="noopener noreferrer"
                                                className="umd-btn umd-btn-outline umd-btn-sm">
                                                {t.t("contribute.code.label")}
                                            </a>
                                            <Link href={lang === "fr" ? "/contributeurs" : "/contributors"} className="umd-btn umd-btn-outline umd-btn-sm">
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
        </div>
    );
}
