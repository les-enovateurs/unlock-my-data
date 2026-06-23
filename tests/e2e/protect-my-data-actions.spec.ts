import { test, expect } from '@playwright/test';
import { enterAdvanced, selectService, goToAnalysis, goToPlan } from './helpers';

test.describe('Protect My Data Actions', () => {
  test('should switch drawer modes and close without crashing', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await enterAdvanced(page);
    await selectService(page, 'WhatsApp');
    await goToAnalysis(page);
    await goToPlan(page);

    // The plan recommends migrating WhatsApp to a sovereign alternative.
    await expect(page.getByText(/Migrer vers/i).first()).toBeVisible();

    // Open the compare drawer, then jump to the migration guide inside it.
    await page.getByRole('button', { name: /^Comparer$/i }).first().click();
    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible();

    await drawer.getByRole('button', { name: /Voir le guide de migration/i }).click();
    // Guide view shows the numbered migration steps.
    await expect(drawer.getByText(/Étapes de migration/i)).toBeVisible();

    // Close the drawer.
    await drawer.getByRole('button', { name: /Fermer/i }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    expect(pageErrors, `Unexpected page errors: ${pageErrors.join(' | ')}`).toEqual([]);
  });
});