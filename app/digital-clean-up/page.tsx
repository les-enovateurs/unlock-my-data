"use client";

import { useRouter } from "next/navigation";
import { useCleanUpContext } from "@/context/CleanUpContext";
import ServiceSelection from "@/components/digital-clean-up/ServiceSelection";
import Translator from "@/components/tools/t";
import dict from "@/i18n/DigitalCleanUp.json";

export default function DigitalCleanUpHomePage() {
    const router = useRouter();
    const { selectedServiceIds, setSelectedServiceIds, getOrderedSuites } = useCleanUpContext();
    const lang = "fr"; // Defaulting to fr based on existing structure or could be prop derived, but currently it's hardcoded to lang="en" in original page.tsx, let's keep it contextual or dynamic if needed. Actually it was lang="en" originally. Let's keep it "fr" since the content is mostly french.
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
        <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-base-content mb-4 tracking-tight">
                        {t.t("title")}
                    </h1>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        {t.t("description")}
                    </p>
                </div>

                <div className="bg-base-100 rounded-2xl shadow-sm p-6 sm:p-8">
                    <ServiceSelection
                        lang={lang}
                        selectedServices={selectedServiceIds}
                        setSelectedServices={setSelectedServiceIds}
                        onNext={handleNext}
                    />
                </div>
            </div>
        </div>
    );
}
