import { redirectTargets } from "../policyReviewModel";

const META = {
  CATEGORY_ORDER: ["identite", "paiement", "autre"],
  CATEGORY_META: { identite: { label: "Identité" }, paiement: { label: "Paiement" }, autre: { label: "Autre" } },
};

test("a category offers the other categories, never itself", () => {
  const t = redirectTargets("cat/identite", META).map((o) => o.value);
  expect(t).toEqual(["paiement"]);        // "autre" is not a destination
});

test("a purpose is re-routed like the category it belongs to", () => {
  expect(redirectTargets("purpose/paiement", META).map((o) => o.value)).toEqual(["identite"]);
});

test("a recipient is re-routed to another kind", () => {
  const t = redirectTargets("dest/3", META).map((o) => o.value);
  expect(t).toContain("analytics");
  expect(t).toContain("hebergement");
});

test("a signal is re-routed to another criterion", () => {
  expect(redirectTargets("signal/0", META).map((o) => o.value)).toContain("scoring");
});

test("axes without sections offer nothing to re-route to", () => {
  // A country or a host is not filed under a rubric — "wrong section" is
  // meaningless there, and the verdict submits as it always did.
  for (const key of ["pays/0", "hebergeur/1", "transfert", "base/2"]) {
    expect(redirectTargets(key, META)).toEqual([]);
  }
});
