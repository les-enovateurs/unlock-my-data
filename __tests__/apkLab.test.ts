import path from "node:path";
import { apkLabSlugs, readApkLabApp, readManifest } from "../lib/apkLab";

const FIXTURE = path.join(process.cwd(), "__tests__", "fixtures", "apk-lab");
const ABSENT = path.join(process.cwd(), "__tests__", "fixtures", "apk-lab-nowhere");

describe("apkLab reader", () => {
  it("lists the slugs of the published dataset", () => {
    expect(apkLabSlugs(FIXTURE)).toEqual(["acme", "bidule"]);
  });

  it("returns an empty dataset instead of throwing when nothing was hydrated", () => {
    // What `generateStaticParams` gets in CI: no pages, no crash.
    expect(apkLabSlugs(ABSENT)).toEqual([]);
    expect(readManifest(ABSENT)).toMatchObject({ app_count: 0, hydrated: false });
  });

  it("reads one application document", () => {
    expect(readApkLabApp("acme", FIXTURE)).toMatchObject({
      slug: "acme",
      handle: "com.acme.app",
      latest: { min_sdk: 26, dex_method_count: 210000 },
    });
  });

  it("returns null for a slug outside the dataset", () => {
    // 141 fiches on the site, a couple dozen analysed. The miss is the norm.
    expect(readApkLabApp("carrefour", FIXTURE)).toBeNull();
  });

  it("publishes no unsigned tracker candidate", () => {
    // The private repo holds 230 `pending` candidates, unreviewed, each naming
    // an editor. `publish` filters them out; this asserts the site never
    // receives one, whatever the drop contains.
    const doc = readApkLabApp("acme", FIXTURE) as { tracker_candidates: { status: string }[] };
    expect(doc.tracker_candidates.every((c) => c.status !== "pending")).toBe(true);
  });
});
