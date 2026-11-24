import "./globals.css";
import {LanguageProvider} from "@/context/LanguageContext";
import {HtmlWithLang} from "@/components/HtmlWithLang";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Unlock My Data - reprenez le contrôle sur vos données personnelles",
    description: "Chaque jour, des milliers de données personnelles sont collectées par des entreprises. Découvrez ce qu'elles savent de vous et comment faire le ménage.",
    publisher: "Les e-novateurs",
    icons: {
        icon: [
            { url: "/umd-app-icon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico", sizes: "48x48" },
        ],
        apple: "/apple-touch-icon.png",
    },
    metadataBase: new URL("https://unlock-my-data.com"),
    // "./" resolves against each route: a hard-coded home URL here made every
    // page without its own alternates canonicalise to the homepage.
    alternates: {
        canonical: "./",
    },
    openGraph: {
        title: "Unlock My Data - reprenez le contrôle sur vos données personnelles",
        description: "Chaque jour, des milliers de données personnelles sont collectées par des entreprises. Découvrez ce qu'elles savent de vous et comment faire le ménage.",
        url: "./",
        siteName: "Unlock My Data",
        images: [
            {
                url: "https://unlock-my-data.com/og-image-2.png",
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
        images: ["https://unlock-my-data.com/og-image-2.png"],
        creator: "@les-enovateurs",
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    const isProd = process.env.NODE_ENV === "production";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "Unlock My Data",
        "url": "https://unlock-my-data.com",
        "logo": "https://unlock-my-data.com/icon-512.png",
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
