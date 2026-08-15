import type { ReviewSidecar } from "./reviewTypes";
import { RECIPIENT_KIND_META } from "./policyTaxonomy";

/** The four questions the review answers: what, why, where, who. */
export type AxisKey = "quoi" | "pourquoi" | "ou" | "qui";
export const AXIS_ORDER: AxisKey[] = ["quoi", "pourquoi", "ou", "qui"];

export interface InvItem {
  key: string; axis: AxisKey; kind: string; label: string;
  quote: string; origVerified: boolean | null;
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

  // --- QUOI: collected categories, each with its own purpose ---
  meta.CATEGORY_ORDER.forEach((key) => {
    if (key === "autre") return;
    const cat = inv.categories && inv.categories[key];
    if (!cat || cat.status !== "oui") return;
    const label = meta.CATEGORY_META[key]?.label || key;
    if (cat.quote) {
      items.push({ key: `cat/${key}`, axis: "quoi", kind: "Catégorie de données",
        label, quote: cat.quote, origVerified: cat.quote_verified ?? null });
    }
    // A purpose is published only when its own quote checks out, so it is
    // reviewable on its own — rejecting it must not reject the category.
    if (cat.purpose_quote) {
      items.push({ key: `purpose/${key}`, axis: "quoi", kind: "Finalité",
        label: `Finalité — ${label}`, quote: cat.purpose_quote,
        origVerified: cat.purpose_quote_verified ?? null });
    }
  });

  // --- POURQUOI: legal bases ---
  (inv.legal_bases || []).forEach((lb: any, i: number) => {
    if (!lb?.quote) return;
    items.push({ key: `base/${i}`, axis: "pourquoi", kind: "Base légale",
      label: humanizeLegalData(lb.data, meta.CATEGORY_META), quote: lb.quote,
      origVerified: lb.quote_verified ?? null });
  });

  // --- OÙ: outside-EU statement, destination countries, hosting provider ---
  const tr = inv.transfers || {};
  if (tr.quote) {
    items.push({ key: "transfert", axis: "ou", kind: "Transferts hors UE",
      label: "Transferts hors UE", quote: tr.quote,
      origVerified: tr.quote_verified ?? null });
  }
  (tr.countries || []).forEach((c: any, i: number) => {
    // Pre-migration files store bare strings here; no quote, nothing to review.
    if (!c || typeof c === "string" || !c.quote) return;
    items.push({ key: `pays/${i}`, axis: "ou", kind: "Pays destinataire",
      label: c.name || `Pays ${i + 1}`, quote: c.quote,
      origVerified: c.quote_verified ?? null });
  });
  const host = tr.hosting || {};
  if (host.provider && host.quote) {
    items.push({ key: "hebergeur", axis: "ou", kind: "Hébergeur",
      label: host.provider, quote: host.quote,
      origVerified: host.quote_verified ?? null });
  }

  // --- QUI: named recipients ---
  (inv.recipients || []).forEach((r: any, i: number) => {
    if (!r?.quote) return;
    items.push({ key: `dest/${i}`, axis: "qui",
      kind: RECIPIENT_KIND_META[r.kind]?.label || "Autre prestataire",
      label: r.name || `Destinataire ${i + 1}`, quote: r.quote,
      origVerified: r.quote_verified ?? null });
  });

  return items;
}

export function axisProgress(
  items: InvItem[], sidecar: ReviewSidecar
): Record<AxisKey, { total: number; treated: number }> {
  const out = {
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

