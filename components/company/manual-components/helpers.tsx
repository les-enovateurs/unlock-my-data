import { Check, X } from 'lucide-react';
import { t } from './i18n';
import missionsData from '../../../public/data/missions.json';
import { Mission } from './types';

// Service categories for alternatives
export const SERVICE_CATEGORIES: Record<string, string[]> = {
  messaging: ["whatsapp", "telegram", "signal", "messenger", "discord", "skype", "slack", "mattermost", "rocketchat", "wechat"],
  social: ["facebook", "instagram", "tiktok", "snapchat", "x-twitter", "linkedin", "pinterest", "reddit", "mastodon", "bumble", "tinder"],
  streaming: ["netflix", "disneyplus", "amazon-prime-video", "youtube", "twitch", "spotify", "deezer", "appletv"],
  cloud: ["google-drive", "dropbox", "onedrive", "icloud", "mega", "box", "proton-drive"],
  email: ["gmail", "outlook", "yahoo", "protonmail", "tutanota"],
  gps: ["google-maps", "waze", "apple-maps", "citymapper", "osmand", "strava"],
  search: ["google", "bing", "duckduckgo", "qwant", "ecosia"],
  browser: ["chrome", "firefox", "edge", "safari", "brave", "opera"],
  shopping: ["amazon", "aliexpress", "ebay", "leboncoin", "vinted", "alibaba", "boulanger", "carrefour", "ikea", "rue-du-commerce", "shein", "temu", "zalando"],
  meeting: ["zoom", "teams", "google-meet", "skype", "microsoft-teams"],
  ai: ["chatgpt", "claude", "gemini", "mistral", "perplexity"],
  travel: ["booking", "airbnb-inc", "opodo", "ryanair"],
  health: ["doctolib", "caisse-nationale-dassurance-maladie"],
  education: ["kahoot", "moodle", "pronote"],
  gaming: ["candy-crush", "playstation", "pokemon-go", "rockstar-games", "steam"],
  food: ["marmiton", "reddit"],
  services: ["la-poste", "revolut", "indeed"]
};

// Traductions des types de données compromises
const dataTypeTranslations: Record<string, string> = {
    "Email addresses": "Adresses email",
    "Passwords": "Mots de passe",
    "Usernames": "Noms d'utilisateur",
    "Names": "Noms",
    "Phone numbers": "Numéros de téléphone",
    "Physical addresses": "Adresses physiques",
    "Dates of birth": "Dates de naissance",
    "IP addresses": "Adresses IP",
    "Geographic locations": "Localisations",
    "Genders": "Genres",
    "Job titles": "Titres de poste",
    "Employers": "Employeurs",
    "Social media profiles": "Profils réseaux sociaux",
    "Credit cards": "Cartes de crédit",
    "Bank account numbers": "Numéros de compte bancaire",
    "Partial phone numbers": "Numéros de téléphone partiels",
    "Salutations": "Civilités"
};

// Helper pour traduire les types de données
export function translateDataClass(dataClass: string, lang: string): string {
    if (lang === 'fr') {
        return dataTypeTranslations[dataClass] || dataClass;
    }
    return dataClass;
}

// Helper pour capitaliser la première lettre de chaque mot (ucfirst)
export function ucfirst(text: string): string {
    if (!text) return text;
    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Helper pour formater les grands nombres
export function formatPwnCount(count: number, lang: string): string {
    const million = lang === 'fr' ? 'M' : 'M';
    const billion = lang === 'fr' ? 'Md' : 'B';
    if (count >= 1000000000) {
        return `${(count / 1000000000).toFixed(1)}${billion}`;
    }
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}${million}`;
    }
    return count.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US');
}

// Helper pour formater la date des breaches
export function formatBreachDate(dateStr: string, lang: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function getBooleanIcon(value?: boolean, displayText: boolean = true, lang: string = 'fr') {
    if (value === true) {
        return (
            <div className="flex items-center">
                <Check className="h-5 w-5 text-green-600" />{displayText && <span className="ml-1 text-gray-700">{t(lang,'yes')}</span>}
            </div>
        );
    }
    if (value === false) {
        return (
            <div className="flex items-center">
                <X className="h-5 w-5 text-red-600" />{displayText && <span className="ml-2 text-gray-700">{t(lang,'no')}</span>}
            </div>
        );
    }
    return null;
}

// Function to find similar services from the same category
export function findSimilarServices(currentSlug: string, limit: number = 2): string[] {
    // 1. Try to find in SERVICE_CATEGORIES (from ProtectMyData)
    for (const category in SERVICE_CATEGORIES) {
        if (SERVICE_CATEGORIES[category].includes(currentSlug)) {
            return SERVICE_CATEGORIES[category]
                .filter(s => s !== currentSlug)
                .slice(0, limit);
        }
    }

    // 2. Fallback to missions.json
    const missions = missionsData as Mission[];

    // Find the category that contains this slug
    const matchingMission = missions.find(mission =>
        mission.apps.some(app => app.slug === currentSlug)
    );

    if (!matchingMission) {
        return [];
    }

    return matchingMission.apps
        .filter(app => app.slug !== currentSlug)
        .slice(0, limit)
        .map(app => app.slug);
}
