/** The PR path had never run: dev mode always took the local branch, so the
 *  first production review would have been its first execution. */
import { createFilesPR, createReviewPR, createPolicyTextPR } from "@/tools/github";

const calls: { url: string; method: string; body: any }[] = [];

function mockGh(overrides: Record<string, any> = {}) {
  calls.length = 0;
  global.fetch = jest.fn(async (url: any, init: any = {}) => {
    const u = String(url);
    calls.push({ url: u, method: init.method || "GET", body: init.body ? JSON.parse(init.body) : null });
    if (overrides[u] !== undefined) return overrides[u];
    if (u.includes("/git/ref/heads/master")) return { ok: true, json: async () => ({ object: { sha: "MASTERSHA" } }) };
    if (u.includes("/git/refs")) return { ok: true, json: async () => ({}) };
    if (u.includes("/contents/") && (init.method || "GET") === "GET") return { ok: true, json: async () => ({ sha: "BLOBSHA" }) };
    if (u.includes("/contents/")) return { ok: true, json: async () => ({}) };
    if (u.includes("/pulls")) return { ok: true, json: async () => ({ html_url: "https://pr/1" }) };
    throw new Error("unexpected " + u);
  }) as any;
}

beforeEach(() => { process.env.NEXT_PUBLIC_GITHUB_TOKEN = "tok"; mockGh(); });

test("writes every file into one branch and opens a single PR", async () => {
  const url = await createFilesPR(
    [{ path: "a.json", content: "{}" }, { path: "b.md", content: "hello" }],
    "zalando", "Alice", "T", "M");
  expect(url).toBe("https://pr/1");
  const puts = calls.filter((c) => c.method === "PUT");
  expect(puts.map((c) => c.url.split("/contents/")[1])).toEqual(["a.json", "b.md"]);
  const branches = new Set(puts.map((c) => c.body.branch));
  expect(branches.size).toBe(1);
  expect(calls.filter((c) => c.url.includes("/pulls"))).toHaveLength(1);
});

test("sends the blob sha when the file already exists, or the write is a 422", async () => {
  await createFilesPR([{ path: "a.json", content: "{}" }], "z", "A", "T", "M");
  expect(calls.find((c) => c.method === "PUT")!.body.sha).toBe("BLOBSHA");
});

test("omits the sha for a file that does not exist yet", async () => {
  mockGh();
  const real = global.fetch as any;
  global.fetch = jest.fn(async (url: any, init: any = {}) => {
    if (String(url).includes("/contents/") && !(init.method === "PUT")) return { ok: false, text: async () => "404" };
    return real(url, init);
  }) as any;
  await createFilesPR([{ path: "new.json", content: "{}" }], "z", "A", "T", "M");
  expect(calls.find((c) => c.method === "PUT")!.body.sha).toBeUndefined();
});

test("a failed write aborts before the PR is opened", async () => {
  // Half a review on a branch with a PR inviting a merge is worse than no PR.
  mockGh();
  const real = global.fetch as any;
  global.fetch = jest.fn(async (url: any, init: any = {}) => {
    if (init.method === "PUT") return { ok: false, text: async () => "boom" };
    return real(url, init);
  }) as any;
  await expect(createFilesPR([{ path: "a.json", content: "{}" }], "z", "A", "T", "M"))
    .rejects.toThrow(/Erreur écriture a.json/);
  expect(calls.filter((c) => c.url.includes("/pulls"))).toHaveLength(0);
});

test("a failed branch creation aborts too", async () => {
  mockGh();
  const real = global.fetch as any;
  global.fetch = jest.fn(async (url: any, init: any = {}) => {
    if (String(url).includes("/git/refs")) return { ok: false, text: async () => "exists" };
    return real(url, init);
  }) as any;
  await expect(createFilesPR([{ path: "a.json", content: "{}" }], "z", "A", "T", "M"))
    .rejects.toThrow(/branche/);
});

test("accents survive base64 encoding", async () => {
  await createFilesPR([{ path: "a.json", content: '{"n":"Société Générale — €"}' }], "z", "A", "T", "M");
  const b64 = calls.find((c) => c.method === "PUT")!.body.content;
  expect(Buffer.from(b64, "base64").toString("utf8")).toBe('{"n":"Société Générale — €"}');
});

test("no token is refused rather than half-attempted", async () => {
  delete process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  await expect(createFilesPR([{ path: "a", content: "" }], "z", "A", "T", "M")).rejects.toThrow(/Token/);
});

test("a review with no vendor verdict ships one file", async () => {
  await createReviewPR({ slug: "z" }, "z", "A", "T", "M", {});
  expect(calls.filter((c) => c.method === "PUT")).toHaveLength(1);
});

test("a review that settled a vendor ships the registry alongside", async () => {
  await createReviewPR({ slug: "z" }, "z", "A", "T", "M", { adyen: { name: "Adyen" } });
  expect(calls.filter((c) => c.method === "PUT").map((c) => c.url.split("/contents/")[1]))
    .toEqual(["public/data/policy-analysis/reviews/z.json", "public/data/policy-analysis/vendors.json"]);
});

test("a pasted policy ships the text and its provenance sidecar together", async () => {
  // Shipping the text alone would pass hand-supplied content off as scraped.
  await createPolicyTextPR("doctolib", "TEXTE", "Alice", "Doctolib");
  const puts = calls.filter((c) => c.method === "PUT");
  expect(puts.map((c) => c.url.split("/contents/")[1])).toEqual([
    "public/data/policy-analysis/text/doctolib.md",
    "public/data/policy-analysis/text/doctolib.meta.json",
  ]);
  expect(Buffer.from(puts[0].body.content, "base64").toString("utf8")).toBe("TEXTE");
  const meta = JSON.parse(Buffer.from(puts[1].body.content, "base64").toString("utf8"));
  expect(meta).toMatchObject({ pasted: true, by: "Alice" });
});
