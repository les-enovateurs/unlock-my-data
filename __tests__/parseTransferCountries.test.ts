import {
  parseTransferCountries,
  getCountryByCode,
  toTransferCode,
  transferCountryName,
} from "@/lib/map/country-coordinates";

describe("parseTransferCountries", () => {
  it("resolves French and English labels to the same codes", () => {
    expect(parseTransferCountries(["États-Unis", "Royaume-Uni"])).toEqual(["us", "gb"]);
    expect(parseTransferCountries(["United States", "United Kingdom"])).toEqual(["us", "gb"]);
  });

  it("accepts codes, so fiches can migrate one at a time (#367)", () => {
    expect(parseTransferCountries(["us", "États-Unis", "world"])).toEqual(["us", "us", "world"]);
  });

  it("keeps regions and caveats off the map", () => {
    const codes = parseTransferCountries(["Union européenne", "Autres pays non listés", "Non indiqué"]);
    expect(codes).toEqual(["eu", "other", "unspecified"]);
    expect(codes.map(getCountryByCode).filter(Boolean)).toEqual([]);
  });
});

describe("toTransferCode / transferCountryName", () => {
  it("normalises labels to codes and keeps unknown values intact", () => {
    expect(["États-Unis", "United Kingdom", "ma", "Atlantide"].map(toTransferCode)).toEqual([
      "us", "gb", "ma", "Atlantide",
    ]);
  });

  it("names a code or a label in the page language", () => {
    expect(transferCountryName("us", "fr")).toBe("États-Unis");
    expect(transferCountryName("États-Unis", "en")).toBe("United States");
    expect(transferCountryName("Atlantide", "en")).toBe("Atlantide");
  });
});
