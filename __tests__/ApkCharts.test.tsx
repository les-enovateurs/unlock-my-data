/**
 * The two binary charts. What is tested here is not the pixel — an SVG is proofread by
 * eye — but the refusals that prevent a false reading: no curve without a story, no
 * weight compared across two packagings, no solid line over a variant change, and never a
 * chart without the figures that double it.
 */

import { render, screen } from "@testing-library/react";
import { ApkCompositionBar, ApkWeightChart, type ApkSizePoint } from "../components/company/ApkCharts";

const t = (key: string, vars?: Record<string, string | number>) => {
    if (!vars) return key;
    return `${key}:${Object.values(vars).join(",")}`;
};

/* Same application, two packagings: 1.0 was downloaded as a single-ABI APK, 2.0 and 2.1
   as an XAPK carrying four. The weight triples between 1.0 and 2.1 without a line of code
   having moved — this fixture is the trap the chart must not fall into. */
const mixedPackaging: ApkSizePoint[] = [
    { version: "1.0", total: 50_000_000, dex: 30_000_000, native: 10_000_000, res: 8_000_000, assets: 2_000_000, abiCount: 1 },
    { version: "2.0", total: 120_000_000, dex: 60_000_000, native: 40_000_000, res: 15_000_000, assets: 5_000_000, abiCount: 4, variantChange: true },
    { version: "2.1", total: 130_000_000, dex: 65_000_000, native: 42_000_000, res: 18_000_000, assets: 5_000_000, abiCount: 4 },
];

/* One packaging throughout: the whole series is comparable, nothing gets dropped. */
const samePackaging: ApkSizePoint[] = [
    { version: "1.0", total: 100_000_000, dex: 60_000_000, native: 20_000_000, res: 15_000_000, assets: 5_000_000, abiCount: 1 },
    { version: "1.1", total: 110_000_000, dex: 66_000_000, native: 22_000_000, res: 17_000_000, assets: 5_000_000, abiCount: 1 },
    { version: "1.2", total: 130_000_000, dex: 78_000_000, native: 26_000_000, res: 21_000_000, assets: 5_000_000, abiCount: 1 },
];

describe("ApkWeightChart", () => {
    it("draws nothing with a single weighed version", () => {
        // The majority case: the series starts at the first download, and an isolated
        // point is not a story. The current weight is already displayed above.
        const { container } = render(<ApkWeightChart points={samePackaging.slice(0, 1)} lang="fr" t={t} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("drops readings from another packaging rather than comparing them", () => {
        // 1.0 was measured on a single-ABI APK, the rest on a four-ABI XAPK. Keeping it
        // would compare two different objects.
        render(<ApkWeightChart points={mixedPackaging} lang="fr" t={t} />);
        expect(screen.queryByText("1.0")).not.toBeInTheDocument();
        expect(screen.getAllByText("2.0").length).toBeGreaterThan(0);
    });

    it("computes the percentage on the retained series alone", () => {
        // The bug this filter exists for: 50 -> 130 Mo reads +160 %, of which nothing is
        // the application. At constant packaging, 120 -> 130 Mo is +8 %.
        render(<ApkWeightChart points={mixedPackaging} lang="fr" t={t} />);
        expect(screen.getByText(/chartWeightCaption:2,\+8/)).toBeInTheDocument();
    });

    it("declares how many readings it set aside", () => {
        // Going from three versions to two silently would suggest we only measured twice.
        render(<ApkWeightChart points={mixedPackaging} lang="fr" t={t} />);
        expect(screen.getByText(/chartScopeNote:1/)).toBeInTheDocument();
    });

    it("draws nothing when fewer than two readings share the latest packaging", () => {
        // Rather than fall back on the full series, whose delta is the one we refuse.
        const { container } = render(
            <ApkWeightChart points={mixedPackaging.slice(0, 2)} lang="fr" t={t} />,
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("still cuts the line on a variant change inside one packaging", () => {
        // The ABI count is not the only packaging change; the dotted segment stays the
        // second safety net for the ones it does not catch.
        const withVariant = samePackaging.map((p, i) => (i === 1 ? { ...p, variantChange: true } : p));
        const { container } = render(<ApkWeightChart points={withVariant} lang="fr" t={t} />);
        expect(container.querySelectorAll("path[stroke-dasharray]")).toHaveLength(1);
    });

    it("doubles the curve with a table carrying every version, newest first", () => {
        render(<ApkWeightChart points={samePackaging} lang="fr" t={t} />);
        // Twice "1.0": the direct label at the end of the axis, and the table row.
        expect(screen.getAllByText("1.0")).toHaveLength(2);
        expect(screen.getByText("130 Mo")).toBeInTheDocument();
        const versions = [...document.querySelectorAll("tbody tr td:first-child")].map((c) => c.textContent);
        expect(versions).toEqual(["1.2", "1.1", "1.0"]);
    });
});

describe("ApkCompositionBar", () => {
    it("names every part and gives its value, never the colour alone", () => {
        render(<ApkCompositionBar point={samePackaging[2]} lang="fr" t={t} />);
        expect(screen.getByText("chartPart_dex")).toBeInTheDocument();
        expect(screen.getByText("78 Mo")).toBeInTheDocument();
        expect(screen.getByText("chartPart_assets")).toBeInTheDocument();
    });

    it("draws nothing when a single part was measured", () => {
        // A one-segment bar is not a composition, it is a rectangle.
        const { container } = render(
            <ApkCompositionBar point={{ version: "1.0", total: 10_000_000, dex: 10_000_000 }} lang="fr" t={t} />,
        );
        expect(container).toBeEmptyDOMElement();
    });
});
