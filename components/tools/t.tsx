export default class Translator {
    dict: { [lang: string]: { [key: string]: string } };
    activeLocale: string;

    constructor(dict: { [lang: string]: { [key: string]: string } }, activeLocale: string = 'fr') {
        this.dict = dict;
        this.activeLocale = activeLocale;
    }

    t(key: string) {
        const localized = this.resolveKey(this.dict[this.activeLocale], key);
        if (localized !== undefined) return localized;

        const fallback = this.resolveKey(this.dict["fr"], key);
        return fallback !== undefined ? fallback : key;
    }

    private resolveKey(dict: { [key: string]: any } | undefined, key: string) {
        if (!dict) return undefined;
        if (key in dict) return dict[key];

        if (!key.includes(".")) return undefined;

        return key.split(".").reduce((value: any, segment: string) => {
            if (value && typeof value === "object" && segment in value) {
                return value[segment];
            }
            return undefined;
        }, dict);
    }
}