/**
 * GDPR Enforcement Tracker — parsing, normalization and service matching.
 *
 * Source: enforcementtracker.com, provided by CMS — CC BY-NC-SA 4.0.
 *
 * Pure functions only, so the whole extraction is unit-testable without
 * touching the network. The CLI in update-enforcement-tracker.mjs holds the
 * I/O.
 */

/** Trailing amounts leak into a few controller names in the source data
 *  (ETid-1869: "H&M Hennes & Mauritz s.r.l. EUR 50,000"). */
const TRAILING_AMOUNT = /\s*(?:EUR|€)\s*[\d.,]+\s*$/i;

/** Case, accents and punctuation are noise. Runs of single letters are
 *  recollapsed so "S.A.U." and "SAU" land on the same key. Deliberately does
 *  NOT strip legal-form suffixes: that merges Vodafone España, Vodafone GmbH
 *  and Vodafone Italia into one entity. See the spec for the measurement. */
export function normalizeName(str) {
  if (!str) return "";
  let s = String(str).replace(TRAILING_AMOUNT, "");
  s = s.normalize("NFD").toLowerCase().replace(/\p{Mn}/gu, "");
  s = s.replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  s = s.replace(/\b(?:\p{L} )+\p{L}\b/gu, (m) => m.replace(/ /g, ""));
  return s;
}

/** Roughly 700 of 3206 records name a category instead of a company. The list
 *  is every such value occurring 5+ times in the base, measured 2026-08-24 —
 *  not intuition. It cannot be exhaustive (2048 names occur once), so it is a
 *  secondary guard only; exact-alias matching is the real protection. */
const GENERIC_CONTROLLERS = new Set([
  "private individual", "unknown", "company", "legal person", "police officer",
  "physician", "homeowners association", "website operator", "store owner",
  "bank", "restaurant", "employer", "hospital", "municipality", "legal entity",
  "private person", "attorney", "retailer", "sole trader", "unknown company",
  "covid 19 test center", "hotel", "na", "not assigned", "individual",
  "corporation",
].map(normalizeName));

const GENERIC_PREFIX = /^(private|unknown|legal)\s/;

export function isGenericController(name) {
  const n = normalizeName(name);
  return n === "" || GENERIC_CONTROLLERS.has(n) || GENERIC_PREFIX.test(n);
}

/** Dates in the source are not reliably ISO. Measured on 3206 records: 275
 *  deviate — around 30 are the literal string "Unknown", many are year-only or
 *  year-month, and ETid-2322 carries "2024-03-021" with a three-digit day.
 *  Keeps whatever precision is genuinely there and returns null otherwise,
 *  rather than inventing a day or letting "Unknown" reach the page. */
export function normalizeDate(raw) {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  if (!s) return null;
  const full = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (full) return s;
  const month = /^(\d{4})-(\d{2})\b/.exec(s);
  if (month) return `${month[1]}-${month[2]}`;
  const year = /^(\d{4})$/.exec(s);
  if (year) return s;
  return null;
}

export const BASE_URL = "https://www.enforcementtracker.com";

const BOOTSTRAP_RE = /<script[^>]*id="et-cases"[^>]*>([\s\S]*?)<\/script>/i;

/** The homepage ships the full fines database as a JSON island. One request
 *  replaces 3206 detail fetches; only `summary` is missing from it. */
export function parseCasesBootstrap(html) {
  const m = BOOTSTRAP_RE.exec(html || "");
  if (!m) return [];
  let cases;
  try {
    cases = JSON.parse(m[1]);
  } catch {
    return [];
  }
  if (!Array.isArray(cases)) return [];
  return cases.map((c) => ({
    etid: `ETid-${c.e}`,
    url: `${BASE_URL}/ETid-${c.e}`,
    country: c.C ?? null,
    authority: c.a ?? null,
    // Not always ISO: ETid-203 carries the year alone. Kept verbatim rather
    // than coerced, so the UI can degrade instead of showing a wrong day.
    date: normalizeDate(c.d),
    controller: typeof c.p === "string" ? c.p.replace(/\s+/g, " ").trim() : null,
    sector: c.s ?? null,
    // null means "not disclosed", 0 means "a fine of zero" (ETid-778).
    fine_eur: typeof c.f === "number" ? c.f : null,
    articles: c.r ? String(c.r).split(",").map((a) => a.trim()).filter(Boolean) : [],
    violation_type: c.t ?? null,
    original_source_url: c.u ?? null,
    summary: null,
  }));
}

/** French decisions are already collected from the CNIL directly and published
 *  as `sanctions[]` on the fiches. Taking them from here too would duplicate
 *  them. Keys on the authority's country, NOT the company's nationality: a
 *  French company fined in Dublin or Madrid is exactly the case the CNIL
 *  collection can never see, and is the point of this feature. */
export const EXCLUDED_AUTHORITY_COUNTRIES = ["France"];

export function excludeOwnedCountries(records) {
  const kept = [];
  const excluded = [];
  for (const r of records) {
    (EXCLUDED_AUTHORITY_COUNTRIES.includes(r.country) ? excluded : kept).push(r);
  }
  return { kept, excluded };
}

const MIN_ALIAS_LENGTH = 3;

export function buildAliasMap(fiches) {
  const map = new Map();
  const add = (raw, slug, viaGroup) => {
    if (typeof raw !== "string") return;
    const key = normalizeName(raw);
    if (key.length < MIN_ALIAS_LENGTH) return;
    const entry = map.get(key) || { slugs: new Set(), viaGroup: true };
    entry.slugs.add(slug);
    // An alias reachable by any non-group route is not a group-only alias.
    entry.viaGroup = entry.viaGroup && viaGroup;
    map.set(key, entry);
  };
  for (const [slug, fiche] of Object.entries(fiches)) {
    if (!fiche || typeof fiche !== "object" || Array.isArray(fiche)) continue;
    add(fiche.name, slug, false);
    add(slug, slug, false);
    add(fiche.group_name, slug, true);
    for (const a of fiche.cnil_aliases || []) add(a, slug, false);
    for (const a of fiche.enforcement_aliases || []) add(a, slug, false);
    // Group-level: the fine targets the parent company, so the fiche shows it
    // as such rather than claiming this particular service was sanctioned.
    for (const a of fiche.enforcement_group_aliases || []) add(a, slug, true);
  }
  return map;
}

/** Below this, a substring hit is noise rather than evidence. Measured: the
 *  5-letter slug "action" captured "Housing Associaction",
 *  "PRIME TRANSACTION SA", "SC Interactions Marketing SRL" and
 *  "Noy Business Tranzactions SRL" — four false positives from one alias. */
const MIN_CANDIDATE_ALIAS_LENGTH = 6;

function hasWord(haystack, needle) {
  return new RegExp(`(?:^| )${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:$| )`)
    .test(haystack);
}

export function matchRecords(records, aliasMap) {
  const matched = [];
  const candidates = [];
  const skipped = [];
  for (const rec of records) {
    if (isGenericController(rec.controller)) {
      skipped.push({ etid: rec.etid, controller: rec.controller });
      continue;
    }
    const key = normalizeName(rec.controller);
    const exact = aliasMap.get(key);
    if (exact) {
      for (const slug of exact.slugs) {
        matched.push({ etid: rec.etid, slug, matched_on: exact.viaGroup ? "group" : "alias" });
      }
      continue;
    }
    for (const [alias, entry] of aliasMap) {
      if (alias.length < MIN_CANDIDATE_ALIAS_LENGTH) continue;
      if (!hasWord(key, alias)) continue;
      candidates.push({
        etid: rec.etid,
        controller: rec.controller,
        alias,
        slugs: [...entry.slugs].sort(),
      });
      break;
    }
  }
  return { matched, candidates, skipped };
}

/** Regulator source links rot: they point at national authority sites that
 *  reorganise their PDFs (ETid-203's Hamburg activity report is a 404 as of
 *  2026-08-31). A dead link is worse than no link on a fiche that claims to be
 *  sourced, so the CLI checks them and the UI drops the button.
 *
 *  Only 4xx marks a link dead: a timeout, a 5xx or a network error says the
 *  server had a bad day, not that the document is gone. 403/405 are common on
 *  bot-averse regulator sites and mean the URL exists. */
export const DEAD_LINK_STATUSES = [400, 401, 404, 410];

export function linkVerdict(status) {
  if (typeof status !== "number") return "unknown";
  if (DEAD_LINK_STATUSES.includes(status)) return "dead";
  if (status >= 200 && status < 400) return "ok";
  return "unknown";
}

/** Merges check results into records without mutating them. `undefined` for a
 *  record that was not checked, so a partial run never claims a link is fine. */
export function applyLinkChecks(records, verdicts) {
  return records.map((r) => {
    const verdict = verdicts.get?.(r.etid) ?? verdicts[r.etid];
    if (!verdict || verdict === "unknown") return r;
    return { ...r, original_source_dead: verdict === "dead" };
  });
}

const LD_JSON_RE = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
const SUMMARY_RE = /<h3[^>]*>\s*Summary\s*<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/i;

const ENTITIES = {
  "&apos;": "'", "&quot;": '"', "&amp;": "&", "&lt;": "<", "&gt;": ">", "&nbsp;": " ",
};

function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&[a-z]+;/gi, (e) => ENTITIES[e] ?? e);
}

function clean(s) {
  return decode(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim() || null;
}

/** JSON-LD first: the detail markup is not uniform across records (ETid-1265
 *  lays its case block out differently from ETid-2200), the structured data is. */
export function parseSummary(html) {
  for (const m of String(html || "").matchAll(LD_JSON_RE)) {
    try {
      const ld = JSON.parse(m[1]);
      if (typeof ld?.description === "string" && ld.description.trim()) {
        return clean(ld.description);
      }
    } catch {
      // Malformed island; fall through to the markup.
    }
  }
  const m = SUMMARY_RE.exec(String(html || ""));
  return m ? clean(m[1]) : null;
}
