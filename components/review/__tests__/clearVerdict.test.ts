import { untreatedCount, nextUntreatedKey } from "../policyReviewModel";
import type { ReviewSidecar } from "../reviewTypes";

const items = ["a", "b", "c"].map((k) => ({ key: k })) as any;
const sidecar = (keys: string[]): ReviewSidecar => ({
  slug: "s", status: "needs_review",
  items: Object.fromEntries(keys.map((k) => [k, { verdict: "rejected", reason: "doublon" }])),
} as any);

/** clearVerdict removes the entry; these assert what the rest of the screen
 *  then derives from it — an undone card is untreated again, and the auto-
 *  advance offers it. */
test("an undone card counts as untreated again", () => {
  expect(untreatedCount(items, sidecar(["a", "b"]))).toBe(1);
  const undone = sidecar(["a", "b"]);
  delete (undone.items as any).b;
  expect(untreatedCount(items, undone)).toBe(2);
});

test("an undone card is offered again by the auto-advance", () => {
  const undone = sidecar(["a", "b", "c"]);
  delete (undone.items as any).c;
  expect(nextUntreatedKey(items, undone, "a")).toBe("c");
});
