"use client";
import { Suspense } from "react";
import ServiceForm from "@/components/ServiceForm";

function NouvelleFicheContent() {
    return <ServiceForm lang="fr" mode="new" />;
}

export default function NouvelleFiche() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-base-200 py-12 flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>}>
            <NouvelleFicheContent />
        </Suspense>
    );
}
