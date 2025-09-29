"use client";
import {useState, useEffect} from "react";
import Select from "react-select";
import { FORM_OPTIONS } from "@/constants/formOptions";
import {FormData} from "@/types/form";
import {createGitHubPR, generateSlug} from "@/tools/github"

export default function NouvelleFiche() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
        transfer_destination_countries: []
    });

    useEffect(() => {
        const auth = localStorage.getItem("admin_authenticated");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Remplacez par votre mot de passe sécurisé
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem("admin_authenticated", "true");
            setError("");
        } else {
            setError("Mot de passe incorrect");
        }
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
            const prUrl = await createGitHubPR(formData,filename, jsonContent,`Nouvelle fiche: ${formData.name}`,`Ajout nouvelle fiche: ${formData.name}`, 'ajout');

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
                response_delay_autre: ""
            });

        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur lors de la création de la fiche");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title justify-center">Accès Administrateur</h2>
                        <form onSubmit={handleLogin}>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Mot de passe</span>
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-error mt-4">{error}</div>}
                            <div className="form-control mt-6">
                                <button type="submit" className="btn btn-primary">
                                    Se connecter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h1 className="card-title text-3xl justify-center mb-6">Créer une nouvelle fiche</h1>

                            {error && <div className="alert alert-error mb-4">{error}</div>}
                            {success && <div className="alert alert-success mb-4">{success}</div>}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Informations générales */}
                                <div className="card bg-base-200">
                                    <div className="card-body">
                                        <h2 className="card-title">Informations générales</h2>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Nom de l'entreprise *</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                    required
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">URL du logo (wikimedia)</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    name="logo"
                                                    value={formData.logo}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                    placeholder={"https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"}
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Nationalité *</span>
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
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Auteur•rice de la fiche *</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="author"
                                                    value={formData.author}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                    placeholder="Nom de l'auteur"
                                                    required
                                                />
                                            </div>

                                        </div>

                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start gap-4">
                                                <input
                                                    type="checkbox"
                                                    name="belongs_to_group"
                                                    checked={formData.belongs_to_group}
                                                    onChange={handleInputChange}
                                                    className="checkbox"
                                                />
                                                <span className="label-text">Appartient à un groupe</span>
                                            </label>
                                        </div>

                                        {formData.belongs_to_group && (
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Nom du groupe</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="group_name"
                                                    value={formData.group_name}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Accès aux données */}
                                <div className="card bg-base-200">
                                    <div className="card-body">
                                        <h2 className="card-title">Accès aux données personnelles</h2>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Email de contact pour l'export</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="contact_mail_export"
                                                    value={formData.contact_mail_export}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Facilité d'accès aux données *</span>
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
                                                        <div>
                                                            <div style={{fontWeight: 600}}>{option.note}/5</div>
                                                            <div style={{
                                                                fontSize: 12,
                                                                color: "#888"
                                                            }}>{option.explanation}</div>
                                                        </div>
                                                    )}
                                                    getOptionLabel={option => option.note}
                                                    getOptionValue={option => option.value}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">

                                            <div className="form-control">
                                                <label className="label cursor-pointer justify-start gap-4">
                                                    <input
                                                        type="checkbox"
                                                        name="data_access_via_postal"
                                                        checked={formData.data_access_via_postal}
                                                        onChange={handleInputChange}
                                                        className="checkbox"
                                                    />
                                                    <span className="label-text">Accès par courrier postal</span>
                                                </label>
                                            </div>

                                            <div className="form-control">
                                                <label className="label cursor-pointer justify-start gap-4">
                                                    <input
                                                        type="checkbox"
                                                        name="data_access_via_form"
                                                        checked={formData.data_access_via_form}
                                                        onChange={handleInputChange}
                                                        className="checkbox"
                                                    />
                                                    <span className="label-text">Accès via formulaire</span>
                                                </label>
                                            </div>

                                            <div className="form-control">
                                                <label className="label cursor-pointer justify-start gap-4">
                                                    <input
                                                        type="checkbox"
                                                        name="data_access_via_email"
                                                        checked={formData.data_access_via_email}
                                                        onChange={handleInputChange}
                                                        className="checkbox"
                                                    />
                                                    <span className="label-text">Accès par email</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Documents requis *</span>
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
                                                    className="select select-bordered"
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
                                                        className="input input-bordered mt-2"
                                                        placeholder="Précisez le document"
                                                        required
                                                    />
                                                )}
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Préciser comment faire la demande d'accès aux données</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="data_access_type"
                                                    value={formData.data_access_type}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Format de réponse *</span>
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
                                                    className="select select-bordered"
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
                                                        className="input input-bordered mt-2"
                                                        placeholder="Précisez le format"
                                                        required
                                                    />
                                                )}
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Délai de réponse*</span>
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
                                                    className="select select-bordered"
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
                                                        className="input input-bordered mt-2"
                                                        placeholder="Précisez le délai"
                                                        required
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">URL du site pour faire une demande d'export</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    name="url_export"
                                                    value={formData.url_export}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                    placeholder={"https://www.example.com/export"}
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Adresse postale pour faire une demande d'export</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address_export"
                                                    value={formData.address_export}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                    placeholder={"123 Rue Exemple, 75000 Paris, France"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sanctions et transferts */}
                                <div className="card bg-base-200">
                                    <div className="card-body">
                                        <h2 className="card-title">Sanctions et transferts de données</h2>

                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start gap-4">
                                                <input
                                                    type="checkbox"
                                                    name="sanctioned_by_cnil"
                                                    checked={formData.sanctioned_by_cnil}
                                                    onChange={handleInputChange}
                                                    className="checkbox"
                                                />
                                                <span className="label-text">Sanctionné par la CNIL</span>
                                            </label>
                                        </div>

                                        {formData.sanctioned_by_cnil && (
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Détails des sanctions</span>
                                                </label>
                                                <textarea
                                                    name="sanction_details"
                                                    value={formData.sanction_details}
                                                    onChange={handleInputChange}
                                                    className="textarea textarea-bordered"
                                                    rows={3}
                                                />
                                            </div>
                                        )}

                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start gap-4">
                                                <input
                                                    type="checkbox"
                                                    name="data_transfer_policy"
                                                    checked={formData.data_transfer_policy}
                                                    onChange={handleInputChange}
                                                    className="checkbox"
                                                />
                                                <span className="label-text">Politique de transfert de données</span>
                                            </label>
                                        </div>

                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start gap-4">
                                                <input
                                                    type="checkbox"
                                                    name="outside_eu_storage"
                                                    checked={formData.outside_eu_storage}
                                                    onChange={handleInputChange}
                                                    className="checkbox"
                                                />
                                                <span className="label-text">Stockage hors UE</span>
                                            </label>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span
                                                        className="label-text">Pays de destination des transferts</span>
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
                                                />
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span
                                                    className="label-text">Citation de la politique de confidentialité</span>
                                            </label>
                                            <textarea
                                                name="privacy_policy_quote"
                                                value={formData.privacy_policy_quote}
                                                onChange={handleInputChange}
                                                className="textarea textarea-bordered"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Application */}
                                <div className="card bg-base-200">
                                    <div className="card-body">
                                        <h2 className="card-title">Application mobile (optionnel)</h2>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Nom de l'application</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="app_name"
                                                    value={formData.app_name}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                    placeholder={"Carrefour & Moi"}
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Lien Play Store/App Store</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    name="app_link"
                                                    value={formData.app_link}
                                                    onChange={handleInputChange}
                                                    placeholder={"https://play.google.com/store/apps/details?id=com.carrefour.fid.android"}
                                                    className="input input-bordered"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Commentaires */}
                                <div className="card bg-base-200">
                                    <div className="card-body">
                                        <h2 className="card-title">Commentaires additionnels</h2>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Commentaires</span>
                                            </label>
                                            <textarea
                                                name="comments"
                                                value={formData.comments}
                                                onChange={handleInputChange}
                                                className="textarea textarea-bordered"
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-control mt-8">
                                    <button
                                        type="submit"
                                        className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading ? 'Création en cours...' : 'Créer la fiche et PR'}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("admin_authenticated");
                                        setIsAuthenticated(false);
                                    }}
                                    className="btn btn-ghost"
                                >
                                    Se déconnecter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
