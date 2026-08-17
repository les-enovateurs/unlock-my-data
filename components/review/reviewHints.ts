// Reviewer guidance for the four axes (quoi, pourquoi, où, qui).
// Volunteers use these hints to know what a correct citation looks like for each item.
// UI-only: the reviewed material is French legal text, so guidance is in French too
// (like the labels in policyTaxonomy.ts).
// CATEGORY_HINT covers data categories (cat/<id>); KIND_HINT covers the axes items.

import type { AxisKey } from "./policyReviewModel";

export const CATEGORY_HINT: Record<string, string> = {
  identite: "Une citation qui énumère les données d'identité : nom, prénom, pseudo, date de naissance, sexe, photo de profil. Pas les coordonnées ni les identifiants de connexion.",
  contact: "Une citation qui énumère les moyens de contact : e-mail, téléphone, fax, adresse postale. Si elle mentionne aussi le nom ou la date de naissance, c'est la citation d'« Identité » qui a été recopiée ici.",
  compte_auth: "Une citation sur la création de compte, les identifiants, mots de passe ou l'authentification — pas sur le contenu du profil.",
  paiement: "Une citation sur la carte bancaire, le moyen de paiement, la facturation ou les données de transaction.",
  localisation: "Une citation sur la position : GPS, pays/ville déduits, adresse de livraison utilisée comme localisation.",
  appareil_technique: "Une citation sur l'appareil et le réseau : adresse IP, identifiant d'appareil, type de navigateur, système, cookies techniques.",
  usage_comportement: "Une citation sur ce que fait l'utilisateur sur le service : pages vues, clics, historique, recherches, temps passé.",
  contenus_utilisateur: "Une citation sur ce que l'utilisateur publie : photos, avis, commentaires, fichiers déposés.",
  communications: "Une citation sur les échanges avec le service ou entre utilisateurs : e-mails, chat, appels au service client, messages privés.",
  contacts_reseau: "Une citation sur le carnet d'adresses importé, les amis/abonnés, ou les personnes avec qui l'utilisateur interagit.",
  donnees_tiers: "Une citation disant que le service reçoit des données depuis des sources externes : réseaux sociaux, courtiers, partenaires, prestataires de vérification.",
  biometrie: "Une citation explicite sur empreinte, visage, voix ou tout gabarit biométrique. Une simple photo de profil ne suffit pas.",
  donnees_sensibles: "Une citation visant l'art. 9 RGPD : santé, opinions politiques, religion, orientation sexuelle, origine, syndicat. Le mot « sensible » seul, sans indiquer de quoi il s'agit, est une citation faible.",
  mineurs: "Une citation sur les enfants / les moins de 15-16 ans : âge minimum, consentement parental, données de mineurs collectées.",
  autre: "Une donnée collectée qui n'entre dans aucune autre catégorie. Si elle entre dans une catégorie existante, rejeter en « Mauvaise catégorie ».",
};

export const AXIS_META: Record<AxisKey, { title: string; question: string }> = {
  signalement: { title: "À signaler", question: "Qu'est-ce qu'un journaliste citerait de cette politique ?" },
  quoi: { title: "Quoi", question: "Quelles données sont collectées, et pour quoi faire ?" },
  pourquoi: { title: "Pourquoi", question: "Sur quelle base juridique le service s'appuie-t-il ?" },
  ou: { title: "Où", question: "Où partent les données : hors UE, dans quels pays, chez quel hébergeur ?" },
  qui: { title: "Qui", question: "Quelles entreprises reçoivent les données ?" },
};

const KIND_HINT: Record<string, string> = {
  signal: "Le passage doit dire lui-même ce que le critère annonce. S'il faut l'interpréter ou le deviner, rejeter.",
  purpose: "La citation doit dire à quoi sert cette donnée (« afin de », « pour vous permettre de »). Une phrase qui décrit seulement la collecte ne documente pas la finalité.",
  base: "La citation doit nommer la base juridique (contrat, obligation légale, intérêt légitime, consentement) — une finalité seule ne suffit pas.",
  transfert: "La citation doit indiquer que des données quittent l'UE, et si possible vers quels pays ou destinataires.",
  pays: "Le nom du pays doit apparaître littéralement dans la citation. « Hors de l'Union européenne » sans pays nommé ne soutient aucun pays.",
  hebergeur: "Le nom de l'hébergeur (AWS, OVH, Alibaba Cloud…) doit apparaître littéralement dans la citation, et la citation doit parler d'hébergement ou de serveurs — pas de l'éditeur du service.",
  dest: "Le nom de l'entreprise doit apparaître littéralement dans la citation. « Nos partenaires » ou « des prestataires » sans nom ne soutient aucun destinataire.",
};

/** Guidance for any review item key: signal/<i>, cat/<id>, purpose/<id>,
 *  base/<i>, transfert, pays/<i>, hebergeur/<i>, dest/<i>. */
export function hintForKey(key: string): string {
  if (key.startsWith("signal/")) return KIND_HINT.signal;
  if (key.startsWith("cat/")) return CATEGORY_HINT[key.slice(4)] || "";
  if (key.startsWith("purpose/")) return KIND_HINT.purpose;
  if (key.startsWith("base/")) return KIND_HINT.base;
  if (key.startsWith("pays/")) return KIND_HINT.pays;
  if (key.startsWith("dest/")) return KIND_HINT.dest;
  if (key === "transfert") return KIND_HINT.transfert;
  if (key.startsWith("hebergeur")) return KIND_HINT.hebergeur;
  return "";
}
/**
 * What each "à signaler" criterion actually requires.
 *
 * The label ("Notation / score de solvabilité") names the criterion; it does
 * not say what qualifies as one, and a generic "the passage must state the
 * criterion" hint just restates the question. Each entry below says what the
 * passage must assert — and, more usefully, the near-miss that does not count,
 * because that is the case a volunteer would otherwise wave through.
 */
export const SIGNAL_HINT: Record<string, string> = {
  scoring: "Le passage doit décrire une note, un score ou une probabilité calculée sur une personne : solvabilité, risque de fraude, valeur client. Un simple « nous vérifions les informations que vous fournissez » ne compte pas — vérifier n'est pas noter.",
  decision_automatisee: "Le passage doit dire qu'une décision est prise sans intervention humaine : refus de commande, blocage de compte, tarif, classement. Un traitement automatisé qui ne décide rien (statistiques, recommandations d'affichage) ne compte pas.",
  donnees_achetees: "Le passage doit dire que le service REÇOIT des données d'un tiers : courtier, agence de renseignement, partenaire commercial, réseau social. Les données que l'utilisateur fournit lui-même, ou que le service observe sur son propre site, ne comptent pas.",
  partage_commercial: "Le passage doit dire que des données sont transmises à un tiers à des fins publicitaires ou commerciales. Un partage avec un sous-traitant technique (hébergeur, prestataire de paiement, transporteur) ne compte pas : il exécute le service.",
  biometrie: "Le passage doit viser une mesure du corps servant à identifier : empreinte digitale, reconnaissance faciale, voix, gabarit. Une photo de profil, un avatar ou une pièce d'identité scannée ne suffit pas — il faut le traitement biométrique.",
  mineurs: "Le passage doit viser les enfants ou les moins de 15-16 ans : âge minimum, consentement parental, données de mineurs effectivement collectées. Une clause « service interdit aux mineurs », sans collecte décrite, ne compte pas.",
  inference_sensible: "Le passage doit dire que le service DÉDUIT une donnée sensible (santé, opinions, religion, orientation, origine) à partir du comportement. Une donnée sensible fournie directement par l'utilisateur ne relève pas de ce critère.",
  conservation_indefinie: "Le passage doit annoncer une conservation sans durée ni critère : « aussi longtemps que nécessaire », « jusqu'à ce que vous demandiez la suppression ». Une durée chiffrée, même très longue (10 ans), ne compte pas.",
};

/** Guidance for an item, using its criterion when it has one (signals). */
export function hintForItem(key: string, criterion?: string): string {
  if (key.startsWith("signal/")) {
    // An unknown criterion falls back to the generic rule rather than nothing:
    // a file written by an older list must still tell the volunteer what to do.
    return (criterion && SIGNAL_HINT[criterion]) || KIND_HINT.signal;
  }
  return hintForKey(key);
}
