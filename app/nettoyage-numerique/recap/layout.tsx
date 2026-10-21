import type { Metadata } from "next";
import dict from "@/i18n/DigitalCleanUp.json";

export const metadata: Metadata = {
    title: `${dict.fr.recapMetaTitle} | Unlock My Data`,
    description: dict.fr.recapMetaDescription,
};

export default function CleanUpRecapLayoutFr({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
