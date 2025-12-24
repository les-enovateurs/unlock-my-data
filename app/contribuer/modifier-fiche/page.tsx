"use client";
import { Suspense } from "react";
import ServiceForm from "@/components/ServiceForm";

function ModifierFicheContent() {
    return <ServiceForm lang="fr" mode="update" />;
}

export default function ModifierFiche() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-base-200 py-12 flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>}>
            <ModifierFicheContent />
        </Suspense>
    );
}
