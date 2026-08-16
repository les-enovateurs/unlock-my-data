import type { ReviewSidecar } from "./reviewTypes";
import { RECIPIENT_KIND_META, SIGNAL_META } from "./policyTaxonomy";

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
}

// Mirror of _LIST_BULLET in the pipeline's verify.py. Policies bullet their
// data; the model returns one comma-joined sentence. The pipeline already
// accounts for that when it locates the quote, so a front that did not would
// throw away a perfectly good span and highlight nothing — measured on zalando,
// where "votre nom et votre prénom, vos coordonnées, …" is four bullets.
// Applied before the emphasis strip, which would otherwise eat "*" markers.
const LIST_BULLET = /\n[ \t]*(?:[-*+]|\d+[.)])[ \t]+/g;

const squash = (s: string) =>
  (s || "").replace(LIST_BULLET, ", ").replace(/[*_`]/g, "")
    .replace(/\s+/g, " ").trim().toLowerCase();

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
  return i < 0 ? null : [i, i + needle.length];
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
      origVerified: s.quote_verified ?? null,
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
  (inv.recipients || []).forEach((r: any, i: number) => {
    if (!r?.quote) return;
    items.push({ key: `dest/${i}`, axis: "qui",
      kind: RECIPIENT_KIND_META[r.kind]?.label || "Autre prestataire",
      label: r.name || `Destinataire ${i + 1}`, quote: r.quote,
      origVerified: r.quote_verified ?? null,
      span: r.quote_span ?? null, verifyReason: r.verify_reason ?? null });
  });

  return items;
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
export function untreatedCount(items: InvItem[], sidecar: ReviewSidecar): number {
  return items.filter((it) => !sidecar.items[it.key]).length;
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

