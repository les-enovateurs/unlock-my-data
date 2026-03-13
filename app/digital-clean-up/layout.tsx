import { CleanUpProvider } from "@/context/CleanUpContext";

export default function DigitalCleanUpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CleanUpProvider>
            {children}
        </CleanUpProvider>
    );
}
