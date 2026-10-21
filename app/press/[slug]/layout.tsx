import { PRESS_RELEASES } from "@/data/pressReleases";
import { pressReleaseMetadata } from "@/lib/metadata";

export async function generateStaticParams() {
    return PRESS_RELEASES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    return pressReleaseMetadata("en", (await params).slug);
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
