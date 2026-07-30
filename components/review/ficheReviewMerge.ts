import type { ReviewSidecar } from "./reviewTypes";

export interface FicheMergeResult {
  published: boolean;
  isRejected: (key: string) => boolean;
  isValidated: (key: string) => boolean;
  /** Citation to display: a published reviewer correction wins over the IA quote. */
  quoteFor: (key: string, iaQuote?: string) => string | undefined;
}

export function buildFicheMerge(sidecar: ReviewSidecar | null): FicheMergeResult {
  const published = sidecar?.status === "published";
  const items = sidecar?.items || {};
  return {
    published,
    isRejected: (key) => published && items[key]?.verdict === "rejected",
    isValidated: (key) => published && items[key]?.verdict === "validated",
    quoteFor: (key, iaQuote) => (published && items[key]?.corrected_quote) || iaQuote,
  };
}
