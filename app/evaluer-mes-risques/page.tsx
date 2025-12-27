"use client";
import DigitalFootprint from "@/components/DigitalFootprint";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";

export default function EvaluerMesRisquesPage() {
  const { setLang } = useLanguage();

  useEffect(() => {
    setLang('fr');
  }, [setLang]);

  return <DigitalFootprint lang="fr" />;
}
