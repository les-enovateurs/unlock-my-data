import { COUNTRIES, TRANSFER_EXTRA_CODES } from "@/lib/countries";

export type CountryOption = { value: string; label: string; label_en: string };

const toOptions = (rows: Record<string, { name_fr: string; name_en: string }>): CountryOption[] =>
    Object.entries(rows)
        .map(([value, c]) => ({ value, label: c.name_fr, label_en: c.name_en }))
        .sort((a, b) => a.label.localeCompare(b.label, "fr"));

const COUNTRY_OPTIONS = toOptions(COUNTRIES);

export const FORM_OPTIONS = {
    /** Seat of the company: `country_code`. */
    countries: COUNTRY_OPTIONS,
    /** `transfer_destination_countries`: countries, then regions and special answers. */
    transferDestinations: [...COUNTRY_OPTIONS, ...toOptions(TRANSFER_EXTRA_CODES)],

    responseFormats: [
        {value: "", label: "Sélectionner un format...", label_en: "Select a format..."},
        {value: "zip", label: "ZIP"},
        {value: "rar", label: "RAR"},
        {value: "html", label: "HTML"},
        {value: "excel", label: "Excel"},
        {value: "csv", label: "CSV"},
        {value: "word", label: "Word"},
        {value: "pdf", label: "PDF"},
        {value: "txt", label: "TXT"},
        {value: "Autre", label: "Autre", label_en: "Other"},
    ],

    requiredDocuments: [
        {value: "", label: "Sélectionner un document...", label_en: "Select a document..."},
        {value: "Aucun", label: "Aucun", label_en: "None"},
        {value: "Carte d'identité", label: "Carte d'identité", label_en: "ID card"},
        {value: "Passeport", label: "Passeport", label_en: "Passport"},
        {value: "Justificatif de domicile", label: "Justificatif de domicile", label_en: "Proof of address"},
        {value: "Autre", label: "Autre", label_en: "Other"},
    ],

    easyAccessLevels: [
        {value: 1, note: "1", explanation: "Carte d'identité + preuve d'identité par envoi postal (très restrictif)", explanation_en: "ID card + proof of identity sent by postal mail (very restrictive)"},
        {value: 2, note: "2", explanation: "Carte d'identité obligatoire, envoi numérique ou formulaire complexe", explanation_en: "ID card required, digital upload or complex form"},
        {value: 3, note: "3", explanation: "Preuve d'identité par email, procédure modérée", explanation_en: "Proof of identity by email, moderate procedure"},
        {value: 4, note: "4", explanation: "Export possible par email, procédure simple", explanation_en: "Export possible by email, simple procedure"},
        {value: 5, note: "5", explanation: "Export intégré dans le compte, accessible en un clic, clairement affiché", explanation_en: "Export integrated in the account, accessible in one click, clearly displayed"}
    ],

    responseDelays: [
        {value: "", label: "Sélectionner un délai...", label_en: "Select a delay..."},
        {value: "1 mois conformément au RGPD", label: "1 mois conformément au RGPD", label_en: "1 month according to GDPR"},
        {value: "Réponse automatique", label: "Réponse automatique", label_en: "Automatic response"},
        {value: "Plus d'un mois", label: "Plus d'un mois", label_en: "More than one month"},
        {value: "Autre", label: "Autre", label_en: "Other"}
    ]
};

// Fiches still carry "4", "4/5" or 0 (= not rated); the stored value is an integer 1-5 or null (#368).
export function toEasyAccess(value: unknown): number | null {
    const score = parseInt(String(value ?? ''), 10);
    return score >= 1 && score <= 5 ? score : null;
}
