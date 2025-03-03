'use client';
import { useEffect, useState } from 'react';

interface Permission {
  name: string;
  description: string;
  label: string;
  protection_level: string;
}

interface AppPermissions {
  handle: string;
  app_name: string;
  permissions: string[];
  trackers: number[];
}

interface PermissionsState {
  [key: string]: AppPermissions;
}

interface Tracker {
  id: number;
  name: string;
}

export default function ComparisonPage() {
  const [permissions, setPermissions] = useState<PermissionsState>({});
  const [dangerousPermissionsList, setDangerousPermissionsList] = useState<Permission[]>([]);
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour la pagination et la recherche
  const [permissionPage, setPermissionPage] = useState(1);
  const [trackerPage, setTrackerPage] = useState(1);
  const [permissionSearch, setPermissionSearch] = useState('');
  const [trackerSearch, setTrackerSearch] = useState('');
  const itemsPerPage = 15;

  const apps = [
    {name:'facebook',file:'com.facebook.katana'},
    {name:'tiktok',file:'com.zhiliaoapp.musically'},
    {name:'instagram',file:'com.instagram.android'},
    {name:'linkedin',file:'com.linkedin.android'},
    {name:'twitter',file:'com.twitter.android'},
    {name:'bluesky',file:'xyz.blueskyweb.app'}
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les permissions dangereuses
        const permissionsResponse = await fetch('/data/app/permissions_fr.json');
        const permissionsData = await permissionsResponse.json();
        
        const dangerousPerms = Object.values(permissionsData[0].permissions)
          .filter((perm: Permission) => perm.protection_level.includes('dangerous'))
          .map((perm: Permission) => ({
            ...perm,
            description: perm.description || perm.name
          }));
        
        setDangerousPermissionsList(dangerousPerms);

        // Charger les trackers
        const trackersResponse = await fetch('/data/app/trackers.json');
        const trackersData = await trackersResponse.json();
        setTrackers(trackersData);

        // Charger les données de chaque application
        const results: PermissionsState = {};
        
        for (const app of apps) {
          try {
            const response = await fetch(`/data/app/${app.file}.json`);
            if (!response.ok) {
              console.warn(`Impossible de charger les données pour ${app.name}`);
              continue;
            }
            const data = await response.json();
            results[app.name] = data[0];
          } catch (error) {
            console.warn(`Erreur lors du chargement des données pour ${app.name}:`, error);
          }
        }
        
        setPermissions(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrage et pagination des permissions
  const filteredPermissions = dangerousPermissionsList
    .filter(permission => 
      permission.label.toLowerCase().includes(permissionSearch.toLowerCase()) &&
      apps.some(app => permissions[app.name]?.permissions.includes(permission.name))
    );

  const paginatedPermissions = filteredPermissions.slice(
    (permissionPage - 1) * itemsPerPage,
    permissionPage * itemsPerPage
  );

  const totalPermissionPages = Math.ceil(filteredPermissions.length / itemsPerPage);

  // Filtrage et pagination des trackers
  const filteredTrackers = trackers
    .filter(tracker => 
      tracker.name.toLowerCase().includes(trackerSearch.toLowerCase()) &&
      apps.some(app => permissions[app.name]?.trackers?.includes(tracker.id))
    );

  const paginatedTrackers = filteredTrackers.slice(
    (trackerPage - 1) * itemsPerPage,
    trackerPage * itemsPerPage
  );

  const totalTrackerPages = Math.ceil(filteredTrackers.length / itemsPerPage);

  if (isLoading) return <div>Chargement des données...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Section Permissions */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Permissions Dangereuses des Réseaux Sociaux</h1>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher une permission..."
            value={permissionSearch}
            onChange={(e) => setPermissionSearch(e.target.value)}
            className="p-2 border rounded w-full max-w-md"
          />
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-100">Permission</th>
                  {apps.map(app => (
                    <th key={app.name} className="border border-gray-300 p-2 bg-gray-100">
                      {permissions[app.name]?.app_name || app.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedPermissions.map(permission => (
                  <tr key={permission.name}>
                    <td className="border border-gray-300 p-2" title={permission.description}>
                      {permission.label || permission.name}
                    </td>
                    {apps.map(app => (
                      <td key={`${app.name}-${permission.name}`} className="border border-gray-300 p-2 text-center">
                        {permissions[app.name]?.permissions.includes(permission.name) ? '✓' : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <button 
            onClick={() => setPermissionPage(p => Math.max(1, p - 1))}
            disabled={permissionPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="px-4 py-2">
            Page {permissionPage} sur {totalPermissionPages}
          </span>
          <button 
            onClick={() => setPermissionPage(p => Math.min(totalPermissionPages, p + 1))}
            disabled={permissionPage === totalPermissionPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </section>

      {/* Section Trackers */}
      <section>
        <h2 className="text-xl font-bold mb-4">Trackers des Réseaux Sociaux</h2>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un tracker..."
            value={trackerSearch}
            onChange={(e) => setTrackerSearch(e.target.value)}
            className="p-2 border rounded w-full max-w-md"
          />
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-100">Tracker</th>
                  {apps.map(app => (
                    <th key={app.name} className="border border-gray-300 p-2 bg-gray-100">
                      {permissions[app.name]?.app_name || app.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedTrackers.map(tracker => (
                  <tr key={tracker.id}>
                    <td className="border border-gray-300 p-2">
                      {tracker.name}
                    </td>
                    {apps.map(app => (
                      <td key={`${app.name}-${tracker.id}`} className="border border-gray-300 p-2 text-center">
                        {permissions[app.name]?.trackers?.includes(tracker.id) ? '✓' : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          <button 
            onClick={() => setTrackerPage(p => Math.max(1, p - 1))}
            disabled={trackerPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="px-4 py-2">
            Page {trackerPage} sur {totalTrackerPages}
          </span>
          <button 
            onClick={() => setTrackerPage(p => Math.min(totalTrackerPages, p + 1))}
            disabled={trackerPage === totalTrackerPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </section>
    </div>
  );
}