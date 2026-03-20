"use client";

import { ProtectDataProvider } from "@/context/ProtectDataContext";
import { useParams } from "next/navigation";

export default function ProtectDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  return (
    <ProtectDataProvider lang="fr" preselectedSlug={slug}>
      {children}
    </ProtectDataProvider>
  );
}
