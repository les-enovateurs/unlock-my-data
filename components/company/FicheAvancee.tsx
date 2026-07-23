"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, Building2, Calendar, Camera, Check,
    ChevronDown, CircleCheck, CircleMinus, CircleX, Clock, Compass, Cookie, Copy, Database,
    Download, ExternalLink, Eye, FileText, Fingerprint, Flag, FolderOpen, Globe, History, IdCard,
    Info, Landmark, Lightbulb, Lock, Mail, MapPin, Mic, Monitor, Network, PenLine, Radar,
    Scale, Search, Send, Shield, ShieldAlert, ShieldCheck, Smartphone, Trash2,
    UserCheck, Users, X,
} from "lucide-react";
import { translateDataClass } from "./manual-components/helpers";
import { getEmailTemplate, webmailLinks } from "../../constants/emailTemplates";
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

export type FicheCriterion = {
    id: string;
    label: string;
    status: "oui" | "non" | "non_indique" | "non_evaluable_ia";
    quote?: string;
    quote_verified?: boolean | null;
    evaluable_by_ia: boolean;
    reason?: string;
};

export type FichePixelDetail = {
    quote: string;
    what_is_tracked: string;
    vendor?: string;
    quote_verified?: boolean;
};

export type FicheDataCategory = {
    status: "oui" | "non" | "non_indique";
    quote?: string;
    purpose?: string;
    quote_verified?: boolean | null;
};

export type FicheLegalBasis = {
    basis: string;
    data?: string;
    quote?: string;
    quote_verified?: boolean | null;
};

export type FicheDataInventory = {
    ia_status?: string;
    inventory_analyzed_at?: string;
    categories: Record<string, FicheDataCategory>;
    legal_bases: FicheLegalBasis[];
    transfers: { outside_eu: string; countries: string[]; quote?: string; quote_verified?: boolean | null };
    data_score?: { weighted: number; raw_count: number; sensitive_count: number };
};

export type FicheAnalysis = {
    ia_status: string;   // ia_processed | needs_review | human_reviewed | published
    analyzed_at?: string;
    source: { policy_url?: string; url_source?: string; markdown_chars: number };
    pixel_tracking: { present: boolean; details: FichePixelDetail[] };
    conformity: Record<string, FicheCriterion[]>;
    data_inventory?: FicheDataInventory | null;
    review: { flags?: string[]; notes?: string | null };
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
    analysis?: FicheAnalysis | null;
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
        mailCopy: "Copier le mail",
        mailCopied: "Copié !",
        mailSend: "Ouvrir Appli Mail",
        mailOpenVia: "Ou ouvrir avec :",
        tabAnalyse: "Analyse de confidentialité",
        anaAnalysedOn: "analysée le",
        anaScoreTitle: "Score de respect\nde la vie privée",
        anaSummary: "{oui} critères sur {total} évaluables sont clairement respectés par cette politique.",
        anaGatedTitle: "Score en attente de relecture humaine",
        anaGatedDesc: "L'IA a proposé une analyse, mais aucun score n'est publié tant qu'un relecteur humain ne l'a pas validée. Les critères ci-dessous restent consultables, citation à l'appui, à titre d'analyse préliminaire.",
        anaScoreFoot: "Score provisoire — proportion de critères où la politique répond clairement, certains critères nécessitant un audit humain.",
        anaExtractTitle: "Extraction insuffisante — audit manuel requis",
        anaExtractDesc: "Seuls {n} caractères ont pu être extraits de cette politique : la page nécessite probablement du JavaScript ou un consentement préalable avant affichage. L'IA ne peut pas produire d'analyse fiable dans ces conditions — ce n'est pas un mauvais score, c'est une extraction à refaire manuellement.",
        anaByDomain: "Détail par domaine",
        anaCritRespected: "{oui}/{total} critères respectés",
        anaHumanAudit: "{n} audit humain",
        anaSeeAll: "Voir les {n} critères",
        anaReduce: "Réduire",
        anaVerified: "Vérifié",
        anaToReverify: "À re-vérifier",
        anaGrayZone: "Zone grise : non précisé dans la politique — pas forcément une faute.",
        anaLocked: "Nécessite un audit humain, hors périmètre de l'IA.",
        anaPixelsTitle: "Pixels de tracking",
        anaPixelsFollow: "{n} pixel(s) vous suivent",
        anaNoPixels: "Aucun pixel de tracking détecté",
        anaPixelsUnreliable: "Extraction incomplète : ce résultat n'est pas fiable.",
        anaStatusNeedsReview: "Relecture en cours",
        anaStatusProcessed: "Traité par l'IA",
        anaStatusReviewed: "Relu par un humain",
        anaStatusPublished: "Publié",
        domMentions: "Mentions légales",
        domPdp: "Données personnelles",
        domCookies: "Cookies",
        domTransferts: "Transferts hors UE",
        anaSource: "Analyse de la politique de confidentialité : Mistral Large, le {d}",
        tabDonnees: "Vos données collectées",
        donneesEmpty: "Inventaire des données non disponible pour ce service — extraction insuffisante ou analyse pas encore lancée.",
        donneesAiNote: "À prendre avec des pincettes : c'est une analyse par IA, une relecture humaine est en attente.",
        donneesStatCollected: "catégories de données collectées",
        donneesStatSensitive: "sensibles (santé, biométrie…)",
        donneesStatGrey: "non précisées dans la politique",
        donneesCollectTitle: "Ce qu'ils collectent sur vous",
        donneesGreyIntro: "Non précisé dans la politique — zone grise, pas forcément une collecte :",
        donneesNoIntro: "Explicitement non collecté :",
        donneesLegalTitle: "Sur quelle base légale",
        donneesTransferTitle: "Transferts hors UE",
        donneesTransferOui: "Des données sont transférées hors UE",
        donneesTransferNon: "Pas de transfert hors UE indiqué",
        donneesTransferUnknown: "Non précisé dans la politique",
        donneesSeeQuote: "Voir la citation",
        donneesHideQuote: "Masquer la citation",
        donneesCritCount: "{n} critère(s)",
        donneesSeeN: "Voir les {n}",
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
        mailCopy: "Copy the email",
        mailCopied: "Copied!",
        mailSend: "Open Mail App",
        mailOpenVia: "Or open with:",
        tabAnalyse: "Privacy analysis",
        anaAnalysedOn: "analysed on",
        anaScoreTitle: "Privacy respect\nscore",
        anaSummary: "{oui} of {total} evaluable criteria are clearly respected by this policy.",
        anaGatedTitle: "Score awaiting human review",
        anaGatedDesc: "The AI produced an analysis, but no score is published until a human reviewer has validated it. The criteria below remain viewable, each backed by a quote, as a preliminary analysis.",
        anaScoreFoot: "Provisional score — the share of criteria the policy answers clearly, excluding criteria that require a human audit.",
        anaExtractTitle: "Insufficient extraction — manual audit required",
        anaExtractDesc: "Only {n} characters could be extracted from this policy: the page likely requires JavaScript or prior consent before it displays. The AI cannot produce a reliable analysis in these conditions — this is not a bad score, it is an extraction to redo manually.",
        anaByDomain: "Breakdown by domain",
        anaCritRespected: "{oui}/{total} criteria respected",
        anaHumanAudit: "{n} human audit",
        anaSeeAll: "See all {n} criteria",
        anaReduce: "Collapse",
        anaVerified: "Verified",
        anaToReverify: "To re-verify",
        anaGrayZone: "Grey area: not stated in the policy — not necessarily a fault.",
        anaLocked: "Requires a human audit, outside the AI's scope.",
        anaPixelsTitle: "Tracking pixels",
        anaPixelsFollow: "{n} pixel(s) track you",
        anaNoPixels: "No tracking pixel detected",
        anaPixelsUnreliable: "Incomplete extraction: this result is not reliable.",
        anaStatusNeedsReview: "Review in progress",
        anaStatusProcessed: "Processed by AI",
        anaStatusReviewed: "Reviewed by a human",
        anaStatusPublished: "Published",
        domMentions: "Legal notice",
        domPdp: "Personal data",
        domCookies: "Cookies",
        domTransferts: "Non-EU transfers",
        anaSource: "Privacy policy analysis: Mistral large, on {d}",
        tabDonnees: "Your collected data",
        donneesEmpty: "Data inventory not available for this service — insufficient extraction or analysis not run yet.",
        donneesAiNote: "Take with a grain of salt: this is an AI analysis, a human review is pending.",
        donneesStatCollected: "categories of data collected",
        donneesStatSensitive: "sensitive (health, biometrics…)",
        donneesStatGrey: "not specified in the policy",
        donneesCollectTitle: "What they collect about you",
        donneesGreyIntro: "Not specified in the policy — grey area, not necessarily collected:",
        donneesNoIntro: "Explicitly not collected:",
        donneesLegalTitle: "On what legal basis",
        donneesTransferTitle: "Transfers outside the EU",
        donneesTransferOui: "Some data is transferred outside the EU",
        donneesTransferNon: "No non-EU transfer indicated",
        donneesTransferUnknown: "Not specified in the policy",
        donneesSeeQuote: "Show the quote",
        donneesHideQuote: "Hide the quote",
        donneesCritCount: "{n} criteria",
        donneesSeeN: "Show all {n}",
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

                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    <button className="umd-btn umd-btn-primary umd-btn-sm" onClick={copy}>
                        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                        {copied ? t("mailCopied") : t("mailCopy")}
                    </button>
                    {mailto && (
                        <>
                            <p style={{ fontSize: 12.5, margin: "2px 0 0", color: "var(--fg3)" }}>{t("mailOpenVia")}</p>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <a className="umd-btn umd-btn-outline umd-btn-sm" href={mailto} target="_blank" rel="noopener noreferrer">
                                    <Mail className="h-4 w-4" aria-hidden="true" />{t("mailSend")}
                                </a>
                                {recipient && webmailLinks(recipient, subject, body).map((w) => (
                                    <a key={w.name} className="umd-btn umd-btn-outline umd-btn-sm" href={w.href} target="_blank" rel="noopener noreferrer">
                                        {w.name}
                                    </a>
                                ))}
                            </div>
                        </>
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

/* ---------- Privacy analysis tab (policy-analysis JSON) ---------- */

const DOMAIN_ORDER = ["mentions_legales", "politique_donnees_personnelles", "cookies", "transferts_hors_ue"] as const;
const DOMAIN_LABEL_KEY: Record<string, string> = {
    mentions_legales: "domMentions",
    politique_donnees_personnelles: "domPdp",
    cookies: "domCookies",
    transferts_hors_ue: "domTransferts",
};
const DOMAIN_ICON: Record<string, typeof Scale> = {
    mentions_legales: Scale,
    politique_donnees_personnelles: Shield,
    cookies: Cookie,
    transferts_hors_ue: Globe,
};

function grade(pct: number | null): { letter: string; color: string } {
    if (pct === null) return { letter: "?", color: "var(--slate-300)" };
    if (pct >= 85) return { letter: "A", color: "var(--score-a)" };
    if (pct >= 65) return { letter: "B", color: "var(--score-b)" };
    if (pct >= 45) return { letter: "C", color: "var(--score-d)" };
    if (pct >= 25) return { letter: "D", color: "var(--score-e)" };
    return { letter: "E", color: "var(--score-g)" };
}

// Strip residual markdown emphasis (**bold**, _italic_) from stored verbatim quotes.
function cleanQuote(q: string): string {
    return q.replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
}

// Score polarity (v1) — criteria where the favourable answer is "non" (the thing
// existing is bad for the user). Everything else: "oui" = favourable.
// Mirror of score_polarity_good_when_non in the tool's criteria.yaml — keep in sync.
const POLARITY_GOOD_WHEN_NON = new Set(["tr_transfert_hors_ue", "tr_cloud_hors_ue"]);

function isRespected(c: FicheCriterion): boolean {
    const goodWhen = POLARITY_GOOD_WHEN_NON.has(c.id) ? "non" : "oui";
    return c.status === goodWhen;
}

function domainStats(criteria: FicheCriterion[]) {
    const evaluable = criteria.filter((c) => c.evaluable_by_ia);
    const ok = evaluable.filter(isRespected).length;
    const total = evaluable.length;
    const nonEval = criteria.length - evaluable.length;
    const pct = total ? Math.round((ok / total) * 100) : null;
    return { total, ok, nonEval, pct };
}

// Icon reflects whether the criterion is RESPECTED (polarity-aware), not the raw
// "oui" — a disclosed non-EU transfer is a "oui" but counts against the user.
function critIcon(c: FicheCriterion) {
    if (!c.evaluable_by_ia || c.status === "non_evaluable_ia")
        return <Lock aria-hidden="true" className="w-4 h-4 text-umd-slate-400 shrink-0" />;
    if (c.status === "non_indique")
        return <CircleMinus aria-hidden="true" className="w-4 h-4 text-umd-slate-400 shrink-0" />;
    return isRespected(c)
        ? <CircleCheck aria-hidden="true" className="w-4 h-4 text-umd-green-600 shrink-0" />
        : <CircleX aria-hidden="true" className="w-4 h-4 shrink-0" style={{ color: "var(--red-600)" }} />;
}

function CriterionRow({ c, t }: { c: FicheCriterion; t: ReturnType<typeof useT> }) {
    const [open, setOpen] = useState(false);
    const hasQuote = Boolean(c.quote);
    const micro = c.status === "non_indique" ? t("anaGrayZone")
        : c.status === "non_evaluable_ia" ? `🔒 ${t("anaLocked")}` : "";
    const verifiedLabel = c.quote_verified === true ? t("anaVerified")
        : c.quote_verified === false ? t("anaToReverify") : "";
    const verifiedClass = c.quote_verified === true ? "umd-chip umd-chip-safe"
        : c.quote_verified === false ? "umd-chip umd-chip-warn" : "";
    return (
        <div className="umd-crit-row">
            <button type="button" className="umd-crit-head" disabled={!hasQuote}
                aria-expanded={hasQuote ? open : undefined}
                onClick={hasQuote ? () => setOpen((v) => !v) : undefined}>
                {critIcon(c)}
                <span className="flex-1 text-[13.5px] font-semibold text-umd-slate-800">{c.label}</span>
                {verifiedLabel && <span className={verifiedClass} style={{ fontSize: "10.5px", padding: "2px 8px" }}>{verifiedLabel}</span>}
                {hasQuote && <ChevronDown aria-hidden="true" className={"w-[15px] h-[15px] text-umd-slate-400 transition-transform" + (open ? " rotate-180" : "")} />}
            </button>
            {micro && <p className="mt-1.5 ml-[26px] text-[12px] italic text-umd-slate-600 m-0">{micro}</p>}
            {open && c.quote && <blockquote className="umd-quotebox ml-[26px] mt-2.5">« {cleanQuote(c.quote)} »</blockquote>}
        </div>
    );
}

function DomainCard({ domainKey, criteria, t }: { domainKey: string; criteria: FicheCriterion[]; t: ReturnType<typeof useT> }) {
    const [full, setFull] = useState(false);
    const stats = domainStats(criteria);
    const g = grade(stats.pct);
    const Icon = DOMAIN_ICON[domainKey] || Shield;
    const rank = (c: FicheCriterion) => (c.status === "oui" || c.status === "non") ? 0 : (c.status === "non_indique" ? 1 : 2);
    const sorted = criteria.slice().sort((a, b) => rank(a) - rank(b));
    const shown = full ? sorted : sorted.slice(0, 3);
    return (
        <div className="umd-card umd-domain-card">
            <div className="flex items-center gap-3 flex-wrap">
                <span className="w-[34px] h-[34px] rounded-(--umd-radius-sm) bg-umd-indigo-50 text-umd-indigo-700 flex items-center justify-center shrink-0">
                    <Icon aria-hidden="true" className="w-4 h-4" />
                </span>
                <h3 className="text-[15.5px] font-display font-bold flex-1 min-w-40 m-0">{t(DOMAIN_LABEL_KEY[domainKey])}</h3>
                <span className="umd-chip" style={{ background: "transparent", borderColor: g.color, color: g.color, fontWeight: 700 }}>
                    {g.letter} · {stats.pct === null ? "—" : stats.pct + "%"}
                </span>
                <span className="text-umd-slate-600 text-[12px]">{t("anaCritRespected", { oui: stats.ok, total: stats.total })}</span>
                {stats.nonEval > 0 && (
                    <span className="umd-chip umd-chip-neutral" style={{ fontSize: "11px" }}>
                        <Lock aria-hidden="true" className="w-3 h-3" />{t("anaHumanAudit", { n: stats.nonEval })}
                    </span>
                )}
            </div>
            <div className="mt-4 flex flex-col gap-2">
                {shown.map((c) => <CriterionRow key={c.id} c={c} t={t} />)}
            </div>
            {criteria.length > 3 && (
                <button type="button" className="umd-btn umd-btn-ghost umd-btn-sm mt-3" onClick={() => setFull((v) => !v)}>
                    {full ? t("anaReduce") : t("anaSeeAll", { n: criteria.length })}
                </button>
            )}
        </div>
    );
}

function VendorCard({ v, t }: { v: FichePixelDetail; t: ReturnType<typeof useT> }) {
    const [open, setOpen] = useState(false);
    const hasQuote = Boolean(v.quote);
    return (
        <div className="umd-vendor-card">
            <button type="button" className="umd-crit-head" aria-expanded={hasQuote ? open : undefined}
                onClick={hasQuote ? () => setOpen((x) => !x) : undefined} disabled={!hasQuote}>
                <Radar aria-hidden="true" className="w-4 h-4 text-umd-indigo-600 shrink-0" />
                <span className="flex-1">
                    <b className="text-[14px]">{v.vendor || "—"}</b>
                    {v.what_is_tracked && <span className="block text-umd-slate-600 text-[12.5px] mt-0.5">{v.what_is_tracked}</span>}
                </span>
                {v.quote_verified && <span className="umd-chip umd-chip-safe" style={{ fontSize: "10.5px", padding: "2px 8px" }}>{t("anaVerified")}</span>}
                {hasQuote && <ChevronDown aria-hidden="true" className={"w-[15px] h-[15px] text-umd-slate-400 transition-transform" + (open ? " rotate-180" : "")} />}
            </button>
            {open && v.quote && <blockquote className="umd-quotebox ml-[26px] mt-2.5">« {cleanQuote(v.quote)} »</blockquote>}
        </div>
    );
}

/* ---------- Data inventory (tab "Vos données collectées") ---------- */

// Closed taxonomy — mirror of data_categories in the tool's criteria.yaml.
// "autre" is intentionally excluded from the display order (catch-all).
const DATA_CATEGORY_ORDER = [
    "identite", "contact", "compte_auth", "paiement", "localisation",
    "appareil_technique", "usage_comportement", "contenus_utilisateur",
    "communications", "contacts_reseau", "donnees_tiers", "biometrie",
    "donnees_sensibles", "mineurs",
];

type DataCatMeta = { sensitive: boolean; fr: { label: string; desc: string }; en: { label: string; desc: string } };
const DATA_CATEGORY_META: Record<string, DataCatMeta> = {
    identite: { sensitive: false, fr: { label: "Identité", desc: "nom, date de naissance, pièce d'identité" }, en: { label: "Identity", desc: "name, date of birth, ID document" } },
    contact: { sensitive: false, fr: { label: "Coordonnées", desc: "email, téléphone, adresse postale" }, en: { label: "Contact details", desc: "email, phone, postal address" } },
    compte_auth: { sensitive: false, fr: { label: "Compte & authentification", desc: "identifiants, nom d'utilisateur" }, en: { label: "Account & authentication", desc: "credentials, username" } },
    paiement: { sensitive: false, fr: { label: "Données de paiement", desc: "carte bancaire, historique d'achats" }, en: { label: "Payment data", desc: "bank card, purchase history" } },
    localisation: { sensitive: false, fr: { label: "Localisation", desc: "position GPS ou approximative" }, en: { label: "Location", desc: "GPS or approximate position" } },
    appareil_technique: { sensitive: false, fr: { label: "Appareil & données techniques", desc: "IP, identifiants publicitaires, OS" }, en: { label: "Device & technical data", desc: "IP, advertising IDs, OS" } },
    usage_comportement: { sensitive: false, fr: { label: "Usage & comportement", desc: "navigation, interactions, historique" }, en: { label: "Usage & behaviour", desc: "browsing, interactions, history" } },
    contenus_utilisateur: { sensitive: false, fr: { label: "Contenus publiés", desc: "photos, vidéos, avis, commentaires" }, en: { label: "Published content", desc: "photos, videos, reviews, comments" } },
    communications: { sensitive: false, fr: { label: "Communications", desc: "messages, appels, échanges support" }, en: { label: "Communications", desc: "messages, calls, support exchanges" } },
    contacts_reseau: { sensitive: false, fr: { label: "Carnet d'adresses & contacts", desc: "contacts importés, réseau social" }, en: { label: "Address book & contacts", desc: "imported contacts, social graph" } },
    donnees_tiers: { sensitive: false, fr: { label: "Données reçues de tiers", desc: "partenaires, annonceurs, autres utilisateurs" }, en: { label: "Data received from third parties", desc: "partners, advertisers, other users" } },
    biometrie: { sensitive: true, fr: { label: "Données biométriques", desc: "reconnaissance faciale, empreintes" }, en: { label: "Biometric data", desc: "facial recognition, fingerprints" } },
    donnees_sensibles: { sensitive: true, fr: { label: "Données sensibles", desc: "santé, opinions, vie privée (art. 9 RGPD)" }, en: { label: "Sensitive data", desc: "health, opinions, private life (GDPR art. 9)" } },
    mineurs: { sensitive: true, fr: { label: "Données de mineurs", desc: "utilisateurs de moins de 18 ans" }, en: { label: "Minors' data", desc: "users under 18" } },
    autre: { sensitive: false, fr: { label: "Autres données", desc: "" }, en: { label: "Other data", desc: "" } },
};

type LegalBasisMeta = { color: string; fr: string; en: string };
const LEGAL_BASIS_META: Record<string, LegalBasisMeta> = {
    contrat: { color: "var(--indigo-600)", fr: "Exécution du contrat", en: "Performance of the contract" },
    consentement: { color: "var(--green-600)", fr: "Consentement", en: "Consent" },
    interet_legitime: { color: "var(--amber-400)", fr: "Intérêt légitime", en: "Legitimate interest" },
    obligation_legale: { color: "var(--teal-400)", fr: "Obligation légale", en: "Legal obligation" },
    mission_interet_public: { color: "var(--slate-400)", fr: "Mission d'intérêt public", en: "Public interest task" },
    interets_vitaux: { color: "var(--slate-400)", fr: "Intérêts vitaux", en: "Vital interests" },
};

function DataCatRow({ label, desc, quote, verified, sensitive, t }: {
    label: string; desc: string; quote?: string; verified?: boolean | null; sensitive: boolean;
    t: ReturnType<typeof useT>;
}) {
    const [open, setOpen] = useState(false);
    const hasQuote = Boolean(quote);
    const verifiedLabel = verified === true ? t("anaVerified") : verified === false ? t("anaToReverify") : "";
    const verifiedClass = verified === true ? "umd-chip umd-chip-safe" : verified === false ? "umd-chip umd-chip-warn" : "";
    return (
        <div className="umd-crit-row" style={sensitive ? { borderColor: "var(--red-200)" } : undefined}>
            <button type="button" className="umd-crit-head" disabled={!hasQuote}
                aria-expanded={hasQuote ? open : undefined}
                onClick={hasQuote ? () => setOpen((v) => !v) : undefined}>
                <Eye aria-hidden="true" className="w-4 h-4 text-umd-indigo-600 shrink-0" />
                <span className="flex-1">
                    <b className="text-[13.5px] text-umd-slate-800">{label}</b>
                    {desc && <span className="block text-umd-slate-500 text-[12px] mt-0.5">{desc}</span>}
                </span>
                {verifiedLabel && <span className={verifiedClass} style={{ fontSize: "10.5px", padding: "2px 8px" }}>{verifiedLabel}</span>}
                {hasQuote && <ChevronDown aria-hidden="true" className={"w-[15px] h-[15px] text-umd-slate-400 transition-transform" + (open ? " rotate-180" : "")} />}
            </button>
            {open && quote && <blockquote className="umd-quotebox ml-[26px] mt-2.5">« {cleanQuote(quote)} »</blockquote>}
        </div>
    );
}

function LegalItemRow({ label, quote }: { label: string; quote?: string }) {
    const [open, setOpen] = useState(false);
    const hasQuote = Boolean(quote);
    return (
        <div>
            <button type="button" className="umd-crit-head" disabled={!hasQuote}
                aria-expanded={hasQuote ? open : undefined}
                onClick={hasQuote ? () => setOpen((v) => !v) : undefined}>
                <span className="flex-1 text-[12.5px] text-umd-slate-600">{label}</span>
                {hasQuote && <ChevronDown aria-hidden="true" className={"w-[14px] h-[14px] text-umd-slate-400 transition-transform" + (open ? " rotate-180" : "")} />}
            </button>
            {open && quote && <blockquote className="umd-quotebox mt-1.5 text-[12px]">« {cleanQuote(quote)} »</blockquote>}
        </div>
    );
}

function LegalGroupCard({ basisKey, items, lang, t }: {
    basisKey: string; items: FicheLegalBasis[]; lang: string; t: ReturnType<typeof useT>;
}) {
    const [full, setFull] = useState(false);
    const meta = LEGAL_BASIS_META[basisKey] || { color: "var(--slate-400)", fr: basisKey, en: basisKey };
    const label = lang === "fr" ? meta.fr : meta.en;
    const shown = full ? items : items.slice(0, 2);
    const humanize = (raw?: string) => {
        if (!raw) return "";
        const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
        if (parts.length && parts.every((p) => DATA_CATEGORY_META[p])) {
            return parts.map((p) => DATA_CATEGORY_META[p][lang === "fr" ? "fr" : "en"].label).join(", ");
        }
        return raw.charAt(0).toUpperCase() + raw.slice(1);
    };
    return (
        <div className="umd-card p-0 overflow-hidden">
            <div className="px-[18px] py-3 bg-umd-slate-50 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.color }} />
                <b className="text-[13.5px] flex-1">{label}</b>
                <span className="text-umd-slate-500 text-[12px]">{t("donneesCritCount", { n: items.length })}</span>
            </div>
            <div className="px-[18px] py-3 flex flex-col gap-2">
                {shown.map((it, i) => <LegalItemRow key={i} label={humanize(it.data)} quote={it.quote} />)}
                {items.length > 2 && (
                    <button type="button" className="umd-btn umd-btn-ghost umd-btn-sm" onClick={() => setFull((v) => !v)}>
                        {full ? t("anaReduce") : t("donneesSeeN", { n: items.length })}
                    </button>
                )}
            </div>
        </div>
    );
}

function TabDonnees({ a, lang, t }: { a: FicheAnalysis; lang: string; t: ReturnType<typeof useT> }) {
    const inv = a.data_inventory;
    const chars = a.source?.markdown_chars ?? 0;
    const extractionFailed = (a.review?.flags || []).includes("extraction_insuffisante") || chars < 500;

    if (!inv || extractionFailed) {
        return (
            <div className="umd-card px-7 py-6 text-center">
                <p className="m-0 text-[13.5px] text-umd-slate-500">{t("donneesEmpty")}</p>
            </div>
        );
    }

    const isPublished = inv.ia_status === "published";
    const l = lang === "fr" ? "fr" : "en";

    const collected: string[] = [];
    const grey: string[] = [];
    const notCollected: string[] = [];
    for (const key of DATA_CATEGORY_ORDER) {
        const cat = inv.categories?.[key];
        if (!cat) continue;
        if (cat.status === "oui") collected.push(key);
        else if (cat.status === "non_indique") grey.push(key);
        else if (cat.status === "non") notCollected.push(key);
    }

    const rawCount = inv.data_score?.raw_count ?? collected.length;
    const sensitiveCount = inv.data_score?.sensitive_count
        ?? collected.filter((k) => DATA_CATEGORY_META[k]?.sensitive).length;

    // Group legal bases by basis key, preserving first-seen order.
    const byBasis: Record<string, FicheLegalBasis[]> = {};
    for (const lb of inv.legal_bases || []) {
        (byBasis[lb.basis] = byBasis[lb.basis] || []).push(lb);
    }

    const tr = inv.transfers || { outside_eu: "non_indique", countries: [] };
    const transferOui = tr.outside_eu === "oui";
    const transferLabel = transferOui ? t("donneesTransferOui")
        : tr.outside_eu === "non" ? t("donneesTransferNon") : t("donneesTransferUnknown");

    return (
        <div>
            {!isPublished && (
                <div className="umd-card umd-ana-warn mb-5">
                    <Lock aria-hidden="true" className="w-[18px] h-[18px] text-umd-amber-400 shrink-0" />
                    <p className="m-0 text-[12.5px] text-umd-slate-600">{t("donneesAiNote")}</p>
                </div>
            )}

            <div className="flex gap-3 flex-wrap mb-5">
                <div className="umd-stat px-5 py-3.5">
                    <b className="text-2xl">{rawCount}</b><span>{t("donneesStatCollected")}</span>
                </div>
                <div className="umd-stat px-5 py-3.5" style={{ borderColor: "var(--red-200)" }}>
                    <b className="text-2xl" style={{ color: "var(--red-600)" }}>{sensitiveCount}</b><span>{t("donneesStatSensitive")}</span>
                </div>
                <div className="umd-stat px-5 py-3.5">
                    <b className="text-2xl">{grey.length}</b><span>{t("donneesStatGrey")}</span>
                </div>
            </div>

            <h2 className="umd-heading-3 !text-[18px] mb-3.5">{t("donneesCollectTitle")}</h2>
            <div className="flex flex-col gap-2 mb-6">
                {collected.map((key) => {
                    const cat = inv.categories[key];
                    const meta = DATA_CATEGORY_META[key];
                    return (
                        <DataCatRow key={key} label={meta[l].label}
                            desc={cat.purpose || meta[l].desc} quote={cat.quote}
                            verified={cat.quote_verified} sensitive={meta.sensitive} t={t} />
                    );
                })}
            </div>

            {grey.length > 0 && (
                <div className="mb-6">
                    <p className="text-umd-slate-500 text-[12.5px] m-0 mb-2">{t("donneesGreyIntro")}</p>
                    <div className="flex gap-2 flex-wrap">
                        {grey.map((key) => (
                            <span key={key} className="umd-chip umd-chip-neutral">{DATA_CATEGORY_META[key][l].label}</span>
                        ))}
                    </div>
                </div>
            )}

            {notCollected.length > 0 && (
                <div className="mb-6">
                    <p className="text-umd-slate-500 text-[12.5px] m-0 mb-2">{t("donneesNoIntro")}</p>
                    <div className="flex gap-2 flex-wrap">
                        {notCollected.map((key) => (
                            <span key={key} className="umd-chip umd-chip-safe">{DATA_CATEGORY_META[key][l].label}</span>
                        ))}
                    </div>
                </div>
            )}

            {Object.keys(byBasis).length > 0 && (
                <>
                    <h2 className="umd-heading-3 !text-[18px] mb-3.5">{t("donneesLegalTitle")}</h2>
                    <div className="flex flex-col gap-2.5 mb-6">
                        {Object.entries(byBasis).map(([basisKey, items]) => (
                            <LegalGroupCard key={basisKey} basisKey={basisKey} items={items} lang={lang} t={t} />
                        ))}
                    </div>
                </>
            )}

            {/*<h2 className="umd-heading-3 !text-[18px] mb-3.5">{t("donneesTransferTitle")}</h2>*/}
            {/*<TransferCard transferOui={transferOui} label={transferLabel}*/}
            {/*    countries={tr.countries || []} quote={tr.quote} t={t} />*/}
        </div>
    );
}

function TransferCard({ transferOui, label, countries, quote, t }: {
    transferOui: boolean; label: string; countries: string[]; quote?: string;
    t: ReturnType<typeof useT>;
}) {
    const [open, setOpen] = useState(false);
    const hasQuote = Boolean(quote);
    return (
        <div className="umd-card px-6 py-5">
            <div className="flex items-center gap-3 flex-wrap">
                {transferOui
                    ? <Globe aria-hidden="true" className="w-[18px] h-[18px] shrink-0" style={{ color: "var(--red-600)" }} />
                    : <CircleCheck aria-hidden="true" className="w-[18px] h-[18px] text-umd-green-600 shrink-0" />}
                <p className="m-0 text-[14px] font-semibold flex-1">{label}</p>
                {hasQuote && (
                    <button type="button" className="umd-btn umd-btn-ghost umd-btn-sm" onClick={() => setOpen((v) => !v)}>
                        {open ? t("donneesHideQuote") : t("donneesSeeQuote")}
                    </button>
                )}
            </div>
            {countries.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mt-3">
                    {countries.map((c) => <span key={c} className="umd-chip umd-chip-neutral">{c}</span>)}
                </div>
            )}
            {open && quote && <blockquote className="umd-quotebox mt-3">« {cleanQuote(quote)} »</blockquote>}
        </div>
    );
}

function TabAnalyse({ a, t }: { a: FicheAnalysis; t: ReturnType<typeof useT> }) {
    const chars = a.source?.markdown_chars ?? 0;
    const extractionFailed = (a.review?.flags || []).includes("extraction_insuffisante") || chars < 500;
    const published = a.ia_status === "published" && !extractionFailed;

    if (extractionFailed) {
        return (
            <div>
                <div className="umd-card umd-ana-warn">
                    <AlertTriangle aria-hidden="true" className="w-[22px] h-[22px] text-umd-amber-400 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-base font-display font-bold m-0 mb-1.5">{t("anaExtractTitle")}</h3>
                        <p className="m-0 text-[13.5px] leading-relaxed text-umd-slate-600">{t("anaExtractDesc", { n: chars })}</p>
                        {a.review?.notes && <p className="mt-2.5 mb-0 text-[12.5px] italic text-umd-slate-500">{a.review.notes}</p>}
                    </div>
                </div>
            </div>
        );
    }

    // Global completeness score (avg of per-domain pcts). Gated unless published.
    const statsByKey = DOMAIN_ORDER.map((k) => ({ k, s: domainStats(a.conformity[k] || []) }));
    const pcts = statsByKey.map(({ s }) => s.pct).filter((p): p is number => p !== null);
    const globalPct = pcts.length ? Math.round(pcts.reduce((x, y) => x + y, 0) / pcts.length) : null;
    const g = grade(globalPct);
    const globalOui = statsByKey.reduce((x, { s }) => x + s.ok, 0);
    const globalEval = statsByKey.reduce((x, { s }) => x + s.total, 0);

    const pixels = a.pixel_tracking?.details || [];

    return (
        <div>
            <div className="umd-card px-7 py-6 mb-5">
                {published ? (
                    <>
                        <div className="flex gap-8 flex-wrap items-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="umd-score-ring" style={{ background: g.color }}>
                                    <span className="text-[42px] font-extrabold leading-none">{g.letter}</span>
                                    <span className="text-[12px] font-bold opacity-85">{globalPct}%</span>
                                </div>
                                <span className="text-[10.5px] text-center text-umd-slate-500 font-semibold whitespace-pre-line">{t("anaScoreTitle")}</span>
                            </div>
                            <div className="flex-1 min-w-60">
                                <p className="m-0 text-[15px] leading-relaxed text-umd-slate-800">{t("anaSummary", { oui: globalOui, total: globalEval })}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col gap-3.5">
                            {statsByKey.map(({ k, s }) => {
                                const dg = grade(s.pct);
                                return (
                                    <div key={k}>
                                        <div className="flex justify-between text-[13px] font-bold mb-1.5">
                                            <span>{t(DOMAIN_LABEL_KEY[k])}</span>
                                            <span style={{ color: dg.color }}>{dg.letter} · {s.pct === null ? "—" : s.pct + "%"}</span>
                                        </div>
                                        <div className="umd-bar-track"><div className="umd-bar-fill" style={{ width: (s.pct ?? 0) + "%", background: dg.color }} /></div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="flex gap-6 flex-wrap items-center">
                        <div className="umd-score-ring umd-score-ring-gated">
                            <Lock aria-hidden="true" className="w-[30px] h-[30px] text-umd-slate-400" />
                        </div>
                        <div className="flex-1 min-w-60">
                            <h3 className="text-base font-display font-bold m-0 mb-1.5">{t("anaGatedTitle")}</h3>
                            <p className="m-0 text-[13.5px] leading-relaxed text-umd-slate-600">{t("anaGatedDesc")}</p>
                        </div>
                    </div>
                )}
                <div className="mt-5 pt-4 border-t border-umd-slate-100 flex gap-2.5 items-start">
                    <Info aria-hidden="true" className="w-[15px] h-[15px] text-umd-slate-400 shrink-0 mt-0.5" />
                    <p className="m-0 text-[12px] leading-relaxed text-umd-slate-600">{t("anaScoreFoot")}</p>
                </div>
            </div>

            <h2 className="umd-heading-3 !text-[18px] mt-6 mb-3.5">{t("anaByDomain")}</h2>
            {DOMAIN_ORDER.map((k) => (
                <DomainCard key={k} domainKey={k} criteria={a.conformity[k] || []} t={t} />
            ))}

            <h2 className="umd-heading-3 !text-[18px] mt-7 mb-3.5">{t("anaPixelsTitle")}</h2>
            <div className="umd-card px-6 py-6">
                <p className="m-0 mb-1 text-[19px] font-extrabold font-display">
                    {a.pixel_tracking?.present ? t("anaPixelsFollow", { n: pixels.length }) : t("anaNoPixels")}
                </p>
                <div className="flex flex-col gap-2.5 mt-4">
                    {pixels.map((v, i) => <VendorCard key={i} v={v} t={t} />)}
                </div>
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
        ...(p.analysis ? [{ id: "analyse", label: t("tabAnalyse") }] : []),
        ...(p.analysis?.data_inventory ? [{ id: "donnees", label: t("tabDonnees") }] : []),
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
                {tab === "analyse" && p.analysis && <TabAnalyse a={p.analysis} t={t} />}
                {tab === "donnees" && p.analysis?.data_inventory && <TabDonnees a={p.analysis} lang={lang} t={t} />}
            </div>

            {/* Métadonnées */}
            <div className="umd-meta-strip">
                {p.createdAt && <span><History aria-hidden="true" />{t("createdOn", { d: fmtDate(p.createdAt, lang), b: p.createdBy || "—" })}</span>}
                {p.updatedAt && <span><UserCheck aria-hidden="true" />{t("updatedOn", { d: fmtDate(p.updatedAt, lang), b: p.updatedBy || "—" })}</span>}
                {p.apk?.reportDate && <span><Database aria-hidden="true" />{t("techSource", { d: fmtDate(p.apk.reportDate, lang) })}</span>}
                {p.analysis?.analyzed_at && <span><ShieldCheck aria-hidden="true" />{t("anaSource", { d: fmtDate(p.analysis.analyzed_at, lang) })}</span>}
            </div>
        </main>
    );
}
