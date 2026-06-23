"use client";
import React, { Suspense } from "react";
import LeakForm from "@/components/LeakForm";

export default function SignalerFuitePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LeakForm lang="en" />
        </Suspense>
    );
}

