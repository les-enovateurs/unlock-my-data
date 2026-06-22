"use client";
import { Suspense } from "react";
import GuidesForm from "@/components/GuidesForm";

function UpdateGuidesContent() {
    return <GuidesForm lang="en" />;
}

export default function UpdateGuides() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
            <UpdateGuidesContent />
        </Suspense>
    );
}
