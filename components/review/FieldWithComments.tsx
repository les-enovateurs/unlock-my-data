"use client";

import { memo, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Select from "react-select";
import Translator from "@/components/tools/t";
import dict from "@/i18n/ReviewForms.json";
import { ReviewItem } from "@/types/form";
import FieldComment from "./FieldComment";
import dynamic from "next/dynamic";
import { limitText } from "@/lib/textLimits";
import { FORM_OPTIONS } from "@/constants/formOptions";
import { getReviewFieldDefinition } from "./fieldDefinitions";

const MarkdownEditor = dynamic(() => import("@/components/MarkdownEditor"), { ssr: false });

// react-select styling aligned with the umd-* design system (eco: no transitions)
const umdSelectStyles = {
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  control: (base: any) => ({
    ...base,
    minHeight: "44px",
    borderColor: "var(--slate-300)",
    borderWidth: "1.5px",
    borderRadius: "var(--umd-radius-md)",
    boxShadow: "none",
    fontSize: "14px",
    ":hover": { borderColor: "var(--slate-300)" },
  }),
  placeholder: (base: any) => ({ ...base, color: "var(--slate-400)" }),
};

interface FieldWithCommentsProps {
  field: string;
  fieldLabel: string;
  fieldValue: any;
  displayValueOverride?: string;
  comments?: ReviewItem[];
  reviewerName?: string;
  isReadOnly?: boolean;
  onValueChange: (newValue: any) => void;
  onAddComment?: (text: string) => void;
  onAddReply: (commentIndex: number, text: string) => void;
  onMarkResolved: (commentIndex: number, resolved: boolean) => void;
  lang: "fr" | "en";
  showCommentsInline?: boolean;
  markdownMaxLength?: number;
  textareaMaxLength?: number;
}

type AppValue = { name: string; link: string };
type EditorValue = string | boolean | string[] | AppValue;

type SelectOption = {
  value?: string;
  label: string;
  label_en?: string;
  country_name?: string;
  note?: string;
  explanation?: string;
  explanation_en?: string;
};

export default memo(function FieldWithComments({
  field,
  fieldLabel,
  fieldValue,
  displayValueOverride,
  comments = [],
  reviewerName,
  isReadOnly = false,
  onValueChange,
  onAddComment,
  onAddReply,
  onMarkResolved,
  lang,
  showCommentsInline = true,
  markdownMaxLength,
  textareaMaxLength
}: FieldWithCommentsProps) {
  const t = useMemo(() => new Translator(dict as any, lang), [lang]);
  const fieldDefinition = getReviewFieldDefinition(field);
  const isMarkdown = fieldDefinition.type === "markdown";

  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  const displayValue = fieldValue;
  const displayText = displayValue === null || displayValue === undefined ? "" : String(displayValue);
  const isEditEnabled = !isReadOnly;

  const normalizeAppValue = (value: any): AppValue => {
    if (!value || typeof value !== "object") {
      return { name: "", link: "" };
    }
    return {
      name: String(value.name || value.app_name || ""),
      link: String(value.link || value.app_link || value.url || "")
    };
  };

  const normalizeArrayValue = (value: any): string[] => {
    if (Array.isArray(value)) return value.map(item => String(item));
    if (typeof value === "string") {
      return value
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  const normalizedMarkdown = (value: string) =>
    value
      .replaceAll("<br />", "\n")
      .replaceAll("<br/>", "\n")
      .replaceAll("<br>", "\n");

  const renderMarkdownPreview = (value: string) => (
    <div className="prose prose-sm max-w-none [&>*]:my-1 [&>ul]:my-2 [&>ol]:my-2 [&>li]:ml-4" style={{ color: "var(--fg2)" }}>
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="text-sm" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside" {...props} />,
          li: ({ node, ...props }) => <li className="text-sm" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          code: ({ node, ...props }) => <code style={{ background: "var(--slate-100)", padding: "1px 4px", borderRadius: 4, fontSize: 12 }} {...props} />,
          a: ({ node, ...props }) => (
            <a style={{ color: "var(--indigo-700)" }} target="_blank" rel="noopener noreferrer" {...props} />
          )
        }}
      >
        {normalizedMarkdown(value)}
      </ReactMarkdown>
    </div>
  );

  const normalizedValue = useMemo((): EditorValue => {
    if (fieldDefinition.type === "checkbox") return Boolean(displayValue);
    if (fieldDefinition.type === "multiselect") return normalizeArrayValue(displayValue);
    if (fieldDefinition.type === "app") return normalizeAppValue(displayValue);
    return displayText;
  }, [displayValue, displayText, fieldDefinition.type]);

  const maxLength = isMarkdown ? markdownMaxLength : textareaMaxLength;

  const handleAddNewComment = () => {
    if (newCommentText.trim() && onAddComment) {
      const trimmed = newCommentText.trim();
      onAddComment(limitText(trimmed, textareaMaxLength));
      setNewCommentText("");
      setIsAddingComment(false);
    }
  };

  const renderDisplayValue = () => {
    if (
      displayValueOverride !== undefined &&
      !isMarkdown &&
      fieldDefinition.type !== "checkbox" &&
      fieldDefinition.type !== "multiselect" &&
      fieldDefinition.type !== "app"
    ) {
      return <span>{displayValueOverride || t.t("noValue")}</span>;
    }
    if (fieldDefinition.type === "checkbox") {
      return (
        <input
          type="checkbox"
          style={{ accentColor: "var(--indigo-600)", width: 18, height: 18 }}
          checked={Boolean(displayValue)}
          disabled
          aria-label={fieldLabel}
        />
      );
    }
    if (fieldDefinition.type === "multiselect") {
      const values = normalizeArrayValue(displayValue);
      return <span>{values.length ? values.join(", ") : t.t("noValue")}</span>;
    }
    if (fieldDefinition.type === "app") {
      const appValue = normalizeAppValue(displayValue);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 12, color: "var(--fg3)" }}>{appValue.name || t.t("noValue")}</div>
          <div style={{ fontSize: 12, color: "var(--fg3)" }}>{appValue.link || t.t("noValue")}</div>
        </div>
      );
    }
    if (isMarkdown) {
      return renderMarkdownPreview(displayText || t.t("noValue"));
    }
    return <span>{displayText || t.t("noValue")}</span>;
  };

  const renderEditor = () => {
    if (!isEditEnabled) {
      return renderDisplayValue();
    }
    if (fieldDefinition.type === "checkbox") {
      return (
        <label className="umd-switch-line">
          <input
            type="checkbox"
            checked={Boolean(normalizedValue)}
            onChange={(e) => onValueChange(e.target.checked)}
          />
          <span>{fieldLabel}</span>
        </label>
      );
    }

    if (field === "nationality") {
      return (
        <Select
          options={FORM_OPTIONS.nationalities}
          value={FORM_OPTIONS.nationalities.find(n => n.label === normalizedValue) || null}
          onChange={selected => onValueChange(selected?.label || "")}
          placeholder={fieldLabel}
          isClearable
          getOptionLabel={(option: SelectOption) => lang === "en" ? option.country_name || option.label : option.label}
          getOptionValue={(option: SelectOption) => option.label}
          menuPortalTarget={typeof window !== "undefined" ? document.body : null}
          styles={umdSelectStyles}
        />
      );
    }

    if (field === "easy_access_data") {
      return (
        <Select
          options={FORM_OPTIONS.easyAccessLevels as any}
          value={(FORM_OPTIONS.easyAccessLevels.find(opt => opt.value === normalizedValue || opt.value + "/5" === normalizedValue) || null) as any}
          onChange={selected => onValueChange(selected?.value || "")}
          placeholder={fieldLabel}
          isClearable
          formatOptionLabel={(option: SelectOption) => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="umd-chip umd-chip-neutral" style={{ fontSize: 11, padding: "2px 9px" }}>{option.note}/5</span>
              <span style={{ fontSize: 13, color: "var(--fg2)", marginLeft: 8 }}>
                {lang === "en" && option.explanation_en ? option.explanation_en : option.explanation}
              </span>
            </div>
          )}
          getOptionLabel={(option: SelectOption) => option.note || option.label}
          getOptionValue={(option: SelectOption) => option.value || option.label}
          menuPortalTarget={typeof window !== "undefined" ? document.body : null}
          styles={umdSelectStyles}
        />
      );
    }

    if (field === "transfer_destination_countries") {
      const currentValues = Array.isArray(normalizedValue) ? normalizedValue : normalizeArrayValue(normalizedValue);
      return (
        <Select
          isMulti
          options={FORM_OPTIONS.countries}
          value={FORM_OPTIONS.countries.filter(n => currentValues.includes(n.label))}
          onChange={selected => onValueChange(selected ? selected.map((s: any) => s.label) : [])}
          placeholder={fieldLabel}
          isClearable
          getOptionLabel={(option: SelectOption) => lang === "en" ? option.country_name || option.label : option.label}
          getOptionValue={(option: SelectOption) => option.label}
          menuPortalTarget={typeof window !== "undefined" ? document.body : null}
          styles={umdSelectStyles}
        />
      );
    }

    if (field === "details_required_documents") {
      const currentValue = String(normalizedValue || "");
      const isCustom = currentValue && !FORM_OPTIONS.requiredDocuments.find(opt => opt.value === currentValue) && currentValue !== "Autre";
      const selectValue = isCustom ? "Autre" : currentValue;

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <select
            value={selectValue}
            onChange={e => {
              if (e.target.value === "Autre") {
                onValueChange("Autre");
              } else {
                onValueChange(e.target.value);
              }
            }}
            className="umd-input"
          >
            {FORM_OPTIONS.requiredDocuments.map(opt => (
              <option key={opt.value} value={opt.value}>
                {lang === "en" && opt.label_en ? opt.label_en : opt.label}
              </option>
            ))}
          </select>
          {(selectValue === "Autre" || isCustom) && (
            <input
              type="text"
              value={isCustom ? currentValue : ""}
              onChange={e => onValueChange(e.target.value)}
              className="umd-input"
              placeholder={fieldLabel}
            />
          )}
        </div>
      );
    }

    if (field === "response_format") {
      const currentValue = String(normalizedValue || "");
      const isCustom = currentValue && !FORM_OPTIONS.responseFormats.find(opt => opt.value === currentValue) && currentValue !== "Autre";
      const selectValue = isCustom ? "Autre" : currentValue;

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <select
            value={selectValue}
            onChange={e => {
              if (e.target.value === "Autre") {
                onValueChange("Autre");
              } else {
                onValueChange(e.target.value);
              }
            }}
            className="umd-input"
          >
            {FORM_OPTIONS.responseFormats.map(opt => (
              <option key={opt.value} value={opt.value}>
                {lang === "en" && opt.label_en ? opt.label_en : opt.label}
              </option>
            ))}
          </select>
          {(selectValue === "Autre" || isCustom) && (
            <input
              type="text"
              value={isCustom ? currentValue : ""}
              onChange={e => onValueChange(e.target.value)}
              className="umd-input"
              placeholder={fieldLabel}
            />
          )}
        </div>
      );
    }

    if (field === "response_delay") {
      const currentValue = String(normalizedValue || "");
      const isCustom = currentValue && !FORM_OPTIONS.responseDelays.find(opt => opt.value === currentValue) && currentValue !== "Autre";
      const selectValue = isCustom ? "Autre" : currentValue;

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <select
            value={selectValue}
            onChange={e => {
              if (e.target.value === "Autre") {
                onValueChange("Autre");
              } else {
                onValueChange(e.target.value);
              }
            }}
            className="umd-input"
          >
            {FORM_OPTIONS.responseDelays.map(opt => (
              <option key={opt.value} value={opt.value}>
                {lang === "en" && opt.label_en ? opt.label_en : opt.label}
              </option>
            ))}
          </select>
          {(selectValue === "Autre" || isCustom) && (
            <input
              type="text"
              value={isCustom ? currentValue : ""}
              onChange={e => onValueChange(e.target.value)}
              className="umd-input"
              placeholder={fieldLabel}
            />
          )}
        </div>
      );
    }

    if (fieldDefinition.type === "app") {
      const appValue = normalizeAppValue(normalizedValue);
      return (
        <div style={{ display: "grid", gap: 12 }}>
          <label>
            <span className="umd-label">{t.t("fieldLabels.app_name")}</span>
            <input
              type="text"
              value={appValue.name}
              onChange={(e) => onValueChange({ ...appValue, name: e.target.value })}
              className="umd-input"
              placeholder={t.t("fieldLabels.app_name")}
            />
          </label>
          <label>
            <span className="umd-label">{t.t("fieldLabels.app_link")}</span>
            <input
              type="text"
              value={appValue.link}
              onChange={(e) => onValueChange({ ...appValue, link: e.target.value })}
              className="umd-input"
              placeholder={t.t("fieldLabels.app_link")}
            />
          </label>
        </div>
      );
    }

    if (isMarkdown) {
      if (!isEditEnabled) {
        return renderMarkdownPreview(displayText || t.t("noValue"));
      }
      return (
        <div>
          <MarkdownEditor
            value={typeof normalizedValue === "string" ? normalizedValue : ""}
            onChange={(value) => onValueChange(value)}
            placeholder={fieldLabel}
            maxLength={markdownMaxLength}
            showCounter
          />
        </div>
      );
    }

    return (
      <input
        type="text"
        value={typeof normalizedValue === "string" ? normalizedValue : ""}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={fieldLabel}
        className="umd-input"
        maxLength={textareaMaxLength}
      />
    );
  };

  if (!showCommentsInline) {
    return (
      <div style={{ marginBottom: 16 }}>
        <label className="umd-label">{fieldLabel}</label>
        {renderEditor()}
      </div>
    );
  }

  return (
    <div style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)", borderRadius: "var(--umd-radius-lg)", padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12 }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 15.5, color: "var(--fg1)", margin: 0 }}>
          <span style={{ width: 4, height: 18, background: "var(--indigo-500)", borderRadius: 9999, flexShrink: 0 }} />
          {fieldLabel}
        </h3>
        <button
          type="button"
          className="umd-btn umd-btn-ghost umd-btn-sm"
          onClick={() => setIsAddingComment(!isAddingComment)}
          title={isAddingComment ? t.t("cancel") : t.t("addComment")}
        >
          <MessageSquare size={14} />
          {isAddingComment ? t.t("cancel") : t.t("addComment")}
        </button>
      </div>

      {isAddingComment && (
        <div className="umd-card" style={{ marginBottom: 14, padding: 14 }}>
          <textarea
            className="umd-input"
            rows={3}
            placeholder={t.t("commentPlaceholder")}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            maxLength={textareaMaxLength}
            autoFocus
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 10 }}>
            <button
              type="button"
              className="umd-btn umd-btn-ghost umd-btn-sm"
              onClick={() => setIsAddingComment(false)}
            >
              {t.t("cancel")}
            </button>
            <button
              type="button"
              className="umd-btn umd-btn-primary umd-btn-sm"
              onClick={handleAddNewComment}
              disabled={!newCommentText.trim() || (typeof textareaMaxLength === "number" && textareaMaxLength >= 0 && newCommentText.length > textareaMaxLength)}
            >
              {t.t("add")}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 16 }} className={comments.length > 0 ? "umd-field-comments-grid" : undefined}>
        {comments.length > 0 && (
          <div>
            <h4 style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 12, color: "var(--fg3)", marginBottom: 10 }}>
              💬 {t.t("comments")}
              <span className="umd-chip umd-chip-info" style={{ fontSize: 10, padding: "1px 8px" }}>{comments.length}</span>
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 600, overflowY: "auto", paddingRight: 4 }}>
              {comments.map((comment, idx) => (
                <FieldComment
                  key={idx}
                  comment={comment}
                  index={idx}
                  reviewerName={reviewerName || t.t("anonymous")}
                  onAddReply={(text) => onAddReply(idx, text)}
                  onMarkResolved={(resolved) => onMarkResolved(idx, resolved)}
                  lang={lang}
                  replyMaxLength={textareaMaxLength}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ minWidth: 0 }}>
          <div style={{ background: "#fff", border: "1px solid var(--slate-200)", borderRadius: "var(--umd-radius-md)", padding: 14, minHeight: 80, wordBreak: "break-word" }}>
            {renderEditor()}
            {displayValueOverride && (
              <div style={{ fontSize: 12, color: "var(--fg3)", marginTop: 8 }}>
                {displayValueOverride}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
