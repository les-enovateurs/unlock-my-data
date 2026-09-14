/**
 * Qui est la société derrière un domaine relevé dans un APK, et où est son siège.
 *
 * L'analyse statique du dépôt privé rend des noms d'hôtes. `adyen.com — 54 adresses` ne
 * dit à un lecteur ni qui c'est, ni à quoi ça sert, ni où partent ses données. Cette table
 * pose le nom de la société, le pays de son siège, et — quand le domaine n'a qu'un usage
 * documenté — cet usage.
 *
 * Même registre que `data/permissionLabels.ts` : une table éditoriale qui complète une
 * mesure mécanique. Ce qui est écrit ici est un fait vérifiable **sur la société**, jamais
 * une déduction sur ce que l'application en fait. Un domaine absent de la table s'affiche
 * nu, et c'est voulu : mieux vaut un domaine sans nom qu'une attribution approximative.
 *
 * ## Le pays est celui du siège, pas celui des données
 *
 * Il n'existe pas de pays honnête pour un *domaine*. La géo-IP rend l'emplacement d'un
 * point de présence CDN, pas celui du destinataire ; le WHOIS est masqué la moitié du
 * temps. Ce projet s'est déjà brûlé là-dessus : le champ `country` du catalogue Exodus
 * vaut « united states » pour 381 de ses 432 pisteurs, et il a fallu le retirer de
 * l'affichage des pisteurs (voir `trkCountryNote` dans `FicheAvancee.tsx`).
 *
 * Ce qui est défendable, c'est le pays du **siège social**, écrit à la main et vérifiable.
 * Il ne dit pas où la donnée est traitée — Airship est américaine et opère `asnapieu.com`
 * en Europe, Datadog est américaine et expose `browser-intake-datadoghq.eu`. Le rachat
 * change la réponse sans changer le siège : Adjust est berlinoise et appartient à
 * AppLovin depuis 2021. C'est à ça que sert `note`, et l'interface l'affiche.
 *
 * ## Ce qui n'entre pas dans la table
 *
 * - **Les domaines de messagerie** (`gmail.com`, `hotmail.fr`, `yahoo.es`, `orange.fr`…).
 *   Ils viennent des listes de validation d'adresses e-mail embarquées dans les binaires.
 *   Écrire « Google » en face de `gmail.com` laisserait croire à un destinataire.
 * - **Les domaines de première partie** (`roocdn.com` chez Deliveroo, `owhealth.com` chez
 *   Flo, les vingt `blablacar.*`). Le bloc s'intitule « Sociétés tierces » ; les nommer
 *   reviendrait à valider leur présence dans une liste où ils n'ont rien à faire.
 * - **Ce dont on n'est pas sûr.** `spadsync.com` est dans quatre applications,
 *   `aritypmp.com` dans deux : personne ici ne sait à qui elles sont. Elles restent nues.
 */

export type Bilingue = { fr: string; en: string };

/** L'activité du domaine, seulement quand elle est unique et documentée. */
export type UsageKey =
    | "publicite"
    | "attribution"
    | "mesure"
    | "paiement"
    | "diagnostic"
    | "push"
    | "consentement"
    | "cartographie"
    | "identite"
    | "fraude"
    | "support"
    | "communication"
    | "hebergement"
    | "reseau"
    | "plateforme"
    | "norme";

export const USAGES: Record<UsageKey, Bilingue> = {
    publicite: { fr: "Publicité", en: "Advertising" },
    attribution: { fr: "Attribution d'installation", en: "Install attribution" },
    mesure: { fr: "Mesure d'audience", en: "Audience measurement" },
    paiement: { fr: "Paiement", en: "Payments" },
    diagnostic: { fr: "Plantages et performance", en: "Crash and performance reporting" },
    push: { fr: "Notifications push", en: "Push notifications" },
    consentement: { fr: "Gestion du consentement", en: "Consent management" },
    cartographie: { fr: "Cartographie", en: "Mapping" },
    identite: { fr: "Vérification d'identité", en: "Identity verification" },
    fraude: { fr: "Fraude et robots", en: "Fraud and bot detection" },
    support: { fr: "Support client", en: "Customer support" },
    communication: { fr: "SMS, appels et visio", en: "SMS, calls and video" },
    hebergement: { fr: "Hébergement et diffusion", en: "Hosting and content delivery" },
    reseau: { fr: "Réseau social", en: "Social network" },
    plateforme: { fr: "Plateforme de services", en: "General-purpose platform" },
    norme: { fr: "Organisme de normalisation", en: "Standards body" },
};

/**
 * Un hébergeur sert le contenu de quelqu'un d'autre.
 *
 * `cloudfront.net` est à Amazon et `gstatic.com` à Google, mais ce qui transite par eux
 * appartient à celui qui les a intégrés. Nommer Amazon sans le dire serait vrai sur
 * l'hébergeur et trompeur sur le destinataire — d'où cette réserve, affichée dès qu'un
 * domaine `hebergement` est visible.
 */
export const USAGE_RESERVE: Partial<Record<UsageKey, Bilingue>> = {
    hebergement: {
        fr: "Un hébergeur diffuse le contenu de ses clients : la société nommée n'est pas forcément le destinataire des données.",
        en: "A host delivers its customers' content: the named company is not necessarily where the data ends up.",
    },
};

/** Pays du siège social, écrit une fois pour que l'orthographe ne varie pas. */
const PAYS = {
    us: { fr: "États-Unis", en: "United States" },
    de: { fr: "Allemagne", en: "Germany" },
    nl: { fr: "Pays-Bas", en: "Netherlands" },
    fr: { fr: "France", en: "France" },
    gb: { fr: "Royaume-Uni", en: "United Kingdom" },
    se: { fr: "Suède", en: "Sweden" },
    il: { fr: "Israël", en: "Israel" },
    in: { fr: "Inde", en: "India" },
    cn: { fr: "Chine", en: "China" },
    ru: { fr: "Russie", en: "Russia" },
    dk: { fr: "Danemark", en: "Denmark" },
    lt: { fr: "Lituanie", en: "Lithuania" },
    si: { fr: "Slovénie", en: "Slovenia" },
    no: { fr: "Norvège", en: "Norway" },
    kr: { fr: "Corée du Sud", en: "South Korea" },
} satisfies Record<string, Bilingue>;

type PaysKey = keyof typeof PAYS;

export type DomainOwner = {
    /** Le nom sous lequel la société se présente. */
    name: string;
    /** Pays du siège social. Pas celui des serveurs, pas celui du domaine. */
    country: PaysKey;
    usage?: UsageKey;
    /** Le fait qui change la lecture du pays : un rachat, un double siège, une région. */
    note?: Bilingue;
};

// Les notes partagées par toute une famille de domaines, posées une fois.
const N_ADJUST: Bilingue = {
    fr: "Société berlinoise, filiale d'AppLovin (États-Unis) depuis 2021.",
    en: "Berlin company, an AppLovin (United States) subsidiary since 2021.",
};
const N_BYTEDANCE: Bilingue = {
    fr: "Régie Pangle de ByteDance, société enregistrée aux îles Caïmans, dirigée depuis Pékin.",
    en: "ByteDance's Pangle ad network; the company is Cayman-registered and run from Beijing.",
};
const N_DIGITAL_TURBINE: Bilingue = {
    fr: "Société berlinoise, rachetée par Digital Turbine (États-Unis) en 2021.",
    en: "Berlin company, acquired by Digital Turbine (United States) in 2021.",
};
const N_VERVE: Bilingue = {
    fr: "Société berlinoise du groupe Verve.",
    en: "Berlin company, part of the Verve group.",
};

const OWNERS: Record<string, DomainOwner> = {
    // ---- Google : la moitié du haut du classement, et cinq métiers différents ----
    "google.com": { name: "Google", country: "us", usage: "plateforme" },
    "googleapis.com": { name: "Google", country: "us", usage: "plateforme" },
    "appspot.com": { name: "Google", country: "us", usage: "hebergement" },
    "firebaseio.com": { name: "Google", country: "us", usage: "plateforme" },
    "firebaseapp.com": { name: "Google", country: "us", usage: "hebergement" },
    "gstatic.com": { name: "Google", country: "us", usage: "hebergement" },
    "googleusercontent.com": { name: "Google", country: "us", usage: "hebergement" },
    "ggpht.com": { name: "Google", country: "us", usage: "hebergement" },
    "googlevideo.com": { name: "Google", country: "us", usage: "hebergement" },
    "doubleclick.net": { name: "Google", country: "us", usage: "publicite" },
    "googlesyndication.com": { name: "Google", country: "us", usage: "publicite" },
    "googleadservices.com": { name: "Google", country: "us", usage: "publicite" },
    "googleadsserving.cn": { name: "Google", country: "us", usage: "publicite" },
    "mediation.goog": { name: "Google", country: "us", usage: "publicite" },
    "omx.google": { name: "Google", country: "us", usage: "publicite" },
    "google-analytics.com": { name: "Google", country: "us", usage: "mesure" },
    "app-measurement.com": { name: "Google", country: "us", usage: "mesure" },
    "googletagmanager.com": { name: "Google", country: "us", usage: "mesure" },
    "crashlytics.com": { name: "Google", country: "us", usage: "diagnostic" },
    "recaptcha.net": { name: "Google", country: "us", usage: "fraude" },
    "dns.google": { name: "Google", country: "us" },
    "cn.google": { name: "Google", country: "us" },
    "c2.google": { name: "Google", country: "us" },
    "youtube.com": { name: "Google", country: "us" },
    "waze.com": { name: "Google", country: "us" },

    // ---- Attribution d'installation : savoir quelle publicité a mené au téléchargement ----
    "adjust.com": { name: "Adjust", country: "de", usage: "attribution", note: N_ADJUST },
    "adjust.io": { name: "Adjust", country: "de", usage: "attribution", note: N_ADJUST },
    "adjust.cn": { name: "Adjust", country: "de", usage: "attribution", note: N_ADJUST },
    "adjust.world": { name: "Adjust", country: "de", usage: "attribution", note: N_ADJUST },
    "adjust.net.in": { name: "Adjust", country: "de", usage: "attribution", note: N_ADJUST },
    "adj.st": { name: "Adjust", country: "de", usage: "attribution", note: N_ADJUST },
    "appsflyer.com": { name: "AppsFlyer", country: "il", usage: "attribution" },
    "appsflyersdk.com": { name: "AppsFlyer", country: "il", usage: "attribution" },
    "onelink.me": { name: "AppsFlyer", country: "il", usage: "attribution" },
    "singular.com": { name: "Singular", country: "us", usage: "attribution" },
    "singular.net": { name: "Singular", country: "us", usage: "attribution" },
    "apsalar.com": { name: "Singular", country: "us", usage: "attribution" },
    "kochava.com": { name: "Kochava", country: "us", usage: "attribution" },
    "tenjin.com": { name: "Tenjin", country: "us", usage: "attribution" },
    "tenjin.io": { name: "Tenjin", country: "us", usage: "attribution" },

    // ---- Régies publicitaires ----
    "applovin.com": { name: "AppLovin", country: "us", usage: "publicite" },
    "applvn.com": { name: "AppLovin", country: "us", usage: "publicite" },
    "applov.in": { name: "AppLovin", country: "us", usage: "publicite" },
    "appl.vn": { name: "AppLovin", country: "us", usage: "publicite" },
    "safedk.com": { name: "SafeDK (AppLovin)", country: "us", usage: "publicite" },
    "inmobi.com": { name: "InMobi", country: "in", usage: "publicite" },
    "inmobicdn.net": { name: "InMobi", country: "in", usage: "publicite" },
    "vungle.com": {
        name: "Liftoff", country: "us", usage: "publicite",
        note: { fr: "Vungle, fusionnée avec Liftoff en 2021.", en: "Vungle, merged with Liftoff in 2021." },
    },
    "liftoff.com": { name: "Liftoff", country: "us", usage: "publicite" },
    "liftoff.io": { name: "Liftoff", country: "us", usage: "publicite" },
    "liftoff-creatives.io": { name: "Liftoff", country: "us", usage: "publicite" },
    "amazon-adsystem.com": { name: "Amazon", country: "us", usage: "publicite" },
    "a9.com": { name: "Amazon", country: "us", usage: "publicite" },
    "a2z.com": {
        name: "Amazon", country: "us", usage: "publicite",
        note: { fr: "Domaine d'Amazon Publisher Services.", en: "Amazon Publisher Services domain." },
    },
    "pubmatic.com": { name: "PubMatic", country: "us", usage: "publicite" },
    "pubnative.net": { name: "PubNative", country: "de", usage: "publicite", note: N_VERVE },
    "smaato.net": { name: "Smaato", country: "de", usage: "publicite", note: N_VERVE },
    "rokt.com": { name: "Rokt", country: "us", usage: "publicite" },
    "criteo.com": { name: "Criteo", country: "fr", usage: "publicite" },
    "smartadserver.com": { name: "Equativ", country: "fr", usage: "publicite" },
    "sascdn.com": { name: "Equativ", country: "fr", usage: "publicite" },
    "adnxs.com": { name: "Xandr (Microsoft)", country: "us", usage: "publicite" },
    "moloco.com": { name: "Moloco", country: "us", usage: "publicite" },
    "adsmoloco.com": { name: "Moloco", country: "us", usage: "publicite" },
    "voodoo.io": { name: "Voodoo", country: "fr", usage: "publicite" },
    "voodoo-adn.com": { name: "Voodoo", country: "fr", usage: "publicite" },
    "luckycart.com": { name: "LuckyCart", country: "fr", usage: "publicite" },
    "valiuz.com": { name: "Valiuz", country: "fr", usage: "publicite" },
    "valiuz.io": { name: "Valiuz", country: "fr", usage: "publicite" },
    "chartboost.com": { name: "Chartboost", country: "us", usage: "publicite" },
    "adcolony.com": { name: "AdColony", country: "us", usage: "publicite" },
    "fyber.com": { name: "Fyber", country: "de", usage: "publicite", note: N_DIGITAL_TURBINE },
    "fyber.ua": { name: "Fyber", country: "de", usage: "publicite", note: N_DIGITAL_TURBINE },
    "inner-active.com": { name: "Fyber", country: "de", usage: "publicite", note: N_DIGITAL_TURBINE },
    "inner-active.mobi": { name: "Fyber", country: "de", usage: "publicite", note: N_DIGITAL_TURBINE },
    "ironsrc.mobi": {
        name: "ironSource", country: "il", usage: "publicite",
        note: { fr: "Fusionnée avec Unity (États-Unis) en 2022.", en: "Merged with Unity (United States) in 2022." },
    },
    "supersonic.com": { name: "ironSource", country: "il", usage: "publicite" },
    "supersonicads.com": { name: "ironSource", country: "il", usage: "publicite" },
    "mintegral.com": { name: "Mintegral (Mobvista)", country: "cn", usage: "publicite" },
    "mobvista.com": { name: "Mobvista", country: "cn", usage: "publicite" },
    "mtgglobals.com": { name: "Mobvista", country: "cn", usage: "publicite" },
    "rayjump.com": { name: "Mobvista", country: "cn", usage: "publicite" },
    "pangle.io": { name: "ByteDance", country: "cn", usage: "publicite", note: N_BYTEDANCE },
    "pangleglobal.com": { name: "ByteDance", country: "cn", usage: "publicite", note: N_BYTEDANCE },
    "pangolin-sdk-toutiao.com": { name: "ByteDance", country: "cn", usage: "publicite", note: N_BYTEDANCE },
    "tiktokpangle.us": { name: "ByteDance", country: "cn", usage: "publicite", note: N_BYTEDANCE },
    "tiktokpangle-b.us": { name: "ByteDance", country: "cn", usage: "publicite", note: N_BYTEDANCE },
    "tiktokpangle-cdn-us.com": { name: "ByteDance", country: "cn", usage: "hebergement", note: N_BYTEDANCE },
    "byteoversea.com": { name: "ByteDance", country: "cn", note: N_BYTEDANCE },
    "snssdk.com": { name: "ByteDance", country: "cn", note: N_BYTEDANCE },
    "toutiao.com": { name: "ByteDance", country: "cn", note: N_BYTEDANCE },
    "pglstatp.com": { name: "ByteDance", country: "cn", usage: "hebergement", note: N_BYTEDANCE },
    "pglstatp-toutiao.com": { name: "ByteDance", country: "cn", usage: "hebergement", note: N_BYTEDANCE },
    "i18n-pglstatp.com": { name: "ByteDance", country: "cn", usage: "hebergement", note: N_BYTEDANCE },
    "ipstatp.com": { name: "ByteDance", country: "cn", usage: "hebergement", note: N_BYTEDANCE },
    "pstatp.com": { name: "ByteDance", country: "cn", usage: "hebergement", note: N_BYTEDANCE },
    "ibytedtos.com": { name: "ByteDance", country: "cn", usage: "hebergement", note: N_BYTEDANCE },
    "ibyteimg.com": { name: "ByteDance", country: "cn", usage: "hebergement", note: N_BYTEDANCE },
    "tiktokcdn.com": { name: "ByteDance", country: "cn", usage: "hebergement", note: N_BYTEDANCE },
    "tiktokv.us": { name: "ByteDance", country: "cn", note: N_BYTEDANCE },
    "tiktok.com": { name: "ByteDance", country: "cn", usage: "reseau", note: N_BYTEDANCE },
    "yandexadexchange.net": { name: "Yandex", country: "ru", usage: "publicite" },
    "adsafeprotected.com": { name: "Integral Ad Science", country: "us", usage: "publicite" },
    "doubleverify.com": { name: "DoubleVerify", country: "us", usage: "publicite" },
    "moatads.com": {
        name: "Oracle", country: "us", usage: "publicite",
        note: { fr: "Moat ; Oracle a arrêté son activité publicitaire en 2024.", en: "Moat; Oracle shut down its advertising business in 2024." },
    },
    "moatpixel.com": { name: "Oracle", country: "us", usage: "publicite" },
    "geoedge.be": { name: "GeoEdge", country: "il", usage: "publicite" },
    "confiant-integrations.net": { name: "Confiant", country: "us", usage: "publicite" },
    "demdex.net": { name: "Adobe", country: "us", usage: "publicite" },

    // ---- Mesure d'audience et analyse de parcours ----
    "contentsquare.com": { name: "Contentsquare", country: "fr", usage: "mesure" },
    "contentsquare.net": { name: "Contentsquare", country: "fr", usage: "mesure" },
    "content-square.net": { name: "Contentsquare", country: "fr", usage: "mesure" },
    "csq.io": { name: "Contentsquare", country: "fr", usage: "mesure" },
    "csqtrk.net": { name: "Contentsquare", country: "fr", usage: "mesure" },
    "xiti.com": {
        name: "Piano", country: "us", usage: "mesure",
        note: { fr: "AT Internet, rachetée par Piano en 2021.", en: "AT Internet, acquired by Piano in 2021." },
    },
    "ati-host.net": { name: "Piano", country: "us", usage: "mesure" },
    "pa-cd.com": { name: "Piano", country: "us", usage: "mesure" },
    "amplitude.com": { name: "Amplitude", country: "us", usage: "mesure" },
    "mparticle.com": {
        name: "mParticle", country: "us", usage: "mesure",
        note: { fr: "Rachetée par Rokt en 2024.", en: "Acquired by Rokt in 2024." },
    },
    "adobedtm.com": { name: "Adobe", country: "us", usage: "mesure" },
    "abtasty.com": { name: "AB Tasty", country: "fr", usage: "mesure" },
    "screeb.app": { name: "Screeb", country: "fr", usage: "mesure" },
    "qualtrics.com": { name: "Qualtrics", country: "us", usage: "mesure" },
    "surveymonkey.com": { name: "SurveyMonkey", country: "us", usage: "mesure" },
    "confidence.dev": { name: "Spotify", country: "se", usage: "mesure" },

    // ---- Plantages, performance ----
    "datadoghq.com": { name: "Datadog", country: "us", usage: "diagnostic" },
    "datadoghq.eu": {
        name: "Datadog", country: "us", usage: "diagnostic",
        note: { fr: "Domaine de la région européenne de Datadog.", en: "Datadog's European region domain." },
    },
    "browser-intake-datadoghq.com": { name: "Datadog", country: "us", usage: "diagnostic" },
    "browser-intake-datadoghq.eu": {
        name: "Datadog", country: "us", usage: "diagnostic",
        note: { fr: "Domaine de la région européenne de Datadog.", en: "Datadog's European region domain." },
    },
    "browser-intake-datad0g.com": { name: "Datadog", country: "us", usage: "diagnostic" },
    "browser-intake-ddog-gov.com": { name: "Datadog", country: "us", usage: "diagnostic" },
    "browser-intake-us2-ddog-gov.com": { name: "Datadog", country: "us", usage: "diagnostic" },
    "sentry.io": { name: "Sentry", country: "us", usage: "diagnostic" },
    "dynatrace.com": { name: "Dynatrace", country: "us", usage: "diagnostic" },

    // ---- Notifications push ----
    "urbanairship.com": { name: "Airship", country: "us", usage: "push" },
    "asnapieu.com": {
        name: "Airship", country: "us", usage: "push",
        note: { fr: "Domaine de la région européenne d'Airship.", en: "Airship's European region domain." },
    },
    "braze.com": { name: "Braze", country: "us", usage: "push" },
    "appboy.eu": {
        name: "Braze", country: "us", usage: "push",
        note: { fr: "Domaine de la région européenne de Braze.", en: "Braze's European region domain." },
    },
    "batch.com": { name: "Batch", country: "fr", usage: "push" },
    "batch.io": { name: "Batch", country: "fr", usage: "push" },

    // ---- Paiement ----
    "adyen.com": { name: "Adyen", country: "nl", usage: "paiement" },
    "paypal.com": { name: "PayPal", country: "us", usage: "paiement" },
    "paypalobjects.com": { name: "PayPal", country: "us", usage: "paiement" },
    "braintreegateway.com": { name: "Braintree (PayPal)", country: "us", usage: "paiement" },
    "braintreepayments.com": { name: "Braintree (PayPal)", country: "us", usage: "paiement" },
    "stripe.com": {
        name: "Stripe", country: "us", usage: "paiement",
        note: { fr: "Double siège, États-Unis et Irlande.", en: "Dual headquarters, United States and Ireland." },
    },
    "stripecdn.com": { name: "Stripe", country: "us", usage: "paiement" },
    "link.com": { name: "Stripe", country: "us", usage: "paiement" },
    "checkout.com": { name: "Checkout.com", country: "gb", usage: "paiement" },
    "klarna.com": { name: "Klarna", country: "se", usage: "paiement" },
    "klarna.net": { name: "Klarna", country: "se", usage: "paiement" },
    "klarnacdn.net": { name: "Klarna", country: "se", usage: "paiement" },
    "klarnaevt.com": { name: "Klarna", country: "se", usage: "paiement" },
    "ogone.com": {
        name: "Worldline", country: "fr", usage: "paiement",
        note: { fr: "Ingenico ePayments, groupe Worldline.", en: "Ingenico ePayments, part of Worldline." },
    },
    "payline.com": { name: "Monext", country: "fr", usage: "paiement" },
    "yoomoney.ru": { name: "YooMoney", country: "ru", usage: "paiement" },
    "yookassa.ru": { name: "YooMoney", country: "ru", usage: "paiement" },
    "revenuecat.com": { name: "RevenueCat", country: "us", usage: "paiement" },
    "revenue.cat": { name: "RevenueCat", country: "us", usage: "paiement" },

    // ---- Consentement ----
    "onetrust.io": { name: "OneTrust", country: "us", usage: "consentement" },
    "onetrust.dev": { name: "OneTrust", country: "us", usage: "consentement" },
    "otdev.org": { name: "OneTrust", country: "us", usage: "consentement" },
    "1trust.app": { name: "OneTrust", country: "us", usage: "consentement" },
    "cookielaw.org": { name: "OneTrust", country: "us", usage: "consentement" },
    "privacy-center.org": { name: "Didomi", country: "fr", usage: "consentement" },
    "trustcommander.net": { name: "Commanders Act", country: "fr", usage: "consentement" },
    "tagcommander.com": { name: "Commanders Act", country: "fr", usage: "consentement" },
    "privacy-mgmt.com": { name: "Sourcepoint", country: "us", usage: "consentement" },
    "ketchcdn.com": { name: "Ketch", country: "us", usage: "consentement" },

    // ---- Cartographie ----
    "mapbox.com": { name: "Mapbox", country: "us", usage: "cartographie" },
    "mapbox.cn": { name: "Mapbox", country: "us", usage: "cartographie" },
    "tilestream.net": { name: "Mapbox", country: "us", usage: "cartographie" },
    "woosmap.com": { name: "Woosmap", country: "fr", usage: "cartographie" },
    "geopf.fr": { name: "IGN", country: "fr", usage: "cartographie" },

    // ---- Identité, fraude ----
    "facetec.com": { name: "FaceTec", country: "us", usage: "identite" },
    "ondato.com": { name: "Ondato", country: "lt", usage: "identite" },
    "yoti.com": { name: "Yoti", country: "gb", usage: "identite" },
    "yoti.ca": { name: "Yoti", country: "gb", usage: "identite" },
    "fpjs.io": { name: "Fingerprint", country: "us", usage: "fraude" },
    "siftscience.com": { name: "Sift", country: "us", usage: "fraude" },
    "datadome.co": { name: "DataDome", country: "fr", usage: "fraude" },
    "hcaptcha.com": { name: "Intuition Machines (hCaptcha)", country: "us", usage: "fraude" },

    // ---- Support et communication ----
    "zendesk.com": { name: "Zendesk", country: "us", usage: "support" },
    "iadvize.com": { name: "iAdvize", country: "fr", usage: "support" },
    "twilio.com": { name: "Twilio", country: "us", usage: "communication" },
    "opentok.com": { name: "Vonage (Twilio)", country: "us", usage: "communication" },

    // ---- Hébergement et diffusion : le contenu servi n'est pas celui de l'hébergeur ----
    "cloudfront.net": { name: "Amazon Web Services", country: "us", usage: "hebergement" },
    "amazonaws.com": { name: "Amazon Web Services", country: "us", usage: "hebergement" },
    "media-amazon.com": { name: "Amazon", country: "us", usage: "hebergement" },
    "akamaihd.net": { name: "Akamai", country: "us", usage: "hebergement" },
    "cloudflare.com": { name: "Cloudflare", country: "us", usage: "hebergement" },
    "cloudflarestream.com": { name: "Cloudflare", country: "us", usage: "hebergement" },
    "b-cdn.net": { name: "Bunny", country: "si", usage: "hebergement" },
    "windows.net": { name: "Microsoft Azure", country: "us", usage: "hebergement" },
    "fbcdn.net": { name: "Meta", country: "us", usage: "hebergement" },
    "scene7.com": { name: "Adobe", country: "us", usage: "hebergement" },
    "giphy.com": {
        name: "Giphy", country: "us", usage: "hebergement",
        note: { fr: "Rachetée par Shutterstock en 2023.", en: "Acquired by Shutterstock in 2023." },
    },
    "scdn.co": { name: "Spotify", country: "se", usage: "hebergement" },
    "imgix.net": { name: "imgix", country: "us", usage: "hebergement" },

    // ---- Réseaux sociaux ----
    "facebook.com": { name: "Meta", country: "us", usage: "reseau" },
    "facebook.net": { name: "Meta", country: "us", usage: "reseau" },
    "instagram.com": { name: "Meta", country: "us", usage: "reseau" },
    "whatsapp.com": { name: "Meta", country: "us", usage: "reseau" },
    "fb.gg": { name: "Meta", country: "us", usage: "reseau" },
    "twitter.com": { name: "X Corp.", country: "us", usage: "reseau" },
    "x.com": { name: "X Corp.", country: "us", usage: "reseau" },
    "linkedin.com": { name: "LinkedIn (Microsoft)", country: "us", usage: "reseau" },
    "pinterest.com": { name: "Pinterest", country: "us", usage: "reseau" },
    "vk.com": { name: "VK", country: "ru", usage: "reseau" },
    "vk.ru": { name: "VK", country: "ru", usage: "reseau" },

    // ---- Plateformes générales ----
    "amazon.com": { name: "Amazon", country: "us", usage: "plateforme" },
    "apple.com": { name: "Apple", country: "us", usage: "plateforme" },
    "bing.com": { name: "Microsoft", country: "us", usage: "plateforme" },
    "huawei.com": { name: "Huawei", country: "cn", usage: "plateforme" },
    "samsungapps.com": { name: "Samsung", country: "kr", usage: "plateforme" },
    "spotify.com": { name: "Spotify", country: "se", usage: "plateforme" },
    "yandex.ru": { name: "Yandex", country: "ru", usage: "plateforme" },
    "yandex.net": { name: "Yandex", country: "ru", usage: "plateforme" },
    "unity3d.com": { name: "Unity", country: "us", usage: "plateforme" },
    "unity3dusercontent.com": { name: "Unity", country: "us", usage: "hebergement" },
    "algolia.io": { name: "Algolia", country: "fr", usage: "plateforme" },
    "ably.io": { name: "Ably", country: "gb", usage: "plateforme" },
    "ably-realtime.com": { name: "Ably", country: "gb", usage: "plateforme" },
    "queue-it.net": { name: "Queue-it", country: "dk", usage: "plateforme" },
    "img.ly": { name: "img.ly", country: "de", usage: "plateforme" },
    "photoeditorsdk.com": { name: "img.ly", country: "de", usage: "plateforme" },
    "adevinta.com": { name: "Adevinta", country: "no", usage: "plateforme" },
    "eagleeye.com": { name: "Eagle Eye Solutions", country: "gb" },
    "early-birds.fr": { name: "Early Birds", country: "fr" },

    // ---- Ni des régies ni des destinataires : les schémas publiés par les normalisateurs.
    // Ils sont dans le binaire parce qu'un espace de noms XML est une chaîne comme une
    // autre. Les nommer est la manière la plus courte de montrer ce que la méthode compte.
    "w3.org": { name: "W3C", country: "us", usage: "norme" },
    "unicode.org": { name: "Unicode Consortium", country: "us", usage: "norme" },
};

/** Suffixes composés courants, pour ne pas réduire `bbc.co.uk` à `co.uk`. */
const SUFFIXES_COMPOSES = new Set([
    "co.uk", "org.uk", "com.br", "co.jp", "com.au", "com.cn", "co.in", "com.mx",
    "com.tr", "co.kr", "com.hk", "com.sg", "co.za", "com.tw", "co.th",
    // Le second niveau indien n'est pas que `co.in` : `adjust.net.in` se réduisait à
    // `net.in`, qui rangeait onze adresses d'Adjust sous un suffixe au lieu d'une société.
    "net.in", "org.in", "firm.in", "gen.in", "ind.in", "ac.in", "res.in",
]);

/**
 * Le domaine racine d'un hôte : `pagead2.googlesyndication.com` → `googlesyndication.com`.
 *
 * Approximation assumée — la vraie liste des suffixes publics fait des milliers de lignes
 * et l'embarquer pour afficher un regroupement serait disproportionné. Les cas qu'elle
 * raterait se lisent quand même : un domaine racine faux reste un domaine, pas une
 * affirmation sur l'application. Mais un domaine racine faux n'est jamais dans la table
 * ci-dessus, donc chaque suffixe manquant coûte un nom de société — d'où la liste tenue.
 */
export function rootDomain(host: string): string {
    const parts = host.split(".");
    if (parts.length <= 2) return host;
    const deux = parts.slice(-2).join(".");
    return SUFFIXES_COMPOSES.has(deux) ? parts.slice(-3).join(".") : deux;
}

export type OwnerLabel = { name: string; country: string; usage?: string; note?: string };

/**
 * Ce qu'on sait dire d'un domaine racine, ou `null`.
 *
 * `null` est une réponse : l'interface affiche alors le domaine seul. C'est la moitié des
 * domaines du corpus, et c'est préférable à une société inventée.
 */
export function domainOwner(domain: string, lang: string): OwnerLabel | null {
    const o = OWNERS[domain];
    if (!o) return null;
    const l = lang === "fr" ? "fr" : "en";
    return {
        name: o.name,
        country: PAYS[o.country][l],
        usage: o.usage ? USAGES[o.usage][l] : undefined,
        note: o.note ? o.note[l] : undefined,
    };
}

/** La réserve à afficher sous une liste, quand un des domaines visibles l'appelle. */
export function ownerReserve(domains: string[], lang: string): string | null {
    const l = lang === "fr" ? "fr" : "en";
    for (const d of domains) {
        const u = OWNERS[d]?.usage;
        const r = u && USAGE_RESERVE[u];
        if (r) return r[l];
    }
    return null;
}

export default OWNERS;
