import Translator from "@/components/tools/t";
import formDict from "@/i18n/ServiceForm.json";
import { ucfirst } from "@/lib/text";

/**
 * Resolve the human label of a service field, falling back to the base field
 * for the bilingual `_en` variants and to the raw field name when no
 * translation exists. Shared by the moderation page and the contributor form
 * so a field is named the same way on both sides of a review thread.
 */
export const createFieldLabeller = (lang: "fr" | "en") => {
    const formT = new Translator(formDict as any, lang);

    return (field: string): string => {
        let label = formT.t(`fieldLabels.${field}`);

        if ((!label || label.startsWith("fieldLabels.")) && field.endsWith("_en")) {
            label = formT.t(`fieldLabels.${field.slice(0, -3)}`);
        }

        const resolved = label && !label.startsWith("fieldLabels.") ? label : field;
        return ucfirst(resolved);
    };
};
