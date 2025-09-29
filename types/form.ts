export interface FormData {
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
    data_access_via_postal: boolean;
    data_access_via_form: boolean;
    data_access_type: string;
    data_access_via_email: boolean;
    response_format: string;
    url_export: string;
    address_export: string;
    response_delay: string;
    sanctioned_by_cnil: boolean;
    sanction_details: string;
    data_transfer_policy: boolean;
    privacy_policy_quote: string;
    transfer_destination_countries: string[];
    outside_eu_storage: boolean;
    comments: string;
    app_name: string;
    app_link: string;
    author: string;
    details_required_documents_autre: string;
    response_format_autre: string;
    response_delay_autre: string;
    originalData?: any; // Ajouter ce champ pour préserver toutes les données originales
}

export interface Service {
    slug: string;
    name: string;
    logo: string;
    country_name: string;
    country_code: string;
    contact_mail_export: string;
    need_id_card: boolean;
    url_export: string;
}
