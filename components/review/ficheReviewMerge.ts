import type { ReviewSidecar } from "./reviewTypes";
import { normalizeStatus } from "./policyReviewModel";

export interface FicheMergeResult {
  published: boolean;
  isRejected: (key: string) => boolean;
  isValidated: (key: string) => boolean;
  /** Citation to display: a published reviewer correction wins over the IA quote. */
  quoteFor: (key: string, iaQuote?: string) => string | undefined;
}

export function buildFicheMerge(sidecar: ReviewSidecar | null): FicheMergeResult {
  // The review tool writes `publie`; `published` is the pre-2026-08-16 spelling.
  const published = normalizeStatus(sidecar?.status) === "publie";
  const items = sidecar?.items || {};
  return {
    published,
    isRejected: (key) => published && items[key]?.verdict === "rejected",
    isValidated: (key) => published && items[key]?.verdict === "validated",
    quoteFor: (key, iaQuote) => (published && items[key]?.corrected_quote) || iaQuote,
  };
}
