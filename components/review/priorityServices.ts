/**
 * The review queue: ten services, and only these ten.
 *
 * The queue used to list all 127 sorted by name — Action, Airbnb, Alibaba — so
 * it opened on services nobody is waiting on and read as a chore no volunteer
 * could finish. These ten are names the French public recognises, picked for
 * how likely their policies are to trigger the closed-list criteria of the
 * "à signaler" axis — the reviews that produce something publishable soonest:
 *
 *   zalando         scoring, données achetées, décision automatisée (mesuré)
 *   doctolib        santé : partage commercial, conservation indéfinie
 *   amazon          données achetées, mineurs, décision automatisée
 *   pronote         mineurs (données scolaires)
 *   france-travail  décision automatisée, scoring
 *   blablacar       localisation, partage commercial
 *   revolut         scoring, décision automatisée
 *   snapchat        mineurs, biométrie
 *   tiktok          mineurs, partage commercial
 *   temu            données achetées, partage commercial
 *
 * la-poste and deliveroo are analysed and highlight cleanly too; they are the
 * first swaps in if one of the ten turns out to be a dud.
 *
 * Doctolib (JS-rendered, 0 chars extracted) and Amazon (consent wall, 1164
 * chars of boilerplate) are here because their HTML was supplied by hand and
 * run through `inventory --from-html`: their text is published like any other,
 * but `source.url_source` reads `colle_par_benevole` and a `.meta.json` sidecar
 * names who supplied it. Leboncoin has no fiche in the index at all.
 *
 * Editorial and hand-picked: "incontournable" is a judgement, not a
 * computation. Cheap to change — it is one array, and an unknown slug is
 * skipped rather than rendered as a dead row.
 *
 * The other services are not deleted, only unlisted: `?service=<slug>` still
 * opens any of them, and the "Problèmes d'extraction" tab is untouched.
 */
export const PRIORITY_SLUGS = [
  "zalando", "doctolib", "amazon", "pronote", "france-travail",
  "blablacar", "revolut", "snapchat", "tiktok", "temu",
] as const;

const PRIORITY_RANK = new Map<string, number>(
  PRIORITY_SLUGS.map((slug, i) => [slug, i])
);

/** Split the queue into "start here" and everything else, preserving the
 *  curated order for the first bucket and the incoming order for the second. */
export function splitQueue<T extends { slug: string }>(
  rows: T[]
): { priority: T[]; rest: T[] } {
  const priority: T[] = [];
  const rest: T[] = [];
  for (const r of rows) {
    if (PRIORITY_RANK.has(r.slug)) priority.push(r);
    else rest.push(r);
  }
  priority.sort((a, b) => PRIORITY_RANK.get(a.slug)! - PRIORITY_RANK.get(b.slug)!);
  return { priority, rest };
}
