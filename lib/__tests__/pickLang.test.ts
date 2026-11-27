import { pickLang } from "../pickLang";

describe("pickLang", () => {
  const renamed = { why_fr: "Pourquoi", why_en: "Why" };
  const legacy = { comments: "Remarque", comments_en: "" };

  test("returns the requested language", () => {
    expect(pickLang(renamed, "why", "fr")).toBe("Pourquoi");
    expect(pickLang(renamed, "why", "en")).toBe("Why");
  });

  test("reads French from the bare name until the field is renamed", () => {
    expect(pickLang(legacy, "comments", "fr")).toBe("Remarque");
  });

  test("falls back to French when English is empty", () => {
    expect(pickLang(legacy, "comments", "en")).toBe("Remarque");
  });

  test("falls back to English when French is empty", () => {
    expect(pickLang({ quote_fr: "", quote_en: "Quote" }, "quote", "fr")).toBe("Quote");
  });

  test("returns undefined when nothing is filled", () => {
    expect(pickLang({ a: "", a_en: "" }, "a", "en")).toBeUndefined();
    expect(pickLang(null as { a?: string; a_en?: string } | null, "a", "fr")).toBeUndefined();
  });
});
