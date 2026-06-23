"use client";

import { useEffect, useMemo, useState } from "react";
import Translator from "../tools/t";
import dict from "../../i18n/DigitalCleanUp.json";
import { Leaf, RotateCcw } from "lucide-react";
import SocialShare from "../shared/SocialShare";

interface CleanUpRecapProps {
    lang: string;
    savedVolumes: Record<string, number>;
    serviceGroups: {
        id: string;
        name: string;
        logo?: string;
        children: { slug: string; name: string }[];
    }[];
    onBackHome: () => void;
}

export default function CleanUpRecap({
    lang,
    savedVolumes,
    serviceGroups,
    onBackHome,
}: CleanUpRecapProps) {
    const t = new Translator(dict, lang);
    const [metricsSent, setMetricsSent] = useState(false);

    const parentBreakdown = useMemo(() => {
        return serviceGroups
            .map((group) => {
                const details = group.children
                    .map((child) => ({
                        slug: child.slug,
                        name: child.name,
                        value: savedVolumes[child.slug] || 0,
                    }))
                    .filter((child) => child.value > 0);

                const total = details.reduce((sum, child) => sum + child.value, 0);

                return {
                    id: group.id,
                    name: group.name,
                    logo: group.logo,
                    total,
                    details,
                };
            })
            .filter((group) => group.total > 0);
    }, [savedVolumes, serviceGroups]);

    // Calculate total saved in GB (Go), only for currently selected groups
    const totalGB = useMemo(() => {
        return parentBreakdown.reduce((acc, group) => acc + group.total, 0);
    }, [parentBreakdown]);

    // Format to nice string (GB or TB)
    const formattedTotal = useMemo(() => {
        if (totalGB >= 1000) {
            return `${(totalGB / 1024).toFixed(2)} To`;
        }
        return `${totalGB.toFixed(1)} Go`;
    }, [totalGB]);

    // Send Wysistat Metric exactly once
    useEffect(() => {
        if (totalGB > 0 && !metricsSent) {
            if (typeof window !== "undefined" && window._wsq) {
                // Send a custom Wysistat event: page view 1; Event Category; Event Action; Value (in GB)
                window._wsq.push(['_setEvent', `1;DigitalCleanUpDay;EspaceLibereGB;${Math.round(totalGB)}`]);
                window._wsq.push(['_wysistat']);
            }
            setMetricsSent(true);
        }
    }, [totalGB, metricsSent]);

    const shareText =
        lang === "fr"
            ? `🎉 J'ai libéré ${formattedTotal} de données lors du Digital Clean Up Day ! Rejoignez le mouvement 🌱`
            : `🎉 I freed up ${formattedTotal} of data during Digital Clean Up Day! Join the movement 🌱`;

    return (
        <div>
            <div className="mb-[22px]">
                <h2 className="umd-heading-2 text-[clamp(22px,2.6vw,30px)] mb-2">{t.t("recapTitle")}</h2>
                <p className="text-[14.5px] leading-[1.55] text-umd-slate-500 max-w-[680px]">{t.t("recapDesc")}</p>
            </div>

            {/* Stat total */}
            <div className="umd-card p-0 overflow-hidden">
                <div className="flex items-center gap-[18px] px-6 py-[22px] flex-wrap">
                    <div className="flex-1 min-w-[160px]">
                        <div className="text-[12.5px] font-bold uppercase tracking-[0.1em] text-umd-green-700 mb-1">
                            {t.t("totalVolumeSaved")}
                        </div>
                        <div className="flex items-center gap-[7px] text-[13px] text-umd-slate-500">
                            <Leaf className="w-[15px] h-[15px] text-umd-green-600" />
                            {lang === "fr" ? "Moins de stockage, c'est moins d'énergie consommée." : "Less storage means less energy consumed."}
                        </div>
                    </div>
                    <div className="font-display font-extrabold text-5xl leading-none text-umd-green-700 [font-variant-numeric:tabular-nums]">
                        {formattedTotal}
                    </div>
                </div>

                {parentBreakdown.length > 0 && (
                    <div className="border-t border-umd-slate-100 p-[18px] flex flex-col gap-3">
                        {parentBreakdown.map((group) => (
                            <div key={group.id} className="flex items-center gap-3.5">
                                <span className="w-9 h-9 rounded-lg bg-white border border-umd-slate-200 flex items-center justify-center overflow-hidden p-1.5 shadow-sm shrink-0">
                                    {group.logo ? (
                                        <img src={group.logo} alt="" className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="text-xs font-extrabold">{group.name.charAt(0)}</span>
                                    )}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between font-bold text-sm mb-1.5">
                                        <span>{group.name}</span>
                                        <span className="text-umd-green-700">{group.total.toFixed(1)} Go</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {group.details.map((detail) => (
                                            <span key={detail.slug} className="umd-chip umd-chip-safe !text-[11.5px]">
                                                {detail.name} · {detail.value.toFixed(1)} Go
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Partage */}
            <div className="umd-card p-[22px] mt-[18px]">
                <div className="font-display font-bold text-base mb-3">
                    {lang === "fr" ? "Partagez votre impact" : "Share your impact"}
                </div>
                <SocialShare
                    text={shareText}
                    url="https://unlock-my-data.com/digital-clean-up"
                    hashtags={["DigitalCleanUpDay", "unlockmydata", "enovateurs"]}
                    platforms={["LinkedIn", "Bluesky", "Twitter", "Mastodon", "Threads", "Facebook", "Whatsapp"]}
                    size="lg"
                />
            </div>

            {/* NAV */}
            <div className="flex justify-center mt-7">
                <button onClick={onBackHome} className="umd-btn umd-btn-primary umd-btn-lg cursor-pointer">
                    <RotateCcw className="w-5 h-5" />
                    {t.t("restartProcessWithAnother")}
                </button>
            </div>
        </div>
    );
}
