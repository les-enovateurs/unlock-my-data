"use client"
import { useEffect, useState } from "react";
import { ExternalLink, FileText, ShieldAlert, ShieldCheck, Smartphone, Check, X, Scale, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  fr: {
    appAnalysis: "Analyse de l'application",
    loading: "Chargement des données de l'application...",
    loadError: "Échec du chargement des données de l'application",
    dangerousPermissions: "Permissions dangereuses",
    noDangerousPermissions: "Aucune permission dangereuse détectée",
    trackers: "Traqueurs",
    termsOfUse: "Conditions d'Utilisation",
    evaluation: "Évaluation:",
    positivePoints: "Points Positifs",
    noPositive: "Aucun point positif trouvé",
    neutralPoints: "Points Neutres",
    noNeutral: "Aucun point neutre trouvé",
    negativePoints: "Points Négatifs",
    noNegative: "Aucun point négatif trouvé",
    googlePlay: "Google Play",
    alsoFoundIn: "Également présent dans :",
    andMore: "et {count} autres..."
  },
  en: {
    appAnalysis: "Application Analysis",
    loading: "Loading application data...",
    loadError: "Failed to load application data",
    dangerousPermissions: "Dangerous Permissions",
    noDangerousPermissions: "No dangerous permissions detected",
    trackers: "Trackers",
    termsOfUse: "Terms of Service",
    evaluation: "Rating:",
    positivePoints: "Positive Points",
    noPositive: "No positive points found",
    neutralPoints: "Neutral Points",
    noNeutral: "No neutral points found",
    negativePoints: "Negative Points",
    noNegative: "No negative points found",
    googlePlay: "Google Play",
    alsoFoundIn: "Also found in:",
    andMore: "and {count} more..."
  }
};

function t(lang: string, key: string) {
  return translations[lang]?.[key] || translations['fr'][key] || key;
}

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

interface TrackerLink {
  name: string;
  slug: string;
}

function capitalizeFirstLetter(val:string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// Country mapping for flags and names bilingual
const countryISOCodes: { [key: string]: { code: string; fr: string; en: string } } = {
  france: { code: "fr", fr: "France", en: "France" },
  "united states": { code: "us", fr: "États-Unis", en: "United States" },
  china: { code: "cn", fr: "Chine", en: "China" },
  "south korea": { code: "kr", fr: "Corée du Sud", en: "South Korea" },
  japan: { code: "jp", fr: "Japon", en: "Japan" },
  russia: { code: "ru", fr: "Russie", en: "Russia" },
  germany: { code: "de", fr: "Allemagne", en: "Germany" },
  brazil: { code: "br", fr: "Brésil", en: "Brazil" },
  vietnam: { code: "vn", fr: "Vietnam", en: "Vietnam" },
  netherlands: { code: "nl", fr: "Pays-Bas", en: "Netherlands" },
  switzerland: { code: "ch", fr: "Suisse", en: "Switzerland" },
  panama: { code: "pa", fr: "Panama", en: "Panama" },
  israel: { code: "il", fr: "Israël", en: "Israel" },
  india: { code: "in", fr: "Inde", en: "India" },
  "united kingdom": { code: "gb", fr: "Royaume-Uni", en: "United Kingdom" },
  ireland: { code: "ie", fr: "Irlande", en: "Ireland" },
  singapore: { code: "sg", fr: "Singapour", en: "Singapore" },
};

const AppDataSection = ({ exodusPath, tosdrPath, lang = 'fr' }: { exodusPath?: string; tosdrPath?: string; lang?: string }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [trackers, setTrackers] = useState<number[]>([]);
  const [dangerousPermissionsList, setDangerousPermissionsList] = useState<Permission[]>([]);
  const [trackersData, setTrackersData] = useState<Tracker[]>([]);
  const [trackerLinks, setTrackerLinks] = useState<Record<string, TrackerLink[]>>({});
  const [expandedTracker, setExpandedTracker] = useState<number | null>(null);
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
        const permissionsResponse = await fetch('fr' === lang ? "/data/compare/permissions_fr.json" : "/data/compare/permissions.json");
        const permissionsData = await permissionsResponse.json();
        const dangerousPerms = (Object.values(permissionsData[0].permissions) as Permission[])
            .filter((perm) => perm.protection_level.includes("dangerous"))
            .map((perm) => ({
              ...perm,
              description: perm.description || perm.name,
            }));
        setDangerousPermissionsList(dangerousPerms);

        const trackersResponse = await fetch("/data/compare/trackers.json");
        const trackersData = await trackersResponse.json();
        setTrackersData(trackersData);

        const trackerLinksResponse = await fetch("/data/compare/tracker-links.json");
        const trackerLinksData = await trackerLinksResponse.json();
        setTrackerLinks(trackerLinksData);

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

        if (tosdrPath) {
          const tosdrResponse = await fetch(tosdrPath);
          const tosdrData = await tosdrResponse.json();
          setServiceData(tosdrData);
        }
      } catch (err) {
        console.error("Application data load error:", err);
        setError(t(lang, 'loadError'));
      } finally {
        setLoading(false);
      }
    };

    if (exodusPath || tosdrPath) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [exodusPath, tosdrPath, lang]);

  const getCountryFlagUrl = (countryName: string): { url: string; formattedName: string } => {
    const countryInfo = countryISOCodes[countryName.toLowerCase()];
    return {
      url: countryInfo ? `https://flagcdn.com/w20/${countryInfo.code}.png` : "/images/globe-icon.png",
      formattedName: countryInfo ? (lang === 'en' ? countryInfo.en : countryInfo.fr) : (lang === 'en' ? 'Unknown' : 'Inconnu'),
    };
  };

  if (loading) {
    return <div className="my-16 text-center">{t(lang,'loading')}</div>;
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className={`bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer rounded-t-xl ${!sectionsOpen.permissions ? 'rounded-b-xl border-b-0' : ''}`} onClick={() => setSectionsOpen({...sectionsOpen, permissions: !sectionsOpen.permissions})}>
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-blue-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{t(lang,'appAnalysis')}</h2>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
                {sectionsOpen.permissions ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                )}
            </button>
          </div>

          {sectionsOpen.permissions && (
            <div className="divide-y divide-gray-50">
              {/* App Info */}
              {appProperty && (
                  <div className="p-4 bg-blue-50/30">
                      <div className="flex items-center justify-between">
                          <div>
                              <span className="font-medium text-gray-900">{appProperty.name}</span>
                              <span className="text-gray-500 text-sm ml-2">({appProperty.uri})</span>
                          </div>
                          <Link href={`https://reports.exodus-privacy.eu.org/en/reports/${appProperty.uri}/latest/`} target="_blank" className="text-sm text-blue-600 hover:underline flex items-center">
                              Exodus Privacy <ExternalLink className="h-3 w-3 ml-1" />
                          </Link>
                      </div>
                  </div>
              )}

              {/* Trackers */}
              <div className="p-4">
                <div className="flex items-center mb-3">
                    <div className="h-5 w-5 mr-2 flex items-center justify-center">
                        <svg className={`w-4 h-4 ${trackers.length > 0 ? 'text-orange-500' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </div>
                    <h3 className="font-medium text-gray-900">{t(lang,'trackers')}</h3>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${trackers.length > 0 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {trackers.length}
                    </span>
                </div>

                {trackers.length > 0 ? (
                    <div className="space-y-2">
                        {trackers.map((trackerId) => {
                            const trackerInfo = trackersData.find(t => t.id === trackerId);
                            if (!trackerInfo) return null;
                            const flag = getCountryFlagUrl(trackerInfo.country);
                            const linkedApps = trackerLinks[trackerId.toString()]?.filter(app => app.name !== appProperty?.name) || [];
                            const isExpanded = expandedTracker === trackerId;

                            return (
                                <div key={trackerId} className="bg-gray-50 rounded border border-gray-100 overflow-hidden">
                                    <div
                                        className={`flex items-center justify-between p-2 ${linkedApps.length > 0 ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                                        onClick={() => linkedApps.length > 0 && setExpandedTracker(isExpanded ? null : trackerId)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {linkedApps.length > 0 && (
                                                isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />
                                            )}
                                            <span className="text-sm font-medium text-gray-700">{trackerInfo.name}</span>
                                        </div>
                                        <div className="flex items-center" title={flag.formattedName}>
                                            <div className="relative w-5 h-4 shadow-sm rounded-sm overflow-hidden">
                                                <Image
                                                    src={flag.url}
                                                    alt={flag.formattedName}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500 ml-2 w-24 text-right truncate">{flag.formattedName}</span>
                                        </div>
                                    </div>

                                    {isExpanded && linkedApps.length > 0 && (
                                        <div className="px-2 pb-2 pt-0 pl-8">
                                            <p className="text-xs text-gray-500 mb-1">{t(lang, 'alsoFoundIn')}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {linkedApps.slice(0, 10).map((app, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={`/liste-applications/${app.slug}`}
                                                        className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                                                    >
                                                        {app.name}
                                                    </Link>
                                                ))}
                                                {linkedApps.length > 10 && (
                                                    <span className="text-xs text-gray-400 px-1 py-0.5">
                                                        {t(lang, 'andMore').replace('{count}', (linkedApps.length - 10).toString())}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">Aucun traqueur détecté</p>
                )}
              </div>

              {/* Permissions */}
              <div className="p-4">
                <div className="flex items-center mb-3">
                    <ShieldAlert className={`h-5 w-5 mr-2 ${dangerousPermissionsList.length > 0 ? 'text-red-500' : 'text-green-500'}`} />
                    <h3 className="font-medium text-gray-900">{t(lang,'dangerousPermissions')}</h3>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${dangerousPermissionsList.length > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {dangerousPermissionsList.length}
                    </span>
                </div>

                {dangerousPermissionsList.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {dangerousPermissionsList.map((perm, idx) => (
                            <div key={idx} className="tooltip" data-tip={perm.description}>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100 cursor-help hover:bg-red-100 transition-colors">
                                    {capitalizeFirstLetter(perm.label || perm.name)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">{t(lang,'noDangerousPermissions')}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {hasTosData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow mt-6">
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer" onClick={() => setSectionsOpen({...sectionsOpen, tosData: !sectionsOpen.tosData})}>
                    <div className="flex items-center">
                        <div className="bg-white p-2 rounded-lg shadow-sm mr-3 text-purple-600">
                            <FileText className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">{t(lang,'termsOfUse')}</h2>
                    </div>
                    <div className="flex items-center">
                        {serviceData?.rating && (
                            <span className={`mr-4 px-3 py-1 rounded-full text-sm font-bold ${
                                serviceData.rating === 'A' ? 'bg-green-100 text-green-800' :
                                serviceData.rating === 'B' ? 'bg-blue-100 text-blue-800' :
                                serviceData.rating === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                serviceData.rating === 'D' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                Grade {serviceData.rating}
                            </span>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">
                            {sectionsOpen.tosData ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            )}
                        </button>
                    </div>
                </div>

                {sectionsOpen.tosData && (
                    <div className="p-4 divide-y divide-gray-50">
                        {/* Positive Points */}
                        <div className="pb-4">
                            <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
                                <ShieldCheck className="h-4 w-4 mr-1" /> {t(lang,'positivePoints')}
                            </h3>
                            <ul className="space-y-2">
                                {serviceData?.points.filter(p => p.case.classification === 'good').length === 0 && (
                                    <li className="text-sm text-gray-400 italic">{t(lang,'noPositive')}</li>
                                )}
                                {serviceData?.points.filter(p => p.case.classification === 'good').map((point, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-700">
                                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{point.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Neutral Points */}
                        <div className="py-4">
                            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                                <Scale className="h-4 w-4 mr-1" /> {t(lang,'neutralPoints')}
                            </h3>
                            <ul className="space-y-2">
                                {serviceData?.points.filter(p => p.case.classification === 'neutral').length === 0 && (
                                    <li className="text-sm text-gray-400 italic">{t(lang,'noNeutral')}</li>
                                )}
                                {serviceData?.points.filter(p => p.case.classification === 'neutral').map((point, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-700">
                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mr-3 mt-1.5 flex-shrink-0"></div>
                                        <span>{point.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Negative Points */}
                        <div className="pt-4">
                            <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center">
                                <ShieldAlert className="h-4 w-4 mr-1" /> {t(lang,'negativePoints')}
                            </h3>
                            <ul className="space-y-2">
                                {serviceData?.points.filter(p => p.case.classification === 'bad' || p.case.classification === 'blocker').length === 0 && (
                                    <li className="text-sm text-gray-400 italic">{t(lang,'noNegative')}</li>
                                )}
                                {serviceData?.points.filter(p => p.case.classification === 'bad' || p.case.classification === 'blocker').map((point, i) => (
                                    <li key={i} className="flex items-start text-sm text-gray-700">
                                        <X className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{point.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4 mt-2 text-right">
                             <Link href={`https://tosdr.org/en/service/${serviceData?.id}`} target="_blank" className="text-xs text-gray-500 hover:text-purple-600 hover:underline inline-flex items-center">
                                Source: ToS;DR <ExternalLink className="h-3 w-3 ml-1" />
                             </Link>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
  );
};

export default AppDataSection;
