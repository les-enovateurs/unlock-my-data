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
