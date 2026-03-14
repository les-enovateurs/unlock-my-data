"use client";
import { useLanguage } from "@/context/LanguageContext";
import HomePageContent from "@/components/HomePageContent";

export default function Home() {
    const { setLang } = useLanguage();
    setLang("fr");
    return <HomePageContent lang="fr" />;
}
