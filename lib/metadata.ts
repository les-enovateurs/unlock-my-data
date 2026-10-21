import type { Metadata } from "next";
import type { Lang } from "@/context/LanguageContext";
import { getRelease } from "@/data/pressReleases";

const SITE_URL = "https://unlock-my-data.com";
const OG_IMAGE = `${SITE_URL}/og-image-2.png`;

type LocalizedPage = {
    lang: Lang;
    title: string;
    description: string;
    paths: Record<Lang, string>;
};

// openGraph and twitter are replaced wholesale by a child segment, not merged:
// without them here a page would keep the root's French share preview.
export function localizedMetadata({ lang, title, description, paths }: LocalizedPage): Metadata {
    const url = `${SITE_URL}${paths[lang]}`;
    return {
        title,
        description,
        alternates: {
            canonical: url,
            languages: {
                "fr-FR": `${SITE_URL}${paths.fr}`,
                "en-US": `${SITE_URL}${paths.en}`,
            },
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Unlock My Data",
            images: [{ url: OG_IMAGE, alt: title }],
            locale: lang === "fr" ? "fr_FR" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [OG_IMAGE],
        },
    };
}

export function pressReleaseMetadata(lang: Lang, slug: string): Metadata {
    const release = getRelease(slug);
    if (!release) return {};
    const { title, chapo } = release[lang];
    return localizedMetadata({
        lang,
        title: `${title} - Unlock My Data`,
        description: chapo,
        paths: { fr: `/presse/${slug}`, en: `/press/${slug}` },
    });
}
