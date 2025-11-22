import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Unlock My Data - take back control of your personal data",
    description:
        "Every day, thousands of pieces of personal data are collected by companies. Find out what they know about you and how to clean things up.",
    publisher: "Les e-novateurs",
    openGraph: {
        title: "Unlock My Data - take back control of your personal data",
        description:
            "Every day, thousands of pieces of personal data are collected by companies. Find out what they know about you and how to clean things up.",
        url: "https://unlock-my-data.com",
        siteName: "Unlock My Data",
        images: [
            {
                url: "https://unlock-my-data.com/og-image.png",
                alt: "Unlock My Data - take back control of your personal data",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Unlock My Data - take back control of your personal data",
        description:
            "Every day, thousands of pieces of personal data are collected by companies. Find out what they know about you and how to clean things up.",
        images: ["https://unlock-my-data.com/og-image.png"],
        creator: "@les-enovateurs",
    },
};

export default function EnglishLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return children;
}