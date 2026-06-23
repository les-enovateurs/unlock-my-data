"use client";

import { Suspense } from "react";
import ComparatifComponent from "@/components/ComparatifComponent";

function ComparerPageContent() {
    return <ComparatifComponent locale="fr" />;
}

export default function ComparerPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center text-umd-slate-400">Chargement…</div>
        }>
            <ComparerPageContent />
        </Suspense>
    );
}
