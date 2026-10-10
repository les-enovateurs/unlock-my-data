import { parseTransferCountries, getCountryByCode } from "@/lib/map/country-coordinates";

describe("parseTransferCountries", () => {
  it("resolves French and English labels to the same codes", () => {
    expect(parseTransferCountries(["États-Unis", "Royaume-Uni"])).toEqual(["us", "gb"]);
    expect(parseTransferCountries(["United States", "United Kingdom"])).toEqual(["us", "gb"]);
  });

  it("keeps regions and caveats off the map", () => {
    const codes = parseTransferCountries(["Union européenne", "Autres pays non listés", "Non indiqué"]);
    expect(codes).toEqual(["eu", "other", "unspecified"]);
    expect(codes.map(getCountryByCode).filter(Boolean)).toEqual([]);
  });
});
