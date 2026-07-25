import {
  ANONYMOUS,
  normalizeReviewerName,
  resolveUpdateAuthor,
  reviewSaveBase,
} from "@/components/review/reviewerIdentity";

describe("normalizeReviewerName", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeReviewerName("  Solène  ")).toBe("Solène");
  });

  it("returns an empty string for nullish or blank input", () => {
    expect(normalizeReviewerName(undefined)).toBe("");
    expect(normalizeReviewerName(null)).toBe("");
    expect(normalizeReviewerName("   ")).toBe("");
  });
});

describe("resolveUpdateAuthor", () => {
  it("credits the reviewer who typed their name", () => {
    expect(resolveUpdateAuthor(" Jérémy ")).toBe("Jérémy");
  });

  // Regression: an update used to be attributed to the fiche creator
  // (`reviewerName || fullData.created_by`), crediting someone who did not
  // touch the fiche. An unknown reviewer must stay anonymous instead.
  it("never inherits another identity when the reviewer name is missing", () => {
    expect(resolveUpdateAuthor("", { created_by: "Alice" })).toBe(ANONYMOUS);
    expect(resolveUpdateAuthor("   ", { created_by: "Alice" })).toBe(ANONYMOUS);
    expect(resolveUpdateAuthor(undefined)).toBe(ANONYMOUS);
  });
});

describe("reviewSaveBase", () => {
  it("targets the save bridge on the host serving the dev page", () => {
    expect(reviewSaveBase("192.168.1.14")).toBe("http://192.168.1.14:3002");
    expect(reviewSaveBase("localhost")).toBe("http://localhost:3002");
  });

  it("falls back to localhost when no host is known (SSR)", () => {
    expect(reviewSaveBase("")).toBe("http://localhost:3002");
  });
});
