import type { Metadata } from "next";
import type { Lang } from "@/context/LanguageContext";
import { getRelease } from "@/data/pressReleases";
import services from "@/public/data/services.json";

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

export const serviceName = (slug: string) =>
    (services as { slug: string; name: string }[]).find((s) => s.slug === slug)?.name.trim() ?? slug;

export function ficheMetadata(lang: Lang, slug: string): Metadata {
    const name = serviceName(slug);
    return localizedMetadata({
        lang,
        title: lang === "fr"
            ? `${name} : données personnelles, pisteurs et RGPD | Unlock My Data`
            : `${name}: personal data, trackers and GDPR | Unlock My Data`,
        description: lang === "fr"
            ? `Ce que ${name} fait de vos données personnelles : pisteurs, transferts hors UE, fuites, sanctions et comment exercer vos droits RGPD.`
            : `What ${name} does with your personal data: trackers, transfers outside the EU, breaches, fines and how to use your GDPR rights.`,
        paths: { fr: `/liste-applications/${slug}`, en: `/list-app/${slug}` },
    });
}

export function deleteGuideMetadata(lang: Lang, slug: string): Metadata {
    const name = serviceName(slug);
    return localizedMetadata({
        lang,
        title: lang === "fr"
            ? `Supprimer son compte et ses données ${name} (RGPD) | Unlock My Data`
            : `Delete your ${name} account and data (GDPR) | Unlock My Data`,
        description: lang === "fr"
            ? `Demandez à ${name} l'effacement de vos données personnelles (RGPD, article 17) : e-mail pré-rédigé, délais de réponse et recours auprès de la CNIL.`
            : `Ask ${name} to erase your personal data (GDPR, article 17): a pre-written email, response deadlines and how to complain to the regulator.`,
        paths: { fr: `/supprimer-mes-donnees/${slug}`, en: `/delete-my-data/${slug}` },
    });
}

export function breadcrumbJsonLd(items: [name: string, path: string][]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map(([name, path], i) => ({
            "@type": "ListItem",
            position: i + 1,
            name,
            item: `${SITE_URL}${path}`,
        })),
    };
}

