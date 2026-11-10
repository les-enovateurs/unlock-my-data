"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import servicesData from "@/public/data/services.json";
import DataRadar from "@/components/DataRadar";
import type { Service } from "@/constants/protectData";
import type { LinkOptions } from "@/lib/map/transferLinks";

const BY_SLUG = new Map((servicesData as Service[]).map((s) => [s.slug, s]));

const T = {
    fr: { apps: "Applications", sources: "Pays trouvés dans", policy: "politique de confidentialité", trackers: "traceurs", full: "Voir la carte complète" },
    en: { apps: "Applications", sources: "Countries found in", policy: "privacy policy", trackers: "trackers", full: "See the full map" },
};

const chip = (on: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-3 text-xs cursor-pointer transition-colors ${
        on ? "border-umd-indigo-500 bg-umd-indigo-50 text-umd-indigo-800 font-semibold" : "border-umd-slate-200 bg-white text-umd-slate-500 opacity-60"}`;

// Loaded only when a partner picks the map view, so the card widget stays light.
export default function EmbedMap({ slugs, lang, fullMapHref }: {
    slugs: string[];
    lang: "fr" | "en";
    /** Our /transferts page; the active apps are appended so it opens on the same selection. */
    fullMapHref: string;
}) {
    const t = T[lang];
    const all = slugs.flatMap((slug) => BY_SLUG.get(slug) ?? []);
    const [active, setActive] = useState<Set<string>>(() => new Set(all.map((s) => s.slug)));
    const [opts, setOpts] = useState<LinkOptions>({ policy: true, trackers: true });

    // Keep at least one app: an empty map explains nothing.
    const toggle = (slug: string) => setActive((prev) => {
        const next = new Set(prev);
        if (next.has(slug)) { if (next.size > 1) next.delete(slug); } else next.add(slug);
        return next;
    });
    const shown = all.filter((s) => active.has(s.slug));

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2.5 px-4">
                <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t.apps}>
                    {all.map((s) => (
                        <button key={s.slug} type="button" aria-pressed={active.has(s.slug)} onClick={() => toggle(s.slug)} className={chip(active.has(s.slug))}>
                            <span className="w-5 h-5 rounded-full bg-white overflow-hidden flex items-center justify-center shrink-0">
                                {s.logo
                                    ? <Image src={s.logo} alt="" width={20} height={20} className="object-contain" unoptimized />
                                    : <span className="font-bold text-[10px] text-umd-indigo-800">{s.name.charAt(0)}</span>}
                            </span>
                            {s.name}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-umd-slate-700">
                        {t.sources}
                        {([["policy", t.policy], ["trackers", t.trackers]] as const).map(([key, label]) => (
                            <button key={key} type="button" aria-pressed={opts[key]} className={`${chip(opts[key])} !pl-3`}
                                onClick={() => setOpts((o) => ({ ...o, [key]: !o[key] }))}>
                                {label}
                            </button>
                        ))}
                    </div>
                    <a href={`${fullMapHref}&apps=${shown.map((s) => s.slug).join(",")}`} target="_blank" rel="noopener"
                        className="umd-btn umd-btn-primary umd-btn-sm no-underline">
                        {t.full} <ArrowUpRight aria-hidden="true" />
                    </a>
                </div>
            </div>
            <DataRadar lang={lang} selectedServices={shown} options={opts} />
        </div>
    );
}
