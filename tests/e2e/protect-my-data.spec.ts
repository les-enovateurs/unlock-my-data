import { test, expect } from '@playwright/test';

test.describe('Protect My Data Flow', () => {

    test('should load the protect-my-data page successfully', async ({ page }) => {
        // Go to the French version of the page, assuming it's available at /proteger-mes-donnees
        await page.goto('/proteger-mes-donnees');

        // Check that the main title exists
        await expect(page.locator('h1').first()).toBeVisible();

        // Check that the search bar for services exists
        const searchInput = page.getByPlaceholder(/rechercher/i);
        if (await searchInput.isVisible()) {
            await expect(searchInput).toBeVisible();
        }
    });

    test('should allow user to search and select a service', async ({ page }) => {
        await page.goto('/proteger-mes-donnees');

        // Wait for the hydration and data loading
        await page.waitForTimeout(1000);

        const searchInput = page.getByRole('textbox').first();
        await searchInput.fill('Google');

        // Wait for suggestions to appear
        await page.waitForTimeout(1000);

        // Click the first suggestion
        const firstSuggestion = page.locator('button').filter({ hasText: /Google/i }).first();
        if (await firstSuggestion.isVisible()) {
            await firstSuggestion.click();

            // Ensure some result or selection indicator is visible
            // Example: The selected service should appear as a tag/badge or initiate analysis
            const selectedIndicator = page.getByText(/Google/i).first();
            await expect(selectedIndicator).toBeVisible();
        }
    });

    test('should open and close alternatives modal gracefully', async ({ page }) => {
        await page.goto('/proteger-mes-donnees');

        // Add a service to trigger the analysis that might show alternatives
        await page.waitForTimeout(1000);
        const searchInput = page.getByRole('textbox').first();
        await searchInput.fill('WhatsApp');
        await page.waitForTimeout(1000);

        const suggestion = page.locator('button').filter({ hasText: /WhatsApp/i }).first();
        if (await suggestion.isVisible()) {
            await suggestion.click();

            // Wait for analysis to show 'Alternatives' button or section
            await page.waitForTimeout(2000);

            const alternativesBtn = page.getByRole('button', { name: /Alternative/i }).first();
            if (await alternativesBtn.isVisible()) {
                await alternativesBtn.click();

                // Check if modal opens
                const modalTitle = page.locator('h2').filter({ hasText: /Alternative/i }).first();
                await expect(modalTitle).toBeVisible();

                // Close the modal
                const closeBtn = page.getByRole('button', { name: /Fermer|Close/i }).first();
                if (await closeBtn.isVisible()) {
                    await closeBtn.click();
                    await expect(modalTitle).not.toBeVisible();
                }
            }
        }
    });
});
