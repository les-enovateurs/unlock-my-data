"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Check, RotateCcw } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/ReviewForms.json";
import { ReviewItem } from "@/types/form";
import ReplyThread from "./ReplyThread";
import React from "react";
import {
  MIN_RESOLUTION_NOTE_LENGTH,
  canCloseComment,
  isExplanationRequired,
} from "./reviewInvariant";

interface FieldCommentProps {
  comment: ReviewItem;
  index: number;
  reviewerName: string;
  onAddReply: (text: string) => void;
  onMarkResolved: (resolved: boolean, note?: string) => void;
  lang: "fr" | "en";
  replyMaxLength?: number;
  /** Published cards are history: readable, not editable. */
  readOnly?: boolean;
}

export default React.memo(function FieldComment({
  comment,
  index,
  reviewerName,
  onAddReply,
  onMarkResolved,
  lang,
  replyMaxLength,
  readOnly = false
}: FieldCommentProps) {
  const t = useMemo(() => new Translator(dict as any, lang), [lang]);
  const [showReplies, setShowReplies] = useState(!comment.resolved);
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [resolveNote, setResolveNote] = useState("");
  const [resolveError, setResolveError] = useState<string | null>(null);

  const isResolved = comment.resolved || false;
  const repliesCount = comment.replies?.length || 0;
  const requireExplanation = isExplanationRequired();

  // A thread that already holds a reply carries its own justification.
  const needsNote =
    requireExplanation && !canCloseComment(comment, "", { requireExplanation }).ok;

  const handleResolveClick = () => {
    if (!needsNote) {
      onMarkResolved(true);
      return;
    }
    setShowResolveForm(true);
  };

  const handleConfirmResolve = () => {
    const check = canCloseComment(comment, resolveNote, { requireExplanation });
    if (!check.ok) {
      setResolveError(
        check.reason === "note_too_short"
          ? t.t("resolutionNoteTooShort")
          : t.t("resolutionNoteRequired")
      );
      return;
    }
    onMarkResolved(true, resolveNote.trim());
    setResolveNote("");
    setResolveError(null);
    setShowResolveForm(false);
  };

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
        {!readOnly && (
          <div style={{ display: "flex", gap: 4 }}>
            {!isResolved ? (
              <button
                type="button"
                className="umd-btn umd-btn-ghost umd-btn-sm"
                style={{ padding: "5px 9px" }}
                onClick={handleResolveClick}
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
        )}
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

          {/* Why the comment was closed — kept readable for good */}
          {isResolved && (comment.resolved_note || comment.resolved_by) && (
            <div
              style={{
                fontSize: 12.5,
                color: "var(--fg2)",
                borderLeft: "2px solid var(--slate-200)",
                paddingLeft: 10,
                marginBottom: 10
              }}
            >
              {comment.resolved_note && (
                <div>
                  <strong>{t.t("resolvedNoteLabel")} : </strong>
                  {comment.resolved_note}
                </div>
              )}
              {comment.resolved_by && (
                <div style={{ fontSize: 11, color: "var(--fg3)" }}>
                  {t.t("resolvedByLabel")} {comment.resolved_by}
                  {comment.resolved_at
                    ? ` — ${new Date(comment.resolved_at).toLocaleString(
                      lang === "fr" ? "fr-FR" : "en-US"
                    )}`
                    : ""}
                </div>
              )}
            </div>
          )}

          {/* Reply thread */}
          <ReplyThread
            replies={comment.replies}
            reviewerName={reviewerName}
            onAddReply={onAddReply}
            expanded={showReplies}
            lang={lang}
            maxLength={replyMaxLength}
          />

          {/* Explanation required to close an unanswered comment */}
          {showResolveForm && !isResolved && (
            <div className="umd-card" style={{ marginTop: 10, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ display: "block" }}>
                <span className="umd-label" style={{ marginBottom: 4 }}>
                  {t.t("resolutionNoteLabel")}
                </span>
                <textarea
                  value={resolveNote}
                  onChange={(e) => {
                    setResolveNote(e.target.value);
                    setResolveError(null);
                  }}
                  placeholder={t.t("resolutionNotePlaceholder")}
                  className="umd-input"
                  rows={3}
                  aria-invalid={resolveError ? true : undefined}
                />
              </label>
              <p style={{ fontSize: 11.5, color: "var(--fg3)", margin: 0 }}>
                {t.t("resolutionNoteHelp")}
              </p>
              {resolveError && (
                <p role="alert" style={{ fontSize: 12, color: "var(--red-700)", margin: 0 }}>
                  {resolveError}
                </p>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="umd-btn umd-btn-ghost umd-btn-sm"
                  onClick={() => {
                    setShowResolveForm(false);
                    setResolveNote("");
                    setResolveError(null);
                  }}
                >
                  {t.t("cancelEdit")}
                </button>
                <button
                  type="button"
                  className="umd-btn umd-btn-primary umd-btn-sm"
                  onClick={handleConfirmResolve}
                  disabled={resolveNote.trim().length < MIN_RESOLUTION_NOTE_LENGTH}
                >
                  {t.t("confirmResolve")}
                </button>
              </div>
            </div>
          )}

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
