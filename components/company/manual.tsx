import slugs from '../../public/data/manual/slugs.json';
import servicesData from '../../public/data/services.json';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import {
    getEntrepriseData,
    getBreachData,
    getTermsArchiveData
} from './manual-components/data';
import { findSimilarServices } from './manual-components/helpers';
import { t } from './manual-components/i18n';

import FicheAvancee, {
    FicheApk,
    FicheBreach,
    FicheMemo,
    FichePerm,
    FicheTracker
} from './FicheAvancee';

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

            const permCatalogFile = isFr ? 'permissions_fr' : 'permissions';
            const permCatalogRaw = await loadJson<any>(() => import(`../../public/data/compare/${permCatalogFile}.json`));
            const permCatalog: Record<string, PermCatalogEntry> = permCatalogRaw?.[0]?.permissions || {};
            perms = (exodus.permissions || []).map((full: string): FichePerm => {
                const entry = permCatalog[full];
                const short = full.split('.').pop() || full;
                const dangerous = Boolean(entry?.protection_level?.includes('dangerous'));
                // catalog quirk: `name` sometimes duplicates the description — prefer label, else the raw id
                const desc = entry?.description && entry.description !== short ? entry.description : undefined;
                return { perm: short, full, desc: dangerous ? desc : undefined, dangerous };
            });
            // sensitive first, then alphabetical
            perms.sort((a, b) => Number(b.dangerous) - Number(a.dangerous) || a.perm.localeCompare(b.perm));

            const trackerCatalog = await loadJson<TrackerCatalogEntry[]>(() => import('../../public/data/compare/trackers.json')) || [];
            const trackerLinks = await loadJson<Record<string, { name: string; slug: string }[]>>(() => import('../../public/data/compare/tracker-links.json')) || {};
            trackers = (exodus.trackers || []).map((id: number): FicheTracker => {
                const info = trackerCatalog.find(tc => tc.id === id);
                const apps = (trackerLinks[String(id)] || []).filter(a => a.slug !== slug && a.name !== entreprise.name);
                return {
                    id,
                    name: info?.name || `#${id}`,
                    country: info?.country ? info.country.charAt(0).toUpperCase() + info.country.slice(1) : undefined,
                    apps,
                };
            });
            // most shared first
            trackers.sort((a: FicheTracker, b: FicheTracker) => b.apps.length - a.apps.length);
        }
    }

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

    /* ---- Editorial record ---- */
    const easyMatch = String(entreprise.easy_access_data || '').match(/(\d+)(?:\s*\/\s*(\d+))?/);
    const easy = easyMatch ? parseInt(easyMatch[1], 10) : 0;
    const easyMax = easyMatch?.[2] ? parseInt(easyMatch[2], 10) : 5;

    // transfer_destination_countries is a comma-separated string in some records, an array in others
    const destinationsRaw = (isFr
        ? entreprise.transfer_destination_countries
        : (entreprise.transfer_destination_countries_en ?? entreprise.transfer_destination_countries)) as string | string[] | undefined;
    const destinationList = Array.isArray(destinationsRaw)
        ? destinationsRaw.map(String)
        : String(destinationsRaw || '').split(/[,;]/);
    const destinations = destinationList
        .map(d => d.trim())
        .filter(Boolean)
        .map(name => ({ name, eu: EU_DESTINATIONS.includes(normalize(name)) }));

    const alternatives = (entreprise.alternatives || [])
        .map((altSlug: string) => {
            const svc = (servicesData as any[]).find(s => s.slug === altSlug);
            if (!svc) return { name: altSlug, slug: altSlug };
            return {
                name: svc.name,
                slug: altSlug,
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
            quote={pick(entreprise.privacy_policy_quote, entreprise.privacy_policy_quote_en)}
            sanctioned={entreprise.sanctioned_by_cnil}
            sanctionDetails={pick(entreprise.sanction_details, entreprise.sanction_details_en)}
            hasDeleteOption={hasDeleteOption}
            trackers={trackers}
            perms={perms}
            breaches={breaches}
            memos={memos}
            apk={apk}
            alternatives={alternatives}
            compareServicesParam={compareServicesParam}
        />
    );
}
