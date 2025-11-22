import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Compare privacy of apps and services | Unlock My Data",
  description:
    "Build custom comparisons of up to 3 apps or online services and analyze their permissions, trackers, data exports and negative privacy points.",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

