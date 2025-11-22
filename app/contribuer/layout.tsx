import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Comment contribuer à Unlock My Data | Guide pour ajouter ou mettre à jour une fiche",
  description:
    "Tutoriel détaillé pour contribuer à la plateforme Unlock My Data : comprendre la structure des fiches entreprise, modifier un fichier JSON, ajouter une nouvelle fiche et proposer vos changements via GitHub.",
};

export default function ContribuerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

