"use client";

import { useRouter } from "next/navigation";
import { useCleanUpContext } from "@/context/CleanUpContext";
import { LayoutGrid, HardDrive, Trash2, Award, Check } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/DigitalCleanUp.json";

type Stage = "select" | "audit" | "clean" | "recap";

const STAGES: { id: Stage; icon: typeof LayoutGrid }[] = [
    { id: "select", icon: LayoutGrid },
    { id: "audit", icon: HardDrive },
    { id: "clean", icon: Trash2 },
    { id: "recap", icon: Award },
];

interface CleanUpStepperProps {
    current: Stage;
    lang?: string;
}

export default function CleanUpStepper({ current, lang = "fr" }: CleanUpStepperProps) {
    const router = useRouter();
    const { getOrderedSuites, selectedServiceIds } = useCleanUpContext();
    const t = new Translator(dict, lang);

    const labels: Record<Stage, string> = {
        select: t.t("stepperSelect"),
        audit: t.t("stepperAudit"),
        clean: t.t("stepperClean"),
        recap: t.t("stepperRecap"),
    };

    const currentIdx = STAGES.findIndex((s) => s.id === current);
    const hasSelection = selectedServiceIds.length > 0;
    const reachable = (i: number) => i === 0 || hasSelection;

    const go = (stage: Stage) => {
        const suites = getOrderedSuites();
        const first = suites[0]?.id;
        switch (stage) {
            case "select":
                router.push("/digital-clean-up");
                break;
            case "audit":
                if (first) router.push(`/digital-clean-up/audit/${first}`);
                break;
            case "clean":
                if (first) router.push(`/digital-clean-up/clean/${first}`);
                break;
            case "recap":
                router.push("/digital-clean-up/recap");
                break;
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 flex-wrap mb-7">
            {STAGES.map(({ id, icon: Icon }, i) => {
                const active = id === current;
                const done = i < currentIdx;
                const can = reachable(i);

                const skin = active
                    ? "bg-umd-green-700 text-white border-umd-green-700"
                    : done
                        ? "bg-white text-umd-green-700 border-umd-green-300"
                        : "bg-white text-umd-slate-400 border-umd-slate-200";

                const badge = active
                    ? "bg-white/20 text-white"
                    : done
                        ? "bg-umd-green-100 text-umd-green-700"
                        : "bg-umd-slate-100 text-umd-slate-500";

                return (
                    <div key={id} className="flex items-center gap-2">
                        {i > 0 && (
                            <span
                                className={`w-[22px] h-0.5 shrink-0 ${done || active ? "bg-umd-green-300" : "bg-umd-slate-200"}`}
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => can && go(id)}
                            disabled={!can}
                            className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border-[1.5px] text-[13.5px] font-bold whitespace-nowrap ${skin} ${can ? "cursor-pointer" : "cursor-not-allowed"}`}
                        >
                            <span
                                className={`w-[22px] h-[22px] rounded-full flex items-center justify-center font-mono text-xs shrink-0 ${badge}`}
                            >
                                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                            </span>
                            {labels[id]}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
