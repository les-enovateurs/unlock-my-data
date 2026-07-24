import Translator from "@/components/tools/t";
import dict from "@/i18n/PolicyReview.json";
import type { ReviewStatus } from "./reviewTypes";

const CLS: Record<ReviewStatus, string> = {
  needs_review: "umd-chip umd-chip-warn",
  human_reviewed: "umd-chip umd-chip-info",
  published: "umd-chip umd-chip-safe",
};

export default function StatusChip({ status, lang }: { status: ReviewStatus; lang: string }) {
  const t = new Translator(dict as any, lang);
  return <span className={CLS[status]} style={{ fontSize: 11 }}>{t.t(`status_${status}`)}</span>;
}
