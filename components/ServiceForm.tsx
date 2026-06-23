"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Select from "react-select";
import { FormData, Service } from "@/types/form";
import { FORM_OPTIONS } from "@/constants/formOptions";
import { createGitHubPR, generateSlug } from "@/tools/github";
import services from "../public/data/services.json";
import Image from "next/image";
import Link from "next/link";
import { AlternativeAccordion } from "./ServiceFormAccordions/AlternativeAccordion";
import {
    Database,
    ShieldAlert,
    Smartphone,
    MessageSquare,
    CheckCircle,
    AlertCircle,
    Send,
    Building2,
    Globe,
    User,
    FileText,
    Mail,
    MapPin,
    Search,
    ExternalLink,
    Info,
    Upload,
    Trash2,
    Download,
    Plus,
    Star,
    ChevronUp,
    ChevronDown,
    ArrowLeft,
    GitPullRequest,
} from "lucide-react";
import dynamic from "next/dynamic";
import dict from "@/i18n/ServiceForm.json";
import { ucfirst } from "@/lib/text";

const MarkdownEditor = dynamic(() => import("@/components/MarkdownEditor"), {
    ssr: false,
});

interface ServiceFormProps {
    lang: "fr" | "en";
    mode: "new" | "update";
    slug?: string;
}

const initialFormData: FormData = {
    name: "",
    logo: "",
    nationality: "",
    country_name: "",
    country_code: "",
    belongs_to_group: false,
    group_name: "",
    contact_mail_export: "",
    contact_mail_delete: "",
    easy_access_data: "",
    need_id_card: false,
    details_required_documents: "",
    details_required_documents_en: "",
    data_access_via_postal: false,
    data_access_via_form: false,
    data_access_type: "",
    data_access_type_en: "",
    data_access_via_email: false,
    response_format: "",
    response_format_en: "",
    url_export: "",
    address_export: "",
    response_delay: "",
    response_delay_en: "",
    sanctioned_by_cnil: false,
    sanction_details: "",
    data_transfer_policy: false,
    privacy_policy_quote: "",
    privacy_policy_quote_en: "",
    transfer_destination_countries: [],
    transfer_destination_countries_en: "",
    outside_eu_storage: false,
    comments: "",
    comments_en: "",
    app_name: "",
    app_link: "",
    author: "",
    details_required_documents_autre: "",
    response_format_autre: "",
    response_delay_autre: "",
    confidentiality_policy_url: "",
    confidentiality_policy_url_en: "",
    example_data_export: [],
    better_alternative: false,
    better_alternative_explication: "",
    better_alternative_explication_en: "",
};

// Shared react-select look matching the UMD .umd-input field.
const umdSelectStyles = {
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    control: (base: any) => ({
        ...base,
        minHeight: "48px",
        borderColor: "var(--slate-300)",
        borderWidth: "1.5px",
        borderRadius: "var(--umd-radius-md)",
        boxShadow: "none",
        fontSize: "15px",
        ":hover": { borderColor: "var(--slate-300)" },
    }),
    placeholder: (base: any) => ({ ...base, color: "var(--slate-400)" }),
};

// Accordion section — module-level so controlled inputs inside keep focus across re-renders.
function UmdSection({
    id,
    icon,
    title,
    sub,
    open,
    onToggle,
    children,
}: {
    id: string;
    icon: React.ReactNode;
    title: React.ReactNode;
    sub?: React.ReactNode;
    open: boolean;
    onToggle: (id: string) => void;
    children: React.ReactNode;
}) {
    return (
        <div className="umd-acc">
            <button
                type="button"
                className="umd-acc-head"
                onClick={() => onToggle(id)}
                aria-expanded={open}
            >
                <span className="umd-acc-ic">{icon}</span>
                <span style={{ flex: 1 }}>
                    <span className="umd-acc-title">{title}</span>
                    {sub && <span className="umd-acc-sub">{sub}</span>}
                </span>
                {open ? (
                    <ChevronUp className="w-[18px] h-[18px]" style={{ color: "var(--fg3)" }} />
                ) : (
                    <ChevronDown className="w-[18px] h-[18px]" style={{ color: "var(--fg3)" }} />
                )}
            </button>
            {open && <div className="umd-acc-body">{children}</div>}
        </div>
    );
}

export default function ServiceForm({
    lang,
    mode,
    slug: propSlug,
}: ServiceFormProps) {
    const searchParams = useSearchParams();
    const slugParam = propSlug || searchParams.get("slug");
    const rawTranslations = (dict as any)[lang] || (dict as any).fr;
    const t = new Proxy(rawTranslations, {
        get: (target, prop: string) => {
            const value = target[prop];
            return typeof value === "string" ? ucfirst(value) : value;
        },
    }) as typeof rawTranslations;

    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<FormData>(
        mode === "new" ? initialFormData : (null as unknown as FormData),
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openAccordions, setOpenAccordions] = useState<string[]>(
        mode === "new" ? ["form-accordion-1"] : [],
    );
    const [existingService, setExistingService] = useState<Service | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingJsonData, setPendingJsonData] = useState<any>(null);
    const [pendingAdditionalFiles, setPendingAdditionalFiles] = useState<any[]>(
        [],
    );

    const nationalities = FORM_OPTIONS.nationalities;
    const responseFormatOptions = FORM_OPTIONS.responseFormats;
    const requiredDocumentsOptions = FORM_OPTIONS.requiredDocuments;
    const easyAccessOptions = FORM_OPTIONS.easyAccessLevels;
    const responseDelayOptions = FORM_OPTIONS.responseDelays;
    const MARKDOWN_MAX_LENGTH = 4000;
    const PRIVACY_QUOTE_MAX_NON_EMPTY_LINES = 5;

    const limitPrivacyQuoteExcerpt = (value: string) => {
        const normalized = (value || "").replaceAll("\r\n", "\n").replaceAll("\r", "\n");
        const lines = normalized.split("\n");
        const kept: string[] = [];
        let nonEmptyCount = 0;

        for (const line of lines) {
            const isNonEmpty = line.trim().length > 0;
            if (isNonEmpty) {
                nonEmptyCount += 1;
                if (nonEmptyCount > PRIVACY_QUOTE_MAX_NON_EMPTY_LINES) break;
            }
            kept.push(line);
        }

        return kept.join("\n").trim();
    };

    const checkServiceExists = useCallback(
        async (name: string) => {
            if (mode !== "new" || !name) {
                setExistingService(null);
                return;
            }

            const normalizedName = name.toLowerCase().trim();

            // 1. Check existing published services
            const foundInPublished = (services as unknown as Service[]).find(
                (s) => s.name.toLowerCase().trim() === normalizedName,
            );

            if (foundInPublished) {
                setExistingService(foundInPublished);
                return;
            }

            // 2. Check internal draft reviews
            try {
                const reviewsRes = await fetch("/data/reviews.json");
                if (reviewsRes.ok) {
                    const reviews = await reviewsRes.json();
                    const foundInReviews = reviews.find(
                        (s: any) => s.name.toLowerCase().trim() === normalizedName,
                    );
                    if (foundInReviews) {
                        setExistingService({
                            ...foundInReviews,
                            isDraft: true, // Visual flag for the UI (optional but helpful)
                        } as unknown as Service);
                        return;
                    }
                }
            } catch (e) {
                console.error("Failed to fetch reviews.json", e);
            }

            // 3. Check GitHub PR pending reviews
            try {
                const pendingRes = await fetch("/data/pending-reviews.json");
                if (pendingRes.ok) {
                    const pendingData = await pendingRes.json();
                    const foundInPending = (pendingData.pending_apps || []).find(
                        (p: any) => p.name.toLowerCase().trim() === normalizedName,
                    );
                    if (foundInPending) {
                        setExistingService({
                            ...foundInPending,
                            slug: "", // PRs don't have slugs directly yet
                            isPendingPR: true,
                        } as unknown as Service);
                        return;
                    }
                }
            } catch (e) {
                console.error("Failed to fetch pending-reviews.json", e);
            }

            setExistingService(null);
        },
        [mode],
    );

    const handleAccordionClick = (name: string) => {
        const newOpenAccordions = openAccordions.includes(name)
            ? openAccordions.filter((item) => item !== name)
            : [...openAccordions, name];
        setOpenAccordions(newOpenAccordions);
    };

    const loadServiceData = useCallback(
        async (serviceSlug: string) => {
            setLoading(true);
            try {
                const response = await fetch(`/data/manual/${serviceSlug}.json`);
                if (!response.ok) throw new Error(t.serviceNotFound);

                const data = await response.json();
                const originalData = { ...data };

                let countryName = data.country_name || "";
                let countryCode = data.country_code || "";
                let nationality = data.nationality || "";

                if (nationality) {
                    const exactMatch = FORM_OPTIONS.nationalities.find(
                        (n) => n.label.toLowerCase() === nationality.toLowerCase().trim(),
                    );

                    if (exactMatch) {
                        nationality = exactMatch.label;
                        if (!countryName || !countryCode) {
                            countryName = exactMatch.country_name;
                            countryCode = exactMatch.country_code;
                        }
                    } else {
                        const countryMatch = FORM_OPTIONS.countries.find(
                            (c) => c.label.toLowerCase() === nationality.toLowerCase().trim(),
                        );

                        if (countryMatch) {
                            const nationalityMatch = FORM_OPTIONS.nationalities.find(
                                (n) => n.country_code === countryMatch.country_code,
                            );

                            if (nationalityMatch) {
                                nationality = nationalityMatch.label;
                                countryName = nationalityMatch.country_name;
                                countryCode = nationalityMatch.country_code;
                            }
                        }
                    }
                }

                setFormData({
                    name: data.name || "",
                    logo: data.logo || "",
                    nationality: nationality,
                    country_name: countryName,
                    country_code: countryCode,
                    belongs_to_group: data.belongs_to_group || false,
                    group_name: data.group_name || "",
                    contact_mail_export: data.contact_mail_export || "",
                    contact_mail_delete:
                        data.contact_mail_delete || data.contact_mail_export || "",
                    easy_access_data: data.easy_access_data || "",
                    need_id_card: data.need_id_card || false,
                    data_access_via_postal: data.data_access_via_postal || false,
                    data_access_via_form: data.data_access_via_form || false,
                    data_access_type: data.data_access_type || "",
                    data_access_type_en: data.data_access_type_en || "",
                    data_access_via_email: data.data_access_via_email || false,
                    response_format: data.response_format || "",
                    response_format_en: data.response_format_en || "",
                    url_export: data.url_export || "",
                    address_export: data.address_export || "",
                    response_delay: data.response_delay || "",
                    response_delay_en: data.response_delay_en || "",
                    sanctioned_by_cnil: data.sanctioned_by_cnil || false,
                    sanction_details: data.sanction_details || "",
                    data_transfer_policy: data.data_transfer_policy || false,
                    privacy_policy_quote: data.privacy_policy_quote || "",
                    privacy_policy_quote_en: data.privacy_policy_quote_en || "",
                    transfer_destination_countries: Array.isArray(
                        data.transfer_destination_countries,
                    )
                        ? data.transfer_destination_countries
                        : data.transfer_destination_countries?.split(", ") || [],
                    transfer_destination_countries_en:
                        data.transfer_destination_countries_en || "",
                    outside_eu_storage: data.outside_eu_storage || false,
                    comments: data.comments || "",
                    comments_en: data.comments_en || "",
                    app_name: data.app?.name || "",
                    app_link: data.app?.link || "",
                    author: data.created_by || "",
                    example_data_export: data.example_data_export || [],
                    details_required_documents: (() => {
                        const raw = data.details_required_documents || "";
                        const exists = FORM_OPTIONS.requiredDocuments.find(
                            (opt) => opt.value === raw,
                        );
                        if (raw && !exists) {
                            return "Autre";
                        }
                        return raw;
                    })(),
                    details_required_documents_en:
                        data.details_required_documents_en || "",
                    details_required_documents_autre: (() => {
                        const raw = data.details_required_documents || "";
                        const exists = FORM_OPTIONS.requiredDocuments.find(
                            (opt) => opt.value === raw,
                        );
                        if (raw && !exists) {
                            return raw;
                        }
                        return "";
                    })(),
                    response_format_autre: "",
                    response_delay_autre: "",
                    confidentiality_policy_url: data.confidentiality_policy_url || "",
                    confidentiality_policy_url_en:
                        data.confidentiality_policy_url_en || "",
                    better_alternative: data.better_alternative || false,
                    better_alternative_explication:
                        data.better_alternative_explication || "",
                    better_alternative_explication_en:
                        data.better_alternative_explication_en || "",
                    originalData,
                });
                setOpenAccordions(["form-accordion-1"]);
            } catch (err) {
                setError(t.errorLoadingService);
            } finally {
                setLoading(false);
            }
        },
        [t],
    );

    const handleServiceSelect = (service: Service | null) => {
        setSelectedService(service);
        if (service) {
            loadServiceData(service.slug);
        } else {
            setFormData(null as unknown as FormData);
        }
    };

    useEffect(() => {
        if (mode === "update" && slugParam && !selectedService) {
            const serviceToSelect = (services as unknown as Service[]).find(
                (s) => s.slug === slugParam,
            );
            if (serviceToSelect) {
                handleServiceSelect(serviceToSelect);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slugParam, mode]);

    useEffect(() => {
        const nameParam = searchParams.get("name");
        if (mode === "new" && nameParam) {
            setFormData((prev) => ({ ...prev, name: nameParam }));
            checkServiceExists(nameParam);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        if (!formData) return;

        const { name, value, type } = e.target;
        const newValue =
            type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

        setFormData((prev) =>
            prev
                ? {
                    ...prev,
                    [name]: newValue,
                    ...(name === "contact_mail_export" &&
                    (!prev.contact_mail_delete || prev.contact_mail_delete.trim() === "")
                        ? { contact_mail_delete: String(newValue || "") }
                        : {}),
                }
                : prev,
        );

        // Check for existing service when name changes (new mode only)
        if (name === "name" && mode === "new") {
            checkServiceExists(value);
        }
    };

    const addExample = () => {
        setFormData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                example_data_export: [
                    ...(prev.example_data_export || []),
                    {
                        url: "",
                        type: "customer_data",
                        description: "",
                        description_en: "",
                        date: new Date().toISOString().split("T")[0],
                        file: null,
                    },
                ],
            };
        });
    };

    const removeExample = (index: number) => {
        setFormData((prev) => {
            if (!prev) return prev;
            const newExamples = [...(prev.example_data_export || [])];
            newExamples.splice(index, 1);
            return {
                ...prev,
                example_data_export: newExamples,
            };
        });
    };

    const updateExample = (index: number, field: string, value: any) => {
        setFormData((prev) => {
            if (!prev) return prev;
            const newExamples = [...(prev.example_data_export || [])];
            newExamples[index] = { ...newExamples[index], [field]: value };
            return {
                ...prev,
                example_data_export: newExamples,
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        if (mode === "update" && !selectedService) return;
        if (mode === "new" && existingService) {
            setError(t.serviceAlreadyExists);
            return;
        }

        const markdownFields: Array<keyof FormData> = [
            "sanction_details",
            "privacy_policy_quote",
            "privacy_policy_quote_en",
            "comments",
            "comments_en",
            "better_alternative_explication",
            "better_alternative_explication_en",
        ];
        const isOverLimit = markdownFields.some(
            (field) => (formData[field] || "").length > MARKDOWN_MAX_LENGTH,
        );
        if (isOverLimit) {
            setError(t.textTooLong.replace("{max}", String(MARKDOWN_MAX_LENGTH)));
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        const form = e.currentTarget as HTMLFormElement;
        if (!form.checkValidity()) {
            setOpenAccordions([
                "form-accordion-1",
                "form-accordion-2",
                "form-accordion-3",
                "form-accordion-4",
                "form-accordion-5",
            ]);
            form.reportValidity();
            setLoading(false);
            return;
        }

        try {
            const slug =
                mode === "new" ? generateSlug(formData.name) : selectedService!.slug;
            const filename = `${slug}.json`;

            // Process example exports
            const additionalFiles: Array<{
                path: string;
                content: string;
                isBinary?: boolean;
            }> = [];

            // Process Logo file if uploaded
            if ((formData as any)._logoFile) {
                const file = (formData as any)._logoFile as File;
                const readFileAsBase64 = (file: File): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const result = reader.result as string;
                            const base64Content = result.split(",")[1];
                            resolve(base64Content);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                };

                const content = await readFileAsBase64(file);
                const ext = file.name.split('.').pop();
                const filePath = `public/img/logos/${slug}.${ext}`;

                additionalFiles.push({
                    path: filePath,
                    content: content,
                    isBinary: true,
                });
            }

            const processedExamples = await Promise.all(
                (formData.example_data_export || []).map(async (example) => {
                    if (example.file) {
                        const file = example.file as File;
                        const readFileAsBase64 = (file: File): Promise<string> => {
                            return new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const result = reader.result as string;
                                    const base64Content = result.split(",")[1];
                                    resolve(base64Content);
                                };
                                reader.onerror = reject;
                                reader.readAsDataURL(file);
                            });
                        };

                        const content = await readFileAsBase64(file);
                        const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
                        const filePath = `public/export/${slug}/${safeFileName}`;

                        additionalFiles.push({
                            path: filePath,
                            content: content,
                            isBinary: true,
                        });

                        return {
                            url: `/export/${slug}/${safeFileName}`,
                            type: example.type || "customer_data",
                            description: example.description,
                            description_en: example.description_en,
                            date: example.date || new Date().toISOString().split("T")[0],
                        };
                    }

                    // Existing example without new file upload
                    return {
                        url: example.url,
                        type: example.type || "customer_data",
                        description: example.description,
                        description_en: example.description_en,
                        date: example.date,
                    };
                }),
            );

            const jsonData = {
                ...(mode === "update" && formData.originalData
                    ? formData.originalData
                    : {}),
                name: formData.name,
                logo: formData.logo,
                nationality: formData.nationality,
                country_name: formData.country_name,
                country_code: formData.country_code,
                belongs_to_group: formData.belongs_to_group,
                group_name: formData.group_name,
                ...(mode === "new" ? { permissions: "" } : {}),
                contact_mail_export: formData.contact_mail_export,
                contact_mail_delete:
                    formData.contact_mail_delete || formData.contact_mail_export || "",
                easy_access_data: formData.easy_access_data,
                need_id_card: formData.need_id_card,
                details_required_documents:
                    formData.details_required_documents === "Autre" &&
                        formData.details_required_documents_autre !== ""
                        ? formData.details_required_documents_autre
                        : formData.details_required_documents,
                confidentiality_policy_url: formData.confidentiality_policy_url,
                confidentiality_policy_url_en: formData.confidentiality_policy_url_en,
                data_access_via_postal: formData.data_access_via_postal,
                data_access_via_form: formData.data_access_via_form,
                data_access_type: formData.data_access_type,
                data_access_type_en: formData.data_access_type_en,
                data_access_via_email: formData.data_access_via_email,
                response_format:
                    formData.response_format === "Autre" &&
                        formData.response_format_autre !== ""
                        ? formData.response_format_autre
                        : formData.response_format,
                example_data_export: processedExamples,
                ...(mode === "new"
                    ? {
                        example_form_export: [],
                        message_exchange: [],
                    }
                    : {}),
                url_export: formData.url_export,
                address_export: formData.address_export,
                response_delay:
                    formData.response_delay === "Autre" &&
                        formData.response_delay_autre !== ""
                        ? formData.response_delay_autre
                        : formData.response_delay,
                sanctioned_by_cnil: formData.sanctioned_by_cnil,
                sanction_details: formData.sanction_details,
                data_transfer_policy: formData.data_transfer_policy,
                privacy_policy_quote: formData.privacy_policy_quote,
                transfer_destination_countries:
                    formData.transfer_destination_countries.join(", "),
                transfer_destination_countries_en:
                    formData.transfer_destination_countries
                        .map((countryLabel) => {
                            const country = FORM_OPTIONS.countries.find(
                                (c) => c.label === countryLabel,
                            );
                            return country?.country_name || countryLabel;
                        })
                        .join(", "),
                outside_eu_storage: formData.outside_eu_storage,
                comments: formData.comments,
                comments_en: formData.comments_en,
                better_alternative: formData.better_alternative || false,
                better_alternative_explication:
                    formData.better_alternative_explication || "",
                better_alternative_explication_en:
                    formData.better_alternative_explication_en || "",
                ...(mode === "new"
                    ? {
                        tosdr: "",
                        exodus: "",
                        created_at: new Date().toISOString().split("T")[0],
                        created_by: formData.author || "Unlock My Data Team",
                        updated_at: "",
                        updated_by: "",
                    }
                    : {
                        updated_at: new Date().toISOString().split("T")[0],
                        updated_by: formData.author,
                    }),
                app: {
                    name: formData.app_name,
                    link: formData.app_link,
                },
            };

            // Remove originalData from final JSON
            if ("originalData" in jsonData) {
                delete (jsonData as any).originalData;
            }

            // Set status to draft and initialize review array
            (jsonData as any).status = "draft";
            (jsonData as any).review = [];

            setPendingJsonData(jsonData);
            setPendingAdditionalFiles(additionalFiles);
            setShowConfirmModal(true);
            setLoading(false);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : mode === "new"
                        ? t.errorCreating
                        : t.errorUpdating,
            );
            setLoading(false);
        }
    };

    const handleConfirmSubmit = async () => {
        if (!pendingJsonData || !formData) return;

        setLoading(true);
        setShowConfirmModal(false);

        try {
            const slug =
                mode === "new" ? generateSlug(formData.name) : selectedService!.slug;
            const filename = `${slug}.json`;
            const jsonContent = JSON.stringify(pendingJsonData, null, 2);

            const prTitle =
                mode === "new"
                    ? `${t.prTitleNew} ${formData.name}`
                    : `${t.prTitleUpdate} ${formData.name}`;
            const prMessage =
                mode === "new"
                    ? `${t.prMessageNew} ${formData.name}`
                    : `${t.prMessageUpdate} ${formData.name}`;
            const prType = mode === "new" ? t.prTypeNew : t.prTypeUpdate;

            const prUrl = await createGitHubPR(
                formData,
                filename,
                jsonContent,
                prTitle,
                prMessage,
                prType,
                mode === "update",
                slug,
                pendingAdditionalFiles,
            );

            const successHtml = `
                <div class="flex flex-col gap-1">
                    <p class="font-semibold">${mode === "new" ? t.successCreated : t.successUpdated}</p>
                    <a href="${prUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-green-800 hover:text-green-900 font-bold underline transition-colors">
                        ${t.viewPR}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                </div>
            `;

            if (mode === "new") {
                setSuccess(successHtml);
                setFormData(initialFormData);
                setExistingService(null);
            } else {
                setSuccess(successHtml);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : mode === "new"
                        ? t.errorCreating
                        : t.errorUpdating,
            );
        } finally {
            setLoading(false);
            setPendingJsonData(null);
            setPendingAdditionalFiles([]);
        }
    };

    const getUpdateUrl = () => {
        if (!existingService) return "#";
        return lang === "fr"
            ? `/contribuer/modifier-fiche?slug=${existingService.slug}`
            : `/contribute/update-form?slug=${existingService.slug}`;
    };

    // Get label based on language
    const getOptionLabel = (opt: { label: string; label_en?: string }) => {
        const label = lang === "en" && opt.label_en ? opt.label_en : opt.label;
        return ucfirst(label);
    };

    const getExplanationLabel = (opt: {
        explanation: string;
        explanation_en?: string;
    }) => {
        const explanation =
            lang === "en" && opt.explanation_en
                ? opt.explanation_en
                : opt.explanation;
        return ucfirst(explanation);
    };

    return (
        <div
            className="min-h-screen"
            style={{ background: "var(--slate-50)", fontFamily: "var(--font-text)" }}
        >
            <section
                style={{
                    background: "linear-gradient(180deg, var(--indigo-50), #fff)",
                    borderBottom: "1px solid var(--slate-200)",
                }}
            >
                <div className="mx-auto" style={{ maxWidth: 880, padding: "36px 24px 32px" }}>
                    <Link
                        href={lang === "fr" ? "/contribuer" : "/contribute"}
                        className="inline-flex items-center gap-1.5"
                        style={{
                            fontSize: 13.5,
                            color: "var(--indigo-700)",
                            textDecoration: "none",
                            marginBottom: 14,
                        }}
                    >
                        <ArrowLeft className="w-[15px] h-[15px]" />
                        {lang === "fr"
                            ? "Toutes les façons de contribuer"
                            : "All the ways to contribute"}
                    </Link>
                    <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
                        <span className="umd-acc-ic">
                            <FileText className="w-[18px] h-[18px]" />
                        </span>
                        <h1 className="umd-heading-2" style={{ margin: 0 }}>
                            {mode === "new" ? t.newFormTitle : t.updateFormTitle}
                        </h1>
                    </div>
                    <p style={{ margin: 0, fontSize: 15, color: "var(--fg2)", lineHeight: 1.6 }}>
                        {mode === "new" ? t.newFormDescription : t.updateFormDescription}
                    </p>
                </div>
            </section>

            <div className="mx-auto" style={{ maxWidth: 880, padding: "28px 24px 80px" }}>
                <div>
                    <div>
                        {error && (
                            <div role="alert" className="umd-alert umd-alert-danger" style={{ marginBottom: 16 }}>
                                <span className="umd-alert-ic">
                                    <AlertCircle />
                                </span>
                                <div>
                                    <p className="umd-alert-desc">{error}</p>
                                </div>
                            </div>
                        )}
                        {success && (
                            <div role="alert" className="umd-alert umd-alert-safe" style={{ marginBottom: 16 }}>
                                <span className="umd-alert-ic">
                                    <CheckCircle />
                                </span>
                                <div
                                    className="umd-alert-desc"
                                    dangerouslySetInnerHTML={{ __html: success }}
                                />
                            </div>
                        )}

                        {/* Service exists warning (new mode only) */}
                        {mode === "new" && existingService && (
                            <div
                                className="umd-alert umd-alert-info"
                                style={{
                                    marginBottom: 16,
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: 14,
                                }}
                            >
                                <div className="flex items-center" style={{ gap: 14, flex: 1, minWidth: 240 }}>
                                    <span className="umd-alert-ic">
                                        <Info />
                                    </span>
                                    <div>
                                        <p className="umd-alert-title">
                                            {t.serviceAlreadyExists}{" "}
                                            <strong>{existingService.name}</strong>
                                        </p>
                                        <p className="umd-alert-desc">
                                            {(existingService as any).isDraft
                                                ? lang === "fr"
                                                    ? "Ce service est déjà en cours de relecture."
                                                    : "This service is already under review."
                                                : (existingService as any).isPendingPR
                                                    ? lang === "fr"
                                                        ? "Ce service est actuellement en cours de validation (PR GitHub)."
                                                        : "This service is currently being validated (GitHub PR)."
                                                    : t.suggestUpdate}
                                        </p>
                                    </div>
                                </div>
                                {!(
                                    (existingService as any).isDraft ||
                                    (existingService as any).isPendingPR
                                ) && (
                                        <Link
                                            href={getUpdateUrl()}
                                            className="umd-btn umd-btn-primary umd-btn-sm"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            {t.goToUpdate}
                                        </Link>
                                    )}
                                {(existingService as any).isDraft && (
                                    <Link
                                        href={`/contribuer/fiches-a-revoir#review-${existingService.slug}`}
                                        className="umd-btn umd-btn-primary umd-btn-sm"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        {lang === "fr" ? "Voir la relecture" : "View review"}
                                    </Link>
                                )}
                                {(existingService as any).isPendingPR && (
                                    <a
                                        href={(existingService as any).pr_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="umd-btn umd-btn-primary umd-btn-sm"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        {lang === "fr" ? "Voir la PR" : "View the PR"}
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Service selector (update mode only) */}
                        {mode === "update" && (
                            <div
                                className="umd-card"
                                style={{ padding: 20, marginBottom: 24 }}
                            >
                                <div>
                                    <h2
                                        className="flex items-center gap-2"
                                        style={{
                                            fontWeight: 700,
                                            fontSize: 16,
                                            marginBottom: 14,
                                            color: "var(--fg1)",
                                        }}
                                    >
                                        <Search className="w-5 h-5" style={{ color: "var(--indigo-700)" }} />
                                        {t.selectServiceTitle}
                                    </h2>
                                    <Select
                                        options={services as unknown as Service[]}
                                        value={selectedService}
                                        onChange={handleServiceSelect}
                                        placeholder={t.selectServicePlaceholder}
                                        isClearable
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.slug}
                                        formatOptionLabel={(option) => (
                                            <div className="flex items-center gap-3">
                                                {option.logo && (
                                                    <Image
                                                        src={option.logo}
                                                        alt={option.name}
                                                        width={32}
                                                        height={32}
                                                        className="w-8 h-8 object-contain"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium">{option.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {lang === "fr"
                                                            ? option.nationality
                                                            : option.country_name}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        menuPortalTarget={
                                            typeof window !== "undefined" ? document.body : null
                                        }
                                        styles={umdSelectStyles}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        {(mode === "new" || formData) && (
                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                {/* General Information */}
                                <UmdSection
                                    id="form-accordion-1"
                                    open={openAccordions.includes("form-accordion-1")}
                                    onToggle={handleAccordionClick}
                                    icon={<Building2 />}
                                    title={t.generalInfo}
                                >
                                        <div className="umd-form-grid">
                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.companyName}{" "}
                                                        <span style={{ color: "var(--red-600)" }}>*</span>
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData?.name || ""}
                                                    onChange={handleInputChange}
                                                    className={`umd-input ${existingService ? "umd-input-warning" : ""}`}
                                                    placeholder={t.placeholderCompanyName}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.logoUrl}
                                                    </span>
                                                </label>
                                                <div className="flex flex-col gap-2">
                                                    <div className="w-full" title={t.logoTooltip}>
                                                        <div className="umd-field">
                                                            <input
                                                                type="text"
                                                                name="logo"
                                                                value={formData?.logo || ""}
                                                                onChange={handleInputChange}
                                                                className="umd-input umd-has-ic"
                                                                placeholder={t.placeholderLogoUrl}
                                                            />
                                                            <Globe className="" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs opacity-60">{lang === 'fr' ? 'OU' : 'OR'}</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    const file = e.target.files[0];
                                                                    const slug = mode === "new" ? generateSlug(formData.name) : (propSlug || searchParams.get("slug") || "service");
                                                                    const ext = file.name.split('.').pop();
                                                                    const fileName = `${slug}.${ext}`;
                                                                    
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        logo: `/img/logos/${fileName}`,
                                                                        _logoFile: file // Temporary store the file object
                                                                    }));
                                                                }
                                                            }}
                                                            className="umd-input"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ zIndex: 100 }}>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.nationality}{" "}
                                                        <span style={{ color: "var(--red-600)" }}>*</span>
                                                    </span>
                                                </label>
                                                <Select
                                                    options={nationalities}
                                                    value={
                                                        nationalities.find(
                                                            (n) => n.label === formData?.nationality,
                                                        ) || null
                                                    }
                                                    onChange={(selected) => {
                                                        setFormData((prev) =>
                                                            prev
                                                                ? {
                                                                    ...prev,
                                                                    nationality: selected?.label || "",
                                                                    country_name: selected?.country_name || "",
                                                                    country_code: selected?.country_code || "",
                                                                }
                                                                : prev,
                                                        );
                                                    }}
                                                    placeholder={t.searchNationality}
                                                    isClearable
                                                    getOptionLabel={(option) =>
                                                        lang === "en" ? option.country_name : option.label
                                                    }
                                                    getOptionValue={(option) => option.label}
                                                    required
                                                    menuPortalTarget={
                                                        typeof window !== "undefined" ? document.body : null
                                                    }
                                                    styles={umdSelectStyles}
                                                />
                                            </div>

                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {mode === "new" ? t.formAuthor : t.modifiedBy}{" "}
                                                        <span style={{ color: "var(--red-600)" }}>*</span>
                                                    </span>
                                                </label>
                                                <div className="umd-field">
                                                    <input
                                                        type="text"
                                                        name="author"
                                                        value={formData?.author || ""}
                                                        onChange={handleInputChange}
                                                        className="umd-input umd-has-ic"
                                                        placeholder={
                                                            mode === "new"
                                                                ? t.authorPlaceholder
                                                                : t.editorPlaceholder
                                                        }
                                                        required
                                                    />
                                                    <User className="" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="umd-divider"></div>

                                        <label className="umd-switch-line">
                                            <input
                                                type="checkbox"
                                                name="belongs_to_group"
                                                checked={formData?.belongs_to_group || false}
                                                onChange={handleInputChange}
                                            />
                                            {t.belongsToGroup}
                                        </label>

                                        {formData?.belongs_to_group && (
                                            <div className="mt-4">
                                                <label>
                                                    <span className="umd-label">
                                                        {t.groupName}
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="group_name"
                                                    value={formData?.group_name || ""}
                                                    onChange={handleInputChange}
                                                    className="umd-input"
                                                    placeholder={t.placeholderGroupName}
                                                />
                                            </div>
                                        )}
                                </UmdSection>

                                {/* Data Access */}
                                <UmdSection
                                    id="form-accordion-2"
                                    open={openAccordions.includes("form-accordion-2")}
                                    onToggle={handleAccordionClick}
                                    icon={<Database />}
                                    title={t.dataAccess}
                                >
                                        <div className="umd-form-grid">
                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.contactEmail}
                                                    </span>
                                                </label>
                                                <div className="umd-field">
                                                    <input
                                                        type="email"
                                                        name="contact_mail_export"
                                                        value={formData?.contact_mail_export || ""}
                                                        onChange={handleInputChange}
                                                        className="umd-input umd-has-ic"
                                                        placeholder={t.placeholderContactEmail}
                                                    />
                                                    <Mail className="" />
                                                </div>
                                            </div>

                                            <div style={{ zIndex: 90 }}>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.easyAccessData}{" "}
                                                        <span style={{ color: "var(--red-600)" }}>*</span>
                                                    </span>
                                                </label>
                                                <Select
                                                    name="easy_access_data"
                                                    options={easyAccessOptions}
                                                    value={
                                                        easyAccessOptions.find(
                                                            (opt) =>
                                                                opt.value === formData?.easy_access_data ||
                                                                opt.value + "/5" === formData?.easy_access_data,
                                                        ) || null
                                                    }
                                                    onChange={(selected) =>
                                                        setFormData((prev) =>
                                                            prev
                                                                ? {
                                                                    ...prev,
                                                                    easy_access_data: selected?.value || "",
                                                                }
                                                                : prev,
                                                        )
                                                    }
                                                    placeholder={t.selectLevel}
                                                    isClearable
                                                    formatOptionLabel={(option) => (
                                                        <div className="flex items-center justify-between">
                                                            <span className="umd-chip umd-chip-neutral">
                                                                {option.note}/5
                                                            </span>
                                                            <span className="text-sm text-base-content/70 ml-2">
                                                                {getExplanationLabel(option)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    getOptionLabel={(option) => option.note}
                                                    getOptionValue={(option) => option.value}
                                                    required
                                                    menuPortalTarget={
                                                        typeof window !== "undefined" ? document.body : null
                                                    }
                                                    styles={umdSelectStyles}
                                                />
                                            </div>
                                        </div>

                                        <div className="umd-divider-label">
                                            {t.accessMethods}
                                        </div>

                                        <div className="flex flex-wrap gap-2.5">
                                            <label className={`umd-check-line${formData?.data_access_via_postal ? " umd-on" : ""}`}>
                                                <input
                                                    type="checkbox"
                                                    style={{ display: "none" }}
                                                    name="data_access_via_postal"
                                                    checked={formData?.data_access_via_postal || false}
                                                    onChange={handleInputChange}
                                                />
                                                {t.postalMail}
                                            </label>

                                            <label className={`umd-check-line${formData?.data_access_via_form ? " umd-on" : ""}`}>
                                                <input
                                                    type="checkbox"
                                                    style={{ display: "none" }}
                                                    name="data_access_via_form"
                                                    checked={formData?.data_access_via_form || false}
                                                    onChange={handleInputChange}
                                                />
                                                {t.webForm}
                                            </label>

                                            <label className={`umd-check-line${formData?.data_access_via_email ? " umd-on" : ""}`}>
                                                <input
                                                    type="checkbox"
                                                    style={{ display: "none" }}
                                                    name="data_access_via_email"
                                                    checked={formData?.data_access_via_email || false}
                                                    onChange={handleInputChange}
                                                />
                                                {t.email}
                                            </label>
                                        </div>

                                        <div className="umd-divider-label">
                                            {t.procedureDetails}
                                        </div>

                                        <div className="umd-form-grid">
                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.requiredDocuments}{" "}
                                                        <span style={{ color: "var(--red-600)" }}>*</span>
                                                    </span>
                                                </label>
                                                <select
                                                    name="details_required_documents"
                                                    value={formData?.details_required_documents || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setFormData((prev) =>
                                                            prev
                                                                ? {
                                                                    ...prev,
                                                                    details_required_documents: value,
                                                                    need_id_card: value === "Carte d'identité",
                                                                }
                                                                : prev,
                                                        );
                                                    }}
                                                    className="umd-input"
                                                    required
                                                >
                                                    {requiredDocumentsOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {getOptionLabel(opt)}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formData?.details_required_documents === "Autre" && (
                                                    <input
                                                        type="text"
                                                        name="details_required_documents_autre"
                                                        value={
                                                            formData?.details_required_documents_autre || ""
                                                        }
                                                        onChange={handleInputChange}
                                                        className="umd-input mt-2"
                                                        placeholder={t.specifyDocument}
                                                        required
                                                    />
                                                )}
                                            </div>

                                            {formData?.details_required_documents === "Autre" && (
                                                <div className="mt-12">
                                                    <label>
                                                        <span className="umd-label">
                                                            {t.requiredDocumentsEn}
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="details_required_documents_en"
                                                        value={
                                                            formData?.details_required_documents_en || ""
                                                        }
                                                        onChange={handleInputChange}
                                                        className="umd-input"
                                                        placeholder={t.requiredDocumentsEnPlaceholder}
                                                    />
                                                </div>
                                            )}

                                            {formData?.details_required_documents !== "Autre" && (
                                                <br />
                                            )}

                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.howToRequest}
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="data_access_type"
                                                    value={formData?.data_access_type || ""}
                                                    onChange={handleInputChange}
                                                    className="umd-input"
                                                    placeholder={t.placeholderHowToRequest}
                                                />
                                            </div>

                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.howToRequestEn}
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="data_access_type_en"
                                                    value={formData?.data_access_type_en || ""}
                                                    onChange={handleInputChange}
                                                    className="umd-input"
                                                    placeholder={t.placeholderHowToRequestEn}
                                                />
                                            </div>

                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.responseFormat}
                                                    </span>
                                                </label>
                                                <select
                                                    name="response_format"
                                                    value={formData?.response_format || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setFormData((prev) =>
                                                            prev
                                                                ? {
                                                                    ...prev,
                                                                    response_format: value,
                                                                }
                                                                : prev,
                                                        );
                                                    }}
                                                    className="umd-input"
                                                >
                                                    {responseFormatOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {getOptionLabel(opt)}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formData?.response_format === "Autre" && (
                                                    <input
                                                        type="text"
                                                        name="response_format_autre"
                                                        value={formData?.response_format_autre || ""}
                                                        onChange={handleInputChange}
                                                        className="umd-input mt-2"
                                                        placeholder={t.specifyFormat}
                                                        required
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.responseDelay}
                                                    </span>
                                                </label>
                                                <select
                                                    name="response_delay"
                                                    value={formData?.response_delay || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setFormData((prev) =>
                                                            prev
                                                                ? {
                                                                    ...prev,
                                                                    response_delay: value,
                                                                }
                                                                : prev,
                                                        );
                                                    }}
                                                    className="umd-input"
                                                >
                                                    {responseDelayOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {getOptionLabel(opt)}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formData?.response_delay === "Autre" && (
                                                    <input
                                                        type="text"
                                                        name="response_delay_autre"
                                                        value={formData?.response_delay_autre || ""}
                                                        onChange={handleInputChange}
                                                        className="umd-input mt-2"
                                                        placeholder={t.specifyDelay}
                                                        required
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="umd-divider-label">
                                            {t.exportContactDetails}
                                        </div>

                                        <div className="umd-form-grid">
                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.websiteUrl}
                                                    </span>
                                                </label>
                                                <div className="umd-field">
                                                    <input
                                                        type="url"
                                                        name="url_export"
                                                        value={formData?.url_export || ""}
                                                        onChange={handleInputChange}
                                                        className="umd-input umd-has-ic"
                                                        placeholder={t.placeholderWebsiteUrl}
                                                    />
                                                    <Globe className="" />
                                                </div>
                                            </div>

                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.postalAddress}
                                                    </span>
                                                </label>
                                                <div className="umd-field">
                                                    <input
                                                        type="text"
                                                        name="address_export"
                                                        value={formData?.address_export || ""}
                                                        onChange={handleInputChange}
                                                        className="umd-input umd-has-ic"
                                                        placeholder={t.placeholderPostalAddress}
                                                    />
                                                    <MapPin className="" />
                                                </div>
                                            </div>
                                        </div>
                                </UmdSection>

                                {/* Sanctions and Transfers */}
                                <UmdSection
                                    id="form-accordion-3"
                                    open={openAccordions.includes("form-accordion-3")}
                                    onToggle={handleAccordionClick}
                                    icon={<ShieldAlert />}
                                    title={t.sanctionsTransfers}
                                >
                                        <div className="umd-form-grid">
                                            <label className="umd-switch-line">
                                                <input
                                                    type="checkbox"
                                                    name="sanctioned_by_cnil"
                                                    checked={formData?.sanctioned_by_cnil || false}
                                                    onChange={handleInputChange}
                                                />
                                                {t.sanctionedByCnil}
                                            </label>

                                            <label className="umd-switch-line">
                                                <input
                                                    type="checkbox"
                                                    name="data_transfer_policy"
                                                    checked={formData?.data_transfer_policy || false}
                                                    onChange={handleInputChange}
                                                />
                                                {t.dataTransferPolicy}
                                            </label>

                                            <label className="umd-switch-line">
                                                <input
                                                    type="checkbox"
                                                    name="outside_eu_storage"
                                                    checked={formData?.outside_eu_storage || false}
                                                    onChange={handleInputChange}
                                                />
                                                {t.storageOutsideEu}
                                            </label>
                                        </div>

                                        {formData?.sanctioned_by_cnil && (
                                            <div className="mb-6">
                                                <label>
                                                    <span className="umd-label">
                                                        {t.sanctionDetails}
                                                    </span>
                                                </label>
                                                <MarkdownEditor
                                                    value={formData?.sanction_details || ""}
                                                    onChange={(val: string) =>
                                                        setFormData((prev) =>
                                                            prev ? { ...prev, sanction_details: val } : prev,
                                                        )
                                                    }
                                                    placeholder={t.describeSanctions}
                                                    maxLength={MARKDOWN_MAX_LENGTH}
                                                    showCounter
                                                />
                                            </div>
                                        )}

                                        <div className="umd-form-grid">
                                            <div style={{ zIndex: 80 }}>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.transferDestinationCountries}
                                                    </span>
                                                </label>
                                                <Select
                                                    isMulti
                                                    options={FORM_OPTIONS.countries}
                                                    value={FORM_OPTIONS.countries.filter((n) =>
                                                        formData?.transfer_destination_countries?.includes(
                                                            n.label,
                                                        ),
                                                    )}
                                                    onChange={(selected) =>
                                                        setFormData((prev) =>
                                                            prev
                                                                ? {
                                                                    ...prev,
                                                                    transfer_destination_countries: selected
                                                                        ? selected.map((s: any) => s.label)
                                                                        : [],
                                                                }
                                                                : prev,
                                                        )
                                                    }
                                                    placeholder={t.selectCountries}
                                                    isClearable
                                                    getOptionLabel={(option) =>
                                                        lang === "en" ? option.country_name : option.label
                                                    }
                                                    getOptionValue={(option) => option.label}
                                                    menuPortalTarget={
                                                        typeof window !== "undefined" ? document.body : null
                                                    }
                                                    styles={umdSelectStyles}
                                                />
                                            </div>
                                        </div>

                                        <div className="umd-divider"></div>

                                        <div className="umd-form-grid">
                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.privacyPolicyUrl}
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="confidentiality_policy_url"
                                                    value={formData?.confidentiality_policy_url || ""}
                                                    onChange={handleInputChange}
                                                    className="umd-input"
                                                    placeholder={t.placeholderPrivacyPolicyUrl}
                                                />
                                            </div>
                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.privacyPolicyUrlEn}
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="confidentiality_policy_url_en"
                                                    value={formData?.confidentiality_policy_url_en || ""}
                                                    onChange={handleInputChange}
                                                    className="umd-input"
                                                    placeholder={t.placeholderPrivacyPolicyUrl}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-5">
                                            <label>
                                                <span className="umd-label">
                                                    {t.privacyPolicyQuote}
                                                </span>
                                            </label>
                                            <p className="umd-form-hint" style={{ marginBottom: 8 }}>
                                                {lang === "fr"
                                                    ? "Collez uniquement l'extrait sur le transfert de données (5 lignes max)."
                                                    : "Paste only the excerpt about data transfers (max 5 non-empty lines)."}
                                            </p>
                                            <MarkdownEditor
                                                value={
                                                    formData?.privacy_policy_quote
                                                        .replaceAll("<br> ", "\n")
                                                        .replaceAll("<br>/n", "\n") || ""
                                                }
                                                onChange={(val: string) =>
                                                    setFormData((prev) =>
                                                        prev
                                                            ? {
                                                                ...prev,
                                                                privacy_policy_quote:
                                                                    limitPrivacyQuoteExcerpt(val),
                                                            }
                                                            : prev,
                                                    )
                                                }
                                                placeholder={
                                                    lang === "fr"
                                                        ? "Extrait transfert de donnees uniquement (2-5 lignes max)."
                                                        : "Data transfer excerpt only (2-5 lines max)."
                                                }
                                                maxLength={MARKDOWN_MAX_LENGTH}
                                                showCounter
                                            />
                                        </div>

                                        <div>
                                            <label>
                                                <span className="umd-label">
                                                    {t.privacyPolicyQuoteEn}
                                                </span>
                                            </label>
                                            <p className="umd-form-hint" style={{ marginBottom: 8 }}>
                                                {lang === "fr"
                                                    ? "Version EN: gardez seulement la partie transfert de donnees (5 lignes non vides max)."
                                                    : "EN version: keep only the data transfer section (max 5 non-empty lines)."}
                                            </p>
                                            <MarkdownEditor
                                                value={
                                                    formData?.privacy_policy_quote_en
                                                        ?.replaceAll("<br> ", "\n")
                                                        .replaceAll("<br>/n", "\n") || ""
                                                }
                                                onChange={(val: string) =>
                                                    setFormData((prev) =>
                                                        prev
                                                            ? {
                                                                ...prev,
                                                                privacy_policy_quote_en:
                                                                    limitPrivacyQuoteExcerpt(val),
                                                            }
                                                            : prev,
                                                    )
                                                }
                                                placeholder={
                                                    lang === "fr"
                                                        ? "Extrait EN sur le transfert de donnees (2-5 lignes max)."
                                                        : "EN data transfer excerpt only (2-5 lines max)."
                                                }
                                                maxLength={MARKDOWN_MAX_LENGTH}
                                                showCounter
                                            />
                                        </div>
                                </UmdSection>

                                {/* Alternative Recommandée */}
                                <AlternativeAccordion
                                    openAccordions={openAccordions}
                                    handleAccordionClick={handleAccordionClick}
                                    formData={formData}
                                    setFormData={setFormData}
                                    t={t}
                                    MARKDOWN_MAX_LENGTH={MARKDOWN_MAX_LENGTH}
                                />

                                {/* Mobile Application */}
                                <UmdSection
                                    id="form-accordion-4"
                                    open={openAccordions.includes("form-accordion-4")}
                                    onToggle={handleAccordionClick}
                                    icon={<Smartphone />}
                                    title={t.mobileApp}
                                    sub={t.mobileAppOptional}
                                >
                                        <div className="umd-form-grid">
                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.appName}
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="app_name"
                                                    value={formData?.app_name || ""}
                                                    onChange={handleInputChange}
                                                    className="umd-input"
                                                    placeholder={t.placeholderAppName}
                                                />
                                            </div>

                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.appLink}
                                                    </span>
                                                </label>
                                                <input
                                                    type="url"
                                                    name="app_link"
                                                    value={formData?.app_link || ""}
                                                    onChange={handleInputChange}
                                                    placeholder={t.placeholderAppLink}
                                                    className="umd-input"
                                                />
                                            </div>
                                        </div>
                                </UmdSection>

                                {/* Example Data Export */}
                                <UmdSection
                                    id="form-accordion-6"
                                    open={openAccordions.includes("form-accordion-6")}
                                    onToggle={handleAccordionClick}
                                    icon={<Upload />}
                                    title={t.exampleExports}
                                >
                                        <div className="umd-alert umd-alert-warn" style={{ marginBottom: 8 }}>
                                            <span className="umd-alert-ic">
                                                <ShieldAlert />
                                            </span>
                                            <p className="umd-alert-desc">
                                                {t.anonymizationWarning}
                                            </p>
                                        </div>

                                        {formData?.example_data_export?.map((example, index) => (
                                            <div
                                                key={index}
                                                className="umd-card" style={{ position: "relative", padding: 20, marginBottom: 8 }}
                                            >
                                                <div className="absolute right-4 top-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExample(index)}
                                                        className="umd-btn umd-btn-danger umd-btn-sm" style={{ padding: 8 }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="umd-form-grid">
                                                    <div>
                                                        <label>
                                                            <span className="umd-label">
                                                                {t.exampleTitle}
                                                            </span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={example.description}
                                                            onChange={(e) =>
                                                                updateExample(
                                                                    index,
                                                                    "description",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="umd-input"
                                                            placeholder={t.placeholderExampleTitle}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>
                                                            <span className="umd-label">
                                                                {t.exampleTitleEn}
                                                            </span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={example.description_en}
                                                            onChange={(e) =>
                                                                updateExample(
                                                                    index,
                                                                    "description_en",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="umd-input"
                                                            placeholder={t.placeholderExampleTitleEn}
                                                        />
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label>
                                                            <span className="umd-label">
                                                                {t.exampleFile}
                                                            </span>
                                                        </label>
                                                        {example.url && !example.file ? (
                                                            <div className="flex items-center gap-4 p-3 bg-base-200 rounded-lg border border-base-300">
                                                                <FileText className="w-5 h-5 text-primary" />
                                                                <span className="flex-1 truncate text-sm">
                                                                    {example.url.split("/").pop()}
                                                                </span>
                                                                <a
                                                                    href={example.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="umd-btn umd-btn-ghost umd-btn-sm"
                                                                >
                                                                    <Download className="w-3 h-3" />
                                                                    {t.download}
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="file"
                                                                accept=".zip,.pdf,.png,.jpg,.jpeg"
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        updateExample(
                                                                            index,
                                                                            "file",
                                                                            e.target.files[0],
                                                                        );
                                                                    }
                                                                }}
                                                                className="umd-input"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={addExample}
                                            className="umd-btn umd-btn-outline"
                                            style={{ width: "100%", borderStyle: "dashed" }}
                                        >
                                            <Plus className="w-4 h-4" /> {t.addExample}
                                        </button>
                                </UmdSection>

                                {/* Comments */}
                                <UmdSection
                                    id="form-accordion-5"
                                    open={openAccordions.includes("form-accordion-5")}
                                    onToggle={handleAccordionClick}
                                    icon={<MessageSquare />}
                                    title={t.additionalComments}
                                >
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.comments}
                                                    </span>
                                                </label>
                                                <MarkdownEditor
                                                    value={formData?.comments || ""}
                                                    onChange={(val: string) =>
                                                        setFormData((prev) =>
                                                            prev ? { ...prev, comments: val } : prev,
                                                        )
                                                    }
                                                    preview={"live"}
                                                    placeholder={t.anyUsefulInfo}
                                                    maxLength={MARKDOWN_MAX_LENGTH}
                                                    showCounter
                                                />
                                            </div>
                                            <div>
                                                <label>
                                                    <span className="umd-label">
                                                        {t.commentsEn}
                                                    </span>
                                                </label>
                                                <MarkdownEditor
                                                    value={formData?.comments_en || ""}
                                                    onChange={(val: string) =>
                                                        setFormData((prev) =>
                                                            prev ? { ...prev, comments_en: val } : prev,
                                                        )
                                                    }
                                                    preview={"live"}
                                                    placeholder={t.commentsEnPlaceholder}
                                                    maxLength={MARKDOWN_MAX_LENGTH}
                                                    showCounter
                                                />
                                            </div>
                                        </div>
                                </UmdSection>

                                <div
                                    className="umd-card"
                                    style={{
                                        marginTop: 20,
                                        padding: "18px 22px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <GitPullRequest
                                        className="w-5 h-5"
                                        style={{ color: "var(--indigo-700)", flexShrink: 0 }}
                                    />
                                    <p
                                        style={{
                                            flex: 1,
                                            fontSize: 13.5,
                                            lineHeight: 1.55,
                                            margin: 0,
                                            minWidth: 260,
                                            color: "var(--fg2)",
                                        }}
                                    >
                                        {lang === "fr" ? (
                                            <>
                                                Votre proposition sera ouverte comme{" "}
                                                <strong>Pull Request</strong> sur le dépôt GitHub —
                                                aucun compte requis, la plateforme s&apos;en charge
                                                pour vous.
                                            </>
                                        ) : (
                                            <>
                                                Your contribution will be opened as a{" "}
                                                <strong>Pull Request</strong> on the GitHub
                                                repository — no account required, the platform
                                                handles it for you.
                                            </>
                                        )}
                                    </p>
                                    <button
                                        type="submit"
                                        className="umd-btn umd-btn-primary umd-btn-lg"
                                        disabled={loading || (mode === "new" && !!existingService)}
                                        style={{
                                            opacity:
                                                loading || (mode === "new" && !!existingService)
                                                    ? 0.6
                                                    : 1,
                                        }}
                                    >
                                        {!loading && <Send className="w-5 h-5" />}
                                        {loading
                                            ? mode === "new"
                                                ? t.submitting
                                                : t.updating
                                            : mode === "new"
                                                ? t.submitNew
                                                : t.submitUpdate}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20,
                        background: "rgba(15, 18, 30, 0.55)",
                    }}
                >
                    <div
                        className="modal-backdrop"
                        style={{ position: "absolute", inset: 0 }}
                        onClick={() => setShowConfirmModal(false)}
                    ></div>
                    <div
                        className="umd-card"
                        style={{
                            position: "relative",
                            maxWidth: 480,
                            width: "100%",
                            padding: 24,
                        }}
                    >
                        <h3
                            className="flex items-center gap-2"
                            style={{ fontWeight: 700, fontSize: 18, color: "var(--fg1)" }}
                        >
                            <ShieldAlert
                                className="w-5 h-5"
                                style={{ color: "var(--amber-400)" }}
                            />
                            {t.modalTitle}
                        </h3>
                        <p style={{ padding: "16px 0", color: "var(--fg2)", lineHeight: 1.6 }}>
                            {t.modalDescription}
                        </p>
                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                                justifyContent: "flex-end",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                className="umd-btn umd-btn-outline"
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setPendingJsonData(null);
                                    setPendingAdditionalFiles([]);
                                }}
                            >
                                {t.modalCancel}
                            </button>
                            <button
                                className="umd-btn umd-btn-primary"
                                onClick={handleConfirmSubmit}
                                disabled={loading}
                            >
                                {t.modalConfirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
