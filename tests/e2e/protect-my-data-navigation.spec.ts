import { test, expect } from '@playwright/test';
import { enterAdvanced, selectService, stepButton } from './helpers';

test.describe('Protect My Data Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await enterAdvanced(page);
  });

  test('should disable the Analysis step when no service is selected', async ({ page }) => {
    const analyse = stepButton(page, /^Analyse$/);
    await expect(analyse).toBeDisabled();
  });

  test('should reach the Analysis step after selecting a service', async ({ page }) => {
    await selectService(page, 'WhatsApp');

    const analyse = stepButton(page, /^Analyse$/);
    await expect(analyse).toBeEnabled();

    await analyse.click();
    await expect(analyse).toHaveAttribute('aria-current', 'step');

    // The analysis content (risk tiles) is shown.
    await expect(page.getByText(/Transferts hors UE/i)).toBeVisible();
  });

  test('should unlock the Action plan step once a service is selected', async ({ page }) => {
    const plan = stepButton(page, /Plan d'action/);
    await expect(plan).toBeDisabled();

    await selectService(page, 'WhatsApp');
    await expect(plan).toBeEnabled();

    await plan.click();
    await expect(plan).toHaveAttribute('aria-current', 'step');
  });
});