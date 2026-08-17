import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import buildPolicyIndex, { NON_SERVICE_FILES } from "../scripts/build-policy-index.mjs";

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pa-index-"));
  const paDir = path.join(root, "public", "data", "policy-analysis");
  fs.mkdirSync(paDir, { recursive: true });
  const write = (name, obj) =>
    fs.writeFileSync(path.join(paDir, name), JSON.stringify(obj));
  write("acme.json", {
    service_name: "Acme", ia_status: "ia_processed", analyzed_at: "2026-07-30",
    source: { markdown_chars: 5000 }, data_inventory: { categories: {} },
  });
  // pipeline aggregates living in the same folder
  write("comparatif.json", { generated_at: "2026-07-30", clusters: {} });
  write("reviews-feedback.json", { by_reason: {}, by_criterion: {} });
  return { root, paDir };
}

describe("buildPolicyIndex", () => {
  it("excludes the pipeline aggregates from the review queue", () => {
    const { root } = fixture();
    const { services } = buildPolicyIndex({ root, now: "2026-07-30T00:00:00Z" });
    expect(services.map((s) => s.slug)).toEqual(["acme"]);
  });

  it("keeps real services with their inventory flag", () => {
    const { root } = fixture();
    const { services } = buildPolicyIndex({ root, now: "2026-07-30T00:00:00Z" });
    expect(services[0]).toMatchObject({
      slug: "acme", service_name: "Acme", has_inventory: true,
      // New vocabulary since 2026-08-16: the index derives one of five states
      // instead of filing everything under needs_review.
      review_status: "relecture_en_attente",
    });
  });

  it("derives problems from the fiches, with no pipeline log anywhere", () => {
    // The index is rebuilt on the deploy server, where the run log is not in the
    // repository. Reading problems from that log served a 2026-07-24 snapshot
    // for weeks; reading the fiches gives the same answer on every machine.
    const { root, paDir } = fixture();
    fs.mkdirSync(path.join(root, "public", "data", "manual"), { recursive: true });
    fs.writeFileSync(path.join(root, "public", "data", "manual", "acme.json"),
      JSON.stringify({ name: "Acme" }));
    const { problems } = buildPolicyIndex({ root, now: "2026-08-17T00:00:00Z" });
    expect(problems).toMatchObject([{ slug: "acme", status: "no-url" }]);
    expect(JSON.parse(fs.readFileSync(path.join(paDir, "_problems.json"), "utf8")).problems)
      .toHaveLength(1);
  });

  it("names the aggregates it filters", () => {
    // vendors.json joined the list on 2026-08-16: it lives in the same
    // directory and surfaced in the queue as a phantom service called
    // "vendors", stuck on "Inventaire non disponible".
    expect([...NON_SERVICE_FILES].sort())
      .toEqual(["comparatif.json", "reviews-feedback.json", "vendors.json"]);
  });
});
