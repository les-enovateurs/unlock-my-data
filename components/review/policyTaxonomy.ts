// Single source mirror of tools/unlock-my-data-policy-analysis-by-ia/criteria.yaml.
// Labels are French legal-reference names — kept French even in EN mode (the
// reviewed policy content is intrinsically source-language).

export const CATEGORY_ORDER = [
  "identite", "contact", "compte_auth", "paiement", "localisation",
  "appareil_technique", "usage_comportement", "contenus_utilisateur",
  "communications", "contacts_reseau", "donnees_tiers", "biometrie",
  "donnees_sensibles", "mineurs", "autre",
] as const;

export const CATEGORY_META: Record<string, { label: string }> = {
  identite: { label: "Identité (nom, prénom, date de naissance)" },
  contact: { label: "Coordonnées (email, téléphone, adresse postale)" },
  compte_auth: { label: "Compte & authentification (identifiants, mots de passe)" },
  paiement: { label: "Données de paiement / financières" },
  localisation: { label: "Localisation / géolocalisation" },
  appareil_technique: { label: "Appareil & technique (IP, device ID, cookies)" },
  usage_comportement: { label: "Usage & comportement (navigation, clics, historique)" },
  contenus_utilisateur: { label: "Contenus créés par l'utilisateur" },
  communications: { label: "Communications (messages, emails, appels)" },
  contacts_reseau: { label: "Carnet d'adresses / réseau social / relations" },
  donnees_tiers: { label: "Données obtenues via des tiers / courtiers" },
  biometrie: { label: "Données biométriques" },
  donnees_sensibles: { label: "Données sensibles art. 9 RGPD (santé, opinions, orientation)" },
  mineurs: { label: "Données de mineurs" },
  autre: { label: "Autre (non classable dans les catégories ci-dessus)" },
};

// Mirror of RECIPIENT_KINDS in the pipeline's inventory.py: the LLM schema is
// strict, so a kind that only exists here would be rejected upstream.
export const RECIPIENT_KINDS = [
  "hebergement", "analytics", "publicite", "paiement", "support", "autre",
] as const;

export type RecipientKindKey = (typeof RECIPIENT_KINDS)[number];

export const RECIPIENT_KIND_META: Record<string, { label: string }> = {
  hebergement: { label: "Hébergement / infrastructure" },
  analytics: { label: "Mesure d'audience" },
  publicite: { label: "Publicité / régie" },
  paiement: { label: "Paiement" },
  support: { label: "Support client" },
  autre: { label: "Autre prestataire" },
};

// Mirror of SIGNAL_CRITERIA in the pipeline's inventory.py. The list is closed
// on purpose: the model does not decide what is shocking, it attaches a verbatim
// passage to a named criterion. A criterion that existed only here would never
// be produced upstream.
export const SIGNAL_CRITERIA = [
  "scoring", "decision_automatisee", "donnees_achetees", "partage_commercial",
  "biometrie", "mineurs", "inference_sensible", "conservation_indefinie",
] as const;

export type SignalCriterionKey = (typeof SIGNAL_CRITERIA)[number];

export const SIGNAL_META: Record<string, { label: string }> = {
  scoring: { label: "Notation / score de solvabilité" },
  decision_automatisee: { label: "Décision automatisée" },
  donnees_achetees: { label: "Données achetées à des tiers" },
  partage_commercial: { label: "Partage commercial / publicitaire" },
  biometrie: { label: "Biométrie" },
  mineurs: { label: "Collecte visant des mineurs" },
  inference_sensible: { label: "Inférence de données sensibles" },
  conservation_indefinie: { label: "Conservation sans durée" },
};

/** Weight-3 categories of criteria.yaml: the ones worth a volunteer's time. */
export const SENSITIVE_CATEGORY_KEYS = new Set([
  "biometrie", "donnees_sensibles", "mineurs",
]);
