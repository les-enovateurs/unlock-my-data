"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface FormData {
    name: string;
    logo: string;
    nationality: string;
    country_name: string;
    country_code: string;
    belongs_to_group: boolean;
    group_name: string;
    contact_mail_export: string;
    easy_access_data: string;
    need_id_card: boolean;
    details_required_documents: string;
    data_access_via_postal: boolean;
    data_access_via_form: boolean;
    data_access_type: string;
    data_access_via_email: boolean;
    response_format: string;
    url_export: string;
    address_export: string;
    response_delay: string;
    sanctioned_by_cnil: boolean;
    sanction_details: string;
    data_transfer_policy: boolean;
    privacy_policy_quote: string;
    transfer_destination_countries: string;
    outside_eu_storage: boolean;
    comments: string;
    app_name: string;
    app_link: string;
    author: string;
}

export default function NouvelleFiche() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const testGitHubPermissions = async () => {
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        const response = await fetch('https://api.github.com/repos/les-enovateurs/unlock-my-data', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json'
            }
        });

        const data = await response.json();
        console.log('Permissions:', data.permissions);
    };


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
        transfer_destination_countries: "",
        outside_eu_storage: false,
        comments: "",
        app_name: "",
        app_link: "",
        author: ""
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
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const createSecureBranchName = (name: string): string => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
            .replace(/\s+/g, '-')          // Replace spaces with hyphens
            .replace(/-+/g, '-')           // Replace multiple hyphens with single hyphen
            .replace(/^-+|-+$/g, '')       // Remove leading/trailing hyphens
            .substring(0, 10)              // Limit to 30 characters
            .replace(/-+$/g, '');          // Remove trailing hyphen if substring cut in middle of word
    };

    const createGitHubPR = async (filename: string, content: string) => {
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        if (!token) {
            throw new Error("Token GitHub manquant");
        }

        const owner = "les-enovateurs";
        const repo = "unlock-my-data";
        const branch = "fiche-"+ createSecureBranchName(formData.name) + '-' + Date.now();

        try {
            // 1. Récupérer la référence de la branche master
            const masterRef = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/master`, {
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
            }).then(r => r.json());

            // 2. Créer une nouvelle branche
            await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ref: `refs/heads/${branch}`,
                    sha: masterRef.object.sha
                })
            });

            // 3. Créer le fichier
            const createFileResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/public/data/manual/${filename}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Ajout nouvelle fiche: ${formData.name}`,
                    content: btoa(unescape(encodeURIComponent(content))),
                    branch: branch
                })
            });

            if (!createFileResponse.ok) {
                throw new Error("Erreur lors de la création du fichier");
            }

            // 4. Créer la Pull Request
            const prResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json',
                    "X-GitHub-Api-Version": '2022-11-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: `Nouvelle fiche: ${formData.name}`,
                    head: branch,
                    base: 'master',
                    body: `Ajout d'une nouvelle fiche pour ${formData.name}.\n\nFiche créée via le formulaire web.`
                })
            });

            const pr = await prResponse.json();
            return pr.html_url;

        } catch (error) {
            console.error('Erreur GitHub:', error);
            throw error;
        }
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
                details_required_documents: formData.details_required_documents,
                data_access_via_postal: formData.data_access_via_postal,
                data_access_via_form: formData.data_access_via_form,
                data_access_type: formData.data_access_type,
                data_access_via_email: formData.data_access_via_email,
                response_format: formData.response_format,
                example_data_export: [],
                example_form_export: [],
                message_exchange: [],
                url_export: formData.url_export,
                address_export: formData.address_export,
                response_delay: formData.response_delay,
                sanctioned_by_cnil: formData.sanctioned_by_cnil,
                sanction_details: formData.sanction_details,
                data_transfer_policy: formData.data_transfer_policy,
                privacy_policy_quote: formData.privacy_policy_quote,
                transfer_destination_countries: formData.transfer_destination_countries,
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
            const prUrl = await createGitHubPR(filename, jsonContent);

            setSuccess(`Fiche créée avec succès ! Pull Request créée: ${prUrl}`);

            // Réinitialiser le formulaire
            setFormData({
                name: "", logo: "", nationality: "", country_name: "", country_code: "",
                belongs_to_group: false, group_name: "", contact_mail_export: "",
                easy_access_data: "", need_id_card: false, details_required_documents: "",
                data_access_via_postal: false, data_access_via_form: false, data_access_type: "",
                data_access_via_email: false, response_format: "", url_export: "",
                address_export: "", response_delay: "", sanctioned_by_cnil: false,
                sanction_details: "", data_transfer_policy: false, privacy_policy_quote: "",
                transfer_destination_countries: "", outside_eu_storage: false,
                comments: "", app_name: "", app_link: "", author: ""
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
                                                    <span className="label-text">Nationalité</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nationality"
                                                    value={formData.nationality}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                    placeholder="ex: Américaine"
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Pays (nom anglais)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="country_name"
                                                    value={formData.country_name}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                    placeholder="ex: United States"
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Code pays (ISO)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="country_code"
                                                    value={formData.country_code}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                    placeholder="ex: us"
                                                    maxLength={2}
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
                                                    <span className="label-text">Facilité d'accès aux données</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="easy_access_data"
                                                    value={formData.easy_access_data}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label cursor-pointer justify-start gap-4">
                                                    <input
                                                        type="checkbox"
                                                        name="need_id_card"
                                                        checked={formData.need_id_card}
                                                        onChange={handleInputChange}
                                                        className="checkbox"
                                                    />
                                                    <span className="label-text">Carte d'identité requise</span>
                                                </label>
                                            </div>

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
                                                    <span className="label-text">Documents requis</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="details_required_documents"
                                                    value={formData.details_required_documents}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Type d'accès aux données</span>
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
                                                    <span className="label-text">Format de réponse</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="response_format"
                                                    value={formData.response_format}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Délai de réponse</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="response_delay"
                                                    value={formData.response_delay}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">URL d'export</span>
                                                </label>
                                                <input
                                                    type="url"
                                                    name="url_export"
                                                    value={formData.url_export}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Adresse d'export</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address_export"
                                                    value={formData.address_export}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
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
                                                    <span className="label-text">Pays de destination des transferts</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="transfer_destination_countries"
                                                    value={formData.transfer_destination_countries}
                                                    onChange={handleInputChange}
                                                    className="input input-bordered"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Citation de la politique de confidentialité</span>
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
