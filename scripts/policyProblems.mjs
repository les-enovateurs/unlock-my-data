import fs from "node:fs";
import path from "node:path";

/** Under this, the text is too short for anything to be extracted from it. Same
 *  threshold the index uses to decide a service has a usable inventory. */
export const MIN_REVIEWABLE_CHARS = 500;

/** What a volunteer should do about it. A few characters came back, so the URL
 *  is right and the extraction is what failed; nothing came back, and the URL
 *  itself is the suspect. */
export function suggestedAction(status, detail) {
  if (status !== "low-content") return "fix_url";
  return parseInt(detail, 10) > 0 ? "re_extract" : "fix_url";
}

/**
 * The extraction problems, read from the data itself.
 *
 * They used to be parsed out of the pipeline run log — a file that is not in
 * the repository and only rewritten by a full run. The queue therefore showed
 * a snapshot from 2026-07-24 for weeks: Doctolib listed as "low-content
 * (0 chars)" while it held a reviewed 82-item inventory, Boulanger listed as
 * "no-url" with a policy fetched since. The fiches and the analysis JSONs are
 * the truth, so read those: the list is then correct on every machine, and
 * fixes disappear from it the moment they land.
 *
 * Three situations, one per thing a human can act on:
 *   - `no-url`      the fiche names no privacy policy
 *   - `non-analyse` a URL, but the pipeline produced nothing (blocked fetch,
 *                   or never run on it)
 *   - `low-content` a text too short to review
 *
 * A policy fetched in full but not yet passed to the LLM is not a problem: the
 * queue already files it under `analyse_en_attente`.
 */
export default function derivePolicyProblems({ paDir, manualDir }) {
  if (!fs.existsSync(manualDir)) return [];
  const problems = [];
  for (const file of fs.readdirSync(manualDir)) {
    if (!file.endsWith(".json")) continue;
    let man; try { man = JSON.parse(fs.readFileSync(path.join(manualDir, file), "utf8")); } catch { continue; }
    // `slugs.json` is a pipeline mishap sitting in the fiche directory: an
    // array of slugs, no name. Anything without a name is not a service.
    if (!man || typeof man.name !== "string" || !man.name.trim()) continue;
    // A draft has no published fiche to fix yet — it is not volunteer homework.
    if (man.draft || man.is_draft || man.status === "draft") continue;

    const slug = file.replace(/\.json$/, "");
    const service_name = man.name;
    const policy_url = man.confidentiality_policy_url || man.confidentiality_policy_url_en || null;
    const push = (status, detail) => problems.push({
      slug, service_name, status, detail, policy_url,
      suggested_action: suggestedAction(status, detail),
    });

    if (!policy_url) { push("no-url", ""); continue; }

    const analysisFile = path.join(paDir, `${slug}.json`);
    if (!fs.existsSync(analysisFile)) { push("non-analyse", "aucune analyse produite"); continue; }

    let d; try { d = JSON.parse(fs.readFileSync(analysisFile, "utf8")); } catch {
      push("non-analyse", "analyse illisible"); continue;
    }
    const chars = d.source?.markdown_chars ?? 0;
    if (chars < MIN_REVIEWABLE_CHARS) push("low-content", `${chars} chars`);
  }
  problems.sort((a, b) => a.service_name.localeCompare(b.service_name));
  return problems;
}
