import { parseProblemLine, suggestedAction } from "../scripts/policyLogParser.mjs";

describe("parseProblemLine", () => {
  it("ok lines → null", () => {
    expect(parseProblemLine("bfm-tv                         ok (needs_review, 26226 chars)")).toBeNull();
  });
  it("no-url", () => {
    expect(parseProblemLine("boulanger                      no-url")).toEqual({ slug: "boulanger", status: "no-url", detail: "" });
  });
  it("low-content with chars", () => {
    expect(parseProblemLine("alibaba                        low-content (149 chars) -> needs_review")).toEqual({ slug: "alibaba", status: "low-content", detail: "149 chars" });
  });
  it("error", () => {
    expect(parseProblemLine("fnac                           ERROR: 403 Client Error: Forbidden for url: https://x")).toEqual({ slug: "fnac", status: "error", detail: "403 Client Error: Forbidden for url: https://x" });
  });
  it("skip → null (already analysed, not a problem)", () => {
    expect(parseProblemLine("app-store                      skip (déjà analysé, --force pour refaire)")).toBeNull();
  });
  it("done marker → null", () => {
    expect(parseProblemLine("done marker: 0")).toBeNull();
  });
  it("slugs bogus line → null", () => {
    expect(parseProblemLine("slugs                          ERROR: 'list' object has no attribute 'get'")).toBeNull();
  });
});

describe("suggestedAction", () => {
  it("no-url → fix_url", () => { expect(suggestedAction("no-url", "")).toBe("fix_url"); });
  it("error → fix_url", () => { expect(suggestedAction("error", "403")).toBe("fix_url"); });
  it("low-content 0 chars → fix_url", () => { expect(suggestedAction("low-content", "0 chars")).toBe("fix_url"); });
  it("low-content 149 chars → re_extract", () => { expect(suggestedAction("low-content", "149 chars")).toBe("re_extract"); });
});
