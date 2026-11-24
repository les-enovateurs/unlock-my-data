import servicesData from "@/public/data/services.json";
import Manual from "@/components/company/manual";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, ficheMetadata, serviceName } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return servicesData.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
    return ficheMetadata("en", (await params).slug);
}

export default async function FichePage({ params }: Props) {
    const { slug } = await params;
    return (
        <>
            <JsonLd data={breadcrumbJsonLd([
                ["Home", "/en/"],
                ["App directory", "/list-app/"],
                [serviceName(slug), `/list-app/${slug}/`],
            ])} />
            <Manual slug={slug} lang="en" />
        </>
    );
}
