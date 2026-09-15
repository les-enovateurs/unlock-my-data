/**
 * Les deux graphiques du binaire. Ce qui est testé ici n'est pas le pixel — un SVG se
 * relit à l'œil — mais les trois refus qui empêchent une lecture fausse : pas de courbe
 * sans histoire, pas de trait plein par-dessus un changement de variante, et jamais un
 * graphique sans les chiffres qui le doublent.
 */

import { render, screen } from "@testing-library/react";
import { ApkCompositionBar, ApkWeightChart, type ApkSizePoint } from "../components/company/ApkCharts";

const t = (key: string, vars?: Record<string, string | number>) => {
    if (!vars) return key;
    return `${key}:${Object.values(vars).join(",")}`;
};

const série: ApkSizePoint[] = [
    { version: "1.0", total: 50_000_000, dex: 30_000_000, native: 10_000_000, res: 8_000_000, assets: 2_000_000, abiCount: 1 },
    { version: "2.0", total: 120_000_000, dex: 60_000_000, native: 40_000_000, res: 15_000_000, assets: 5_000_000, abiCount: 4, variantChange: true },
    { version: "2.1", total: 130_000_000, dex: 65_000_000, native: 42_000_000, res: 18_000_000, assets: 5_000_000, abiCount: 4 },
];

describe("ApkWeightChart", () => {
    it("ne dessine rien avec une seule version pesée", () => {
        // Le cas majoritaire : la série démarre au premier téléchargement, et un point
        // isolé n'est pas une histoire. Le poids courant est déjà affiché au-dessus.
        const { container } = render(<ApkWeightChart points={série.slice(0, 1)} lang="fr" t={t} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("coupe la ligne au changement de variante", () => {
        // Entre un APK mono-ABI et un XAPK qui porte les quatre, le poids double sans
        // qu'une ligne de code ait bougé. Un trait plein l'affirmerait comme croissance.
        const { container } = render(<ApkWeightChart points={série} lang="fr" t={t} />);
        const pointillés = container.querySelectorAll("path[stroke-dasharray]");
        expect(pointillés).toHaveLength(1);
    });

    it("double la courbe d'un tableau qui porte chaque version", () => {
        render(<ApkWeightChart points={série} lang="fr" t={t} />);
        // Deux fois « 1.0 » : l'étiquette directe au bout de l'axe, et la ligne du tableau.
        expect(screen.getAllByText("1.0")).toHaveLength(2);
        expect(screen.getByText("130 Mo")).toBeInTheDocument();
        expect(screen.getAllByText("50 Mo").length).toBeGreaterThan(0);
    });
});

describe("ApkCompositionBar", () => {
    it("nomme chaque part et en donne la valeur, jamais la couleur seule", () => {
        render(<ApkCompositionBar point={série[2]} lang="fr" t={t} />);
        expect(screen.getByText("chartPart_dex")).toBeInTheDocument();
        expect(screen.getByText("65 Mo")).toBeInTheDocument();
        expect(screen.getByText("chartPart_assets")).toBeInTheDocument();
    });

    it("ne dessine rien quand une seule part a été mesurée", () => {
        // Une barre à un segment n'est pas une composition, c'est un rectangle.
        const { container } = render(
            <ApkCompositionBar point={{ version: "1.0", total: 10_000_000, dex: 10_000_000 }} lang="fr" t={t} />,
        );
        expect(container).toBeEmptyDOMElement();
    });
});
