import type { Metadata } from "next";
import EmbedWidget from "@/components/EmbedWidget";
import { buildCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
    title: "Unlock My Data",
    robots: { index: false, follow: true },
};

export default function EmbedPage() {
    return <EmbedWidget services={buildCatalog()} />;
}
