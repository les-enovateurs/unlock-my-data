import SupprimerMesDonnees from "@/components/SupprimerMesDonnees";
import services from '../../../public/data/services.json';
import { localizedMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return services.map((service) => ({
        slug: service.slug,
    }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const name = services.find((service) => service.slug === slug)?.name ?? slug;
    return localizedMetadata({
        lang: "fr",
        title: `Supprimer mes données ${name} | Unlock My Data`,
        description: `Demandez à ${name} l'effacement de vos données personnelles (RGPD, article 17) : e-mail pré-rédigé, envoyé depuis votre propre messagerie.`,
        paths: { fr: `/supprimer-mes-donnees/${slug}`, en: `/delete-my-data/${slug}` },
    });
}

export default async function Page({ params }: Props) {
    const { slug } = await params;

    // Filter out invalid slugs (source maps, etc.) - dev server artifact
    if (slug.endsWith('.map') || slug.endsWith('.js')) {
        return null;
    }

    return <SupprimerMesDonnees preselectedSlug={slug} />;
}
