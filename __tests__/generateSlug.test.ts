import { generateSlug } from "@/tools/github";

describe("generateSlug", () => {
  it.each([
    ["Marmiton ", "marmiton"],
    ["  Candy  Crush ", "candy-crush"],
    ["UnisCité", "uniscite"],
    ["Réglo Mobile", "reglo-mobile"],
    ["Pass'Sport", "pass-sport"],
  ])("%j → %s", (name, slug) => {
    expect(generateSlug(name)).toBe(slug);
  });
});
