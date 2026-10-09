import { parseTransferCountries } from "@/lib/map/country-coordinates";

describe("parseTransferCountries", () => {
  // The schema stores destinations as an array since #424; the map and radar
  // silently went blank when the parser only accepted strings.
  it("reads the array the schema requires", () => {
    expect(parseTransferCountries(["États-Unis", "Royaume-Uni"])).toEqual(
      parseTransferCountries("États-Unis, Royaume-Uni"),
    );
    expect(parseTransferCountries(["États-Unis", "Royaume-Uni"])).toContain("us");
  });

  it("treats empty and unspecified values as no destination", () => {
    expect(parseTransferCountries([])).toEqual([]);
    expect(parseTransferCountries([""])).toEqual([]);
    expect(parseTransferCountries(["Non indiqué"])).toEqual([]);
    expect(parseTransferCountries(["Not specified"], "en")).toEqual([]);
  });
});
