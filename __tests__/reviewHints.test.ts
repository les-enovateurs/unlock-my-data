import { hintForKey, AXIS_META } from "@/components/review/reviewHints";
import { AXIS_ORDER } from "@/components/review/policyReviewModel";

describe("reviewHints", () => {
  it("guides every new item family", () => {
    for (const k of ["cat/identite", "purpose/identite", "base/0", "transfert",
      "pays/0", "hebergeur", "dest/0"]) {
      expect(hintForKey(k).length).toBeGreaterThan(20);
    }
  });

  it("tells the volunteer the name must appear literally inside the quote", () => {
    // Mirrors name_in_quote() in the pipeline: a vendor, country or host whose
    // name is absent from its own citation is rejected mechanically. If this
    // instruction ever drops out of the prose, this test must fail.
    for (const k of ["pays/0", "hebergeur", "dest/0"]) {
      expect(hintForKey(k)).toMatch(/littéralement/);
      expect(hintForKey(k)).toMatch(/citation/);
    }
  });

  it("warns that an unnamed mention supports nothing", () => {
    expect(hintForKey("pays/0")).toMatch(/Hors de l'Union européenne/);
    expect(hintForKey("dest/0")).toMatch(/partenaires/);
  });

  it("has no guidance left for the retired CNIL keys", () => {
    expect(hintForKey("crit/cookies/ck_presence")).toBe("");
    expect(hintForKey("pixel/0")).toBe("");
  });

  it("titles the four axes", () => {
    for (const a of AXIS_ORDER) {
      expect(AXIS_META[a].title).toBeTruthy();
      expect(AXIS_META[a].question).toBeTruthy();
    }
  });
});

// --- each signal criterion says what qualifies (2026-08-16) ---

import { SIGNAL_HINT, hintForItem } from "@/components/review/reviewHints";
import { SIGNAL_CRITERIA } from "@/components/review/policyTaxonomy";

test("every closed-list criterion has its own definition", () => {
  // "Notation / score de solvabilité" names the criterion but does not say what
  // counts as one. A generic "the passage must state the criterion" hint told a
  // volunteer nothing they did not already know.
  for (const c of SIGNAL_CRITERIA) {
    expect(SIGNAL_HINT[c]).toBeTruthy();
    expect(SIGNAL_HINT[c].length).toBeGreaterThan(60);
  }
});

test("every definition says what does NOT count", () => {
  // The useful half of a definition is its boundary: the near-miss that a
  // volunteer would otherwise wave through.
  for (const c of SIGNAL_CRITERIA) {
    expect(SIGNAL_HINT[c]).toMatch(/ne (compte|comptent|suffit) pas|ne relève pas/);
  }
});

test("a signal item gets its criterion's definition, not the generic one", () => {
  expect(hintForItem("signal/0", "scoring")).toBe(SIGNAL_HINT.scoring);
  expect(hintForItem("signal/3", "mineurs")).toBe(SIGNAL_HINT.mineurs);
});

test("a signal whose criterion is unknown still gets usable guidance", () => {
  expect(hintForItem("signal/0", "prix_eleve")).toBeTruthy();
  expect(hintForItem("signal/0", undefined)).toBeTruthy();
});

test("non-signal items keep the hint they had", () => {
  expect(hintForItem("cat/contact", undefined)).toBe(hintForKey("cat/contact"));
  expect(hintForItem("dest/0", undefined)).toBe(hintForKey("dest/0"));
});
