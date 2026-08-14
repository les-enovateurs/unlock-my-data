import { REJECT_REASONS } from "@/components/review/reviewTypes";
import dict from "@/i18n/PolicyReview.json";
import { RECIPIENT_KINDS, RECIPIENT_KIND_META } from "@/components/review/policyTaxonomy";
import type { ReviewSidecar } from "@/components/review/reviewTypes";

describe("reject reasons", () => {
  it("keeps exactly the three reasons a volunteer can explain", () => {
    expect(REJECT_REASONS).toEqual([
      "citation_absente", "hors_sujet", "mauvaise_categorie",
    ]);
  });

  it("is translated in both languages", () => {
    for (const lang of ["fr", "en"] as const) {
      for (const r of REJECT_REASONS) {
        expect((dict as any)[lang][`reason_${r}`]).toBeTruthy();
      }
    }
  });

  it("drops the retired keys from the dictionaries", () => {
    const retired = ["reason_hallucinated", "reason_wrong_category",
      "reason_partial_or_stitched", "reason_out_of_context",
      "reason_translation", "reason_other"];
    for (const lang of ["fr", "en"] as const) {
      for (const k of retired) expect((dict as any)[lang][k]).toBeUndefined();
    }
  });
});

describe("recipient taxonomy", () => {
  it("mirrors RECIPIENT_KINDS from inventory.py", () => {
    expect([...RECIPIENT_KINDS]).toEqual([
      "hebergement", "analytics", "publicite", "paiement", "support", "autre",
    ]);
  });

  it("labels every kind", () => {
    for (const k of RECIPIENT_KINDS) expect(RECIPIENT_KIND_META[k].label).toBeTruthy();
  });

  it("carries volunteer-added recipients on the sidecar", () => {
    const s: ReviewSidecar = {
      slug: "acme", status: "needs_review", reviewers: [], items: {},
      service_note: "", updated_at: "",
      added_recipients: [{
        name: "Criteo", kind: "publicite",
        quote: "Nous partageons ces données avec Criteo",
        by: "jeremy", at: "2026-08-13T10:00:00.000Z",
      }],
    };
    expect(s.added_recipients[0].name).toBe("Criteo");
  });
});
