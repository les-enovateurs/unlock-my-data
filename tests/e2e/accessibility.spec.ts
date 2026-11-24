import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { enterAdvanced, selectService, goToAnalysis, goToPlan } from './helpers';

test.describe('Accessibility Checks', () => {
    const pagesToCheck = [
        { name: 'Home (FR)', url: '/' },
        { name: 'Home (EN)', url: '/en/' },
        { name: 'Protéger mes données', url: '/proteger-mes-donnees' },
        { name: 'Nettoyage numérique', url: '/nettoyage-numerique' },
        { name: 'Comparatif', url: '/comparer' },
        { name: 'Politique de confidentialité', url: '/politique-confidentialite' },
        { name: 'Nouvelle fiche (contribution)', url: '/contribuer/nouvelle-fiche' },
        { name: 'Classement contributeurs', url: '/contributeurs' },
        { name: 'Supprimer mes données', url: '/supprimer-mes-donnees' },
        { name: 'Catalogue', url: '/liste-applications' },
        { name: 'Fiche WhatsApp', url: '/liste-applications/whatsapp' },
        { name: 'Presse', url: '/presse' },
        { name: 'Ateliers', url: '/ateliers' },
        { name: 'Contribuer', url: '/contribuer' },
        { name: 'Missions', url: '/contribuer/missions' },
        { name: 'Transferts', url: '/transferts' },
        { name: 'Intégrer', url: '/integrer' },
    ];

    for (const pageInfo of pagesToCheck) {
        test(`should not have any automatically detectable accessibility violations on ${pageInfo.name}`, async ({ page }) => {
            await page.goto(pageInfo.url);
            await page.waitForTimeout(2000);

            const accessibilityScanResults = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .analyze();

            if (accessibilityScanResults.violations.length > 0) {
                console.log(`\nAccessibility violations on ${pageInfo.name} (${pageInfo.url}):`);
                accessibilityScanResults.violations.forEach((violation, index) => {
                    console.log(`${index + 1}. ${violation.id}: ${violation.help} (impact: ${violation.impact}, nodes: ${violation.nodes.length})`);
                });
            }

            expect(accessibilityScanResults.violations).toEqual([]);
        });
    }

    test('should not have accessibility violations in the alternatives drawer', async ({ page }) => {
        await enterAdvanced(page);
        await selectService(page, 'WhatsApp');
        await goToAnalysis(page);
        await goToPlan(page);

        await page.getByRole('button', { name: /^Comparer$/i }).first().click();
        await expect(page.getByRole('dialog')).toBeVisible();

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});