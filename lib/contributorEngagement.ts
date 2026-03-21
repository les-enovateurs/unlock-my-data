import statsData from "../public/data/contributors-stats.json";

export interface CompanyDate {
    name: string;
    date: string;
}

export interface Contributor {
    name: string;
    count: number;
    companies: CompanyDate[];
}

interface StatsData {
    topCreators: Contributor[];
    topUpdaters: Contributor[];
    topReviewers?: Contributor[];
}

export interface ActivityItem {
    company: string;
    date: string;
    type: "created" | "updated" | "reviewed";
}

export interface MonthlyActivity {
    month: string;
    count: number;
}

export interface EngagementReport {
    contributorName: string;
    created: ActivityItem[];
    updated: ActivityItem[];
    reviewed: ActivityItem[];
    total: number;
    monthlyActivity: MonthlyActivity[];
}

const stats = statsData as StatsData;

const normalizeName = (value: string) => value.trim().toLowerCase();

const toMonthKey = (dateString: string): string => {
    return dateString.slice(0, 7);
};

const sortByDateThenName = (items: ActivityItem[]): ActivityItem[] => {
    return [...items].sort((a, b) => {
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) {
            return dateComparison;
        }
        return a.company.localeCompare(b.company);
    });
};

const getContributorFromList = (list: Contributor[], selectedName: string): Contributor | undefined => {
    const selected = normalizeName(selectedName);
    return list.find((contributor) => normalizeName(contributor.name) === selected);
};

const toActivityItems = (
    contributor: Contributor | undefined,
    type: ActivityItem["type"],
): ActivityItem[] => {
    if (!contributor) {
        return [];
    }

    return sortByDateThenName(
        contributor.companies
            .map((company) => ({
                company: company.name,
                date: company.date,
                type,
            })),
    );
};

export const getContributorNames = (): string[] => {
    const names = new Set<string>();

    [...stats.topCreators, ...stats.topUpdaters, ...(stats.topReviewers || [])].forEach((entry) => {
        names.add(entry.name);
    });

    return [...names].sort((a, b) => a.localeCompare(b));
};

export const getEngagementReport = (selectedName: string): EngagementReport | null => {
    if (!selectedName.trim()) {
        return null;
    }

    const creator = getContributorFromList(stats.topCreators, selectedName);
    const updater = getContributorFromList(stats.topUpdaters, selectedName);
    const reviewer = getContributorFromList(stats.topReviewers || [], selectedName);

    const canonicalName = creator?.name || updater?.name || reviewer?.name || selectedName.trim();

    if (!creator && !updater && !reviewer) {
        return null;
    }

    const created = toActivityItems(creator, "created");
    const updated = toActivityItems(updater, "updated");
    const reviewed = toActivityItems(reviewer, "reviewed");

    const byMonth = new Map<string, number>();
    [...created, ...updated, ...reviewed].forEach((item) => {
        const monthKey = toMonthKey(item.date);
        byMonth.set(monthKey, (byMonth.get(monthKey) || 0) + 1);
    });

    const monthlyActivity: MonthlyActivity[] = [...byMonth.entries()]
        .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
        .map(([month, count]) => ({ month, count }));

    return {
        contributorName: canonicalName,
        created,
        updated,
        reviewed,
        total: created.length + updated.length + reviewed.length,
        monthlyActivity,
    };
};
