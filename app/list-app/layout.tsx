import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Directory of referenced services | Unlock My Data",
  description:
    "Browse the Unlock My Data directory of online services to discover and compare how they handle your personal data: privacy score, permissions, trackers, country and more.",
};

export default function ListAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

