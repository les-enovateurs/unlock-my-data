export interface ComparatifComponentProps {
    locale: string;
}

export interface ServiceData {
    name: string;
    logo: string;
    points: ServicePoint[];
}

export interface ServicePoint {
    id: string;
    status: string;
    case: {
        id: number;
        title: string;
        localized_title?: string;
        classification: string;
        score: number;
    };
}

export interface Permission {
    id: string;
    name: string;
    label: string;
    protection_level: string;
    description: string;
}

export interface AppPermissions {
    permissions: string[];
    trackers: number[];
}

export interface Tracker {
    id: number;
    name: string;
    description: string;
    country: string;
    categories: string[];
}

export interface Service {
    name: string;
    slug: string;
    url: string;
    url_delete?: string;
    contact_mail_delete?: string;
    exodus: string | boolean;
    tosdr: string;
    logo: string;
    short_description?: string;
}
