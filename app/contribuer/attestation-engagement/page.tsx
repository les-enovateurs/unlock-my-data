import { Suspense } from "react";
import EngagementCertificateTool from "@/components/contributors/EngagementCertificateTool";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
    lang: "fr",
    title: "Attestation d'engagement bénévole | Unlock My Data",
    description: "Générez une attestation de vos contributions bénévoles à Unlock My Data.",
    paths: { fr: "/contribuer/attestation-engagement", en: "/contribute/engagement-certificate" },
});

export default function AttestationEngagementPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <EngagementCertificateTool lang="fr" />
        </Suspense>
    );
}
