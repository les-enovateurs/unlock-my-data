"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, Building2, Calendar, Camera, Check, Clock,
    Compass, Copy, Database, Download, ExternalLink, FileText, Fingerprint, Flag, FolderOpen, Globe,
    History, IdCard, Landmark, Lightbulb, Lock, Mail, MapPin, Mic, Monitor, Network, PenLine,
    Radar, Search, Send, Shield, ShieldAlert, ShieldCheck, Smartphone, Trash2, UserCheck, Users, X,
} from "lucide-react";
import { translateDataClass } from "./manual-components/helpers";
import { getEmailTemplate } from "../../constants/emailTemplates";
import type { Service } from "@/constants/protectData";
import ProtectActionDrawer, { DrawerMode } from "../protect-my-data/ProtectActionDrawer";

/* ---------- Types (props prepared server-side in manual.tsx) ---------- */

export type FicheTracker = {
    id: number;
    name: string;
    country?: string;
    apps: { name: string; slug: string }[];
};

export type FichePerm = {
    perm: string;       // short name, e.g. CAMERA
    full: string;       // android.permission.CAMERA
    desc?: string;
    dangerous: boolean;
};

export type FicheBreach = {
    name: string;
    date: string;       // ISO
    count: number;
    kind: "intrusion" | "scrape";
    classes: string[];
    desc: string;       // plain text
};

export type FicheMemo = {
    date: string;       // ISO
    type: string;
    title: string;
    desc: string;
    url: string;
};

export type FicheApk = {
    handle: string;
    source: string;
    versionAnalysed?: string;
    versionName?: string;
    versionCode?: string;
    reportDate?: string; // ISO
    apkHash?: string;
} | null;

export type FicheAlternative = {
    name: string;
    slug: string;
    logo?: string;
    countryCode?: string;
    countryName?: string;
    nationality?: string;
    why?: string;
    whyEn?: string;
};

export type FicheProps = {
    lang: string;
    slug: string;
    name: string;
    logo?: string;
    category?: string;
    countryName?: string;
    groupName?: string;
    belongsToGroup?: boolean;
    nationality?: string;
    updatedAt?: string;
    updatedBy?: string;
    createdAt?: string;
    createdBy?: string;
    easy: number;
    easyMax: number;
    needIdCard?: boolean;
    viaForm?: boolean;
    viaEmail?: boolean;
    viaPostal?: boolean;
    urlExport?: string;
    addressExport?: string;
    contactMailExport?: string;
    contactMailDelete?: string;
    responseDelay?: string;
    responseFormat?: string;
    examplesDocumented: boolean;
    outsideEU?: boolean;
    destinations: { name: string; eu: boolean }[];
    quote?: string;
    sanctioned?: boolean;
    sanctionDetails?: string;
    hasDeleteOption: boolean;
    trackers: FicheTracker[];
    perms: FichePerm[];
    breaches: FicheBreach[];
    memos: FicheMemo[];
    apk: FicheApk;
    alternatives: FicheAlternative[];
    compareServicesParam: string;
};

/* ---------- i18n ---------- */

const TR: Record<string, Record<string, string>> = {
    fr: {
        back: "Retour au catalogue",
        verified: "Fiche vérifiée",
        group: "Groupe",
        tabEss: "L'essentiel",
        tabTech: "Données techniques",
        tabRights: "Vos droits (RGPD)",
        tabBreaches: "Fuites & CGU",
        tabGov: "Transferts & sanctions",
        getData: "Récupérer mes données",
        exposure: "Mon exposition",
        alternative: "Une alternative ?",
        yesOnline: "Oui, en ligne",
        yesEmail: "Oui, par e-mail",
        yesPostal: "Oui, par courrier",
        hard: "Difficile",
        watch: "À surveiller",
        limited: "Limitée",
        viaFormFact: "Via un formulaire, en étant connecté à son compte",
        viaEmailFact: "Par e-mail, auprès du service",
        viaPostalFact: "Par courrier postal",
        noChannelFact: "Aucun canal de demande documenté",
        noIdCard: "Sans pièce d'identité",
        idCardNeeded: "Pièce d'identité demandée",
        trackersFact: "traceurs intégrés à l'application Android",
        noTrackersFact: "Aucun traceur détecté dans l'application Android",
        outsideEUFact: "Données stockées en partie hors de l'UE",
        insideEUFact: "Pas de stockage hors UE documenté",
        breachesFact: "fuites ou extractions massives recensées",
        noBreachFact: "Aucune fuite recensée par Have I Been Pwned",
        seeRights: "Voir la démarche détaillée",
        seeTech: "Voir le détail technique",
        compareService: "Comparer ce service",
        migrateGuide: "Guide de migration",
        altYes: "Oui",
        altNone: "Pas d'équivalent",
        altNoneFact: "Aucune alternative comparable documentée à ce jour",
        altAdvice: "En attendant : limitez la visibilité du profil et la personnalisation publicitaire",
        toRemember: "À retenir.",
        deleteCta: "Supprimer mes données",
        exportCta: "Faire ma demande d'export",
        permsAsked: "permissions Android demandées",
        permsSensitive: "permissions sensibles",
        trackersCount: "traceurs intégrés",
        analysedOn: "analysée le",
        trackersTitle: "Traceurs intégrés",
        trackersSub: "Bibliothèques tierces détectées dans l'application Android (analyse statique Exodus Privacy). Sélectionnez un traceur pour voir où il se trouve aussi.",
        sharedIn: "Présent dans {n} applications du catalogue",
        sharedAlone: "Seule application du catalogue à l'embarquer",
        sharedTitle: "{t} est aussi intégré à {n} autres applications du catalogue",
        sharedDesc: "Un même traceur embarqué dans plusieurs applications observe à chaque fois son contexte d'usage — de quoi, potentiellement, recouper les habitudes d'une même personne d'une application à l'autre.",
        sharedAloneTitle: "{t} n'a été détecté dans aucune autre application du catalogue",
        sharedAloneDesc: "À ce jour, {s} est la seule application analysée qui l'embarque.",
        crossNote: "Présence croisée calculée à partir des liens traceurs–applications du catalogue (source : Exodus Privacy).",
        permsTitle: "Permissions demandées",
        permsSub: "Groupées par sensibilité — les plus intrusives d'abord.",
        permsSensLabel: "Permissions sensibles",
        permsSensSub: "Accès direct à vos données personnelles ou aux capteurs de l'appareil.",
        permsOtherLabel: "Autres permissions",
        permsOtherSub: "Connectivité, comptes et fonctionnement courant de l'application.",
        footprintTitle: "Empreinte de l'analyse",
        footprintSub: "De quoi vérifier la source et reproduire l'analyse.",
        pkg: "Paquet",
        source: "Source",
        versionAnalysed: "Version analysée",
        versionArchived: "Version archivée",
        apkHash: "Empreinte APK (SHA-256)",
        reportOf: "rapport du",
        playLink: "Fiche Google Play",
        exodusLink: "Rapport Exodus Privacy",
        noTechData: "Pas d'analyse technique disponible pour ce service.",
        rightsTitle: "Demander une copie de vos données",
        rightsSub: "Article 15 du RGPD — voici les canaux que {s} propose.",
        chanForm: "Formulaire en ligne",
        chanEmail: "Par e-mail",
        chanPostal: "Par courrier postal",
        offered: "Proposé",
        notOffered: "Non proposé",
        chanFormNote: "Depuis les paramètres du compte, en étant connecté.",
        chanFormOffNote: "Aucun formulaire d'export documenté.",
        chanEmailNote: "Demande par e-mail auprès du service.",
        chanEmailOffNote: "Aucune adresse de contact dédiée à l'export des données.",
        chanPostalNote: "Demande par courrier à l'adresse documentée.",
        chanPostalOffNote: "Aucune adresse postale documentée pour cette démarche.",
        conditions: "Conditions",
        idCardLabel: "Pièce d'identité",
        notRequired: "Non requise",
        required: "Requise",
        accountLabel: "Compte",
        loginRequired: "Connexion obligatoire",
        formatLabel: "Format de la réponse",
        notDocumented: "Non documenté",
        stepsTitle: "Déroulé de la démarche",
        step1: "Demande",
        step1Desc: "Faites votre demande via le canal proposé par le service.",
        step2: "Préparation",
        step2Desc: "Le service constitue l'archive de vos données.",
        step3: "Réponse",
        step4: "Téléchargement",
        step4Desc: "Récupérez l'archive rapidement — certains liens expirent.",
        easeTitle: "Facilité d'accès",
        easeOf: "sur",
        missingTitle: "Exemples manquants",
        missingDesc: "Le format de réponse et des captures de la démarche ne sont pas encore documentés. Vous l'avez faite ? Partagez vos exemples.",
        contribute: "Contribuer à la fiche",
        breachesTitle: "Fuites de données",
        breachesSub: "Incidents recensés par Have I Been Pwned pour ce service.",
        noBreaches: "Aucune fuite recensée par Have I Been Pwned pour ce service.",
        intrusion: "Intrusion",
        scrape: "Extraction massive",
        accounts: "de comptes touchés",
        checkPwned: "Vérifier si mon adresse est concernée",
        termsTitle: "Évolution des conditions d'utilisation",
        termsSub: "Mémos rédigés par Open Terms Archive à partir des modifications suivies des documents contractuels.",
        noTerms: "Aucun mémo Open Terms Archive pour ce service.",
        termsSource: "Source : Open Terms Archive.",
        whoTitle: "Qui détient vos données",
        company: "Société",
        nationalityLabel: "Nationalité",
        whereTitle: "Où circulent vos données",
        whereSub: "Destinations de transfert déclarées dans la politique de confidentialité.",
        outsideEUNote: "Une partie des données est stockée en dehors de l'Union européenne.",
        insideEUNote: "Aucun transfert hors UE documenté.",
        privacyPolicy: "Politique de confidentialité",
        cnilTitle: "Sanctions CNIL",
        noSanction: "Aucune sanction directe à ce jour",
        sanctioned: "Sanctionné par la CNIL",
        context: "Contexte.",
        createdOn: "Fiche créée le {d} par {b}",
        updatedOn: "Mise à jour le {d} par {b}",
        techSource: "Analyse technique : Exodus Privacy, rapport du {d}",
        seeFiche: "Voir la fiche",
        mailCopyBtn: "Préparer l'e-mail de demande",
        mailDeleteBtn: "Préparer l'e-mail de suppression",
        mailCopyTitle: "Modèle de mail · accès aux données ·",
        mailDeleteTitle: "Modèle de mail · suppression ·",
        mailTo: "À :",
        mailNoRecipient: "adresse à trouver sur le service",
        mailSubjectLabel: "Objet :",
        mailCopy: "Copier",
        mailCopied: "Copié",
        mailSend: "Ouvrir dans ma messagerie",
    },
    en: {
        back: "Back to the catalog",
        verified: "Verified record",
        group: "Group",
        tabEss: "Essentials",
        tabTech: "Technical data",
        tabRights: "Your rights (GDPR)",
        tabBreaches: "Breaches & ToS",
        tabGov: "Transfers & sanctions",
        getData: "Get my data",
        exposure: "My exposure",
        alternative: "An alternative?",
        yesOnline: "Yes, online",
        yesEmail: "Yes, by email",
        yesPostal: "Yes, by post",
        hard: "Difficult",
        watch: "Watch out",
        limited: "Limited",
        viaFormFact: "Via a form, while logged into your account",
        viaEmailFact: "By email, to the service",
        viaPostalFact: "By postal mail",
        noChannelFact: "No documented request channel",
        noIdCard: "No ID document required",
        idCardNeeded: "ID document requested",
        trackersFact: "trackers embedded in the Android app",
        noTrackersFact: "No tracker detected in the Android app",
        outsideEUFact: "Data partly stored outside the EU",
        insideEUFact: "No storage outside the EU documented",
        breachesFact: "breaches or mass extractions on record",
        noBreachFact: "No breach recorded by Have I Been Pwned",
        seeRights: "See the detailed procedure",
        seeTech: "See technical details",
        compareService: "Compare this service",
        migrateGuide: "Migration guide",
        altYes: "Yes",
        altNone: "No equivalent",
        altNoneFact: "No comparable alternative documented to date",
        altAdvice: "Meanwhile: limit profile visibility and ad personalisation",
        toRemember: "Key takeaway.",
        deleteCta: "Delete my data",
        exportCta: "Request my data export",
        permsAsked: "Android permissions requested",
        permsSensitive: "sensitive permissions",
        trackersCount: "embedded trackers",
        analysedOn: "analysed on",
        trackersTitle: "Embedded trackers",
        trackersSub: "Third-party libraries detected in the Android app (Exodus Privacy static analysis). Select a tracker to see where else it is found.",
        sharedIn: "Found in {n} apps of the catalog",
        sharedAlone: "Only app of the catalog embedding it",
        sharedTitle: "{t} is also embedded in {n} other apps of the catalog",
        sharedDesc: "The same tracker embedded in several apps observes its usage context each time — potentially enough to cross-reference one person's habits from one app to another.",
        sharedAloneTitle: "{t} was not detected in any other app of the catalog",
        sharedAloneDesc: "To date, {s} is the only analysed app embedding it.",
        crossNote: "Cross-presence computed from the catalog's tracker–app links (source: Exodus Privacy).",
        permsTitle: "Requested permissions",
        permsSub: "Grouped by sensitivity — most intrusive first.",
        permsSensLabel: "Sensitive permissions",
        permsSensSub: "Direct access to your personal data or device sensors.",
        permsOtherLabel: "Other permissions",
        permsOtherSub: "Connectivity, accounts and routine app operation.",
        footprintTitle: "Analysis footprint",
        footprintSub: "Everything needed to verify the source and reproduce the analysis.",
        pkg: "Package",
        source: "Source",
        versionAnalysed: "Analysed version",
        versionArchived: "Archived version",
        apkHash: "APK fingerprint (SHA-256)",
        reportOf: "report of",
        playLink: "Google Play page",
        exodusLink: "Exodus Privacy report",
        noTechData: "No technical analysis available for this service.",
        rightsTitle: "Request a copy of your data",
        rightsSub: "GDPR Article 15 — here are the channels {s} offers.",
        chanForm: "Online form",
        chanEmail: "By email",
        chanPostal: "By postal mail",
        offered: "Offered",
        notOffered: "Not offered",
        chanFormNote: "From the account settings, while logged in.",
        chanFormOffNote: "No documented export form.",
        chanEmailNote: "Request by email to the service.",
        chanEmailOffNote: "No contact address dedicated to data export.",
        chanPostalNote: "Request by mail to the documented address.",
        chanPostalOffNote: "No postal address documented for this procedure.",
        conditions: "Conditions",
        idCardLabel: "ID document",
        notRequired: "Not required",
        required: "Required",
        accountLabel: "Account",
        loginRequired: "Login required",
        formatLabel: "Response format",
        notDocumented: "Not documented",
        stepsTitle: "How the procedure unfolds",
        step1: "Request",
        step1Desc: "Make your request through the channel the service offers.",
        step2: "Preparation",
        step2Desc: "The service builds your data archive.",
        step3: "Response",
        step4: "Download",
        step4Desc: "Retrieve the archive quickly — some links expire.",
        easeTitle: "Ease of access",
        easeOf: "out of",
        missingTitle: "Missing examples",
        missingDesc: "The response format and screenshots of the procedure are not documented yet. Did you go through it? Share your examples.",
        contribute: "Contribute to this record",
        breachesTitle: "Data breaches",
        breachesSub: "Incidents recorded by Have I Been Pwned for this service.",
        noBreaches: "No breach recorded by Have I Been Pwned for this service.",
        intrusion: "Intrusion",
        scrape: "Mass extraction",
        accounts: "accounts affected",
        checkPwned: "Check if my address is affected",
        termsTitle: "Terms of service changes",
        termsSub: "Memos written by Open Terms Archive from tracked changes to contractual documents.",
        noTerms: "No Open Terms Archive memo for this service.",
        termsSource: "Source: Open Terms Archive.",
        whoTitle: "Who holds your data",
        company: "Company",
        nationalityLabel: "Nationality",
        whereTitle: "Where your data travels",
        whereSub: "Transfer destinations declared in the privacy policy.",
        outsideEUNote: "Part of the data is stored outside the European Union.",
        insideEUNote: "No transfer outside the EU documented.",
        privacyPolicy: "Privacy policy",
        cnilTitle: "CNIL sanctions",
        noSanction: "No direct sanction to date",
        sanctioned: "Sanctioned by the CNIL",
        context: "Context.",
        createdOn: "Record created on {d} by {b}",
        updatedOn: "Updated on {d} by {b}",
        techSource: "Technical analysis: Exodus Privacy, report of {d}",
        seeFiche: "See the record",
        mailCopyBtn: "Prepare the request email",
        mailDeleteBtn: "Prepare the deletion email",
        mailCopyTitle: "Email template · data access ·",
        mailDeleteTitle: "Email template · deletion ·",
        mailTo: "To:",
        mailNoRecipient: "find the address on the service",
        mailSubjectLabel: "Subject:",
        mailCopy: "Copy",
        mailCopied: "Copied",
        mailSend: "Open in my mail app",
    },
};

function useT(lang: string) {
    return (key: string, vars?: Record<string, string | number>) => {
        let s = TR[lang]?.[key] ?? TR.fr[key] ?? key;
        if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
        return s;
    };
}

function fmtDate(iso: string | undefined, lang: string) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "short", day: "numeric" });
}

function fmtCount(n: number, lang: string) {
    const locale = lang === "fr" ? "fr-FR" : "en-US";
    return n >= 1e6 ? (n / 1e6).toLocaleString(locale, { maximumFractionDigits: 1 }) + " M" : n.toLocaleString(locale);
}

/* ---------- Map fiche props → Service shape for the action drawer ---------- */

function ficheToService(p: FicheProps): Service {
    return {
        slug: p.slug,
        name: p.name,
        logo: p.logo || "",
        country_name: p.countryName,
        nationality: p.nationality,
        contact_mail_delete: p.contactMailDelete || p.contactMailExport,
    } as Service;
}

function altToService(a: FicheAlternative): Service {
    return {
        slug: a.slug,
        name: a.name,
        logo: a.logo || "",
        country_code: a.countryCode,
        country_name: a.countryName,
        nationality: a.nationality,
        better_alternative_explication: a.why,
        better_alternative_explication_en: a.whyEn,
    } as Service;
}

/* ---------- Small pieces ---------- */

function Dots({ n, max, label }: { n: number; max: number; label: string }) {
    return (
        <span className="umd-dots" role="img" aria-label={label}>
            {Array.from({ length: max }, (_, i) => (
                <span key={i} className={"umd-dot" + (i < n ? " on" : "")} />
            ))}
        </span>
    );
}

function SecHead({ title, sub, first = false }: { title: string; sub?: string; first?: boolean }) {
    return (
        <div className={first ? "mb-4" : "mt-9 mb-4"}>
            <h3 className="umd-heading-3 !text-[19px]">{title}</h3>
            {sub && <p className="text-umd-slate-600 text-[13.5px] mt-1 m-0">{sub}</p>}
        </div>
    );
}

const PERM_ICONS: Array<[RegExp, typeof MapPin]> = [
    [/LOCATION/, MapPin],
    [/CAMERA/, Camera],
    [/RECORD_AUDIO|MICROPHONE/, Mic],
    [/CONTACTS/, Users],
    [/CALENDAR/, Calendar],
    [/PHONE|CALL/, Smartphone],
    [/STORAGE|MEDIA|DOCUMENTS/, FolderOpen],
    [/AD_ID|ADVERTISING/, Fingerprint],
    [/ACCOUNTS/, IdCard],
];

function permIcon(full: string) {
    const found = PERM_ICONS.find(([re]) => re.test(full));
    return found ? found[1] : ShieldAlert;
}

/* ---------- GDPR email template modal (Art. 15 copy / Art. 17 deletion) ---------- */

function MailTemplateModal({ title, recipient, subject, body, t, onClose }: {
    title: string; recipient?: string; subject: string; body: string;
    t: ReturnType<typeof useT>; onClose: () => void;
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
                    <h3 className="umd-heading-3" style={{ fontSize: 18 }}>{title}</h3>
                    <button onClick={onClose} aria-label={t("back")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--fg2)" }}>
                        <X style={{ width: 20, height: 20 }} aria-hidden="true" />
                    </button>
                </div>

                <p style={{ fontSize: 13, margin: "0 0 4px", color: "var(--fg3)" }}>
                    <strong style={{ color: "var(--fg2)" }}>{t("mailTo")} </strong>
                    {recipient || <em>{t("mailNoRecipient")}</em>}
                </p>
                <p style={{ fontSize: 13, margin: "0 0 12px", color: "var(--fg3)" }}>
                    <strong style={{ color: "var(--fg2)" }}>{t("mailSubjectLabel")} </strong>{subject}
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
                        {copied ? t("mailCopied") : t("mailCopy")}
                    </button>
                    {mailto && (
                        <a className="umd-btn umd-btn-primary umd-btn-sm" href={mailto}>
                            <Mail className="h-4 w-4" aria-hidden="true" />{t("mailSend")}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------- Tabs ---------- */

function TabEssentiel({ p, t, goTab }: { p: FicheProps; t: ReturnType<typeof useT>; goTab: (id: string) => void }) {
    const lang = p.lang;
    const accessAnswer = p.viaForm ? t("yesOnline") : p.viaEmail ? t("yesEmail") : p.viaPostal ? t("yesPostal") : t("hard");
    const exposed = p.trackers.length > 5 || p.breaches.length > 0 || p.outsideEU;
    const compareHref = (lang === "fr" ? "/comparer" : "/compare") + `?services=${p.compareServicesParam}`;

    // Reuse the protect-my-data action drawer (compare / guide / delete).
    const selfSvc = ficheToService(p);
    const firstAlt = p.alternatives[0] ? altToService(p.alternatives[0]) : null;
    const [drawer, setDrawer] = useState<{ mode: DrawerMode; alt: Service | null } | null>(null);

    return (
        <div>
            <div className="umd-ess-grid">
                <div className="umd-card umd-ess-card">
                    <div className="umd-ess-head"><Download aria-hidden="true" /><h2 className="umd-heading-3 !text-base m-0">{t("getData")}</h2></div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="umd-ess-answer">{accessAnswer}</span>
                        <Dots n={p.easy} max={p.easyMax} label={`${t("easeTitle")} : ${p.easy}/${p.easyMax}`} />
                    </div>
                    <div>
                        <div className="umd-fact"><Globe aria-hidden="true" /><span>{p.viaForm ? t("viaFormFact") : p.viaEmail ? t("viaEmailFact") : p.viaPostal ? t("viaPostalFact") : t("noChannelFact")}</span></div>
                        <div className="umd-fact"><IdCard aria-hidden="true" /><span>{p.needIdCard ? t("idCardNeeded") : t("noIdCard")}</span></div>
                        {p.responseDelay && <div className="umd-fact"><Clock aria-hidden="true" /><span>{p.responseDelay}</span></div>}
                    </div>
                    <button className="umd-ess-link" onClick={() => goTab("droits")}>{t("seeRights")}<ArrowRight aria-hidden="true" /></button>
                </div>

                <div className="umd-card umd-ess-card">
                    <div className="umd-ess-head"><Radar aria-hidden="true" /><h2 className="umd-heading-3 !text-base m-0">{t("exposure")}</h2></div>
                    <span className="umd-ess-answer">{exposed ? t("watch") : t("limited")}</span>
                    <div>
                        <div className="umd-fact"><Radar aria-hidden="true" /><span>{p.trackers.length > 0 ? `${p.trackers.length} ${t("trackersFact")}` : t("noTrackersFact")}</span></div>
                        <div className="umd-fact"><Globe aria-hidden="true" /><span>{p.outsideEU ? t("outsideEUFact") : t("insideEUFact")}</span></div>
                        <div className="umd-fact"><ShieldAlert aria-hidden="true" /><span>{p.breaches.length > 0 ? `${p.breaches.length} ${t("breachesFact")}` : t("noBreachFact")}</span></div>
                    </div>
                    <button className="umd-ess-link" onClick={() => goTab("tech")}>{t("seeTech")}<ArrowRight aria-hidden="true" /></button>
                </div>

                <div className="umd-card umd-ess-card">
                    <div className="umd-ess-head"><Compass aria-hidden="true" /><h2 className="umd-heading-3 !text-base m-0">{t("alternative")}</h2></div>
                    <span className="umd-ess-answer">{p.alternatives.length > 0 ? t("altYes") : t("altNone")}</span>
                    <div>
                        {p.alternatives.length > 0 ? (
                            p.alternatives.slice(0, 3).map((a) => (
                                <div className="umd-fact" key={a.slug}>
                                    <ShieldCheck aria-hidden="true" />
                                    <span>
                                        <Link href={`${lang === "fr" ? "/liste-applications" : "/list-app"}/${a.slug}`} className="font-semibold hover:text-umd-indigo-700 underline underline-offset-2">{a.name}</Link>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="umd-fact"><Search aria-hidden="true" /><span>{t("altNoneFact")}</span></div>
                                <div className="umd-fact"><ShieldCheck aria-hidden="true" /><span>{t("altAdvice")}</span></div>
                            </>
                        )}
                    </div>
                    {firstAlt ? (
                        <div className="flex flex-wrap gap-3 mt-1">
                            <button className="umd-ess-link" onClick={() => setDrawer({ mode: "compare", alt: firstAlt })}>
                                {t("compareService")}<ArrowRight aria-hidden="true" />
                            </button>
                            <button className="umd-ess-link" onClick={() => setDrawer({ mode: "guide", alt: firstAlt })}>
                                {t("migrateGuide")}<ArrowRight aria-hidden="true" />
                            </button>
                        </div>
                    ) : (
                        <Link href={compareHref} className="umd-ess-link">{t("compareService")}<ArrowRight aria-hidden="true" /></Link>
                    )}
                </div>
            </div>

            <div className="umd-retenir">
                <Lightbulb aria-hidden="true" />
                <p className="m-0 text-[14.5px] leading-relaxed">
                    <b>{t("toRemember")}</b>{" "}
                    {accessAnswer} — {p.needIdCard ? t("idCardNeeded").toLowerCase() : t("noIdCard").toLowerCase()}
                    {p.responseDelay ? `, ${p.responseDelay.charAt(0).toLowerCase()}${p.responseDelay.slice(1)}` : ""}.{" "}
                    {p.trackers.length > 0 ? `${p.trackers.length} ${t("trackersFact")}` : t("noTrackersFact")}
                    {p.outsideEU ? ` · ${t("outsideEUFact").toLowerCase()}` : ""}
                    {p.breaches.length > 0 ? ` · ${p.breaches.length} ${t("breachesFact")}` : ""}.
                </p>
            </div>

            <div className="flex gap-3 mt-6 flex-wrap">
                {p.hasDeleteOption && (
                    <button className="umd-btn umd-btn-primary" onClick={() => setDrawer({ mode: "delete", alt: null })}>
                        <Send aria-hidden="true" />{t("deleteCta")}
                    </button>
                )}
                <Link href={compareHref} className="umd-btn umd-btn-outline">
                    <Shield aria-hidden="true" />{t("compareService")}
                </Link>
            </div>

            {drawer && (
                <ProtectActionDrawer
                    lang={lang}
                    mode={drawer.mode}
                    service={selfSvc}
                    alt={drawer.alt}
                    onClose={() => setDrawer(null)}
                    onMode={(mode) => setDrawer((d) => (d ? { ...d, mode } : d))}
                />
            )}
        </div>
    );
}

function TabTech({ p, t }: { p: FicheProps; t: ReturnType<typeof useT> }) {
    const [selTrk, setSelTrk] = useState<number | null>(null);
    const sel = p.trackers.find((tr) => tr.id === selTrk);
    const sensitive = p.perms.filter((x) => x.dangerous);
    const others = p.perms.filter((x) => !x.dangerous);
    const lang = p.lang;

    if (!p.apk && p.perms.length === 0 && p.trackers.length === 0) {
        return <p className="text-umd-slate-600">{t("noTechData")}</p>;
    }

    return (
        <div>
            <div className="umd-stat-row">
                <div className="umd-stat"><b>{p.perms.length}</b><span>{t("permsAsked")}</span></div>
                <div className={"umd-stat" + (sensitive.length > 0 ? " accent" : "")}><b>{sensitive.length}</b><span>{t("permsSensitive")}</span></div>
                <div className="umd-stat"><b>{p.trackers.length}</b><span>{t("trackersCount")}</span></div>
                {p.apk?.versionAnalysed && (
                    <div className="umd-stat"><b className="!text-[21px] pt-1 pb-0.5">v{p.apk.versionAnalysed}</b><span>{t("analysedOn")} {fmtDate(p.apk.reportDate, lang)}</span></div>
                )}
            </div>

            {p.trackers.length > 0 && (
                <>
                    <SecHead title={t("trackersTitle")} sub={t("trackersSub")} />
                    <div className="umd-trk-grid">
                        {p.trackers.map((tr) => (
                            <button className="umd-trk" key={tr.id} aria-pressed={selTrk === tr.id}
                                onClick={() => setSelTrk(selTrk === tr.id ? null : tr.id)}>
                                <b>{tr.name}</b>
                                {tr.country && <span className="umd-trk-own">{tr.country}</span>}
                                <span className="umd-trk-shared">
                                    {tr.apps.length > 0 ? t("sharedIn", { n: tr.apps.length + 1 }) : t("sharedAlone")}
                                </span>
                                <span className="umd-trk-foot"><span className="umd-trk-id">#{tr.id}</span></span>
                            </button>
                        ))}
                    </div>
                    {sel && (
                        <div className="umd-shared-panel">
                            {sel.apps.length > 0 ? (
                                <>
                                    <b className="text-[14.5px]">{t("sharedTitle", { t: sel.name, n: sel.apps.length })}</b>
                                    <p className="text-umd-slate-600 text-[13px] leading-relaxed mt-1.5 m-0">{t("sharedDesc")}</p>
                                    <div className="umd-app-chips">
                                        {sel.apps.map((a) => (
                                            <Link className="umd-app-chip" key={a.slug} href={`${lang === "fr" ? "/liste-applications" : "/list-app"}/${a.slug}`}>{a.name}</Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <b className="text-[14.5px]">{t("sharedAloneTitle", { t: sel.name })}</b>
                                    <p className="text-umd-slate-600 text-[13px] leading-relaxed mt-1.5 m-0">{t("sharedAloneDesc", { s: p.name })}</p>
                                </>
                            )}
                        </div>
                    )}
                    <p className="text-umd-slate-500 text-xs mt-2.5">{t("crossNote")}</p>
                </>
            )}

            {p.perms.length > 0 && (
                <>
                    <SecHead title={t("permsTitle")} sub={t("permsSub")} />
                    {sensitive.length > 0 && (
                        <div className="umd-pgroup">
                            <div className="umd-pgroup-head">
                                <span className="umd-pdot" style={{ background: "var(--red-500)" }} />
                                <h4 className="font-display font-bold">{t("permsSensLabel")}</h4>
                                <span className="umd-pcount">{sensitive.length}</span>
                            </div>
                            <p className="umd-pgroup-sub">{t("permsSensSub")}</p>
                            <div className="umd-perm-grid">
                                {sensitive.map((perm) => {
                                    const PIcon = permIcon(perm.full);
                                    return (
                                        <div className="umd-perm-card" key={perm.full}>
                                            <span className="umd-perm-ic"><PIcon aria-hidden="true" /></span>
                                            <span className="min-w-0">
                                                <b>{perm.perm}</b>
                                                {perm.desc && <span className="umd-pdesc block">{perm.desc}</span>}
                                                <span className="umd-permono block">{perm.full}</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {others.length > 0 && (
                        <div className="umd-pgroup">
                            <div className="umd-pgroup-head">
                                <span className="umd-pdot" style={{ background: "var(--slate-300)" }} />
                                <h4 className="font-display font-bold">{t("permsOtherLabel")}</h4>
                                <span className="umd-pcount">{others.length}</span>
                            </div>
                            <p className="umd-pgroup-sub">{t("permsOtherSub")}</p>
                            <div className="umd-perm-rows">
                                {others.map((perm) => (
                                    <div className="umd-perm-row" key={perm.full}>
                                        <span>{perm.perm}</span>
                                        <span className="umd-permono">{perm.full.split(".").pop()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {p.apk && (
                <>
                    <SecHead title={t("footprintTitle")} sub={t("footprintSub")} />
                    <div className="umd-card px-6 py-5">
                        <dl className="umd-speclist">
                            <dt>{t("pkg")}</dt><dd>{p.apk.handle}</dd>
                            <dt>{t("source")}</dt><dd>{p.apk.source}</dd>
                            {p.apk.versionAnalysed && <><dt>{t("versionAnalysed")}</dt><dd>{p.apk.versionAnalysed} · {t("reportOf")} {fmtDate(p.apk.reportDate, lang)}</dd></>}
                            {p.apk.versionName && <><dt>{t("versionArchived")}</dt><dd>{p.apk.versionName}{p.apk.versionCode ? ` (code ${p.apk.versionCode})` : ""}</dd></>}
                            {p.apk.apkHash && <><dt>{t("apkHash")}</dt><dd>{p.apk.apkHash}</dd></>}
                        </dl>
                        <div className="flex gap-2.5 mt-5 flex-wrap">
                            <a className="umd-btn umd-btn-outline umd-btn-sm" href={`https://play.google.com/store/apps/details?id=${p.apk.handle}`} target="_blank" rel="noreferrer">
                                <ExternalLink aria-hidden="true" />{t("playLink")}
                            </a>
                            <a className="umd-btn umd-btn-outline umd-btn-sm" href={`https://reports.exodus-privacy.eu.org/fr/reports/${p.apk.handle}/latest/`} target="_blank" rel="noreferrer">
                                <ExternalLink aria-hidden="true" />{t("exodusLink")}
                            </a>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function TabDroits({ p, t }: { p: FicheProps; t: ReturnType<typeof useT> }) {
    const lang = p.lang;
    const contributeHref = lang === "fr" ? "/contribuer/modifier-fiche" : "/contribute/update-form";
    const [mailMode, setMailMode] = useState<null | "copy">(null);
    const [deleteDrawer, setDeleteDrawer] = useState(false);
    const selfSvc = ficheToService(p);
    return (
        <div>
            <SecHead first title={t("rightsTitle")} sub={t("rightsSub", { s: p.name })} />
            <div className="umd-chan-grid">
                <div className={"umd-chan" + (p.viaForm ? "" : " off")}>
                    <div className="umd-chan-top"><Globe aria-hidden="true" /><b>{t("chanForm")}</b></div>
                    {p.viaForm
                        ? <span className="umd-chip umd-chip-safe w-fit"><Check aria-hidden="true" />{t("offered")}</span>
                        : <span className="umd-chip umd-chip-neutral w-fit"><X aria-hidden="true" />{t("notOffered")}</span>}
                    <p className="umd-chan-note">{p.viaForm ? t("chanFormNote") : t("chanFormOffNote")}</p>
                    {p.viaForm && p.urlExport && (
                        <a className="umd-ess-link" href={p.urlExport} target="_blank" rel="noreferrer">{t("exportCta")}<ExternalLink aria-hidden="true" /></a>
                    )}
                </div>
                <div className={"umd-chan" + (p.viaEmail ? "" : " off")}>
                    <div className="umd-chan-top"><Mail aria-hidden="true" /><b>{t("chanEmail")}</b></div>
                    {p.viaEmail
                        ? <span className="umd-chip umd-chip-safe w-fit"><Check aria-hidden="true" />{t("offered")}</span>
                        : <span className="umd-chip umd-chip-neutral w-fit"><X aria-hidden="true" />{t("notOffered")}</span>}
                    <p className="umd-chan-note">{p.viaEmail ? (p.contactMailExport || t("chanEmailNote")) : t("chanEmailOffNote")}</p>
                </div>
                <div className={"umd-chan" + (p.viaPostal ? "" : " off")}>
                    <div className="umd-chan-top"><Send aria-hidden="true" /><b>{t("chanPostal")}</b></div>
                    {p.viaPostal
                        ? <span className="umd-chip umd-chip-safe w-fit"><Check aria-hidden="true" />{t("offered")}</span>
                        : <span className="umd-chip umd-chip-neutral w-fit"><X aria-hidden="true" />{t("notOffered")}</span>}
                    <p className="umd-chan-note">{p.viaPostal ? (p.addressExport || t("chanPostalNote")) : t("chanPostalOffNote")}</p>
                </div>
            </div>

            <SecHead title={t("conditions")} />
            <div className="umd-card px-6 py-1.5">
                <div className="umd-cond-row">
                    <IdCard aria-hidden="true" /><span className="umd-cond-label">{t("idCardLabel")}</span>
                    {p.needIdCard
                        ? <span className="umd-chip umd-chip-warn">{t("required")}</span>
                        : <span className="umd-chip umd-chip-safe">{t("notRequired")}</span>}
                </div>
                {p.viaForm && (
                    <div className="umd-cond-row">
                        <Lock aria-hidden="true" /><span className="umd-cond-label">{t("accountLabel")}</span>
                        <span className="umd-chip umd-chip-neutral">{t("loginRequired")}</span>
                    </div>
                )}
                <div className="umd-cond-row">
                    <FileText aria-hidden="true" /><span className="umd-cond-label">{t("formatLabel")}</span>
                    <span className={"umd-chip " + (p.responseFormat ? "umd-chip-info" : "umd-chip-neutral")}>{p.responseFormat || t("notDocumented")}</span>
                </div>
            </div>

            <SecHead title={t("stepsTitle")} />
            <div className="umd-steps">
                <div className="umd-step"><span className="umd-step-n">1</span><b>{t("step1")}</b><p>{t("step1Desc")}</p>
                    <button className="umd-ess-link" onClick={() => setMailMode("copy")}>{t("mailCopyBtn")}<Mail aria-hidden="true" /></button>
                </div>
                <div className="umd-step"><span className="umd-step-n">2</span><b>{t("step2")}</b><p>{t("step2Desc")}</p></div>
                <div className="umd-step"><span className="umd-step-n">3</span><b>{t("step3")}</b><p>{p.responseDelay || t("notDocumented")}</p></div>
                <div className="umd-step warn"><span className="umd-step-n">!</span><b>{t("step4")}</b><p>{t("step4Desc")}</p></div>
            </div>

            <SecHead title={t("easeTitle")} />
            <div className="umd-card px-6 py-4 flex items-center gap-4 flex-wrap">
                <Dots n={p.easy} max={p.easyMax} label={`${t("easeTitle")} : ${p.easy}/${p.easyMax}`} />
                <b className="font-display text-base">{p.easy} {t("easeOf")} {p.easyMax}</b>
            </div>

            {!p.examplesDocumented && (
                <div className="umd-card px-5 py-4 mt-7 flex gap-3.5 items-center flex-wrap">
                    <PenLine aria-hidden="true" className="w-[18px] h-[18px] text-umd-indigo-600 shrink-0" />
                    <div className="flex-1 min-w-60">
                        <b className="text-[14.5px]">{t("missingTitle")}</b>
                        <p className="text-umd-slate-600 text-[13px] leading-relaxed m-0 mt-0.5">{t("missingDesc")}</p>
                    </div>
                    <Link href={contributeHref} className="umd-btn umd-btn-outline umd-btn-sm">{t("contribute")}</Link>
                </div>
            )}

            {p.hasDeleteOption && (
                <div className="flex gap-3 mt-6 flex-wrap">
                    <button className="umd-btn umd-btn-primary" onClick={() => setDeleteDrawer(true)}>
                        <Trash2 aria-hidden="true" />{t("mailDeleteBtn")}
                    </button>
                </div>
            )}

            {deleteDrawer && (
                <ProtectActionDrawer
                    lang={lang}
                    mode="delete"
                    service={selfSvc}
                    alt={null}
                    onClose={() => setDeleteDrawer(false)}
                    onMode={() => { }}
                />
            )}

            {mailMode === "copy" && (() => {
                const tpl = getEmailTemplate(lang, p.name, "copy");
                return (
                    <MailTemplateModal
                        title={`${t("mailCopyTitle")} ${p.name}`}
                        recipient={p.contactMailExport?.trim() || undefined}
                        subject={tpl.subject}
                        body={tpl.body}
                        t={t}
                        onClose={() => setMailMode(null)}
                    />
                );
            })()}
        </div>
    );
}

function TabFuites({ p, t }: { p: FicheProps; t: ReturnType<typeof useT> }) {
    const lang = p.lang;
    return (
        <div>
            <SecHead first title={t("breachesTitle")} sub={t("breachesSub")} />
            {p.breaches.length > 0 ? (
                <>
                    <div className="umd-breach-grid">
                        {p.breaches.map((b) => (
                            <div className="umd-breach" key={b.name + b.date}>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={"umd-chip " + (b.kind === "intrusion" ? "umd-chip-danger" : "umd-chip-warn") + " !text-[11.5px] !px-2.5 !py-1"}>
                                        {t(b.kind)}
                                    </span>
                                    <span className="text-umd-slate-500 text-[12.5px]">{fmtDate(b.date, lang)}</span>
                                </div>
                                <div>
                                    <div className="umd-bcount">{fmtCount(b.count, lang)} <small>{t("accounts")}</small></div>
                                    <b className="text-sm">{b.name}</b>
                                </div>
                                {b.desc && <p className="umd-bdesc">{b.desc}</p>}
                                <div className="umd-bclasses">
                                    {b.classes.map((c) => <span className="umd-bclass" key={c}>{translateDataClass(c, lang)}</span>)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2.5 mt-3.5 flex-wrap">
                        <a className="umd-btn umd-btn-outline umd-btn-sm" href="https://haveibeenpwned.com" target="_blank" rel="noreferrer">
                            <ExternalLink aria-hidden="true" />{t("checkPwned")}
                        </a>
                    </div>
                </>
            ) : (
                <p className="text-umd-slate-600 text-sm">{t("noBreaches")}</p>
            )}

            <SecHead title={t("termsTitle")} sub={t("termsSub")} />
            {p.memos.length > 0 ? (
                <>
                    <div className="umd-card px-6 py-1.5">
                        {p.memos.map((m) => (
                            <div className="umd-memo" key={m.url}>
                                <span className="umd-mdate">{fmtDate(m.date, lang)}</span>
                                <div>
                                    {m.type && <div className="mb-1"><span className="umd-chip umd-chip-neutral !text-[11px] !px-2 !py-0.5">{m.type}</span></div>}
                                    <b><a href={m.url} target="_blank" rel="noreferrer" className="hover:text-umd-indigo-700">{m.title}</a></b>
                                    {m.desc && <p>{m.desc}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-umd-slate-500 text-xs mt-2.5">{t("termsSource")}</p>
                </>
            ) : (
                <p className="text-umd-slate-600 text-sm">{t("noTerms")}</p>
            )}
        </div>
    );
}

function TabGouv({ p, t }: { p: FicheProps; t: ReturnType<typeof useT> }) {
    return (
        <div>
            <SecHead first title={t("whoTitle")} />
            <div className="umd-card px-6 py-1.5">
                <div className="umd-cond-row"><Building2 aria-hidden="true" /><span className="umd-cond-label">{t("company")}</span><span className="umd-chip umd-chip-neutral">{p.name}</span></div>
                {p.belongsToGroup && p.groupName && (
                    <div className="umd-cond-row"><Network aria-hidden="true" /><span className="umd-cond-label">{t("group")}</span><span className="umd-chip umd-chip-neutral">{p.groupName}</span></div>
                )}
                {p.nationality && (
                    <div className="umd-cond-row"><Flag aria-hidden="true" /><span className="umd-cond-label">{t("nationalityLabel")}</span><span className="umd-chip umd-chip-neutral">{p.nationality}</span></div>
                )}
            </div>

            <SecHead title={t("whereTitle")} sub={t("whereSub")} />
            <div className="umd-card px-6 py-5">
                {p.destinations.length > 0 && (
                    <div className="umd-dest-row">
                        {p.destinations.map((d) => (
                            <span key={d.name} className={"umd-chip " + (d.eu ? "umd-chip-safe" : "umd-chip-warn")}>{d.name}</span>
                        ))}
                    </div>
                )}
                <p className="text-umd-slate-600 text-[13px] mt-3.5 m-0">{p.outsideEU ? t("outsideEUNote") : t("insideEUNote")}</p>
                {p.quote && (
                    <blockquote className="umd-quotebox">
                        « {p.quote} »
                        <cite>— {t("privacyPolicy")} {p.name}</cite>
                    </blockquote>
                )}
            </div>

            <SecHead title={t("cnilTitle")} />
            <div className="umd-card px-6 py-5 flex flex-col gap-3.5">
                {p.sanctioned
                    ? <span className="umd-chip umd-chip-danger w-fit"><AlertTriangle aria-hidden="true" />{t("sanctioned")}</span>
                    : <span className="umd-chip umd-chip-safe w-fit"><Check aria-hidden="true" />{t("noSanction")}</span>}
                {p.sanctionDetails && (
                    <div className="flex gap-3 items-start bg-umd-slate-50 border border-umd-slate-200 rounded-(--umd-radius-md) px-4 py-3.5">
                        <Landmark aria-hidden="true" className="w-[17px] h-[17px] text-umd-slate-400 shrink-0 mt-0.5" />
                        <p className="m-0 text-[13.5px] leading-relaxed text-umd-slate-600">
                            <b>{t("context")}</b> {p.sanctionDetails}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ---------- Shell ---------- */

export default function FicheAvancee(p: FicheProps) {
    const t = useT(p.lang);
    const [tab, setTab] = useState("ess");
    const lang = p.lang;
    const hasTech = Boolean(p.apk) || p.perms.length > 0 || p.trackers.length > 0;

    const tabs = [
        { id: "ess", label: t("tabEss") },
        ...(hasTech ? [{ id: "tech", label: t("tabTech"), count: p.perms.length || undefined }] : []),
        { id: "droits", label: t("tabRights") },
        { id: "fuites", label: t("tabBreaches"), count: p.breaches.length || undefined },
        { id: "gouv", label: t("tabGov") },
    ];

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
            <Link href={lang === "fr" ? "/liste-applications" : "/list-app"} className="umd-btn umd-btn-ghost umd-btn-sm !pl-1.5 mb-5">
                <ArrowLeft aria-hidden="true" />{t("back")}
            </Link>

            {/* Héros */}
            <div className="flex items-center gap-4.5 flex-wrap">
                {p.logo && (
                    <span className="w-[62px] h-[62px] rounded-[14px] border border-umd-slate-200 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                        <Image src={p.logo} alt="" width={62} height={62} className="object-contain p-1.5" unoptimized />
                    </span>
                )}
                <div className="flex-1 min-w-55">
                    <h1 className="umd-heading-1 !text-[33px]">{p.name}</h1>
                    <p className="text-umd-slate-600 text-[14.5px] m-0 mt-1">
                        {[p.countryName, p.belongsToGroup && p.groupName ? `${t("group")} ${p.groupName}` : null].filter(Boolean).join(" · ")}
                    </p>
                </div>
                {p.updatedAt && (
                    <span className="umd-pill umd-pill-indigo"><BadgeCheck aria-hidden="true" />{t("verified")} · {fmtDate(p.updatedAt, lang)}</span>
                )}
            </div>

            {/* Onglets */}
            <nav className="umd-ftabs mt-7" role="tablist" aria-label={t("tabEss")}>
                {tabs.map((tb) => (
                    <button key={tb.id} role="tab" aria-selected={tab === tb.id}
                        className={"umd-ftab" + (tab === tb.id ? " active" : "")} onClick={() => setTab(tb.id)}>
                        {tb.label}
                        {tb.count ? <span className="umd-tcount">{tb.count}</span> : null}
                    </button>
                ))}
            </nav>

            <div className="pt-7">
                {tab === "ess" && <TabEssentiel p={p} t={t} goTab={setTab} />}
                {tab === "tech" && hasTech && <TabTech p={p} t={t} />}
                {tab === "droits" && <TabDroits p={p} t={t} />}
                {tab === "fuites" && <TabFuites p={p} t={t} />}
                {tab === "gouv" && <TabGouv p={p} t={t} />}
            </div>

            {/* Métadonnées */}
            <div className="umd-meta-strip">
                {p.createdAt && <span><History aria-hidden="true" />{t("createdOn", { d: fmtDate(p.createdAt, lang), b: p.createdBy || "—" })}</span>}
                {p.updatedAt && <span><UserCheck aria-hidden="true" />{t("updatedOn", { d: fmtDate(p.updatedAt, lang), b: p.updatedBy || "—" })}</span>}
                {p.apk?.reportDate && <span><Database aria-hidden="true" />{t("techSource", { d: fmtDate(p.apk.reportDate, lang) })}</span>}
            </div>
        </main>
    );
}
