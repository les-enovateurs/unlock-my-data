'use client';
import { useEffect, useState } from 'react';

interface Case {
  id: string;
  url: string;
  title: string;
}

interface CasesData {
  cases: Case[];
}

type Classification = 'bad' | 'neutral' | 'good' | 'blocker';

interface ServicePoint {
  title: string;
  case: {
    title: string;
    localized_title: string;
    classification: Classification;
  };
  status: string;
}

interface ServiceData {
  id: number;
  name: string;
  rating: string;
  points: ServicePoint[];
}

interface ServicesState {
  [key: string]: ServiceData;
}

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

//id facebook:182
// bluesky :10572
//instagram :219
//linkedin:193
// x:195
//threads:219
//tiktok:1448

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [services, setServices] = useState<ServicesState>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serviceIds = {
    facebook: 182,
    bluesky: 7763,
    instagram: 219,
    linkedin: 193,
    x: 195,
    // threads: 219,
    tiktok: 1448
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const results: ServicesState = {};
        
        for (const [name, id] of Object.entries(serviceIds)) {
          try {
            // Essayer d'abord l'API
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
            // En cas d'échec de l'API, essayer le fichier JSON local
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
              // On pourrait choisir de continuer avec les autres services
              // au lieu de throw une erreur
            }
          }
        }
        
        setServices(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading services data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) return <div>Loading cases...</div>;
  if (error) return <div>Error: {error}</div>;

  // Récupérer tous les case titles uniques avec classification "good"
  const goodCaseTitles = Array.from(new Set(
    Object.values(services)
      .flatMap(service => service.points)
      .filter(point => point.case.classification === 'good')
      .map(point => point.case.title)
  )).sort();

  // Calculer les statistiques par service
  const serviceStats = Object.entries(services).map(([name, service]) => {
    const stats = {
      name: service.name,
      bad: service.points.filter(point => point.case.classification === 'bad').length,
      neutral: service.points.filter(point => point.case.classification === 'neutral').length,
      good: service.points.filter(point => point.case.classification === 'good').length,
      blocker: service.points.filter(point => point.case.classification === 'blocker').length,
    };
    return stats;
  });

  return (
    <div className="container mx-auto p-4 wrapper_main">
      <h1 className="text-2xl text-color4 font-bold mb-4">Comparatif des Réseaux Sociaux</h1>
      
      {/* Premier tableau - Cas "good" */}
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

      {/* Second tableau - Statistiques */}
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
    </div>
  );
}