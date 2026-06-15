import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cartographie des transferts - Unlock My Data",
    description: "Visualisez où voyagent vos données personnelles dans le monde et migrez vers des alternatives européennes.",
};

export default function TransfertsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
