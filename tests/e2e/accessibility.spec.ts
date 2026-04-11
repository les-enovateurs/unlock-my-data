import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Checks', () => {
    const pagesToCheck = [
        { name: 'Home (FR)', url: '/' },
        { name: 'Home (EN)', url: '/en/' },
        { name: 'Protéger mes données', url: '/proteger-mes-donnees' },
        { name: 'Nettoyage numérique', url: '/nettoyage-numerique' },
        { name: 'Comparatif', url: '/comparer' },
        { name: 'Politique de confidentialité', url: '/politique-confidentialite' },
    ];

    for (const pageInfo of pagesToCheck) {
        test(`should not have any automatically detectable accessibility violations on ${pageInfo.name}`, async ({ page }) => {
            await page.goto(pageInfo.url);

            // Wait for hydration and dynamic content loading
            await page.waitForTimeout(2000);

            const accessibilityScanResults = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .analyze();

            if (accessibilityScanResults.violations.length > 0) {
                console.log(`\nAccessibility violations on ${pageInfo.name} (${pageInfo.url}):`);
                accessibilityScanResults.violations.forEach((violation, index) => {
                    console.log(`${index + 1}. ${violation.id}: ${violation.help}`);
                    console.log(`   Impact: ${violation.impact}`);
                    console.log(`   Nodes: ${violation.nodes.length}`);
                });
            }

            expect(accessibilityScanResults.violations).toEqual([]);
        });
    }

    test('should not have accessibility violations in the alternatives modal', async ({ page }) => {
        await page.goto('/proteger-mes-donnees');

        // Wait for data load
        await page.waitForTimeout(1000);

        const searchInput = page.getByRole('textbox').first();
        await searchInput.fill('WhatsApp');
        await page.waitForTimeout(1000);

        const suggestion = page.locator('button').filter({ hasText: /WhatsApp/i }).first();
        if (await suggestion.isVisible()) {
            await suggestion.click();

            // Wait for analysis and alternatives button
            await page.waitForTimeout(2000);

            const alternativesBtn = page.getByRole('button', { name: /Alternative/i }).first();
            if (await alternativesBtn.isVisible()) {
                await alternativesBtn.click();

                // Wait for modal to open
                await page.waitForTimeout(500);

                // Run axe only on the modal container if possible, or full page
                const accessibilityScanResults = await new AxeBuilder({ page })
                    .withTags(['wcag2a', 'wcag2aa'])
                    .analyze();

                expect(accessibilityScanResults.violations).toEqual([]);
            }
        }
    });
});
