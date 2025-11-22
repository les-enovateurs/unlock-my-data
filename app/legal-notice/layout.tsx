import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Legal notice | Unlock My Data",
  description:
    "Legal notice of the Unlock My Data website: publisher, hosting provider, data sources (ToSDR, Exodus Privacy), open‑source contributions and contact information.",
};

export default function LegalNoticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

