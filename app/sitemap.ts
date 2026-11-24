import type { MetadataRoute } from "next";
import services from "@/public/data/services.json";
import { PUBLISHED_RELEASES } from "@/data/pressReleases";
import { ficheTabStaticParams } from "@/components/company/manual";
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

function entries([fr, en]: [string, string]): MetadataRoute.Sitemap {
    const languages = { "fr-FR": SITE_URL + fr, "en-US": SITE_URL + en };
    return [fr, en].map((path) => ({ url: SITE_URL + path, alternates: { languages } }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const pairs: [string, string][] = [...STATIC_PAIRS];
    for (const { slug } of services) {
        pairs.push([ficheHref("fr", slug), ficheHref("en", slug)]);
        for (const { tab } of await ficheTabStaticParams(slug)) {
            pairs.push([ficheHref("fr", slug, tab), ficheHref("en", slug, tab)]);
        }
        pairs.push([`/supprimer-mes-donnees/${slug}/`, `/delete-my-data/${slug}/`]);
    }
    for (const { slug } of PUBLISHED_RELEASES) {
        pairs.push([`/presse/${slug}/`, `/press/${slug}/`]);
    }
    return pairs.flatMap(entries);
}
