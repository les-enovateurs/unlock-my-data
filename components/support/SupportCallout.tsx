import Link from "next/link";
import { Heart } from "lucide-react";

const T = {
    fr: {
        title: "Cet outil vous a été utile ?",
        text: "Unlock My Data est gratuit, sans publicité ni pisteur, et tenu par une association. Un don, même petit, nous aide à continuer : 66 % est déductible de vos impôts.",
        cta: "Soutenir l'association",
        href: "/soutenir",
    },
    en: {
        title: "Was this tool useful?",
        text: "Unlock My Data is free, ad-free and tracker-free, run by a non-profit. Even a small donation helps us keep going (66% tax-deductible in France).",
        cta: "Support the association",
        href: "/support",
    },
};

export default function SupportCallout({ lang, className = "" }: { lang: string; className?: string }) {
    const t = T[lang === "en" ? "en" : "fr"];
    return (
        <aside className={`umd-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${className}`} aria-label={t.title}>
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-umd-gold-100 text-[#7a5a00]">
                <Heart className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
                <p className="m-0 font-display text-base font-bold text-umd-slate-900">{t.title}</p>
                <p className="m-0 mt-1 text-sm leading-relaxed text-umd-slate-600">{t.text}</p>
            </div>
            <Link href={t.href} className="umd-btn umd-btn-primary umd-btn-sm flex-shrink-0">
                {t.cta}
            </Link>
        </aside>
    );
}
