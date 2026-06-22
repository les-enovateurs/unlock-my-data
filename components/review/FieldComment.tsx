"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Check, RotateCcw } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/ReviewForms.json";
import { ReviewItem } from "@/types/form";
import ReplyThread from "./ReplyThread";
import React from "react";

interface FieldCommentProps {
  comment: ReviewItem;
  index: number;
  reviewerName: string;
  onAddReply: (text: string) => void;
  onMarkResolved: (resolved: boolean) => void;
  lang: "fr" | "en";
  replyMaxLength?: number;
}

export default React.memo(function FieldComment({
  comment,
  index,
  reviewerName,
  onAddReply,
  onMarkResolved,
  lang,
  replyMaxLength
}: FieldCommentProps) {
  const t = useMemo(() => new Translator(dict as any, lang), [lang]);
  const [showReplies, setShowReplies] = useState(!comment.resolved);

  const isResolved = comment.resolved || false;
  const repliesCount = comment.replies?.length || 0;

  return (
    <div
      className="umd-card"
      style={{ padding: 12, opacity: isResolved ? 0.6 : 1 }}
    >
      {/* Comment header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--fg1)" }}>
            {comment.reviewer_name || "👤 " + t.t("anonymous")}
          </span>
          {isResolved && (
            <span className="umd-chip umd-chip-safe" style={{ fontSize: 10, padding: "1px 8px" }}>{t.t("resolved")}</span>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 4 }}>
          {!isResolved ? (
            <button
              type="button"
              className="umd-btn umd-btn-ghost umd-btn-sm"
              style={{ padding: "5px 9px" }}
              onClick={() => onMarkResolved(true)}
              title={t.t("markResolved")}
              aria-label={t.t("markResolved")}
            >
              <Check size={14} />
            </button>
          ) : (
            <button
              type="button"
              className="umd-btn umd-btn-ghost umd-btn-sm"
              style={{ padding: "5px 9px" }}
              onClick={() => onMarkResolved(false)}
              title={t.t("markUnresolved")}
              aria-label={t.t("markUnresolved")}
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Collapsed view for resolved comments */}
      {isResolved && !showReplies ? (
        <button
          type="button"
          className="umd-btn umd-btn-ghost umd-btn-sm"
          onClick={() => setShowReplies(true)}
        >
          <ChevronDown size={14} />
          {t.t("viewReplies").replace("{count}", repliesCount.toString())}
        </button>
      ) : (
        <>
          {/* Comment text */}
          <p style={{ fontSize: 13.5, marginBottom: 10, color: "var(--fg1)" }}>{comment.message}</p>

          {/* Timestamp */}
          <div style={{ fontSize: 11, color: "var(--fg3)", marginBottom: 10 }}>
            {new Date(comment.timestamp || "").toLocaleString(
              lang === "fr" ? "fr-FR" : "en-US"
            )}
          </div>

          {/* Reply thread */}
          <ReplyThread
            replies={comment.replies}
            reviewerName={reviewerName}
            onAddReply={onAddReply}
            expanded={showReplies}
            lang={lang}
            maxLength={replyMaxLength}
          />

          {/* Collapse button for resolved comments */}
          {isResolved && showReplies && (
            <button
              type="button"
              className="umd-btn umd-btn-ghost umd-btn-sm"
              style={{ marginTop: 8 }}
              onClick={() => setShowReplies(false)}
            >
              {t.t("hideReplies")}
            </button>
          )}
        </>
      )}
    </div>
  );
});
