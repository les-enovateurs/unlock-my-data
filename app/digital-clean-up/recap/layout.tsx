import type { Metadata } from "next";
import dict from "@/i18n/DigitalCleanUp.json";

export const metadata: Metadata = {
    title: `${dict.en.recapMetaTitle} | Unlock My Data`,
    description: dict.en.recapMetaDescription,
};

export default function CleanUpRecapLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
