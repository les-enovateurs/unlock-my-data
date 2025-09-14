import slugs from '../../public/data/manual/slugs.json';
import {notFound} from 'next/navigation'
import {
    Building, FileText, ShieldAlert, Download, ExternalLink, Check, X, AlertCircle, Smartphone
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {Metadata} from 'next';
import ReactMarkdown from 'react-markdown';
import AppDataSection from "@/components/AppDataSection";

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
    data_access_via_postal?: boolean;
    data_access_via_form?: boolean;
    data_access_type?: string;
    data_access_via_email?: boolean;
    response_format?: string;
    example_data_export?: Array<{
        url: string;
        type: string;
        description: string;
        date: string;
    }>;
    example_form_export?: Array<{
        url: string;
        type: string;
        description: string;
        date: string;
    }>;
    message_exchange?: Array<{
        url: string;
        type: string;
        description: string;
        date: string;
    }>;
    url_export?: string;
    address_export?: string;
    response_delay?: string;
    sanctioned_by_cnil?: boolean;
    sanction_details?: string;
    data_transfer_policy?: boolean;
    privacy_policy_quote?: string;
    transfer_destination_countries?: string;
    outside_eu_storage?: string | boolean;
    comments?: string;
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

function getBooleanIcon(value?: boolean, displayText: boolean = true) {
    if (value === true) {
        return (
            <div className={"flex items-center"}>
                <Check className="h-5 w-5 text-green-600"/>{displayText && <span className=" text-gray-700">Oui</span>}
            </div>
        );
    }
    if (value === false) {
        return (
            <div className={"flex items-center"}>
                <X className="h-5 w-5 text-red-600"/>
                {displayText && <span className="ml-2 text-gray-700">Non</span>}
            </div>
        );
    }
    return null;
}

async function getEntrepriseData(slug: string): Promise<EntrepriseData | null> {
    try {
        const data: EntrepriseData = (await import(`../../public/data/manual/${slug}.json`)).default
        return data
    } catch {
        return null;
    }
}

export async function generateStaticParams() {
    return slugs
}


export async function generateMetadata({params}: { params: { slug: string } }): Promise<Metadata> {
    const entreprise = await getEntrepriseData(params.slug);
    return {
        title: entreprise ? `${entreprise.name} - Détails entreprise` : 'Entreprise non trouvée',
        description: entreprise?.name ? `Détails sur ${entreprise.name}` : undefined
    };
}


export default async function Manual({slug}: { slug: string }) {
    const entreprise = await getEntrepriseData(slug);

    if (!entreprise) {
        notFound();
    }

    if (!entreprise) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8 bg-red-50 rounded-lg shadow-md">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4"/>
                    <h1 className="text-2xl text-red-600 mb-2">Entreprise non trouvée</h1>
                    <p className="text-gray-700">
                        L&apos;entreprise &quot;{slug}&quot; n&apos;existe pas dans notre base de données.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Logo and name */}
            {entreprise.logo && (
                <div className="bg-white rounded-xl shadow-lg p-5 py-8 mb-6 w-1/2 mx-auto">
                    <div className="relative w-full h-20">
                        <Image
                            src={entreprise.logo}
                            alt={`Logo ${entreprise.name}`}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* --- Company Info --- */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
                            <Building className="h-6 w-6"/>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">{entreprise.name}</h1>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {entreprise.nationality && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Nationalité</div>
                                <div className="text-gray-900 font-medium">{entreprise.nationality}</div>
                            </div>
                        )}
                        {/*{entreprise.country_name && (*/}
                        {/*  <div className="p-4">*/}
                        {/*    <div className="text-sm text-gray-600 mb-1">Pays</div>*/}
                        {/*    <div className="text-gray-900 font-medium">{entreprise.country_name} {entreprise.country_code ? <span className="text-xs text-gray-400 ml-2">({entreprise.country_code})</span> : null}</div>*/}
                        {/*  </div>*/}
                        {/*)}*/}
                        {/*{typeof entreprise.belongs_to_group === "boolean" && (*/}
                        {/*  <div className="p-4">*/}
                        {/*    <div className="text-sm text-gray-600 mb-1">Appartient à un groupe</div>*/}
                        {/*    <div className="flex items-center">*/}
                        {/*      {getBooleanIcon(entreprise.belongs_to_group)}*/}
                        {/*    </div>*/}
                        {/*  </div>*/}
                        {/*)}*/}
                        {entreprise.group_name && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Appartient au groupe</div>
                                <div className="text-gray-900 font-medium">{entreprise.group_name}</div>
                            </div>
                        )}

                        {(entreprise.created_at || entreprise.updated_at) && (
                            <div className="p-4 text-xs text-gray-400">
                                {entreprise.created_at && <>Créé
                                    le&nbsp;{entreprise.created_at} par {entreprise.created_by}<br/></>}
                                {entreprise.updated_at && <>Mis à jour
                                    le&nbsp;{entreprise.updated_at} par {entreprise.updated_by}</>}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Data Access Section --- */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
                            <FileText className="h-6 w-6"/>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Accès aux données</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {entreprise.need_id_card && <div className="p-4">
                            <div className="font-medium text-gray-700">Nécessite une pièce d'identité</div>
                            <div>{getBooleanIcon(entreprise.need_id_card)}</div>
                        </div>}
                        {entreprise.details_required_documents && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">Détails des documents requis</div>
                                <div>{entreprise.details_required_documents}</div>
                            </div>
                        )}

                        {entreprise.url_export && <div className="p-4">
                            <div className="font-medium text-gray-700">Accès par formulaire</div>
                            <div
                                className={"flex flex-row items-center"}>
                                <Link href={entreprise.url_export} target={"_blank"}
                                      className={"underline hover:no-underline"} rel="noopener noreferrer"
                                >{entreprise.url_export} </Link>
                            </div>
                        </div>}
                        {entreprise.data_access_via_email && <div className="p-4">
                            <div className="font-medium text-gray-700">Accès par email</div>
                            <div
                                className={"flex flex-row items-center text-primary-600"}>
                                <Link
                                    href={"mailto:"+entreprise.contact_mail_export+"?subject=Demande%20d%E2%80%99acc%C3%A8s%20%C3%A0%20mes%20donn%C3%A9es%20personnelles&body=Madame%2C%20Monsieur%2C%0A%0AJe%20vous%20prie%20de%20bien%20vouloir%20m%E2%80%99indiquer%20si%20des%20donn%C3%A9es%20me%20concernant%20figurent%20dans%20vos%20fichiers%20informatis%C3%A9s%20ou%20manuels.%0A%0ADans%20l%E2%80%99affirmative%2C%20je%20souhaiterais%20obtenir%20une%20copie%2C%20en%20langage%20clair%2C%20de%20l%E2%80%99ensemble%20de%20ces%20donn%C3%A9es%20%28y%20compris%20celles%20figurant%20dans%20les%20zones%20%C2%AB%20blocs-notes%20%C2%BB%20ou%20%C2%AB%20commentaires%20%C2%BB%29%2C%20en%20application%20de%20l%E2%80%99article%2015%20du%20R%C3%A8glement%20g%C3%A9n%C3%A9ral%20sur%20la%20protection%20des%20donn%C3%A9es%20%28RGPD%29.%0A%0AJe%20vous%20remercie%20de%20me%20faire%20parvenir%20votre%20r%C3%A9ponse%20dans%20les%20meilleurs%20d%C3%A9lais%20et%20au%20plus%20tard%20dans%20un%20d%C3%A9lai%20d%E2%80%99un%20mois%20%C3%A0%20compter%20de%20la%20r%C3%A9ception%20de%20ma%20demande%20%28article%2012.3%20du%20RGPD%29.%0A%0A%C3%80%20d%C3%A9faut%20de%20r%C3%A9ponse%20de%20votre%20part%20dans%20les%20d%C3%A9lais%20impartis%20ou%20en%20cas%20de%20r%C3%A9ponse%20incompl%C3%A8te%2C%20je%20me%20r%C3%A9serve%20la%20possibilit%C3%A9%20de%20saisir%20la%20Commission%20nationale%20de%20l%E2%80%99informatique%20et%20des%20libert%C3%A9s%20%28CNIL%29%20d%E2%80%99une%20r%C3%A9clamation.%0A%0A%C3%80%20toutes%20fins%20utiles%2C%20vous%20trouverez%20des%20informations%20sur%20le%20site%20internet%20de%20la%20CNIL%20%3A%20https%3A%2F%2Fwww.cnil.fr%2Ffr%2Fprofessionnels-comment-repondre-une-demande-de-droit-dacces.%0A%0AJe%20vous%20prie%20d%E2%80%99agr%C3%A9er%2C%20Madame%2C%20Monsieur%2C%20l%E2%80%99expression%20de%20mes%20salutations%20distingu%C3%A9es."}>{entreprise.contact_mail_export} </Link>

                            </div>
                        </div>}
                        {entreprise.data_access_via_postal && <div className="p-4">
                            <div className="font-medium text-gray-700">Accès par courrier</div>
                            <div
                                className={"flex flex-row items-center"}>
                                <address>{entreprise.address_export} </address>
                            </div>
                        </div>}
                        {entreprise.data_access_type && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">Autre type d'accès</div>
                                <div>{entreprise.data_access_type}</div>
                            </div>
                        )}
                        {entreprise.example_form_export && entreprise.example_form_export.length > 0 && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700 mb-2">Exemples de formulaires d'export</div>
                                <div className="space-y-2">
                                    {entreprise.example_form_export.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-2 rounded">
                                            <Link
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                <FileText className="h-4 w-4 mr-1"/>
                                                {item.description} ({item.type})
                                                <ExternalLink className="ml-1 h-3 w-3"/>
                                            </Link>
                                            <div className="text-xs text-gray-500 mt-1">Date: {item.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {entreprise.message_exchange && entreprise.message_exchange.length > 0 && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700 mb-2">Échanges de messages</div>
                                <div className="space-y-2">
                                    {entreprise.message_exchange.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-2 rounded">
                                            <Link
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                <FileText className="h-4 w-4 mr-1"/>
                                                {item.description} ({item.type})
                                                <ExternalLink className="ml-1 h-3 w-3"/>
                                            </Link>
                                            <div className="text-xs text-gray-500 mt-1">Date: {item.date}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {entreprise.response_delay && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">Délai de réponse</div>
                                <div>{entreprise.response_delay}</div>
                            </div>
                        )}


                        {entreprise.comments && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Commentaires</div>
                                <div className="text-gray-900">{entreprise.comments}</div>
                            </div>
                        )}

                    </div>
                </div>

            </div>

            {/* --- Export data Section --- */}
            {entreprise.example_data_export && entreprise.example_data_export.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
                    <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
                        <FileText className="h-6 w-6"/>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Export des données</h2>
                </div>
                <div className="divide-y divide-gray-100">
                        <div className="p-4">
                            <div className="font-medium text-gray-700 mb-2">Exemples d'export de données</div>
                            <div className="space-y-2">
                                {entreprise.example_data_export.map((item, index) => (
                                    <div key={index} className="bg-gray-50 p-2 rounded">
                                        <Link
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            <Download className="h-4 w-4 mr-1"/>
                                            {item.description} ({item.type})
                                            <ExternalLink className="ml-1 h-3 w-3"/>
                                        </Link>
                                        <div className="text-xs text-gray-500 mt-1">Date: {item.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {entreprise.response_format && (
                            <div className="p-4">
                                <div className="font-medium text-gray-700">Format de la réponse</div>
                                <div>{entreprise.response_format}</div>
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
                            <ShieldAlert className="h-6 w-6"/>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Sanctions et politique de transfert</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="p-4">

                            {entreprise.sanction_details && (
                                <div className="mt-2 text-gray-900">
                                    <div className="text-sm text-gray-600 mb-1">Détails sanction</div>
                                    <ReactMarkdown>{entreprise.sanction_details}</ReactMarkdown>
                                </div>
                            )}
                            <div className="flex items-center  mt-2">
                                <div className="text-sm text-gray-600 mb-1">Politique de transfert de données</div>
                                <span>{getBooleanIcon(entreprise.data_transfer_policy)}</span>
                            </div>
                            {entreprise.privacy_policy_quote && (
                                <div className="mt-2 text-gray-900">
                                    <div className="text-sm text-gray-600 mb-1">Extrait de politique</div>
                                    <ReactMarkdown>{entreprise.privacy_policy_quote}</ReactMarkdown>
                                </div>
                            )}
                            {entreprise.transfer_destination_countries && (
                                <div className="mt-2">
                                    <div className="text-sm text-gray-600 mb-1">Pays de transfert</div>
                                    <span>{entreprise.transfer_destination_countries}</span>
                                </div>
                            )}
                            {entreprise.outside_eu_storage && (
                                <div className="mt-2">
                                    <div className="text-sm text-gray-600 mb-1">Stockage hors UE</div>
                                    <span>{entreprise.outside_eu_storage}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* --- Application Section --- */}
                {/*<div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">*/}
                {/*  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">*/}
                {/*    <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">*/}
                {/*      <Globe className="h-6 w-6" />*/}
                {/*    </div>*/}
                {/*    <h2 className="text-xl font-semibold text-gray-800">Application</h2>*/}
                {/*  </div>*/}
                {/*  <div className="divide-y divide-gray-100">*/}
                {/*    {entreprise.app?.link && (*/}
                {/*        <div className="p-4">*/}
                {/*          <Link*/}
                {/*              href={entreprise.app.link}*/}
                {/*              prefetch={false}*/}
                {/*              target="_blank"*/}
                {/*              rel="noopener noreferrer"*/}
                {/*              className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"*/}
                {/*          >*/}
                {/*            <Smartphone className="h-4 w-4 mr-1" />{entreprise.app.name} - Google Play*/}
                {/*            <ExternalLink className="ml-1 h-3 w-3" />*/}
                {/*          </Link>*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*  </div>*/}
                {/*</div>*/}
                {(entreprise.exodus || entreprise.tosdr) && (
                    <AppDataSection
                        exodusPath={entreprise.exodus}
                        tosdrPath={entreprise.tosdr}
                    />
                )}
            </div>
        </div>
    );
}