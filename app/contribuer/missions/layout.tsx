import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Missions | Applications prioritaires à analyser | Unlock My Data",
  description:
    "Découvrez les applications les plus téléchargées sur le Play Store qui nécessitent une analyse RGPD. Contribuez à la protection des données en analysant une application prioritaire.",
};

export default function MissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
