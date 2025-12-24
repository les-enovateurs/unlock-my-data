import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Missions | Priority Apps to Analyze | Unlock My Data",
  description:
    "Discover the most downloaded apps on the Play Store that need GDPR analysis. Contribute to data protection by analyzing a priority application.",
};

export default function MissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
