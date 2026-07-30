// Reviewer guidance — what a *correct* citation looks like for each field.
// UI-only: criteria.yaml holds ids/labels, not this prose, so nothing to keep in
// sync there. French on purpose (like the labels in policyTaxonomy.ts): the
// reviewed material is French legal text.

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

export const CRIT_HINT: Record<string, string> = {
  // Mentions légales
  ml_denomination: "Le nom exact de la société (raison sociale), pas le nom commercial du service.",
  ml_forme_juridique: "SAS, SARL, Ltd, Inc, GmbH… La forme doit apparaître dans la citation.",
  ml_adresse: "L'adresse postale complète du siège de l'éditeur.",
  ml_telephone: "Un numéro de téléphone joignable de l'éditeur.",
  ml_email: "Une adresse e-mail de contact de l'éditeur (pas forcément celle du DPO).",
  ml_hebergeur_denom: "Le nom de la société qui héberge le site (AWS, OVH, Alibaba Cloud…), pas celui de l'éditeur.",
  ml_hebergeur_adr: "L'adresse postale de l'hébergeur.",
  ml_hebergeur_email: "L'e-mail de contact de l'hébergeur.",
  ml_hebergeur_tel: "Le téléphone de l'hébergeur.",
  ml_directeur_pub: "Le nom d'une personne physique désignée directeur de la publication.",
  ml_resp_redaction: "Le nom d'une personne physique responsable de la rédaction.",

  // Politique de données personnelles
  pdp_presence: "Le titre ou l'en-tête qui identifie le document comme politique de confidentialité.",
  pdp_rt_identity: "L'entité qui décide des traitements — « le responsable du traitement est … ». Pas l'hébergeur.",
  pdp_dpo: "Les coordonnées du délégué à la protection des données : e-mail, adresse ou formulaire dédié.",
  pdp_data_types: "Une énumération des données collectées. Un tableau recopié ligne par ligne est acceptable s'il reste lisible.",
  pdp_base_legale: "La base juridique nommée : contrat, obligation légale, intérêt légitime ou consentement. Une simple finalité (« pour améliorer nos services ») ne suffit pas.",
  pdp_obligatoire: "Ce qui se passe si l'utilisateur refuse de fournir une donnée (service dégradé, compte impossible…).",
  pdp_conservation: "Une durée ou un critère de durée. « Aussi longtemps que nécessaire » est une réponse faible mais reste la citation attendue ici.",
  pdp_destinataires: "À qui les données sont transmises : catégories de destinataires ou entités nommées.",
  pdp_decision_auto: "Profilage ou décision prise sans intervention humaine, et le droit d'en demander la révision.",
  pdp_securite: "Les mesures techniques et organisationnelles : chiffrement, contrôle d'accès, pseudonymisation.",
  pdp_collecte_indir: "Les catégories de données obtenues ailleurs que directement auprès de l'utilisateur.",
  pdp_source_indir: "D'où viennent ces données indirectes : réseaux sociaux, partenaires, courtiers, transporteurs.",
  pdp_droit_plainte: "Le droit de saisir une autorité de contrôle (CNIL ou équivalent).",
  pdp_droit_rectif: "Le droit de corriger ou mettre à jour ses données.",
  pdp_droit_acces: "Le droit d'obtenir une copie de ses données et de confirmer l'existence du traitement.",
  pdp_droit_efface: "Le droit à la suppression / à l'oubli.",
  pdp_droit_limit: "Le droit de geler un traitement sans supprimer les données.",
  pdp_droit_porta: "Le droit de récupérer ses données dans un format structuré et réutilisable.",
  pdp_droit_oppo: "Le droit de s'opposer à un traitement, notamment fondé sur l'intérêt légitime ou la prospection.",
  pdp_date_maj: "La date d'entrée en vigueur ou de dernière mise à jour du document.",

  // Cookies
  ck_presence: "Le titre ou l'en-tête de la section cookies.",
  ck_info_rt: "Qui dépose les cookies et en répond.",
  ck_info_finalite: "À quoi servent les cookies : fonctionnement, mesure d'audience, publicité.",
  ck_info_duree: "La durée de vie des cookies (en mois, jours, ou « session »).",
  ck_info_partenaires: "La liste ou l'accès à la liste des tiers déposant des cookies.",
  ck_detail_finalites: "Le détail par finalité, au-delà de la catégorie générale.",
  ck_detail_types: "Les types de cookies déposés : session/persistants, propres/tiers, et à quoi ils servent.",
  ck_distinction: "La distinction explicite entre cookies nécessaires/fonctionnels et cookies publicitaires. Une distinction session/permanent seule ne répond pas au critère.",
  ck_outil_stat: "L'outil de mesure d'audience nommé ou décrit (Google Analytics, Matomo, cookies analytiques…).",
  ck_consent_stat: "Le fait que la mesure d'audience soit soumise au consentement, ou l'existence d'un moyen de la refuser.",

  // Transferts hors UE
  tr_transfert_hors_ue: "La citation doit dire que des données sortent de l'UE, et idéalement vers quels pays ou destinataires.",
  tr_cloud_hors_ue: "L'hébergement / stockage cloud hors UE et la localisation des serveurs.",
};

const KIND_HINT: Record<string, string> = {
  base: "La citation doit nommer la base juridique (contrat, obligation légale, intérêt légitime, consentement) — une finalité seule ne suffit pas.",
  transfert: "La citation doit indiquer que des données quittent l'UE, et si possible vers quels pays ou destinataires.",
  pixel: "La citation doit mentionner des pixels, balises web, cookies tiers ou traceurs publicitaires — et ce qui est suivi.",
};

/** Guidance for any review item key: cat/<id>, base/<i>, transfert, crit/<domain>/<id>, pixel/<i>. */
export function hintForKey(key: string): string {
  if (key.startsWith("cat/")) return CATEGORY_HINT[key.slice(4)] || "";
  if (key.startsWith("crit/")) return CRIT_HINT[key.split("/")[2]] || "";
  if (key.startsWith("base/")) return KIND_HINT.base;
  if (key.startsWith("pixel/")) return KIND_HINT.pixel;
  if (key === "transfert") return KIND_HINT.transfert;
  return "";
}