"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {Search, X, Plus, Sparkles} from "lucide-react";

// Interfaces
interface Service {
  mode: number;
  slug: string;
  name: string;
  logo: string;
  short_description: string;
  risk_level: number;
  accessibility: number;
  need_account: number;
  need_id_card: number;
  contact_mail_export: string;
  contact_mail_delete: string;
  how_to_export: string;
  country_name: string;
  country_code: string;
  number_app: number;
  number_breach: number;
  number_permission: number;
  number_website: number;
  number_website_cookie: number;
}

interface AppPermissions {
  handle: string;
  app_name: string;
  permissions: string[];
  trackers: number[];
}

interface ServicePoint {
  title: string;
  case: {
    title: string;
    localized_title: string;
    classification: "bad" | "neutral" | "good" | "blocker";
  };
  status: string;
}

interface ServiceData {
  id?: number;
  name: string;
  rating?: string;
  logo: string;
  points: ServicePoint[];
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

export default function ComparatifPersonnalise() {
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Données de comparaison
  const [permissions, setPermissions] = useState<{ [key: string]: AppPermissions }>({});
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [dangerousPermissionsList, setDangerousPermissionsList] = useState<Permission[]>([]);
  const [servicesData, setServicesData] = useState<{ [key: string]: ServiceData }>({});

  // Pre-configured popular comparisons
  const popularComparisons = [
    {
      title: "Messageries populaires",
      description: "WhatsApp vs Telegram vs Signal",
      services: ["whatsapp", "telegram", "signal"],
      icon: "💬"
    },
    {
      title: "Réseaux sociaux",
      description: "Instagram vs TikTok vs Mastodon",
      services: ["instagram", "tiktok", "mastodon"],
      icon: "📱"
    },
    {
      title: "Stockage cloud",
      description: "Google Drive vs Proton Drive vs OneDrive",
      services: ["google-drive", "proton-drive", "onedrive"],
      icon: "☁️"
    },
    {
      title: "Navigation GPS",
      description: "Google Maps vs Waze vs OsmAnd",
      services: ["google-maps", "waze", "osmand"],
      icon: "🗺️"
    },
    {
      title: "Streaming vidéo",
      description: "Netflix vs Disney+ vs Amazon Prime",
      services: ["netflix", "disneyplus", "amazon-prime-video"],
      icon: "🎬"
    },
    {
      title: "E-commerce",
      description: "Amazon vs Temu vs AliExpress",
      services: ["amazon", "temu", "aliexpress"],
      icon: "🛒"
    }
  ];

  // Quick suggestions based on categories
  const quickSuggestions = [
    { name: "WhatsApp", slug: "whatsapp", category: "Messagerie" },
    { name: "Instagram", slug: "instagram", category: "Réseau social" },
    { name: "Netflix", slug: "netflix", category: "Streaming" },
    { name: "Zoom", slug: "zoom", category: "Visioconférence" },
    { name: "TikTok", slug: "tiktok", category: "Vidéo" }
  ];

  // Function to load a pre-configured comparison
  const loadPreConfiguredComparison = useCallback((comparisonServices: string[]) => {
    const servicesToAdd = availableServices.filter(service =>
        comparisonServices.includes(service.slug)
    );

    // Only add services that exist and limit to 3
    const validServices = servicesToAdd.slice(0, 3);
    setSelectedServices(validServices);
  }, [availableServices]);

  // Optimized callbacks
  const addService = useCallback((service: Service) => {
    if (selectedServices.length < 3 && !selectedServices.some(s => s.slug === service.slug)) {
      setSelectedServices(prev => [...prev, service]);
      setSearchTerm("");
      setShowSuggestions(false);
    }
  }, [selectedServices.length, selectedServices]);

  // Function to add a quick suggestion
  const addQuickSuggestion = useCallback((slug: string) => {
    const service = availableServices.find(s => s.slug === slug);
    if (service) {
      addService(service);
    }
  }, [availableServices, addService]);

  // Filter quick suggestions to show only available ones not already selected
  const availableQuickSuggestions = useMemo(() => {
    const selectedSlugs = new Set(selectedServices.map(s => s.slug));
    const availableSlugs = new Set(availableServices.map(s => s.slug));

    return quickSuggestions.filter(suggestion =>
        availableSlugs.has(suggestion.slug) && !selectedSlugs.has(suggestion.slug)
    );
  }, [selectedServices, availableServices]);


  // Optimized: Parallel API calls for initial filtering
  useEffect(() => {
    const fetchAndFilterServices = async () => {
      try {
        const response = await fetch("/data/services.json");
        const data = await response.json();
        setAllServices(data);

        // Create parallel promises instead of sequential calls
        const serviceChecks = data.map(async (service: Service) => {
          const trackersPromise = fetch(`/data/compare/${service.slug}.json`)
            .then(res => res.ok ? res.json() : null)
            .catch(() => null);

          const tosdrPromise = fetch(`/data/compare/tosdr/${service.slug}.json`)
            .then(res => res.ok ? res.json() : null)
            .catch(() => null);

          // Wait for both in parallel
          const [trackersData, tosdrData] = await Promise.all([trackersPromise, tosdrPromise]);

          let hasData = false;

          // Check trackers data
          if (trackersData?.trackers?.length > 0) {
            hasData = true;
          }

          // Check points data
          if (!hasData && tosdrData?.points?.length > 0) {
            const goodPoints = tosdrData.points.filter(
              (point: ServicePoint) =>
                point.status === "approved" &&
                ["bad", "neutral", "good", "blocker"].includes(point.case.classification)
            );
            if (goodPoints.length > 0) {
              hasData = true;
            }
          }

          return hasData ? service : null;
        });

        // Wait for all service checks in parallel
        const results = await Promise.all(serviceChecks);
        const filtered = results.filter(Boolean) as Service[];

        setAvailableServices(filtered);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
        setIsLoading(false);
      }
    };

    fetchAndFilterServices();
  }, []);

  // Optimized: Parallel API calls for comparison data
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (selectedServices.length === 0) return;

      try {
        // Fetch shared data once
        const [permissionsResponse, trackersResponse] = await Promise.all([
          fetch("/data/compare/permissions_fr.json"),
          fetch("/data/compare/trackers.json")
        ]);

        const [permissionsData, trackersData] = await Promise.all([
          permissionsResponse.json(),
          trackersResponse.json()
        ]);

        const dangerousPerms = Object.values(permissionsData[0].permissions)
          .filter((perm: any) => perm.protection_level.includes("dangerous"))
          .map((perm: any) => ({
            ...perm,
            description: perm.description || perm.name,
          }));

        setDangerousPermissionsList(dangerousPerms);
        setTrackers(trackersData);

        // Fetch service-specific data in parallel
        const serviceDataPromises = selectedServices.map(async (service) => {
          const [compareResponse, tosdrResponse] = await Promise.all([
            fetch(`/data/compare/${service.slug}.json`).catch(() => ({ ok: false })),
            fetch(`/data/compare/tosdr/${service.slug}.json`).catch(() => ({ ok: false }))
          ]);

          const results: {
            permissions?: AppPermissions;
            serviceData?: ServiceData;
          } = {};

          if (compareResponse.ok) {
            if ("json" in compareResponse) {
              results.permissions = await compareResponse.json();
            }
          }

          if (tosdrResponse.ok) {
            let tosdrData;
            if ("json" in tosdrResponse) {
              tosdrData = await tosdrResponse.json();
            }
            results.serviceData = {
              name: tosdrData.name.replace("apps", "").trim(),
              logo: service.logo,
              points: tosdrData.points.filter(
                (point: ServicePoint) =>
                  point.status === "approved" &&
                  ["bad", "neutral", "good", "blocker"].includes(point.case.classification)
              ),
            };
          }

          return { slug: service.slug, ...results };
        });

        const results = await Promise.all(serviceDataPromises);

        // Update state once with all results
        const newPermissions: { [key: string]: AppPermissions } = {};
        const newServicesData: { [key: string]: ServiceData } = {};

        results.forEach(({ slug, permissions, serviceData }) => {
          if (permissions) newPermissions[slug] = permissions;
          if (serviceData) newServicesData[slug] = serviceData;
        });

        setPermissions(newPermissions);
        setServicesData(newServicesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchComparisonData();
  }, [selectedServices]);

  // Memoized and optimized filtering
  const filteredServices = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return []; // Only search after 2 chars
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const selectedSlugs = new Set(selectedServices.map(s => s.slug));
    
    return availableServices
      .filter(service => 
        service.name.toLowerCase().includes(lowerSearchTerm) &&
        !selectedSlugs.has(service.slug)
      )
      .slice(0, 5);
  }, [searchTerm, availableServices, selectedServices]);

  const removeService = useCallback((slug: string) => {
    setSelectedServices(prev => prev.filter(service => service.slug !== slug));
  }, []);

  // Memoized country flag function
  const getCountryFlagUrl = useCallback((countryCode: string): string => {
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  }, []);

  // Memoized unique good point titles
  const uniqueGoodPointTitles = useMemo(() => {
    const titles = Object.values(servicesData)
      .flatMap(service =>
        service.points
          .filter(point => point.case.classification === "good")
          .map(point => point.case.localized_title || point.case.title)
      );
    return Array.from(new Set(titles));
  }, [servicesData]);

  // Debounced search to reduce API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Comparatif personnalisé de services
        </h1>
        <p className="text-gray-600">
          Recherchez et comparez jusqu'à 3 services pour analyser leurs permissions, trackers et points positifs
        </p>
      </div>

      {/* Pre-configured comparisons - Show only when no services selected */}
      {selectedServices.length === 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Comparaisons populaires</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {popularComparisons.map((comparison, index) => (
                  <div
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => loadPreConfiguredComparison(comparison.services)}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{comparison.icon}</span>
                      <h3 className="font-semibold text-gray-800">{comparison.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{comparison.description}</p>
                    <div className="flex items-center text-xs text-blue-600">
                      <Plus className="w-3 h-3 mr-1" />
                      Comparer maintenant
                    </div>
                  </div>
              ))}
            </div>

            {/* Quick suggestions */}
            {availableQuickSuggestions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Suggestions rapides</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableQuickSuggestions.slice(0, 8).map((suggestion) => (
                        <button
                            key={suggestion.slug}
                            onClick={() => addQuickSuggestion(suggestion.slug)}
                            disabled={selectedServices.length >= 3}
                            className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {suggestion.name}
                          <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {suggestion.category}
                    </span>
                        </button>
                    ))}
                  </div>
                </div>
            )}

            {/* Separator */}
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 bg-white">ou recherchez manuellement</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          </div>
      )}


      {/* Barre de recherche */}
      <div className="relative mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un service..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={selectedServices.length >= 3}
          />
        </div>

        {/* Suggestions d'autocomplétion */}
        {showSuggestions && filteredServices.length > 0 && selectedServices.length < 3 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
            {filteredServices.map((service) => (
              <button
                key={service.slug}
                onClick={() => addService(service)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
              >
                <Image
                  src={service.logo}
                  alt={service.name}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <div>
                  <div className="font-medium">{service.name}</div>
                  {service.short_description && (
                    <div className="text-sm text-gray-500">{service.short_description}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Services sélectionnés */}
      {selectedServices.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Services sélectionnés ({selectedServices.length}/3)</h2>
          <div className="flex flex-wrap gap-3">
            {selectedServices.map((service) => (
              <div key={service.slug} className="flex items-center bg-blue-100 rounded-full px-4 py-2">
                <Image
                  src={service.logo}
                  alt={service.name}
                  width={20}
                  height={20}
                  className="object-contain mr-2"
                />
                <span className="text-sm font-medium">{service.name}</span>
                <button
                  onClick={() => removeService(service.slug)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message si aucun service sélectionné */}
      {selectedServices.length === 0 && (
        <div className="text-center py-16">
          <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Utilisez la barre de recherche pour ajouter des services à comparer
          </p>
        </div>
      )}

      {/* Comparaison */}
      {selectedServices.length >= 2 && (
        <div className="space-y-8">
          {/* Statistiques par Service - Tableau inversé */}
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold">Statistiques par Service</h2>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-3 bg-gray-50 text-left sticky left-0 z-10">
                        Métrique
                      </th>
                      {selectedServices.map((service) => (
                        <th key={service.slug} className="border border-gray-300 p-3 bg-gray-50 text-center min-w-[140px]">
                          <div className="flex flex-col items-center space-y-2">
                            <Link href={`/liste-applications/${service.slug}`} target="_blank">
                              <Image
                                src={service.logo}
                                alt={service.name}
                                width={32}
                                height={32}
                                className="object-contain hover:scale-110 transition-transform"
                              />
                            </Link>
                            <Link 
                              href={`/liste-applications/${service.slug}`} 
                              target="_blank"
                              className="text-sm font-medium hover:text-blue-600 hover:underline"
                            >
                              {service.name}
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Ligne Pays */}
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium bg-gray-50 sticky left-0 z-10">
                        Pays
                      </td>
                      {selectedServices.map((service) => (
                        <td key={service.slug} className="border border-gray-300 p-3 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Image
                              src={getCountryFlagUrl(service.country_code)}
                              alt={service.country_name}
                              width={20}
                              height={15}
                              className="object-contain"
                            />
                            <span className="text-sm">{service.country_name}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    
                    {/* Ligne Bon */}
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium bg-green-400 text-white sticky left-0 z-10">
                        Bon
                      </td>
                      {selectedServices.map((service) => {
                        const serviceData = servicesData[service.slug];
                        const goodCount = serviceData?.points.filter(
                          point => point.case.classification === "good"
                        ).length || 0;
                        
                        return (
                          <td key={service.slug} className="border border-gray-300 p-3 text-center font-semibold text-green-600">
                            {goodCount}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Ligne Neutre */}
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium bg-yellow-400 text-white sticky left-0 z-10">
                        Neutre
                      </td>
                      {selectedServices.map((service) => {
                        const serviceData = servicesData[service.slug];
                        const neutralCount = serviceData?.points.filter(
                          point => point.case.classification === "neutral"
                        ).length || 0;
                        
                        return (
                          <td key={service.slug} className="border border-gray-300 p-3 text-center font-semibold text-yellow-600">
                            {neutralCount}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Ligne Mauvais */}
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium bg-red-400 text-white sticky left-0 z-10">
                        Mauvais
                      </td>
                      {selectedServices.map((service) => {
                        const serviceData = servicesData[service.slug];
                        const badCount = serviceData?.points.filter(
                          point => point.case.classification === "bad"
                        ).length || 0;
                        
                        return (
                          <td key={service.slug} className="border border-gray-300 p-3 text-center font-semibold text-red-600">
                            {badCount}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Ligne Bloquant */}
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium bg-black text-white sticky left-0 z-10">
                        Bloquant
                      </td>
                      {selectedServices.map((service) => {
                        const serviceData = servicesData[service.slug];
                        const blockerCount = serviceData?.points.filter(
                          point => point.case.classification === "blocker"
                        ).length || 0;
                        
                        return (
                          <td key={service.slug} className="border border-gray-300 p-3 text-center font-semibold text-gray-800">
                            {blockerCount}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Permissions dangereuses */}
          {Object.keys(permissions).length > 0 && (
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <h2 className="text-xl font-bold">Permissions Dangereuses</h2>
              </div>
              <div className="p-4">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="sticky top-0 bg-white">
                      <tr>
                        <th className="border border-gray-300 p-3 bg-gray-50 text-left sticky left-0 z-10">
                          Permission
                        </th>
                        {selectedServices.map((service) => (
                          <th key={service.slug} className="border border-gray-300 p-3 bg-gray-50 text-center min-w-[120px]">
                            <div className="flex flex-col items-center space-y-1">
                              <Link href={`/liste-applications/${service.slug}`} target="_blank">
                                <Image
                                  src={service.logo}
                                  alt={service.name}
                                  width={24}
                                  height={24}
                                  className="object-contain hover:scale-110 transition-transform"
                                />
                              </Link>
                              <Link 
                                href={`/liste-applications/${service.slug}`} 
                                target="_blank"
                                className="text-xs hover:text-blue-600 hover:underline"
                              >
                                {service.name}
                              </Link>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dangerousPermissionsList
                        .filter((permission) =>
                          selectedServices.some((service) =>
                            permissions[service.slug]?.permissions.includes(permission.name)
                          )
                        )
                        .map((permission) => (
                          <tr key={permission.name}>
                            <td className="border border-gray-300 p-3 sticky left-0 bg-white font-medium">
                              {permission.label || permission.name}
                            </td>
                            {selectedServices.map((service) => (
                              <td key={service.slug} className="border border-gray-300 p-3 text-center">
                                {permissions[service.slug]?.permissions.includes(permission.name) ? (
                                  <span className="text-red-600 text-xl">⚠️</span>
                                ) : (
                                  <span className="text-green-600 text-xl">✓</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Trackers */}
          {trackers.length > 0 && Object.keys(permissions).length > 0 && (
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <h2 className="text-xl font-bold">Trackers</h2>
              </div>
              <div className="p-4">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="sticky top-0 bg-white">
                      <tr>
                        <th className="border border-gray-300 p-3 bg-gray-50 text-left sticky left-0 z-10">
                          Tracker
                        </th>
                        {selectedServices.map((service) => (
                          <th key={service.slug} className="border border-gray-300 p-3 bg-gray-50 text-center min-w-[120px]">
                            <div className="flex flex-col items-center space-y-1">
                              <Link href={`/liste-applications/${service.slug}`} target="_blank">
                                <Image
                                  src={service.logo}
                                  alt={service.name}
                                  width={24}
                                  height={24}
                                  className="object-contain hover:scale-110 transition-transform"
                                />
                              </Link>
                              <Link 
                                href={`/liste-applications/${service.slug}`} 
                                target="_blank"
                                className="text-xs hover:text-blue-600 hover:underline"
                              >
                                {service.name}
                              </Link>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {trackers
                        .filter((tracker) =>
                          selectedServices.some((service) =>
                            permissions[service.slug]?.trackers?.includes(tracker.id)
                          )
                        )
                        .map((tracker) => (
                          <tr key={tracker.id}>
                            <td className="border border-gray-300 p-3 sticky left-0 bg-white font-medium">
                              <div className="flex items-center">
                                <Image
                                  src={getCountryFlagUrl(tracker.country.toLowerCase().replace(/\s+/g, '-'))}
                                  alt={tracker.country}
                                  width={16}
                                  height={12}
                                  className="mr-2"
                                />
                                {tracker.name}
                              </div>
                            </td>
                            {selectedServices.map((service) => (
                              <td key={service.slug} className="border border-gray-300 p-3 text-center">
                                {permissions[service.slug]?.trackers?.includes(tracker.id) ? (
                                  <span className="text-red-600 text-xl">⚠️</span>
                                ) : (
                                  <span className="text-green-600 text-xl">✓</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Points positifs */}
          {Object.keys(servicesData).length > 0 && (
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <h2 className="text-xl font-bold">Points Positifs</h2>
              </div>
              <div className="p-4">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="sticky top-0 bg-white">
                      <tr>
                        <th className="border border-gray-300 p-3 bg-gray-50 text-left sticky left-0 z-10">
                          Point positif
                        </th>
                        {selectedServices.map((service) => (
                          <th key={service.slug} className="border border-gray-300 p-3 bg-gray-50 text-center min-w-[120px]">
                            <div className="flex flex-col items-center space-y-1">
                              <Link href={`/liste-applications/${service.slug}`} target="_blank">
                                <Image
                                  src={service.logo}
                                  alt={service.name}
                                  width={24}
                                  height={24}
                                  className="object-contain hover:scale-110 transition-transform"
                                />
                              </Link>
                              <Link 
                                href={`/liste-applications/${service.slug}`} 
                                target="_blank"
                                className="text-xs hover:text-blue-600 hover:underline"
                              >
                                {service.name}
                              </Link>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {uniqueGoodPointTitles.map((title) => (
                        <tr key={title}>
                          <td className="border border-gray-300 p-3 sticky left-0 bg-white font-medium">
                            {title}
                          </td>
                          {selectedServices.map((service) => (
                            <td key={service.slug} className="border border-gray-300 p-3 text-center">
                              {servicesData[service.slug]?.points.some(
                                (point) =>
                                  point.case.classification === "good" &&
                                  (point.case.localized_title === title || point.case.title === title)
                              ) ? (
                                <span className="text-green-600 text-xl">✓</span>
                              ) : (
                                <span className="text-gray-300 text-xl">✗</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Message si un seul service */}
      {selectedServices.length === 1 && (
        <div className="text-center py-8 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700">
            Ajoutez au moins un autre service pour commencer la comparaison
          </p>
        </div>
      )}

      {/* Cacher les suggestions quand on clique ailleurs */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}