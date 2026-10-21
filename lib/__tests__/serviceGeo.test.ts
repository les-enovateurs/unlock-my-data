import { localizedCountry } from "@/lib/geo/serviceGeo";

describe("localizedCountry", () => {
  it("reads the static table, not the ICU build", () => {
    expect(localizedCountry("en", "HK")).toBe("Hong Kong");
    expect(localizedCountry("fr", "us", "United States")).toBe("États-Unis");
  });

  it("falls back to the stored name, then the code", () => {
    expect(localizedCountry("fr", "zz", "Nowhere")).toBe("Nowhere");
    expect(localizedCountry("fr", "zz")).toBe("zz");
    expect(localizedCountry("fr", null, null)).toBe("");
  });
});
