"use client";

import { useEffect, useMemo, useState } from "react";
import Translator from "../tools/t";
import dict from "../../i18n/DigitalCleanUp.json";
import { Award, Leaf, RotateCcw } from "lucide-react";
import SocialShare from "../shared/SocialShare";

interface CleanUpRecapProps {
    lang: string;
    savedVolumes: Record<string, number>;
    serviceGroups: {
        id: string;
        name: string;
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
        <div className="space-y-8 py-8 animate-in zoom-in-95 duration-700">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-success/10 rounded-full mb-6 relative">
                    <Award className="w-12 h-12 text-success relative z-10" />
                    <div className="absolute inset-0 bg-success/20 rounded-full opacity-75"></div>
                </div>
                <h2 className="text-3xl font-bold mb-4">{t.t("recapTitle")}</h2>
                <p className="text-lg text-base-content/70 max-w-lg mx-auto">
                    {t.t("recapDesc")}
                </p>
            </div>

            <div className="max-w-md mx-auto bg-gradient-to-br from-success/5 to-success/10 border border-success/20 rounded-3xl p-8 text-center shadow-lg">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-success mb-2">
                    {t.t("totalVolumeSaved")}
                </h3>
                <div className="text-5xl font-black text-success mb-2">
                    {formattedTotal}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-base-content/60 mt-4">
                    <Leaf className="w-4 h-4 text-success" />
                    <span>{t.t("metricsSent")}</span>
                </div>

                {parentBreakdown.length > 0 && (
                    <div className="mt-6 text-left space-y-3 border-t border-success/20 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                            {lang === "fr" ? "Detail par service parent" : "Breakdown by parent service"}
                        </p>
                        {parentBreakdown.map((group) => (
                            <div key={group.id} className="rounded-xl bg-white/70 border border-success/10 p-3">
                                <div className="flex items-center justify-between text-sm font-semibold">
                                    <span className="text-base-content/80">{group.name}</span>
                                    <span className="text-success">{group.total.toFixed(1)} Go</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {group.details.map((detail) => (
                                        <span
                                            key={detail.slug}
                                            className="text-xs px-2 py-1 rounded-full bg-success/10 text-success"
                                        >
                                            {detail.name}: {detail.value.toFixed(1)} Go
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center gap-6 pt-8">
                <button
                    onClick={onBackHome}
                    className="btn btn-primary btn-lg rounded-full px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all gap-2"
                >
                    <RotateCcw className="w-5 h-5" />
                    {t.t("restartProcessWithAnother")}
                </button>

                <div className="flex flex-col items-center gap-3">
                    <p className="text-sm font-semibold text-base-content/70 uppercase tracking-wider">
                        {lang === "fr" ? "Partagez votre impact" : "Share your impact"}
                    </p>
                    <SocialShare
                        text={shareText}
                        url="https://unlock-my-data.com/digital-clean-up"
                        hashtags={["DigitalCleanUpDay", "unlockmydata", "enovateurs"]}
                        platforms={["LinkedIn", "Bluesky", "Twitter", "Mastodon", "Threads", "Facebook", "Whatsapp"]}
                        size="lg"
                    />
                </div>
            </div>
        </div>
    );
}
