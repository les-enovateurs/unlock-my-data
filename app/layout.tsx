import "./globals.css";
import {LanguageProvider} from "@/context/LanguageContext";
import {HtmlWithLang} from "@/components/HtmlWithLang";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Unlock My Data - reprenez le contrôle sur vos données personnelles",
    description: "Chaque jour, des milliers de données personnelles sont collectées par des entreprises. Découvrez ce qu'elles savent de vous et comment faire le ménage.",
    publisher: "Les e-novateurs",
    alternates: {
        canonical: "https://unlock-my-data.com",
        languages: {
            'fr-FR': "https://unlock-my-data.com",
            'en-US': "https://unlock-my-data.com/en",
        },
    },
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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Unlock My Data",
        "url": "https://unlock-my-data.com",
        "logo": "https://unlock-my-data.com/logoUMD.webp",
        "sameAs": [
            "https://github.com/les-enovateurs/unlock-my-data"
        ],
        "description": "Plateforme citoyenne pour analyser vos services, comparer les alternatives éthiques et supprimer massivement vos traces en ligne."
    };

    return (
        <LanguageProvider>
            <HtmlWithLang isProd={isProd}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {children}
            </HtmlWithLang>
        </LanguageProvider>
    );
}
