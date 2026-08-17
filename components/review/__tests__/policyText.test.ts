import { policyTextUrl, loadPolicyText } from "../policyText";

const TEXT = "Nous collectons votre adresse e-mail afin de vous contacter.";

function deps(text: string | null, digest = "abc123") {
  return {
    fetchFn: (async () =>
      text === null
        ? ({ ok: false, arrayBuffer: async () => new ArrayBuffer(0) } as any)
        : ({ ok: true, arrayBuffer: async () => new TextEncoder().encode(text).buffer } as any)) as any,
    digestFn: async () => digest,
  };
}

test("builds the published text URL", () => {
  expect(policyTextUrl("zalando")).toBe("/data/policy-analysis/text/zalando.md");
});

test("loads the text and reports a matching hash", async () => {
  const r = await loadPolicyText("zalando", "abc123", deps(TEXT));
  expect(r?.text).toBe(TEXT);
  expect(r?.matchesAnalysis).toBe(true);
});

test("flags a text that no longer matches the analysis", async () => {
  // the policy was re-fetched and re-written since the analysis ran
  const r = await loadPolicyText("zalando", "0000", deps(TEXT, "ffff"));
  expect(r?.matchesAnalysis).toBe(false);
  expect(r?.text).toBe(TEXT);
});

test("returns null when the service has no published text", async () => {
  expect(await loadPolicyText("zalando", "abc123", deps(null))).toBeNull();
});

test("a service analysed before the text existed has no hash to compare", async () => {
  const r = await loadPolicyText("zalando", "", deps(TEXT));
  expect(r?.matchesAnalysis).toBe(false);
});

test("a network failure is not a crash", async () => {
  const r = await loadPolicyText("zalando", "abc123", {
    fetchFn: (async () => {
      throw new TypeError("Failed to fetch");
    }) as any,
    digestFn: async () => "abc123",
  });
  expect(r).toBeNull();
});
