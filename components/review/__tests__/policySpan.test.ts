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

// --- the model flattens bullet lists into commas (B.2, front side) ---

// Verbatim from zalando: the policy bullets these, the model returned one
// comma-joined sentence. locate_quote found it and stored a correct span; the
// front used to reject that span and highlight nothing.
const BULLETS =
  "Nous traitons :\n- votre nom et votre prénom\n- vos coordonnées\n" +
  "- vos préférences, par ex. s'agissant des marques\n- les informations démographiques\nFin.";
const FLAT =
  "votre nom et votre prénom, vos coordonnées, vos préférences, par ex. " +
  "s'agissant des marques, les informations démographiques";

test("trusts a stored span whose slice is a bullet list the model flattened", () => {
  const start = BULLETS.indexOf("votre nom");
  const end = BULLETS.indexOf("\nFin.");
  const span = resolveSpan({ quote: FLAT, span: [start, end] }, BULLETS);
  expect(span).toEqual([start, end]);
});

test("numbered list markers count as separators too", () => {
  const src = "Données :\n1. votre e-mail\n2. votre adresse IP\nFin.";
  const start = src.indexOf("votre e-mail");
  const end = src.indexOf("\nFin.");
  const span = resolveSpan({ quote: "votre e-mail, votre adresse IP", span: [start, end] }, src);
  expect(span).toEqual([start, end]);
});

test("list leniency still refuses a span that is not the quote", () => {
  // The guard has to keep working: a stale span must not be trusted just
  // because both sides contain bullets.
  expect(resolveSpan({ quote: FLAT, span: [0, 14] }, BULLETS)).toBeNull();
});
