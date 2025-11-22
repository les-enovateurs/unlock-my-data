"use client"
import githubBranches from "../../doc/github-branches.webp";
import editFile from "../../doc/edit-file.webp";
import previewUpdate from "../../doc/preview-update.webp";
import updateFile from "../../doc/update-file.webp";

import Image from 'next/image';
import {useLanguage} from "@/context/LanguageContext";

export default function Contribuer() {
    const { setLang } = useLanguage();
    setLang('fr')
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto">

                <h1 className="text-4xl font-bold mb-8">Comment contribuer à la plateforme Unlock My Data</h1>
                <h2 className="text-3xl font-bold mb-8">Ajouter ou mettre à jour une fiche</h2>

                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 mb-8 text-lg">
                        Ce guide explique comment ajouter une nouvelle fiche, ou mettre à jour une fiche existante,
                        en utilisant l'interface Web de GitHub et la branche <code className="bg-gray-100 px-2 py-1 rounded text-sm">update-contributing</code>
                        (si vous êtes bénévole de l'association et que nous vous avons ajouté à l'équipe). Sinon, il faut passer par le système de fork/pull request.
                    </p>

                    {/* Vidéo YouTube */}
                    <section className="mb-12">
                        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
                            <h3 className="text-lg font-semibold mb-2 flex items-center">
                                <span className="text-2xl mr-2">📺</span>
                                Tutoriel vidéo explicatif
                            </h3>
                            <p className="mb-4">
                                Accompagnement étape par étape - version texte ci-dessous :
                            </p>
                            <a
                                href="https://youtu.be/54ySrr1ciu4"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                🎥 Voir le tutoriel sur YouTube
                                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-3xl font-semibold mb-6">1. Comprendre le fichier fiche d'entreprise</h2>
                        <div className="space-y-4 mb-8">
                            {/* En-tête explicatif */}
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                <h4 className="font-semibold text-blue-800 mb-2">Structure des champs JSON</h4>
                                <p className="text-blue-700 text-sm">
                                    Voici la liste complète des champs disponibles dans les fichiers de fiche entreprise :
                                </p>
                            </div>

                            {/* Liste des champs */}
                            <div className="grid gap-3 sm:gap-4">
                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            name
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Nom de l'entreprise.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            logo
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            URL du logo de l'entreprise.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            nationality
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Nationalité de l'entreprise (ex. : <code className="bg-gray-50 px-1 py-0.5 rounded text-xs">Américaine</code>).
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            country_name
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Pays où se trouve le siège de l'entreprise.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            country_code
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Code pays ISO (ex. : <code className="bg-gray-50 px-1 py-0.5 rounded text-xs">us</code>).
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            belongs_to_group
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Booléen : l'entreprise appartient-elle à un groupe ?
                                            (<code className="bg-gray-50 px-1 py-0.5 rounded text-xs">true</code> ou <code className="bg-gray-50 px-1 py-0.5 rounded text-xs">false</code>)
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            group_name
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Nom du groupe parent, si applicable.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            permissions
                                        </code>
                                        <div className="text-yellow-800 text-sm leading-relaxed">
                                            <span className="font-semibold">Permissions d'accès aux données demandées ou accordées.</span>
                                            <br />
                                            <span className="text-xs">NE PAS METTRE À JOUR MANUELLEMENT / SCRIPT D'AUTOMATISATION EXISTANT</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            contact_mail_export
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Adresse email pour les demandes d'export de données.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            easy_access_data
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Infos concernant un accès facilité aux données, si existant.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            need_id_card
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Booléen : une carte d'identité est-elle requise pour les demandes ?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            details_required_documents
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Détails sur les documents nécessaires pour l'accès aux données.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            data_access_via_postal
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Booléen : l'accès aux données est-il possible par courrier postal ?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            data_access_via_form
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Booléen : l'accès aux données est-il possible via un formulaire en ligne ?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            data_access_type
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Détails sur le type d'accès aux données (si non couvert ci-dessus).
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            data_access_via_email
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Booléen : l'accès aux données est-il possible par email ?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            response_format
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Format de la réponse (fichier, zip, PDF, etc.).
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            url_export
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            URL pour demander l'export de vos données.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            example_data_export
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Tableau d'objets (voir par exemple carrefour.json) liste d'éléments contenant url, type, description et date.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            example_form_export
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Tableau d'objets (voir par exemple carrefour.json) liste d'éléments contenant url, type, description et date.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            message_exchange
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Tableau d'objets (voir par exemple carrefour.json) liste d'éléments contenant url, type, description et date.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            address_export
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Adresse physique pour demander vos données.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            response_delay
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Délai de réponse habituel (ex. : <code className="bg-gray-50 px-1 py-0.5 rounded text-xs">Instantané</code>).
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            sanctioned_by_cnil
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Booléen : l'entreprise a-t-elle été sanctionnée par la CNIL ?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            sanction_details
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Détails et références aux sanctions de la CNIL.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            data_transfer_policy
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Booléen : l'entreprise a-t-elle une politique de transfert de données ?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            privacy_policy_quote
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Citation pertinente de la politique de confidentialité.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            transfer_destination_countries
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Liste des pays vers lesquels les données peuvent être transférées.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            outside_eu_storage
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Les données personnelles sont-elles stockées hors UE ?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            comments
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Commentaires supplémentaires.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            tosdr
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            URL local pour accéder aux données de tosdr.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            exodus
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            URL local pour accéder aux données d'exodus.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            created_at
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Date de création de la fiche.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            created_by
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Auteur de la fiche.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            updated_at
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Date de la dernière mise à jour.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            updated_by
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Auteur de la dernière mise à jour.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            app
                                        </code>
                                        <div className="text-gray-700 text-sm leading-relaxed">
                                            <p className="mb-2">
                                                (Objet optionnel) Détails de l'application (principale) - sinon, il faut créer une nouvelle fiche :
                                            </p>
                                            <code className="bg-gray-50 px-2 py-1 rounded text-xs block">
                                                {"{ \"name\": \"...\", \"link\": \"...\" }"}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="my-12 border-gray-300" />

                    <section className="mb-12">
                        <h2 className="text-3xl font-semibold mb-6">2. Modifier une fiche existante</h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4">1. Rendez-vous sur le dépôt sur GitHub</h3>
                                <p className="mb-4">
                                    Ouvrez le dépôt puis sélectionnez la branche <code className="bg-gray-100 px-2 py-1 rounded">update-contributing</code>
                                    grâce au sélecteur de branches.
                                </p>
                                <div className="bg-white border rounded-lg p-4 inline-block">
                                    <Image
                                        src={githubBranches}
                                        alt="Branches GitHub"
                                        className="rounded"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">2. Naviguez dans le dossier des fiches</h3>
                                <p className="mb-4">
                                    Rendez-vous dans <code className="bg-gray-100 px-2 py-1 rounded">public/data/manual/</code>.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">3. Trouvez et sélectionnez le fichier</h3>
                                <p className="mb-4">
                                    Cliquez sur le fichier JSON à modifier (par exemple, <code className="bg-gray-100 px-2 py-1 rounded">amazon.json</code>).
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">4. Modifiez le fichier</h3>
                                <p className="mb-4">
                                    Cliquez sur l'icône crayon (✏️) ("Modifier ce fichier").
                                </p>
                                <div className="bg-white border rounded-lg p-4 inline-block">
                                    <Image
                                        src={editFile}
                                        alt="Modifier le fichier"
                                        className="rounded"
                                    />

                                </div>
                                <p className="mt-4">
                                    Appliquez vos modifications en suivant les explications du tableau ci-dessus concernant les champs.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">5. Vérifiez les modifications</h3>
                                <p className="mb-4">
                                    Cliquez sur le bouton "Preview changes" pour consulter un aperçu de vos modifications.
                                </p>
                                <div className="bg-white border rounded-lg p-4 inline-block">
                                    <Image
                                        src={previewUpdate}
                                        alt="Preview des modifications"
                                        className="rounded"
                                    />

                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">6. Enregistrez les modifications (commit)</h3>
                                <ul className="list-disc pl-6 mb-4 space-y-2">
                                    <li>Appuyez sur le bouton "Commit changes".</li>
                                    <li>Ajoutez un message de commit bref et descriptif (ex. : "Mise à jour de l'email de contact Amazon").</li>
                                    <li>Vérifiez que "Valider directement sur la branche update-contributing" est sélectionné.</li>
                                    <li>Cliquez sur "Commit changes".</li>
                                </ul>
                                <div className="bg-white border rounded-lg p-4 inline-block">
                                    <Image
                                        src={updateFile}
                                        alt="Sauvegarder le fichier"
                                        className="rounded"
                                    />

                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="my-12 border-gray-300" />

                    <section className="mb-12">
                        <h2 className="text-3xl font-semibold mb-6">3. Ajouter une nouvelle fiche entreprise</h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4">1. Rendez-vous dans le dossier <code className="bg-gray-100 px-2 py-1 rounded">public/data/manual/</code></h3>
                                <p className="mb-4">
                                    A retrouver sur la branche <code className="bg-gray-100 px-2 py-1 rounded">update-contributing</code>.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">2. Créez un nouveau fichier</h3>
                                <ul className="list-disc pl-6 mb-4 space-y-2">
                                    <li>Cliquez sur le bouton "Add file" &rsaquo; "Create new file".</li>
                                    <li>Nommez votre fichier <code className="bg-gray-100 px-2 py-1 rounded">[nomentreprise].json</code> (tout en minuscules, ex. : <code className="bg-gray-100 px-2 py-1 rounded">newcompany.json</code>).</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">3. Utilisez le modèle de fiche</h3>
                                <p className="mb-4">
                                    Copiez-collez ce modèle dans votre nouveau fichier et remplissez les champs :
                                </p>

                                <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`{
  "name": "",
  "logo": "",
  "nationality": "",
  "country_name": "",
  "country_code": "",
  "belongs_to_group": false,
  "group_name": "",
  "permissions": "",
  "contact_mail_export": "",
  "easy_access_data": "",
  "need_id_card": false,
  "details_required_documents": "",
  "data_access_via_postal": false,
  "data_access_via_form": false,
  "data_access_type": "",
  "data_access_via_email": false,
  "response_format": "",
  "example_data_export": [],
  "example_form_export": [],
  "message_exchange": [],
  "address_export": "",
  "response_delay": "",
  "sanctioned_by_cnil": false,
  "sanction_details": "",
  "data_transfer_policy": false,
  "privacy_policy_quote": "",
  "transfer_destination_countries": "",
  "outside_eu_storage": "",
  "comments": "",
  "tosdr": "",
  "exodus": "",
  "created_at": "",
  "created_by": "",
  "updated_at": "",
  "updated_by": "",
  "app": {
    "name": "",
    "link": ""
  }
}`}
                  </pre>
                                </div>
                                <p className="mt-4">
                                    Remplissez chaque champ aussi complètement que possible.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">4. Validez le nouveau fichier (commit)</h3>
                                <p className="mb-4">
                                    Comme précédemment, ajoutez un message de commit descriptif et validez directement sur la branche
                                    <code className="bg-gray-100 px-2 py-1 rounded">update-contributing</code>.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">5. Mettez à jour le fichier <code className="bg-gray-100 px-2 py-1 rounded">slugs.json</code></h3>
                                <ul className="list-disc pl-6 mb-4 space-y-2">
                                    <li>Rendez-vous dans <code className="bg-gray-100 px-2 py-1 rounded">public/data/manual/slugs.json</code>.</li>
                                    <li>Ajoutez le slug (nom du fichier sans <code className="bg-gray-100 px-2 py-1 rounded">.json</code>) de votre nouvelle entreprise à la liste ou à l'objet, selon le format.</li>
                                    <li>Validez votre modification.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <hr className="my-12 border-gray-300" />

                    <section className="mb-12">
                        <h2 className="text-3xl font-semibold mb-6">4. Étapes finales</h2>
                        <ul className="list-disc pl-6 mb-6 space-y-3">
                            <li>Une fois vos modifications effectuées, vous pouvez créer une Pull Request de la branche <code className="bg-gray-100 px-2 py-1 rounded">update-contributing</code> vers la branche principale (main).</li>
                            <li>Rédigez un résumé indiquant ce que vous avez mis à jour ou ajouté, pour faciliter la revue.</li>
                        </ul>

                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-8 rounded-lg">
                            <h3 className="text-2xl font-bold mb-4 text-green-800">🙏 Merci pour votre contribution !</h3>
                            <p className="text-lg text-green-700">
                                Votre aide est précieuse pour aider la communauté à reprendre le contrôle de ses données personnelles.
                                Chaque fiche ajoutée ou mise à jour contribue à un Internet plus transparent et respectueux de la vie privée.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}