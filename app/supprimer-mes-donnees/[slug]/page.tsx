import SupprimerMesDonnees from "@/components/SupprimerMesDonnees";
import services from '../../../public/data/services.json';

export async function generateStaticParams() {
    return services.map((service) => ({
        slug: service.slug,
    }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <SupprimerMesDonnees preselectedSlug={slug} />;
}
