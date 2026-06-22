"use client";

import { useState } from "react";
import Image from "next/image";
import { Newspaper, Download, Mail, Check, GitBranch } from "lucide-react";
import statsData from "../public/data/contributors-stats.json";

type Lang = "fr" | "en";

const stats = statsData as { totalFiles: number; totalContributions?: number; uniqueContributors?: number };

const PRESS_EMAIL = "presse@les-enovateurs.com";

const COPY = {
    fr: {
        eyebrow: "Espace presse",
        title: "Parler d'Unlock My Data",
        lead: "Chiffres vérifiables, logos prêts à l'emploi et communiqués : tout ce qu'il faut pour couvrir la plateforme citoyenne de transparence des données.",
        sections: { chiffres: "Chiffres clés", apropos: "À propos", communiques: "Communiqués", logos: "Logos & visuels", contact: "Contact presse" },
        toc: "Sommaire",
        kit: "Kit presse",
        kitNote: "Logos et visuels officiels, libres de reprise pour un usage éditorial.",
        contactTitle: "Contact presse",
        contactDelay: "Réponse sous 48 h ouvrées",
        chiffresIntro: "Données issues du dépôt public, mises à jour régulièrement. Librement réutilisables avec mention de la source.",
        aproposCopy: "Copier ce texte",
        aproposNote: "Texte de présentation officiel, libre de reprise.",
        aproposLine: "En une phrase : « Unlock My Data, la plateforme citoyenne qui rend transparentes les pratiques de données des services numériques. »",
        logosIntro: "Téléchargement libre pour un usage éditorial. Merci de ne pas déformer, recolorer ni recadrer le logo, et de nommer le projet « Unlock My Data » en toutes lettres.",
        colorsTitle: "Couleurs officielles",
        contactCopy: "L'équipe répond aux demandes d'interview, de démonstration et d'accès aux données brutes (open data). Bénévoles : merci de privilégier l'e-mail.",
        contactChips: ["Interviews", "Démonstrations", "Données brutes"],
        copy: "Copier",
        copied: "Copié",
    },
    en: {
        eyebrow: "Press room",
        title: "Writing about Unlock My Data",
        lead: "Verifiable figures, ready-to-use logos and press releases: everything you need to cover the citizen platform for data transparency.",
        sections: { chiffres: "Key figures", apropos: "About", communiques: "Press releases", logos: "Logos & visuals", contact: "Press contact" },
        toc: "Contents",
        kit: "Press kit",
        kitNote: "Official logos and visuals, free to reuse for editorial purposes.",
        contactTitle: "Press contact",
        contactDelay: "Reply within 48 business hours",
        chiffresIntro: "Data from the public repository, updated regularly. Freely reusable with attribution.",
        aproposCopy: "Copy this text",
        aproposNote: "Official boilerplate, free to reuse.",
        aproposLine: "In one sentence: “Unlock My Data, the citizen platform that makes the data practices of digital services transparent.”",
        logosIntro: "Free download for editorial use. Please do not distort, recolour or crop the logo, and spell the project name “Unlock My Data” in full.",
        colorsTitle: "Official colours",
        contactCopy: "The team answers requests for interviews, demos and access to raw data (open data). We are volunteers: email is preferred.",
        contactChips: ["Interviews", "Demos", "Raw data"],
        copy: "Copy",
        copied: "Copied",
    },
} as const;

const kpis = (lang: Lang) => lang === "fr" ? [
    { v: String(stats.totalFiles), l: "fiches services analysées", d: "Traceurs, politiques de confidentialité, droits RGPD" },
    { v: String(stats.totalContributions ?? "230+"), l: "contributions citoyennes", d: "Créations, mises à jour et relectures publiées" },
    { v: String(stats.uniqueContributors ?? "38"), l: "contributeurs bénévoles", d: "Étudiants, experts RGPD, citoyens curieux" },
    { v: "100 %", l: "open source", d: "Code et données ouverts, sur GitHub" },
    { v: "4", l: "sources indépendantes", d: "Exodus Privacy, Open Terms Archive, HIBP, Bonjour la fuite" },
    { v: "Mai 2025", l: "lancement de la plateforme", d: "Portée par l'association les e-novateurs" },
] : [
    { v: String(stats.totalFiles), l: "service records analysed", d: "Trackers, privacy policies, GDPR rights" },
    { v: String(stats.totalContributions ?? "230+"), l: "citizen contributions", d: "Creations, updates and reviews published" },
    { v: String(stats.uniqueContributors ?? "38"), l: "volunteer contributors", d: "Students, GDPR experts, curious citizens" },
    { v: "100 %", l: "open source", d: "Open code and data, on GitHub" },
    { v: "4", l: "independent sources", d: "Exodus Privacy, Open Terms Archive, HIBP, Bonjour la fuite" },
    { v: "May 2018", l: "platform launch", d: "Run by the non-profit les e-novateurs" },
];

const RELEASES = {
    fr: [
        { d: "12 juin 2026", t: "134 services passés au crible : Unlock My Data publie son bilan communautaire", s: "Un an après son lancement, la plateforme citoyenne dépasse les 230 contributions bénévoles et ouvre ses données." },
        { d: "14 mars 2026", t: "Digital Clean Up Day : un outil gratuit pour alléger son empreinte numérique", s: "Unlock My Data guide le grand public pour trier ses données en ligne sans supprimer ses comptes." },
        { d: "23 janvier 2026", t: "Unlock My Data lance les « missions » pour analyser les services prioritaires", s: "Applications de rencontre, santé, administrations : la communauté cible les services les plus sensibles." },
    ],
    en: [
        { d: "12 June 2026", t: "134 services scrutinised: Unlock My Data publishes its community report", s: "One year after launch, the citizen platform passes 230 volunteer contributions and opens its data." },
        { d: "14 March 2026", t: "Digital Clean Up Day: a free tool to lighten your digital footprint", s: "Unlock My Data guides the public to sort their online data without deleting accounts." },
        { d: "23 January 2026", t: "Unlock My Data launches “missions” to analyse priority services", s: "Dating, health and government apps: the community targets the most sensitive services." },
    ],
};

const BOILER = {
    fr: "Unlock My Data est une plateforme citoyenne et open source, portée par l'association les e-novateurs, qui rend transparentes les pratiques de données des services numériques. Sa communauté de bénévoles a analysé des centaines de services — traceurs, politiques de confidentialité, fuites connues — et propose des outils concrets pour comparer les alternatives et exercer ses droits RGPD.",
    en: "Unlock My Data is a citizen-led, open-source platform run by the non-profit les e-novateurs that makes the data practices of digital services transparent. Its community of volunteers has analysed hundreds of services — trackers, privacy policies, known breaches — and offers concrete tools to compare ethical alternatives and exercise GDPR rights.",
};

const ASSETS = [
    { t: "Logo principal", img: "/logoUMD.webp", ext: "WEBP", note: "Usage par défaut, fond clair" },
    { t: "Symbole seul", img: "/umd-logo-symbol.svg", ext: "SVG", note: "Vectoriel, toutes tailles" },
    { t: "Visuel réseaux sociaux", img: "/og-image-unlock.webp", ext: "WEBP", note: "Format 1200 × 630", cover: true },
    { t: "Logo les e-novateurs", img: "/les-enovateurs-logo.webp", ext: "WEBP", note: "Association éditrice" },
];

const COLORS = [
    { n: "Indigo souverain", hex: "#202080" },
    { n: "Or civique", hex: "#dcbd45" },
    { n: "Encre", hex: "#141828" },
    { n: "Ardoise claire", hex: "#f6f7fb" },
];

function CopyButton({ text, label, copied }: { text: string; label: string; copied: string }) {
    const [done, setDone] = useState(false);
    return (
        <button
            type="button"
            className="umd-btn umd-btn-outline umd-btn-sm"
            onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(text);
                setDone(true);
                window.setTimeout(() => setDone(false), 1800);
            }}
        >
            {done ? <><Check className="h-4 w-4" aria-hidden="true" />{copied}</> : label}
        </button>
    );
}

function Swatch({ name, hex, copied }: { name: string; hex: string; copied: string }) {
    const [done, setDone] = useState(false);
    return (
        <button
            type="button"
            className="umd-card overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300"
            title={`Copier ${hex}`}
            onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(hex);
                setDone(true);
                window.setTimeout(() => setDone(false), 1800);
            }}
        >
            <span className="block h-14 w-36 border-b border-umd-slate-200" style={{ background: hex }} />
            <span className="block px-3 py-2.5">
                <span className="block text-xs font-bold">{name}</span>
                <span className={`data block text-xs ${done ? "text-umd-green-600" : "text-umd-slate-400"}`}>{done ? copied : hex}</span>
            </span>
        </button>
    );
}

export default function PressRoom({ lang = "fr" }: { lang?: Lang }) {
    const c = COPY[lang];
    const sectionIds = ["chiffres", "apropos", "communiques", "logos", "contact"] as const;

    return (
        <div className="bg-white text-umd-slate-900">
            {/* Hero */}
            <section className="border-b border-umd-slate-200 bg-gradient-to-b from-umd-indigo-50 to-white">
                <div className="mx-auto max-w-7xl px-6 py-14">
                    <span className="umd-pill umd-pill-indigo mb-5">
                        <Newspaper aria-hidden="true" />
                        {c.eyebrow}
                    </span>
                    <h1 className="umd-heading-1 mb-4 max-w-3xl">{c.title}</h1>
                    <p className="umd-lead-text max-w-2xl">{c.lead}</p>
                </div>
            </section>

            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[260px_1fr]">
                {/* Sidebar */}
                <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                    <nav aria-label={c.toc}>
                        <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-umd-slate-400">{c.toc}</p>
                        <div className="flex flex-col">
                            {sectionIds.map((id) => (
                                <a key={id} href={`#${id}`} className="rounded-lg px-3 py-2 text-sm font-medium text-umd-slate-600 hover:bg-umd-indigo-50 hover:text-umd-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-umd-indigo-300">
                                    {c.sections[id]}
                                </a>
                            ))}
                        </div>
                    </nav>
                    <div className="umd-card p-4">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-umd-slate-400">{c.kit}</p>
                        <p className="m-0 text-xs leading-relaxed text-umd-slate-500">{c.kitNote}</p>
                        <div className="my-3 h-px bg-umd-slate-200" />
                        <a href="/umd-logo-symbol.svg" download className="umd-ftr-link text-sm">Symbole seul (SVG)</a>
                        <a href="/logoUMD.webp" download className="umd-ftr-link text-sm">Logo principal (WEBP)</a>
                    </div>
                    <div className="umd-card p-4">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-umd-slate-400">{c.contactTitle}</p>
                        <a href={`mailto:${PRESS_EMAIL}`} className="block text-sm font-bold text-umd-indigo-700">{PRESS_EMAIL}</a>
                        <p className="mt-1.5 text-xs text-umd-slate-400">{c.contactDelay}</p>
                    </div>
                </aside>

                {/* Body */}
                <div className="min-w-0 space-y-16">
                    {/* Chiffres */}
                    <section id="chiffres" className="scroll-mt-28">
                        <h2 className="umd-heading-2 mb-2 text-3xl">{c.sections.chiffres}</h2>
                        <p className="mb-6 text-umd-slate-500">{c.chiffresIntro}</p>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {kpis(lang).map((k) => (
                                <div key={k.l} className="umd-card p-5">
                                    <div className="data text-3xl font-bold leading-none text-umd-indigo-800">{k.v}</div>
                                    <div className="mb-1 mt-2 text-sm font-bold">{k.l}</div>
                                    <div className="text-xs leading-relaxed text-umd-slate-400">{k.d}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* À propos */}
                    <section id="apropos" className="scroll-mt-28">
                        <h2 className="umd-heading-2 mb-5 text-3xl">{c.sections.apropos}</h2>
                        <div className="umd-card bg-umd-slate-50 p-6 shadow-none">
                            <p className="mb-4 leading-relaxed text-umd-slate-700">{BOILER[lang]}</p>
                            <div className="flex flex-wrap items-center gap-3">
                                <CopyButton text={BOILER[lang]} label={c.aproposCopy} copied={c.copied} />
                                <span className="text-xs text-umd-slate-400">{c.aproposNote}</span>
                            </div>
                        </div>
                        <p className="mt-5 leading-relaxed text-umd-slate-600">{c.aproposLine}</p>
                    </section>

                    {/* Communiqués */}
                    <section id="communiques" className="scroll-mt-28">
                        <h2 className="umd-heading-2 mb-5 text-3xl">{c.sections.communiques}</h2>
                        <div className="flex flex-col gap-3">
                            {RELEASES[lang].map((r) => (
                                <article key={r.t} className="umd-card grid items-center gap-5 p-5 sm:grid-cols-[110px_1fr]">
                                    <span className="data text-xs leading-snug text-umd-slate-400">{r.d}</span>
                                    <div>
                                        <h3 className="mb-1 font-display text-base font-bold leading-snug">{r.t}</h3>
                                        <p className="m-0 text-sm leading-relaxed text-umd-slate-500">{r.s}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Logos */}
                    <section id="logos" className="scroll-mt-28">
                        <h2 className="umd-heading-2 mb-2 text-3xl">{c.sections.logos}</h2>
                        <p className="mb-6 text-umd-slate-500">{c.logosIntro}</p>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {ASSETS.map((a) => (
                                <div key={a.t} className="umd-card flex flex-col overflow-hidden">
                                    <div className="flex h-32 items-center justify-center bg-umd-slate-50">
                                        <Image src={a.img} alt={a.t} width={a.cover ? 400 : 140} height={a.cover ? 128 : 78} className={a.cover ? "h-full w-full object-cover" : "max-h-[78px] w-auto object-contain"} />
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-bold">{a.t}</div>
                                            <div className="text-xs text-umd-slate-400">{a.note}</div>
                                        </div>
                                        <a href={a.img} download className="umd-btn umd-btn-outline umd-btn-sm">{a.ext}</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h3 className="umd-heading-3 mb-3 mt-8 text-lg">{c.colorsTitle}</h3>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map((col) => <Swatch key={col.hex} name={col.n} hex={col.hex} copied={c.copied} />)}
                        </div>
                    </section>

                    {/* Contact */}
                    <section id="contact" className="scroll-mt-28">
                        <h2 className="umd-heading-2 mb-5 text-3xl">{c.sections.contact}</h2>
                        <div className="umd-card grid items-center gap-6 p-6 sm:grid-cols-[1fr_auto]">
                            <div>
                                <p className="mb-3.5 leading-relaxed text-umd-slate-600">{c.contactCopy}</p>
                                <div className="flex flex-wrap gap-2">
                                    {c.contactChips.map((chip) => (
                                        <span key={chip} className="umd-chip umd-chip-info">{chip}</span>
                                    ))}
                                </div>
                            </div>
                            <a href={`mailto:${PRESS_EMAIL}`} className="umd-btn umd-btn-primary">
                                <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
                                {PRESS_EMAIL}
                            </a>
                        </div>
                        <p className="mt-6 inline-flex items-center gap-2 text-sm text-umd-slate-400">
                            <GitBranch className="h-4 w-4" aria-hidden="true" />
                            {lang === "fr" ? "Projet open source — " : "Open-source project — "}
                            <a href="https://github.com/les-enovateurs/unlock-my-data" target="_blank" rel="noopener noreferrer" className="font-semibold text-umd-indigo-700 underline underline-offset-4">GitHub</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
