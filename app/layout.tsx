import "./globals.css";
import {LanguageProvider} from "@/context/LanguageContext";
import {HtmlWithLang} from "@/components/HtmlWithLang";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Unlock My Data - reprenez le contrôle sur vos données personnelles",
    description: "Chaque jour, des milliers de données personnelles sont collectées par des entreprises. Découvrez ce qu'elles savent de vous et comment faire le ménage.",
    publisher: "Les e-novateurs",
    openGraph: {
        title: "Unlock My Data - reprenez le contrôle sur vos données personnelles",
        description: "Chaque jour, des milliers de données personnelles sont collectées par des entreprises. Découvrez ce qu'elles savent de vous et comment faire le ménage.",
        url: "https://unlock-my-data.com",
        siteName: "Unlock My Data",
        images: [
            {
                url: "https://unlock-my-data.com/og-image.png",
                alt: "Unlock My Data - reprenez le contrôle sur vos données personnelles",
            },
        ],
        locale: "fr_FR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Unlock My Data - reprenez le contrôle sur vos données personnelles",
        description: "Chaque jour, des milliers de données personnelles sont collectées par des entreprises. Découvrez ce qu'elles savent de vous et comment faire le ménage.",
        images: ["https://unlock-my-data.com/og-image.png"],
        creator: "@les-enovateurs",
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    const isProd = process.env.NODE_ENV === "production";

    return (
        <LanguageProvider>
            <HtmlWithLang isProd={isProd}>{children}</HtmlWithLang>
        </LanguageProvider>
    );
}
