"use client";

import { useMemo } from "react";
import { AlertCircle, Check, MessageSquare } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/ReviewForms.json";
import { ReviewItem } from "@/types/form";
import ReplyThread from "./ReplyThread";
import { createFieldLabeller } from "./fieldLabels";
import { unansweredComments } from "./reviewInvariant";

interface ContributorReviewThreadsProps {
    review: ReviewItem[];
    /** Name typed by the contributor; replies cannot be attributed without it. */
    contributorName: string;
    lang: "fr" | "en";
    onAddReply: (reviewIndex: number, text: string) => void;
    replyMaxLength?: number;
}

/**
 * Reviewer questions as seen by the contributor editing their own card.
 *
 * The contributor can read and answer, never close: closing is the reviewer's
 * call. Resolved threads stay listed so the discussion can be re-read.
 */
export default function ContributorReviewThreads({
    review,
    contributorName,
    lang,
    onAddReply,
    replyMaxLength,
}: ContributorReviewThreadsProps) {
    const t = useMemo(() => new Translator(dict as any, lang), [lang]);
    const getFieldLabel = useMemo(() => createFieldLabeller(lang), [lang]);

    const pending = unansweredComments(review);
    const trimmedName = contributorName.trim();

    if (!review.length) return null;

    return (
        <div className="umd-card" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <MessageSquare size={18} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                    {t.t("contributorThreadsTitle")}
                </h3>
                {pending.length > 0 && (
                    <span className="umd-chip umd-chip-warn" style={{ fontSize: 11 }}>
                        {pending.length}
                    </span>
                )}
            </div>

            <p style={{ fontSize: 13.5, color: "var(--fg2)", marginTop: 0 }}>
                {t.t("contributorThreadsIntro")}
            </p>

            {pending.length > 0 && (
                <div
                    className="umd-alert umd-alert-warn"
                    role="status"
                    style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}
                >
                    <AlertCircle size={16} />
                    <span style={{ fontSize: 13.5 }}>
                        {t.t("contributorThreadsBlocked").replace("{count}", String(pending.length))}
                    </span>
                </div>
            )}

            {!trimmedName && (
                <div
                    className="umd-alert umd-alert-info"
                    role="status"
                    style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}
                >
                    <AlertCircle size={16} />
                    <span style={{ fontSize: 13.5 }}>{t.t("contributorNameRequired")}</span>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {review.map((comment, reviewIndex) => {
                    const answered = (comment.replies?.length || 0) > 0;
                    const isResolved = comment.resolved || false;

                    return (
                        <div
                            key={`${comment.field}-${comment.timestamp || reviewIndex}`}
                            className="umd-card"
                            style={{ padding: 12, opacity: isResolved ? 0.65 : 1 }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    flexWrap: "wrap",
                                    marginBottom: 6,
                                }}
                            >
                                <span style={{ fontSize: 11, color: "var(--fg3)" }}>
                                    {t.t("onFieldLabel")}
                                </span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg1)" }}>
                                    {getFieldLabel(comment.field)}
                                </span>
                                {isResolved ? (
                                    <span className="umd-chip umd-chip-safe" style={{ fontSize: 10, padding: "1px 8px" }}>
                                        <Check size={11} /> {t.t("resolved")}
                                    </span>
                                ) : (
                                    <span
                                        className={`umd-chip ${answered ? "umd-chip-info" : "umd-chip-warn"}`}
                                        style={{ fontSize: 10, padding: "1px 8px" }}
                                    >
                                        {answered ? t.t("answeredBadge") : t.t("unansweredBadge")}
                                    </span>
                                )}
                            </div>

                            <p style={{ fontSize: 13.5, color: "var(--fg1)", margin: "0 0 6px" }}>
                                {comment.message}
                            </p>

                            <div style={{ fontSize: 11, color: "var(--fg3)", marginBottom: 8 }}>
                                {comment.reviewer_name || t.t("anonymous")}
                                {comment.timestamp
                                    ? ` — ${new Date(comment.timestamp).toLocaleString(
                                        lang === "fr" ? "fr-FR" : "en-US",
                                    )}`
                                    : ""}
                            </div>

                            {isResolved && comment.resolved_note && (
                                <div
                                    style={{
                                        fontSize: 12.5,
                                        color: "var(--fg2)",
                                        borderLeft: "2px solid var(--slate-200)",
                                        paddingLeft: 10,
                                        marginBottom: 8,
                                    }}
                                >
                                    <strong>{t.t("resolvedNoteLabel")} : </strong>
                                    {comment.resolved_note}
                                    {comment.resolved_by ? ` (${comment.resolved_by})` : ""}
                                </div>
                            )}

                            <ReplyThread
                                replies={comment.replies}
                                reviewerName={trimmedName}
                                onAddReply={(text) => onAddReply(reviewIndex, text)}
                                lang={lang}
                                maxLength={replyMaxLength}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
