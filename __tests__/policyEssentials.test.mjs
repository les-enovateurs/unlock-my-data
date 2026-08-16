import { countEssentials, essentialKeys } from "../scripts/policyEssentials.mjs";

const svc = (over = {}) => ({
  data_inventory: {
    categories: {}, legal_bases: [], recipients: [], signals: [],
    transfers: { outside_eu: "non", countries: [], hosting: [], quote: "" },
    ...over,
  },
});

test("a verified signal is essential", () => {
  const d = svc({ signals: [{ criterion: "scoring", quote: "q", quote_verified: true }] });
  expect(essentialKeys(d, {})).toEqual(["signal/0"]);
});

test("an unverified item is never essential — it will not be published", () => {
  const d = svc({ signals: [{ criterion: "scoring", quote: "q", quote_verified: false }] });
  expect(essentialKeys(d, {})).toEqual([]);
});

test("a vendor already validated elsewhere drops out of the count", () => {
  const d = svc({ recipients: [{ name: "Google Inc.", kind: "publicite", quote: "q", quote_verified: true }] });
  expect(essentialKeys(d, {})).toEqual(["dest/0"]);
  const reg = { google: { name: "Google", kind: "publicite", verdict: "validated", by: "a", at: "t", services: [] } };
  expect(essentialKeys(d, reg)).toEqual([]);
});

test("a contested vendor comes back into the count for everyone", () => {
  const d = svc({ recipients: [{ name: "Criteo", kind: "publicite", quote: "q", quote_verified: true }] });
  const reg = { criteo: { name: "Criteo", kind: "publicite", verdict: "contested", by: "b", at: "t", services: [] } };
  expect(essentialKeys(d, reg)).toEqual(["dest/0"]);
});

test("sensitive categories count, ordinary ones do not", () => {
  const d = svc({ categories: {
    biometrie: { status: "oui", quote: "q", quote_verified: true },
    contact: { status: "oui", quote: "q", quote_verified: true },
  } });
  expect(essentialKeys(d, {})).toEqual(["cat/biometrie"]);
});

test("countEssentials counts only what the volunteer has not ruled on", () => {
  const d = svc({ signals: [
    { criterion: "scoring", quote: "q", quote_verified: true },
    { criterion: "mineurs", quote: "q2", quote_verified: true },
  ] });
  const side = { items: { "signal/0": { verdict: "validated" } } };
  expect(countEssentials(d, side, {})).toBe(1);
  expect(countEssentials(d, null, {})).toBe(2);
});

test("a service with no inventory counts zero, not NaN", () => {
  expect(countEssentials({}, null, {})).toBe(0);
});

// The rule lives twice: here for the built index, and in policyReviewModel.ts
// for the screen. They must agree, or the queue promises a number the detail
// view contradicts — the same class of bug as the list-bullet divergence.
test("agrees with the TypeScript implementation on the same service", async () => {
  const { computeInvItems, splitEssentials } = await import("@/components/review/policyReviewModel");
  const { knownVendorFn } = await import("@/components/review/vendors");
  const { CATEGORY_ORDER, CATEGORY_META } = await import("@/components/review/policyTaxonomy");

  const d = svc({
    signals: [{ criterion: "scoring", quote: "q", quote_verified: true }],
    categories: {
      biometrie: { status: "oui", quote: "q", quote_verified: true },
      contact: { status: "oui", quote: "q", quote_verified: true },
    },
    recipients: [
      { name: "Google Inc.", kind: "publicite", quote: "q", quote_verified: true },
      { name: "Adyen N.V.", kind: "paiement", quote: "q", quote_verified: true },
    ],
    transfers: { outside_eu: "non", countries: [], quote: "",
                 hosting: [{ provider: "OVH", quote: "q", quote_verified: true }] },
  });
  const reg = { google: { name: "Google", kind: "publicite", verdict: "validated", by: "a", at: "t", services: [] } };

  const ts = splitEssentials(
    computeInvItems(d, { CATEGORY_ORDER: [...CATEGORY_ORDER], CATEGORY_META }),
    { knownVendor: knownVendorFn(reg) }
  ).essential.map((i) => i.key).sort();

  expect(essentialKeys(d, reg).sort()).toEqual(ts);
});

// deriveStatus lives twice as well; same obligation, same guard.
test("deriveStatus agrees with the TypeScript implementation", async () => {
  const { deriveStatus } = await import("../scripts/policyEssentials.mjs");
  const ts = (await import("@/components/review/policyReviewModel")).deriveStatus;
  const cases = [
    [{ source: { markdown_chars: 120 }, review: { flags: ["extraction_insuffisante"] } }, null],
    [{ source: { markdown_chars: 90000 }, review: { flags: [] } }, null],
    [{ source: { markdown_chars: 90000 }, data_inventory: { categories: {} } }, null],
    [{ source: { markdown_chars: 90000 }, data_inventory: {} }, { status: "human_reviewed" }],
    [{ source: { markdown_chars: 90000 }, review: { flags: ["encodage_suspect"] } }, null],
    [{ source: { markdown_chars: 90000, url_source: "colle_par_benevole" },
       review: { flags: ["extraction_insuffisante"] } }, null],
    [{}, null],
  ];
  for (const [svc, side] of cases) {
    expect(deriveStatus(svc, side)).toBe(ts(svc, side));
  }
});
