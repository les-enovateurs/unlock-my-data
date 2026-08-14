import type { RecipientKindKey } from "./policyTaxonomy";

/** Rejection reasons, deliberately three: the six-reason grid was never used.
 *  A reason a volunteer cannot explain in one line is a reason nobody picks. */
export type RejectReason =
  | "citation_absente"      // le passage cité n'est pas dans la politique
  | "hors_sujet"            // le passage existe mais ne dit pas ça
  | "mauvaise_categorie";   // le passage existe et dit ça, mais pas ici

export const REJECT_REASONS: RejectReason[] = [
  "citation_absente", "hors_sujet", "mauvaise_categorie",
];

export type RecipientKind = RecipientKindKey;

/**
 * A vendor the AI missed, typed in by a volunteer with the quote that names it.
 * P1 keeps it as free text carried by its citation — no id, no country, no
 * table: freezing a taxonomy before seeing 20 real services is what produced
 * the 68-criterion grid nobody used. The quote is re-verified in CI on the PR
 * (the source markdown is not shipped to the browser).
 */
export interface AddedRecipient {
  name: string;
  kind: RecipientKind;
  quote: string;
  by: string;
  at: string;
}

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
  added_recipients: AddedRecipient[];
}
