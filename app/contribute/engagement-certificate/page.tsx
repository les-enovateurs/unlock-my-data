import { Suspense } from "react";
import EngagementCertificateTool from "@/components/contributors/EngagementCertificateTool";
import { localizedMetadata } from "@/lib/metadata";

export const metadata = localizedMetadata({
    lang: "en",
    title: "Volunteer engagement certificate | Unlock My Data",
    description: "Generate a certificate of your volunteer contributions to Unlock My Data.",
    paths: { fr: "/contribuer/attestation-engagement", en: "/contribute/engagement-certificate" },
});

export default function EngagementCertificatePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <EngagementCertificateTool lang="en" />
        </Suspense>
    );
}
