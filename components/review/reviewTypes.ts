/** Rejection reasons, deliberately three: the six-reason grid was never used.
 *  A reason a volunteer cannot explain in one line is a reason nobody picks. */
export type RejectReason =
  | "citation_absente"      // le passage cité n'est pas dans la politique
  | "hors_sujet"            // le passage existe mais ne dit pas ça
  | "mauvaise_categorie";   // le passage existe et dit ça, mais pas ici

export const REJECT_REASONS: RejectReason[] = [
  "citation_absente", "hors_sujet", "mauvaise_categorie",
];

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
