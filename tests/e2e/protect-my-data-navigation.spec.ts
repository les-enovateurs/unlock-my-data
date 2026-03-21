import { test, expect, type Page } from '@playwright/test';

test.describe('Protect My Data Navigation', () => {
  const stepAnalysisInNav = (page: Page) =>
    page.locator('nav').getByRole('button', { name: /^Analyse$/ });

  const scoreOn100 = (page: Page) =>
    page.locator('span').filter({ hasText: '/100' }).first();

  test.beforeEach(async ({ page }) => {
    // Navigate to the Protect My Data page (French version by default)
    await page.goto('/proteger-mes-donnees');
    // Wait for services to load - we check for the presence of buttons in the main area
    await expect(page.getByRole('heading', { name: /Sélectionnez les services/i })).toBeVisible({ timeout: 10000 });
  });

  test('should disable Step 2 when no services are selected', async ({ page }) => {
    // Step buttons have role="button"
    const stepAnalysis = stepAnalysisInNav(page);
    
    // Check if it has the cursor-not-allowed class or is disabled
    await expect(stepAnalysis).toHaveClass(/cursor-not-allowed/);
    
    // Clicking it should not change the URL
    await stepAnalysis.click();
    await expect(page).toHaveURL(/\/proteger-mes-donnees\/?$/);
  });

  test('should allow navigation to Step 2 after selecting a service', async ({ page }) => {
    // Select a service (e.g. Facebook which is usually present)
    await page.getByPlaceholder(/Rechercher/i).fill('facebook');
    const facebookCard = page.getByRole('button', { name: /Facebook/i }).first();
    await facebookCard.click();

    // Now Step 2 should be clickable
    const stepAnalysis = stepAnalysisInNav(page);
    await expect(stepAnalysis).not.toHaveClass(/cursor-not-allowed/);

    // Click on Step 2 in navigation bar
    await stepAnalysis.click();

    // Should navigate to analysis page
    await expect(page).toHaveURL(/\/proteger-mes-donnees\/analyse\/?$/);
    
    // Wait for score card to appear once analysis is completed.
    await expect(scoreOn100(page)).toBeVisible({ timeout: 30000 });
  });

  test('should trigger analysis automatically when navigating to Step 2', async ({ page }) => {
    // Select a service
    await page.getByPlaceholder(/Rechercher/i).fill('facebook');
    await page.getByRole('button', { name: /Facebook/i }).first().click();

    // Navigate to analysis
    await page.goto('/proteger-mes-donnees/analyse');

    // Check if analysis completed and score is visible.
    await expect(scoreOn100(page)).toBeVisible({ timeout: 30000 });
    
    // Verify we are on step 2 in the nav
    const stepAnalysis = stepAnalysisInNav(page);
    await expect(stepAnalysis).toHaveClass(/step-primary/);
  });
});
