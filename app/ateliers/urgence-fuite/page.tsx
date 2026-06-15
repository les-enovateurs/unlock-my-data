'use client';

/* Atelier — « Mes données ont fuité ? Réagir et sécuriser ».
   Porté fidèlement depuis le kit design/project/ui_kits/website/AtelierUrgenceFuite.jsx,
   ré-écrit dans le système de design umd (sobre, éco-conçu, sans animation). */

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ShieldAlert,
    AlertTriangle,
    Lock,
    Eye,
    ExternalLink,
    ArrowLeft,
    ArrowRight,
    PenTool,
    Clock,
    ShieldCheck,
    MousePointerClick,
    Key,
    User,
    Globe,
    BookOpenText,
    Info,
    CheckCircle2,
    Check,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';

/* ---- Étape : pastille numérotée + titre ---- */
function UFStep({ n, icon, title }: { n?: string; icon?: React.ReactNode; title: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
            <span
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'var(--indigo-800)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 20,
                    flexShrink: 0,
                }}
            >
                {icon ?? n}
            </span>
            <h2 className="umd-heading-2" style={{ fontSize: 28 }}>{title}</h2>
        </div>
    );
}

/* ---- Carte scénario ---- */
function UFScenario({
    icon,
    accent,
    title,
    badge,
    badgeClass,
    children,
}: {
    icon: React.ReactNode;
    accent: string;
    title: string;
    badge: string;
    badgeClass: string;
    children: React.ReactNode;
}) {
    return (
        <div className="umd-card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: 18,
                            color: accent,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 9,
                            marginBottom: 8,
                        }}
                    >
                        {icon}
                        {title}
                    </h3>
                    {children}
                </div>
                <span className={'umd-chip ' + badgeClass} style={{ flexShrink: 0, fontSize: 11.5 }}>{badge}</span>
            </div>
        </div>
    );
}

/* ---- Accordéon (ouverture indépendante) ---- */
function UFAcc({
    icon,
    title,
    open,
    onToggle,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                border: '1px solid var(--slate-200)',
                borderRadius: 'var(--umd-radius-lg)',
                background: '#fff',
                overflow: 'hidden',
            }}
        >
            <button
                onClick={onToggle}
                aria-expanded={open}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    width: '100%',
                    padding: '16px 20px',
                    background: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                }}
            >
                <span
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--umd-radius-md)',
                        background: 'var(--indigo-50)',
                        color: 'var(--indigo-700)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </span>
                <span style={{ flex: 1, fontWeight: 700, fontSize: 16.5, fontFamily: 'var(--font-display)' }}>{title}</span>
                {open ? (
                    <ChevronUp style={{ width: 19, height: 19, color: 'var(--fg3)' }} />
                ) : (
                    <ChevronDown style={{ width: 19, height: 19, color: 'var(--fg3)' }} />
                )}
            </button>
            {open && (
                <div
                    style={{
                        padding: '6px 20px 22px',
                        paddingTop: 14,
                        borderTop: '1px solid var(--slate-100)',
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

function UFNote({ children, tone = 'indigo' }: { children: React.ReactNode; tone?: 'indigo' | 'amber' | 'red' }) {
    const map = {
        indigo: { bg: 'var(--indigo-50)', bd: 'var(--indigo-200)', fg: 'var(--indigo-800)' },
        amber: { bg: 'var(--amber-50)', bd: '#f3d27a', fg: '#9a6a00' },
        red: { bg: 'var(--red-50)', bd: 'var(--red-200)', fg: 'var(--red-700)' },
    };
    const t = map[tone];
    return (
        <div
            style={{
                background: t.bg,
                border: '1px solid ' + t.bd,
                borderRadius: 'var(--umd-radius-md)',
                padding: '14px 16px',
                fontSize: 13.5,
                lineHeight: 1.6,
                color: t.fg,
            }}
        >
            {children}
        </div>
    );
}

const UF_LI: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 9,
    fontSize: 13.5,
    lineHeight: 1.55,
    color: 'var(--fg2)',
};

const DATA: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' };
const MUTED: React.CSSProperties = { color: 'var(--fg2)' };

export default function UrgenceFuitePage() {
    // Accordéons indépendants (chacun s'ouvre/ferme sans fermer les autres) —
    // évite le saut de défilement causé par la fermeture d'un grand panneau.
    const [openSet, setOpenSet] = useState<Set<number>>(() => new Set([0]));
    const isOpen = (i: number) => openSet.has(i);
    const toggle = (i: number) =>
        setOpenSet((prev) => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i);
            else next.add(i);
            return next;
        });

    const [sourcesOpen, setSourcesOpen] = useState(false);

    return (
        <div>
            <div className="mx-auto" style={{ maxWidth: 900, padding: '24px 24px 0' }}>
                <Link
                    href="/ateliers"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--indigo-700)',
                    }}
                >
                    <ArrowLeft style={{ width: 16, height: 16 }} />Retour aux ateliers
                </Link>
            </div>

            {/* Hero */}
            <section className="mx-auto" style={{ maxWidth: 900, padding: '28px 24px 8px' }}>
                <span className="umd-chip umd-chip-info" style={{ marginBottom: 16 }}>
                    <ShieldCheck />Atelier pratique
                </span>
                <h1 className="umd-heading-1" style={{ marginBottom: 16 }}>
                    Mes données ont fuité ?<br />
                    <span style={{ color: 'var(--indigo-600)' }}>Réagir et sécuriser</span>
                </h1>
                <p className="umd-lead-text" style={{ maxWidth: 660, marginBottom: 24 }}>
                    Ce guide interactif vous accompagne pas-à-pas pour sécuriser vos comptes. Que vous ayez
                    reçu une alerte ou que vous souhaitiez simplement vérifier.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <span className="umd-chip umd-chip-neutral"><Clock />Durée : 1 h</span>
                    <span className="umd-chip umd-chip-warn"><PenTool />Pré-requis : une feuille et un stylo</span>
                </div>
            </section>

            <div className="mx-auto" style={{ maxWidth: 900, padding: '48px 24px 0' }}>

                {/* ÉTAPE 1 */}
                <section style={{ marginBottom: 64 }}>
                    <UFStep n="1" title="Identifier votre situation" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                        <UFScenario
                            icon={<ShieldAlert style={{ width: 19, height: 19 }} />}
                            accent="var(--indigo-700)"
                            title="Situation A : j'ai reçu une alerte"
                            badge="Cas confirmé"
                            badgeClass="umd-chip-danger"
                        >
                            <p style={{ ...MUTED, fontSize: 14, lineHeight: 1.55, margin: '0 0 12px' }}>
                                Vous avez reçu un email ou un SMS officiel vous informant d&apos;une fuite.
                            </p>
                            <div
                                style={{
                                    borderLeft: '3px solid var(--red-500)',
                                    background: 'var(--slate-50)',
                                    padding: '12px 14px',
                                    borderRadius: '0 var(--umd-radius-md) var(--umd-radius-md) 0',
                                    fontSize: 13,
                                    fontStyle: 'italic',
                                    color: 'var(--fg2)',
                                    lineHeight: 1.55,
                                }}
                            >
                                <strong style={{ fontStyle: 'normal', display: 'block', marginBottom: 3 }}>Exemple de message :</strong>
                                « Bonjour, nous avons détecté un accès non autorisé à nos systèmes. Vos données personnelles (nom, email) sont concernées… »
                            </div>
                        </UFScenario>

                        <UFScenario
                            icon={<AlertTriangle style={{ width: 19, height: 19 }} />}
                            accent="#c2570a"
                            title="Situation B : j'ai un doute"
                            badge="Vérification"
                            badgeClass="umd-chip-warn"
                        >
                            <p style={{ ...MUTED, fontSize: 14, lineHeight: 1.55, margin: '0 0 14px' }}>
                                Pas d&apos;alerte officielle, mais vous voulez vérifier si votre email apparaît dans des
                                bases de données piratées.
                            </p>
                            <a
                                href="https://haveibeenpwned.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="umd-btn umd-btn-outline umd-btn-sm"
                                style={{ color: '#c2570a', borderColor: '#f3d27a' }}
                            >
                                Vérifier sur Have I Been Pwned<ExternalLink style={{ width: 15, height: 15 }} />
                            </a>
                            <p style={{ fontSize: 12, color: 'var(--fg3)', fontStyle: 'italic', margin: '8px 0 0', lineHeight: 1.5 }}>
                                Service sécurisé de référence. Entrez votre email, le site vous dira si vos données ont déjà fuité.
                            </p>
                        </UFScenario>

                        <UFScenario
                            icon={<ShieldCheck style={{ width: 19, height: 19 }} />}
                            accent="var(--fg1)"
                            title="Situation C : je m'exerce"
                            badge="Exercice"
                            badgeClass="umd-chip-neutral"
                        >
                            <p style={{ ...MUTED, fontSize: 14, lineHeight: 1.55, margin: '0 0 12px' }}>
                                Rien à signaler ? C&apos;est le meilleur moment pour agir. Choisissez un service critique
                                pour dérouler l&apos;atelier.
                            </p>
                            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                                {['Gmail', 'Facebook', 'Amazon'].map((s) => (
                                    <span key={s} className="umd-chip umd-chip-neutral" style={{ fontSize: 12, background: '#fff' }}>{s}</span>
                                ))}
                            </div>
                        </UFScenario>
                    </div>

                    {/* Feuille de suivi */}
                    <div
                        style={{
                            background: 'var(--slate-50)',
                            border: '1px solid var(--slate-200)',
                            borderRadius: 'var(--umd-radius-lg)',
                            padding: '22px 24px',
                        }}
                    >
                        <h4
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                fontSize: 16,
                                color: 'var(--indigo-800)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 9,
                                marginBottom: 12,
                            }}
                        >
                            <PenTool style={{ width: 18, height: 18 }} />Action : préparez votre feuille de suivi
                        </h4>
                        <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.6, margin: '0 0 16px' }}>
                            Pour ne pas vous perdre, recopiez ce tableau. En ligne 1, notez le service concerné
                            (scénarios A &amp; C) ou le <strong>résultat de votre recherche</strong> (scénario B : notez le
                            nom du site qui apparaît en rouge, ou « RAS » si tout est vert).
                        </p>
                        <div
                            style={{
                                overflowX: 'auto',
                                background: '#fff',
                                border: '1px solid var(--slate-200)',
                                borderRadius: 'var(--umd-radius-md)',
                            }}
                        >
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                                <thead>
                                    <tr>
                                        {['Service / Résultat', 'Risque', 'Nouveau mot de passe ?', 'Date & heure'].map((h, i) => (
                                            <th
                                                key={h}
                                                style={{
                                                    textAlign: i === 2 ? 'center' : 'left',
                                                    fontSize: 11.5,
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '.07em',
                                                    color: 'var(--fg3)',
                                                    background: 'var(--slate-50)',
                                                    padding: '10px 16px',
                                                    borderBottom: '1px solid var(--slate-200)',
                                                }}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ background: 'var(--indigo-50)' }}>
                                        <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--slate-100)', fontWeight: 700, color: 'var(--indigo-800)' }}>
                                            1. [Service / résultat Have I Been Pwned]
                                        </td>
                                        <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--slate-100)' }}>Origine</td>
                                        <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--slate-100)', textAlign: 'center' }}>
                                            <span style={{ display: 'inline-block', width: 22, height: 22, border: '1.5px solid var(--indigo-300)', borderRadius: 5, background: '#fff' }}></span>
                                        </td>
                                        <td style={{ ...DATA, padding: '10px 16px', borderBottom: '1px solid var(--slate-100)', color: 'var(--fg3)' }}>…/… à …h…</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--slate-100)', fontWeight: 600 }}>2. Email (Gmail / Outlook…)</td>
                                        <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--slate-100)' }}>Critique</td>
                                        <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--slate-100)', textAlign: 'center' }}>
                                            <span style={{ display: 'inline-block', width: 22, height: 22, border: '1.5px solid var(--slate-300)', borderRadius: 5 }}></span>
                                        </td>
                                        <td style={{ ...DATA, padding: '10px 16px', borderBottom: '1px solid var(--slate-100)', color: 'var(--fg3)' }}>…/…</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '10px 16px', fontWeight: 600 }}>3. Autre compte avec le même mot de passe…</td>
                                        <td style={{ padding: '10px 16px' }}>Faible</td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                            <span style={{ display: 'inline-block', width: 22, height: 22, border: '1.5px solid var(--slate-300)', borderRadius: 5 }}></span>
                                        </td>
                                        <td style={{ ...DATA, padding: '10px 16px', color: 'var(--fg3)' }}>…/…</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ÉTAPE 2 */}
                <section style={{ marginBottom: 64 }}>
                    <UFStep n="2" title="Comprendre les risques" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
                        <div className="umd-card" style={{ padding: '20px 22px', background: 'var(--slate-50)', boxShadow: 'none' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <Info style={{ width: 18, height: 18, color: 'var(--indigo-600)' }} />C&apos;est quoi une « fuite » ?
                            </h3>
                            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg2)', margin: 0 }}>
                                C&apos;est une perte, altération ou divulgation non autorisée de données personnelles.
                                Elle peut être <strong>accidentelle</strong> (panne serveur, erreur d&apos;envoi) ou
                                <strong> malveillante</strong> (cyberattaque).
                            </p>
                        </div>
                        <div className="umd-card" style={{ padding: '20px 22px', background: 'var(--slate-50)', boxShadow: 'none' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <Eye style={{ width: 18, height: 18, color: 'var(--indigo-600)' }} />Comment le savoir ?
                            </h3>
                            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg2)', margin: 0 }}>
                                Selon l&apos;article 34 du RGPD, l&apos;entreprise <strong>doit vous informer</strong> en cas de
                                risque élevé (email, SMS, ou bandeau sur leur site). L&apos;alerte doit préciser : nature
                                de la fuite, conséquences et contact DPO.
                            </p>
                        </div>
                    </div>

                    <div style={{ background: 'var(--red-50)', border: '1px solid var(--red-200)', borderRadius: 'var(--umd-radius-lg)', padding: '22px 24px' }}>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--red-700)', display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
                            <AlertTriangle style={{ width: 18, height: 18 }} />Pourquoi c&apos;est grave ? (stats CNIL / Harris 2024)
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, textAlign: 'center' }}>
                            {[['41 %', 'des Français touchés'], ['740 €', 'préjudice moyen'], ['915 €', 'si fraude à l\'identité']].map(([v, l]) => (
                                <div key={l}>
                                    <div style={{ ...DATA, fontSize: 34, fontWeight: 800, color: 'var(--red-600)', lineHeight: 1 }}>{v}</div>
                                    <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 7, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* COMMENT AGIT UN PIRATE */}
                <section style={{ marginBottom: 64 }}>
                    <UFStep icon={<BookOpenText style={{ width: 22, height: 22 }} />} title="Comment agit un pirate après une fuite" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div className="umd-card" style={{ padding: '20px 22px', background: 'var(--slate-50)', boxShadow: 'none' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, marginBottom: 12 }}>Les étapes</h3>
                            <ol style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingLeft: 0 }}>
                                {[
                                    'Le pirate récupère une liste email : mot de passe.',
                                    'Il teste ces paires automatiquement sur beaucoup de sites (Amazon, banque, email).',
                                    'Quand une paire marche, il prend le contrôle du compte (change le mot de passe).',
                                    'Il cherche ensuite l\'email pour réinitialiser d\'autres comptes.',
                                    'Enfin, il vend les comptes valides ou les utilise pour voler de l\'argent ou arnaquer vos contacts.',
                                ].map((t, i) => (
                                    <li key={i} style={UF_LI}>
                                        <span style={{ ...DATA, width: 21, height: 21, borderRadius: '50%', background: 'var(--indigo-100)', color: 'var(--indigo-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                        <span>{t}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div className="umd-card" style={{ padding: '20px 22px', background: 'var(--slate-50)', boxShadow: 'none' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, marginBottom: 12 }}>Pourquoi c&apos;est dangereux — et quoi faire</h3>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                                {[
                                    'Un seul compte compromis peut permettre d\'accéder à beaucoup d\'autres.',
                                    'Les attaques sont rapides et automatisées : il faut agir vite.',
                                    'Priorisez : changez d\'abord votre email, puis la banque, les impôts et la santé.',
                                    'Déconnectez tous les appareils et activez la double connexion (2FA).',
                                    'Utilisez un coffre (gestionnaire de mots de passe) pour avoir des mots uniques.',
                                ].map((t, i) => (
                                    <li key={i} style={UF_LI}>
                                        <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--green-600)', flexShrink: 0, marginTop: 1 }} />
                                        <span>{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ÉTAPE 3 — CHECKLIST */}
                <section style={{ marginBottom: 56 }}>
                    <UFStep n="3" title="Checklist d'actions" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                        <UFAcc icon={<Lock style={{ width: 21, height: 21 }} />} title="1. Changez vos mots de passe" open={isOpen(0)} onToggle={() => toggle(0)}>
                            <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                                <li style={UF_LI}><span style={{ ...DATA, color: 'var(--indigo-700)', fontWeight: 700 }}>1.</span>Connectez-vous au site concerné par la fuite.</li>
                                <li style={UF_LI}>
                                    <span style={{ ...DATA, color: '#c2570a', fontWeight: 700 }}>2.</span>
                                    <span>
                                        <strong style={{ color: '#c2570a', textTransform: 'uppercase', fontSize: 12.5, letterSpacing: '.03em' }}>Changez le mot de passe</strong><br />
                                        Action à réaliser de préférence sur votre ordinateur ou téléphone connecté à votre box internet. Depuis votre compte (si connecté), ou via la fonction « mot de passe oublié ».
                                    </span>
                                </li>
                            </ol>

                            {/* Astuce mot de passe oublié + mockup */}
                            <div style={{ background: 'var(--slate-50)', borderRadius: 'var(--umd-radius-md)', border: '1px solid var(--slate-200)', padding: '18px 20px', marginBottom: 16 }}>
                                <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                    <MousePointerClick style={{ width: 17, height: 17, color: 'var(--indigo-600)' }} />L&apos;astuce « mot de passe oublié »
                                </h5>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 24, alignItems: 'center' }}>
                                    <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg2)' }}>
                                        <p style={{ margin: '0 0 8px' }}>C&apos;est souvent le moyen le plus <strong>rapide</strong> et le plus <strong>sûr</strong> de changer un mot de passe en urgence.</p>
                                        <ol style={{ display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--fg2)' }}>
                                            <li>Cliquez sur « Mot de passe oublié » sur la page de connexion.</li>
                                            <li>Entrez votre email.</li>
                                            <li>Cliquez sur le lien reçu par email.</li>
                                            <li>Définissez le nouveau mot de passe.</li>
                                        </ol>
                                    </div>
                                    {/* mockup login */}
                                    <div style={{ border: '1px solid var(--slate-200)', borderRadius: 'var(--umd-radius-md)', background: '#fff', overflow: 'hidden', boxShadow: 'var(--umd-shadow-sm)' }}>
                                        <div style={{ display: 'flex', gap: 5, padding: '8px 10px', borderBottom: '1px solid var(--slate-100)', background: 'var(--slate-50)' }}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--slate-300)' }}></span>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--slate-300)' }}></span>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--slate-300)' }}></span>
                                        </div>
                                        <div style={{ padding: '16px 16px 18px' }}>
                                            <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 13.5, marginBottom: 12, fontFamily: 'var(--font-display)' }}>Connexion</div>
                                            <input className="umd-input" disabled placeholder="Email" style={{ padding: '8px 10px', fontSize: 12.5, marginBottom: 7 }} />
                                            <input className="umd-input" disabled type="password" placeholder="••••••••" style={{ padding: '8px 10px', fontSize: 12.5, marginBottom: 7 }} />
                                            <button className="umd-btn umd-btn-primary umd-btn-sm" style={{ width: '100%', marginBottom: 9 }}>Se connecter</button>
                                            <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--indigo-600)', fontWeight: 700, textDecoration: 'underline' }}>Mot de passe oublié ?</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gestionnaire de mots de passe */}
                            <div style={{ background: 'var(--indigo-50)', borderRadius: 'var(--umd-radius-md)', border: '1px solid var(--indigo-200)', padding: '18px 20px', marginBottom: 16 }}>
                                <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, color: 'var(--indigo-800)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                    <Key style={{ width: 17, height: 17 }} />Comprendre le gestionnaire de mots de passe
                                </h5>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'center' }}>
                                    <div style={{ background: '#fff', borderRadius: 'var(--umd-radius-md)', padding: '16px 14px', textAlign: 'center', border: '1px solid var(--indigo-100)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                                                <User style={{ width: 26, height: 26, color: 'var(--fg1)' }} />
                                                <span style={{ fontSize: 11, fontWeight: 700 }}>Vous</span>
                                            </div>
                                            <ArrowRight style={{ width: 15, height: 15, color: 'var(--slate-400)' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 12px', background: 'var(--indigo-800)', color: '#fff', borderRadius: 'var(--umd-radius-md)' }}>
                                                <Lock style={{ width: 20, height: 20 }} />
                                                <span style={{ fontSize: 10.5, fontWeight: 700, lineHeight: 1.2 }}>Coffre-fort<br />(KeePass / Bitwarden)</span>
                                            </div>
                                            <ArrowRight style={{ width: 15, height: 15, color: 'var(--slate-400)' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                {['Facebook', 'Gmail', 'Amazon'].map((s) => (
                                                    <span key={s} className="umd-chip umd-chip-neutral" style={{ fontSize: 10, padding: '2px 8px', background: '#fff', justifyContent: 'center' }}>{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ fontSize: 11.5, fontStyle: 'italic', color: 'var(--fg3)', margin: 0, lineHeight: 1.5 }}>
                                            Vous ne retenez qu&apos;<strong>UN SEUL</strong> mot de passe (celui du coffre). Le coffre retient tous les autres pour vous.
                                        </p>
                                    </div>
                                    <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg2)' }}>
                                        <p style={{ fontWeight: 700, margin: '0 0 8px', color: 'var(--fg1)' }}>Pourquoi l&apos;utiliser ?</p>
                                        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <li style={UF_LI}><Check style={{ width: 15, height: 15, color: 'var(--green-600)', flexShrink: 0, marginTop: 2 }} />Plus besoin de retenir 50 mots de passe.</li>
                                            <li style={UF_LI}><Check style={{ width: 15, height: 15, color: 'var(--green-600)', flexShrink: 0, marginTop: 2 }} /><span>Chaque site a un code impossible à deviner (ex. <code style={{ ...DATA, background: 'var(--slate-100)', padding: '1px 5px', borderRadius: 4 }}>Xy9#mP2$vL</code>).</span></li>
                                            <li style={UF_LI}><Check style={{ width: 15, height: 15, color: 'var(--green-600)', flexShrink: 0, marginTop: 2 }} />Si un site fuite, seul ce site est touché.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Stockage navigateur */}
                            <UFNote tone="amber">
                                <strong style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, fontSize: 14 }}><Globe style={{ width: 16, height: 16 }} />Et si je garde mes mots de passe dans le navigateur ?</strong>
                                <p style={{ margin: '0 0 12px' }}>C&apos;est très pratique, mais moins sûr qu&apos;un vrai coffre. Voici pourquoi, et quoi faire.</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--umd-radius-md)', padding: '12px 14px' }}>
                                        <div style={{ fontSize: 10.5, color: 'var(--red-600)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>Risques simples</div>
                                        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--fg2)', lineHeight: 1.5 }}>
                                            <li>Quelqu&apos;un peut <strong>voir vos mots de passe</strong> si vous prêtez l&apos;ordinateur.</li>
                                            <li>Un <strong>virus peut les voler</strong> et les envoyer à des pirates.</li>
                                            <li>Si votre compte Google est piraté (Chrome), l&apos;attaquant voit tout ce qui est synchronisé.</li>
                                            <li>Une extension malveillante peut aussi prendre vos mots de passe.</li>
                                        </ul>
                                    </div>
                                    <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--umd-radius-md)', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--indigo-700)', marginBottom: 6, fontSize: 13 }}>En bref</div>
                                        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg2)', lineHeight: 1.55 }}>Le navigateur convient aux petits comptes. Pour les comptes importants, utilisez un coffre et activez la double connexion.</p>
                                    </div>
                                </div>
                            </UFNote>
                        </UFAcc>

                        <UFAcc icon={<Lock style={{ width: 21, height: 21 }} />} title="2. Comptes où vous avez utilisé le même mot de passe" open={isOpen(1)} onToggle={() => toggle(1)}>
                            <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                                <li style={UF_LI}><span style={{ ...DATA, color: 'var(--indigo-700)', fontWeight: 700 }}>1.</span><span><strong>Identifiez les comptes réutilisés</strong> sur votre feuille.</span></li>
                                <li style={UF_LI}><span style={{ ...DATA, color: 'var(--indigo-700)', fontWeight: 700 }}>2.</span><span><strong>Changez</strong> le mot de passe sur les comptes critiques (email, banque, impôts, santé) en priorité.</span></li>
                            </ol>
                            <div style={{ border: '1px solid var(--slate-200)', borderRadius: 'var(--umd-radius-md)', padding: '14px 16px' }}>
                                <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Petite liste des services que vous utilisez peut-être</h5>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--fg2)', lineHeight: 1.5 }}>
                                    <li><strong>Messagerie :</strong> Gmail, Outlook, Yahoo</li>
                                    <li><strong>Banque / paiement :</strong> Crédit Mutuel, LCL, Crédit Agricole, La Banque Postale, PayPal</li>
                                    <li><strong>Administratif :</strong> impots.gouv.fr, Ameli, CAF</li>
                                    <li><strong>Réseaux sociaux :</strong> Facebook, Instagram, X, LinkedIn</li>
                                    <li><strong>Commerce :</strong> Amazon, Vinted, Cdiscount, Temu</li>
                                    <li><strong>Stockage :</strong> Google Drive, iCloud, OneDrive</li>
                                </ul>
                                <p style={{ ...MUTED, fontSize: 12.5, margin: '10px 0 0' }}>Écrivez ces services sur votre feuille et cochez-les une fois le mot de passe changé.</p>
                            </div>
                        </UFAcc>

                        <UFAcc icon={<Eye style={{ width: 21, height: 21 }} />} title="3. Surveillance des comptes" open={isOpen(2)} onToggle={() => toggle(2)}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div>
                                    <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>Fuite bancaire (IBAN / CB) ?</h5>
                                    <p style={{ ...MUTED, fontSize: 13.5, margin: 0, lineHeight: 1.55 }}>Surveillez vos comptes. Au moindre mouvement suspect : <strong style={{ color: 'var(--red-600)' }}>opposition immédiate</strong>. Informez votre banque de la fuite pour qu&apos;elle renforce la vigilance.</p>
                                </div>
                                <div style={{ height: 1, background: 'var(--slate-200)' }}></div>
                                <div>
                                    <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>Activité suspecte ?</h5>
                                    <p style={{ ...MUTED, fontSize: 13.5, margin: 0, lineHeight: 1.55 }}>Vérifiez l&apos;historique de connexion, les commandes récentes, ou les messages envoyés depuis votre compte.</p>
                                </div>
                            </div>
                        </UFAcc>

                        <UFAcc icon={<ShieldAlert style={{ width: 21, height: 21 }} />} title="4. Vigilance spam & arnaques" open={isOpen(3)} onToggle={() => toggle(3)}>
                            <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.6, margin: '0 0 14px' }}>
                                Après une fuite, vos données (email, téléphone) sont vendues à des escrocs. Vous allez
                                recevoir des tentatives d&apos;arnaque « crédibles ».
                            </p>
                            <UFNote tone="amber">
                                <span style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                                    <AlertTriangle style={{ width: 17, height: 17, flexShrink: 0, marginTop: 1 }} />
                                    <span>Ne validez <strong>jamais</strong> d&apos;opérations bancaires urgentes par téléphone. En cas de doute, raccrochez et rappelez le numéro officiel de votre banque.</span>
                                </span>
                            </UFNote>
                        </UFAcc>

                        <UFAcc icon={<ExternalLink style={{ width: 21, height: 21 }} />} title="Contribuer : signaler la fuite à la communauté" open={isOpen(4)} onToggle={() => toggle(4)}>
                            <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.6, margin: '0 0 16px' }}>
                                Si vous le pouvez, signalez cette fuite pour prévenir d&apos;autres personnes. Ne partagez
                                jamais d&apos;informations sensibles (mot de passe, pièce d&apos;identité) dans un signalement public.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                                <p style={{ ...MUTED, flex: 1, minWidth: 240, fontSize: 13, margin: 0, lineHeight: 1.55 }}>
                                    Le signalement centralise les incidents, alerte d&apos;autres utilisateurs et améliore les ressources d&apos;aide.
                                </p>
                                <Link href="/contribuer/signaler-fuite/" className="umd-btn umd-btn-safe"><AlertTriangle />Signaler une fuite</Link>
                            </div>
                        </UFAcc>
                    </div>
                </section>
            </div>

            {/* KIT DE SURVIE — section indigo pleine largeur */}
            <section style={{ background: 'var(--indigo-800)', color: '#fff', padding: '64px 0', borderRadius: '28px 28px 0 0', marginTop: 12 }}>
                <div className="mx-auto" style={{ maxWidth: 900, padding: '0 24px' }}>
                    <h2 className="umd-heading-2" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <ShieldCheck style={{ width: 30, height: 30 }} />Ne plus subir : le kit de survie
                    </h2>
                    <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--indigo-100)', margin: '0 0 36px', maxWidth: 620 }}>
                        Voici les réflexes à mettre en place dès maintenant pour que la prochaine fuite ait moins d&apos;impact.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="umd-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column' }}>
                            <h3 className="umd-heading-3" style={{ fontSize: 17, marginBottom: 6 }}>1. Justificatifs sécurisés</h3>
                            <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.55, margin: '0 0 14px' }}>N&apos;envoyez plus jamais votre CNI ou RIB « nus ». Utilisez <strong>Filigrane Facile</strong> (service de l&apos;État) pour ajouter un filigrane de protection.</p>
                            <a href="https://filigrane.beta.gouv.fr/" target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-primary umd-btn-sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>Filigrane Facile<ExternalLink style={{ width: 15, height: 15 }} /></a>
                        </div>
                        <div className="umd-card" style={{ padding: '20px 22px' }}>
                            <h3 className="umd-heading-3" style={{ fontSize: 17, marginBottom: 6 }}>2. Hygiène des mots de passe</h3>
                            <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.55, margin: '0 0 12px' }}>Impossible de tout retenir ? C&apos;est normal. Utilisez un gestionnaire de mots de passe certifié par l&apos;ANSSI.</p>
                            <div style={{ display: 'flex', gap: 7 }}>
                                <span className="umd-chip umd-chip-neutral" style={{ fontSize: 12, background: '#fff' }}>KeePass</span>
                                <span className="umd-chip umd-chip-neutral" style={{ fontSize: 12, background: '#fff' }}>LockPass</span>
                            </div>
                        </div>
                        <div className="umd-card" style={{ padding: '20px 22px' }}>
                            <h3 className="umd-heading-3" style={{ fontSize: 17, marginBottom: 6 }}>3. Paiements uniques</h3>
                            <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>Sur les sites de commerce, n&apos;enregistrez pas votre carte. Utilisez des <strong>« e-cartes bleues »</strong> (numéro virtuel à usage unique) proposées par votre banque.</p>
                        </div>
                        <div className="umd-card" style={{ padding: '20px 22px' }}>
                            <h3 className="umd-heading-3" style={{ fontSize: 17, marginBottom: 6 }}>4. Double authentification (2FA)</h3>
                            <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>Activez-la partout où c&apos;est possible. Même si votre mot de passe fuite, le pirate ne pourra pas entrer sans votre téléphone.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SOURCES */}
            <section style={{ background: 'var(--slate-50)', padding: '40px 0 56px' }}>
                <div className="mx-auto" style={{ maxWidth: 900, padding: '0 24px' }}>
                    <div style={{ border: '1px solid var(--slate-200)', borderRadius: 'var(--umd-radius-lg)', background: '#fff', overflow: 'hidden' }}>
                        <button
                            onClick={() => setSourcesOpen(!sourcesOpen)}
                            aria-expanded={sourcesOpen}
                            style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', padding: '16px 20px', background: '#fff', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
                        >
                            <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>Sources et références officielles</span>
                            {sourcesOpen ? (
                                <ChevronUp style={{ width: 18, height: 18, color: 'var(--fg3)' }} />
                            ) : (
                                <ChevronDown style={{ width: 18, height: 18, color: 'var(--fg3)' }} />
                            )}
                        </button>
                        {sourcesOpen && (
                            <div style={{ padding: '6px 20px 22px', paddingTop: 12, borderTop: '1px solid var(--slate-100)' }}>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, color: 'var(--fg2)', lineHeight: 1.5 }}>
                                    <li>Règlement (UE) 2016/679 (RGPD) — articles 33 &amp; 34</li>
                                    <li>CNIL : sondage « Les Français, leurs données et le consentement » (Harris Interactive, déc. 2024)</li>
                                    <li>ANSSI : liste des produits certifiés</li>
                                    <li>Cybermalveillance.gouv.fr : fiches réflexes fuite de données</li>
                                    <li>Communiqués officiels : France Travail (oct. 2025), Pajemploi (nov. 2025), opérateurs télécom</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
