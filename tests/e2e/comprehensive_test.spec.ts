import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Protect My Data - Full Selection Regression Test', () => {
    const servicesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/services.json'), 'utf8'));
    const serviceSlugs = new Set(servicesData.map((s: any) => s.slug));
    const selectedSlugs = ['google-drive', 'airbnb-inc'];
    const testSlugs = selectedSlugs.filter(slug => serviceSlugs.has(slug));

    test('should select the necessary services and proceed to Step 2 without crashing', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                if (text.includes('404')) {
                    console.log(`Expected 404 ignored: ${text}`);
                    return;
                }
                errors.push(text);
                console.log(`BROWSER ERROR: ${text}`);
            }
        });

        page.on('pageerror', err => {
            errors.push(`PAGE_CRASH: ${err.message}`);
            console.log(`CRITICAL PAGE ERROR: ${err.message}`);
        });

        await page.goto('/proteger-mes-donnees');
        await page.waitForTimeout(2000);

        console.log(`Selecting ${testSlugs.length} services...`);

        await page.evaluate(({ slugs, key }) => {
            const saveData = {
                selectedServices: slugs,
                completedServices: [],
                skippedServices: [],
                notes: {},
                alternativesAdopted: {},
                alternativesSkipped: [],
                passwordsChanged: [],
                dataExported: [],
                timestamp: new Date().toISOString(),
            };
            localStorage.setItem(key, JSON.stringify(saveData));
            window.location.reload();
        }, { slugs: testSlugs, key: 'protect-data-selection' });

        await expect(page.getByRole('heading', { name: /Sélectionnez les services/i })).toBeVisible({ timeout: 15000 });

        const selectedCountText = page.getByText(new RegExp(`${testSlugs.length}`)).first();
        await expect(selectedCountText).toBeVisible();

        console.log('Clicking on "Analyser mes risques" button...');
        const analyzeBtn = page.getByRole('button', { name: /Analyser mes risques/i }).first();
        await expect(analyzeBtn).toBeVisible();
        await analyzeBtn.click();

        await expect(page).toHaveURL(/.*analyse/, { timeout: 30000 });

        console.log('On analysis page, waiting for results...');

        const analysisTitle = page.locator('h1, h2, h3').filter({ hasText: /Analyse|Score|Calcul/i }).first();
        await expect(analysisTitle).toBeVisible({ timeout: 30000 });

        const scoreDisplay = page.locator('div').filter({ hasText: /\/100/ }).first();
        await expect(scoreDisplay).toBeVisible({ timeout: 45000 });

        console.log('Analysis completed successfully.');

        const bodyText = await page.innerText('body');
        expect(bodyText.toLowerCase()).not.toContain('error');
        expect(bodyText.toLowerCase()).not.toContain('erreur');
        expect(bodyText.toLowerCase()).not.toContain('crash');

        if (errors.length > 0) {
            console.log('Collected Errors:', errors);
        }
        expect(errors).toHaveLength(0);

        console.log('Successfully analyzed necessary services without crashes.');
    });
});
