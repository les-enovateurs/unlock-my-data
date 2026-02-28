import { test, expect } from '@playwright/test';

test.describe('Missions Page', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the API responses
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
            const json = [
                { "name": "Facebook", "slug": "facebook" }
            ];
            await route.fulfill({ json });
        });

        await page.route('**/data/pending-reviews.json', async route => {
            // Simulate missing file or empty content that previously caused JSON.parse error
            await route.fulfill({ status: 200, body: '' }); // empty body
        });

        await page.route('**/data/reviews.json', async route => {
            const json = [
                { "name": "Badoo", "slug": "badoo", "status": "draft", "created_by": "Rokiatou" }
            ];
            await route.fulfill({ json });
        });
    });

    test('should load the missions page without crashing', async ({ page }) => {
        await page.goto('/contribuer/missions');

        // Wait for page to load and check that "Missions" indicator is visible
        await expect(page.locator('h1')).toContainText('prioritaires');

        // Check that the category network is displayed
        await expect(page.locator('h2').filter({ hasText: /Réseaux Sociaux|Social Networks/i })).toBeVisible();
    });

    test('should handle completely empty data gracefully', async ({ page }) => {
        await page.route('**/data/missions.json', async route => {
            await route.fulfill({ json: [] });
        });

        await page.goto('/contribuer/missions');

        // Even with empty apps, it shouldn't crash (testing NaN fix)
        await expect(page.getByText('Progression globale')).toBeVisible();
        await expect(page.locator('.text-5xl')).toHaveText('0');
        await expect(page.getByText('sur 0 applications')).toBeVisible();
    });
});
