import fs from "node:fs";
import path from "node:path";

// Read with `fs`, not `import ... from "@/public/data/apk-lab/manifest.json"`:
// the dataset is not committed, so a static import would break every build that
// runs without the drop (CI, PRs, fresh clones). The site is a static export, so
// every read here happens at build time anyway.

export type ApkLabApp = {
  slug: string;
  handle: string;
  app_name: string;
  version: string | null;
  file: string;
  sha256: string;
};

export type ApkLabManifest = {
  dataset_version: number;
  app_count: number;
  apps: ApkLabApp[];
  hydrated: boolean;
  generated_at?: string;
  catalog_version?: string;
  reason?: string;
};

/** Mesures d'une analyse statique. Un champ absent est une mesure qui n'existe pas. */
export type ApkLabStatic = {
  version_name?: string;
  report_date?: string;
  observed_at?: string;
  apk_sha256?: string;
  total_bytes?: number;
  dex_bytes?: number;
  res_bytes?: number;
  assets_bytes?: number;
  native_bytes?: number;
  size_scope?: string;
  dex_method_count?: number;
  min_sdk?: number;
  native_abis?: string[];
};

export type ApkLabDelta = {
  window: { from: string; to: string };
  from_version: string | null;
  to_version: string | null;
  permissions?: { added: string[]; removed: string[] };
  trackers?: { added: { id: string; name: string | null }[]; removed: { id: string; name: string | null }[] };
  size?: Record<string, number | string | null>;
};

export type ApkLabEndpoints = {
  /** `strings-in-binary` : un nom relevé dans le binaire, pas une requête observée. */
  basis: string;
  third_party_count: number;
  excluded_count: number;
  hosts: { host: string; app_count: number; owner_packages?: string[]; owner_package_count?: number }[];
};

export type ApkLabDoc = {
  dataset_version: number;
  slug: string;
  handle: string;
  app_name: string;
  latest: { version_name: string | null; report_date: string | null; source: string | null };
  static: ApkLabStatic | null;
  deltas: ApkLabDelta[];
  endpoints: ApkLabEndpoints;
  sdk_accounts: { by_sdk: Record<string, number> };
  tracker_candidates: { examined: number; by_status: Record<string, number> };
};

const DATA_DIR = path.join(process.cwd(), "public", "data", "apk-lab");

const ABSENT: ApkLabManifest = { dataset_version: 1, app_count: 0, apps: [], hydrated: false };

export function readManifest(dir: string = DATA_DIR): ApkLabManifest {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
    if (!Array.isArray(raw.apps)) return ABSENT;
    return { ...ABSENT, ...raw };
  } catch {
    // No manifest at all means `npm run prebuild` never ran here. Treated as
    // "no dataset" rather than thrown: the rest of the site does not depend on
    // this one.
    return ABSENT;
  }
}

/** Slugs with a published APK document. Empty when the dataset is absent. */
export function apkLabSlugs(dir: string = DATA_DIR): string[] {
  return readManifest(dir).apps.map((a) => a.slug);
}

function readEntry(entry: ApkLabApp | undefined, dir: string): ApkLabDoc | null {
  if (!entry) return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, entry.file), "utf8")) as ApkLabDoc;
  } catch {
    return null;
  }
}

export function readApkLabApp(slug: string, dir: string = DATA_DIR): ApkLabDoc | null {
  return readEntry(readManifest(dir).apps.find((a) => a.slug === slug), dir);
}

/**
 * The document of an application, by slug then by handle.
 *
 * Two keys because the two repositories do not agree on one. The private corpus
 * derives its slugs from `public/data/compare/*.json`, so they usually match --
 * but a fiche renamed on the site side leaves the private slug behind until the
 * next `corpus seed`, and the handle is what never moves. Trying the slug first
 * keeps the common case cheap; falling back on the handle is what stops a
 * renamed fiche from silently losing its analysis.
 */
export function findApkLabApp(
  { slug, handle }: { slug?: string | null; handle?: string | null },
  dir: string = DATA_DIR,
): ApkLabDoc | null {
  const apps = readManifest(dir).apps;
  const bySlug = slug ? apps.find((a) => a.slug === slug) : undefined;
  return readEntry(bySlug || (handle ? apps.find((a) => a.handle === handle) : undefined), dir);
}
