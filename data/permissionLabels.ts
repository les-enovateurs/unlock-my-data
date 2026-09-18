/**
 * Libellés lisibles pour les permissions Android que le catalogue Exodus ne décrit pas.
 *
 * `public/data/compare/permissions_fr.json` porte 693 entrées mais n'en documente que 66
 * de celles que nos 141 fiches déclarent réellement — il s'arrête avant les permissions
 * introduites depuis Android 13 (notifications, médias granulaires, Privacy Sandbox) et
 * ne connaît aucune permission propriétaire de constructeur ou de Google Play. Les 544
 * restantes s'affichaient en `READ_MEDIA_VISUAL_USER_SELECTED`, illisible.
 *
 * Ce fichier complète, il ne remplace pas : le catalogue Exodus reste consulté d'abord.
 * Les 70 entrées ci-dessous sont les plus fréquentes du corpus et couvrent environ 78 %
 * des occurrences sans libellé. Le reste s'affiche encore sous son nom technique court, ce
 * qui est préférable à une traduction approximative.
 *
 * Chaque libellé décrit **ce que la permission autorise**, dans les termes de la
 * documentation de la plateforme Android, et non ce que l'application en fait — une
 * permission de notification n'est pas une preuve de spam, et un badge de lanceur n'est
 * pas un pistage. Les libellés sont volontairement au même registre que ceux d'Exodus :
 * un groupe verbal minuscule, sans majuscule initiale ni point final.
 *
 * Une famille domine le corpus et mérite d'être lue comme telle : les permissions de
 * badge (Samsung, Huawei, HTC, Sony, Oppo, Nova, Everything) servent toutes à écrire le
 * petit compteur sur l'icône du lanceur. Elles apparaissent par paquets de six ou sept et
 * gonflent le total sans rien dire de la vie privée.
 */

export type PermissionLabel = { fr: string; en: string };

const LABELS: Record<string, PermissionLabel> = {
    // ---- Notifications et messagerie push ----
    "android.permission.POST_NOTIFICATIONS": {
        fr: "afficher des notifications",
        en: "post notifications",
    },
    "com.google.android.c2dm.permission.RECEIVE": {
        fr: "recevoir des messages push via Google",
        en: "receive push messages through Google",
    },
    "com.amazon.device.messaging.permission.RECEIVE": {
        fr: "recevoir des messages push via Amazon",
        en: "receive push messages through Amazon",
    },

    // ---- Publicité et mesure d'attribution ----
    "com.google.android.gms.permission.AD_ID": {
        fr: "lire l'identifiant publicitaire de l'appareil",
        en: "read the device advertising ID",
    },
    "android.permission.ACCESS_ADSERVICES_AD_ID": {
        fr: "lire l'identifiant publicitaire via Privacy Sandbox",
        en: "read the advertising ID through Privacy Sandbox",
    },
    "android.permission.ACCESS_ADSERVICES_ATTRIBUTION": {
        fr: "attribuer une installation ou un achat à une publicité",
        en: "attribute an install or purchase to an ad",
    },
    "android.permission.ACCESS_ADSERVICES_TOPICS": {
        fr: "lire les centres d'intérêt déduits par le système",
        en: "read the interest topics inferred by the system",
    },
    "android.permission.AD_SERVICES_CONFIG": {
        fr: "accéder aux réglages publicitaires du système",
        en: "access the system's ad settings",
    },
    "android.permission.ACCESS_ADSERVICES_CUSTOM_AUDIENCE": {
        fr: "inscrire l'appareil dans une audience publicitaire",
        en: "add the device to a custom ad audience",
    },
    "com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE": {
        fr: "savoir par quelle campagne l'application a été installée",
        en: "learn which campaign led to the install",
    },

    "android.permission.HIGH_SAMPLING_RATE_SENSORS": {
        fr: "lire les capteurs de mouvement à haute fréquence",
        en: "read motion sensors at a high sampling rate",
    },
    "android.permission.REQUEST_OBSERVE_COMPANION_DEVICE_PRESENCE": {
        fr: "savoir quand l'objet appairé est à portée",
        en: "know when the paired device is nearby",
    },
    "android.permission.FOREGROUND_SERVICE_REMOTE_MESSAGING": {
        fr: "faire tourner sa messagerie en arrière-plan",
        en: "run its messaging service in the background",
    },
    "android.permission.READ_LOGS": {
        fr: "lire les journaux système de l'appareil",
        en: "read the device's system logs",
    },
    // Declared with the literal `Manifest.permission.` prefix -- a mistake in the app's
    // own manifest, kept as measured rather than repaired here.
    "Manifest.permission.CAPTURE_AUDIO_OUTPUT": {
        fr: "capter le son que l'appareil émet",
        en: "capture the audio the device plays",
    },

    // ---- Google Play ----
    "com.android.vending.BILLING": {
        fr: "vendre des achats intégrés",
        en: "sell in-app purchases",
    },
    "com.android.vending.CHECK_LICENSE": {
        fr: "vérifier la licence Play de l'application",
        en: "check the app's Play licence",
    },
    "com.google.android.providers.gsf.permission.READ_GSERVICES": {
        fr: "lire les réglages des services Google de l'appareil",
        en: "read the device's Google services settings",
    },
    "com.huawei.appmarket.service.commondata.permission.GET_COMMON_DATA": {
        fr: "lire les données de la boutique Huawei",
        en: "read Huawei AppGallery data",
    },
    "com.samsung.android.mapsagent.permission.READ_APP_INFO": {
        fr: "lire les informations d'application de l'agent Samsung",
        en: "read app info from the Samsung agent",
    },

    // ---- Médias, par type depuis Android 13 ----
    "android.permission.READ_MEDIA_IMAGES": {
        fr: "lire vos photos",
        en: "read your photos",
    },
    "android.permission.READ_MEDIA_VIDEO": {
        fr: "lire vos vidéos",
        en: "read your videos",
    },
    "android.permission.READ_MEDIA_AUDIO": {
        fr: "lire vos fichiers audio",
        en: "read your audio files",
    },
    "android.permission.READ_MEDIA_VISUAL_USER_SELECTED": {
        fr: "lire seulement les photos que vous désignez",
        en: "read only the photos you pick",
    },

    // ---- Services en avant-plan : ce que l'application continue de faire, écran éteint ----
    "android.permission.FOREGROUND_SERVICE_DATA_SYNC": {
        fr: "synchroniser des données en arrière-plan",
        en: "sync data in the background",
    },
    "android.permission.FOREGROUND_SERVICE_MICROPHONE": {
        fr: "utiliser le micro en arrière-plan",
        en: "use the microphone in the background",
    },
    "android.permission.FOREGROUND_SERVICE_CAMERA": {
        fr: "utiliser l'appareil photo en arrière-plan",
        en: "use the camera in the background",
    },
    "android.permission.FOREGROUND_SERVICE_LOCATION": {
        fr: "suivre votre position en arrière-plan",
        en: "track your location in the background",
    },
    "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK": {
        fr: "continuer la lecture en arrière-plan",
        en: "keep playing media in the background",
    },
    "android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION": {
        fr: "enregistrer ou diffuser l'écran en arrière-plan",
        en: "record or cast the screen in the background",
    },
    "android.permission.FOREGROUND_SERVICE_PHONE_CALL": {
        fr: "maintenir un appel en arrière-plan",
        en: "keep a call running in the background",
    },
    "android.permission.FOREGROUND_SERVICE_CONNECTED_DEVICE": {
        fr: "rester connectée à un appareil en arrière-plan",
        en: "stay connected to a device in the background",
    },
    "android.permission.FOREGROUND_SERVICE_SPECIAL_USE": {
        fr: "tourner en arrière-plan pour un usage non catégorisé",
        en: "run in the background for an uncategorised use",
    },
    "android.permission.RUN_USER_INITIATED_JOBS": {
        fr: "poursuivre une tâche que vous avez lancée",
        en: "carry on a task you started",
    },

    // ---- Comptes ----
    "android.permission.USE_CREDENTIALS": {
        fr: "utiliser les comptes enregistrés sur l'appareil",
        en: "use the accounts stored on the device",
    },
    "android.permission.AUTHENTICATE_ACCOUNTS": {
        fr: "s'authentifier comme un compte de l'appareil",
        en: "authenticate as a device account",
    },
    "android.permission.MANAGE_ACCOUNTS": {
        fr: "ajouter ou retirer des comptes de l'appareil",
        en: "add or remove device accounts",
    },
    "android.permission.READ_PROFILE": {
        fr: "lire votre fiche de contact personnelle",
        en: "read your personal contact card",
    },

    // ---- Appareil et système ----
    "android.permission.READ_BASIC_PHONE_STATE": {
        fr: "lire l'état de base du téléphone",
        en: "read basic phone state",
    },
    "android.permission.NEARBY_WIFI_DEVICES": {
        fr: "détecter les appareils Wi-Fi proches",
        en: "detect nearby Wi-Fi devices",
    },
    "android.permission.FLASHLIGHT": {
        fr: "allumer le flash",
        en: "turn on the flashlight",
    },
    "android.permission.SCHEDULE_EXACT_ALARM": {
        fr: "programmer une alarme à l'heure exacte",
        en: "schedule an alarm at an exact time",
    },
    "android.permission.DOWNLOAD_WITHOUT_NOTIFICATION": {
        fr: "télécharger sans vous en avertir",
        en: "download without notifying you",
    },
    "android.permission.DETECT_SCREEN_CAPTURE": {
        fr: "savoir quand vous faites une capture d'écran",
        en: "detect when you take a screenshot",
    },
    "android.permission.HIDE_OVERLAY_WINDOWS": {
        fr: "masquer les fenêtres superposées des autres applications",
        en: "hide other apps' overlay windows",
    },

    // ---- Divers, vus dans le corpus ----
    "android.permission.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION": {
        fr: "réserver ses récepteurs internes à elle-même",
        en: "keep its internal receivers to itself",
    },
    "android.permission.POST_PROMOTED_NOTIFICATIONS": {
        fr: "afficher des notifications mises en avant",
        en: "post promoted notifications",
    },
    "android.permission.DETECT_SCREEN_RECORDING": {
        fr: "savoir quand vous enregistrez l'écran",
        en: "detect when you record the screen",
    },
    "android.permission.BROADCAST_CLOSE_SYSTEM_DIALOGS": {
        fr: "demander la fermeture des boîtes de dialogue système",
        en: "ask for system dialogs to close",
    },
    "android.permission.CAPTURE_VIDEO_OUTPUT": {
        fr: "capter la sortie vidéo de l'appareil",
        en: "capture the device's video output",
    },
    "android.permission.CREDENTIAL_MANAGER_SET_ALLOWED_PROVIDERS": {
        fr: "choisir quels gestionnaires d'identifiants sont acceptés",
        en: "choose which credential providers are accepted",
    },
    "android.permission.CREDENTIAL_MANAGER_QUERY_CANDIDATE_CREDENTIALS": {
        fr: "interroger les identifiants disponibles sur l'appareil",
        en: "query the credentials available on the device",
    },
    "com.google.android.gms.permission.ACTIVITY_RECOGNITION": {
        fr: "reconnaître votre activité physique via Google",
        en: "recognise your physical activity through Google",
    },
    "com.amazon.privacypass.ATTEST": {
        fr: "attester de l'appareil auprès d'Amazon",
        en: "attest the device to Amazon",
    },
    "com.adjust.preinstall.READ_PERMISSION": {
        fr: "lire l'attribution de pré-installation Adjust",
        en: "read the Adjust preinstall attribution",
    },
    "com.facebook.katana.provider.ACCESS": {
        fr: "communiquer avec l'application Facebook installée",
        en: "talk to the installed Facebook app",
    },
    "com.hihonor.security.permission.ACCESS_THREAT_DETECTION": {
        fr: "interroger la détection de menaces Honor",
        en: "query Honor threat detection",
    },
    "com.sfr.android.console.permission.partner.READ_STATISTICS": {
        fr: "lire les statistiques partenaire SFR",
        en: "read SFR partner statistics",
    },

    // ---- Badges du lanceur : le compteur sur l'icône, un constructeur par entrée ----
    "android.permission.READ_APP_BADGE": {
        fr: "lire le compteur sur son icône",
        en: "read the counter on its icon",
    },
    "com.sec.android.provider.badge.permission.READ": {
        fr: "lire le compteur sur son icône (Samsung)",
        en: "read the counter on its icon (Samsung)",
    },
    "com.sec.android.provider.badge.permission.WRITE": {
        fr: "afficher un compteur sur son icône (Samsung)",
        en: "show a counter on its icon (Samsung)",
    },
    "com.huawei.android.launcher.permission.CHANGE_BADGE": {
        fr: "afficher un compteur sur son icône (Huawei)",
        en: "show a counter on its icon (Huawei)",
    },
    "com.huawei.android.launcher.permission.READ_SETTINGS": {
        fr: "lire les réglages du lanceur (Huawei)",
        en: "read launcher settings (Huawei)",
    },
    "com.huawei.android.launcher.permission.WRITE_SETTINGS": {
        fr: "modifier les réglages du lanceur (Huawei)",
        en: "change launcher settings (Huawei)",
    },
    "com.htc.launcher.permission.READ_SETTINGS": {
        fr: "lire les réglages du lanceur (HTC)",
        en: "read launcher settings (HTC)",
    },
    "com.htc.launcher.permission.UPDATE_SHORTCUT": {
        fr: "mettre à jour son raccourci (HTC)",
        en: "update its shortcut (HTC)",
    },
    "com.sonyericsson.home.permission.BROADCAST_BADGE": {
        fr: "afficher un compteur sur son icône (Sony)",
        en: "show a counter on its icon (Sony)",
    },
    "com.sonymobile.home.permission.PROVIDER_INSERT_BADGE": {
        fr: "afficher un compteur sur son icône (Sony)",
        en: "show a counter on its icon (Sony)",
    },
    "com.oppo.launcher.permission.READ_SETTINGS": {
        fr: "lire les réglages du lanceur (Oppo)",
        en: "read launcher settings (Oppo)",
    },
    "com.oppo.launcher.permission.WRITE_SETTINGS": {
        fr: "modifier les réglages du lanceur (Oppo)",
        en: "change launcher settings (Oppo)",
    },
    "android.permission.WRITE_APP_BADGE": {
        fr: "afficher un compteur sur son icône",
        en: "show a counter on its icon",
    },
    "com.android.launcher.permission.READ_SETTINGS": {
        fr: "lire les réglages du lanceur",
        en: "read launcher settings",
    },
    "com.anddoes.launcher.permission.UPDATE_COUNT": {
        fr: "afficher un compteur sur son icône (Apex)",
        en: "show a counter on its icon (Apex)",
    },
    "com.majeur.launcher.permission.UPDATE_BADGE": {
        fr: "afficher un compteur sur son icône (Nova)",
        en: "show a counter on its icon (Nova)",
    },
    "me.everything.badger.permission.BADGE_COUNT_READ": {
        fr: "lire le compteur sur son icône",
        en: "read the counter on its icon",
    },
    "me.everything.badger.permission.BADGE_COUNT_WRITE": {
        fr: "afficher un compteur sur son icône",
        en: "show a counter on its icon",
    },
};

export default LABELS;

/**
 * Le nom technique court, dernier recours quand aucun catalogue ne décrit la permission.
 *
 * Le dernier segment seulement si c'est bien une constante de permission —
 * `SCREAMING_SNAKE_CASE`. Certaines applications déclarent leur propre nom de paquet dans
 * la liste, pour protéger leurs composants entre eux : Grindr y met `com.grindrapp.android`,
 * dont le dernier segment est `android`, affiché tel quel comme si l'application demandait
 * une permission nommée « android ». Dans ce cas la chaîne entière est plus honnête que sa
 * fin.
 */
export function shortName(full: string): string {
    // Manifests are quoted as measured, spaces included: Lexibook declares
    // `android.permission.HIGH_SAMPLING_RATE_SENSORS ` with a trailing one, which used to
    // fail the match and print the whole technical name in place of the short one.
    const clean = full.trim();
    const last = clean.split(".").pop() || clean;
    return /^[A-Z0-9_]+$/.test(last) ? last : clean;
}

/**
 * Les permissions que chaque application déclare sous son propre nom de paquet.
 *
 * `com.bereal.ft.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` et ses 153 cousines ne peuvent
 * pas entrer dans la table par clé exacte : le préfixe change à chaque application, et
 * une entrée par application serait une table de 154 lignes disant quatre choses. Elles
 * sont posées par les bibliothèques AndroidX ou par les SDK de notification push, et ce
 * qu'elles autorisent ne dépend pas de l'application qui les porte.
 */
const SUFFIXES: [RegExp, PermissionLabel][] = [
    [/\.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION$/, {
        fr: "réserver ses récepteurs internes à elle-même",
        en: "keep its internal receivers to itself",
    }],
    [/\.permission\.C2D_MESSAGE$/, {
        fr: "recevoir ses propres messages push",
        en: "receive its own push messages",
    }],
    [/\.permission\.PROCESS_PUSH_MSG$/, {
        fr: "traiter ses propres messages push",
        en: "process its own push messages",
    }],
    [/\.permission\.PUSH_PROVIDER$/, {
        fr: "fournir ses propres notifications push",
        en: "provide its own push notifications",
    }],
    [/\.permission\.MIPUSH_RECEIVE$/, {
        fr: "recevoir des messages push via Xiaomi",
        en: "receive push messages through Xiaomi",
    }],
    [/\.permission\.JPUSH_MESSAGE$/, {
        fr: "recevoir ses propres messages push via JPush",
        en: "receive its own push messages through JPush",
    }],
];

/**
 * Le libellé le plus lisible dont on dispose, dans cet ordre : le catalogue Exodus, la
 * table Health Connect, notre complément par clé exacte, notre complément par suffixe,
 * puis le nom technique. Jamais de traduction inventée à la volée.
 */
export function permissionLabel(
    full: string,
    catalogLabel: string | undefined,
    lang: string,
): string {
    if (catalogLabel) return ucfirst(catalogLabel);
    const sante = healthLabel(full, lang);
    if (sante) return ucfirst(sante);
    const own = LABELS[full];
    if (own) return ucfirst(lang === "fr" ? own.fr : own.en);
    for (const [motif, label] of SUFFIXES) {
        if (motif.test(full)) return ucfirst(lang === "fr" ? label.fr : label.en);
    }
    // Pas de capitale sur le repli technique : `com.grindrapp.android` deviendrait
    // `Com.grindrapp.android`, qui n'est plus le nom de rien.
    return shortName(full);
}

/**
 * La capitale initiale est posée à l'affichage, pas dans la table.
 *
 * Les libellés sont stockés en minuscule parce que c'est le registre du catalogue Exodus
 * — qui mélange d'ailleurs les deux, « prendre des photos » et « Voir les contacts ». Les
 * écrire en minuscule et capitaliser ici donne une casse identique sur les deux sources,
 * ce qu'aucune des deux ne garantit seule.
 */
function ucfirst(texte: string): string {
    return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/* ------------------------------------------------------------------ *
 *  Health Connect
 * ------------------------------------------------------------------ */

/**
 * Les permissions de santé, une par type de mesure.
 *
 * Health Connect a remplacé Google Fit en 2024 et déclare une permission par enregistrement :
 * `android.permission.health.READ_MENSTRUATION`, `…READ_SEXUAL_ACTIVITY`, `…READ_VO2_MAX`.
 * Le catalogue Exodus n'en décrit aucune — ses 693 entrées s'arrêtent avant — et une fiche
 * comme celle de Claude en aligne quarante et une, toutes affichées sous leur nom technique
 * et noyées dans le repli « voir les autres permissions ».
 *
 * Une entrée par mesure plutôt que par permission : le verbe (lire ou écrire) est posé à
 * l'affichage, ce qui fait 41 lignes au lieu de 82 et interdit la divergence entre le
 * libellé de lecture et celui d'écriture.
 *
 * Ce sont des données de santé au sens de l'article 9 du RGPD — donnée sensible, dont le
 * traitement est interdit par défaut. Les règles, les tests d'ovulation et l'activité
 * sexuelle en font partie et méritent d'être lus en toutes lettres.
 */
type HealthTheme =
    | "cycle" | "vitals" | "body" | "sleep" | "nutrition" | "mind" | "activity"
    | "access" | "other";

type HealthRecord = PermissionLabel & { theme: HealthTheme };

/**
 * Les thèmes sont ceux de Health Connect lui-même — les six rubriques de son écran
 * d'autorisations, plus une pour les deux permissions qui portent sur la portée de
 * l'accès. Aucune n'est de notre invention : regrouper 41 lignes demande un classement,
 * et le seul défendable est celui de la plateforme qui délivre la donnée.
 *
 * L'ordre, en revanche, est le nôtre, et c'est celui du reste de la page : le plus intime
 * d'abord. Le cycle menstruel ouvre la liste, le nombre de pas la ferme.
 */
const HEALTH_THEME_ORDER: HealthTheme[] = [
    "cycle", "vitals", "body", "sleep", "nutrition", "mind", "activity", "access", "other",
];

export const HEALTH_THEMES: Record<HealthTheme, PermissionLabel> = {
    cycle: { fr: "Cycle menstruel et santé reproductive", en: "Menstrual cycle and reproductive health" },
    vitals: { fr: "Signes vitaux", en: "Vitals" },
    body: { fr: "Mesures corporelles", en: "Body measurements" },
    sleep: { fr: "Sommeil", en: "Sleep" },
    nutrition: { fr: "Alimentation et hydratation", en: "Nutrition and hydration" },
    mind: { fr: "Bien-être mental", en: "Mental wellbeing" },
    activity: { fr: "Activité physique", en: "Physical activity" },
    access: { fr: "Portée de l'accès", en: "Scope of access" },
    other: { fr: "Autres mesures", en: "Other records" },
};

/**
 * Chaque mesure est nommée comme une **donnée**, pas comme une partie du corps.
 *
 * « Lire vos règles » se lit comme si l'application ouvrait le corps de quelqu'un ; ce que
 * la permission ouvre, c'est un carnet. D'où « votre suivi des règles », « votre journal
 * d'activité sexuelle », « vos mesures de glycémie » : le nom dit l'objet informatique,
 * l'intimité reste lisible sans être mimée. Ce choix a une contrainte, et elle est utile :
 * tout libellé doit rester correct derrière les deux verbes, `accéder à` et `ajouter à`.
 */
const HEALTH_RECORDS: Record<string, HealthRecord> = {
    // ---- Cycle menstruel et santé reproductive ----
    CERVICAL_MUCUS: { theme: "cycle", fr: "vos observations de glaire cervicale", en: "your cervical mucus records" },
    INTERMENSTRUAL_BLEEDING: { theme: "cycle", fr: "votre suivi des saignements entre les règles", en: "your intermenstrual bleeding log" },
    MENSTRUATION: { theme: "cycle", fr: "votre suivi des règles", en: "your period tracking" },
    OVULATION_TEST: { theme: "cycle", fr: "vos résultats de tests d'ovulation", en: "your ovulation test results" },
    SEXUAL_ACTIVITY: { theme: "cycle", fr: "votre journal d'activité sexuelle", en: "your sexual activity log" },

    // ---- Signes vitaux ----
    BASAL_BODY_TEMPERATURE: { theme: "vitals", fr: "vos mesures de température basale", en: "your basal body temperature readings" },
    BLOOD_GLUCOSE: { theme: "vitals", fr: "vos mesures de glycémie", en: "your blood glucose readings" },
    BLOOD_PRESSURE: { theme: "vitals", fr: "vos mesures de tension artérielle", en: "your blood pressure readings" },
    BODY_TEMPERATURE: { theme: "vitals", fr: "vos mesures de température corporelle", en: "your body temperature readings" },
    HEART_RATE: { theme: "vitals", fr: "vos mesures de fréquence cardiaque", en: "your heart rate readings" },
    HEART_RATE_VARIABILITY: { theme: "vitals", fr: "vos mesures de variabilité cardiaque", en: "your heart rate variability readings" },
    OXYGEN_SATURATION: { theme: "vitals", fr: "vos mesures de saturation en oxygène", en: "your oxygen saturation readings" },
    RESPIRATORY_RATE: { theme: "vitals", fr: "vos mesures de fréquence respiratoire", en: "your respiratory rate readings" },
    RESTING_HEART_RATE: { theme: "vitals", fr: "vos mesures de fréquence cardiaque au repos", en: "your resting heart rate readings" },
    SKIN_TEMPERATURE: { theme: "vitals", fr: "vos mesures de température cutanée", en: "your skin temperature readings" },

    // ---- Mesures corporelles ----
    BASAL_METABOLIC_RATE: { theme: "body", fr: "vos mesures de métabolisme de base", en: "your basal metabolic rate readings" },
    BODY_FAT: { theme: "body", fr: "vos mesures de masse grasse", en: "your body fat readings" },
    BODY_WATER_MASS: { theme: "body", fr: "vos mesures de masse hydrique", en: "your body water mass readings" },
    BONE_MASS: { theme: "body", fr: "vos mesures de masse osseuse", en: "your bone mass readings" },
    HEIGHT: { theme: "body", fr: "vos mesures de taille", en: "your height readings" },
    LEAN_BODY_MASS: { theme: "body", fr: "vos mesures de masse maigre", en: "your lean body mass readings" },
    WEIGHT: { theme: "body", fr: "vos mesures de poids", en: "your weight readings" },

    // ---- Sommeil ----
    SLEEP: { theme: "sleep", fr: "votre suivi du sommeil", en: "your sleep tracking" },

    // ---- Alimentation et hydratation ----
    HYDRATION: { theme: "nutrition", fr: "votre suivi d'hydratation", en: "your hydration log" },
    NUTRITION: { theme: "nutrition", fr: "votre journal alimentaire", en: "your food log" },

    // ---- Bien-être mental ----
    MINDFULNESS: { theme: "mind", fr: "vos séances de méditation", en: "your mindfulness sessions" },

    // ---- Activité physique ----
    ACTIVE_CALORIES_BURNED: { theme: "activity", fr: "vos calories brûlées en activité", en: "your active calories burned" },
    CYCLING_PEDALING_CADENCE: { theme: "activity", fr: "vos mesures de cadence de pédalage", en: "your pedaling cadence readings" },
    DISTANCE: { theme: "activity", fr: "vos distances parcourues", en: "the distances you covered" },
    ELEVATION_GAINED: { theme: "activity", fr: "votre dénivelé positif", en: "your elevation gained" },
    EXERCISE: { theme: "activity", fr: "vos séances de sport", en: "your workouts" },
    EXERCISE_ROUTE: { theme: "activity", fr: "vos tracés GPS d'entraînement", en: "your workout GPS routes" },
    FLOORS_CLIMBED: { theme: "activity", fr: "vos étages montés", en: "the floors you climbed" },
    PLANNED_EXERCISE: { theme: "activity", fr: "vos séances de sport programmées", en: "your planned workouts" },
    POWER: { theme: "activity", fr: "vos mesures de puissance à l'effort", en: "your power output readings" },
    SPEED: { theme: "activity", fr: "vos mesures de vitesse", en: "your speed readings" },
    STEPS: { theme: "activity", fr: "votre compteur de pas", en: "your step count" },
    STEPS_CADENCE: { theme: "activity", fr: "vos mesures de cadence de marche", en: "your step cadence readings" },
    TOTAL_CALORIES_BURNED: { theme: "activity", fr: "vos calories brûlées au total", en: "your total calories burned" },
    VO2_MAX: { theme: "activity", fr: "vos mesures de VO2 max", en: "your VO2 max readings" },
    WHEELCHAIR_PUSHES: { theme: "activity", fr: "vos poussées en fauteuil roulant", en: "your wheelchair pushes" },
};

/** Les deux permissions de santé qui ne portent pas sur une mesure mais sur l'accès lui-même. */
const HEALTH_SPECIALS: Record<string, HealthRecord> = {
    READ_HEALTH_DATA_HISTORY: {
        theme: "access",
        fr: "accéder à vos données de santé de plus de 30 jours",
        en: "access your health data older than 30 days",
    },
    READ_HEALTH_DATA_IN_BACKGROUND: {
        theme: "access",
        fr: "accéder à vos données de santé quand l'application est fermée",
        en: "access your health data while the app is closed",
    },
};

const HEALTH_PREFIX = "android.permission.health.";

/** `true` pour toute permission Health Connect, quelle que soit la mesure visée. */
export function isHealthPermission(full: string): boolean {
    return full.startsWith(HEALTH_PREFIX);
}

/**
 * Le libellé d'une permission Health Connect, verbe compris.
 *
 * `READ_EXERCISE_ROUTES` est au pluriel côté lecture et au singulier côté écriture
 * (`WRITE_EXERCISE_ROUTE`) : les deux pointent la même mesure.
 */
function healthRecord(full: string): { mesure: HealthRecord; verbe?: "READ" | "WRITE" } | undefined {
    if (!isHealthPermission(full)) return undefined;
    const reste = full.slice(HEALTH_PREFIX.length);

    const special = HEALTH_SPECIALS[reste];
    if (special) return { mesure: special };

    const coupe = /^(READ|WRITE)_(.+)$/.exec(reste);
    if (!coupe) return undefined;
    const [, verbe, mesureBrute] = coupe;
    const mesure = HEALTH_RECORDS[mesureBrute] || HEALTH_RECORDS[mesureBrute.replace(/S$/, "")];
    if (!mesure) return undefined;

    return { mesure, verbe: verbe as "READ" | "WRITE" };
}

function healthLabel(full: string, lang: string): string | undefined {
    const trouve = healthRecord(full);
    if (!trouve) return undefined;
    const { mesure, verbe } = trouve;

    // Les deux permissions de portée portent déjà leur verbe : elles n'ouvrent pas une
    // mesure mais l'historique entier.
    if (!verbe) return lang === "fr" ? mesure.fr : mesure.en;

    if (lang === "fr") return `${verbe === "READ" ? "accéder à" : "ajouter à"} ${mesure.fr}`;
    return `${verbe === "READ" ? "access" : "add to"} ${mesure.en}`;
}

/**
 * Le thème Health Connect d'une permission de santé, pour ordonner et sous-titrer les 41
 * lignes qu'une seule application peut demander. `other` pour une mesure que la table ne
 * connaît pas encore — Health Connect en ajoute à chaque version d'Android.
 */
export function healthTheme(full: string): HealthTheme {
    return healthRecord(full)?.mesure.theme ?? "other";
}

/** Les thèmes présents dans une liste de permissions, dans l'ordre d'affichage. */
export function healthThemesOf(fulls: string[]): HealthTheme[] {
    const vus = new Set(fulls.filter(isHealthPermission).map(healthTheme));
    return HEALTH_THEME_ORDER.filter((theme) => vus.has(theme));
}

/* ------------------------------------------------------------------ *
 *  Catégories
 * ------------------------------------------------------------------ */

/**
 * Le domaine de vie que la permission touche, pour regrouper une liste de soixante lignes.
 *
 * Une fiche déclare jusqu'à 120 permissions ; triées par sensibilité seulement, elles
 * forment deux blocs dont le second est illisible. Le lecteur, lui, cherche une question
 * précise : est-ce que cette application lit ma position, mes messages, ma santé ?
 *
 * L'ordre du tableau est l'ordre d'affichage, et il est aussi l'ordre d'intrusion : la
 * santé et la position d'abord, le compteur sur l'icône du lanceur en dernier. La première
 * règle qui correspond gagne, donc `android.permission.health.READ_STEPS` est de la santé
 * avant d'être un capteur.
 */
export type PermissionCategoryId =
    | "health" | "location" | "sensors" | "personal" | "files"
    | "identity" | "ads" | "notifications" | "device" | "badges" | "other";

export type PermissionCategoryMeta = {
    /** `high` : les groupes montrés en fiches détaillées. `low` : ceux qu'on plie par défaut. */
    tone: "high" | "medium" | "low";
    fr: { label: string; sub: string };
    en: { label: string; sub: string };
};

const CATEGORY_RULES: [PermissionCategoryId, RegExp][] = [
    ["health", /^android\.permission\.health\.|BODY_SENSORS|ACTIVITY_RECOGNITION/],
    ["location", /LOCATION|GPS/],
    ["sensors", /CAMERA|RECORD_AUDIO|MICROPHONE|CAPTURE_VIDEO|MEDIA_PROJECTION|DETECT_SCREEN|BODY_SENSOR/],
    ["personal", /CONTACTS|CALENDAR|_SMS|SMS_|CALL_PHONE|CALL_LOG|_CALLS|PHONE_CALL|READ_PROFILE|PROCESS_OUTGOING|VOICEMAIL/],
    ["files", /STORAGE|READ_MEDIA|DOCUMENTS|DOWNLOAD|MANAGE_EXTERNAL/],
    ["identity", /ACCOUNT|CREDENTIAL|BIOMETRIC|FINGERPRINT|USE_CREDENTIALS|AUTHENTICATE|PHONE_NUMBERS|READ_PHONE_STATE/],
    ["ads", /AD_ID|ADSERVICES|AD_SERVICES|INSTALL_REFERRER|preinstall|attribution/i],
    ["notifications", /NOTIFICATION|c2dm|C2D_MESSAGE|PUSH|MIPUSH|GCM/i],
    ["badges", /BADGE|launcher|SHORTCUT/i],
    ["device", /NETWORK|WIFI|BLUETOOTH|NFC|VIBRATE|WAKE_LOCK|BOOT_COMPLETED|FOREGROUND_SERVICE|ALARM|INTERNET|FLASHLIGHT|AUDIO_SETTINGS|PHONE_STATE|PHONE_NUMBER|BILLING|LICENSE|USER_INITIATED_JOBS|SETTINGS|PACKAGE|TASKS|SYNC|DYNAMIC_RECEIVER|GSERVICES|VENDING|BATTERY|POWER_SAVE|SYSTEM_ALERT|OVERLAY|SCHEDULE_EXACT/],
];

export const CATEGORY_ORDER: PermissionCategoryId[] = [
    "health", "location", "sensors", "personal", "files",
    "identity", "ads", "notifications", "device", "badges", "other",
];

export const CATEGORY_META: Record<PermissionCategoryId, PermissionCategoryMeta> = {
    health: {
        tone: "high",
        fr: { label: "Santé", sub: "Données de santé au sens de l'article 9 du RGPD, lues via Health Connect." },
        en: { label: "Health", sub: "Health data under GDPR article 9, read through Health Connect." },
    },
    location: {
        tone: "high",
        fr: { label: "Position", sub: "Où vous êtes, au quartier près ou au mètre près." },
        en: { label: "Location", sub: "Where you are, to the neighbourhood or to the metre." },
    },
    sensors: {
        tone: "high",
        fr: { label: "Micro, caméra et écran", sub: "Les capteurs qui enregistrent ce qui se passe autour de vous." },
        en: { label: "Microphone, camera and screen", sub: "The sensors that record what happens around you." },
    },
    personal: {
        tone: "high",
        fr: { label: "Contacts, agenda et appels", sub: "Vos proches, vos rendez-vous et vos communications." },
        en: { label: "Contacts, calendar and calls", sub: "Your circle, your appointments and your communications." },
    },
    files: {
        tone: "medium",
        fr: { label: "Fichiers et médias", sub: "Les photos, vidéos et documents stockés sur l'appareil." },
        en: { label: "Files and media", sub: "The photos, videos and documents stored on the device." },
    },
    identity: {
        tone: "medium",
        fr: { label: "Comptes et identité", sub: "Les comptes de l'appareil, la biométrie et les identifiants enregistrés." },
        en: { label: "Accounts and identity", sub: "Device accounts, biometrics and stored credentials." },
    },
    ads: {
        tone: "medium",
        fr: { label: "Publicité et attribution", sub: "Identifiant publicitaire, campagnes d'installation et mesure." },
        en: { label: "Advertising and attribution", sub: "Ad identifier, install campaigns and measurement." },
    },
    notifications: {
        tone: "low",
        fr: { label: "Notifications", sub: "Afficher des notifications et recevoir des messages push." },
        en: { label: "Notifications", sub: "Post notifications and receive push messages." },
    },
    device: {
        tone: "low",
        fr: { label: "Appareil et réseau", sub: "Connectivité, alarmes et fonctionnement courant de l'application." },
        en: { label: "Device and network", sub: "Connectivity, alarms and routine app operation." },
    },
    badges: {
        tone: "low",
        fr: { label: "Badges du lanceur", sub: "Le petit compteur sur l'icône, une permission par constructeur." },
        en: { label: "Launcher badges", sub: "The small counter on the icon, one permission per manufacturer." },
    },
    other: {
        tone: "low",
        fr: { label: "Autres", sub: "Permissions propriétaires ou trop rares pour former un groupe." },
        en: { label: "Other", sub: "Vendor-specific permissions, or too rare to form a group." },
    },
};

/** La catégorie d'une permission : la première règle qui correspond, `other` sinon. */
export function permissionCategory(full: string): PermissionCategoryId {
    const trouve = CATEGORY_RULES.find(([, motif]) => motif.test(full));
    return trouve ? trouve[0] : "other";
}
