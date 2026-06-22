"use client";
import { useState } from "react";
import Select, { components } from "react-select";
import { Service, Leak } from "@/types/form";
import { createGitHubPR } from "@/tools/github";
import services from "../public/data/services.json";
import draftServices from "../public/data/services-draft.json";
import { AlertTriangle, Upload, Calendar, User, CheckCircle, AlertCircle, Info, ArrowLeft, X } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/LeakForm.json";

interface LeakFormProps {
    lang: "fr" | "en";
}

// react-select styled to match the umd-* design system (slate borders, indigo focus).
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
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected ? "var(--indigo-50)" : state.isFocused ? "var(--slate-50)" : "#fff",
        color: state.isSelected ? "var(--indigo-800)" : "var(--fg1)",
    }),
};

// Common leaked-data categories (Security.jsx LEAK_DATA_TYPES) — bilingual; fr label is canonical id.
const LEAK_DATA_TYPES: { fr: string; en: string }[] = [
    { fr: "Adresses e-mail", en: "Email addresses" },
    { fr: "Mots de passe", en: "Passwords" },
    { fr: "Téléphones", en: "Phone numbers" },
    { fr: "Adresses postales", en: "Postal addresses" },
    { fr: "Données bancaires", en: "Banking data" },
    { fr: "Données de santé", en: "Health data" },
    { fr: "Pièces d'identité", en: "ID documents" },
];

const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

export default function LeakForm({ lang }: LeakFormProps) {
    const t = new Translator(dict as any, lang);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isNewService, setIsNewService] = useState(false);
    const [newServiceName, setNewServiceName] = useState("");
    const [formData, setFormData] = useState<Partial<Leak>>({});
    // local state for optional media link (keeps types simple)
    const [mediaLink, setMediaLink] = useState<string>("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);
    // leaked-data type pills (multi-select) + optional custom type — both feed formData.type / type_en
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [customType, setCustomType] = useState("");

    // Rebuild formData.type (fr) and type_en (en) from selected pills + custom entry.
    const syncTypes = (sel: string[], custom: string) => {
        const chosen = LEAK_DATA_TYPES.filter(d => sel.includes(d.fr));
        const extra = custom.trim() ? [custom.trim()] : [];
        const fr = [...chosen.map(c => c.fr), ...extra].join(", ");
        const en = [...chosen.map(c => c.en), ...extra].join(", ");
        setFormData(fd => ({ ...fd, type: fr, type_en: en }));
    };

    const toggleType = (frLabel: string) => {
        const next = selectedTypes.includes(frLabel)
            ? selectedTypes.filter(x => x !== frLabel)
            : [...selectedTypes, frLabel];
        setSelectedTypes(next);
        syncTypes(next, customType);
    };

    const allServices = [...(services as unknown as Service[]), ...(draftServices as unknown as Service[])];

    const serviceOptions = allServices.map(s => ({
        value: s.slug,
        label: s.name,
        service: s
    }));

    const existingServiceMatch = isNewService && newServiceName.trim().length > 1
        ? allServices.find(s =>
            s.name.toLowerCase() === newServiceName.trim().toLowerCase() ||
            s.slug === newServiceName.trim().toLowerCase()
        )
        : null;

    const handleServiceSelect = async (option: any) => {
        setSelectedService(option ? option.service : null);
        setIsNewService(false);
        setNewServiceName("");
        setSuccess("");
        setError("");

        if (option) {
            setLoading(true);
            try {
                const response = await fetch(`/data/manual/${option.service.slug}.json`);
                if (response.ok) {
                    await response.json();
                }
            } catch (e) {
                console.error("Error loading service data", e);
            } finally {
                setLoading(false);
            }
        }
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError(t.t('invalidFileType'));
            return;
        }
        setProofFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProofPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isNewService && !selectedService) {
            setError(t.t('error'));
            return;
        }

        if (isNewService && !newServiceName.trim()) {
            setError(t.t('error'));
            return;
        }

        if (!proofFile || !formData.date || !formData.type) {
            setError(t.t('error')); // Basic validation
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            let currentSlug = "";
            let currentServiceName = "";
            let serviceData: any = {};
            let isUpdate = true;

            // Read file as base64 (without prefix)
            const base64Content = proofPreview?.split(',')[1];
            if (!base64Content) throw new Error("File reading error");

            if (isNewService) {
                currentSlug = slugify(newServiceName);
                currentServiceName = newServiceName;
                isUpdate = false;

                // Check if likely exists
                const existing = serviceOptions.find(o => o.value === currentSlug);
                if (existing) {
                    setError("This service seems to exist already. Please search for it.");
                    setLoading(false);
                    return;
                }

                serviceData = {
                    slug: currentSlug,
                    name: currentServiceName,
                    url: "",
                    leaks: []
                };
            } else if (selectedService) {
                currentSlug = selectedService.slug;
                currentServiceName = selectedService.name;

                // Prepare updated service data
                const response = await fetch(`/data/manual/${currentSlug}.json`);
                if (!response.ok) throw new Error("Service data not found");
                serviceData = await response.json();
            }

            const proofFileName = `proof-${currentSlug}-${Date.now()}.${proofFile.name.split('.').pop()}`;
            const proofPath = `public/proofs/${proofFileName}`;
            const proofUrl = `/proofs/${proofFileName}`;

            const newLeak: Leak = {
                date: formData.date,
                type: formData.type,
                type_en: formData.type_en || "",
                proof_url: proofUrl,
                contributor: formData.contributor || "Anonymous",
                // include optional media link when provided
                ...(mediaLink ? { media_link: mediaLink } : {})
            };

            // Also check if we can mark existing data_breaches as verified by this manual report
            let updatedDataBreaches = serviceData.data_breaches || [];
            if (updatedDataBreaches.length > 0) {
                updatedDataBreaches = updatedDataBreaches.map((breach: any) => {
                    const breachDate = new Date(breach.date).getTime();
                    const newLeakDate = new Date(formData.date!).getTime();
                    const diffDays = Math.abs(breachDate - newLeakDate) / (1000 * 60 * 60 * 24);

                    if (diffDays <= 60 && !breach.verified_by_manual) {
                        return {
                            ...breach,
                            verified_by_manual: true,
                            manual_contributor: formData.contributor || "Anonymous"
                        };
                    }
                    return breach;
                });
            }

            const updatedServiceData = {
                ...serviceData,
                leaks: [...(serviceData.leaks || []), newLeak],
                data_breaches: updatedDataBreaches,
                had_data_breach: true
            };

            const serviceContent = JSON.stringify(updatedServiceData, null, 2);

            const prUrl = await createGitHubPR(
                updatedServiceData,
                `${currentSlug}.json`,
                serviceContent,
                `Report leak for ${currentServiceName}`,
                `Reporting a leak for ${currentServiceName}${isNewService ? ' (New Service)' : ''}`,
                "leak-report",
                isUpdate,
                currentSlug,
                [{
                    path: proofPath,
                    content: base64Content,
                    isBinary: true
                }]
            );

            setSuccess(`
                <div class="flex flex-col gap-1">
                    <p class="font-semibold">${t.t('success')}</p>
                    <a href="${prUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;color:var(--indigo-700);font-weight:700;text-decoration:underline">
                        ${t.t('viewPR')}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                </div>
            `);
            setProofFile(null);
            setProofPreview(null);
            setFormData({});
            setSelectedTypes([]);
            setCustomType("");
            setMediaLink("");
            setSelectedService(null);
            setIsNewService(false);
            setNewServiceName("");
        } catch (err) {
            console.error(err);
            setError(t.t('error'));
        } finally {
            setLoading(false);
        }
    };

    const contributeHref = lang === "fr" ? "/contribuer" : "/contribute";
    const req = <span style={{ color: "var(--red-600)" }}>*</span>;

    return (
        <div>
            {/* Hero — red disclosure band (Security.jsx SecHero) */}
            <section style={{ background: "linear-gradient(180deg, var(--red-50), #fff)", borderBottom: "1px solid var(--slate-200)" }}>
                <div className="umd-wrap" style={{ maxWidth: 860, padding: "36px 24px 32px" }}>
                    <a href={contributeHref} className="umd-ftr-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14, fontSize: 13.5 }}>
                        <ArrowLeft style={{ width: 15, height: 15 }} />{t.t('backToContribute')}
                    </a>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span style={{ width: 46, height: 46, borderRadius: "var(--umd-radius-md)", background: "var(--red-50)", border: "1px solid var(--red-200)", color: "var(--red-600)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <AlertTriangle style={{ width: 22, height: 22 }} />
                        </span>
                        <div>
                            <h1 className="umd-heading-3" style={{ marginBottom: 4 }}>{t.t('title')}</h1>
                            <p style={{ margin: 0, fontSize: 14.5, color: "var(--fg2)" }}>{t.t('subtitle')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="umd-wrap" style={{ maxWidth: 860, padding: "28px 24px 80px" }}>
                <div className="umd-card" style={{ padding: "24px 26px", display: "flex", flexDirection: "column", gap: 18 }}>
                    <p style={{ margin: 0, color: "var(--fg2)", lineHeight: 1.6, fontSize: 14.5 }}>
                        {t.t('description')}
                    </p>

                    {/* Service selection */}
                    <div>
                        {!isNewService ? (
                            <>
                                <label className="umd-label">{t.t('selectServiceTitle')}</label>
                                <Select
                                    options={serviceOptions}
                                    onChange={handleServiceSelect}
                                    placeholder={t.t('selectServicePlaceholder')}
                                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                    components={{
                                        IndicatorSeparator: () => null,
                                        DropdownIndicator: (props) => (
                                            <components.DropdownIndicator {...props}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{ color: "var(--slate-400)" }} fill="none" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                                                </svg>
                                            </components.DropdownIndicator>
                                        ),
                                        NoOptionsMessage: (props) => (
                                            <components.NoOptionsMessage {...props}>
                                                <div className="text-center py-2">
                                                    <span style={{ color: "var(--fg2)" }}>{t.t('serviceNotFoundWithMessage')}</span>
                                                    <button
                                                        type="button"
                                                        onMouseDown={(e) => { e.preventDefault(); setIsNewService(true); }}
                                                        className="umd-btn-ghost"
                                                        style={{ background: "transparent", border: "none", color: "var(--indigo-700)", fontWeight: 600, cursor: "pointer", marginLeft: 4 }}
                                                    >
                                                        {t.t('createServiceAction')}
                                                    </button>
                                                </div>
                                            </components.NoOptionsMessage>
                                        )
                                    }}
                                    styles={umdSelectStyles}
                                />
                            </>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <label className="umd-label">{t.t('newServiceName')}</label>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <input
                                        type="text"
                                        value={newServiceName}
                                        onChange={(e) => setNewServiceName(e.target.value)}
                                        placeholder={t.t('newServiceNamePlaceholder')}
                                        className="umd-input"
                                        style={{ flex: 1 }}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsNewService(false)}
                                        className="umd-btn umd-btn-outline umd-btn-sm"
                                    >
                                        {t.t('cancelNewService')}
                                    </button>
                                </div>

                                {existingServiceMatch ? (
                                    <div className="umd-alert umd-alert-info" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                                        <span className="umd-alert-ic"><Info /></span>
                                        <p className="umd-alert-desc" style={{ flex: 1 }}>
                                            {t.t('serviceAlreadyExists')} <strong>{existingServiceMatch.name}</strong>
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => { handleServiceSelect({ service: existingServiceMatch }); }}
                                            className="umd-btn umd-btn-primary umd-btn-sm"
                                        >
                                            {t.t('useExistingService')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="umd-alert umd-alert-info">
                                        <span className="umd-alert-ic"><Info /></span>
                                        <p className="umd-alert-desc">{t.t('newServiceInfo')}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {(selectedService || (isNewService && newServiceName)) && (
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18, borderTop: "1px solid var(--slate-100)", paddingTop: 18 }}>
                            <div className="umd-divider-label">{t.t('leakDetails')}</div>

                            <div>
                                <label className="umd-label">{t.t('date')} {req}</label>
                                <div className="umd-field" style={{ maxWidth: 280 }}>
                                    <Calendar />
                                    <input
                                        type="date"
                                        required
                                        className="umd-input umd-has-ic"
                                        value={formData.date || ''}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Leaked-data types — multi-select pills (Security.jsx LEAK_DATA_TYPES) */}
                            <div>
                                <span className="umd-label">{t.t('dataTypes')} {req}</span>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {LEAK_DATA_TYPES.map(item => {
                                        const on = selectedTypes.includes(item.fr);
                                        return (
                                            <label key={item.fr} className={`umd-check-line${on ? " umd-on" : ""}`} style={{ padding: "8px 13px", fontSize: 13 }}>
                                                <input
                                                    type="checkbox"
                                                    style={{ display: "none" }}
                                                    checked={on}
                                                    onChange={() => toggleType(item.fr)}
                                                />
                                                {lang === "fr" ? item.fr : item.en}
                                            </label>
                                        );
                                    })}
                                </div>
                                <input
                                    type="text"
                                    className="umd-input"
                                    style={{ marginTop: 10 }}
                                    placeholder={t.t('customTypePlaceholder')}
                                    value={customType}
                                    onChange={e => { setCustomType(e.target.value); syncTypes(selectedTypes, e.target.value); }}
                                />
                                <p className="umd-form-hint">{t.t('customTypeHint')}</p>
                            </div>

                            {/* Privacy warning — responsible disclosure */}
                            <div className="umd-alert umd-alert-warn">
                                <span className="umd-alert-ic"><AlertCircle /></span>
                                <div>
                                    <p className="umd-alert-title">{t.t('warningTitle')}</p>
                                    <p className="umd-alert-desc">{t.t('proofWarning')}</p>
                                </div>
                            </div>

                            {/* Proof upload */}
                            <div>
                                <label className="umd-label">{t.t('proof')} {req}</label>
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        padding: "28px 24px",
                                        border: `2px dashed ${proofPreview || isDragging ? "var(--indigo-400)" : "var(--slate-300)"}`,
                                        borderRadius: "var(--umd-radius-md)",
                                        background: proofPreview || isDragging ? "var(--indigo-50)" : "#fff",
                                    }}
                                >
                                    <div style={{ textAlign: "center" }}>
                                        {proofPreview ? (
                                            <div style={{ position: "relative", display: "inline-block" }}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={proofPreview} alt="Proof preview" style={{ maxHeight: 192, borderRadius: "var(--umd-radius-md)", border: "1px solid var(--slate-200)" }} />
                                                <button
                                                    type="button"
                                                    aria-label={t.t('removeProof')}
                                                    onClick={(e) => { e.preventDefault(); setProofFile(null); setProofPreview(null); }}
                                                    style={{ position: "absolute", top: -10, right: -10, background: "var(--red-600)", color: "#fff", borderRadius: "50%", border: "none", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                                >
                                                    <X style={{ width: 16, height: 16 }} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <span style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--indigo-50)", color: "var(--indigo-700)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                                                    <Upload style={{ width: 22, height: 22 }} />
                                                </span>
                                                <div style={{ fontSize: 14, color: "var(--fg2)" }}>
                                                    <label htmlFor="file-upload" style={{ cursor: "pointer", fontWeight: 600, color: "var(--indigo-700)" }}>
                                                        {t.t('uploadFile')}
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            required
                                                        />
                                                    </label>
                                                    <span> {t.t('dragDrop')}</span>
                                                </div>
                                                <p className="umd-form-hint" style={{ marginTop: 4 }}>{t.t('fileHint')}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="umd-label">{t.t('contributor')}</label>
                                <div className="umd-field">
                                    <User />
                                    <input
                                        type="text"
                                        className="umd-input umd-has-ic"
                                        value={formData.contributor || ''}
                                        onChange={e => setFormData({ ...formData, contributor: e.target.value })}
                                        placeholder="Anonymous"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="umd-label">{t.t('mediaLink')}</label>
                                <input
                                    type="url"
                                    className="umd-input"
                                    value={mediaLink}
                                    onChange={e => setMediaLink(e.target.value)}
                                    placeholder={t.t('mediaLinkPlaceholder')}
                                />
                                <p className="umd-form-hint">{t.t('mediaLinkHint')}</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="umd-btn umd-btn-danger umd-btn-lg"
                                style={{ width: "100%", opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                            >
                                {loading ? (
                                    t.t('submitting')
                                ) : (
                                    <>
                                        <AlertTriangle />
                                        {t.t('submit')}
                                    </>
                                )}
                            </button>

                            {error && (
                                <div role="alert" className="umd-alert umd-alert-danger">
                                    <span className="umd-alert-ic"><AlertTriangle /></span>
                                    <p className="umd-alert-desc">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div role="status" className="umd-alert umd-alert-safe">
                                    <span className="umd-alert-ic"><CheckCircle /></span>
                                    <p className="umd-alert-desc" dangerouslySetInnerHTML={{ __html: success }} />
                                </div>
                            )}
                        </form>
                    )}

                    {/* Service not found — footer prompt */}
                    {serviceOptions.length > 0 && !selectedService && !isNewService && (
                        <div className="umd-alert umd-alert-warn">
                            <span className="umd-alert-ic"><Info /></span>
                            <p className="umd-alert-desc">
                                {t.t('serviceNotFoundWithMessage')}
                                <button
                                    type="button"
                                    onClick={() => setIsNewService(true)}
                                    style={{ background: "transparent", border: "none", color: "var(--indigo-700)", fontWeight: 600, cursor: "pointer", marginLeft: 4 }}
                                >
                                    {t.t('createServiceAction')}
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
