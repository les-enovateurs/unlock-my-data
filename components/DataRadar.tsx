"use client";

/* Transfer map: curves from France to every non-EU country the selected apps
   reach, one entry per app on the right. Each country says how we know it:
   the service's seat, its privacy policy, or a tracker whose vendor country
   is sourced in tracker-companies.json. */

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight, Plane, ShieldCheck, X } from "lucide-react";
import { countryCoordinates } from "@/lib/map/country-coordinates";
import { LAND_MASK } from "@/lib/map/land-mask";
import {
  appTransfers,
  isDeclared,
  type AppSources,
  type AppTransfers,
  type LinkOptions,
  type TrackerCompanies,
  type TransferLink,
} from "@/lib/map/transferLinks";
import type { Service } from "@/constants/protectData";
import { hasExodusReport, type Playstore } from "@/lib/playstore";

type Lang = "fr" | "en";

type ManualData = {
  country_code?: string;
  transfer_destination_countries?: string[];
  playstore?: Playstore;
};

type Selection = { type: "app" | "country"; id: string } | null;

type View = { lon0: number; lon1: number; lat0: number; lat1: number };

const C = {
  gold: "#dcbd45",
  green: "#10a36b",
  green300: "#5fd0a0",
  red: "#e0274b",
  red200: "#f4a8b6",
  lavender: "#9398e0",
  lavender200: "#c3c6f2",
  ink: "#0b0e1a",
};

const HOME = "fr";
// The SVG is drawn at its on-screen pixel size so labels keep one size; below this width it scrolls.
const MIN_W = 640;
// Plate carrée looks squashed at European latitudes; stretching y reads closer to a real map.
const Y_STRETCH = 1.15;

const COPY = {
  fr: {
    you: "Vous",
    eu: (n: number) => `UE · ${n} pays`,
    mapLabel: "Carte des pays hors Union européenne où partent les données de vos applications",
    services: "Vos applications",
    allEU: "Toutes vos applications sélectionnées restent dans la frontière européenne.",
    appsOut: (n: number, total: number) => `${n} sur ${total} ${n > 1 ? "font" : "fait"} franchir à vos données la frontière européenne, hors de la protection du RGPD.`,
    country: "Pays",
    clear: "Tout afficher",
    outside: (n: number) => `${n} pays hors UE`,
    staysEu: "Reste dans l'UE",
    unknown: "Aucun pays connu",
    sheet: "Voir les transferts sur la fiche",
    origin: { hq: "siège du service", policy: "cité dans sa politique" },
    trackers: (n: number, who: string) => `${n} traceur${n > 1 ? "s" : ""} (${who})`,
    more: (n: number) => ` et ${n} autre${n > 1 ? "s" : ""}`,
    unstated: "La politique ne nomme aucun pays de destination.",
    unlisted: "La politique mentionne « d'autres pays » sans les nommer.",
    unlocated: (n: number) => `${n} traceur${n > 1 ? "s" : ""} sans pays sourcé, non placé${n > 1 ? "s" : ""} sur la carte.`,
    sources: "Pays trouvés dans",
    optPolicy: "sa politique de confidentialité",
    optTrackers: "ses traceurs",
    remove: (n: string) => `Retirer ${n}`,
    focus: (n: string) => `Filtrer la carte sur ${n}`,
    openSheet: (n: string) => `Ouvrir la fiche ${n} (nouvel onglet)`,
    empty: "Ajoutez une application pour voir où partent ses données.",
    legendDeclared: "déclaré par le service (siège ou politique)",
    legendTracker: "traceur seulement",
    groupDeclared: "Déclaré par le service (siège ou politique)",
    groupTracker: "Seulement via des traceurs",
    colon: " : ",
    legendEu: "Union européenne (RGPD)",
    legendWidth: "épaisseur : nombre d'applications",
    countryLabel: (name: string, n: number) => `${name}, ${n} application${n > 1 ? "s" : ""}`,
    caption: "Pays d'un traceur : siège de la société qui l'édite, d'après une source officielle.",
  },
  en: {
    you: "You",
    eu: (n: number) => `EU · ${n} countr${n > 1 ? "ies" : "y"}`,
    mapLabel: "Map of the non-EU countries your apps send data to",
    services: "Your apps",
    allEU: "All your selected apps stay within the European border.",
    appsOut: (n: number, total: number) => `${n} of ${total} ${n > 1 ? "send" : "sends"} your data across the European border, outside GDPR protection.`,
    country: "Country",
    clear: "Show all",
    outside: (n: number) => `${n} non-EU countr${n > 1 ? "ies" : "y"}`,
    staysEu: "Stays in the EU",
    unknown: "No known country",
    sheet: "See transfers on the profile",
    origin: { hq: "service's seat", policy: "named in its policy" },
    trackers: (n: number, who: string) => `${n} tracker${n > 1 ? "s" : ""} (${who})`,
    more: (n: number) => ` and ${n} more`,
    unstated: "The policy names no destination country.",
    unlisted: "The policy mentions “other countries” without naming them.",
    unlocated: (n: number) => `${n} tracker${n > 1 ? "s" : ""} with no sourced country, not placed on the map.`,
    sources: "Countries found in",
    optPolicy: "its privacy policy",
    optTrackers: "its trackers",
    remove: (n: string) => `Remove ${n}`,
    focus: (n: string) => `Filter the map on ${n}`,
    openSheet: (n: string) => `Open the ${n} profile (new tab)`,
    empty: "Add an app to see where its data goes.",
    legendDeclared: "declared by the service (seat or policy)",
    legendTracker: "tracker only",
    groupDeclared: "Declared by the service (seat or policy)",
    groupTracker: "Through trackers only",
    colon: ": ",
    legendEu: "European Union (GDPR)",
    legendWidth: "thickness: number of apps",
    countryLabel: (name: string, n: number) => `${name}, ${n} app${n > 1 ? "s" : ""}`,
    caption: "Tracker country: seat of the company that publishes it, from an official source.",
  },
} as const;

const fetchJson = async <T,>(url: string): Promise<T | null> => {
  try {
    const r = await fetch(url);
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
};

/* Frame the home country and every destination, never tighter than Europe + a margin,
   then widen one axis so the frame fills the box without distorting it. */
function fitView(codes: string[], w: number, h: number): View {
  const pts = [HOME, ...codes].map((c) => countryCoordinates[c].lonLat);
  const lons = pts.map((p) => p[0]);
  // Room above home for the EU zone and its label, else Europe hugs the top edge on wide screens.
  const lats = [...pts.map((p) => p[1]), pts[0][1] + 22];
  const LAT_MIN = LAND_MASK.lat0 - LAND_MASK.rows * LAND_MASK.step;
  let lonSpan = Math.max(Math.max(...lons) - Math.min(...lons) + 28, 110);
  let latSpan = Math.max(Math.max(...lats) - Math.min(...lats) + 28, 50);
  // Projected height of a span: H = W * latSpan / lonSpan * Y_STRETCH.
  const ratio = h / (w * Y_STRETCH);
  if (latSpan < lonSpan * ratio) latSpan = Math.min(lonSpan * ratio, LAND_MASK.lat0 - LAT_MIN);
  else lonSpan = Math.min(latSpan / ratio, 360);
  // Centre on the points, then slide back inside the world if the frame overflows it.
  const slide = (lo: number, hi: number, span: number, min: number, max: number) => {
    const a = Math.min(Math.max((lo + hi) / 2 - span / 2, min), max - span);
    return [a, a + span];
  };
  const [lon0, lon1] = slide(Math.min(...lons), Math.max(...lons), lonSpan, -180, 180);
  const [lat1, lat0] = slide(Math.min(...lats), Math.max(...lats), latSpan, LAT_MIN, LAND_MASK.lat0);
  return { lon0, lon1, lat0, lat1 };
}

function landPath(view: View, project: (p: [number, number]) => [number, number]): string {
  const bytes = atob(LAND_MASK.bits);
  let d = "";
  for (let r = 0; r < LAND_MASK.rows; r++) {
    for (let c = 0; c < LAND_MASK.cols; c++) {
      const i = r * LAND_MASK.cols + c;
      if (!((bytes.charCodeAt(i >> 3) >> (i & 7)) & 1)) continue;
      const lon = -180 + (c + 0.5) * LAND_MASK.step;
      const lat = LAND_MASK.lat0 - (r + 0.5) * LAND_MASK.step;
      if (lon < view.lon0 || lon > view.lon1 || lat > view.lat0 || lat < view.lat1) continue;
      const [x, y] = project([lon, lat]);
      d += `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
    }
  }
  return d;
}

type Box = { x0: number; y0: number; x1: number; y1: number };
type Label = { code: string; x: number; y: number; r: number; w: number; box?: Box; far?: boolean };

/* Greedy: biggest destinations first, each takes the first free slot around its node. */
function placeLabels(items: Label[], w: number, h: number, obstacles: Box[]) {
  const LH = 28;
  const taken: Box[] = [...obstacles, ...items.map((it) => ({ x0: it.x - it.r, y0: it.y - it.r, x1: it.x + it.r, y1: it.y + it.r }))];
  const hit = (b: Box) =>
    b.x0 < 0 || b.x1 > w || b.y0 < 0 || b.y1 > h || taken.some((t) => b.x0 < t.x1 && b.x1 > t.x0 && b.y0 < t.y1 && b.y1 > t.y0);
  for (const it of items) {
    // Nearest ring first; farther rings only when a crowded region leaves no room.
    const slots = [6, 30, 54].flatMap((gap): [number, number, boolean][] => {
      const g = it.r + gap;
      const ring: [number, number][] = [
        [it.x - it.w / 2, it.y + g], [it.x - it.w / 2, it.y - g - LH], [it.x + g, it.y - LH / 2], [it.x - g - it.w, it.y - LH / 2],
        [it.x + g, it.y + g - 4], [it.x - g - it.w, it.y + g - 4], [it.x + g, it.y - g - LH + 4], [it.x - g - it.w, it.y - g - LH + 4],
      ];
      return ring.map(([x, y]) => [x, y, gap > 6]);
    });
    const [x, y, far] = slots.find(([x, y]) => !hit({ x0: x, y0: y, x1: x + it.w, y1: y + LH })) ?? slots[0];
    it.box = { x0: x, y0: y, x1: x + it.w, y1: y + LH };
    it.far = far;
    taken.push(it.box);
  }
}

// "Meta Platforms, Inc. (formerly Facebook)" → "Meta Platforms": the panel names who, not the legal form.
const shortCompany = (name: string) =>
  name.replace(/\s*\(.*\)$/, "").replace(/[,.]?\s+(Inc|LLC|Ltd|Limited|Corporation|Corp|Pte|GmbH|SAS|SA|BV)\b.*$/i, "");

const onActivate = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

export default function DataRadar({
  selectedServices,
  lang = "fr",
  picker,
  onRemove,
}: {
  selectedServices: Service[];
  lang?: Lang;
  /** Search box that adds apps, rendered at the top of the side panel. */
  picker: ReactNode;
  onRemove: (slug: string) => void;
}) {
  const c = COPY[lang];
  const ficheBase = lang === "fr" ? "/liste-applications" : "/list-app";
  const name = (code: string) => (lang === "fr" ? countryCoordinates[code].name : countryCoordinates[code].nameEn);

  const [companies, setCompanies] = useState<TrackerCompanies | null>(null);
  const [trackerNames, setTrackerNames] = useState<Record<number, string>>({});
  const [sources, setSources] = useState<Record<string, Omit<AppSources, "trackerNames">>>({});
  const [opts, setOpts] = useState<LinkOptions>({ policy: true, trackers: true });
  const [sel, setSel] = useState<Selection>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchJson<TrackerCompanies>("/data/compare/tracker-companies.json").then(setCompanies);
    fetchJson<{ id: number; name: string }[]>("/data/compare/trackers.json").then((list) =>
      setTrackerNames(Object.fromEntries((list ?? []).map((t) => [t.id, t.name]))),
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const slugs = await fetchJson<{ slug: string }[]>("/data/manual/slugs.json");
      const available = new Set((slugs ?? []).map((s) => s.slug));
      const entries = await Promise.all(
        selectedServices.map(async (s) => {
          const manual = available.has(s.slug) ? await fetchJson<ManualData>(`/data/manual/${s.slug}.json`) : null;
          const exodus = manual && hasExodusReport(manual)
            ? await fetchJson<{ trackers?: number[] }>(`/data/compare/${s.slug}.json`)
            : null;
          return [s.slug, {
            hq: manual?.country_code || s.country_code,
            policy: manual?.transfer_destination_countries ?? [],
            trackerIds: exodus?.trackers ?? [],
          }] as const;
        }),
      );
      if (!cancelled) setSources(Object.fromEntries(entries));
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedServices]);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setSize({ w: Math.round(entry.contentRect.width), h: Math.round(entry.contentRect.height) }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const transfers = useMemo(() => {
    const out = new Map<string, AppTransfers>();
    for (const s of selectedServices) {
      const src = sources[s.slug];
      if (src) out.set(s.slug, appTransfers({ ...src, trackerNames }, companies, opts));
    }
    return out;
  }, [selectedServices, sources, trackerNames, companies, opts]);

  // Country code → slugs of the selected apps reaching it.
  const byCountry = useMemo(() => {
    const out = new Map<string, string[]>();
    for (const [slug, t] of transfers) for (const code of t.byCountry.keys()) out.set(code, [...(out.get(code) ?? []), slug]);
    return out;
  }, [transfers]);

  useEffect(() => {
    if (sel?.type === "app" && !transfers.has(sel.id)) setSel(null);
    if (sel?.type === "country" && !byCountry.has(sel.id)) setSel(null);
  }, [sel, transfers, byCountry]);

  const isEU = (code: string) => countryCoordinates[code].isEU;
  const outside = [...byCountry.keys()].filter((code) => !isEU(code)).sort((a, b) => byCountry.get(b)!.length - byCountry.get(a)!.length);
  const euCount = [...byCountry.keys()].filter(isEU).length;
  const appsOut = [...transfers.values()].filter((t) => [...t.byCountry.keys()].some((code) => !isEU(code))).length;

  const lit = (code: string) => {
    if (!sel) return true;
    if (sel.type === "country") return sel.id === code;
    return transfers.get(sel.id)?.byCountry.has(code) ?? false;
  };
  const toggle = (next: NonNullable<Selection>) =>
    setSel((cur) => (cur && cur.type === next.type && cur.id === next.id ? null : next));

  const W = Math.max(size.w, MIN_W);
  const H = size.h;
  const outsideKey = outside.join();
  const { project, dot, land } = useMemo(() => {
    const view = fitView(outsideKey ? outsideKey.split(",") : [], W, H || 1);
    const project = ([lon, lat]: [number, number]): [number, number] => [
      ((lon - view.lon0) / (view.lon1 - view.lon0)) * W,
      ((view.lat0 - lat) / (view.lat0 - view.lat1)) * H,
    ];
    // One dot per grid cell: sized from the zoom so the land stays legible however few countries are framed.
    const dot = Math.max(3, ((W / (view.lon1 - view.lon0)) * LAND_MASK.step) * 0.55);
    return { project, dot, land: H ? landPath(view, project) : "" };
  }, [outsideKey, W, H]);

  const home = project(countryCoordinates[HOME].lonLat);
  const maxApps = Math.max(1, ...outside.map((code) => byCountry.get(code)!.length));
  const labels: Label[] = outside.map((code) => {
    const [x, y] = project(countryCoordinates[code].lonLat);
    const k = byCountry.get(code)!.length;
    return { code, x, y, r: 7 + 11 * Math.sqrt(k / maxApps), w: (name(code).length + String(k).length) * 9.6 + 36 };
  });
  const euZone = { x0: home[0] - 10, y0: home[1] - 90, x1: home[0] + 76, y1: home[1] + 56 };
  placeLabels(labels, W, H, [euZone]);

  const declared = (code: string) =>
    byCountry.get(code)!.some((slug) => isDeclared(transfers.get(slug)!.byCountry.get(code)!));

  const reasons = (links: TransferLink[]) => {
    const trackers = links.filter((l) => l.origin === "tracker");
    const who = [...new Set(trackers.map((l) => shortCompany(l.company!)))];
    const parts: string[] = links.flatMap((l) => (l.origin === "tracker" ? [] : [c.origin[l.origin]]));
    if (trackers.length) parts.push(c.trackers(trackers.length, who.slice(0, 3).join(", ") + (who.length > 3 ? c.more(who.length - 3) : "")));
    const text = parts.join(" · ");
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const appRow = (s: Service) => {
    const t = transfers.get(s.slug);
    const codes = t ? [...t.byCountry.keys()] : [];
    const out = codes.filter((code) => !isEU(code));
    const open = sel?.type === "app" && sel.id === s.slug;
    const countryLinks = sel?.type === "country" ? t?.byCountry.get(sel.id) : undefined;
    return (
      <li key={s.slug} className={`rounded-xl border transition ${open ? "border-umd-indigo-500 bg-umd-indigo-50" : "border-umd-slate-200 bg-white"}`}>
        <div className="flex items-center gap-2 p-2">
          <a href={`${ficheBase}/${s.slug}/gouv`} target="_blank" rel="noopener" aria-label={c.openSheet(s.name)} title={c.sheet}
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-umd-slate-200 bg-white hover:border-umd-indigo-500 ${focusRing}`}>
            {s.logo ? (
              <Image src={s.logo} alt="" width={32} height={32} className="h-8 w-8 rounded object-contain" />
            ) : (
              <span className="text-sm font-bold text-umd-indigo-800">{s.name.charAt(0)}</span>
            )}
            <ArrowUpRight className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full bg-umd-indigo-700 p-0.5 text-white" aria-hidden="true" />
          </a>
          <button type="button" aria-pressed={open} aria-label={c.focus(s.name)} onClick={() => toggle({ type: "app", id: s.slug })}
            className={`min-w-0 flex-1 rounded-lg px-1.5 py-1 text-left hover:bg-umd-slate-50 ${focusRing}`}>
            <span className="block truncate text-sm font-semibold text-umd-slate-900">{s.name}</span>
            <span className="flex items-center gap-1 text-xs text-umd-slate-700">
              {out.length > 0 ? (
                <><Plane className="h-3.5 w-3.5 text-umd-red-600" aria-hidden="true" />{c.outside(out.length)}</>
              ) : codes.length > 0 ? (
                <><ShieldCheck className="h-3.5 w-3.5 text-umd-green-600" aria-hidden="true" />{c.staysEu}</>
              ) : (
                c.unknown
              )}
            </span>
          </button>
          <button type="button" onClick={() => onRemove(s.slug)} aria-label={c.remove(s.name)}
            className={`shrink-0 rounded-lg p-1.5 text-umd-slate-600 hover:bg-umd-slate-100 hover:text-umd-slate-900 ${focusRing}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {countryLinks && <p className="px-3 pb-2.5 text-xs leading-relaxed text-umd-slate-700">{reasons(countryLinks)}</p>}

        {open && t && (
          <div className="flex flex-col gap-2 border-t border-umd-indigo-200 px-3 py-3 text-xs leading-relaxed">
            {/* Countries sharing the same reason on one line: a long policy list would repeat it per country. */}
            {[...[...t.byCountry.keys()].sort((a, b) => Number(isEU(a)) - Number(isEU(b))).reduce((groups, code) => {
              const why = reasons(t.byCountry.get(code)!);
              return groups.set(why, [...(groups.get(why) ?? []), code]);
            }, new Map<string, string[]>())].map(([why, codes]) => {
              const countries = codes.map((code, i) => (
                <strong key={code} className={isEU(code) ? "text-umd-green-700" : "text-umd-red-700"}>{i > 0 && ", "}{name(code)}</strong>
              ));
              return codes.length > 1 ? (
                <p key={why} className="text-umd-slate-700">{why}{c.colon}{countries}</p>
              ) : (
                <p key={why} className="text-umd-slate-700"><span className="mr-2">{countries}</span>{why}</p>
              );
            })}
            {(t.unstated || t.unlisted || t.unlocated > 0) && (
              <p className="border-t border-umd-indigo-200 pt-2 text-umd-slate-700">
                {[t.unstated && c.unstated, t.unlisted && c.unlisted, t.unlocated > 0 && c.unlocated(t.unlocated)]
                  .filter(Boolean)
                  .join(" ")}
              </p>
            )}
          </div>
        )}
      </li>
    );
  };

  const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-umd-indigo-500";
  const chip = (on: boolean) =>
    `umd-chip cursor-pointer ${on ? "border-umd-indigo-500 bg-umd-indigo-50 text-umd-indigo-800" : "umd-chip-neutral"} ${focusRing}`;

  return (
    <div className="grid border-y border-umd-slate-200 md:h-[calc(100svh-5rem)] md:min-h-[560px] md:grid-cols-[minmax(0,1fr)_400px]">
      <div
        ref={mapRef}
        className="relative h-[60svh] min-h-[380px] overflow-x-auto overflow-y-hidden md:h-full"
        style={{ background: "radial-gradient(110% 100% at 30% 40%, #181860 0%, #10103c 60%, #0b0e1a 100%)" }}
      >
        {H > 0 && (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="group" aria-label={c.mapLabel} className="block">
            <style>{`
              @keyframes radar-flow { to { stroke-dashoffset: -36; } }
              .radar-flow { animation: radar-flow 1.4s linear infinite; }
              @media (prefers-reduced-motion: reduce) { .radar-flow { animation: none; } }
              .radar-node:focus { outline: none; }
              .radar-node:focus-visible .radar-core { stroke: ${C.gold}; stroke-width: 4; }
            `}</style>
            {/* The land grid ends mid-row at the box edges; fading it reads as a horizon instead of a cut. */}
            <defs>
              <linearGradient id="radar-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.12" stopColor="#fff" />
                <stop offset="0.9" stopColor="#fff" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <mask id="radar-land"><rect width={W} height={H} fill="url(#radar-fade)" /></mask>
            </defs>
            <path d={land} mask="url(#radar-land)" stroke="rgba(147,152,224,0.4)" strokeWidth={dot} strokeLinecap="round" fill="none" aria-hidden="true" />

            {[...labels].reverse().map((it) => {
              const k = byCountry.get(it.code)!.length;
              const dist = Math.hypot(it.x - home[0], it.y - home[1]);
              const cy = Math.max((home[1] + it.y) / 2 - Math.min(dist * 0.3, 130), 24);
              const d = `M${home[0]},${home[1]} Q${(home[0] + it.x) / 2},${cy} ${it.x},${it.y}`;
              const solid = declared(it.code);
              const on = lit(it.code);
              return (
                <g key={it.code} opacity={on ? 1 : 0.12} aria-hidden="true">
                  <path d={d} fill="none" stroke={solid ? C.red : C.lavender} strokeWidth={Math.min(1.5 + 1.5 * k, 14)}
                    strokeDasharray={solid ? undefined : "7 6"} strokeLinecap="round" />
                  {on && <path d={d} fill="none" stroke="#fff" strokeOpacity={0.85} strokeWidth={2.5}
                    strokeDasharray="3 33" strokeLinecap="round" className="radar-flow" />}
                </g>
              );
            })}

            <g opacity={!sel || euCount === 0 || (sel.type === "country" && isEU(sel.id)) ? 1 : 0.4}>
              <circle cx={home[0] + 30} cy={home[1] - 8} r={52} fill="rgba(16,163,107,0.18)" stroke={C.green300}
                strokeWidth={2} strokeDasharray="5 5" />
              {euCount > 0 && (
                <text x={home[0] + 30} y={home[1] - 70} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.green300}>
                  {c.eu(euCount)}
                </text>
              )}
            </g>

            {labels.map((it) => {
              const k = byCountry.get(it.code)!.length;
              const b = it.box!;
              const pressed = sel?.type === "country" && sel.id === it.code;
              return (
                <g key={it.code} className="radar-node cursor-pointer" opacity={lit(it.code) ? 1 : 0.35}
                  role="button" tabIndex={0} aria-pressed={pressed} aria-label={c.countryLabel(name(it.code), k)}
                  onClick={() => toggle({ type: "country", id: it.code })}
                  onKeyDown={onActivate(() => toggle({ type: "country", id: it.code }))}>
                  <circle cx={it.x} cy={it.y} r={it.r + 12} fill="transparent" />
                  {it.far && (
                    <line x1={it.x} y1={it.y} x2={(b.x0 + b.x1) / 2} y2={(b.y0 + b.y1) / 2} stroke={C.red200} strokeWidth={1.5} />
                  )}
                  <circle className="radar-core" cx={it.x} cy={it.y} r={it.r} fill={C.red} stroke={C.ink} strokeWidth={2.5} />
                  <rect x={b.x0} y={b.y0} width={b.x1 - b.x0} height={b.y1 - b.y0} rx={14}
                    fill="rgba(11,14,26,0.9)" stroke={pressed ? C.gold : "rgba(244,168,182,0.6)"} strokeWidth={pressed ? 2 : 1} />
                  <text x={b.x0 + 13} y={b.y0 + 19.5} fontSize={16} fontWeight={700} fill="#fff">
                    {name(it.code)}
                    <tspan dx={8} fill={C.red200} fontFamily="ui-monospace, monospace" fontSize={15}>{k}</tspan>
                  </text>
                </g>
              );
            })}

            <circle cx={home[0]} cy={home[1]} r={9} fill={C.gold} stroke={C.ink} strokeWidth={3} />
            <text x={home[0]} y={home[1] + 30} textAnchor="middle" fontSize={16} fontWeight={700} fill="#fff">{c.you}</text>
          </svg>
        )}

        <div className="sticky bottom-0 left-0 flex w-max max-w-full flex-wrap gap-x-5 gap-y-1.5 rounded-tr-xl bg-[#0b0e1a]/85 px-4 py-2.5 text-xs text-white/85 md:absolute">
          <span className="inline-flex items-center gap-2">
            <svg width="28" height="8" aria-hidden="true"><line x1="0" y1="4" x2="28" y2="4" stroke={C.red} strokeWidth="3" /></svg>
            {c.legendDeclared}
          </span>
          <span className="inline-flex items-center gap-2">
            <svg width="28" height="8" aria-hidden="true"><line x1="0" y1="4" x2="28" y2="4" stroke={C.lavender} strokeWidth="3" strokeDasharray="5 4" /></svg>
            {c.legendTracker}
          </span>
          <span className="inline-flex items-center gap-2">
            <svg width="12" height="12" aria-hidden="true"><circle cx="6" cy="6" r="5" fill="rgba(16,163,107,0.3)" stroke={C.green300} strokeDasharray="2 2" /></svg>
            {c.legendEu}
          </span>
          <span className="inline-flex items-center gap-2">
            <svg width="28" height="10" aria-hidden="true"><path d="M0 5h12" stroke={C.red} strokeWidth="2" /><path d="M16 5h12" stroke={C.red} strokeWidth="8" /></svg>
            {c.legendWidth}
          </span>
        </div>
      </div>

      <aside className="min-h-0 overflow-y-auto border-t border-umd-slate-200 bg-white p-5 md:border-l md:border-t-0" aria-live="polite">
        {picker}

        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-sm text-umd-slate-700">{c.sources}</span>
          {([["policy", c.optPolicy], ["trackers", c.optTrackers]] as const).map(([key, label]) => (
            <button key={key} type="button" aria-pressed={opts[key]} className={chip(opts[key])}
              onClick={() => setOpts((o) => ({ ...o, [key]: !o[key] }))}>
              {label}
            </button>
          ))}
        </div>

        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-umd-slate-600">
            {sel?.type === "country" ? `${c.country} · ${name(sel.id)}` : c.services}
          </h3>
          {sel && (
            <button type="button" onClick={() => setSel(null)} className={`${chip(false)} inline-flex items-center gap-1`}>
              <X className="h-3 w-3" aria-hidden="true" />
              {c.clear}
            </button>
          )}
        </div>

        {selectedServices.length === 0 ? (
          <p className="text-sm text-umd-slate-700">{c.empty}</p>
        ) : (
          !sel && transfers.size === selectedServices.length && (
            <p className="mb-3 text-sm leading-relaxed text-umd-slate-800">
              {appsOut > 0 ? c.appsOut(appsOut, selectedServices.length) : c.allEU}
            </p>
          )
        )}

        {sel?.type === "country" ? (
          ([[c.groupDeclared, true], [c.groupTracker, false]] as const).map(([title, declaredGroup]) => {
            const apps = selectedServices.filter((s) => {
              const links = transfers.get(s.slug)?.byCountry.get(sel.id);
              return links && isDeclared(links) === declaredGroup;
            });
            return apps.length > 0 && (
              <section key={title} className="mb-4">
                <h4 className="mb-2 text-sm font-semibold text-umd-slate-900">{title}</h4>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">{apps.map(appRow)}</ul>
              </section>
            );
          })
        ) : (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">{selectedServices.map(appRow)}</ul>
        )}

        <p className="mt-5 text-xs leading-relaxed text-umd-slate-600">{c.caption}</p>
      </aside>
    </div>
  );
}
