#!/usr/bin/env node
// Every key quote shown on a fiche must be a verbatim slice of the policy text
// committed in public/data/policy-analysis/text/, and that text must be the
// exact bytes the entry was validated against (sha256). A quote that drifted by
// one character is a quote we cannot prove.
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const QUOTES = path.join(ROOT, "public/data/policy-quotes.json");
const textPath = (slug) => path.join(ROOT, "public/data/policy-analysis/text", `${slug}.md`);
// Claude writes these entries: analysing Anthropic's own policy is a conflict of interest.
const CONFLICTED = /anthropic|claude/i;
const MAX_QUOTES = 3;

export function checkEntry(slug, entry, textBytes) {
    const errors = [];
    if (CONFLICTED.test(slug)) errors.push("conflict of interest: Anthropic/Claude cannot be analysed here");
    if (!textBytes) return [...errors, `missing text file ${path.relative(ROOT, textPath(slug))}`];
    const sha = crypto.createHash("sha256").update(textBytes).digest("hex");
    if (sha !== entry.text_sha256) errors.push(`text sha256 ${sha.slice(0, 12)}… ≠ recorded ${String(entry.text_sha256).slice(0, 12)}…`);
    const text = textBytes.toString("utf8");
    const quotes = entry.quotes || [];
    if (quotes.length < 1 || quotes.length > MAX_QUOTES) errors.push(`expected 1-${MAX_QUOTES} quotes, got ${quotes.length}`);
    quotes.forEach((q, i) => {
        if (!q.quote || !text.includes(q.quote)) errors.push(`quote ${i}: not a verbatim slice of the text`);
        if (!q.plain?.fr || !q.plain?.en) errors.push(`quote ${i}: plain-language line missing (fr and en)`);
    });
    if (!entry.created_by || !entry.created_at) errors.push("no author (created_by + created_at)");
    return errors;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
    const all = JSON.parse(fs.readFileSync(QUOTES, "utf8"));
    let failed = 0;
    for (const [slug, entry] of Object.entries(all)) {
        const p = textPath(slug);
        const errors = checkEntry(slug, entry, fs.existsSync(p) ? fs.readFileSync(p) : null);
        const warn = entry.archive_url ? "" : "  (no archive snapshot)";
        console.log(`${errors.length ? "✗" : "✓"} ${slug} — ${entry.quotes?.length ?? 0} quote(s)${warn}`);
        errors.forEach((e) => console.log(`    ${e}`));
        if (errors.length) failed++;
    }
    process.exit(failed ? 1 : 0);
}
