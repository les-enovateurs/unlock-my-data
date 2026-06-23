"use client";

import { useState, useMemo } from "react";
import { MessageSquare } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/ReviewForms.json";
import { ReviewReply } from "@/types/form";
import { limitText } from "@/lib/textLimits";

interface ReplyThreadProps {
  replies?: ReviewReply[];
  reviewerName: string;
  onAddReply: (text: string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  lang: "fr" | "en";
  maxLength?: number;
}

export default function ReplyThread({
  replies = [],
  reviewerName,
  onAddReply,
  expanded = true,
  onToggleExpand,
  lang,
  maxLength
}: ReplyThreadProps) {
  const t = useMemo(() => new Translator(dict as any, lang), [lang]);
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  // Handle adding a new reply
  const handleAddReply = () => {
    if (replyText.trim()) {
      const trimmed = replyText.trim();
      onAddReply(limitText(trimmed, maxLength));
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  // Handle keyboard submit (Ctrl+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleAddReply();
    }
  };

  return (
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Existing replies */}
      {replies.length > 0 && (
        <div style={{ marginLeft: 16, borderLeft: "2px solid var(--slate-200)", paddingLeft: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {replies.map((reply, idx) => (
            <div key={idx} style={{ fontSize: 13.5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 12, color: "var(--fg1)" }}>
                  {reply.author_name || "👤 " + t.t("anonymous")}
                </span>
                <span style={{ fontSize: 11, color: "var(--fg3)" }}>
                  {new Date(reply.timestamp).toLocaleString(
                    lang === "fr" ? "fr-FR" : "en-US"
                  )}
                </span>
              </div>
              <p style={{ color: "var(--fg2)", margin: 0 }}>{reply.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply button or input form */}
      {!showReplyInput ? (
        <button
          type="button"
          className="umd-btn umd-btn-ghost umd-btn-sm"
          style={{ alignSelf: "flex-start" }}
          onClick={() => setShowReplyInput(true)}
          aria-label={t.t("replyTo")}
        >
          <MessageSquare size={14} />
          {t.t("replyTo")}
        </button>
      ) : (
        <div className="umd-card" style={{ marginLeft: 16, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ display: "block" }}>
            <span className="umd-label" style={{ marginBottom: 4 }}>
              {t.t("yourReply")} {reviewerName ? `(${reviewerName})` : ""}
            </span>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.t("commentPlaceholder")}
              className="umd-input"
              rows={3}
              maxLength={maxLength}
            />
            {typeof maxLength === "number" && maxLength >= 0 && (
              <div style={{ fontSize: 11, color: "var(--fg3)", textAlign: "right" }}>
                {replyText.length}/{maxLength}
              </div>
            )}
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              className="umd-btn umd-btn-ghost umd-btn-sm"
              onClick={() => {
                setShowReplyInput(false);
                setReplyText("");
              }}
            >
              {t.t("cancelEdit")}
            </button>
            <button
              type="button"
              className="umd-btn umd-btn-primary umd-btn-sm"
              onClick={handleAddReply}
              disabled={!replyText.trim() || (typeof maxLength === "number" && maxLength >= 0 && replyText.length > maxLength)}
            >
              {t.t("addReply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
