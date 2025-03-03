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
}

interface PermissionsState {
  [key: string]: AppPermissions;
}

interface Tracker {
  id: number;
  name: string;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<PermissionsState>({});
  const [dangerousPermissionsList, setDangerousPermissionsList] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackers, setTrackers] = useState<Tracker[]>([]);

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
        
        // Filtrer les permissions dangereuses
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
              console.warn(`Impossible de charger les données pour ${app}`);
              continue;
            }
            const data = await response.json();
            results[app.name] = data[0];
          } catch (error) {
            console.warn(`Erreur lors du chargement des données pour ${app}:`, error);
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

  if (isLoading) return <div>Chargement des permissions...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Permissions Dangereuses des Réseaux Sociaux</h1>
      
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
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
            {dangerousPermissionsList
              .filter(permission => 
                // Ne garder que les permissions utilisées par au moins une application
                apps.some(app => permissions[app.name]?.permissions.includes(permission.name))
              )
              .map(permission => (
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

      <h2 className="text-xl font-bold mb-4">Trackers des Réseaux Sociaux</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
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
            {trackers
              .filter(tracker => 
                // Ne garder que les trackers utilisés par au moins une application
                apps.some(app => permissions[app.name]?.trackers?.includes(tracker.id))
              )
              .map(tracker => (
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
  );
}