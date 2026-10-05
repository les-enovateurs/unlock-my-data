/** The history used to be one shared file, so every new-fiche PR touched its
 *  closing lines and any two of them conflicted. */
import { createGitHubPR } from "@/tools/github";

const puts: { url: string; body: any }[] = [];
const stored = [{ author: "Alice", date: "2026-01-01", type: "create" }];

beforeEach(() => {
  puts.length = 0;
  process.env.NEXT_PUBLIC_GITHUB_TOKEN = "tok";
  global.fetch = jest.fn(async (url: any, init: any = {}) => {
    const u = String(url);
    if (init.method === "PUT") { puts.push({ url: u, body: JSON.parse(init.body) }); return { ok: true, json: async () => ({}) }; }
    if (u.includes("/git/ref/heads/master")) return { ok: true, json: async () => ({ object: { sha: "M" } }) };
    if (u.includes("/contents/public/data/contributions-history/zalando.json"))
      return { ok: true, json: async () => ({ sha: "H", content: Buffer.from(JSON.stringify(stored)).toString("base64") }) };
    if (u.includes("/contents/")) return { ok: false, json: async () => ({}), text: async () => "404" };
    return { ok: true, json: async () => ({ html_url: "https://pr/1" }) };
  }) as any;
});

const historyPut = () => puts.find((p) => p.url.includes("/contributions-history/"))!;
const decode = (b64: string) => JSON.parse(Buffer.from(b64, "base64").toString("utf8"));

test("an update appends to the service's own history file", async () => {
  await createGitHubPR({ name: "Zalando", author: "Bob" } as any, "zalando.json", "{}", "T", "M", "update", true, "zalando");
  const put = historyPut();
  expect(put.url).toMatch(/contributions-history\/zalando\.json$/);
  expect(put.body.sha).toBe("H");
  expect(decode(put.body.content)).toEqual([...stored, expect.objectContaining({ author: "Bob", type: "update" })]);
});

test("a new fiche starts its own file instead of touching a shared one", async () => {
  await createGitHubPR({ name: "Bouygues", author: "Carol" } as any, "bouygues.json", "{}", "T", "M", "create", false, "bouygues");
  const put = historyPut();
  expect(put.url).toMatch(/contributions-history\/bouygues\.json$/);
  expect(put.body.sha).toBeUndefined();
  expect(decode(put.body.content)).toEqual([expect.objectContaining({ author: "Carol", type: "create" })]);
  expect(puts.some((p) => p.url.endsWith("contributions-history.json"))).toBe(false);
});
