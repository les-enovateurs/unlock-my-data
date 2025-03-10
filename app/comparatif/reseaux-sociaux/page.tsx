'use client';
import { useEffect, useState } from 'react';

// ... existing interfaces from both files ...

export default function ReseauxPage() {
  // States for web services
  const [services, setServices] = useState<ServicesState>({});
  // States for app permissions
  const [permissions, setPermissions] = useState<PermissionsState>({});
  const [dangerousPermissionsList, setDangerousPermissionsList] = useState<Permission[]>([]);
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  // Common states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serviceIds = {
    facebook: 182,
    bluesky: 7763,
    instagram: 219,
    linkedin: 193,
    x: 195,
    tiktok: 1448
  };

  const apps = [
    {name: 'facebook', file: 'com.facebook.katana'},
    {name: 'tiktok', file: 'com.zhiliaoapp.musically'},
    {name: 'instagram', file: 'com.instagram.android'},
    {name: 'linkedin', file: 'com.linkedin.android'},
    {name: 'twitter', file: 'com.twitter.android'},
    {name: 'bluesky', file: 'xyz.blueskyweb.app'}
  ];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchWebServices(),
          fetchAppData()
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const fetchWebServices = async () => {
    try {
      const results: ServicesState = {};
      
      for (const [name, id] of Object.entries(serviceIds)) {
        try {
          // Try API first
          const response = await fetch(`https://api.tosdr.org/service/v3/?id=${id}&lang=fr`);
          if (!response.ok) {
            throw new Error(`API request failed for ${name}`);
          }
          const data = await response.json();
          
          const filteredData = {
            ...data,
            points: data.points.filter((point: ServicePoint) => 
              point.status === "approved" && 
              ['bad', 'neutral', 'good', 'blocker'].includes(point.case.classification)
            )
          };
          
          results[name] = filteredData;
        } catch (apiError) {
          // If API fails, try local JSON file
          try {
            const localResponse = await fetch(`/data/web/${name}.json`);
            if (!localResponse.ok) {
              throw new Error(`Failed to fetch local data for ${name}`);
            }
            const localData = await localResponse.json();
            
            const filteredData = {
              ...localData,
              points: localData.points.filter((point: ServicePoint) => 
                point.status === "approved" && 
                ['bad', 'neutral', 'good', 'blocker'].includes(point.case.classification)
              )
            };
            
            results[name] = filteredData;
          } catch (localError) {
            console.error(`Failed to fetch both API and local data for ${name}:`, localError);
          }
        }
      }
      
      setServices(results);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred while loading services data');
    }
  };

  const fetchAppData = async () => {
    try {
      // Load dangerous permissions
      const permissionsResponse = await fetch('/data/app/permissions_fr.json');
      const permissionsData = await permissionsResponse.json();
      
      // Filter dangerous permissions
      const dangerousPerms = Object.values(permissionsData[0].permissions)
        .filter((perm: Permission) => perm.protection_level.includes('dangerous'))
        .map((perm: Permission) => ({
          ...perm,
          description: perm.description || perm.name
        }));
      
      setDangerousPermissionsList(dangerousPerms);

      // Load trackers
      const trackersResponse = await fetch('/data/app/trackers.json');
      const trackersData = await trackersResponse.json();
      setTrackers(trackersData);

      // Load data for each application
      const results: PermissionsState = {};
      
      for (const app of apps) {
        try {
          const response = await fetch(`/data/app/${app.file}.json`);
          if (!response.ok) {
            console.warn(`Unable to load data for ${app.name}`);
            continue;
          }
          const data = await response.json();
          results[app.name] = data[0];
        } catch (error) {
          console.warn(`Error loading data for ${app.name}:`, error);
        }
      }
      
      setPermissions(results);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred while loading app data');
    }
  };

  if (isLoading) return <div>Chargement des données...</div>;
  if (error) return <div>Error: {error}</div>;

  // Calculate statistics and prepare data
  const goodCaseTitles = Array.from(new Set(
    Object.values(services)
      .flatMap(service => service.points)
      .filter(point => point.case.classification === 'good')
      .map(point => point.case.title)
  )).sort();

  const serviceStats = Object.entries(services).map(([name, service]) => ({
    name: service.name,
    bad: service.points.filter(point => point.case.classification === 'bad').length,
    neutral: service.points.filter(point => point.case.classification === 'neutral').length,
    good: service.points.filter(point => point.case.classification === 'good').length,
    blocker: service.points.filter(point => point.case.classification === 'blocker').length,
  }));

  return (
    <div className="container mx-auto p-4 wrapper_main">
      <h1 className="text-2xl text-color4 font-bold mb-4">Analyse des Réseaux Sociaux</h1>

      {/* Web Services Section */}
      <section>
        <h2 className="text-xl font-bold mt-8 mb-4 text-color4">Points Positifs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 mb-8">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-100 text-color4">Cases</th>
                {Object.values(services).map(service => (
                  <th key={service.name} className="border border-gray-300 p-2 bg-gray-100 text-color4">
                    {service.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {goodCaseTitles.map(caseTitle => {
                const point = Object.values(services)
                  .flatMap(service => service.points)
                  .find(point => point.case.title === caseTitle);
                
                const displayTitle = point?.case.localized_title || caseTitle;

                return (
                  <tr key={caseTitle}>
                    <td className="border border-gray-300 p-2 font-medium text-color4">
                      {displayTitle}
                    </td>
                    {Object.values(services).map(service => {
                      const hasCase = service.points.some(
                        point => point.case.title === caseTitle
                      );
                      return (
                        <td key={`${service.name}-${caseTitle}`} className="border border-gray-300 p-2 text-center text-color4">
                          {hasCase ? '✓' : ''}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4 text-color4">Statistiques par Service</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-100 text-color4">Service</th>
                <th className="border border-gray-300 p-2 bg-gray-100 text-color4">Mauvais</th>
                <th className="border border-gray-300 p-2 bg-gray-100 text-color4">Neutre</th>
                <th className="border border-gray-300 p-2 bg-gray-100 text-color4">Bon</th>
                <th className="border border-gray-300 p-2 bg-gray-100 text-color4">Bloquant</th>
              </tr>
            </thead>
            <tbody>
              {serviceStats.map(stat => (
                <tr key={stat.name}>
                  <td className="border border-gray-300 p-2 font-medium text-color4">{stat.name}</td>
                  <td className="border border-gray-300 p-2 text-center text-color4">{stat.bad}</td>
                  <td className="border border-gray-300 p-2 text-center text-color4">{stat.neutral}</td>
                  <td className="border border-gray-300 p-2 text-center text-color4">{stat.good}</td>
                  <td className="border border-gray-300 p-2 text-center text-color4">{stat.blocker}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* App Permissions Section */}
      <section>
        <h2 className="text-xl font-bold mt-8 mb-4 text-color4">Permissions Dangereuses</h2>
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
      </section>

      {/* Trackers Section */}
      <section>
        <h2 className="text-xl font-bold mt-8 mb-4 text-color4">Trackers</h2>
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
      </section>
    </div>
  );
} 