"use client";

/**
 * Weight history and composition, hand-written in SVG — the site embeds no chart library.
 * Four rules, each avoiding a false sentence:
 *
 * - **y axis starts at zero.** A truncated axis turns +6 % into a cliff.
 * - **Versions evenly spaced, never dated.** Collection is manual and irregular; dating
 *   the points would draw the pace of our downloads, not the app's growth.
 * - **One packaging per curve.** See `comparableSeries`.
 * - **A variant change cuts the line.** Dotted, for what the ABI count misses.
 *
 * The folded table is not a bonus: it makes the figures copyable, and it is what allows
 * hues whose contrast on light stays under 3:1.
 */

import { useState } from "react";

export type ApkSizePoint = {
    version: string;
    observedAt?: string;
    total: number;
    dex?: number;
    native?: number;
    res?: number;
    assets?: number;
    abiCount?: number;
    /** This point does not compare to the previous one: different packaging variant. */
    variantChange?: boolean;
};

type T = (key: string, vars?: Record<string, string | number>) => string;

/* Fixed order, never recycled when a part is missing. Validated for colour vision; the
   gold falls under 3:1 on light, which the written labels and the table make up for. */
const PARTS = [
    { key: "dex", colour: "#4a4fc4" },
    { key: "native", colour: "#0f97ad" },
    { key: "res", colour: "#c9a52f" },
    { key: "assets", colour: "#10a36b" },
] as const;

const LINE = "#4a4fc4";
const GRID = "#dde1ec";
const INK = "#4a5169";

/* One decimal under 100 MB, none above: beyond that the digit is noise on a measurement
   that shifts from one build to the next. */
function formatSize(n: number, lang: string) {
    const locale = lang === "fr" ? "fr-FR" : "en-US";
    const v = n / 1e6;
    return `${v.toLocaleString(locale, { maximumFractionDigits: v < 100 ? 1 : 0 })} Mo`;
}

function gridLines(max: number): number[] {
    /* Round step in MB: 20, 50, 100… A step off the exact maximum labels the axis
       "137.4 MB". */
    const raw = max / 4;
    const power = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((p) => p >= raw) ?? power * 10;
    /* The last gridline always passes above the maximum, else the highest point leaves the
       frame — seen on Vinted, 159 MB in a chart topping out at 150. */
    const ticks: number[] = [];
    for (let v = 0; v < max; v += step) ticks.push(v);
    ticks.push(step * Math.ceil(max / step));
    return ticks;
}

/**
 * The readings that compare to the latest one. APKPure serves the same app sometimes as a
 * single-ABI APK, sometimes as an XAPK carrying four, doubling the weight without a line
 * of code moving. The dotted segment flagged it, but the caption's percentage spanned it
 * anyway: Cdiscount read "+495 %" where the app had not moved a byte, and 27 other pages
 * published a figure of the same nature.
 *
 * Anchored on the latest reading, not the largest group: the curve must end on the weight
 * installed today, the one displayed above it. Exported so the caller gates its heading on
 * the same count — six pages keep several readings but one comparable.
 */
export function comparableSeries(points: ApkSizePoint[]): ApkSizePoint[] {
    const packaging = points[points.length - 1]?.abiCount;
    return points.filter((p) => p.abiCount === packaging);
}

/** The story of the weight, version by version. */
export function ApkWeightChart({ points, lang, t }: { points: ApkSizePoint[]; lang: string; t: T }) {
    const [active, setActive] = useState<number | null>(null);
    const series = comparableSeries(points);
    const dropped = points.length - series.length;
    /* No story under two comparable readings — least of all the one the full series would
       draw. The current weight stays displayed above. */
    if (series.length < 2) return null;

    const L = 760, H = 220;
    const margin = { top: 16, right: 16, bottom: 34, left: 54 };
    const width = L - margin.left - margin.right;
    const height = H - margin.top - margin.bottom;

    const max = Math.max(...series.map((p) => p.total));
    const ticks = gridLines(max);
    const ceiling = ticks[ticks.length - 1];
    const x = (i: number) => margin.left + (series.length === 1 ? width / 2 : (i * width) / (series.length - 1));
    const y = (v: number) => margin.top + height - (v / ceiling) * height;

    /* A different variant interrupts the fill the way it interrupts the line. */
    const segments: ApkSizePoint[][] = [];
    series.forEach((p, i) => {
        if (i === 0 || p.variantChange) segments.push([]);
        segments[segments.length - 1].push(p);
    });
    let cursor = 0;
    const paths = segments.map((seg) => {
        const start = cursor;
        cursor += seg.length;
        const d = seg.map((p, k) => `${k === 0 ? "M" : "L"}${x(start + k)},${y(p.total)}`).join(" ");
        const area = seg.length > 1
            ? `${d} L${x(start + seg.length - 1)},${y(0)} L${x(start)},${y(0)} Z`
            : null;
        return { d, area, start, seg };
    });
    const hasVariants = series.some((p) => p.variantChange);
    /* The column only exists to explain packaging gaps. The series being homogeneous by
       construction, it earns its place only when a variant change survived the filter. */
    const abisUseful = hasVariants || new Set(series.map((p) => p.abiCount)).size > 1;

    const first = series[0], last = series[series.length - 1];
    const delta = Math.round((100 * (last.total - first.total)) / first.total);

    return (
        <figure className="m-0">
            <div className="relative">
                <svg viewBox={`0 0 ${L} ${H}`} className="w-full h-auto" role="img"
                    aria-label={t("chartWeightAria", {
                        a: first.version, b: last.version,
                        x: formatSize(first.total, lang), y: formatSize(last.total, lang),
                    })}>
                    {ticks.map((v) => (
                        <g key={v}>
                            <line x1={margin.left} x2={L - margin.right} y1={y(v)} y2={y(v)}
                                stroke={GRID} strokeWidth="1" />
                            <text x={margin.left - 8} y={y(v) + 4} textAnchor="end"
                                fontSize="11" fill={INK}>{Math.round(v / 1e6)}</text>
                        </g>
                    ))}
                    <text x={margin.left - 8} y={margin.top - 4} textAnchor="end" fontSize="10" fill={INK}>Mo</text>

                    {paths.map((tr, i) => (
                        <g key={i}>
                            {tr.area && <path d={tr.area} fill={LINE} fillOpacity="0.1" />}
                            <path d={tr.d} fill="none" stroke={LINE} strokeWidth="2"
                                strokeLinejoin="round" strokeLinecap="round" />
                            {/* Dotted: the gap it spans is not a growth. */}
                            {i > 0 && (
                                <path d={`M${x(tr.start - 1)},${y(series[tr.start - 1].total)} L${x(tr.start)},${y(tr.seg[0].total)}`}
                                    fill="none" stroke={LINE} strokeWidth="2" strokeDasharray="3 4" strokeOpacity="0.5" />
                            )}
                        </g>
                    ))}

                    {series.map((p, i) => (
                        <g key={p.version + i}>
                            {/* Hover target is the whole column: a 4 px disc is a dexterity test. */}
                            <rect x={x(i) - width / (2 * (series.length - 1))} y={margin.top}
                                width={width / (series.length - 1)} height={height}
                                fill="transparent"
                                onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} />
                            <circle cx={x(i)} cy={y(p.total)} r={active === i ? 6 : 4}
                                fill={LINE} stroke="#ffffff" strokeWidth="2"
                                tabIndex={0} role="button"
                                aria-label={`${p.version} — ${formatSize(p.total, lang)}`}
                                onFocus={() => setActive(i)} onBlur={() => setActive(null)} />
                        </g>
                    ))}

                    {/* Labels at both ends only: what gets read is the gap, not the list. */}
                    <text x={x(0)} y={H - 12} textAnchor="start" fontSize="11" fill={INK}>{first.version}</text>
                    <text x={x(series.length - 1)} y={H - 12} textAnchor="end" fontSize="11" fill={INK}>{last.version}</text>
                </svg>

                {active !== null && (
                    <div className="absolute -translate-x-1/2 pointer-events-none umd-card px-3 py-2 text-[12.5px] shadow-md"
                        style={{
                            left: `${(x(active) / L) * 100}%`,
                            top: `${(y(series[active].total) / H) * 100}%`,
                            transform: "translate(-50%, -115%)",
                        }}>
                        <b>{series[active].version}</b> · {formatSize(series[active].total, lang)}
                        {abisUseful && series[active].abiCount ? <> · {t("chartAbis", { n: series[active].abiCount as number })}</> : null}
                    </div>
                )}
            </div>

            <figcaption className="text-umd-slate-600 text-[12.5px] mt-1">
                {t("chartWeightCaption", {
                    n: series.length,
                    p: delta >= 0 ? `+${delta}` : String(delta),
                })}
                {hasVariants && <> {t("chartVariantNote")}</>}
                {/* Silently going from six versions to four would suggest we measured four times. */}
                {dropped > 0 && <> {t("chartScopeNote", { n: dropped })}</>}
            </figcaption>

            <details className="mt-2">
                <summary className="text-[12.5px] cursor-pointer text-umd-slate-600">{t("chartTable")}</summary>
                <table className="w-full text-[12.5px] mt-2">
                    <thead>
                        <tr className="text-left text-umd-slate-600">
                            <th className="font-medium py-1">{t("chartColVersion")}</th>
                            <th className="font-medium py-1">{t("chartColWeight")}</th>
                            {abisUseful && <th className="font-medium py-1">{t("chartColAbis")}</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Descending: the table answers "where do we stand today", and that
                            answer must not sit at the bottom of the list. */}
                        {[...series].reverse().map((p, i) => (
                            <tr key={p.version + i}>
                                <td className="py-1">{p.version}</td>
                                <td className="py-1">{formatSize(p.total, lang)}</td>
                                {abisUseful && (
                                    <td className="py-1">{p.abiCount ?? "—"}{p.variantChange ? ` · ${t("chartVariantCell")}` : ""}</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </details>
        </figure>
    );
}

/** What makes up the latest version's weight. The rest — signatures, metadata — is not
    invented: it stays the unnamed gap between the parts and the total, and is not drawn. */
export function ApkCompositionBar({ point, lang, t }: { point: ApkSizePoint; lang: string; t: T }) {
    const parts = PARTS
        .map((p) => ({ ...p, value: point[p.key] ?? 0 }))
        .filter((p) => p.value > 0);
    if (parts.length < 2) return null;
    const sum = parts.reduce((n, p) => n + p.value, 0);

    return (
        <figure className="m-0">
            <div className="flex gap-[2px] h-5 rounded-[4px] overflow-hidden" role="img"
                aria-label={parts.map((p) => `${t(`chartPart_${p.key}`)} ${formatSize(p.value, lang)}`).join(", ")}>
                {parts.map((p) => (
                    <div key={p.key} style={{ width: `${(100 * p.value) / sum}%`, background: p.colour }} />
                ))}
            </div>
            {/* Four parts do not tell apart by colour alone, and each carries its value
                rather than a percentage — comparing two pages compares megabytes. */}
            <figcaption className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[12.5px] text-umd-slate-600">
                {parts.map((p) => (
                    <span key={p.key} className="inline-flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-[3px]" style={{ background: p.colour }} />
                        {t(`chartPart_${p.key}`)} <b className="text-umd-slate-700">{formatSize(p.value, lang)}</b>
                    </span>
                ))}
            </figcaption>
        </figure>
    );
}
