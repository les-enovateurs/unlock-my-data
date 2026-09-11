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
    const last = full.split(".").pop() || full;
    return /^[A-Z0-9_]+$/.test(last) ? last : full;
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
];

/**
 * Le libellé le plus lisible dont on dispose, dans cet ordre : le catalogue Exodus, notre
 * complément par clé exacte, notre complément par suffixe, puis le nom technique. Jamais
 * de traduction inventée à la volée.
 */
export function permissionLabel(
    full: string,
    catalogLabel: string | undefined,
    lang: string,
): string {
    if (catalogLabel) return ucfirst(catalogLabel);
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
