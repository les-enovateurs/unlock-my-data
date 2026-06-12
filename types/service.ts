// Service entry shape from public/data/services.json, as consumed by the
// legacy catalog components (Card, ListSitefound, Pagination).
export interface Data {
    id: number;
    name: string;
    slug: string;
    logo: string;
    short_description: string;
    risk_level: number;
    accessibility: number;
    need_account: number;
    need_id_card: number;
    contact_mail_export: string | null;
    contact_mail_delete: string | null;
    recipient_address: string | null;
    how_to_export: string | null;
    url_delete: string | null;
    last_update_breach: string;
    number_account_impact: string | null;
    number_app: number | null;
    number_breach: number | null;
    number_permission: number | null;
    number_website: number | null;
    number_website_cookie: number | null;
    country_name: string | null;
    country_code: string | null;
    nationality: string | null;
}

export interface PaginationCards {
    totalCards: Data[];
    cardsPerPage: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}
