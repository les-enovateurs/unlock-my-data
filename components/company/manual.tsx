import slugs from '../../public/data/manual/slugs.json';
import { notFound } from 'next/navigation'
import {
  Building, Globe, FileText, ShieldAlert, Download, ExternalLink, Check, X, AlertCircle, Smartphone
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';

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
  form_display?: string;
  details_required_documents?: string;
  data_access_via_postal?: boolean;
  data_access_via_form?: boolean;
  data_access_type?: string;
  data_access_via_email?: boolean;
  response_format?: string;
  example_data_export?: string;
  response_delay?: string;
  sanctioned_by_cnil?: boolean;
  sanction_details?: string;
  data_transfer_policy?: boolean;
  privacy_policy_quote?: string;
  transfer_destination_countries?: string;
  outside_eu_storage?: boolean;
  comments?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  app?: {
    name: string;
    link: string;
  };
};

function getBooleanIcon(value?: boolean) {
  if (value === true) {
    return (
        <div className={"flex items-center"}>
          <Check className="h-5 w-5 text-green-600" /> <span className=" text-gray-700">Oui</span>
        </div>
    );
  }
  if (value === false) {
    return (
        <div className={"flex items-center"}>
        <X className="h-5 w-5 text-red-600" />
          <span className="ml-2 text-gray-700">Non</span>
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



export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const entreprise = await getEntrepriseData(params.slug);
  return {
    title: entreprise ? `${entreprise.name} - Détails entreprise` : 'Entreprise non trouvée',
    description: entreprise?.name ? `Détails sur ${entreprise.name}` : undefined
  };
}


export default async function Manual({ slug }: { slug: string }) {
  const entreprise = await getEntrepriseData(slug);

  if (!entreprise) {
    notFound();
  }

  if (!entreprise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg shadow-md">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
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
              <Building className="h-6 w-6" />
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
            {typeof entreprise.belongs_to_group === "boolean" && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Appartient à un groupe</div>
                <div className="flex items-center">
                  {getBooleanIcon(entreprise.belongs_to_group)}
                </div>
              </div>
            )}
            {entreprise.group_name && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Nom du Groupe</div>
                <div className="text-gray-900 font-medium">{entreprise.group_name}</div>
              </div>
            )}
            {entreprise.permissions && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Permissions requises</div>
                <div className="text-gray-900 font-medium">{entreprise.permissions}</div>
              </div>
            )}
            {entreprise.contact_mail_export && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Contact Export Données</div>
                <div className="text-gray-900 font-medium">{entreprise.contact_mail_export}</div>
              </div>
            )}
            {entreprise.comments && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Commentaires</div>
                <div className="text-gray-900">{entreprise.comments}</div>
              </div>
            )}
            {(entreprise.created_at || entreprise.updated_at) && (
              <div className="p-4 text-xs text-gray-400">
                {entreprise.created_at && <>Créé le&nbsp;{entreprise.created_at} par {entreprise.created_by}<br /></>}
                {entreprise.updated_at && <>Mis à jour le&nbsp;{entreprise.updated_at} par {entreprise.updated_by}</>}
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
            <h2 className="text-xl font-semibold text-gray-800">Accès et Export des données</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-4">
              <div className="font-medium text-gray-700">Accès par courrier :</div>
              <div>{getBooleanIcon(entreprise.data_access_via_postal)}</div>
            </div>
            <div className="p-4">
              <div className="font-medium text-gray-700">Accès par formulaire :</div>
              <div>{getBooleanIcon(entreprise.data_access_via_form)}</div>
            </div>
            <div className="p-4">
              <div className="font-medium text-gray-700">Accès par email :</div>
              <div>{getBooleanIcon(entreprise.data_access_via_email)}</div>
            </div>
            {entreprise.data_access_type && (
                <div className="p-4">
                  <div className="font-medium text-gray-700">Type d'accès :</div>
                  <div>{entreprise.data_access_type}</div>
                </div>
            )}
            <div className="p-4">
              <div className="font-medium text-gray-700">Nécessite une pièce d'identité :</div>
              <div>{getBooleanIcon(entreprise.need_id_card)}</div>
            </div>
            {entreprise.details_required_documents && (
                <div className="p-4">
                  <div className="font-medium text-gray-700">Détails des documents requis :</div>
                  <div>{entreprise.details_required_documents}</div>
                </div>
            )}
            {entreprise.form_display && (
                <div className="p-4">
                  <div className="font-medium text-gray-700">Aperçu du formulaire :</div>
                  <div className="relative w-full h-64 my-2 bg-gray-50 border rounded">
                    <Image
                        src={entreprise.form_display}
                        alt={`Formulaire ${entreprise.name}`}
                        fill
                        className="object-contain"
                        unoptimized
                    />
                  </div>
                </div>
            )}
            {entreprise.response_format && (
                <div className="p-4">
                  <div className="font-medium text-gray-700">Format de la réponse :</div>
                  <div>{entreprise.response_format}</div>
                </div>
            )}
            {entreprise.example_data_export && (
                <div className="p-4">
                  <div className="font-medium text-gray-700 mb-2">Exemple d'export de données :</div>
                  <Link
                      href={entreprise.example_data_export}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Voir l'exemple d'export
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </div>
            )}
            {entreprise.response_delay && (
                <div className="p-4">
                  <div className="font-medium text-gray-700">Délai de réponse :</div>
                  <div>{entreprise.response_delay}</div>
                </div>
            )}
          </div>
        </div>

        {/* --- CNIL Sanctions, Data Transfers --- */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-yellow-50 to-red-50 p-4 border-b flex items-center">
            <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-yellow-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Sanctions et politique de transfert</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-4">
              <div className="flex items-center">
                <span className={"text-sm text-gray-600"}>Sanctionné par la CNIL : </span>{getBooleanIcon(entreprise.sanctioned_by_cnil)}
              </div>
              {entreprise.sanction_details && (
                <div className="mt-2 text-gray-900">
                  <div className="text-sm text-gray-600 mb-1">Détails sanction :</div>
                  <ReactMarkdown>{entreprise.sanction_details}</ReactMarkdown>
                </div>
              )}
              <div className="flex items-center  mt-2">
                <div className="text-sm text-gray-600 mb-1">Politique de transfert de données :</div>
                <span>{getBooleanIcon(entreprise.data_transfer_policy)}</span>
              </div>
              {entreprise.privacy_policy_quote && (
                <div className="mt-2 text-gray-900">
                  <div className="text-sm text-gray-600 mb-1">Extrait de politique :</div>
                  <ReactMarkdown>{entreprise.privacy_policy_quote}</ReactMarkdown>
                </div>
              )}
              {entreprise.transfer_destination_countries && (
                <div className="mt-2">
                  <div className="text-sm text-gray-600 mb-1">Pays de transfert :</div>
                  <span>{entreprise.transfer_destination_countries}</span>
                </div>
              )}
              {entreprise.outside_eu_storage && (
                <div className="mt-2">
                  <div className="text-sm text-gray-600 mb-1">Stockage hors UE :</div>
                  <span>{getBooleanIcon(entreprise.outside_eu_storage)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* --- Application Section --- */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
            <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
              <Globe className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Application</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {entreprise.app?.link && (
                <div className="p-4">
                  <Link
                      href={entreprise.app.link}
                      prefetch={false}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <Smartphone className="h-4 w-4 mr-1" />{entreprise.app.name} - Google Play
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}