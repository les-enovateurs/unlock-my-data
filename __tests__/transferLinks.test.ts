import { appTransfers, isDeclared, type TrackerCompanies } from "@/lib/map/transferLinks";

const companies: TrackerCompanies = {
  companies: {
    google: {
      name: "Google LLC", country: "us", source: "https://example.org/g",
    },
    rokt: { name: "Rokt", country: null, source: null },
    guess: { name: "Unsourced Inc.", country: "us", source: null },
  },
  trackers: { "1": "google", "2": "rokt", "3": "guess" },
};

const app = {
  hq: "FR",
  policy: ["États-Unis", "Autres pays non listés"],
  trackerIds: [1, 2, 3, 99],
  trackerNames: { 1: "Firebase" },
};

describe("appTransfers", () => {
  it("places seat, policy and sourced trackers, and counts the rest", () => {
    const t = appTransfers(app, companies, { policy: true, trackers: true });
    expect([...t.byCountry.keys()]).toEqual(["fr", "us"]);
    expect(t.byCountry.get("us")).toEqual([
      { origin: "policy" },
      { origin: "tracker", tracker: "Firebase", company: "Google LLC" },
    ]);
    expect(t.unlocated).toBe(3);
    expect(t.unlisted).toBe(true);
    expect(t.unstated).toBe(false);
  });

  it("keeps tracker-only countries apart from declared ones", () => {
    const t = appTransfers({ ...app, policy: [] }, companies, { policy: true, trackers: true });
    expect(t.unstated).toBe(true);
    expect(isDeclared(t.byCountry.get("us")!)).toBe(false);
    expect(isDeclared(t.byCountry.get("fr")!)).toBe(true);
  });
});
