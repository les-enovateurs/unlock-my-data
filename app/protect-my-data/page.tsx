"use client";
import ProtectMyData from "@/components/ProtectMyData";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";

export default function ProtectMyDataPage() {
  const { setLang } = useLanguage();

  useEffect(() => {
    setLang('en');
  }, [setLang]);

  return <ProtectMyData lang="en" />;
}
