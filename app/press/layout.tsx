import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Press room - Unlock My Data",
    description: "Key figures, press releases, downloadable logos and visuals to write about the citizen platform Unlock My Data.",
};

export default function PressLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
