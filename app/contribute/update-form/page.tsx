"use client";
import { Suspense } from "react";
import ServiceForm from "@/components/ServiceForm";

function UpdateFormContent() {
    return <ServiceForm lang="en" mode="update" />;
}

export default function UpdateForm() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-base-200 py-12 flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>}>
            <UpdateFormContent />
        </Suspense>
    );
}
