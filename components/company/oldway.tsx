// Import icons
import {
    Building, Globe, FileText, Clock, ShieldAlert,
    Server, ExternalLink, Check, X, AlertCircle, HelpCircle,
    Smartphone
} from 'lucide-react';
import Image from 'next/image';

import Link from 'next/link';
import { Metadata } from 'next';
import entreprises from "@/public/data/services.json";
import ReactMarkdown from 'react-markdown';

export function normalizeCompanyName(name: string): string {
    // Normalisation plus stricte
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") // Enlève tous les caractères spéciaux
        .replace(/\s+/g, "");
}

// Updated type definition to match the new services.json structure
type EntrepriseData = {
    slug: string;
    name: string;
    logo: string;
    short_description?: string;
    risk_level?: number;
    accessibility?: number;
    need_account?: number;
    need_id_card?: number;
    contact_mail_export?: string;
    contact_mail_delete?: string;
    recipient_address?: string | null;
    how_to_export?: string | null;
    url_delete?: string | null;
    url_export?: string | null;
    last_update_breach?: string | null;
    country_name?: string | null;
    country_code?: string | null;
    number_app?: number;
    number_breach?: number;
    number_permission?: number;
    number_website?: number;
    number_website_cookie?: number;
    [key: string]: string | number | null | undefined;
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
        title: entreprise ? `${entreprise.name} - Détails Entreprise` : 'Détails Entreprise',
        description: entreprise
            ? `Informations détaillées sur ${entreprise.name} et ses pratiques de gestion des données`
            : 'Informations détaillées sur l\'entreprise et ses pratiques de gestion des données',
    };
}

async function getEntrepriseData(name: string): Promise<EntrepriseData | null> {
    try {
        // Rechercher l'entreprise soit par slug normalisé, soit par name normalisé
        const normalizedSearchName = normalizeCompanyName(name);
        return (
            entreprises.find(
                (entreprise) =>
                    (entreprise.slug && normalizeCompanyName(entreprise.slug) === normalizedSearchName) ||
                    (entreprise.name && normalizeCompanyName(entreprise.name) === normalizedSearchName)
            ) || null
        );
    } catch (error) {
        console.error("Erreur lors de la lecture des données:", error);
        return null;
    }
}

// Fonction utilitaire pour déterminer l'icône à afficher pour les valeurs booléennes
function getBooleanIcon(value: number | string | null | undefined) {
    if (value === 1 || value === "OUI") return <Check className="h-5 w-5 text-green-600" />;
    if (value === 0 || value === "NON") return <X className="h-5 w-5 text-red-600" />;
    return null;
}

export default async function Oldway({name}:{name:string}) {
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
    const hasExport = entreprise.url_export;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* En-tête avec logo et nom */}
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

            {/* Boutons d'actions */}
            <div className="flex flex-wrap gap-2 mb-6">
                {hasExport && (
                    <Link
                        href={entreprise.url_export}
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
                        <h1 className="text-xl font-semibold text-gray-800">{entreprise.name}</h1>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {entreprise.country_name && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Nationalité</div>
                                <div className="text-gray-900 font-medium">{entreprise.country_name}</div>
                            </div>
                        )}

                        {entreprise.short_description && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Description</div>
                                <div className="text-gray-900 font-medium">{entreprise.short_description}</div>
                            </div>
                        )}

                        {entreprise.risk_level && entreprise.risk_level > 0 && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Niveau de risque</div>
                                <div className="text-gray-900 font-medium">{entreprise.risk_level}/5</div>
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
                        {entreprise.number_app && entreprise.number_app > 0 && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Nombre d'applications</div>
                                <div className="text-gray-900 font-medium">{entreprise.number_app}</div>
                            </div>
                        )}

                        {entreprise.number_permission && entreprise.number_permission > 0 && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Nombre de permissions</div>
                                <div className="text-gray-900 font-medium">{entreprise.number_permission}</div>
                            </div>
                        )}

                        {entreprise.number_website && entreprise.number_website > 0 && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Nombre de sites web</div>
                                <div className="text-gray-900 font-medium">{entreprise.number_website}</div>
                            </div>
                        )}

                        {entreprise.number_website_cookie && entreprise.number_website_cookie > 0 && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Nombre de cookies</div>
                                <div className="text-gray-900 font-medium">{entreprise.number_website_cookie}</div>
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
                        {entreprise.contact_mail_export && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Adresse mail demande d'export</div>
                                <div className="text-gray-900 font-medium">
                                    <a href={`mailto:${entreprise.contact_mail_export}`} className="text-blue-600 hover:underline">
                                        {entreprise.contact_mail_export}
                                    </a>
                                </div>
                            </div>
                        )}

                        {entreprise.contact_mail_delete && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Adresse mail demande de suppression</div>
                                <div className="text-gray-900 font-medium">
                                    <a href={`mailto:${entreprise.contact_mail_delete}`} className="text-blue-600 hover:underline">
                                        {entreprise.contact_mail_delete}
                                    </a>
                                </div>
                            </div>
                        )}

                        {entreprise.need_account !== undefined && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Compte nécessaire</div>
                                <div className="flex items-center">
                                    {getBooleanIcon(entreprise.need_account)}
                                    <div className="text-gray-900 font-medium ml-2">
                                        {entreprise.need_account === 1 ? "OUI" : "NON"}
                                    </div>
                                </div>
                            </div>
                        )}

                        {entreprise.need_id_card !== undefined && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Pièce d'identité nécessaire</div>
                                <div className="flex items-center">
                                    {getBooleanIcon(entreprise.need_id_card)}
                                    <div className="text-gray-900 font-medium ml-2">
                                        {entreprise.need_id_card === 1 ? "OUI" : "NON"}
                                    </div>
                                </div>
                            </div>
                        )}

                        {entreprise.accessibility !== undefined && entreprise.accessibility > 0 && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Facilité d'accès</div>
                                <div className="text-gray-900 font-medium">
                                    {entreprise.accessibility}/5
                                </div>
                            </div>
                        )}

                        {entreprise.how_to_export && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Comment exporter</div>
                                <div className="text-gray-900 font-medium">
                                    {entreprise.how_to_export}
                                </div>
                            </div>
                        )}

                        {entreprise.recipient_address && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Adresse postale</div>
                                <div className="text-gray-900 font-medium whitespace-pre-line">
                                    {entreprise.recipient_address}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section URLs */}
                {(entreprise.url_export || entreprise.url_delete) && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
                            <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
                                <Globe className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Liens utiles</h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {entreprise.url_export && (
                                <div className="p-4">
                                    <div className="text-sm text-gray-600 mb-1">URL d'exportation</div>
                                    <Link
                                        href={entreprise.url_export}
                                        prefetch={false}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                                    >
                                        Exporter mes données
                                        <ExternalLink className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            )}

                            {entreprise.url_delete && (
                                <div className="p-4">
                                    <div className="text-sm text-gray-600 mb-1">URL de suppression</div>
                                    <Link
                                        href={entreprise.url_delete}
                                        prefetch={false}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                                    >
                                        Supprimer mes données
                                        <ExternalLink className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Section Conformité et sanctions */}
                {entreprise.number_breach !== undefined && entreprise.number_breach > 0 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
                            <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Conformité et sanctions</h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">Nombre de violations</div>
                                <div className="text-gray-900 font-medium">
                                    {entreprise.number_breach}
                                </div>
                            </div>

                            {entreprise.last_update_breach && (
                                <div className="p-4">
                                    <div className="text-sm text-gray-600 mb-1">Dernière mise à jour</div>
                                    <div className="text-gray-900 font-medium">
                                        {entreprise.last_update_breach}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}