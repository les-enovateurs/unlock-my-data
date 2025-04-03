// Import icons
import {
  Building, Globe, FileText, Clock, ShieldAlert,
  Server, ExternalLink, Check, X, AlertCircle, HelpCircle,
  Smartphone
} from 'lucide-react';
import Image from 'next/image';

import Link from 'next/link';
import { Metadata } from 'next';
import entreprises from "@/public/data/manual-entreprise.json";
import ReactMarkdown from 'react-markdown';

export function normalizeCompanyName(name: string): string {
  // Normalisation plus stricte
  return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") // Enlève tous les caractères spéciaux
      .replace(/\s+/g, "");
}


type EntrepriseData = {
  Nom: string;
  "Logo (lien)"?: string;
  app?: {
    name: string;
    link: string;
  };
  [key: string]: string | undefined | { name: string; link: string; }; // pour les autres propriétés dynamiques
};

// Custom component to handle links in markdown content
const CustomLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  const isExternal = href?.startsWith('http') || href?.startsWith('https');

  if (isExternal) {
    return (
        <Link
            href={href}
            target="_blank"
            prefetch={false}
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {children}
          <ExternalLink className="inline-block ml-1 h-3 w-3" />
        </Link>
    );
  }

  return href ? (
      <Link href={href} prefetch={false} className="text-blue-600 hover:text-blue-800 hover:underline">
        {children}
      </Link>
  ) : (
      <>{children}</>
  );
};


// Remplacer les métadonnées statiques par une fonction dynamique
export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  // Récupérer les données de l'entreprise
  const entreprise = await getEntrepriseData(params.name);

  // Retourner des métadonnées personnalisées ou par défaut
  return {
    title: entreprise ? `${entreprise.Nom} - Détails Entreprise` : 'Détails Entreprise',
    description: entreprise
        ? `Informations détaillées sur ${entreprise.Nom} et ses pratiques de gestion des données`
        : 'Informations détaillées sur l\'entreprise et ses pratiques de gestion des données',
  };
}

async function getEntrepriseData(name: string): Promise<EntrepriseData | null> {
  try {
       // Rechercher l'entreprise en ignorant la casse et les espaces
    const normalizedSearchName = normalizeCompanyName(name);
    return (
        entreprises.find(
            (entreprise) =>
                entreprise.Nom && normalizeCompanyName(entreprise.Nom) === normalizedSearchName
        ) || null
    );
  } catch (error) {
    console.error("Erreur lors de la lecture des données:", error);
    return null;
  }
}

// Fonction utilitaire pour déterminer l'icône à afficher pour les valeurs booléennes
function getBooleanIcon(value: string) {
  if (value === "OUI") return <Check className="h-5 w-5 text-green-600" />;
  if (value === "NON") return <X className="h-5 w-5 text-red-600" />;
  return null;
}

export default async function Manual({name}:{name:string}) {
  const entreprise = await getEntrepriseData(name);

  if (!entreprise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg shadow-md">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl text-red-600 mb-2">Entreprise non trouvée</h1>
          <p className="text-gray-700">
            L&apos;entreprise &quot;{name}&quot; n&apos;existe pas dans
            notre base de données.
          </p>
        </div>
      </div>
    );
  }

  // Vérifier si l'entreprise a un lien d'exportation des données
  const hasExport = entreprise["Export de la demande de droit"];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête avec logo et nom */}
      {entreprise["Logo (lien)"] && (
        <div className="bg-white rounded-xl shadow-lg p-5 py-8 mb-6 w-1/2 mx-auto">
          <div className="relative w-full h-20">
            <Image
              src={entreprise["Logo (lien)"]}
              alt={`Logo ${entreprise.Nom}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* Boutons d'actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        {hasExport && (
          <Link
            href={entreprise["Export de la demande de droit"]}
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="mr-2 h-5 w-5" />
            Voir l'export des données
            <ExternalLink className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Contenu organisé en sections personnalisées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Informations sur l'entreprise */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
            <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
              <Building className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">{entreprise.Nom}</h1>
          </div>

          <div className="divide-y divide-gray-100">
            {entreprise["Nationalité"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Nationalité</div>
                <div className="text-gray-900 font-medium">{entreprise["Nationalité"]}</div>
              </div>
            )}

            {entreprise["Appartient à un groupe"] && entreprise["Appartient à un groupe"] !== "NON" && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Appartient à un groupe</div>
                <div className="flex items-center">
                  {entreprise["Appartient à un groupe"] === "OUI" && <Check className="h-5 w-5 text-green-600 mr-2" />}
                  <div className="text-gray-900 font-medium">{entreprise["Appartient à un groupe"]}</div>
                </div>
              </div>
            )}

            {entreprise["Appartient à un groupe"] && entreprise["Appartient à un groupe"] !== "NON" && entreprise["Si oui à la question précédente quel groupe ?"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Groupe</div>
                <div className="text-gray-900 font-medium">
                  {entreprise["Si oui à la question précédente quel groupe ?"]}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Application */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
            <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
              <Globe className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Application</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {entreprise["Applications"] && (
              <div className="p-4">
                <div className="text-gray-900 font-medium">

                  {entreprise.app && entreprise.app.link && (
                    <Link prefetch={false}
                      href={entreprise.app.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <Smartphone className="h-4 w-4 mr-1" />
                      {entreprise.app.name} - Google Play
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {entreprise["Paramétrage ( ce qu'il est possible de refuser )"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Paramétrage</div>
                <div className="text-gray-900 font-medium">
                  {entreprise["Paramétrage ( ce qu'il est possible de refuser )"]}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Accès aux données */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
            <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Accès aux données</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {entreprise["Adresse mail demande de droit"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Adresse mail demande de droit</div>
                <div className="text-gray-900 font-medium">
                  <a href={`mailto:${entreprise["Adresse mail demande de droit"]}`} className="text-blue-600 hover:underline">
                    {entreprise["Adresse mail demande de droit"]}
                  </a>
                </div>
              </div>
            )}

            {entreprise["Documents demandés pour l'exercice des droits"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Documents demandés pour l'exercice des droits</div>
                <div className="flex items-center">
                  {getBooleanIcon(entreprise["Documents demandés pour l'exercice des droits"])}
                  <div className="text-gray-900 font-medium">
                    {entreprise["Documents demandés pour l'exercice des droits"]}
                  </div>
                </div>
              </div>
            )}

            {entreprise["Si oui à la question précédent lesquels"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Documents requis</div>
                <div className="text-gray-900 font-medium">
                  {entreprise["Si oui à la question précédent lesquels"]}
                </div>
              </div>
            )}

            {entreprise["Demande de droit d'accès via voie postale"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Demande de droit d'accès via voie postale</div>
                <div className="flex items-center">
                  {getBooleanIcon(entreprise["Demande de droit d'accès via voie postale"])}
                  <div className="text-gray-900 font-medium">
                    {entreprise["Demande de droit d'accès via voie postale"]}
                  </div>
                </div>
              </div>
            )}

            {entreprise["Demande de droit d'accès via formulaire"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Demande de droit d'accès via formulaire</div>
                <div className="flex items-center">
                  {getBooleanIcon(entreprise["Demande de droit d'accès via formulaire"])}
                  <div className="text-gray-900 font-medium">
                    {entreprise["Demande de droit d'accès via formulaire"]}
                  </div>
                </div>
              </div>
            )}

            {entreprise["Type de droit d'accès (bouton accès automatique en mode connecté formulaire de contact simple ..."] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Type de droit d'accès</div>
                <div className="text-gray-900 font-medium">
                  {entreprise["Type de droit d'accès (bouton accès automatique en mode connecté formulaire de contact simple ..."]}
                </div>
              </div>
            )}

            {entreprise["Demande de droit d'accès via mail"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Demande de droit d'accès via mail</div>
                <div className="flex items-center">
                  {getBooleanIcon(entreprise["Demande de droit d'accès via mail"])}
                  <div className="text-gray-900 font-medium">
                    {entreprise["Demande de droit d'accès via mail"]}
                  </div>
                </div>
              </div>
            )}

            {entreprise["Accessibilité des données"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Accessibilité des données</div>
                <div className="text-gray-900 font-medium">
                  {entreprise["Accessibilité des données"]}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Réponse aux demandes de droits */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
            <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
              <Clock className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Réponse aux demandes de droits</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {entreprise["Rendu de la réponse au demande de droit"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Rendu de la réponse</div>
                <div className="text-gray-900 font-medium">
                  {entreprise["Rendu de la réponse au demande de droit"]}
                </div>
              </div>
            )}

            {entreprise["Délai de réponse à la demande de droit"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Délai de réponse</div>
                <div className="text-gray-900 font-medium">
                  {entreprise["Délai de réponse à la demande de droit"]}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Conformité et sanctions */}
        {(entreprise["A déjà été sanctionnée par la CNIL ?"] || entreprise["Si oui à la question précédent motif de la sanction"]) && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
              <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Conformité et sanctions</h2>
            </div>

            <div className="divide-y divide-gray-100">
              {entreprise["A déjà été sanctionnée par la CNIL ?"] && (
                <div className="p-4">
                  <div className="text-sm text-gray-600 mb-1">A déjà été sanctionnée par la CNIL ?</div>
                  <div className="flex items-center">
                    {getBooleanIcon(entreprise["A déjà été sanctionnée par la CNIL ?"])}
                    <div className="text-gray-900 font-medium">
                      {entreprise["A déjà été sanctionnée par la CNIL ?"]}
                    </div>
                  </div>
                </div>
              )}

              {entreprise["Si oui à la question précédent motif de la sanction"] && (
                <div className="p-4">
                  <div className="text-sm text-gray-600 mb-1">Motif de la sanction</div>
                  <div className="prose prose-sm prose-blue max-w-none">
                    <ReactMarkdown
                      components={{
                        a: CustomLink
                      }}
                    >
                      {entreprise["Si oui à la question précédent motif de la sanction"]}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section Traitement des données */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
            <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
              <Server className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Traitement des données</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {entreprise["Transfert des données (d'après la politique du site)"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Transfert des données</div>
                <div className="text-gray-900 font-medium">
                  {entreprise["Transfert des données (d'après la politique du site)"]}
                </div>
              </div>
            )}

            {entreprise["citation politique du site"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Citation politique du site</div>
                <div className="text-gray-900 font-medium italic">
                  "{entreprise["citation politique du site"]}"
                </div>
              </div>
            )}

            {entreprise["Liste pays où les transferts ont lieu (si indiqué)"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Pays de transfert</div>
                <div className="text-gray-900 font-medium">
                  {entreprise["Liste pays où les transferts ont lieu (si indiqué)"]}
                </div>
              </div>
            )}

            {entreprise["Stockage hors UE(d'après la politique du site)"] && (
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Stockage hors UE</div>
                <div className="text-gray-900 font-medium">
                  {entreprise["Stockage hors UE(d'après la politique du site)"]}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Informations complémentaires */}
        {entreprise["Commentaires"] && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
              <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Informations complémentaires</h2>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">Commentaires</div>
                <div className="text-gray-900 font-medium">
                  {entreprise["Commentaires"]}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}