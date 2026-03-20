import { test, expect } from '@playwright/test';

test.describe('Protect My Data Actions', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to selection page
    await page.goto('/proteger-mes-donnees');
    
    // 2. Select at least two services (e.g. Google and Facebook if they exist, or just first two)
    // We filter by cards that have "Sélectionner" text
    const selectionButtons = page.locator('.card').filter({ hasText: /Sélectionner/i });
    await selectionButtons.nth(0).click();
    await selectionButtons.nth(1).click();
    
    // 3. Go to analysis
    await page.getByRole('button', { name: /Continuer vers l'analyse/i }).click();
    await expect(page).toHaveURL(/\/proteger-mes-donnees\/analyse$/);
    
    // 4. Go to actions
    await page.getByRole('button', { name: /Passer à l'action/i }).click();
    await expect(page).toHaveURL(/\/proteger-mes-donnees\/actions\//);
  });

  test('should reset subStep when skipping to next service', async ({ page }) => {
    // On first service, move to "Delete" subStep
    // Assuming we start at "Alternative"
    await expect(page.locator('button').filter({ hasText: /Choisir une alternative/i }).first()).toBeVisible();
    
    // Click "Passer cette étape" to go to "Export"
    await page.getByRole('button', { name: /Passer cette étape/i }).click();
    await expect(page.locator('button').filter({ hasText: /Exporter mes données/i }).first()).toBeVisible();
    
    // Click "Passer, je n'en ai pas besoin" to go to "Delete"
    await page.getByRole('button', { name: /Passer, je n'en ai pas besoin/i }).click();
    await expect(page.locator('button').filter({ hasText: /Suppression terminée/i }).first()).toBeVisible();
    
    // Now we are on "Suppression" subStep for Service 1.
    // Click "Passer au service suivant"
    await page.getByRole('button', { name: /Passer au service suivant/i }).click();
    
    // Verify we are back to "Alternative" subStep for Service 2
    // (Or "Export" if Service 2 doesn't need an alternative, but usually the first two will)
    const alternativeTab = page.locator('button').filter({ hasText: /Alternative/i });
    await expect(alternativeTab).toHaveClass(/bg-primary/);
    
    const alternativeTitle = page.locator('h3').filter({ hasText: /Trouver une alternative/i });
    await expect(alternativeTitle).toBeVisible();
  });
});
