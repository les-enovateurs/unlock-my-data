import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import loadApkLab, { EMPTY_MANIFEST } from "../scripts/load-apk-lab.mjs";

const FIXTURE = path.join(process.cwd(), "__tests__", "fixtures", "apk-lab");
const silent = { log: () => {} };

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "apk-lab-"));
}
function readDest(root) {
  return JSON.parse(
    fs.readFileSync(path.join(root, "public", "data", "apk-lab", "manifest.json"), "utf8"),
  );
}
function drop() {
  // A copy of the fixture, so a test can corrupt the drop without touching the
  // committed fixture.
  const dir = path.join(tmpRoot(), "drop");
  fs.cpSync(FIXTURE, dir, { recursive: true });
  return dir;
}

describe("loadApkLab", () => {
  it("hydrates the applications the manifest announces", () => {
    const root = tmpRoot();
    const res = loadApkLab({ root, sourceDir: FIXTURE, log: silent });
    expect(res).toMatchObject({ hydrated: true, app_count: 2 });
    expect(readDest(root)).toMatchObject({ app_count: 2, hydrated: true });
    expect(
      fs.existsSync(path.join(root, "public", "data", "apk-lab", "apps", "acme.json")),
    ).toBe(true);
  });

  it("leaves a valid empty manifest when the drop is absent", () => {
    // The dominant build path: CI, pull requests, a fresh clone. None of them
    // has the dataset and all of them must build.
    const root = tmpRoot();
    const res = loadApkLab({ root, sourceDir: path.join(root, "nowhere"), log: silent });
    expect(res.hydrated).toBe(false);
    expect(readDest(root)).toMatchObject({ app_count: 0, apps: [], hydrated: false });
    expect(EMPTY_MANIFEST.app_count).toBe(0);
  });

  it("refuses the whole drop when one checksum diverges", () => {
    const dir = drop();
    fs.writeFileSync(path.join(dir, "apps", "acme.json"), '{"slug":"acme","tampered":true}');
    const root = tmpRoot();
    const res = loadApkLab({ root, sourceDir: dir, log: silent });
    expect(res.hydrated).toBe(false);
    expect(res.reason).toMatch(/sha256/);
    // All or nothing: a partial dataset would be served as if complete.
    expect(readDest(root).app_count).toBe(0);
  });

  it("refuses a manifest announcing a file that is not there", () => {
    const dir = drop();
    fs.rmSync(path.join(dir, "apps", "bidule.json"));
    const res = loadApkLab({ root: tmpRoot(), sourceDir: dir, log: silent });
    expect(res).toMatchObject({ hydrated: false });
    expect(res.reason).toMatch(/absent/);
  });

  it("ignores a file the manifest does not list", () => {
    // The private repo never deletes a stale export, so the drop can hold
    // documents from an older pass. The manifest is authoritative.
    const dir = drop();
    fs.writeFileSync(path.join(dir, "apps", "perime.json"), '{"slug":"perime"}');
    const root = tmpRoot();
    loadApkLab({ root, sourceDir: dir, log: silent });
    expect(
      fs.existsSync(path.join(root, "public", "data", "apk-lab", "apps", "perime.json")),
    ).toBe(false);
  });

  it("rejects a path climbing out of the drop directory", () => {
    // The manifest arrives over the network; it is not a trusted input.
    const dir = drop();
    const m = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
    m.apps[0].file = "../../../etc/passwd";
    fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(m));
    const res = loadApkLab({ root: tmpRoot(), sourceDir: dir, log: silent });
    expect(res).toMatchObject({ hydrated: false });
    expect(res.reason).toMatch(/hors dépôt/);
  });

  it("drops a previously hydrated dataset when the source disappears", () => {
    // Otherwise the site keeps serving last week's dataset from a directory
    // nothing writes to any more.
    const root = tmpRoot();
    loadApkLab({ root, sourceDir: FIXTURE, log: silent });
    loadApkLab({ root, sourceDir: path.join(root, "nowhere"), log: silent });
    expect(readDest(root).app_count).toBe(0);
    expect(
      fs.existsSync(path.join(root, "public", "data", "apk-lab", "apps", "acme.json")),
    ).toBe(false);
  });
});
