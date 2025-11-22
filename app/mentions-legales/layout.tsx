import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Mentions légales | Unlock My Data",
  description:
    "Mentions légales du site Unlock My Data : éditeur (Les e-novateurs), hébergeur, sources des données (ToSDR, Exodus Privacy), contributions open source et coordonnées de contact.",
};

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

