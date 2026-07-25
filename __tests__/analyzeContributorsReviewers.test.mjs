// __tests__/analyzeContributorsReviewers.test.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { addSidecarReviewers } from "../scripts/analyze-contributors.js";

test("aggregates sidecar reviewers", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "rev-"));
  fs.writeFileSync(path.join(dir, "acme.json"), JSON.stringify({
    slug: "acme", status: "published",
    reviewers: [{ name: "Jérémy", date: "2026-07-24", action: "reviewed" }, { name: "Jérémy", date: "2026-07-24", action: "published" }],
    items: {}, service_note: "", updated_at: "",
  }));
  const stats = {};
  addSidecarReviewers(stats, dir, { acme: "ACME" });
  expect(stats["Jérémy"].count).toBe(2);
  expect(stats["Jérémy"].companies[0]).toEqual({ name: "ACME", date: "2026-07-24" });
});
