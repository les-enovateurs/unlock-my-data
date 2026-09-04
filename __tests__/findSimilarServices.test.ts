import services from '../public/data/services.json';
import { findSimilarServices } from '../components/company/manual-components/helpers';

const catalogued = new Set((services as { slug: string }[]).map(s => s.slug));

describe('findSimilarServices', () => {
    // SERVICE_CATEGORIES and missions.json both name services without a fiche;
    // those peers fed dead links and empty comparison columns.
    it('only returns catalogued slugs', () => {
        const dead = new Set<string>();
        for (const slug of catalogued) {
            for (const peer of findSimilarServices(slug, 2)) {
                if (!catalogued.has(peer)) dead.add(`${slug} -> ${peer}`);
            }
        }
        expect([...dead]).toEqual([]);
    });

    it('never returns the service itself and never duplicates', () => {
        for (const slug of catalogued) {
            const peers = findSimilarServices(slug, 3);
            expect(peers).not.toContain(slug);
            expect(peers.length).toBe(new Set(peers).size);
        }
    });

    it('honours the limit', () => {
        expect(findSimilarServices('booking', 2).length).toBeLessThanOrEqual(2);
        expect(findSimilarServices('booking', 1).length).toBe(1);
    });

    it('falls back to missions.json for services outside SERVICE_CATEGORIES', () => {
        // biogroup is in the missions "health" list, not in SERVICE_CATEGORIES
        expect(findSimilarServices('biogroup', 2)).toContain('doctolib');
    });
});
