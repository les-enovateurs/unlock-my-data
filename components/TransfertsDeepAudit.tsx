"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Globe, Plane, ShieldCheck, ArrowRight, Search, Plus, Sparkles, RotateCcw } from "lucide-react";
import servicesData from "../public/data/services.json";
import { PROTECT_DATA_SELECTION_KEY, type Service } from "@/constants/protectData";
import { getCountryByCode } from "@/lib/map/country-coordinates";
import ProtectActionDrawer, { type DrawerMode } from "./protect-my-data/ProtectActionDrawer";

type Lang = "fr" | "en";

// Client-only: the map measures its box and fetches the fiches it draws.
const DataRadar = dynamic(() => import("./DataRadar"), { ssr: false });

const ALL: Service[] = (servicesData as Service[]).filter((s) => s && s.slug && s.name);
const BY_SLUG: Record<string, Service> = Object.fromEntries(ALL.map((s) => [s.slug, s]));

const isEU = (s?: Service | null): boolean => !!(s?.country_code && getCountryByCode(s.country_code)?.isEU);
const countryLabel = (s: Service, lang: Lang): string => {
    const c = s.country_code ? getCountryByCode(s.country_code) : null;
    if (c) return lang === "fr" ? c.name : c.nameEn;
    return s.country_name || s.nationality || (lang === "fr" ? "à l'étranger" : "abroad");
};

const DEFAULT_POPULAR = ["instagram", "tiktok", "linkedin", "amazon", "aliexpress", "netflix"];

const COPY = {
    fr: {
        eyebrow: "Audit approfondi",
        title: "Le voyage de vos données",
        lead: "Sélectionnez vos applications du quotidien. Visualisez où partent vos données dans le monde, puis migrez vers des alternatives qui restent près de vous.",
        searchPh: "Rechercher une application…",
        reset: "Tout désélectionner",
        mapTitle: "Vos données s'éloignent de vous",
        selectPrompt: "Ajoutez au moins une application depuis la recherche, à côté de la carte.",
        migrateTitle: "Migrer, application par application",
        migrateLead: "Alternatives européennes éprouvées pour les grands services ; sinon, on vous accompagne pour limiter l'exposition.",
        sovereign: "Souverain",
        europe: "Europe",
        hostedIn: (c: string) => `Données hébergées en Europe (${c}).`,
        dataTo: (c: string) => `Données vers ${c}`,
        alternatives: "Alternatives qui restent près de vous",
        seeSheet: "Voir la fiche",
        deleteCta: "Supprimer mes données",
    },
    en: {
        eyebrow: "Deep audit",
        title: "The journey of your data",
        lead: "Pick your everyday apps. See where your data travels around the world, then migrate to alternatives that stay close to you.",
        searchPh: "Search for an app…",
        reset: "Clear selection",
        mapTitle: "Your data is travelling away from you",
        selectPrompt: "Add at least one app from the search next to the map.",
        migrateTitle: "Migrate, app by app",
        migrateLead: "Proven European alternatives for major services; otherwise, we help you limit exposure.",
        sovereign: "Sovereign",
        europe: "Europe",
        hostedIn: (c: string) => `Data hosted in Europe (${c}).`,
        dataTo: (c: string) => `Data sent to ${c}`,
        alternatives: "Alternatives that stay close to you",
        seeSheet: "View profile",
        deleteCta: "Delete my data",
    },
} as const;

function Avatar({ s, size = 36 }: { s: Service; size?: number }) {
    return (
        <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-umd-slate-100" style={{ width: size, height: size }}>
            {s.logo ? (
                <Image src={s.logo} alt="" width={size} height={size} className="h-full w-full object-contain" />
            ) : (
                <span className="font-display text-sm font-bold text-umd-slate-500">{s.name.charAt(0)}</span>
            )}
        </span>
    );
}

function MigrationCard({ s, lang }: { s: Service; lang: Lang }) {
    const c = COPY[lang];
    const [drawer, setDrawer] = useState<{ mode: DrawerMode; alt: Service | null } | null>(null);
    const drawerEl = drawer && (
        <ProtectActionDrawer
            lang={lang}
            mode={drawer.mode}
            service={s}
            alt={drawer.alt}
            onClose={() => setDrawer(null)}
            onMode={(mode) => setDrawer((d) => (d ? { ...d, mode } : d))}
        />
    );

    if (isEU(s)) {
        return (
            <div className="umd-card mb-3.5 flex break-inside-avoid items-center gap-3.5 p-4">
                <Avatar s={s} />
                <div className="flex-1">
                    <div className="font-display text-[15px] font-bold">{s.name}</div>
                    <div className="text-[13px] text-umd-slate-500">{c.hostedIn(countryLabel(s, lang))}</div>
                </div>
                <span className="umd-chip umd-chip-safe whitespace-nowrap"><ShieldCheck aria-hidden="true" />{s.country_code?.toLowerCase() === "fr" ? c.sovereign : c.europe}</span>
            </div>
        );
    }

    // Only EU-based alternatives: the heading promises they stay close to you. None → deletion alone.
    const alts = (s.alternatives ?? [])
        .map((slug) => BY_SLUG[slug])
        .filter((a): a is Service => isEU(a))
        .slice(0, 3);

    return (
        <div className="umd-card mb-3.5 break-inside-avoid p-4">
            <div className="mb-3 flex items-center gap-3.5">
                <Avatar s={s} />
                <div className="min-w-0 flex-1">
                    <div className="font-display text-[15px] font-bold">{s.name}</div>
                    <span className="umd-chip umd-chip-danger mt-1 whitespace-nowrap"><Plane aria-hidden="true" />{c.dataTo(countryLabel(s, lang))}</span>
                </div>
            </div>

            {alts.length > 0 && (
                <>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-umd-slate-400">{c.alternatives}</p>
                    <div className="mb-3 flex flex-col gap-2">
                        {alts.map((a) => (
                            <button key={a.slug} type="button" onClick={() => setDrawer({ mode: "compare", alt: a })} className="flex items-center gap-2.5 rounded-lg border border-umd-slate-200 p-2 text-left hover:border-umd-indigo-300 hover:bg-umd-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300">
                                <Avatar s={a} size={26} />
                                <span className="flex-1 text-sm font-semibold">{a.name}</span>
                                <ArrowRight className="h-4 w-4 text-umd-slate-400" aria-hidden="true" />
                            </button>
                        ))}
                    </div>
                </>
            )}

            <button type="button" onClick={() => setDrawer({ mode: "delete", alt: null })} className="umd-btn umd-btn-outline umd-btn-sm w-full">{c.deleteCta}</button>
            {drawerEl}
        </div>
    );
}

export default function TransfertsDeepAudit({ lang = "fr" }: { lang?: Lang }) {
    const c = COPY[lang];
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<string[]>(() =>
        DEFAULT_POPULAR.filter((slug) => BY_SLUG[slug])
    );

    // Hydrate from the shared protect-data selection if the user already made one.
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(PROTECT_DATA_SELECTION_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            const slugs: string[] = parsed?.selectedServices || parsed?.selected || [];
            const valid = slugs.filter((slug) => BY_SLUG[slug]);
            if (valid.length > 0) setSelected(valid);
        } catch {
            /* ignore malformed storage */
        }
    }, []);

    const toggle = (slug: string) =>
        setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

    const chosen = useMemo(() => selected.map((slug) => BY_SLUG[slug]).filter(Boolean) as Service[], [selected]);

    const matches = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? ALL.filter((s) => !selected.includes(s.slug) && s.name.toLowerCase().includes(q)).slice(0, 8) : [];
    }, [query, selected]);

    const add = (slug: string) => {
        toggle(slug);
        setQuery("");
    };

    const picker = (
        <div className="mb-5">
            <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="umd-heading-3 text-base">{c.mapTitle}</h2>
                {selected.length > 0 && (
                    <button type="button" onClick={() => setSelected([])} className="umd-btn umd-btn-ghost umd-btn-sm">
                        <RotateCcw aria-hidden="true" />
                        {c.reset}
                    </button>
                )}
            </div>
            <div className="umd-field">
                <Search aria-hidden="true" />
                <input
                    type="search"
                    className="umd-input umd-has-ic"
                    placeholder={c.searchPh}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && matches[0] && add(matches[0].slug)}
                    aria-label={c.searchPh}
                />
            </div>
            {matches.length > 0 && (
                <ul className="m-0 mt-1 flex list-none flex-col rounded-xl border border-umd-slate-200 p-1">
                    {matches.map((s) => (
                        <li key={s.slug}>
                            <button
                                type="button"
                                onClick={() => add(s.slug)}
                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-umd-indigo-50 focus-visible:outline-2 focus-visible:outline-umd-indigo-500"
                            >
                                <Avatar s={s} size={24} />
                                <span className="flex-1 truncate">{s.name}</span>
                                <Plus className="h-4 w-4 text-umd-indigo-700" aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <div className="bg-white text-umd-slate-900">
            <section className="border-b border-umd-slate-200 bg-gradient-to-b from-umd-indigo-50 to-white">
                <div className="mx-auto max-w-5xl px-6 py-6">
                    <span className="umd-pill umd-pill-indigo mb-2">
                        <Globe aria-hidden="true" />
                        {c.eyebrow}
                    </span>
                    <h1 className="umd-heading-2 mb-1">{c.title}</h1>
                    <p className="max-w-3xl text-sm text-umd-slate-700">{c.lead}</p>
                </div>
            </section>

            <DataRadar lang={lang} selectedServices={chosen} picker={picker} onRemove={toggle} />

            <div className="mx-auto max-w-5xl px-6 py-12">
                {/* Migration */}
                <h2 className="umd-heading-3 mb-1 text-base">{c.migrateTitle}</h2>
                <p className="mb-5 text-sm text-umd-slate-500">{c.migrateLead}</p>
                {chosen.length === 0 ? (
                    <p className="py-8 text-center text-sm text-umd-slate-600">{c.selectPrompt}</p>
                ) : (
                    <div className="gap-3.5 md:columns-2">
                        {chosen.map((s) => <MigrationCard key={s.slug} s={s} lang={lang} />)}
                    </div>
                )}

                <div className="mt-12 flex flex-wrap gap-3">
                    <Link href={lang === "fr" ? "/proteger-mes-donnees" : "/protect-my-data"} className="umd-btn umd-btn-primary">
                        <Sparkles className="h-[18px] w-[18px]" aria-hidden="true" />
                        {lang === "fr" ? "Faire l'audit complet" : "Run the full audit"}
                    </Link>
                    <Link href={lang === "fr" ? "/comparer" : "/compare"} className="umd-btn umd-btn-outline">
                        {lang === "fr" ? "Comparer les services" : "Compare services"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
