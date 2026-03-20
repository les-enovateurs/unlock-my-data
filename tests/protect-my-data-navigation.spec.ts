import { test, expect } from '@playwright/test';

test.describe('Protect My Data Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Protect My Data page (French version by default)
    await page.goto('/proteger-mes-donnees');
  });

  test('should disable Step 2 when no services are selected', async ({ page }) => {
    const stepAnalysis = page.locator('li.step').nth(1);
    
    // Check if it has the cursor-not-allowed class
    await expect(stepAnalysis).toHaveClass(/cursor-not-allowed/);
    
    // Clicking it should not change the URL
    await stepAnalysis.click();
    await expect(page).toHaveURL(/\/proteger-mes-donnees$/);
  });

  test('should allow navigation to Step 2 after selecting a service', async ({ page }) => {
    // Select the first service card
    const firstService = page.locator('.card').filter({ hasText: /Selectionner/i }).first();
    await firstService.click();

    // Now Step 2 should be clickable
    const stepAnalysis = page.locator('li.step').nth(1);
    await expect(stepAnalysis).not.toHaveClass(/cursor-not-allowed/);
    await expect(stepAnalysis).toHaveClass(/cursor-pointer/);

    // Click on Step 2 in navigation bar
    await stepAnalysis.click();

    // Should navigate to analysis page
    await expect(page).toHaveURL(/\/proteger-mes-donnees\/analyse$/);
    
    // Should not be a white page (check for analysis content or loading spinner)
    const analysisTitle = page.locator('h2');
    await expect(analysisTitle).toBeVisible();
  });

  test('should trigger analysis automatically when navigating to Step 2', async ({ page }) => {
    // Select a service
    await page.locator('.card').filter({ hasText: /Selectionner/i }).first().click();

    // Navigate to analysis
    await page.goto('/proteger-mes-donnees/analyse');

    // Check if analysis or results are visible
    // It might show "Calcul en cours..." or the score
    const analysisContent = page.locator('.card');
    await expect(analysisContent.first()).toBeVisible();
    
    // Verify we are on step 2 in the nav
    const stepAnalysis = page.locator('li.step').nth(1);
    await expect(stepAnalysis).toHaveClass(/step-primary/);
  });
});
