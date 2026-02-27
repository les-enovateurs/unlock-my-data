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
    <div className="mt-3 space-y-2">
      {/* Existing replies */}
      {replies.length > 0 && (
        <div className="ml-4 border-l-2 border-base-300 pl-3 space-y-2">
          {replies.map((reply, idx) => (
            <div key={idx} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-xs">
                  {reply.author_name || "👤 " + t.t("anonymous")}
                </span>
                <span className="text-xs text-base-content/50">
                  {new Date(reply.timestamp).toLocaleString(
                    lang === "fr" ? "fr-FR" : "en-US"
                  )}
                </span>
              </div>
              <p className="text-base-content/80">{reply.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply button or input form */}
      {!showReplyInput ? (
        <button
          className="btn btn-xs btn-ghost gap-1 hover:bg-info/20"
          onClick={() => setShowReplyInput(true)}
          aria-label={t.t("replyTo")}
        >
          <MessageSquare size={14} />
          {t.t("replyTo")}
        </button>
      ) : (
        <div className="space-y-2 ml-4 p-3 bg-base-100 rounded-lg shadow-sm">
          <label className="block">
            <span className="text-xs font-semibold mb-1 block">
              {t.t("yourReply")} {reviewerName ? `(${reviewerName})` : ""}
            </span>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.t("commentPlaceholder")}
              className="textarea textarea-bordered textarea-sm w-full focus:textarea-info"
              rows={3}
              maxLength={maxLength}
            />
            {typeof maxLength === "number" && maxLength >= 0 && (
              <div className="text-xs text-base-content/50 text-right">
                {replyText.length}/{maxLength}
              </div>
            )}
          </label>
          <div className="flex gap-2 justify-end">
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => {
                setShowReplyInput(false);
                setReplyText("");
              }}
            >
              {t.t("cancelEdit")}
            </button>
            <button
              className="btn btn-xs btn-info"
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
