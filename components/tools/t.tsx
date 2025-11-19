export default class Translator {
    dict_fr: { [key: string]: string };
    dict_en: { [key: string]: string };
    activeLocale:string;

    constructor(dict_fr:{ [key: string]: string }, dict_en:{ [key: string]: string }, activeLocale:string='fr') {

        this.dict_en = dict_en;
        this.dict_fr = dict_fr;
        this.activeLocale = activeLocale;
    }

    t(key:string) {
        return (this.activeLocale == 'fr') ? this.dict_fr[key] : this.dict_en[key];
    }
}