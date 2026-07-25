"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Translator from "@/components/tools/t";
import dict from "@/i18n/PolicyReview.json";
import type { ReviewSidecar, RejectReason } from "@/components/review/reviewTypes";
import {
  computeInvItems, invGroup, filterCounts, filterItems, critKey, pixelKey,
  type InvItem,
} from "@/components/review/policyReviewModel";
import { creditContributor } from "@/components/review/creditContributor";
import { useReviewer } from "@/components/review/useReviewer";
import ReviewerNameField from "@/components/review/ReviewerNameField";
import StatusChip from "@/components/review/StatusChip";
import { createReviewPR } from "@/tools/github";
import {
  normalizeReviewerName, reviewSaveBase, localSaveErrorMessage,
} from "@/components/review/reviewerIdentity";
import {
  CATEGORY_ORDER, CATEGORY_META, DOMAIN_ORDER, DOMAIN_META,
} from "@/components/review/policyTaxonomy";

type IndexRow = {
  slug: string; service_name: string; ia_status: string; has_inventory: boolean;
  analyzed_at: string | null; review_status: ReviewSidecar["status"]; needs_count: number;
};
type ProblemRow = {
  slug: string; service_name: string; status: string; detail: string;
  policy_url: string | null; suggested_action: string;
};

const REASONS: RejectReason[] = [
  "hallucinated", "wrong_category", "partial_or_stitched", "out_of_context", "translation", "other",
];

const CAT_META_INPUT = { CATEGORY_ORDER: [...CATEGORY_ORDER], CATEGORY_META };

const AVATAR_COLORS = ["#202080", "#4a4fc4", "#09b1ba", "#e84545", "#0b6e90", "#9a6a00", "#2a8a4a"];
const avatarColor = (s: string) =>
  AVATAR_COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length];
const avatarLetter = (n: string) => (n?.trim()?.[0] || "?").toUpperCase();

function freshSidecar(slug: string): ReviewSidecar {
  return { slug, status: "needs_review", reviewers: [], items: {}, service_note: "", updated_at: "" };
}

function policyHost(url: string): string {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return url; }
}

function cleanQuote(q: string): string {
  return (q || "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
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
  const [invFilter, setInvFilter] = useState<"needs" | "rejected" | "verified" | "all">("needs");
  const [openDomain, setOpenDomain] = useState<Record<string, boolean>>({});
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ prUrl?: string } | null>(null);
  const [authError, setAuthError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [showIframe, setShowIframe] = useState(true);

  const [isDev, setIsDev] = useState(false);
  useEffect(() => { setIsDev(process.env.NODE_ENV === "development"); }, []);

  useEffect(() => {
    const grab = <T,>(url: string, fallback: T): Promise<T> =>
      fetch(url).then((r) => (r.ok ? r.json() : fallback)).catch(() => fallback);
    grab<{ services: IndexRow[] }>("/data/policy-analysis/_index.json", { services: [] })
      .then((d) => setServices(d.services || []));
    grab<{ problems: ProblemRow[] }>("/data/policy-analysis/_problems.json", { problems: [] })
      .then((d) => setProblems(d.problems || []));
  }, []);

  const openService = useCallback(async (slug: string) => {
    setSelected(slug); setView("detail"); setInvFilter("needs");
    setRejecting(null); setNoteDraft(""); setSaved(null); setAuthError(false); setNameError(false);
    const grab = <T,>(url: string, fallback: T): Promise<T> =>
      fetch(url).then((r) => (r.ok ? r.json() : fallback)).catch(() => fallback);
    const [a, s] = await Promise.all([
      grab<any>(`/data/policy-analysis/${slug}.json`, null),
      grab<ReviewSidecar | null>(`/data/policy-analysis/reviews/${slug}.json`, null),
    ]);
    setSvc(a);
    setSidecar(s || freshSidecar(slug));
  }, []);

  const backToQueue = () => { setView("queue"); setSelected(null); setSvc(null); setSidecar(null); };

  // ---- persistence ----
  const persist = useCallback(async (next: ReviewSidecar) => {
    // Every verdict is signed: without a pseudo the review cannot be credited.
    if (!normalizeReviewerName(name)) { setNameError(true); return; }
    next.updated_at = new Date().toISOString();
    const prev = sidecar;                 // snapshot for rollback
    setSidecar({ ...next });              // optimistic
    setSaving(true); setSaved(null); setAuthError(false); setNameError(false);
    try {
      if (isDev) {
        const r = await fetch(`${reviewSaveBase()}/save-review`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: next.slug, sidecar: next }),
        });
        if (!r.ok) throw new Error(await r.text());
        setSaved({});
      } else {
        if (!process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
          setAuthError(true);
          setSidecar(prev);               // rollback — nothing was persisted
          return;
        }
        const prUrl = await createReviewPR(
          next, next.slug, name,
          `🔍 Review: ${svc?.service_name || next.slug}`,
          `Relecture de la politique de confidentialité — ${svc?.service_name || next.slug} (statut : ${next.status})`,
        );
        setSaved({ prUrl });
      }
      // reflect new review_status in the queue index (only after confirmed save)
      setServices((prevRows) => prevRows.map((r) =>
        r.slug === next.slug
          ? { ...r, review_status: next.status, needs_count: Object.values(next.items).filter((v) => v.verdict === "rejected").length }
          : r));
    } catch (e) {
      console.error("save-review failed:", e);
      setSidecar(prev);                   // rollback on any failure
      alert(isDev ? localSaveErrorMessage(e, lang) : (lang === "fr" ? "Échec de l'enregistrement." : "Save failed."));
    } finally {
      setSaving(false);
    }
  }, [isDev, name, svc, lang, sidecar]);

  const setVerdict = useCallback((key: string, verdict: "validated" | "rejected", reason: RejectReason | null, note: string) => {
    if (!sidecar) return;
    const next: ReviewSidecar = {
      ...sidecar,
      items: {
        ...sidecar.items,
        [key]: { verdict, reason, note, by: normalizeReviewerName(name), at: new Date().toISOString() },
      },
    };
    setRejecting(null); setNoteDraft("");
    persist(next);
  }, [sidecar, name, lang, persist]);

  const setStatus = useCallback((status: ReviewSidecar["status"], action: string) => {
    if (!sidecar) return;
    const today = new Date().toISOString().split("T")[0];
    const next: ReviewSidecar = {
      ...sidecar, status,
      reviewers: creditContributor(sidecar.reviewers, name, today, action),
    };
    persist(next);
  }, [sidecar, name, persist]);

  // ---- derived (detail) ----
  const rawItems: InvItem[] = svc && sidecar ? computeInvItems({ ...svc, slug: selected }, CAT_META_INPUT) : [];
  const counts = sidecar ? filterCounts(rawItems, sidecar) : { needs: 0, rejected: 0, verified: 0, all: 0 };
  const filtered = sidecar ? filterItems(rawItems, sidecar, invFilter) : [];
  const focus = filtered[0];
  const treated = sidecar ? rawItems.filter((it) => { const g = invGroup(it, sidecar); return g === "validated" || g === "rejected"; }).length : 0;

  // keep noteDraft synced to the focus item's stored note when focus changes
  const focusKey = focus?.key;
  const lastFocusKey = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (focusKey !== lastFocusKey.current) {
      lastFocusKey.current = focusKey;
      setRejecting(null);
      setNoteDraft(focusKey && sidecar?.items[focusKey]?.note ? sidecar.items[focusKey].note : "");
    }
  }, [focusKey, sidecar]);

  // keyboard shortcuts on the focus item
  useEffect(() => {
    if (view !== "detail" || !focus) return;
    const onKey = (e: KeyboardEvent) => {
      if (saving) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "v" || e.key === "V") { e.preventDefault(); setVerdict(focus.key, "validated", null, noteDraft); }
      else if (e.key === "r" || e.key === "R") { e.preventDefault(); setRejecting(focus.key); }
      else if (rejecting === focus.key && /^[1-6]$/.test(e.key)) {
        e.preventDefault(); setVerdict(focus.key, "rejected", REASONS[Number(e.key) - 1], noteDraft);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, focusKey, rejecting, noteDraft, saving, setVerdict]); // eslint-disable-line react-hooks/exhaustive-deps

  const det = view === "detail" ? services.find((r) => r.slug === selected) : undefined;
  const hasInventory = det?.has_inventory && Boolean(svc?.data_inventory);

  // ---- queue stats + sorting ----
  const needsReviewCount = services.filter((s) => s.review_status === "needs_review").length;
  const humanReviewedCount = services.filter((s) => s.review_status === "human_reviewed").length;
  const publishedCount = services.filter((s) => s.review_status === "published").length;
  const queueRows = [...services].map((s) => ({
    ...s,
    rank: !s.has_inventory ? -1 : s.needs_count > 0 ? 2 : (s.review_status === "published" ? -2 : 0),
  })).sort((a, b) => b.rank - a.rank);

  const modifierFichePath = lang === "fr" ? "/contribuer/modifier-fiche" : "/contribute/update-form";

  return (
    <div style={{ background: "var(--slate-50)", minHeight: "100vh" }}>
      <style>{`
        .prv-chip{border:1.5px solid var(--slate-200);background:#fff;border-radius:var(--radius-pill,9999px);padding:7px 14px;font-size:12.5px;font-weight:700;color:var(--fg2);cursor:pointer;display:inline-flex;align-items:center;gap:6px}
        .prv-chip[data-active="true"]{border-color:var(--indigo-500);background:var(--indigo-50);color:var(--indigo-800)}
        .prv-chip:hover{border-color:var(--indigo-300)}
        .prv-split{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:30px}
        @media (max-width:820px){.prv-split{grid-template-columns:1fr}}
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
              <button className="prv-chip" data-active={tab === "queue"} onClick={() => setTab("queue")}>{tt("tabQueue")} <span>{services.length}</span></button>
              <button className="prv-chip" data-active={tab === "problems"} onClick={() => setTab("problems")}>{tt("tabProblems")} <span>{problems.length}</span></button>
            </div>
            <ReviewerNameField lang={lang} value={name} onChange={setName} />
          </div>

          {tab === "queue" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {queueRows.map((q) => {
                const invLabel = !q.has_inventory ? (lang === "fr" ? "Inventaire non disponible" : "Inventory unavailable")
                  : q.needs_count === 0 ? (lang === "fr" ? "Inventaire vérifié ✓" : "Inventory verified ✓")
                    : `${q.needs_count} ${lang === "fr" ? "citation(s) à revoir" : "citation(s) to review"}`;
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
              })}
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
            <button className="umd-btn umd-btn-ghost umd-btn-sm" onClick={backToQueue} style={{ paddingLeft: 6, marginBottom: 14 }}>← {tt("backToQueue")}</button>

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
              {sidecar?.status === "needs_review" && <button className="umd-btn umd-btn-primary umd-btn-sm" disabled={saving} onClick={() => setStatus("human_reviewed", "reviewed")}>{tt("markReviewed")}</button>}
              {sidecar?.status === "human_reviewed" && <button className="umd-btn umd-btn-safe umd-btn-sm" disabled={saving} onClick={() => setStatus("published", "published")}>{tt("publish")}</button>}
              <ReviewerNameField lang={lang} value={name} onChange={setName} />
            </div>
          </div>

          <main className="umd-wrap" style={{ padding: "16px 24px 90px" }}>
            {!hasInventory && (
              <div className="umd-card" style={{ padding: "22px 24px", borderColor: "var(--amber-400)", background: "var(--amber-50)", marginBottom: 20 }}>
                <p style={{ margin: 0, fontSize: 13, color: "var(--slate-700)" }}>{tt("inventoryUnavailable")}</p>
              </div>
            )}

            {hasInventory && sidecar && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
                  <h2 className="umd-heading-3" style={{ fontSize: 17, margin: 0 }}>{tt("collectedData")}</h2>
                  <span style={{ fontSize: 12.5, color: "var(--slate-600)" }}>{treated}/{rawItems.length} {lang === "fr" ? "traitées" : "processed"}</span>
                </div>
                <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--slate-600)" }}>{tt("priorityHint")}</p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, position: "sticky", top: 0, background: "var(--slate-50)", padding: "8px 0", zIndex: 2 }}>
                  {([["needs", counts.needs], ["rejected", counts.rejected], ["verified", counts.verified], ["all", counts.all]] as const).map(([f, c]) => (
                    <button key={f} className="prv-chip" data-active={invFilter === f} onClick={() => setInvFilter(f)}>
                      {tt(f === "needs" ? "filterNeeds" : f === "rejected" ? "filterRejected" : f === "verified" ? "filterVerified" : "filterAll")} <span>{c}</span>
                    </button>
                  ))}
                </div>

                {!focus ? (
                  <div className="umd-card" style={{ padding: 28, textAlign: "center", marginBottom: 30 }}><p style={{ margin: 0, fontSize: 13, color: "var(--slate-600)" }}>{tt("nothingHere")}</p></div>
                ) : showIframe ? (
                  <div className="prv-split">
                    <div className="umd-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 420 }}>
                      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--slate-200)", background: "var(--slate-50)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <b style={{ fontSize: 12 }}>{tt("policyPage")}</b>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {svc?.source?.policy_url && <a href={svc.source.policy_url} target="_blank" rel="noreferrer" style={{ fontSize: 11.5 }}>{tt("openTab")}</a>}
                          <button className="umd-btn umd-btn-ghost umd-btn-sm" style={{ fontSize: 11.5, padding: "3px 8px" }} onClick={() => setShowIframe(false)}>✕ {tt("closePreview")}</button>
                        </div>
                      </div>
                      {svc?.source?.policy_url && <iframe src={svc.source.policy_url} style={{ flex: 1, border: "none", width: "100%", minHeight: 380 }} title="policy" />}
                      <p style={{ margin: 0, padding: "8px 14px", fontSize: 11, borderTop: "1px solid var(--slate-100)", color: "var(--slate-600)" }}>{tt("iframeBlockedHint")}</p>
                    </div>

                    <div className="umd-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span className="umd-chip" style={{ fontSize: 10.5, background: "var(--slate-50)", borderColor: "var(--slate-200)", color: "var(--slate-600)" }}>{focus.kind}</span>
                        <b style={{ fontSize: 14, flex: 1, minWidth: 120 }}>{focus.label}</b>
                      </div>
                      <blockquote className="umd-quotebox" style={{ margin: 0, fontSize: 13.5 }}>« {cleanQuote(focus.quote)} »</blockquote>
                      <textarea className="umd-input" style={{ fontSize: 12.5, minHeight: 60 }} placeholder={tt("notePlaceholder")} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
                      {rejecting === focus.key ? (
                        <div>
                          <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "var(--slate-700)" }}>{tt("reasonPick")}</p>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {REASONS.map((r, i) => (
                              <button key={r} className="prv-chip" onClick={() => setVerdict(focus.key, "rejected", r, noteDraft)}>
                                <span style={{ opacity: 0.5 }}>{i + 1}</span> {tt(`reason_${r}`)}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "auto" }}>
                          <button className="umd-btn umd-btn-primary" disabled={saving} style={{ fontSize: 12.5, padding: "8px 16px" }} onClick={() => setVerdict(focus.key, "validated", null, noteDraft)}>{tt("validateNext")}</button>
                          <button className="umd-btn umd-btn-ghost umd-btn-sm" disabled={saving} style={{ fontSize: 12.5, padding: "8px 14px", color: "var(--red-600)" }} onClick={() => setRejecting(focus.key)}>{tt("reject")}</button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Pile mode — iframe closed. Review as a stack; open the policy in a
                     Firefox split view (or separate window) alongside this list. */
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 30 }}>
                    <div className="umd-card" style={{ padding: "14px 18px", background: "var(--indigo-50)", borderColor: "var(--indigo-200)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <p style={{ margin: 0, flex: 1, minWidth: 220, fontSize: 12.5, color: "var(--slate-700)" }}>{tt("splitViewHint")}</p>
                      {svc?.source?.policy_url && <a href={svc.source.policy_url} target="_blank" rel="noreferrer" className="umd-btn umd-btn-outline umd-btn-sm">{tt("openWindow")} ↗</a>}
                      <button className="umd-btn umd-btn-ghost umd-btn-sm" onClick={() => setShowIframe(true)}>{tt("reopenPreview")}</button>
                    </div>
                    {filtered.map((it) => {
                      const v = sidecar.items[it.key];
                      return (
                        <div key={it.key} className="umd-card" style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, borderColor: v?.verdict === "validated" ? "var(--green-200)" : v?.verdict === "rejected" ? "var(--red-200)" : "var(--slate-100)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <span className="umd-chip" style={{ fontSize: 10.5, background: "var(--slate-50)", borderColor: "var(--slate-200)", color: "var(--slate-600)" }}>{it.kind}</span>
                            <b style={{ fontSize: 13.5, flex: 1, minWidth: 120 }}>{it.label}</b>
                            {v && <span className={v.verdict === "validated" ? "umd-chip umd-chip-safe" : "umd-chip umd-chip-danger"} style={{ fontSize: 10 }}>{v.verdict === "validated" ? "✓" : "✗"}</span>}
                          </div>
                          <blockquote className="umd-quotebox" style={{ margin: 0, fontSize: 12.5 }}>« {cleanQuote(it.quote)} »</blockquote>
                          {rejecting === it.key ? (
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {REASONS.map((r, i) => (
                                <button key={r} className="prv-chip" onClick={() => setVerdict(it.key, "rejected", r, "")}>
                                  <span style={{ opacity: 0.5 }}>{i + 1}</span> {tt(`reason_${r}`)}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="umd-btn umd-btn-ghost umd-btn-sm" disabled={saving} style={{ padding: "5px 10px", fontSize: 11.5 }} onClick={() => setVerdict(it.key, "validated", null, "")}>✅ {tt("filterVerified")}</button>
                              <button className="umd-btn umd-btn-ghost umd-btn-sm" disabled={saving} style={{ padding: "5px 10px", fontSize: 11.5, color: "var(--red-600)" }} onClick={() => setRejecting(it.key)}>🚫 {tt("reject")}</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Autres critères CNIL — secondary review */}
            {svc?.conformity && sidecar && (
              <details style={{ marginTop: 8 }}>
                <summary className="umd-btn umd-btn-ghost umd-btn-sm" style={{ display: "inline-flex", cursor: "pointer" }}>
                  {tt("otherCrit")} — {tt("secondaryReview")}
                </summary>
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Pixels de tracking */}
                  <div className="umd-card" style={{ padding: "16px 18px" }}>
                    <b style={{ fontSize: 13.5 }}>{tt("pixelTitle")}</b>
                    {svc.pixel_tracking?.present ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                        {(svc.pixel_tracking.details || []).map((px: any, i: number) => {
                          const key = pixelKey(i);
                          const v = sidecar.items[key];
                          const label = px.vendor || px.what_is_tracked || `${tt("pixelTitle")} ${i + 1}`;
                          return (
                            <div key={i} className="umd-card" style={{ padding: "12px 14px", borderColor: v?.verdict === "validated" ? "var(--green-200)" : v?.verdict === "rejected" ? "var(--red-200)" : "var(--slate-100)" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--slate-800)" }}>{label}</span>
                                {v && <span className={v.verdict === "validated" ? "umd-chip umd-chip-safe" : "umd-chip umd-chip-danger"} style={{ fontSize: 10 }}>{v.verdict === "validated" ? "✓" : "✗"}</span>}
                              </div>
                              {px.quote && <blockquote className="umd-quotebox" style={{ margin: "8px 0 0", fontSize: 12.5 }}>« {cleanQuote(px.quote)} »</blockquote>}
                              {px.quote && (
                                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                                  <button className="umd-btn umd-btn-ghost umd-btn-sm" disabled={saving} style={{ padding: "5px 10px", fontSize: 11.5 }} onClick={() => setVerdict(key, "validated", null, "")}>✅ {tt("filterVerified")}</button>
                                  <button className="umd-btn umd-btn-ghost umd-btn-sm" disabled={saving} style={{ padding: "5px 10px", fontSize: 11.5, color: "var(--red-600)" }} onClick={() => setVerdict(key, "rejected", "other", "")}>🚫 {tt("reject")}</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "var(--slate-600)" }}>{tt("pixelNone")}</p>
                    )}
                  </div>
                  {DOMAIN_ORDER.map((dk) => {
                    const crits = (svc.conformity[dk] || []).filter((c: any) => c.evaluable_by_ia);
                    if (!crits.length) return null;
                    const isOpen = !!openDomain[dk];
                    return (
                      <div key={dk} className="umd-card" style={{ padding: 0, overflow: "hidden" }}>
                        <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "var(--slate-50)", border: "none", cursor: "pointer", font: "inherit", textAlign: "left" }}
                          onClick={() => setOpenDomain((o) => ({ ...o, [dk]: !isOpen }))}>
                          <span style={{ flex: 1, fontWeight: 700, fontSize: 13.5 }}>{DOMAIN_META[dk].label}</span>
                          <span style={{ fontSize: 12, color: "var(--slate-600)" }}>{crits.length}</span>
                        </button>
                        {isOpen && (
                          <div style={{ padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                            {crits.map((c: any) => {
                              const key = critKey(dk, c.id);
                              const v = sidecar.items[key];
                              return (
                                <div key={c.id} className="umd-card" style={{ padding: "12px 14px", borderColor: v?.verdict === "validated" ? "var(--green-200)" : v?.verdict === "rejected" ? "var(--red-200)" : "var(--slate-100)" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--slate-800)" }}>{c.label}</span>
                                    {v && <span className={v.verdict === "validated" ? "umd-chip umd-chip-safe" : "umd-chip umd-chip-danger"} style={{ fontSize: 10 }}>{v.verdict === "validated" ? "✓" : "✗"}</span>}
                                  </div>
                                  {c.quote && <blockquote className="umd-quotebox" style={{ margin: "8px 0 0", fontSize: 12.5 }}>« {cleanQuote(c.quote)} »</blockquote>}
                                  {c.quote && (
                                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                                      <button className="umd-btn umd-btn-ghost umd-btn-sm" disabled={saving} style={{ padding: "5px 10px", fontSize: 11.5 }} onClick={() => setVerdict(key, "validated", null, "")}>✅ {tt("filterVerified")}</button>
                                      <button className="umd-btn umd-btn-ghost umd-btn-sm" disabled={saving} style={{ padding: "5px 10px", fontSize: 11.5, color: "var(--red-600)" }} onClick={() => setVerdict(key, "rejected", "other", "")}>🚫 {tt("reject")}</button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </details>
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
