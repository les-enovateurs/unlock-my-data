"use client";

import { useEffect, useMemo, useState } from "react";
import Translator from "../tools/t";
import dict from "../../i18n/DigitalCleanUp.json";
import { Award, ArrowRight, Share2, Leaf } from "lucide-react";

interface CleanUpRecapProps {
    lang: string;
    savedVolumes: Record<string, number>;
    onBackHome: () => void;
}

export default function CleanUpRecap({
    lang,
    savedVolumes,
    onBackHome,
}: CleanUpRecapProps) {
    const t = new Translator(dict, lang);
    const [metricsSent, setMetricsSent] = useState(false);

    // Calculate total saved in GB (Go)
    const totalGB = useMemo(() => {
        return Object.values(savedVolumes).reduce((acc, val) => acc + val, 0);
    }, [savedVolumes]);

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

    return (
        <div className="space-y-8 py-8 animate-in zoom-in-95 duration-700">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-success/10 rounded-full mb-6 relative">
                    <Award className="w-12 h-12 text-success relative z-10" />
                    <div className="absolute inset-0 bg-success/20 rounded-full animate-ping opacity-75"></div>
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
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <button
                    onClick={onBackHome}
                    className="btn btn-ghost hover:bg-base-200 btn-lg rounded-full"
                >
                    {t.t("backHome")}
                </button>
                <button
                    className="btn btn-primary btn-lg rounded-full px-8 shadow-lg gap-2"
                    onClick={() => {
                        const text = `🎉 J'ai libéré ${formattedTotal} de données lors du Digital Clean Up Day ! Rejoignez le mouvement 🌱 #DigitalCleanUpDay #UnlockMyData`;
                        const url = "https://unlock-my-data.com/digital-clean-up";
                        window.open(
                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                            "_blank"
                        );
                    }}
                >
                    Partager l'impact <Share2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
