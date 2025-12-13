import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tableau des Contributeurs - Unlock My Data",
    description: "Découvrez notre temple de la renommée des contributeurs qui améliorent Unlock My Data",
};

export default function ContributeursLayout({
                                                children,
                                            }: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

