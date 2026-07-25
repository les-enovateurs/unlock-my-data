import { buildFicheMerge } from "@/components/review/ficheReviewMerge";
import type { ReviewSidecar } from "@/components/review/reviewTypes";

const sidecar = (status: any, items: any): ReviewSidecar => ({
  slug: "acme", status, reviewers: [], items, service_note: "", updated_at: "",
});

describe("buildFicheMerge", () => {
  it("null sidecar → not published, nothing rejected", () => {
    const m = buildFicheMerge(null);
    expect(m.published).toBe(false);
    expect(m.isRejected("crit/cookies/x")).toBe(false);
  });
  it("needs_review → not published even with verdicts", () => {
    const m = buildFicheMerge(sidecar("needs_review", { "crit/cookies/x": { verdict: "rejected", reason: "hallucinated", note: "", by: "", at: "" } }));
    expect(m.published).toBe(false);
    expect(m.isRejected("crit/cookies/x")).toBe(false);
  });
  it("published → rejected/validated read from sidecar", () => {
    const m = buildFicheMerge(sidecar("published", {
      "crit/cookies/x": { verdict: "rejected", reason: "hallucinated", note: "", by: "", at: "" },
      "pixel/0": { verdict: "validated", reason: null, note: "", by: "", at: "" },
    }));
    expect(m.published).toBe(true);
    expect(m.isRejected("crit/cookies/x")).toBe(true);
    expect(m.isValidated("pixel/0")).toBe(true);
    expect(m.isValidated("crit/cookies/x")).toBe(false);
  });
});
