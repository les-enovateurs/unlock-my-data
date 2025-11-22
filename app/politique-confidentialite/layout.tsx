import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Unlock My Data",
  description:
    "Politique de confidentialité d'Unlock My Data : types de données collectées, finalités, mesures de protection et moyens de contact pour toute question relative à vos données.",
};

export default function PolitiqueConfidentialiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

