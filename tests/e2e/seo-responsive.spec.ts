import { test, expect } from '@playwright/test';

const SITE = 'https://unlock-my-data.com';

const PAGES = [
    '/',
    '/en/',
    '/liste-applications/',
    '/liste-applications/whatsapp/',
    '/supprimer-mes-donnees/',
    '/supprimer-mes-donnees/whatsapp/',
    '/proteger-mes-donnees/',
    '/nettoyage-numerique/',
    '/comparer/',
    '/contributeurs/',
    '/contribuer/',
    '/presse/',
    '/ateliers/',
    '/transferts/',
];

test.describe('SEO basics', () => {
    for (const path of PAGES) {
        test(`${path} has its own canonical, a title, a description and one h1`, async ({ page }) => {
            await page.goto(path);
            // A layout-level canonical once pointed every page at the homepage, de-indexing them.
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', SITE + path);
            await expect(page).toHaveTitle(/\S/);
            await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
            await expect(page.locator('h1')).toHaveCount(1);
        });
    }
});

// 320px is the WCAG 1.4.10 reflow width; 768px caught a three-column grid too tight for its badges.
for (const width of [320, 390, 768]) {
    test.describe(`No horizontal scroll at ${width}px`, () => {
        test.use({ viewport: { width, height: 844 } });

        for (const path of [...PAGES, '/contribuer/missions/', '/contribuer/nouvelle-fiche/']) {
            test(`${path} fits in ${width}px`, async ({ page }) => {
                await page.goto(path, { waitUntil: 'networkidle' });
                const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
                expect(scrollWidth).toBeLessThanOrEqual(width);
            });
        }
    });
}

test.describe('Sitemap and structured data', () => {
    test('sitemap.xml lists fiches and deletion guides', async ({ request }) => {
        const response = await request.get('/sitemap.xml');
        expect(response.ok()).toBe(true);
        const xml = await response.text();
        expect(xml).toContain(`<loc>${SITE}/liste-applications/whatsapp/</loc>`);
        expect(xml).toContain(`<loc>${SITE}/supprimer-mes-donnees/whatsapp/</loc>`);
    });

    test('deletion guide names the app in its h1 and ships an FAQ', async ({ page }) => {
        await page.goto('/supprimer-mes-donnees/whatsapp/');
        await expect(page.locator('h1')).toContainText('WhatsApp');
        const types = await jsonLdTypes(page);
        expect(types).toEqual(expect.arrayContaining(['FAQPage', 'BreadcrumbList']));
    });

    test('fiche ships a breadcrumb', async ({ page }) => {
        await page.goto('/liste-applications/whatsapp/');
        expect(await jsonLdTypes(page)).toContain('BreadcrumbList');
    });
});

async function jsonLdTypes(page: import('@playwright/test').Page) {
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    return blocks.map((block) => JSON.parse(block)['@type']);
}
