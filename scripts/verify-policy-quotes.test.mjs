import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { checkEntry } from "./verify-policy-quotes.mjs";

const bytes = Buffer.from("Préambule. Nous vendons vos données à des partenaires. Fin.");
const sha = crypto.createHash("sha256").update(bytes).digest("hex");
const entry = (q) => ({ created_by: "R", created_at: "2026-11-10", text_sha256: sha, quotes: [{ quote: q, topic: "partage_commercial", plain: { fr: "x", en: "x" } }] });

test("verbatim quote on the recorded text passes", () => {
    assert.deepEqual(checkEntry("acme", entry("Nous vendons vos données à des partenaires."), bytes), []);
});
test("one changed character fails", () => {
    assert.equal(checkEntry("acme", entry("Nous vendons vos données a des partenaires."), bytes).length, 1);
});
test("text edited after validation fails", () => {
    const edited = Buffer.from(bytes.toString() + " ");
    assert.match(checkEntry("acme", entry("Nous vendons vos données à des partenaires."), edited)[0], /sha256/);
});
test("Anthropic is refused", () => {
    assert.match(checkEntry("claude", entry("Fin."), bytes)[0], /conflict/);
});

const enBytes = Buffer.from("Preamble. We sell your data to partners. End.");
const enEntry = (quote_en) => ({
    ...entry("Nous vendons vos données à des partenaires."),
    en: { policy_url: "https://x", text_sha256: crypto.createHash("sha256").update(enBytes).digest("hex") },
    quotes: [{ ...entry("Nous vendons vos données à des partenaires.").quotes[0], quote_en }],
});
test("English match must be verbatim in the English text", () => {
    assert.deepEqual(checkEntry("acme", enEntry("We sell your data to partners."), bytes, enBytes), []);
    assert.match(checkEntry("acme", enEntry("We sell your data to our partners."), bytes, enBytes)[0], /quote_en/);
});
test("no English match is allowed", () => {
    assert.deepEqual(checkEntry("acme", enEntry(undefined), bytes, enBytes), []);
});

import { publishedKeyQuotes } from "./policyQuotes.mjs";

const proposal = { created_by: "Jérémy", created_at: "2026-11-10", quotes: [{ quote: "A" }, { quote: "B" }] };
const verdict = (verdict, by) => ({ verdict, by, at: "2026-11-11T10:00:00Z" });

test("nothing is published without a human validation", () => {
    assert.deepEqual(publishedKeyQuotes(proposal, null), []);
});
test("a validation by someone else publishes that quote only", () => {
    const out = publishedKeyQuotes(proposal, { items: { "keyquote/0": verdict("validated", "Théo") } });
    assert.deepEqual(out, [{ quote: "A", validated_by: "Théo" }]);
});
const publish = (date) => ({ reviewers: [{ name: "Jérémy", date, action: "published_key_quotes" }] });
test("publishing without review works after the delay, never over a rejection", () => {
    const items = { "keyquote/1": verdict("rejected", "Théo") };
    assert.deepEqual(publishedKeyQuotes(proposal, { items, ...publish("2026-11-16") }), []);
    assert.deepEqual(publishedKeyQuotes(proposal, { items, ...publish("2026-11-17") }), [{ quote: "A", validated_by: null }]);
});
test("the delay restarts when the proposal is edited", () => {
    assert.deepEqual(publishedKeyQuotes({ ...proposal, updated_at: "2026-11-15" }, publish("2026-11-17")), []);
});
test("a quote without a known topic fails", () => {
    const e = entry("Nous vendons vos données à des partenaires.");
    e.quotes[0].topic = "choquant";
    assert.match(checkEntry("acme", e, bytes)[0], /topic/);
});
test("a plain line rewritten in the review tool replaces the proposed one", () => {
    const proposal = { created_by: "R", created_at: "2026-11-10", quotes: [{ quote: "q", plain: { fr: "old", en: "old" } }] };
    const side = { items: { "keyquote/0": { verdict: "validated", by: "Théo" } },
        key_quote_plain: { "keyquote/0": { fr: "neuf", en: "new", by: "Théo", at: "x" } } };
    assert.deepEqual(publishedKeyQuotes(proposal, side)[0].plain, { fr: "neuf", en: "new" });
    assert.equal(publishedKeyQuotes(proposal, side)[0].plain_by, "Théo");
});
