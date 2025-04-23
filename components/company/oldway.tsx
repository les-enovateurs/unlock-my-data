// Import icons
import {
    Building, Globe, FileText, Clock, ShieldAlert,
    Server, ExternalLink, Check, X, AlertCircle, HelpCircle,
    Smartphone, ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { normalizeCompanyName } from './manual';

// Types for permissions data
type Permission = {
    permission_id: number;
    permission_title?: string;
    permission_description?: string;
    category_id?: number;
    category_icon?: string;
    category_title?: string;
    category_risk_level?: number;
};

type CompanyApp = {
    app_title: string;
    app_icon: string;
    app_last_update: string;
    list_permissions: Permission[];
};

type CompanyPermissionsData = {
    stakeholder_total_permissions_count: number;
    stakeholder_high_risk_permissions_count: number;
    stakeholder_name: string;
    apps: CompanyApp[];
};

// Updated type definition to match the services.json structure
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
    permissions_data?: CompanyPermissionsData;
    [key: string]: string | number | null | undefined | CompanyPermissionsData;
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

// Permission categories data
const permissionCategories: PermissionCategory[] = [
    { id: 1, title: "agenda", icon: "far fa-calendar-check", risk_level: 10 },
    { id: 2, title: "appareil photo", icon: "fal fa-camera", risk_level: 10 },
    { id: 3, title: "album", icon: "fal fa-images", risk_level: 10 },
    { id: 4, title: "contacts", icon: "fal fa-address-book", risk_level: 10 },
    { id: 5, title: "microphone", icon: "far fa-microphone", risk_level: 10 },
    { id: 6, title: "position", icon: "far fa-map-marker-alt", risk_level: 10 },
    { id: 7, title: "sms", icon: "fal fa-comment-alt-lines", risk_level: 10 },
    { id: 8, title: "stockage", icon: "far fa-folder", risk_level: 10 },
    { id: 9, title: "téléphone", icon: "far fa-phone", risk_level: 10 },
    { id: 10, title: "capteurs", icon: "fal fa-sensor", risk_level: 5 },
    { id: 11, title: "identité", icon: "fal fa-user", risk_level: 1 },
    { id: 12, title: "activité physique", icon: "fal fa-walking", risk_level: 5 },
    { id: 13, title: "ID de l'appareil et informations relatives aux appels", icon: "far fa-mobile-alt", risk_level: 1 },
    { id: 14, title: "autre", icon: "far fa-question-square", risk_level: 1 },
    { id: 15, title: "informations relatives à la connexion Wi-Fi", icon: "far fa-wifi", risk_level: 5 }
];

// Fonction utilitaire pour déterminer l'icône à afficher pour les valeurs booléennes
function getBooleanIcon(value: number | string | null | undefined) {
    if (value === 1 || value === "OUI") return <Check className="h-5 w-5 text-green-600" />;
    if (value === 0 || value === "NON") return <X className="h-5 w-5 text-red-600" />;
    return null;
}

function capitalizeFirstLetter(term:string) {
    return String(term).charAt(0).toUpperCase() + String(term).slice(1);
}

// Type prop for the component
type OldwayProps = {
    name: string;
    entreprise?: EntrepriseData;
};

export default function Oldway({ name, entreprise }: OldwayProps) {
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

    // Load permissions data from the parent component
    const permissionsData = entreprise.permissions_data;

    // Vérifier si l'entreprise a un lien d'exportation des données
    const hasExport = entreprise.url_export;
    
    // Group permissions by category if permissions data is available
    let permissionIdsByCategory: Record<number, number[]> = {};
    
    if (permissionsData?.apps) {
        // Create a map of unique permission IDs
        const uniquePermissionIds = new Set<number>();
        
        permissionsData.apps.forEach(app => {
            app.list_permissions.forEach(perm => {
                if (perm.category_id) {
                    // Initialize the array for this category if it doesn't exist
                    if (!permissionIdsByCategory[perm.category_id]) {
                        permissionIdsByCategory[perm.category_id] = [];
                    }
                    
                    // Add the permission ID to the category if not already there
                    if (!permissionIdsByCategory[perm.category_id].includes(perm.permission_id)) {
                        permissionIdsByCategory[perm.category_id].push(perm.permission_id);
                        uniquePermissionIds.add(perm.permission_id);
                    }
                }
            });
        });
    }

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
               {/* <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                </div> */}

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
            
            {/* Section Applications */}
            {permissionsData?.apps && permissionsData.apps.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Applications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {permissionsData.apps.map((app, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
                                    <div className="bg-white p-2 rounded-full shadow-sm mr-3 overflow-hidden">
                                        {app.app_icon ? (
                                            <Image 
                                                src={app.app_icon} 
                                                alt={app.app_title} 
                                                width={24} 
                                                height={24} 
                                                className="h-6 w-6 object-contain"
                                                unoptimized
                                            />
                                        ) : (
                                            <Smartphone className="h-6 w-6 text-blue-600" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">{app.app_title}</h3>
                                </div>
                                <div className="p-4 divide-y divide-gray-100">
                                    <div className="pb-3">
                                        <div className="text-sm text-gray-600 mb-1">Date de collecte d'information</div>
                                        <div className="text-gray-900 font-medium">{new Date(app.app_last_update).toLocaleDateString('fr-FR')}</div>
                                    </div>
                                    <div className="pt-3 pb-3">
                                        <div className="text-sm text-gray-600 mb-1">Nombre de permissions</div>
                                        <div className="text-gray-900 font-medium">{app.list_permissions.length}</div>
                                    </div>
                                    
                                    {/* Section permissions de l'application */}
                                    <div className="pt-3">
                                        <details className="group">
                                            <summary className="flex items-center justify-between cursor-pointer">
                                                <span className="text-sm font-medium text-gray-600">Voir les permissions</span>
                                                <span className="transition group-open:rotate-180">
                                                    <svg fill="none" height="24" width="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <path d="M6 9l6 6 6-6"></path>
                                                    </svg>
                                                </span>
                                            </summary>
                                            <div className="mt-3 space-y-2">
                                                {/* Regrouper les permissions par catégorie */}
                                                {(() => {
                                                    // Créer un objet qui regroupe les permissions par catégorie
                                                    const permissionsByCategory: Record<number, Permission[]> = {};
                                                    
                                                    app.list_permissions.forEach(permission => {
                                                        if (permission.category_id) {
                                                            if (!permissionsByCategory[permission.category_id]) {
                                                                permissionsByCategory[permission.category_id] = [];
                                                            }
                                                            permissionsByCategory[permission.category_id].push(permission);
                                                        }
                                                    });
                                                    
                                                    return Object.entries(permissionsByCategory).map(([categoryId, permissions]) => {
                                                        const categoryData = permissionCategories.find(cat => cat.id === parseInt(categoryId));
                                                        if (!categoryData) return null;
                                                        
                                                        return (
                                                            <div key={categoryId} className="border border-gray-200 rounded-lg p-3">
                                                                <div className="flex items-center mb-2">
                                                                    <div className={`p-1.5 rounded-full shadow-sm mr-2 ${categoryData.risk_level > 5 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                                        <i className={categoryData.icon} style={{ fontSize: '1rem' }}></i>
                                                                    </div>
                                                                    <h4 className="text-sm font-medium text-gray-800 capitalize">{categoryData.title}</h4>
                                                                    {categoryData.risk_level > 5 && (
                                                                        <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">Risque élevé</span>
                                                                    )}
                                                                </div>
                                                                
                                                                <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                                                                    {permissions.map(permission => (
                                                                        <li key={permission.permission_id} className="text-gray-700">
                                                                            <span className="text-sm font-medium">{capitalizeFirstLetter(permission.permission_title)}</span>
                                                                            {permission.permission_description && (
                                                                                <p className="text-xs text-gray-500 mt-1 pl-5">{permission.permission_description}</p>
                                                                            )}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

             {/* Section Permissions */}
             {permissionsData && Object.keys(permissionIdsByCategory).length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Permissions utilisées</h2>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6">
                        {/* Statistiques toujours visibles */}
                        <div className="mb-4">
                            <div className="flex items-center mb-2">
                                <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="font-medium">Total des permissions : {permissionsData.stakeholder_total_permissions_count}</span>
                            </div>
                            {permissionsData.stakeholder_high_risk_permissions_count > 0 && (
                                <div className="flex items-center">
                                    <ShieldAlert className="h-5 w-5 text-red-600 mr-2" />
                                    <span className="font-medium">Permissions à haut risque : {permissionsData.stakeholder_high_risk_permissions_count}</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Système d'accordéon pour la liste des permissions */}
                        <details className="group">
                            <summary className="flex items-center justify-between cursor-pointer py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                <span className="font-medium text-gray-700">Afficher toutes les permissions</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" width="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                </span>
                            </summary>
                            
                            <div className="space-y-6 mt-4 pt-4 border-t border-gray-100">
                                {Object.keys(permissionIdsByCategory).map(categoryId => {
                                    const categoryData = permissionCategories.find(cat => cat.id === parseInt(categoryId));
                                    if (!categoryData) return null;
                                    
                                    // Get all permissions in this category from the apps
                                    const permissionsInCategory = permissionsData.apps.flatMap(app => 
                                        app.list_permissions.filter(perm => 
                                            perm.category_id === parseInt(categoryId)
                                        )
                                    );
                                    
                                    // Get unique permissions by ID
                                    const uniquePermissions = Array.from(
                                        new Map(permissionsInCategory.map(perm => 
                                            [perm.permission_id, perm]
                                        )).values()
                                    );
                                    
                                    return (
                                        <div key={categoryId} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center mb-3">
                                                <div className={`p-2 rounded-full shadow-sm mr-3 ${categoryData.risk_level > 5 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    <i className={categoryData.icon} style={{ fontSize: '1.25rem' }}></i>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-800 capitalize">{categoryData.title}</h3>
                                                {categoryData.risk_level > 5 && (
                                                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Risque élevé</span>
                                                )}
                                            </div>
                                            
                                            <ul className="list-disc list-inside space-y-1 pl-2">
                                                {uniquePermissions.map(permission => (
                                                    <li key={permission.permission_id} className="text-gray-700">
                                                        <span className="text-sm font-medium">{capitalizeFirstLetter(permission.permission_title)}</span>
                                                        <span className="text-gray-500 text-sm block ml-5">{permission.permission_description}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </details>
                    </div>
                </div>
            )}
        </div>
    );
}