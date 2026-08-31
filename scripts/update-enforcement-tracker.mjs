#!/usr/bin/env node
/**
 * GDPR Enforcement Tracker updater
 *
 * Source: enforcementtracker.com, provided by CMS — CC BY-NC-SA 4.0.
 *
 * Usage:
 *   node scripts/update-enforcement-tracker.mjs [--dry-run] [--verbose]
 *                                               [--check-links] [--links-only]
 *
 * --links-only re-checks the regulator source links of the records already in
 * fines.json without refetching the tracker, so a link audit does not drag a
 * full data refresh in with it.
 *
 * One request pulls the whole database from the homepage JSON island; detail
 * pages are fetched only for records that matched a service, to fill in the
 * summary. French decisions are dropped — they are collected from the CNIL.
 *
 * Every output is tracked in the repository: this is an open-source project and
 * a contributor must be able to reproduce and review the result from a clone.
 */
import fs from "node:fs";
import path from "node:path";
import {
  BASE_URL, parseCasesBootstrap, excludeOwnedCountries,
  buildAliasMap, matchRecords, parseSummary, linkVerdict, applyLinkChecks,
} from "./enforcementTracker.mjs";

const ROOT = path.join(import.meta.dirname, "..");
const MANUAL_DIR = path.join(ROOT, "public", "data", "manual");
const OUT_DIR = path.join(ROOT, "public", "data", "enforcement");

const UA = "unlockmydata-bot/1.0 (+https://unlock-my-data.com; contact@les-enovateurs.com)";
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const VERBOSE = args.includes("--verbose");
const CHECK_LINKS = args.includes("--check-links") || args.includes("--links-only");
const LINKS_ONLY = args.includes("--links-only");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => VERBOSE && console.log(...a);

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return res.text();
}

const LINK_TIMEOUT_MS = 15000;

/** HEAD first — a regulator source is often a multi-megabyte PDF and we only
 *  need the status. Some servers answer 405 to HEAD, so those get one GET. */
async function linkStatus(url) {
  const attempt = async (method) => {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(LINK_TIMEOUT_MS),
    });
    return res.status;
  };
  try {
    const head = await attempt("HEAD");
    if (head !== 405 && head !== 501) return head;
    return await attempt("GET");
  } catch {
    return null; // network error or timeout: not evidence of a dead document
  }
}

/** Checks the regulator source of every matched record. Serial and paced: the
 *  targets are national authority servers, not a CDN. */
async function checkSourceLinks(records, matchedIds) {
  const verdicts = new Map();
  const targets = records.filter((r) => matchedIds.has(r.etid) && r.original_source_url);
  console.log(`Checking ${targets.length} regulator source links...`);
  for (const rec of targets) {
    const status = await linkStatus(rec.original_source_url);
    const verdict = linkVerdict(status);
    verdicts.set(rec.etid, verdict);
    if (verdict === "dead") console.warn(`  ! ${rec.etid}: HTTP ${status} — ${rec.original_source_url}`);
    else log(`  ${rec.etid}: ${verdict}${status ? ` (${status})` : ""}`);
    await sleep(500 + Math.random() * 500);
  }
  const dead = [...verdicts.values()].filter((v) => v === "dead").length;
  console.log(`  ${dead} dead link(s) out of ${targets.length}`);
  return verdicts;
}

function loadFiches() {
  const fiches = {};
  for (const file of fs.readdirSync(MANUAL_DIR)) {
    if (!file.endsWith(".json") || file === "slugs.json") continue;
    try {
      const data = JSON.parse(fs.readFileSync(path.join(MANUAL_DIR, file), "utf8"));
      if (data && typeof data === "object" && !Array.isArray(data)) {
        fiches[file.slice(0, -5)] = data;
      }
    } catch {
      console.warn(`  ! unreadable fiche: ${file}`);
    }
  }
  return fiches;
}

/** Summaries already collected in a previous run, so a re-run does not refetch
 *  a detail page it has already seen. */
function previousSummaries() {
  try {
    const prev = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "fines.json"), "utf8"));
    return new Map(prev.filter((r) => r.summary).map((r) => [r.etid, r.summary]));
  } catch {
    return new Map();
  }
}

/** Dead links already established by a previous --check-links run. */
function previousDeadLinks() {
  try {
    const prev = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "fines.json"), "utf8"));
    return new Set(prev.filter((r) => r.original_source_dead).map((r) => r.etid));
  } catch {
    return new Set();
  }
}

/** Re-checks the links of the current fines.json in place. */
async function linksOnly() {
  const finesPath = path.join(OUT_DIR, "fines.json");
  const indexPath = path.join(OUT_DIR, "index-by-slug.json");
  const fines = JSON.parse(fs.readFileSync(finesPath, "utf8"));
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  const matchedIds = new Set(Object.values(index).flat().map((e) => e.etid));
  const verdicts = await checkSourceLinks(fines, matchedIds);
  if (DRY_RUN) {
    console.log("--dry-run: nothing written");
    return;
  }
  fs.writeFileSync(finesPath, JSON.stringify(applyLinkChecks(fines, verdicts), null, 2) + "\n");
  console.log(`Updated ${finesPath}`);
}

async function main() {
  if (LINKS_ONLY) return linksOnly();
  console.log("Fetching the enforcement tracker database...");
  const all = parseCasesBootstrap(await get(`${BASE_URL}/`));
  if (all.length === 0) {
    console.error("No records found — the page structure has probably changed.");
    process.exitCode = 1;
    return;
  }
  const retrieved_at = new Date().toISOString().slice(0, 10);
  const { kept, excluded } = excludeOwnedCountries(all);
  console.log(`  ${all.length} records, ${excluded.length} French decisions excluded`);

  const aliasMap = buildAliasMap(loadFiches());
  const { matched, candidates, skipped } = matchRecords(kept, aliasMap);
  console.log(`  ${matched.length} exact matches, ${candidates.length} to review, ${skipped.length} anonymised`);

  // Summaries cost one request each, so only matched records earn one.
  const known = previousSummaries();
  const byId = new Map(kept.map((r) => [r.etid, r]));
  let failures = 0;
  for (const etid of new Set(matched.map((m) => m.etid))) {
    const rec = byId.get(etid);
    if (!rec) continue;
    if (known.has(etid)) {
      rec.summary = known.get(etid);
      log(`  ${etid}: summary cached`);
      continue;
    }
    if (DRY_RUN) continue;
    try {
      rec.summary = parseSummary(await get(rec.url));
      log(`  ${etid}: summary ${rec.summary ? "ok" : "absent"}`);
      failures = 0;
    } catch (err) {
      console.warn(`  ! ${etid}: ${err.message}`);
      if (++failures >= 3) {
        console.error("Three consecutive failures — stopping so we don't hammer the site.");
        break;
      }
    }
    await sleep(1000 + Math.random() * 1000);
  }

  let fines = kept.map((r) => ({ ...r, retrieved_at }));
  if (CHECK_LINKS && !DRY_RUN) {
    const matchedIds = new Set(matched.map((m) => m.etid));
    fines = applyLinkChecks(fines, await checkSourceLinks(fines, matchedIds));
  } else if (CHECK_LINKS) {
    console.log("--dry-run: skipping the link check");
  } else {
    // A run without --check-links must not silently resurrect a link a
    // previous run proved dead.
    const previous = previousDeadLinks();
    fines = fines.map((r) => (previous.has(r.etid) ? { ...r, original_source_dead: true } : r));
  }
  const index = {};
  for (const m of matched) (index[m.slug] ||= []).push({ etid: m.etid, matched_on: m.matched_on });

  const queue = {
    generated_at: new Date().toISOString(),
    total: all.length,
    excluded_france: excluded.length,
    matched: matched.length,
    skipped_anonymised: skipped.length,
    a_valider: candidates,
  };

  if (DRY_RUN) {
    console.log("\n--dry-run: nothing written\n", JSON.stringify(queue, null, 2));
    return;
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const write = (name, value) =>
    fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(value, null, 2) + "\n");
  write("fines.json", fines);
  write("index-by-slug.json", index);
  write("review-queue.json", queue);
  console.log(`\nWrote ${fines.length} records; ${candidates.length} candidates await review in public/data/enforcement/review-queue.json`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
