"use client";

import { useParams } from "next/navigation";
import PressReleaseDetail from "@/components/PressReleaseDetail";

export default function Page() {
    const { slug } = useParams<{ slug: string }>();
    return <PressReleaseDetail slug={slug} lang="fr" />;
}
