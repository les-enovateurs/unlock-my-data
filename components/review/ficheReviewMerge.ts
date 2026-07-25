import type { ReviewSidecar } from "./reviewTypes";

export interface FicheMergeResult {
  published: boolean;
  isRejected: (key: string) => boolean;
  isValidated: (key: string) => boolean;
}

export function buildFicheMerge(sidecar: ReviewSidecar | null): FicheMergeResult {
  const published = sidecar?.status === "published";
  const items = sidecar?.items || {};
  return {
    published,
    isRejected: (key) => published && items[key]?.verdict === "rejected",
    isValidated: (key) => published && items[key]?.verdict === "validated",
  };
}
