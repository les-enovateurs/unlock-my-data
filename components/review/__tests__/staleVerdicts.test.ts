import { quoteRef, staleVerdicts } from "../policyReviewModel";
import type { ReviewSidecar } from "../reviewTypes";

const QUOTE = "Nous collectons votre adresse e-mail.";
const item = (key: string, quote: string) => ({ key, quote }) as any;
const side = (items: Record<string, any>): ReviewSidecar =>
  ({ slug: "s", status: "needs_review", items } as any);

test("a verdict on the citation still shown is not stale", () => {
  const s = side({ "signal/0": { verdict: "validated", quote_ref: quoteRef(QUOTE) } });
  expect(staleVerdicts([item("signal/0", QUOTE)], s).size).toBe(0);
});

test("a re-analysis that moved the citation flags the verdict", () => {
  // doctolib: signal/2 went from "conservation_indefinie" to
  // "inference_sensible" — same key, different passage entirely.
  const s = side({ "signal/2": { verdict: "validated", quote_ref: quoteRef(QUOTE) } });
  expect([...staleVerdicts([item("signal/2", "Doctolib achète des bases de tiers.")], s)])
    .toEqual(["signal/2"]);
});

test("a verdict written before fingerprints existed is flagged, not trusted", () => {
  const s = side({ "cat/identite": { verdict: "validated" } });
  expect(staleVerdicts([item("cat/identite", QUOTE)], s).size).toBe(1);
});

test("a reviewer correction is what the fingerprint is taken over", () => {
  const fixed = "Nous collectons votre adresse électronique.";
  const s = side({ "cat/identite": { verdict: "validated", corrected_quote: fixed, quote_ref: quoteRef(fixed) } });
  expect(staleVerdicts([item("cat/identite", QUOTE)], s).size).toBe(0);
});

test("bullet markers alone do not raise a false alarm", () => {
  // The pipeline re-emits the same passage with different list markers; the
  // fingerprint is taken over the squashed text, as spans are.
  const s = side({ "cat/x": { verdict: "validated", quote_ref: quoteRef("- a\n- b") } });
  expect(staleVerdicts([item("cat/x", "1. a\n2. b")], s).size).toBe(0);
});

test("untreated items are none of this function's business", () => {
  expect(staleVerdicts([item("cat/x", QUOTE)], side({})).size).toBe(0);
});
