import servicesData from "@/public/data/services.json";
import trackerLinks from "@/public/data/compare/tracker-links.json";
import breachMapping from "@/public/data/compare/breach-mapping.json";
import type { CatalogService } from "@/components/CatalogContent";

// tracker-links.json maps trackerId -> apps embedding it; invert to count
// trackers per app slug.
function buildTrackerCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const apps of Object.values(trackerLinks as Record<string, { slug: string }[]>)) {
        for (const app of apps) {
            counts[app.slug] = (counts[app.slug] || 0) + 1;
        }
    }
    return counts;
}

export function buildCatalog(): CatalogService[] {
    const trackerCounts = buildTrackerCounts();
    const breaches = breachMapping as Record<string, unknown[]>;

    return (servicesData as any[])
        .map((s): CatalogService => ({
            slug: s.slug,
            name: s.name,
            logo: s.logo || undefined,
            country: s.country_name || undefined,
            countryCode: s.country_code || undefined,
            trackers: s.exodus ? (trackerCounts[s.slug] ?? 0) : null,
            breaches: breaches[s.slug]?.length ?? 0,
            betterAlternative: Boolean(s.better_alternative),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}
