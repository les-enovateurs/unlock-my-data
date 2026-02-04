export interface Mission {
    id: string;
    category: string;
    category_en: string;
    apps: Array<{ name: string; slug: string }>;
}

export interface Vulnerability {
    date: string;
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    mitigation: string;
    mitigation_en?: string;
    risk: string;
    risk_en?: string;
    media_link?: string;
    reporter?: string;
}

export type EntrepriseData = {
    name: string;
    logo?: string;
    nationality?: string;
    country_name?: string;
    country_code?: string;
    belongs_to_group?: boolean;
    group_name?: string;
    permissions?: string;
    contact_mail_export?: string;
    contact_mail_delete?: string;
    url_delete?: string;
    easy_access_data?: string;
    need_id_card?: boolean;
    details_required_documents?: string;
    details_required_documents_en?: string;
    data_access_via_postal?: boolean;
    data_access_via_form?: boolean;
    data_access_type?: string;
    data_access_type_en?: string;
    data_access_via_email?: boolean;
    response_format?: string;
    response_format_en?: string;
    example_data_export?: Array<{
        url: string;
        type: string;
        description: string;
        description_en?: string;
        date: string;
    }>;
    example_form_export?: Array<{
        url: string;
        type: string;
        description: string;
        description_en?: string;
        date: string;
    }>;
    message_exchange?: Array<{
        url: string;
        type: string;
        description: string;
        description_en?: string;
        date: string;
    }>;
    url_export?: string;
    url_export_en?: string;
    address_export?: string;
    response_delay?: string;
    response_delay_en?: string;
    sanctioned_by_cnil?: boolean;
    sanction_details?: string;
    sanction_details_en?: string;
    data_transfer_policy?: boolean;
    privacy_policy_quote?: string;
    privacy_policy_quote_en?: string;
    transfer_destination_countries?: string;
    transfer_destination_countries_en?: string;
    outside_eu_storage?: string | boolean;
    outside_eu_storage_en?: string | boolean;
    comments?: string;
    comments_en?: string;
    tosdr?: string;
    exodus?: string;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    app?: {
        name: string;
        link: string;
    };
    sanctions?: Array<{
        deliberation: string | null;
        date: string;
        amount_euros: number | null;
        violations: string[];
        source_url: string;
        pdf_url?: string | null;
        title: string;
        title_en?: string;
        type?: string;
    }>;
    had_data_breach?: boolean;
    data_breaches?: Array<{
        date: string;
        volume?: string | null;
        sensitive?: boolean;
        data_types?: string[];
        links?: string[] | Array<{text: string, href: string}>;
        source?: string;
        source_name?: string;
        processor?: string;
        description?: string;
    }>;
    vulnerabilities?: Vulnerability[];
};

export interface Breach {
    name: string;
    title: string;
    breachDate: string;
    pwnCount: number;
    dataClasses: string[];
    description: string;
    isVerified: boolean;
}

export interface TermsMemo {
    slug: string;
    url: string;
    title: string;
    title_fr: string;
    service: string;
    terms_types: string[];
    dates: string[];
    author: string | string[];
    description: string;
    description_fr: string;
    body: string;
    body_fr: string;
}
