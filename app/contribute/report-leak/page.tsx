"use client";
import React, { Suspense } from "react";
import LeakForm from "@/components/LeakForm";

export default function SignalerFuitePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
           <div className="bg-gradient-to-br from-base-100 via-base-200 to-primary/10">
               <div className="container mx-auto py-12">
                    <LeakForm lang="en" />
               </div>
            </div>
        </Suspense>
    );
}

