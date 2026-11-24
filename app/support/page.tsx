import type { Metadata } from "next";
import SupportPage from "@/components/support/SupportPage";

export const metadata: Metadata = {
    title: "Support Unlock My Data | Donate, sponsor, join",
    description: "Unlock My Data is free, ad-free and tracker-free. Support the non-profit with a monthly or one-off donation, sponsorship, membership or a workshop.",
    alternates: {
        canonical: "/support/",
        languages: { "fr-FR": "https://unlock-my-data.com/soutenir/", "en-US": "https://unlock-my-data.com/support/" },
    },
};

export default function SupportRoutePage() {
    return <SupportPage lang="en" />;
}
