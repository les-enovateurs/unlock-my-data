import { test, expect } from '@playwright/test';

test.describe('Missions Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('**/data/missions.json', async route => {
            const json = [
                {
                    "id": "social",
                    "category": "Réseaux Sociaux",
                    "category_en": "Social Networks",
                    "icon": "Users",
                    "color": "primary",
                    "description": "Les réseaux sociaux collectent une grande quantité de données personnelles.",
                    "description_en": "Social networks collect a large amount of personal data.",
                    "priority": "high",
                    "apps": [
                        { "name": "Facebook", "slug": "facebook" },
                        { "name": "Instagram", "slug": "instagram" }
                    ]
                }
            ];
            await route.fulfill({ json });
        });

        await page.route('**/data/services.json', async route => {
            const json = [{ "name": "Facebook", "slug": "facebook" }];
            await route.fulfill({ json });
        });

        // Empty body — previously caused a JSON.parse crash (regression guard).
        await page.route('**/data/pending-reviews.json', async route => {
            await route.fulfill({ status: 200, body: '' });
        });

        await page.route('**/data/reviews.json', async route => {
            const json = [{ "name": "Badoo", "slug": "badoo", "status": "draft", "created_by": "Rokiatou" }];
            await route.fulfill({ json });
        });
    });

    test('should load the missions page without crashing', async ({ page }) => {
        await page.goto('/contribuer/missions');

        // Hero title of the redesigned page.
        await expect(page.locator('h1')).toContainText(/attendent leur fiche/i);

        // The mocked category card renders its name as a heading.
        await expect(page.getByRole('heading', { name: /Réseaux Sociaux/i })).toBeVisible();
    });

    test('should handle completely empty data gracefully', async ({ page }) => {
        await page.route('**/data/missions.json', async route => {
            await route.fulfill({ json: [] });
        });

        await page.goto('/contribuer/missions');

        // With zero apps the page must still render (NaN / divide-by-zero guard).
        await expect(page.locator('h1')).toContainText(/attendent leur fiche/i);
        // Priority filters render regardless of data.
        await expect(page.getByRole('button', { name: /Toutes/i })).toBeVisible();
        // The global counter shows 0 analysed without crashing.
        await expect(page.getByText(/analysées/i)).toBeVisible();
    });
});