"use client";

import { useCleanUpContext } from "@/context/CleanUpContext";
import CleanUpRecap from "@/components/digital-clean-up/CleanUpRecap";

export default function CleanUpRecapPage() {
    const { savedVolumes } = useCleanUpContext();

    return (
        <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-base-100 rounded-2xl shadow-sm p-6 sm:p-8">
                    <CleanUpRecap
                        lang="fr"
                        savedVolumes={savedVolumes}
                        onBackHome={() => window.location.href = "/"}
                    />
                </div>
            </div>
        </div>
    );
}
