import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Support the association', () => {
    test('/soutenir has one h1 and a donation link', async ({ page }) => {
        await page.goto('/soutenir');
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('a[href^="https://les-enovateurs.com/dons"]').first()).toBeVisible();
    });

    test('Donorbox loads only after the visitor asks for the form', async ({ page }) => {
        const donorboxRequests: string[] = [];
        page.on('request', (r) => { if (r.url().includes('donorbox.org')) donorboxRequests.push(r.url()); });
        await page.goto('/soutenir', { waitUntil: 'networkidle' });
        expect(donorboxRequests).toEqual([]);
        await expect(page.locator('dbox-widget')).toHaveCount(0);

        await page.getByRole('button', { name: /Afficher le formulaire de don/i }).click();
        await expect(page.locator('dbox-widget')).toHaveCount(1);
        await expect(page.locator('a[href="https://donorbox.org/les-enovateurs"]')).toBeVisible();
    });

    test('/soutenir has no detectable accessibility violations', async ({ page }) => {
        await page.goto('/soutenir', { waitUntil: 'networkidle' });
        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();
        expect(results.violations).toEqual([]);
    });

    test('desktop header links to /soutenir', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto('/');
        const nav = page.locator('header nav.nav');
        await nav.getByRole('link', { name: 'Soutenir' }).click();
        await expect(page).toHaveURL(/\/soutenir\/?$/);
    });

    test('mobile menu links to /soutenir', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/');
        await page.getByRole('button', { name: 'Menu principal' }).click();
        await expect(page.getByRole('dialog').getByRole('link', { name: 'Soutenir' })).toBeVisible();
    });

    test('/support is the English page', async ({ page }) => {
        await page.goto('/support');
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        await expect(page.locator('h1')).toContainText('Keep Unlock My Data free');
    });
});
