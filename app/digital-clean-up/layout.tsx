import type { Metadata } from "next";
import { CleanUpProvider } from "@/context/CleanUpContext";
import dict from "@/i18n/DigitalCleanUp.json";

export const metadata: Metadata = {
    title: `${dict.en.title} | Unlock My Data`,
    description: dict.en.description,
};

export default function DigitalCleanUpLayout({ children }: { children: React.ReactNode }) {
    return <CleanUpProvider lang="en">{children}</CleanUpProvider>;
}
