import { Suspense } from "react";
import EngagementCertificateTool from "@/components/contributors/EngagementCertificateTool";

export default function EngagementCertificatePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <EngagementCertificateTool lang="en" />
        </Suspense>
    );
}
