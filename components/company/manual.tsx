import slugs from '../../public/data/manual/slugs.json';
import {notFound} from 'next/navigation'
import {
    Building, FileText, ShieldAlert, Download, ExternalLink, Check, X, AlertCircle
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
        companyDetailsDescription: 'Détails sur {slug}'
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
        companyDetailsDescription: 'Details about {slug}'
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
};

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

    if (!entreprise) {
        notFound();
    }

    const mailTo = entreprise?.contact_mail_export && entreprise?.data_access_via_email
        ? `mailto:${entreprise.contact_mail_export}?subject=${encodeURIComponent(t(lang,'emailSubject'))}&body=${translations[lang]?.emailBody || translations['fr'].emailBody}`
        : undefined;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Logo and name */}
            {entreprise.logo && (
                <div className="bg-white rounded-xl shadow-lg p-5 py-8 mb-6 w-1/2 mx-auto">
                    <div className="relative w-full h-20">
                        <Image src={entreprise.logo} alt={`Logo ${entreprise.name}`} fill className="object-contain" unoptimized />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* --- Company Info --- */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
                            <Building className="h-6 w-6" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">{entreprise.name}</h1>
                    </div>
                    <div className="divide-y divide-gray-100">
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
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
                            <FileText className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">{t(lang,'dataAccess')}</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
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
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow mt-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
                            <FileText className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">{t(lang,'dataExport')}</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
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
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-yellow-50 to-red-50 p-4 border-b flex items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-yellow-600">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">{t(lang,'sanctionsAndTransfer')}</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="p-4">
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
                {(entreprise.exodus || entreprise.tosdr) && (
                    <AppDataSection exodusPath={entreprise.exodus} tosdrPath={entreprise.tosdr} lang={lang} />
                )}
            </div>
        </div>
    );
}