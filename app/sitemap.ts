import type { MetadataRoute } from "next";
import services from "@/public/data/services.json";
import { PUBLISHED_RELEASES } from "@/data/pressReleases";
import { ficheLastChangeAt, ficheTabStaticParams } from "@/components/company/manual";
import { ficheHref } from "@/components/company/ficheTabs";

export const dynamic = "force-static";

const SITE_URL = "https://unlock-my-data.com";

// [fr, en] pairs; contribution forms, embeds and duplicate entry points are left out on purpose.
const STATIC_PAIRS: [string, string][] = [
    ["/", "/en/"],
    ["/liste-applications/", "/list-app/"],
    ["/supprimer-mes-donnees/", "/delete-my-data/"],
    ["/proteger-mes-donnees/", "/protect-my-data/"],
    ["/nettoyage-numerique/", "/digital-clean-up/"],
    ["/comparer/", "/compare/"],
    ["/transferts/", "/transfers/"],
    ["/presse/", "/press/"],
    ["/ateliers/", "/workshops/"],
    ["/ateliers/urgence-fuite/", "/workshops/data-leak-emergency/"],
    ["/contribuer/", "/contribute/"],
    ["/contributeurs/", "/contributors/"],
    ["/integrer/", "/integrate/"],
    ["/mentions-legales/", "/legal-notice/"],
    ["/politique-confidentialite/", "/privacy-policy/"],
];

function entries([fr, en]: [string, string], lastModified?: string): MetadataRoute.Sitemap {
    const languages = { "fr-FR": SITE_URL + fr, "en-US": SITE_URL + en };
    return [fr, en].map((path) => ({ url: SITE_URL + path, lastModified, alternates: { languages } }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemap = STATIC_PAIRS.flatMap((pair) => entries(pair));
    for (const { slug } of services) {
        const lastModified = await ficheLastChangeAt(slug);
        sitemap.push(...entries([ficheHref("fr", slug), ficheHref("en", slug)], lastModified));
        for (const { tab } of await ficheTabStaticParams(slug)) {
            sitemap.push(...entries([ficheHref("fr", slug, tab), ficheHref("en", slug, tab)], lastModified));
        }
        sitemap.push(...entries([`/supprimer-mes-donnees/${slug}/`, `/delete-my-data/${slug}/`]));
    }
    for (const { slug, iso } of PUBLISHED_RELEASES) {
        sitemap.push(...entries([`/presse/${slug}/`, `/press/${slug}/`], iso));
    }
    return sitemap;
}
