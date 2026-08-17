/**
 * The policy text the pipeline analysed, published as data so the review screen
 * can highlight inside it — no iframe, no Ctrl-F, and no dependency on the
 * origin site still serving the page under a permissive CSP.
 */

export interface PolicyText {
  text: string;
  sha256: string;
  /** false = the file on disk is not the one the analysis ran on. Quote offsets
   *  may be stale, so the screen warns instead of pretending. */
  matchesAnalysis: boolean;
}

export interface PolicyTextDeps {
  fetchFn: typeof fetch;
  digestFn: (bytes: ArrayBuffer) => Promise<string>;
}

export function policyTextUrl(slug: string): string {
  return `/data/policy-analysis/text/${slug}.md`;
}

/** Hex sha256 over the served bytes — the pipeline hashes the same bytes. */
export async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Injected rather than called directly: crypto.subtle does not exist in the
// jsdom test environment, and a hash helper is not worth a polyfill.
const DEFAULT_DEPS: PolicyTextDeps = {
  fetchFn: (...args: Parameters<typeof fetch>) => fetch(...args),
  digestFn: sha256Hex,
};

export async function loadPolicyText(
  slug: string,
  expectedSha: string,
  deps: PolicyTextDeps = DEFAULT_DEPS
): Promise<PolicyText | null> {
  try {
    const r = await deps.fetchFn(policyTextUrl(slug));
    if (!r.ok) return null;
    const bytes = await r.arrayBuffer();
    const sha256 = await deps.digestFn(bytes);
    return {
      text: new TextDecoder().decode(bytes),
      sha256,
      matchesAnalysis: Boolean(expectedSha) && sha256 === expectedSha,
    };
  } catch (e) {
    // A missing file, a 404 served as HTML, an offline browser: the screen
    // falls back to the "no published text" panel rather than breaking. Logged
    // because a silent null here reads exactly like "this service has no text".
    console.warn(`loadPolicyText(${slug}) failed:`, e);
    return null;
  }
}
