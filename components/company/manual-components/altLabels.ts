// Editorial `alternatives` lists in public/data/manual name services that are not
// all catalogued yet (Element, PeerTube, eBay...). Those get shown as plain text —
// linking them produced 404s. Brand casing a slug cannot carry.
export const ALT_LABELS: Record<string, string> = {
    bing: "Bing",
    deezer: "Deezer",
    dropbox: "Dropbox",
    duckduckgo: "DuckDuckGo",
    ebay: "eBay",
    element: "Element",
    google: "Google",
    peertube: "PeerTube",
    pixelfed: "Pixelfed",
    protonmail: "Proton Mail",
    skype: "Skype",
    "sncf-connect": "SNCF Connect",
};

export function altLabel(slug: string): string {
    return ALT_LABELS[slug]
        ?? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
