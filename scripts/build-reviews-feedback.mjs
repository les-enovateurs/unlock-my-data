// scripts/build-reviews-feedback.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// Not `__dirname`: jest transforms .mjs to CJS, where that name already exists.
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

export default function buildReviewsFeedback({ root = path.join(SCRIPT_DIR, ".."), now } = {}) {
  const dir = path.join(root, "public", "data", "policy-analysis", "reviews");
  const by_reason = {};
  const by_criterion = {};
  // Confusion pairs: "the model filed this under X, it belonged under Y", counted
  // across every service. This is the aggregation the prompt gets rewritten from
  // — a single reviewer disagreeing is noise, the same pair twenty times is a
  // rule the model never learnt.
  const by_redirect = {};
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")); } catch {}
  for (const f of files) {
    let side; try { side = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")); } catch { continue; }
    for (const [key, v] of Object.entries(side.items || {})) {
      if (v.verdict !== "rejected" || !v.reason) continue;
      by_reason[v.reason] = (by_reason[v.reason] || 0) + 1;
      // prefix = cat|base|transfert|crit/<domain>|pixel
      const prefix = key.startsWith("crit/") ? key.split("/").slice(0, 2).join("/") : key.split("/")[0];
      by_criterion[prefix] = by_criterion[prefix] || {};
      by_criterion[prefix][v.reason] = (by_criterion[prefix][v.reason] || 0) + 1;
      if (v.redirect_to) {
        // cat/identite -> paiement, dest/3 -> analytics, signal/1 -> scoring
        const from = key.startsWith("cat/") || key.startsWith("purpose/") ? key : prefix;
        const pair = `${from} -> ${v.redirect_to}`;
        by_redirect[pair] = (by_redirect[pair] || 0) + 1;
      }
    }
  }
  const out = { generated_at: now || new Date().toISOString(), by_reason, by_criterion, by_redirect };
  fs.writeFileSync(path.join(dir, "..", "reviews-feedback.json"), JSON.stringify(out, null, 2) + "\n");
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = buildReviewsFeedback();
  console.log(`reviews-feedback: ${Object.keys(r.by_reason).length} reason buckets, `
    + `${Object.keys(r.by_redirect).length} confusion pair(s)`);
}
