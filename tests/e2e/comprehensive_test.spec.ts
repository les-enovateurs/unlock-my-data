import { test, expect } from '@playwright/test';
import { enterAdvanced, selectService, goToAnalysis, goToPlan } from './helpers';

test.describe('Protect My Data - Full Selection Regression Test', () => {
    test('should run the full select → analyse → plan flow without crashing', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                if (text.includes('404')) return; // missing optional data files are expected
                errors.push(text);
            }
        });
        page.on('pageerror', err => errors.push(`PAGE_CRASH: ${err.message}`));

        await enterAdvanced(page);

        // Select two representative US services (both get sovereign alternatives).
        await selectService(page, 'Google Drive');
        await selectService(page, 'Airbnb');

        // Both selections are reflected in the sticky panel count (unique big number).
        await expect(page.locator('aside .text-4xl')).toHaveText('2');

        await goToAnalysis(page);
        await goToPlan(page);

        // Plan rendered both services without crashing.
        await expect(page.getByText(/Google Drive/i).first()).toBeVisible();
        await expect(page.getByText(/Airbnb/i).first()).toBeVisible();

        const bodyText = (await page.innerText('body')).toLowerCase();
        expect(bodyText).not.toContain('crash');

        expect(errors, `Collected errors: ${errors.join(' | ')}`).toHaveLength(0);
    });
});