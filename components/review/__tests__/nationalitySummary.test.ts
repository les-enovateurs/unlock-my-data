import { buildNationalitySummary } from "../nationalitySummary";

describe("buildNationalitySummary", () => {
  test("returns empty string when no values", () => {
    expect(buildNationalitySummary({})).toBe("");
  });

  test("formats nationality with country and code", () => {
    expect(
      buildNationalitySummary({
        nationality: "Francaise",
        countryName: "France",
        countryCode: "fr"
      })
    ).toBe("Francaise - France (fr)");
  });

  test("falls back to country name when nationality is missing", () => {
    expect(buildNationalitySummary({ countryName: "Canada", countryCode: "ca" })).toBe(
      "Canada - ca"
    );
  });

  test("keeps single value when only one is provided", () => {
    expect(buildNationalitySummary({ countryCode: "us" })).toBe("us");
  });
});
