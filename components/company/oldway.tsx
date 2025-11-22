// Import icons
import {
    Building, Globe, FileText, ShieldAlert,
    ExternalLink, Check, X, AlertCircle,
    Smartphone, ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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


// Permission categories data
const permissionCategories = [
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

// Translation dictionary for oldway component
const oldwayTranslations: Record<string, Record<string,string>> = {
  fr: {
    companyNotFoundTitle: 'Entreprise non trouvée',
    companyNotFoundMessage: 'L\'entreprise "{slug}" n\'existe pas dans notre base de données.',
    viewDataExport: "Voir l'export des données",
    deleteMyData: 'Supprimer mes données',
    complianceAndSanctions: 'Conformité et sanctions',
    numberBreaches: 'Nombre de violations',
    lastUpdate: 'Dernière mise à jour',
    applications: 'Applications',
    infoCollectionDate: "Date de collecte d'information",
    numberPermissions: 'Nombre de permissions',
    viewPermissions: 'Voir les permissions',
    highRisk: 'Risque élevé',
    globallyUsedPermissions: 'Permissions utilisées globalement',
    totalPermissions: 'Total des permissions',
    highRiskPermissions: 'Permissions à haut risque',
    showAllPermissions: 'Afficher toutes les permissions',
    nationality: 'Nationalité',
    description: 'Description',
    riskLevel: 'Niveau de risque',
    accountRequired: 'Compte nécessaire',
    idRequired: "Pièce d'identité nécessaire",
    accessEase: "Facilité d'accès",
    howToExport: 'Comment exporter',
    postalAddress: 'Adresse postale',
    exportUrl: "URL d'exportation",
    deleteUrl: 'URL de suppression',
    exportMyData: 'Exporter mes données',
    deleteMyDataAction: 'Supprimer mes données'
  },
  en: {
    companyNotFoundTitle: 'Company not found',
    companyNotFoundMessage: 'The company "{slug}" does not exist in our database.',
    viewDataExport: 'View data export',
    deleteMyData: 'Delete my data',
    complianceAndSanctions: 'Compliance and sanctions',
    numberBreaches: 'Number of breaches',
    lastUpdate: 'Last update',
    applications: 'Applications',
    infoCollectionDate: 'Information collection date',
    numberPermissions: 'Number of permissions',
    viewPermissions: 'View permissions',
    highRisk: 'High risk',
    globallyUsedPermissions: 'Permissions used globally',
    totalPermissions: 'Total permissions',
    highRiskPermissions: 'High-risk permissions',
    showAllPermissions: 'Show all permissions',
    nationality: 'Nationality',
    description: 'Description',
    riskLevel: 'Risk level',
    accountRequired: 'Account required',
    idRequired: 'ID document required',
    accessEase: 'Accessibility',
    howToExport: 'How to export',
    postalAddress: 'Postal address',
    exportUrl: 'Export URL',
    deleteUrl: 'Delete URL',
    exportMyData: 'Export my data',
    deleteMyDataAction: 'Delete my data'
  }
};
function ot(lang:string, key:string, slug?:string) { const v = oldwayTranslations[lang]?.[key] || oldwayTranslations['fr'][key] || key; return slug? v.replace('{slug}', slug): v }

// Type prop for the component
type OldwayProps = {
    slug: string;
    entreprise?: EntrepriseData;
    lang?: string;
};

export default function Oldway({ slug, entreprise, lang = 'fr' }: OldwayProps) {
    if (!entreprise) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8 bg-red-50 rounded-lg shadow-md">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h1 className="text-2xl text-red-600 mb-2">{ot(lang,'companyNotFoundTitle')}</h1>
                    <p className="text-gray-700">{ot(lang,'companyNotFoundMessage', slug)}</p>
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
            {/* Header with logo */}
            {entreprise.logo && (
                <div className="bg-white rounded-xl shadow-lg p-5 py-8 mb-6 w-1/2 mx-auto">
                    <div className="relative w-full h-20">
                        <Image src={entreprise.logo} alt={`Logo ${entreprise.name}`} fill className="object-contain" unoptimized />
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
                {hasExport && (
                    <Link href={entreprise.url_export || ''} prefetch={false} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <FileText className="mr-2 h-5 w-5" />
                        {ot(lang,'viewDataExport')}
                        <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company info section */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600"><Building className="h-6 w-6" /></div>
                        <h1 className="text-xl font-semibold text-gray-800">{entreprise.name}</h1>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {entreprise.country_name && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">{ot(lang,'nationality')}</div>
                                <div className="text-gray-900 font-medium">{entreprise.country_name}</div>
                            </div>
                        )}
                        {entreprise.short_description && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">{ot(lang,'description')}</div>
                                <div className="text-gray-900 font-medium">{entreprise.short_description}</div>
                            </div>
                        )}
                        {entreprise.risk_level && entreprise.risk_level > 0 && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">{ot(lang,'riskLevel')}</div>
                                <div className="text-gray-900 font-medium">{entreprise.risk_level}/5</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Data access section (labels translated) */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
                        <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600"><FileText className="h-6 w-6" /></div>
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
                                <div className="text-sm text-gray-600 mb-1">{ot(lang,'accountRequired')}</div>
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
                                <div className="text-sm text-gray-600 mb-1">{ot(lang,'idRequired')}</div>
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
                                <div className="text-sm text-gray-600 mb-1">{ot(lang,'accessEase')}</div>
                                <div className="text-gray-900 font-medium">
                                    {entreprise.accessibility}/5
                                </div>
                            </div>
                        )}

                        {entreprise.how_to_export && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">{ot(lang,'howToExport')}</div>
                                <div className="text-gray-900 font-medium">
                                    {entreprise.how_to_export}
                                </div>
                            </div>
                        )}

                        {entreprise.recipient_address && (
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">{ot(lang,'postalAddress')}</div>
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
                                    <div className="text-sm text-gray-600 mb-1">{ot(lang,'exportUrl')}</div>
                                    <Link
                                        href={entreprise.url_export}
                                        prefetch={false}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                                    >
                                        {ot(lang,'exportMyData')}
                                        <ExternalLink className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            )}

                            {entreprise.url_delete && (
                                <div className="p-4">
                                    <div className="text-sm text-gray-600 mb-1">{ot(lang,'deleteUrl')}</div>
                                    <Link
                                        href={entreprise.url_delete}
                                        prefetch={false}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                                    >
                                        {ot(lang,'deleteMyData')}
                                        <ExternalLink className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Compliance and sanctions */}
                {entreprise.number_breach !== undefined && entreprise.number_breach > 0 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow mt-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
                            <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">{ot(lang,'complianceAndSanctions')}</h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            <div className="p-4">
                                <div className="text-sm text-gray-600 mb-1">{ot(lang,'numberBreaches')}</div>
                                <div className="text-gray-900 font-medium">
                                    {entreprise.number_breach}
                                </div>
                            </div>

                            {entreprise.last_update_breach && (
                                <div className="p-4">
                                    <div className="text-sm text-gray-600 mb-1">{ot(lang,'lastUpdate')}</div>
                                    <div className="text-gray-900 font-medium">
                                        {entreprise.last_update_breach}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* Applications section title translated */}
            {permissionsData?.apps && permissionsData.apps.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{ot(lang,'applications')}</h2>
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
                                        <div className="text-sm text-gray-600 mb-1">{ot(lang,'infoCollectionDate')}</div>
                                        <div className="text-gray-900 font-medium">{new Date(app.app_last_update).toLocaleDateString('fr-FR')}</div>
                                    </div>
                                    <div className="pt-3 pb-3">
                                        <div className="text-sm text-gray-600 mb-1">{ot(lang,'numberPermissions')}</div>
                                        <div className="text-gray-900 font-medium">{app.list_permissions.length}</div>
                                    </div>
                                    
                                    {/* Section permissions de l'application */}
                                    <div className="pt-3">
                                        <details className="group">
                                            <summary className="flex items-center justify-between cursor-pointer">
                                                <span className="text-sm font-medium text-gray-600">{ot(lang,'viewPermissions')}</span>
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
                                                                        <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">{ot(lang,'highRisk')}</span>
                                                                    )}
                                                                </div>
                                                                
                                                                <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                                                                    {permissions.map(permission => (
                                                                        <li key={permission.permission_id} className="text-gray-700">
                                                                            <span className="text-sm font-medium">{capitalizeFirstLetter(permission.permission_title ?? '')}</span>xs
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
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{ot(lang,'globallyUsedPermissions')}</h2>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6">
                        {/* Statistiques toujours visibles */}
                        <div className="mb-4">
                            <div className="flex items-center mb-2">
                                <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="font-medium">{ot(lang,'totalPermissions')} : {permissionsData.stakeholder_total_permissions_count}</span>
                            </div>
                            {permissionsData.stakeholder_high_risk_permissions_count > 0 && (
                                <div className="flex items-center">
                                    <ShieldAlert className="h-5 w-5 text-red-600 mr-2" />
                                    <span className="font-medium">{ot(lang,'highRiskPermissions')} : {permissionsData.stakeholder_high_risk_permissions_count}</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Système d'accordéon pour la liste des permissions */}
                        <details className="group">
                            <summary className="flex items-center justify-between cursor-pointer py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                <span className="font-medium text-gray-700">{ot(lang,'showAllPermissions')}</span>
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
                                                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">{ot(lang,'highRisk')}</span>
                                                )}
                                            </div>
                                            
                                            <ul className="list-disc list-inside space-y-1 pl-2">
                                                {uniquePermissions.map(permission => (
                                                    <li key={permission.permission_id} className="text-gray-700">
                                                        <span className="text-sm font-medium">{capitalizeFirstLetter(permission.permission_title ?? '')}</span>
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