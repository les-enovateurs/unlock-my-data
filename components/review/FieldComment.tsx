"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Check, RotateCcw } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/ReviewForms.json";
import { ReviewItem, ReviewReply } from "@/types/form";
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
      className={`p-3 rounded-lg ${
        isResolved
          ? "bg-base-100 opacity-60"
          : "bg-base-100 shadow-sm"
      }`}
    >
      {/* Comment header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-base-content">
            {comment.reviewer_name || "👤 " + t.t("anonymous")}
          </span>
          {isResolved && (
            <span className="badge badge-success badge-sm">{t.t("resolved")}</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-1">
          {!isResolved ? (
            <button
              className="btn btn-xs btn-ghost hover:btn-success"
              onClick={() => onMarkResolved(true)}
              title={t.t("markResolved")}
              aria-label={t.t("markResolved")}
            >
              <Check size={14} />
            </button>
          ) : (
            <button
              className="btn btn-xs btn-ghost hover:btn-info"
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
          className="btn btn-sm btn-link btn-ghost"
          onClick={() => setShowReplies(true)}
        >
          <ChevronDown size={14} />
          {t.t("viewReplies").replace("{count}", repliesCount.toString())}
        </button>
      ) : (
        <>
          {/* Comment text */}
          <p className="text-sm mb-3 text-base-content">{comment.message}</p>

          {/* Timestamp */}
          <div className="text-xs text-base-content/50 mb-3">
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
              className="btn btn-xs btn-ghost mt-2"
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
