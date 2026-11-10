import Image from "next/image";
import { flagEmoji, localizedCountry } from "@/lib/geo/serviceGeo";
import { KeyRound, Radar, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
import { CATEGORY_META } from "@/data/permissionLabels";
import type { CatalogService } from "@/components/CatalogContent";

export type CardVariant = "compact" | "standard" | "detailed";
export const CARD_VARIANTS: CardVariant[] = ["compact", "standard", "detailed"];

type Tone = "safe" | "warn" | "danger";

const T: Record<string, Record<string, string>> = {
    fr: {
        noTracker: "Sans traceur",
        trackers: "traceurs",
        tracker: "traceur",
        breach: "Fuite connue",
        noBreach: "Aucune fuite connue",
        clean: "Ni traceur ni fuite connue",
        accessShort: "Accès aux données",
        alternative: "Alternative recommandée",
        trackersLabel: "Traceurs",
        trackersNone: "Aucun",
        trackersSome: "Quelques-uns",
        trackersMany: "Beaucoup",
        breachLabel: "Fuites connues",
        accessLabel: "Accès à ses données",
        accessEasy: "Facile",
        accessMedium: "Moyen",
        accessHard: "Difficile",
        accessHelp: "Facile : export en ligne. Difficile : pièce d'identité exigée.",
        outsideEULabel: "Données hors UE",
        permsLabel: "Permissions sensibles",
        yes: "Oui",
        weightLabel: "Poids de l'app",
        unit: "Mo",
        cta: "Voir l'analyse complète",
    },
    en: {
        noTracker: "No tracker",
        trackers: "trackers",
        tracker: "tracker",
        breach: "Known breach",
        noBreach: "No known breach",
        clean: "No tracker, no known breach",
        accessShort: "Data access",
        alternative: "Recommended alternative",
        trackersLabel: "Trackers",
        trackersNone: "None",
        trackersSome: "A few",
        trackersMany: "Many",
        breachLabel: "Known breaches",
        accessLabel: "Data access",
        accessEasy: "Easy",
        accessMedium: "Medium",
        accessHard: "Hard",
        accessHelp: "Easy: online export. Hard: ID card required.",
        outsideEULabel: "Data outside the EU",
        permsLabel: "Sensitive permissions",
        yes: "Yes",
        weightLabel: "App size",
        unit: "MB",
        cta: "See the full analysis",
    },
};

// Thresholds: 1-5 trackers is common for an app with analytics and crash reporting;
// beyond that, advertising SDKs are almost always involved.
function trackerTone(n: number): [Tone, string] {
    if (n === 0) return ["safe", "trackersNone"];
    return n <= 5 ? ["warn", "trackersSome"] : ["danger", "trackersMany"];
}

function accessTone(level: number): [Tone, string] {
    if (level >= 4) return ["safe", "accessEasy"];
    return level === 3 ? ["warn", "accessMedium"] : ["danger", "accessHard"];
}

// Same rounding as the fiche: one decimal under 100 MB, none above.
function formatWeight(bytes: number, lang: string, unit: string) {
    const mb = bytes / 1e6;
    return `${mb.toLocaleString(lang === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: mb < 100 ? 1 : 0 })} ${unit}`;
}

type Props = { service: CatalogService; lang: string; variant?: CardVariant };

export default function ServiceCardBody({ service: s, lang, variant = "standard" }: Props) {
    const t = (k: string) => T[lang]?.[k] ?? T.fr[k];
    const l = lang === "en" ? "en" : "fr";

    const identity = (
        <span className="flex items-center gap-3">
            <span className="w-[38px] h-[38px] rounded-[9px] border border-umd-slate-200 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                {s.logo ? (
                    <Image src={s.logo} alt="" width={38} height={38} className="object-contain p-1" unoptimized loading="lazy" />
                ) : (
                    <span className="font-display font-bold text-umd-indigo-800">{s.name.charAt(0)}</span>
                )}
            </span>
            <span className="min-w-0">
                <span className="flex items-baseline gap-1.5 min-w-0">
                    <span className="font-display font-bold text-[15.5px] truncate">{s.name}</span>
                    {s.apkBytes !== null && (
                        <span className="text-[11px] text-umd-slate-600 shrink-0 tabular-nums" title={t("weightLabel")}>
                            {formatWeight(s.apkBytes, lang, t("unit"))}
                        </span>
                    )}
                </span>
                {s.countryCode && (
                    <span className="text-umd-slate-600 text-[12.5px] inline-flex items-center gap-1.5">
                        <span className="text-[1.05em]" aria-hidden="true">{flagEmoji(s.countryCode)}</span>
                        {localizedCountry(lang, s.countryCode)}
                    </span>
                )}
            </span>
        </span>
    );

    if (variant === "compact") return identity;

    const access = s.easyAccess !== null ? accessTone(s.easyAccess) : null;

    if (variant === "standard") {
        return (
            <>
                {identity}
                <span className="flex flex-wrap gap-1.5 mt-auto">
                    {s.trackers === 0 && s.breaches === 0 ? (
                        <span className="umd-chip umd-chip-safe"><ShieldCheck aria-hidden="true" />{t("clean")}</span>
                    ) : (
                        <>
                            {s.trackers !== null && (
                                s.trackers === 0 ? (
                                    <span className="umd-chip umd-chip-safe"><ShieldCheck aria-hidden="true" />{t("noTracker")}</span>
                                ) : (
                                    <span className="umd-chip umd-chip-warn"><Radar aria-hidden="true" />{s.trackers} {s.trackers === 1 ? t("tracker") : t("trackers")}</span>
                                )
                            )}
                            {s.breaches > 0 ? (
                                <span className="umd-chip umd-chip-danger"><ShieldAlert aria-hidden="true" />{t("breach")}</span>
                            ) : (
                                <span className="umd-chip umd-chip-safe"><ShieldCheck aria-hidden="true" />{t("noBreach")}</span>
                            )}
                        </>
                    )}
                    {access && (
                        <span className={`umd-chip umd-chip-${access[0]}`} title={t("accessHelp")}>
                            <KeyRound aria-hidden="true" />{t("accessShort")} {t(access[1]).toLowerCase()}
                        </span>
                    )}
                    {s.betterAlternative && (
                        <span className="umd-chip umd-chip-info"><Sparkles aria-hidden="true" />{t("alternative")}</span>
                    )}
                </span>
            </>
        );
    }

    // Detailed: one row per signal, each a tag. A signal the fiche does not document is left out.
    const rows: { label: string; tone?: Tone; value: string; title?: string }[] = [];
    if (s.trackers !== null) {
        const [tone, key] = trackerTone(s.trackers);
        rows.push({ label: t("trackersLabel"), tone, value: s.trackers ? `${t(key)} · ${s.trackers}` : t(key) });
    }
    if (s.breaches > 0) rows.push({ label: t("breachLabel"), tone: "danger", value: String(s.breaches) });
    if (access) {
        rows.push({ label: t("accessLabel"), tone: access[0], value: t(access[1]), title: t("accessHelp") });
    }
    if (s.outsideEU) rows.push({ label: t("outsideEULabel"), tone: "danger", value: t("yes") });
    if (s.sensitivePermissions?.length) rows.push({ label: t("permsLabel"), tone: "danger", value: t("yes") });

    return (
        <>
            {identity}
            <dl className="flex flex-col gap-2 text-[13px] m-0 border-t border-umd-slate-200 pt-3">
                {rows.map((r) => (
                    <div key={r.label} className="flex items-center justify-between gap-3">
                        <dt className="text-umd-slate-600">{r.label}</dt>
                        <dd className="m-0" title={r.title}>
                            {r.tone
                                ? <span className={`umd-chip umd-chip-${r.tone}`}>{r.value}</span>
                                : <span className="font-semibold tabular-nums">{r.value}</span>}
                        </dd>
                    </div>
                ))}
            </dl>
            {s.betterAlternative && (
                <span className="umd-chip umd-chip-info self-start"><Sparkles aria-hidden="true" />{t("alternative")}</span>
            )}
            {!!s.sensitivePermissions?.length && (
                <span className="flex flex-wrap items-center gap-1">
                    {s.sensitivePermissions.map((c) => (
                        <span key={c} className="text-[11px] leading-none px-2 py-1 rounded-full bg-umd-slate-100 text-umd-slate-700">
                            {CATEGORY_META[c][l].label}
                        </span>
                    ))}
                </span>
            )}
            <span className="mt-auto text-sm font-semibold text-umd-indigo-600">{t("cta")} →</span>
        </>
    );
}
