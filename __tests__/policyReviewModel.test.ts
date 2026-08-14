import {
  computeInvItems, invGroup, filterCounts, filterItems,
  axisProgress, untreatedCount, normalizeSidecar, AXIS_ORDER,
} from "@/components/review/policyReviewModel";
import type { ReviewSidecar } from "@/components/review/reviewTypes";
import * as model from "@/components/review/policyReviewModel";
import * as taxo from "@/components/review/policyTaxonomy";

const META = { CATEGORY_ORDER: ["identite", "autre"], CATEGORY_META: { identite: { label: "Identité" } } };
const svc = {
  slug: "acme",
  data_inventory: {
    categories: {
      identite: {
        status: "oui", quote: "le nom", quote_verified: false,
        purpose: "Gestion du compte", purpose_quote: "afin de gérer votre compte",
        purpose_quote_verified: true,
      },
    },
    legal_bases: [{ data: "identite", quote: "consentement", quote_verified: true }],
    transfers: {
      outside_eu: "oui",
      quote: "USA", quote_verified: true,
      countries: [{ name: "États-Unis", quote: "vers les États-Unis", quote_verified: true }],
      hosting: { provider: "AWS", quote: "hébergé par AWS", quote_verified: true },
    },
    recipients: [
      { name: "Criteo", kind: "publicite", is_pixel: false, quote: "avec Criteo", quote_verified: true },
    ],
  },
};
const empty = (): ReviewSidecar => ({ slug: "acme", status: "needs_review", reviewers: [], items: {}, service_note: "", updated_at: "", added_recipients: [] });

describe("policyReviewModel", () => {
  it("builds inventory items with stable keys (no slug prefix)", () => {
    const items = computeInvItems(svc, META);
    expect(items.map((i) => i.key)).toEqual([
      "cat/identite", "purpose/identite", "base/0", "transfert", "pays/0", "hebergeur", "dest/0",
    ]);
  });
  it("skips 'autre' and missing categories", () => {
    const items = computeInvItems(svc, META);
    expect(items.some((i) => i.key.includes("autre"))).toBe(false);
  });
  it("invGroup: needs when unverified & no verdict", () => {
    expect(invGroup(computeInvItems(svc, META)[0], empty())).toBe("needs");
  });
  it("invGroup: verified when origVerified true", () => {
    const transfert = computeInvItems(svc, META).find((i) => i.key === "transfert")!;
    expect(invGroup(transfert, empty())).toBe("verified");
  });
  it("invGroup: sidecar verdict wins", () => {
    const s = empty(); s.items["cat/identite"] = { verdict: "validated", reason: null, note: "", by: "x", at: "" };
    expect(invGroup(computeInvItems(svc, META)[0], s)).toBe("validated");
  });
  it("filterCounts groups validated under verified", () => {
    const s = empty(); s.items["cat/identite"] = { verdict: "validated", reason: null, note: "", by: "x", at: "" };
    const c = filterCounts(computeInvItems(svc, META), s);
    expect(c).toEqual({ needs: 0, rejected: 0, verified: 7, all: 7 });
  });
  it("filterItems needs returns only needs", () => {
    const items = computeInvItems(svc, META);
    expect(filterItems(items, empty(), "needs").map((i) => i.key)).toEqual(["cat/identite"]);
  });
  it("no longer exposes the CNIL grid key builders", () => {
    expect((model as any).critKey).toBeUndefined();
    expect((model as any).pixelKey).toBeUndefined();
    expect((taxo as any).DOMAIN_ORDER).toBeUndefined();
    expect((taxo as any).DOMAIN_META).toBeUndefined();
  });
});

describe("policyReviewModel — 4 axes", () => {
  it("emits one item per verifiable assertion, in axis order", () => {
    expect(computeInvItems(svc, META).map((i) => i.key)).toEqual([
      "cat/identite", "purpose/identite", "base/0",
      "transfert", "pays/0", "hebergeur", "dest/0",
    ]);
  });

  it("tags every item with its axis", () => {
    const byKey = Object.fromEntries(computeInvItems(svc, META).map((i) => [i.key, i.axis]));
    expect(byKey).toEqual({
      "cat/identite": "quoi", "purpose/identite": "quoi", "base/0": "pourquoi",
      "transfert": "ou", "pays/0": "ou", "hebergeur": "ou", "dest/0": "qui",
    });
    expect(AXIS_ORDER).toEqual(["quoi", "pourquoi", "ou", "qui"]);
  });

  it("carries the purpose quote and its own verification flag", () => {
    const p = computeInvItems(svc, META).find((i) => i.key === "purpose/identite")!;
    expect(p.quote).toBe("afin de gérer votre compte");
    expect(p.origVerified).toBe(true);
    expect(p.label).toContain("Identité");
  });

  it("names countries, host and recipients from their own fields", () => {
    const items = computeInvItems(svc, META);
    expect(items.find((i) => i.key === "pays/0")!.label).toBe("États-Unis");
    expect(items.find((i) => i.key === "hebergeur")!.label).toBe("AWS");
    const dest = items.find((i) => i.key === "dest/0")!;
    expect(dest.label).toBe("Criteo");
    expect(dest.kind).toBe("Publicité / régie");
  });

  it("skips a purpose with no quote", () => {
    const bare = { data_inventory: { categories: { identite: { status: "oui", quote: "le nom" } } } };
    expect(computeInvItems(bare, META).map((i) => i.key)).toEqual(["cat/identite"]);
  });

  it("ignores legacy string countries until the lot-3 migration", () => {
    const legacy = {
      data_inventory: {
        categories: {}, legal_bases: [],
        transfers: { outside_eu: "oui", quote: "", countries: ["États-Unis", "Chine"] },
      },
    };
    expect(computeInvItems(legacy, META)).toEqual([]);
  });

  it("counts progress per axis", () => {
    const s = normalizeSidecar("acme", null);
    s.items["cat/identite"] = { verdict: "validated", reason: null, note: "", by: "x", at: "" };
    const p = axisProgress(computeInvItems(svc, META), s);
    expect(p.quoi).toEqual({ total: 2, treated: 1 });
    expect(p.ou).toEqual({ total: 3, treated: 0 });
    expect(untreatedCount(computeInvItems(svc, META), s)).toBe(6);
  });

  it("normalizes a sidecar that predates added_recipients", () => {
    const s = normalizeSidecar("acme", { slug: "acme", status: "published", items: {} });
    expect(s.added_recipients).toEqual([]);
    expect(s.reviewers).toEqual([]);
    expect(s.status).toBe("published");
  });
});
