import { resolveSpan } from "../policyReviewModel";

const TEXT = "Préambule. Nous collectons votre adresse e-mail. Fin.";
const QUOTE = "Nous collectons votre adresse e-mail.";

test("uses the stored span when it lands on the quoted passage", () => {
  const span = resolveSpan({ quote: QUOTE, span: [11, 47] }, TEXT);
  expect(TEXT.slice(span![0], span![1])).toBe(QUOTE);
});

test("falls back to a direct search when the stored span is stale", () => {
  // the text file was rewritten by a newer pipeline run; offsets shifted
  const span = resolveSpan({ quote: QUOTE, span: [0, 5] }, TEXT);
  expect(TEXT.slice(span![0], span![1])).toBe(QUOTE);
});

test("finds a reviewer-corrected quote that has no stored span", () => {
  const span = resolveSpan({ quote: "votre adresse e-mail", span: null }, TEXT);
  expect(TEXT.slice(span![0], span![1])).toBe("votre adresse e-mail");
});

test("returns null rather than highlighting the wrong passage", () => {
  expect(resolveSpan({ quote: "nous revendons vos données", span: null }, TEXT)).toBeNull();
});

test("trusts a stored span whose slice carries markdown emphasis", () => {
  // the pipeline span covers the source characters, markers included
  const src = "Nous partageons avec **Criteo** pour la publicité.";
  const span = resolveSpan({ quote: "Nous partageons avec Criteo pour la publicité.", span: [0, src.length] }, src);
  expect(span).toEqual([0, src.length]);
});

test("an empty quote highlights nothing", () => {
  expect(resolveSpan({ quote: "", span: [0, 5] }, TEXT)).toBeNull();
});

test("no text means no highlight", () => {
  expect(resolveSpan({ quote: QUOTE, span: [11, 47] }, "")).toBeNull();
});
