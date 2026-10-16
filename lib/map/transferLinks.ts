import { getCountryByCode, parseTransferCountries } from "@/lib/map/country-coordinates";

export type LinkOrigin = "hq" | "policy" | "tracker";

export type TransferLink = { origin: LinkOrigin; tracker?: string; company?: string };

type SourcedEntity = { name: string; country: string | null; source: string | null };

export type TrackerCompanies = {
  companies: Record<string, SourcedEntity>;
  trackers: Record<string, string>;
};

export type AppSources = {
  hq?: string;
  /** Labels of `transfer_destination_countries`, as stored in the fiche. */
  policy: string[];
  trackerIds: number[];
  trackerNames: Record<number, string>;
};

export type AppTransfers = {
  /** Country code → every reason we have for placing the app there. */
  byCountry: Map<string, TransferLink[]>;
  /** The policy names no destination at all. */
  unstated: boolean;
  /** The policy adds "other countries" without naming them. */
  unlisted: boolean;
  /** Trackers whose vendor country is not sourced: counted, never placed. */
  unlocated: number;
};

export type LinkOptions = { policy: boolean; trackers: boolean };

const UNLISTED = "other";

export function appTransfers(
  app: AppSources,
  companies: TrackerCompanies | null,
  opts: LinkOptions,
): AppTransfers {
  const byCountry = new Map<string, TransferLink[]>();
  const add = (code: string | null | undefined, link: TransferLink) => {
    if (!code || !getCountryByCode(code)) return false;
    byCountry.set(code, [...(byCountry.get(code) ?? []), link]);
    return true;
  };

  add(app.hq?.toLowerCase(), { origin: "hq" });

  const policyCodes = parseTransferCountries(app.policy);
  if (opts.policy) for (const code of policyCodes) add(code, { origin: "policy" });

  let unlocated = 0;
  if (opts.trackers) {
    for (const id of app.trackerIds) {
      const company = companies?.companies[companies.trackers[String(id)]];
      const placed = company?.source
        ? add(company.country, { origin: "tracker", tracker: app.trackerNames[id] ?? `#${id}`, company: company.name })
        : false;
      if (!placed) unlocated++;
    }
  }

  return {
    byCountry,
    unstated: app.policy.length === 0,
    unlisted: policyCodes.includes(UNLISTED),
    unlocated,
  };
}

/** Declared by the service itself (seat or policy), as opposed to inferred from a tracker. */
export const isDeclared = (links: TransferLink[]) => links.some((l) => l.origin !== "tracker");
