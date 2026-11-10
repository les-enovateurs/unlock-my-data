import EmbedBuilder from "@/components/EmbedBuilder";
import { buildCatalog } from "@/lib/catalog";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
    lang: "fr",
    title: "Intégrer nos analyses sur votre site - Unlock My Data",
    description: "Affichez sur vos sites l'analyse des applications qui comptent pour votre public : traceurs, fuites, accès aux données.",
    paths: { fr: "/integrer", en: "/integrate" },
});

export default function Page() {
    return <EmbedBuilder lang="fr" services={buildCatalog()} />;
}
