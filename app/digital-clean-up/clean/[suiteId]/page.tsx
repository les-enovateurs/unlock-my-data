import CleanUpCleanClient from "@/components/digital-clean-up/CleanUpCleanClient";
import servicesData from "../../../../public/data/services.json";
import { DIGITAL_CLEAN_UP_SUITES } from "@/constants/digitalCleanUp";

export async function generateStaticParams() {
    const suiteIds = DIGITAL_CLEAN_UP_SUITES.map(s => ({ suiteId: s.id }));
    const serviceSlugs = (servicesData as { slug: string }[]).map(s => ({ suiteId: s.slug }));

    const map = new Map<string, any>();
    [...suiteIds, ...serviceSlugs].forEach(p => map.set(p.suiteId, p));

    return Array.from(map.values());
}

export default function CleanPage({ params }: { params: { suiteId: string } }) {
    return <CleanUpCleanClient params={params} />;
}
