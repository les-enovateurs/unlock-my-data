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
    <div className="prose prose-sm max-w-none text-base-content/70 [&>*]:my-1 [&>ul]:my-2 [&>ol]:my-2 [&>li]:ml-4">
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="text-sm" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside" {...props} />,
          li: ({ node, ...props }) => <li className="text-sm" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          code: ({ node, ...props }) => <code className="bg-base-200 px-1 rounded text-xs" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
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
          className="checkbox checkbox-sm"
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
        <div className="space-y-1">
          <div className="text-xs text-base-content/60">{appValue.name || t.t("noValue")}</div>
          <div className="text-xs text-base-content/60">{appValue.link || t.t("noValue")}</div>
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
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-accent"
            checked={Boolean(normalizedValue)}
            onChange={(e) => onValueChange(e.target.checked)}
          />
          <span className="text-sm">{fieldLabel}</span>
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
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
            control: (base) => ({ ...base, borderColor: "var(--fallback-bc,oklch(var(--bc)/0.2))", borderRadius: "var(--rounded-btn, 0.5rem)", padding: "2px" })
          }}
          classNames={{
            control: () => "input input-bordered !flex"
          }}
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
            <div className="flex items-center justify-between">
              <span className="font-bold badge badge-ghost">{option.note}/5</span>
              <span className="text-sm text-base-content/70 ml-2">
                {lang === "en" && option.explanation_en ? option.explanation_en : option.explanation}
              </span>
            </div>
          )}
          getOptionLabel={(option: SelectOption) => option.note || option.label}
          getOptionValue={(option: SelectOption) => option.value || option.label}
          menuPortalTarget={typeof window !== "undefined" ? document.body : null}
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
            control: (base) => ({ ...base, borderColor: "var(--fallback-bc,oklch(var(--bc)/0.2))", borderRadius: "var(--rounded-btn, 0.5rem)", padding: "2px" })
          }}
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
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
            control: (base) => ({ ...base, borderColor: "var(--fallback-bc,oklch(var(--bc)/0.2))", borderRadius: "var(--rounded-btn, 0.5rem)", padding: "2px" })
          }}
        />
      );
    }

    if (field === "details_required_documents") {
      const currentValue = String(normalizedValue || "");
      const isCustom = currentValue && !FORM_OPTIONS.requiredDocuments.find(opt => opt.value === currentValue) && currentValue !== "Autre";
      const selectValue = isCustom ? "Autre" : currentValue;

      return (
        <div className="space-y-2">
          <select
            value={selectValue}
            onChange={e => {
              if (e.target.value === "Autre") {
                onValueChange("Autre");
              } else {
                onValueChange(e.target.value);
              }
            }}
            className="select select-bordered w-full"
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
              className="input input-bordered w-full text-sm"
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
        <div className="space-y-2">
          <select
            value={selectValue}
            onChange={e => {
              if (e.target.value === "Autre") {
                onValueChange("Autre");
              } else {
                onValueChange(e.target.value);
              }
            }}
            className="select select-bordered w-full"
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
              className="input input-bordered w-full text-sm"
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
        <div className="space-y-2">
          <select
            value={selectValue}
            onChange={e => {
              if (e.target.value === "Autre") {
                onValueChange("Autre");
              } else {
                onValueChange(e.target.value);
              }
            }}
            className="select select-bordered w-full"
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
              className="input input-bordered w-full text-sm"
              placeholder={fieldLabel}
            />
          )}
        </div>
      );
    }

    if (fieldDefinition.type === "app") {
      const appValue = normalizeAppValue(normalizedValue);
      return (
        <div className="grid gap-3">
          <label className="form-control">
            <span className="label-text text-xs font-semibold">{t.t("fieldLabels.app_name")}</span>
            <input
              type="text"
              value={appValue.name}
              onChange={(e) => onValueChange({ ...appValue, name: e.target.value })}
              className="input input-bordered w-full text-sm"
              placeholder={t.t("fieldLabels.app_name")}
            />
          </label>
          <label className="form-control">
            <span className="label-text text-xs font-semibold">{t.t("fieldLabels.app_link")}</span>
            <input
              type="text"
              value={appValue.link}
              onChange={(e) => onValueChange({ ...appValue, link: e.target.value })}
              className="input input-bordered w-full text-sm"
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
        <div className="space-y-4">
          <div>
            <MarkdownEditor
              value={typeof normalizedValue === "string" ? normalizedValue : ""}
              onChange={(value) => onValueChange(value)}
              placeholder={fieldLabel}
              maxLength={markdownMaxLength}
              showCounter
            />
          </div>
        </div>
      );
    }

    return (
      <input
        type="text"
        value={typeof normalizedValue === "string" ? normalizedValue : ""}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={fieldLabel}
        className="input input-bordered w-full text-sm"
        maxLength={textareaMaxLength}
      />
    );
  };

  if (!showCommentsInline) {
    return (
      <div className="mb-4 p-3 bg-base-100 rounded border border-base-300">
        <div className="flex justify-between items-start mb-2">
          <label className="font-semibold text-sm">{fieldLabel}</label>
        </div>
        <div className="text-sm text-base-content/70 break-words p-2 rounded bg-base-100">
          {renderEditor()}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-5 bg-gradient-to-br from-info/5 to-info/10 rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <span className="w-1 h-5 bg-info rounded-full" />
          {fieldLabel}
        </h3>
        <div className="flex gap-2 ml-4 flex-shrink-0">
          <button
            className="btn btn-sm btn-ghost gap-1 hover:bg-info/20"
            onClick={() => setIsAddingComment(!isAddingComment)}
            title={isAddingComment ? t.t("cancel") : t.t("addComment")}
          >
            <MessageSquare size={14} />
            {isAddingComment ? t.t("cancel") : t.t("addComment")}
          </button>
        </div>
      </div>

      {isAddingComment && (
        <div className="mb-4 p-4 bg-base-100 rounded-lg shadow-sm">
          <textarea
            className="textarea textarea-bordered w-full mb-2 focus:textarea-info"
            rows={3}
            placeholder={t.t("commentPlaceholder")}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            maxLength={textareaMaxLength}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setIsAddingComment(false)}
            >
              {t.t("cancel")}
            </button>
            <button
              className="btn btn-sm btn-info"
              onClick={handleAddNewComment}
              disabled={!newCommentText.trim() || (typeof textareaMaxLength === "number" && textareaMaxLength >= 0 && newCommentText.length > textareaMaxLength)}
            >
              {t.t("add")}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6">
        <div className="space-y-3 lg:pr-4">
          <div className="lg:sticky lg:top-4">
            {comments.length > 0 && (
              <h4 className="font-semibold text-xs text-base-content/70 flex items-center gap-2 mb-3">
                💬 {t.t("comments")}
                <span className="badge badge-info badge-xs">{comments.length}</span>
              </h4>
            )}

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
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
        </div>

        <div className="space-y-4 min-w-0">
          <div>
            <div className="text-sm text-base-content/70 bg-base-100 p-4 rounded-lg transition break-words min-h-[80px]">
              {renderEditor()}
              {displayValueOverride && (
                <div className="text-xs text-base-content/50 mt-2">
                  {displayValueOverride}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});
