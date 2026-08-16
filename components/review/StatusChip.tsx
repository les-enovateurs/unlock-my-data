import Translator from "@/components/tools/t";
import dict from "@/i18n/PolicyReview.json";
import type { ReviewStatus, PolicyStatus } from "./reviewTypes";
import { normalizeStatus } from "./policyReviewModel";

const CLS: Record<PolicyStatus, string> = {
  // Not a review backlog — nobody can review what could not be fetched.
  texte_indisponible: "umd-chip umd-chip-danger",
  analyse_en_attente: "umd-chip umd-chip-info",
  relecture_en_attente: "umd-chip umd-chip-warn",
  relu: "umd-chip umd-chip-info",
  publie: "umd-chip umd-chip-safe",
};

export default function StatusChip({ status, lang }: { status: ReviewStatus; lang: string }) {
  const t = new Translator(dict as any, lang);
  // Accepts either vocabulary: sidecars written before 2026-08-16 still say
  // "needs_review". normalizeStatus also absorbs anything unrecognised, so a
  // stray value renders as "à relire" rather than a raw i18n key.
  const safe = normalizeStatus(status);
  return <span className={`${CLS[safe]} ml-auto`} style={{ fontSize: 11 }}>{t.t(`status_${safe}`)}</span>;
}
