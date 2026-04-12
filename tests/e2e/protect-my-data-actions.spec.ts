import { test, expect } from '@playwright/test';

test.describe('Protect My Data Actions', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to selection page and wait for UI hydration through explicit elements.
    await page.goto('/proteger-mes-donnees', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /Sélectionnez les services/i })).toBeVisible();

    // 2. Select Google Drive
    // Cards render as <label>+<checkbox> (not buttons); aria-label="Sélectionner {name}".
    await page.getByPlaceholder(/Rechercher/i).fill('google drive');
    const googleDriveCheckbox = page.getByLabel(/Sélectionner Google Drive/i).first();
    await expect(googleDriveCheckbox).toBeVisible();
    await googleDriveCheckbox.click();
    
    // 3. Select a second stable service to keep the flow representative.
    await page.getByPlaceholder(/Rechercher/i).fill('airbnb');
    const airbnbCheckbox = page.getByLabel(/Sélectionner Airbnb/i).first();
    await expect(airbnbCheckbox).toBeVisible();
    await airbnbCheckbox.click();

    // 4. Go to analysis
    await page.getByRole('button', { name: /Analyser mes risques/i }).click();
    await expect(page).toHaveURL(/\/proteger-mes-donnees\/analyse\/?$/);
    
    // Wait for analysis result to be fully rendered before moving to actions.
    await expect(page.locator('span').filter({ hasText: '/100' }).first()).toBeVisible();

    // 5. Go to actions using the stable progress-nav step.
    const actionsStepButton = page.locator('nav').getByRole('button', { name: /^Actions$/ });
    await expect(actionsStepButton).toBeVisible();
    await expect(actionsStepButton).toBeEnabled();
    await actionsStepButton.click();
    await expect(page).toHaveURL(/\/proteger-mes-donnees\/actions\//);
  });

  test('should keep flow stable when skipping alternative and going back to alternative tab', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    const initialUrl = page.url();

    // Step 1: Skip the alternative step.
    await expect(page.getByRole('heading', { name: /Trouver une alternative plus sûre/i })).toBeVisible();
    await page.getByRole('button', { name: /Passer cette étape/i }).click();

    // Step 2: Export step should be displayed.
    await expect(page.getByRole('heading', { name: /Exporter vos données/i })).toBeVisible();

    // Step 3: Going back to Alternative tab must not crash or redirect away.
    await page.getByRole('button', { name: /^Alternative$/ }).click();
    await expect(page.getByRole('heading', { name: /Trouver une alternative plus sûre/i })).toBeVisible();
    await expect(page).toHaveURL(initialUrl);

    expect(pageErrors, `Unexpected page errors: ${pageErrors.join(' | ')}`).toEqual([]);
  });

});
