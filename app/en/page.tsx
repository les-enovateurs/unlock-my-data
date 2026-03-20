"use client";
import { useLanguage } from "@/context/LanguageContext";
import HomePageContent from "@/components/HomePageContent";

export default function HomeEn() {
  const { setLang } = useLanguage();
  setLang("en");
  return <HomePageContent lang="en" />;
}