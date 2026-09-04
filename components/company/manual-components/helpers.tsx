import { Check, X } from 'lucide-react';
import { t } from './i18n';
import missionsData from '../../../public/data/missions.json';
import servicesData from '../../../public/data/services.json';
import { Mission } from './types';

// Import canonical SERVICE_CATEGORIES
import { SERVICE_CATEGORIES } from '@/constants/protectData';

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
                <Check className="h-5 w-5 text-green-600" />{displayText && <span className="ml-1 text-gray-700">{t(lang, 'yes')}</span>}
            </div>
        );
    }
    if (value === false) {
        return (
            <div className="flex items-center">
                <X className="h-5 w-5 text-red-600" />{displayText && <span className="ml-2 text-gray-700">{t(lang, 'no')}</span>}
            </div>
        );
    }
    return null;
}


// Both peer sources name services that have no fiche: 24 slugs in
// SERVICE_CATEGORIES and 370 app slugs in missions.json are not catalogued.
// Comparing or linking to them yields empty columns and dead links, so peers
// are filtered against services.json before the limit is applied.
const CATALOGUED_SLUGS = new Set((servicesData as { slug: string }[]).map(s => s.slug));

export function findSimilarServices(currentSlug: string, limit: number = 2): string[] {
    const candidates: string[] = [];

    // 1. Try to find in SERVICE_CATEGORIES (from ProtectMyData)
    for (const category in SERVICE_CATEGORIES) {
        const categoryServices = SERVICE_CATEGORIES[category];
        if (!Array.isArray(categoryServices)) {
            continue;
        }

        if (categoryServices.includes(currentSlug)) {
            candidates.push(...categoryServices);
            break;
        }
    }

    // 2. Complete with missions.json — a category can hold too few catalogued peers
    const missions = missionsData as Mission[];
    const matchingMission = missions.find(mission =>
        mission.apps.some(app => app.slug === currentSlug)
    );
    if (matchingMission) {
        candidates.push(...matchingMission.apps.map(app => app.slug));
    }

    const peers: string[] = [];
    for (const slug of candidates) {
        if (slug === currentSlug || peers.includes(slug) || !CATALOGUED_SLUGS.has(slug)) {
            continue;
        }
        peers.push(slug);
        if (peers.length === limit) break;
    }

    return peers;
}
