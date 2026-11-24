import type { Metadata } from "next";
import SupportPage from "@/components/support/SupportPage";

export const metadata: Metadata = {
    title: "Soutenir Unlock My Data | Don, mécénat, adhésion",
    description: "Unlock My Data est gratuit, sans publicité ni pisteur. Soutenez l'association par un don mensuel ou ponctuel, le mécénat, l'adhésion ou un atelier.",
    alternates: {
        canonical: "/soutenir/",
        languages: { "fr-FR": "https://unlock-my-data.com/soutenir/", "en-US": "https://unlock-my-data.com/support/" },
    },
};

export default function SoutenirPage() {
    return <SupportPage lang="fr" />;
}
