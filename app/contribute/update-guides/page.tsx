"use client";
import { Suspense } from "react";
import GuidesForm from "@/components/GuidesForm";

function UpdateGuidesContent() {
    return <GuidesForm lang="en" />;
}

export default function UpdateGuides() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] py-12 flex items-center justify-center"><span className="loading loading-spinner loading-lg text-[#0F172A]"></span></div>}>
            <UpdateGuidesContent />
        </Suspense>
    );
}
