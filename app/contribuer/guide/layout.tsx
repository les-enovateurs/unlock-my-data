import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Guide du contributeur | Comment remplir une fiche entreprise sur Unlock My Data",
    description:
        "Guide pas à pas pour rédiger une fiche entreprise sur Unlock My Data : où trouver les informations légales, nom et groupe, accès aux données, sanctions CNIL, transferts de données, alternatives et application mobile. Version web imprimable.",
};

export default function GuideLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
