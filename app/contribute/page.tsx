"use client"
import githubBranches from "../../doc/github-branches.webp";
import editFile from "../../doc/edit-file.webp";
import previewUpdate from "../../doc/preview-update.webp";
import updateFile from "../../doc/update-file.webp";

import Image from 'next/image';
import {useLanguage} from "@/context/LanguageContext";

export default function Contribuer() {
    const { setLang } = useLanguage();
    setLang('en')

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto">

                <h1 className="text-4xl font-bold mb-8">How to contribute to the Unlock My Data platform</h1>
                <h2 className="text-3xl font-bold mb-8">Add or update a company sheet</h2>

                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 mb-8 text-lg">
                        This guide explains how to add a new sheet or update an existing one
                        using GitHub\'s Web interface and the <code className="bg-gray-100 px-2 py-1 rounded text-sm">update-contributing</code> branch
                        (if you are a volunteer of the association and we have added you to the team). Otherwise, you must use the fork/pull request workflow.
                    </p>

                    <section className="mb-12">
                        <h2 className="text-3xl font-semibold mb-6">1. Understand the company sheet file</h2>
                        <div className="space-y-4 mb-8">
                            {/* Header */}
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                <h4 className="font-semibold text-blue-800 mb-2">JSON field structure</h4>
                                <p className="text-blue-700 text-sm">
                                    Here is the complete list of fields available in company sheet files:
                                </p>
                            </div>

                            {/* Fields list */}
                            <div className="grid gap-3 sm:gap-4">
                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            name
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Company name.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            logo
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            URL of the company logo.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            nationality
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Nationality of the company (e.g.: <code className="bg-gray-50 px-1 py-0.5 rounded text-xs">American</code>).
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            country_name
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Country where the company\'s headquarters is located.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            country_code
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            ISO country code (e.g.: <code className="bg-gray-50 px-1 py-0.5 rounded text-xs">us</code>).
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            belongs_to_group
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Boolean: does the company belong to a group?
                                            (<code className="bg-gray-50 px-1 py-0.5 rounded text-xs">true</code> or <code className="bg-gray-50 px-1 py-0.5 rounded text-xs">false</code>)
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            group_name
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Name of the parent group, if applicable.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            permissions
                                        </code>
                                        <div className="text-yellow-800 text-sm leading-relaxed">
                                            <span className="font-semibold">Access permissions to data requested or granted.</span>
                                            <br />
                                            <span className="text-xs">DO NOT UPDATE MANUALLY / EXISTING AUTOMATION SCRIPT</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            contact_mail_export
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Email address for data export requests.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            easy_access_data
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Information about any simplified access to data, if available.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            need_id_card
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Boolean: is an ID card required for requests?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            details_required_documents
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Details about the documents required to access the data.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            data_access_via_postal
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Boolean: is data access possible by postal mail?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            data_access_via_form
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Boolean: is data access possible via an online form?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            data_access_type
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Details about the type of data access (if not covered above).
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            data_access_via_email
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Boolean: is data access possible by email?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            response_format
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Response format (file, zip, PDF, etc.).
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            url_export
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            URL to request the export of your data.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            example_data_export
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Array of objects (see for example `carrefour.json`) listing items with url, type, description and date.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            example_form_export
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Array of objects (see for example `carrefour.json`) listing items with url, type, description and date.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            message_exchange
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Array of objects (see for example `carrefour.json`) listing items with url, type, description and date.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            address_export
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Physical address to request your data.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            response_delay
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Usual response time (e.g.: <code className="bg-gray-50 px-1 py-0.5 rounded text-xs">Instant</code>).
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            sanctioned_by_cnil
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Boolean: has the company been sanctioned by the CNIL?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            sanction_details
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Details and references to CNIL sanctions.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            data_transfer_policy
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Boolean: does the company have a data transfer policy?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            privacy_policy_quote
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Relevant quote from the privacy policy.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            transfer_destination_countries
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            List of countries to which data may be transferred.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            outside_eu_storage
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Are personal data stored outside the EU?
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            comments
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Additional comments.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            tosdr
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Local URL to access ToS;DR data.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            exodus
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Local URL to access Exodus data.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            created_at
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Date when the sheet was created.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            created_by
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Author of the sheet.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            updated_at
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Date of the last update.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono flex-shrink-0 sm:min-w-[120px]">
                                            updated_by
                                        </code>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Author of the last update.
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
                                                (Optional object) Details of the (main) app \- otherwise, a new sheet must be created:
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
                        <h2 className="text-3xl font-semibold mb-6">2. Edit an existing sheet</h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4">1. Go to the repository on GitHub</h3>
                                <p className="mb-4">
                                    Open the repository and then select the <code className="bg-gray-100 px-2 py-1 rounded">update-contributing</code> branch
                                    using the branch selector.
                                </p>
                                <div className="bg-white border rounded-lg p-4 inline-block">
                                    <Image
                                        src={githubBranches}
                                        alt="GitHub branches"
                                        className="rounded"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">2. Navigate to the sheets folder</h3>
                                <p className="mb-4">
                                    Go to <code className="bg-gray-100 px-2 py-1 rounded">public/data/manual/</code>.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">3. Find and select the file</h3>
                                <p className="mb-4">
                                    Click the JSON file to edit (for example, <code className="bg-gray-100 px-2 py-1 rounded">amazon.json</code>).
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">4. Edit the file</h3>
                                <p className="mb-4">
                                    Click the pencil icon (✏️) (\`Edit this file\`).
                                </p>
                                <div className="bg-white border rounded-lg p-4 inline-block">
                                    <Image
                                        src={editFile}
                                        alt="Edit file"
                                        className="rounded"
                                    />

                                </div>
                                <p className="mt-4">
                                    Apply your changes following the explanations in the table above for the fields.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">5. Check your changes</h3>
                                <p className="mb-4">
                                    Click the \`Preview changes\` button to review your modifications.
                                </p>
                                <div className="bg-white border rounded-lg p-4 inline-block">
                                    <Image
                                        src={previewUpdate}
                                        alt="Preview changes"
                                        className="rounded"
                                    />

                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">6. Save your changes (commit)</h3>
                                <ul className="list-disc pl-6 mb-4 space-y-2">
                                    <li>Click the \`Commit changes\` button.</li>
                                    <li>Add a short, descriptive commit message (e.g.: \`Update Amazon contact email\`).</li>
                                    <li>Check that \`Commit directly to the update-contributing branch\` is selected.</li>
                                    <li>Click \`Commit changes\`.</li>
                                </ul>
                                <div className="bg-white border rounded-lg p-4 inline-block">
                                    <Image
                                        src={updateFile}
                                        alt="Save file"
                                        className="rounded"
                                    />

                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="my-12 border-gray-300" />

                    <section className="mb-12">
                        <h2 className="text-3xl font-semibold mb-6">3. Add a new company sheet</h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4">1. Go to the <code className="bg-gray-100 px-2 py-1 rounded">public/data/manual/</code> folder</h3>
                                <p className="mb-4">
                                    You will find it on the <code className="bg-gray-100 px-2 py-1 rounded">update-contributing</code> branch.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">2. Create a new file</h3>
                                <ul className="list-disc pl-6 mb-4 space-y-2">
                                    <li>Click the \`Add file\` button &rsaquo; \`Create new file\`.</li>
                                    <li>Name your file <code className="bg-gray-100 px-2 py-1 rounded">[companyname].json</code> (all lowercase, e.g.: <code className="bg-gray-100 px-2 py-1 rounded">newcompany.json</code>).</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">3. Use the sheet template</h3>
                                <p className="mb-4">
                                    Copy and paste this template into your new file and fill in the fields:
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
                                    Fill in each field as completely as possible.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">4. Commit the new file</h3>
                                <p className="mb-4">
                                    As before, add a descriptive commit message and commit directly to the
                                    <code className="bg-gray-100 px-2 py-1 rounded">update-contributing</code> branch.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">5. Update the <code className="bg-gray-100 px-2 py-1 rounded">slugs.json</code> file</h3>
                                <ul className="list-disc pl-6 mb-4 space-y-2">
                                    <li>Go to <code className="bg-gray-100 px-2 py-1 rounded">public/data/manual/slugs.json</code>.</li>
                                    <li>Add the slug (file name without <code className="bg-gray-100 px-2 py-1 rounded">.json</code>) of your new company to the list or object, depending on the format.</li>
                                    <li>Commit your change.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <hr className="my-12 border-gray-300" />

                    <section className="mb-12">
                        <h2 className="text-3xl font-semibold mb-6">4. Final steps</h2>
                        <ul className="list-disc pl-6 mb-6 space-y-3">
                            <li>Once your changes are done, you can create a Pull Request from the <code className="bg-gray-100 px-2 py-1 rounded">update-contributing</code> branch to the main branch (`main`).</li>
                            <li>Write a short summary describing what you updated or added, to make the review easier.</li>
                        </ul>

                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-8 rounded-lg">
                            <h3 className="text-2xl font-bold mb-4 text-green-800">🙏 Thank you for your contribution!</h3>
                            <p className="text-lg text-green-700">
                                Your help is essential to help the community regain control over its personal data.
                                Each sheet added or updated contributes to a more transparent Internet that respects privacy.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
