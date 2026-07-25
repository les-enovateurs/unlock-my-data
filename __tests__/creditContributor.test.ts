import { creditContributor } from "@/components/review/creditContributor";

describe("creditContributor", () => {
  it("appends a new reviewer", () => {
    const r = creditContributor([], "Jérémy", "2026-07-24", "reviewed");
    expect(r).toEqual([{ name: "Jérémy", date: "2026-07-24", action: "reviewed" }]);
  });
  it("dedupes same name+action+date", () => {
    const base = [{ name: "Jérémy", date: "2026-07-24", action: "reviewed" }];
    const r = creditContributor(base, "Jérémy", "2026-07-24", "reviewed");
    expect(r).toHaveLength(1);
  });
  it("adds distinct action on same date", () => {
    const base = [{ name: "Jérémy", date: "2026-07-24", action: "reviewed" }];
    const r = creditContributor(base, "Jérémy", "2026-07-24", "published");
    expect(r).toHaveLength(2);
  });
  it("ignores empty name", () => {
    expect(creditContributor([], "  ", "2026-07-24", "reviewed")).toEqual([]);
  });
  it("does not mutate input", () => {
    const base = [{ name: "A", date: "2026-07-24", action: "reviewed" }];
    creditContributor(base, "B", "2026-07-24", "reviewed");
    expect(base).toHaveLength(1);
  });
});
