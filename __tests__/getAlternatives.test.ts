import { getAlternatives, SERVICE_CATEGORIES } from "../constants/protectData";

describe("getAlternatives", () => {
    it("should return category-based alternatives if no manual alternatives are provided", () => {
        // Assuming "slack" is in the "messaging" category which contains whatsapp, telegram, etc.
        const alts = getAlternatives("slack");
        expect(alts.length).toBeGreaterThan(0);
        expect(alts).toContain("whatsapp");
        expect(alts).not.toContain("slack");
    });

    it("should merge manual alternatives with category alternatives and prioritize them", () => {
        const manualAlternativesMap = {
            slack: ["mattermost", "rocketchat"],
        };
        const alts = getAlternatives("slack", manualAlternativesMap);

        expect(alts.length).toBeGreaterThan(0);
        // manual alternatives should be present
        expect(alts).toContain("mattermost");
        expect(alts).toContain("rocketchat");

        // category alternatives should still be present
        expect(alts).toContain("whatsapp");

        // order: manual ones are merged first in getAlternatives due to Set order (manualAlts then categoryAlts)
        expect(alts[0]).toBe("mattermost");
        expect(alts[1]).toBe("rocketchat");
    });

    it("should return empty array if service not found in categories and no manual map", () => {
        const alts = getAlternatives("unknown-service");
        expect(alts).toEqual([]);
    });
});
