import { mergeBreaches } from "@/components/company/ficheBreaches";

const id = (s: string) => s;

describe("mergeBreaches", () => {
    it("keeps all three sources, newest first", () => {
        const out = mergeBreaches("Kiabi", "fr",
            [{ title: "Kiabi", breachDate: "2023-01-01", pwnCount: 10, dataClasses: ["Emails"] }],
            [{ date: "2024-05-01T00:00:00.000Z", volume: "20 000", data_types: ["IBAN"], links: ["https://a", { text: "b", href: "https://b" }] }],
            [{ date: "2025-01-07", type: "IBAN", type_en: "IBAN (en)", proof_url: "https://p", contributor: "Ana" }],
            id);
        expect(out.map((b) => b.source)).toEqual(["contributor", "blf", "hibp"]);
        expect(out[1]).toMatchObject({ date: "2024-05-01", links: ["https://a", "https://b"] });
        expect(out[0]).toMatchObject({ desc: "IBAN", links: ["https://p"], contributor: "Ana" });
    });

    it("drops a Bonjour la Fuite entry a contributor report supersedes", () => {
        const out = mergeBreaches("Delko", "fr", [],
            [
                { date: "2026-01-20T00:00:00.000Z" },
                { date: "2025-03-03", verified_by_manual: true },
                { date: "2024-02-02" },
            ],
            [{ date: "2026-01-21", type: "x", replaces_breach_date: "2026-01-20" }],
            id);
        expect(out.map((b) => `${b.source}:${b.date}`)).toEqual(["contributor:2026-01-21", "blf:2024-02-02"]);
    });

    it("falls back to French when the English label is missing", () => {
        const [leak] = mergeBreaches("X", "en", [], null, [{ date: "2025-01-01", type: "nom" }], id);
        expect(leak.desc).toBe("nom");
    });
});
