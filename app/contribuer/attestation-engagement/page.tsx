import { Suspense } from "react";
import EngagementCertificateTool from "@/components/contributors/EngagementCertificateTool";

export default function AttestationEngagementPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <EngagementCertificateTool lang="fr" />
        </Suspense>
    );
}
