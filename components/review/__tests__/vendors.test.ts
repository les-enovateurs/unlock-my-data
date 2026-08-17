import {
  normalizeVendorName, lookupVendor, recordVendorVerdict, knownVendorFn,
  type VendorRegistry,
} from "../vendors";

describe("normalizeVendorName", () => {
  test("strips the legal form so one company is one entry", () => {
    // Measured on zalando: 8 of 12 recipients were address blocks whose names
    // differ only by their legal suffix.
    expect(normalizeVendorName("Adyen N.V.")).toBe("adyen");
    expect(normalizeVendorName("Klarna Bank AB (publ)")).toBe("klarna bank");
    expect(normalizeVendorName("PayPal (Europe) S.à r.l. et Cie, S.C.A."))
      .toBe(normalizeVendorName("PayPal (Europe)"));
    expect(normalizeVendorName("Elavon Financial Services DAC")).toBe("elavon financial services");
  });

  test("folds case, accents and punctuation", () => {
    expect(normalizeVendorName("Société Générale")).toBe(normalizeVendorName("SOCIETE GENERALE"));
    expect(normalizeVendorName("Google  Ireland")).toBe("google ireland");
  });

  test("keeps genuinely different companies apart", () => {
    // The whole risk of loose matching: never let one verdict cover another firm.
    expect(normalizeVendorName("Google")).not.toBe(normalizeVendorName("Google Payment"));
    expect(normalizeVendorName("Amazon")).not.toBe(normalizeVendorName("Amazon Web Services"));
  });

  test("an empty or junk name normalizes to empty, never matching anything", () => {
    expect(normalizeVendorName("")).toBe("");
    expect(normalizeVendorName("   ")).toBe("");
    expect(normalizeVendorName("S.A.")).toBe("");
  });
});

const REG: VendorRegistry = {
  "google": { name: "Google", kind: "publicite", verdict: "validated",
              by: "alice", at: "2026-08-10", services: ["zalando"] },
  "criteo": { name: "Criteo", kind: "publicite", verdict: "contested",
              by: "bob", at: "2026-08-11", services: ["temu"] },
};

describe("lookupVendor", () => {
  test("finds a company whatever legal form the policy spells it with", () => {
    expect(lookupVendor(REG, "Google Inc.")?.name).toBe("Google");
  });

  test("returns null for a company nobody has ruled on", () => {
    expect(lookupVendor(REG, "Adyen")).toBeNull();
    expect(lookupVendor(REG, "")).toBeNull();
  });
});

describe("knownVendorFn", () => {
  test("a validated vendor is known, so it is not asked about again", () => {
    expect(knownVendorFn(REG)("Google Inc.")).toBe(true);
    expect(knownVendorFn(REG)("GOOGLE")).toBe(true);
  });

  test("a geographic subsidiary is NOT folded into its parent", () => {
    // "Loose" means legal forms only (Ltd, N.V., GmbH). "Google Ireland Ltd."
    // stays its own entry: merging it into "Google" would reuse one verdict for
    // a different legal entity, which is the one thing loose matching must not
    // do. Costs one extra question, buys correctness.
    expect(knownVendorFn(REG)("Google Ireland Ltd.")).toBe(false);
  });

  test("a contested vendor is NOT known — a contest reopens it for everyone", () => {
    // Guard 2 of the spec: one volunteer can reopen a company for all services.
    expect(knownVendorFn(REG)("Criteo")).toBe(false);
  });

  test("an unseen vendor is not known", () => {
    expect(knownVendorFn(REG)("Adyen N.V.")).toBe(false);
  });

  test("no registry at all means nothing is known", () => {
    expect(knownVendorFn({})("Google")).toBe(false);
  });
});

describe("recordVendorVerdict", () => {
  test("stores who ruled, when, and from which service", () => {
    // Guard 3: a inherited verdict must be able to say "validé par X sur Y le Z".
    const next = recordVendorVerdict({}, {
      name: "Adyen N.V.", kind: "paiement", verdict: "validated",
      by: "alice", at: "2026-08-16", service: "zalando",
    });
    expect(next["adyen"]).toEqual({
      name: "Adyen N.V.", kind: "paiement", verdict: "validated",
      by: "alice", at: "2026-08-16", services: ["zalando"],
    });
  });

  test("a second service using the same vendor is appended, not duplicated", () => {
    let reg = recordVendorVerdict({}, {
      name: "Adyen", kind: "paiement", verdict: "validated",
      by: "alice", at: "2026-08-16", service: "zalando" });
    reg = recordVendorVerdict(reg, {
      name: "Adyen N.V.", kind: "paiement", verdict: "validated",
      by: "bob", at: "2026-08-17", service: "temu" });
    expect(reg["adyen"].services).toEqual(["zalando", "temu"]);
    reg = recordVendorVerdict(reg, {
      name: "Adyen", kind: "paiement", verdict: "validated",
      by: "bob", at: "2026-08-18", service: "temu" });
    expect(reg["adyen"].services).toEqual(["zalando", "temu"]);
  });

  test("the original attribution survives later sightings", () => {
    let reg = recordVendorVerdict({}, {
      name: "Adyen", kind: "paiement", verdict: "validated",
      by: "alice", at: "2026-08-16", service: "zalando" });
    reg = recordVendorVerdict(reg, {
      name: "Adyen", kind: "paiement", verdict: "validated",
      by: "bob", at: "2026-08-17", service: "temu" });
    expect(reg["adyen"].by).toBe("alice");
    expect(reg["adyen"].at).toBe("2026-08-16");
  });

  test("a contest overwrites the attribution — the contest is the live fact", () => {
    let reg = recordVendorVerdict({}, {
      name: "Criteo", kind: "publicite", verdict: "validated",
      by: "alice", at: "2026-08-16", service: "zalando" });
    reg = recordVendorVerdict(reg, {
      name: "Criteo", kind: "publicite", verdict: "contested",
      by: "bob", at: "2026-08-17", service: "temu" });
    expect(reg["criteo"].verdict).toBe("contested");
    expect(reg["criteo"].by).toBe("bob");
  });

  test("the input registry is never mutated", () => {
    const before = { ...REG };
    recordVendorVerdict(REG, { name: "Adyen", kind: "paiement",
      verdict: "validated", by: "x", at: "t", service: "s" });
    expect(REG).toEqual(before);
  });

  test("a nameless vendor is refused rather than stored under an empty key", () => {
    expect(recordVendorVerdict({}, { name: "  ", kind: "autre",
      verdict: "validated", by: "x", at: "t", service: "s" })).toEqual({});
  });
});

// --- E2: a verdict on a vendor card feeds the registry ---

import { vendorUpdateFor } from "../vendors";
import type { InvItem } from "../policyReviewModel";

const vItem = (over: Partial<InvItem> = {}): InvItem => ({
  key: "dest/0", axis: "qui", kind: "Publicité / régie", label: "Adyen N.V.",
  quote: "q", origVerified: true, span: [0, 1], verifyReason: null, ...over,
});

describe("vendorUpdateFor", () => {
  const ctx = { service: "zalando", by: "alice", at: "2026-08-16T10:00:00Z" };

  test("validating a recipient records the company", () => {
    const u = vendorUpdateFor(vItem(), "validated", null, ctx);
    expect(u).toEqual({ name: "Adyen N.V.", kind: "Publicité / régie",
      verdict: "validated", by: "alice", at: ctx.at, service: "zalando" });
  });

  test("a hosting provider is a vendor too", () => {
    expect(vendorUpdateFor(vItem({ key: "hebergeur/0", label: "OVH" }), "validated", null, ctx)?.name)
      .toBe("OVH");
  });

  test("non-vendor items never touch the registry", () => {
    // A category or a legal basis says nothing about a company.
    expect(vendorUpdateFor(vItem({ key: "cat/contact" }), "validated", null, ctx)).toBeNull();
    expect(vendorUpdateFor(vItem({ key: "signal/0" }), "validated", null, ctx)).toBeNull();
  });

  test("a wrong kind contests the company — the kind is what is inherited", () => {
    // Heredity covers exactly two claims: this company exists, and this kind is
    // right. "mauvaise_categorie" contradicts the second, so it must reopen the
    // company everywhere rather than stay a local note.
    expect(vendorUpdateFor(vItem(), "rejected", "mauvaise_categorie", ctx)?.verdict)
      .toBe("contested");
  });

  test("a rejection local to this citation leaves the company alone", () => {
    // The quote was wrong *here*; that is no verdict on the company, and must
    // not reopen it for every other service.
    expect(vendorUpdateFor(vItem(), "rejected", "hors_sujet", ctx)).toBeNull();
    expect(vendorUpdateFor(vItem(), "rejected", "citation_absente", ctx)).toBeNull();
  });
});
