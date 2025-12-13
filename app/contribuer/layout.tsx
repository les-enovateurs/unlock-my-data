import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Comment contribuer à Unlock My Data | Ajouter ou mettre à jour une fiche d'entreprise",
  description:
    "Guide pas à pas pour contribuer à la plateforme Unlock My Data : comprendre les champs JSON d'une fiche d'entreprise, modifier une fiche existante, créer une nouvelle fiche et soumettre vos modifications sur GitHub.",
};

export default function ContribuerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

