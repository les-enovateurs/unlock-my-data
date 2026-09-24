import fs from 'node:fs/promises';
import path from 'node:path';

import slugs from '../../public/data/manual/slugs.json';
import servicesData from '../../public/data/services.json';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import {
    getEntrepriseData,
    getBreachData,
    getTermsArchiveData,
    getEnforcementFines
} from './manual-components/data';
import { findSimilarServices } from './manual-components/helpers';
import { altLabel } from './manual-components/altLabels';
import { t } from './manual-components/i18n';

import { findApkLabApp } from '@/lib/apkLab';
import { isHealthPermission, permissionLabel } from '@/data/permissionLabels';
import FicheAvancee, {
    FicheAnalysis,
    FicheApk,
    FicheApkLab,
    FicheBreach,
    FicheMemo,
    FichePerm,
    FicheTracker
} from './FicheAvancee';
import type { ReviewSidecar } from '@/components/review/reviewTypes';

/**
 * Fiches whose `comments` field is an editorial reading meant for readers.
 * On older fiches the same field holds contributor-to-contributor remarks —
 * disagreements, open questions — which have no place on the public page.
 * Allowlist until those are sorted out, one fiche at a time.
 */
const NOTES_SLUGS = new Set([
    'clementoni-airo',
    'curio',
    'lexibook-elo',
    'loona',
    'miko',
    'vtech-bear',
    'vtech-kidicom-chat',
    'vtech-kidiconnect',
]);

export async function generateStaticParams() {
    return slugs
}

export async function generateMetadata({ params }: { params: { slug: string, lang: string } }): Promise<Metadata> {
    const lang = params.lang || 'fr';
    const entreprise = await getEntrepriseData(params.slug);
    return {
        title: entreprise ? `${entreprise.name} - ${t(lang, 'companyDetailsSuffix')}` : t(lang, 'companyNotFoundTitle'),
        description: entreprise?.name ? t(lang, 'companyDetailsDescription', entreprise.name) : undefined
    };
}

type PermCatalogEntry = {
    description?: string;
    label?: string;
    protection_level?: string;
};

type TrackerCatalogEntry = { id: number; name: string; country?: string };

/** The Exodus catalogue stores vendor countries in English, the fiche reads French. */
const TRACKER_COUNTRY_FR: Record<string, string> = {
    china: "Chine",
    france: "France",
    germany: "Allemagne",
    japan: "Japon",
    panama: "Panama",
    russia: "Russie",
    "south korea": "Corée du Sud",
    switzerland: "Suisse",
};

const EU_DESTINATIONS = [
    "espace economique europeen", "union europeenne", "ue", "eu",
    "european economic area", "european union",
    "france", "allemagne", "germany", "irlande", "ireland", "pays-bas", "netherlands",
    "belgique", "belgium", "luxembourg", "espagne", "spain", "italie", "italy",
    "suede", "sweden", "danemark", "denmark", "finlande", "finland", "pologne", "poland",
    "portugal", "autriche", "austria", "grece", "greece", "roumanie", "romania",
];

function normalize(s: string) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function isTruthyFlag(v: unknown): boolean {
    if (typeof v === "boolean") return v;
    if (typeof v === "string") return /^(true|oui|yes|1)$/i.test(v.trim());
    return false;
}

function stripHtml(s: string): string {
    return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function parseStringList(v: unknown): string[] {
    if (Array.isArray(v)) return v.map(String);
    if (typeof v === "string") {
        try {
            return JSON.parse(v.replace(/'/g, '"'));
        } catch {
            return v ? [v] : [];
        }
    }
    return [];
}

async function loadJson<T>(importer: () => Promise<{ default: T }>): Promise<T | null> {
    try {
        return (await importer()).default;
    } catch {
        return null;
    }
}

/**
 * Read an optional JSON data file from disk at build time.
 *
 * Used for directories that may be empty or absent (the human-review sidecars
 * only land once a review PR is merged): a dynamic `import()` is resolved by the
 * bundler, so a missing directory fails the build before any `try/catch` runs.
 */
async function loadJsonFile<T>(relativePath: string): Promise<T | null> {
    try {
        // turbopackIgnore keeps the tracer from walking the whole project for this read
        const raw = await fs.readFile(path.join(/* turbopackIgnore: true */ process.cwd(), relativePath), 'utf8');
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

export default async function Manual({ slug, lang = 'fr' }: { slug: string, lang: string }) {
    const entreprise = await getEntrepriseData(slug);

    if (!entreprise) {
        notFound();
    }

    const isFr = lang === 'fr';
    const pick = (fr?: string | null, en?: string | null) => (isFr ? fr : (en || fr)) || undefined;

    /* ---- Technical analysis (Exodus Privacy) ---- */
    let apk: FicheApk = null;
    let perms: FichePerm[] = [];
    let trackers: FicheTracker[] = [];

    const permCatalogFile = isFr ? 'permissions_fr' : 'permissions';
    const permCatalogRaw = await loadJson<any>(() => import(`../../public/data/compare/${permCatalogFile}.json`));
    const permCatalog: Record<string, PermCatalogEntry> = permCatalogRaw?.[0]?.permissions || {};
    // Le catalogue Exodus ne décrit que 66 des 610 permissions que les fiches déclarent.
    // `permissionLabel` le consulte d'abord, retombe sur notre complément, puis sur le
    // nom technique court — jamais sur une traduction improvisée.
    const label = (full: string) => permissionLabel(full, permCatalog[full]?.label, lang);

    const exodusFile = entreprise.exodus?.split('/').pop()?.replace(/\.json$/, '');
    if (exodusFile) {
        const exodus = await loadJson<any>(() => import(`../../public/data/compare/${exodusFile}.json`));
        if (exodus) {
            apk = {
                handle: exodus.handle,
                source: exodus.source === 'google' ? 'Google Play' : exodus.source,
                versionAnalysed: exodus.version || exodus.version_name,
                versionName: exodus.version_name,
                versionCode: exodus.version_code,
                reportDate: exodus.report_date || exodus.updated,
                apkHash: exodus.apk_hash,
            };

            // Manifests are stored as measured: Lexibook declares
            // `android.permission.HIGH_SAMPLING_RATE_SENSORS` twice, once with a trailing
            // space. Untrimmed it missed every catalogue lookup and the fiche listed the
            // same permission twice, one line readable and one line raw.
            const declaredPerms: string[] = [...new Set(
                ((exodus.permissions || []) as string[]).map((x) => x.trim()).filter(Boolean)
            )];
            perms = declaredPerms.map((full: string): FichePerm => {
                const entry = permCatalog[full];
                const short = label(full);
                // Le catalogue Exodus ignore Health Connect : ses 693 entrées ne portent aucune
                // `android.permission.health.*`, donc la glycémie et l'activité sexuelle
                // arrivaient ici en permissions ordinaires. Android les déclare toutes en
                // `dangerous`, et le RGPD en fait des données sensibles (art. 9).
                const dangerous = Boolean(entry?.protection_level?.includes('dangerous'))
                    || isHealthPermission(full);
                // catalog quirk: `name` sometimes duplicates the description — prefer label, else the raw id
                const desc = entry?.description && entry.description !== short ? entry.description : undefined;
                return { perm: short, full, desc: dangerous ? desc : undefined, dangerous };
            });
            // sensitive first, then alphabetical
            perms.sort((a, b) => Number(b.dangerous) - Number(a.dangerous) || a.perm.localeCompare(b.perm));

            const trackerCatalog = await loadJson<TrackerCatalogEntry[]>(() => import('../../public/data/compare/trackers.json')) || [];
            const trackerLinks = await loadJson<Record<string, { name: string; slug: string }[]>>(() => import('../../public/data/compare/tracker-links.json')) || {};
            // tracker-links.json porte le titre du binaire analysé, pas le nom du service :
            // l'app du Stade Rochelais y figure sous « #fievreSR ». On réétiquette depuis le
            // catalogue, et on écarte les slugs qui n'y sont plus — leur puce menait à un 404.
            const catalogNames = new Map(
                (servicesData as { slug: string; name: string }[]).map(s => [s.slug, s.name.trim()])
            );
            trackers = (exodus.trackers || []).map((id: number): FicheTracker => {
                const info = trackerCatalog.find(tc => tc.id === id);
                const apps = (trackerLinks[String(id)] || [])
                    .filter(a => a.slug !== slug && a.name !== entreprise.name && catalogNames.has(a.slug))
                    .map(a => ({ slug: a.slug, name: catalogNames.get(a.slug) as string }));
                // « united states » is what the Exodus catalogue writes when it knows
                // nothing -- 360 of its 432 entries. Any other value was filled by hand
                // against the package signature, and only those are published.
                const raw = normalize(info?.country || "");
                const vouched = raw && raw !== "united states" && raw !== "unknown";
                return {
                    id,
                    name: info?.name || `#${id}`,
                    country: vouched ? (isFr && TRACKER_COUNTRY_FR[raw]) || raw.charAt(0).toUpperCase() + raw.slice(1) : undefined,
                    countryEu: vouched ? EU_DESTINATIONS.includes(raw) : undefined,
                    apps,
                };
            });
            // most shared first
            trackers.sort((a: FicheTracker, b: FicheTracker) => b.apps.length - a.apps.length);
        }
    }

    /* ---- Static analysis (private APK repository, dropped on the deploy server) ----
       Absent from most fiches, and from every CI build: `findApkLabApp` returns null and
       the section is simply not rendered. Deltas are reversed here -- the fiche reads
       downwards from what changed last -- where the private dataset stores them
       oldest-first, in the order the collection saw them. */
    const labDoc = findApkLabApp({ slug: exodusFile || slug, handle: apk?.handle });
    const apkLab: FicheApkLab = labDoc ? {
        measures: labDoc.static ? {
            versionName: labDoc.static.version_name,
            observedAt: labDoc.static.observed_at,
            totalBytes: labDoc.static.total_bytes,
            dexBytes: labDoc.static.dex_bytes,
            nativeBytes: labDoc.static.native_bytes,
            resBytes: labDoc.static.res_bytes,
            assetsBytes: labDoc.static.assets_bytes,
            methodCount: labDoc.static.dex_method_count,
            minSdk: labDoc.static.min_sdk,
            abis: labDoc.static.native_abis,
            sizeScope: labDoc.static.size_scope,
        } : null,
        // La série des poids arrive déjà ordonnée par version et dédoublonnée ; le seul
        // travail ici est le renommage. Absente des documents publiés avant le
        // 2026-09-15, d'où le repli sur une liste vide plutôt qu'un `undefined` que
        // chaque lecteur devrait tester.
        sizeHistory: (labDoc.size_history ?? []).map((p) => ({
            version: p.version_name,
            observedAt: p.observed_at,
            total: p.total_bytes,
            dex: p.dex_bytes,
            native: p.native_bytes,
            res: p.res_bytes,
            assets: p.assets_bytes,
            abiCount: p.abi_count,
            variantChange: p.variant_change,
        })),
        // `publish` refuse déjà un delta vide, un écart nul et une série qui recule. Le
        // filtre ici est une seconde barrière, pas la première : une carte sans ligne
        // afficherait « de la X à la X » et rien dessous, et c'est le genre de trou qui
        // se voit en production avant de se voir en test.
        changes: [...labDoc.deltas].reverse().map((d) => ({
            fromVersion: d.from_version,
            toVersion: d.to_version,
            permsAdded: (d.permissions?.added ?? []).map(label),
            permsRemoved: (d.permissions?.removed ?? []).map(label),
            // A tracker with no name in the catalogue falls back to its id: dropping the
            // line would hide a real change, and printing "null" would be worse.
            trackersAdded: (d.trackers?.added ?? []).map((x) => x.name || `#${x.id}`),
            trackersRemoved: (d.trackers?.removed ?? []).map((x) => x.name || `#${x.id}`),
            sizeDelta: typeof d.size?.total_bytes_delta === 'number' ? d.size.total_bytes_delta : undefined,
            from: d.window?.from,
            to: d.window?.to,
        })).filter((c) => c.permsAdded.length || c.permsRemoved.length
            || c.trackersAdded.length || c.trackersRemoved.length || c.sizeDelta !== undefined),
        hosts: labDoc.endpoints.hosts.map((h) => ({ host: h.host, appCount: h.app_count })),
        hostsExcluded: labDoc.endpoints.excluded_count,
    } : null;

    /* ---- Breaches (Have I Been Pwned) ---- */
    const breachesRaw = await getBreachData(slug);
    const breaches: FicheBreach[] = breachesRaw.map((b: any): FicheBreach => ({
        name: b.title || b.name,
        date: b.breachDate,
        count: b.pwnCount || 0,
        kind: /scrap/i.test(`${b.title} ${b.name} ${b.description}`) ? 'scrape' : 'intrusion',
        classes: b.dataClasses || [],
        desc: b.description ? stripHtml(b.description) : '',
    })).sort((a, b) => (a.date < b.date ? 1 : -1));

    /* ---- Terms changes (Open Terms Archive) ---- */
    const memosRaw = await getTermsArchiveData(slug);
    const memos: FicheMemo[] = memosRaw.map((m: any): FicheMemo => ({
        date: parseStringList(m.dates)[0] || '',
        type: parseStringList(m.terms_types)[0] || '',
        title: pick(m.title_fr, m.title) || m.title,
        desc: pick(m.description_fr, m.description) || '',
        url: m.url,
    })).sort((a, b) => (a.date < b.date ? 1 : -1));

    /* ---- European GDPR fines (enforcementtracker.com, CMS) ---- */
    const enforcementFines = await getEnforcementFines(slug);

    /* ---- Editorial record ---- */
    const easyMatch = String(entreprise.easy_access_data || '').match(/(\d+)(?:\s*\/\s*(\d+))?/);
    const easy = easyMatch ? parseInt(easyMatch[1], 10) : 0;
    const easyMax = easyMatch?.[2] ? parseInt(easyMatch[2], 10) : 5;

    // transfer_destination_countries is a comma-separated string in some records, an array in others
    const destinationsRaw = (isFr
        ? entreprise.transfer_destination_countries
        : (entreprise.transfer_destination_countries_en ?? entreprise.transfer_destination_countries)) as string | string[] | undefined;
    // 16 records lead with a caveat instead of a country ("Liste non exhaustive :
    // États-Unis, ..."). Splitting on commas alone glues that sentence onto the
    // first destination and turns it into a chip. The caveat is worth keeping,
    // but as a note under the list, not as a country.
    const destinationsText = Array.isArray(destinationsRaw) ? '' : String(destinationsRaw || '');
    const colon = destinationsText.indexOf(':');
    const lead = colon >= 0 && !destinationsText.slice(0, colon).includes(',')
        ? destinationsText.slice(0, colon)
        : '';
    const destinationsPartial = /non[\s-]*exhaust|non\s+précisée?|not\s+specified/i.test(lead);
    const destinationList = Array.isArray(destinationsRaw)
        ? destinationsRaw.map(String)
        : (lead ? destinationsText.slice(colon + 1) : destinationsText).split(/[,;]/);
    const destinations = destinationList
        .map(d => d.trim())
        .filter(Boolean)
        .map(name => ({ name, eu: EU_DESTINATIONS.includes(normalize(name)) }));

    const alternatives = (entreprise.alternatives || [])
        .map((altSlug: string) => {
            const svc = (servicesData as any[]).find(s => s.slug === altSlug);
            if (!svc) return { name: altLabel(altSlug), slug: altSlug, inCatalog: false };
            return {
                name: svc.name,
                slug: altSlug,
                inCatalog: true,
                logo: svc.logo,
                countryCode: svc.country_code,
                countryName: svc.country_name,
                nationality: svc.nationality,
                why: svc.better_alternative_explication || undefined,
                whyEn: svc.better_alternative_explication_en || undefined,
            };
        });

    const comparisonSlugs = findSimilarServices(slug, 2);
    const compareServicesParam = [slug, ...comparisonSlugs].join(',');

    /* ---- Privacy-policy IA analysis (policy-analysis/<slug>.json) ---- */
    const analysis = await loadJson<FicheAnalysis>(() => import(`../../public/data/policy-analysis/${slug}.json`));

    /* ---- Human review sidecar (policy-analysis/reviews/<slug>.json) ---- */
    const review = await loadJsonFile<ReviewSidecar>(`public/data/policy-analysis/reviews/${slug}.json`);

    const hasDeleteOption = Boolean(entreprise.contact_mail_delete || entreprise.url_delete || entreprise.contact_mail_export);
    const examplesDocumented = Boolean(
        (entreprise.example_data_export && entreprise.example_data_export.length > 0) ||
        (entreprise.example_form_export && entreprise.example_form_export.length > 0)
    );

    return (
        <FicheAvancee
            lang={lang}
            slug={slug}
            name={entreprise.name}
            logo={entreprise.logo}
            countryName={entreprise.country_name}
            groupName={entreprise.group_name}
            belongsToGroup={entreprise.belongs_to_group}
            nationality={entreprise.nationality}
            createdAt={entreprise.created_at}
            createdBy={entreprise.created_by}
            updatedAt={entreprise.updated_at}
            updatedBy={entreprise.updated_by}
            easy={easy}
            easyMax={easyMax}
            needIdCard={entreprise.need_id_card}
            viaForm={entreprise.data_access_via_form}
            viaEmail={entreprise.data_access_via_email}
            viaPostal={entreprise.data_access_via_postal}
            urlExport={pick(entreprise.url_export, entreprise.url_export_en)}
            addressExport={entreprise.address_export}
            contactMailExport={typeof entreprise.contact_mail_export === 'string' ? entreprise.contact_mail_export : undefined}
            contactMailDelete={typeof entreprise.contact_mail_delete === 'string' ? entreprise.contact_mail_delete : undefined}
            responseDelay={pick(entreprise.response_delay, entreprise.response_delay_en)}
            responseFormat={pick(entreprise.response_format, entreprise.response_format_en)}
            examplesDocumented={examplesDocumented}
            outsideEU={isTruthyFlag(entreprise.outside_eu_storage)}
            destinations={destinations}
            destinationsPartial={destinationsPartial}
            quote={pick(entreprise.privacy_policy_quote, entreprise.privacy_policy_quote_en)}
            notes={NOTES_SLUGS.has(slug) ? pick(entreprise.comments, entreprise.comments_en) : undefined}
            sanctioned={entreprise.sanctioned_by_cnil}
            sanctionDetails={pick(entreprise.sanction_details, entreprise.sanction_details_en)}
            enforcementFines={enforcementFines}
            hasDeleteOption={hasDeleteOption}
            trackers={trackers}
            perms={perms}
            breaches={breaches}
            memos={memos}
            apk={apk}
            apkLab={apkLab}
            alternatives={alternatives}
            betterAlternative={isTruthyFlag(entreprise.better_alternative)}
            betterAlternativeWhy={pick(entreprise.better_alternative_explication, entreprise.better_alternative_explication_en)}
            compareServicesParam={compareServicesParam}
            analysis={analysis}
            review={review}
        />
    );
}
