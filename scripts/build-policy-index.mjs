import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { countEssentials, deriveStatus } from "./policyEssentials.mjs";
import { pendingHistory, pendingKeyQuotes, publishedHistory, publishedKeyQuotes } from "./policyQuotes.mjs";

// Not `__dirname`: jest transforms .mjs to CJS, where that name already exists.
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

// Cross-service aggregates written into the same directory by the pipeline.
// They carry no `service_name`, so without this they surfaced in the review
// queue as two phantom services stuck on "Inventaire non disponible".
export const NON_SERVICE_FILES = new Set([
  "comparatif.json", "reviews-feedback.json", "vendors.json",
]);

export default function buildPolicyIndex({ root = path.join(SCRIPT_DIR, ".."), now } = {}) {
  const paDir = path.join(root, "public", "data", "policy-analysis");
  const reviewsDir = path.join(paDir, "reviews");
  const generated_at = now || new Date().toISOString();

  // sidecars
  const sidecars = {};
  if (fs.existsSync(reviewsDir)) {
    for (const f of fs.readdirSync(reviewsDir)) {
      if (!f.endsWith(".json")) continue;
      try { sidecars[f.replace(".json", "")] = JSON.parse(fs.readFileSync(path.join(reviewsDir, f), "utf8")); } catch {}
    }
  }

  let vendors = {};
  try {
    vendors = JSON.parse(fs.readFileSync(path.join(paDir, "vendors.json"), "utf8"));
  } catch { /* no registry yet: nothing is settled, everything is asked */ }

  const readProposals = (file) => {
    try { return JSON.parse(fs.readFileSync(path.join(root, "public", "data", file), "utf8")); } catch { return {}; }
  };
  const proposals = readProposals("policy-quotes.json");
  const changes = readProposals("policy-history.json");

  // service JSONs → index rows
  const services = [];
  for (const f of fs.readdirSync(paDir)) {
    if (!f.endsWith(".json") || f.startsWith("_") || NON_SERVICE_FILES.has(f)) continue;
    let d; try { d = JSON.parse(fs.readFileSync(path.join(paDir, f), "utf8")); } catch { continue; }
    const slug = f.replace(".json", "");
    const side = sidecars[slug];
    const hasInv = Boolean(d.data_inventory) && (d.source?.markdown_chars ?? 0) >= 500;
    // Essentials left to rule on — not "rejected items", which counted the
    // wrong thing entirely: it read 0 on all 113 services, none of which had
    // been reviewed, and the UI rendered that as "Inventaire vérifié ✓".
    // Reading vendors.json is what makes this fall from one service to the
    // next: a company settled elsewhere is no longer anybody's homework.
    const needsCount = countEssentials(d, side, vendors);
    services.push({
      slug, service_name: d.service_name || slug, ia_status: d.ia_status || "needs_review",
      has_inventory: hasInv, analyzed_at: d.analyzed_at || null,
      // Human-review lifecycle always starts at needs_review regardless of the
      // AI pipeline's ia_status (e.g. "ia_processed") — never leak a non-review
      // status into review_status, or the queue stats break.
      // Five states, not one catch-all: a policy nobody could fetch is not a
      // review backlog, and the queue must not pretend it is.
      review_status: deriveStatus(d, side),
      needs_count: needsCount,
      key_quotes: proposals[slug]?.quotes.length || 0,
      key_quotes_pending: pendingKeyQuotes(proposals[slug], side),
      history: changes[slug]?.length || 0,
      history_pending: pendingHistory(changes[slug], side),
    });
  }
  // The AI inventory pipeline is stopped: new services only have key quotes or
  // a history, and without a row the review page cannot open them.
  const indexed = new Set(services.map((r) => r.slug));
  for (const slug of new Set([...Object.keys(proposals), ...Object.keys(changes)])) {
    if (indexed.has(slug)) continue;
    const side = sidecars[slug];
    services.push({
      slug, service_name: proposals[slug]?.name || slug, ia_status: "needs_review",
      has_inventory: false, analyzed_at: null,
      review_status: deriveStatus({ source: { url_source: "colle_par_benevole" } }, side),
      needs_count: 0,
      key_quotes: proposals[slug]?.quotes.length || 0,
      key_quotes_pending: pendingKeyQuotes(proposals[slug], side),
      history: changes[slug]?.length || 0,
      history_pending: pendingHistory(changes[slug], side),
    });
  }
  services.sort((a, b) => a.service_name.localeCompare(b.service_name));

  // What the site shows: only the key quotes that passed review (policyQuotes.mjs).
  const quotes = {};
  for (const [slug, entry] of Object.entries(proposals)) {
    const shown = publishedKeyQuotes(entry, sidecars[slug]);
    if (!shown.length) continue;
    const { name, agent, created_by, created_at, updated_by, updated_at, live_check, archive_url, en, usage } = entry;
    quotes[slug] = { name, agent, created_by, created_at, updated_by, updated_at, live_check, archive_url, en, usage, quotes: shown };
  }
  fs.writeFileSync(path.join(paDir, "_quotes.json"), JSON.stringify(quotes, null, 2) + "\n");

  const history = {};
  for (const [slug, entries] of Object.entries(changes)) {
    const shown = publishedHistory(entries, sidecars[slug]);
    if (shown.length) history[slug] = shown;
  }
  fs.writeFileSync(path.join(paDir, "_history.json"), JSON.stringify(history, null, 2) + "\n");
  fs.writeFileSync(path.join(paDir, "_index.json"), JSON.stringify({ generated_at, services }, null, 2) + "\n");
  return { services };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = buildPolicyIndex();
  console.log(`policy-index: ${r.services.length} services`);
}
