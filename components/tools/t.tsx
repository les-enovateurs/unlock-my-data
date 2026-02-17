export default class Translator {
    dict: { [lang: string]: { [key: string]: string } };
    activeLocale: string;

    constructor(dict: { [lang: string]: { [key: string]: string } }, activeLocale: string = 'fr') {
        this.dict = dict;
        this.activeLocale = activeLocale;
    }

    t(key: string) {
        return this.dict[this.activeLocale]?.[key] || this.dict["fr"]?.[key] || key;
    }
}