import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Protect My Data - Full Selection Regression Test', () => {
    // Read all slugs from the JSON file to ensure we're testing everything
    const servicesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/services.json'), 'utf8'));
    const allSlugs = servicesData.map((s: any) => s.slug);

    test('should select ALL services and proceed to Step 2 without crashing', async ({ page }) => {
        // Collect console errors
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                // Ignore all 404 errors as they are expected for some services missing optional data
                if (text.includes('404')) {
                    console.log(`Expected 404 ignored: ${text}`);
                    return;
                }
                errors.push(text);
                console.log(`BROWSER ERROR: ${text}`);
            }
        });

        // Fail test on any window error (JS Crash)
        page.on('pageerror', err => {
            errors.push(`PAGE_CRASH: ${err.message}`);
            console.log(`CRITICAL PAGE ERROR: ${err.message}`);
        });

        await page.goto('/proteger-mes-donnees');

        // Wait for initial hydration
        await page.waitForTimeout(2000);

        console.log(`Selecting all ${allSlugs.length} services...`);

        // Use evaluate to select all services in localStorage directly
        // This is much faster than clicking 92 cards
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
        }, { slugs: allSlugs, key: 'protect-data-selection' });

        // Wait for reload and hydration
        await page.waitForTimeout(2000);

        // Verify selected count
        const selectedCountText = page.getByText(new RegExp(`${allSlugs.length}`)).first();
        await expect(selectedCountText).toBeVisible();

        console.log('Clicking on "Analyser mes risques" button...');
        const analyzeBtn = page.getByRole('button', { name: /Analyser mes risques/i }).first();
        await expect(analyzeBtn).toBeVisible();
        await analyzeBtn.click();

        // Wait for analysis page - this can take a while with 90+ services
        await expect(page).toHaveURL(/.*analyse/, { timeout: 30000 });
        
        console.log('On analysis page, waiting for results...');

        // Verify we are on the analysis page and results are loading or shown
        // Look for h1, h2 or h3 with relevant text
        const analysisTitle = page.locator('h1, h2, h3').filter({ hasText: /Analyse|Score|Calcul/i }).first();
        await expect(analysisTitle).toBeVisible({ timeout: 30000 });

        // If it was calculating, wait for it to finish and show the score
        // The score card has /100 and risk level text
        const scoreDisplay = page.locator('div').filter({ hasText: /\/100/ }).first();
        await expect(scoreDisplay).toBeVisible({ timeout: 45000 });

        console.log('Analysis completed successfully.');

        // Check if there are any specific error messages on page
        const bodyText = await page.innerText('body');
        expect(bodyText.toLowerCase()).not.toContain('error');
        expect(bodyText.toLowerCase()).not.toContain('erreur');
        expect(bodyText.toLowerCase()).not.toContain('crash');

        // Check for any collected browser errors
        if (errors.length > 0) {
            console.log('Collected Errors:', errors);
        }
        expect(errors).toHaveLength(0);

        console.log('Successfully analyzed all services without crashes.');
    });
});
