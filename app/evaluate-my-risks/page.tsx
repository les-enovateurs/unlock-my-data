"use client";
import DigitalFootprint from "@/components/DigitalFootprint";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";

export default function EvaluateMyRisksPage() {
  const { setLang } = useLanguage();

  useEffect(() => {
    setLang('en');
  }, [setLang]);

  return <DigitalFootprint lang="en" />;
}
