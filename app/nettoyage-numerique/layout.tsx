import type { Metadata } from "next";
import { CleanUpProvider } from "@/context/CleanUpContext";
import dict from "@/i18n/DigitalCleanUp.json";

export const metadata: Metadata = {
    title: `${dict.fr.title} | Unlock My Data`,
    description: dict.fr.description,
};

export default function DigitalCleanUpLayoutFr({ children }: { children: React.ReactNode }) {
    return <CleanUpProvider lang="fr">{children}</CleanUpProvider>;
}
