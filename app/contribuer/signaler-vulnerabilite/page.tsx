"use client";
import React, { Suspense } from "react";
import VulnerabilityForm from "@/components/VulnerabilityForm";

export default function SignalerVulnPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
           <div className="bg-gradient-to-br from-base-100 via-base-200 to-primary/10">
               <div className="container mx-auto py-12">
                    <VulnerabilityForm lang="fr" />
               </div>
            </div>
        </Suspense>
    );
}

