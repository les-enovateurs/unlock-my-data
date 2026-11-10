"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy, HeartHandshake, Plus, Search, X } from "lucide-react";
import { CARD_VARIANTS, type CardVariant } from "@/components/ServiceCardBody";
import type { CatalogService } from "@/components/CatalogContent";
import type { EmbedView } from "@/components/EmbedWidget";
import { EMBED_PRESETS, resolvePreset, type EmbedPreset } from "@/data/embedPresets";

const SITE_URL = "https://unlock-my-data.com";
const DONATION_URL = "https://les-enovateurs.com/dons#dons";
const SUBSCRIPTION_URL = "https://les-enovateurs.com/abonnement";
const MAP_HEIGHT = 800;
const MIN_PREVIEW_HEIGHT = 200;

const T = {
    fr: {
        title: "Affichez nos analyses sur votre site",
        lead: "Association, média, institution, entreprise : choisissez les applications qui comptent pour votre public et intégrez nos analyses à vos sites. Toujours à jour : quand une fiche change, votre page change aussi.",
        presets: "Partir d'un exemple",
        step1: "Choisissez les applications",
        step1Help: "Cliquez sur une application pour l'ajouter au groupe sélectionné. Les groupes sont facultatifs et servent à classer vos applications.",
        groupTitle: "Titre du groupe (facultatif)",
        addGroup: "Ajouter un groupe",
        removeGroup: "Supprimer ce groupe",
        emptyGroup: "Aucune application dans ce groupe.",
        search: "Rechercher une application…",
        step2: "Choisissez l'affichage",
        view: "Type de widget",
        views: { cards: "Fiches", map: "Carte des transferts" } as Record<EmbedView, string>,
        viewsHelp: { cards: "Une carte par application", map: "Où partent les données de ces applications, et vers quelles entreprises" } as Record<EmbedView, string>,
        card: "Style des fiches",
        cards: { compact: "Compacte", standard: "Standard", detailed: "Détaillée" } as Record<CardVariant, string>,
        cardsHelp: { compact: "Logo, nom et pays", standard: "Avec les badges traceurs et fuites", detailed: "Avec les chiffres et un lien vers l'analyse" } as Record<CardVariant, string>,
        language: "Langue du widget",
        height: "Hauteur (px)",
        noScript: "Votre site n'accepte pas les scripts ?",
        noScriptHelp: "Certains hébergeurs (WordPress.com en offre gratuite, par exemple) bloquent les scripts. Utilisez alors ce code : la hauteur y est fixe, calculée d'après l'aperçu.",
        step3: "Copiez le code",
        step3Help: "Collez ce code dans votre page : sous WordPress, dans un bloc « HTML personnalisé » ; sous Wix, Webflow ou Squarespace, dans un bloc « Intégrer du code ». Le widget prend tout seul la hauteur de son contenu.",
        copy: "Copier le code",
        copied: "Copié",
        preview: "Aperçu",
        remove: "Retirer",
        supportTitle: "Soutenez le projet, à prix libre",
        supportText: "Unlock My Data est porté par Les e-novateurs, média et association indépendants. Si le widget vous est utile, contribuez du montant qui vous semble juste : chaque fiche analysée demande des heures de travail.",
        supportCta: "Faire un don",
        subscribeCta: "S'abonner au média",
        faqTitle: "Questions fréquentes",
        faq: [
            ["Dois-je mettre le code à jour quand une analyse change ?", "Non. Le widget affiche toujours la dernière version publiée de chaque fiche."],
            ["Comment modifier ma sélection ?", "Revenez sur cette page, recomposez votre sélection et remplacez l'ancien code par le nouveau."],
            ["Une application me manque", "Proposez-la depuis la page Contribuer : une bénévole rédige sa fiche, et elle devient disponible dans le widget dès sa publication."],
        ],
    },
    en: {
        title: "Show our analyses on your website",
        lead: "Non-profit, newsroom, institution, company: pick the apps that matter to your audience and embed our analyses on your websites. Always up to date: when a fiche changes, your page changes too.",
        presets: "Start from an example",
        step1: "Pick the applications",
        step1Help: "Click an application to add it to the selected group. Groups are optional and help you sort your applications.",
        groupTitle: "Group title (optional)",
        addGroup: "Add a group",
        removeGroup: "Remove this group",
        emptyGroup: "No application in this group.",
        search: "Search for an application…",
        step2: "Pick the layout",
        view: "Widget type",
        views: { cards: "App cards", map: "Data transfer map" } as Record<EmbedView, string>,
        viewsHelp: { cards: "One card per application", map: "Where these applications send data, and to which companies" } as Record<EmbedView, string>,
        card: "Card style",
        cards: { compact: "Compact", standard: "Standard", detailed: "Detailed" } as Record<CardVariant, string>,
        cardsHelp: { compact: "Logo, name and country", standard: "With tracker and breach badges", detailed: "With figures and a link to the analysis" } as Record<CardVariant, string>,
        language: "Widget language",
        height: "Height (px)",
        noScript: "Your site does not accept scripts?",
        noScriptHelp: "Some hosts (WordPress.com on the free plan, for instance) block scripts. Use this code instead: its height is fixed, computed from the preview.",
        step3: "Copy the code",
        step3Help: "Paste this code into your page: in WordPress, use a \"Custom HTML\" block; in Wix, Webflow or Squarespace, use an \"Embed code\" block. The widget sizes itself to its content.",
        copy: "Copy the code",
        copied: "Copied",
        preview: "Preview",
        remove: "Remove",
        supportTitle: "Support the project, pay what you want",
        supportText: "Unlock My Data is run by Les e-novateurs, an independent media outlet and non-profit. If the widget is useful to you, contribute whatever amount feels fair: every analysed fiche takes hours of work.",
        supportCta: "Donate",
        subscribeCta: "Subscribe to the media",
        faqTitle: "Frequently asked questions",
        faq: [
            ["Do I need to update the code when an analysis changes?", "No. The widget always shows the latest published version of each fiche."],
            ["How do I change my selection?", "Come back to this page, rebuild your selection and replace the old code with the new one."],
            ["An application is missing", "Suggest it from the Contribute page: a volunteer writes its fiche, and it becomes available in the widget as soon as it is published."],
        ],
    },
};

type Group = { title: string; slugs: string[] };


export default function EmbedBuilder({ lang, services }: { lang: "fr" | "en"; services: CatalogService[] }) {
    const t = T[lang];
    const bySlug = useMemo(() => new Map(services.map((s) => [s.slug, s])), [services]);
    const [groups, setGroups] = useState<Group[]>(() => resolvePreset(EMBED_PRESETS[0], lang, services));
    const [active, setActive] = useState(0);
    const [q, setQ] = useState("");
    const [view, setView] = useState<EmbedView>("cards");
    const [variant, setVariant] = useState<CardVariant>(EMBED_PRESETS[0].card);
    const [presetId, setPresetId] = useState(EMBED_PRESETS[0].id);
    const [widgetLang, setWidgetLang] = useState<"fr" | "en">(lang);
    const [height, setHeight] = useState(700);
    const [copied, setCopied] = useState(false);
    const observer = useRef<ResizeObserver | null>(null);

    // The preview is same-origin, so its content height can be read and copied into the snippet.
    const preview = useRef<HTMLIFrameElement>(null);
    const fitPreview = () => {
        observer.current?.disconnect();
        const body = preview.current?.contentDocument?.body;
        // The map sizes itself on the frame height, so fitting the frame to it would loop.
        if (view === "map") return setHeight(MAP_HEIGHT);
        if (!body) return;
        // A document being unloaded or not yet rendered measures 0. Applying that would
        // collapse the frame, and Chrome stops rendering a zero-height frame for good.
        observer.current = new ResizeObserver(() => {
            if (body.scrollHeight > MIN_PREVIEW_HEIGHT) setHeight(Math.ceil(body.scrollHeight));
        });
        observer.current.observe(body);
    };

    // The first load can finish before hydration, so React never sees its load event.
    useEffect(() => {
        if (preview.current?.contentDocument?.readyState === "complete") fitPreview();
        return () => observer.current?.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
    }, []);

    const updateGroup = (i: number, patch: Partial<Group>) => {
        setGroups((gs) => gs.map((g, j) => (j === i ? { ...g, ...patch } : g)));
        setPresetId("");
    };
    const toggleApp = (slug: string) => {
        const slugs = groups[active].slugs;
        updateGroup(active, { slugs: slugs.includes(slug) ? slugs.filter((s) => s !== slug) : [...slugs, slug] });
    };
    const applyPreset = (preset: EmbedPreset) => {
        setGroups(resolvePreset(preset, lang, services));
        setVariant(preset.card);
        setPresetId(preset.id);
        setActive(0);
    };
    const removeGroup = (i: number) => {
        setGroups((gs) => gs.filter((_, j) => j !== i));
        setActive(0);
    };

    const matches = useMemo(() => {
        const needle = q.trim().toLowerCase();
        return needle ? services.filter((s) => s.name.toLowerCase().includes(needle)).slice(0, 30) : [];
    }, [q, services]);

    const query = [
        ...groups.filter((g) => g.slugs.length).map((g) =>
            `s=${g.title.trim() ? encodeURIComponent(g.title.trim()) + ":" : ""}${g.slugs.join(",")}`),
        view === "map" ? "view=map" : `card=${variant}`,
        `lang=${widgetLang}`,
    ].join("&");
    const embedPath = `/embed/?${query}`;
    const attr = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    const dataGroups = groups.filter((g) => g.slugs.length)
        .map((g) => `${g.title.trim() ? g.title.trim() + ":" : ""}${g.slugs.join(",")}`).join("|");
    const scriptSnippet = `<script src="${SITE_URL}/embed.js" async data-groups="${attr(dataGroups)}" ${
        view === "map" ? `data-view="map" data-height="${height}"` : `data-card="${variant}"`} data-lang="${widgetLang}"></script>`;
    const iframeSnippet = `<iframe src="${SITE_URL}${embedPath}" title="Unlock My Data" width="100%" height="${height}" style="border:0" loading="lazy"></iframe>`;

    const copy = async (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
        const area = e.currentTarget.parentElement?.querySelector("textarea");
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            area?.select();
        }
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
            <h1 className="umd-heading-1 mb-1.5">{t.title}</h1>
            <p className="umd-lead-text mt-0 mb-10 max-w-3xl">{t.lead}</p>

            <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 items-start">
                <div className="flex flex-col gap-8 min-w-0">
                    <section className="flex flex-col gap-2">
                        <h2 className="text-sm font-semibold text-umd-slate-600 m-0">{t.presets}</h2>
                        <div className="flex flex-wrap gap-2">
                            {EMBED_PRESETS.map((p) => (
                                <button key={p.id} type="button" aria-pressed={presetId === p.id} onClick={() => applyPreset(p)}
                                    className={"umd-btn umd-btn-sm " + (presetId === p.id ? "umd-btn-primary" : "umd-btn-outline")}>
                                    {p.label[lang]}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="flex flex-col gap-3">
                        <h2 className="font-display font-bold text-xl m-0">1. {t.step1}</h2>
                        <p className="text-umd-slate-600 text-sm m-0">{t.step1Help}</p>

                        {groups.map((g, i) => (
                            <div
                                key={i}
                                onClick={() => setActive(i)}
                                className={`umd-card p-3 flex flex-col gap-2 cursor-pointer ${i === active ? "ring-2 ring-umd-indigo-500" : ""}`}
                            >
                                <div className="flex gap-2 items-center">
                                    <input
                                        id={`group-title-${i}`}
                                        className="umd-input flex-1 min-w-0"
                                        placeholder={t.groupTitle}
                                        aria-label={t.groupTitle}
                                        value={g.title}
                                        onFocus={() => setActive(i)}
                                        onChange={(e) => updateGroup(i, { title: e.target.value })}
                                    />
                                    {groups.length > 1 && (
                                        <button type="button" className="umd-btn umd-btn-ghost umd-btn-sm" aria-label={t.removeGroup}
                                            onClick={(e) => { e.stopPropagation(); removeGroup(i); }}>
                                            <X aria-hidden="true" />
                                        </button>
                                    )}
                                </div>
                                <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0">
                                    {g.slugs.length === 0 && <li className="text-umd-slate-600 text-sm">{t.emptyGroup}</li>}
                                    {g.slugs.map((slug) => (
                                        <li key={slug}>
                                            <button type="button" className="umd-chip umd-chip-info"
                                                aria-label={`${t.remove} ${bySlug.get(slug)?.name}`}
                                                onClick={(e) => { e.stopPropagation(); updateGroup(i, { slugs: g.slugs.filter((s) => s !== slug) }); }}>
                                                {bySlug.get(slug)?.name ?? slug} <X aria-hidden="true" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <button type="button" className="umd-btn umd-btn-outline umd-btn-sm self-start"
                            onClick={() => { setGroups((gs) => [...gs, { title: "", slugs: [] }]); setActive(groups.length); }}>
                            <Plus aria-hidden="true" /> {t.addGroup}
                        </button>

                        <div className="umd-field">
                            <Search aria-hidden="true" />
                            <input id="embed-search" className="umd-input umd-has-ic" placeholder={t.search} aria-label={t.search}
                                value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        {matches.length > 0 && (
                            <ul className="flex flex-col list-none p-0 m-0 max-h-72 overflow-y-auto border border-umd-slate-200 rounded-[10px]">
                                {matches.map((s) => {
                                    const picked = groups[active]?.slugs.includes(s.slug);
                                    return (
                                        <li key={s.slug}>
                                            <button type="button" onClick={() => toggleApp(s.slug)} aria-pressed={picked}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-umd-slate-50 bg-transparent border-0 cursor-pointer">
                                                <span className="w-7 h-7 rounded-md border border-umd-slate-200 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                                                    {s.logo && <Image src={s.logo} alt="" width={28} height={28} className="object-contain p-0.5" unoptimized />}
                                                </span>
                                                <span className="flex-1 min-w-0 truncate">{s.name}</span>
                                                {picked && <Check className="w-4 h-4 text-umd-indigo-600" aria-hidden="true" />}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>

                    <section className="flex flex-col gap-3">
                        <h2 className="font-display font-bold text-xl m-0">2. {t.step2}</h2>
                        <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
                            <legend className="text-sm font-semibold mb-1">{t.view}</legend>
                            {(["cards", "map"] as EmbedView[]).map((v) => (
                                <label key={v} className="flex items-start gap-2 cursor-pointer">
                                    <input id={`view-${v}`} type="radio" name="view" checked={view === v} className="mt-1"
                                        onChange={() => { setView(v); if (v === "map") setHeight(MAP_HEIGHT); }} />
                                    <span><b>{t.views[v]}</b> <span className="text-umd-slate-600 text-sm">· {t.viewsHelp[v]}</span></span>
                                </label>
                            ))}
                        </fieldset>
                        <fieldset className="flex flex-col gap-2 border-0 p-0 m-0" hidden={view === "map"}>
                            <legend className="text-sm font-semibold mb-1">{t.card}</legend>
                            {CARD_VARIANTS.map((v) => (
                                <label key={v} className="flex items-start gap-2 cursor-pointer">
                                    <input id={`card-${v}`} type="radio" name="card" checked={variant === v} onChange={() => setVariant(v)} className="mt-1" />
                                    <span><b>{t.cards[v]}</b> <span className="text-umd-slate-600 text-sm">· {t.cardsHelp[v]}</span></span>
                                </label>
                            ))}
                        </fieldset>
                        <div className="flex gap-6 flex-wrap">
                            <label className="flex flex-col gap-1 text-sm font-semibold">
                                {t.language}
                                <select id="embed-lang" className="umd-input !w-auto" value={widgetLang} onChange={(e) => setWidgetLang(e.target.value as "fr" | "en")}>
                                    <option value="fr">Français</option>
                                    <option value="en">English</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-semibold" hidden={view !== "map"}>
                                {t.height}
                                <input id="embed-height" type="number" min={200} step={50} className="umd-input !w-28" value={height}
                                    onChange={(e) => setHeight(Number(e.target.value) || 700)} />
                            </label>
                        </div>
                    </section>

                    <section className="flex flex-col gap-3">
                        <h2 className="font-display font-bold text-xl m-0">3. {t.step3}</h2>
                        <p className="text-umd-slate-600 text-sm m-0">{t.step3Help}</p>
                        <div className="flex flex-col gap-2">
                            <textarea id="embed-code" readOnly value={scriptSnippet} rows={4}
                                className="umd-input font-mono text-xs !h-auto" onFocus={(e) => e.target.select()} />
                            <button type="button" className="umd-btn umd-btn-primary self-start" onClick={(e) => copy(e, scriptSnippet)}>
                                {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} {copied ? t.copied : t.copy}
                            </button>
                        </div>
                        <details className="text-sm">
                            <summary className="cursor-pointer text-umd-slate-700 font-semibold">{t.noScript}</summary>
                            <p className="text-umd-slate-600 mt-2 mb-2">{t.noScriptHelp}</p>
                            <div className="flex flex-col gap-2">
                                <textarea id="embed-code-iframe" readOnly value={iframeSnippet} rows={3}
                                    className="umd-input font-mono text-xs !h-auto" onFocus={(e) => e.target.select()} />
                                <button type="button" className="umd-btn umd-btn-outline umd-btn-sm self-start" onClick={(e) => copy(e, iframeSnippet)}>
                                    <Copy aria-hidden="true" /> {t.copy}
                                </button>
                            </div>
                        </details>
                    </section>

                    <aside className="umd-card p-5 flex flex-col gap-2 bg-umd-indigo-50 border-umd-indigo-200">
                            <h2 className="font-display font-bold text-lg m-0 inline-flex items-center gap-2">
                                <HeartHandshake className="w-5 h-5 text-umd-indigo-600" aria-hidden="true" />{t.supportTitle}
                            </h2>
                            <p className="text-umd-slate-700 text-sm m-0">{t.supportText}</p>
                            <div className="flex gap-2 flex-wrap">
                                <a href={DONATION_URL} target="_blank" rel="noopener" className="umd-btn umd-btn-primary">{t.supportCta}</a>
                                <a href={SUBSCRIPTION_URL} target="_blank" rel="noopener" className="umd-btn umd-btn-outline">{t.subscribeCta}</a>
                            </div>
                        </aside>
                </div>

                <section className="lg:sticky lg:top-24 flex flex-col gap-2 min-w-0">
                    <h2 className="text-sm font-semibold text-umd-slate-600 m-0">{t.preview}</h2>
                    <iframe ref={preview} src={embedPath} title={t.preview} width="100%" height={height} onLoad={fitPreview}
                        style={{ minHeight: MIN_PREVIEW_HEIGHT }} className="border border-umd-slate-200 rounded-[16px] bg-white" />
                </section>
            </div>

            <section aria-labelledby="embed-faq" className="mt-16 max-w-3xl">
                <h2 id="embed-faq" className="umd-heading-2 mb-6">{t.faqTitle}</h2>
                <div className="space-y-3">
                    {t.faq.map(([question, answer], i) => (
                        <details key={question} className="umd-card group" open={i === 0}>
                            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5 font-display font-bold text-lg text-umd-slate-900 [&::-webkit-details-marker]:hidden">
                                {question}
                                <span aria-hidden="true" className="text-umd-indigo-600 font-mono shrink-0 group-open:hidden">+</span>
                                <span aria-hidden="true" className="text-umd-indigo-600 font-mono shrink-0 hidden group-open:inline">−</span>
                            </summary>
                            <p className="px-5 pb-5 m-0 text-umd-slate-600 leading-relaxed">{answer}</p>
                        </details>
                    ))}
                </div>
            </section>
        </main>
    );
}
