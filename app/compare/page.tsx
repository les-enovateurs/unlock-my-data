"use client";

import { Suspense } from "react";
import ComparatifComponent from "@/components/ComparatifComponent";

function ComparePageContent() {
    return <ComparatifComponent locale="en" />;
}

export default function ComparePage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center text-umd-slate-400">Loading…</div>
        }>
            <ComparePageContent />
        </Suspense>
    );
}
