import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Comparer la confidentialité des applications et services | Unlock My Data",
  description:
    "Créez un comparatif personnalisé de jusqu'à 3 applications ou services en ligne et analysez leurs permissions, trackers, export de données et points négatifs.",
};

export default function ComparerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

