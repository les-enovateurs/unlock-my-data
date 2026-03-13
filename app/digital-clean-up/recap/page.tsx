"use client";

import { useCleanUpContext } from "@/context/CleanUpContext";
import CleanUpRecap from "@/components/digital-clean-up/CleanUpRecap";
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
        <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-base-100 rounded-2xl shadow-sm p-6 sm:p-8">
                    <CleanUpRecap
                        lang="fr"
                        savedVolumes={savedVolumes}
                        serviceGroups={orderedSuites.map((suite) => ({
                            id: suite.id,
                            name: suite.name,
                            children: suite.children.map((child) => ({
                                slug: child.slug,
                                name: child.name,
                            })),
                        }))}
                        onBackHome={handleRestartProcess}
                    />
                </div>
            </div>
        </div>
    );
}
