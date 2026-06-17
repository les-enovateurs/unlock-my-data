"use client";

/* Radar "autour de vous" — port of design/ui_kits/website/transfer-viz.js (radar)
   driven by real manual/*.json transfer data. You sit at the centre; each country
   your selected apps reach is a node. Inside the dashed ring = EU (RGPD-protected),
   outside = hors UE. Clicking a service in the list focuses its own destinations. */

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Plane } from "lucide-react";
import {
  parseTransferCountries,
  getCountryByCode,
  type CountryCoordinate,
} from "@/lib/map/country-coordinates";
import type { Service } from "@/constants/protectData";

type Lang = "fr" | "en";

type ManualData = {
  name?: string;
  logo?: string;
  country_code?: string;
  transfer_destination_countries?: string;
  transfer_destination_countries_en?: string;
  outside_eu_storage?: boolean;
};

// Brand colours mirrored from transfer-viz.js / colors_and_type.css
const C = {
  gold: "#dcbd45",
  green: "#10a36b",
  green300: "#5fd0a0",
  red: "#e0274b",
  red200: "#f4a8b6",
  slate900: "#141828",
};

// A few well-known extraterritorial laws shown under non-EU nodes.
const LAW: Record<string, { fr: string; en: string }> = {
  us: { fr: "Cloud Act", en: "Cloud Act" },
  cn: { fr: "loi data", en: "data law" },
  ru: { fr: "loi data", en: "data law" },
  in: { fr: "hors UE", en: "outside EU" },
};

const D2R = Math.PI / 180;
const FRONTIER = 0.58; // EU frontier ring as a fraction of the radar radius

type RadarNode = {
  code: string;
  name: string;
  sub: string;
  eu: boolean;
  apps: number; // distinct selected services reaching this country
  ang: number; // degrees
  r: number; // 0..1 fraction of radius
};

const countryName = (c: CountryCoordinate, lang: Lang) => (lang === "fr" ? c.name : c.nameEn);

const lawFor = (c: CountryCoordinate, lang: Lang): string => {
  if (c.isEU) return lang === "fr" ? "RGPD" : "GDPR";
  const law = LAW[c.code];
  if (law) return law[lang];
  return lang === "fr" ? "hors UE" : "outside EU";
};

/* Resolve the set of destination countries for one service:
   its declared transfer destinations, falling back to its HQ. */
function serviceCountries(
  service: Service,
  manual: ManualData | undefined,
  lang: Lang
): CountryCoordinate[] {
  const hqCode = manual?.country_code || service.country_code || "us";
  const transferString =
    lang === "en"
      ? manual?.transfer_destination_countries_en || manual?.transfer_destination_countries
      : manual?.transfer_destination_countries;

  const dest = parseTransferCountries(transferString, lang)
    .map((code) => getCountryByCode(code))
    .filter((c): c is CountryCoordinate => !!c);

  const hq = getCountryByCode(hqCode);
  const all = hq ? [hq, ...dest] : dest;

  // de-dup by code
  const seen = new Set<string>();
  return all.filter((c) => (seen.has(c.code) ? false : (seen.add(c.code), true)));
}

const COPY = {
  fr: {
    you: "Vous · UE",
    frontier: "FRONTIÈRE UE",
    caption: "À l'intérieur du cercle : protégé par le RGPD. À l'extérieur : vos données quittent l'Europe.",
    services: "Vos applications",
    all: "Toutes",
    sovereign: "Souverain",
    app: "app",
    apps: "apps",
    sheet: "Voir la fiche",
    empty: "Aucune destination connue pour ces applications.",
  },
  en: {
    you: "You · EU",
    frontier: "EU BORDER",
    caption: "Inside the ring: protected by GDPR. Outside: your data leaves Europe.",
    services: "Your apps",
    all: "All",
    sovereign: "Sovereign",
    app: "app",
    apps: "apps",
    sheet: "View profile",
    empty: "No known destination for these apps.",
  },
} as const;

export default function DataRadar({
  selectedServices,
  lang = "fr",
}: {
  selectedServices: Service[];
  lang?: Lang;
}) {
  const c = COPY[lang];
  const ficheBase = lang === "fr" ? "/liste-applications" : "/list-app";

  const [manual, setManual] = useState<Record<string, ManualData>>({});
  const [focus, setFocus] = useState<string | null>(null); // focused service slug

  // Load manual data (transfer destinations) for the selected services.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const slugsRes = await fetch("/data/manual/slugs.json");
        const available: string[] = slugsRes.ok
          ? (await slugsRes.json()).map((s: { slug: string }) => s.slug)
          : [];
        const acc: Record<string, ManualData> = {};
        await Promise.all(
          selectedServices.map(async (s) => {
            if (!available.includes(s.slug)) return;
            try {
              const r = await fetch(`/data/manual/${s.slug}.json`);
              if (r.ok) acc[s.slug] = await r.json();
            } catch {}
          })
        );
        if (!cancelled) setManual(acc);
      } catch {
        if (!cancelled) setManual({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedServices]);

  // Reset focus if the focused service is no longer selected.
  useEffect(() => {
    if (focus && !selectedServices.some((s) => s.slug === focus)) setFocus(null);
  }, [focus, selectedServices]);

  // Per-service destination countries (memoised).
  const byService = useMemo(() => {
    const map: Record<string, CountryCoordinate[]> = {};
    for (const s of selectedServices) map[s.slug] = serviceCountries(s, manual[s.slug], lang);
    return map;
  }, [selectedServices, manual, lang]);

  // Aggregate (or focused) countries → radar nodes.
  const nodes = useMemo<RadarNode[]>(() => {
    const services = focus ? selectedServices.filter((s) => s.slug === focus) : selectedServices;
    const agg = new Map<string, { country: CountryCoordinate; apps: Set<string> }>();
    for (const s of services) {
      for (const country of byService[s.slug] || []) {
        const e = agg.get(country.code) || { country, apps: new Set<string>() };
        e.apps.add(s.slug);
        agg.set(country.code, e);
      }
    }
    const list = Array.from(agg.values()).sort(
      (a, b) => b.apps.size - a.apps.size || Number(b.country.isEU) - Number(a.country.isEU)
    );
    const n = list.length || 1;
    return list.map((e, i) => ({
      code: e.country.code,
      name: countryName(e.country, lang),
      sub: lawFor(e.country, lang),
      eu: e.country.isEU,
      apps: e.apps.size,
      ang: -90 + (i * 360) / n, // even spokes, starting at top
      r: e.country.isEU ? 0.4 : 0.82,
    }));
  }, [focus, selectedServices, byService, lang]);

  // ---- Canvas radar (animated) ----
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<RadarNode[]>(nodes);
  nodesRef.current = nodes;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    const t0 = performance.now();
    let running = true;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, w, h };
    };

    const frame = (now: number) => {
      if (!running) return;
      const t = Math.max(0, (now - t0) / 1000);
      const { ctx, w, h } = fit();
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w * 0.42, h * 0.46);
      ctx.clearRect(0, 0, w, h);

      // concentric rings
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (R * i) / 4, 0, 7);
        ctx.strokeStyle = "rgba(147,152,224,0.18)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // cross axes
      ctx.strokeStyle = "rgba(147,152,224,0.10)";
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.moveTo(cx, cy - R);
      ctx.lineTo(cx, cy + R);
      ctx.stroke();

      // EU frontier ring
      ctx.beginPath();
      ctx.arc(cx, cy, R * FRONTIER, 0, 7);
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = "rgba(220,189,69,0.55)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = "center";
      ctx.font = "600 10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(220,189,69,0.85)";
      ctx.fillText(c.frontier, cx, cy - R * FRONTIER - 7);

      // sweep wedge
      const sweep = (t * 0.6) % (Math.PI * 2);
      if (ctx.createConicGradient) {
        const grad = ctx.createConicGradient(sweep, cx, cy);
        grad.addColorStop(0, "rgba(147,152,224,0.30)");
        grad.addColorStop(0.06, "rgba(147,152,224,0)");
        grad.addColorStop(1, "rgba(147,152,224,0)");
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, 0, 7);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // expanding pulses
      for (let k = 0; k < 3; k++) {
        const p = (t * 0.4 + k / 3) % 1;
        ctx.beginPath();
        ctx.arc(cx, cy, p * R, 0, 7);
        ctx.strokeStyle = `rgba(220,189,69,${(1 - p) * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // links + nodes + packets
      nodesRef.current.forEach((n, ni) => {
        const a = n.ang * D2R;
        const nx = cx + Math.cos(a) * R * n.r;
        const ny = cy + Math.sin(a) * R * n.r;
        const col = n.eu ? C.green : C.red;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = n.eu ? "rgba(16,163,107,0.5)" : "rgba(224,39,75,0.5)";
        ctx.lineWidth = 1.4 + n.apps * 0.7;
        ctx.setLineDash([5, 6]);
        ctx.lineDashOffset = -t * 26;
        ctx.stroke();
        ctx.setLineDash([]);

        // packets travelling outward, one per app
        for (let k = 0; k < n.apps; k++) {
          const s = (t * 0.42 + k / n.apps + ni * 0.15) % 1;
          const px = cx + (nx - cx) * s;
          const py = cy + (ny - cy) * s;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, 7);
          ctx.shadowColor = col;
          ctx.shadowBlur = 10;
          ctx.fillStyle = col;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // node
        const pr = 7 + 2.5 * Math.abs(Math.sin(t * 2 + ni));
        ctx.beginPath();
        ctx.arc(nx, ny, pr, 0, 7);
        ctx.fillStyle = (n.eu ? "rgba(16,163,107," : "rgba(224,39,75,") + "0.22)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(nx, ny, 5, 0, 7);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.strokeStyle = "#0b0e1a";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // label
        ctx.textAlign = nx < cx ? "end" : "start";
        const lx = nx + (nx < cx ? -12 : 12);
        ctx.font = "700 13px 'Space Grotesk', system-ui, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.fillText(n.name, lx, ny - 3);
        ctx.font = "600 11px 'JetBrains Mono', monospace";
        ctx.fillStyle = col;
        ctx.fillText(`${n.apps} ${n.apps > 1 ? c.apps : c.app} · ${n.sub}`, lx, ny + 13);
      });

      // centre — you
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, 7);
      ctx.fillStyle = "rgba(220,189,69,0.18)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, 7);
      ctx.fillStyle = C.gold;
      ctx.fill();
      ctx.strokeStyle = "#0b0e1a";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.font = "700 13px 'Space Grotesk', system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillText(c.you, cx, cy + 30);

      raf = requestAnimationFrame(frame);
    };

    frame(performance.now());
    const onResize = () => {};
    window.addEventListener("resize", onResize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [c]);

  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/10"
      style={{
        background: "radial-gradient(110% 100% at 30% 40%, #181860 0%, #10103c 60%, #0b0e1a 100%)",
      }}
    >
      <div className="grid gap-2 md:grid-cols-[1.25fr_0.75fr]">
        {/* Radar */}
        <div className="flex flex-col">
          <canvas ref={canvasRef} className="block w-full" style={{ height: 460 }} />
          <p className="px-5 pb-4 text-center text-xs leading-relaxed text-white/45">{c.caption}</p>
        </div>

        {/* Clickable service list */}
        <div className="border-t border-white/10 p-4 md:border-l md:border-t-0">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-white/45">{c.services}</span>
            {focus && (
              <button
                type="button"
                onClick={() => setFocus(null)}
                className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/80 hover:bg-white/20"
              >
                {c.all}
              </button>
            )}
          </div>

          <ul className="flex flex-col gap-1.5">
            {selectedServices.map((s) => {
              const countries = byService[s.slug] || [];
              const outside = countries.filter((cc) => !cc.isEU);
              const active = focus === s.slug;
              const dimmed = focus !== null && !active;
              return (
                <li key={s.slug}>
                  <div
                    className={`flex items-center gap-2.5 rounded-xl border p-2 transition ${
                      active
                        ? "border-white/40 bg-white/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]"
                    } ${dimmed ? "opacity-50" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => setFocus(active ? null : s.slug)}
                      aria-pressed={active}
                      className="flex min-w-0 flex-1 items-center gap-2.5 text-left focus-visible:outline-none"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10">
                        {s.logo ? (
                          <Image src={s.logo} alt="" width={28} height={28} className="h-full w-full object-contain" />
                        ) : (
                          <span className="text-xs font-bold text-white/70">{s.name.charAt(0)}</span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-white">{s.name}</span>
                        <span className="flex items-center gap-1 text-[11px] text-white/50">
                          {outside.length > 0 ? (
                            <>
                              <Plane className="h-3 w-3 text-[#f4a8b6]" aria-hidden="true" />
                              {outside
                                .slice(0, 2)
                                .map((cc) => countryName(cc, lang))
                                .join(", ")}
                              {outside.length > 2 ? "…" : ""}
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="h-3 w-3 text-[#5fd0a0]" aria-hidden="true" />
                              {c.sovereign}
                            </>
                          )}
                        </span>
                      </span>
                    </button>
                    <Link
                      href={`${ficheBase}/${s.slug}`}
                      title={c.sheet}
                      className="shrink-0 rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                    >
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          {nodes.length === 0 && <p className="mt-3 text-xs text-white/45">{c.empty}</p>}
        </div>
      </div>
    </div>
  );
}
