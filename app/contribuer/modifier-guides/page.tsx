"use client";
import { Suspense } from "react";
import GuidesForm from "@/components/GuidesForm";

function ModifierGuidesContent() {
    return <GuidesForm lang="fr" />;
}

export default function ModifierGuides() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement…</div>}>
            <ModifierGuidesContent />
        </Suspense>
    );
}
