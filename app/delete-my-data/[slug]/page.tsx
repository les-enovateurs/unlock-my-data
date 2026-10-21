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
        lang: "en",
        title: `Delete my ${name} data | Unlock My Data`,
        description: `Ask ${name} to erase your personal data (GDPR, article 17): a pre-written email, sent from your own mailbox.`,
        paths: { fr: `/supprimer-mes-donnees/${slug}`, en: `/delete-my-data/${slug}` },
    });
}

export default async function Page({ params }: Props) {
    const { slug } = await params;

    // Filter out invalid slugs (source maps, etc.) - dev server artifact
    if (slug.endsWith('.map') || slug.endsWith('.js')) {
        return null;
    }

    return <SupprimerMesDonnees preselectedSlug={slug} locale={"en"} />;
}
