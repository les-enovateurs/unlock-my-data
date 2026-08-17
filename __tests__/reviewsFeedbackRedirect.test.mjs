import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import buildReviewsFeedback from "../scripts/build-reviews-feedback.mjs";

function fixture(items) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "umd-feedback-"));
  const dir = path.join(root, "public", "data", "policy-analysis", "reviews");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "doctolib.json"), JSON.stringify({ slug: "doctolib", items }));
  return root;
}

test("counts where the model filed a passage against where it belonged", () => {
  const out = buildReviewsFeedback({
    root: fixture({
      "cat/identite": { verdict: "rejected", reason: "mauvaise_categorie", redirect_to: "paiement" },
      "dest/3": { verdict: "rejected", reason: "mauvaise_categorie", redirect_to: "analytics" },
      "dest/7": { verdict: "rejected", reason: "mauvaise_categorie", redirect_to: "analytics" },
    }),
    now: "2026-08-17T00:00:00.000Z",
  });
  expect(out.by_redirect).toEqual({
    "cat/identite -> paiement": 1,
    "dest -> analytics": 2,
  });
});

test("a rejection without a destination adds no pair", () => {
  const out = buildReviewsFeedback({
    root: fixture({ "cat/identite": { verdict: "rejected", reason: "hors_sujet" } }),
    now: "2026-08-17T00:00:00.000Z",
  });
  expect(out.by_redirect).toEqual({});
  expect(out.by_reason).toEqual({ hors_sujet: 1 });
});
