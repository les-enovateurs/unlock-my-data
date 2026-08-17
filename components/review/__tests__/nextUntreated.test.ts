import { nextUntreatedKey } from "../policyReviewModel";
import type { ReviewSidecar } from "../reviewTypes";

const items = ["a", "b", "c", "d"].map((k) => ({ key: k })) as any;
const sidecarWith = (keys: string[]): ReviewSidecar => ({
  slug: "s", status: "needs_review",
  items: Object.fromEntries(keys.map((k) => [k, { verdict: "validated" }])),
} as any);

test("moves to the next card still untreated", () => {
  expect(nextUntreatedKey(items, sidecarWith([]), "a")).toBe("b");
});

test("skips cards already ruled on", () => {
  expect(nextUntreatedKey(items, sidecarWith(["b", "c"]), "a")).toBe("d");
});

test("wraps around to a card left behind earlier", () => {
  expect(nextUntreatedKey(items, sidecarWith(["c", "d"]), "c")).toBe("a");
});

test("the card just ruled on is never the answer, sidecar or not", () => {
  expect(nextUntreatedKey(items, sidecarWith(["a", "b", "d"]), "c")).toBeNull();
});

test("an unknown key walks the list from the start", () => {
  expect(nextUntreatedKey(items, sidecarWith(["a"]), "zzz")).toBe("b");
});
