export interface ServiceSuite {
    id: string;
    name: string;
    logo?: string;
    children: string[];
}

// Sub-services effectively handled in audit/clean for each suite.
// If a suite is not listed here, all its children are considered.
export const CLEAN_UP_CONCERNED_CHILDREN_BY_SUITE: Record<string, string[]> = {
    google: ["gmail", "google-drive"],
    microsoft: ["onedrive", "outlook"],
    meta: ["facebook", "instagram"],
    apple: ["icloud"],
};

export const DIGITAL_CLEAN_UP_SUITES: ServiceSuite[] = [
    {
        id: "google",
        name: "Google",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        children: ["gmail", "google-drive", "google-maps", "google-meet", "youtube"]
    },
    {
        id: "microsoft",
        name: "Microsoft",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        children: ["outlook", "onedrive", "skype", "teams", "microsoft-teams"]
    },
    {
        id: "apple",
        name: "Apple",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        children: ["icloud", "apple-maps", "appletv"]
    },
    {
        id: "meta",
        name: "Meta",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
        children: ["facebook", "instagram", "messenger", "whatsapp"]
    }
];
