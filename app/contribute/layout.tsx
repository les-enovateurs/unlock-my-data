import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "How to contribute to Unlock My Data | Add or update a company sheet",
  description:
    "Step-by-step guide to contribute to the Unlock My Data platform: understand the company sheet JSON fields, edit an existing sheet, create a new sheet, and submit your changes on GitHub.",
};

export default function ContributeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

