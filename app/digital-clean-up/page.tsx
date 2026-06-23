"use client";

import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { useCleanUpContext } from "@/context/CleanUpContext";
import ServiceSelection from "@/components/digital-clean-up/ServiceSelection";
import CleanUpStepper from "@/components/digital-clean-up/CleanUpStepper";
import Translator from "@/components/tools/t";
import dict from "@/i18n/DigitalCleanUp.json";

export default function DigitalCleanUpHomePage() {
    const router = useRouter();
    const { selectedServiceIds, setSelectedServiceIds, getOrderedSuites } = useCleanUpContext();
    const lang = "fr";
    const t = new Translator(dict, lang);

    const handleNext = () => {
        const suites = getOrderedSuites();
        if (suites.length > 0) {
            router.push(`/digital-clean-up/audit/${suites[0].id}`);
        } else {
            alert("Veuillez sélectionner au moins un service.");
        }
    };

    return (
        <div className="min-h-screen bg-umd-slate-50">
            {/* HÉRO — pill + h-hero + lead, dégradé clair, accent vert */}
            <section className="bg-gradient-to-b from-umd-indigo-50 to-white border-b border-umd-slate-200">
                <div className="max-w-[1100px] mx-auto px-6 py-14 text-center">
                    <span className="umd-pill bg-umd-green-50 text-umd-green-700 border border-umd-green-200 mb-[18px]">
                        <Leaf className="w-[15px] h-[15px]" />
                        {t.t("heroPill")}
                    </span>
                    <h1 className="umd-h-hero max-w-[760px] mx-auto mb-4">{t.t("heroTitle")}</h1>
                    <p className="umd-lead-text max-w-[560px] mx-auto">{t.t("heroLead")}</p>
                </div>
            </section>

            <div className="max-w-[860px] mx-auto px-6 pt-8 pb-16">
                <CleanUpStepper current="select" lang={lang} />

                <ServiceSelection
                    lang={lang}
                    selectedServices={selectedServiceIds}
                    setSelectedServices={setSelectedServiceIds}
                    onNext={handleNext}
                />
            </div>
        </div>
    );
}
