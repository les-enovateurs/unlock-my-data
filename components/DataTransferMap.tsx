"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  AlertTriangle,
  Shield,
  ShieldAlert,
  MapPin,
  Building2,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  parseTransferCountries,
  getCountryByCode,
  getUserLocation,
  type CountryCoordinate,
} from "@/lib/map/country-coordinates";

// GeoJSON for world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Translations
const translations: Record<string, Record<string, string>> = {
  fr: {
    title: "Carte des transferts de données",
    subtitle: "Visualisez où voyagent vos données personnelles",
    yourLocation: "Votre position",
    headquarters: "Siège social",
    dataTransfer: "Transfert de données",
    trackerCountry: "Traqueur",
    legend: "Légende",
    euSafe: "Zone UE/EEE (protégée)",
    outsideEU: "Hors UE (risque potentiel)",
    noTransferData: "Aucune donnée de transfert disponible",
    loadingMap: "Chargement de la carte...",
    selectServices: "Sélectionnez des services pour visualiser les flux",
    servicesWithTransfers: "Services avec transferts",
    totalDestinations: "destinations",
    countriesOutsideEU: "pays hors UE",
    trackersOutsideEU: "traqueurs hors UE",
    dataFlow: "Flux de données",
    from: "De",
    to: "Vers",
    via: "via",
    riskLevel: "Niveau de risque",
    high: "Élevé",
    medium: "Moyen",
    low: "Faible",
    showDetails: "Voir détails",
    hideDetails: "Masquer détails",
    noDestinations: "Destinations non spécifiées",
    privacyQuote: "Extrait de la politique de confidentialité",
    mobileListView: "Liste des transferts",
    userOrigin: "Origine utilisateur",
    companyHQ: "Siège de l'entreprise",
    transferDest: "Destination de transfert",
    trackers: "Traqueurs",
    trackerCountries: "Pays des traqueurs",
    filterAll: "Tout",
    filterTransfers: "Transferts",
    filterTrackers: "Traqueurs",
    allServices: "Tous les services",
    zoomIn: "Zoom +",
    zoomOut: "Zoom -",
    resetView: "Réinitialiser",
    serviceHQ: "Siège social de",
    transfersTo: "Transfère vers",
    usesTrackers: "Utilise des traqueurs de",
    countries: "pays",
    dataStoredIn: "Données stockées en",
    sanctionedBy: "Sanctionné par la CNIL",
    trackerFrom: "Traqueur de",
    usedBy: "utilisé par",
    clickToFilter: "Cliquez sur un service pour filtrer. Trié par volume de partage.",
  },
  en: {
    title: "Data Transfer Map",
    subtitle: "Visualize where your personal data travels",
    yourLocation: "Your location",
    headquarters: "Headquarters",
    dataTransfer: "Data transfer",
    trackerCountry: "Tracker country",
    legend: "Legend",
    euSafe: "EU/EEA zone (protected)",
    outsideEU: "Outside EU (potential risk)",
    noTransferData: "No transfer data available",
    loadingMap: "Loading map...",
    selectServices: "Select services to visualize data flows",
    servicesWithTransfers: "Services with transfers",
    totalDestinations: "destinations",
    countriesOutsideEU: "countries outside EU",
    trackersOutsideEU: "trackers outside EU",
    dataFlow: "Data flow",
    from: "From",
    to: "To",
    via: "via",
    riskLevel: "Risk level",
    high: "High",
    medium: "Medium",
    low: "Low",
    showDetails: "Show details",
    hideDetails: "Hide details",
    noDestinations: "Destinations not specified",
    privacyQuote: "Privacy policy excerpt",
    mobileListView: "Transfer list",
    userOrigin: "User origin",
    companyHQ: "Company headquarters",
    transferDest: "Transfer destination",
    trackers: "Trackers",
    trackerCountries: "Tracker countries",
    filterAll: "All",
    filterTransfers: "Transfers",
    filterTrackers: "Trackers",
    allServices: "All services",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetView: "Reset view",
    serviceHQ: "Headquarters of",
    transfersTo: "Transfers to",
    usesTrackers: "Uses trackers from",
    countries: "countries",
    dataStoredIn: "Data stored in",
    sanctionedBy: "Sanctioned by CNIL",
    trackerFrom: "Tracker from",
    usedBy: "used by",
    clickToFilter: "Click on a service to filter. Sorted by sharing volume.",
  },
};

function t(lang: string, key: string): string {
  return translations[lang]?.[key] || translations["en"][key] || key;
}

// Country name to code mapping for trackers
const trackerCountryToCode: Record<string, string> = {
  "france": "fr",
  "united states": "us",
  "usa": "us",
  "germany": "de",
  "japan": "jp",
  "south korea": "kr",
  "china": "cn",
  "russia": "ru",
  "switzerland": "ch",
  "panama": "pa",
  "united kingdom": "gb",
  "great britain": "gb",
  "uk": "gb",
  "netherlands": "nl",
  "ireland": "ie",
  "canada": "ca",
  "australia": "au",
  "india": "in",
  "israel": "il",
  "singapore": "sg",
  "sweden": "se",
  "spain": "es",
  "italy": "it",
  "brazil": "br",
  "mexico": "mx",
  "finland": "fi",
  "norway": "no",
  "denmark": "dk",
  "belgium": "be",
  "austria": "at",
  "poland": "pl",
  "unknown": "",
};

// Types
interface Tracker {
  id: number;
  name: string;
  country: string;
}

interface ManualData {
  name: string;
  logo?: string;
  country_code?: string;
  country_name?: string;
  nationality?: string;
  transfer_destination_countries?: string;
  transfer_destination_countries_en?: string;
  privacy_policy_quote?: string;
  privacy_policy_quote_en?: string;
  outside_eu_storage?: boolean;
  sanctioned_by_cnil?: boolean;
  group_name?: string;
  exodus?: string | boolean;
}

interface ExodusData {
  trackers?: number[];
}

interface Service {
  slug: string;
  name: string;
  logo: string;
  country_code?: string;
  exodus?: boolean | string;
}

interface TrackerInfo {
  id: number;
  name: string;
  country: CountryCoordinate | null;
  countryName: string;
}

interface DataFlow {
  serviceSlug: string;
  serviceName: string;
  serviceLogo: string;
  headquartersCode: string;
  headquarters: CountryCoordinate | null;
  transferDestinations: CountryCoordinate[];
  trackerCountries: CountryCoordinate[];
  trackers: TrackerInfo[];
  outsideEU: boolean;
  sanctioned: boolean;
  privacyQuote?: string;
}


interface TooltipData {
  x: number;
  y: number;
  type: "user" | "headquarters" | "transfer" | "tracker";
  serviceName?: string;
  serviceLogo?: string;
  countryName: string;
  countryCode: string;
  isEU: boolean;
  additionalInfo?: string[];
  trackerNames?: string[];
  sanctioned?: boolean;
  usedByServices?: string[];
}

interface Props {
  lang?: string;
  selectedServices: Service[];
  onAnalysisComplete?: (flows: DataFlow[]) => void;
}

// Animated arc component
function AnimatedArc({
  start,
  end,
  color,
  delay = 0,
  isHighlighted = false,
  strokeWidth = 2,
  isDimmed = false,
  onClick,
  zoom = 1,
}: {
  start: [number, number];
  end: [number, number];
  color: string;
  delay?: number;
  isHighlighted?: boolean;
  strokeWidth?: number;
  isDimmed?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  zoom?: number;
}) {
  if (!start || !end || (start[0] === 0 && start[1] === 0) || (end[0] === 0 && end[1] === 0)) {
    return null;
  }

  const opacity = isDimmed ? 0.15 : 1;
  // Adjust stroke width based on zoom to keep it from getting too thick
  const adjustedStrokeWidth = strokeWidth / Math.pow(zoom, 0.6);
  const highlightWidth = isHighlighted ? adjustedStrokeWidth + (4 / zoom) : adjustedStrokeWidth + (2 / zoom);
  const dashWidth = isHighlighted ? adjustedStrokeWidth + (1 / zoom) : adjustedStrokeWidth;

  return (
    <motion.g style={{ opacity }} onClick={onClick} className={onClick ? "cursor-pointer" : ""}>
      {/* Invisible wide line for easier clicking */}
      <Line
        from={start}
        to={end}
        stroke="transparent"
        strokeWidth={15 / zoom}
        style={{ cursor: "pointer" }}
      />
      <Line
        from={start}
        to={end}
        stroke={color}
        strokeWidth={highlightWidth}
        strokeLinecap="round"
        strokeOpacity={0.2}
        style={{ filter: "blur(3px)" }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.5 }}
      >
        <Line
          from={start}
          to={end}
          stroke={color}
          strokeWidth={dashWidth}
          strokeLinecap="round"
          strokeDasharray={`${5 / zoom},${3 / zoom}`}
        />
      </motion.g>
    </motion.g>
  );
}

// Pulsing marker component
function PulsingMarker({
  coordinates,
  color,
  type,
  delay = 0,
  isHighlighted = false,
  isDimmed = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  zoom = 1,
}: {
  coordinates: [number, number];
  color: string;
  type: "user" | "headquarters" | "transfer" | "tracker";
  delay?: number;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
  zoom?: number;
}) {
  if (!coordinates || (coordinates[0] === 0 && coordinates[1] === 0)) {
    return null;
  }

  const baseSize = type === "user" ? 8 : type === "headquarters" ? 6 : type === "tracker" ? 4 : 5;
  // Adjust size based on zoom. We use a power less than 1 to allow some growth but not linear.
  // Or use linear division to keep constant screen size.
  // Let's try keeping it roughly constant screen size.
  const size = baseSize / Math.pow(zoom, 0.7);

  const opacity = isDimmed ? 0.2 : 1;

  return (
    <Marker coordinates={coordinates}>
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity }}
        transition={{ delay, duration: 0.4, type: "spring" }}
        style={{ cursor: onClick ? "pointer" : "default" }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <circle
          r={isHighlighted ? size + (2 / zoom) : size}
          fill={color}
          stroke="#fff"
          strokeWidth={isHighlighted ? 3 / zoom : 2 / zoom}
          style={{
            filter: isHighlighted ? `drop-shadow(0 0 ${6 / zoom}px ${color})` : undefined,
          }}
        />
      </motion.g>
    </Marker>
  );
}

// Rich Tooltip component
function RichTooltip({
  data,
  lang,
  onClose,
}: {
  data: TooltipData;
  lang: string;
  onClose: () => void;
}) {
  const getTypeLabel = () => {
    switch (data.type) {
      case "user": return t(lang, "yourLocation");
      case "headquarters": return t(lang, "headquarters");
      case "transfer": return t(lang, "dataTransfer");
      case "tracker": return t(lang, "trackerCountry");
    }
  };

  const getTypeColor = () => {
    switch (data.type) {
      case "user": return "bg-cyan-500";
      case "headquarters": return data.isEU ? "bg-green-500" : "bg-amber-500";
      case "transfer": return data.isEU ? "bg-green-500" : "bg-red-500";
      case "tracker": return data.isEU ? "bg-purple-400" : "bg-pink-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute z-30 pointer-events-auto"
      style={{ left: Math.min(data.x, window.innerWidth - 320), top: data.y }}
    >
      <div className="bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 w-72 overflow-hidden">
        {/* Header */}
        <div className={`${getTypeColor()} px-4 py-2 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{getTypeLabel()}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Country info */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${data.isEU ? "bg-green-500/20" : "bg-red-500/20"}`}>
              {data.isEU ? (
                <Shield className="w-5 h-5 text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div>
              <div className="font-semibold text-lg">{data.countryName}</div>
              <div className="text-xs text-slate-400">
                {data.isEU ? t(lang, "euSafe") : t(lang, "outsideEU")}
              </div>
            </div>
          </div>

            {/* Service info for headquarters */}
          {data.type === "headquarters" && data.serviceName && (
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                {data.serviceLogo && (
                  <div className="relative w-8 h-8 rounded bg-white overflow-hidden shrink-0">
                    <Image
                      src={data.serviceLogo}
                      alt={data.serviceName}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <div className="font-medium">{data.serviceName}</div>
                  {data.sanctioned && (
                    <div className="text-xs text-orange-400 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      {t(lang, "sanctionedBy")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional info */}
          {data.additionalInfo && data.additionalInfo.length > 0 && (
            <div className="space-y-1">
              {data.additionalInfo.map((info, idx) => (
                <div key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                  <ArrowRight className="w-3 h-3 mt-1 text-slate-500 shrink-0" />
                  <span>{info}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tracker names */}
          {data.trackerNames && data.trackerNames.length > 0 && (
            <div>
              <div className="text-xs text-slate-400 mb-2">{t(lang, "trackers")}:</div>
              <div className="flex flex-wrap gap-1">
                {data.trackerNames.slice(0, 5).map((name, idx) => (
                  <span key={idx} className="badge badge-sm bg-purple-500/30 text-purple-200 border-purple-500/50">
                    {name.length > 12 ? name.slice(0, 12) + "..." : name}
                  </span>
                ))}
                {data.trackerNames.length > 5 && (
                  <span className="badge badge-sm badge-ghost">+{data.trackerNames.length - 5}</span>
                )}
              </div>
            </div>
          )}

          {/* Used by services (for transfer/tracker points) */}
          {data.usedByServices && data.usedByServices.length > 0 && (
            <div className="text-xs text-slate-400">
              {t(lang, "usedBy")}: {data.usedByServices.join(", ")}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function DataTransferMap({
  lang = "fr",
  selectedServices,
  onAnalysisComplete,
}: Props) {
  const [manualData, setManualData] = useState<Record<string, ManualData>>({});
  const [exodusData, setExodusData] = useState<Record<string, ExodusData>>({});
  const [trackersMap, setTrackersMap] = useState<Record<number, Tracker>>({});
  const [loading, setLoading] = useState(true);

  // Filter states
  const [visibleLayers, setVisibleLayers] = useState({
    transfersEU: true,
    transfersOutsideEU: true,
    trackers: true,
    hq: true,
    user: true
  });
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);

  // Map interaction states
  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState<[number, number]>([10, 45]);

  // Tooltip state
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load trackers mapping
  useEffect(() => {
    const loadTrackers = async () => {
      try {
        const res = await fetch("/data/compare/trackers.json");
        if (res.ok) {
          const trackers: Tracker[] = await res.json();
          const map: Record<number, Tracker> = {};
          trackers.forEach((tracker) => {
            map[tracker.id] = tracker;
          });
          setTrackersMap(map);
        }
      } catch {
        console.error("Failed to load trackers");
      }
    };
    loadTrackers();
  }, []);

  // Load manual and exodus data for selected services
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const manual: Record<string, ManualData> = {};
      const exodus: Record<string, ExodusData> = {};

      await Promise.all(
        selectedServices.map(async (service) => {
          try {
            const res = await fetch(`/data/manual/${service.slug}.json`);
            if (res.ok) {
              manual[service.slug] = await res.json();
            }
          } catch {}

          try {
            const manualInfo = manual[service.slug];
            let exodusPath = `/data/compare/${service.slug}.json`;

            if (manualInfo?.exodus && typeof manualInfo.exodus === "string") {
              exodusPath = manualInfo.exodus;
            } else if (service.exodus && typeof service.exodus === "string") {
              exodusPath = service.exodus;
            }

            const exodusRes = await fetch(exodusPath);
            if (exodusRes.ok) {
              exodus[service.slug] = await exodusRes.json();
            }
          } catch {}
        })
      );

      setManualData(manual);
      setExodusData(exodus);
      setLoading(false);
    };

    if (selectedServices.length > 0) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [selectedServices]);

  // Calculate data flows
  const dataFlows = useMemo<DataFlow[]>(() => {
    const flows: DataFlow[] = [];

    for (const service of selectedServices) {
      const manual = manualData[service.slug];
      const exodus = exodusData[service.slug];
      const hqCode = manual?.country_code || service.country_code || "us";
      const headquarters = getCountryByCode(hqCode);

      const transferString = lang === "en"
        ? manual?.transfer_destination_countries_en || manual?.transfer_destination_countries
        : manual?.transfer_destination_countries;

      const transferCodes = parseTransferCountries(transferString, lang);
      const transferDestinations = transferCodes
        .map((code) => getCountryByCode(code))
        .filter((c): c is CountryCoordinate => c !== null && c.code !== hqCode);

      const trackers: TrackerInfo[] = [];
      const trackerCountrySet = new Set<string>();

      if (exodus?.trackers && Object.keys(trackersMap).length > 0) {
        for (const trackerId of exodus.trackers) {
          const tracker = trackersMap[trackerId];
          if (tracker) {
            const countryCode = trackerCountryToCode[tracker.country.toLowerCase()] || "";
            const countryInfo = countryCode ? getCountryByCode(countryCode) : null;

            trackers.push({
              id: tracker.id,
              name: tracker.name,
              country: countryInfo,
              countryName: tracker.country,
            });

            if (countryCode && countryCode !== hqCode) {
              trackerCountrySet.add(countryCode);
            }
          }
        }
      }

      const trackerCountries = Array.from(trackerCountrySet)
        .map((code) => getCountryByCode(code))
        .filter((c): c is CountryCoordinate => c !== null)
        .filter((c, index, self) =>
          index === self.findIndex((t) => t.name === c.name)
        );

      const privacyQuote = lang === "en"
        ? manual?.privacy_policy_quote_en || manual?.privacy_policy_quote
        : manual?.privacy_policy_quote;

      flows.push({
        serviceSlug: service.slug,
        serviceName: manual?.name || service.name,
        serviceLogo: manual?.logo || service.logo,
        headquartersCode: hqCode,
        headquarters,
        transferDestinations,
        trackerCountries,
        trackers,
        outsideEU: manual?.outside_eu_storage ?? !headquarters?.isEU,
        sanctioned: manual?.sanctioned_by_cnil ?? false,
        privacyQuote: privacyQuote?.replace(/<br\s*\/?>/gi, " "),
      });
    }

    return flows.sort((a, b) => {
      const countA = a.transferDestinations.length + a.trackerCountries.length;
      const countB = b.transferDestinations.length + b.trackerCountries.length;
      return countB - countA;
    });
  }, [selectedServices, manualData, exodusData, trackersMap, lang]);

  // Filtered data flows based on selected service
  const filteredFlows = useMemo(() => {
    if (!selectedServiceSlug) return dataFlows;
    return dataFlows.filter((f) => f.serviceSlug === selectedServiceSlug);
  }, [dataFlows, selectedServiceSlug]);

  // Notify parent of analysis completion
  useEffect(() => {
    if (!loading && onAnalysisComplete) {
      onAnalysisComplete(dataFlows);
    }
  }, [dataFlows, loading, onAnalysisComplete]);


  // User location
  const userLocation = getUserLocation();

  // Zoom controls
  const handleZoomIn = () => setZoom(Math.min(zoom * 1.5, 8));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.5, 1));
  const handleResetView = () => {
    setZoom(4);
    setCenter([10, 45]);
  };

  // Handle marker click for tooltip
  const handleMarkerClick = useCallback(
    (
      event: React.MouseEvent,
      type: TooltipData["type"],
      countryInfo: CountryCoordinate,
      flow?: DataFlow,
      trackerNames?: string[],
      usedByServices?: string[]
    ) => {
      const rect = (event.target as Element).closest("svg")?.getBoundingClientRect();
      if (!rect) return;

      const additionalInfo: string[] = [];

      if (type === "headquarters" && flow) {
        if (flow.transferDestinations.length > 0) {
          additionalInfo.push(
            `${t(lang, "transfersTo")} ${flow.transferDestinations.length} ${t(lang, "countries")}`
          );
        }
        if (flow.trackers.length > 0) {
          additionalInfo.push(
            `${flow.trackers.length} ${t(lang, "trackers")}`
          );
        }
      }

      if (type === "transfer" && flow) {
        additionalInfo.push(`${t(lang, "dataStoredIn")} ${lang === "fr" ? countryInfo.name : countryInfo.nameEn}`);
      }

      setTooltipData({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top - 20,
        type,
        serviceName: flow?.serviceName,
        serviceLogo: flow?.serviceLogo,
        countryName: lang === "fr" ? countryInfo.name : countryInfo.nameEn,
        countryCode: countryInfo.code,
        isEU: countryInfo.isEU,
        additionalInfo,
        trackerNames,
        sanctioned: flow?.sanctioned,
        usedByServices,
      });
    },
    [lang]
  );

  // Check if a flow should show transfers
  const shouldShowTransfers = (isEU?: boolean) => {
    if (isEU === undefined) return visibleLayers.transfersEU || visibleLayers.transfersOutsideEU;
    return isEU ? visibleLayers.transfersEU : visibleLayers.transfersOutsideEU;
  };

  // Check if a flow should show trackers
  const shouldShowTrackers = () => {
    return visibleLayers.trackers;
  };

  // Check if a flow is dimmed (not selected)
  const isFlowDimmed = (flow: DataFlow) => {
    return selectedServiceSlug !== null && selectedServiceSlug !== flow.serviceSlug;
  };

  if (selectedServices.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center py-16">
          <Globe className="w-16 h-16 text-base-content/30 mb-4" />
          <h3 className="text-lg font-semibold text-base-content/60">
            {t(lang, "selectServices")}
          </h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center py-16">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-base-content/70">{t(lang, "loadingMap")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar removed as requested */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card bg-slate-900 shadow-xl overflow-hidden">
            <div className="card-body p-0 relative">
              {/* Rich Tooltip */}
              <AnimatePresence>
                {tooltipData && (
                  <RichTooltip
                    data={tooltipData}
                    lang={lang}
                    onClose={() => setTooltipData(null)}
                  />
                )}
              </AnimatePresence>

              <ComposableMap
                projection="geoEqualEarth"
                projectionConfig={{
                  scale: 160,
                  center: [0, 0],
                }}
                className="w-full h-112.5 md:h-137.5"
                onClick={() => setTooltipData(null)}
              >
                <ZoomableGroup
                  zoom={zoom}
                  center={center}
                  onMoveEnd={({ coordinates, zoom: newZoom }) => {
                    setCenter(coordinates);
                    setZoom(newZoom);
                  }}
                  minZoom={1}
                  maxZoom={8}
                  filterZoomEvent={(evt: any) => evt.type !== 'wheel'}
                >
                  {/* Background */}
                  <rect x={-1000} y={-1000} width={3000} height={3000} fill="#0f172a" />

                  {/* Countries */}
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#1e293b"
                          stroke="#334155"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#1e293b", outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {/* Data flow lines */}
                  {filteredFlows.map((flow, flowIndex) => {
                    if (!flow.headquarters?.coordinates) return null;
                    const isDimmed = isFlowDimmed(flow);

                    return (
                      <g key={flow.serviceSlug}>
                        {/* Line from user to headquarters */}
                        <AnimatedArc
                          start={userLocation.coordinates}
                          end={flow.headquarters.coordinates}
                          color="#06b6d4"
                          delay={flowIndex * 0.2}
                          strokeWidth={1.5}
                          isDimmed={isDimmed}
                          zoom={zoom}
                          onClick={(e) =>
                            handleMarkerClick(
                              e,
                              "headquarters",
                              flow.headquarters!,
                              flow
                            )
                          }
                        />

                        {/* Transfer lines */}
                        {flow.transferDestinations.map((dest, destIndex) =>
                          dest.coordinates && shouldShowTransfers(dest.isEU) ? (
                            <AnimatedArc
                              key={`${flow.serviceSlug}-transfer-${dest.code}`}
                              start={flow.headquarters!.coordinates}
                              end={dest.coordinates}
                              color={dest.isEU ? "#22c55e" : "#ef4444"}
                              delay={flowIndex * 0.2 + destIndex * 0.1 + 0.3}
                              strokeWidth={1}
                              isDimmed={isDimmed}
                              zoom={zoom}
                              onClick={(e) =>
                                handleMarkerClick(
                                  e,
                                  "transfer",
                                  dest,
                                  flow
                                )
                              }
                            />
                          ) : null
                        )}

                        {/* Tracker lines */}
                        {shouldShowTrackers() &&
                          flow.trackerCountries.map((tc, tcIndex) =>
                            tc.coordinates ? (
                              <AnimatedArc
                                key={`${flow.serviceSlug}-tracker-${tc.code}`}
                                start={flow.headquarters!.coordinates}
                                end={tc.coordinates}
                                color={tc.isEU ? "#a78bfa" : "#f472b6"}
                                delay={flowIndex * 0.2 + tcIndex * 0.1 + 0.5}
                                strokeWidth={0.8}
                                isDimmed={isDimmed}
                                zoom={zoom}
                                onClick={(e) =>
                                  handleMarkerClick(
                                    e,
                                    "tracker",
                                    tc,
                                    flow
                                  )
                                }
                              />
                            ) : null
                          )}
                      </g>
                    );
                  })}

                  {/* User location marker */}
                  <PulsingMarker
                    coordinates={userLocation.coordinates}
                    color="#22d3ee"
                    type="user"
                    zoom={zoom}
                    onClick={(e) => handleMarkerClick(e as unknown as React.MouseEvent, "user", userLocation)}
                    onMouseEnter={(e) => handleMarkerClick(e, "user", userLocation)}
                  />

                  {/* Headquarters markers */}
                  {filteredFlows.map((flow, index) => {
                    if (!flow.headquarters?.coordinates) return null;
                    const isDimmed = isFlowDimmed(flow);

                    return (
                      <PulsingMarker
                        key={`hq-${flow.serviceSlug}`}
                        coordinates={flow.headquarters.coordinates}
                        color={flow.headquarters.isEU ? "#22c55e" : "#f59e0b"}
                        type="headquarters"
                        delay={index * 0.2 + 0.2}
                        isDimmed={isDimmed}
                        isHighlighted={selectedServiceSlug === flow.serviceSlug}
                        zoom={zoom}
                        onClick={(e) =>
                          handleMarkerClick(
                            e as unknown as React.MouseEvent,
                            "headquarters",
                            flow.headquarters!,
                            flow
                          )
                        }
                        onMouseEnter={(e) =>
                          handleMarkerClick(e, "headquarters", flow.headquarters!, flow)
                        }
                      />
                    );
                  })}

                  {/* Transfer destination markers */}
                  {filteredFlows.flatMap((flow, flowIndex) =>
                    flow.transferDestinations
                      .filter((dest) => dest.coordinates && shouldShowTransfers(dest.isEU))
                      .map((dest, destIndex) => {
                        const isDimmed = isFlowDimmed(flow);
                        const usedByServices = filteredFlows
                          .filter((f) =>
                            f.transferDestinations.some((d) => d.code === dest.code)
                          )
                          .map((f) => f.serviceName);

                        return (
                            <PulsingMarker
                              key={`transfer-${flow.serviceSlug}-${dest.code}`}
                              coordinates={dest.coordinates}
                              color={dest.isEU ? "#22c55e" : "#ef4444"}
                              type="transfer"
                              delay={flowIndex * 0.2 + destIndex * 0.1 + 0.5}
                              isDimmed={isDimmed}
                              zoom={zoom}
                              onClick={(e) =>
                                handleMarkerClick(
                                  e as unknown as React.MouseEvent,
                                  "transfer",
                                  dest,
                                  flow,
                                  undefined,
                                  usedByServices
                                )
                              }
                              onMouseEnter={(e) =>
                                handleMarkerClick(e, "transfer", dest, flow, undefined, usedByServices)
                              }
                            />
                          );
                        })
                    )}

                  {/* Tracker country markers */}
                  {shouldShowTrackers() &&
                    filteredFlows.flatMap((flow, flowIndex) =>
                      flow.trackerCountries
                        .filter((tc) => tc.coordinates)
                        .map((tc, tcIndex) => {
                          const isDimmed = isFlowDimmed(flow);
                          const trackersInCountry = flow.trackers
                            .filter((t) => t.country?.code === tc.code)
                            .map((t) => t.name);
                          const usedByServices = filteredFlows
                            .filter((f) =>
                              f.trackerCountries.some((t) => t.code === tc.code)
                            )
                            .map((f) => f.serviceName);

                          return (
                            <PulsingMarker
                              key={`tracker-${flow.serviceSlug}-${tc.code}`}
                              coordinates={tc.coordinates}
                              color={tc.isEU ? "#a78bfa" : "#f472b6"}
                              type="tracker"
                              delay={flowIndex * 0.2 + tcIndex * 0.1 + 0.7}
                              isDimmed={isDimmed}
                              zoom={zoom}
                              onClick={(e) =>
                                handleMarkerClick(
                                  e as unknown as React.MouseEvent,
                                  "tracker",
                                  tc,
                                  flow,
                                  trackersInCountry,
                                  usedByServices
                                )
                              }
                              onMouseEnter={(e) =>
                                handleMarkerClick(e, "tracker", tc, flow, trackersInCountry, usedByServices)
                              }
                            />
                          );
                        })
                    )}
                </ZoomableGroup>
              </ComposableMap>

              {/* Legend overlay */}
              <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-white text-xs shadow-lg border border-slate-700">
                <div className="font-semibold mb-2">{t(lang, "legend")}</div>
                <div className="space-y-2">
                  <button
                    className={`flex items-center gap-2 w-full text-left transition-opacity ${visibleLayers.user ? "opacity-100" : "opacity-50"}`}
                    onClick={() => setVisibleLayers(prev => ({ ...prev, user: !prev.user }))}
                  >
                    <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.5)]"></span>
                    <span>{t(lang, "yourLocation")}</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 w-full text-left transition-opacity ${visibleLayers.hq ? "opacity-100" : "opacity-50"}`}
                    onClick={() => setVisibleLayers(prev => ({ ...prev, hq: !prev.hq }))}
                  >
                    <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.5)]"></span>
                    <span>{t(lang, "headquarters")}</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 w-full text-left transition-opacity ${visibleLayers.transfersEU ? "opacity-100" : "opacity-50"}`}
                    onClick={() => setVisibleLayers(prev => ({ ...prev, transfersEU: !prev.transfersEU }))}
                  >
                    <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                    <span>{t(lang, "euSafe")}</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 w-full text-left transition-opacity ${visibleLayers.transfersOutsideEU ? "opacity-100" : "opacity-50"}`}
                    onClick={() => setVisibleLayers(prev => ({ ...prev, transfersOutsideEU: !prev.transfersOutsideEU }))}
                  >
                    <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span>
                    <span>{t(lang, "outsideEU")}</span>
                  </button>
                  <button
                    className={`flex items-center gap-2 w-full text-left transition-opacity ${visibleLayers.trackers ? "opacity-100" : "opacity-50"}`}
                    onClick={() => setVisibleLayers(prev => ({ ...prev, trackers: !prev.trackers }))}
                  >
                    <span className="w-3 h-3 rounded-full bg-pink-400 shadow-[0_0_5px_rgba(244,114,182,0.5)]"></span>
                    <span>{t(lang, "trackerCountry")}</span>
                  </button>
                </div>
              </div>

              {/* Zoom controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-1 text-white shadow-lg border border-slate-700 flex flex-col gap-1">
                  <button
                    className="p-2 hover:bg-slate-700 rounded transition-colors"
                    onClick={handleZoomIn}
                    title={t(lang, "zoomIn")}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 hover:bg-slate-700 rounded transition-colors"
                    onClick={handleZoomOut}
                    title={t(lang, "zoomOut")}
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <div className="h-px bg-slate-700 my-0.5" />
                  <button
                    className="p-2 hover:bg-slate-700 rounded transition-colors"
                    onClick={handleResetView}
                    title={t(lang, "resetView")}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service list panel */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4">
              <h3 className="card-title text-lg mb-2">
                <Building2 className="w-5 h-5" />
                {t(lang, "dataFlow")}
              </h3>
              <p className="text-xs text-base-content/60 mb-4">
                {t(lang, "clickToFilter")}
              </p>

              <div className="space-y-3 max-h-125 overflow-y-auto">
                {dataFlows.map((flow) => {
                  const isSelected = selectedServiceSlug === flow.serviceSlug;

                  return (
                    <motion.div
                      key={flow.serviceSlug}
                      layout
                      className={`rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary"
                          : "border-base-300 hover:border-base-400"
                      }`}
                      onClick={() =>
                        setSelectedServiceSlug(isSelected ? null : flow.serviceSlug)
                      }
                    >
                      <div className="p-3">
                        <div className="flex items-center gap-3">
                          {flow.serviceLogo && (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0">
                              <Image
                                src={flow.serviceLogo}
                                alt={flow.serviceName}
                                fill
                                className="object-contain p-1"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{flow.serviceName}</div>
                            <div className="text-xs text-base-content/60 flex items-center gap-1 text-black">
                              <MapPin className="w-3 h-3" />
                              {flow.headquarters
                                ? lang === "fr"
                                  ? flow.headquarters.name
                                  : flow.headquarters.nameEn
                                : "?"}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {flow.trackers.length > 0 && (
                              <div className="tooltip" data-tip={`${flow.trackers.length} ${t(lang, "trackers")}`}>
                                <Eye className="w-4 h-4 text-purple-500" />
                              </div>
                            )}
                            {flow.sanctioned && (
                              <div className="tooltip" data-tip="CNIL">
                                <ShieldAlert className="w-4 h-4 text-orange-500" />
                              </div>
                            )}
                            {flow.outsideEU ? (
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                            ) : (
                              <Shield className="w-4 h-4 text-green-500" />
                            )}
                            {selectedServiceSlug === flow.serviceSlug ? (
                              <ChevronUp className="w-4 h-4 text-base-content/40" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-base-content/40" />
                            )}
                          </div>
                        </div>

                        {/* Summary badges */}
                        {(flow.transferDestinations.length > 0 || flow.trackerCountries.length > 0) && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {flow.transferDestinations
                              .filter(dest => shouldShowTransfers(dest.isEU))
                              .slice(0, 2).map((dest) => (
                                    <span
                                        key={dest.code}
                                        className={`text-white badge badge-xs ${dest.isEU ? "badge-success bg-green-800 border-green-800 text-white" : "badge-error border-red-800 bg-red-800 text-white"}`}
                                    >
                                  {lang === "fr" ? dest.name : dest.nameEn}
                                </span>
                                ))}
                            {/*{visibleLayers.trackers &&*/}
                            {/*  flow.trackerCountries.slice(0, 2).map((tc) => (*/}
                            {/*    <span*/}
                            {/*      key={`tc-${tc.code}`}*/}
                            {/*      className="badge badge-xs bg-purple-500 text-white border-purple-500"*/}
                            {/*    >*/}
                            {/*      {lang === "fr" ? tc.name : tc.nameEn}*/}
                            {/*    </span>*/}
                            {/*  ))}*/}
                            {(flow.transferDestinations.length + flow.trackerCountries.length) > 4 && (
                              <span className="badge badge-xs badge-ghost">
                                +{flow.transferDestinations.length + flow.trackerCountries.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {selectedServiceSlug === flow.serviceSlug && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 pt-0 border-t border-base-200 mt-2">
                              <div className="flex items-center gap-2 text-xs text-base-content/70 my-3 flex-wrap">
                                {/*<span className="badge badge-sm badge-info text-white">{t(lang, "from")}</span>*/}
                                {/*<span>France</span>*/}
                                <ArrowRight className="w-3 h-3" />
                                <span className="badge badge-sm badge-warning text-white bg-orange-600">
                                  {flow.headquarters
                                    ? lang === "fr"
                                      ? flow.headquarters.name
                                      : flow.headquarters.nameEn
                                    : "?"}
                                </span>
                              </div>

                              {flow.transferDestinations.some(dest => shouldShowTransfers(dest.isEU)) && (
                                <div className="mb-3">
                                  <div className="text-xs font-semibold text-base-content/60 mb-1">
                                    {t(lang, "dataTransfer")}
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {flow.transferDestinations
                                      .filter(dest => shouldShowTransfers(dest.isEU))
                                      .map((dest) => (
                                      <span
                                        key={dest.code}
                                        className={`text-white badge badge-sm ${dest.isEU ? "badge-success bg-green-700" : "badge-error bg-red-700"}`}
                                      >
                                        {dest.isEU ? (
                                          <Shield className="w-3 h-3 mr-1" />
                                        ) : (
                                          <AlertTriangle className="w-3 h-3 mr-1" />
                                        )}
                                        {lang === "fr" ? dest.name : dest.nameEn}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {visibleLayers.trackers && flow.trackers.length > 0 && (
                                <div className="mb-3">
                                  <div className="text-xs font-semibold text-base-content/60 mb-1">
                                    {t(lang, "trackers")} ({flow.trackers.length})
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {flow.trackers.slice(0, 8).map((tracker) => (
                                      <span
                                        key={tracker.id}
                                        className={`badge badge-sm ${
                                          tracker.country?.isEU
                                            ? "bg-purple-200 text-purple-800"
                                            : "bg-pink-200 text-pink-800"
                                        }`}
                                        title={tracker.countryName}
                                      >
                                        <Eye className="w-3 h-3 mr-1" />
                                        {tracker.name.length > 15
                                          ? tracker.name.slice(0, 15) + "..."
                                          : tracker.name}
                                      </span>
                                    ))}
                                    {flow.trackers.length > 8 && (
                                      <span className="badge badge-sm badge-ghost">
                                        +{flow.trackers.length - 8}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {flow.privacyQuote && (
                                <div className="bg-base-200 rounded-lg p-3 text-xs">
                                  <div className="flex items-center gap-1 text-base-content/60 mb-1">
                                    <Info className="w-3 h-3" />
                                    {t(lang, "privacyQuote")}
                                  </div>
                                  <p className="text-base-content/80 italic line-clamp-3">
                                    &quot;{flow.privacyQuote}&quot;
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Alternative list view */}
      {isMobile && (
        <div className="card bg-base-100 shadow-xl md:hidden">
          <div className="card-body">
            <h3 className="card-title text-lg">
              <Globe className="w-5 h-5" />
              {t(lang, "mobileListView")}
            </h3>
            <div className="space-y-4 mt-4">
              {filteredFlows.map((flow) => (
                <div key={flow.serviceSlug} className="border-l-4 border-primary pl-4 py-2">
                  <div className="font-semibold">{flow.serviceName}</div>
                  <div className="text-sm text-base-content/70 space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                      <span>{t(lang, "userOrigin")}: France</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                      <span>
                        {t(lang, "companyHQ")}:{" "}
                        {flow.headquarters
                          ? lang === "fr"
                            ? flow.headquarters.name
                            : flow.headquarters.nameEn
                          : "?"}
                      </span>
                    </div>
                    {flow.transferDestinations.some(dest => shouldShowTransfers(dest.isEU)) && (
                      <div className="flex items-start gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500 mt-1"></span>
                        <div>
                          <span>{t(lang, "transferDest")}:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {flow.transferDestinations
                              .filter(dest => shouldShowTransfers(dest.isEU))
                              .map((dest) => (
                              <span
                                key={dest.code}
                                className={`badge badge-xs ${dest.isEU ? "badge-success" : "badge-error"}`}
                              >
                                {lang === "fr" ? dest.name : dest.nameEn}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {visibleLayers.trackers && flow.trackers.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-500 mt-1"></span>
                        <div>
                          <span>
                            {t(lang, "trackers")} ({flow.trackers.length}):
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {flow.trackerCountries.map((tc) => (
                              <span
                                key={tc.code}
                                className="badge badge-xs bg-purple-500 text-white"
                              >
                                {lang === "fr" ? tc.name : tc.nameEn}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
