import { toEasyAccess } from "../formOptions";

describe("toEasyAccess", () => {
  it("keeps integers from 1 to 5", () => {
    expect(toEasyAccess(4)).toBe(4);
  });

  it("converts the legacy string formats", () => {
    expect(toEasyAccess("4")).toBe(4);
    expect(toEasyAccess("4/5")).toBe(4);
  });

  it("maps unrated or out-of-range values to null", () => {
    expect(toEasyAccess(0)).toBeNull();
    expect(toEasyAccess("")).toBeNull();
    expect(toEasyAccess(undefined)).toBeNull();
    expect(toEasyAccess(6)).toBeNull();
  });
});
