"use client";
import {useEffect, useState} from "react";
import {useWindowSize} from "@/components/useWindowSize";
import Image from "next/image";
import Link from "next/link";
// import socialNetworks from "@/app/config/socialNetworks";
// Interfaces pour les permissions et trackers
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
    country: string;
}

// Interfaces pour les cas et services
interface Case {
    id: string;
    url: string;
    title: string;
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
    id: number;
    name: string;
    rating: string;
    logo: string;
    points: ServicePoint[];
}

interface ServicesState {
    [key: string]: ServiceData;
}

// Fonction utilitaire pour convertir le nom du pays en drapeau
function getCountryFlagUrl(countryName: string): {
    url: string;
    formattedName: string;
} {
    const countryISOCodes: { [key: string]: { code: string; name: string } } = {
        france: {code: "fr", name: "France"},
        "united states": {code: "us", name: "United States"},
        china: {code: "cn", name: "China"},
        "south korea": {code: "kr", name: "South Korea"},
        japan: {code: "jp", name: "Japan"},
        russia: {code: "ru", name: "Russia"},
        germany: {code: "de", name: "Germany"},
        brazil: {code: "br", name: "Brazil"},
        vietnam: {code: "vn", name: "Vietnam"},
        netherlands: {code: "nl", name: "Netherlands"},
        switzerland: {code: "ch", name: "Switzerland"},
        panama: {code: "pa", name: "Panama"},
        israel: {code: "il", name: "Israel"},
        india: {code: "in", name: "India"},
        "united kingdom": {code: "gb", name: "United Kingdom"},
        ireland: {code: "ie", name: "Ireland"},
        singapore: {code: "sg", name: "Singapore"},
    };

    const countryInfo = countryISOCodes[countryName.toLowerCase()];
    return {
        url: countryInfo
            ? `https://flagcdn.com/w20/${countryInfo.code}.png`
            : "/images/globe-icon.png",
        formattedName: countryInfo ? countryInfo.name : "Unknown",
    };
}

export default function ComparisonPage({name, file}: { name: string, file: string | undefined }) {
    // États pour les permissions et trackers
    // const configuration = require(`@/app/config/${file}.ts`).default;

    const configuration = require(`@/app/configComparatif/${file}.ts`).default;

    const [permissions, setPermissions] = useState<PermissionsState>({});
    const [dangerousPermissionsList, setDangerousPermissionsList] = useState<
        Permission[]
    >([]);
    const [trackers, setTrackers] = useState<Tracker[]>([]);

    // États pour les services
    const [services, setServices] = useState<ServicesState>({});

    // États pour le contrôle de l'interface
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sectionsOpen, setSectionsOpen] = useState({
        permissions: true,
        trackers: true,
        positivePoints: true,
        statistics: true,
    });

    const {isMobile} = useWindowSize();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Charger les permissions dangereuses
                const permissionsResponse = await fetch(
                    "/data/compare/permissions_fr.json"
                );
                const permissionsData = await permissionsResponse.json();

                const dangerousPerms = Object.values(permissionsData[0].permissions)
                    .filter((perm: Permission) =>
                        perm.protection_level.includes("dangerous")
                    )
                    .map((perm: Permission) => ({
                        ...perm,
                        description: perm.description || perm.name,
                    }));

                setDangerousPermissionsList(dangerousPerms);

                // Charger les trackers
                const trackersResponse = await fetch("/data/compare/trackers.json");
                const trackersData = await trackersResponse.json();
                setTrackers(trackersData);

                // Charger les données des applications
                const appResults: PermissionsState = {};
                for (const [key, network] of Object.entries(configuration)) {
                    try {
                        const response = await fetch(`/data/compare/${network.slug}.json`);
                        if (response.ok) {
                            const data = await response.json();
                            appResults[key] = data;
                        }
                    } catch (error) {
                        console.warn(`Erreur pour ${network.slug}:`, error);
                    }
                }
                setPermissions(appResults);

                // Charger les données des services
                const serviceResults: ServicesState = {};
                for (const [key, network] of Object.entries(configuration)) {
                    try {
                        const localResponse = await fetch(`/data/compare/tosdr/${network.slug}.json`);
                        if (localResponse.ok) {
                            const localData = await localResponse.json();
                            serviceResults[key] = {
                                name: localData.name.replace("apps", "").trim(),
                                logo: network.logo,
                                more_info: network.more_info || false,
                                slug: network.slug,
                                points: localData.points.filter(
                                    (point: ServicePoint) =>
                                        point.status === "approved" &&
                                        ["bad", "neutral", "good", "blocker"].includes(
                                            point.case.classification
                                        )
                                ),
                            };
                        }
                    } catch (localError) {
                        console.warn(`Erreur pour ${network.slug}:`, localError);
                    }
                }
                setServices(serviceResults);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Une erreur est survenue"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    function getUniqueGoodPointTitles(services: ServicesState): string[] {
        const titles = Object.values(services)
            .flatMap(service =>
                service.points
                    .filter(point => point.case.classification === "good")
                    .map(point => point.case.localized_title || point.case.title)
            );
        return Array.from(new Set(titles));
    }

    // if (isLoading) return <div className="h-9/10">Chargement des données...</div>;
    if (error) return <div>Erreur: {error}</div>;
    if (isLoading)
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-btnblue rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                    <div className="w-3 h-3 bg-btnblue rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                    <div className="w-3 h-3 bg-btnblue rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                </div>
            </div>
        );
    return (
        <div className="container mx-auto">
            {/* Section Permissions */}
            <div className="flex w-full pt-12 justify-center items-center">
                <h1 className="text-2xl font-bold ">{name}</h1>
            </div>
            <section className=" my-16 border rounded-lg shadow-sm">
                <button
                    onClick={() =>
                        setSectionsOpen((prev) => ({
                            ...prev,
                            permissions: !prev.permissions,
                        }))
                    }
                    className="w-full p-4 text-left bg-btnblue text-white flex items-center rounded-t-lg"
                >
          <span className="mr-3">
            <svg
                className={`w-5 h-5 inline transform transition-transform duration-200 ${
                    sectionsOpen.permissions ? "rotate-90" : ""
                }`}
                viewBox="0 0 24 24"
                fill="currentColor"
            >
              <path
                  d="M6 4L18 12L6 20L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
              />
            </svg>
          </span>
                    <h2 className="text-xl font-bold">
                        Permissions Dangereuses des Applications
                    </h2>
                </button>

                {sectionsOpen.permissions && (
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <div className="max-h-[600px] overflow-y-auto relative">
                                <table
                                    className="min-w-[500px] overflow-x-auto min-w-full border-collapse border border-gray-300 bg-white">
                                    <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                    <tr>
                                        <th className="border  border-gray-300 p-2 bg-btnblue text-white sticky left-0 z-20 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gray-300">
                                            Permission
                                        </th>
                                        {Object.values(configuration).map((network) => (
                                            <th
                                                key={network.slug}
                                                className="border border-gray-300 p-2 bg-btnblue text-white min-w-[120px]"
                                            >
                                                {network.more_info ? (
                                                    <Link
                                                        href={`/liste-applications/${network.slug}`}
                                                        className="underline" target={"_blank"}
                                                    >
                                                        {permissions[network.slug]?.app_name || network.name}
                                                    </Link>
                                                ) : (
                                                    <span>
                                                    {permissions[network.slug]?.app_name || network.name}
                                                  </span>
                                                )}                        </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {dangerousPermissionsList
                                        .filter((permission) =>
                                            Object.values(configuration).some((network) =>
                                                permissions[network.slug]?.permissions.includes(
                                                    permission.name
                                                )
                                            )
                                        )
                                        .map((permission) => (
                                            <tr key={permission.name}>
                                                <td
                                                    className="border border-gray-300 p-2 sticky left-0 bg-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gray-300"
                                                    title={permission.description}
                                                >
                                                    {permission.label || permission.name}
                                                </td>

                                                {Object.values(configuration).map((network) => (
                                                    <td
                                                        key={`${network.slug}-${permission.name}`}
                                                        className="border-t border-r border-b border-gray-300 p-2 text-center"
                                                    >
                                                        {permissions[network.slug]?.permissions.includes(permission.name) ? (
                                                            <div
                                                                className="flex items-center justify-center w-full h-full min-h-[40px]">
                                                                {network.more_info ? (
                                                                    <Link href={`/liste-applications/${network.slug}`} target={"_blank"}>
                                                                        <Image
                                                                            src={network.logo}
                                                                            alt={network.name}
                                                                            width={50}
                                                                            height={50}
                                                                            className="object-contain"
                                                                        />
                                                                    </Link>
                                                                ) : (
                                                                    <Image
                                                                        src={network.logo}
                                                                        alt={network.name}
                                                                        width={50}
                                                                        height={50}
                                                                        className="object-contain"
                                                                    />
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="min-h-[40px]"/>
                                                        )}
                                                    </td>
                                                ))}
                                                {/* </div> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Section Trackers */}
            <section className="my-16  border rounded-lg shadow-sm">
                <button
                    onClick={() =>
                        setSectionsOpen((prev) => ({...prev, trackers: !prev.trackers}))
                    }
                    className="w-full p-4 text-left bg-btnblue text-white flex items-center rounded-t-lg"
                >
          <span className="mr-3">
            <svg
                className={`w-5 h-5 inline transform transition-transform duration-200 ${
                    sectionsOpen.trackers ? "rotate-90" : ""
                }`}
                viewBox="0 0 24 24"
                fill="currentColor"
            >
              <path
                  d="M6 4L18 12L6 20L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
              />
            </svg>
          </span>
                    <h2 className="text-xl font-bold">Trackers des Applications</h2>
                </button>

                {sectionsOpen.trackers && (
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <div className="max-h-[600px] overflow-y-auto relative">
                                <table className="min-w-full border-collapse border border-gray-300">
                                    <thead className="sticky top-0 bg-white z-10">
                                    <tr>
                                        <th className="border border-gray-300 p-2 bg-btnblue text-white sticky left-0 z-20">
                                            Tracker
                                        </th>
                                        {!isMobile && (
                                            <th className="border border-gray-300 p-2 bg-btnblue text-white sticky  z-20">
                                                Pays
                                            </th>
                                        )}
                                        {Object.values(configuration).map((network) => (
                                            <th
                                                key={network.slug}
                                                className="border border-gray-300 p-2 bg-btnblue text-white min-w-[120px]"
                                            >
                                                {network.more_info ? (
                                                    <Link
                                                        href={`/liste-applications/${network.slug}`}
                                                        className="underline" target={"_blank"}
                                                    >
                                                        {permissions[network.slug]?.app_name || network.name}
                                                    </Link>
                                                ) : (
                                                    <span>
                                                    {permissions[network.slug]?.app_name || network.name}
                                                  </span>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {trackers
                                        .filter((tracker) =>
                                            Object.values(configuration).some((network) =>
                                                permissions[network.slug]?.trackers?.includes(
                                                    tracker.id
                                                )
                                            )
                                        )
                                        .map((tracker) => (
                                            <tr key={tracker.id}>
                                                <td className="border-t border-r border-b border-gray-300 p-2 sticky left-0 bg-white">
                                                    {tracker.name}{" "}
                                                    {isMobile && (
                                                        <img
                                                            src={getCountryFlagUrl(tracker.country).url}
                                                            alt={`Drapeau ${tracker.country}`}
                                                            className="inline-block mr-2 w-5 h-auto"
                                                            loading="lazy"
                                                        />
                                                    )}
                                                </td>
                                                {!isMobile && (
                                                    <td className="border-t border-r border-b border-gray-300 p-2  bg-white">
                                                        <img
                                                            src={getCountryFlagUrl(tracker.country).url}
                                                            alt={`Drapeau ${tracker.country}`}
                                                            className="inline-block mr-2 w-5 h-auto"
                                                            loading="lazy"
                                                        />

                                                        <span className="align-middle text-inherit font-inherit">
                                {
                                    getCountryFlagUrl(tracker.country)
                                        .formattedName
                                }
                              </span>
                                                    </td>
                                                )}
                                                {Object.values(configuration).map((network) => (
                                                    <td
                                                        key={`${network.slug}-${tracker.id}`}
                                                        className="border-t border-r border-b border-gray-300 p-2 text-center"
                                                    >
                                                        {permissions[network.slug]?.trackers.includes(tracker.id) ? (
                                                            <div className="flex items-center justify-center w-full h-full min-h-[40px]">
                                                                {network.more_info ? (
                                                                    <Link href={`/liste-applications/${network.slug}`}>
                                                                        <Image
                                                                            src={network.logo}
                                                                            alt={network.name}
                                                                            width={50}
                                                                            height={50}
                                                                            className="object-contain"
                                                                        />
                                                                    </Link>
                                                                ) : (
                                                                    <Image
                                                                        src={network.logo}
                                                                        alt={network.name}
                                                                        width={50}
                                                                        height={50}
                                                                        className="object-contain"
                                                                    />
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="min-h-[40px]" />
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
            </section>

            {/* Section Points Positifs */}
            <section className="my-16 border rounded-lg shadow-sm">
                <button
                    onClick={() =>
                        setSectionsOpen((prev) => ({
                            ...prev,
                            positivePoints: !prev.positivePoints,
                        }))
                    }
                    className="w-full p-4 text-left bg-btnblue text-white flex items-center rounded-t-lg"
                >
          <span className="mr-3">
            <svg
                className={`w-5 h-5 inline transform transition-transform duration-200 ${
                    sectionsOpen.positivePoints ? "rotate-90" : ""
                }`}
                viewBox="0 0 24 24"
                fill="currentColor"
            >
              <path
                  d="M6 4L18 12L6 20L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
              />
            </svg>
          </span>
                    <h2 className="text-xl font-bold">Points Positifs par Service</h2>
                </button>

                {sectionsOpen.positivePoints && (
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <div className="max-h-[600px] overflow-y-auto relative">
                                <table className="min-w-full border-collapse border border-gray-300">
                                    <thead className="sticky top-0 bg-white z-10">
                                    <tr>
                                        <th className="border border-gray-300 p-2 bg-btnblue text-white sticky left-0 z-20">
                                            Point Positif
                                        </th>
                                        {Object.entries(services).map(([name, service]) => (
                                            <th
                                                key={name}
                                                className="border border-gray-300 p-2 bg-btnblue text-white min-w-[120px]"
                                            >

                                                {service.more_info ? (
                                                    <Link
                                                        href={`/liste-applications/${service.slug}`}
                                                        className="underline" target={"_blank"}
                                                    >
                                                        {service.name}
                                                    </Link>
                                                ) : (
                                                    <span>
                                                    {service.name}
                                                  </span>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {getUniqueGoodPointTitles(services).map((pointTitle) => (
                                        <tr key={pointTitle}>
                                            <td className="border-t border-r border-b border-gray-300 p-2 sticky left-0 bg-white">
                                                {pointTitle}
                                            </td>
                                            {Object.entries(services).map(([name, service]) => (
                                                <td
                                                    key={`${name}-${pointTitle}`}
                                                    className="border-t border-r border-b border-gray-300 p-2 text-center"
                                                >
                                                    {service.points.some(
                                                        (point) =>
                                                            point.case.classification === "good" &&
                                                            (point.case.localized_title === pointTitle ||
                                                                point.case.title === pointTitle)
                                                    ) ? (
                                                        <div
                                                            className="flex items-center justify-center w-full h-full min-h-[40px]">
                                                            {service.more_info ? (
                                                                <Link
                                                                    href={`/liste-applications/${service.slug}`}
                                                                    target={"_blank"}
                                                                >
                                                                    <Image
                                                                        src={service.logo}
                                                                        alt={service.name}
                                                                        width={30}
                                                                        height={30}
                                                                        className="object-contain"
                                                                    />
                                                                </Link>
                                                            ) : (
                                                            <Image
                                                                src={service.logo}
                                                                alt={service.name}
                                                                width={30}
                                                                height={30}
                                                                className="object-contain"
                                                            />)}
                                                        </div>
                                                    ) : (
                                                        ""
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
            </section>

            {/* Section Statistiques */}
            <section className="my-16 border rounded-lg shadow-sm">
                <button
                    onClick={() =>
                        setSectionsOpen((prev) => ({
                            ...prev,
                            statistics: !prev.statistics,
                        }))
                    }
                    className="w-full p-4 text-left bg-btnblue text-white flex items-center rounded-t-lg"
                >
          <span className="mr-3">
            <svg
                className={`w-5 h-5 inline transform transition-transform duration-200 ${
                    sectionsOpen.statistics ? "rotate-90" : ""
                }`}
                viewBox="0 0 24 24"
                fill="currentColor"
            >
              <path
                  d="M6 4L18 12L6 20L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
              />
            </svg>
          </span>
                    <h2 className="text-xl font-bold">Statistiques par Service</h2>
                </button>

                {sectionsOpen.statistics && (
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <div className="max-h-[600px] overflow-y-auto relative">
                                <table className="min-w-full border-collapse border border-gray-300">
                                    <thead className="sticky top-0 bg-white z-10">
                                    <tr>
                                        <th className="border border-gray-300 p-2 bg-btnblue text-white w-1/5">
                                            Service
                                        </th>
                                        <th className="border min-w-[100px] border-gray-300 p-2 bg-green-400 text-white w-1/5">
                                            Bon
                                        </th>
                                        <th className="border min-w-[100px] border-gray-300 p-2 bg-yellow-400 text-white w-1/5">
                                            Neutre
                                        </th>
                                        <th className="border min-w-[100px] border-gray-300 p-2 bg-red-400 text-white w-1/5">
                                            Mauvais
                                        </th>
                                        <th className="border min-w-[100px] border-gray-300 p-2 bg-black text-white w-1/5">
                                            Bloquant
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Object.entries(services)
                                        .map(([name, service]) => {
                                            const stats = service.points.reduce(
                                                (acc, point) => {
                                                    acc[point.case.classification]++;
                                                    return acc;
                                                },
                                                {good: 0, neutral: 0, bad: 0, blocker: 0}
                                            );

                                            return {
                                                name: service.name,
                                                stats,
                                                slug: service.slug || "",
                                                more_info: service.more_info || false,
                                            };
                                        })
                                        .sort((a, b) => a.stats.good - b.stats.good) // Tri croissant sur stats.good
                                        .map(({name, stats, slug, more_info}) => (
                                            <tr key={name}>
                                                <td className="border border-gray-300 p-2 text-center">

                                                    {more_info ? (
                                                        <Link
                                                            href={`/liste-applications/${slug}`}
                                                            className="underline" target={"_blank"}
                                                        >
                                                            {name}
                                                        </Link>
                                                    ) : (
                                                        <span>
                                                    {name}
                                                  </span>
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    {stats.good}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    {stats.neutral}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    {stats.bad}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-center">
                                                    {stats.blocker}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
