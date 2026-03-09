import { test, expect } from '@playwright/test';

test.describe('Comparatif Page - Better Alternative', () => {
    test('should prominently display the better alternative recommendation', async ({ page }) => {
        // Go to the comparison page with WhatsApp and Telegram
        await page.goto('/comparer?services=whatsapp,telegram');

        // Wait for the data to load and components to hydrate
        await page.waitForTimeout(2000);

        // The recommended badge should replace the risk label
        const recommendedBadge = page.locator('text=/Alternative Recommandée|Recommended Alternative/i').first();
        await expect(recommendedBadge).toBeVisible();

        // Ensure WhatsApp retains its normal risk level warning (e.g. 'À surveiller' / 'Monitor closely')
        // Find the container for WhatsApp specifically to scope the search
        const headings = await page.getByRole('heading', { name: 'WhatsApp' }).all();
        if (headings.length > 0) {
            const whatsappContainer = headings[0].locator('..');
            const warningLabel = whatsappContainer.locator('text=/À surveiller|Monitor closely/i');
            await expect(warningLabel).toBeVisible();
        }
    });
});
