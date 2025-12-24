export interface FormData {
    confidentiality_policy_url: string | undefined;
    confidentiality_policy_url_en: string | undefined;
    name: string;
    logo: string;
    nationality: string;
    country_name: string;
    country_code: string;
    belongs_to_group: boolean;
    group_name: string;
    contact_mail_export: string;
    easy_access_data: string;
    need_id_card: boolean;
    details_required_documents: string;
    details_required_documents_en: string;
    data_access_via_postal: boolean;
    data_access_via_form: boolean;
    data_access_type: string;
    data_access_type_en: string;
    data_access_via_email: boolean;
    response_format: string;
    response_format_en: string;
    url_export: string;
    address_export: string;
    response_delay: string;
    response_delay_en: string;
    sanctioned_by_cnil: boolean;
    sanction_details: string;
    data_transfer_policy: boolean;
    privacy_policy_quote: string;
    privacy_policy_quote_en: string;
    transfer_destination_countries: string[];
    transfer_destination_countries_en: string;
    outside_eu_storage: boolean;
    comments: string;
    comments_en: string;
    app_name: string;
    app_link: string;
    author: string;
    details_required_documents_autre: string;
    response_format_autre: string;
    response_delay_autre: string;
    originalData?: any; // Ajouter ce champ pour préserver toutes les données originales
}

export interface Service {
    nationality: ReactNode;
    slug: string;
    name: string;
    logo: string;
    country_name: string;
    country_code: string;
    contact_mail_export: string;
    need_id_card: boolean;
    url_export: string;
}
