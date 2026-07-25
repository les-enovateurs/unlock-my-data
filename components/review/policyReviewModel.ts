import type { ReviewSidecar } from "./reviewTypes";

export interface InvItem {
  key: string; kind: string; label: string; quote: string; origVerified: boolean | null;
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
  meta.CATEGORY_ORDER.forEach((key) => {
    if (key === "autre") return;
    const cat = inv.categories && inv.categories[key];
    if (cat && cat.status === "oui" && cat.quote) {
      items.push({ key: `cat/${key}`, kind: "Catégorie de données", label: meta.CATEGORY_META[key].label, quote: cat.quote, origVerified: cat.quote_verified ?? null });
    }
  });
  (inv.legal_bases || []).forEach((lb: any, i: number) => {
    if (lb.quote) items.push({ key: `base/${i}`, kind: "Base légale", label: humanizeLegalData(lb.data, meta.CATEGORY_META), quote: lb.quote, origVerified: lb.quote_verified ?? null });
  });
  if (inv.transfers && inv.transfers.quote) {
    items.push({ key: `transfert`, kind: "Transferts hors UE", label: "Transferts hors UE", quote: inv.transfers.quote, origVerified: inv.transfers.quote_verified ?? null });
  }
  return items;
}

export function invGroup(item: InvItem, sidecar: ReviewSidecar): "validated" | "rejected" | "verified" | "needs" {
  const v = sidecar.items[item.key];
  if (v?.verdict === "validated") return "validated";
  if (v?.verdict === "rejected") return "rejected";
  return item.origVerified === true ? "verified" : "needs";
}

export function filterCounts(items: InvItem[], sidecar: ReviewSidecar) {
  const c = { needs: 0, rejected: 0, verified: 0, all: items.length };
  items.forEach((it) => {
    const g = invGroup(it, sidecar);
    if (g === "validated") c.verified++;
    else if (g === "verified") c.verified++;
    else if (g === "rejected") c.rejected++;
    else c.needs++;
  });
  return c;
}

export function filterItems(
  items: InvItem[], sidecar: ReviewSidecar, filter: "needs" | "rejected" | "verified" | "all"
): InvItem[] {
  return items.filter((it) => {
    const g = invGroup(it, sidecar);
    if (filter === "all") return true;
    if (filter === "verified") return g === "verified" || g === "validated";
    return g === filter;
  });
}

export function critKey(domainKey: string, critId: string): string { return `crit/${domainKey}/${critId}`; }
export function pixelKey(i: number): string { return `pixel/${i}`; }
