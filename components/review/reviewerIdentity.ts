/**
 * Shared reviewer identity + local-save addressing for the two review tools
 * (classic fiche review and privacy-policy human review).
 */

export const ANONYMOUS = "Anonymous";

/** Local save bridge started with `npm run review-server`. */
export const REVIEW_SERVER_PORT = 3002;

export function normalizeReviewerName(name: string | null | undefined): string {
  return (name || "").trim();
}

/**
 * Author recorded for an *update* (contributions-history, `updated_by`, PR body).
 *
 * Never falls back to another identity carried by the fiche: attributing an
 * update to `created_by` credits the creator for work they did not do, and that
 * bogus entry then feeds contributors-stats and the engagement certificates.
 */
export function resolveUpdateAuthor(
  reviewerName: string | null | undefined,
  _fiche?: { created_by?: string }
): string {
  return normalizeReviewerName(reviewerName) || ANONYMOUS;
}

/**
 * Base URL of the local save bridge. Derived from the host currently serving
 * the page so the tool still saves when the dev server is opened through the
 * LAN address (`next dev` also prints a Network URL); a hardcoded `localhost`
 * resolves to the *visiting* device and fails with a bare network error.
 */
export function reviewSaveBase(hostname?: string): string {
  const host =
    hostname ?? (typeof window !== "undefined" ? window.location.hostname : "");
  return `http://${host || "localhost"}:${REVIEW_SERVER_PORT}`;
}

/**
 * Turn a failed local save into something a volunteer can act on: a rejected
 * fetch means nothing is listening on the bridge, not that the data was bad.
 */
export function localSaveErrorMessage(error: unknown, lang: string): string {
  const detail = error instanceof Error ? error.message : String(error);
  const unreachable =
    error instanceof TypeError || /failed to fetch|network|load failed/i.test(detail);
  if (unreachable) {
    return lang === "fr"
      ? "Serveur de sauvegarde local injoignable. Lancez « npm run review-server » dans un autre terminal, puis réessayez."
      : "Local save server unreachable. Run “npm run review-server” in another terminal, then retry.";
  }
  return lang === "fr"
    ? `Échec de l'enregistrement local : ${detail}`
    : `Local save failed: ${detail}`;
}
