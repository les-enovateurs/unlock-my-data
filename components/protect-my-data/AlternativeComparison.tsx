"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Search, ExternalLink, Globe } from "lucide-react";
import allServices from "@/public/data/services.json";
import permissionsDataRawEn from "@/public/data/compare/permissions.json";
import permissionsDataRawFr from "@/public/data/compare/permissions_fr.json";
import trackersDataRaw from "@/public/data/compare/trackers.json";
import ReactMarkdown from "react-markdown";
import { EU_COUNTRIES } from "@/constants/euCountries";

interface ServiceMeta {
  slug: string;
  name: string;
  logo: string;
  exodus?: string;
  country_code?: string;
  country_name?: string;
}

interface AppPermissions {
  handle: string;
  app_name: string;
  permissions: string[];
  trackers: number[];
}

interface Tracker {
  id: number;
  name: string;
  country: string;
}

interface Permission {
  name: string;
  description: string;
  label: string;
  protection_level: string;
}

interface ServiceCardData {
  slug: string;
  name: string;
  logo: string;
  dangerousCount: number | null;
  trackerCount: number | null;
  riskScore: number;
  country_code?: string;
  country_name?: string;
  isEu?: boolean;
  betterAlternative?: boolean;
  betterAlternativeExplication?: string;
  betterAlternativeExplicationEn?: string;
}

interface AlternativeComparisonProps {
  lang: string;
  currentSlug: string;
  alternativeSlugs: string[];
  selectedAlternative: string;
  onSelectAlternative: (slug: string) => void;
}

// Translations used in this component
const tKeys = {
  fr: {
    currentService: "Actuel",
    alternatives: "Alternatives",
    fairlyReliable: "Fiable",
    critical: "Critique",
    monitorClosely: "À surveiller",
    moderateRisk: "Modéré",
    unknownData: "—",
    sensitivePerms: "perms.",
    adTrackers: "traqueurs",
    legalIssues: "points jur.",
    chooseThis: "Choisir",
    currentLabel: "Actuel",
    loading: "Chargement…",
    searchPlaceholder: "Chercher une autre solution…",
    searchNoResult: "Aucun résultat",
    suggestSolution: "Proposer une solution",
    suggestSolutionHint: "Vous connaissez une alternative ? Contribuez !",
    euService: "Service EU",
    betterAlternativeLabel: "Meilleure alternative",
  },
  en: {
    currentService: "Current",
    alternatives: "Alternatives",
    fairlyReliable: "Reliable",
    critical: "Critical",
    monitorClosely: "Monitor",
    moderateRisk: "Moderate",
    unknownData: "—",
    sensitivePerms: "perms",
    adTrackers: "trackers",
    legalIssues: "legal pts",
    chooseThis: "Choose",
    currentLabel: "Current",
    loading: "Loading…",
    searchPlaceholder: "Search another solution…",
    searchNoResult: "No results",
    suggestSolution: "Suggest a solution",
    suggestSolutionHint: "Know a good alternative? Contribute!",
    euService: "EU Service",
    betterAlternativeLabel: "Better alternative",
  },
};

function computeRiskScore(
  trackerCount: number | null,
  isEu: boolean,
  betterAlternative: boolean | null
): number {
  let score = 0;

  if (isEu) {
    score -= 10;
  } else {
    score += 10;
  }

  const t = trackerCount ?? 0;
  score += (t * 2);

  if (betterAlternative) {
    score -= 10;
  }

  return score;
}

async function loadServiceCardData(
  service: ServiceMeta & { better_alternative?: boolean, better_alternative_explication?: string, better_alternative_explication_en?: string },
  dangerousPermsList: Permission[],
  trackers: Tracker[]
): Promise<ServiceCardData> {
  const [compareRes] = await Promise.all([
    fetch(`/data/compare/${service.slug}.json`).catch(() => null)
  ]);

  const compareModule = compareRes && compareRes.ok ? await compareRes.json() : null;

  const appPerms: AppPermissions | null =
    service.exodus && compareModule ? compareModule : null;

  const dangerousCount =
    appPerms !== null
      ? dangerousPermsList.filter((p) => appPerms.permissions.includes(p.name)).length
      : null;

  const trackerCount =
    appPerms !== null
      ? trackers.filter((tr) => appPerms.trackers?.includes(tr.id)).length
      : null;

  const isEu = service.country_code ? EU_COUNTRIES.has(service.country_code.toLowerCase()) : false;
  const riskScore = computeRiskScore(trackerCount, isEu, service.better_alternative || null);

  return {
    slug: service.slug,
    name: service.name,
    logo: service.logo,
    dangerousCount,
    trackerCount,
    riskScore,
    country_code: service.country_code,
    country_name: service.country_name,
    isEu,
    betterAlternative: service.better_alternative,
    betterAlternativeExplication: service.better_alternative_explication,
    betterAlternativeExplicationEn: service.better_alternative_explication_en
  };
}

export default function AlternativeComparison({
  lang,
  currentSlug,
  alternativeSlugs,
  selectedAlternative,
  onSelectAlternative,
}: AlternativeComparisonProps) {
  const t = tKeys[lang as "fr" | "en"] ?? tKeys.fr;
  const [cards, setCards] = useState<ServiceCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // Keep track of manually added slugs (from search) to keep them visible
  const [userAddedSlugs, setUserAddedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedAlternative) {
      setUserAddedSlugs(prev => {
        const newSet = new Set(prev);
        newSet.add(selectedAlternative);
        return newSet;
      });
    }
  }, [selectedAlternative]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setCards([]);

    // Load ALL alternatives to sort them properly
    // Also include user added slugs so they persist
    const allUniqueSlugs = new Set([currentSlug, ...alternativeSlugs, ...Array.from(userAddedSlugs)]);
    if (selectedAlternative) {
      allUniqueSlugs.add(selectedAlternative);
    }

    const allSlugs = Array.from(allUniqueSlugs);
    const services = allSlugs
      .map((slug) => (allServices as ServiceMeta[]).find((s) => s.slug === slug))
      .filter(Boolean) as ServiceMeta[];

    const permissionsDataRaw =
      lang === "fr" ? permissionsDataRawFr : permissionsDataRawEn;

    const dangerousPermsList: Permission[] = Object.values(
      (permissionsDataRaw as any)[0].permissions
    )
      .filter((p: any) => p.protection_level.includes("dangerous"))
      .map((p: any) => ({ ...p, description: p.description || p.name }));

    const trackers: Tracker[] = trackersDataRaw as unknown as Tracker[];

    Promise.all(
      services.map((s) => loadServiceCardData(s, dangerousPermsList, trackers))
    ).then((results) => {
      if (!cancelled) {
        // Find current card
        const current = results.find(c => c.slug === currentSlug);

        // Filter out current and sort alternatives
        let alts = results
          .filter(c => c.slug !== currentSlug)
          .sort((a, b) => {
            // New sorting logic requested:
            // If current service is EU, target the one with lowest score (ignore EU priority for alts)
            // If current service is NOT EU, prioritize EU alternatives first, then score

            // Should user selected items be prioritized?
            // Maybe just stick to the requested sorting, but ensure we display user items if possible.

            const currentIsEu = current?.isEu ?? false;

            if (currentIsEu) {
              // Just sort by score
              return a.riskScore - b.riskScore;
            } else {
              // Prioritize EU first
              if (a.isEu && !b.isEu) return -1;
              if (!a.isEu && b.isEu) return 1;
              // Then score
              return a.riskScore - b.riskScore;
            }
          });

        // We want to show:
        // 1. User selected/added items (prioritized)
        // 2. Best alternatives from the original list

        // Identify which cards are from user interaction
        const userCards = alts.filter(a => userAddedSlugs.has(a.slug) || a.slug === selectedAlternative);
        const otherCards = alts.filter(a => !userAddedSlugs.has(a.slug) && a.slug !== selectedAlternative);

        // Construct display list
        // Try to keep it around 3 items + current, but expand if user added many
        // Start with user cards
        let displayAlts = [...userCards];

        // Fill up to at least 3 with best others
        // If we have space in a 4-grid (current + 3 alts = 4), let's fill it up.
        // Actually, if the grid is responsive, we might want to show more if available.
        // User complained about "3 on a grid of 4".
        // Let's aim for 4 alternatives if we have space, so total 5? Or total 4?
        // Grid is 4 cols. So total 4 cards (1 current + 3 alts) fills one row.
        // If we have 5 cards (1 current + 4 alts), it wraps and leaves 3 empty slots, which is ugly.
        // If we have 3 cards (1 current + 2 alts), it leaves 1 empty slot in a 4-grid.

        // Let's make the limit dynamic or just slightly larger and let CSS grid handle it better (using auto-fit maybe?)
        // Or firmly target 3 alternatives (total 4 cards) if available.

        const targetCount = 3; // To make 4 total with current card
        const spacesLeft = targetCount - displayAlts.length;
        if (spacesLeft > 0) {
          displayAlts = [...displayAlts, ...otherCards.slice(0, spacesLeft)];
        }

        // If we have more than 3 user cards, we show all user cards.
        // Sort the final display list again to look nice? Or keep user cards first?
        // Let's keep the user's focus (selected) and manual additions visible.
        // Maybe sort by the same logic as before to keep consistent order?

        displayAlts.sort((a, b) => {
          const currentIsEu = current?.isEu ?? false;
          if (currentIsEu) return a.riskScore - b.riskScore;

          if (a.isEu && !b.isEu) return -1;
          if (!a.isEu && b.isEu) return 1;
          return a.riskScore - b.riskScore;
        });

        // Combine current + best alternatives
        const finalCards = current ? [current, ...displayAlts] : displayAlts;

        setCards(finalCards);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [currentSlug, alternativeSlugs, userAddedSlugs, selectedAlternative, lang]);

  // Search among all services not already in the list
  const searchResults = searchQuery.trim().length > 1
    ? (allServices as ServiceMeta[])
      .filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          s.slug !== currentSlug &&
          !alternativeSlugs.includes(s.slug)
      )
      .slice(0, 5)
    : [];

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-base-content/50">
        <span className="loading loading-spinner loading-xs" />
        {t.loading}
      </div>
    );
  }

  const currentCard = cards.find((c) => c.slug === currentSlug);
  const altCards = cards.filter((c) => c.slug !== currentSlug);

  const contributeUrl = lang === "fr"
    ? "/contribuer"
    : "/contribute";

  const renderMiniCard = (card: ServiceCardData, isCurrent: boolean, isSelected: boolean) => {
    let riskColorClass = "border-base-200 bg-base-100";
    if (!isCurrent) {
      if (isSelected) {
        riskColorClass = "border-primary bg-primary/5 shadow-sm";
      } else {
        riskColorClass = "border-base-200 bg-base-100 hover:border-primary/40 hover:shadow-sm cursor-pointer";
      }
    } else {
      riskColorClass = "border-base-300 bg-base-200/50 opacity-80 cursor-default";
    }

    return (
      <div
        key={card.slug}
        role="button"
        tabIndex={0}
        onClick={() => !isCurrent && onSelectAlternative(card.slug)}
        className={`relative flex flex-col items-center gap-1 rounded-xl p-3 border transition-all w-full text-left ${!isCurrent ? "cursor-pointer" : "cursor-default"
          } ${riskColorClass}`}
      >
        {isCurrent && (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 badge badge-neutral badge-xs whitespace-nowrap px-2">
            {t.currentLabel}
          </span>
        )}

        {/* EU Badge - Right if no bonus, else stays default flow */}
        {card.isEu && !isCurrent && (
          <span className="absolute -top-2 right-2 badge badge-info badge-xs whitespace-nowrap px-1 gap-1" title={t.euService}>
            <Globe className="w-2.5 h-2.5" /> EU
          </span>
        )}

        {/* Privacy Bonus Badge - Top Left */}
        {card.betterAlternative && !isCurrent ? (
          <div className="absolute -top-2 left-2 group z-20">
            <span className="badge badge-warning badge-xs whitespace-nowrap px-1 cursor-help relative">
              🌟 {t.betterAlternativeLabel}
            </span>
            <div
              className="hidden group-hover:block absolute top-[100%] pt-1 left-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-64 p-3 bg-base-100 rounded-xl shadow-xl border border-base-200 text-xs text-left normal-case leading-snug cursor-auto">
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-medium underline" />
                    ),
                    p: ({ node, ...props }) => <p {...props} className="m-0" />
                  }}
                >
                  {lang === "fr"
                    ? (card.betterAlternativeExplication?.replace(/\\n/g, '\n') || "")
                    : (card.betterAlternativeExplicationEn?.replace(/\\n/g, '\n') || "")}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : null}

        {isSelected && !isCurrent && (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 badge badge-primary badge-xs whitespace-nowrap px-2">
            <CheckCircle className="w-2.5 h-2.5 mr-0.5" />✓
          </span>
        )}

        <img
          src={card.logo}
          alt={card.name}
          className="w-10 h-10 object-contain rounded-lg mt-2"
        />
        <p className="text-xs font-semibold text-center leading-tight truncate w-full px-1">{card.name}</p>

        {/* Nationality display with Flag */}
        <div className="text-[10px] text-base-content/70 text-center leading-tight px-1 mb-1 mt-auto">
          {card.country_code ? (
            <span className="flex items-center justify-center gap-1">
              <img
                src={`https://flagcdn.com/w20/${card.country_code.toLowerCase()}.webp`}
                srcSet={`https://flagcdn.com/w40/${card.country_code.toLowerCase()}.webp 2x`}
                width="14"
                height="10"
                alt={card.country_code}
                className="inline-block rounded-[1px] object-cover"
              />
              {card.country_name}
            </span>
          ) : (
            <span>{t.unknownData}</span>
          )}
        </div>

        {/* Tracker count display */}
        <div className="flex flex-col items-center text-[10px]">
          {card.trackerCount !== null && card.trackerCount > 0 && (
            <span className="text-[9px] font-bold opacity-90 leading-tight text-center text-error">
              {card.trackerCount} {t.adTrackers}
            </span>
          )}
          {card.trackerCount === 0 && (
            <span className="text-[9px] font-bold opacity-90 leading-tight text-center text-success">
              0 {t.adTrackers}
            </span>
          )}
        </div>

        {!isCurrent && !isSelected && (
          <span className="mt-2 text-xs text-primary font-medium">{t.chooseThis}</span>
        )}
        {isSelected && !isCurrent && (
          <span className="mt-2 text-xs text-primary font-medium flex items-center gap-0.5">
            <CheckCircle className="w-3 h-3" /> {t.chooseThis}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Cards row: current + alternatives */}
      {/* Use a responsive grid that adapts better than fixed columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {currentCard && renderMiniCard(currentCard, true, false)}
        {altCards.map((card) => renderMiniCard(card, false, selectedAlternative === card.slug))}
      </div>

      {/* Search another solution */}
      <div className="relative">
        <div className="flex items-center gap-2 rounded-lg border border-base-300 bg-base-100 px-3 py-2">
          <Search className="w-4 h-4 text-base-content/40 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-base-content/40"
          />
        </div>
        {searchQuery.trim().length > 1 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-base-200 bg-base-100 shadow-lg overflow-hidden">
            {searchResults.length === 0 ? (
              <div className="px-4 py-3 text-sm text-base-content/50">{t.searchNoResult}</div>
            ) : (
              searchResults.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => {
                    onSelectAlternative(s.slug);
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-base-200 transition-colors text-sm"
                >
                  <img src={s.logo} alt={s.name} className="w-6 h-6 object-contain rounded" />
                  <span>{s.name}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Suggest a solution */}
      <a
        href={contributeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs text-base-content/50 hover:text-primary transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        {t.suggestSolution}
      </a>
    </div>
  );
}
