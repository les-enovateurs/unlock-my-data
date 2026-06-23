"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Check, Inbox, Info, Mail, PenLine, RotateCcw, Search, Shield, ShieldCheck, X,
} from "lucide-react";
import services from "../public/data/services.json";
import { PROTECT_DATA_SELECTION_KEY } from "@/constants/protectData";

interface Service {
    slug: string;
    name: string;
    logo: string;
    contact_mail_export: string | null;
    contact_mail_delete: string | null;
    country_name: string | null;
    country_code: string | null;
}

const SENT_KEY = "umd_delete_sent";

const TR: Record<string, Record<string, string>> = {
    fr: {
        pill: "Droit à l'effacement · RGPD article 17",
        title: "Supprimer mes données",
        lead: "Sélectionnez les services à quitter. Nous préparons des demandes d'effacement ; vous les envoyez <strong>une par une depuis votre propre messagerie</strong> (l'envoi vous appartient, nous ne collectons rien).",
        infoChip: "Chaque bouton ouvre l'e-mail pré-rédigé dans votre application de messagerie.",
        auditTitle: "Sélection de votre audit disponible",
        auditDesc: "{n} services sélectionnés dans Protéger mes données.",
        auditLoad: "Recharger cette sélection",
        reset: "Réinitialiser la sélection",
        col1: "1 · Vos comptes",
        col2: "2 · Vos demandes",
        sent: "envoyée",
        sents: "envoyées",
        searchPlaceholder: "Rechercher un service…",
        emptyTitle: "Sélectionnez au moins un service.",
        toLabel: "À :",
        subjectLabel: "Objet :",
        statusSent: "Envoyé",
        statusTodo: "À envoyer",
        open: "Ouvrir dans ma messagerie",
        reopen: "Réouvrir dans ma messagerie",
        allSent: "Toutes vos demandes sont parties · réponse attendue sous 30 jours",
        noMailTitle: "Pas de canal e-mail documenté",
        noMailDesc: "Ce service ne propose pas d'adresse de contact connue pour l'effacement. Consultez sa fiche pour la démarche en ligne, ou aidez-nous à la documenter.",
        seeFiche: "Voir la fiche",
        contribute: "Contribuer",
        subject: "Demande de suppression de données personnelles (RGPD - Art. 17)",
        noResult: "Aucun service trouvé.",
        body: `Madame, Monsieur,

En application de l'article 17.1 du Règlement général sur la protection des données (RGPD), je vous prie d'effacer de vos fichiers les données personnelles suivantes me concernant :

Toutes les données personnelles associées à mon compte et mon utilisation de {service}.

Je demande que ces informations soient supprimées car :

Je n'utilise plus ce service et souhaite exercer mon droit à l'effacement.

Vous voudrez bien également notifier cette demande d'effacement de mes données aux organismes auxquels vous les auriez communiquées (article 19 du RGPD).

Enfin, je vous prie de m'informer de ces éléments dans les meilleurs délais et au plus tard dans un délai d'un mois à compter de la réception de ce courrier (article 12.3 du RGPD).

À défaut de réponse de votre part dans les délais impartis ou en cas de réponse incomplète, je saisirai la Commission nationale de l'informatique et des libertés (CNIL) d'une réclamation.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`,
    },
    en: {
        pill: "Right to erasure · GDPR article 17",
        title: "Delete my data",
        lead: "Select the services you want to leave. We prepare the erasure requests; you send them <strong>one by one from your own mailbox</strong> (sending is yours — we collect nothing).",
        infoChip: "Each button opens the pre-written email in your mail application.",
        auditTitle: "Your audit selection is available",
        auditDesc: "{n} services selected in Protect my data.",
        auditLoad: "Reload this selection",
        reset: "Reset selection",
        col1: "1 · Your accounts",
        col2: "2 · Your requests",
        sent: "sent",
        sents: "sent",
        searchPlaceholder: "Search for a service…",
        emptyTitle: "Select at least one service.",
        toLabel: "To:",
        subjectLabel: "Subject:",
        statusSent: "Sent",
        statusTodo: "To send",
        open: "Open in my mailbox",
        reopen: "Reopen in my mailbox",
        allSent: "All your requests are on their way · response expected within 30 days",
        noMailTitle: "No documented email channel",
        noMailDesc: "This service has no known contact address for erasure. Check its record for the online procedure, or help us document it.",
        seeFiche: "See the record",
        contribute: "Contribute",
        subject: "Request for deletion of personal data (GDPR - Art. 17)",
        noResult: "No service found.",
        body: `Dear Sir or Madam,

Under Article 17.1 of the General Data Protection Regulation (GDPR), I request that you erase my personal data associated with my account on {service}.

I request deletion because I no longer use this service and wish to exercise my right to erasure.

Please also notify any third parties to whom you have disclosed my data (Article 19 GDPR).

Please inform me of the actions taken within one month of receipt of this request (Article 12.3 GDPR).

If you fail to respond or provide an incomplete response, I will file a complaint with the competent data protection authority.

Sincerely.`,
    },
};

function flagEmoji(code?: string | null) {
    if (!code || code.length !== 2) return "";
    return String.fromCodePoint(...[...code.toLowerCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 97));
}

function ServiceTile({ s, size = 36 }: { s: Service; size?: number }) {
    return (
        <span
            className="rounded-[9px] border border-umd-slate-200 bg-white flex items-center justify-center shrink-0 overflow-hidden"
            style={{ width: size, height: size }}
        >
            {s.logo ? (
                <Image src={s.logo} alt="" width={size} height={size} className="object-contain p-1" unoptimized loading="lazy" />
            ) : (
                <span className="font-display font-bold text-umd-indigo-800">{s.name.charAt(0)}</span>
            )}
        </span>
    );
}

export default function SupprimerMesDonnees({ preselectedSlug, locale = 'fr' }: { preselectedSlug?: string, locale?: 'fr' | 'en' }) {
    const t = useCallback((key: string, vars?: Record<string, string | number>) => {
        let s = TR[locale]?.[key] ?? TR.fr[key] ?? key;
        if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
        return s;
    }, [locale]);

    const allServices = useMemo(
        () => (services as unknown as Service[]).slice().sort((a, b) => a.name.localeCompare(b.name)),
        []
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [sentIds, setSentIds] = useState<string[]>([]);
    const [protectDataCount, setProtectDataCount] = useState(0);
    const [protectDataLoaded, setProtectDataLoaded] = useState(false);

    const readAuditSlugs = useCallback((): string[] => {
        if (typeof window === "undefined") return [];
        const saved = localStorage.getItem(PROTECT_DATA_SELECTION_KEY);
        if (!saved) return [];
        try {
            const parsed = JSON.parse(saved);
            const slugs: string[] = Array.isArray(parsed)
                ? parsed
                : (Array.isArray(parsed?.selectedServices) ? parsed.selectedServices : []);
            return slugs.filter((slug) => allServices.some((s) => s.slug === slug));
        } catch {
            return [];
        }
    }, [allServices]);

    // Restore sent state + detect audit selection + URL params
    useEffect(() => {
        try {
            const sent = JSON.parse(localStorage.getItem(SENT_KEY) || "[]");
            if (Array.isArray(sent)) setSentIds(sent);
        } catch { /* ignore */ }

        const auditSlugs = readAuditSlugs();
        setProtectDataCount(auditSlugs.length);

        const params = new URLSearchParams(window.location.search);
        if (params.get("from") === "risks" && params.get("bulk") === "true" && auditSlugs.length > 0) {
            setSelected(auditSlugs);
            setProtectDataLoaded(true);
            return;
        }

        const slug = preselectedSlug || params.get("service");
        if (slug && allServices.some((s) => s.slug === slug)) {
            setSelected([slug]);
        }
    }, [preselectedSlug, allServices, readAuditSlugs]);

    const markSent = useCallback((slug: string) => {
        setSentIds((prev) => {
            if (prev.includes(slug)) return prev;
            const next = [...prev, slug];
            try { localStorage.setItem(SENT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
            return next;
        });
    }, []);

    const toggle = useCallback((slug: string) => {
        setSelected((prev) => prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug]);
    }, []);

    const loadFromAudit = useCallback(() => {
        const slugs = readAuditSlugs();
        if (slugs.length > 0) {
            setSelected(slugs);
            setProtectDataLoaded(true);
        }
    }, [readAuditSlugs]);

    const filtered = useMemo(() => {
        if (!searchTerm) return allServices;
        const q = searchTerm.toLowerCase();
        return allServices.filter((s) => s.name.toLowerCase().includes(q) || s.slug.includes(q));
    }, [allServices, searchTerm]);

    const chosen = useMemo(
        () => selected.map((slug) => allServices.find((s) => s.slug === slug)).filter(Boolean) as Service[],
        [selected, allServices]
    );
    const mailable = chosen.filter((s) => s.contact_mail_delete || s.contact_mail_export);
    const sentCount = mailable.filter((s) => sentIds.includes(s.slug)).length;
    const ficheBase = locale === "fr" ? "/liste-applications" : "/list-app";

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
            <span className="umd-pill umd-pill-indigo mb-3.5"><Shield aria-hidden="true" />{t("pill")}</span>
            <h1 className="umd-heading-1 mb-1.5">{t("title")}</h1>
            <p
                className="umd-lead-text mt-0 mb-4 max-w-3xl [&_strong]:text-umd-slate-900"
                dangerouslySetInnerHTML={{ __html: t("lead") }}
            />
            <p className="umd-chip umd-chip-info mb-6"><Info aria-hidden="true" />{t("infoChip")}</p>

            {protectDataCount > 0 && !protectDataLoaded && (
                <div className="umd-alert umd-alert-info mb-6 max-w-3xl">
                    <span className="umd-alert-ic"><ShieldCheck aria-hidden="true" /></span>
                    <div className="flex-1 min-w-60">
                        <p className="umd-alert-title">{t("auditTitle")}</p>
                        <p className="umd-alert-desc">{t("auditDesc", { n: protectDataCount })}</p>
                    </div>
                    <button className="umd-btn umd-btn-outline umd-btn-sm self-center" onClick={loadFromAudit}>
                        <RotateCcw aria-hidden="true" />{t("auditLoad")}
                    </button>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-7 items-start">
                {/* 1 · Selector (left, scrollable) */}
                <div className="lg:sticky lg:top-24">
                    <div className="flex items-baseline justify-between gap-3 mb-3">
                        <h2 className="umd-heading-3 !text-base m-0">{t("col1")}</h2>
                        {selected.length > 0 && (
                            <button className="umd-ess-link !m-0" onClick={() => setSelected([])}>
                                <X aria-hidden="true" />{t("reset")}
                            </button>
                        )}
                    </div>
                    <div className="umd-field mb-3">
                        <Search aria-hidden="true" />
                        <input
                            className="umd-input umd-has-ic"
                            placeholder={t("searchPlaceholder")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label={t("searchPlaceholder")}
                        />
                    </div>
                    <div className="flex flex-col gap-2.5 overflow-y-auto pr-1" style={{ maxHeight: "65vh" }}>
                        {filtered.map((s) => {
                            const on = selected.includes(s.slug);
                            return (
                                <button
                                    key={s.slug}
                                    onClick={() => toggle(s.slug)}
                                    aria-pressed={on}
                                    className="umd-card text-left flex items-center gap-3 p-3.5 cursor-pointer"
                                    style={{
                                        borderWidth: 2,
                                        borderColor: on ? "var(--indigo-500)" : "var(--slate-200)",
                                        background: on ? "var(--indigo-50)" : "#fff",
                                    }}
                                >
                                    <ServiceTile s={s} />
                                    <span className="flex-1 min-w-0">
                                        <span className="block font-display font-bold text-[15px] truncate">{s.name}</span>
                                        {s.country_name && (
                                            <span className="text-umd-slate-500 text-[12.5px]">
                                                {flagEmoji(s.country_code)} {s.country_name}
                                            </span>
                                        )}
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="w-6 h-6 rounded-[7px] flex items-center justify-center shrink-0 text-white"
                                        style={on
                                            ? { background: "var(--indigo-600)" }
                                            : { border: "2px solid var(--slate-300)", background: "#fff" }}
                                    >
                                        {on && <Check size={16} />}
                                    </span>
                                </button>
                            );
                        })}
                        {filtered.length === 0 && (
                            <p className="text-umd-slate-500 text-sm text-center py-6">{t("noResult")}</p>
                        )}
                    </div>
                </div>

                {/* 2 · Generated requests (right) */}
                <div>
                    <h2 className="umd-heading-3 !text-base mb-3">
                        {t("col2")} — {sentCount}/{mailable.length} {sentCount > 1 ? t("sents") : t("sent")}
                    </h2>
                    {chosen.length === 0 ? (
                        <div className="umd-card p-7 text-center text-umd-slate-500 text-sm">
                            <Inbox aria-hidden="true" className="w-[26px] h-[26px] mx-auto" />
                            <p className="mt-2 m-0">{t("emptyTitle")}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {chosen.map((s) => {
                                const to = s.contact_mail_delete || s.contact_mail_export;
                                const isSent = sentIds.includes(s.slug);
                                if (!to) {
                                    return (
                                        <div key={s.slug} className="umd-card overflow-hidden">
                                            <div className="flex items-center gap-2.5 px-4.5 py-3 border-b border-umd-slate-200" style={{ background: "var(--slate-50)" }}>
                                                <ServiceTile s={s} size={26} />
                                                <span className="font-display font-bold text-sm">{s.name}</span>
                                                <span className="umd-chip umd-chip-warn ml-auto whitespace-nowrap">{t("noMailTitle")}</span>
                                            </div>
                                            <div className="p-4.5 text-[13.5px] leading-relaxed text-umd-slate-600">
                                                <p className="m-0 mb-3">{t("noMailDesc")}</p>
                                                <div className="flex gap-2.5 flex-wrap">
                                                    <Link href={`${ficheBase}/${s.slug}`} className="umd-btn umd-btn-outline umd-btn-sm">{t("seeFiche")}</Link>
                                                    <Link href={locale === "fr" ? "/contribuer/modifier-fiche" : "/contribute/update-form"} className="umd-btn umd-btn-ghost umd-btn-sm">
                                                        <PenLine aria-hidden="true" />{t("contribute")}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                const subject = t("subject");
                                const body = t("body", { service: s.name });
                                const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                return (
                                    <div key={s.slug} className="umd-card overflow-hidden">
                                        <div className="flex items-center gap-2.5 px-4.5 py-3 border-b border-umd-slate-200" style={{ background: "var(--slate-50)" }}>
                                            <ServiceTile s={s} size={26} />
                                            <span className="font-display font-bold text-sm">{s.name}</span>
                                            {isSent
                                                ? <span className="umd-chip umd-chip-safe ml-auto whitespace-nowrap"><Check aria-hidden="true" />{t("statusSent")}</span>
                                                : <span className="umd-chip umd-chip-neutral ml-auto whitespace-nowrap">{t("statusTodo")}</span>}
                                        </div>
                                        <div className="p-4.5 text-[13.5px] leading-relaxed text-umd-slate-600">
                                            <p className="m-0 mb-1"><strong className="text-umd-slate-900">{t("toLabel")}</strong> <span className="font-mono">{to}</span></p>
                                            <p className="m-0 mb-3"><strong className="text-umd-slate-900">{t("subjectLabel")}</strong> {subject}</p>
                                            <p className="m-0 mb-4 whitespace-pre-line">{body}</p>
                                            <a
                                                href={mailto}
                                                onClick={() => markSent(s.slug)}
                                                className={"umd-btn umd-btn-sm w-full " + (isSent ? "umd-btn-outline" : "umd-btn-primary")}
                                            >
                                                <Mail aria-hidden="true" />{isSent ? t("reopen") : t("open")}
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                            {mailable.length > 0 && sentCount === mailable.length && (
                                <p className="umd-chip umd-chip-safe justify-center !py-2.5 !px-3.5">
                                    <Check aria-hidden="true" />{t("allSent")}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
