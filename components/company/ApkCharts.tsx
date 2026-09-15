"use client";

/**
 * Deux graphiques pour l'analyse du binaire : l'histoire du poids, et ce qui le compose.
 *
 * Écrits à la main en SVG, sans bibliothèque : le site n'en embarque aucune, et deux
 * formes simples ne justifient pas 90 ko de JavaScript sur toutes les fiches.
 *
 * Trois règles portent la lecture, et chacune évite une phrase fausse.
 *
 * **L'axe des ordonnées part de zéro.** Un axe tronqué transforme +6 % en falaise, et
 * c'est exactement l'effet qu'on ne veut pas produire sur une mesure qui sert un débat
 * public.
 *
 * **Les versions sont espacées régulièrement, jamais dans le temps.** Les collectes sont
 * manuelles et irrégulières ; placer les points à leur date dessinerait une pente dont la
 * raideur ne dirait que le rythme de nos téléchargements. L'axe est donc une suite de
 * versions, et le libellé le dit.
 *
 * **Un changement de variante coupe la ligne.** APKPure sert tantôt un APK mono-ABI,
 * tantôt un XAPK qui porte les quatre : entre les deux, le poids double sans qu'une ligne
 * de code ait bougé. Le segment concerné est pointillé et la réserve est écrite sous le
 * graphique — la relier en trait plein affirmerait une croissance que la mesure ne montre
 * pas.
 *
 * Le tableau replié sous chaque graphique n'est pas une option d'accessibilité en plus :
 * c'est lui qui rend les chiffres copiables, et il est ce qui autorise les teintes dont le
 * contraste sur fond clair reste sous 3:1.
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
    /** Le point ne se compare pas au précédent : variante d'empaquetage différente. */
    variantChange?: boolean;
};

type T = (key: string, vars?: Record<string, string | number>) => string;

/* Quatre teintes assignées par entité, dans un ordre fixe — jamais recyclé si une part
   manque. Validées pour la vision des couleurs (bande de clarté, écart CVD, plancher en
   vision normale) ; l'or passe sous 3:1 de contraste sur fond clair, ce que compensent
   les étiquettes écrites et le tableau. */
const PARTS = [
    { cle: "dex", couleur: "#4a4fc4" },
    { cle: "native", couleur: "#0f97ad" },
    { cle: "res", couleur: "#c9a52f" },
    { cle: "assets", couleur: "#10a36b" },
] as const;

const LIGNE = "#4a4fc4";
const GRILLE = "#dde1ec";
const ENCRE = "#4a5169";

/* La même règle que sur le reste de la fiche : une décimale sous 100 Mo, aucune au-dessus.
   Au-delà, le chiffre après la virgule est du bruit sur une mesure qui change d'un build à
   l'autre. */
function mo(n: number, lang: string) {
    const locale = lang === "fr" ? "fr-FR" : "en-US";
    const v = n / 1e6;
    return `${v.toLocaleString(locale, { maximumFractionDigits: v < 100 ? 1 : 0 })} Mo`;
}

function graduations(max: number): number[] {
    /* Quatre lignes, sur un pas rond en Mo : 20, 50, 100… Un pas calculé sur le maximum
       exact donnerait « 137,4 Mo » en étiquette d'axe, illisible. */
    const brut = max / 4;
    const puissance = Math.pow(10, Math.floor(Math.log10(brut)));
    const pas = [1, 2, 2.5, 5, 10].map((m) => m * puissance).find((p) => p >= brut) ?? puissance * 10;
    /* La dernière graduation passe toujours au-dessus du maximum : s'arrêter juste en
       dessous ferait sortir le point le plus haut du cadre — vu sur Vinted, 159 Mo dans
       un graphique qui montait à 150. */
    const lignes: number[] = [];
    for (let v = 0; v < max; v += pas) lignes.push(v);
    lignes.push(pas * Math.ceil(max / pas));
    return lignes;
}

/** L'histoire du poids, version par version. Rien sous deux points : une ligne à un seul
    point n'est pas une histoire, et le poids courant est déjà affiché au-dessus. */
export function ApkWeightChart({ points, lang, t }: { points: ApkSizePoint[]; lang: string; t: T }) {
    const [actif, setActif] = useState<number | null>(null);
    if (points.length < 2) return null;

    const L = 760, H = 220;
    const marge = { haut: 16, droite: 16, bas: 34, gauche: 54 };
    const largeur = L - marge.gauche - marge.droite;
    const hauteur = H - marge.haut - marge.bas;

    const max = Math.max(...points.map((p) => p.total));
    const lignes = graduations(max);
    const plafond = lignes[lignes.length - 1];
    const x = (i: number) => marge.gauche + (points.length === 1 ? largeur / 2 : (i * largeur) / (points.length - 1));
    const y = (v: number) => marge.haut + hauteur - (v / plafond) * hauteur;

    /* L'aire ne se referme qu'entre points comparables : une variante différente
       interrompt le remplissage comme elle interrompt la ligne. */
    const segments: ApkSizePoint[][] = [];
    points.forEach((p, i) => {
        if (i === 0 || p.variantChange) segments.push([]);
        segments[segments.length - 1].push(p);
    });
    let curseur = 0;
    const tracés = segments.map((seg) => {
        const début = curseur;
        curseur += seg.length;
        const d = seg.map((p, k) => `${k === 0 ? "M" : "L"}${x(début + k)},${y(p.total)}`).join(" ");
        const aire = seg.length > 1
            ? `${d} L${x(début + seg.length - 1)},${y(0)} L${x(début)},${y(0)} Z`
            : null;
        return { d, aire, début, seg };
    });
    const variantes = points.some((p) => p.variantChange);

    const premier = points[0], dernier = points[points.length - 1];
    const écart = Math.round((100 * (dernier.total - premier.total)) / premier.total);

    return (
        <figure className="m-0">
            <div className="relative">
                <svg viewBox={`0 0 ${L} ${H}`} className="w-full h-auto" role="img"
                    aria-label={t("chartWeightAria", {
                        a: premier.version, b: dernier.version,
                        x: mo(premier.total, lang), y: mo(dernier.total, lang),
                    })}>
                    {lignes.map((v) => (
                        <g key={v}>
                            <line x1={marge.gauche} x2={L - marge.droite} y1={y(v)} y2={y(v)}
                                stroke={GRILLE} strokeWidth="1" />
                            <text x={marge.gauche - 8} y={y(v) + 4} textAnchor="end"
                                fontSize="11" fill={ENCRE}>{Math.round(v / 1e6)}</text>
                        </g>
                    ))}
                    <text x={marge.gauche - 8} y={marge.haut - 4} textAnchor="end" fontSize="10" fill={ENCRE}>Mo</text>

                    {tracés.map((tr, i) => (
                        <g key={i}>
                            {tr.aire && <path d={tr.aire} fill={LIGNE} fillOpacity="0.1" />}
                            <path d={tr.d} fill="none" stroke={LIGNE} strokeWidth="2"
                                strokeLinejoin="round" strokeLinecap="round" />
                            {/* Le raccord vers une variante différente : pointillé, parce que
                                l'écart qu'il enjambe n'est pas une croissance. */}
                            {i > 0 && (
                                <path d={`M${x(tr.début - 1)},${y(points[tr.début - 1].total)} L${x(tr.début)},${y(tr.seg[0].total)}`}
                                    fill="none" stroke={LIGNE} strokeWidth="2" strokeDasharray="3 4" strokeOpacity="0.5" />
                            )}
                        </g>
                    ))}

                    {points.map((p, i) => (
                        <g key={p.version + i}>
                            {/* La cible du survol est la colonne entière, pas le point : viser
                                un disque de 4 px à la souris est un test d'adresse. */}
                            <rect x={x(i) - largeur / (2 * (points.length - 1))} y={marge.haut}
                                width={largeur / (points.length - 1)} height={hauteur}
                                fill="transparent"
                                onMouseEnter={() => setActif(i)} onMouseLeave={() => setActif(null)} />
                            <circle cx={x(i)} cy={y(p.total)} r={actif === i ? 6 : 4}
                                fill={LIGNE} stroke="#ffffff" strokeWidth="2"
                                tabIndex={0} role="button"
                                aria-label={`${p.version} — ${mo(p.total, lang)}`}
                                onFocus={() => setActif(i)} onBlur={() => setActif(null)} />
                        </g>
                    ))}

                    {/* Étiquettes directes aux deux bouts, jamais sur chaque point : c'est
                        l'écart entre le premier et le dernier qui se lit, pas la liste. */}
                    <text x={x(0)} y={H - 12} textAnchor="start" fontSize="11" fill={ENCRE}>{premier.version}</text>
                    <text x={x(points.length - 1)} y={H - 12} textAnchor="end" fontSize="11" fill={ENCRE}>{dernier.version}</text>
                </svg>

                {actif !== null && (
                    <div className="absolute -translate-x-1/2 pointer-events-none umd-card px-3 py-2 text-[12.5px] shadow-md"
                        style={{
                            left: `${(x(actif) / L) * 100}%`,
                            top: `${(y(points[actif].total) / H) * 100}%`,
                            transform: "translate(-50%, -115%)",
                        }}>
                        <b>{points[actif].version}</b> · {mo(points[actif].total, lang)}
                        {points[actif].abiCount ? <> · {t("chartAbis", { n: points[actif].abiCount as number })}</> : null}
                    </div>
                )}
            </div>

            <figcaption className="text-umd-slate-600 text-[12.5px] mt-1">
                {t("chartWeightCaption", {
                    n: points.length,
                    p: écart >= 0 ? `+${écart}` : String(écart),
                })}
                {variantes && <> {t("chartVariantNote")}</>}
            </figcaption>

            <details className="mt-2">
                <summary className="text-[12.5px] cursor-pointer text-umd-slate-600">{t("chartTable")}</summary>
                <table className="w-full text-[12.5px] mt-2">
                    <thead>
                        <tr className="text-left text-umd-slate-600">
                            <th className="font-medium py-1">{t("chartColVersion")}</th>
                            <th className="font-medium py-1">{t("chartColWeight")}</th>
                            <th className="font-medium py-1">{t("chartColAbis")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {points.map((p, i) => (
                            <tr key={p.version + i}>
                                <td className="py-1">{p.version}</td>
                                <td className="py-1">{mo(p.total, lang)}</td>
                                <td className="py-1">{p.abiCount ?? "—"}{p.variantChange ? ` · ${t("chartVariantCell")}` : ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </details>
        </figure>
    );
}

/** Ce qui compose le poids de la dernière version : code, bibliothèques natives,
    ressources, assets. Le reste — signatures, métadonnées — n'est pas inventé : il reste
    l'écart non nommé entre la somme des parts et le total, et n'est pas dessiné. */
export function ApkCompositionBar({ point, lang, t }: { point: ApkSizePoint; lang: string; t: T }) {
    const parts = PARTS
        .map((p) => ({ ...p, valeur: point[p.cle] ?? 0 }))
        .filter((p) => p.valeur > 0);
    if (parts.length < 2) return null;
    const somme = parts.reduce((n, p) => n + p.valeur, 0);

    return (
        <figure className="m-0">
            <div className="flex gap-[2px] h-5 rounded-[4px] overflow-hidden" role="img"
                aria-label={parts.map((p) => `${t(`chartPart_${p.cle}`)} ${mo(p.valeur, lang)}`).join(", ")}>
                {parts.map((p) => (
                    <div key={p.cle} style={{ width: `${(100 * p.valeur) / somme}%`, background: p.couleur }} />
                ))}
            </div>
            {/* Légende systématique : quatre parts ne se distinguent pas à la couleur seule,
                et chacune porte sa valeur plutôt qu'un pourcentage — un lecteur qui compare
                deux fiches compare des Mo. */}
            <figcaption className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[12.5px] text-umd-slate-600">
                {parts.map((p) => (
                    <span key={p.cle} className="inline-flex items-center gap-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-[3px]" style={{ background: p.couleur }} />
                        {t(`chartPart_${p.cle}`)} <b className="text-umd-slate-700">{mo(p.valeur, lang)}</b>
                    </span>
                ))}
            </figcaption>
        </figure>
    );
}
