// Communiqués de presse — source unique, bilingue (FR/EN).
// Pour AJOUTER un communiqué : copier un bloc ci-dessous, changer `slug` (unique,
// kebab-case) et remplir `fr` + `en`. Pour le proposer en PDF téléchargeable au lieu
// (ou en plus) de la lecture en ligne, déposer le fichier dans /public/press/ et
// renseigner `pdf` (ex. "/press/mon-communique.pdf"). Sans `pdf`, le bouton « PDF »
// imprime la page (window.print()).
//
// To ADD a release: copy a block, set a unique kebab-case `slug`, fill `fr` + `en`.
// Optional `pdf`: drop the file in /public/press/ and set the path; otherwise the
// detail page is printable to PDF.

export type PressBlock =
    | { type: "p"; text: string; lead?: boolean }
    | { type: "h2"; text: string }
    | { type: "quote"; text: string; cite: string }
    | { type: "stats"; items: { v: string; l: string }[] };

export interface PressReleaseContent {
    date: string;        // libellé affiché, ex. "12 juin 2026"
    loc: string;         // lieu, ex. "Paris"
    read: string;        // durée de lecture, ex. "4 min"
    title: string;
    summary: string;     // résumé court (carte liste)
    chapo: string;       // chapô (intro mise en avant)
    body: PressBlock[];  // body[0] reçoit la dateline "Lieu, le date —"
}

export interface PressRelease {
    slug: string;
    iso: string;         // date ISO pour tri / <time>
    pdf?: string;        // chemin PDF optionnel sous /public, ex. "/press/xxx.pdf"
    fr: PressReleaseContent;
    en: PressReleaseContent;
}

export const PRESS_RELEASES: PressRelease[] = [
    {
        slug: "bilan-134",
        iso: "2026-06-12",
        fr: {
            date: "12 juin 2026", loc: "Paris", read: "4 min",
            title: "Peu de fiches, mais tenues à jour : la méthode d'Unlock My Data",
            summary: "La plateforme citoyenne et open source fait le choix d'un nombre restreint de fiches services documentées en profondeur et maintenues à jour.",
            chapo: "Plutôt que de courir après le nombre, Unlock My Data fait le choix d'un ensemble restreint de services documentés en profondeur et tenus à jour dans le temps.",
            body: [
                { type: "p", lead: true, text: "Portée par l'association les e-novateurs, Unlock My Data s'est donné une mission simple à énoncer, exigeante à tenir : rendre lisibles les pratiques de données des services que nous utilisons chaque jour. Plutôt que de multiplier les fiches, la communauté concentre son énergie sur un ensemble restreint de services — chacun documentant traceurs, politique de confidentialité, localisation des données et fuites connues — avec une exigence : que l'information reste à jour." },
                { type: "p", text: "Chaque fiche s'appuie sur des sources indépendantes et vérifiables : Exodus Privacy pour les traceurs mobiles, Open Terms Archive pour l'historique des conditions d'utilisation, Have I Been Pwned et Bonjour la fuite pour les violations de données. Aucune donnée personnelle n'est collectée : les analyses tournent localement, dans le navigateur." },
                { type: "h2", text: "Une transparence portée par des bénévoles" },
                { type: "p", text: "Derrière ces chiffres, ce sont 38 contributeurs bénévoles — étudiants, experts RGPD, citoyens curieux — qui créent, mettent à jour et relisent les fiches. Le code et les données sont publiés sous licence libre sur GitHub, et n'importe qui peut soumettre une correction ou signaler une fuite documentée." },
                { type: "stats", items: [
                    { v: "134", l: "fiches services tenues à jour" },
                    { v: "231", l: "contributions citoyennes publiées" },
                    { v: "4", l: "sources indépendantes croisées" },
                ] },
                { type: "quote", text: "Nous ne demandons à personne de nous croire sur parole. Tout est sourcé, tout est ouvert, tout est vérifiable. C'est la seule façon d'être réellement digne de confiance sur un sujet aussi sensible que les données personnelles.", cite: "— Porte-parole de l'association les e-novateurs" },
                { type: "h2", text: "Toujours plus de permissions sensibles" },
                { type: "p", text: "L'analyse des applications mobiles suivies confirme une tendance qui ne s'inverse pas : la collecte ne faiblit pas. Sur 82 applications passées au crible, ce sont 1 773 permissions Android réclamées au total — soit près de 22 par application. Et plus d'une sur quatre est classée à haut risque : accès au micro, à la caméra, à la localisation précise, aux contacts ou aux messages." },
                { type: "stats", items: [
                    { v: "1 773", l: "permissions réclamées au total par les 82 applications analysées" },
                    { v: "29 %", l: "de ces permissions sont classées à haut risque" },
                    { v: "93 %", l: "des applications demandent au moins une permission sensible" },
                ] },
                { type: "p", text: "Dans le détail, une application réclame en moyenne 6 permissions à haut risque, et certaines dépassent largement ce seuil. Loin de se résorber, l'asymétrie entre les personnes et les services qui exploitent leurs données s'installe dans la durée — c'est précisément ce que documentent, service par service, les fiches d'Unlock My Data." },
                { type: "h2", text: "Un suivi dans la durée" },
                { type: "p", text: "La force du projet tient moins au nombre de fiches qu'à leur fraîcheur : chaque service suivi est réexaminé régulièrement, et toute évolution — nouvelle politique de confidentialité, fuite signalée, changement de traceurs — est répercutée sur la fiche. Un kit presse complet — logos, visuels et chiffres clés — est par ailleurs mis à disposition dans l'espace presse." },
                { type: "p", text: "La plateforme propose par ailleurs trois outils concrets pour passer à l'action : un catalogue pour analyser un service, un comparateur d'alternatives éthiques, et un générateur de demandes de suppression conformes au RGPD." },
            ],
        },
        en: {
            date: "12 June 2026", loc: "Paris", read: "4 min",
            title: "Few records, but kept up to date: the Unlock My Data method",
            summary: "The citizen-led, open-source platform chooses a deliberately small set of service records documented in depth and kept up to date.",
            chapo: "Rather than chasing numbers, Unlock My Data chooses a small set of services documented in depth and kept up to date over time.",
            body: [
                { type: "p", lead: true, text: "Run by the non-profit les e-novateurs, Unlock My Data set itself a mission simple to state but demanding to deliver: make the data practices of the services we use every day legible. Rather than multiplying records, the community focuses its energy on a small set of services — each documenting trackers, privacy policy, data location and known breaches — with one requirement: that the information stays current." },
                { type: "p", text: "Each record draws on independent and verifiable sources: Exodus Privacy for mobile trackers, Open Terms Archive for the history of terms of service, Have I Been Pwned and Bonjour la fuite for data breaches. No personal data is collected: the analyses run locally, in the browser." },
                { type: "h2", text: "Transparency driven by volunteers" },
                { type: "p", text: "Behind these figures are 38 volunteer contributors — students, GDPR experts, curious citizens — who create, update and review the records. The code and data are published under a free licence on GitHub, and anyone can submit a correction or report a documented breach." },
                { type: "stats", items: [
                    { v: "134", l: "service records kept up to date" },
                    { v: "231", l: "citizen contributions published" },
                    { v: "4", l: "independent sources cross-checked" },
                ] },
                { type: "quote", text: "We ask no one to take our word for it. Everything is sourced, everything is open, everything is verifiable. It is the only way to be truly trustworthy on a subject as sensitive as personal data.", cite: "— Spokesperson, les e-novateurs" },
                { type: "h2", text: "Ever more sensitive permissions" },
                { type: "p", text: "The analysis of the mobile apps we track confirms a trend that is not reversing: data collection is not slowing down. Across 82 apps scrutinised, 1,773 Android permissions are requested in total — nearly 22 per app. And more than one in four is classed as high-risk: access to the microphone, camera, precise location, contacts or messages." },
                { type: "stats", items: [
                    { v: "1,773", l: "permissions requested in total by the 82 apps analysed" },
                    { v: "29%", l: "of those permissions are classed as high-risk" },
                    { v: "93%", l: "of apps request at least one sensitive permission" },
                ] },
                { type: "p", text: "On average, an app requests 6 high-risk permissions, and some go well beyond that. Far from easing, the asymmetry between people and the services that exploit their data is settling in for the long term — that is exactly what Unlock My Data's records document, service by service." },
                { type: "h2", text: "Kept current over time" },
                { type: "p", text: "The project's strength lies less in the number of records than in their freshness: every service tracked is reviewed regularly, and any change — a new privacy policy, a reported breach, a shift in trackers — is reflected on the record. A full press kit — logos, visuals and key figures — is also available in the press room." },
                { type: "p", text: "The platform also offers three concrete tools to take action: a catalogue to analyse a service, a comparator of ethical alternatives, and a generator of GDPR-compliant deletion requests." },
            ],
        },
    },
    {
        slug: "digital-clean-up-day",
        iso: "2026-03-14",
        fr: {
            date: "14 mars 2026", loc: "Paris", read: "3 min",
            title: "Digital Clean Up Day : un outil gratuit pour alléger son empreinte numérique",
            summary: "Unlock My Data guide le grand public pour trier ses données en ligne sans supprimer ses comptes.",
            chapo: "À l'occasion du Digital Clean Up Day, Unlock My Data met en ligne un outil gratuit pour faire le tri dans ses mails, photos et fichiers cloud — une démarche d'écologie numérique accessible à tous, sans supprimer le moindre compte.",
            body: [
                { type: "p", lead: true, text: "Réduire son empreinte numérique sans renoncer à ses services : c'est la promesse du nouvel outil Digital Clean Up d'Unlock My Data, mis en ligne pour la journée mondiale du nettoyage numérique." },
                { type: "p", text: "Mails accumulés, doublons de photos, fichiers oubliés dans le cloud : chaque donnée stockée consomme de l'énergie. L'outil propose un parcours guidé, étape par étape, pour identifier et supprimer ce qui ne sert plus — un geste à la portée de tous, présenté comme une démarche d'écologie numérique plutôt que de privation." },
                { type: "quote", text: "On peut alléger son empreinte numérique sans tout supprimer. L'idée n'est pas de culpabiliser, mais de donner des gestes simples et utiles au quotidien.", cite: "— Jérémy Pastouret, développeur de l'outil" },
                { type: "p", text: "Comme l'ensemble de la plateforme, l'outil est gratuit, open source et ne collecte aucune donnée. Il s'adresse autant aux particuliers qu'aux structures qui animent des ateliers de sensibilisation." },
            ],
        },
        en: {
            date: "14 March 2026", loc: "Paris", read: "3 min",
            title: "Digital Clean Up Day: a free tool to lighten your digital footprint",
            summary: "Unlock My Data guides the public to sort their online data without deleting accounts.",
            chapo: "For Digital Clean Up Day, Unlock My Data releases a free tool to sort through emails, photos and cloud files — a digital-ecology approach open to everyone, without deleting a single account.",
            body: [
                { type: "p", lead: true, text: "Reducing your digital footprint without giving up your services: that is the promise of Unlock My Data's new Digital Clean Up tool, released for the world digital clean-up day." },
                { type: "p", text: "Piled-up emails, duplicate photos, files forgotten in the cloud: every stored item consumes energy. The tool offers a step-by-step guided journey to identify and delete what is no longer useful — a move within everyone's reach, framed as digital ecology rather than deprivation." },
                { type: "quote", text: "You can lighten your digital footprint without deleting everything. The point is not to make people feel guilty, but to offer simple, useful everyday actions.", cite: "— The Digital Clean Up team" },
                { type: "p", text: "Like the whole platform, the tool is free, open source and collects no data. It is aimed at individuals as much as at organisations running awareness workshops." },
            ],
        },
    },
    {
        slug: "missions",
        iso: "2026-01-23",
        fr: {
            date: "23 janvier 2026", loc: "Paris", read: "3 min",
            title: "Unlock My Data lance les « missions » pour analyser les services prioritaires",
            summary: "Applications de rencontre, santé, administrations : la communauté cible les services les plus sensibles.",
            chapo: "Unlock My Data structure son travail collaboratif autour de « missions » thématiques pour orienter l'énergie des bénévoles vers les services qui manipulent les données les plus sensibles.",
            body: [
                { type: "p", lead: true, text: "Quels services analyser en priorité ? Pour répondre à cette question, Unlock My Data lance les « missions » : des campagnes thématiques qui mobilisent la communauté autour des secteurs où la confidentialité est la plus critique." },
                { type: "p", text: "Applications de rencontre, services de santé, démarches administratives : ces catégories concentrent des données particulièrement sensibles. Chaque mission rassemble les fiches à créer ou à mettre à jour, et permet aux contributeurs de s'engager sur un périmètre clair." },
                { type: "quote", text: "Plutôt que d'analyser au hasard, nous concentrons nos efforts là où l'enjeu est le plus fort pour les utilisateurs.", cite: "— L'équipe contribution" },
                { type: "p", text: "Les missions sont ouvertes à tous : aucune compétence technique n'est requise pour relire une fiche ou vérifier une source. La plateforme accompagne chaque nouveau contributeur pas à pas." },
            ],
        },
        en: {
            date: "23 January 2026", loc: "Paris", read: "3 min",
            title: "Unlock My Data launches “missions” to analyse priority services",
            summary: "Dating, health and government apps: the community targets the most sensitive services.",
            chapo: "Unlock My Data structures its collaborative work around thematic “missions” to steer volunteers' energy towards the services that handle the most sensitive data.",
            body: [
                { type: "p", lead: true, text: "Which services should be analysed first? To answer that question, Unlock My Data launches “missions”: thematic campaigns that rally the community around the sectors where privacy matters most." },
                { type: "p", text: "Dating apps, health services, administrative procedures: these categories concentrate particularly sensitive data. Each mission gathers the records to create or update, and lets contributors commit to a clear scope." },
                { type: "quote", text: "Rather than analysing at random, we focus our efforts where the stakes are highest for users.", cite: "— The contribution team" },
                { type: "p", text: "Missions are open to all: no technical skill is required to review a record or check a source. The platform guides every new contributor step by step." },
            ],
        },
    },
];

export function getRelease(slug: string): PressRelease | undefined {
    return PRESS_RELEASES.find((r) => r.slug === slug);
}
