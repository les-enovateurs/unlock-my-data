"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BrandLogo from "@/components/BrandLogo";
import ServiceCardBody, { CARD_VARIANTS, type CardVariant } from "@/components/ServiceCardBody";
import type { CatalogService } from "@/components/CatalogContent";

const EmbedMap = dynamic(() => import("@/components/EmbedMap"), { ssr: false });

const T: Record<string, Record<string, string>> = {
    fr: { offeredBy: "Service proposé par", by: "Analyses indépendantes par", tagline: "Découvrez ce que vos applis font de vos données", empty: "Aucune application sélectionnée." },
    en: { offeredBy: "A service by", by: "Independent analyses by", tagline: "Find out what your apps do with your data", empty: "No application selected." },
};

type Group = { title: string; services: CatalogService[] };
export type EmbedView = "cards" | "map";
type Config = { lang: "fr" | "en"; view: EmbedView; variant: CardVariant; groups: Group[]; campaign: string };

// URL contract, kept short enough to hand-write:
//   ?s=Title:slug-a,slug-b&s=slug-c&card=compact|standard|detailed&lang=fr|en&view=cards|map
// Each `s` is one group; the title before the colon is optional. The map ignores groups.
function parseConfig(search: string, referrer: string, services: CatalogService[]): Config {
    const params = new URLSearchParams(search);
    const bySlug = new Map(services.map((s) => [s.slug, s]));
    const groups = params.getAll("s").map((raw) => {
        const colon = raw.lastIndexOf(":");
        const slugs = raw.slice(colon + 1).split(",").map((x) => x.trim());
        return {
            title: colon > 0 ? raw.slice(0, colon).trim() : "",
            services: slugs.flatMap((slug) => bySlug.get(slug) ?? []),
        };
    }).filter((g) => g.services.length);
    const card = params.get("card") as CardVariant;
    // embed.js passes the partner's hostname; a raw <iframe> only leaves the referrer.
    let campaign = params.get("host") || "direct";
    if (!params.get("host")) {
        try { campaign = new URL(referrer).hostname; } catch { /* no referrer: opened outside an iframe */ }
    }
    return {
        lang: params.get("lang") === "en" ? "en" : "fr",
        view: params.get("view") === "map" ? "map" : "cards",
        variant: CARD_VARIANTS.includes(card) ? card : "standard",
        groups,
        campaign,
    };
}

export default function EmbedWidget({ services }: { services: CatalogService[] }) {
    const [config, setConfig] = useState<Config | null>(null);

    // Read on mount: the page is statically exported, so the query string only exists in the browser.
    useEffect(() => {
        setConfig(parseConfig(window.location.search, document.referrer, services));
    }, [services]);

    // Tell embed.js how tall the cards are, so the partner's page shows no inner scrollbar.
    // The map sizes itself on the frame height, so it never reports.
    useEffect(() => {
        if (!config || config.view === "map" || window.parent === window) return;
        const report = () => window.parent.postMessage({ type: "umd-embed-height", height: document.body.scrollHeight }, "*");
        const observer = new ResizeObserver(report);
        observer.observe(document.body);
        return () => observer.disconnect();
    }, [config]);

    if (!config) return null;
    const { lang, view, variant, groups, campaign } = config;
    const t = (k: string) => T[lang][k];
    const track = (path: string) =>
        `${path}?utm_source=widget&utm_medium=embed&utm_campaign=${encodeURIComponent(campaign)}`;
    const ficheBase = lang === "fr" ? "/liste-applications" : "/list-app";
    const grid = variant === "compact"
        ? "grid grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-3"
        : "grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4";

    return (
        <div className="flex flex-col bg-white">
            <div className="p-4 flex flex-col gap-6">
                <a href={track(lang === "fr" ? "/" : "/en/")} target="_blank" rel="noopener"
                    className="self-end -mb-2 inline-flex items-center gap-2 text-xs text-umd-slate-600 no-underline">
                    {t("offeredBy")}
                    <BrandLogo size={18} />
                </a>
                {groups.length === 0 && <p className="text-umd-slate-600 text-center py-10">{t("empty")}</p>}
                {view === "map" && groups.length > 0 && (
                    <div className="-mx-4">
                        <EmbedMap lang={lang} slugs={groups.flatMap((g) => g.services.map((s) => s.slug))}
                            fullMapHref={track(lang === "fr" ? "/transferts/" : "/transfers/")} />
                    </div>
                )}
                {view === "cards" && groups.map((g, i) => (
                    <section key={i} className="flex flex-col gap-3">
                        {g.title && <h2 className="font-display font-bold text-lg m-0">{g.title}</h2>}
                        <ul className={`${grid} list-none p-0 m-0`}>
                            {g.services.map((s) => (
                                <li key={s.slug} className="h-full">
                                    <a
                                        href={track(`${ficheBase}/${s.slug}/`)}
                                        target="_blank"
                                        rel="noopener"
                                        className={`umd-card umd-card-hover h-full flex flex-col no-underline text-inherit ${variant === "compact" ? "p-3 gap-2" : "p-4.5 gap-3.5"}`}
                                    >
                                        <ServiceCardBody service={s} lang={lang} variant={variant} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
            <a
                href={track(lang === "fr" ? "/" : "/en/")}
                target="_blank"
                rel="noopener"
                className="sticky bottom-0 flex items-center gap-3 px-4 py-3 bg-umd-indigo-800 text-white no-underline"
            >
                <BrandLogo size={22} dark withWordmark={false} />
                <span className="min-w-0 text-sm leading-tight">
                    <span className="opacity-80">{t("by")} </span>
                    <strong className="font-display">Unlock My Data</strong>
                    <span className="block opacity-80 text-xs">{t("tagline")} →</span>
                </span>
            </a>
        </div>
    );
}
