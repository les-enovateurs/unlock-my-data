"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { AlertCircle, User, Check, MessageSquare, Plus, ChevronDown, ChevronRight, Trash2, FileText, Mail, Shield, Globe, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Translator from "@/components/tools/t";
import dict from "@/i18n/ReviewForms.json";
import formDict from "@/i18n/ServiceForm.json";
import { createGitHubPR } from "@/tools/github";
import { ucfirst } from "@/lib/text";
import FieldWithComments from "@/components/review/FieldWithComments";
import { ReviewItem, ReviewReply } from "@/types/form";

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
  url_export?: string;
  address_export?: string;
  response_delay?: string;
  sanctioned_by_cnil?: boolean;
  sanction_details?: string;
  data_transfer_policy?: boolean;
  privacy_policy_quote?: string;
  transfer_destination_countries?: string;
  outside_eu_storage?: boolean;
  app?: { name?: string; link?: string };
  tosdr?: string;
  exodus?: string;
  permissions?: string;
  comments?: string;
}

interface ReviewFormsPageProps {
  lang: "fr" | "en";
  contributePath: string;
}

// Field categories for better organization - labels are now loaded from i18n
const FIELD_CATEGORIES = {
  general: {
    icon: FileText,
    fields: ["name", "logo", "nationality", "country_name", "country_code", "belongs_to_group", "group_name"]
  },
  contact: {
    icon: Mail,
    fields: ["contact_mail_export", "contact_mail_delete", "easy_access_data", "need_id_card", 
             "details_required_documents", "data_access_via_postal", "data_access_via_form", "data_access_via_email", 
             "url_export", "address_export", "response_delay", "response_format"]
  },
  privacy: {
    icon: Shield,
    fields: ["confidentiality_policy_url", "privacy_policy_quote", "data_transfer_policy", 
             "transfer_destination_countries", "outside_eu_storage", "sanctioned_by_cnil", "sanction_details"]
  },
  app: {
    icon: Globe,
    fields: ["app", "tosdr", "exodus", "permissions", "comments"]
  }
};

export default function ReviewFormsPage({ lang, contributePath }: ReviewFormsPageProps) {
  const t = new Translator(dict as any, lang);
  const formT = new Translator(formDict as any, lang);
  const tt = (key: string) => ucfirst(t.t(key));
  const tf = (key: string) => ucfirst(formT.t(key));
  
  // State for services and data
  const [services, setServices] = useState<ReviewService[]>([]);
  const [fullServiceData, setFullServiceData] = useState<Record<string, FullServiceData>>({});
  const [loading, setLoading] = useState(true);
  
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
  
  // State for which field is in edit mode: "slug.field"
  const [editingField, setEditingField] = useState<string | null>(null);
  
  // State for form submission
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{ slug: string; action: 'approve' | 'request_changes' } | null>(null);

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

  const isUrlField = (fieldName: string, fieldValue: any): boolean => {
    if (!fieldValue) return false;
    const valueStr = String(fieldValue);
    return fieldName.endsWith("_url") || fieldName === "app_link" || valueStr.startsWith("http");
  };

  const MARKDOWN_FIELDS = [
    "sanction_details",
    "comments",
    "comments_en",
    "privacy_policy_quote",
    "transfer_destination_countries",
    "easy_access_data",
    "details_required_documents",
    "details_required_documents_en",
    "response_format",
    "response_format_en",
    "data_access_type",
    "data_access_type_en"
  ];

  const isMarkdownField = (fieldName: string): boolean => {
    return MARKDOWN_FIELDS.includes(fieldName);
  };

  const renderMarkdown = (content: string) => {
    return (
      <div className="prose prose-sm max-w-none text-base-content/70 [&>*]:my-1 [&>ul]:my-2 [&>ol]:my-2 [&>li]:ml-4">
        <ReactMarkdown
          components={{
            p: ({ node, ...props }) => <p className="text-sm" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside" {...props} />,
            li: ({ node, ...props }) => <li className="text-sm" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
            em: ({ node, ...props }) => <em className="italic" {...props} />,
            code: ({ node, ...props }) => <code className="bg-base-200 px-1 rounded text-xs" {...props} />,
            a: ({ node, ...props }) => <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const renderAppObject = (appData: any, service: ReviewService) => {
    if (!appData || typeof appData !== "object") return null;
    
    const appName = appData.name || appData.app_name;
    const appLink = appData.link || appData.app_link || appData.url;
    
    return (
      <div className="space-y-2 bg-base-200/30 p-3 rounded">
        {appName && (
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold min-w-fit">{tf("fieldLabels.app_name")}:</span>
            <span className="text-sm text-base-content/70">{appName}</span>
          </div>
        )}
        {appLink && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold min-w-fit">{tf("fieldLabels.app_link")}:</span>
            <a 
              href={appLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-xs break-all flex items-center gap-1 group max-w-md"
            >
              <span className="overflow-hidden text-ellipsis">{appLink}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition flex-shrink-0" />
            </a>
          </div>
        )}
      </div>
    );
  };

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
  }, [reviewerName]);

  // Handle marking a comment as resolved/unresolved
  const handleMarkResolved = useCallback((slug: string, fieldIndex: number, resolved: boolean) => {
    const key = `${slug}.${fieldIndex}`;
    setResolvedComments(prev => ({ ...prev, [key]: resolved }));
  }, []);

  // Handle saving an edited field
  const handleSaveEdit = useCallback((slug: string, field: string, newValue: any) => {
    setEditedFields(prev => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        [field]: newValue
      }
    }));
    setEditingField(null);
  }, []);

  // Handle canceling field edit
  const handleCancelEdit = useCallback(() => {
    setEditingField(null);
  }, []);

  const submitReview = async (service: ReviewService, action: "approve" | "request_changes") => {
    const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    if (!githubToken) {
      alert(tt("authRequired"));
      return;
    }
    setSubmitting(true);
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
      const mergedData = {
        ...fullData,
        ...editedFields[service.slug],
        status: action === "approve" ? "published" : "changes_requested",
        review: updatedReview
      };

      const filename = `${service.slug}.json`;
      const jsonContent = JSON.stringify(mergedData, null, 2);
      
      const prTitle = action === "approve" 
        ? `✅ Approve: ${service.name}`
        : `📝 Request changes: ${service.name}`;
      
      // Build detailed PR message
      const changedFields = Object.keys(editedFields[service.slug] || {});
      const serviceReplies = Object.entries(replies)
        .filter(([key]) => key.startsWith(service.slug + "."))
        .reduce((sum, [, replyList]) => sum + (Array.isArray(replyList) ? replyList.length : 0), 0);
      
      const prMessage = action === "approve"
        ? `✅ Review: ${service.name}\n\nApproved for publication\n\nReviewer: ${reviewerName || "Anonymous"}`
        : `📝 Review: ${service.name}\n\nReviewer: ${reviewerName || "Anonymous"}\nFields edited: ${changedFields.length}\nTotal replies: ${serviceReplies}`;
      
      const prType = action === "approve" ? "Approval" : "Request changes";

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

      setSuccessMessage({ slug: service.slug, action });
      
      // Reset state after success
      setTimeout(() => {
        setSuccessMessage(null);
        setEditedFields(prev => ({ ...prev, [service.slug]: {} }));
        setReplies({});
        setResolvedComments({});
        setExpandedService(null);
        loadServices();
      }, 3000);
    } catch (error) {
      console.error("Review error:", error);
      alert(tt("reviewError"));
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldValue = (service: ReviewService, field: string) => {
    const fullData = fullServiceData[service.slug] || service;
    
    // For English language, try to get the _en suffixed version first
    let value = fullData[field];
    if (lang === "en" && !field.endsWith("_en")) {
      const enField = `${field}_en`;
      if (fullData[enField]) {
        value = fullData[enField];
      }
    }
    
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "boolean") return value ? "✓" : "✗";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{tt("title")}</h1>
          <p className="text-lg text-base-content/70">{tt("description")}</p>
        </div>

        <div className="alert alert-info mb-8">
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
                      <div className={`alert ${successMessage.action === 'approve' ? 'alert-success' : 'alert-warning'} mb-4`}>
                        <Check className="w-6 h-6" />
                        <span>
                          {successMessage.action === 'approve' 
                            ? tt("approve") + " ✓" 
                            : tt("requestChanges") + " ✓"}
                        </span>
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
                        {/* Reviewer name input - compact */}
                        <div>
                          <input
                            type="text"
                            placeholder="Votre pseudo"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            className="input input-bordered input-sm w-full max-w-xs"
                          />
                        </div>

                        {/* Fields by Category with inline comments */}
                        <div className="space-y-4">
                          {Object.entries(FIELD_CATEGORIES).map(([categoryKey, category]) => {
                            const CategoryIcon = category.icon;
                            const isCategoryExpanded = expandedCategories[`${service.slug}-${categoryKey}`];
                            const categoryLabel = tf("fieldCategories." + categoryKey);
                            
                            // Count comments for this category
                            const categoryCommentCount = category.fields.reduce((total, field) => {
                              const fieldComments = (service.review || []).filter(c => c.field === field);
                              return total + fieldComments.length;
                            }, 0);

                            return (
                              <div key={categoryKey} className="border border-base-300 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => toggleCategory(service.slug, categoryKey)}
                                  className="w-full flex items-center justify-between p-4 bg-base-200 hover:bg-base-300 transition"
                                >
                                  <div className="flex items-center gap-3">
                                    <CategoryIcon className="w-5 h-5" />
                                    <span className="font-semibold">{categoryLabel}</span>
                                    {categoryCommentCount > 0 && (
                                      <span className="badge badge-warning">{categoryCommentCount}</span>
                                    )}
                                  </div>
                                  {isCategoryExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                </button>

                                {isCategoryExpanded && (
                                  <div className="p-4 space-y-4">
                                    {category.fields.map(field => {
                                      const fieldLabel = getFieldLabel(field);
                                      const fieldValue = getFieldValue(service, field);
                                      const fieldComments = (service.review || []).filter(c => c.field === field);
                                      const fieldEditingKey = `${service.slug}.${field}`;
                                      const isFieldEditing = editingField === fieldEditingKey;

                                      return (
                                        <FieldWithComments
                                          key={field}
                                          field={field}
                                          fieldLabel={fieldLabel}
                                          fieldValue={fieldValue}
                                          comments={fieldComments}
                                          reviewerName={reviewerName || t.t("anonymous")}
                                          isEditing={isFieldEditing}
                                          editedValue={editedFields[service.slug]?.[field]}
                                          onStartEdit={() => setEditingField(fieldEditingKey)}
                                          onSaveEdit={(newValue) => handleSaveEdit(service.slug, field, newValue)}
                                          onCancelEdit={handleCancelEdit}
                                          onAddComment={(text) => {
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
                                          }}
                                          onAddReply={(commentIndex, text) => 
                                            handleAddReply(service.slug, commentIndex, text)
                                          }
                                          onMarkResolved={(commentIndex, resolved) =>
                                            handleMarkResolved(service.slug, commentIndex, resolved)
                                          }
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
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-end pt-4 border-t border-base-300">
                          <button
                            onClick={() => submitReview(service, "request_changes")}
                            disabled={submitting}
                            className="btn btn-warning gap-2"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {tt("requestChanges")}
                          </button>
                          <button
                            onClick={() => submitReview(service, "approve")}
                            disabled={submitting}
                            className="btn btn-success gap-2"
                          >
                            <Check className="w-4 h-4" />
                            {tt("approve")}
                          </button>
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
  );
}
