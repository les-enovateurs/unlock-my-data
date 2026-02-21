"use client";

import {useState} from "react";
import SearchBar from "@/components/SearchBar";
import Card from "@/components/Card";
import servicesData from "@/public/data/services.json";
import {useLanguage} from "@/context/LanguageContext";

export interface Data {
    id: number;
    name: string;
    slug: string;
    logo: string;
    short_description: string;
    risk_level: number;
    accessibility: number;
    need_account: number;
    need_id_card: number;
    contact_mail_export: string | null;
    contact_mail_delete: string | null;
    recipient_address: string | null;
    how_to_export: string | null;
    url_delete: string | null;
    last_update_breach: string;
    number_account_impact: string | null;
    number_app: number | null;
    number_breach: number | null;
    number_permission: number | null;
    number_website: number | null;
    number_website_cookie: number | null;
    country_name: string | null;
    country_code: string | null;
    nationality: string | null;
}

export interface PaginationCards {
    totalCards: Data[];
    cardsPerPage: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

export default function Annuaire() {
    const [filteredServices, setFilteredServices] = useState<Data[]>(
        (servicesData as any[]).map((service) => ({
            id: service.id ?? 0,
            name: service.name ?? "",
            slug: service.slug ?? "",
            logo: service.logo ?? "",
            short_description: service.short_description ?? "",
            risk_level: service.risk_level ?? 0,
            accessibility: service.accessibility ?? 0,
            need_account: service.need_account ?? 0,
            need_id_card: service.need_id_card ?? 0,
            contact_mail_export: service.contact_mail_export ?? null,
            contact_mail_delete: service.contact_mail_delete ?? null,
            recipient_address: service.recipient_address ?? null,
            how_to_export: service.how_to_export ?? null,
            url_delete: service.url_delete ?? null,
            last_update_breach: service.last_update_breach ?? "",
            number_account_impact: service.number_account_impact ?? null,
            number_app: service.number_app ?? null,
            number_breach: service.number_breach ?? null,
            number_permission: service.number_permission ?? null,
            number_website: service.number_website ?? null,
            number_website_cookie: service.number_website_cookie ?? null,
            country_name: service.country_name ?? null,
            country_code: service.country_code ?? null,
            nationality: service.nationality ?? null,
        }))
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState<string>("all");
    const [selectedScore, setSelectedScore] = useState<number | "all">("all");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const itemsPerPage = 12;

    // Filtrer les pays null et les doublons
    const uniqueCountries = Array.from(
        new Set(
            servicesData
                .map((service) => service.country_name)
                .filter((country): country is string => Boolean(country))
        )
    ).sort();


    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
        applyFilters(term, selectedCountry, selectedScore, sortOrder);
    };

    const applyFilters = (
        search: string,
        country: string,
        score: number | "all",
        order: "asc" | "desc"
    ) => {
        let filtered = (servicesData as any[]).map((service) => ({
            id: service.id ?? 0,
            name: service.name ?? "",
            slug: service.slug ?? "",
            logo: service.logo ?? "",
            short_description: service.short_description ?? "",
            risk_level: service.risk_level ?? 0,
            accessibility: service.accessibility ?? 0,
            need_account: service.need_account ?? 0,
            need_id_card: service.need_id_card ?? 0,
            contact_mail_export: service.contact_mail_export ?? null,
            contact_mail_delete: service.contact_mail_delete ?? null,
            recipient_address: service.recipient_address ?? null,
            how_to_export: service.how_to_export ?? null,
            url_delete: service.url_delete ?? null,
            last_update_breach: service.last_update_breach ?? "",
            number_account_impact: service.number_account_impact ?? null,
            number_app: service.number_app ?? null,
            number_breach: service.number_breach ?? null,
            number_permission: service.number_permission ?? null,
            number_website: service.number_website ?? null,
            number_website_cookie: service.number_website_cookie ?? null,
            country_name: service.country_name ?? null,
            country_code: service.country_code ?? null,
            nationality: service.nationality ?? null,
        }));

        // Recherche
        if (search) {
            filtered = filtered.filter((service) =>
                service.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filtre par pays
        if (country !== "all") {
            filtered = filtered.filter((service) => service.country_name === country);
        }

        // Filtre par score
        if (score !== "all") {
            filtered = filtered.filter((service) => service.risk_level === score);
        }

        // Tri
        filtered.sort((a, b) => {
            if (order === "asc") {
                return (a.risk_level || 0) - (b.risk_level || 0);
            }
            return (b.risk_level || 0) - (a.risk_level || 0);
        });

        setFilteredServices(filtered);
    };

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedServices = filteredServices.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const { setLang } = useLanguage();
    setLang('en')

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* En-tête et description */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Directory of referenced services
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover and compare the privacy practices of online services.
                        Filter by country, privacy score, and more.
                    </p>
                </div>

                {/* Barre de recherche et filtres */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        <div className="col-span-full lg:col-span-1">
                            <SearchBar
                                nameSite={searchTerm}
                                setNameSite={setSearchTerm}
                                findSite={handleSearch}
                                lang={'en'}
                            />
                        </div>

                        <div>
                            <select
                                value={selectedCountry}
                                onChange={(e) => {
                                    setSelectedCountry(e.target.value);
                                    setCurrentPage(1);
                                    applyFilters(searchTerm, e.target.value, selectedScore, sortOrder);
                                }} aria-label="Pays"
                                className="select w-full rounded-lg border-gray-200 focus:border-primary focus:ring-primary"
                            >
                                <option value="all">All countries</option>
                                {uniqueCountries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Résultats */}
                <div className="mb-8">
                    <p className="text-sm text-gray-600 mb-4">
                        {filteredServices.length} services found
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedServices.map((service) => (
                            <Card key={'/liste-app/' + service.slug} {...service} />
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <div className="flex gap-2">
                            {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        currentPage === page
                                            ? "bg-primary "
                                            : "border border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
