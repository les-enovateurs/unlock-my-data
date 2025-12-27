import slugs from '../../public/data/manual/slugs.json';
import {notFound} from 'next/navigation'
import {
    Building, FileText, ShieldAlert, Download, ExternalLink, Check, X,
    Trash2, Scale, ShieldCheck, ArrowRight, Edit, AlertTriangle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {Metadata} from 'next';
import ReactMarkdown from 'react-markdown';
import AppDataSection from "@/components/AppDataSection";

// ---------------------------------------
// Translation dictionary (extendable)
// ---------------------------------------
const translations: Record<string, Record<string, string>> = {
    fr: {
        companyNotFoundTitle: 'Entreprise non trouvée',
        companyNotFoundMessage: 'L\'entreprise "{slug}" n\'existe pas dans notre base de données.',
        nationality: 'Nationalité',
        belongsToGroup: 'Appartient au groupe',
        createdOn: 'Créé le',
        updatedOn: 'Mis à jour le',
        dataAccess: 'Accès aux données',
        requiresId: 'Nécessite une pièce d\'identité',
        requiredDocumentsDetails: 'Détails des documents requis',
        accessViaForm: 'Accès par formulaire',
        accessViaEmail: 'Accès par email',
        accessViaPostal: 'Accès par courrier',
        otherAccessType: 'Autre type d\'accès',
        exportFormExamples: 'Exemples de formulaires d\'export',
        messageExchange: 'Échanges de messages',
        responseDelay: 'Délai de réponse',
        comments: 'Commentaires',
        dataExport: 'Export des données',
        dataExportExamples: 'Exemples d\'export de données',
        responseFormat: 'Format de la réponse',
        sanctionsAndTransfer: 'Sanctions et politique de transfert',
        sanctionDetails: 'Détails sanction',
        transferPolicy: 'Politique de transfert de données',
        policyExcerpt: 'Extrait de politique',
        transferCountries: 'Pays de transfert',
        outsideEuStorage: 'Stockage hors UE',
        date: 'Date',
        yes: 'Oui',
        no: 'Non',
        emailSubject: 'Demande d’accès à mes données personnelles',
        emailBody: `Madame, Monsieur,%0A%0AJe vous prie de bien vouloir m’indiquer si des données me concernant figurent dans vos fichiers informatisés ou manuels.%0A%0ADans l’affirmative, je souhaiterais obtenir une copie, en langage clair, de l’ensemble de ces données (y compris celles figurant dans les zones « blocs-notes » ou « commentaires »), en application de l’article 15 du Règlement général sur la protection des données (RGPD).%0A%0AJe vous remercie de me faire parvenir votre réponse dans les meilleurs délais et au plus tard dans un délai d’un mois à compter de la réception de ma demande (article 12.3 du RGPD).%0A%0AÀ défaut de réponse de votre part dans les délais impartis ou en cas de réponse incomplète, je me réserve la possibilité de saisir la Commission nationale de l’informatique et des libertés (CNIL) d’une réclamation.%0A%0AÀ toutes fins utiles, vous trouverez des informations sur le site internet de la CNIL : https://www.cnil.fr/fr/professionnels-comment-repondre-une-demande-de-droit-dacces.%0A%0AJe vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.`,
        companyDetailsSuffix: 'Détails entreprise',
        companyDetailsDescription: 'Détails sur {slug}',
        quickActions: 'Actions rapides',
        deleteDataAction: 'Supprimer mes données',
        compareAction: 'Comparer',
        analysisAction: 'Analyse technique',
        viewAnalysis: 'Voir l\'analyse',
        startProcess: 'Commencer',
        addToComparator: 'Comparer ce service',
        available: 'Disponible',
        unavailable: 'Non disponible',
        privacyScore: 'Score de confidentialité',
        deleteDataDesc: 'Exercez votre droit à l\'oubli',
        compareDesc: 'Voir les alternatives',
        analysisDesc: 'Permissions et traceurs',
        similarServices: 'D\'autres services',
        noSimilarServices: 'Aucun service similaire trouvé',
        deleteNotAvailable: 'Suppression non disponible',
        deleteNotAvailableDesc: 'Contactez le support directement',
        modifyAction: 'Modifier la fiche',
        modifyDesc: 'Suggérer des modifications',
        cnilSanctions: 'Sanctions CNIL',
        sanctionAmount: 'Montant',
        sanctionDate: 'Date',
        viewDecision: 'Voir la décision',
        noSanction: 'Aucune sanction connue',
        dataBreaches: 'Fuites de données',
        noBreaches: 'Aucune fuite de données connue',
        breachDate: 'Date de la fuite',
        affectedAccounts: 'Comptes affectés',
        compromisedData: 'Données compromises',
        accounts: 'comptes',
        million: 'M',
        billion: 'Md',
        verifiedBreach: 'Fuite vérifiée',
        termsChanges: 'Évolutions des Conditions',
        termsChangesDesc: 'Changements détectés par Open Terms Archive',
        noTermsChanges: 'Aucun changement de conditions détecté',
        readMore: 'Lire plus',
        affectedDocument: 'Document concerné'
    },
    en: {
        companyNotFoundTitle: 'Company not found',
        companyNotFoundMessage: 'The company "{slug}" does not exist in our database.',
        nationality: 'Nationality',
        belongsToGroup: 'Belongs to group',
        createdOn: 'Created on',
        updatedOn: 'Updated on',
        dataAccess: 'Data Access',
        requiresId: 'Requires ID document',
        requiredDocumentsDetails: 'Required documents details',
        accessViaForm: 'Access via form',
        accessViaEmail: 'Access via email',
        accessViaPostal: 'Access via postal mail',
        otherAccessType: 'Other access type',
        exportFormExamples: 'Examples of export forms',
        messageExchange: 'Message exchanges',
        responseDelay: 'Response time',
        comments: 'Comments',
        dataExport: 'Data export',
        dataExportExamples: 'Examples of data exports',
        responseFormat: 'Response format',
        sanctionsAndTransfer: 'Sanctions and transfer policy',
        sanctionDetails: 'Sanction details',
        transferPolicy: 'Data transfer policy',
        policyExcerpt: 'Policy excerpt',
        transferCountries: 'Transfer destination countries',
        outsideEuStorage: 'Outside EU storage',
        date: 'Date',
        yes: 'Yes',
        no: 'No',
        emailSubject: 'Request for access to my personal data',
        emailBody: `Dear Sir or Madam,%0A%0AI kindly request confirmation whether any data concerning me is contained in your computerized or manual files.%0A%0AIf so, I would like to obtain a clear copy of all such data (including any notes or comments), pursuant to Article 15 of the General Data Protection Regulation (GDPR).%0A%0APlease provide your response as soon as possible and no later than one month from receipt of this request (Article 12.3 GDPR).%0A%0AIf you fail to respond within the prescribed period or provide an incomplete response, I reserve the right to file a complaint with the competent Data Protection Authority.%0A%0AFor reference: https://www.cnil.fr/en.%0A%0ABest regards.`,
        companyDetailsSuffix: 'Company details',
        companyDetailsDescription: 'Details about {slug}',
        quickActions: 'Quick Actions',
        deleteDataAction: 'Delete my data',
        compareAction: 'Compare',
        analysisAction: 'Technical Analysis',
        viewAnalysis: 'View analysis',
        startProcess: 'Start',
        addToComparator: 'Compare this service',
        available: 'Available',
        unavailable: 'Unavailable',
        privacyScore: 'Privacy Score',
        deleteDataDesc: 'Exercise your right to be forgotten',
        compareDesc: 'See alternatives',
        analysisDesc: 'Permissions and trackers',
        similarServices: 'Other services',
        noSimilarServices: 'No similar services found',
        deleteNotAvailable: 'Deletion not available',
        deleteNotAvailableDesc: 'Contact support directly',
        modifyAction: 'Edit this page',
        modifyDesc: 'Suggest changes',
        cnilSanctions: 'CNIL Sanctions',
        sanctionAmount: 'Amount',
        sanctionDate: 'Date',
        viewDecision: 'View decision',
        noSanction: 'No known sanction',
        dataBreaches: 'Data Breaches',
        noBreaches: 'No known data breaches',
        breachDate: 'Breach date',
        affectedAccounts: 'Affected accounts',
        compromisedData: 'Compromised data',
        accounts: 'accounts',
        million: 'M',
        billion: 'B',
        verifiedBreach: 'Verified breach',
        termsChanges: 'Terms Changes',
        termsChangesDesc: 'Policy changes detected by Open Terms Archive',
        noTermsChanges: 'No terms changes detected',
        readMore: 'Read more',
        affectedDocument: 'Affected document'
    }
};

function t(lang: string, key: string, slug?: string) {
    const base = translations[lang] || translations['fr'];
    const value = base[key] || key;
    return slug ? value.replace('{slug}', slug) : value;
}

// ---------------------------------------
// Types
// ---------------------------------------

type EntrepriseData = {
    name: string;
    logo?: string;
    nationality?: string;
    country_name?: string;
    country_code?: string;
    belongs_to_group?: boolean;
    group_name?: string;
    permissions?: string;
    contact_mail_export?: string;
    contact_mail_delete?: string;
    url_delete?: string;
    easy_access_data?: string;
    need_id_card?: boolean;
    details_required_documents?: string;
    details_required_documents_en?: string;
    data_access_via_postal?: boolean;
    data_access_via_form?: boolean;
    data_access_type?: string;
    data_access_type_en?: string;
    data_access_via_email?: boolean;
    response_format?: string;
    response_format_en?: string;
    example_data_export?: Array<{
        url: string;
        type: string;
        description: string;
        description_en?: string;
        date: string;
    }>;
    example_form_export?: Array<{
        url: string;
        type: string;
        description: string;
        description_en?: string;
        date: string;
    }>;
    message_exchange?: Array<{
        url: string;
        type: string;
        description: string;
        description_en?: string;
        date: string;
    }>;
    url_export?: string;
    url_export_en?: string;
    address_export?: string;
    response_delay?: string;
    response_delay_en?: string;
    sanctioned_by_cnil?: boolean;
    sanction_details?: string;
    sanction_details_en?: string;
    data_transfer_policy?: boolean;
    privacy_policy_quote?: string;
    privacy_policy_quote_en?: string;
    transfer_destination_countries?: string;
    transfer_destination_countries_en?: string;
    outside_eu_storage?: string | boolean;
    outside_eu_storage_en?: string | boolean;
    comments?: string;
    comments_en?: string;
    tosdr?: string;
    exodus?: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    app?: {
        name: string;
        link: string;
    };
    sanctions?: Array<{
        deliberation: string;
        date: string;
        amount_euros: number;
        violations: string[];
        source_url: string;
        pdf_url?: string | null;
        title: string;
        title_en?: string;
    }>;
};

interface Breach {
    name: string;
    title: string;
    breachDate: string;
    pwnCount: number;
    dataClasses: string[];
    description: string;
    isVerified: boolean;
}

interface TermsMemo {
    slug: string;
    url: string;
    title: string;
    title_fr: string;
    service: string;
    terms_types: string[];
    dates: string[];
    author: string;
    description: string;
    description_fr: string;
    body: string;
    body_fr: string;
}

// Traductions des types de données compromises
const dataTypeTranslations: Record<string, string> = {
    "Email addresses": "Adresses email",
    "Passwords": "Mots de passe",
    "Usernames": "Noms d'utilisateur",
    "Names": "Noms",
    "Phone numbers": "Numéros de téléphone",
    "Physical addresses": "Adresses physiques",
    "Dates of birth": "Dates de naissance",
    "IP addresses": "Adresses IP",
    "Geographic locations": "Localisations",
    "Genders": "Genres",
    "Job titles": "Titres de poste",
    "Employers": "Employeurs",
    "Social media profiles": "Profils réseaux sociaux",
    "Credit cards": "Cartes de crédit",
    "Bank account numbers": "Numéros de compte bancaire",
    "Partial phone numbers": "Numéros de téléphone partiels",
    "Salutations": "Civilités"
};

// Helper pour traduire les types de données
function translateDataClass(dataClass: string, lang: string): string {
    if (lang === 'fr') {
        return dataTypeTranslations[dataClass] || dataClass;
    }
    return dataClass;
}

// Helper pour formater les grands nombres
function formatPwnCount(count: number, lang: string): string {
    const million = lang === 'fr' ? 'M' : 'M';
    const billion = lang === 'fr' ? 'Md' : 'B';
    if (count >= 1000000000) {
        return `${(count / 1000000000).toFixed(1)}${billion}`;
    }
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}${million}`;
    }
    return count.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US');
}

// Helper pour formater la date des breaches
function formatBreachDate(dateStr: string, lang: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Helper to find similar services (mock implementation - replace with real logic if available)
async function getSimilarServices(currentSlug: string): Promise<EntrepriseData[]> {
    // In a real app, you would query your database/API based on category/tags
    // For now, we'll just return a few random ones excluding the current one
    // This requires importing all services which might be heavy, so we'll just mock it
    // or try to load a few known ones if possible.

    // Better approach: Load the main list and filter
    try {
        const allServices = (await import('../../public/data/services.json')).default;
        // Simple filter: same first letter or random (just for demo)
        // Ideally, services.json should have a 'category' field
        const currentService = allServices.find(s => s.slug === currentSlug);

        // If we had categories, we'd use them. For now, let's just pick 3 random others
        const others = allServices.filter(s => s.slug !== currentSlug);
        const randomOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);

        return randomOthers as unknown as EntrepriseData[];
    } catch {
        return [];
    }
}

function getBooleanIcon(value?: boolean, displayText: boolean = true, lang: string = 'fr') {
    if (value === true) {
        return (
            <div className="flex items-center">
                <Check className="h-5 w-5 text-green-600" />{displayText && <span className="ml-1 text-gray-700">{t(lang,'yes')}</span>}
            </div>
        );
    }
    if (value === false) {
        return (
            <div className="flex items-center">
                <X className="h-5 w-5 text-red-600" />{displayText && <span className="ml-2 text-gray-700">{t(lang,'no')}</span>}
            </div>
        );
    }
    return null;
}

async function getEntrepriseData(slug: string): Promise<EntrepriseData | null> {
    try {
        return (await import(`../../public/data/manual/${slug}.json`)).default;
    } catch {
        return null;
    }
}

async function getBreachData(slug: string): Promise<Breach[]> {
    try {
        const breachMapping = (await import('../../public/data/compare/breach-mapping.json')).default;
        return (breachMapping as Record<string, Breach[]>)[slug] || [];
    } catch {
        return [];
    }
}

async function getTermsArchiveData(slug: string): Promise<TermsMemo[]> {
    try {
        const termsArchive = (await import('../../public/data/compare/terms-archive.json')).default;
        return (termsArchive as Record<string, TermsMemo[]>)[slug] || [];
    } catch {
        return [];
    }
}

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

    if (!entreprise) {
        notFound();
    }

    const hasBreachData = breaches.length > 0;
    const hasTermsMemos = termsMemos.length > 0;

    // Sort breaches by breachDate descending (newest first) without mutating original array
    const sortedBreaches = [...breaches].sort((a, b) => {
        const ta = new Date(a.breachDate).getTime() || 0;
        const tb = new Date(b.breachDate).getTime() || 0;
        return tb - ta;
    });

    const mailTo = entreprise?.contact_mail_export && entreprise?.data_access_via_email
        ? `mailto:${entreprise.contact_mail_export}?subject=${encodeURIComponent(t(lang,'emailSubject'))}&body=${translations[lang]?.emailBody || translations['fr'].emailBody}`
        : undefined;

    // Check for delete option availability
    const hasDeleteOption = !!(entreprise.contact_mail_delete || entreprise.url_delete || entreprise.contact_mail_export);
    const deleteLink = `/supprimer-mes-donnees/${slug}`;

    const hasAnalysis = !!(entreprise.exodus || entreprise.tosdr);

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header Section with Logo and Quick Actions */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                {/* Logo */}
                {entreprise.logo && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-48 h-48 flex items-center justify-center flex-shrink-0">
                        <div className="relative w-full h-full">
                            <Image src={entreprise.logo} alt={`Logo ${entreprise.name}`} fill className="object-contain" unoptimized />
                        </div>
                    </div>
                )}

                {/* Title and Quick Actions */}
                <div className="flex-grow w-full">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">{entreprise.name}</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Delete Action */}
                        {hasDeleteOption ? (
                            <div className="p-4 rounded-xl border border-red-100 bg-red-50 hover:shadow-md transition-all duration-200 cursor-pointer group relative">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="p-2 rounded-lg bg-red-100 text-red-600">
                                        <Trash2 className="h-5 w-5" />
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-red-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <h3 className="font-semibold text-gray-900">{t(lang, 'deleteDataAction')}</h3>
                                <p className="text-xs text-gray-500 mt-1">{t(lang, 'deleteDataDesc')}</p>
                                <Link href={deleteLink} className="absolute inset-0" />
                            </div>
                        ) : (
                             <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="p-2 rounded-lg bg-gray-200 text-gray-500">
                                        <Trash2 className="h-5 w-5" />
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900">{t(lang, 'deleteNotAvailable')}</h3>
                                <p className="text-xs text-gray-500 mt-1">{t(lang, 'deleteNotAvailableDesc')}</p>
                            </div>
                        )}

                        {/* Compare Action */}
                        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50 hover:shadow-md transition-all duration-200 cursor-pointer group relative">
                            <div className="flex items-start justify-between mb-2">
                                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                    <Scale className="h-5 w-5" />
                                </div>
                                <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h3 className="font-semibold text-gray-900">{t(lang, 'compareAction')}</h3>
                            <p className="text-xs text-gray-500 mt-1">{t(lang, 'compareDesc')}</p>
                            <Link href={`/comparer`} className="absolute inset-0" />
                        </div>

                        {/* Analysis Action */}
                        {!hasAnalysis && <div className={`p-4 rounded-xl border transition-all duration-200 ${hasAnalysis ? 'bg-purple-50 border-purple-100 hover:shadow-md cursor-pointer group' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                            <div className="flex items-start justify-between mb-2">
                                <div className={`p-2 rounded-lg ${hasAnalysis ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'}`}>
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                {hasAnalysis && <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />}
                            </div>
                            <h3 className="font-semibold text-gray-900">{t(lang, 'analysisAction')}</h3>
                            <p className="text-xs text-gray-500 mt-1">{t(lang, 'analysisDesc')}</p>
                        </div>}

                        {hasAnalysis && <Link href={"#analysis-section"} className={`p-4 rounded-xl border transition-all duration-200 ${hasAnalysis ? 'bg-purple-50 border-purple-100 hover:shadow-md cursor-pointer group' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                            <div className="flex items-start justify-between mb-2">
                                <div className={`p-2 rounded-lg ${hasAnalysis ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'}`}>
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                {hasAnalysis && <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />}
                            </div>
                            <h3 className="font-semibold text-gray-900">{t(lang, 'analysisAction')}</h3>
                            <p className="text-xs text-gray-500 mt-1">{t(lang, 'analysisDesc')}</p>
                        </Link>}

                        {/* Modify Action */}
                        <div className="p-4 rounded-xl border border-yellow-100 bg-yellow-50 hover:shadow-md transition-all duration-200 cursor-pointer group relative">
                            <div className="flex items-start justify-between mb-2">
                                <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
                                    <Edit className="h-5 w-5" />
                                </div>
                                <ArrowRight className="h-4 w-4 text-yellow-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h3 className="font-semibold text-gray-900">{t(lang, 'modifyAction')}</h3>
                            <p className="text-xs text-gray-500 mt-1">{t(lang, 'modifyDesc')}</p>
                            <Link href={`/contribuer/modifier-fiche?slug=${slug}`} className="absolute inset-0" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* --- Company Info --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center">
                        <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-gray-700">
                            <Building className="h-5 w-5" />
                        </div>
                        <h1 className="text-lg font-semibold text-gray-800">{entreprise.name}</h1>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {entreprise.nationality && 'fr' === lang && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">{t(lang,'nationality')}</div>
                                <div className="text-gray-900 font-medium">{entreprise.nationality}</div>
                            </div>
                        )}
                        {entreprise.country_name && 'en' === lang && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">{t(lang,'nationality')}</div>
                                <div className="text-gray-900 font-medium">{entreprise.country_name}</div>
                            </div>
                        )}
                        {entreprise.group_name && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">{t(lang,'belongsToGroup')}</div>
                                <div className="text-gray-900 font-medium">{entreprise.group_name}</div>
                            </div>
                        )}
                        {(entreprise.created_at || entreprise.updated_at) && (
                            <div className="p-4 text-xs text-gray-400">
                                {entreprise.created_at && <>{t(lang,'createdOn')}&nbsp;{entreprise.created_at} {entreprise.created_by}<br/></>}
                                {entreprise.updated_at && <>{t(lang,'updatedOn')}&nbsp;{entreprise.updated_at} {entreprise.updated_by}</>}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Data Access Section --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center">
                        <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-gray-700">
                            <FileText className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">{t(lang,'dataAccess')}</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {entreprise.need_id_card && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'requiresId')}</div>
                                <div>{getBooleanIcon(entreprise.need_id_card,true,lang)}</div>
                            </div>
                        )}
                        {entreprise.details_required_documents && 'fr' === lang && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'requiredDocumentsDetails')}</div>
                                <div>{entreprise.details_required_documents}</div>
                            </div>
                        )}
                        {entreprise.details_required_documents_en && 'en' === lang && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'requiredDocumentsDetails')}</div>
                                <div>{entreprise.details_required_documents_en}</div>
                            </div>
                        )}
                        {entreprise.url_export && 'fr' === lang || (entreprise.url_export && !entreprise.url_export_en && 'en' === lang) && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'accessViaForm')}</div>
                                <div className="flex flex-row items-center">
                                    <Link href={entreprise.url_export} target="_blank" className="underline hover:no-underline" rel="noopener noreferrer">{entreprise.url_export}</Link>
                                </div>
                            </div>
                        )}
                        {entreprise.url_export_en && 'en' === lang && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'accessViaForm')}</div>
                                <div className="flex flex-row items-center">
                                    <Link href={entreprise.url_export_en} target="_blank" className="underline hover:no-underline" rel="noopener noreferrer">{entreprise.url_export}</Link>
                                </div>
                            </div>
                        )}
                        {mailTo && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'accessViaEmail')}</div>
                                <div className="flex flex-row items-center text-primary-600">
                                    <Link href={mailTo}>{entreprise.contact_mail_export}</Link>
                                </div>
                            </div>
                        )}
                        {entreprise.data_access_via_postal && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'accessViaPostal')}</div>
                                <div className="flex flex-row items-center">
                                    <address>{entreprise.address_export}</address>
                                </div>
                            </div>
                        )}
                        {entreprise.data_access_type && 'fr' === lang && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'otherAccessType')}</div>
                                <div>{entreprise.data_access_type}</div>
                            </div>
                        )}
                        {entreprise.data_access_type_en && 'en' === lang && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'otherAccessType')}</div>
                                <div>{entreprise.data_access_type_en}</div>
                            </div>
                        )}
                        {entreprise.example_form_export && entreprise.example_form_export.length > 0 && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700 mb-2">{t(lang,'exportFormExamples')}</div>
                                <div className="space-y-2">
                                    {entreprise.example_form_export.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-2 rounded">
                                            <Link href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline">
                                                <FileText className="h-4 w-4 mr-1" />
                                                {'fr' === lang ? item.description : item.description_en} ({item.type})
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                            </Link>
                                            <div className="text-xs text-gray-500 mt-1">{t(lang,'date')}: {item.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {entreprise.message_exchange && entreprise.message_exchange.length > 0 && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700 mb-2">{t(lang,'messageExchange')}</div>
                                <div className="space-y-2">
                                    {entreprise.message_exchange.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-2 rounded">
                                            <Link href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline">
                                                <FileText className="h-4 w-4 mr-1" />
                                                {'fr' === lang ? item.description : item.description_en} ({item.type})
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                            </Link>
                                            <div className="text-xs text-gray-500 mt-1">{t(lang,'date')}: {item.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {entreprise.response_delay && 'fr' === lang && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'responseDelay')}</div>
                                <div>{entreprise.response_delay}</div>
                            </div>
                        )}
                        {entreprise.response_delay_en && 'en' === lang && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'responseDelay')}</div>
                                <div>{entreprise.response_delay_en}</div>
                            </div>
                        )}
                        {entreprise.comments && 'fr' === lang && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">{t(lang,'comments')}</div>
                                <div className="text-gray-900">{entreprise.comments}</div>
                            </div>
                        )}
                        {entreprise.comments_en && 'en' === lang && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">{t(lang,'comments')}</div>
                                <div className="text-gray-900">{entreprise.comments_en}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Export data Section --- */}
            {entreprise.example_data_export && entreprise.example_data_export.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow mt-6">
                    <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center">
                        <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-gray-700">
                            <FileText className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">{t(lang,'dataExport')}</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        <div className="p-4">
                            <div className="font-medium text-gray-700 mb-2">{t(lang,'dataExportExamples')}</div>
                            <div className="space-y-2">
                                {entreprise.example_data_export.map((item, index) => (
                                    <div key={index} className="bg-gray-50 p-2 rounded">
                                        <Link href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline">
                                            <Download className="h-4 w-4 mr-1" />
                                            {'fr' === lang ? item.description : item.description_en} ({item.type})
                                            <ExternalLink className="ml-1 h-3 w-3" />
                                        </Link>
                                        <div className="text-xs text-gray-500 mt-1">{t(lang,'date')}: {item.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {entreprise.response_format && 'fr' === lang && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'responseFormat')}</div>
                                <div>{entreprise.response_format}</div>
                            </div>
                        )}
                        {entreprise.response_format_en && 'en' === lang && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">{t(lang,'responseFormat')}</div>
                                <div>{entreprise.response_format_en}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
                {/* --- CNIL Sanctions, Data Transfers --- */}
                <div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center">
                            <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-gray-700">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">{t(lang,'sanctionsAndTransfer')}</h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            <div className="p-4">
                                {/* Affichage structuré des sanctions si disponibles */}
                                {entreprise.sanctions && entreprise.sanctions.length > 0 ? (
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-600 mb-2">{t(lang, 'cnilSanctions')}</div>
                                        <div className="space-y-3">
                                            {entreprise.sanctions.map((sanction, idx) => (
                                                <div key={idx} className="bg-red-50 border border-red-100 rounded-lg p-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900 text-sm">
                                                                {lang === 'en' && sanction.title_en ? sanction.title_en : sanction.title}
                                                            </div>
                                                            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                                                            <span className="inline-flex items-center">
                                                                <span className="font-medium">{t(lang, 'sanctionAmount')}:</span>
                                                                <span className="ml-1 text-red-700 font-semibold">
                                                                    {new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(sanction.amount_euros)}
                                                                </span>
                                                            </span>
                                                                <span className="inline-flex items-center">
                                                                <span className="font-medium">{t(lang, 'sanctionDate')}:</span>
                                                                <span className="ml-1">{sanction.date}</span>
                                                            </span>
                                                                {sanction.deliberation && (
                                                                    <span className="text-gray-500">
                                                                    {sanction.deliberation}
                                                                </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {sanction.source_url && (
                                                        <div className="mt-2">
                                                            <Link
                                                                href={sanction.source_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                                            >
                                                                {t(lang, 'viewDecision')}
                                                                <ExternalLink className="ml-1 h-3 w-3" />
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : entreprise.sanctioned_by_cnil === false ? (
                                    <div className="mb-4">
                                        {/*<div className="text-sm text-gray-600 mb-1">{t(lang, 'cnilSanctions')}</div>*/}
                                        {/*<div className="text-gray-500 text-sm italic">{t(lang, 'noSanction')}</div>*/}
                                    </div>
                                ) : (
                                    <>
                                        {/* Fallback vers l'ancien affichage si pas de tableau sanctions */}
                                        {entreprise.sanction_details && 'fr' === lang && (
                                            <div className="mt-2 text-gray-900">
                                                <div className="text-sm text-gray-600 mb-1">{t(lang,'sanctionDetails')}</div>
                                                <ReactMarkdown>{entreprise.sanction_details.replaceAll('<br>', "\n").replaceAll("/n", " \n ").replaceAll("\n"," \n ")}</ReactMarkdown>
                                            </div>
                                        )}
                                        {entreprise.sanction_details_en && 'en' === lang && (
                                            <div className="mt-2 text-gray-900">
                                                <div className="text-sm text-gray-600 mb-1">{t(lang,'sanctionDetails')}</div>
                                                <ReactMarkdown>{entreprise.sanction_details_en.replaceAll('<br>', "  \n")}</ReactMarkdown>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className="flex items-center mt-2">
                                    <div className="text-sm text-gray-600 mb-1">{t(lang,'transferPolicy')}</div>
                                    <span className="ml-2">{getBooleanIcon(entreprise.data_transfer_policy,true,lang)}</span>
                                </div>
                                {entreprise.privacy_policy_quote && 'fr' === lang && (
                                    <div className="mt-2 text-gray-900">
                                        <div className="text-sm text-gray-600 mb-1">{t(lang,'policyExcerpt')}</div>
                                        <ReactMarkdown>{entreprise.privacy_policy_quote.replaceAll('<br>', "  \n")}</ReactMarkdown>
                                    </div>
                                )}
                                {entreprise.privacy_policy_quote_en && 'en' === lang && (
                                    <div className="mt-2 text-gray-900">
                                        <div className="text-sm text-gray-600 mb-1">{t(lang,'policyExcerpt')}</div>
                                        <ReactMarkdown>{entreprise.privacy_policy_quote_en.replaceAll('<br>', "  \n")}</ReactMarkdown>
                                    </div>
                                )}
                                {entreprise.transfer_destination_countries && 'fr' === lang && (
                                    <div className="mt-2">
                                        <div className="text-gray-600 mb-1">{t(lang,'transferCountries')}</div>
                                        <span>{entreprise.transfer_destination_countries}</span>
                                    </div>
                                )}
                                {entreprise.transfer_destination_countries_en && 'en' === lang && (
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-600 mb-1">{t(lang,'transferCountries')}</div>
                                        <span>{entreprise.transfer_destination_countries_en}</span>
                                    </div>
                                )}
                                {typeof entreprise.outside_eu_storage !== 'undefined' && 'fr' === lang && (
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-600 mb-1">{t(lang,'outsideEuStorage')}</div>
                                        <span>{typeof entreprise.outside_eu_storage === 'boolean' ? getBooleanIcon(entreprise.outside_eu_storage,true,lang) : entreprise.outside_eu_storage}</span>
                                    </div>
                                )}
                                {typeof entreprise.outside_eu_storage_en !== 'undefined' && 'en' === lang && (
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-600 mb-1">{t(lang,'outsideEuStorage')}</div>
                                        <span>{typeof entreprise.outside_eu_storage_en === 'boolean' ? getBooleanIcon(entreprise.outside_eu_storage_en,true,lang) : entreprise.outside_eu_storage_en}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* --- Data Breaches Section --- */}
                    {hasBreachData && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow mt-6">
                            <div className="bg-red-50 p-4 border-b border-red-100 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-red-600">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-800">{t(lang, 'dataBreaches')}</h2>
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {breaches.length}
                            </span>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                {sortedBreaches.map((breach, idx) => (
                                    <div key={idx} className="bg-gray-50 rounded-lg border border-gray-100 p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{breach.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {formatBreachDate(breach.breachDate, lang)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-bold text-red-600">{formatPwnCount(breach.pwnCount, lang)}</span>
                                                <p className="text-xs text-gray-500">{t(lang, 'accounts')}</p>
                                            </div>
                                        </div>

                                        {/* Types de données compromises */}
                                        <div className="mb-3">
                                            <p className="text-xs font-medium text-gray-600 mb-2">{t(lang, 'compromisedData')}:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {breach.dataClasses.map((dataClass, i) => (
                                                    <span
                                                        key={i}
                                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                            ['Passwords', 'Credit cards', 'Bank account numbers'].includes(dataClass)
                                                                ? 'bg-red-100 text-red-800'
                                                                : ['Email addresses', 'Phone numbers', 'Physical addresses'].includes(dataClass)
                                                                    ? 'bg-orange-100 text-orange-800'
                                                                    : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                    >
                                                {translateDataClass(dataClass, lang)}
                                            </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Indicateur de vérification */}
                                        {breach.isVerified && (
                                            <div className="flex items-center text-xs text-green-600">
                                                <Check className="h-3 w-3 mr-1" />
                                                <span>{t(lang, 'verifiedBreach')}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="pt-2 text-right border-t border-gray-100">
                                    <Link
                                        href="https://haveibeenpwned.com"
                                        target="_blank"
                                        className="text-xs text-gray-500 hover:text-red-600 hover:underline inline-flex items-center"
                                    >
                                        Source: Have I Been Pwned <ExternalLink className="h-3 w-3 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- Terms Changes Section --- */}
                    {hasTermsMemos && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow mt-6">
                            <div className="bg-amber-50 p-4 border-b border-amber-100 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-amber-600">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-800">{t(lang, 'termsChanges')}</h2>
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {termsMemos.length}
                            </span>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                <p className="text-sm text-gray-500 mb-4">{t(lang, 'termsChangesDesc')}</p>

                                {termsMemos.map((memo, idx) => {
                                    const memoDate = memo.dates?.[0] ? new Date(memo.dates[0]).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : '';
                                    const memoTitle = lang === 'fr' ? memo.title_fr : memo.title;
                                    const memoDesc = lang === 'fr' ? (memo.description_fr || memo.description) : memo.description;

                                    return (
                                        <div key={idx} className="bg-gray-50 rounded-lg border border-gray-100 p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-medium text-gray-900 text-sm leading-snug pr-4">{memoTitle}</h3>
                                                {memoDate && (
                                                    <span className="text-xs text-gray-500 whitespace-nowrap">{memoDate}</span>
                                                )}
                                            </div>

                                            {memoDesc && (
                                                <p className="text-sm text-gray-600 mb-3">{memoDesc}</p>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-wrap gap-1">
                                                    {memo.terms_types?.map((type, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800"
                                                        >
                                                    {type}
                                                </span>
                                                    ))}
                                                </div>
                                                <Link
                                                    href={memo.url}
                                                    target="_blank"
                                                    className="text-xs text-amber-600 hover:text-amber-800 hover:underline inline-flex items-center"
                                                >
                                                    {t(lang, 'readMore')} <ExternalLink className="h-3 w-3 ml-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="pt-2 text-right border-t border-gray-100">
                                    <Link
                                        href="https://opentermsarchive.org/en/memos/"
                                        target="_blank"
                                        className="text-xs text-gray-500 hover:text-amber-600 hover:underline inline-flex items-center"
                                    >
                                        Source: Open Terms Archive <ExternalLink className="h-3 w-3 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {(entreprise.exodus || entreprise.tosdr) && (
                    <div id="analysis-section">
                        <AppDataSection exodusPath={entreprise.exodus} tosdrPath={entreprise.tosdr} slug={slug} lang={lang} />
                    </div>
                )}
            </div>

            {/* --- Similar Services Section --- */}
            {similarServices.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t(lang, 'similarServices')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {similarServices.map((service, idx) => (
                            <Link href={`/liste-applications/${(service as any).slug}`} key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all flex items-center space-x-4">
                                <div className="relative w-12 h-12 flex-shrink-0">
                                    {service.logo ? (
                                        <Image src={service.logo} alt={service.name} fill className="object-contain rounded-md" unoptimized />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                            <Building className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                                    <p className="text-xs text-gray-500">{service.nationality || service.country_name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
