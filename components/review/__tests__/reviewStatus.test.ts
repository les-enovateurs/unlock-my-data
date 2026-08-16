import { normalizeStatus, deriveStatus } from "../policyReviewModel";

test("legacy statuses map onto the new vocabulary", () => {
  // Sidecars and index rows already on disk must keep reading.
  expect(normalizeStatus("needs_review")).toBe("relecture_en_attente");
  expect(normalizeStatus("human_reviewed")).toBe("relu");
  expect(normalizeStatus("published")).toBe("publie");
  expect(normalizeStatus("relu")).toBe("relu");
  expect(normalizeStatus(undefined)).toBe("relecture_en_attente");
  expect(normalizeStatus("n'importe quoi")).toBe("relecture_en_attente");
});

test("no retrievable text is its own state, not a review backlog", () => {
  const svc = { source: { markdown_chars: 120 }, review: { flags: ["extraction_insuffisante"] } };
  expect(deriveStatus(svc, null)).toBe("texte_indisponible");
});

test("text present but no inventory yet means the LLM has not run", () => {
  const svc = { source: { markdown_chars: 90000 }, review: { flags: [] } };
  expect(deriveStatus(svc, null)).toBe("analyse_en_attente");
});

test("an analysed service with no sidecar awaits a reviewer", () => {
  const svc = { source: { markdown_chars: 90000 }, data_inventory: { categories: {} } };
  expect(deriveStatus(svc, null)).toBe("relecture_en_attente");
});

test("a human verdict wins over anything derived from the pipeline", () => {
  const svc = { source: { markdown_chars: 90000 }, data_inventory: { categories: {} } };
  expect(deriveStatus(svc, { status: "human_reviewed" })).toBe("relu");
  expect(deriveStatus(svc, { status: "published" })).toBe("publie");
});

test("a mojibake flag is also 'no usable text'", () => {
  // Garbled bytes are unreviewable for the same reason a consent wall is:
  // a volunteer cannot check a quote against text that reads as noise.
  const svc = { source: { markdown_chars: 90000 }, review: { flags: ["encodage_suspect"] } };
  expect(deriveStatus(svc, null)).toBe("texte_indisponible");
});

test("a pasted policy that has not been re-analysed is awaiting analysis", () => {
  // F2 writes the text; the LLM only runs on the next pipeline pass. Saying
  // "à relire" here would send a volunteer to an empty screen.
  const svc = { source: { markdown_chars: 90000, url_source: "colle_par_benevole" },
                review: { flags: ["extraction_insuffisante"] } };
  expect(deriveStatus(svc, null)).toBe("analyse_en_attente");
});

test("an empty service is missing its text, not awaiting a reviewer", () => {
  expect(deriveStatus({}, null)).toBe("texte_indisponible");
  expect(deriveStatus(null, null)).toBe("texte_indisponible");
});

test("a human verdict still wins when the text later breaks", () => {
  // Someone reviewed it; a refetch that collapsed must not erase that fact.
  const svc = { source: { markdown_chars: 100 }, review: { flags: ["extraction_insuffisante"] } };
  expect(deriveStatus(svc, { status: "published" })).toBe("publie");
});
