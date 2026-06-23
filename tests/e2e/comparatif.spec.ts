import { test, expect } from '@playwright/test';

test.describe('Comparatif Page - Verdict', () => {
    test('should compare two services and surface a clear verdict', async ({ page }) => {
        await page.goto('/comparer?services=whatsapp,telegram');

        // Page header of the redesigned A/B comparison.
        await expect(page.getByRole('heading', { name: /Comparer les services/i })).toBeVisible();

        // Both selected services appear as head cards.
        await expect(page.getByRole('heading', { name: /^WhatsApp$/i })).toBeVisible();
        await expect(page.getByRole('heading', { name: /^Telegram$/i })).toBeVisible();

        // A verdict is shown: either a winner banner or an explicit tie.
        const verdict = page.locator('text=/respecte davantage vos données|Match nul/i').first();
        await expect(verdict).toBeVisible();

        // The migration CTA (leave the weaker / less sovereign service) is always present.
        await expect(page.getByRole('button', { name: /^Quitter /i }).first()).toBeVisible();
    });
});