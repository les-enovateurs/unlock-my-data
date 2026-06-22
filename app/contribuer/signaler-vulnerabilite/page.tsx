"use client";
import React, { Suspense } from "react";
import VulnerabilityForm from "@/components/VulnerabilityForm";

export default function SignalerVulnPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <VulnerabilityForm lang="fr" />
        </Suspense>
    );
}

