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
        slug: "refonte-design",
        iso: "2026-06-23",
        fr: {
            date: "23 juin 2026", loc: "Paris", read: "4 min",
            title: "Unlock My Data fait peau neuve : une lecture à deux niveaux, du débutant à l'expert",
            summary: "La plateforme citoyenne et open source dévoile une refonte complète de son interface, pensée pour deux niveaux de lecture et une compréhension immédiate des enjeux de données.",
            chapo: "Avec sa nouvelle interface, Unlock My Data retravaille chacune de ses fonctionnalités autour d'un principe : que l'on découvre le sujet ou qu'on le maîtrise, chacun doit comprendre, à son rythme, ce que les services font de ses données.",
            body: [
                { type: "p", lead: true, text: "Portée par l'association les e-novateurs, Unlock My Data s'est donné une mission simple à énoncer, exigeante à tenir : rendre lisibles les pratiques de données des services que nous utilisons chaque jour. La nouvelle version de la plateforme franchit une étape sur ce terrain — non pas en ajoutant des fiches, mais en rendant l'information accessible à tous les publics, du curieux qui débute au professionnel du RGPD." },
                { type: "p", text: "Le constat était clair : la transparence ne sert à rien si elle reste illisible. Traceurs, politiques de confidentialité, permissions Android, scores de confidentialité — autant de notions précieuses, mais intimidantes pour qui n'est pas du métier. La refonte répond à ce problème de fond." },
                { type: "h2", text: "Deux niveaux de lecture sur chaque fiche" },
                { type: "p", text: "C'est le cœur de cette refonte : chaque fiche propose désormais deux niveaux de lecture. Un premier niveau « essentiel » résume en quelques phrases claires ce qu'il faut retenir — ce que le service collecte, les risques principaux, les alternatives plus respectueuses. Un second niveau « détaillé » déplie l'ensemble des sources, des permissions et de l'historique pour celles et ceux qui veulent vérifier, comparer et approfondir." },
                { type: "p", text: "Concrètement, un utilisateur débutant obtient une réponse immédiate à la question « est-ce que ce service respecte mes données ? », sans jargon. Un utilisateur expérimenté accède d'un clic aux données brutes, aux traceurs identifiés et aux références indépendantes qui fondent chaque analyse." },
                { type: "quote", text: "La transparence n'a de valeur que si elle est comprise. Nous voulions que la même fiche parle à un lycéen comme à un délégué à la protection des données. C'est tout le sens de cette refonte.", cite: "— Porte-parole de l'association les e-novateurs" },
                { type: "h2", text: "Des fonctionnalités retravaillées pour comprendre, pas seulement consulter" },
                { type: "p", text: "Au-delà des fiches, les trois outils de la plateforme ont été repensés dans le même esprit : un catalogue pour analyser un service, un comparateur d'alternatives éthiques, et un générateur de demandes de suppression conformes au RGPD. Chacun guide désormais l'utilisateur pas à pas, avec des explications contextuelles, tout en laissant les utilisateurs avancés aller droit au but." },
                { type: "stats", items: [
                    { v: "2", l: "niveaux de lecture sur chaque fiche service" },
                    { v: "3", l: "outils repensés pour passer à l'action" },
                    { v: "4", l: "sources indépendantes croisées" },
                ] },
                { type: "p", text: "Les outils automatisés posent les fondations — Exodus Privacy pour les traceurs mobiles, Open Terms Archive pour l'historique des conditions d'utilisation, Have I Been Pwned et Bonjour la fuite pour les violations de données. Mais l'essentiel du travail reste humain : ce sont les bénévoles qui prennent le temps de remplir les fiches, de lire en détail les politiques de confidentialité, aller au bout de la démarche et proposer de meilleures alternatives. Aucune donnée personnelle n'est collectée : les analyses tournent localement, dans le navigateur." },
                { type: "h2", text: "Une transparence toujours portée par des bénévoles" },
                { type: "p", text: "Derrière cette refonte, ce sont 38 contributeurs bénévoles — étudiants, experts RGPD, citoyens curieux — qui créent, mettent à jour et relisent les fiches. Le code et les données restent publiés sous licence libre sur GitHub, et n'importe qui peut soumettre une correction ou signaler une fuite documentée. Un kit presse complet — logos, visuels et chiffres clés — est mis à disposition dans l'espace presse." },
            ],
        },
        en: {
            date: "23 June 2026", loc: "Paris", read: "4 min",
            title: "Unlock My Data gets a redesign: two reading levels, from beginner to expert",
            summary: "The citizen-led, open-source platform unveils a complete redesign of its interface, built around two reading levels and an instant understanding of data stakes.",
            chapo: "With its new interface, Unlock My Data reworks every feature around one principle: whether you are discovering the subject or you master it, everyone should understand, at their own pace, what services do with their data.",
            body: [
                { type: "p", lead: true, text: "Run by the non-profit les e-novateurs, Unlock My Data set itself a mission simple to state but demanding to deliver: make the data practices of the services we use every day legible. The new version of the platform takes a step forward on that front — not by adding records, but by making the information accessible to every audience, from the curious newcomer to the GDPR professional." },
                { type: "p", text: "The diagnosis was clear: transparency is worthless if it stays unreadable. Trackers, privacy policies, Android permissions, privacy scores — all valuable notions, but intimidating to anyone outside the field. The redesign tackles that core problem." },
                { type: "h2", text: "Two reading levels on every record" },
                { type: "p", text: "This is the heart of the redesign: every service record now offers two reading levels. An \"essentials\" level sums up in a few clear sentences what matters most — what the service collects, the main risks, the more respectful alternatives. A \"detailed\" level unfolds all the sources, permissions and history for those who want to verify, compare and dig deeper." },
                { type: "p", text: "In practice, a beginner gets an immediate answer to the question \"does this service respect my data?\", with no jargon. An experienced user reaches the raw data, the identified trackers and the independent references behind each analysis in a single click." },
                { type: "quote", text: "Transparency only has value if it is understood. We wanted the same record to speak to a high-school student and to a data protection officer alike. That is the whole point of this redesign.", cite: "— Spokesperson, les e-novateurs" },
                { type: "h2", text: "Features reworked to understand, not just to browse" },
                { type: "p", text: "Beyond the records, the platform's three tools have been rethought in the same spirit: a catalogue to analyse a service, a comparator of ethical alternatives, and a generator of GDPR-compliant deletion requests. Each now guides the user step by step, with contextual explanations, while letting advanced users get straight to the point." },
                { type: "stats", items: [
                    { v: "2", l: "reading levels on every service record" },
                    { v: "3", l: "tools rethought to take action" },
                    { v: "4", l: "independent sources cross-checked" },
                ] },
                { type: "p", text: "Automated tools lay the foundations — Exodus Privacy for mobile trackers, Open Terms Archive for the history of terms of service, Have I Been Pwned and Bonjour la fuite for data breaches. But most of the work stays human: it is the volunteers who take the time to fill in the records, read privacy policies in detail, see the process through and offer better alternatives. No personal data is collected: the analyses run locally, in the browser." },
                { type: "h2", text: "Transparency still driven by volunteers" },
                { type: "p", text: "Behind this redesign are 38 volunteer contributors — students, GDPR experts, curious citizens — who create, update and review the records. The code and data remain published under a free licence on GitHub, and anyone can submit a correction or report a documented breach. A full press kit — logos, visuals and key figures — is available in the press room." },
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
