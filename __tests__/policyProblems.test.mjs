import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import derivePolicyProblems, { MIN_REVIEWABLE_CHARS, suggestedAction } from "../scripts/policyProblems.mjs";

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pa-problems-"));
  const paDir = path.join(root, "policy-analysis");
  const manualDir = path.join(root, "manual");
  fs.mkdirSync(paDir); fs.mkdirSync(manualDir);
  const fiche = (slug, obj) => fs.writeFileSync(path.join(manualDir, `${slug}.json`), JSON.stringify(obj));
  const analysis = (slug, obj) => fs.writeFileSync(path.join(paDir, `${slug}.json`), JSON.stringify(obj));
  return { paDir, manualDir, fiche, analysis,
    run: () => derivePolicyProblems({ paDir, manualDir }) };
}

describe("derivePolicyProblems", () => {
  it("flags a fiche that names no privacy policy", () => {
    const f = fixture();
    f.fiche("gmail", { name: "Gmail" });
    expect(f.run()).toEqual([{
      slug: "gmail", service_name: "Gmail", status: "no-url", detail: "",
      policy_url: null, suggested_action: "fix_url",
    }]);
  });

  it("accepts the English URL field when the French one is missing", () => {
    const f = fixture();
    f.fiche("acme", { name: "Acme", confidentiality_policy_url_en: "https://acme.test/privacy" });
    f.analysis("acme", { source: { markdown_chars: 9000 } });
    expect(f.run()).toEqual([]);
  });

  it("flags a URL the pipeline produced nothing for", () => {
    const f = fixture();
    f.fiche("fnac", { name: "Fnac", confidentiality_policy_url: "https://fnac.test/privacy" });
    expect(f.run()).toMatchObject([{ slug: "fnac", status: "non-analyse", suggested_action: "fix_url" }]);
  });

  it("flags a text too short to review, and says how short", () => {
    const f = fixture();
    f.fiche("zara", { name: "Zara", confidentiality_policy_url: "https://zara.test/privacy" });
    f.analysis("zara", { source: { markdown_chars: 0 } });
    f.fiche("alibaba", { name: "Alibaba", confidentiality_policy_url: "https://alibaba.test/privacy" });
    f.analysis("alibaba", { source: { markdown_chars: 149 } });
    expect(f.run()).toEqual([
      // 0 chars: nothing was fetched, so the URL is what needs fixing.
      { slug: "alibaba", service_name: "Alibaba", status: "low-content", detail: "149 chars",
        policy_url: "https://alibaba.test/privacy", suggested_action: "re_extract" },
      { slug: "zara", service_name: "Zara", status: "low-content", detail: "0 chars",
        policy_url: "https://zara.test/privacy", suggested_action: "fix_url" },
    ]);
  });

  it("leaves a fetched policy alone when only the LLM pass is missing", () => {
    // Text present, no inventory yet: the queue files that under
    // "analyse_en_attente". Repeating it here would send volunteers to fix a
    // URL that works.
    const f = fixture();
    f.fiche("boulanger", { name: "Boulanger", confidentiality_policy_url: "https://boulanger.test/privacy" });
    f.analysis("boulanger", { source: { markdown_chars: 12191 } });
    expect(f.run()).toEqual([]);
  });

  it("clears a service as soon as its extraction is fixed", () => {
    // Doctolib was stuck on "low-content (0 chars)" for 24 days while holding a
    // reviewed inventory, because the list came from a stale run log.
    const f = fixture();
    f.fiche("doctolib", { name: "Doctolib", confidentiality_policy_url: "https://doctolib.test/terms" });
    f.analysis("doctolib", { source: { markdown_chars: 51600 }, data_inventory: { categories: {} } });
    expect(f.run()).toEqual([]);
  });

  it("ignores drafts and files that are not fiches", () => {
    const f = fixture();
    f.fiche("block-blast", { name: "Block Blast", draft: true });
    f.fiche("slugs", { 0: "acme", 1: "zara" });
    expect(f.run()).toEqual([]);
  });

  it("treats the reviewable threshold as the index does", () => {
    const f = fixture();
    f.fiche("edge", { name: "Edge", confidentiality_policy_url: "https://edge.test/privacy" });
    f.analysis("edge", { source: { markdown_chars: MIN_REVIEWABLE_CHARS } });
    expect(f.run()).toEqual([]);
  });
});

describe("suggestedAction", () => {
  it("no-url → fix_url", () => { expect(suggestedAction("no-url", "")).toBe("fix_url"); });
  it("non-analyse → fix_url", () => { expect(suggestedAction("non-analyse", "aucune analyse produite")).toBe("fix_url"); });
  it("low-content 0 chars → fix_url", () => { expect(suggestedAction("low-content", "0 chars")).toBe("fix_url"); });
  it("low-content 149 chars → re_extract", () => { expect(suggestedAction("low-content", "149 chars")).toBe("re_extract"); });
});
