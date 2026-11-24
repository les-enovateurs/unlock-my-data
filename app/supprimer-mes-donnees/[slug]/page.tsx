import SupprimerMesDonnees from "@/components/SupprimerMesDonnees";
import DeleteGuideFaq from "@/components/DeleteGuideFaq";
import services from "@/public/data/services.json";
import { deleteGuideMetadata, serviceName } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
    return deleteGuideMetadata("fr", (await params).slug);
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    return (
        <>
            <SupprimerMesDonnees preselectedSlug={slug} />
            <DeleteGuideFaq lang="fr" name={serviceName(slug)} slug={slug} />
        </>
    );
}
