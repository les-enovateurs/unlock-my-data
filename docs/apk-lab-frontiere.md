# Le dataset APK : ce qui traverse, et par où

Un dépôt privé produit des faits mesurés sur des APK Android. Ce document dit ce que le
site en reçoit, ce qu'il n'en reçoit pas, et par quel chemin.

Deux canaux existent, et ils ne se ressemblent pas.

| | canal existant | canal nouveau |
|---|---|---|
| quoi | `version`, `report_date`, `permissions`, `trackers` | analyses statiques, deltas, endpoints tiers, compteurs |
| où | `public/data/compare/<slug>.json` | `public/data/apk-lab/<slug>.json` |
| versionné | oui, 141 fiches dans ce dépôt | non, jamais |
| revue | `git diff` lu par un humain | liste blanche + tests, pas de diff |

Le premier n'est pas le sujet ; il marche et il reste tel quel.

## Un point à ne pas confondre

Le site est un export statique. Tout ce qui atteint `public/` est téléchargeable en clair
sur unlock-my-data.com. **Sortir la donnée de git ne la rend pas privée** — ça empêche le
fork du dépôt d'emporter le dataset, la pollution de l'historique et les 130 fichiers qui
bougent à chaque passe. Rien de plus.

C'est pourquoi la réduction se fait **en amont**, dans la commande `publish` du dépôt
privé, et pas en cachant le résultat. Ce qui est publié est publiable ; ce qui ne l'est
pas ne quitte pas le dépôt privé.

## Les cinq tranches

| tranche | volume privé | décision | motif |
|---|---|---|---|
| analyses statiques | 23 analyses / 17 apps | **traverse** | seule tranche qu'aucune source publique ne porte, et elle décrit un binaire, pas un comportement — elle n'engage personne |
| deltas | 129 / 89 apps | **traverse partiellement** | uniquement les blocs que `diff` déclare exploitables ; un retrait de pisteurs mesuré contre deux catalogues dirait « l'app a retiré 3 pisteurs » là où le fait est « le catalogue a changé » |
| endpoints | 1 164 hôtes / 16 apps | **traverse partiellement** | uniquement la classe `endpoint`, uniquement les tiers. Les autres sont de la documentation, des gabarits et des identifiants de code |
| comptes SDK | 40 / 16 apps | **traverse en compteurs** | la famille (« une clé Branch »), jamais la valeur. Rien n'est secret, mais un compte nomme un sous-traitant par éditeur |
| candidats pisteurs | 501, dont 230 `pending` | **traverse en compteurs** | aucun nom de package. Voir ci-dessous |

### Les candidats : ce que le dataset réel a changé

La proposition initiale était « publier les `rejected` signés, jamais les `pending` ».
Après lecture de `candidates.json`, elle ne tient pas : deux statuts existent,
`rejected` (271) et `pending` (230), et **aucun champ ne porte de signature**. Il n'y a
donc pas de « rejeté signé » à publier.

Restent deux options, et les deux échouent pour des raisons différentes. Un `pending`
publié nommerait un éditeur sur une preuve que personne n'a relue. Un `rejected` publié
par son nom se lirait comme une accusation retirée, alors que le fait est qu'il n'y avait
rien à dire.

Ne traversent donc que les compteurs — `{examined, by_status}` — qui décrivent la méthode
et non un tiers. Le jour où un statut `accepted` existera, signé, ses noms auront leur
place : c'est le seul cas qui apprendrait au lecteur quelque chose que le catalogue Exodus
ne porte pas déjà.

## Ce que le lecteur pourra en dire sans que ce soit faux

- « Cette version pèse 174 Mo, dont 87 Mo de bibliothèques natives, et déclare 621 384
  méthodes. » Vrai, mesuré, et introuvable ailleurs.
- « Entre la version 26.2.0 et la 26.13.0, cette application a ajouté la permission
  `ACCESS_ADSERVICES_AD_ID`. » Vrai : les permissions sont lues du manifeste de l'APK, pas
  d'un catalogue, donc le fait survit à un changement de source.
- « 130 domaines tiers apparaissent dans le binaire de cette application. » Vrai.
- « Cette application contacte 130 domaines. » **Faux.** L'analyse est statique : elle
  relève un nom dans un binaire, elle ne voit passer aucune requête. C'est pour ça que
  chaque bloc `endpoints` porte `"basis": "strings-in-binary"` — la réserve voyage dans
  l'objet, pas dans une note de bas de page.
- « Cette application contacte 173 domaines. » Faux deux fois : ce chiffre compte aussi de
  la documentation et des identifiants de code, et il reste une extraction statique.
- « `adyen.com` est un domaine d'Adyen, société dont le siège est aux Pays-Bas, et qui fait
  du paiement. » Vrai, et c'est tout ce que la table `data/domainOwners.ts` prétend dire.
- « Les données de cette application partent aux Pays-Bas. » **Faux.** Le pays affiché est
  celui du **siège social**, écrit à la main parce qu'aucune mesure automatique n'en donne
  un honnête : la géo-IP rend l'emplacement d'un point de présence CDN, le WHOIS est masqué
  la moitié du temps, et le champ `country` d'Exodus vaut « united states » pour 381 de ses
  432 pisteurs. Un siège n'est pas un lieu de traitement — Airship est américaine et opère
  `asnapieu.com` en Europe, Adjust est berlinoise et appartient à AppLovin depuis 2021.
  C'est pourquoi chaque entrée peut porter une `note`, et pourquoi la liste répète sous les
  cartes que le pays est celui du siège.
- « `cloudfront.net` appartient à Amazon. » Vrai — et insuffisant seul. Un hébergeur diffuse
  le contenu de ses clients : nommer Amazon sans le dire serait vrai sur l'hébergeur et
  trompeur sur le destinataire. Les domaines marqués `hebergement` déclenchent donc leur
  propre réserve, affichée seulement quand l'un d'eux est à l'écran.
- « Ce domaine n'a pas de nom, donc il est anodin. » **Faux.** L'absence est un aveu
  d'ignorance, pas un verdict : 168 des 399 domaines racines du corpus ne sont dans aucune
  table, dont `spadsync.com`, présent dans quatre fiches. Écrire un nom incertain coûterait
  plus que de n'en écrire aucun.

## Les fichiers

```
public/data/apk-lab/manifest.json     l'index : app_count, apps[], catalog_version
public/data/apk-lab/apps/<slug>.json  un document par application publiable (68 / 130)
```

Ce répertoire est gitignoré et reconstruit à chaque `npm run build`.

Le manifeste fait autorité : un fichier absent de sa liste `apps[]` n'est pas servi. Le
dépôt privé ne supprime jamais un export périmé, et cette règle est ce qui empêche un
reste de la passe précédente d'atteindre le site.

540 Ko au total, contre 5 Mo pour le dataset privé.

## Le chemin

```
poste de travail          collecte, analyse, tri manuel  →  commit dans le dépôt privé
CI du dépôt privé         apklab publish  →  tar  →  ssh  →  serveur
serveur                   accept-apk-lab  →  /srv/umd-private/apk-lab
CI du site                repository_dispatch  →  build hydrate  →  export statique
```

Quatre propriétés tiennent ce chemin.

**La CI privée ne collecte rien.** `publish` dérive de fichiers versionnés, sans réseau ni
binaire. Le téléchargement d'APK reste sur le poste de travail.

**La clé de dépose n'ouvre pas de shell.** Elle est attachée à une commande forcée,
[`scripts/server/accept-apk-lab.sh`](../scripts/server/accept-apk-lab.sh), qui n'accepte
que deux verbes : `manifest` et `accept`. Une fuite de ce secret donne « dépose une
archive dans un répertoire », pas la machine qui sert le site.

**Une passe qui ne change rien ne reconstruit rien.** La CI privée compare les empreintes
des documents à celles du dataset servi. `generated_at` est exclu de la comparaison, sinon
chaque commit du dépôt privé relancerait un build.

**Un build sans dataset reste vert.** [`scripts/load-apk-lab.mjs`](../scripts/load-apk-lab.mjs)
écrit toujours un manifeste valide : `app_count: 0` quand le dépôt de fichiers est absent,
ce qui est le cas en CI, sur une pull request et sur un clone neuf.

L'hydratation est appelée depuis le script `build` lui-même, et **pas** depuis `prebuild` :
le `.npmrc` versionné de ce dépôt porte `ignore-scripts=true`, donc les scripts de cycle
de vie npm ne tournent nulle part — ni en local, ni en CI, ni sur le serveur. Une étape
posée dans `prebuild` serait une ligne morte.

## Ce que ce chemin ne teste pas

**La donnée n'atteint jamais le runner GitHub.** Playwright ne verra donc jamais le vrai
dataset. Ce qui reste comme filet, et il faut le savoir avant d'en avoir besoin :

- les fixtures de `__tests__/fixtures/apk-lab/` couvrent le rendu, pas les chiffres ;
- `npm run build` tourne sur le serveur, après hydratation : un export statique échoue si
  une page casse sur la nouvelle donnée, et le déploiement s'arrête avant le contrôle de
  santé ;
- `load-apk-lab.mjs` revérifie chaque empreinte et refuse le lot entier si une seule
  diverge — servir la moitié d'un dataset serait le servir comme s'il était complet.

C'est le prix du « pas dans git », et il est assumé.

## Surface du site

L'onglet **Analyse technique** de la fiche, sous les permissions et les pisteurs
(`/liste-applications/<slug>`, rendu par `components/company/manual.tsx` →
`FicheAvancee.tsx`). Trois blocs, tous optionnels :

1. **Mesures du binaire** — poids, part native, méthodes déclarées, Android minimum, avec
   la version mesurée, la date et les architectures. 17 fiches sur 68.
2. **Ce qui a changé d'une version à l'autre** — permissions et pisteurs ajoutés ou
   retirés, écart de poids. 63 fiches.
3. **Domaines tiers relevés dans le binaire** — plafonné à 24 par prévalence décroissante,
   dépliable. 16 fiches.

`lib/apkLab.ts` expose le lecteur : `readManifest`, `apkLabSlugs`, `readApkLabApp`, et
`findApkLabApp({ slug, handle })` qui retombe sur le handle quand les deux dépôts n'ont
pas le même slug.

Quatre choix de rendu qui ne se devinent pas :

- **`owner_packages` n'est pas affiché.** Le dataset le porte, mais «
  `play.google.com` · `com.google.accompanist` » se lit comme une attribution de
  propriété, alors que c'est le paquet où la chaîne a été trouvée. La prévalence est le
  seul fait que ce bloc peut porter sans être contestable.
- **La réserve « relevés, pas contactés » est au-dessus de la liste**, pas en note de bas
  de page. C'est la phrase que le lecteur écrira s'il ne la lit pas.
- **Les hôtes sont plafonnés à 8 domaines racines.** BeReal en porte 250, soit 9 000 px de
  liste : dépliée par défaut, elle noie le reste de l'onglet.
- **Le nom de la société est éditorial, et il vit ici.** [`data/domainOwners.ts`](../data/domainOwners.ts)
  annote 234 domaines racines — 84 % des adresses du corpus — d'un nom, d'un pays de siège
  et, quand il est unique, d'un usage. Elle est dans ce dépôt et pas dans le dépôt privé
  pour une raison qui tient dans le tableau du haut de ce document : le canal privé est
  relu par « liste blanche + tests, pas de diff ». Une table qui parle au nom d'Unlock My
  Data et nomme des entreprises doit passer par un `git diff` lu par un humain, comme
  [`data/permissionLabels.ts`](../data/permissionLabels.ts) dont elle reprend le modèle. Le
  dépôt privé reste une mesure mécanique ; le site annote.

`rootDomain()` vit dans la même table, parce que la table en est la clé. Le corollaire se
paye : chaque suffixe composé manquant coûte un nom de société. `.net.in` en était un —
les onze adresses `*.adjust.net.in` de six fiches se rangeaient sous `net.in`, un suffixe
qu'aucune table ne peut porter. `__tests__/domainOwners.test.ts` garde ce cas et vérifie
que chaque clé de la table est bien son propre domaine racine, donc atteignable.

Une limite connue, non corrigée : le filtre « tierce partie » du dépôt privé laisse passer
des domaines de **première partie** — `roocdn.com` chez Deliveroo, `owhealth.com` chez Flo,
vingt `blablacar.*` chez BlaBlaCar. La table ne les nomme pas : les nommer reviendrait à
valider leur présence dans une liste intitulée « Sociétés tierces ». Le tri appartient au
dépôt privé, pas à l'affichage.

## Mise en place

Les secrets et la configuration serveur sont dans
[`docs/apk-lab-exploitation.md`](apk-lab-exploitation.md).
