/**
 * Types for the contribution system with review
 */

export type ServiceStatus = 'draft' | 'changes_requested' | 'published';

export interface ReviewItem {
  field: string;
  message: string;
  reviewer?: string;
  timestamp?: string;
}

export interface ServiceMetadata {
  status: ServiceStatus;
  review?: ReviewItem[];
  status_updated_at?: string;
  submitted_by?: string;
}

export interface ServiceData extends ServiceMetadata {
  // Champs requis
  name: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  
  // Champs optionnels (structure complète du service)
  logo?: string;
  nationality?: string;
  country_name?: string;
  country_code?: string;
  belongs_to_group?: boolean;
  group_name?: string;
  permissions?: string;
  contact_mail_export?: string;
  easy_access_data?: string;
  need_id_card?: boolean;
  details_required_documents?: string;
  details_required_documents_en?: string;
  data_access_via_postal?: boolean;
  data_access_via_form?: boolean;
  data_access_type?: string;
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
  example_form_export?: any[];
  message_exchange?: any[];
  url_export?: string;
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
  outside_eu_storage?: string;
  outside_eu_storage_en?: string;
  comments?: string;
  tosdr?: string;
  exodus?: string;
  app?: {
    name: string;
    link: string;
  };
  alternatives?: string[];
  updated_by?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ContributionStateEntry {
  type: 'submit' | 'review_added' | 'resubmit' | 'approved';
  by: string;
  date: string;
  status: ServiceStatus;
  fields_reviewed?: string[];
  reason?: string;
}

export interface MattermostMessage {
  text: string;
  attachments?: Array<{
    color: string;
    title: string;
    text: string;
    fields?: Array<{
      title: string;
      value: string;
      short: boolean;
    }>;
  }>;
}
