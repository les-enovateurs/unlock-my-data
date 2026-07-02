import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Contributor guide | How to fill in a company entry on Unlock My Data",
    description:
        "Step-by-step guide to writing a company entry on Unlock My Data: where to find the legal information, name and group, access to data, CNIL sanctions, data transfers, alternatives and mobile application. Printable web version.",
};

export default function GuideLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
