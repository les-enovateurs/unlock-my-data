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
    await expect(page.getByRole('heading', { name: /Sélectionnez les services/i })).toBeVisible();
  });

  const selectGoogleService = async (page: Page) => {
    await page.getByPlaceholder(/Rechercher/i).fill('google drive');
    // Cards render as <label> + <input type="checkbox"> (not buttons).
    // The checkbox has aria-label="Sélectionner {name}" per the i18n key in Shared.json.
    // The service in services.json is named "Google Drive" (not "Google").
    const googleCheckbox = page.getByLabel(/Sélectionner Google Drive/i).first();
    await expect(googleCheckbox).toBeVisible();
    await googleCheckbox.click();
  };

  test('should disable Step 2 when no services are selected', async ({ page }) => {
    // Step buttons have role="button"
    const stepAnalysis = stepAnalysisInNav(page);
    
    // Check if it has the cursor-not-allowed class or is disabled
    await expect(stepAnalysis).toHaveClass(/cursor-not-allowed/);
    
    // Clicking it should not change the URL
    await stepAnalysis.click({ force: true });
    await expect(page).toHaveURL(/\/proteger-mes-donnees\/?$/);
  });

  test('should allow navigation to Step 2 after selecting a service', async ({ page }) => {
    await selectGoogleService(page);

    // Now Step 2 should be clickable
    const stepAnalysis = stepAnalysisInNav(page);
    await expect(stepAnalysis).not.toHaveClass(/cursor-not-allowed/);

    // Click on Step 2 in navigation bar
    await stepAnalysis.click();

    // Should navigate to analysis page
    await expect(page).toHaveURL(/\/proteger-mes-donnees\/analyse\/?$/);
    
    // Wait for score card to appear once analysis is completed.
    await expect(scoreOn100(page)).toBeVisible();
  });

  test('should trigger analysis automatically when navigating to Step 2', async ({ page }) => {
    await selectGoogleService(page);

    // Navigate to analysis
    await page.goto('/proteger-mes-donnees/analyse');

    // Check if analysis completed and score is visible.
    await expect(scoreOn100(page)).toBeVisible();

    // Verify the analysis step is marked as the current step in the nav
    const stepAnalysis = stepAnalysisInNav(page);
    await expect(stepAnalysis).toHaveAttribute('aria-current', 'step');
  });
});
