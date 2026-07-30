export type RejectReason =
  | "hallucinated" | "wrong_category" | "partial_or_stitched"
  | "out_of_context" | "translation" | "other";

export type ReviewStatus = "needs_review" | "human_reviewed" | "published";

export interface ReviewItemVerdict {
  verdict: "validated" | "rejected";
  reason: RejectReason | null;
  note: string;
  by: string;
  at: string;
  /** Reviewer-rewritten citation. Lives here, never in the IA JSON, which the
   *  pipeline regenerates. Absent/null = the IA quote stands as-is. */
  corrected_quote?: string | null;
}

export interface Reviewer { name: string; date: string; action: string }

export interface ReviewSidecar {
  slug: string;
  status: ReviewStatus;
  reviewers: Reviewer[];
  items: Record<string, ReviewItemVerdict>;
  service_note: string;
  updated_at: string;
}
