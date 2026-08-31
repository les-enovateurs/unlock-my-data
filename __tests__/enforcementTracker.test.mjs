// __tests__/enforcementTracker.test.mjs
import {
  applyLinkChecks,
  buildAliasMap,
  excludeOwnedCountries,
  isGenericController,
  normalizeName,
  linkVerdict,
  matchRecords,
  normalizeDate,
  parseCasesBootstrap,
  parseSummary,
} from "../scripts/enforcementTracker.mjs";

describe("normalizeName", () => {
  test("merges punctuation and case variants of one company", () => {
    const keys = new Set([
      "VODAFONE ESPAÑA, S.A.U.",
      "Vodafone España SAU",
      "Vodafone España, S.A.U.",
    ].map(normalizeName));
    expect(keys.size).toBe(1);
    expect([...keys][0]).toBe("vodafone espana sau");
  });

  test("keeps distinct legal entities apart", () => {
    const keys = new Set([
      "Vodafone España, S.A.U.",
      "Vodafone GmbH",
      "Vodafone Italia S.p.A.",
    ].map(normalizeName));
    expect(keys.size).toBe(3);
  });

  test("preserves non-Latin scripts instead of emptying them", () => {
    expect(normalizeName("Εγνατία Οδός Α.Ε.")).not.toBe("");
  });

  test("strips an amount accidentally included in the name", () => {
    expect(normalizeName("H&M Hennes & Mauritz s.r.l. EUR 50,000"))
      .toBe(normalizeName("H&M Hennes & Mauritz s.r.l."));
  });

  test("collapses an embedded newline", () => {
    expect(normalizeName("Uber Technologies Inc.\nUber B.V."))
      .toBe("uber technologies inc uber bv");
  });
});

describe("isGenericController", () => {
  test.each([
    "Private individual", "Unknown", "Company", "Legal Person",
    "Police officer", "Physician", "Homeowners Association",
    "Website operator", "Store owner", "Bank", "Restaurant",
    "Employer", "Hospital", "Municipality", "Legal Entity",
    "Private Person", "Attorney", "Retailer", "Sole Trader",
    "Unknown Company", "Hotel", "n/a", "Not assigned", "",
  ])("treats %s as anonymised", (name) => {
    expect(isGenericController(name)).toBe(true);
  });

  test.each(["Vinted", "Meta Platforms Ireland Limited", "OpenAI OpCo LLC"])(
    "treats %s as a real company", (name) => {
      expect(isGenericController(name)).toBe(false);
    });
});

const BOOTSTRAP = (cases) =>
  `<html><body><script type="application/json" id="et-cases">${JSON.stringify(cases)}</script></body></html>`;

describe("parseCasesBootstrap", () => {
  test("maps compact keys to named fields", () => {
    const [rec] = parseCasesBootstrap(BOOTSTRAP([{
      e: 23, C: "France", a: "French Data Protection Authority (CNIL)",
      d: "2019-01-21", f: 50000000, p: "Google LLC",
      s: "Media, Telecoms and Broadcasting",
      r: "Art. 13 GDPR, Art. 14 GDPR", t: "Insufficient legal basis for data processing",
      u: "https://www.cnil.fr/en/x",
    }]));
    expect(rec).toMatchObject({
      etid: "ETid-23",
      url: "https://www.enforcementtracker.com/ETid-23",
      country: "France",
      fine_eur: 50000000,
      controller: "Google LLC",
      articles: ["Art. 13 GDPR", "Art. 14 GDPR"],
      original_source_url: "https://www.cnil.fr/en/x",
    });
  });

  test("keeps a null fine distinct from a zero fine", () => {
    const recs = parseCasesBootstrap(BOOTSTRAP([
      { e: 875, C: "Ireland", p: "Facebook Ireland Limited", f: null, d: "2021-10-06" },
      { e: 778, C: "Luxembourg", p: "Amazon Europe Core S.à.r.l.", f: 0, d: "2021-07-16" },
    ]));
    expect(recs[0].fine_eur).toBeNull();
    expect(recs[1].fine_eur).toBe(0);
  });

  test("accepts a year-only date without inventing a month or day", () => {
    const [rec] = parseCasesBootstrap(BOOTSTRAP([
      { e: 203, C: "Germany", p: "Facebook Germany GmbH", f: 51000, d: "2019" },
    ]));
    expect(rec.date).toBe("2019");
  });

  test("returns an empty array when the bootstrap block is absent", () => {
    expect(parseCasesBootstrap("<html><body>nope</body></html>")).toEqual([]);
  });
});

describe("excludeOwnedCountries", () => {
  test("drops decisions issued by the French authority", () => {
    const { kept, excluded } = excludeOwnedCountries([
      { etid: "ETid-23", country: "France", controller: "Google LLC" },
    ]);
    expect(kept).toHaveLength(0);
    expect(excluded).toHaveLength(1);
  });

  test("keeps a French company fined by a foreign authority", () => {
    const { kept } = excludeOwnedCountries([
      { etid: "ETid-2655", country: "Spain", controller: "CENTROS COMERCIALES CARREFOUR, S.A." },
    ]);
    expect(kept).toHaveLength(1);
  });
});

describe("buildAliasMap", () => {
  test("indexes name, slug, group and both alias lists", () => {
    const map = buildAliasMap({
      chatgpt: { name: "ChatGPT", group_name: "OpenAI", enforcement_aliases: ["OpenAI OpCo LLC"] },
      vinted: { name: "Vinted", cnil_aliases: ["Vinted UAB"] },
    });
    expect(map.get("chatgpt").slugs).toEqual(new Set(["chatgpt"]));
    expect(map.get("openai opco llc").slugs).toEqual(new Set(["chatgpt"]));
    expect(map.get("vinted uab").slugs).toEqual(new Set(["vinted"]));
  });

  test("flags an entry that only exists because of a group name", () => {
    const map = buildAliasMap({ instagram: { name: "Instagram", group_name: "Meta Platforms" } });
    expect(map.get("meta platforms").viaGroup).toBe(true);
    expect(map.get("instagram").viaGroup).toBe(false);
  });

  test("marks enforcement_group_aliases as group-level", () => {
    const map = buildAliasMap({
      facebook: { name: "Facebook", group_name: "Meta", enforcement_group_aliases: ["Meta Platforms Ireland Limited"] },
      whatsapp: { name: "WhatsApp", group_name: "Meta", enforcement_group_aliases: ["Meta Platforms Ireland Limited"] },
    });
    const entry = map.get("meta platforms ireland limited");
    expect(entry.slugs).toEqual(new Set(["facebook", "whatsapp"]));
    expect(entry.viaGroup).toBe(true);
  });

  test("ignores aliases too short to be discriminating", () => {
    const map = buildAliasMap({ ok: { name: "OK", group_name: "" } });
    expect(map.has("ok")).toBe(false);
  });
});

const FICHES = {
  vinted: { name: "Vinted" },
  action: { name: "Action" },
  whatsapp: { name: "WhatsApp" },
  instagram: { name: "Instagram", group_name: "Meta Platforms" },
};

describe("matchRecords", () => {
  test("publishes an exact alias hit", () => {
    const { matched } = matchRecords(
      [{ etid: "ETid-2398", controller: "Vinted" }], buildAliasMap(FICHES));
    expect(matched).toEqual([{ etid: "ETid-2398", slug: "vinted", matched_on: "alias" }]);
  });

  test("labels a group-only hit so the UI can say so", () => {
    const { matched } = matchRecords(
      [{ etid: "ETid-1844", controller: "Meta Platforms" }], buildAliasMap(FICHES));
    expect(matched[0].matched_on).toBe("group");
  });

  test("queues a partial hit instead of publishing it", () => {
    const { matched, candidates } = matchRecords(
      [{ etid: "ETid-820", controller: "WhatsApp Ireland Ltd." }], buildAliasMap(FICHES));
    expect(matched).toHaveLength(0);
    expect(candidates[0]).toMatchObject({ etid: "ETid-820", slugs: ["whatsapp"] });
  });

  test("does not let the short alias 'action' capture unrelated companies", () => {
    const noise = [
      "Housing Associaction", "PRIME TRANSACTION SA",
      "SC Interactions Marketing SRL", "Noy Business Tranzactions SRL",
    ].map((controller, i) => ({ etid: `ETid-${i}`, controller }));
    const { matched, candidates } = matchRecords(noise, buildAliasMap(FICHES));
    expect(matched).toHaveLength(0);
    expect(candidates).toHaveLength(0);
  });

  test("skips anonymised controllers entirely", () => {
    const { matched, candidates, skipped } = matchRecords(
      [{ etid: "ETid-2200", controller: "Company" }], buildAliasMap(FICHES));
    expect(matched).toHaveLength(0);
    expect(candidates).toHaveLength(0);
    expect(skipped).toHaveLength(1);
  });
});

describe("parseSummary", () => {
  test("prefers the JSON-LD description", () => {
    const html = `<script type="application/ld+json">${JSON.stringify({
      "@type": "NewsArticle", description: "The Lithuanian DPA has fined a company.",
    })}</script><h3>Summary</h3><p class="text-base">stale markup</p>`;
    expect(parseSummary(html)).toBe("The Lithuanian DPA has fined a company.");
  });

  test("falls back to the Summary heading when JSON-LD is absent", () => {
    const html = `<h3 class="text-xs">Summary</h3>\n <p class="text-base leading-relaxed" style="color: var(--text);">Fined for an access failure.</p>`;
    expect(parseSummary(html)).toBe("Fined for an access failure.");
  });

  test("decodes HTML entities", () => {
    const html = `<h3>Summary</h3><p class="text-base">the data subject&apos;s right</p>`;
    expect(parseSummary(html)).toBe("the data subject's right");
  });

  test("returns null when there is no summary at all", () => {
    expect(parseSummary("<html><body></body></html>")).toBeNull();
  });
});

describe("normalizeDate", () => {
  test("keeps a full ISO date", () => {
    expect(normalizeDate("2023-01-24")).toBe("2023-01-24");
  });

  test("keeps a partial date rather than inventing a day", () => {
    expect(normalizeDate("2019-03")).toBe("2019-03");
    expect(normalizeDate("2019")).toBe("2019");
  });

  test("drops the literal Unknown so it never reaches the page", () => {
    expect(normalizeDate("Unknown")).toBeNull();
  });

  test("salvages the year from a malformed date", () => {
    // ETid-2322 carries "2024-03-021": a three-digit day.
    expect(normalizeDate("2024-03-021")).toBe("2024-03");
  });

  test("returns null for empty input", () => {
    expect(normalizeDate(null)).toBeNull();
    expect(normalizeDate("")).toBeNull();
  });
});

describe("linkVerdict", () => {
  test.each([200, 204, 301, 302])("treats HTTP %s as a live link", (status) => {
    expect(linkVerdict(status)).toBe("ok");
  });

  test.each([400, 401, 404, 410])("treats HTTP %s as dead", (status) => {
    expect(linkVerdict(status)).toBe("dead");
  });

  test.each([403, 429, 500, 503])("stays undecided on HTTP %s", (status) => {
    expect(linkVerdict(status)).toBe("unknown");
  });

  test("stays undecided when the request never got a status", () => {
    expect(linkVerdict(null)).toBe("unknown");
  });
});

describe("applyLinkChecks", () => {
  const records = [
    { etid: "ETid-203", original_source_url: "https://example.org/a.pdf" },
    { etid: "ETid-875", original_source_url: "https://example.org/b.pdf" },
    { etid: "ETid-999", original_source_url: null },
  ];

  test("flags only the records checked as dead", () => {
    const out = applyLinkChecks(records, new Map([
      ["ETid-203", "dead"],
      ["ETid-875", "ok"],
    ]));
    expect(out[0].original_source_dead).toBe(true);
    expect(out[1].original_source_dead).toBe(false);
  });

  test("leaves an unchecked record untouched", () => {
    const out = applyLinkChecks(records, new Map([["ETid-203", "dead"]]));
    expect(out[2]).not.toHaveProperty("original_source_dead");
  });

  test("an undecided verdict never marks a link", () => {
    const out = applyLinkChecks(records, new Map([["ETid-203", "unknown"]]));
    expect(out[0]).not.toHaveProperty("original_source_dead");
  });

  test("does not mutate the input records", () => {
    applyLinkChecks(records, new Map([["ETid-203", "dead"]]));
    expect(records[0]).not.toHaveProperty("original_source_dead");
  });
});
