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
  quoi: { title: "Quoi", question: "Quelles données sont collectées, et pour quoi faire ?" },
  pourquoi: { title: "Pourquoi", question: "Sur quelle base juridique le service s'appuie-t-il ?" },
  ou: { title: "Où", question: "Où partent les données : hors UE, dans quels pays, chez quel hébergeur ?" },
  qui: { title: "Qui", question: "Quelles entreprises reçoivent les données ?" },
};

const KIND_HINT: Record<string, string> = {
  purpose: "La citation doit dire à quoi sert cette donnée (« afin de », « pour vous permettre de »). Une phrase qui décrit seulement la collecte ne documente pas la finalité.",
  base: "La citation doit nommer la base juridique (contrat, obligation légale, intérêt légitime, consentement) — une finalité seule ne suffit pas.",
  transfert: "La citation doit indiquer que des données quittent l'UE, et si possible vers quels pays ou destinataires.",
  pays: "Le nom du pays doit apparaître littéralement dans la citation. « Hors de l'Union européenne » sans pays nommé ne soutient aucun pays.",
  hebergeur: "Le nom de l'hébergeur (AWS, OVH, Alibaba Cloud…) doit apparaître littéralement dans la citation, et la citation doit parler d'hébergement ou de serveurs — pas de l'éditeur du service.",
  dest: "Le nom de l'entreprise doit apparaître littéralement dans la citation. « Nos partenaires » ou « des prestataires » sans nom ne soutient aucun destinataire.",
};

/** Guidance for any review item key: cat/<id>, purpose/<id>, base/<i>,
 *  transfert, pays/<i>, hebergeur, dest/<i>. */
export function hintForKey(key: string): string {
  if (key.startsWith("cat/")) return CATEGORY_HINT[key.slice(4)] || "";
  if (key.startsWith("purpose/")) return KIND_HINT.purpose;
  if (key.startsWith("base/")) return KIND_HINT.base;
  if (key.startsWith("pays/")) return KIND_HINT.pays;
  if (key.startsWith("dest/")) return KIND_HINT.dest;
  if (key === "transfert") return KIND_HINT.transfert;
  if (key.startsWith("hebergeur")) return KIND_HINT.hebergeur;
  return "";
}