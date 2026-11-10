import fs from "node:fs";
import path from "node:path";
import servicesData from "@/public/data/services.json";
import trackerLinks from "@/public/data/compare/tracker-links.json";
import breachMapping from "@/public/data/compare/breach-mapping.json";
import permissionCatalog from "@/public/data/compare/permissions.json";
import { isHealthPermission, permissionCategory, CATEGORY_META, CATEGORY_ORDER, type PermissionCategoryId } from "@/data/permissionLabels";
import { readApkLabApp } from "@/lib/apkLab";
import type { CatalogService } from "@/components/CatalogContent";

const DATA_DIR = path.join(process.cwd(), "public", "data");
// Written by `npm run verify-apk-gates`. Absent outside a maintainer's machine,
// and then no APK figure is shown: an unchecked weight is never published.
const APK_GATES_CSV = path.join(process.cwd(), "public", "press", "data", "apk-audit-qualite.csv");

function readJson<T>(file: string): T | null {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
        return null;
    }
}

// tracker-links.json maps trackerId -> apps embedding it; invert to count
// trackers per app slug.
function buildTrackerCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const apps of Object.values(trackerLinks as Record<string, { slug: string }[]>)) {
        for (const app of apps) {
            counts[app.slug] = (counts[app.slug] || 0) + 1;
        }
    }
    return counts;
}

function citableApkSlugs(): Set<string> {
    if (!fs.existsSync(APK_GATES_CSV)) return new Set();
    const [header, ...rows] = fs.readFileSync(APK_GATES_CSV, "utf8").trim().split("\n");
    const cols = header.split(",");
    const slugAt = cols.indexOf("slug");
    const levelAt = cols.indexOf("niveau");
    return new Set(rows.map((r) => r.split(",")).filter((c) => c[levelAt] === "CITABLE").map((c) => c[slugAt]));
}

const dangerousPermissions = new Set(
    Object.entries((permissionCatalog as { permissions: Record<string, { protection_level?: string }> }[])[0].permissions)
        .filter(([, p]) => p.protection_level?.includes("dangerous"))
        .map(([name]) => name),
);

// Same rule as the fiche (components/company/manual.tsx): Android "dangerous"
// level, plus Health Connect, which the Exodus catalogue does not know.
function sensitiveCategories(slug: string): PermissionCategoryId[] | null {
    const report = readJson<{ permissions?: string[] }>(path.join(DATA_DIR, "compare", `${slug}.json`));
    if (!report?.permissions) return null;
    const found = new Set(
        report.permissions
            .map((p) => p.trim())
            .filter((p) => dangerousPermissions.has(p) || isHealthPermission(p))
            .map(permissionCategory),
    );
    // Only the groups the fiche itself puts forward; "device" or "identity" are on nearly every app.
    return CATEGORY_ORDER.filter((c) => found.has(c) && CATEGORY_META[c].tone === "high");
}

export function buildCatalog(): CatalogService[] {
    const trackerCounts = buildTrackerCounts();
    const breaches = breachMapping as Record<string, unknown[]>;
    const citable = citableApkSlugs();

    return (servicesData as any[])
        .map((s): CatalogService => {
            const fiche = readJson<{ outside_eu_storage?: boolean | null }>(path.join(DATA_DIR, "manual", `${s.slug}.json`));
            return {
                slug: s.slug,
                name: s.name,
                logo: s.logo || undefined,
                countryCode: s.country_code || undefined,
                trackers: s.exodus ? (trackerCounts[s.slug] ?? 0) : null,
                breaches: breaches[s.slug]?.length ?? 0,
                betterAlternative: Boolean(s.better_alternative),
                easyAccess: Number(s.easy_access_data) || null,
                outsideEU: typeof fiche?.outside_eu_storage === "boolean" ? fiche.outside_eu_storage : null,
                sensitivePermissions: s.exodus ? sensitiveCategories(s.slug) : null,
                apkBytes: citable.has(s.slug) ? (readApkLabApp(s.slug)?.static?.total_bytes ?? null) : null,
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
}
