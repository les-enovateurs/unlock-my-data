import type { ReviewSidecar, PolicyStatus, ReviewStatus } from "./reviewTypes";
import {
  RECIPIENT_KIND_META, RECIPIENT_KINDS, SIGNAL_META, SIGNAL_CRITERIA,
  SENSITIVE_CATEGORY_KEYS,
} from "./policyTaxonomy";
import { normalizeVendorName } from "./vendors";

/** The five questions the review answers: what to flag, what, why, where, who.
 *  Signalement comes first because it is where the machine is weakest and the
 *  stakes are highest — it is the axis a journalist quotes. */
export type AxisKey = "signalement" | "quoi" | "pourquoi" | "ou" | "qui";
export const AXIS_ORDER: AxisKey[] = ["signalement", "quoi", "pourquoi", "ou", "qui"];

export interface InvItem {
  key: string; axis: AxisKey; kind: string; label: string;
  quote: string; origVerified: boolean | null;
  /** UTF-16 bounds of the passage in the published text, as located by the
   *  pipeline. null when the quote was not found — or was typed by a human. */
  span: [number, number] | null;
  /** Why the pipeline set it aside: "quote_absente" | "nom_absent" | null. */
  verifyReason: string | null;
  /** Signals only: the closed-list criterion, which selects the guidance shown
   *  on the card. The label alone names the criterion without defining it. */
  criterion?: string;
}

// Mirror of _LIST_BULLET in the pipeline's verify.py. Policies bullet their
// data; the model returns one comma-joined sentence. The pipeline already
// accounts for that when it locates the quote, so a front that did not would
// throw away a perfectly good span and highlight nothing — measured on zalando,
// where "votre nom et votre prénom, vos coordonnées, …" is four bullets.
// Applied before the emphasis strip, which would otherwise eat "*" markers.
const LIST_BULLET = /\n[ \t]*(?:[-*+]|\d+[.)])[ \t]+/g;
// Mirror of _LEADING_BULLET: the model often copies the bullet it read, and a
// separator before the first word separates nothing.
const LEADING_BULLET = /^[ \t]*(?:[-*+]|\d+[.)])[ \t]+/;

const squash = (s: string) =>
  (s || "").replace(LEADING_BULLET, "").replace(LIST_BULLET, ", ")
    .replace(/[*_`]/g, "").replace(/\s+/g, " ").trim().toLowerCase();

/**
 * Where to highlight this item in the published text.
 *
 * The stored span is trusted only if the slice it points at still reads as the
 * quote: a text file rewritten by a later pipeline run would otherwise
 * highlight an unrelated paragraph while claiming to show the citation. When
 * nothing matches, nothing is highlighted — a wrong highlight is worse than
 * none, since the volunteer would rule on the passage it shows them.
 */
export function resolveSpan(
  item: Pick<InvItem, "quote" | "span">,
  text: string
): [number, number] | null {
  const wanted = squash(item.quote);
  if (!wanted || !text) return null;
  if (item.span) {
    const [a, b] = item.span;
    if (squash(text.slice(a, b)) === wanted) return [a, b];
  }
  const needle = item.quote.trim();
  const i = text.toLowerCase().indexOf(needle.toLowerCase());
  if (i >= 0) return [i, i + needle.length];
  return skeletonSpan(item.quote, text);
}

/** Letters and digits only, plus the source offset of each kept character.
 *  Everything the two sides can legitimately disagree on — the "**" around a
 *  company name, the bullet the model turned into a comma, a line break inside
 *  a sentence — is punctuation or whitespace, so dropping it makes the citation
 *  and the passage comparable again. */
function skeleton(s: string): { norm: string; map: number[] } {
  const chars: string[] = [];
  const map: number[] = [];
  const lower = s.toLowerCase();
  for (let i = 0; i < lower.length; i++) {
    const c = lower[i];
    // Unicode-aware: "société" and "Leopoldstraße" must keep their letters.
    if (/[\p{L}\p{N}]/u.test(c)) { chars.push(c); map.push(i); }
  }
  return { norm: chars.join(""), map };
}

// The published text runs to 150 000+ characters and the pane re-renders on
// every keystroke: skeletonising it once per document is the difference
// between instant and janky.
let skeletonCache: { text: string; sk: { norm: string; map: number[] } } | null = null;
function textSkeleton(text: string) {
  if (!skeletonCache || skeletonCache.text !== text) {
    skeletonCache = { text, sk: skeleton(text) };
  }
  return skeletonCache.sk;
}

/** Last resort: match on letters and digits alone.
 *
 * Short needles are refused — "USA" would match a hundred places, and a
 * highlight on the wrong paragraph is worse than none. A quote the model
 * reworded (Zalando's hosting list, where "ou" came back as "or") still finds
 * nothing here, which is the honest answer. */
const MIN_SKELETON = 24;
function skeletonSpan(quote: string, text: string): [number, number] | null {
  const q = skeleton(quote);
  if (q.norm.length < MIN_SKELETON) return null;
  const t = textSkeleton(text);
  const at = t.norm.indexOf(q.norm);
  if (at < 0) return null;
  return [t.map[at], t.map[at + q.norm.length - 1] + 1];
}

function humanizeLegalData(data: string, meta: Record<string, { label: string }>): string {
  const parts = (data || "").split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length && parts.every((p) => meta[p])) return parts.map((p) => meta[p].label).join(", ");
  return data ? data.charAt(0).toUpperCase() + data.slice(1) : data;
}

export function computeInvItems(
  svc: any,
  meta: { CATEGORY_ORDER: string[]; CATEGORY_META: Record<string, { label: string }> }
): InvItem[] {
  const inv = svc?.data_inventory;
  if (!inv) return [];
  const items: InvItem[] = [];

  // --- À SIGNALER: verbatim passages attached to a closed-list criterion ---
  (inv.signals || []).forEach((s: any, i: number) => {
    if (!s?.criterion || !s?.quote) return;
    items.push({ key: `signal/${i}`, axis: "signalement", kind: "Signalement",
      // Falls back to the raw criterion rather than blank: a file written by an
      // older list must still name what it is claiming.
      label: SIGNAL_META[s.criterion]?.label || s.criterion, quote: s.quote,
      origVerified: s.quote_verified ?? null, criterion: s.criterion,
      span: s.quote_span ?? null, verifyReason: s.verify_reason ?? null });
  });

  // --- QUOI: collected categories, each with its own purpose ---
  meta.CATEGORY_ORDER.forEach((key) => {
    if (key === "autre") return;
    const cat = inv.categories && inv.categories[key];
    if (!cat || cat.status !== "oui") return;
    const label = meta.CATEGORY_META[key]?.label || key;
    if (cat.quote) {
      items.push({ key: `cat/${key}`, axis: "quoi", kind: "Catégorie de données",
        label, quote: cat.quote, origVerified: cat.quote_verified ?? null,
        span: cat.quote_span ?? null, verifyReason: cat.verify_reason ?? null });
    }
    // A purpose is published only when its own quote checks out, so it is
    // reviewable on its own — rejecting it must not reject the category.
    if (cat.purpose_quote) {
      items.push({ key: `purpose/${key}`, axis: "quoi", kind: "Finalité",
        label: `Finalité — ${label}`, quote: cat.purpose_quote,
        origVerified: cat.purpose_quote_verified ?? null,
        span: cat.purpose_quote_span ?? null,
        verifyReason: cat.purpose_verify_reason ?? null });
    }
  });

  // --- POURQUOI: legal bases ---
  (inv.legal_bases || []).forEach((lb: any, i: number) => {
    if (!lb?.quote) return;
    items.push({ key: `base/${i}`, axis: "pourquoi", kind: "Base légale",
      label: humanizeLegalData(lb.data, meta.CATEGORY_META), quote: lb.quote,
      origVerified: lb.quote_verified ?? null,
      span: lb.quote_span ?? null, verifyReason: lb.verify_reason ?? null });
  });

  // --- OÙ: outside-EU statement, destination countries, hosting provider ---
  const tr = inv.transfers || {};
  if (tr.quote) {
    items.push({ key: "transfert", axis: "ou", kind: "Transferts hors UE",
      label: "Transferts hors UE", quote: tr.quote,
      origVerified: tr.quote_verified ?? null,
      span: tr.quote_span ?? null, verifyReason: tr.verify_reason ?? null });
  }
  (tr.countries || []).forEach((c: any, i: number) => {
    // Pre-migration files store bare strings here; no quote, nothing to review.
    if (!c || typeof c === "string" || !c.quote) return;
    items.push({ key: `pays/${i}`, axis: "ou", kind: "Pays destinataire",
      label: c.name || `Pays ${i + 1}`, quote: c.quote,
      origVerified: c.quote_verified ?? null,
      span: c.quote_span ?? null, verifyReason: c.verify_reason ?? null });
  });
  // hosting was a single object before 2026-08-15; files re-analysed since
  // carry one entry per named host, each with its own citation.
  const hostList = Array.isArray(tr.hosting)
    ? tr.hosting
    : tr.hosting?.provider ? [tr.hosting] : [];
  hostList.forEach((h: any, i: number) => {
    if (!h?.provider || !h?.quote) return;
    items.push({ key: `hebergeur/${i}`, axis: "ou", kind: "Hébergeur",
      label: h.provider, quote: h.quote,
      origVerified: h.quote_verified ?? null,
      span: h.quote_span ?? null, verifyReason: h.verify_reason ?? null });
  });

  // --- QUI: named recipients ---
  // A host is both "where the data sits" and "who receives it", and the model
  // says so twice: doctolib returns AWS, Thales and Google Cloud Platform in
  // transfers.hosting *and* in recipients as kind "hebergement", same citation,
  // same span. One fact, one verdict — the hosting card wins, since the OÙ axis
  // is where a volunteer expects to rule on a host.
  const hostedNames = new Set(hostList
    .filter((h: any) => h?.provider && h?.quote)
    .map((h: any) => normalizeVendorName(h.provider)));
  (inv.recipients || []).forEach((r: any, i: number) => {
    if (!r?.quote) return;
    if (r.kind === "hebergement" && hostedNames.has(normalizeVendorName(r.name || ""))) return;
    items.push({ key: `dest/${i}`, axis: "qui",
      kind: RECIPIENT_KIND_META[r.kind]?.label || "Autre prestataire",
      label: r.name || `Destinataire ${i + 1}`, quote: r.quote,
      origVerified: r.quote_verified ?? null,
      span: r.quote_span ?? null, verifyReason: r.verify_reason ?? null });
  });

  return items;
}

/**
 * Where a "right passage, wrong section" verdict can send the citation.
 *
 * Closed lists only, and only for the axes where "section" means something: a
 * country or a host has no rubric to be wrong about. Returning [] is the signal
 * that the reason takes no destination — the verdict is then recorded as before.
 */
export function redirectTargets(
  itemKey: string,
  meta: { CATEGORY_ORDER: string[]; CATEGORY_META: Record<string, { label: string }> }
): { value: string; label: string }[] {
  if (itemKey.startsWith("cat/") || itemKey.startsWith("purpose/")) {
    const current = itemKey.split("/")[1];
    return meta.CATEGORY_ORDER
      .filter((k) => k !== current && k !== "autre")
      .map((k) => ({ value: k, label: meta.CATEGORY_META[k]?.label || k }));
  }
  if (itemKey.startsWith("dest/")) {
    return RECIPIENT_KINDS.map((k) => ({ value: k, label: RECIPIENT_KIND_META[k]?.label || k }));
  }
  if (itemKey.startsWith("signal/")) {
    return SIGNAL_CRITERIA.map((k) => ({ value: k, label: SIGNAL_META[k]?.label || k }));
  }
  return [];
}

export interface EssentialOpts {
  /** A vendor already ruled on elsewhere costs nobody a second verdict (lot E). */
  knownVendor: (name: string) => boolean;
}

/**
 * Does this item deserve a human?
 *
 * The machine proves a passage *exists*; it cannot prove the passage is
 * *relevant*. So we ask a volunteer only where the machine is weak — signals,
 * unknown vendors, sensitive categories — and never about anything that will
 * not be published. Zalando: 11 items instead of 34.
 */
export function isEssential(item: InvItem, opts: EssentialOpts): boolean {
  // Not located = not published. Asking for a verdict on it spends volunteer
  // time on something no reader will ever see.
  if (item.origVerified !== true) return false;
  if (item.axis === "signalement") return true;
  if (item.key.startsWith("dest/") || item.key.startsWith("hebergeur/")) {
    return !opts.knownVendor(item.label);
  }
  if (item.key.startsWith("cat/")) {
    return SENSITIVE_CATEGORY_KEYS.has(item.key.slice(4));
  }
  return false;
}

/** Split into what the screen opens on, and what hides behind "voir le détail". */
export function splitEssentials(
  items: InvItem[], opts: EssentialOpts
): { essential: InvItem[]; rest: InvItem[] } {
  const essential: InvItem[] = [];
  const rest: InvItem[] = [];
  for (const it of items) (isEssential(it, opts) ? essential : rest).push(it);
  return { essential, rest };
}

export function axisProgress(
  items: InvItem[], sidecar: ReviewSidecar
): Record<AxisKey, { total: number; treated: number }> {
  const out = {
    signalement: { total: 0, treated: 0 },
    quoi: { total: 0, treated: 0 }, pourquoi: { total: 0, treated: 0 },
    ou: { total: 0, treated: 0 }, qui: { total: 0, treated: 0 },
  };
  items.forEach((it) => {
    out[it.axis].total++;
    if (sidecar.items[it.key]) out[it.axis].treated++;
  });
  return out;
}

/** Items the volunteer has not ruled on yet — what `needs_count` counts. */
/**
 * Fingerprint of the citation a verdict was cast on.
 *
 * Cheap and synchronous on purpose: crypto.subtle is async and absent from the
 * test environment, and this guards against a citation *changing*, not against
 * anyone forging one. Squashed first, so re-running the pipeline over the same
 * passage with different bullet markers does not raise a false alarm.
 */
export function quoteRef(quote: string): string {
  const s = squash(quote);
  let h = 2166136261;                       // FNV-1a, 32-bit
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `${(h >>> 0).toString(36)}.${s.length}`;
}

/**
 * Verdicts whose citation is no longer the one that was ruled on.
 *
 * A verdict written before fingerprints existed carries none: it is reported as
 * stale rather than trusted, because "we cannot tell" and "it is fine" are not
 * the same claim — and a wrong verdict published under a volunteer's name is
 * the one failure this whole screen exists to prevent.
 */
export function staleVerdicts(items: InvItem[], sidecar: ReviewSidecar): Set<string> {
  const out = new Set<string>();
  for (const it of items) {
    const v = sidecar.items[it.key];
    if (!v) continue;
    // A reviewer correction *is* the citation they ruled on, so it is what the
    // fingerprint was taken over.
    const ruled = v.corrected_quote || it.quote;
    if (v.quote_ref !== quoteRef(ruled)) out.add(it.key);
  }
  return out;
}

export function untreatedCount(items: InvItem[], sidecar: ReviewSidecar): number {
  return items.filter((it) => !sidecar.items[it.key]).length;
}

/**
 * Where the volunteer goes after ruling on `currentKey`.
 *
 * Follows the list from the card just ruled on and wraps around, so an item
 * scrolled past earlier comes back instead of being lost. `currentKey` is
 * treated as settled even when the sidecar handed in here predates the save —
 * it is the verdict that triggered the move.
 */
export function nextUntreatedKey(
  items: InvItem[], sidecar: ReviewSidecar, currentKey: string
): string | null {
  const i = items.findIndex((it) => it.key === currentKey);
  const ordered = i < 0 ? items : [...items.slice(i + 1), ...items.slice(0, i)];
  const hit = ordered.find((it) => it.key !== currentKey && !sidecar.items[it.key]);
  return hit ? hit.key : null;
}

/** A sidecar read from disk may predate any field added since it was written. */
export function normalizeSidecar(slug: string, raw: any): ReviewSidecar {
  return {
    slug: raw?.slug || slug,
    status: raw?.status || "needs_review",
    reviewers: raw?.reviewers || [],
    items: raw?.items || {},
    service_note: raw?.service_note || "",
    updated_at: raw?.updated_at || "",
    added_recipients: raw?.added_recipients || [],
  };
}

export function invGroup(item: InvItem, sidecar: ReviewSidecar): "validated" | "rejected" | "verified" | "needs" {
  const v = sidecar.items[item.key];
  if (v?.verdict === "validated") return "validated";
  if (v?.verdict === "rejected") return "rejected";
  return item.origVerified === true ? "verified" : "needs";
}



const LEGACY_STATUS: Record<string, PolicyStatus> = {
  needs_review: "relecture_en_attente",
  human_reviewed: "relu",
  published: "publie",
};

const POLICY_STATUSES = new Set<PolicyStatus>([
  "texte_indisponible", "analyse_en_attente", "relecture_en_attente", "relu", "publie",
]);

/** Read a stored status in either vocabulary. Anything unrecognised falls back
 *  to "awaiting review" — never to a state that claims work was done. */
export function normalizeStatus(raw: string | undefined | null): PolicyStatus {
  if (raw && POLICY_STATUSES.has(raw as PolicyStatus)) return raw as PolicyStatus;
  return LEGACY_STATUS[raw as string] ?? "relecture_en_attente";
}

/** Flags the pipeline sets when it could not produce reviewable text. */
const NO_TEXT_FLAGS = new Set(["extraction_insuffisante", "encodage_suspect"]);

/**
 * What a service's state actually is, pipeline and human combined.
 *
 * A human verdict always wins: someone read this, and a later refetch that
 * collapsed into a consent wall must not erase that. Otherwise the pipeline
 * decides, in the order the volunteer cares about — is there text at all, has
 * the LLM run, is anyone waiting.
 */
export function deriveStatus(
  svc: any, sidecar: { status?: ReviewStatus } | null | undefined
): PolicyStatus {
  const stored = sidecar?.status ? normalizeStatus(sidecar.status) : null;
  if (stored === "relu" || stored === "publie") return stored;

  const flags: string[] = svc?.review?.flags || [];
  const chars = svc?.source?.markdown_chars ?? 0;
  const pasted = svc?.source?.url_source === "colle_par_benevole";

  // A pasted policy carries the flag that motivated the paste until the next
  // pipeline pass clears it. The text is there now, so it is awaiting analysis,
  // not unavailable — sending a volunteer back to the paste box would be a loop.
  const unusable = !pasted && (flags.some((f) => NO_TEXT_FLAGS.has(f)) || chars < 500);
  if (unusable) return "texte_indisponible";
  if (!svc?.data_inventory) return "analyse_en_attente";
  return "relecture_en_attente";
}
