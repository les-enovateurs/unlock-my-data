import { test, expect } from '@playwright/test';

// The fiche reads `privacy_policy_quote_fr` / `_en` through pickLang: a key rename
// that misses the reader leaves the quote box silently empty.
test.describe('Privacy policy quote on the fiche', () => {
    test('French fiche shows the FR quote', async ({ page }) => {
        await page.goto('/liste-applications/airbnb-inc/fuites');
        await expect(page.locator('blockquote.umd-quotebox')).toContainText('Pour faciliter nos activités mondiales');
    });

    test('English fiche shows the EN quote', async ({ page }) => {
        await page.goto('/list-app/airbnb-inc/fuites');
        await expect(page.locator('blockquote.umd-quotebox')).toContainText('To facilitate our global operations');
    });
});

test('Edit form loads the FR quote of an existing fiche', async ({ page }) => {
    await page.goto('/contribuer/modifier-fiche?slug=airbnb-inc');
    await page.getByRole('button', { name: 'Sanctions et transferts de données' }).click();
    await expect(page.getByRole('textbox', { name: 'Citation de la politique de confidentialité', exact: true }))
        .toHaveValue(/Pour faciliter nos activités mondiales/);
});
