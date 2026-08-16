/**
 * The vendor registry — so the same question is never asked twice.
 *
 * Without heredity the workload never falls: every new policy naming Google
 * asks for the same verdict again. A verdict here is about the **company**, not
 * about the mention, so the first services pay for all the later ones.
 *
 * Three guards, from the spec, and none of them is optional:
 *
 *  1. **Mechanical verification stays local.** Nothing here excuses an item from
 *     `name_in_quote` on *its own* citation. What is inherited is "this company
 *     exists and this kind is right" — never "this policy cites it". That is why
 *     an entry carries no quote and no span: there is nothing here to copy into
 *     a claim about a service.
 *  2. **A second volunteer can contest.** `verdict: "contested"` makes the
 *     company unknown again for *every* service, so it comes back up for review.
 *  3. **Provenance is kept.** Who ruled, when, and from which service, so the UI
 *     can say "validé par X sur zalando le …" rather than asserting it flatly.
 *
 * Deliberately poor: no stable id, no country, no parent company. P2 replaces it
 * with a real company base; this exists only to stop repeating a question.
 */

export type VendorVerdict = "validated" | "contested";

export interface VendorEntry {
  /** As first written by a human — display only; matching uses the key. */
  name: string;
  kind: string;
  verdict: VendorVerdict;
  /** Who ruled first (or who contested — a contest is the live fact). */
  by: string;
  at: string;
  /** Services the company has been seen on, oldest first. */
  services: string[];
}

export type VendorRegistry = Record<string, VendorEntry>;

// Legal forms, stripped from the end of a name so "Adyen N.V." and "Adyen" are
// one company. Order matters: the longest forms first, or "S.A." would eat the
// tail of "S.A.S." Matching is loose by decision (2026-08-16): the alternative
// left 8 of zalando's 12 payment vendors as separate entries, each asked about
// again on every other service.
const LEGAL_FORMS = [
  "s a r l", "s à r l", "et cie s c a", "s c a", "s a s", "s a", "sarl", "sas",
  "ab publ", "publ", "n v", "b v", "a s", "gmbh co kg", "gmbh", "ag", "ab",
  "as", "oy", "plc", "ltd", "limited", "llc", "inc", "corp", "corporation",
  "company", "co", "dac", "se", "srl", "spa", "bv", "nv", "kk", "pte",
];

/**
 * The registry key for a company name.
 *
 * Folds case, accents and punctuation, then strips trailing legal forms —
 * repeatedly, since real names stack them ("… S.à r.l. et Cie, S.C.A.").
 * A name that is nothing but a legal form yields "", which matches nothing:
 * better to ask again than to file two companies under one empty key.
 */
export function normalizeVendorName(raw: string): string {
  let s = (raw || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")  // drop accents
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

export function lookupVendor(reg: VendorRegistry, name: string): VendorEntry | null {
  const key = normalizeVendorName(name);
  if (!key) return null;
  return reg[key] ?? null;
}

/**
 * Is this vendor already settled, so no volunteer need rule on it again?
 *
 * A contested company is deliberately *not* known: contesting reopens it
 * everywhere, which is the point of guard 2.
 */
export function knownVendorFn(reg: VendorRegistry): (name: string) => boolean {
  return (name: string) => lookupVendor(reg, name)?.verdict === "validated";
}

export interface VendorVerdictInput {
  name: string;
  kind: string;
  verdict: VendorVerdict;
  by: string;
  at: string;
  service: string;
}

/** Add or update a company, returning a new registry (the input is untouched). */
export function recordVendorVerdict(
  reg: VendorRegistry, v: VendorVerdictInput
): VendorRegistry {
  const key = normalizeVendorName(v.name);
  if (!key) return reg;  // nameless: nothing to file it under
  const prev = reg[key];
  const services = prev
    ? (prev.services.includes(v.service) ? prev.services : [...prev.services, v.service])
    : [v.service];
  // The first ruling keeps the credit; a contest takes it over, because the
  // contest is what a reader needs to see attributed.
  const takesCredit = !prev || v.verdict === "contested";
  return {
    ...reg,
    [key]: {
      name: prev?.name ?? v.name,
      kind: v.kind,
      verdict: v.verdict,
      by: takesCredit ? v.by : prev!.by,
      at: takesCredit ? v.at : prev!.at,
      services,
    },
  };
}

export const VENDORS_URL = "/data/policy-analysis/vendors.json";

/** Load the registry; an absent or broken file simply means "nothing known". */
export async function loadVendors(
  fetchFn: typeof fetch = fetch
): Promise<VendorRegistry> {
  try {
    const r = await fetchFn(VENDORS_URL);
    if (!r.ok) return {};
    const d = await r.json();
    return (d && typeof d === "object" ? d : {}) as VendorRegistry;
  } catch {
    return {};
  }
}

/**
 * The registry change a verdict on one card implies — or null for none.
 *
 * Heredity carries exactly two claims: this company exists, and its `kind` is
 * right. So only a verdict that speaks to those may touch the registry:
 *
 *  - validating a vendor card settles the company;
 *  - rejecting it as `mauvaise_categorie` contradicts the inherited `kind`, and
 *    so contests the company for every service;
 *  - `citation_absente` and `hors_sujet` are about *this* citation. The company
 *    may be perfectly real and correctly typed; reopening it everywhere because
 *    one policy quoted it badly would punish every other service.
 *
 * Non-vendor items never reach the registry at all: a category or a legal basis
 * says nothing about a company.
 */
export function vendorUpdateFor(
  item: { key: string; label: string; kind: string },
  verdict: "validated" | "rejected",
  reason: string | null,
  ctx: { service: string; by: string; at: string }
): VendorVerdictInput | null {
  const isVendor = item.key.startsWith("dest/") || item.key.startsWith("hebergeur/");
  if (!isVendor) return null;
  if (verdict === "rejected" && reason !== "mauvaise_categorie") return null;
  return {
    name: item.label,
    kind: item.kind,
    verdict: verdict === "validated" ? "validated" : "contested",
    by: ctx.by,
    at: ctx.at,
    service: ctx.service,
  };
}
