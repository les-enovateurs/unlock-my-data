/**
 * How many items on a service still need a human.
 *
 * The queue counter follows the *essentials*, not the full inventory: "0/40"
 * tells a volunteer the job is hopeless, "0/15" tells them it is finishable.
 * And because a vendor settled on an earlier service drops out, the number
 * falls from one service to the next — which is the whole point of the registry.
 *
 * ⚠ This rule exists twice: here for the built index (plain .mjs, run by node),
 * and in components/review/policyReviewModel.ts for the screen. They must stay
 * in step or the queue promises a number the detail view contradicts. A parity
 * test in __tests__/policyEssentials.test.mjs runs both over the same service
 * and asserts they return the same keys — keep it passing rather than trusting
 * a comment.
 */

// Mirror of SENSITIVE_CATEGORY_KEYS (policyTaxonomy.ts) — weight-3 in criteria.yaml.
const SENSITIVE = new Set(["biometrie", "donnees_sensibles", "mineurs"]);

// Mirror of LEGAL_FORMS in components/review/vendors.ts.
const LEGAL_FORMS = [
  "s a r l", "s à r l", "et cie s c a", "s c a", "s a s", "s a", "sarl", "sas",
  "ab publ", "publ", "n v", "b v", "a s", "gmbh co kg", "gmbh", "ag", "ab",
  "as", "oy", "plc", "ltd", "limited", "llc", "inc", "corp", "corporation",
  "company", "co", "dac", "se", "srl", "spa", "bv", "nv", "kk", "pte",
];

export function normalizeVendorName(raw) {
  let s = (raw || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  let changed = true;
  while (changed && s) {
    changed = false;
    for (const form of LEGAL_FORMS) {
      if (s === form) return "";
      if (s.endsWith(" " + form)) {
        s = s.slice(0, -(form.length + 1)).trim();
        changed = true;
        break;
      }
    }
  }
  return s;
}

const isKnownVendor = (vendors, name) => {
  const key = normalizeVendorName(name);
  if (!key) return false;
  // Only "validated" counts as settled: a contest reopens the company for every
  // service, exactly as it does on screen.
  return vendors?.[key]?.verdict === "validated";
};

/** Keys of the items that deserve a human, in the order the screen shows them. */
export function essentialKeys(service, vendors = {}) {
  const inv = service?.data_inventory;
  if (!inv) return [];
  const keys = [];

  (inv.signals || []).forEach((s, i) => {
    if (s?.criterion && s?.quote && s.quote_verified === true) keys.push(`signal/${i}`);
  });

  for (const [key, c] of Object.entries(inv.categories || {})) {
    if (!c?.quote || c.status !== "oui" || c.quote_verified !== true) continue;
    if (SENSITIVE.has(key)) keys.push(`cat/${key}`);
  }

  const hosting = Array.isArray(inv.transfers?.hosting)
    ? inv.transfers.hosting
    : inv.transfers?.hosting?.provider ? [inv.transfers.hosting] : [];
  hosting.forEach((h, i) => {
    if (!h?.provider || !h?.quote || h.quote_verified !== true) return;
    if (!isKnownVendor(vendors, h.provider)) keys.push(`hebergeur/${i}`);
  });

  (inv.recipients || []).forEach((r, i) => {
    if (!r?.quote || r.quote_verified !== true) return;
    if (!isKnownVendor(vendors, r.name)) keys.push(`dest/${i}`);
  });

  return keys;
}

/** Essentials the volunteer has not ruled on yet — what `needs_count` reports. */
export function countEssentials(service, sidecar, vendors = {}) {
  const treated = (sidecar && sidecar.items) || {};
  return essentialKeys(service, vendors).filter((k) => !treated[k]).length;
}

// Mirror of deriveStatus in components/review/policyReviewModel.ts — same
// parity obligation as essentialKeys, and the same test guards it.
const LEGACY_STATUS = {
  needs_review: "relecture_en_attente",
  human_reviewed: "relu",
  published: "publie",
};
const POLICY_STATUSES = new Set([
  "texte_indisponible", "analyse_en_attente", "relecture_en_attente", "relu", "publie",
]);
const NO_TEXT_FLAGS = new Set(["extraction_insuffisante", "encodage_suspect"]);

export function normalizeStatus(raw) {
  if (raw && POLICY_STATUSES.has(raw)) return raw;
  return LEGACY_STATUS[raw] ?? "relecture_en_attente";
}

export function deriveStatus(svc, sidecar) {
  const stored = sidecar?.status ? normalizeStatus(sidecar.status) : null;
  if (stored === "relu" || stored === "publie") return stored;
  const flags = svc?.review?.flags || [];
  const chars = svc?.source?.markdown_chars ?? 0;
  const pasted = svc?.source?.url_source === "colle_par_benevole";
  const unusable = !pasted && (flags.some((f) => NO_TEXT_FLAGS.has(f)) || chars < 500);
  if (unusable) return "texte_indisponible";
  if (!svc?.data_inventory) return "analyse_en_attente";
  return "relecture_en_attente";
}
