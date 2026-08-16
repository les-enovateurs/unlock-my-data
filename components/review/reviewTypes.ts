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

/**
 * Where a service stands. The queue used to file three different situations
 * under `needs_review`: a policy nobody could fetch, one fetched but not yet
 * analysed, and one genuinely waiting for a reviewer. They need different
 * screens — the first needs a paste box, not a review grid — so they are
 * different states.
 */
export type PolicyStatus =
  | "texte_indisponible"      // récupération impossible (mur anti-bot, JS)
  | "analyse_en_attente"      // texte présent, LLM pas encore passé
  | "relecture_en_attente"    // analysé, personne n'a relu
  | "relu"                    // un bénévole a terminé
  | "publie";                 // un mainteneur a publié

/** The vocabulary written before 2026-08-16. Still on disk, still read. */
export type LegacyStatus = "needs_review" | "human_reviewed" | "published";

/** What may be found in a stored sidecar: either vocabulary. */
export type ReviewStatus = PolicyStatus | LegacyStatus;

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
