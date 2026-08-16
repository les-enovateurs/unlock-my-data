import { isEssential, splitEssentials } from "../policyReviewModel";
import type { InvItem } from "../policyReviewModel";

const item = (over: Partial<InvItem> = {}): InvItem => ({
  key: "cat/contact", axis: "quoi", kind: "Catégorie", label: "Contact",
  quote: "q", origVerified: true, span: [0, 1], verifyReason: null, ...over,
});

const OPTS = { knownVendor: (n: string) => n === "Google" };

test("signals are always essential", () => {
  expect(isEssential(item({ key: "signal/0", axis: "signalement" }), OPTS)).toBe(true);
});

test("a vendor nobody has ruled on is essential; a known one is not", () => {
  expect(isEssential(item({ key: "dest/0", axis: "qui", label: "Criteo" }), OPTS)).toBe(true);
  expect(isEssential(item({ key: "dest/1", axis: "qui", label: "Google" }), OPTS)).toBe(false);
});

test("hosting providers are vendors too", () => {
  expect(isEssential(item({ key: "hebergeur/0", axis: "ou", label: "OVH" }), OPTS)).toBe(true);
  expect(isEssential(item({ key: "hebergeur/1", axis: "ou", label: "Google" }), OPTS)).toBe(false);
});

test("sensitive categories are essential, ordinary ones are not", () => {
  expect(isEssential(item({ key: "cat/biometrie" }), OPTS)).toBe(true);
  expect(isEssential(item({ key: "cat/donnees_sensibles" }), OPTS)).toBe(true);
  expect(isEssential(item({ key: "cat/mineurs" }), OPTS)).toBe(true);
  expect(isEssential(item({ key: "cat/contact" }), OPTS)).toBe(false);
});

test("a purpose on a sensitive category is not itself essential", () => {
  // The category carries the claim; its purpose is a second-order detail.
  expect(isEssential(item({ key: "purpose/biometrie" }), OPTS)).toBe(false);
});

test("an unlocated item is never essential — it will not be published", () => {
  const dead = { origVerified: false as const, span: null };
  expect(isEssential(item({ key: "signal/0", axis: "signalement", ...dead }), OPTS)).toBe(false);
  expect(isEssential(item({ key: "dest/0", axis: "qui", label: "Criteo", origVerified: null, span: null }), OPTS)).toBe(false);
  expect(isEssential(item({ key: "cat/biometrie", ...dead }), OPTS)).toBe(false);
});

test("split keeps every item in exactly one bucket, order preserved", () => {
  const items = [
    item({ key: "signal/0", axis: "signalement" }),
    item({ key: "cat/contact" }),
    item({ key: "dest/0", axis: "qui", label: "Criteo" }),
    item({ key: "base/0", axis: "pourquoi", origVerified: false, span: null }),
  ];
  const { essential, rest } = splitEssentials(items, OPTS);
  expect(essential.map((i) => i.key)).toEqual(["signal/0", "dest/0"]);
  expect(rest.map((i) => i.key)).toEqual(["cat/contact", "base/0"]);
  expect(essential.length + rest.length).toBe(items.length);
});

test("with no vendor registry every vendor is unknown, so essential", () => {
  const o = { knownVendor: () => false };
  expect(isEssential(item({ key: "dest/0", axis: "qui", label: "Google" }), o)).toBe(true);
});
