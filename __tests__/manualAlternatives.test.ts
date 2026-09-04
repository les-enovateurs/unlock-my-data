import fs from 'node:fs';
import path from 'node:path';

import services from '../public/data/services.json';
import { ALT_LABELS } from '../components/company/manual-components/altLabels';

const MANUAL_DIR = path.join(process.cwd(), 'public', 'data', 'manual');

const catalogued = new Set((services as { slug: string }[]).map(s => s.slug));

const entries = fs
    .readdirSync(MANUAL_DIR)
    .filter(f => f.endsWith('.json') && f !== 'slugs.json')
    .map(f => ({
        slug: f.replace(/\.json$/, ''),
        alternatives: (JSON.parse(fs.readFileSync(path.join(MANUAL_DIR, f), 'utf8')).alternatives ?? []) as string[]
    }))
    .filter(e => e.alternatives.length > 0);

describe('manual alternatives', () => {
    it('lists alternatives for at least a few services', () => {
        expect(entries.length).toBeGreaterThan(10);
    });

    it('never references itself', () => {
        const selfRefs = entries.filter(e => e.alternatives.includes(e.slug)).map(e => e.slug);
        expect(selfRefs).toEqual([]);
    });

    // Uncatalogued alternatives render unlinked, so they need a display label:
    // an auto title-cased slug ("Ebay", "Duckduckgo") is not a brand name.
    it('labels every alternative that has no fiche', () => {
        const unlabelled = new Set<string>();
        for (const e of entries) {
            for (const alt of e.alternatives) {
                if (!catalogued.has(alt) && !ALT_LABELS[alt]) unlabelled.add(alt);
            }
        }
        expect([...unlabelled]).toEqual([]);
    });
});
