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

export type EnforcementFine = {
    etid: string;
    url: string;
    country: string | null;
    authority: string | null;
    date: string | null;
    controller: string | null;
    sector: string | null;
    /** null means the amount was not disclosed; 0 is a real fine of zero. */
    fine_eur: number | null;
    articles: string[];
    violation_type: string | null;
    summary: string | null;
    original_source_url: string | null;
    /** Day the record was pulled from the tracker (YYYY-MM-DD). */
    retrieved_at?: string;
    /** Set by `update-enforcement-tracker.mjs --check-links`: the regulator page
     *  answered 404/410 and the link must not be offered as a source. */
    original_source_dead?: boolean;
    /** "group" when the match came from the parent group rather than the service. */
    matched_on: 'alias' | 'group';
};

/** The tracker names authority countries in English free text, not ISO codes.
 *  Mapping them lets `localizedCountry()` translate the label instead of
 *  showing "The Netherlands" on a French page. Covers every value present in
 *  fines.json (31, measured 2026-08-31); unknown values fall back to the raw
 *  name. */
export const ENFORCEMENT_COUNTRY_CODE: Record<string, string> = {
    Austria: 'AT', Belgium: 'BE', Bulgaria: 'BG', Croatia: 'HR', Cyprus: 'CY',
    'Czech Republic': 'CZ', Denmark: 'DK', Estonia: 'EE', Finland: 'FI',
    France: 'FR', Germany: 'DE', Greece: 'GR', Hungary: 'HU', Iceland: 'IS',
    Ireland: 'IE', 'Isle OF Man': 'IM', Italy: 'IT', Latvia: 'LV',
    Liechtenstein: 'LI', Lithuania: 'LT', Luxembourg: 'LU', Malta: 'MT',
    Norway: 'NO', Poland: 'PL', Portugal: 'PT', Romania: 'RO', Slovakia: 'SK',
    Slovenia: 'SI', Spain: 'ES', Sweden: 'SE', 'The Netherlands': 'NL',
    'United Kingdom': 'GB',
};

/** Source: enforcementtracker.com, provided by CMS — CC BY-NC-SA 4.0.
 *  Records are kept out of the fiche JSON so the ShareAlike terms stay scoped
 *  to public/data/enforcement/. */
export async function getEnforcementFines(slug: string): Promise<EnforcementFine[]> {
    try {
        const index = (await import('../../../public/data/enforcement/index-by-slug.json')).default;
        const entries = (index as Record<string, { etid: string; matched_on: 'alias' | 'group' }[]>)[slug] || [];
        if (entries.length === 0) return [];
        // fines.json carries no matched_on: that lives in the index, because the
        // same record can be attached to several services for different reasons.
        const fines = (await import('../../../public/data/enforcement/fines.json'))
            .default as unknown as Omit<EnforcementFine, 'matched_on'>[];
        const byId = new Map(fines.map((f) => [f.etid, f]));
        return entries
            .map((e) => {
                const fine = byId.get(e.etid);
                return fine ? { ...fine, matched_on: e.matched_on } : null;
            })
            .filter((f): f is EnforcementFine => f !== null)
            .sort((a, b) => (b.fine_eur ?? -1) - (a.fine_eur ?? -1));
    } catch {
        return [];
    }
}
