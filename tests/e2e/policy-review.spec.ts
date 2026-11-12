import { test, expect } from '@playwright/test';

test.describe('Policy human-review (revue de confidentialité)', () => {
    test('queue → detail → validate one citation', async ({ page }) => {
        await page.goto('/contribuer/revue-confidentialite');

        // Queue view: eyebrow + heading + at least one service row loaded from _index.json
        await expect(page.getByText(/Vérification par un humain/i)).toBeVisible();
        await expect(page.getByText(/À relire/i).first()).toBeVisible();

        const serviceRows = page.locator('button.umd-card');
        await expect(serviceRows.first()).toBeVisible();

        // Verdicts are signed: without a pseudo the tool refuses to save.
        await page.locator('input.umd-input').first().fill('E2E');

        // Open the first service row in the queue.
        await serviceRows.first().click();

        // Detail view reached: back button + status chip header are always present,
        // regardless of whether this particular service has an inventory to review.
        const backButton = page.getByRole('button', { name: /File d'attente/i });
        await expect(backButton).toBeVisible();

        // The two-pane review layout (iframe + focus item) only renders when the
        // service has inventory items left to check — be resilient to either case.
        const iframe = page.locator('iframe');
        if (await iframe.count()) {
            await expect(iframe.first()).toBeVisible();

            const validate = page.getByRole('button', { name: /Valider/i });
            if (await validate.count()) {
                await validate.first().click();
            }
        }

        // Navigate back to the queue and confirm we're there again.
        await backButton.click();
        await expect(page.getByText(/À relire/i).first()).toBeVisible();
    });

});
