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
import {
    Database, ShieldAlert, Smartphone, MessageSquare, CheckCircle,
    AlertCircle, Send, Building2, Globe, User, FileText, Mail, MapPin, Search, ExternalLink, Info, Upload, Trash2, Download, Plus
} from "lucide-react";
import dynamic from "next/dynamic";
import dict from "@/i18n/ServiceForm.json";
import { ucfirst } from "@/lib/text";

const MarkdownEditor = dynamic(() => import("@/components/MarkdownEditor"), { ssr: false });

interface ServiceFormProps {
    lang: 'fr' | 'en';
    mode: 'new' | 'update';
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
};

export default function ServiceForm({ lang, mode, slug: propSlug }: ServiceFormProps) {
    const searchParams = useSearchParams();
    const slugParam = propSlug || searchParams.get("slug");
    const rawTranslations = (dict as any)[lang] || (dict as any).fr;
    const t = new Proxy(rawTranslations, {
        get: (target, prop: string) => {
            const value = target[prop];
            return typeof value === "string" ? ucfirst(value) : value;
        }
    }) as typeof rawTranslations;

    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<FormData>(mode === 'new' ? initialFormData : null as unknown as FormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openAccordions, setOpenAccordions] = useState<string[]>(mode === 'new' ? ["form-accordion-1"] : []);
    const [existingService, setExistingService] = useState<Service | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingJsonData, setPendingJsonData] = useState<any>(null);
    const [pendingAdditionalFiles, setPendingAdditionalFiles] = useState<any[]>([]);

    const nationalities = FORM_OPTIONS.nationalities;
    const responseFormatOptions = FORM_OPTIONS.responseFormats;
    const requiredDocumentsOptions = FORM_OPTIONS.requiredDocuments;
    const easyAccessOptions = FORM_OPTIONS.easyAccessLevels;
    const responseDelayOptions = FORM_OPTIONS.responseDelays;
    const MARKDOWN_MAX_LENGTH = 4000;


    const checkServiceExists = useCallback(async (name: string) => {
        if (mode !== 'new' || !name) {
            setExistingService(null);
            return;
        }

        const normalizedName = name.toLowerCase().trim();

        // 1. Check existing published services
        const foundInPublished = (services as unknown as Service[]).find(
            s => s.name.toLowerCase().trim() === normalizedName
        );

        if (foundInPublished) {
            setExistingService(foundInPublished);
            return;
        }

        // 2. Check internal draft reviews
        try {
            const reviewsRes = await fetch('/data/reviews.json');
            if (reviewsRes.ok) {
                const reviews = await reviewsRes.json();
                const foundInReviews = reviews.find(
                    (s: any) => s.name.toLowerCase().trim() === normalizedName
                );
                if (foundInReviews) {
                    setExistingService({
                        ...foundInReviews,
                        isDraft: true // Visual flag for the UI (optional but helpful)
                    } as unknown as Service);
                    return;
                }
            }
        } catch (e) {
            console.error('Failed to fetch reviews.json', e);
        }

        // 3. Check GitHub PR pending reviews
        try {
            const pendingRes = await fetch('/data/pending-reviews.json');
            if (pendingRes.ok) {
                const pendingData = await pendingRes.json();
                const foundInPending = (pendingData.pending_apps || []).find(
                    (p: any) => p.name.toLowerCase().trim() === normalizedName
                );
                if (foundInPending) {
                    setExistingService({
                        ...foundInPending,
                        slug: '', // PRs don't have slugs directly yet
                        isPendingPR: true
                    } as unknown as Service);
                    return;
                }
            }
        } catch (e) {
            console.error('Failed to fetch pending-reviews.json', e);
        }

        setExistingService(null);
    }, [mode]);

    const handleAccordionClick = (name: string) => {
        const newOpenAccordions = openAccordions.includes(name)
            ? openAccordions.filter(item => item !== name)
            : [...openAccordions, name];
        setOpenAccordions(newOpenAccordions);
    };

    const loadServiceData = useCallback(async (serviceSlug: string) => {
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
                const exactMatch = FORM_OPTIONS.nationalities.find(n =>
                    n.label.toLowerCase() === nationality.toLowerCase().trim());

                if (exactMatch) {
                    nationality = exactMatch.label;
                    if (!countryName || !countryCode) {
                        countryName = exactMatch.country_name;
                        countryCode = exactMatch.country_code;
                    }
                } else {
                    const countryMatch = FORM_OPTIONS.countries.find(c =>
                        c.label.toLowerCase() === nationality.toLowerCase().trim());

                    if (countryMatch) {
                        const nationalityMatch = FORM_OPTIONS.nationalities.find(n =>
                            n.country_code === countryMatch.country_code);

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
                transfer_destination_countries: Array.isArray(data.transfer_destination_countries)
                    ? data.transfer_destination_countries
                    : data.transfer_destination_countries?.split(', ') || [],
                transfer_destination_countries_en: data.transfer_destination_countries_en || "",
                outside_eu_storage: data.outside_eu_storage || false,
                comments: data.comments || "",
                comments_en: data.comments_en || "",
                app_name: data.app?.name || "",
                app_link: data.app?.link || "",
                author: data.created_by || "",
                example_data_export: data.example_data_export || [],
                details_required_documents: (() => {
                    const raw = data.details_required_documents || "";
                    const exists = FORM_OPTIONS.requiredDocuments.find(opt => opt.value === raw);
                    if (raw && !exists) {
                        return "Autre";
                    }
                    return raw;
                })(),
                details_required_documents_en: data.details_required_documents_en || "",
                details_required_documents_autre: (() => {
                    const raw = data.details_required_documents || "";
                    const exists = FORM_OPTIONS.requiredDocuments.find(opt => opt.value === raw);
                    if (raw && !exists) {
                        return raw;
                    }
                    return "";
                })(),
                response_format_autre: "",
                response_delay_autre: "",
                confidentiality_policy_url: data.confidentiality_policy_url || "",
                confidentiality_policy_url_en: data.confidentiality_policy_url_en || "",
                originalData
            });
            setOpenAccordions(["form-accordion-1"]);
        } catch (err) {
            setError(t.errorLoadingService);
        } finally {
            setLoading(false);
        }
    }, [t]);

    const handleServiceSelect = (service: Service | null) => {
        setSelectedService(service);
        if (service) {
            loadServiceData(service.slug);
        } else {
            setFormData(null as unknown as FormData);
        }
    };

    useEffect(() => {
        if (mode === 'update' && slugParam && !selectedService) {
            const serviceToSelect = (services as unknown as Service[]).find(s => s.slug === slugParam);
            if (serviceToSelect) {
                handleServiceSelect(serviceToSelect);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slugParam, mode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!formData) return;

        const { name, value, type } = e.target;
        const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => prev ? {
            ...prev,
            [name]: newValue
        } : prev);

        // Check for existing service when name changes (new mode only)
        if (name === 'name' && mode === 'new') {
            checkServiceExists(value);
        }
    };

    const addExample = () => {
        setFormData(prev => {
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
                        date: new Date().toISOString().split('T')[0],
                        file: null
                    }
                ]
            };
        });
    };

    const removeExample = (index: number) => {
        setFormData(prev => {
            if (!prev) return prev;
            const newExamples = [...(prev.example_data_export || [])];
            newExamples.splice(index, 1);
            return {
                ...prev,
                example_data_export: newExamples
            };
        });
    };

    const updateExample = (index: number, field: string, value: any) => {
        setFormData(prev => {
            if (!prev) return prev;
            const newExamples = [...(prev.example_data_export || [])];
            newExamples[index] = { ...newExamples[index], [field]: value };
            return {
                ...prev,
                example_data_export: newExamples
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        if (mode === 'update' && !selectedService) return;
        if (mode === 'new' && existingService) {
            setError(t.serviceAlreadyExists);
            return;
        }

        const markdownFields: Array<keyof FormData> = [
            "sanction_details",
            "privacy_policy_quote",
            "privacy_policy_quote_en",
            "comments",
            "comments_en"
        ];
        const isOverLimit = markdownFields.some(
            (field) => (formData[field] || "").length > MARKDOWN_MAX_LENGTH
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
            setOpenAccordions(["form-accordion-1", "form-accordion-2", "form-accordion-3", "form-accordion-4", "form-accordion-5"]);
            form.reportValidity();
            setLoading(false);
            return;
        }

        try {
            const slug = mode === 'new' ? generateSlug(formData.name) : selectedService!.slug;
            const filename = `${slug}.json`;

            // Process example exports
            const additionalFiles: Array<{ path: string, content: string, isBinary?: boolean }> = [];
            const processedExamples = await Promise.all((formData.example_data_export || []).map(async (example) => {
                if (example.file) {
                    const file = example.file as File;
                    const readFileAsBase64 = (file: File): Promise<string> => {
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                const result = reader.result as string;
                                const base64Content = result.split(',')[1];
                                resolve(base64Content);
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                        });
                    };

                    const content = await readFileAsBase64(file);
                    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                    const filePath = `public/export/${slug}/${safeFileName}`;

                    additionalFiles.push({
                        path: filePath,
                        content: content,
                        isBinary: true
                    });

                    return {
                        url: `/export/${slug}/${safeFileName}`,
                        type: example.type || "customer_data",
                        description: example.description,
                        description_en: example.description_en,
                        date: example.date || new Date().toISOString().split('T')[0]
                    };
                }

                // Existing example without new file upload
                return {
                    url: example.url,
                    type: example.type || "customer_data",
                    description: example.description,
                    description_en: example.description_en,
                    date: example.date
                };
            }));

            const jsonData = {
                ...(mode === 'update' && formData.originalData ? formData.originalData : {}),
                name: formData.name,
                logo: formData.logo,
                nationality: formData.nationality,
                country_name: formData.country_name,
                country_code: formData.country_code,
                belongs_to_group: formData.belongs_to_group,
                group_name: formData.group_name,
                ...(mode === 'new' ? { permissions: "" } : {}),
                contact_mail_export: formData.contact_mail_export,
                easy_access_data: formData.easy_access_data,
                need_id_card: formData.need_id_card,
                details_required_documents: formData.details_required_documents === "Autre" && formData.details_required_documents_autre !== ""
                    ? formData.details_required_documents_autre
                    : formData.details_required_documents,
                confidentiality_policy_url: formData.confidentiality_policy_url,
                confidentiality_policy_url_en: formData.confidentiality_policy_url_en,
                data_access_via_postal: formData.data_access_via_postal,
                data_access_via_form: formData.data_access_via_form,
                data_access_type: formData.data_access_type,
                data_access_type_en: formData.data_access_type_en,
                data_access_via_email: formData.data_access_via_email,
                response_format: formData.response_format === "Autre" && formData.response_format_autre !== ""
                    ? formData.response_format_autre
                    : formData.response_format,
                example_data_export: processedExamples,
                ...(mode === 'new' ? {
                    example_form_export: [],
                    message_exchange: [],
                } : {}),
                url_export: formData.url_export,
                address_export: formData.address_export,
                response_delay: formData.response_delay === "Autre" && formData.response_delay_autre !== ""
                    ? formData.response_delay_autre
                    : formData.response_delay,
                sanctioned_by_cnil: formData.sanctioned_by_cnil,
                sanction_details: formData.sanction_details,
                data_transfer_policy: formData.data_transfer_policy,
                privacy_policy_quote: formData.privacy_policy_quote,
                transfer_destination_countries: formData.transfer_destination_countries.join(', '),
                transfer_destination_countries_en: formData.transfer_destination_countries
                    .map(countryLabel => {
                        const country = FORM_OPTIONS.countries.find(c => c.label === countryLabel);
                        return country?.country_name || countryLabel;
                    })
                    .join(', '),
                outside_eu_storage: formData.outside_eu_storage,
                comments: formData.comments,
                comments_en: formData.comments_en,
                ...(mode === 'new' ? {
                    tosdr: "",
                    exodus: "",
                    created_at: new Date().toISOString().split('T')[0],
                    created_by: formData.author || "Unlock My Data Team",
                    updated_at: "",
                    updated_by: "",
                } : {
                    updated_at: new Date().toISOString().split('T')[0],
                    updated_by: formData.author,
                }),
                app: {
                    name: formData.app_name,
                    link: formData.app_link
                }
            };

            // Remove originalData from final JSON
            if ('originalData' in jsonData) {
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
            setError(err instanceof Error ? err.message : (mode === 'new' ? t.errorCreating : t.errorUpdating));
            setLoading(false);
        }
    };

    const handleConfirmSubmit = async () => {
        if (!pendingJsonData || !formData) return;

        setLoading(true);
        setShowConfirmModal(false);

        try {
            const slug = mode === 'new' ? generateSlug(formData.name) : selectedService!.slug;
            const filename = `${slug}.json`;
            const jsonContent = JSON.stringify(pendingJsonData, null, 2);

            const prTitle = mode === 'new'
                ? `${t.prTitleNew} ${formData.name}`
                : `${t.prTitleUpdate} ${formData.name}`;
            const prMessage = mode === 'new'
                ? `${t.prMessageNew} ${formData.name}`
                : `${t.prMessageUpdate} ${formData.name}`;
            const prType = mode === 'new' ? t.prTypeNew : t.prTypeUpdate;

            const prUrl = await createGitHubPR(
                formData,
                filename,
                jsonContent,
                prTitle,
                prMessage,
                prType,
                mode === 'update',
                slug,
                pendingAdditionalFiles
            );

            if (mode === 'new') {
                setSuccess(`${t.successCreated} ${prUrl}`);
                setFormData(initialFormData);
                setExistingService(null);
            } else {
                setSuccess(`${t.successUpdated} ${prUrl}`);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : (mode === 'new' ? t.errorCreating : t.errorUpdating));
        } finally {
            setLoading(false);
            setPendingJsonData(null);
            setPendingAdditionalFiles([]);
        }
    };

    const getUpdateUrl = () => {
        if (!existingService) return '#';
        return lang === 'fr'
            ? `/contribuer/modifier-fiche?slug=${existingService.slug}`
            : `/contribute/update-form?slug=${existingService.slug}`;
    };

    // Get label based on language
    const getOptionLabel = (opt: { label: string; label_en?: string }) => {
        const label = lang === 'en' && opt.label_en ? opt.label_en : opt.label;
        return ucfirst(label);
    };

    const getExplanationLabel = (opt: { explanation: string; explanation_en?: string }) => {
        const explanation = lang === 'en' && opt.explanation_en ? opt.explanation_en : opt.explanation;
        return ucfirst(explanation);
    };

    return (
        <div className="min-h-screen bg-base-200 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 shadow-sm">
                        <FileText className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        {mode === 'new' ? t.newFormTitle : t.updateFormTitle}
                    </h1>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                        {mode === 'new' ? t.newFormDescription : t.updateFormDescription}
                    </p>
                </div>

                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body p-6 md:p-8">

                        {error && (
                            <div role="alert" className="alert alert-error mb-6 shadow-md">
                                <AlertCircle className="w-6 h-6" />
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div role="alert" className="alert alert-success mb-6 shadow-md">
                                <CheckCircle className="w-6 h-6" />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Service exists warning (new mode only) */}
                        {mode === 'new' && existingService && (
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn mb-6">
                                <div className="flex items-start sm:items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                                        <Info className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-900">
                                            {t.serviceAlreadyExists} <strong className="font-semibold">{existingService.name}</strong>
                                        </p>
                                        <p className="text-xs text-blue-700 mt-1">
                                            {(existingService as any).isDraft
                                                ? "Ce service est déjà en cours de relecture."
                                                : (existingService as any).isPendingPR
                                                    ? "Ce service est actuellement en cours de validation (PR Github)."
                                                    : t.suggestUpdate}
                                        </p>
                                    </div>
                                </div>
                                {!((existingService as any).isDraft || (existingService as any).isPendingPR) && (
                                    <Link
                                        href={getUpdateUrl()}
                                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        {t.goToUpdate}
                                    </Link>
                                )}
                                {(existingService as any).isDraft && (
                                    <Link
                                        href={`/contribuer/fiches-a-revoir#review-${existingService.slug}`}
                                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Voir la relecture
                                    </Link>
                                )}
                                {(existingService as any).isPendingPR && (
                                    <a
                                        href={(existingService as any).pr_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Voir la PR
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Service selector (update mode only) */}
                        {mode === 'update' && (
                            <div className="card bg-base-200/50 border border-base-200 mb-8">
                                <div className="card-body p-6">
                                    <h2 className="card-title flex items-center gap-2 mb-4">
                                        <Search className="w-5 h-5" />
                                        {t.selectServiceTitle}
                                    </h2>
                                    <Select
                                        options={services as unknown as Service[]}
                                        value={selectedService}
                                        onChange={handleServiceSelect}
                                        placeholder={t.selectServicePlaceholder}
                                        isClearable
                                        getOptionLabel={option => option.name}
                                        getOptionValue={option => option.slug}
                                        formatOptionLabel={option => (
                                            <div className="flex items-center gap-3">
                                                {option.logo && (
                                                    <Image src={option.logo} alt={option.name} width={32} height={32} className="w-8 h-8 object-contain" />
                                                )}
                                                <div>
                                                    <div className="font-medium">{option.name}</div>
                                                    <div className="text-sm text-gray-500">{lang === 'fr' ? option.nationality : option.country_name}</div>
                                                </div>
                                            </div>
                                        )}
                                        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                        styles={{
                                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                                            control: (base) => ({ ...base, borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))', borderRadius: 'var(--rounded-btn, 0.5rem)', padding: '2px' })
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        {(mode === 'new' || formData) && (
                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                {/* General Information */}
                                <div className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
                                    <input type="checkbox" name="form-accordion-1" checked={openAccordions.includes("form-accordion-1")} onChange={() => handleAccordionClick("form-accordion-1")} />
                                    <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        {t.generalInfo}
                                    </div>
                                    <div className="collapse-content pt-4">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.companyName} <span className="text-error">*</span></span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData?.name || ""}
                                                    onChange={handleInputChange}
                                                    className={`input input-bordered w-full focus:input-primary ${existingService ? 'input-warning' : ''}`}
                                                    placeholder={t.placeholderCompanyName}
                                                    required
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.logoUrl}</span>
                                                </label>
                                                <div className="tooltip w-full" data-tip={t.logoTooltip}>
                                                    <div className="relative">
                                                        <input
                                                            type="url"
                                                            name="logo"
                                                            value={formData?.logo || ""}
                                                            onChange={handleInputChange}
                                                            className="input input-bordered w-full pl-10 focus:input-primary"
                                                            placeholder={t.placeholderLogoUrl}
                                                        />
                                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-control" style={{ zIndex: 100 }}>
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.nationality} <span className="text-error">*</span></span>
                                                </label>
                                                <Select
                                                    options={nationalities}
                                                    value={nationalities.find(n => n.label === formData?.nationality) || null}
                                                    onChange={selected => {
                                                        setFormData(prev => prev ? {
                                                            ...prev,
                                                            nationality: selected?.label || "",
                                                            country_name: selected?.country_name || "",
                                                            country_code: selected?.country_code || ""
                                                        } : prev);
                                                    }}
                                                    placeholder={t.searchNationality}
                                                    isClearable
                                                    getOptionLabel={option => lang === 'en' ? option.country_name : option.label}
                                                    getOptionValue={option => option.label}
                                                    required
                                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                                    styles={{
                                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                        control: (base) => ({ ...base, borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))', borderRadius: 'var(--rounded-btn, 0.5rem)', padding: '2px' })
                                                    }}
                                                    classNames={{
                                                        control: () => "input input-bordered !flex",
                                                    }}
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{mode === 'new' ? t.formAuthor : t.modifiedBy} <span className="text-error">*</span></span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="author"
                                                        value={formData?.author || ""}
                                                        onChange={handleInputChange}
                                                        className="input input-bordered w-full pl-10 focus:input-primary"
                                                        placeholder={mode === 'new' ? t.authorPlaceholder : t.editorPlaceholder}
                                                        required
                                                    />
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="divider"></div>

                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start gap-4">
                                                <input
                                                    type="checkbox"
                                                    name="belongs_to_group"
                                                    checked={formData?.belongs_to_group || false}
                                                    onChange={handleInputChange}
                                                    className="checkbox checkbox-primary"
                                                />
                                                <span className="label-text font-medium">{t.belongsToGroup}</span>
                                            </label>
                                        </div>

                                        {formData?.belongs_to_group && (
                                            <div className="form-control mt-4 animate-in fade-in slide-in-from-top-2">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.groupName}</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="group_name"
                                                    value={formData?.group_name || ""}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered w-full focus:input-primary"
                                                    placeholder={t.placeholderGroupName}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Data Access */}
                                <div className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
                                    <input type="checkbox" name="form-accordion-2" checked={openAccordions.includes("form-accordion-2")} onChange={() => handleAccordionClick("form-accordion-2")} />
                                    <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                        <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                                            <Database className="w-5 h-5" />
                                        </div>
                                        {t.dataAccess}
                                    </div>
                                    <div className="collapse-content pt-4">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.contactEmail}</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        name="contact_mail_export"
                                                        value={formData?.contact_mail_export || ""}
                                                        onChange={handleInputChange}
                                                        className="input input-bordered w-full pl-10 focus:input-secondary"
                                                        placeholder={t.placeholderContactEmail}
                                                    />
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none" />
                                                </div>
                                            </div>

                                            <div className="form-control" style={{ zIndex: 90 }}>
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.easyAccessData} <span className="text-error">*</span></span>
                                                </label>
                                                <Select
                                                    name="easy_access_data"
                                                    options={easyAccessOptions}
                                                    value={easyAccessOptions.find(opt => opt.value === formData?.easy_access_data || opt.value + "/5" === formData?.easy_access_data) || null}
                                                    onChange={selected =>
                                                        setFormData(prev => prev ? {
                                                            ...prev,
                                                            easy_access_data: selected?.value || ""
                                                        } : prev)
                                                    }
                                                    placeholder={t.selectLevel}
                                                    isClearable
                                                    formatOptionLabel={option => (
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold badge badge-ghost">{option.note}/5</span>
                                                            <span className="text-sm text-base-content/70 ml-2">{getExplanationLabel(option)}</span>
                                                        </div>
                                                    )}
                                                    getOptionLabel={option => option.note}
                                                    getOptionValue={option => option.value}
                                                    required
                                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                                    styles={{
                                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                        control: (base) => ({ ...base, borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))', borderRadius: 'var(--rounded-btn, 0.5rem)', padding: '2px' })
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="divider text-sm text-base-content/50">{t.accessMethods}</div>

                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="form-control p-3 border border-base-200 rounded-lg hover:border-secondary/50 transition-colors">
                                                <label className="label cursor-pointer justify-start gap-3">
                                                    <input
                                                        type="checkbox"
                                                        name="data_access_via_postal"
                                                        checked={formData?.data_access_via_postal || false}
                                                        onChange={handleInputChange}
                                                        className="checkbox checkbox-secondary"
                                                    />
                                                    <span className="label-text font-medium">{t.postalMail}</span>
                                                </label>
                                            </div>

                                            <div className="form-control p-3 border border-base-200 rounded-lg hover:border-secondary/50 transition-colors">
                                                <label className="label cursor-pointer justify-start gap-3">
                                                    <input
                                                        type="checkbox"
                                                        name="data_access_via_form"
                                                        checked={formData?.data_access_via_form || false}
                                                        onChange={handleInputChange}
                                                        className="checkbox checkbox-secondary"
                                                    />
                                                    <span className="label-text font-medium">{t.webForm}</span>
                                                </label>
                                            </div>

                                            <div className="form-control p-3 border border-base-200 rounded-lg hover:border-secondary/50 transition-colors">
                                                <label className="label cursor-pointer justify-start gap-3">
                                                    <input
                                                        type="checkbox"
                                                        name="data_access_via_email"
                                                        checked={formData?.data_access_via_email || false}
                                                        onChange={handleInputChange}
                                                        className="checkbox checkbox-secondary"
                                                    />
                                                    <span className="label-text font-medium">{t.email}</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="divider text-sm text-base-content/50">{t.procedureDetails}</div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.requiredDocuments} <span className="text-error">*</span></span>
                                                </label>
                                                <select
                                                    name="details_required_documents"
                                                    value={formData?.details_required_documents || ""}
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        setFormData(prev => prev ? {
                                                            ...prev,
                                                            details_required_documents: value,
                                                            need_id_card: value === "Carte d'identité"
                                                        } : prev);
                                                    }}
                                                    className="select select-bordered focus:select-secondary w-full"
                                                    required
                                                >
                                                    {requiredDocumentsOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {getOptionLabel(opt)}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formData?.details_required_documents === "Autre" && (
                                                    <input
                                                        type="text"
                                                        name="details_required_documents_autre"
                                                        value={formData?.details_required_documents_autre || ""}
                                                        onChange={handleInputChange}
                                                        className="input input-bordered w-full mt-2 focus:input-secondary"
                                                        placeholder={t.specifyDocument}
                                                        required
                                                    />
                                                )}
                                            </div>

                                            {formData?.details_required_documents === "Autre" && (
                                                <div className="form-control mt-12">
                                                    <label className="label">
                                                        <span className="label-text font-medium">{t.requiredDocumentsEn}</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="details_required_documents_en"
                                                        value={formData?.details_required_documents_en || ""}
                                                        onChange={handleInputChange}
                                                        className="input input-bordered w-full focus:input-secondary"
                                                        placeholder={t.requiredDocumentsEnPlaceholder}
                                                    />
                                                </div>
                                            )}

                                            {formData?.details_required_documents !== "Autre" && <br />}

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.howToRequest}</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="data_access_type"
                                                    value={formData?.data_access_type || ""}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered w-full focus:input-secondary"
                                                    placeholder={t.placeholderHowToRequest}
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.howToRequestEn}</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="data_access_type_en"
                                                    value={formData?.data_access_type_en || ""}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered w-full focus:input-secondary"
                                                    placeholder={t.placeholderHowToRequestEn}
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.responseFormat}</span>
                                                </label>
                                                <select
                                                    name="response_format"
                                                    value={formData?.response_format || ""}
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        setFormData(prev => prev ? {
                                                            ...prev,
                                                            response_format: value
                                                        } : prev);
                                                    }}
                                                    className="select select-bordered focus:select-secondary w-full"
                                                >
                                                    {responseFormatOptions.map(opt => (
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
                                                        className="input input-bordered w-full mt-2 focus:input-secondary"
                                                        placeholder={t.specifyFormat}
                                                        required
                                                    />
                                                )}
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.responseDelay}</span>
                                                </label>
                                                <select
                                                    name="response_delay"
                                                    value={formData?.response_delay || ""}
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        setFormData(prev => prev ? {
                                                            ...prev,
                                                            response_delay: value
                                                        } : prev);
                                                    }}
                                                    className="select select-bordered focus:select-secondary w-full"

                                                >
                                                    {responseDelayOptions.map(opt => (
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
                                                        className="input input-bordered w-full mt-2 focus:input-secondary"
                                                        placeholder={t.specifyDelay}
                                                        required
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="divider text-sm text-base-content/50">{t.exportContactDetails}</div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.websiteUrl}</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="url"
                                                        name="url_export"
                                                        value={formData?.url_export || ""}
                                                        onChange={handleInputChange}
                                                        className="input input-bordered w-full pl-10 focus:input-secondary"
                                                        placeholder={t.placeholderWebsiteUrl}
                                                    />
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none" />
                                                </div>
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.postalAddress}</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="address_export"
                                                        value={formData?.address_export || ""}
                                                        onChange={handleInputChange}
                                                        className="input input-bordered w-full pl-10 focus:input-secondary"
                                                        placeholder={t.placeholderPostalAddress}
                                                    />
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sanctions and Transfers */}
                                <div className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
                                    <input type="checkbox" name="form-accordion-3" checked={openAccordions.includes("form-accordion-3")} onChange={() => handleAccordionClick("form-accordion-3")} />
                                    <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                        <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                            <ShieldAlert className="w-5 h-5" />
                                        </div>
                                        {t.sanctionsTransfers}
                                    </div>
                                    <div className="collapse-content pt-4">
                                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                                            <div className="form-control p-3 border border-base-200 rounded-lg hover:border-accent/50 transition-colors">
                                                <label className="label cursor-pointer justify-start gap-3">
                                                    <input
                                                        type="checkbox"
                                                        name="sanctioned_by_cnil"
                                                        checked={formData?.sanctioned_by_cnil || false}
                                                        onChange={handleInputChange}
                                                        className="checkbox checkbox-accent"
                                                    />
                                                    <span className="label-text font-medium">{t.sanctionedByCnil}</span>
                                                </label>
                                            </div>

                                            <div className="form-control p-3 border border-base-200 rounded-lg hover:border-accent/50 transition-colors">
                                                <label className="label cursor-pointer justify-start gap-3">
                                                    <input
                                                        type="checkbox"
                                                        name="data_transfer_policy"
                                                        checked={formData?.data_transfer_policy || false}
                                                        onChange={handleInputChange}
                                                        className="checkbox checkbox-accent"
                                                    />
                                                    <span className="label-text font-medium">{t.dataTransferPolicy}</span>
                                                </label>
                                            </div>

                                            <div className="form-control p-3 border border-base-200 rounded-lg hover:border-accent/50 transition-colors">
                                                <label className="label cursor-pointer justify-start gap-3">
                                                    <input
                                                        type="checkbox"
                                                        name="outside_eu_storage"
                                                        checked={formData?.outside_eu_storage || false}
                                                        onChange={handleInputChange}
                                                        className="checkbox checkbox-accent"
                                                    />
                                                    <span className="label-text font-medium">{t.storageOutsideEu}</span>
                                                </label>
                                            </div>
                                        </div>

                                        {formData?.sanctioned_by_cnil && (
                                            <div className="form-control mb-6 animate-in fade-in slide-in-from-top-2">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.sanctionDetails}</span>
                                                </label>
                                                <MarkdownEditor
                                                    value={formData?.sanction_details || ""}
                                                    onChange={(val: string) => setFormData(prev => prev ? { ...prev, sanction_details: val } : prev)}
                                                    placeholder={t.describeSanctions}
                                                    maxLength={MARKDOWN_MAX_LENGTH}
                                                    showCounter
                                                />
                                            </div>
                                        )}

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="form-control" style={{ zIndex: 80 }}>
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.transferDestinationCountries}</span>
                                                </label>
                                                <Select
                                                    isMulti
                                                    options={FORM_OPTIONS.countries}
                                                    value={FORM_OPTIONS.countries.filter(n =>
                                                        formData?.transfer_destination_countries?.includes(n.label)
                                                    )}
                                                    onChange={selected =>
                                                        setFormData(prev => prev ? {
                                                            ...prev,
                                                            transfer_destination_countries: selected
                                                                ? selected.map((s: any) => s.label)
                                                                : []
                                                        } : prev)
                                                    }
                                                    placeholder={t.selectCountries}
                                                    isClearable
                                                    getOptionLabel={option => lang === 'en' ? option.country_name : option.label}
                                                    getOptionValue={option => option.label}
                                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                                    styles={{
                                                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                        control: (base) => ({ ...base, borderColor: 'var(--fallback-bc,oklch(var(--bc)/0.2))', borderRadius: 'var(--rounded-btn, 0.5rem)', padding: '2px' })
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="divider"></div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.privacyPolicyUrl}</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="confidentiality_policy_url"
                                                    value={formData?.confidentiality_policy_url || ""}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered w-full focus:input-secondary"
                                                    placeholder={t.placeholderPrivacyPolicyUrl}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.privacyPolicyUrlEn}</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="confidentiality_policy_url_en"
                                                    value={formData?.confidentiality_policy_url_en || ""}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered w-full focus:input-secondary"
                                                    placeholder={t.placeholderPrivacyPolicyUrl}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">{t.privacyPolicyQuote}</span>
                                            </label>
                                            <MarkdownEditor
                                                value={formData?.privacy_policy_quote.replaceAll('<br> ', "\n").replaceAll("<br>/n", "\n") || ""}
                                                onChange={(val: string) => setFormData(prev => prev ? { ...prev, privacy_policy_quote: val } : prev)}
                                                placeholder={t.copyPasteExcerpt}
                                                maxLength={MARKDOWN_MAX_LENGTH}
                                                showCounter
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">{t.privacyPolicyQuoteEn}</span>
                                            </label>
                                            <MarkdownEditor
                                                value={formData?.privacy_policy_quote_en.replaceAll('<br> ', "\n").replaceAll("<br>/n", "\n") || ""}
                                                onChange={(val: string) => setFormData(prev => prev ? { ...prev, privacy_policy_quote_en: val } : prev)}
                                                placeholder={t.privacyPolicyQuoteEnPlaceholder}
                                                maxLength={MARKDOWN_MAX_LENGTH}
                                                showCounter
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Application */}
                                <div className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
                                    <input type="checkbox" name="form-accordion-4" checked={openAccordions.includes("form-accordion-4")} onChange={() => handleAccordionClick("form-accordion-4")} />
                                    <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                        <div className="p-2 bg-info/10 rounded-lg text-info">
                                            <Smartphone className="w-5 h-5" />
                                        </div>
                                        {t.mobileApp} <span className="text-sm font-normal opacity-60 ml-2">{t.mobileAppOptional}</span>
                                    </div>
                                    <div className="collapse-content pt-4">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.appName}</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="app_name"
                                                    value={formData?.app_name || ""}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered w-full focus:input-info"
                                                    placeholder={t.placeholderAppName}
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.appLink}</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    name="app_link"
                                                    value={formData?.app_link || ""}
                                                    onChange={handleInputChange}
                                                    placeholder={t.placeholderAppLink}
                                                    className="input input-bordered w-full focus:input-info"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Example Data Export */}
                                <div className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
                                    <input type="checkbox" name="form-accordion-6" checked={openAccordions.includes("form-accordion-6")} onChange={() => handleAccordionClick("form-accordion-6")} />
                                    <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                        <div className="p-2 bg-warning/10 rounded-lg text-warning">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        {t.exampleExports}
                                    </div>
                                    <div className="collapse-content pt-4">
                                        <div className="alert alert-warning bg-orange-500 mb-6">
                                            <ShieldAlert className="w-6 h-6" />
                                            <span className={"text-white"}>{t.anonymizationWarning}</span>
                                        </div>

                                        {formData?.example_data_export?.map((example, index) => (
                                            <div key={index} className="card bg-base-100 border border-base-300 p-6 mb-6">
                                                <div className="absolute right-4 top-4">
                                                    <button type="button" onClick={() => removeExample(index)} className="btn btn-ghost btn-circle text-error btn-sm">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">{t.exampleTitle}</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={example.description}
                                                            onChange={(e) => updateExample(index, 'description', e.target.value)}
                                                            className="input input-bordered w-full"
                                                            placeholder={t.placeholderExampleTitle}
                                                        />
                                                    </div>
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">{t.exampleTitleEn}</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={example.description_en}
                                                            onChange={(e) => updateExample(index, 'description_en', e.target.value)}
                                                            className="input input-bordered w-full"
                                                            placeholder={t.placeholderExampleTitleEn}
                                                        />
                                                    </div>

                                                    <div className="form-control md:col-span-2">
                                                        <label className="label">
                                                            <span className="label-text font-medium">{t.exampleFile}</span>
                                                        </label>
                                                        {example.url && !example.file ? (
                                                            <div className="flex items-center gap-4 p-3 bg-base-200 rounded-lg border border-base-300">
                                                                <FileText className="w-5 h-5 text-primary" />
                                                                <span className="flex-1 truncate text-sm">{example.url.split('/').pop()}</span>
                                                                <a href={example.url} target="_blank" rel="noopener noreferrer" className="btn btn-xs btn-ghost gap-1">
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
                                                                        updateExample(index, 'file', e.target.files[0]);
                                                                    }
                                                                }}
                                                                className="file-input file-input-bordered w-full"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button type="button" onClick={addExample} className="btn btn-outline btn-block border-dashed gap-2">
                                            <Plus className="w-4 h-4" /> {t.addExample}
                                        </button>
                                    </div>
                                </div>

                                {/* Comments */}
                                <div className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
                                    <input type="checkbox" name="form-accordion-5" checked={openAccordions.includes("form-accordion-5")} onChange={() => handleAccordionClick("form-accordion-5")} />
                                    <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                        <div className="p-2 bg-neutral/10 rounded-lg text-neutral">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        {t.additionalComments}
                                    </div>
                                    <div className="collapse-content pt-4">
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.comments}</span>
                                                </label>
                                                <MarkdownEditor
                                                    value={formData?.comments || ""}
                                                    onChange={(val: string) => setFormData(prev => prev ? { ...prev, comments: val } : prev)}
                                                    preview={"live"}
                                                    placeholder={t.anyUsefulInfo}
                                                    maxLength={MARKDOWN_MAX_LENGTH}
                                                    showCounter
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{t.commentsEn}</span>
                                                </label>
                                                <MarkdownEditor
                                                    value={formData?.comments_en || ""}
                                                    onChange={(val: string) => setFormData(prev => prev ? { ...prev, comments_en: val } : prev)}
                                                    preview={"live"}
                                                    placeholder={t.commentsEnPlaceholder}
                                                    maxLength={MARKDOWN_MAX_LENGTH}
                                                    showCounter
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-control mt-10">
                                    <button
                                        type="submit"
                                        className={`btn btn-primary btn-lg w-full md:w-auto md:px-12 mx-auto gap-3 shadow-lg hover:shadow-xl transition-all ${loading ? 'loading' : ''}`}
                                        disabled={loading || (mode === 'new' && !!existingService)}
                                    >
                                        {!loading && <Send className="w-5 h-5" />}
                                        {loading
                                            ? (mode === 'new' ? t.submitting : t.updating)
                                            : (mode === 'new' ? t.submitNew : t.submitUpdate)
                                        }
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-warning" />
                            {t.modalTitle}
                        </h3>
                        <p className="py-4">{t.modalDescription}</p>
                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setPendingJsonData(null);
                                    setPendingAdditionalFiles([]);
                                }}
                            >
                                {t.modalCancel}
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleConfirmSubmit}
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : null}
                                {t.modalConfirm}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowConfirmModal(false)}></div>
                </div>
            )}
        </div>
    );
}
