import slugs from '../../public/data/manual/slugs.json';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import AppDataSection from "@/components/AppDataSection";

import {
    getEntrepriseData,
    getBreachData,
    getTermsArchiveData,
    getSimilarServices
} from './manual-components/data';
import { findSimilarServices } from './manual-components/helpers';
import { t } from './manual-components/i18n';

// Components
import CompanyHeader from './manual-components/CompanyHeader';
import CompanyInfo from './manual-components/CompanyInfo';
import DataAccess from './manual-components/DataAccess';
import DataExport from './manual-components/DataExport';
import SanctionsTransfers from './manual-components/SanctionsTransfers';
import DataBreaches from './manual-components/DataBreaches';
import TermsChanges from './manual-components/TermsChanges';
import SimilarServices from './manual-components/SimilarServices';
import Vulnerabilities from './manual-components/Vulnerabilities';

export async function generateStaticParams() {
    return slugs
}

export async function generateMetadata({params}: { params: { slug: string, lang: string } }): Promise<Metadata> {
    const lang = params.lang || 'fr';
    const entreprise = await getEntrepriseData(params.slug);
    return {
        title: entreprise ? `${entreprise.name} - ${t(lang, 'companyDetailsSuffix')}` : t(lang, 'companyNotFoundTitle'),
        description: entreprise?.name ? t(lang, 'companyDetailsDescription', entreprise.name) : undefined
    };
}

export default async function Manual({slug, lang = 'fr'}: { slug: string, lang: string }) {
    const entreprise = await getEntrepriseData(slug);
    const similarServices = await getSimilarServices(slug);
    const breaches = await getBreachData(slug);
    const termsMemos = await getTermsArchiveData(slug);

    // Get similar services from the same category for comparison
    const comparisonSlugs = findSimilarServices(slug, 2);
    const compareServicesParam = [slug, ...comparisonSlugs].join(',');

    if (!entreprise) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header Section with Logo and Quick Actions */}
            <CompanyHeader
                entreprise={entreprise}
                lang={lang}
                slug={slug}
                compareServicesParam={compareServicesParam}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* --- Company Info --- */}
                <CompanyInfo entreprise={entreprise} lang={lang} />

                {/* --- Data Access Section --- */}
                <DataAccess entreprise={entreprise} lang={lang} />
            </div>

            {/* --- Export data Section --- */}
            <DataExport entreprise={entreprise} lang={lang} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
                {/* Left Column */}
                <div>
                    <Vulnerabilities entreprise={entreprise} lang={lang} />
                    <DataBreaches entreprise={entreprise} breaches={breaches} lang={lang} />
                    <TermsChanges termsMemos={termsMemos} lang={lang} />
                    <SanctionsTransfers entreprise={entreprise} lang={lang} />
                </div>

                {/* Right Column (Analysis) */}
                {(entreprise.exodus || entreprise.tosdr) && (
                    <div id="analysis-section">
                        <AppDataSection exodusPath={entreprise.exodus} tosdrPath={entreprise.tosdr} slug={slug} lang={lang} />
                    </div>
                )}
            </div>

            {/* --- Similar Services Section --- */}
            <SimilarServices similarServices={similarServices} lang={lang} />
        </div>
    );
}
