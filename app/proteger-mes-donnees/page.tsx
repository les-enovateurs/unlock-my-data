"use client";
import ProtectMyData from "@/components/ProtectMyData";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";

export default function ProtegerMesDonneesPage() {
  const { setLang } = useLanguage();

  useEffect(() => {
    setLang('fr');
  }, [setLang]);

  return <ProtectMyData lang="fr" />;
}
