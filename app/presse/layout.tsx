import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Espace presse - Unlock My Data",
    description: "Chiffres clés, communiqués, logos et visuels téléchargeables pour parler de la plateforme citoyenne Unlock My Data.",
};

export default function PresseLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
