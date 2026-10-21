import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page introuvable / Page not found - Unlock My Data",
};

// Static export emits a single 404.html, so both languages are shown at once.
const T = [
    {
        lang: "fr",
        title: "Page introuvable",
        lead: "Cette page n'existe pas ou a été déplacée.",
        home: "Retour à l'accueil",
        href: "/",
    },
    {
        lang: "en",
        title: "Page not found",
        lead: "This page does not exist or has been moved.",
        home: "Back to home",
        href: "/en",
    },
];

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 py-24 flex-1 flex flex-col items-center justify-center text-center gap-12">
            <span className="umd-pill umd-pill-indigo">404</span>
            {T.map(({ lang, title, lead, home, href }) => (
                <section key={lang} lang={lang} className="max-w-xl">
                    <h1 className="umd-heading-1 mb-3">{title}</h1>
                    <p className="umd-lead mb-6">{lead}</p>
                    <Link href={href} className="umd-btn umd-btn-primary">{home}</Link>
                </section>
            ))}
        </div>
    );
}
