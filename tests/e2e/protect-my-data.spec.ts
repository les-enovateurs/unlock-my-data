import { test, expect } from '@playwright/test';
import { enterAdvanced, selectService, goToAnalysis, goToPlan } from './helpers';

test.describe('Protect My Data Flow', () => {

    test('should load the protect-my-data page successfully', async ({ page }) => {
        await page.goto('/proteger-mes-donnees');

        // Hero title.
        await expect(page.getByRole('heading', { name: /Protégez vos données/i })).toBeVisible();

        // Mode tabs (easy / advanced) are the entry points.
        await expect(page.getByRole('tab', { name: /Mode facile/i })).toBeVisible();
        await expect(page.getByRole('tab', { name: /Mode avancé/i })).toBeVisible();
    });

    test('should let the user search and select a service in advanced mode', async ({ page }) => {
        await enterAdvanced(page);
        await selectService(page, 'WhatsApp');

        // The sticky selection panel reflects the count (the big number is unique in the aside).
        await expect(page.getByText(/Votre sélection/i)).toBeVisible();
        await expect(page.locator('aside .text-4xl')).toHaveText('1');
    });

    test('should open and close the alternatives drawer gracefully', async ({ page }) => {
        await enterAdvanced(page);
        await selectService(page, 'WhatsApp');
        await goToAnalysis(page);
        await goToPlan(page);

        // WhatsApp (US) gets a recommended sovereign alternative in the plan.
        await expect(page.getByText(/Migrer vers/i).first()).toBeVisible();

        // Open the comparison drawer.
        await page.getByRole('button', { name: /^Comparer$/i }).first().click();

        const drawer = page.getByRole('dialog');
        await expect(drawer).toBeVisible();
        await expect(drawer.getByRole('heading', { name: /Une meilleure solution/i })).toBeVisible();

        // Close it.
        await drawer.getByRole('button', { name: /Fermer/i }).click();
        await expect(page.getByRole('dialog')).toHaveCount(0);
    });

    test('should flag outside-EU transfers for a service like Slack', async ({ page }) => {
        await enterAdvanced(page);
        await selectService(page, 'Slack');
        await goToAnalysis(page);

        // The analysis surfaces the "Transfers outside EU" tile; Slack (US) counts as one.
        const tile = page.locator('div').filter({ hasText: /^Transferts hors UE$/i }).first();
        await expect(tile).toBeVisible();
        // Going to the plan, Slack must offer either an alternative or a custom action.
        await goToPlan(page);
        await expect(page.getByText(/Slack/i).first()).toBeVisible();
    });
});