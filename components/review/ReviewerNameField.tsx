"use client";
import Translator from "@/components/tools/t";
import dict from "@/i18n/PolicyReview.json";

export default function ReviewerNameField(
  { lang, value, onChange }: { lang: string; value: string; onChange: (v: string) => void }
) {
  const t = new Translator(dict as any, lang);
  return (
    <label style={{ fontSize: 12.5, display: "flex", alignItems: "center", gap: 8, color: "var(--fg2)" }}>
      {t.t("youAre")}
      <input
        className="umd-input"
        style={{ fontSize: 12.5, padding: "6px 10px", width: 160 }}
        placeholder={t.t("pseudoPlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
