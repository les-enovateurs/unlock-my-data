import type { FicheAnalysis, FicheProps } from "./FicheAvancee";

/** "ess" is the fiche root; every other tab is its own static page one segment below. */
export type FicheTabId = "ess" | "tech" | "droits" | "fuites" | "gouv" | "donnees";

export const FICHE_TAB_LABELS: Record<FicheTabId, { fr: string; en: string }> = {
    ess: { fr: "L'essentiel", en: "Essentials" },
    tech: { fr: "Technique", en: "Technical" },
    droits: { fr: "Vos droits", en: "Your rights" },
    fuites: { fr: "Fuites & CGU", en: "Breaches & ToS" },
    gouv: { fr: "Transferts & sanctions", en: "Transfers & sanctions" },
    donnees: { fr: "Données collectées", en: "Collected data" },
};

/* An analysis whose source extraction failed carries no usable verdict — the tab
   is hidden rather than showing a page-long "we could not read it" notice. */
export function analysisExtractionFailed(a: FicheAnalysis) {
    const chars = a.source?.markdown_chars ?? 0;
    return (a.review?.flags || []).includes("extraction_insuffisante") || chars < 500;
}

/** Tabs a fiche actually has. Drives both the tab strip and which tab pages get
 *  exported, so an empty tab never becomes an indexable page. */
export function ficheTabIds(p: FicheProps): FicheTabId[] {
    const hasTech = Boolean(p.apk) || Boolean(p.apkLab) || p.perms.length > 0 || p.trackers.length > 0;
    const hasInventory = Boolean(p.analysis && !analysisExtractionFailed(p.analysis) && p.analysis.data_inventory);
    return [
        "ess",
        ...(hasTech ? ["tech" as const] : []),
        "droits", "fuites", "gouv",
        ...(hasInventory ? ["donnees" as const] : []),
    ];
}

export function ficheHref(lang: string, slug: string, tab: FicheTabId = "ess") {
    const base = lang === "fr" ? "/liste-applications" : "/list-app";
    return tab === "ess" ? `${base}/${slug}/` : `${base}/${slug}/${tab}/`;
}
