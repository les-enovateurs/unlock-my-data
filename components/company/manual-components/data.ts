import { EntrepriseData, Breach, TermsMemo } from './types';
import { findSimilarServices } from './helpers';


export async function getSimilarServices(currentSlug: string): Promise<EntrepriseData[]> {
    try {
        const allServices = (await import('../../../public/data/services.json')).default;


        const similarSlugs = findSimilarServices(currentSlug, 3);

        if (similarSlugs.length === 0) {
            // Fallback to random others if no category match found
            const others = allServices.filter((s: any) => s.slug !== currentSlug);
            return others.sort(() => 0.5 - Math.random()).slice(0, 3) as unknown as EntrepriseData[];
        }

        const result = allServices.filter((s: any) => similarSlugs.includes(s.slug));

        return result as unknown as EntrepriseData[];
    } catch {
        return [];
    }
}

export async function getEntrepriseData(slug: string): Promise<EntrepriseData | null> {
    try {
        return (await import(`../../../public/data/manual/${slug}.json`)).default;
    } catch {
        return null;
    }
}

export async function getBreachData(slug: string): Promise<Breach[]> {
    try {
        const breachMapping = (await import('../../../public/data/compare/breach-mapping.json')).default;
        return (breachMapping as Record<string, Breach[]>)[slug] || [];
    } catch {
        return [];
    }
}

export async function getTermsArchiveData(slug: string): Promise<TermsMemo[]> {
    try {
        const termsArchive = (await import('../../../public/data/compare/terms-archive.json')).default;
        return (termsArchive as Record<string, TermsMemo[]>)[slug] || [];
    } catch {
        return [];
    }
}
