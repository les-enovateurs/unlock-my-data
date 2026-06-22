"use client";

import allServices from '../public/data/services.json';
import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    BarChart3, Check, X, Info, Award, Building2, Radar,
    ShieldAlert, Compass, ArrowRight, Scale, Trash2, BookOpenText, Mail, Copy
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams } from "next/navigation";
import Translator from "@/components/tools/t";
import dict from "@/i18n/Comparatif.json";
import { EU_COUNTRIES } from '../constants/euCountries';
import { SERVICE_CATEGORIES } from '../constants/protectData';
import { getEmailTemplate } from '../constants/emailTemplates';
import { ComparatifComponentProps, Service } from "./comparatif/types";
import ProtectActionDrawer from "./protect-my-data/ProtectActionDrawer";
import type { Service as PdService } from "@/constants/protectData";

// Slug -> canonical category
const SLUG_TO_CATEGORY: Record<string, string> = {};
for (const [category, slugs] of Object.entries(SERVICE_CATEGORIES)) {
    slugs.forEach(slug => { SLUG_TO_CATEGORY[slug] = category; });
}

// Display labels per category (picker optgroups + criteria row)
const CATEGORY_LABELS: Record<string, { fr: string; en: string }> = {
    messaging: { fr: "Messagerie", en: "Messaging" },
    social: { fr: "Réseaux sociaux", en: "Social networks" },
    streaming: { fr: "Streaming", en: "Streaming" },
    cloud: { fr: "Cloud", en: "Cloud" },
    email: { fr: "Email", en: "Email" },
    gps: { fr: "GPS / Cartes", en: "GPS / Maps" },
    search: { fr: "Recherche", en: "Search" },
    browser: { fr: "Navigateur", en: "Browser" },
    shopping: { fr: "E-commerce", en: "Shopping" },
    meeting: { fr: "Visioconférence", en: "Meetings" },
    ai: { fr: "IA", en: "AI" },
    travel: { fr: "Voyage", en: "Travel" },
    health: { fr: "Santé", en: "Health" },
    education: { fr: "Éducation", en: "Education" },
    gaming: { fr: "Jeux vidéo", en: "Gaming" },
    food: { fr: "Cuisine", en: "Food" },
    services: { fr: "Services", en: "Services" },
    other: { fr: "Autres", en: "Other" },
};

// Curated "best by domain": A = mainstream service, B = sovereign alternative.
// Every slug verified present in services.json.
const DOMAIN_COMPARISONS: { key: string; icon: string; a: string; b: string }[] = [
    { key: "messaging", icon: "💬", a: "whatsapp", b: "signal" },
    { key: "social", icon: "📱", a: "instagram", b: "mastodon" },
    { key: "gps", icon: "🗺️", a: "google-maps", b: "osmand" },
    { key: "cloud", icon: "☁️", a: "google-drive", b: "proton-drive" },
    { key: "ai", icon: "🤖", a: "chatgpt", b: "mistral" },
    { key: "shopping", icon: "🛒", a: "amazon", b: "leboncoin" },
];

// Dominant tech giants (US + Chinese) — owning a service by one of these means
// it is NOT independent. Matched as a substring against manual.group_name.
// belongs_to_group alone is useless: almost every company has a parent group.
const TECH_GIANT_KEYWORDS = [
    "google", "alphabet", "meta", "facebook", "microsoft", "apple", "amazon",
    "alibaba", "bytedance", "tencent", "pdd holdings", "baidu", "xiaomi",
    "huawei", "x corp", "samsung",
];
function isTechGiant(groupName?: string | null): boolean {
    if (!groupName) return false;
    const g = groupName.toLowerCase();
    return TECH_GIANT_KEYWORDS.some(k => g.includes(k));
}

// Manual record shape (only the fields we read)
interface ManualData {
    belongs_to_group?: boolean;
    group_name?: string | null;
    outside_eu_storage?: boolean | null;
    sanctioned_by_cnil?: boolean;
    migrations?: { name: string; link_fr?: string; link_en?: string }[];
    clean_guide_fr?: string | null;
    clean_guide_en?: string | null;
}
// Compare record shape (exodus permissions/trackers)
interface CompareData {
    trackers?: unknown[];
}

// Derived model per service, used by every criterion row.
interface ServiceModel {
    svc: Service;
    slug: string;
    category: string;
    euStorage: boolean;
    bigTech: boolean;
    groupName: string | null;
    breach: boolean;
    trackers: number | null;
    migration: { name: string; link_fr?: string; link_en?: string } | null;
    cleanGuide: { fr?: string | null; en?: string | null } | null;
    score: number;
}

function trackerLevel(n: number | null, locale: string) {
    if (n == null) return { t: locale === 'fr' ? "Donnée indisponible" : "No data", g: null as boolean | null };
    if (n === 0) return { t: locale === 'fr' ? "Aucun traceur" : "No tracker", g: true };
    if (n <= 2) return { t: `${n} ${locale === 'fr' ? "traceur" : "tracker"}${n > 1 ? "s" : ""}`, g: true };
    if (n <= 6) return { t: `${n} ${locale === 'fr' ? "traceurs" : "trackers"}`, g: null as boolean | null };
    return { t: `${n} ${locale === 'fr' ? "traceurs" : "trackers"}`, g: false };
}

// --- Presentational pieces (ported from design Compare.jsx) ---

function CmpHead({ m, win, label }: { m: ServiceModel; win: boolean; label: string }) {
    const { svc } = m;
    return (
        <div className="umd-card" style={{ padding: "20px 18px", textAlign: "center", position: "relative", borderColor: win ? "var(--green-300)" : "var(--slate-200)", borderWidth: win ? 2 : 1, borderStyle: "solid" }}>
            {win && (
                <span className="umd-chip umd-chip-safe" style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", fontSize: 11, padding: "3px 11px", whiteSpace: "nowrap" }}>
                    <Award style={{ width: 12, height: 12 }} aria-hidden="true" />{label}
                </span>
            )}
            <span style={{ width: 56, height: 56, borderRadius: 12, background: "#fff", border: "1px solid var(--slate-200)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10, overflow: "hidden" }}>
                <Image src={svc.logo} alt={svc.name} width={40} height={40} className="object-contain" />
            </span>
            <h3 className="umd-heading-3" style={{ fontSize: 19 }}>{svc.name}</h3>
            <p style={{ fontSize: 13, margin: "2px 0 0", color: "var(--fg2)" }}>
                {CATEGORY_LABELS[m.category]?.fr ?? m.category} · {svc.country_name ?? "—"}
            </p>
        </div>
    );
}

// g: true=favorable, false=unfavorable, null=neutral
function CmpRow({ label, a, b, detailed }: {
    label: string;
    a: { v: string; g?: boolean | null };
    b: { v: string; g?: boolean | null };
    detailed?: boolean;
}) {
    const winA = a.g === true && b.g !== true;
    const winB = b.g === true && a.g !== true;
    const cell = (val: string, g: boolean | null | undefined, isWin: boolean) => (
        <div style={{ flex: 1, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: detailed ? "2px 8px" : 0 }}>
            {g != null && (g
                ? <Check style={{ width: 16, height: 16, color: "var(--green-600)" }} aria-hidden="true" />
                : <X style={{ width: 16, height: 16, color: "var(--red-500)" }} aria-hidden="true" />)}
            <span style={{ fontWeight: isWin ? 700 : 600, fontSize: 14.5, color: g == null ? "var(--fg1)" : g ? "var(--green-700)" : "var(--red-600)" }}>{val}</span>
        </div>
    );
    return (
        <div style={{ display: "flex", alignItems: "center", padding: "13px 0", borderBottom: "1px solid var(--slate-100)" }}>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div style={{ background: detailed && winA ? "var(--green-50)" : "transparent", borderRadius: "var(--umd-radius-pill)", display: "inline-flex" }}>{cell(a.v, a.g, winA)}</div>
            </div>
            <div style={{ width: 184, textAlign: "center", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--fg3)", flexShrink: 0 }}>{label}</div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div style={{ background: detailed && winB ? "var(--green-50)" : "transparent", borderRadius: "var(--umd-radius-pill)", display: "inline-flex" }}>{cell(b.v, b.g, winB)}</div>
            </div>
        </div>
    );
}

function CmpSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <div className="umd-card" style={{ padding: "8px 22px 4px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "14px 0 8px", borderBottom: "2px solid var(--slate-100)" }}>
                <span style={{ width: 28, height: 28, borderRadius: "var(--umd-radius-sm)", background: "var(--indigo-50)", color: "var(--indigo-700)", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>
                <h3 style={{ fontSize: 14.5, fontWeight: 700 }}>{title}</h3>
            </div>
            {children}
        </div>
    );
}

// Generic guide modal — fetches a markdown guide on open. Optional bottom CTA.
function GuideModal({ url, title, closeLabel, emptyLabel, cta, onClose }: {
    url: string; title: string; closeLabel: string; emptyLabel: string;
    cta?: { href: string; label: string }; onClose: () => void;
}) {
    const [md, setMd] = useState<string>("");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let alive = true;
        setLoading(true);
        fetch(url)
            .then(r => (r.ok ? r.text() : Promise.reject(r.status)))
            .then(txt => { if (alive) { setMd(txt); setLoading(false); } })
            .catch(() => { if (alive) { setMd(""); setLoading(false); } });
        return () => { alive = false; };
    }, [url]);
    return (
        <div role="dialog" aria-modal="true" onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(15,23,42,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div onClick={e => e.stopPropagation()} className="umd-card"
                style={{ maxWidth: 640, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "24px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h3 className="umd-heading-3" style={{ fontSize: 18 }}>{title}</h3>
                    <button onClick={onClose} aria-label={closeLabel} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg2)" }}>
                        <X style={{ width: 20, height: 20 }} aria-hidden="true" />
                    </button>
                </div>
                <div className="prose prose-sm max-w-none" style={{ fontSize: 14.5, lineHeight: 1.6 }}>
                    {loading ? <p style={{ color: "var(--fg2)" }}>…</p> : md ? <ReactMarkdown>{md}</ReactMarkdown> : <p style={{ color: "var(--fg2)" }}>{emptyLabel}</p>}
                </div>
                {cta && (
                    <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--slate-100)", display: "flex", justifyContent: "flex-end" }}>
                        <Link href={cta.href} className="umd-btn umd-btn-primary umd-btn-sm">
                            {cta.label}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

// GDPR deletion email template modal — shown when a service has no migration/cleanup guide.
function MailTemplateModal({ serviceName, recipient, subject, body, labels, ctaHref, onClose }: {
    serviceName: string; recipient?: string; subject: string; body: string;
    labels: { title: string; close: string; to: string; noRecipient: string; subject: string; copy: string; copied: string; send: string; cta: string };
    ctaHref: string; onClose: () => void;
}) {
    const [copied, setCopied] = useState(false);
    const mailto = recipient
        ? `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        : undefined;
    const copy = () => {
        navigator.clipboard?.writeText(`${subject}\n\n${body}`).then(() => setCopied(true)).catch(() => { });
    };
    return (
        <div role="dialog" aria-modal="true" onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(15,23,42,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div onClick={e => e.stopPropagation()} className="umd-card"
                style={{ maxWidth: 640, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "24px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <h3 className="umd-heading-3" style={{ fontSize: 18 }}>{labels.title} {serviceName}</h3>
                    <button onClick={onClose} aria-label={labels.close} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg2)" }}>
                        <X style={{ width: 20, height: 20 }} aria-hidden="true" />
                    </button>
                </div>

                <p style={{ fontSize: 13, margin: "0 0 4px", color: "var(--fg3)" }}>
                    <strong style={{ color: "var(--fg2)" }}>{labels.to} </strong>
                    {recipient || <em>{labels.noRecipient}</em>}
                </p>
                <p style={{ fontSize: 13, margin: "0 0 12px", color: "var(--fg3)" }}>
                    <strong style={{ color: "var(--fg2)" }}>{labels.subject} </strong>{subject}
                </p>

                <textarea
                    readOnly
                    value={body}
                    rows={12}
                    onFocus={e => e.target.select()}
                    style={{ width: "100%", fontSize: 13.5, lineHeight: 1.55, padding: "12px 14px", border: "1px solid var(--slate-200)", borderRadius: "var(--umd-radius-sm)", background: "var(--slate-50)", color: "var(--fg1)", resize: "vertical", fontFamily: "inherit" }}
                />

                <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <button className="umd-btn umd-btn-outline umd-btn-sm" onClick={copy}>
                        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                        {copied ? labels.copied : labels.copy}
                    </button>
                    {mailto && (
                        <a className="umd-btn umd-btn-primary umd-btn-sm" href={mailto}>
                            <Mail className="h-4 w-4" aria-hidden="true" />{labels.send}
                        </a>
                    )}
                    <Link className="umd-btn umd-btn-ghost umd-btn-sm" href={ctaHref}>
                        {labels.cta}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ComparatifComponent({ locale }: ComparatifComponentProps) {
    const t = new Translator(dict as any, locale);
    const isFr = locale === 'fr';
    const searchParams = useSearchParams();
    const services = allServices as unknown as Service[];
    const byId = useMemo(() => {
        const map: Record<string, Service> = {};
        services.forEach(s => { map[s.slug] = s; });
        return map;
    }, [services]);

    const [aId, setAId] = useState<string>(DOMAIN_COMPARISONS[0].a);
    const [bId, setBId] = useState<string>(DOMAIN_COMPARISONS[0].b);
    const [deleteDrawer, setDeleteDrawer] = useState(false);
    const [openGuide, setOpenGuide] = useState<null | "migration" | "delete" | "mail">(null);
    const [manualCache, setManualCache] = useState<Record<string, ManualData>>({});
    const [compareCache, setCompareCache] = useState<Record<string, CompareData>>({});

    const { setLang } = useLanguage();
    useEffect(() => { setLang(locale as 'fr' | 'en'); }, [locale, setLang]);

    // Deep-link: ?services=a,b
    useEffect(() => {
        const param = searchParams.get('services');
        if (!param) return;
        const slugs = param.split(',').map(s => s.trim()).filter(Boolean).filter(s => byId[s]);
        if (slugs[0]) setAId(slugs[0]);
        if (slugs[1]) setBId(slugs[1]);
    }, [searchParams, byId]);

    // Load manual + compare data for the two selected services
    useEffect(() => {
        const slugs = Array.from(new Set([aId, bId])).filter(Boolean);
        let alive = true;
        (async () => {
            const manualNext: Record<string, ManualData> = {};
            const compareNext: Record<string, CompareData> = {};
            await Promise.all(slugs.map(async slug => {
                const [manualMod, compareMod] = await Promise.all([
                    import(`../public/data/manual/${slug}.json`).catch(() => null),
                    import(`../public/data/compare/${slug}.json`).catch(() => null),
                ]);
                if (manualMod) manualNext[slug] = (manualMod.default || manualMod) as ManualData;
                if (compareMod) compareNext[slug] = (compareMod.default || compareMod) as CompareData;
            }));
            if (alive) { setManualCache(manualNext); setCompareCache(compareNext); }
        })();
        return () => { alive = false; };
    }, [aId, bId]);

    const buildModel = useCallback((slug: string): ServiceModel | null => {
        const svc = byId[slug];
        if (!svc) return null;
        const manual = manualCache[slug];
        const category = SLUG_TO_CATEGORY[slug] || 'other';
        const euStorage = manual && manual.outside_eu_storage != null
            ? !manual.outside_eu_storage
            : EU_COUNTRIES.has((svc.country_code || "").toLowerCase());
        const bigTech = isTechGiant(manual?.group_name);
        const breach = !!svc.last_update_breach || manual?.sanctioned_by_cnil === true;
        const compareTrackers = compareCache[slug]?.trackers;
        const trackers = Array.isArray(compareTrackers) ? compareTrackers.length : null;
        const migration = manual?.migrations?.[0] || null;
        const cleanGuide = manual ? { fr: manual.clean_guide_fr, en: manual.clean_guide_en } : null;
        const score = (bigTech ? 2 : 0) + (breach ? 3 : 0) + (trackers ? Math.min(trackers, 15) / 2 : 0) + (euStorage ? 0 : 2);
        return { svc, slug, category, euStorage, bigTech, groupName: manual?.group_name || null, breach, trackers, migration, cleanGuide, score };
    }, [byId, manualCache, compareCache]);

    const a = buildModel(aId);
    const b = buildModel(bId);

    // Picker options grouped by category
    const grouped = useMemo(() => {
        const map: Record<string, Service[]> = {};
        services.forEach(s => {
            const cat = SLUG_TO_CATEGORY[s.slug] || 'other';
            (map[cat] = map[cat] || []).push(s);
        });
        Object.values(map).forEach(arr => arr.sort((x, y) => x.name.localeCompare(y.name)));
        return map;
    }, [services]);

    const loadDomain = useCallback((d: { a: string; b: string }) => {
        setAId(d.a);
        setBId(d.b);
    }, []);

    if (!a || !b) {
        return <div className="mx-auto max-w-3xl px-4 py-10 text-center text-umd-slate-400">…</div>;
    }

    const winner = a.score === b.score ? null : (a.score < b.score ? a : b);
    const loser = winner ? (winner === a ? b : a) : null;
    // Migration target: the weaker service, or service B (the curated sovereign pick) on a tie.
    const migrateTarget = loser ?? b;
    const detailed = true;
    const sameType = a.category === b.category;
    const tlA = trackerLevel(a.trackers, locale);
    const tlB = trackerLevel(b.trackers, locale);
    const catLabel = (m: ServiceModel) => isFr ? (CATEGORY_LABELS[m.category]?.fr ?? m.category) : (CATEGORY_LABELS[m.category]?.en ?? m.category);

    const rows = {
        type: <CmpRow label={isFr ? "Type de service" : "Service type"} a={{ v: catLabel(a) }} b={{ v: catLabel(b) }} detailed={detailed} />,
        country: <CmpRow label={isFr ? "Localisation" : "Location"} a={{ v: a.svc.country_name ?? "—" }} b={{ v: b.svc.country_name ?? "—" }} detailed={detailed} />,
        eu: <CmpRow label={isFr ? "Hébergement UE / EEE" : "EU / EEA hosting"} a={{ v: a.euStorage ? (isFr ? "Oui" : "Yes") : (isFr ? "Non" : "No"), g: a.euStorage }} b={{ v: b.euStorage ? (isFr ? "Oui" : "Yes") : (isFr ? "Non" : "No"), g: b.euStorage }} detailed={detailed} />,
        gafam: <CmpRow label={isFr ? "Indépendant d'un géant tech" : "Independent from a tech giant"} a={{ v: a.bigTech ? (a.groupName || (isFr ? "Non" : "No")) : (isFr ? "Indépendant" : "Independent"), g: !a.bigTech }} b={{ v: b.bigTech ? (b.groupName || (isFr ? "Non" : "No")) : (isFr ? "Indépendant" : "Independent"), g: !b.bigTech }} detailed={detailed} />,
        trackers: <CmpRow label={isFr ? "Traceurs détectés" : "Trackers detected"} a={{ v: tlA.t, g: tlA.g }} b={{ v: tlB.t, g: tlB.g }} detailed={detailed} />,
        breach: <CmpRow label={isFr ? "Sanction / fuite connue" : "Known sanction / breach"} a={{ v: a.breach ? (isFr ? "Oui" : "Yes") : (isFr ? "Non" : "No"), g: !a.breach }} b={{ v: b.breach ? (isFr ? "Oui" : "Yes") : (isFr ? "Non" : "No"), g: !b.breach }} detailed={detailed} />,
        alt: <CmpRow label={isFr ? "Alternative souveraine" : "Sovereign alternative"} a={{ v: a.migration?.name ?? (a.euStorage && !a.bigTech ? (isFr ? "Déjà recommandable" : "Already fine") : (isFr ? "À étudier" : "To review")) }} b={{ v: b.migration?.name ?? (b.euStorage && !b.bigTech ? (isFr ? "Déjà recommandable" : "Already fine") : (isFr ? "À étudier" : "To review")) }} detailed={detailed} />,
    };

    const guideUrl = migrateTarget.migration ? (isFr ? migrateTarget.migration.link_fr : migrateTarget.migration.link_en) || migrateTarget.migration.link_fr || migrateTarget.migration.link_en : undefined;
    const deleteUrl = migrateTarget.cleanGuide ? (isFr ? migrateTarget.cleanGuide.fr : migrateTarget.cleanGuide.en) || migrateTarget.cleanGuide.fr || migrateTarget.cleanGuide.en || undefined : undefined;

    return (
        <div className="mx-auto max-w-[920px] px-6 pb-20 pt-10">
            <div className="text-center">
                <span className="umd-pill umd-pill-indigo mb-4">
                    <BarChart3 aria-hidden="true" />{isFr ? "Comparer" : "Compare"}
                </span>
                <h1 className="umd-heading-1 mb-2">{isFr ? "Comparer les services" : "Compare services"}</h1>
                <p className="umd-lead-text mx-auto mb-6 max-w-2xl">
                    {isFr
                        ? "Ne choisissez plus au hasard. Confrontez deux services équivalents et trouvez l'alternative qui vous respecte."
                        : "Stop choosing at random. Compare two equivalent services and find the one that respects you."}
                </p>
            </div>

            {/* Best by domain — simple tag shortcuts */}
            <div className="mb-10">
                <span style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--indigo-600)", marginBottom: 8 }}>
                    {isFr ? "Raccourcis · quitter un géant" : "Shortcuts · leave a giant"}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {DOMAIN_COMPARISONS.map(d => {
                        const sa = byId[d.a], sb = byId[d.b];
                        if (!sa || !sb) return null;
                        const active = aId === d.a && bId === d.b;
                        return (
                            <button
                                key={d.key}
                                onClick={() => loadDomain(d)}
                                aria-pressed={active}
                                className="umd-chip"
                                style={{
                                    cursor: "pointer",
                                    border: active ? "1px solid var(--indigo-500)" : "1px solid var(--slate-200)",
                                    background: active ? "var(--indigo-50)" : "#fff",
                                    color: active ? "var(--indigo-700)" : "var(--fg2)",
                                    fontWeight: 600,
                                }}
                            >
                                <span aria-hidden="true">{d.icon}</span>
                                <span>{sa.name}</span>
                                <ArrowRight style={{ width: 13, height: 13, color: active ? "var(--indigo-600)" : "var(--fg3)" }} aria-hidden="true" />
                                <span style={{ fontWeight: 700, color: active ? "var(--indigo-700)" : "var(--green-700)" }}>{sb.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pickers */}
            <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
                {[{ label: isFr ? "Service A" : "Service A", value: aId, set: setAId, exclude: bId },
                { label: isFr ? "Service B" : "Service B", value: bId, set: setBId, exclude: aId }].map((p, i) => (
                    <div key={i} style={{ flex: 1, minWidth: 200 }}>
                        <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--fg2)", marginBottom: 6 }}>{p.label}</label>
                        <select className="umd-input" value={p.value} onChange={e => p.set(e.target.value)}>
                            {Object.keys(grouped).sort((x, y) => (CATEGORY_LABELS[x]?.fr ?? x).localeCompare(CATEGORY_LABELS[y]?.fr ?? y)).map(cat => (
                                <optgroup key={cat} label={isFr ? (CATEGORY_LABELS[cat]?.fr ?? cat) : (CATEGORY_LABELS[cat]?.en ?? cat)}>
                                    {grouped[cat].filter(s => s.slug !== p.exclude).map(s => (
                                        <option key={s.slug} value={s.slug}>{s.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            {!sameType && (
                <p className="umd-chip umd-chip-warn" style={{ marginBottom: 16 }}>
                    <Info aria-hidden="true" />
                    {isFr
                        ? `Types différents (${catLabel(a)} vs ${catLabel(b)}) — la comparaison est plus parlante entre services équivalents.`
                        : `Different types (${catLabel(a)} vs ${catLabel(b)}) — comparison is clearer between equivalent services.`}
                </p>
            )}

            {/* Head cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16, marginTop: 18 }}>
                <CmpHead m={a} win={winner === a} label={isFr ? "Plus respectueux" : "More respectful"} />
                <CmpHead m={b} win={winner === b} label={isFr ? "Plus respectueux" : "More respectful"} />
            </div>

            {/* Verdict banner */}
            {winner && loser && (
                <div style={{ marginBottom: 18, background: "var(--green-50)", border: "1px solid var(--green-200)", borderRadius: "var(--umd-radius-lg)", padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--green-600)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Award style={{ width: 22, height: 22 }} aria-hidden="true" />
                    </span>
                    <div style={{ flex: 1, minWidth: 220 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "var(--green-700)" }}>
                            {isFr ? `${winner.svc.name} respecte davantage vos données` : `${winner.svc.name} respects your data more`}
                        </p>
                        <p style={{ margin: "3px 0 0", fontSize: 13.5, lineHeight: 1.5, color: "var(--fg2)" }}>
                            {isFr
                                ? `Sur les critères vérifiables (traceurs, localisation, indépendance, incidents), ${winner.svc.name} l'emporte face à ${loser.svc.name}.`
                                : `On verifiable criteria (trackers, location, independence, incidents), ${winner.svc.name} wins over ${loser.svc.name}.`}
                        </p>
                    </div>
                </div>
            )}
            {!winner && (
                <p className="umd-chip umd-chip-neutral" style={{ marginBottom: 18 }}>
                    <Scale aria-hidden="true" />
                    {isFr ? "Match nul sur les critères vérifiables." : "Tie on verifiable criteria."}
                </p>
            )}

            {/* Criteria, grouped by theme */}
            <CmpSection icon={<Building2 style={{ width: 15, height: 15 }} aria-hidden="true" />} title={isFr ? "Identité & hébergement" : "Identity & hosting"}>
                {rows.type}
                {rows.country}
                {rows.eu}
                {rows.gafam}
            </CmpSection>
            <CmpSection icon={<Radar style={{ width: 15, height: 15 }} aria-hidden="true" />} title={isFr ? "Collecte & traçage" : "Collection & tracking"}>
                {rows.trackers}
            </CmpSection>
            <CmpSection icon={<ShieldAlert style={{ width: 15, height: 15 }} aria-hidden="true" />} title={isFr ? "Sécurité & incidents" : "Security & incidents"}>
                {rows.breach}
            </CmpSection>
            <CmpSection icon={<Compass style={{ width: 15, height: 15 }} aria-hidden="true" />} title={isFr ? "Souveraineté & alternatives" : "Sovereignty & alternatives"}>
                {rows.alt}
            </CmpSection>

            {/* Migration — always shown, targets the weaker service (or sovereign pick on a tie) */}
            <div style={{ marginTop: 4, background: "var(--indigo-50)", border: "1px solid var(--indigo-200)", borderRadius: "var(--umd-radius-lg)", padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <ArrowRight style={{ width: 20, height: 20, color: "var(--indigo-700)", flexShrink: 0 }} aria-hidden="true" />
                <div style={{ flex: 1, minWidth: 220 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>
                        {migrateTarget.migration
                            ? (isFr ? `Quitter ${migrateTarget.svc.name} pour ${migrateTarget.migration.name}` : `Leave ${migrateTarget.svc.name} for ${migrateTarget.migration.name}`)
                            : (isFr ? `Quitter ${migrateTarget.svc.name}` : `Leave ${migrateTarget.svc.name}`)}
                    </p>
                    <p style={{ margin: "3px 0 0", fontSize: 13.5, lineHeight: 1.5, color: "var(--fg2)" }}>
                        {isFr ? "Reprenez le contrôle : exportez puis supprimez vos données." : "Take back control: export then delete your data."}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {guideUrl && (
                        <button className="umd-btn umd-btn-outline umd-btn-sm" onClick={() => setOpenGuide("migration")}>
                            <BookOpenText className="h-4 w-4" aria-hidden="true" />{isFr ? "Guide de migration" : "Migration guide"}
                        </button>
                    )}
                    <button className="umd-btn umd-btn-primary umd-btn-sm" onClick={() => setDeleteDrawer(true)}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />{isFr ? `Quitter ${migrateTarget.svc.name}` : `Leave ${migrateTarget.svc.name}`}
                    </button>
                </div>
            </div>

            {openGuide === "migration" && guideUrl && migrateTarget.migration && (
                <GuideModal
                    url={guideUrl}
                    title={isFr ? `Migrer vers ${migrateTarget.migration.name}` : `Migrate to ${migrateTarget.migration.name}`}
                    closeLabel={isFr ? "Fermer" : "Close"}
                    emptyLabel={isFr ? "Guide indisponible." : "Guide unavailable."}
                    onClose={() => setOpenGuide(null)}
                />
            )}
            {deleteDrawer && (
                <ProtectActionDrawer
                    lang={locale}
                    mode="delete"
                    service={migrateTarget.svc as unknown as PdService}
                    alt={null}
                    onClose={() => setDeleteDrawer(false)}
                    onMode={() => { }}
                />
            )}

            <p style={{ fontSize: 12.5, marginTop: 16, lineHeight: 1.55, display: "flex", alignItems: "flex-start", gap: 8, color: "var(--fg3)" }}>
                <Info style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                {isFr
                    ? "Comparaison fondée sur des critères factuels et vérifiables. Une case verte indique l'option la plus protectrice pour ce critère."
                    : "Comparison based on factual, verifiable criteria. A green cell marks the more protective option for that criterion."}
            </p>

            {/* Deletion CTA */}
            <div className="mt-12 rounded-3xl bg-umd-indigo-900 p-8 text-center text-white">
                <h2 className="umd-heading-2 mb-4 text-2xl text-white">{t.t('takeControl')}</h2>
                <p className="mx-auto mb-8 max-w-2xl text-white/80">{t.t('takeControlDesc')}</p>
                <Link href={t.t('links.deleteMyData')} className="umd-btn bg-white text-umd-indigo-800 hover:bg-umd-indigo-50">
                    {t.t('accessDeletionTool')}
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
            </div>
        </div>
    );
}
