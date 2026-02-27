"use client";

import { useState, useMemo } from "react";
import { X, Check } from "lucide-react";
import Translator from "@/components/tools/t";
import dict from "@/i18n/ReviewForms.json";
import React from "react";

interface FieldEditControlProps {
  field: string;
  currentValue: any;
  fieldLabel: string;
  fieldType: "text" | "textarea" | "select" | "multi";
  onSave: (newValue: any) => void;
  onCancel: () => void;
  lang: "fr" | "en";
}

export default React.memo(function FieldEditControl({
  field,
  currentValue,
  fieldLabel,
  fieldType,
  onSave,
  onCancel,
  lang
}: FieldEditControlProps) {
  const t = useMemo(() => new Translator(dict as any, lang), [lang]);
  const [editValue, setEditValue] = useState(currentValue || "");

  // Handle save
  const handleSave = () => {
    onSave(editValue);
  };

  // Handle keyboard submit (Ctrl+Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="p-4 bg-base-100 rounded-lg shadow-sm mb-3">
      {/* Current value display */}
      <div className="mb-3">
        <p className="text-xs text-base-content/60 mb-1">{t.t("noValue")}</p>
        <div className="text-sm p-2 bg-base-200/60 rounded min-h-[40px] break-words">
          {currentValue || t.t("noValue")}
        </div>
      </div>

      {/* Edit input */}
      <div className="mb-3">
        <label className="block text-sm font-semibold mb-2">
          {fieldLabel} *
        </label>

        {fieldType === "textarea" ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={fieldLabel}
            className="textarea textarea-bordered w-full"
            rows={4}
          />
        ) : fieldType === "select" ? (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">{t.t("noValue")}</option>
            <option value={editValue}>{editValue}</option>
          </select>
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={fieldLabel}
            className="input input-bordered w-full"
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        <button
          className="btn btn-sm btn-ghost gap-1"
          onClick={onCancel}
          aria-label={t.t("cancelEdit")}
        >
          <X size={16} />
          {t.t("cancelEdit")}
        </button>
        <button
          className="btn btn-sm btn-success gap-1"
          onClick={handleSave}
          disabled={editValue === currentValue}
          aria-label={t.t("saveEdit")}
        >
          <Check size={16} />
          {t.t("saveEdit")}
        </button>
      </div>
    </div>
  );
});
