import ProtectMyData from "@/components/ProtectMyData";
import services from '../../../public/data/services.json';

export async function generateStaticParams() {
    return services.map((service) => ({
        slug: service.slug,
    }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Filter out invalid slugs (source maps, etc.) - dev server artifact
    if (slug.endsWith('.map') || slug.endsWith('.js')) {
        return null;
    }

    return <ProtectMyData lang="fr" preselectedSlug={slug} />;
}
