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
  // Defense-in-depth: an unknown status (e.g. a future/leaked pipeline value)
  // falls back to the needs_review styling + label rather than an unstyled
  // chip with a raw i18n key.
  const safe: ReviewStatus = CLS[status] ? status : "needs_review";
  return <span className={`${CLS[safe]} ml-auto`} style={{ fontSize: 11 }}>{t.t(`status_${safe}`)}</span>;
}
