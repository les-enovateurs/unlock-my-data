import { compareVersions } from "../apkLab";

describe("compareVersions", () => {
  test("orders numerically, not as strings", () => {
    expect(compareVersions("5.12.0", "5.9.0")).toBeGreaterThan(0);
  });

  test("a longer version with the same prefix is newer", () => {
    expect(compareVersions("1.4.4.192", "1.4.4")).toBeGreaterThan(0);
  });

  test("a missing version is older than any version", () => {
    expect(compareVersions(undefined, "1.0")).toBeLessThan(0);
  });

  test("equal versions compare equal", () => {
    expect(compareVersions("2.1.0", "2.1.0")).toBe(0);
  });
});
