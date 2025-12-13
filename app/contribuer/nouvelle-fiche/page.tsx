"use client";
import {useState} from "react";
import Select from "react-select";
import { Database, ShieldAlert, Smartphone, MessageSquare, CheckCircle, AlertCircle, Send, Building2, Globe, User, FileText, Mail, MapPin } from "lucide-react";
import {FORM_OPTIONS} from "@/constants/formOptions";
import {FormData} from "@/types/form";
import {createGitHubPR, generateSlug} from "@/tools/github"

export default function NouvelleFiche() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [openAccordions, setOpenAccordions] = useState<string[]>(["form-accordion-1"]);
    const nationalities = FORM_OPTIONS.nationalities;

    const responseFormatOptions = FORM_OPTIONS.responseFormats;
    const requiredDocumentsOptions = FORM_OPTIONS.requiredDocuments;
    const easyAccessOptions = FORM_OPTIONS.easyAccessLevels;
    const responseDelayOptions = FORM_OPTIONS.responseDelays;

    const [formData, setFormData] = useState<FormData>({
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
        data_access_via_postal: false,
        data_access_via_form: false,
        data_access_type: "",
        data_access_via_email: false,
        response_format: "",
        url_export: "",
        address_export: "",
        response_delay: "",
        sanctioned_by_cnil: false,
        sanction_details: "",
        data_transfer_policy: false,
        privacy_policy_quote: "",
        outside_eu_storage: false,
        comments: "",
        app_name: "",
        app_link: "",
        author: "",
        details_required_documents_autre: "",
        response_format_autre: "",
        response_delay_autre: "",
        transfer_destination_countries: [],
        // Fields EN
        details_required_documents_en: "",
        data_access_type_en: "",
        response_format_en: "",
        response_delay_en: "",
        privacy_policy_quote_en: "",
        comments_en: "",
        transfer_destination_countries_en: "",
    });

    const handleAccordionClick = (name: string) => {
        const newOpenAccordions = openAccordions.includes(name)
            ? openAccordions.filter(item => item !== name)
            : [...openAccordions, name];
        setOpenAccordions(newOpenAccordions);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            const slug = generateSlug(formData.name);
            const filename = `${slug}.json`;

            const jsonData = {
                name: formData.name,
                logo: formData.logo,
                nationality: formData.nationality,
                country_name: formData.country_name,
                country_code: formData.country_code,
                belongs_to_group: formData.belongs_to_group,
                group_name: formData.group_name,
                permissions: "",
                contact_mail_export: formData.contact_mail_export,
                easy_access_data: formData.easy_access_data,
                need_id_card: formData.need_id_card,
                details_required_documents: formData.details_required_documents === "Autre" && formData.details_required_documents_autre !== "" ? formData.details_required_documents_autre : formData.details_required_documents,
                data_access_via_postal: formData.data_access_via_postal,
                data_access_via_form: formData.data_access_via_form,
                data_access_type: formData.data_access_type,
                data_access_via_email: formData.data_access_via_email,
                response_format: formData.response_format === "Autre" && formData.response_format_autre !== "" ? formData.response_format_autre : formData.response_format,
                example_data_export: [],
                example_form_export: [],
                message_exchange: [],
                url_export: formData.url_export,
                address_export: formData.address_export,
                response_delay: formData.response_delay === "Autre" && formData.response_delay_autre !== "" ? formData.response_delay_autre : formData.response_delay,
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
                tosdr: "",
                exodus: "",
                created_at: new Date().toISOString().split('T')[0],
                created_by: formData.author || "Unlock My Data Team",
                updated_at: "",
                updated_by: "",
                app: {
                    name: formData.app_name,
                    link: formData.app_link
                }
            };

            const jsonContent = JSON.stringify(jsonData, null, 2);
            const prUrl = await createGitHubPR(formData, filename, jsonContent, `Nouvelle fiche: ${formData.name}`, `Ajout nouvelle fiche: ${formData.name}`, 'ajout');

            setSuccess(`Fiche créée avec succès ! Pull Request créée: ${prUrl}`);

            // Réinitialiser le formulaire
            setFormData({
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
                data_access_via_postal: false,
                data_access_via_form: false,
                data_access_type: "",
                data_access_via_email: false,
                response_format: "",
                url_export: "",
                address_export: "",
                response_delay: "",
                sanctioned_by_cnil: false,
                sanction_details: "",
                data_transfer_policy: false,
                privacy_policy_quote: "",
                transfer_destination_countries: [],
                outside_eu_storage: false,
                comments: "",
                app_name: "",
                app_link: "",
                author: "",
                details_required_documents_autre: "",
                response_format_autre: "",
                response_delay_autre: "",
                // Fields EN
                details_required_documents_en: "",
                data_access_type_en: "",
                response_format_en: "",
                response_delay_en: "",
                privacy_policy_quote_en: "",
                comments_en: "",
                transfer_destination_countries_en: "",
            });

        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la création de la fiche");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 shadow-sm">
                        <FileText className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Contribuer à la base de données
                    </h1>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                        Aidez des milliers d&apos;utilisateurs à reprendre le contrôle de leurs données en ajoutant les informations d&apos;une nouvelle entreprise.
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

                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            {/* Informations générales */}
                            <div className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
                                <input type="checkbox" name="form-accordion-1" checked={openAccordions.includes("form-accordion-1")} onChange={() => handleAccordionClick("form-accordion-1")} />
                                <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    Informations générales
                                </div>
                                <div className="collapse-content pt-4">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Nom de l&apos;entreprise <span className="text-error">*</span></span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="input input-bordered w-full focus:input-primary"
                                                placeholder="Ex: Netflix"
                                                required
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">URL du logo (Wikimedia)</span>
                                            </label>
                                            <div className="tooltip w-full" data-tip="Nous utilisons les logos de Wikimedia pour leur qualité et leur licence libre.">
                                                <div className="relative">
                                                    <input
                                                        type="url"
                                                        name="logo"
                                                        value={formData.logo}
                                                        onChange={handleInputChange}
                                                        className="input input-bordered w-full pl-10 focus:input-primary"
                                                        placeholder="https://upload.wikimedia.org/..."
                                                    />
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-control" style={{zIndex: 100}}>
                                            <label className="label">
                                                <span className="label-text font-medium">Nationalité <span className="text-error">*</span></span>
                                            </label>
                                            <Select
                                                options={nationalities}
                                                value={nationalities.find(n => n.label === formData.nationality) || null}
                                                onChange={selected => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        nationality: selected?.label || "",
                                                        country_name: selected?.country_name || "",
                                                        country_code: selected?.country_code || ""
                                                    }));
                                                }}
                                                placeholder="Rechercher une nationalité..."
                                                isClearable
                                                getOptionLabel={option => option.label}
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
                                                <span className="label-text font-medium">Auteur•rice de la fiche <span className="text-error">*</span></span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="author"
                                                    value={formData.author}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered w-full pl-10 focus:input-primary"
                                                    placeholder="Votre nom ou pseudo"
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
                                                checked={formData.belongs_to_group}
                                                onChange={handleInputChange}
                                                className="checkbox checkbox-primary"
                                            />
                                            <span className="label-text font-medium">Cette entreprise appartient à un groupe</span>
                                        </label>
                                    </div>

                                    {formData.belongs_to_group && (
                                        <div className="form-control mt-4 animate-in fade-in slide-in-from-top-2">
                                            <label className="label">
                                                <span className="label-text font-medium">Nom du groupe</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="group_name"
                                                value={formData.group_name}
                                                onChange={handleInputChange}
                                                className="input input-bordered w-full focus:input-primary"
                                                placeholder="Ex: Alphabet Inc."
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Accès aux données */}
                            <div className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
                                <input type="checkbox" name="form-accordion-2" checked={openAccordions.includes("form-accordion-2")} onChange={() => handleAccordionClick("form-accordion-2")} />
                                <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                    <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                                        <Database className="w-5 h-5" />
                                    </div>
                                    Accès aux données personnelles
                                </div>
                                <div className="collapse-content pt-4">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Email de contact pour l&apos;export</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    name="contact_mail_export"
                                                    value={formData.contact_mail_export}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered w-full pl-10 focus:input-secondary"
                                                    placeholder="privacy@example.com"
                                                />
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="form-control" style={{zIndex: 90}}>
                                            <label className="label">
                                                <span className="label-text font-medium">Facilité d&apos;accès aux données <span className="text-error">*</span></span>
                                            </label>
                                            <Select
                                                name="easy_access_data"
                                                options={easyAccessOptions}
                                                value={easyAccessOptions.find(opt => opt.value === formData.easy_access_data) || null}
                                                onChange={selected =>
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        easy_access_data: selected?.value || ""
                                                    }))
                                                }
                                                placeholder="Sélectionner le niveau..."
                                                isClearable
                                                formatOptionLabel={option => (
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold badge badge-ghost">{option.note}/5</span>
                                                        <span className="text-sm text-base-content/70 ml-2">{option.explanation}</span>
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

                                    <div className="divider text-sm text-base-content/50">Moyens d&apos;accès</div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="form-control p-3 border border-base-200 rounded-lg hover:border-secondary/50 transition-colors">
                                            <label className="label cursor-pointer justify-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    name="data_access_via_postal"
                                                    checked={formData.data_access_via_postal}
                                                    onChange={handleInputChange}
                                                    className="checkbox checkbox-secondary"
                                                />
                                                <span className="label-text font-medium">Courrier postal</span>
                                            </label>
                                        </div>

                                        <div className="form-control p-3 border border-base-200 rounded-lg hover:border-secondary/50 transition-colors">
                                            <label className="label cursor-pointer justify-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    name="data_access_via_form"
                                                    checked={formData.data_access_via_form}
                                                    onChange={handleInputChange}
                                                    className="checkbox checkbox-secondary"
                                                />
                                                <span className="label-text font-medium">Formulaire web</span>
                                            </label>
                                        </div>

                                        <div className="form-control p-3 border border-base-200 rounded-lg hover:border-secondary/50 transition-colors">
                                            <label className="label cursor-pointer justify-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    name="data_access_via_email"
                                                    checked={formData.data_access_via_email}
                                                    onChange={handleInputChange}
                                                    className="checkbox checkbox-secondary"
                                                />
                                                <span className="label-text font-medium">Email</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="divider text-sm text-base-content/50">Détails de la procédure</div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Documents requis <span className="text-error">*</span></span>
                                            </label>
                                            <select
                                                name="details_required_documents"
                                                value={formData.details_required_documents}
                                                onChange={e => {
                                                    const value = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        details_required_documents: value,
                                                        need_id_card: value === "Carte d'identité"
                                                    }));
                                                }}
                                                className="select select-bordered focus:select-secondary w-full"
                                                required
                                            >
                                                {requiredDocumentsOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {formData.details_required_documents === "Autre" && (
                                                <input
                                                    type="text"
                                                    name="details_required_documents_autre"
                                                    value={formData.details_required_documents_autre || ""}
                                                    onChange={e =>
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            details_required_documents_autre: e.target.value
                                                        }))
                                                    }
                                                    className="input input-bordered w-full mt-2 focus:input-secondary"
                                                    placeholder="Précisez le document"
                                                    required
                                                />
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Documents requis (EN)</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="details_required_documents_en"
                                                value={formData.details_required_documents_en}
                                                onChange={handleInputChange}
                                                className="input input-bordered w-full focus:input-secondary"
                                                placeholder="Required documents (English)"
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Préciser comment faire la demande</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="data_access_type"
                                                value={formData.data_access_type}
                                                onChange={handleInputChange}
                                                className="input input-bordered w-full focus:input-secondary"
                                                placeholder="Ex: Envoyer un mail avec ID"
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Type d&apos;accès aux données (EN)</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="data_access_type_en"
                                                value={formData.data_access_type_en}
                                                onChange={handleInputChange}
                                                className="input input-bordered w-full focus:input-secondary"
                                                placeholder="Data access type (English)"
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Format de réponse <span className="text-error">*</span></span>
                                            </label>
                                            <select
                                                name="response_format"
                                                value={formData.response_format}
                                                onChange={e => {
                                                    const value = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        response_format: value
                                                    }));
                                                }}
                                                className="select select-bordered focus:select-secondary w-full"
                                                required
                                            >
                                                {responseFormatOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {formData.response_format === "Autre" && (
                                                <input
                                                    type="text"
                                                    name="response_format_autre"
                                                    value={formData.response_format_autre || ""}
                                                    onChange={e =>
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            response_format_autre: e.target.value
                                                        }))
                                                    }
                                                    className="input input-bordered w-full mt-2 focus:input-secondary"
                                                    placeholder="Précisez le format"
                                                    required
                                                />
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Format de réponse (EN)</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="response_format_en"
                                                value={formData.response_format_en}
                                                onChange={handleInputChange}
                                                className="input input-bordered w-full focus:input-secondary"
                                                placeholder="Response format (English)"
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Délai de réponse <span className="text-error">*</span></span>
                                            </label>
                                            <select
                                                name="response_delay"
                                                value={formData.response_delay}
                                                onChange={e => {
                                                    const value = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        response_delay: value
                                                    }));
                                                }}
                                                className="select select-bordered focus:select-secondary w-full"
                                                required
                                            >
                                                {responseDelayOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {formData.response_delay === "Autre" && (
                                                <input
                                                    type="text"
                                                    name="response_delay_autre"
                                                    value={formData.response_delay_autre || ""}
                                                    onChange={e =>
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            response_delay_autre: e.target.value
                                                        }))
                                                    }
                                                    className="input input-bordered w-full mt-2 focus:input-secondary"
                                                    placeholder="Précisez le délai"
                                                    required
                                                />
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Délai de réponse (EN)</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="response_delay_en"
                                                value={formData.response_delay_en}
                                                onChange={handleInputChange}
                                                className="input input-bordered w-full focus:input-secondary"
                                                placeholder="Response delay (English)"
                                            />
                                        </div>
                                    </div>

                                    <div className="divider text-sm text-base-content/50">Coordonnées pour l&apos;export</div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">URL du site pour faire une demande</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="url"
                                                    name="url_export"
                                                    value={formData.url_export}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered w-full pl-10 focus:input-secondary"
                                                    placeholder="https://www.example.com/export"
                                                />
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Adresse postale pour faire une demande</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="address_export"
                                                    value={formData.address_export}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered w-full pl-10 focus:input-secondary"
                                                    placeholder="123 Rue Exemple, 75000 Paris"
                                                />
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sanctions et transferts */}
                            <div className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
                                <input type="checkbox" name="form-accordion-3" checked={openAccordions.includes("form-accordion-3")} onChange={() => handleAccordionClick("form-accordion-3")} />
                                <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                    <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                        <ShieldAlert className="w-5 h-5" />
                                    </div>
                                    Sanctions et transferts de données
                                </div>
                                <div className="collapse-content pt-4">
                                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                                        <div className="form-control p-3 border border-base-200 rounded-lg hover:border-accent/50 transition-colors">
                                            <label className="label cursor-pointer justify-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    name="sanctioned_by_cnil"
                                                    checked={formData.sanctioned_by_cnil}
                                                    onChange={handleInputChange}
                                                    className="checkbox checkbox-accent"
                                                />
                                                <span className="label-text font-medium">Sanctionné par la CNIL</span>
                                            </label>
                                        </div>

                                        <div className="form-control p-3 border border-base-200 rounded-lg hover:border-accent/50 transition-colors">
                                            <label className="label cursor-pointer justify-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    name="data_transfer_policy"
                                                    checked={formData.data_transfer_policy}
                                                    onChange={handleInputChange}
                                                    className="checkbox checkbox-accent"
                                                />
                                                <span className="label-text font-medium">Politique de transfert de données</span>
                                            </label>
                                        </div>

                                        <div className="form-control p-3 border border-base-200 rounded-lg hover:border-accent/50 transition-colors">
                                            <label className="label cursor-pointer justify-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    name="outside_eu_storage"
                                                    checked={formData.outside_eu_storage}
                                                    onChange={handleInputChange}
                                                    className="checkbox checkbox-accent"
                                                />
                                                <span className="label-text font-medium">Stockage hors UE</span>
                                            </label>
                                        </div>
                                    </div>

                                    {formData.sanctioned_by_cnil && (
                                        <div className="form-control mb-6 animate-in fade-in slide-in-from-top-2">
                                            <label className="label">
                                                <span className="label-text font-medium">Détails des sanctions</span>
                                            </label>
                                            <textarea
                                                name="sanction_details"
                                                value={formData.sanction_details}
                                                onChange={handleInputChange}
                                                className="textarea textarea-bordered focus:textarea-accent"
                                                rows={3}
                                                placeholder="Décrivez les sanctions..."
                                            />
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="form-control" style={{zIndex: 80}}>
                                            <label className="label">
                                                <span className="label-text font-medium">Pays de destination des transferts</span>
                                            </label>
                                            <Select
                                                isMulti
                                                options={FORM_OPTIONS.countries}
                                                value={FORM_OPTIONS.countries.filter(n =>
                                                    formData.transfer_destination_countries.includes(n.label)
                                                )}
                                                onChange={selected =>
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        transfer_destination_countries: selected
                                                            ? selected.map((s: any) => s.label)
                                                            : []
                                                    }))
                                                }
                                                placeholder="Sélectionner les pays..."
                                                isClearable
                                                getOptionLabel={option => option.label}
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
                                                <span className="label-text font-medium">Citation de la politique de confidentialité</span>
                                            </label>
                                            <textarea
                                                name="privacy_policy_quote"
                                                value={formData.privacy_policy_quote}
                                                onChange={handleInputChange}
                                                className="textarea textarea-bordered focus:textarea-accent"
                                                rows={3}
                                                placeholder="Copiez-collez l'extrait pertinent..."
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Citation de la politique de confidentialité (EN)</span>
                                            </label>
                                            <textarea
                                                name="privacy_policy_quote_en"
                                                value={formData.privacy_policy_quote_en}
                                                onChange={handleInputChange}
                                                className="textarea textarea-bordered focus:textarea-accent"
                                                rows={3}
                                                placeholder="Privacy policy quote (English)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Application */}
                            <div className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
                                <input type="checkbox" name="form-accordion-4" checked={openAccordions.includes("form-accordion-4")} onChange={() => handleAccordionClick("form-accordion-4")} />
                                <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                    <div className="p-2 bg-info/10 rounded-lg text-info">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    Application mobile <span className="text-sm font-normal opacity-60 ml-2">(Optionnel)</span>
                                </div>
                                <div className="collapse-content pt-4">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Nom de l&apos;application</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="app_name"
                                                value={formData.app_name}
                                                onChange={handleInputChange}
                                                className="input input-bordered w-full focus:input-info"
                                                placeholder="Ex: Carrefour & Moi"
                                            />
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Lien Play Store/App Store</span>
                                            </label>
                                            <input
                                                type="url"
                                                name="app_link"
                                                value={formData.app_link}
                                                onChange={handleInputChange}
                                                placeholder="https://play.google.com/..."
                                                className="input input-bordered w-full focus:input-info"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Commentaires */}
                            <div className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
                                <input type="checkbox" name="form-accordion-5" checked={openAccordions.includes("form-accordion-5")} onChange={() => handleAccordionClick("form-accordion-5")} />
                                <div className="collapse-title text-xl font-medium flex items-center gap-3">
                                    <div className="p-2 bg-neutral/10 rounded-lg text-neutral">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    Commentaires additionnels
                                </div>
                                <div className="collapse-content pt-4">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Commentaires</span>
                                            </label>
                                            <textarea
                                                name="comments"
                                                value={formData.comments}
                                                onChange={handleInputChange}
                                                className="textarea textarea-bordered w-full focus:textarea-neutral"
                                                rows={4}
                                                placeholder="Toute information utile..."
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Commentaires (EN)</span>
                                            </label>
                                            <textarea
                                                name="comments_en"
                                                value={formData.comments_en}
                                                onChange={handleInputChange}
                                                className="textarea textarea-bordered w-full focus:textarea-neutral"
                                                rows={4}
                                                placeholder="Comments (English)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-control mt-10">
                                <button
                                    type="submit"
                                    className={`btn btn-primary btn-lg w-full md:w-auto md:px-12 mx-auto gap-3 shadow-lg hover:shadow-xl transition-all ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {!loading && <Send className="w-5 h-5" />}
                                    {loading ? 'Création en cours...' : 'Soumettre ma contribution'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
