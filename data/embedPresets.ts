import type { CatalogService } from "@/components/CatalogContent";
import type { CardVariant } from "@/components/ServiceCardBody";

type Localized = { fr: string; en: string };

export type EmbedPreset = {
    id: string;
    label: Localized;
    card: CardVariant;
    // A fixed list, or a pick computed from the live catalog so the figures stay true.
    groups: { title: Localized; slugs: string[] | ((services: CatalogService[]) => string[]) }[];
};

const mostTrackers = (n: number) => (services: CatalogService[]) =>
    [...services]
        .filter((s) => s.trackers !== null)
        .sort((a, b) => (b.trackers ?? 0) - (a.trackers ?? 0))
        .slice(0, n)
        .map((s) => s.slug);

// The first preset is what the builder opens on.
export const EMBED_PRESETS: EmbedPreset[] = [
    {
        id: "everyday",
        label: { fr: "Applis du quotidien", en: "Everyday apps" },
        card: "standard",
        groups: [
            { title: { fr: "Messageries", en: "Messaging" }, slugs: ["signal", "whatsapp", "messenger"] },
            { title: { fr: "Réseaux sociaux", en: "Social networks" }, slugs: ["instagram", "tiktok", "snapchat"] },
            { title: { fr: "Petites annonces", en: "Second-hand marketplaces" }, slugs: ["leboncoin", "vinted"] },
        ],
    },
    {
        id: "women",
        label: { fr: "Association Les Chouettes", en: "Association Les Chouettes" },
        card: "detailed",
        groups: [
            {
                title: { fr: "Sécurité", en: "Safety" },
                slugs: ["app-elles", "the-sorority", "umay", "ti3rs", "mmo-de-vie", "monsherif", "flag", "quivive-app", "wandersafe", "la-plateforme-d-accompagnement-des-victimes-pnav", "masecurite-gouv"],
            },
            { title: { fr: "Sororité et témoignage", en: "Sisterhood and testimony" }, slugs: ["les-martines", "comment-on-s-aime", "coabuse", "weblame"] },
            { title: { fr: "Quotidien", en: "Everyday life" }, slugs: ["nipto", "shared", "medtimer-rappel-de-pilules", "drip"] },
        ],
    },
    {
        id: "school",
        label: { fr: "Parents et école", en: "Parents and school" },
        card: "standard",
        groups: [
            { title: { fr: "À l'école", en: "At school" }, slugs: ["pronote", "kahoot", "moodle"] },
            { title: { fr: "Les loisirs des ados", en: "Teenagers' pastimes" }, slugs: ["youtube", "tiktok", "snapchat", "pokemon-go", "candy-crush"] },
        ],
    },
    {
        id: "health",
        label: { fr: "Santé", en: "Health" },
        card: "detailed",
        groups: [
            { title: { fr: "Rendez-vous et remboursements", en: "Appointments and reimbursements" }, slugs: ["doctolib", "caisse-nationale-dassurance-maladie"] },
            { title: { fr: "Suivi du cycle et des traitements", en: "Cycle and medication tracking" }, slugs: ["flo-health-inc", "drip", "medtimer-rappel-de-pilules"] },
        ],
    },
    {
        id: "tracking-podium",
        label: { fr: "😏 Ils en savent plus que ta mère", en: "😏 They know more than your mum" },
        card: "standard",
        groups: [{ title: { fr: "Le podium du pistage", en: "The tracking podium" }, slugs: mostTrackers(6) }],
    },
    {
        id: "office",
        label: { fr: "😏 Au bureau", en: "😏 At the office" },
        card: "standard",
        groups: [
            { title: { fr: "En réunion", en: "In a meeting" }, slugs: ["microsoft-teams", "zoom", "slack"] },
            { title: { fr: "En train de chercher ailleurs", en: "Quietly job hunting" }, slugs: ["linkedin", "indeed"] },
        ],
    },
];

export function resolvePreset(preset: EmbedPreset, lang: "fr" | "en", services: CatalogService[]) {
    return preset.groups.map((g) => ({
        title: g.title[lang],
        slugs: typeof g.slugs === "function" ? g.slugs(services) : g.slugs,
    }));
}
