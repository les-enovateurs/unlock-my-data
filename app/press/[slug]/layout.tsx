import { PRESS_RELEASES } from "@/data/pressReleases";

export async function generateStaticParams() {
    return PRESS_RELEASES.map((r) => ({ slug: r.slug }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
