"use client";

import { Suspense } from "react";
import ComparatifComponent from "@/components/ComparatifComponent";

function ComparerPageContent() {
    return <ComparatifComponent locale="fr" />;
}

export default function ComparerPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                </div>
            </div>
        }>
            <ComparerPageContent />
        </Suspense>
    );
}
