import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseProblemLine, suggestedAction } from "./policyLogParser.mjs";
import { countEssentials } from "./policyEssentials.mjs";

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
  const logCandidates = [
    path.join(root, "tools", "unlock-my-data-policy-analysis-by-ia", "cache", "run-all.log"),
    path.join(root, "tools", "logger-inventory.txt"),
  ];
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
      review_status: side?.status || "needs_review",
      needs_count: needsCount,
    });
  }
  services.sort((a, b) => a.service_name.localeCompare(b.service_name));

  // problems from log
  const logFile = logCandidates.find((p) => fs.existsSync(p));
  const problems = [];
  if (logFile) {
    for (const line of fs.readFileSync(logFile, "utf8").split("\n")) {
      const p = parseProblemLine(line);
      if (!p) continue;
      // service_name + policy_url from manual fiche when available
      let service_name = p.slug, policy_url = null;
      try {
        const man = JSON.parse(fs.readFileSync(path.join(manualDir, `${p.slug}.json`), "utf8"));
        service_name = man.name || p.slug;
        policy_url = man.confidentiality_policy_url || man.confidentiality_policy_url_en || null;
      } catch {}
      problems.push({ slug: p.slug, service_name, status: p.status, detail: p.detail, policy_url, suggested_action: suggestedAction(p.status, p.detail) });
    }
  }

  fs.writeFileSync(path.join(paDir, "_index.json"), JSON.stringify({ generated_at, services }, null, 2) + "\n");
  fs.writeFileSync(path.join(paDir, "_problems.json"), JSON.stringify({ generated_at, problems }, null, 2) + "\n");
  return { services, problems };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = buildPolicyIndex();
  console.log(`policy-index: ${r.services.length} services, ${r.problems.length} problems`);
}
