"use client";

import { ProtectDataProvider } from "@/context/ProtectDataContext";
import type { Lang } from "@/context/LanguageContext";
import { useParams } from "next/navigation";

export default function ProtectDataRouteProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  return (
    <ProtectDataProvider lang={lang} preselectedSlug={slug}>
      {children}
    </ProtectDataProvider>
  );
}
