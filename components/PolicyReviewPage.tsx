"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import Translator from "@/components/tools/t";
import dict from "@/i18n/PolicyReview.json";
import type { ReviewSidecar, RejectReason } from "@/components/review/reviewTypes";
import { REJECT_REASONS } from "@/components/review/reviewTypes";
import {
  computeInvItems, invGroup, axisProgress, untreatedCount, normalizeSidecar,
  resolveSpan, splitEssentials, deriveStatus, nextUntreatedKey, redirectTargets,
  quoteRef, staleVerdicts, normalizeStatus, queueStats,
  AXIS_ORDER, type AxisKey, type InvItem,
} from "@/components/review/policyReviewModel";
import { hintForItem, AXIS_META } from "@/components/review/reviewHints";
import { splitQueue } from "@/components/review/priorityServices";
import {
  loadVendors, knownVendorFn, lookupVendor, recordVendorVerdict,
  vendorUpdateFor, type VendorRegistry,
} from "@/components/review/vendors";
import PolicySourcePane from "@/components/review/PolicySourcePane";
import ReviewGuide from "@/components/review/ReviewGuide";
import { loadPolicyText, type PolicyText } from "@/components/review/policyText";
import { creditContributor } from "@/components/review/creditContributor";
import { useReviewer } from "@/components/review/useReviewer";
import ReviewerNameField from "@/components/review/ReviewerNameField";
import StatusChip from "@/components/review/StatusChip";
import { createReviewPR, createPolicyTextPR } from "@/tools/github";
import {
  normalizeReviewerName, reviewSaveBase, localSaveErrorMessage,
} from "@/components/review/reviewerIdentity";
import {
  CATEGORY_ORDER, CATEGORY_META,
} from "@/components/review/policyTaxonomy";

type IndexRow = {
  slug: string; service_name: string; ia_status: string; has_inventory: boolean;
  analyzed_at: string | null; review_status: ReviewSidecar["status"]; needs_count: number;
};
type ProblemRow = {
  slug: string; service_name: string; status: string; detail: string;
  policy_url: string | null; suggested_action: string;
};

const CAT_META_INPUT = { CATEGORY_ORDER: [...CATEGORY_ORDER], CATEGORY_META };

/** Unsent verdicts survive a refresh: nothing reaches the server until submit. */
const draftKey = (slug: string) => `umd-policy-review-draft:${slug}`;

const AVATAR_COLORS = ["#202080", "#4a4fc4", "#09b1ba", "#e84545", "#0b6e90", "#9a6a00", "#2a8a4a"];
const avatarColor = (s: string) =>
  AVATAR_COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length];
const avatarLetter = (n: string) => (n?.trim()?.[0] || "?").toUpperCase();

function policyHost(url: string): string {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
}

function cleanQuote(q: string): string {
  return (q || "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
}

// UTF-8 read as latin-1 upstream ("numéro" → "numÃ©ro"). Mirror of
// looks_mojibaked() in the pipeline's fetch.py — keep the patterns in sync.
const MOJIBAKE = /[Ã][ ©¨ª¢´§«»]|[Â][«»  ]|â€[™œ]|â(?![a-zà-ÿ])/g;

function mojibakeCount(svc: any): number {
  if (!svc) return 0;
  try { return (JSON.stringify(svc).match(MOJIBAKE) || []).length; } catch { return 0; }
}

/** The citation to show: a reviewer correction wins over the IA extraction. */
function shownQuote(key: string, iaQuote: string, sidecar: ReviewSidecar | null): string {
  return sidecar?.items[key]?.corrected_quote || iaQuote;
}

function FieldHint({ itemKey, criterion, label }: { itemKey: string; criterion?: string; label: string }) {
  const hint = hintForItem(itemKey, criterion);
  if (!hint) return null;
  return <p className="prv-hint"><b>{label}</b> — {hint}</p>;
}

export default function PolicyReviewPage({ lang }: { lang: "fr" | "en" }) {
  const t = new Translator(dict as any, lang);
  const tt = (k: string) => t.t(k);
  const { name, setName } = useReviewer();

  const [services, setServices] = useState<IndexRow[]>([]);
  const [problems, setProblems] = useState<ProblemRow[]>([]);
  const [tab, setTab] = useState<"queue" | "problems">("queue");
  const [view, setView] = useState<"queue" | "detail">("queue");
  const [selected, setSelected] = useState<string | null>(null);
  const [svc, setSvc] = useState<any>(null);
  const [sidecar, setSidecar] = useState<ReviewSidecar | null>(null);
  const [rejectingKey, setRejectingKey] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [quoteDraft, setQuoteDraft] = useState("");
  const [openAxis, setOpenAxis] = useState<Record<AxisKey, boolean>>({
    signalement: true, quoi: true, pourquoi: true, ou: true, qui: true,
  });
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ prUrl?: string } | null>(null);
  const [authError, setAuthError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [policyText, setPolicyText] = useState<PolicyText | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  // "Right passage, wrong section" asks where it belonged before it submits.
  const [redirectingKey, setRedirectingKey] = useState<string | null>(null);
  const [redirectDraft, setRedirectDraft] = useState("");
  const [vendors, setVendors] = useState<VendorRegistry>({});
  const [pasteDraft, setPasteDraft] = useState("");
  // The already-analysed text, editable in place: a volunteer fixing Doctolib's
  // Annex 1 has to re-paste fifty thousand characters otherwise, and a paste
  // that stops short silently deletes the rest of the policy.
  const [editDraft, setEditDraft] = useState("");
  const [dirty, setDirty] = useState(false);
  const nameFieldRef = useRef<HTMLDivElement | null>(null);

  const [isDev, setIsDev] = useState(false);
  useEffect(() => { setIsDev(process.env.NODE_ENV === "development"); }, []);

  // Opening a service (or leaving it) reloads the editable copy from the text
  // that was actually analysed — never from the previous service's draft.
  useEffect(() => { setEditDraft(policyText?.text ?? ""); }, [policyText]);

  useEffect(() => {
    const grab = <T,>(url: string, fallback: T): Promise<T> =>
      fetch(url).then((r) => (r.ok ? r.json() : fallback)).catch(() => fallback);
    grab<{ services: IndexRow[] }>("/data/policy-analysis/_index.json", { services: [] })
      .then((d) => setServices(d.services || []));
    grab<{ problems: ProblemRow[] }>("/data/policy-analysis/_problems.json", { problems: [] })
      .then((d) => setProblems(d.problems || []));
    // A vendor already ruled on elsewhere is not asked about again (lot E).
    loadVendors().then(setVendors);
  }, []);

  /** The open service lives in the URL (`?service=<slug>`).
   *
   *  Without it a refresh dropped the volunteer back at the top of a 113-row
   *  queue, losing the fiche in progress — and a review could not be linked to
   *  or resumed. `syncUrl` is false when we are *reacting* to the URL (restore
   *  on mount, Back button), so history is not rewritten under our feet. */
  const openService = useCallback(async (slug: string, syncUrl = true) => {
    if (syncUrl) {
      window.history.pushState({ service: slug }, "",
        `${window.location.pathname}?service=${encodeURIComponent(slug)}`);
    }
    setSelected(slug); setView("detail");
    setRejectingKey(null); setNoteDraft(""); setQuoteDraft(""); setEditingKey(null);
    setOpenAxis({ signalement: true, quoi: true, pourquoi: true, ou: true, qui: true });
    setSaved(null); setAuthError(false); setNameError(false); setPasteDraft("");
    const grab = <T,>(url: string, fallback: T): Promise<T> =>
      fetch(url).then((r) => (r.ok ? r.json() : fallback)).catch(() => fallback);
    const [a, s] = await Promise.all([
      grab<any>(`/data/policy-analysis/${slug}.json`, null),
      grab<ReviewSidecar | null>(`/data/policy-analysis/reviews/${slug}.json`, null),
    ]);
    setSvc(a);
    // A draft left by an earlier visit wins over the file on disk: it holds
    // verdicts that were never sent.
    let restored: ReviewSidecar | null = null;
    try {
      const raw = window.localStorage.getItem(draftKey(slug));
      if (raw) {
        const d = JSON.parse(raw);
        restored = d?.sidecar || null;
        if (d?.vendors) setVendors(d.vendors);
      }
    } catch { /* unreadable draft: fall back to disk */ }
    setSidecar(restored ? normalizeSidecar(slug, restored) : normalizeSidecar(slug, s));
    setDirty(Boolean(restored));
    setActiveKey(null);
    // Loaded on demand, one file per session (~150 kB): shipping 15 MB of
    // policy text to every visitor to serve one reviewer would be absurd.
    setPolicyText(a ? await loadPolicyText(slug, a?.source?.content_sha256 || "") : null);
  }, []);

  const backToQueue = useCallback((syncUrl = true) => {
    if (syncUrl) window.history.pushState({}, "", window.location.pathname);
    setView("queue"); setSelected(null); setSvc(null); setSidecar(null);
    setPolicyText(null); setActiveKey(null);
  }, []);

  // Restore on load, and follow the Back button rather than fighting it.
  useEffect(() => {
    const fromUrl = () => new URLSearchParams(window.location.search).get("service");
    const slug = fromUrl();
    if (slug) openService(slug, false);
    const onPop = () => {
      const s = fromUrl();
      if (s) openService(s, false); else backToQueue(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [openService, backToQueue]);

  // A slug absent from the index (typo, retired service) would otherwise leave
  // the page blank, since the detail view needs its index row to render.
  useEffect(() => {
    if (view === "detail" && selected && services.length
        && !services.some((r) => r.slug === selected)) backToQueue();
  }, [services, view, selected, backToQueue]);

  // ---- derived (detail) ----
  const items: InvItem[] = svc && sidecar ? computeInvItems({ ...svc, slug: selected }, CAT_META_INPUT) : [];
  const progress = sidecar ? axisProgress(items, sidecar) : null;

  // What the screen opens on. A company settled on an earlier service drops out
  // of the essentials here — that is what makes the workload fall from one
  // service to the next. An absent registry simply means nothing is settled yet.
  const { essential, rest } = splitEssentials(items, { knownVendor: knownVendorFn(vendors) });

  // Verdicts cast on a citation the pipeline has since rewritten. Positional
  // keys make this silent otherwise: doctolib's signal/2 went from
  // "conservation_indefinie" to "inference_sensible" in one re-analysis.
  const stale = useMemo(
    () => (sidecar ? staleVerdicts(items, sidecar) : new Set<string>()),
    [items, sidecar]);

  // The counter follows the essentials, not the full inventory: 0/40 tells a
  // volunteer the job is hopeless, 0/15 tells them it is finishable.
  // A verdict cast on a citation that has since changed counts as untreated:
  // the volunteer never ruled on what is on screen now.
  const remaining = sidecar
    ? untreatedCount(essential, sidecar) + essential.filter((it) => stale.has(it.key)).length
    : 0;
  const treated = essential.length - remaining;

  // The passage to highlight follows the clicked item, and follows a reviewer's
  // correction rather than the IA quote it replaced.
  const activeItem = items.find((it) => it.key === activeKey) || null;
  const activeSpan = activeItem && policyText
    ? resolveSpan(
        { quote: shownQuote(activeItem.key, activeItem.quote, sidecar), span: activeItem.span },
        policyText.text)
    : null;

  // Citations the pane cannot locate. Worth saying *before* the volunteer
  // clicks one and watches nothing happen — and it is a defect in itself: a
  // quote that matches nowhere was reworded or spliced by the model.
  const unlocatable = useMemo(() => {
    if (!policyText) return new Set<string>();
    return new Set(items
      .filter((it) => !resolveSpan(
        { quote: shownQuote(it.key, it.quote, sidecar), span: it.span }, policyText.text))
      .map((it) => it.key));
  }, [items, policyText, sidecar]);

  // ---- persistence ----

  /** Every verdict is signed: without a pseudo the review cannot be credited.
   *
   *  Checked *before* any panel is closed, and the field is scrolled into view:
   *  the guard used to fire after setVerdict had already cleared the reject
   *  panel, so a volunteer with no pseudo saw the card close, nothing saved, and
   *  the only explanation sitting off-screen at the top of the page. */
  const requireName = useCallback(() => {
    if (normalizeReviewerName(name)) return true;
    setNameError(true);
    nameFieldRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }, [name]);

  /** Record a verdict locally. Nothing is sent yet.
   *
   *  Sending on every click produced one branch and one pull request per
   *  verdict — fifteen PRs for one service, each superseding the last. Verdicts
   *  now accumulate here and leave in a single PR when the volunteer submits.
   *  The draft is mirrored to localStorage so a refresh does not lose an
   *  afternoon's work now that nothing is written server-side as you go. */
  /** The only thing that talks to the network: one save, one pull request. */
  const send = useCallback(async (next: ReviewSidecar) => {
    setSaving(true); setSaved(null); setAuthError(false); setNameError(false);
    try {
      if (isDev) {
        const r = await fetch(`${reviewSaveBase()}/save-review`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: next.slug, sidecar: next, vendors }),
        });
        if (!r.ok) throw new Error(await r.text());
        setSaved({});
      } else {
        if (!process.env.NEXT_PUBLIC_GITHUB_TOKEN) { setAuthError(true); return; }
        const prUrl = await createReviewPR(
          next, next.slug, name,
          `🔍 Review: ${svc?.service_name || next.slug}`,
          `Relecture de la politique de confidentialité — ${svc?.service_name || next.slug} (statut : ${next.status})`,
          vendors,
        );
        setSaved({ prUrl });
      }
      setSidecar(next);
      setDirty(false);
      try { window.localStorage.removeItem(draftKey(next.slug)); } catch { /* ignore */ }
      setServices((prevRows) => prevRows.map((r) =>
        r.slug === next.slug
          ? { ...r, review_status: next.status, needs_count: untreatedCount(essential, next) }
          : r));
    } catch (e) {
      console.error("send-review failed:", e);
      // The draft is untouched, so nothing is lost — the volunteer can retry.
      alert(isDev ? localSaveErrorMessage(e, lang) : (lang === "fr" ? "Échec de l'envoi." : "Submit failed."));
    } finally {
      setSaving(false);
    }
  }, [isDev, name, svc, lang, vendors, essential]);

  const persist = useCallback((next: ReviewSidecar,
                               nextVendors: VendorRegistry | null = null) => {
    if (!requireName()) return;
    next.updated_at = new Date().toISOString();
    setSidecar({ ...next });
    if (nextVendors) setVendors(nextVendors);
    setDirty(true);
    setSaved(null); setAuthError(false);
    try {
      window.localStorage.setItem(draftKey(next.slug),
        JSON.stringify({ sidecar: next, vendors: nextVendors ?? vendors }));
    } catch { /* private mode / quota: the in-memory draft still stands */ }
  }, [requireName, vendors]);

  /**
   * Send the whole review: one save, one pull request.
   *
   * The status is derived, not asked: a service with no essential left to rule
   * on is "relu", anything less stays "à relire". A button asking the volunteer
   * to declare themselves finished only invites the wrong answer.
   */
  const submitReview = useCallback(async () => {
    if (!requireName() || !sidecar) return;
    const remainingNow = untreatedCount(essential, sidecar);
    const today = new Date().toISOString().split("T")[0];
    const next: ReviewSidecar = {
      ...sidecar,
      status: remainingNow === 0 ? "relu" : "relecture_en_attente",
      reviewers: creditContributor(sidecar.reviewers, name, today, "reviewed"),
      updated_at: new Date().toISOString(),
    };
    await send(next);
  }, [requireName, name, sidecar, essential, send]);

  const setVerdict = useCallback((
    key: string, verdict: "validated" | "rejected", reason: RejectReason | null, note: string,
    correctedQuote: string | null = null, redirectTo: string | null = null,
  ) => {
    if (!sidecar) return;
    // Before clearing any panel: an unsigned verdict is not going to be saved,
    // and closing the editor first would lose what the volunteer typed.
    if (!requireName()) return;
    // A correction already stored survives a later verdict that carries none.
    const corrected = correctedQuote ?? sidecar.items[key]?.corrected_quote ?? null;
    const next: ReviewSidecar = {
      ...sidecar,
      items: {
        ...sidecar.items,
        [key]: {
          verdict, reason, note, by: normalizeReviewerName(name), at: new Date().toISOString(),
          ...(corrected ? { corrected_quote: corrected } : {}),
          ...(redirectTo ? { redirect_to: redirectTo } : {}),
          // What was actually on screen when they ruled, so a later
          // re-analysis cannot move this verdict onto another citation.
          quote_ref: quoteRef(corrected || items.find((i) => i.key === key)?.quote || ""),
        },
      },
    };
    setRejectingKey(null); setNoteDraft(""); setEditingKey(null);
    setRedirectingKey(null); setRedirectDraft("");

    // A verdict on a vendor card also settles (or reopens) the company, so the
    // next service naming it does not ask again. Only vendor items and only
    // verdicts that speak to the company reach the registry — vendorUpdateFor
    // decides, and returns null for everything else.
    const it = items.find((i) => i.key === key);
    const vu = it && vendorUpdateFor(it, verdict, reason, {
      service: next.slug, by: normalizeReviewerName(name), at: new Date().toISOString(),
    });
    persist(next, vu ? recordVendorVerdict(vendors, vu) : null);
  }, [sidecar, name, lang, persist, requireName, items, vendors]);

  /**
   * Take a verdict back.
   *
   * A misclick on "marquer comme faux" used to be permanent for the session:
   * re-ruling the other way left the wrong reason and the wrong note attached,
   * and the item never returned to the untreated count. Removing the entry puts
   * the card back exactly where it was.
   *
   * The vendor registry is deliberately left alone: it is shared across
   * services, and one volunteer undoing a click here should not silently
   * reopen a company another review already settled.
   */
  const clearVerdict = useCallback((key: string) => {
    if (!sidecar) return;
    const items_ = { ...sidecar.items };
    delete items_[key];
    setRejectingKey(null); setNoteDraft(""); setEditingKey(null);
    setRedirectingKey(null); setRedirectDraft("");
    persist({ ...sidecar, items: items_ });
  }, [sidecar, persist]);

  /** Maintainer action (publish). Goes out immediately — it is one click, not a
   *  session of verdicts. */
  const setStatus = useCallback((status: ReviewSidecar["status"], action: string) => {
    if (!sidecar) return;
    const today = new Date().toISOString().split("T")[0];
    const next: ReviewSidecar = {
      ...sidecar, status,
      reviewers: creditContributor(sidecar.reviewers, name, today, action),
    };
    send(next);
  }, [sidecar, name, send]);

  // Open inline editor on one card at a time, seeded with the citation
  // currently shown for it (a previous correction wins over the IA quote).
  const startEdit = useCallback((it: InvItem) => {
    setEditingKey(it.key);
    setQuoteDraft(shownQuote(it.key, it.quote, sidecar));
    setRejectingKey(null);
  }, [sidecar]);

  // Verdict on one card, carrying whatever note/quote draft is in flight for it.
  const submitItem = useCallback((it: InvItem, verdict: "validated" | "rejected",
                                  reason: RejectReason | null, redirectTo: string | null = null) => {
    // Guarded here too: closing the editor first would discard a correction the
    // volunteer just typed for a verdict that was never going to be saved.
    if (!requireName()) return;
    const draft = editingKey === it.key ? quoteDraft.trim() : "";
    const corrected = draft && draft !== it.quote.trim() ? draft : null;
    const note = rejectingKey === it.key ? noteDraft : (sidecar?.items[it.key]?.note || "");
    setEditingKey(null);
    setRedirectingKey(null); setRedirectDraft("");
    setVerdict(it.key, verdict, reason, note, corrected, redirectTo);

    // Move to the next card to rule on, and highlight its citation: a session
    // is fifteen verdicts, and scrolling back to find where one was is the
    // slowest part of it. Only the essentials are walked — the rest of the
    // inventory is not what this screen is asking for.
    if (!sidecar) return;
    const nextKey = nextUntreatedKey(essential, sidecar, it.key);
    setActiveKey(nextKey);
    if (nextKey) {
      // After the re-render that paints the new card as active. "nearest", and
      // only when the card is off-screen: picking a reject reason submits on
      // the click, and a page that jumps under a volunteer mid-sentence is
      // worse than a card they scroll to themselves.
      requestAnimationFrame(() => {
        const el = document.getElementById(`prv-card-${nextKey}`);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top >= 0 && r.bottom <= window.innerHeight) return;
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }, [editingKey, quoteDraft, rejectingKey, noteDraft, sidecar, setVerdict, requireName, essential]);

  const det = view === "detail" ? services.find((r) => r.slug === selected) : undefined;
  const hasInventory = det?.has_inventory && Boolean(svc?.data_inventory);
  // Which of the five situations this service is in — the screen branches on it.
  const status = deriveStatus(svc, sidecar);

  /** Save a policy a volunteer pasted by hand.
   *
   *  Writes the text exactly as the pipeline would, plus the sidecar that marks
   *  it as human-supplied: a reader must be able to tell a scraped policy from a
   *  pasted one. The LLM runs on the next pipeline pass, not here. */
  const savePolicyText = useCallback(async (raw: string, onSaved?: () => void) => {
    if (!requireName() || !selected) return;
    const text = raw.trim();
    if (text.length < 500) { alert(tt("pasteTooShort")); return; }
    setSaving(true); setAuthError(false); setSaved(null);
    try {
      if (isDev) {
        const r = await fetch(`${reviewSaveBase()}/save-policy-text`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: selected, text, by: normalizeReviewerName(name) }),
        });
        if (!r.ok) throw new Error(await r.text());
        setSaved({});
      } else {
        if (!process.env.NEXT_PUBLIC_GITHUB_TOKEN) { setAuthError(true); return; }
        const prUrl = await createPolicyTextPR(
          selected, text, normalizeReviewerName(name), svc?.service_name);
        setSaved({ prUrl });
      }
      alert(tt("pasteSaved"));
      onSaved?.();
    } catch (e) {
      console.error("save-policy-text failed:", e);
      alert(localSaveErrorMessage(e, lang));
    } finally {
      setSaving(false);
    }
  }, [selected, name, isDev, lang, requireName, tt, svc]);

  // ---- queue stats + sorting ----
  // Every status comparison goes through normalizeStatus: the index writes the
  // canonical French states, older sidecars still carry the English ones, and
  // comparing raw strings is what made the header read "0 à relire, 0 relus".
  const { toReview: needsReviewCount, reviewed: humanReviewedCount,
          published: publishedCount } = queueStats(services);
  const queueRows = [...services].map((s) => ({
    ...s,
    rank: !s.has_inventory ? -1 : s.needs_count > 0 ? 2
      : (normalizeStatus(s.review_status) === "publie" ? -2 : 0),
  })).sort((a, b) => b.rank - a.rank);
  const { priority: priorityRows } = splitQueue(queueRows);

  const modifierFichePath = lang === "fr" ? "/contribuer/modifier-fiche" : "/contribute/update-form";

  const renderQueueRow = (q: (typeof queueRows)[number]) => {
    // needs_count only counts items a human rejected, so 0 means "nobody has
    // been here yet" far more often than "all good" — it read as
    // "Inventaire vérifié ✓" on all 113 services, none of which had been
    // reviewed. Say what is actually known. (D3 gives the count real meaning.)
    const invLabel = !q.has_inventory
      ? (lang === "fr" ? "Inventaire non disponible" : "Inventory unavailable")
      : q.needs_count > 0
        ? `${q.needs_count} ${lang === "fr" ? "citation(s) à revoir" : "citation(s) to review"}`
        : ["relu", "publie"].includes(normalizeStatus(q.review_status))
          ? (lang === "fr" ? "Relu ✓" : "Reviewed ✓")
          : (lang === "fr" ? "À relire" : "Awaiting review");
    return (
      <button key={q.slug} className="umd-card umd-card-hover" onClick={() => openService(q.slug)}
        style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, textAlign: "left", font: "inherit", width: "100%", cursor: "pointer" }}>
        <span style={{ width: 42, height: 42, borderRadius: 12, background: avatarColor(q.slug), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontFamily: "var(--font-display)", flexShrink: 0 }}>{avatarLetter(q.service_name)}</span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <b style={{ fontSize: 15 }}>{q.service_name}</b>
            <StatusChip status={q.review_status} lang={lang} />
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--slate-600)" }}>{invLabel}</p>
        </div>
      </button>
    );
  };

  // Implemented in the next task; keeps the axis layout stable meanwhile.
  const renderAddRecipient = (): React.ReactNode => null;

  // Plain render function, called directly as renderItemCard(it) — NOT an
  // inner component. A component declared inside PolicyReviewPage would get a
  // new identity on every parent render, so React would unmount/remount its
  // subtree and the inline-edit <textarea autoFocus> would lose focus on
  // every keystroke.
  const renderItemCard = (it: InvItem) => {
    const v = sidecar!.items[it.key];
    const isVendor = it.key.startsWith("dest/") || it.key.startsWith("hebergeur/");
    const inherited = isVendor ? lookupVendor(vendors, it.label) : null;
    const group = invGroup(it, sidecar!);
    const shown = shownQuote(it.key, it.quote, sidecar);
    const editing = editingKey === it.key;
    const border = v?.verdict === "validated" ? "var(--green-200)"
      : v?.verdict === "rejected" ? "var(--red-200)" : "var(--slate-100)";
    return (
      <div key={it.key} id={`prv-card-${it.key}`} className="umd-card" style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, borderColor: border }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span className="umd-chip" style={{ fontSize: 10.5, background: "var(--slate-50)", borderColor: "var(--slate-200)", color: "var(--slate-600)" }}>{it.kind}</span>
          <b style={{ fontSize: 13.5, flex: 1, minWidth: 120 }}>{it.label}</b>
          {group === "verified" && <span className="umd-chip umd-chip-safe" style={{ fontSize: 10 }}>{tt("algoVerified")}</span>}
          {v?.corrected_quote && <span className="umd-chip umd-chip-warn" style={{ fontSize: 10 }}>{tt("correctedBadge")}</span>}
          {unlocatable.has(it.key) && <span className="umd-chip umd-chip-danger" style={{ fontSize: 10 }}>{tt("quoteNotFound")}</span>}
          {stale.has(it.key) && <span className="umd-chip umd-chip-warn" style={{ fontSize: 10 }}>{tt("staleVerdict")}</span>}
          {v && <span className={v.verdict === "validated" ? "umd-chip umd-chip-safe" : "umd-chip umd-chip-danger"} style={{ fontSize: 10 }}>{v.verdict === "validated" ? "✓" : "✗"}</span>}
        </div>
        <FieldHint itemKey={it.key} criterion={it.criterion} label={tt("expected")} />
        {inherited && (
          // Guard 3: an inherited verdict states its provenance rather than
          // asserting the company is fine. It covers the company, never this
          // citation — which verify.py checked locally, as always.
          <p className="prv-hint">
            {lang === "fr"
              ? `Prestataire déjà validé par ${inherited.by} sur ${inherited.services[0]} le ${inherited.at.slice(0, 10)}.`
              : `Vendor already validated by ${inherited.by} on ${inherited.services[0]}, ${inherited.at.slice(0, 10)}.`}
          </p>
        )}

        {editing ? (
          <>
            <textarea className="umd-input" autoFocus style={{ fontSize: 13, minHeight: 110, lineHeight: 1.5 }}
              value={quoteDraft} onChange={(e) => setQuoteDraft(e.target.value)} />
            <p className="prv-hint">{tt("editQuoteHint")}</p>
            {/* Only worth showing once a correction exists: until then the
                editor is seeded with the IA quote, so this repeated it. */}
            {v?.corrected_quote && (
              <details>
                <summary className="prv-hint" style={{ cursor: "pointer" }}>{tt("originalQuote")}</summary>
                <blockquote className="umd-quotebox" style={{ margin: "8px 0 0", fontSize: 12 }}>« {cleanQuote(it.quote)} »</blockquote>
              </details>
            )}
          </>
        ) : (
          // Clicking the quote — not the whole card — drives the highlight:
          // on the card, every button press would move it as a side effect.
          <blockquote className="umd-quotebox" onClick={() => setActiveKey(it.key)}
            style={{ margin: 0, fontSize: 13, cursor: "pointer",
                     outline: activeKey === it.key ? "2px solid var(--indigo-300)" : "none" }}>
            « {cleanQuote(shown)} »
          </blockquote>
        )}
        {!editing && unlocatable.has(it.key) && (
          <p className="prv-hint" style={{ color: "var(--red-700, #b91c1c)" }}>{tt("quoteNotFoundHint")}</p>
        )}
        {!editing && stale.has(it.key) && (
          <p className="prv-hint" style={{ color: "var(--amber-700, #b45309)" }}>{tt("staleVerdictHint")}</p>
        )}

        {rejectingKey === it.key ? (
          <div>
            {/* Note first, reason last: picking a reason submits immediately, so
                a note placed after the buttons (and collapsed, as it was) could
                never be written in the natural flow. */}
            <label style={{ display: "block", margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "var(--slate-700)" }}>
              {tt("noteToggle")}
            </label>
            <textarea className="umd-input" style={{ fontSize: 12, minHeight: 52, marginBottom: 12, width: "100%" }}
              placeholder={tt("notePlaceholder")} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
            <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "var(--slate-700)" }}>{tt("reasonPick")}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {REJECT_REASONS.map((r) => (
                <button key={r} className="prv-chip" disabled={saving}
                  data-active={r === "mauvaise_categorie" && redirectingKey === it.key ? "true" : undefined}
                  onClick={() => {
                    // "Wrong section" without saying which section throws away
                    // the one thing the volunteer knows and the model got wrong.
                    // Where the axis has no sections, submit as before.
                    if (r === "mauvaise_categorie" && redirectTargets(it.key, CAT_META_INPUT).length) {
                      setRedirectingKey(it.key); setRedirectDraft("");
                      return;
                    }
                    submitItem(it, "rejected", r);
                  }}>{tt(`reason_${r}`)}</button>
              ))}
              {/* The only screen with no way back: "garder"/"marquer comme faux"
                  are gone while the reasons are up, so a misclick on reject was
                  a dead end. Clears the stored verdict too, when there is one. */}
              <button type="button" className="prv-linkbtn" disabled={saving}
                onClick={() => (v ? clearVerdict(it.key)
                                  : (setRejectingKey(null), setNoteDraft(""),
                                     setRedirectingKey(null), setRedirectDraft("")))}>
                {tt("undoVerdict")}
              </button>
            </div>
            {redirectingKey === it.key && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--slate-700)" }}>{tt("redirectLabel")}</label>
                <select className="umd-input" style={{ fontSize: 12.5, padding: "6px 10px", width: "auto" }}
                  value={redirectDraft} onChange={(e) => setRedirectDraft(e.target.value)}>
                  <option value="">{tt("redirectPlaceholder")}</option>
                  {redirectTargets(it.key, CAT_META_INPUT).map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <button className="umd-btn umd-btn-primary umd-btn-sm" disabled={saving || !redirectDraft}
                  onClick={() => submitItem(it, "rejected", "mauvaise_categorie", redirectDraft)}>
                  {tt("redirectConfirm")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <button className="umd-btn umd-btn-ghost umd-btn-sm" disabled={saving} style={{ padding: "5px 12px", fontSize: 12 }}
              onClick={() => submitItem(it, "validated", null)}>{tt("keep")}</button>
            <button className="umd-btn umd-btn-ghost umd-btn-sm" disabled={saving} style={{ padding: "5px 12px", fontSize: 12, color: "var(--red-600)" }}
              onClick={() => { setRejectingKey(it.key); setNoteDraft(v?.note || ""); setEditingKey(null); }}>{tt("markFalse")}</button>
            <button type="button" className="prv-linkbtn"
              onClick={() => (editing ? setEditingKey(null) : startEdit(it))}>{editing ? tt("cancelEdit") : tt("editQuote")}</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ background: "var(--slate-50)", minHeight: "100vh" }}>
      <style>{`
        .prv-chip{border:1.5px solid var(--slate-200);background:#fff;border-radius:var(--radius-pill,9999px);padding:7px 14px;font-size:12.5px;font-weight:700;color:var(--fg2);cursor:pointer;display:inline-flex;align-items:center;gap:6px}
        .prv-chip[data-active="true"]{border-color:var(--indigo-500);background:var(--indigo-50);color:var(--indigo-800)}
        .prv-chip:hover{border-color:var(--indigo-300)}
        .prv-split{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:30px}
        @media (max-width:820px){.prv-split{grid-template-columns:1fr}}
        .prv-hint{margin:0;font-size:11.5px;line-height:1.45;color:var(--slate-600)}
        .prv-hint b{color:var(--slate-700)}
        .prv-aside{margin-top:14px;padding-top:10px;border-top:1px solid var(--slate-100)}
        .prv-aside>summary{list-style:none;cursor:pointer;font-size:11.5px;color:var(--slate-600)}
        .prv-aside>summary::-webkit-details-marker{display:none}
        .prv-aside>summary:hover{color:var(--indigo-700)}
        .prv-linkbtn{border:none;background:none;padding:0;font:inherit;font-size:11.5px;color:var(--indigo-700);cursor:pointer;text-decoration:underline}
      `}</style>

      {view === "queue" && (
        <div className="umd-wrap" style={{ padding: "32px 24px 90px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
            <div>
              <span className="umd-eyebrow">{tt("eyebrow")}</span>
              <h1 className="umd-heading-2" style={{ fontSize: 26, marginTop: 4 }}>{tt("queueTitle")}</h1>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div className="umd-card" style={{ padding: "12px 18px", textAlign: "center" }}><b style={{ fontSize: 22 }}>{needsReviewCount}</b><div style={{ fontSize: 12, color: "var(--slate-600)" }}>{tt("toReview")}</div></div>
              <div className="umd-card" style={{ padding: "12px 18px", textAlign: "center" }}><b style={{ fontSize: 22 }}>{humanReviewedCount}</b><div style={{ fontSize: 12, color: "var(--slate-600)" }}>{tt("reviewedUnpublished")}</div></div>
              <div className="umd-card" style={{ padding: "12px 18px", textAlign: "center" }}><b style={{ fontSize: 22 }}>{publishedCount}</b><div style={{ fontSize: 12, color: "var(--slate-600)" }}>{tt("published")}</div></div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="prv-chip" data-active={tab === "queue"} onClick={() => setTab("queue")}>{tt("tabQueue")} <span>{priorityRows.length}</span></button>
              <button className="prv-chip" data-active={tab === "problems"} onClick={() => setTab("problems")}>{tt("tabProblems")} <span>{problems.length}</span></button>
            </div>
            <ReviewerNameField lang={lang} value={name} onChange={setName} />
          </div>

          {tab === "queue" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 16 }}>{tt("startHere")}</h2>
                <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--slate-600)" }}>{tt("startHereHint")}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {priorityRows.map(renderQueueRow)}
                </div>
              </div>
              {/* The other services are unlisted, not removed: `?service=<slug>`
                  still opens any of them. Listing all 127 was the thing that
                  made the queue read as a chore nobody could finish. */}
            </div>
          )}

          {tab === "problems" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ margin: "0 0 6px", fontSize: 12.5, color: "var(--slate-600)" }}>{tt("problemsIntro")}</p>
              {problems.map((p) => (
                <div key={p.slug} className="umd-card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span className="umd-chip umd-chip-warn" style={{ fontSize: 11 }}>{p.status}</span>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <b style={{ fontSize: 14 }}>{p.service_name}</b>
                    <div style={{ fontSize: 12, color: "var(--slate-600)" }}>{p.detail || p.policy_url || ""}</div>
                  </div>
                  <Link href={`${modifierFichePath}?slug=${p.slug}`} className="umd-btn umd-btn-outline umd-btn-sm">{tt("proposeUrl")}</Link>
                </div>
              ))}
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--slate-600)", fontStyle: "italic" }}>{tt("reanalyseNote")}</p>
            </div>
          )}
        </div>
      )}

      {view === "detail" && det && (
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="umd-wrap" style={{ padding: "24px 24px 8px" }}>
            <button className="umd-btn umd-btn-ghost umd-btn-sm" onClick={() => backToQueue()} style={{ paddingLeft: 6, marginBottom: 14 }}>← {tt("backToQueue")}</button>

            {authError && (
              <div className="umd-alert umd-alert-danger" style={{ marginBottom: 12 }}>
                <div style={{ flex: 1 }}><p className="umd-alert-desc" style={{ margin: 0 }}>{tt("authError")}</p></div>
              </div>
            )}
            {nameError && (
              <div className="umd-alert umd-alert-danger" style={{ marginBottom: 12 }}>
                <div style={{ flex: 1 }}><p className="umd-alert-desc" style={{ margin: 0 }}>{tt("nameRequired")}</p></div>
              </div>
            )}
            {saved && (
              <div className="umd-alert umd-alert-safe" style={{ marginBottom: 12, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <p className="umd-alert-desc" style={{ margin: 0 }}>{tt("saved")}</p>
                  {saved.prUrl && <a href={saved.prUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: "var(--indigo-700)" }}>{tt("savedPr")} ↗</a>}
                </div>
              </div>
            )}

            <div className="umd-card" style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span style={{ width: 46, height: 46, borderRadius: 13, background: avatarColor(det.slug), color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontFamily: "var(--font-display)", fontSize: 18, flexShrink: 0 }}>{avatarLetter(det.service_name)}</span>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h2 className="umd-heading-3" style={{ fontSize: 19 }}>{det.service_name}</h2>
                {svc?.source?.policy_url && (
                  <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--slate-600)" }}>
                    <a href={svc.source.policy_url} target="_blank" rel="noreferrer">{policyHost(svc.source.policy_url)} ↗</a>
                    {det.analyzed_at ? ` · ${lang === "fr" ? "analysé le" : "analyzed"} ${det.analyzed_at}` : ""}
                  </p>
                )}
              </div>
              {sidecar && <StatusChip status={sidecar.status} lang={lang} />}
              {sidecar && normalizeStatus(sidecar.status) === "relu" && <button className="umd-btn umd-btn-safe umd-btn-sm" disabled={saving} onClick={() => setStatus("publie", "published")}>{tt("publish")}</button>}
              <div ref={nameFieldRef}>
                <ReviewerNameField lang={lang} value={name} onChange={setName} />
              </div>
            </div>
          </div>

          <main className="umd-wrap" style={{ padding: "16px 24px 90px" }}>
            {mojibakeCount(svc) >= 3 && (
              <div className="umd-alert umd-alert-warn" style={{ marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <p className="umd-alert-desc" style={{ margin: 0 }}>{tt("mojibakeWarn")}</p>
                </div>
              </div>
            )}
            {/* No text to review: the only useful action is to supply one.
                Telling a volunteer to "fix the URL" in front of an anti-bot wall
                is advice they cannot act on. */}
            {status === "texte_indisponible" && (
              <div className="umd-card" style={{ padding: "22px 24px", marginBottom: 20 }}>
                <h2 className="umd-heading-3" style={{ fontSize: 16, margin: "0 0 6px" }}>{tt("pasteTitle")}</h2>
                <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--slate-600)" }}>{tt("pasteHint")}</p>
                {svc?.source?.policy_url && (
                  <a href={svc.source.policy_url} target="_blank" rel="noreferrer"
                    className="umd-btn umd-btn-outline umd-btn-sm" style={{ marginBottom: 12 }}>
                    {tt("openWindow")} ↗
                  </a>
                )}
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>{tt("pasteLabel")}</label>
                <textarea className="umd-input" style={{ fontSize: 12.5, minHeight: 220, lineHeight: 1.5, width: "100%" }}
                  value={pasteDraft} onChange={(e) => setPasteDraft(e.target.value)} />
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                  <button className="umd-btn umd-btn-primary" disabled={saving}
                    onClick={() => savePolicyText(pasteDraft, () => setPasteDraft(""))}>{tt("pasteSave")}</button>
                  <span style={{ fontSize: 12, color: "var(--slate-600)" }}>{pasteDraft.trim().length} car.</span>
                </div>
              </div>
            )}

            {status === "analyse_en_attente" && (
              <div className="umd-card" style={{ padding: "22px 24px", borderColor: "var(--indigo-200)", background: "var(--indigo-50)", marginBottom: 20 }}>
                <p style={{ margin: 0, fontSize: 13, color: "var(--slate-700)" }}>{tt("awaitingAnalysis")}</p>
              </div>
            )}

            {status !== "texte_indisponible" && status !== "analyse_en_attente" && !hasInventory && (
              <div className="umd-card" style={{ padding: "22px 24px", borderColor: "var(--amber-400)", background: "var(--amber-50)", marginBottom: 20 }}>
                <p style={{ margin: 0, fontSize: 13, color: "var(--slate-700)" }}>{tt("inventoryUnavailable")}</p>
              </div>
            )}

            {hasInventory && sidecar && progress && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
                  <h2 className="umd-heading-3" style={{ fontSize: 17, margin: 0 }}>{tt("collectedData")}</h2>
                  <span style={{ fontSize: 12.5, color: "var(--slate-600)" }}>
                    {treated}/{essential.length} {tt("axisProgress")}
                    {remaining > 0 ? ` · ${remaining} ${tt("remaining")}` : ""}
                  </span>
                </div>
                <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--slate-600)" }}>{tt("sessionHint")}</p>

                {/* "Every quote is already verified — so what am I for?" is the
                    first thing a volunteer asks. Answer it where the work is. */}
                <ReviewGuide />

                {/* A policy whose text *is* published can still be the wrong
                    text: trafilatura drops tables, and a pasted policy stops
                    where the volunteer's selection stopped. Doctolib's Annex 1
                    — some seventy named subcontractors — is missing for exactly
                    that reason. So the box is pre-filled with the analysed text
                    and edited in place: asking for a fresh paste of fifty
                    thousand characters is how a missing table becomes a missing
                    half of the policy. */}
                {policyText && (
                  <details className="umd-card" style={{ padding: "14px 18px", marginBottom: 16 }}>
                    <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 700, color: "var(--slate-700)" }}>
                      {tt("replaceTextTitle")}
                    </summary>
                    <p style={{ margin: "10px 0 12px", fontSize: 12.5, color: "var(--slate-600)" }}>{tt("replaceTextHint")}</p>
                    {svc?.source?.policy_url && (
                      <p style={{ margin: "0 0 12px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <a href={svc.source.policy_url} target="_blank" rel="noreferrer"
                          className="umd-btn umd-btn-outline umd-btn-sm" style={{ display: "inline-flex" }}>
                          {tt("openWindow")} ↗
                        </a>
                        {/* The URL is shown, not just linked: several stored links
                            now redirect to a homepage, and a volunteer can only
                            report that if they can see where the button goes. */}
                        <span style={{ fontSize: 11.5, color: "var(--slate-600)", wordBreak: "break-all" }}>{svc.source.policy_url}</span>
                      </p>
                    )}
                    <textarea className="umd-input" style={{ fontSize: 12.5, minHeight: 260, lineHeight: 1.5, width: "100%" }}
                      aria-label={tt("replaceTextLabel")}
                      value={editDraft} onChange={(e) => setEditDraft(e.target.value)} />
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                      <button className="umd-btn umd-btn-primary umd-btn-sm"
                        disabled={saving || editDraft.trim() === policyText.text.trim()}
                        onClick={() => savePolicyText(editDraft)}>{tt("pasteSave")}</button>
                      {editDraft !== policyText.text && (
                        <button className="umd-btn umd-btn-ghost umd-btn-sm" disabled={saving}
                          onClick={() => setEditDraft(policyText.text)}>{tt("replaceTextReset")}</button>
                      )}
                      <span style={{ fontSize: 12, color: "var(--slate-600)" }}>
                        {tt("replaceTextCount")
                          .replace("{n}", String(editDraft.length))
                          .replace("{a}", String(policyText.text.length))}
                      </span>
                    </div>
                  </details>
                )}

                <div className="prv-split" style={{ marginBottom: 24 }}>
                  {policyText ? (
                    <PolicySourcePane text={policyText.text} activeSpan={activeSpan}
                      matchesAnalysis={policyText.matchesAnalysis} lang={lang} />
                  ) : (
                    <div className="umd-card" style={{ padding: "14px 18px", background: "var(--indigo-50)", borderColor: "var(--indigo-200)", alignSelf: "start" }}>
                      <p style={{ margin: 0, fontSize: 12.5, color: "var(--slate-700)" }}>{tt("noPublishedText")}</p>
                      {svc?.source?.policy_url && (
                        <a href={svc.source.policy_url} target="_blank" rel="noreferrer"
                          className="umd-btn umd-btn-outline umd-btn-sm" style={{ marginTop: 10 }}>{tt("openWindow")} ↗</a>
                      )}
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <section className="umd-card" style={{ padding: "16px 18px" }}>
                      <h3 style={{ margin: "0 0 2px", fontSize: 15 }}>{tt("essentialsTitle")}</h3>
                      <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "var(--slate-600)" }}>{tt("essentialsHint")}</p>
                      {essential.length === 0 ? (
                        <p style={{ margin: 0, fontSize: 12.5, color: "var(--slate-600)" }}>{tt("essentialsEmpty")}</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {essential.map((it) => renderItemCard(it))}
                        </div>
                      )}
                    </section>

                    {/* Everything else is still reachable, just not what the
                        screen opens on: 40 items on zalando, 15 of which are
                        worth a human. */}
                    <details>
                      <summary style={{ cursor: "pointer", fontSize: 13, color: "var(--slate-600)", padding: "6px 0" }}>
                        {tt("showFullDetail")} ({rest.length})
                      </summary>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
                    {AXIS_ORDER.map((axis) => {
                      const axisItems = rest.filter((it) => it.axis === axis);
                      const p = progress[axis];
                      const isOpen = openAxis[axis];
                      return (
                        <section key={axis} className="umd-card" style={{ padding: 0, overflow: "hidden" }}>
                          <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "var(--slate-50)", border: "none", cursor: "pointer", font: "inherit", textAlign: "left" }}
                            aria-expanded={isOpen}
                            onClick={() => setOpenAxis((o) => ({ ...o, [axis]: !isOpen }))}>
                            <span style={{ flex: 1 }}>
                              <b style={{ fontSize: 14 }}>{AXIS_META[axis].title}</b>
                              <span style={{ display: "block", fontSize: 11.5, color: "var(--slate-600)", marginTop: 2 }}>{AXIS_META[axis].question}</span>
                            </span>
                            <span style={{ fontSize: 12, color: "var(--slate-600)" }}>{p.treated}/{p.total}</span>
                            <span aria-hidden="true" style={{ fontSize: 12, color: "var(--slate-600)" }}>{isOpen ? "▾" : "▸"}</span>
                          </button>
                          {isOpen && (
                            <div style={{ padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                              {axisItems.length === 0 && (
                                <p style={{ margin: 0, fontSize: 12.5, color: "var(--slate-600)" }}>{tt("axisEmpty")}</p>
                              )}
                              {axisItems.map((it) => renderItemCard(it))}
                              {axis === "qui" && renderAddRecipient()}
                            </div>
                          )}
                        </section>
                      );
                    })}
                      </div>
                    </details>
                  </div>
                </div>

                {/* One submit for the whole session. Verdicts are buffered until
                    here, so a review is one branch, one pull request, one diff
                    to read — instead of one PR per click. Nothing declares the
                    volunteer "done": the status is derived from what is left. */}
                <div className="umd-card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", position: "sticky", bottom: 12, zIndex: 5 }}>
                  <p style={{ margin: 0, flex: 1, minWidth: 240, fontSize: 12.5, color: "var(--slate-600)" }}>
                    {/* "Nothing to send" next to twelve items left reads as "your
                        work was lost". Once verdicts are on disk, say so and
                        count them — the button is disabled because the session
                        is saved, not because nothing happened. */}
                    {dirty
                      ? tt("unsentChanges").replace("{n}", String(treated))
                      : remaining === 0 ? tt("submitHintDone")
                      : treated > 0
                        ? tt("submitHintSaved").replace("{t}", String(treated)).replace("{n}", String(remaining))
                        : tt("submitHintPartial").replace("{n}", String(remaining))}
                  </p>
                  <button className="umd-btn umd-btn-primary" disabled={saving || !dirty}
                    onClick={submitReview}>{tt("submitReview")}</button>
                </div>
              </>
            )}

            {/* Service-level note */}
            {sidecar && (
              <details style={{ marginTop: 14 }}>
                <summary className="umd-btn umd-btn-ghost umd-btn-sm" style={{ display: "inline-flex", cursor: "pointer" }}>{tt("serviceNote")}</summary>
                <textarea className="umd-input" style={{ fontSize: 12.5, minHeight: 60, marginTop: 10, width: "100%" }}
                  value={sidecar.service_note}
                  onChange={(e) => setSidecar({ ...sidecar, service_note: e.target.value })}
                  onBlur={() => sidecar && persist(sidecar)} />
              </details>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
