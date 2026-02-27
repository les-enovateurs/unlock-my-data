"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AlertCircle, User, Check, MessageSquare, FileText, Mail, Shield, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Translator from "@/components/tools/t";
import dict from "@/i18n/ReviewForms.json";
import formDict from "@/i18n/ServiceForm.json";
import { createGitHubPR } from "@/tools/github";
import { notifyPublished, notifyReview } from "@/lib/notifications/mattermost";
import { ucfirst } from "@/lib/text";
import FieldWithComments from "./review/FieldWithComments";
import { buildFieldCommentEntries } from "@/components/review/reviewComments";
import { ReviewItem, ReviewReply } from "@/types/form";
import { FORM_OPTIONS } from "@/constants/formOptions";
import { REVIEW_BILINGUAL_FIELDS, getReviewFieldDefinition, isReviewMarkdownField } from "@/components/review/fieldDefinitions";
import { buildNationalitySummary } from "@/components/review/nationalitySummary";

interface ReviewService {
  slug: string;
  name: string;
  logo?: string;
  status: "draft" | "changes_requested" | "published";
  created_at: string;
  created_by: string;
  review?: ReviewItem[];
  [key: string]: any;
}

interface FullServiceData extends ReviewService {
  // All fields from manual JSON
  nationality?: string;
  country_name?: string;
  country_code?: string;
  belongs_to_group?: boolean;
  group_name?: string;
  contact_mail_export?: string;
  easy_access_data?: string;
  need_id_card?: boolean;
  details_required_documents?: string;
  confidentiality_policy_url?: string;
  data_access_via_postal?: boolean;
  data_access_via_form?: boolean;
  data_access_via_email?: boolean;
  response_format?: string;
  response_format_en?: string;
  url_export?: string;
  address_export?: string;
  response_delay?: string;
  response_delay_en?: string;
  sanctioned_by_cnil?: boolean;
  sanction_details?: string;
  data_transfer_policy?: boolean;
  privacy_policy_quote?: string;
  privacy_policy_quote_en?: string;
  transfer_destination_countries?: string | string[];
  transfer_destination_countries_en?: string;
  outside_eu_storage?: boolean;
  confidentiality_policy_url_en?: string;
  details_required_documents_en?: string;
  app?: { name?: string; link?: string };
  permissions?: string;
  comments?: string;
  comments_en?: string;
}

interface ReviewFormsPageProps {
  lang: "fr" | "en";
  contributePath: string;
}

// Field categories for better organization - labels are now loaded from i18n
const FIELD_CATEGORIES = {
  general: {
    icon: FileText,
    iconClass: "text-primary",
    iconBgClass: "bg-primary/10",
    fields: ["name", "logo", "nationality", "country_name", "country_code", "belongs_to_group", "group_name"]
  },
  contact: {
    icon: Mail,
    iconClass: "text-secondary",
    iconBgClass: "bg-secondary/10",
    fields: ["contact_mail_export", "contact_mail_delete", "easy_access_data", "need_id_card", 
             "details_required_documents", "details_required_documents_autre", "details_required_documents_en",
             "data_access_via_postal", "data_access_via_form", "data_access_via_email",
             "url_export", "address_export", "response_delay", "response_delay_autre", "response_delay_en",
             "response_format", "response_format_autre", "response_format_en"]
  },
  privacy: {
    icon: Shield,
    iconClass: "text-accent",
    iconBgClass: "bg-accent/10",
    fields: ["confidentiality_policy_url", "confidentiality_policy_url_en", "privacy_policy_quote", "privacy_policy_quote_en",
             "data_transfer_policy", "transfer_destination_countries", "transfer_destination_countries_en",
             "outside_eu_storage", "sanctioned_by_cnil", "sanction_details"]
  },
  app: {
    icon: Globe,
    iconClass: "text-info",
    iconBgClass: "bg-info/10",
    fields: ["app", "comments", "comments_en"]
  }
};

const READ_ONLY_FIELDS = new Set(["country_name", "country_code"]);

// Define conditional fields: which fields should be shown based on other field values
const CONDITIONAL_FIELDS: Record<string, (values: Record<string, any>, lang: string) => boolean> = {
  // General
  group_name: (values) => values.belongs_to_group === true,
  
  // Contact - "autre" variants
  details_required_documents_autre: (values) => values.details_required_documents === "Autre",
  response_format_autre: (values) => values.response_format === "Autre",
  response_delay_autre: (values) => values.response_delay === "Autre",
  
  // Bilingual fields - only show _en version if lang is en
  // For details_required_documents_en, hide it when "Autre" is selected (replaced by _autre field)
  details_required_documents_en: (values, currentLang) => 
    currentLang === "en" && values.details_required_documents !== "Autre",
  response_format_en: (values, currentLang) => currentLang === "en",
  response_delay_en: (values, currentLang) => currentLang === "en",
  privacy_policy_quote_en: (values, currentLang) => currentLang === "en",
  confidentiality_policy_url_en: (values, currentLang) => currentLang === "en",
  transfer_destination_countries_en: (values, currentLang) => currentLang === "en",
  comments_en: (values, currentLang) => currentLang === "en",
  
  // Privacy
  sanction_details: (values) => values.sanctioned_by_cnil === true,
};

// Helper function to determine if a field should be displayed
const shouldShowField = (field: string, values: Record<string, any>, currentLang: string): boolean => {
  const rule = CONDITIONAL_FIELDS[field];
  if (rule) {
    return rule(values, currentLang);
  }
  return true; // Show by default if no rule
};

export default function ReviewFormsPage({ lang, contributePath }: ReviewFormsPageProps) {
  const t = new Translator(dict as any, lang);
  const formT = new Translator(formDict as any, lang);
  const tt = (key: string) => ucfirst(t.t(key));
  const tf = (key: string) => ucfirst(formT.t(key));
  const REVIEW_MARKDOWN_MAX_LENGTH = 4000;
  const REVIEW_TEXTAREA_MAX_LENGTH = 2000;
  
  // State for services and data
  const [services, setServices] = useState<ReviewService[]>([]);
  const [fullServiceData, setFullServiceData] = useState<Record<string, FullServiceData>>({});
  const [loading, setLoading] = useState(true);
  
  // Refs for latest state to use in callbacks without recreating them
  const servicesRef = useRef(services);
  const fullServiceDataRef = useRef(fullServiceData);
  
  useEffect(() => {
    servicesRef.current = services;
  }, [services]);
  
  useEffect(() => {
    fullServiceDataRef.current = fullServiceData;
  }, [fullServiceData]);
  
  // State for UI expansion
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // State for reviewer name (optional)
  const [reviewerName, setReviewerName] = useState("");
  
  // State for edits: { field => edited value }
  const [editedFields, setEditedFields] = useState<Record<string, Record<string, any>>>({});
  
  // State for replies: { slug.fieldIndex => ReviewReply[] }
  const [replies, setReplies] = useState<Record<string, ReviewReply[]>>({});
  
  // State for resolved comments: { slug.fieldIndex => boolean }
  const [resolvedComments, setResolvedComments] = useState<Record<string, boolean>>({});
  
  // State for form submission
  const [submitting, setSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<"approve" | "request_changes" | "modify" | null>(null);
  const [successMessage, setSuccessMessage] = useState<{ slug: string; action: 'approve' | 'request_changes' | 'modify'; prUrl?: string } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [readyToPublish, setReadyToPublish] = useState<Record<string, boolean>>({});
  
  // State for tracking new comments added during this review session
  const [newCommentsCount, setNewCommentsCount] = useState<Record<string, number>>({});

  // Load reviewer name from sessionStorage if available
  useEffect(() => {
    const savedName = sessionStorage.getItem("unlock-my-data:contributor-name");
    if (savedName) {
      setReviewerName(savedName);
    }
  }, []);

  // Load services on mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/data/reviews.json");
      if (response.ok) {
        const data = await response.json();
        setServices(data.filter((s: ReviewService) => s.status === "draft" || s.status === "changes_requested"));
      }
    } catch (err) {
      console.warn("Could not load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFullServiceData = async (slug: string) => {
    if (fullServiceData[slug]) return; // Already loaded
    
    try {
      const response = await fetch(`/data/manual/${slug}.json`);
      if (response.ok) {
        const data = await response.json();
        setFullServiceData(prev => ({ ...prev, [slug]: data }));
      }
    } catch (err) {
      console.warn(`Could not load full data for ${slug}:`, err);
    }
  };

  const toggleCategory = (slug: string, category: string) => {
    const key = `${slug}-${category}`;
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resolveFieldKey = useCallback((fieldName: string, data: FullServiceData): string => {
    if (lang !== "en") return fieldName;
    if (!REVIEW_BILINGUAL_FIELDS.has(fieldName)) return fieldName;
    const enField = `${fieldName}_en`;
    if (enField in data) return enField;
    return fieldName;
  }, [lang]);

  // Handle adding a reply to a comment
  const handleAddReply = useCallback((slug: string, fieldIndex: number, text: string) => {
    const key = `${slug}.${fieldIndex}`;
    setReplies(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), {
        message: text,
        author: "current-user",
        author_name: reviewerName || undefined,
        timestamp: new Date().toISOString()
      }]
    }));
    // Increment new comments counter for replies
    setNewCommentsCount(prev => ({
      ...prev,
      [slug]: (prev[slug] || 0) + 1
    }));
  }, [reviewerName]);

  // Handle marking a comment as resolved/unresolved
  const handleMarkResolved = useCallback((slug: string, fieldIndex: number, resolved: boolean) => {
    const key = `${slug}.${fieldIndex}`;
    setResolvedComments(prev => ({ ...prev, [key]: resolved }));
  }, []);

  // Handle direct field changes
  const handleFieldChange = useCallback((slug: string, field: string, newValue: any) => {
    const data = fullServiceDataRef.current[slug] || (servicesRef.current.find(s => s.slug === slug) as FullServiceData | undefined);
    const fieldKey = data ? resolveFieldKey(field, data) : field;
    
    // Get original value to check if it actually changed
    let originalValue = data ? data[fieldKey] : undefined;
    if (originalValue === null || originalValue === undefined) originalValue = "";
    
    // Normalize newValue for comparison
    let normalizedNewValue = newValue;
    if (normalizedNewValue === null || normalizedNewValue === undefined) normalizedNewValue = "";
    
    // Helper to normalize values for comparison
    const normalizeForComparison = (val: any) => {
      if (typeof val === 'string') {
        return val
          .replaceAll("<br />", "\n")
          .replaceAll("<br/>", "\n")
          .replaceAll("<br>", "\n")
          .trim()
          .replace(/\r\n/g, '\n');
      }
      if (Array.isArray(val)) return val.map(v => typeof v === 'string' ? v.trim() : v).sort();
      if (typeof val === 'object' && val !== null) {
        // For app object {name, link}
        return {
          name: typeof val.name === 'string' ? val.name.trim() : val.name,
          link: typeof val.link === 'string' ? val.link.trim() : val.link
        };
      }
      return val;
    };

    const isSame = JSON.stringify(normalizeForComparison(originalValue)) === JSON.stringify(normalizeForComparison(normalizedNewValue));
    
    setEditedFields(prev => {
      const currentServiceEdits = { ...(prev[slug] || {}) };
      
      if (isSame) {
        // Remove from edits if it's the same as original
        delete currentServiceEdits[fieldKey];
        
        // Also remove dependent fields if they were added
        if (field === 'nationality') {
          delete currentServiceEdits.country_name;
          delete currentServiceEdits.country_code;
        }
        if (field === 'details_required_documents') {
          delete currentServiceEdits.need_id_card;
        }
        if (field === 'transfer_destination_countries') {
          delete currentServiceEdits.transfer_destination_countries;
          delete currentServiceEdits.transfer_destination_countries_en;
        }
        if (field === 'belongs_to_group') {
          delete currentServiceEdits.group_name;
        }
        
        return {
          ...prev,
          [slug]: currentServiceEdits
        };
      }
      
      const updates: Record<string, any> = { [fieldKey]: newValue };
      
      if (field === 'nationality') {
        const selectedNat = FORM_OPTIONS.nationalities.find(n => n.label === newValue);
        if (selectedNat) {
          updates.country_name = selectedNat.country_name;
          updates.country_code = selectedNat.country_code;
        } else {
          updates.country_name = "";
          updates.country_code = "";
        }
      }

      if (field === 'details_required_documents') {
        updates.need_id_card = newValue === "Carte d'identité";
      }

      if (field === 'transfer_destination_countries') {
        const countries = Array.isArray(newValue)
          ? newValue
          : newValue
            ? newValue.split(',').map((s: string) => s.trim())
            : [];
        updates.transfer_destination_countries = countries;
        updates.transfer_destination_countries_en = countries
          .map((countryLabel: string) => {
            const country = FORM_OPTIONS.countries.find(c => c.label === countryLabel);
            return country?.country_name || countryLabel;
          })
          .join(', ');
      }

      if (field === 'belongs_to_group' && newValue === false) {
        updates.group_name = "";
      }

      return {
        ...prev,
        [slug]: {
          ...currentServiceEdits,
          ...updates
        }
      };
    });
  }, [resolveFieldKey]);

  const submitReview = async (service: ReviewService, action: "approve" | "request_changes" | "modify", skipValidation: boolean = false) => {
    const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    if (!githubToken) {
      setAuthError(service.slug);
      return;
    }
    setAuthError(null);
    
    // For modify action without skip, validate first
    if (action === "modify" && !skipValidation) {
      setValidationErrors(prev => ({ ...prev, [service.slug]: [] }));
      
      try {
        const fullData = fullServiceData[service.slug] || service;
        const mergedData = {
          ...fullData,
          ...editedFields[service.slug],
        } as FullServiceData & Record<string, any>;

        const fieldsToCheck = Object.values(FIELD_CATEGORIES).flatMap((category) => category.fields);
        const errors: string[] = [];
        
        // Check markdown fields
        fieldsToCheck.forEach((field) => {
          if (!isReviewMarkdownField(field)) return;
          const fieldKey = resolveFieldKey(field, mergedData);
          const value = mergedData[fieldKey];
          if (typeof value === "string" && value.length > REVIEW_MARKDOWN_MAX_LENGTH) {
            errors.push(
              tt("textTooLong").replace("{max}", String(REVIEW_MARKDOWN_MAX_LENGTH)) +
              ` (${getFieldLabel(field)})`
            );
          }
        });

        // Check text fields
        fieldsToCheck.forEach((field) => {
          const definition = getReviewFieldDefinition(field);
          if (definition.type !== "text") return;
          const fieldKey = resolveFieldKey(field, mergedData);
          const value = mergedData[fieldKey];
          if (typeof value === "string" && value.length > REVIEW_TEXTAREA_MAX_LENGTH) {
            errors.push(
              tt("textTooLong").replace("{max}", String(REVIEW_TEXTAREA_MAX_LENGTH)) +
              ` (${getFieldLabel(field)})`
            );
          }
        });

        // Store errors and either proceed or show error list
        if (errors.length > 0) {
          setValidationErrors(prev => ({ ...prev, [service.slug]: errors }));
          return;
        }

        // Validation passed, mark as ready to publish and continue submission
        setReadyToPublish(prev => ({ ...prev, [service.slug]: true }));
      } catch (err) {
        console.error("Validation error:", err);
        return;
      }
    }

    setSubmitting(true);
    setSubmittingAction(action);
    try {
      const fullData = fullServiceData[service.slug] || service;
      
      // Rebuild review array with replies + resolved status + reviewer name
      const updatedReview = (fullData.review || []).map((comment: ReviewItem, idx: number) => ({
        ...comment,
        reviewer_name: comment.reviewer_name || "Anonymous",
        resolved: resolvedComments[`${service.slug}.${idx}`] || comment.resolved || false,
        replies: replies[`${service.slug}.${idx}`] || comment.replies || []
      }));

      // Merge edited fields into full data
      const nextStatus = action === "approve"
        ? "published"
        : action === "request_changes"
          ? "changes_requested"
          : fullData.status || "draft";

      const mergedData = {
        ...fullData,
        ...editedFields[service.slug],
        status: nextStatus,
        review: updatedReview
      } as FullServiceData & Record<string, any>;

      const filename = `${service.slug}.json`;
      const jsonContent = JSON.stringify(mergedData, null, 2);
      
      const prTitle = action === "approve"
        ? `✅ Approve: ${service.name}`
        : action === "modify"
          ? `✏️ Update: ${service.name}`
          : `📝 Request changes: ${service.name}`;
      
      // Build detailed PR message
      const changedFields = Object.keys(editedFields[service.slug] || {});
      const serviceReplies = Object.entries(replies)
        .filter(([key]) => key.startsWith(service.slug + "."))
        .reduce((sum, [, replyList]) => sum + (Array.isArray(replyList) ? replyList.length : 0), 0);
      
      const prMessage = action === "approve"
        ? `✅ Review: ${service.name}\n\nApproved for publication\n\nReviewer: ${reviewerName || "Anonymous"}`
        : action === "modify"
          ? `✏️ Review: ${service.name}\n\nEdits submitted\n\nReviewer: ${reviewerName || "Anonymous"}\nFields edited: ${changedFields.length}\nTotal replies: ${serviceReplies}`
          : `📝 Review: ${service.name}\n\nReviewer: ${reviewerName || "Anonymous"}\nFields edited: ${changedFields.length}\nTotal replies: ${serviceReplies}`;
      
      const prType = action === "approve" ? "Approval" : action === "modify" ? "Update" : "Request changes";

      // Create GitHub PR
      const prUrl = await createGitHubPR(
        { author: fullData.created_by || "Moderator", name: service.name } as any,
        filename,
        jsonContent,
        prTitle,
        prMessage,
        prType,
        true, // isUpdate
        service.slug
      );

      // Notify Mattermost
      try {
        if (action === "approve") {
          await notifyPublished(service.name, reviewerName || "Anonymous", new Date().toISOString());
        } else {
          await notifyReview(service.name, changedFields.length, reviewerName || "Anonymous", new Date().toISOString());
        }
      } catch (mmError) {
        console.error("Mattermost notification failed:", mmError);
        // Don't fail the whole process if Mattermost fails
      }

      setSuccessMessage({ slug: service.slug, action, prUrl });
      setExpandedService(null);

      setEditedFields(prev => ({ ...prev, [service.slug]: {} }));
      setReplies({});
      setResolvedComments({});
      setValidationErrors(prev => ({ ...prev, [service.slug]: [] }));
      setReadyToPublish(prev => ({ ...prev, [service.slug]: false }));
      setNewCommentsCount(prev => ({ ...prev, [service.slug]: 0 }));
      loadServices();
    } catch (error) {
      console.error("Review error:", error);
      alert(tt("reviewError"));
    } finally {
      setSubmitting(false);
      setSubmittingAction(null);
    }
  };

  const getFieldValue = (service: ReviewService, field: string) => {
    const fullData = fullServiceData[service.slug] || service;
    const fieldKey = resolveFieldKey(field, fullData as FullServiceData);
    const value = fullData[fieldKey];
    if (value === null || value === undefined) return "";
    return value;
  };

  const getMergedValue = (service: ReviewService, field: string) => {
    const fullData = fullServiceData[service.slug] || service;
    const fieldKey = resolveFieldKey(field, fullData as FullServiceData);
    const editedValue = editedFields[service.slug]?.[fieldKey];
    return editedValue !== undefined ? editedValue : getFieldValue(service, field);
  };

  // Get all merged values for a service (to use for conditional field checks)
  const getAllMergedValues = (service: ReviewService): Record<string, any> => {
    const fullData = fullServiceData[service.slug] || service;
    const allFields = Object.values(FIELD_CATEGORIES).flatMap(cat => cat.fields);
    const result: Record<string, any> = { ...fullData, ...editedFields[service.slug] };
    
    // Also resolve bilingual fields
    allFields.forEach(field => {
      const fieldKey = resolveFieldKey(field, fullData as FullServiceData);
      if (fieldKey !== field && !(fieldKey in result)) {
        result[fieldKey] = getFieldValue(service, field);
      }
    });
    
    return result;
  };

  const getFieldLabel = (field: string): string => {
    // Try exact field name first
    let label = formT.t(`fieldLabels.${field}`);
    
    // If not found and field ends with _en, try without the suffix
    if (!label || label.startsWith("fieldLabels.")) {
      if (field.endsWith("_en")) {
        const baseField = field.slice(0, -3);
        label = formT.t(`fieldLabels.${baseField}`);
      }
    }
    
    // Fallback to field name if translation not found
    const resolved = label && !label.startsWith("fieldLabels.") ? label : field;
    return ucfirst(resolved);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US");
  };

  const getStatusBadgeClass = (status: "draft" | "changes_requested" | "published") => {
    return status === "draft" ? "badge-warning" : "badge-info";
  };

  const getStatusLabel = (status: "draft" | "changes_requested" | "published") => {
    const statusMap = {
      draft: tt("statusDraft"),
      changes_requested: tt("statusChangesRequested"),
      published: tt("statusPublished")
    };
    return statusMap[status];
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 shadow-sm">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            {tt("title")}
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            {tt("description")}
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-6 md:p-8">
            <div className="alert alert-info mb-8 shadow-md">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">{tt("howItWorks")}</h3>
                <div className="text-sm mt-2">{tt("howItWorksDesc")}</div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : services.length === 0 ? (
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body text-center py-12">
                  <MessageSquare className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{tt("noDrafts")}</h3>
                  <p className="text-base-content/70 mb-6">{tt("noDraftsDesc")}</p>
                  <Link href={contributePath} className="btn btn-primary">
                    {tt("contribute")}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {services.map((service) => {
                  const isExpanded = expandedService === service.slug;
                  
                  return (
                    <div key={service.slug} className="card bg-base-100 shadow-lg border border-base-300">
                      <div className="card-body">
                    {/* Success Message */}
                    {successMessage?.slug === service.slug && (
                      <div className={`alert ${successMessage.action === 'approve' || successMessage.action === 'modify' ? 'alert-success' : 'alert-info'} mb-4 flex-col items-start`}>
                        <div className="text-sm">
                          <p>{tt("successThanks")}</p>
                          {successMessage.prUrl && (
                            <p className="mt-1">
                              <a href={successMessage.prUrl} target="_blank" rel="noopener noreferrer" className="link font-semibold">
                                {tt("successPrLink")}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Auth Error Message */}
                    {authError === service.slug && (
                      <div className="alert alert-error mb-4">
                        <AlertCircle className="w-6 h-6" />
                        <div>
                          <h3 className="font-bold">{tt("authErrorTitle")}</h3>
                          <p className="text-sm">
                            {tt("authErrorMessage")}{" "}
                            <a 
                              href={`mailto:${tt("contactEmail")}`}
                              className="link link-hover font-semibold"
                            >
                              {tt("contactEmail")}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                                        {/* Service Header */}
                    <div className="flex items-start gap-4">
                      {service.logo && (
                        <div className="flex flex-col gap-2">
                          <Image
                            src={service.logo}
                            alt={service.name}
                            width={120}
                            height={120}
                            className="w-30 h-30 object-contain rounded border border-base-300 p-2"
                          />
                          <span className="text-xs text-center text-base-content/50">{tt("preview")}</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">{service.name}</h2>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className={`badge ${getStatusBadgeClass(service.status)}`}>
                            {getStatusLabel(service.status)}
                          </span>
                          <span className="badge badge-ghost flex gap-1 items-center">
                            <User className="w-3 h-3" />
                            {service.created_by}
                          </span>
                          <span className="badge badge-ghost">
                            {formatDate(service.created_at)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!isExpanded) {
                            loadFullServiceData(service.slug);
                          }
                          setExpandedService(isExpanded ? null : service.slug);
                        }}
                        className="btn btn-primary"
                      >
                        {isExpanded 
                          ? tt("hideReview") 
                          : service.status === "changes_requested"
                            ? (() => {
                                const modCount = (service.review || []).length;
                                if (lang === "fr") {
                                  return modCount > 1 
                                    ? "Commencer les modifications" 
                                    : "Commencer la modification";
                                }
                                return modCount > 1
                                  ? "Start modifications"
                                  : "Start modification";
                              })()
                            : tt("startReview")}
                      </button>
                    </div>

                    {/* Review Interface */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-base-300 space-y-6">
                        <div className="form-control max-w-sm">
                          <label className="label">
                            <span className="label-text font-medium">{tt("reviewerNameLabel")}</span>
                          </label>
                          <input
                            type="text"
                            placeholder={tt("reviewerNamePlaceholder")}
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            className="input input-bordered w-full"
                          />
                        </div>

                        {/* Fields by Category with inline comments */}
                        <div className="space-y-4">
                          {Object.entries(FIELD_CATEGORIES).map(([categoryKey, category]) => {
                            const CategoryIcon = category.icon;
                            const isCategoryExpanded = expandedCategories[`${service.slug}-${categoryKey}`];
                            const categoryLabel = tf("fieldCategories." + categoryKey);
                            
                            // Get all merged values for this service (needed for conditional checks)
                            const allValues = getAllMergedValues(service);
                            
                            // Count comments only for visible fields in this category
                            const categoryCommentCount = category.fields.reduce((total, field) => {
                              // Only count if field should be shown
                              if (!shouldShowField(field, allValues, lang)) {
                                return total;
                              }
                              const fieldComments = (service.review || []).filter(c => c.field === field);
                              return total + fieldComments.length;
                            }, 0);

                            return (
                              <div key={categoryKey} className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
                                <input
                                  type="checkbox"
                                  name={`review-${service.slug}-${categoryKey}`}
                                  checked={isCategoryExpanded}
                                  onChange={() => toggleCategory(service.slug, categoryKey)}
                                />
                                <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${category.iconBgClass} ${category.iconClass}`}>
                                    <CategoryIcon className="w-5 h-5" />
                                  </div>
                                  <span>{categoryLabel}</span>
                                  {categoryCommentCount > 0 && (
                                    <span className="badge badge-info badge-sm ml-2">{categoryCommentCount}</span>
                                  )}
                                </div>
                                <div className="collapse-content pt-4">
                                  <div className="space-y-4">
                                    {category.fields.map(field => {
                                      // Check if field should be displayed
                                      const allValues = getAllMergedValues(service);
                                      if (!shouldShowField(field, allValues, lang)) {
                                        return null;
                                      }

                                      const fieldLabel = getFieldLabel(field);
                                      const fieldValue = getMergedValue(service, field);
                                      const nationalitySummary = field === "nationality"
                                        ? buildNationalitySummary({
                                            nationality: String(getMergedValue(service, "nationality") || ""),
                                            countryName: String(getMergedValue(service, "country_name") || ""),
                                            countryCode: String(getMergedValue(service, "country_code") || "")
                                          })
                                        : undefined;
                                      const fieldCommentEntries = buildFieldCommentEntries({
                                        review: service.review || [],
                                        field,
                                        slug: service.slug,
                                        replies,
                                        resolvedComments
                                      });
                                      const fieldComments = fieldCommentEntries.map(entry => entry.comment);
                                      const isReadOnly = READ_ONLY_FIELDS.has(field);

                                      return (
                                        <FieldWithComments
                                          key={field}
                                          field={field}
                                          fieldLabel={fieldLabel}
                                          fieldValue={fieldValue}
                                          displayValueOverride={nationalitySummary}
                                          comments={fieldComments}
                                          reviewerName={reviewerName || t.t("anonymous")}
                                          isReadOnly={isReadOnly}
                                          markdownMaxLength={REVIEW_MARKDOWN_MAX_LENGTH}
                                          textareaMaxLength={REVIEW_TEXTAREA_MAX_LENGTH}
                                          onValueChange={(newValue: any) => handleFieldChange(service.slug, field, newValue)}
                                          onAddComment={(text: string) => {
                                            // Add a new comment for this field
                                            const review = service.review || [];
                                            const newComment: ReviewItem = {
                                              field,
                                              message: text,
                                              reviewer_name: reviewerName || "Anonymous",
                                              timestamp: new Date().toISOString(),
                                              resolved: false,
                                              replies: []
                                            };
                                            // Update service with new comment
                                            setServices(prevServices => 
                                              prevServices.map(s => 
                                                s.slug === service.slug 
                                                  ? { ...s, review: [...review, newComment] }
                                                  : s
                                              )
                                            );
                                            // Increment new comments counter
                                            setNewCommentsCount(prev => ({
                                              ...prev,
                                              [service.slug]: (prev[service.slug] || 0) + 1
                                            }));
                                          }}
                                          onAddReply={(commentIndex: number, text: string) => {
                                            const reviewIndex = fieldCommentEntries[commentIndex]?.reviewIndex;
                                            if (reviewIndex !== undefined) {
                                              handleAddReply(service.slug, reviewIndex, text);
                                            }
                                          }}
                                          onMarkResolved={(commentIndex: number, resolved: boolean) => {
                                            const reviewIndex = fieldCommentEntries[commentIndex]?.reviewIndex;
                                            if (reviewIndex !== undefined) {
                                              handleMarkResolved(service.slug, reviewIndex, resolved);
                                            }
                                          }}
                                          lang={lang}
                                          showCommentsInline={true}
                                        />
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 pt-4 border-t border-base-300">
                          {/* Validation Errors List */}
                          {validationErrors[service.slug]?.length > 0 && (
                            <div className="alert alert-error shadow-md">
                              <div>
                                <h3 className="font-bold mb-2 flex items-center gap-2">
                                  <AlertCircle className="w-5 h-5" />
                                  {tt("validationErrors")}
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {validationErrors[service.slug].map((error, idx) => (
                                    <li key={idx}>{error}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons Row */}
                          <div className="flex gap-3 justify-end flex-wrap">
                            <button
                              onClick={() => submitReview(service, "request_changes")}
                              disabled={submitting || (newCommentsCount[service.slug] || 0) === 0}
                              className="btn btn-info gap-2"
                            >
                              {submitting && submittingAction === "request_changes" ? (
                                <span className="loading loading-spinner loading-sm"></span>
                              ) : (
                                <MessageSquare className="w-4 h-4" />
                              )}
                              {tt("requestChanges")}
                              {(newCommentsCount[service.slug] || 0) > 0 && (
                                <span className="badge badge-sm badge-accent ml-1">
                                  {newCommentsCount[service.slug]}
                                </span>
                              )}
                            </button>
                            
                            {/* Modify button - enabled only if there are edits */}
                            <button
                              onClick={() => submitReview(service, "modify")}
                              disabled={submitting || !editedFields[service.slug] || Object.keys(editedFields[service.slug]).length === 0}
                              className="btn btn-warning gap-2"
                            >
                              {submitting && submittingAction === "modify" && !readyToPublish[service.slug] ? (
                                <span className="loading loading-spinner loading-sm"></span>
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                              {tt("modify")}
                            </button>

                            {/* OK to publish button - enabled only if ready to publish and no errors */}
                            <button
                              onClick={() => submitReview(service, "modify", true)}
                              disabled={submitting || !readyToPublish[service.slug] || validationErrors[service.slug]?.length > 0}
                              className="btn btn-success gap-2"
                            >
                              {submitting && submittingAction === "modify" && readyToPublish[service.slug] ? (
                                <span className="loading loading-spinner loading-sm"></span>
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                              {tt("publish")}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
