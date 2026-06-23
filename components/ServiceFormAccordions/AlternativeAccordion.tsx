import React from "react";
import dynamic from "next/dynamic";
import { Star, ChevronUp, ChevronDown } from "lucide-react";
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
    const id = "form-accordion-alternative";
    const open = openAccordions.includes(id);
    const labels = t.fieldLabels || {};

    return (
        <div className="umd-acc">
            <button
                type="button"
                className="umd-acc-head"
                onClick={() => handleAccordionClick(id)}
                aria-expanded={open}
            >
                <span className="umd-acc-ic">
                    <Star className="w-[18px] h-[18px]" />
                </span>
                <span style={{ flex: 1 }}>
                    <span className="umd-acc-title">
                        {labels.alternativeSectionTitle ||
                            t.alternativeSectionTitle ||
                            "Alternative recommandée"}
                    </span>
                </span>
                {open ? (
                    <ChevronUp className="w-[18px] h-[18px]" style={{ color: "var(--fg3)" }} />
                ) : (
                    <ChevronDown className="w-[18px] h-[18px]" style={{ color: "var(--fg3)" }} />
                )}
            </button>
            {open && (
                <div className="umd-acc-body">
                    <label className="umd-switch-line">
                        <input
                            type="checkbox"
                            name="better_alternative"
                            checked={Boolean(formData?.better_alternative)}
                            onChange={(e) =>
                                setFormData((prev) =>
                                    prev
                                        ? { ...prev, better_alternative: e.target.checked }
                                        : prev,
                                )
                            }
                        />
                        {labels.better_alternative ||
                            "Mettre en avant comme alternative recommandée"}
                    </label>

                    <div>
                        <label>
                            <span className="umd-label">
                                {labels.better_alternative_explication || "Explication (FR)"}
                            </span>
                        </label>
                        <MarkdownEditor
                            value={formData?.better_alternative_explication || ""}
                            onChange={(val: string) =>
                                setFormData((prev) =>
                                    prev
                                        ? { ...prev, better_alternative_explication: val }
                                        : prev,
                                )
                            }
                            placeholder="Ex: Open source, Chiffrement de bout en bout..."
                            maxLength={MARKDOWN_MAX_LENGTH}
                            showCounter
                        />
                    </div>

                    <div>
                        <label>
                            <span className="umd-label">
                                {labels.better_alternative_explication_en ||
                                    "Explanation (EN)"}
                            </span>
                        </label>
                        <MarkdownEditor
                            value={formData?.better_alternative_explication_en || ""}
                            onChange={(val: string) =>
                                setFormData((prev) =>
                                    prev
                                        ? { ...prev, better_alternative_explication_en: val }
                                        : prev,
                                )
                            }
                            placeholder="Ex: Open source, End-to-end encryption..."
                            maxLength={MARKDOWN_MAX_LENGTH}
                            showCounter
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
