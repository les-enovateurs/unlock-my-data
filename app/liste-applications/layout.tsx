import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Annuaire des services référencés | Unlock My Data",
  description:
    "Parcourez l'annuaire Unlock My Data des services en ligne pour découvrir et comparer leurs pratiques de confidentialité : score de confidentialité, permissions, trackers, pays et plus encore.",
};

export default function ListeApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

