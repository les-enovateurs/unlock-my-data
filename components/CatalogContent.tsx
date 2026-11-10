"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { localizedCountry } from "@/lib/geo/serviceGeo";
import { Search } from "lucide-react";
import ServiceCardBody from "@/components/ServiceCardBody";
import type { PermissionCategoryId } from "@/data/permissionLabels";

export type CatalogService = {
    slug: string;
    name: string;
    logo?: string;
    countryCode?: string;
    trackers: number | null;   // null = app not analysed
    breaches: number;
    betterAlternative: boolean;
    easyAccess: number | null;  // 1 (ID by post) to 5 (one-click export)
    outsideEU: boolean | null;
    sensitivePermissions: PermissionCategoryId[] | null;  // null = app not analysed
    apkBytes: number | null;  // only when the measure passed the APK gates
};

type Props = {
    lang: string;
    services: CatalogService[];
};

const TR: Record<string, Record<string, string>> = {
    fr: {
        title: "Catalogue des applications",
        lead: "Découvrez les pratiques de confidentialité de chaque service : localisation, traceurs, fuites de données.",
        searchPlaceholder: "Rechercher une application…",
        allCountries: "Tous les pays",
        countryAria: "Filtrer par pays",
        found: "services trouvés",
        foundOne: "service trouvé",
        none: "Aucun service trouvé.",
        prev: "Précédent",
        next: "Suivant",
        pagination: "Pagination",
    },
    en: {
        title: "Applications catalog",
        lead: "Discover each service's privacy practices: location, trackers, data breaches.",
        searchPlaceholder: "Search for an application…",
        allCountries: "All countries",
        countryAria: "Filter by country",
        found: "services found",
        foundOne: "service found",
        none: "No service found.",
        prev: "Previous",
        next: "Next",
        pagination: "Pagination",
    },
};

const PER_PAGE = 24;

export default function CatalogContent({ lang, services }: Props) {
    const t = (k: string) => TR[lang]?.[k] ?? TR.fr[k] ?? k;
    const [q, setQ] = useState("");
    const [country, setCountry] = useState("all");
    const [page, setPage] = useState(1);
    const base = lang === "fr" ? "/liste-applications" : "/list-app";

    const countryKey = (s: CatalogService) => s.countryCode?.toUpperCase() ?? "";

    const countries = useMemo(() => {
        const map = new Map<string, string>();
        for (const s of services) {
            const key = countryKey(s);
            if (key && !map.has(key)) map.set(key, localizedCountry(lang, s.countryCode));
        }
        return Array.from(map, ([value, label]) => ({ value, label }))
            .sort((a, b) => a.label.localeCompare(b.label, lang));
    }, [services, lang]);

    const filtered = useMemo(() => {
        let list = services;
        if (q) list = list.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
        if (country !== "all") list = list.filter((s) => countryKey(s) === country);
        return list;
    }, [services, q, country]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
            <h1 className="umd-heading-1 mb-1.5">{t("title")}</h1>
            <p className="umd-lead-text mt-0 mb-6">{t("lead")}</p>

            <div className="flex gap-3 mb-6 flex-wrap">
                <div className="umd-field flex-1 min-w-60">
                    <Search aria-hidden="true" />
                    <input
                        className="umd-input umd-has-ic"
                        placeholder={t("searchPlaceholder")}
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setPage(1); }}
                        aria-label={t("searchPlaceholder")}
                    />
                </div>
                <select
                    className="umd-input !w-auto min-w-44"
                    value={country}
                    onChange={(e) => { setCountry(e.target.value); setPage(1); }}
                    aria-label={t("countryAria")}
                >
                    <option value="all">{t("allCountries")}</option>
                    {countries.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </div>

            <p className="text-umd-slate-500 text-sm mb-4">
                {filtered.length} {filtered.length === 1 ? t("foundOne") : t("found")}
            </p>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0">
                {shown.map((s) => (
                    <li key={s.slug} className="h-full">
                        <Link
                            href={`${base}/${s.slug}`}
                            prefetch={false}
                            className="umd-card umd-card-hover h-full p-4.5 flex flex-col gap-3.5 no-underline text-inherit focus-visible:outline-none"
                        >
                            <ServiceCardBody service={s} lang={lang} />
                        </Link>
                    </li>
                ))}
            </ul>

            {filtered.length === 0 && (
                <p className="text-umd-slate-500 text-center py-10">{t("none")}</p>
            )}

            {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-2 mt-8 flex-wrap" aria-label={t("pagination")}>
                    <button
                        className="umd-btn umd-btn-outline umd-btn-sm"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        style={page === 1 ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                    >
                        {t("prev")}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            aria-current={page === n ? "page" : undefined}
                            className={"umd-btn umd-btn-sm " + (page === n ? "umd-btn-primary" : "umd-btn-ghost")}
                        >
                            {n}
                        </button>
                    ))}
                    <button
                        className="umd-btn umd-btn-outline umd-btn-sm"
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        style={page === totalPages ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                    >
                        {t("next")}
                    </button>
                </nav>
            )}
        </main>
    );
}
