import React from "react";
import dynamic from "next/dynamic";
import { Star } from "lucide-react";
import { FormData } from "@/types/form";

const MarkdownEditor = dynamic(() => import("@/components/MarkdownEditor"), {
    ssr: false,
});

interface AlternativeAccordionProps {
    openAccordions: string[];
    handleAccordionClick: (id: string) => void;
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    t: any;
    MARKDOWN_MAX_LENGTH: number;
}

export function AlternativeAccordion({
    openAccordions,
    handleAccordionClick,
    formData,
    setFormData,
    t,
    MARKDOWN_MAX_LENGTH,
}: AlternativeAccordionProps) {
    return (
        <div className="collapse collapse-arrow bg-base-200/50 border border-base-200 rounded-box">
            <input
                type="checkbox"
                name="form-accordion-alternative"
                checked={openAccordions.includes("form-accordion-alternative")}
                onChange={() => handleAccordionClick("form-accordion-alternative")}
            />
            <div className="collapse-title text-xl font-medium flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg text-warning">
                    <Star className="w-5 h-5" />
                </div>
                {t.alternativeSectionTitle || "Alternative recommandée"}
            </div>
            <div className="collapse-content pt-4">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                            <span className="label-text font-medium">
                                {t.betterAlternative ||
                                    "Mettre en avant comme alternative recommandée"}
                            </span>
                            <input
                                type="checkbox"
                                className="toggle toggle-warning"
                                name="better_alternative"
                                checked={Boolean(formData?.better_alternative)}
                                onChange={(e) =>
                                    setFormData((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                better_alternative: e.target.checked,
                                            }
                                            : prev,
                                    )
                                }
                            />
                        </label>
                    </div>

                    {/* Spacer for grid */}
                    <div className="hidden md:block"></div>

                    <div className="form-control md:col-span-2">
                        <label className="label">
                            <span className="label-text font-medium">
                                {t.betterAlternativeExplication ||
                                    "Explication de l'alternative (FR)"}
                            </span>
                        </label>
                        <MarkdownEditor
                            value={formData?.better_alternative_explication || ""}
                            onChange={(val: string) =>
                                setFormData((prev) =>
                                    prev
                                        ? {
                                            ...prev,
                                            better_alternative_explication: val,
                                        }
                                        : prev,
                                )
                            }
                            placeholder="Ex: Open source, Chiffrement de bout en bout..."
                            maxLength={MARKDOWN_MAX_LENGTH}
                            showCounter
                        />
                    </div>

                    <div className="form-control md:col-span-2">
                        <label className="label">
                            <span className="label-text font-medium">
                                {t.betterAlternativeExplicationEn ||
                                    "Alternative Explication (EN)"}
                            </span>
                        </label>
                        <MarkdownEditor
                            value={formData?.better_alternative_explication_en || ""}
                            onChange={(val: string) =>
                                setFormData((prev) =>
                                    prev
                                        ? {
                                            ...prev,
                                            better_alternative_explication_en: val,
                                        }
                                        : prev,
                                )
                            }
                            placeholder="Ex: Open source, End-to-end encryption..."
                            maxLength={MARKDOWN_MAX_LENGTH}
                            showCounter
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
