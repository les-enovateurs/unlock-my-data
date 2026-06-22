"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Megaphone, Check, Link as LinkIcon, Mail, Printer } from "lucide-react";
import { PRESS_RELEASES, getRelease, type PressBlock, type PressReleaseContent } from "@/data/pressReleases";

type Lang = "fr" | "en";

const PRESS_EMAIL = "presse@les-enovateurs.com";

const BOILER = {
    fr: "Unlock My Data est une plateforme citoyenne et open source, portée par l'association les e-novateurs, qui rend transparentes les pratiques de données des services numériques. Sa communauté de bénévoles a analysé des centaines de services — traceurs, politiques de confidentialité, fuites connues — et propose des outils concrets pour comparer les alternatives et exercer ses droits RGPD.",
    en: "Unlock My Data is a citizen-led, open-source platform run by the non-profit les e-novateurs that makes the data practices of digital services transparent. Its community of volunteers has analysed hundreds of services — trackers, privacy policies, known breaches — and offers concrete tools to compare ethical alternatives and exercise GDPR rights.",
};

const T = {
    fr: {
        back: "Espace presse",
        flag: "Pour diffusion immédiate",
        read: "Lecture",
        dateline: (loc: string, date: string) => `${loc}, le ${date} — `,
        boilerTitle: "À propos d'Unlock My Data",
        end: "— FIN —",
        pdf: "Télécharger en PDF",
        print: "Imprimer / PDF",
        copyText: "Copier le texte",
        copied: "Copié",
        share: "Partager",
        copyLink: "Copier le lien",
        byEmail: "Par e-mail",
        printAria: "Imprimer",
        contactTitle: "Contact presse",
        contactDelay: "Réponse sous 48 h ouvrées",
        others: "Autres communiqués",
        basePath: "/presse",
    },
    en: {
        back: "Press room",
        flag: "For immediate release",
        read: "Read",
        dateline: (loc: string, date: string) => `${loc}, ${date} — `,
        boilerTitle: "About Unlock My Data",
        end: "— END —",
        pdf: "Download as PDF",
        print: "Print / PDF",
        copyText: "Copy the text",
        copied: "Copied",
        share: "Share",
        copyLink: "Copy the link",
        byEmail: "By email",
        printAria: "Print",
        contactTitle: "Press contact",
        contactDelay: "Reply within 48 business hours",
        others: "Other releases",
        basePath: "/press",
    },
} as const;

function Block({ b }: { b: PressBlock }) {
    if (b.type === "h2") return <h2 className="umd-heading-3 mb-3 mt-8 text-xl">{b.text}</h2>;
    if (b.type === "quote") {
        return (
            <blockquote className="my-6 border-l-4 border-umd-indigo-300 pl-5">
                <p className="text-lg italic leading-relaxed text-umd-slate-700">« {b.text} »</p>
                <cite className="mt-2 block text-sm not-italic text-umd-slate-400">{b.cite}</cite>
            </blockquote>
        );
    }
    if (b.type === "stats") {
        return (
            <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {b.items.map((it) => (
                    <div key={it.l} className="umd-card p-4 text-center">
                        <div className="data text-3xl font-bold leading-none text-umd-indigo-800">{it.v}</div>
                        <div className="mt-2 text-xs leading-snug text-umd-slate-500">{it.l}</div>
                    </div>
                ))}
            </div>
        );
    }
    return <p className={`mb-4 leading-relaxed ${b.lead ? "text-lg text-umd-slate-800" : "text-umd-slate-700"}`}>{b.text}</p>;
}

function CopyButton({ text, label, copied }: { text: string; label: string; copied: string }) {
    const [done, setDone] = useState(false);
    return (
        <button
            type="button"
            className="umd-btn umd-btn-outline umd-btn-sm justify-center"
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

export default function PressReleaseDetail({ slug, lang = "fr" }: { slug: string; lang?: Lang }) {
    const release = getRelease(slug);
    const t = T[lang];

    if (!release) {
        return (
            <div className="mx-auto max-w-3xl px-6 py-24 text-center">
                <p className="text-umd-slate-500">{lang === "fr" ? "Communiqué introuvable." : "Release not found."}</p>
                <Link href={t.basePath} className="umd-btn umd-btn-outline umd-btn-sm mt-4 inline-flex">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t.back}
                </Link>
            </div>
        );
    }

    const c: PressReleaseContent = release[lang];
    const others = PRESS_RELEASES.filter((r) => r.slug !== release.slug).slice(0, 2);

    const copyLink = () => {
        if (navigator.clipboard && typeof window !== "undefined") navigator.clipboard.writeText(window.location.href);
    };
    const handlePdf = () => {
        if (release.pdf) window.open(release.pdf, "_blank");
        else window.print();
    };

    return (
        <div className="bg-white text-umd-slate-900">
            <div className="mx-auto max-w-7xl px-6 pt-6 print:hidden">
                <Link href={t.basePath} className="umd-btn umd-btn-ghost umd-btn-sm inline-flex">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t.back}
                </Link>
            </div>

            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1fr_280px] print:block print:py-2">
                {/* Article */}
                <article className="min-w-0">
                    <header className="mb-6">
                        <span className="umd-pill umd-pill-indigo mb-4">
                            <Megaphone aria-hidden="true" />
                            {t.flag}
                        </span>
                        <h1 className="umd-heading-1 mb-4">{c.title}</h1>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-umd-slate-400">
                            <span className="data">{c.date}</span>
                            <span aria-hidden="true">·</span>
                            <span>{c.loc}</span>
                            <span aria-hidden="true">·</span>
                            <span>{t.read} {c.read}</span>
                            <span aria-hidden="true">·</span>
                            <span>les e-novateurs</span>
                        </div>
                    </header>

                    <p className="mb-6 border-l-4 border-umd-indigo-200 pl-5 text-lg font-medium leading-relaxed text-umd-slate-800">{c.chapo}</p>

                    <div className="max-w-prose">
                        <p className="mb-4 leading-relaxed text-umd-slate-700">
                            <span className="font-bold text-umd-slate-900">{t.dateline(c.loc, c.date)}</span>
                            {c.body[0]?.type === "p" ? c.body[0].text : ""}
                        </p>
                        {c.body.slice(1).map((b, i) => <Block key={i} b={b} />)}

                        <div className="umd-card mt-8 bg-umd-slate-50 p-5 shadow-none">
                            <h3 className="umd-heading-3 mb-2 text-base">{t.boilerTitle}</h3>
                            <p className="m-0 text-sm leading-relaxed text-umd-slate-600">{BOILER[lang]}</p>
                        </div>

                        <p className="mt-8 text-center text-sm font-bold tracking-widest text-umd-slate-400">{t.end}</p>
                    </div>
                </article>

                {/* Actions */}
                <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start print:hidden">
                    <div className="umd-card flex flex-col gap-2.5 p-4">
                        <button type="button" onClick={handlePdf} className="umd-btn umd-btn-primary umd-btn-sm justify-center">
                            <Download className="h-4 w-4" aria-hidden="true" />
                            {release.pdf ? t.pdf : t.print}
                        </button>
                        <CopyButton text={`${c.title}\n\n${c.chapo}`} label={t.copyText} copied={t.copied} />
                        <div className="umd-divider" />
                        <p className="text-[11px] font-bold uppercase tracking-widest text-umd-slate-400">{t.share}</p>
                        <div className="flex gap-2">
                            <button type="button" onClick={copyLink} title={t.copyLink} aria-label={t.copyLink} className="umd-btn umd-btn-outline umd-btn-sm flex-1 justify-center">
                                <LinkIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <a href={`mailto:?subject=${encodeURIComponent(c.title)}`} title={t.byEmail} aria-label={t.byEmail} className="umd-btn umd-btn-outline umd-btn-sm flex-1 justify-center">
                                <Mail className="h-4 w-4" aria-hidden="true" />
                            </a>
                            <button type="button" onClick={() => window.print()} title={t.printAria} aria-label={t.printAria} className="umd-btn umd-btn-outline umd-btn-sm flex-1 justify-center">
                                <Printer className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="umd-card p-4">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-umd-slate-400">{t.contactTitle}</p>
                        <a href={`mailto:${PRESS_EMAIL}`} className="block text-sm font-bold text-umd-indigo-700">{PRESS_EMAIL}</a>
                        <p className="mt-1.5 text-xs text-umd-slate-400">{t.contactDelay}</p>
                    </div>

                    {others.length > 0 && (
                        <div className="umd-card p-4">
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-umd-slate-400">{t.others}</p>
                            <div className="flex flex-col gap-3">
                                {others.map((o) => (
                                    <Link key={o.slug} href={`${t.basePath}/${o.slug}`} className="block text-left hover:opacity-80">
                                        <span className="data block text-xs text-umd-slate-400">{o[lang].date}</span>
                                        <span className="block text-sm font-bold leading-snug text-umd-slate-800">{o[lang].title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
