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
        slug: "secteurs-etat-ia-rencontre",
        iso: "2026-09-15",
        fr: {
            date: "15 septembre 2026", loc: "Paris", read: "6 min",
            title: "Rencontre, IA, service public : la même mesure, trois mondes",
            summary: "Unlock My Data ventile sa mesure de 131 applications Android par secteur d'usage : les applications de rencontre portent huit pisteurs en médiane, celles de l'État un et demi, et aucune messagerie grand public n'en porte plus de cinq.",
            chapo: "Un chiffre de catalogue ne dit rien tant qu'on ne sait pas à quoi le comparer. Ventilée par secteur, la mesure de 131 applications Android sépare nettement trois mondes : la rencontre, où aucune application analysée ne se passe de pisteurs ; l'État, plus sobre que la moyenne mais inégal ; et l'IA générative, où l'écart entre deux assistants se compte en permissions, pas en pisteurs.",
            body: [
                { type: "p", lead: true, text: "Les secteurs utilisés ici ne sont pas inventés pour l'occasion : ce sont les « missions » du site, tenues à la main par l'équipe et déjà publiques. Chaque secteur porte sa couverture — combien d'applications le composent, combien ont été mesurées — et cette fraction se lit avant les médianes. Un secteur dont deux applications sur dix-sept sont analysées n'est pas résumé du tout." },
                { type: "h2", text: "Service public : le meilleur et le plus discutable, côte à côte" },
                { type: "p", text: "Six applications de l'État ont été mesurées sur les seize que suit le site. Leur médiane est de 52 Mo et 17,5 permissions, contre 108 Mo et 33 permissions pour le catalogue entier : l'État demande deux fois moins que la moyenne des applications grand public, et pèse deux fois moins lourd." },
                { type: "p", text: "Trois d'entre elles ne portent aucun pisteur. France Identité, l'application qui lit la carte d'identité, tient en 31 Mo et déclare huit permissions — réseau, caméra, NFC, biométrie — et rien d'autre. Compte ameli pèse 16 Mo, impots.gouv 63 Mo : zéro pisteur l'une comme l'autre. La démonstration est faite qu'un service public numérique peut fonctionner sans brique de mesure tierce." },
                { type: "p", text: "Les trois autres contredisent cette démonstration. Mon espace santé, l'application de l'Assurance maladie, embarque quatre pisteurs — Google Firebase Analytics, Google CrashLytics, ATInternet, TagCommander (Commanders Act.) — sur un service qui porte le dossier médical. France Travail en compte trois, pour 183 Mo dont 88 % de bibliothèques natives. L'Identité Numérique de La Poste, trois également. Le même État, les mêmes obligations, deux choix opposés à trois ans d'intervalle." },
                { type: "h2", text: "IA générative : le pistage ne sépare pas, les permissions si" },
                { type: "p", text: "Six assistants sur les douze suivis ont une mesure. Du côté des pisteurs, l'écart est étroit : ChatGPT, Claude, Copilot et Perplexity en portent trois chacun — le trio analytique habituel — et Mistral un seul. Du côté des permissions, l'écart est large : ChatGPT en déclare 31, Copilot 37, Mistral 39, Perplexity 43, et Claude 67, dont 41 permissions de santé ouvertes via Health Connect." },
                { type: "p", text: "Ce dernier chiffre vient du catalogue Exodus Privacy et non de notre propre analyse : aucun binaire de Claude n'a pu être téléchargé, la source ne le sert pas. Il demande donc confirmation avant d'être opposé à qui que ce soit — et il est publié avec cette réserve plutôt que passé sous silence." },
                { type: "p", text: "Gemini échappe à la comparaison pour une raison qui mérite d'être dite : les cinq binaires obtenus pèsent 5 Mo et déclarent trois permissions. C'est une coquille de lancement, l'assistant vivant dans l'application Google. Le classer « IA la plus sobre du catalogue » aurait été l'inverse du fait." },
                { type: "h2", text: "Rencontre : le secteur où le zéro n'existe pas" },
                { type: "p", text: "Neuf applications de rencontre mesurées sur seize, et pas une seule sans pisteur. La médiane du secteur est de huit, deux fois celle du catalogue. Grindr en porte 21, le maximum de tout le corpus, sur une application qui déduit l'orientation sexuelle de son seul usage ; Badoo 16, Bumble et Tinder 8. Le site classait déjà ce secteur en priorité haute sur un raisonnement ; la mesure le confirme sur des chiffres." },
                { type: "h2", text: "Messagerie : peu de pisteurs, beaucoup de permissions" },
                { type: "p", text: "Le secteur inverse exactement le précédent : cinq messageries sur dix n'embarquent aucun pisteur — Signal, Telegram, WhatsApp, Gmail et Zoom — et la médiane du secteur tombe à 0,5. Mais c'est aussi le secteur qui demande le plus de permissions, 69 en médiane contre 33 pour le catalogue : WhatsApp en déclare 83, WeChat 96, Signal 74. Rien d'anormal en soi — une messagerie touche aux contacts, au micro, à la caméra, aux appels — mais cela rappelle que deux mesures indépendantes ne se résument pas en une note unique." },
                { type: "stats", items: [
                    { v: "8", l: "pisteurs en médiane dans les applications de rencontre" },
                    { v: "1,5", l: "pisteurs en médiane dans les applications de l'État" },
                    { v: "3", l: "applications publiques sans aucun pisteur" },
                    { v: "6/16", l: "applications de l'État effectivement mesurées" },
                ] },
                { type: "h2", text: "Santé : deux santés, pas une" },
                { type: "p", text: "Onze applications de santé sur treize sont mesurées, et le secteur se coupe en deux. D'un côté le suivi d'activité et la prise de rendez-vous commerciale : MyFitnessPal porte 16 pisteurs, Qare 10, Strava 8. De l'autre le soin et le service public : Doctolib 3, Compte ameli 0, Inovie Labosud 0. La donnée traitée est de même nature ; le modèle économique, non." },
                { type: "quote", text: "Trois applications de l'État tournent sans aucun pisteur. Cela retire l'argument technique à celles qui en portent : si l'impôt et l'assurance maladie y arrivent, la question posée aux autres n'est plus « est-ce possible » mais « pourquoi ».", cite: "— Porte-parole de l'association les e-novateurs" },
                { type: "h2", text: "Ce que cette ventilation ne dit pas" },
                { type: "p", text: "La couverture reste partielle et c'est la limite principale : six applications de l'État sur seize, six assistants sur douze, une seule application de sport sur dix-sept. Les médianes publiées ici décrivent les applications mesurées, pas les secteurs entiers, et chaque fichier de données porte cette fraction à côté de chaque chiffre. Par ailleurs une permission déclarée n'est pas une donnée collectée, et un pisteur détecté dans un binaire n'est pas la preuve d'une transmission observée : l'analyse est statique." },
                { type: "p", text: "Les deux jeux de données de cette ventilation sont publiés avec le communiqué, dans `public/data/study` : les médianes par secteur, et le détail application par application avec son secteur. Chaque fichier porte son empreinte SHA-256 dans un manifeste, et les chiffres se recalculent sans nous." },
            ],
        },
        en: {
            date: "15 September 2026", loc: "Paris", read: "6 min",
            title: "Dating, AI, public service: one measurement, three worlds",
            summary: "Unlock My Data breaks its measurement of 131 Android apps down by sector: dating apps carry eight trackers at the median, state apps one and a half, and no mainstream messaging app carries more than five.",
            chapo: "A catalogue-wide figure says nothing until you know what to compare it with. Broken down by sector, the measurement of 131 Android apps separates three worlds: dating, where not one analysed app does without trackers; the state, leaner than average but uneven; and generative AI, where the gap between two assistants is counted in permissions, not trackers.",
            body: [
                { type: "p", lead: true, text: "The sectors used here were not invented for the occasion: they are the site's “missions”, curated by the team and already public. Each sector carries its coverage — how many apps make it up, how many were measured — and that fraction is read before the medians. A sector with two apps measured out of seventeen is not summarised at all." },
                { type: "h2", text: "Public service: the best and the most questionable, side by side" },
                { type: "p", text: "Six state apps were measured out of the sixteen the site tracks. Their median is 52 MB and 17.5 permissions, against 108 MB and 33 permissions for the whole catalogue: the state asks for half as much as the average consumer app, and weighs half as much." },
                { type: "p", text: "Three of them carry no tracker at all. France Identité, the app that reads the national ID card, fits in 31 MB and declares eight permissions — network, camera, NFC, biometrics — and nothing else. Compte ameli weighs 16 MB, impots.gouv 63 MB: zero trackers, both. The proof is made that a digital public service can run without third-party measurement bricks." },
                { type: "p", text: "The other three contradict that proof. Mon espace santé, the health insurance app, embeds four trackers — Google Firebase Analytics, Google CrashLytics, ATInternet, TagCommander (Commanders Act.) — in a service that carries medical records. France Travail carries three, for 183 MB of which 88 % is native libraries. La Poste's L'Identité Numérique, three as well. The same state, the same obligations, two opposite choices three years apart." },
                { type: "h2", text: "Generative AI: tracking does not separate them, permissions do" },
                { type: "p", text: "Six assistants out of the twelve tracked have a measurement. On trackers the gap is narrow: ChatGPT, Claude, Copilot and Perplexity carry three each — the usual analytics trio — and Mistral a single one. On permissions the gap is wide: ChatGPT declares 31, Copilot 37, Mistral 39, Perplexity 43, and Claude 67, including 41 health permissions opened through Health Connect." },
                { type: "p", text: "That last figure comes from the Exodus Privacy catalogue, not from our own analysis: no Claude binary could be downloaded, the source does not serve it. It therefore needs confirmation before being held up against anyone — and it is published with that caveat rather than left out." },
                { type: "p", text: "Gemini escapes comparison for a reason worth stating: the five binaries obtained weigh 5 MB and declare three permissions. It is a launcher shell, the assistant living inside the Google app. Ranking it “the leanest AI in the catalogue” would have been the opposite of the fact." },
                { type: "h2", text: "Dating: the sector where zero does not exist" },
                { type: "p", text: "Nine dating apps measured out of sixteen, and not one without trackers. The sector median is eight, twice the catalogue's. Grindr carries 21, the highest in the entire corpus, in an app whose very use reveals sexual orientation; Badoo 16, Bumble and Tinder 8. The site already ranked this sector high priority on reasoning; the measurement confirms it with numbers." },
                { type: "h2", text: "Messaging: few trackers, many permissions" },
                { type: "p", text: "This sector inverts the previous one exactly: five messaging apps out of ten embed no tracker — Signal, Telegram, WhatsApp, Gmail and Zoom — and the sector median falls to 0.5. But it is also the sector asking for the most permissions, 69 at the median against 33 for the catalogue: WhatsApp declares 83, WeChat 96, Signal 74. Nothing abnormal in itself — a messaging app touches contacts, microphone, camera and calls — but it is a reminder that two independent measurements do not collapse into a single score." },
                { type: "stats", items: [
                    { v: "8", l: "median trackers in dating apps" },
                    { v: "1.5", l: "median trackers in state apps" },
                    { v: "3", l: "public apps with no tracker at all" },
                    { v: "6/16", l: "state apps actually measured" },
                ] },
                { type: "h2", text: "Health: two health sectors, not one" },
                { type: "p", text: "Eleven health apps out of thirteen are measured, and the sector splits in two. On one side activity tracking and commercial booking: MyFitnessPal carries 16 trackers, Qare 10, Strava 8. On the other side care and public service: Doctolib 3, Compte ameli 0, Inovie Labosud 0. The data handled is of the same nature; the business model is not." },
                { type: "quote", text: "Three state apps run without a single tracker. That removes the technical argument from those that carry them: if the tax office and health insurance manage it, the question for the others is no longer “is it possible” but “why”.", cite: "— Spokesperson for les e-novateurs" },
                { type: "h2", text: "What this breakdown does not say" },
                { type: "p", text: "Coverage remains partial and that is the main limit: six state apps out of sixteen, six assistants out of twelve, a single sports app out of seventeen. The medians published here describe the apps measured, not whole sectors, and every data file carries that fraction next to every figure. A declared permission is also not collected data, and a tracker found in a binary is not proof of an observed transmission: the analysis is static." },
                { type: "p", text: "Both datasets behind this breakdown are published with the release, under `public/data/study`: the per-sector medians, and the app-by-app detail with its sector. Each file carries its SHA-256 digest in a manifest, and the figures can be recomputed without us." },
            ],
        },
    },
    {
        slug: "poids-permissions-pisteurs-android",
        iso: "2026-09-15",
        fr: {
            date: "15 septembre 2026", loc: "Paris", read: "5 min",
            title: "131 applications Android mesurées : 108 Mo en médiane, 34 permissions, et un pistage que le poids ne prédit pas",
            summary: "Unlock My Data publie sa propre analyse statique des applications de son catalogue — poids du binaire, permissions par catégorie, pisteurs — et les données brutes qui permettent de refaire les calculs.",
            chapo: "Aucune source publique ne dit ce que pèse une application Android, ce que ce poids contient, ni comment il évolue. Unlock My Data a téléchargé et mesuré 131 applications de son catalogue : la médiane atteint 108 Mo, la moitié des séries mesurées a grossi de 30 % en quelques versions, et le nombre de pisteurs n'a rien à voir avec la taille du binaire.",
            body: [
                { type: "p", lead: true, text: "Exodus Privacy publie les permissions et les pisteurs d'une application. Personne ne publie son poids, la part de code natif qu'elle embarque, le nombre d'architectures processeur qu'elle livre ni le nombre de méthodes qu'elle déclare. Ces chiffres-là, Unlock My Data les mesure désormais elle-même, en téléchargeant l'APK distribué et en l'ouvrant : 131 applications du catalogue, 838 relevés, dont 120 applications pesées sur la version la plus récente que nous ayons obtenue." },
                { type: "h2", text: "109 mégaoctets en médiane, et ça monte" },
                { type: "p", text: "La médiane du corpus s'établit à 108 Mo. Un dixième des applications reste sous 34 Mo, un autre dixième dépasse 195 Mo, neuf franchissent les 200 Mo — Revolut culmine à 326 Mo, WeChat à 299, Google Maps à 276. Mises bout à bout, les 120 applications pesées représentent 13,4 Go à télécharger et à stocker." },
                { type: "p", text: "L'évolution se mesure sur 87 séries d'au moins deux versions, comparables entre elles. La moitié a grossi d'au moins 30 %, 71 % ont grossi tout court, et la version médiane ajoute 5,3 Mo à la précédente. Quelques trajectoires sortent du lot : Duolingo passe de 34,9 à 174,5 Mo entre les versions 5.65 et 6.96, La Poste de 51 à 193 Mo, Mon E.Leclerc de 44 à 177 Mo. L'inverse existe aussi, et mérite d'être dit : Twitch a perdu 56 % de son poids, Slack 48 %." },
                { type: "p", text: "Une précaution est intégrée au calcul plutôt qu'écrite en note : les miroirs d'applications servent tantôt un paquet pour une seule architecture processeur, tantôt une archive qui en porte quatre. Entre les deux, le poids double sans qu'une ligne de code ait changé. Les 31 séries concernées sont écartées des moyennes, et sur les fiches, un segment en pointillé marque l'endroit où la comparaison s'arrête." },
                { type: "h2", text: "Ce poids n'est pas, pour l'essentiel, le code de l'application" },
                { type: "p", text: "Dans une application médiane, le code applicatif compilé représente 37 % du binaire, les bibliothèques natives 22 %, les ressources 16 % et les fichiers embarqués 4 %. Certaines applications inversent complètement ce rapport : l'application France Travail pèse 182 Mo dont 160 de bibliothèques natives, soit 88 % d'un binaire qui n'est pas son propre code. Firefox en porte 149 Mo — son moteur de rendu — et YouTube 136." },
                { type: "h2", text: "Trente-quatre permissions en médiane, dont une part pour la plomberie" },
                { type: "p", text: "Les 131 applications qui déclarent des permissions en demandent 33 en médiane, jusqu'à 96 pour WeChat, 92 pour Facebook et 85 pour Messenger. Rangées dans les mêmes catégories que celles affichées sur nos fiches, ces 4 777 déclarations racontent une histoire moins spectaculaire qu'il n'y paraît : 36 % concernent le fonctionnement courant — réseau, notifications, réveil de l'appareil — et 10 % ne servent qu'à afficher le petit compteur sur l'icône du lanceur, une permission par constructeur de téléphone, dans 35 % des applications." },
                { type: "p", text: "Les permissions véritablement sensibles — santé, position, micro et caméra, contacts et appels — pèsent 17 % du total. La santé reste rare, 7 % des applications, mais concentrée : l'application de suivi de cycle menstruel Flo Health déclare à elle seule 27 permissions de santé. Une permission déclarée n'est pas une donnée collectée, et c'est la limite de l'exercice : elle dit ce qu'une application s'autorise à demander, pas ce qu'elle obtient." },
                { type: "h2", text: "Le poids ne dit rien du pistage" },
                { type: "p", text: "C'est le résultat le plus net de l'étude, et il tient en deux coefficients. La corrélation entre le poids d'une application et son nombre de permissions est nette (rho de Spearman 0,55) : une grosse application fait plus de choses, donc demande plus. Celle entre le poids et le nombre de pisteurs est nulle (0,05). Une application légère peut être truffée de pisteurs, une application de 300 Mo peut n'en porter aucun." },
                { type: "p", text: "Le corpus compte 4 pisteurs en médiane, 21 au maximum chez Grindr, 20 chez Vinted, 18 chez BlaBlaCar — et 18 applications n'en portent aucun. Deux briques dominent le paysage : Google Firebase Analytics est présent dans 63 % des applications du catalogue et Google CrashLytics dans 48 %, loin devant Facebook Login (27 %) et AppsFlyer (25 %)." },
                { type: "stats", items: [
                    { v: "131", l: "applications Android mesurées" },
                    { v: "108 Mo", l: "poids médian d'une application" },
                    { v: "+30 %", l: "croissance médiane entre versions mesurées" },
                    { v: "0,05", l: "corrélation entre poids et nombre de pisteurs" },
                ] },
                { type: "h2", text: "Ce que les catalogues de pisteurs ne nomment pas encore" },
                { type: "p", text: "L'analyse relève aussi, dans les binaires, des bibliothèques tierces qu'aucun catalogue de pisteurs ne nomme. 2 618 candidats ont été examinés, 542 écartés après relecture, et 2 076 restent en attente, répartis sur 379 éditeurs ; 1 146 sont corrélés à un nom de domaine trouvé dans le même binaire. Aucun n'apparaît sur une fiche : un candidat n'est pas un pisteur tant qu'un humain ne l'a pas qualifié, et beaucoup se révéleront être des bibliothèques techniques sans collecte propre." },
                { type: "p", text: "La démarche a déjà produit un résultat concret pour l'écosystème : deux SDK bien connus, Braze et Vungle, échappaient à leur propre signature de catalogue depuis qu'ils avaient changé de nom de paquet. Un outil conçu pour trouver des pisteurs inconnus a trouvé des pisteurs connus devenus invisibles — dans trois applications du catalogue chacun." },
                { type: "quote", text: "Nous ne publions pas un classement, nous publions une mesure et ses réserves. Le poids d'une application n'est pas un scandale en soi : c'est un chiffre qu'aucun acteur ne donnait, et qu'un citoyen peut désormais opposer.", cite: "— Porte-parole de l'association les e-novateurs" },
                { type: "h2", text: "Tout est vérifiable" },
                { type: "p", text: "Les données d'entrée de cette étude sont publiées avec elle, dans `public/data/study` : le poids, les permissions et les pisteurs de chaque application, l'évolution du poids version par version, la ventilation des permissions par catégorie et la liste des éditeurs de SDK non catalogués. Chaque fichier porte son empreinte SHA-256 dans un manifeste. Sur les fiches du catalogue, deux graphiques rendent ces mesures lisibles : l'histoire du poids version après version, et la décomposition du binaire de la dernière version analysée. Aucune donnée personnelle n'est collectée ; les analyses tournent sur des binaires publics." },
            ],
        },
        en: {
            date: "15 September 2026", loc: "Paris", read: "5 min",
            title: "131 Android apps measured: 108 MB median, 34 permissions, and tracking that size does not predict",
            summary: "Unlock My Data publishes its own static analysis of the apps in its catalogue — binary size, permissions by category, trackers — along with the raw data needed to redo the calculations.",
            chapo: "No public source tells you what an Android app weighs, what that weight contains, or how it grows. Unlock My Data downloaded and measured 131 apps from its catalogue: the median reaches 108 MB, half of the measured series grew by 30 % over a few versions, and the number of trackers has nothing to do with binary size.",
            body: [
                { type: "p", lead: true, text: "Exodus Privacy publishes an app's permissions and trackers. Nobody publishes its size, the share of native code it ships, the number of processor architectures it delivers or the number of methods it declares. Unlock My Data now measures those numbers itself, by downloading the distributed APK and opening it: 131 apps from the catalogue, 838 readings, including 120 apps weighed on the most recent version we could obtain." },
                { type: "h2", text: "109 megabytes median, and rising" },
                { type: "p", text: "The corpus median stands at 108 MB. A tenth of the apps stay under 34 MB, another tenth exceed 195 MB, nine cross 200 MB — Revolut peaks at 326 MB, WeChat at 299, Google Maps at 276. Put end to end, the 120 weighed apps represent 13.4 GB to download and store." },
                { type: "p", text: "Growth is measured on 87 series of at least two comparable versions. Half grew by at least 30 %, 71 % grew at all, and the median version adds 5.3 MB to the previous one. A few trajectories stand out: Duolingo goes from 34.9 to 174.5 MB between versions 5.65 and 6.96, La Poste from 51 to 193 MB, Mon E.Leclerc from 44 to 177 MB. The opposite exists too, and deserves saying: Twitch shed 56 % of its size, Slack 48 %." },
                { type: "p", text: "One precaution is built into the calculation rather than written as a footnote: app mirrors sometimes serve a package for a single processor architecture, sometimes an archive carrying four. Between the two, size doubles without a single line of code changing. The 31 series concerned are excluded from the averages, and on the fiches a dotted segment marks where the comparison stops." },
                { type: "h2", text: "That size is mostly not the app's own code" },
                { type: "p", text: "In a median app, compiled application code accounts for 37 % of the binary, native libraries 22 %, resources 16 % and bundled files 4 %. Some apps invert that ratio entirely: the France Travail app weighs 182 MB, 160 of which are native libraries — 88 % of a binary that is not its own code. Firefox carries 149 MB of it, its rendering engine, and YouTube 136." },
                { type: "h2", text: "Thirty-four permissions median, part of it plumbing" },
                { type: "p", text: "The 131 apps that declare permissions ask for 33 at the median, up to 96 for WeChat, 92 for Facebook and 85 for Messenger. Sorted into the same categories shown on our fiches, those 4,777 declarations tell a less spectacular story than it seems: 36 % cover routine operation — network, notifications, waking the device — and 10 % only exist to draw the small counter on the launcher icon, one permission per phone manufacturer, in 35 % of the apps." },
                { type: "p", text: "Genuinely sensitive permissions — health, location, microphone and camera, contacts and calls — account for 17 % of the total. Health stays rare, 7 % of apps, but concentrated: the menstrual cycle tracking app Flo Health alone declares 27 health permissions. A declared permission is not collected data, and that is the limit of the exercise: it says what an app allows itself to ask for, not what it obtains." },
                { type: "h2", text: "Size says nothing about tracking" },
                { type: "p", text: "This is the study's sharpest result, and it fits in two coefficients. The correlation between an app's size and its number of permissions is clear (Spearman's rho 0.55): a bigger app does more, so it asks for more. The one between size and number of trackers is nil (0.05). A lightweight app can be packed with trackers; a 300 MB app can carry none." },
                { type: "p", text: "The corpus counts 4 trackers at the median, 21 at most in Grindr, 20 in Vinted, 18 in BlaBlaCar — and 18 apps carry none at all. Two building blocks dominate: Google Firebase Analytics is present in 63 % of the catalogue's apps and Google CrashLytics in 48 %, well ahead of Facebook Login (27 %) and AppsFlyer (25 %)." },
                { type: "stats", items: [
                    { v: "131", l: "Android apps measured" },
                    { v: "108 MB", l: "median app size" },
                    { v: "+30 %", l: "median growth between measured versions" },
                    { v: "0.05", l: "correlation between size and tracker count" },
                ] },
                { type: "h2", text: "What tracker catalogues do not name yet" },
                { type: "p", text: "The analysis also finds, inside the binaries, third-party libraries that no tracker catalogue names. 2,618 candidates were examined, 542 discarded after review, and 2,076 remain pending across 379 vendors; 1,146 correlate with a domain name found in the same binary. None appears on a fiche: a candidate is not a tracker until a human has qualified it, and many will turn out to be technical libraries with no collection of their own." },
                { type: "p", text: "The approach has already produced a concrete result for the ecosystem: two well-known SDKs, Braze and Vungle, had been escaping their own catalogue signature since they changed package names. A tool built to find unknown trackers found known trackers gone invisible — in three catalogue apps each." },
                { type: "quote", text: "We are not publishing a ranking, we are publishing a measurement and its caveats. An app's size is not a scandal in itself: it is a number nobody was giving, and one a citizen can now hold up.", cite: "— Spokesperson for les e-novateurs" },
                { type: "h2", text: "Everything is verifiable" },
                { type: "p", text: "The study's input data is published with it, under `public/data/study`: the size, permissions and trackers of every app, size evolution version by version, the breakdown of permissions by category, and the list of uncatalogued SDK vendors. Each file carries its SHA-256 digest in a manifest. On catalogue fiches, two charts make those measurements readable: the size history version after version, and the composition of the latest analysed binary. No personal data is collected; the analyses run on public binaries." },
            ],
        },
    },
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
