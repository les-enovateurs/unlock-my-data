import { REJECT_REASONS } from "@/components/review/reviewTypes";
import dict from "@/i18n/PolicyReview.json";

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
