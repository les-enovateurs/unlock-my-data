import { limitText } from "../textLimits";

describe("limitText", () => {
  test("returns original value when maxLength is undefined", () => {
    expect(limitText("hello")).toBe("hello");
  });

  test("returns original value when maxLength is negative", () => {
    expect(limitText("hello", -1)).toBe("hello");
  });

  test("trims value when maxLength is set", () => {
    expect(limitText("hello", 3)).toBe("hel");
  });
});
