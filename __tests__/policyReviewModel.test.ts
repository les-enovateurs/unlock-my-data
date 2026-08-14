import {
  computeInvItems, invGroup, filterCounts, filterItems, critKey, pixelKey,
} from "@/components/review/policyReviewModel";
import type { ReviewSidecar } from "@/components/review/reviewTypes";

const META = { CATEGORY_ORDER: ["identite", "autre"], CATEGORY_META: { identite: { label: "Identité" } } };
const svc = {
  slug: "acme",
  data_inventory: {
    categories: { identite: { status: "oui", quote: "le nom", quote_verified: false } },
    legal_bases: [{ data: "identite", quote: "consentement", quote_verified: true }],
    transfers: { quote: "USA", quote_verified: true },
  },
};
const empty = (): ReviewSidecar => ({ slug: "acme", status: "needs_review", reviewers: [], items: {}, service_note: "", updated_at: "", added_recipients: [] });

describe("policyReviewModel", () => {
  it("builds inventory items with stable keys (no slug prefix)", () => {
    const items = computeInvItems(svc, META);
    expect(items.map((i) => i.key)).toEqual(["cat/identite", "base/0", "transfert"]);
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
    expect(c).toEqual({ needs: 0, rejected: 0, verified: 3, all: 3 });
  });
  it("filterItems needs returns only needs", () => {
    const items = computeInvItems(svc, META);
    expect(filterItems(items, empty(), "needs").map((i) => i.key)).toEqual(["cat/identite"]);
  });
  it("key builders", () => {
    expect(critKey("cookies", "ck_x")).toBe("crit/cookies/ck_x");
    expect(pixelKey(2)).toBe("pixel/2");
  });
});
