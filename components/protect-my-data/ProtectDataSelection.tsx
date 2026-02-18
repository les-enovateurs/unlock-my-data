import { Search, ArrowRight } from "lucide-react";
import dict from "../../i18n/ProtectMyData.json";
import Translator from "../tools/t";
import { Service } from "@/constants/protectData";
import { DeletionServiceCard } from "../shared";

interface ProtectDataSelectionProps {
  lang: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSlugs: Set<string>;
  riskStats: {
    highCount: number;
    mediumCount: number;
    lowCount: number;
    breachCount: number;
    cnilCount: number;
    noDeletionMethodCount: number;
    outsideEUCount: number;
    gaugePercent: number;
  };
  filteredServices: Service[];
  toggleService: (slug: string) => void;
  quickRiskCache: Record<string, "high" | "medium" | "low" | "unknown">;
  goToAnalysis: () => void;
}

export default function ProtectDataSelection({
  lang,
  searchQuery,
  setSearchQuery,
  selectedSlugs,
  riskStats,
  filteredServices,
  toggleService,
  quickRiskCache,
  goToAnalysis,
}: ProtectDataSelectionProps) {
  const t = new Translator(dict, lang);

  // Get risk badge for service card (local helper)
  const getRiskBadge = (slug: string) => {
    const risk = quickRiskCache[slug];
    if (risk === "high")
      return { color: "badge-error", text: t.t("highRisk") };
    if (risk === "medium")
      return { color: "badge-warning", text: t.t("mediumRisk") };
    if (risk === "low")
      return { color: "badge-success", text: t.t("lowRisk") };
    return { color: "badge-ghost", text: t.t("unknownRisk") };
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">
            📋 {t.t("selectServicesTitle")}
          </h2>
          <p className="text-base-content/70">
            {t.t("selectServicesDesc")}
          </p>

          {/* Search */}
          <div className="form-control mt-4">
            <div className="relative flex items-center">
              <input
                type="text"
                className="px-5 py-3 pl-12 bg-white rounded-xl border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 w-full"
                placeholder={t.t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {selectedSlugs.size > 0 && (
            <div className="mt-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Selected services */}
                <div className="bg-primary/10 rounded-xl p-4 text-center border border-primary/20">
                  <div className="text-3xl font-bold text-primary">
                    {selectedSlugs.size}
                  </div>
                  <div className="text-xs text-primary/70 mt-1">
                    {t.t("servicesSelected")}
                  </div>
                </div>

                {/* High risk */}
                {riskStats.highCount > 0 && (
                  <div className="bg-error/10 rounded-xl p-4 text-center border border-error/20">
                    <div className="text-3xl font-bold text-error">
                      {riskStats.highCount}
                    </div>
                    <div className="text-xs text-error/70 mt-1">
                      {t.t("highRisk")}
                    </div>
                  </div>
                )}

                {/* Medium risk */}
                {riskStats.mediumCount > 0 && (
                  <div className="bg-warning/10 rounded-xl p-4 text-center border border-warning/20">
                    <div className="text-3xl font-bold text-warning">
                      {riskStats.mediumCount}
                    </div>
                    <div className="text-xs text-warning/70 mt-1">
                      {t.t("mediumRisk")}
                    </div>
                  </div>
                )}

                {/* Data breaches */}
                {riskStats.breachCount > 0 && (
                  <div className="bg-red-500/10 rounded-xl p-4 text-center border border-red-500/20">
                    <div className="text-3xl font-bold text-red-600">
                      {riskStats.breachCount}
                    </div>
                    <div className="text-xs text-red-600/70 mt-1 ">
                      {t.t("breachDetected")}
                    </div>
                  </div>
                )}

                {/* CNIL sanctions */}
                {riskStats.cnilCount > 0 && (
                  <div className="bg-orange-500/10 rounded-xl p-4 text-center border border-orange-500/20">
                    <div className="text-3xl font-bold text-orange-600">
                      {riskStats.cnilCount}
                    </div>
                    <div className="text-xs text-orange-600/70 mt-1">
                      {t.t("cnilSanctionDetected")}
                    </div>
                  </div>
                )}

                {/* No deletion method */}
                {riskStats.noDeletionMethodCount > 0 && (
                  <div className="bg-yellow-500/10 rounded-xl p-4 text-center border border-yellow-500/20">
                    <div className="text-3xl font-bold text-yellow-600">
                      {riskStats.noDeletionMethodCount}
                    </div>
                    <div className="text-xs text-yellow-600/70 mt-1">
                      {t.t("noDeletionMethod")}
                    </div>
                  </div>
                )}

                {/* Outside EU */}
                {riskStats.outsideEUCount > 0 && (
                  <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
                    <div className="text-3xl font-bold text-blue-600">
                      {riskStats.outsideEUCount}
                    </div>
                    <div className="text-xs text-blue-600/70 mt-1">
                      {t.t("outsideEUServices")}
                    </div>
                  </div>
                )}

                {/* Low risk (only if there are some) */}
                {riskStats.lowCount > 0 && (
                  <div className="bg-success/10 rounded-xl p-4 text-center border border-success/20">
                    <div className="text-3xl font-bold text-success">
                      {riskStats.lowCount}
                    </div>
                    <div className="text-xs text-success/70 mt-1">
                      {t.t("lowRisk")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => {
          const isSelected = selectedSlugs.has(service.slug);
          const riskBadge = getRiskBadge(service.slug);
          return (
            <div key={service.slug} className="relative">
              <DeletionServiceCard
                service={{
                  slug: service.slug,
                  name: service.name,
                  logo: service.logo,
                  nationality: service.nationality || service.country_name || "International"
                }}
                isSelected={isSelected}
                onToggle={toggleService}
              />
            </div>
          );
        })}
      </div>

      {/* Sticky Continue Button - Step 1 */}
      {selectedSlugs.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            className="btn btn-primary btn-lg shadow-2xl gap-2"
            onClick={goToAnalysis}
          >
            {t.t("continueToAnalysis")} ({selectedSlugs.size})
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

