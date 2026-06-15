"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Globe, Plane, ShieldCheck, ArrowRight, Search, Check, Sparkles } from "lucide-react";
import servicesData from "../public/data/services.json";
import { getAlternatives, PROTECT_DATA_SELECTION_KEY, type Service } from "@/constants/protectData";
import { getCountryByCode } from "@/lib/map/country-coordinates";

type Lang = "fr" | "en";

// Lazy: the heavy react-simple-maps bundle loads only when a selection exists.
const DataTransferMap = dynamic(() => import("./DataTransferMap"), { ssr: false });

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
        pickTitle: "Vos applications les plus utilisées",
        searchPh: "Rechercher une application…",
        mapTitle: "Vos données s'éloignent de vous",
        allEU: "Toutes vos applications sélectionnées restent dans la frontière européenne. 👏",
        selectPrompt: "Sélectionnez au moins une application ci-dessus.",
        migrateTitle: "Migrer, application par application",
        migrateLead: "Alternatives européennes éprouvées pour les grands services ; sinon, on vous accompagne pour limiter l'exposition.",
        sovereign: "Souverain",
        hostedIn: (c: string) => `Données hébergées en Europe (${c}).`,
        dataTo: (c: string) => `Données vers ${c}`,
        alternatives: "Alternatives qui restent près de vous",
        noAlt: "Pas d'alternative évidente. Limitez l'exposition :",
        noAltSteps: ["Réglez la confidentialité au minimum", "Supprimez les données déjà publiées", "Exportez puis fermez le compte si possible"],
        seeSheet: "Voir la fiche",
        deleteCta: "Supprimer mes données",
        appsOutFew: (n: number) => `${n} application fait franchir à vos données la frontière européenne — hors de la protection du RGPD.`,
        appsOutMany: (n: number) => `${n} applications font franchir à vos données la frontière européenne — hors de la protection du RGPD.`,
    },
    en: {
        eyebrow: "Deep audit",
        title: "The journey of your data",
        lead: "Pick your everyday apps. See where your data travels around the world, then migrate to alternatives that stay close to you.",
        pickTitle: "Your most-used apps",
        searchPh: "Search for an app…",
        mapTitle: "Your data is travelling away from you",
        allEU: "All your selected apps stay within the European border. 👏",
        selectPrompt: "Select at least one app above.",
        migrateTitle: "Migrate, app by app",
        migrateLead: "Proven European alternatives for major services; otherwise, we help you limit exposure.",
        sovereign: "Sovereign",
        hostedIn: (c: string) => `Data hosted in Europe (${c}).`,
        dataTo: (c: string) => `Data sent to ${c}`,
        alternatives: "Alternatives that stay close to you",
        noAlt: "No obvious alternative. Limit exposure:",
        noAltSteps: ["Set privacy to the minimum", "Delete data already published", "Export then close the account if possible"],
        seeSheet: "View profile",
        deleteCta: "Delete my data",
        appsOutFew: (n: number) => `${n} app sends your data across the European border — outside GDPR protection.`,
        appsOutMany: (n: number) => `${n} apps send your data across the European border — outside GDPR protection.`,
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
    const ficheBase = lang === "fr" ? "/liste-applications" : "/list-app";
    const deleteHref = lang === "fr" ? "/supprimer-mes-donnees" : "/delete-my-data";

    if (isEU(s)) {
        return (
            <div className="umd-card flex items-center gap-3.5 p-4">
                <Avatar s={s} />
                <div className="flex-1">
                    <div className="font-display text-[15px] font-bold">{s.name}</div>
                    <div className="text-[13px] text-umd-slate-500">{c.hostedIn(countryLabel(s, lang))}</div>
                </div>
                <span className="umd-chip umd-chip-safe whitespace-nowrap"><ShieldCheck aria-hidden="true" />{c.sovereign}</span>
            </div>
        );
    }

    // outside EU → suggest EU-hosted alternatives present in the dataset
    const alts = getAlternatives(s.slug)
        .map((slug) => BY_SLUG[slug])
        .filter((a): a is Service => !!a)
        .sort((a, b) => Number(isEU(b)) - Number(isEU(a)))
        .slice(0, 3);

    return (
        <div className="umd-card p-4">
            <div className="mb-3 flex items-center gap-3.5">
                <Avatar s={s} />
                <div className="min-w-0 flex-1">
                    <div className="font-display text-[15px] font-bold">{s.name}</div>
                    <span className="umd-chip umd-chip-danger mt-1 whitespace-nowrap"><Plane aria-hidden="true" />{c.dataTo(countryLabel(s, lang))}</span>
                </div>
            </div>

            {alts.length > 0 ? (
                <>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-umd-slate-400">{c.alternatives}</p>
                    <div className="mb-3 flex flex-col gap-2">
                        {alts.map((a) => (
                            <Link key={a.slug} href={`${ficheBase}/${a.slug}`} className="flex items-center gap-2.5 rounded-lg border border-umd-slate-200 p-2 hover:border-umd-indigo-300 hover:bg-umd-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300">
                                <Avatar s={a} size={26} />
                                <span className="flex-1 text-sm font-semibold">{a.name}</span>
                                {isEU(a) && <span className="umd-chip umd-chip-safe">UE</span>}
                                <ArrowRight className="h-4 w-4 text-umd-slate-400" aria-hidden="true" />
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <p className="mb-2 text-[13px] leading-relaxed text-umd-slate-500">{c.noAlt}</p>
                    <ul className="mb-3 flex flex-col gap-2">
                        {c.noAltSteps.map((step) => (
                            <li key={step} className="flex items-start gap-2 text-[13px] text-umd-slate-600">
                                <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-umd-indigo-600" aria-hidden="true" />{step}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <Link href={deleteHref} className="umd-btn umd-btn-outline umd-btn-sm w-full">{c.deleteCta}</Link>
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
    const offEu = chosen.filter((s) => !isEU(s)).length;

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = q ? ALL.filter((s) => s.name.toLowerCase().includes(q)) : ALL;
        // keep selected first, then alphabetical; cap to a sane number when not searching
        const sorted = [...list].sort((a, b) => {
            const sa = selected.includes(a.slug) ? 0 : 1;
            const sb = selected.includes(b.slug) ? 0 : 1;
            return sa - sb || a.name.localeCompare(b.name);
        });
        return q ? sorted.slice(0, 60) : sorted.slice(0, 48);
    }, [query, selected]);

    return (
        <div className="bg-white text-umd-slate-900">
            {/* Hero */}
            <section className="border-b border-umd-slate-200 bg-gradient-to-b from-umd-indigo-50 to-white">
                <div className="mx-auto max-w-5xl px-6 py-14">
                    <span className="umd-pill umd-pill-indigo mb-4">
                        <Globe aria-hidden="true" />
                        {c.eyebrow}
                    </span>
                    <h1 className="umd-heading-1 mb-3">{c.title}</h1>
                    <p className="umd-lead-text max-w-2xl">{c.lead}</p>
                </div>
            </section>

            <div className="mx-auto max-w-5xl px-6 py-12">
                {/* App picker */}
                <h2 className="umd-heading-3 mb-3 text-base">{c.pickTitle}</h2>
                <div className="umd-field mb-4 max-w-md">
                    <Search aria-hidden="true" />
                    <input
                        type="search"
                        className="umd-input umd-has-ic"
                        placeholder={c.searchPh}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label={c.searchPh}
                    />
                </div>
                <div className="mb-10 flex flex-wrap gap-2">
                    {visible.map((s) => {
                        const on = selected.includes(s.slug);
                        return (
                            <button
                                key={s.slug}
                                type="button"
                                onClick={() => toggle(s.slug)}
                                aria-pressed={on}
                                className={`umd-chip ${on ? "border-umd-indigo-500 bg-umd-indigo-50 text-umd-indigo-800" : "umd-chip-neutral"} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300`}
                            >
                                <Avatar s={s} size={20} />
                                {s.name}
                                {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                            </button>
                        );
                    })}
                </div>

                {/* Summary + map */}
                <h2 className="umd-heading-3 mb-1 text-base">{c.mapTitle}</h2>
                <p className="mb-4 text-sm text-umd-slate-500">
                    {chosen.length === 0
                        ? c.selectPrompt
                        : offEu > 0
                            ? (offEu > 1 ? c.appsOutMany(offEu) : c.appsOutFew(offEu))
                            : c.allEU}
                </p>

                {chosen.length > 0 && <DataTransferMap lang={lang} selectedServices={chosen} />}

                {/* Migration */}
                <h2 className="umd-heading-3 mb-1 mt-12 text-base">{c.migrateTitle}</h2>
                <p className="mb-5 text-sm text-umd-slate-500">{c.migrateLead}</p>
                {chosen.length === 0 ? (
                    <p className="py-8 text-center text-sm text-umd-slate-400">{c.selectPrompt}</p>
                ) : (
                    <div className="grid gap-3.5 md:grid-cols-2">
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
