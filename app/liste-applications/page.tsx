"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import Card from "@/components/Card";
import servicesData from "@/public/data/services.json";

export interface Data {
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
}

export interface PaginationCards {
  totalCards: Data[];
  cardsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function Annuaire() {
  const [filteredServices, setFilteredServices] = useState<Data[]>(servicesData as Data[]);
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

  const scores = [-1, 0, 1, 2, 3, 4, 5];

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
    let filtered = [...servicesData] as Data[];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête et description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Annuaire des services référencés
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez et comparez les pratiques de confidentialité des services en ligne.
            Filtrez par pays, score de confidentialité et plus encore.
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-full lg:col-span-1">
              <SearchBar
                nameSite={searchTerm}
                setNameSite={setSearchTerm}
                findSite={handleSearch}
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
                <option value="all">Tous les pays</option>
                {uniqueCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedScore}
                onChange={(e) => {
                  const value = e.target.value === "all" ? "all" : Number(e.target.value);
                  setSelectedScore(value);
                  setCurrentPage(1);
                  applyFilters(searchTerm, selectedCountry, value, sortOrder);
                }}
                aria-label={"Niveau de risque"}
                className="select w-full rounded-lg border-gray-200 focus:border-primary focus:ring-primary"
              >
                <option value="all">Tous les niveaux</option>
                {scores.map((score) => (
                  <option key={score} value={score}>
                    Score: {score}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={sortOrder}
                onChange={(e) => {
                  const value = e.target.value as "asc" | "desc";
                  setSortOrder(value);
                  applyFilters(searchTerm, selectedCountry, selectedScore, value);
                }}
                aria-label={"Tri"}
                className="select w-full rounded-lg border-gray-200 focus:border-primary focus:ring-primary"
              >
                <option value="desc">Meilleur score d'abord</option>
                <option value="asc">Plus mauvais score d'abord</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-4">
            {filteredServices.length} services trouvés
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedServices.map((service) => (
              <Card key={service.slug} {...service} />
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
              Précédent
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 