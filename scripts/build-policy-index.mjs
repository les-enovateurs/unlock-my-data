import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import derivePolicyProblems from "./policyProblems.mjs";
import { countEssentials, deriveStatus } from "./policyEssentials.mjs";

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
  const manualDir = path.join(root, "public", "data", "manual");
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
      // status into review_status, or StatusChip/queue stats break.
      // Five states, not one catch-all: a policy nobody could fetch is not a
      // review backlog, and the queue must not pretend it is.
      review_status: deriveStatus(d, side),
      needs_count: needsCount,
    });
  }
  services.sort((a, b) => a.service_name.localeCompare(b.service_name));

  // Problems read from the fiches and the analysis JSONs, not from the pipeline
  // run log: that log is not in the repository and only a full run rewrites it,
  // so the queue served a July snapshot on both machines.
  const problems = derivePolicyProblems({ paDir, manualDir });

  fs.writeFileSync(path.join(paDir, "_index.json"), JSON.stringify({ generated_at, services }, null, 2) + "\n");
  fs.writeFileSync(path.join(paDir, "_problems.json"), JSON.stringify({ generated_at, problems }, null, 2) + "\n");
  return { services, problems };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = buildPolicyIndex();
  console.log(`policy-index: ${r.services.length} services, ${r.problems.length} problems`);
}
