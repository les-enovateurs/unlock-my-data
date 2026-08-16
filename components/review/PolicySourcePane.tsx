"use client";

import { useEffect, useRef } from "react";

/**
 * The policy text, with the active citation highlighted.
 *
 * Replaces the iframe: an origin site is free to forbid framing (CSP), and a
 * volunteer cannot Ctrl-F through 156 000 characters for every one of 34 items.
 * The text shown here is the exact text the analysis ran on — which is also why
 * a hash mismatch is worth saying out loud rather than silently trusting.
 */
export default function PolicySourcePane({
  text, activeSpan, matchesAnalysis, lang,
}: {
  text: string;
  activeSpan: [number, number] | null;
  matchesAnalysis: boolean;
  lang: "fr" | "en";
}) {
  const markRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    markRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeSpan]);

  const before = activeSpan ? text.slice(0, activeSpan[0]) : text;
  const hit = activeSpan ? text.slice(activeSpan[0], activeSpan[1]) : "";
  const after = activeSpan ? text.slice(activeSpan[1]) : "";

  return (
    <div className="umd-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", position: "sticky", top: 12, alignSelf: "start", height: "calc(100vh - 120px)" }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--slate-200)", background: "var(--slate-50)" }}>
        <b style={{ fontSize: 12 }}>{lang === "fr" ? "Texte analysé" : "Analysed text"}</b>
      </div>
      {!matchesAnalysis && (
        <p style={{ margin: 0, padding: "8px 14px", fontSize: 11.5, background: "var(--amber-50, #fffbeb)", color: "var(--slate-700)", borderBottom: "1px solid var(--slate-200)" }}>
          {lang === "fr"
            ? "Ce texte ne correspond plus à celui de l'analyse — les surlignages peuvent être décalés."
            : "This text no longer matches the analysed one — highlights may be off."}
        </p>
      )}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px", fontSize: 12.5, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "var(--slate-700)" }}>
        {before}
        {activeSpan && (
          <mark ref={markRef} style={{ background: "var(--amber-200, #fde68a)", padding: "1px 0" }}>{hit}</mark>
        )}
        {after}
      </div>
    </div>
  );
}
