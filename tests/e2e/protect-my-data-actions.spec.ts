import { test, expect } from '@playwright/test';

test.describe('Protect My Data Actions', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to selection page
    await page.goto('/proteger-mes-donnees');
    await expect(page.getByRole('heading', { name: /Sélectionnez les services/i })).toBeVisible({ timeout: 10000 });
    
    // 2. Select Facebook
    await page.getByPlaceholder(/Rechercher/i).fill('facebook');
    await page.getByRole('button', { name: /Facebook/i }).first().click();
    
    // 3. Select Google Drive
    await page.getByPlaceholder(/Rechercher/i).fill('google drive');
    await page.getByRole('button', { name: /Google Drive/i }).first().click();
    
    // 4. Go to analysis
    await page.getByRole('button', { name: /Analyser mes risques/i }).click();
    await expect(page).toHaveURL(/\/proteger-mes-donnees\/analyse\/?$/);
    
    // 5. Go to actions
    await page.getByRole('button', { name: /Passer aux actions/i }).click();
    await expect(page).toHaveURL(/\/proteger-mes-donnees\/actions\//);
  });

  test('should reset subStep when skipping to next service', async ({ page }) => {
    const alternativeHeading = page.getByRole('heading', { name: /Trouver une alternative( plus sûre)?/i });
    const exportHeading = page.getByRole('heading', { name: /Exporter vos données/i });
    const deleteHeading = page.getByRole('heading', { name: /Supprimer votre compte/i });

    // Depending on service action needs, we can start on Alternative or directly on Export.
    if (await alternativeHeading.isVisible()) {
      await page.getByRole('button', { name: /Passer cette étape/i }).click();
      await expect(exportHeading).toBeVisible();
    } else {
      await expect(exportHeading).toBeVisible({ timeout: 15000 });
    }

    // Move to Delete subStep.
    await page.getByRole('button', { name: /Passer, je n'en ai pas besoin/i }).click();
    await expect(deleteHeading).toBeVisible();
    
    // Now we are on "Suppression" subStep for Service 1.
    // Click "Passer au service suivant"
    await page.getByRole('button', { name: /Passer au service suivant/i }).click();
    
    // Verify we reset away from Delete for service 2.
    await expect(deleteHeading).not.toBeVisible();
    const hasAlternative = await alternativeHeading.isVisible();
    const hasExport = await exportHeading.isVisible();
    expect(hasAlternative || hasExport).toBeTruthy();
  });
});
