"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AlertCircle, User, Check, MessageSquare, FileText, Mail, Shield, Globe, Star, ArrowLeft, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
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
import { getReviewFieldDefinition, isReviewMarkdownField } from "@/components/review/fieldDefinitions";
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
  alternative: {
    icon: Star,
    iconClass: "text-warning",
    iconBgClass: "bg-warning/10",
    fields: ["better_alternative", "better_alternative_explication", "better_alternative_explication_en"]
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

  // Bilingual fields
  // For details_required_documents_en, hide it when "Autre" is selected (replaced by _autre field)
  details_required_documents_en: (values) => values.details_required_documents !== "Autre",

  // Privacy
  sanction_details: (values) => values.sanctioned_by_cnil === true,
};


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

  // Select service from hash, or default to first, once loading completes
  useEffect(() => {
    if (loading || services.length === 0) return;
    const hashSlug = window.location.hash ? window.location.hash.substring(1).replace(/^review-/, "") : "";
    const target = services.find(s => s.slug === hashSlug)?.slug || services[0].slug;
    setExpandedService(prev => prev ?? target);
    loadFullServiceData(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, services]);

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
  const [successMessage, setSuccessMessage] = useState<{ slug: string; action: 'approve' | 'request_changes' | 'modify'; prUrl?: string; isLocal?: boolean } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [readyToPublish, setReadyToPublish] = useState<Record<string, boolean>>({});

  // State for tracking new comments added during this review session
  const [newCommentsCount, setNewCommentsCount] = useState<Record<string, number>>({});

  // Local development mode detection
  const [isDevMode, setIsDevMode] = useState(false);
  useEffect(() => {
    setIsDevMode(process.env.NODE_ENV === "development");
  }, []);

  // Load reviewer name from sessionStorage if available
  useEffect(() => {
    const savedName = sessionStorage.getItem("unlock-my-data:contributor-name");
    if (savedName) {
      setReviewerName(savedName);
    }
  }, []);

  // Sync reviewer name changes to session storage AND update newly added comments
  useEffect(() => {
    if (reviewerName) {
      sessionStorage.setItem("unlock-my-data:contributor-name", reviewerName);
    } else {
      sessionStorage.removeItem("unlock-my-data:contributor-name");
    }

    // Apply reviewer name to any comments marked as added in this session
    setServices(prev => prev.map(s => {
      if (!s.review || !s.review.some((c: any) => c._isNew)) return s;
      return {
        ...s,
        review: s.review.map(c =>
          (c as any)._isNew ? { ...c, reviewer_name: reviewerName || "Anonymous" } : c
        )
      };
    }));

    setFullServiceData(prev => {
      const next = { ...prev };
      let changed = false;
      Object.keys(next).forEach(slug => {
        const s = next[slug];
        if (s.review && s.review.some((c: any) => c._isNew)) {
          changed = true;
          next[slug] = {
            ...s,
            review: s.review.map(c =>
              (c as any)._isNew ? { ...c, reviewer_name: reviewerName || "Anonymous" } : c
            )
          };
        }
      });
      return changed ? next : prev;
    });

  }, [reviewerName]);

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
    // In Review context, we want to explicitly separate generic (FR) from _en fields
    // so the reviewer can edit and review both independently of their UI language.
    return fieldName;
  }, []);

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


    let originalValue = data ? data[fieldKey] : undefined;
    if (originalValue === null || originalValue === undefined) originalValue = "";

    // Normalize newValue for comparison
    let normalizedNewValue = newValue;
    if (normalizedNewValue === null || normalizedNewValue === undefined) normalizedNewValue = "";


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

  const handleLocalSave = async (service: ReviewService, action: "approve" | "request_changes" | "modify") => {
    // Validation for modify action
    if (action === "modify") {
      setValidationErrors(prev => ({ ...prev, [service.slug]: [] }));
      const fullData = fullServiceData[service.slug] || service;
      const mergedData = { ...fullData, ...editedFields[service.slug] } as FullServiceData & Record<string, any>;
      const errors: string[] = [];

      // Check lengths (copied from submitReview logic)
      const fieldsToCheck = Object.values(FIELD_CATEGORIES).flatMap((category) => category.fields);
      fieldsToCheck.forEach((field) => {
        const fieldKey = resolveFieldKey(field, mergedData);
        const value = mergedData[fieldKey];
        if (typeof value === "string") {
          const limit = isReviewMarkdownField(field) ? REVIEW_MARKDOWN_MAX_LENGTH : REVIEW_TEXTAREA_MAX_LENGTH;
          if (value.length > limit) {
            errors.push(tt("textTooLong").replace("{max}", String(limit)) + ` (${getFieldLabel(field)})`);
          }
        }
      });

      if (errors.length > 0) {
        setValidationErrors(prev => ({ ...prev, [service.slug]: errors }));
        return;
      }
    }

    setSubmitting(true);
    setSubmittingAction(action);
    try {
      const fullData = fullServiceData[service.slug] || service;

      // Rebuild review array with replies + resolved status + reviewer name
      const updatedReview = (fullData.review || []).map((comment: ReviewItem, idx: number) => {
        // Remove internal _isNew flag before saving to JSON
        const { _isNew, ...cleanComment } = comment as any;
        return {
          ...cleanComment,
          reviewer_name: cleanComment.reviewer_name || "Anonymous",
          resolved: resolvedComments[`${service.slug}.${idx}`] || cleanComment.resolved || false,
          replies: replies[`${service.slug}.${idx}`] || cleanComment.replies || []
        };
      });

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
        review: updatedReview,
        updated_by: reviewerName || "Anonymous",
        updated_at: new Date().toISOString().split('T')[0]
      } as FullServiceData & Record<string, any>;

      const reviewSummary = {
        status: nextStatus,
        review: updatedReview
      };

      const response = await fetch("http://localhost:3002/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: service.slug,
          serviceData: mergedData,
          reviewSummary,
          contributorName: reviewerName || "Anonymous"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to connect to local review-server. Make sure 'npm run review-server' is running.");
      }

      setSuccessMessage({ slug: service.slug, action, prUrl: undefined, isLocal: true });
      
      // Cleanup
      setEditedFields(prev => ({ ...prev, [service.slug]: {} }));
      setReplies({});
      setResolvedComments({});
      setValidationErrors(prev => ({ ...prev, [service.slug]: [] }));
      setReadyToPublish(prev => ({ ...prev, [service.slug]: false }));
      setNewCommentsCount(prev => ({ ...prev, [service.slug]: 0 }));
      
      // Reload services to reflect changes
      loadServices();
    } catch (error: any) {
      console.error("Local save error:", error);
      alert("Local save error: " + error.message);
    } finally {
      setSubmitting(false);
      setSubmittingAction(null);
    }
  };

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
      const updatedReview = (fullData.review || []).map((comment: ReviewItem, idx: number) => {
        // Remove internal _isNew flag before saving to JSON
        const { _isNew, ...cleanComment } = comment as any;
        return {
          ...cleanComment,
          reviewer_name: cleanComment.reviewer_name || "Anonymous",
          resolved: resolvedComments[`${service.slug}.${idx}`] || cleanComment.resolved || false,
          replies: replies[`${service.slug}.${idx}`] || cleanComment.replies || []
        };
      });

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
        review: updatedReview,
        updated_by: reviewerName || "Anonymous",
        updated_at: new Date().toISOString().split('T')[0]
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
        { author: reviewerName || fullData.created_by || "Moderator", name: service.name } as any,
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

  const getStatusLabel = (status: "draft" | "changes_requested" | "published") => {
    const statusMap = {
      draft: tt("statusDraft"),
      changes_requested: tt("statusChangesRequested"),
      published: tt("statusPublished")
    };
    return statusMap[status];
  };

  // Status → umd-chip modifier (matches Review.jsx UI kit chips)
  const statusChipClass = (status: "draft" | "changes_requested" | "published") =>
    status === "draft" ? "umd-chip-warn" : status === "changes_requested" ? "umd-chip-info" : "umd-chip-safe";

  // Deterministic avatar colour from the slug (UI kit uses a coloured letter tile)
  const AVATAR_COLORS = ["#202080", "#4a4fc4", "#09b1ba", "#e84545", "#0b6e90", "#9a6a00", "#2a8a4a"];
  const avatarColor = (s: string) =>
    AVATAR_COLORS[[...s].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length];
  const avatarLetter = (name: string) => (name?.trim()?.[0] || "?").toUpperCase();

  const activeService = services.find(s => s.slug === expandedService) || null;

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Hero header (UI kit: indigo gradient, back link, title, count) */}
      <section style={{ background: "linear-gradient(180deg, var(--indigo-50), #fff)", borderBottom: "1px solid var(--slate-200)" }}>
        <div className="umd-wrap" style={{ padding: "36px 24px 32px" }}>
          <Link
            href={contributePath}
            className="umd-ftr-link"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14, fontSize: 13.5, padding: 0 }}
          >
            <ArrowLeft style={{ width: 15, height: 15 }} />
            {lang === "fr" ? "Toutes les façons de contribuer" : "All the ways to contribute"}
          </Link>
          <h1 className="umd-heading-2" style={{ marginBottom: 8 }}>{tt("title")}</h1>
          <p style={{ margin: 0, fontSize: 15, color: "var(--fg2)", maxWidth: 640 }}>{tt("description")}</p>
        </div>
      </section>

      <div
        className="umd-wrap umd-review-grid"
        style={{ display: "grid", gap: 28, alignItems: "start", padding: "28px 24px 80px" }}
      >
        {/* ---- Sidebar : reviewer name + service selector ---- */}
        <div className="umd-review-aside" style={{ display: "flex", flexDirection: "column", gap: 10, position: "sticky", top: 96 }}>
          {/* Global reviewer name */}
          <div className="umd-card" style={{ padding: "14px 16px" }}>
            <label className="umd-label" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <User style={{ width: 14, height: 14 }} />
              {tt("reviewerNameLabel")}
            </label>
            <input
              type="text"
              placeholder={tt("reviewerNamePlaceholder")}
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="umd-input"
            />
            <p className="umd-form-hint">
              {lang === "fr"
                ? "Ce nom sera utilisé pour l'historique et vos commentaires (y compris ceux déjà saisis)."
                : "This name will be used for the history and your comments (including those already entered)."}
            </p>
          </div>

          {/* How it works */}
          <div className="umd-alert umd-alert-info" style={{ alignItems: "flex-start" }}>
            <div className="umd-alert-ic"><AlertCircle /></div>
            <div>
              <p className="umd-alert-title">{tt("howItWorks")}</p>
              <p className="umd-alert-desc">{tt("howItWorksDesc")}</p>
            </div>
          </div>

          {/* Service list */}
          {!loading && services.length > 0 && (
            <>
              {services.map((s) => {
                const isActive = expandedService === s.slug;
                return (
                  <button
                    key={s.slug}
                    onClick={() => { loadFullServiceData(s.slug); setExpandedService(s.slug); }}
                    className="umd-card umd-card-hover"
                    style={{
                      padding: "14px 16px", textAlign: "left", cursor: "pointer", display: "flex", gap: 12, alignItems: "center",
                      borderWidth: 2, borderColor: isActive ? "var(--indigo-500)" : "var(--slate-200)", fontFamily: "inherit"
                    }}
                  >
                    <span style={{ width: 38, height: 38, borderRadius: "var(--umd-radius-md)", background: avatarColor(s.slug), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontFamily: "var(--font-display)", flexShrink: 0 }}>
                      {avatarLetter(s.name)}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontWeight: 700, fontSize: 14.5, color: "var(--fg1)" }}>{s.name}</span>
                      <span style={{ display: "block", fontSize: 12, color: "var(--fg3)", marginTop: 2 }}>
                        {lang === "fr" ? "par" : "by"} {s.created_by} · {formatDate(s.created_at)}
                      </span>
                    </span>
                    <span className={`umd-chip ${statusChipClass(s.status)}`} style={{ fontSize: 11, padding: "3px 10px" }}>
                      {getStatusLabel(s.status)}
                    </span>
                  </button>
                );
              })}
              <p style={{ fontSize: 12.5, color: "var(--fg3)", lineHeight: 1.55, margin: "8px 4px 0" }}>
                {lang === "fr"
                  ? "Relisez champ par champ ; commentez ce qui doit changer, ou approuvez pour publier."
                  : "Review field by field; comment on what needs to change, or approve to publish."}
              </p>
            </>
          )}
        </div>

        {/* ---- Detail panel ---- */}
        <div style={{ minWidth: 0 }}>
          {loading ? (
            <div className="umd-card" style={{ padding: "48px 24px", textAlign: "center", color: "var(--fg3)" }}>
              {lang === "fr" ? "Chargement…" : "Loading…"}
            </div>
          ) : services.length === 0 ? (
            <div className="umd-card" style={{ padding: "48px 24px", textAlign: "center" }}>
              <MessageSquare style={{ width: 48, height: 48, margin: "0 auto 16px", color: "var(--slate-400)" }} />
              <h3 className="umd-heading-3" style={{ marginBottom: 8 }}>{tt("noDrafts")}</h3>
              <p style={{ color: "var(--fg2)", marginBottom: 24 }}>{tt("noDraftsDesc")}</p>
              <Link href={contributePath} className="umd-btn umd-btn-primary">{tt("contribute")}</Link>
            </div>
          ) : !activeService ? null : (() => {
            const service = activeService;
            return (
              <div id={`review-${service.slug}`}>
                {/* Success Message */}
                {successMessage?.slug === service.slug && (
                  <div className={`umd-alert ${successMessage.action === "request_changes" ? "umd-alert-info" : "umd-alert-safe"}`} style={{ marginBottom: 14 }}>
                    <div className="umd-alert-ic"><Check /></div>
                    <div>
                      <p className="umd-alert-desc">{successMessage.isLocal ? tt("localSaveSuccess") : tt("successThanks")}</p>
                      {successMessage.prUrl && (
                        <a href={successMessage.prUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--indigo-700)" }}>
                          {tt("successPrLink")}
                          <ExternalLink style={{ width: 14, height: 14 }} />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Auth Error Message */}
                {authError === service.slug && (
                  <div className="umd-alert umd-alert-danger" style={{ marginBottom: 14 }}>
                    <div className="umd-alert-ic"><AlertCircle /></div>
                    <div>
                      <p className="umd-alert-title">{tt("authErrorTitle")}</p>
                      <p className="umd-alert-desc">
                        {tt("authErrorMessage")}{" "}
                        <a href={`mailto:${tt("contactEmail")}`} style={{ color: "var(--indigo-700)", fontWeight: 600 }}>{tt("contactEmail")}</a>
                      </p>
                    </div>
                  </div>
                )}

                {/* Detail header card */}
                <div className="umd-card" style={{ padding: "20px 24px", marginBottom: 14, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  {service.logo ? (
                    <Image src={service.logo} alt={service.name} width={46} height={46} style={{ width: 46, height: 46, objectFit: "contain", borderRadius: "var(--umd-radius-md)", border: "1px solid var(--slate-200)", padding: 4, flexShrink: 0 }} />
                  ) : (
                    <span style={{ width: 46, height: 46, borderRadius: "var(--umd-radius-md)", background: avatarColor(service.slug), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 19, fontFamily: "var(--font-display)", flexShrink: 0 }}>
                      {avatarLetter(service.name)}
                    </span>
                  )}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h2 className="umd-heading-3" style={{ marginBottom: 2 }}>{service.name}</h2>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--fg3)" }}>
                      {lang === "fr" ? "Proposée par" : "Submitted by"} {service.created_by} · {formatDate(service.created_at)}
                    </p>
                  </div>
                  <span className={`umd-chip ${statusChipClass(service.status)}`}>{getStatusLabel(service.status)}</span>
                </div>

                {/* Validation Errors List */}
                {validationErrors[service.slug]?.length > 0 && (
                  <div className="umd-alert umd-alert-danger" style={{ marginBottom: 14, flexDirection: "column", alignItems: "stretch" }}>
                    <p className="umd-alert-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <AlertCircle style={{ width: 18, height: 18 }} />{tt("validationErrors")}
                    </p>
                    <ul style={{ listStyle: "disc", paddingLeft: 22, fontSize: 13, color: "var(--fg2)", margin: "4px 0 0" }}>
                      {validationErrors[service.slug].map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fields by Category */}
                {Object.entries(FIELD_CATEGORIES).map(([categoryKey, category]) => {
                  const CategoryIcon = category.icon;
                  const isCategoryExpanded = expandedCategories[`${service.slug}-${categoryKey}`];
                  const categoryLabel = tf("fieldCategories." + categoryKey);
                  const allValues = getAllMergedValues(service);
                  const categoryCommentCount = category.fields.reduce((total, field) => {
                    if (!shouldShowField(field, allValues, lang)) return total;
                    const fieldComments = (service.review || []).filter(c => c.field === field);
                    return total + fieldComments.length;
                  }, 0);

                  return (
                    <div key={categoryKey} className="umd-acc">
                      <button
                        type="button"
                        className="umd-acc-head"
                        aria-expanded={!!isCategoryExpanded}
                        onClick={() => toggleCategory(service.slug, categoryKey)}
                      >
                        <span className="umd-acc-ic"><CategoryIcon /></span>
                        <span style={{ flex: 1 }}>
                          <span className="umd-acc-title">{categoryLabel}</span>
                        </span>
                        {categoryCommentCount > 0 && (
                          <span className="umd-chip umd-chip-info" style={{ fontSize: 11, padding: "2px 9px" }}>{categoryCommentCount}</span>
                        )}
                        {isCategoryExpanded ? <ChevronUp style={{ width: 18, height: 18, color: "var(--fg3)" }} /> : <ChevronDown style={{ width: 18, height: 18, color: "var(--fg3)" }} />}
                      </button>
                      {isCategoryExpanded && (
                        <div className="umd-acc-body">
                          {category.fields.map(field => {
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
                                  const review = service.review || [];
                                  const newComment: ReviewItem & { _isNew?: boolean } = {
                                    field,
                                    message: text,
                                    reviewer_name: reviewerName || "Anonymous",
                                    timestamp: new Date().toISOString(),
                                    resolved: false,
                                    replies: [],
                                    _isNew: true
                                  };
                                  setServices(prevServices =>
                                    prevServices.map(s =>
                                      s.slug === service.slug
                                        ? { ...s, review: [...review, newComment] }
                                        : s
                                    )
                                  );
                                  setFullServiceData(prev => {
                                    if (!prev[service.slug]) return prev;
                                    return {
                                      ...prev,
                                      [service.slug]: {
                                        ...prev[service.slug],
                                        review: [...(prev[service.slug].review || []), newComment]
                                      }
                                    };
                                  });
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
                      )}
                    </div>
                  );
                })}

                {/* Action Buttons Row */}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap", marginTop: 18 }}>
                  {isDevMode && (
                    <button
                      onClick={() => handleLocalSave(service, "modify")}
                      disabled={submitting}
                      className="umd-btn umd-btn-outline"
                    >
                      <Check />
                      {tt("saveLocally")}
                    </button>
                  )}
                  <button
                    onClick={() => submitReview(service, "request_changes")}
                    disabled={submitting || (newCommentsCount[service.slug] || 0) === 0}
                    className="umd-btn umd-btn-outline"
                  >
                    <MessageSquare />
                    {tt("requestChanges")}
                    {(newCommentsCount[service.slug] || 0) > 0 && (
                      <span className="umd-chip umd-chip-info" style={{ fontSize: 11, padding: "1px 8px", marginLeft: 4 }}>
                        {newCommentsCount[service.slug]}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => submitReview(service, "modify")}
                    disabled={submitting || !editedFields[service.slug] || Object.keys(editedFields[service.slug]).length === 0}
                    className="umd-btn umd-btn-primary"
                  >
                    <FileText />
                    {tt("modify")}
                  </button>

                  <button
                    onClick={() => submitReview(service, "modify", true)}
                    disabled={submitting || !readyToPublish[service.slug] || validationErrors[service.slug]?.length > 0}
                    className="umd-btn umd-btn-safe"
                  >
                    <Check />
                    {tt("publish")}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
