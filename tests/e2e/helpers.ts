import { Page, expect } from '@playwright/test';

/**
 * Shared helpers for the redesigned "Protéger mes données" flow.
 *
 * The page now has two modes (easy quiz / advanced) selected via tabs, and the
 * advanced mode drives an in-page 3-step flow (select → analyse → plan) held in
 * component state — there are no more /analyse or /actions routes.
 */

/** Open the page and switch to the advanced (per-app) mode. */
export async function enterAdvanced(page: Page) {
  await page.goto('/proteger-mes-donnees');
  await page.getByRole('tab', { name: /Mode avancé/i }).click();
  await expect(
    page.getByRole('heading', { name: /Quelles applications utilisez-vous/i })
  ).toBeVisible();
}

/** Search for a service by name and toggle its card in the selection grid. */
export async function selectService(page: Page, name: string) {
  await page.getByPlaceholder(/Rechercher un service/i).fill(name);
  // Service cards are <button aria-pressed> — a marker unique to this grid.
  const card = page.locator('button[aria-pressed]').filter({ hasText: name }).first();
  await expect(card).toBeVisible();
  await card.click();
  await expect(card).toHaveAttribute('aria-pressed', 'true');
}

/** From the select step, advance to the analysis step. */
export async function goToAnalysis(page: Page) {
  await page.getByRole('button', { name: /Analyser mes risques/i }).first().click();
  // Analysis step renders the risk tiles (e.g. "Transferts hors UE").
  await expect(page.getByText(/Transferts hors UE/i)).toBeVisible();
}

/** From the analysis step, advance to the action plan. */
export async function goToPlan(page: Page) {
  await page.getByRole('button', { name: /Voir mon plan d'action/i }).click();
}

/** A step button inside the advanced progress nav, matched on its exact label. */
export function stepButton(page: Page, label: RegExp) {
  return page.locator('nav').getByRole('button', { name: label });
}