// local-tools/build-reviews-feedback.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function buildReviewsFeedback({ root = path.join(__dirname, ".."), now } = {}) {
  const dir = path.join(root, "public", "data", "policy-analysis", "reviews");
  const by_reason = {};
  const by_criterion = {};
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
    }
  }
  const out = { generated_at: now || new Date().toISOString(), by_reason, by_criterion };
  fs.writeFileSync(path.join(dir, "..", "reviews-feedback.json"), JSON.stringify(out, null, 2) + "\n");
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = buildReviewsFeedback();
  console.log(`reviews-feedback: ${Object.keys(r.by_reason).length} reason buckets`);
}
