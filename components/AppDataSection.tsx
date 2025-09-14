"use client"
import { useEffect, useState } from "react";
import { ExternalLink, FileText, ShieldAlert, ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";

// Existing interfaces
interface Permission {
  name: string;
  description: string;
  label: string;
  protection_level: string;
}

interface Tracker {
  id: number;
  name: string;
  country: string;
}

interface ServicePoint {
  title: string;
  case: {
    title: string;
    localized_title: string | null;
    classification: "bad" | "neutral" | "good" | "blocker";
  };
  status: string;
}

interface ServiceData {
  id: number;
  name: string;
  rating: string;
  points: ServicePoint[];
}

function capitalizeFirstLetter(val:string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const AppDataSection = ({ exodusPath, tosdrPath }: { exodusPath: string; tosdrPath: string }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [trackers, setTrackers] = useState<number[]>([]);
  const [dangerousPermissionsList, setDangerousPermissionsList] = useState<Permission[]>([]);
  const [trackersData, setTrackersData] = useState<Tracker[]>([]);
  const [appProperty, setAppProperty] = useState<{ name:string, uri:string } | null>(null);
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionsOpen, setSectionsOpen] = useState({
    permissions: true,
    trackers: true,
    tosData: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Load permissions list
        const permissionsResponse = await fetch("/data/compare/permissions_fr.json");
        const permissionsData = await permissionsResponse.json();
        const dangerousPerms = (Object.values(permissionsData[0].permissions) as Permission[])
            .filter((perm) => perm.protection_level.includes("dangerous"))
            .map((perm) => ({
              ...perm,
              description: perm.description || perm.name,
            }));
        setDangerousPermissionsList(dangerousPerms);

        // Load trackers list
        const trackersResponse = await fetch("/data/compare/trackers.json");
        const trackersData = await trackersResponse.json();
        setTrackersData(trackersData);

        // Load app-specific data if exodus path exists
        if (exodusPath) {
          const exodusResponse = await fetch(exodusPath);
          const exodusData = await exodusResponse.json();
          setPermissions(exodusData.permissions || []);
          setTrackers(exodusData.trackers || []);
          setAppProperty({
            name: exodusData.app_name,
            uri: exodusData.handle,
          })
        }

        // Load ToS data if tosdr path exists
        if (tosdrPath) {
          const tosdrResponse = await fetch(tosdrPath);
          const tosdrData = await tosdrResponse.json();
          setServiceData(tosdrData);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données de l'application:", err);
        setError("Échec du chargement des données de l'application");
      } finally {
        setLoading(false);
      }
    };

    if (exodusPath || tosdrPath) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [exodusPath, tosdrPath]);

  const getCountryFlagUrl = (countryName: string): { url: string; formattedName: string } => {
    const countryISOCodes: { [key: string]: { code: string; name: string } } = {
      france: { code: "fr", name: "France" },
      "united states": { code: "us", name: "États-Unis" },
      china: { code: "cn", name: "Chine" },
      "south korea": { code: "kr", name: "Corée du Sud" },
      japan: { code: "jp", name: "Japon" },
      russia: { code: "ru", name: "Russie" },
      germany: { code: "de", name: "Allemagne" },
      brazil: { code: "br", name: "Brésil" },
      vietnam: { code: "vn", name: "Vietnam" },
      netherlands: { code: "nl", name: "Pays-Bas" },
      switzerland: { code: "ch", name: "Suisse" },
      panama: { code: "pa", name: "Panama" },
      israel: { code: "il", name: "Israël" },
      india: { code: "in", name: "Inde" },
      "united kingdom": { code: "gb", name: "Royaume-Uni" },
      ireland: { code: "ie", name: "Irlande" },
      singapore: { code: "sg", name: "Singapour" },
    };

    const countryInfo = countryISOCodes[countryName.toLowerCase()];
    return {
      url: countryInfo ? `https://flagcdn.com/w20/${countryInfo.code}.png` : "/images/globe-icon.png",
      formattedName: countryInfo ? countryInfo.name : "Inconnu",
    };
  };

  if (loading) {
    return <div className="my-16 text-center">Chargement des données de l'application...</div>;
  }

  if (error) {
    return <div className="my-16 text-center text-red-500">{error}</div>;
  }

  if (!exodusPath && !tosdrPath) {
    return null;
  }

  const hasAppData = permissions.length > 0 || trackers.length > 0;
  const hasTosData = serviceData && serviceData.points && serviceData.points.length > 0;

  if (!hasAppData && !hasTosData) {
    return null;
  }

  return (
      <div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex items-center">
            <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-blue-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Analyse de l'application</h2>
          </div>

          <div className="divide-y divide-gray-100">

            <div className={"flex items-center justify-between p-4"}>
              <Link
                  href={"https://play.google.com/store/apps/details?id=" + (appProperty?.uri)}
                  prefetch={false}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
              >
                <Smartphone className="h-4 w-4 mr-1" />{appProperty?.name} - Google Play
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </div>


            {/* Permissions Section */}
            {permissions.length > 0 && (
                <section className="p-4 border-b">
                  <button
                      onClick={() => setSectionsOpen(prev => ({ ...prev, permissions: !prev.permissions }))}
                      className="w-full text-left flex items-center mb-3"
                  >
                <span className="mr-3">
                  <svg
                      className={`w-5 h-5 inline transform transition-transform duration-200 ${
                          sectionsOpen.permissions ? "rotate-90" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                  >
                    <path d="M6 4L18 12L6 20L6 4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                    <div className="flex items-center">
                      <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-800">
                        Permissions Dangereuses ({dangerousPermissionsList.filter(p => permissions.includes(p.name)).length})
                      </h3>
                    </div>
                  </button>

                  {sectionsOpen.permissions && (
                      <div className="mt-2">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          {dangerousPermissionsList.filter(permission => permissions.includes(permission.name)).length > 0 ? (
                              <div className="space-y-3">
                                {dangerousPermissionsList
                                    .filter(permission => permissions.includes(permission.name))
                                    .map(permission => (
                                        <div key={permission.name} className="p-2 bg-white rounded border border-gray-200">
                                          <div className="font-medium text-gray-800">{capitalizeFirstLetter(permission.label || permission.name)}</div>
                                          <div className="text-sm text-gray-600 mt-1">{permission.description}</div>
                                        </div>
                                    ))}
                              </div>
                          ) : (
                              <div className="text-center text-gray-500">Aucune permission dangereuse détectée</div>
                          )}
                        </div>
                      </div>
                  )}
                </section>
            )}

            {/* Trackers Section */}
            {trackers.length > 0 && (
                <section className="p-4 border-b">
                  <button
                      onClick={() => setSectionsOpen(prev => ({ ...prev, trackers: !prev.trackers }))}
                      className="w-full text-left flex items-center mb-3"
                  >
                <span className="mr-3">
                  <svg
                      className={`w-5 h-5 inline transform transition-transform duration-200 ${
                          sectionsOpen.trackers ? "rotate-90" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                  >
                    <path d="M6 4L18 12L6 20L6 4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                    <div className="flex items-center">
                      <ShieldAlert className="h-5 w-5 text-red-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-800">
                        Traqueurs ({trackersData.filter(t => trackers.includes(t.id)).length})
                      </h3>
                    </div>
                  </button>

                  {sectionsOpen.trackers && (
                      <div className="mt-2">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {trackersData
                                .filter(tracker => trackers.includes(tracker.id))
                                .map(tracker => (
                                    <div key={tracker.id} className="p-3 bg-white rounded border border-gray-200 flex items-center">
                                      <div className="flex-grow">
                                          <Link href={"https://reports.exodus-privacy.eu.org/fr/trackers/"+tracker.id} target={"_blank"}
                                                className={"underline hover:no-underline flex items-center"} rel="noopener noreferrer"
                                          >
                                          {tracker.name} - Exodus<ExternalLink className="ml-1 h-3 w-3"/>  </Link>

                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                          <img
                                              src={getCountryFlagUrl(tracker.country).url}
                                              alt={`Drapeau de ${getCountryFlagUrl(tracker.country).formattedName}`}
                                              className="inline-block mr-2 w-5 h-auto"
                                          />
                                          {getCountryFlagUrl(tracker.country).formattedName}
                                        </div>
                                      </div>
                                    </div>
                                ))}
                          </div>
                        </div>
                      </div>
                  )}
                </section>
            )}

            {/* Terms of Service Section */}
            {hasTosData && (
                <section className="p-4">
                  <button
                      onClick={() => setSectionsOpen(prev => ({ ...prev, tosData: !prev.tosData }))}
                      className="w-full text-left flex items-center mb-3"
                  >
                <span className="mr-3">
                  <svg
                      className={`w-5 h-5 inline transform transition-transform duration-200 ${
                          sectionsOpen.tosData ? "rotate-90" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                  >
                    <path d="M6 4L18 12L6 20L6 4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-800">
                        Conditions d'Utilisation ({serviceData?.points?.filter(p => p.status === "approved").length || 0})
                      </h3>
                    </div>
                  </button>

                  {sectionsOpen.tosData && serviceData && (
                      <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                        <div className="mb-4">
                          <p className="text-lg font-semibold flex items-center">
                            Évaluation:
                            <span className={`ml-2 px-2 py-0.5 rounded text-white font-bold ${
                                serviceData.rating === "E" ? "bg-red-600" :
                                    serviceData.rating === "D" ? "bg-orange-600" :
                                        serviceData.rating === "C" ? "bg-yellow-600" :
                                            serviceData.rating === "B" ? "bg-green-500" :
                                                "bg-green-600"
                            }`}>
                        {serviceData.rating}
                      </span>
                          </p>
                        </div>

                        <div className="flex flex-col gap-4 mb-4">
                          {/* Good Points */}
                          <div className="border rounded p-3 bg-white">
                            <h4 className="font-bold text-green-600 mb-2 flex items-center">
                              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Points Positifs
                            </h4>
                            <ul className="list-disc pl-5">
                              {serviceData.points
                                  .filter(point => point.case.classification === "good" && point.status === "approved")
                                  .map((point, i) => (
                                      <li key={i} className="mb-2 text-sm">{point.case.localized_title || point.case.title}</li>
                                  ))}
                              {serviceData.points.filter(point => point.case.classification === "good" && point.status === "approved").length === 0 && (
                                  <li className="text-gray-500 text-sm">Aucun point positif trouvé</li>
                              )}
                            </ul>
                          </div>

                          {/* Neutral Points */}
                          <div className="border rounded p-3 bg-white">
                            <h4 className="font-bold text-yellow-600 mb-2 flex items-center">
                              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Points Neutres
                            </h4>
                            <ul className="list-disc pl-5">
                              {serviceData.points
                                  .filter(point => point.case.classification === "neutral" && point.status === "approved")
                                  .map((point, i) => (
                                      <li key={i} className="mb-2 text-sm">{point.case.localized_title || point.case.title}</li>
                                  ))}
                              {serviceData.points.filter(point => point.case.classification === "neutral" && point.status === "approved").length === 0 && (
                                  <li className="text-gray-500 text-sm">Aucun point neutre trouvé</li>
                              )}
                            </ul>
                          </div>

                          {/* Bad Points */}
                          <div className="border rounded p-3 bg-white">
                            <h4 className="font-bold text-red-600 mb-2 flex items-center">
                              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              Points Négatifs
                            </h4>
                            <ul className="list-disc pl-5">
                              {serviceData.points
                                  .filter(point => point.case.classification === "bad" && point.status === "approved")
                                  .map((point, i) => (
                                      <li key={i} className="mb-2 text-sm">{point.case.localized_title || point.case.title}</li>
                                  ))}
                              {serviceData.points.filter(point => point.case.classification === "bad" && point.status === "approved").length === 0 && (
                                  <li className="text-gray-500 text-sm">Aucun point négatif trouvé</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                  )}
                </section>
            )}
          </div>
        </div>
      </div>
  );
};

export default AppDataSection;