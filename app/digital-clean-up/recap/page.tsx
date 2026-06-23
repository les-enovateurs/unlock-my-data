"use client";

import { useCleanUpContext } from "@/context/CleanUpContext";
import CleanUpRecap from "@/components/digital-clean-up/CleanUpRecap";
import CleanUpStepper from "@/components/digital-clean-up/CleanUpStepper";
import { useRouter } from "next/navigation";

export default function CleanUpRecapPage() {
    const router = useRouter();
    const { savedVolumes, getOrderedSuites, setSelectedServiceIds, setUsedVolumes, setSavedVolumes } = useCleanUpContext();
    const orderedSuites = getOrderedSuites();

    const handleRestartProcess = () => {
        setSelectedServiceIds([]);
        setUsedVolumes({});
        setSavedVolumes({});

        localStorage.removeItem("digitalCleanUp_selected");
        localStorage.removeItem("digitalCleanUp_usedVolumes");
        localStorage.removeItem("digitalCleanUp_savedVolumes");

        router.push("/digital-clean-up");
    };

    return (
        <div className="min-h-screen bg-umd-slate-50">
            <div className="max-w-[860px] mx-auto px-6 pt-8 pb-16">
                <CleanUpStepper current="recap" lang="fr" />
                <CleanUpRecap
                    lang="fr"
                    savedVolumes={savedVolumes}
                    serviceGroups={orderedSuites.map((suite) => ({
                        id: suite.id,
                        name: suite.name,
                        logo: suite.logo,
                        children: suite.children.map((child) => ({
                            slug: child.slug,
                            name: child.name,
                        })),
                    }))}
                    onBackHome={handleRestartProcess}
                />
            </div>
        </div>
    );
}
