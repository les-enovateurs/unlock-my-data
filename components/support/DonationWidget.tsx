"use client";

import { useState } from "react";
import Script from "next/script";
import { HandCoins } from "lucide-react";

const HOSTED_FORM_URL = "https://donorbox.org/les-enovateurs";

const T = {
    fr: {
        load: "Afficher le formulaire de don",
        loadNote: "Le formulaire est fourni par Donorbox, qui charge ses propres scripts de paiement (Stripe, PayPal). Il ne s'affiche que si vous le demandez.",
        fallback: "Le formulaire ne s'affiche pas ?",
        fallbackLink: "Faites votre don sur la page sécurisée Donorbox",
        failed: "Le formulaire de don n'a pas pu être chargé (bloqueur de publicité, réseau…). Utilisez le lien ci-dessus.",
    },
    en: {
        load: "Show the donation form",
        loadNote: "The form is provided by Donorbox, which loads its own payment scripts (Stripe, PayPal). It only appears if you ask for it.",
        fallback: "Form not showing?",
        fallbackLink: "Donate on the secure Donorbox page",
        failed: "The donation form could not load (ad blocker, network…). Use the link above.",
    },
};

// Same widget as les-enovateurs.com/dons, but loaded on click only: Donorbox pulls
// third-party scripts (incl. fingerprinting) that a privacy site must not load unasked.
export default function DonationWidget({ lang }: { lang: string }) {
    const t = T[lang === "en" ? "en" : "fr"];
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    return (
        <div className="mt-8">
            {loaded ? (
                <div className="flex min-h-[600px] justify-center">
                    <dbox-widget campaign="les-enovateurs" type="donation_form" interval="1 M" enable-auto-scroll="true" />
                </div>
            ) : (
                <>
                    <button type="button" className="umd-btn umd-btn-primary umd-btn-lg" onClick={() => setLoaded(true)}>
                        <HandCoins className="h-5 w-5" aria-hidden="true" />{t.load}
                    </button>
                    <p className="mx-auto m-0 mt-3 max-w-xl text-sm text-umd-slate-600">{t.loadNote}</p>
                </>
            )}

            <p className="m-0 mt-4 text-sm text-umd-slate-600">
                {t.fallback}{" "}
                <a href={HOSTED_FORM_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                    {t.fallbackLink}
                </a>
            </p>

            {failed && <p role="alert" className="m-0 mt-2 text-sm text-umd-red-700">{t.failed}</p>}

            {loaded && (
                <Script src="https://donorbox.org/widgets.js" type="module" strategy="afterInteractive" onError={() => setFailed(true)} />
            )}
        </div>
    );
}
