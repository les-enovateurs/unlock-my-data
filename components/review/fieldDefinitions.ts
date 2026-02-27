import { FORM_OPTIONS } from "@/constants/formOptions";

export type ReviewFieldType = "text" | "markdown" | "checkbox" | "select" | "multiselect" | "app";

export interface ReviewFieldDefinition {
  type: ReviewFieldType;
  options?: Array<Record<string, string>>;
  allowCustom?: boolean;
}

export const REVIEW_MARKDOWN_FIELDS = new Set([
  "sanction_details",
  "privacy_policy_quote",
  "privacy_policy_quote_en",
  "comments",
  "comments_en"
]);

export const REVIEW_BOOLEAN_FIELDS = new Set([
  "belongs_to_group",
  "need_id_card",
  "data_access_via_postal",
  "data_access_via_form",
  "data_access_via_email",
  "sanctioned_by_cnil",
  "data_transfer_policy",
  "outside_eu_storage"
]);

export const REVIEW_BILINGUAL_FIELDS = new Set([
  "privacy_policy_quote",
  "comments",
  "response_format",
  "response_delay",
  "details_required_documents",
  "confidentiality_policy_url",
  "transfer_destination_countries"
]);

const SELECT_FIELDS: Record<string, ReviewFieldDefinition> = {
  nationality: {
    type: "select",
    options: FORM_OPTIONS.nationalities as Array<Record<string, string>>
  },
  easy_access_data: {
    type: "select",
    options: FORM_OPTIONS.easyAccessLevels as Array<Record<string, string>>
  },
  details_required_documents: {
    type: "select",
    options: FORM_OPTIONS.requiredDocuments as Array<Record<string, string>>,
    allowCustom: true
  },
  response_format: {
    type: "select",
    options: FORM_OPTIONS.responseFormats as Array<Record<string, string>>,
    allowCustom: true
  },
  response_delay: {
    type: "select",
    options: FORM_OPTIONS.responseDelays as Array<Record<string, string>>,
    allowCustom: true
  },
  transfer_destination_countries: {
    type: "multiselect",
    options: FORM_OPTIONS.countries as Array<Record<string, string>>
  }
};

export const getReviewFieldDefinition = (field: string): ReviewFieldDefinition => {
  if (field === "app") {
    return { type: "app" };
  }

  if (REVIEW_MARKDOWN_FIELDS.has(field)) {
    return { type: "markdown" };
  }

  if (REVIEW_BOOLEAN_FIELDS.has(field)) {
    return { type: "checkbox" };
  }

  if (SELECT_FIELDS[field]) {
    return SELECT_FIELDS[field];
  }

  return { type: "text" };
};

export const isReviewMarkdownField = (field: string): boolean => REVIEW_MARKDOWN_FIELDS.has(field);
