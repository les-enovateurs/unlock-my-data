import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "How to contribute to Unlock My Data | Add or update a service profile",
  description:
    "Step-by-step guide to contributing to the Unlock My Data platform: understand the JSON fields of a service profile, edit an existing profile, create a new profile, and submit your changes on GitHub.",
};

export default function ContribuerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

