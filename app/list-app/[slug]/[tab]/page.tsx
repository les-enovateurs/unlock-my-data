import Manual, { ficheTabMetadata, ficheTabStaticParams } from "@/components/company/manual";
import type { FicheTabId } from "@/components/company/ficheTabs";

type Props = { params: Promise<{ slug: string; tab: Exclude<FicheTabId, "ess"> }> };

export async function generateStaticParams({ params }: { params: { slug: string } }) {
    return ficheTabStaticParams(params.slug);
}

export async function generateMetadata({ params }: Props) {
    const { slug, tab } = await params;
    return ficheTabMetadata(slug, tab, "en");
}

export default async function FicheTabPage({ params }: Props) {
    const { slug, tab } = await params;
    return <Manual slug={slug} lang="en" tab={tab} />;
}
