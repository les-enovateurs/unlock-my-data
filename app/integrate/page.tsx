import EmbedBuilder from "@/components/EmbedBuilder";
import { buildCatalog } from "@/lib/catalog";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
    lang: "en",
    title: "Embed our analyses on your website - Unlock My Data",
    description: "Show on your websites the analysis of the apps that matter to your audience: trackers, breaches, data access.",
    paths: { fr: "/integrer", en: "/integrate" },
});

export default function Page() {
    return <EmbedBuilder lang="en" services={buildCatalog()} />;
}
