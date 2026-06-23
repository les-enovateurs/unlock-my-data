import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Data transfer map - Unlock My Data",
    description: "See where your personal data travels around the world and migrate to European alternatives.",
};

export default function TransfersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
