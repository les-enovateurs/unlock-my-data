'use client';

/* Atelier — « Mes données ont fuité ? Réagir et sécuriser ».
   Porté fidèlement depuis le kit design/project/ui_kits/website/AtelierUrgenceFuite.jsx,
   ré-écrit dans le système de design umd (sobre, éco-conçu, sans animation).
   Bilingue : tout le texte vient de i18n/AtelierUrgenceFuite.json via Translator. */

import React, { useState } from 'react';
import Link from 'next/link';
import Translator from '@/components/tools/t';
import dict from '@/i18n/AtelierUrgenceFuite.json';
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
    const tn = map[tone];
    return (
        <div
            style={{
                background: tn.bg,
                border: '1px solid ' + tn.bd,
                borderRadius: 'var(--umd-radius-md)',
                padding: '14px 16px',
                fontSize: 13.5,
                lineHeight: 1.6,
                color: tn.fg,
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

export default function UrgenceFuite({ lang }: { lang: string }) {
    const t = new Translator(dict as unknown as Record<string, Record<string, string>>, lang);
    const isFr = lang === 'fr';
    const backHref = isFr ? '/ateliers' : '/workshops';
    const reportHref = isFr ? '/contribuer/signaler-fuite/' : '/contribute/report-leak/';

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

    const pirateSteps = t.t('pirate.steps') as unknown as string[];
    const pirateDanger = t.t('pirate.danger') as unknown as string[];
    const tipOl = t.t('step3.acc1.tipOl') as unknown as string[];
    const sourcesLi = t.t('sources.li') as unknown as string[];

    return (
        <div>
            <div className="mx-auto" style={{ maxWidth: 900, padding: '24px 24px 0' }}>
                <Link
                    href={backHref}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--indigo-700)',
                    }}
                >
                    <ArrowLeft style={{ width: 16, height: 16 }} />{t.t('back')}
                </Link>
            </div>

            {/* Hero */}
            <section className="mx-auto" style={{ maxWidth: 900, padding: '28px 24px 8px' }}>
                <span className="umd-chip umd-chip-info" style={{ marginBottom: 16 }}>
                    <ShieldCheck />{t.t('hero.chip')}
                </span>
                <h1 className="umd-heading-1" style={{ marginBottom: 16 }}>
                    {t.t('hero.h1a')}<br />
                    <span style={{ color: 'var(--indigo-600)' }}>{t.t('hero.h1b')}</span>
                </h1>
                <p className="umd-lead-text" style={{ maxWidth: 660, marginBottom: 24 }}>
                    {t.t('hero.lead')}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <span className="umd-chip umd-chip-neutral"><Clock />{t.t('hero.duration')}</span>
                    <span className="umd-chip umd-chip-warn"><PenTool />{t.t('hero.prereq')}</span>
                </div>
            </section>

            <div className="mx-auto" style={{ maxWidth: 900, padding: '48px 24px 0' }}>

                {/* ÉTAPE 1 */}
                <section style={{ marginBottom: 64 }}>
                    <UFStep n="1" title={t.t('step1.title')} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                        <UFScenario
                            icon={<ShieldAlert style={{ width: 19, height: 19 }} />}
                            accent="var(--indigo-700)"
                            title={t.t('step1.scenarioA.title')}
                            badge={t.t('step1.scenarioA.badge')}
                            badgeClass="umd-chip-danger"
                        >
                            <p style={{ ...MUTED, fontSize: 14, lineHeight: 1.55, margin: '0 0 12px' }}>
                                {t.t('step1.scenarioA.p')}
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
                                <strong style={{ fontStyle: 'normal', display: 'block', marginBottom: 3 }}>{t.t('step1.scenarioA.exampleLabel')}</strong>
                                {t.t('step1.scenarioA.exampleText')}
                            </div>
                        </UFScenario>

                        <UFScenario
                            icon={<AlertTriangle style={{ width: 19, height: 19 }} />}
                            accent="#c2570a"
                            title={t.t('step1.scenarioB.title')}
                            badge={t.t('step1.scenarioB.badge')}
                            badgeClass="umd-chip-warn"
                        >
                            <p style={{ ...MUTED, fontSize: 14, lineHeight: 1.55, margin: '0 0 14px' }}>
                                {t.t('step1.scenarioB.p')}
                            </p>
                            <a
                                href="https://haveibeenpwned.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="umd-btn umd-btn-outline umd-btn-sm"
                                style={{ color: '#c2570a', borderColor: '#f3d27a' }}
                            >
                                {t.t('step1.scenarioB.button')}<ExternalLink style={{ width: 15, height: 15 }} />
                            </a>
                            <p style={{ fontSize: 12, color: 'var(--fg3)', fontStyle: 'italic', margin: '8px 0 0', lineHeight: 1.5 }}>
                                {t.t('step1.scenarioB.caption')}
                            </p>
                        </UFScenario>

                        <UFScenario
                            icon={<ShieldCheck style={{ width: 19, height: 19 }} />}
                            accent="var(--fg1)"
                            title={t.t('step1.scenarioC.title')}
                            badge={t.t('step1.scenarioC.badge')}
                            badgeClass="umd-chip-neutral"
                        >
                            <p style={{ ...MUTED, fontSize: 14, lineHeight: 1.55, margin: '0 0 12px' }}>
                                {t.t('step1.scenarioC.p')}
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
                            <PenTool style={{ width: 18, height: 18 }} />{t.t('step1.sheet.title')}
                        </h4>
                        <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.6, margin: '0 0 16px' }}>
                            {t.t('step1.sheet.p1')}<strong>{t.t('step1.sheet.pBold')}</strong>{t.t('step1.sheet.p2')}
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
                                        {[t.t('step1.sheet.th1'), t.t('step1.sheet.th2'), t.t('step1.sheet.th3'), t.t('step1.sheet.th4')].map((h, i) => (
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
                                            {t.t('step1.sheet.row1c1')}
                                        </td>
                                        <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--slate-100)' }}>{t.t('step1.sheet.row1c2')}</td>
                                        <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--slate-100)', textAlign: 'center' }}>
                                            <span style={{ display: 'inline-block', width: 22, height: 22, border: '1.5px solid var(--indigo-300)', borderRadius: 5, background: '#fff' }}></span>
                                        </td>
                                        <td style={{ ...DATA, padding: '10px 16px', borderBottom: '1px solid var(--slate-100)', color: 'var(--fg3)' }}>{t.t('step1.sheet.row1c4')}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--slate-100)', fontWeight: 600 }}>{t.t('step1.sheet.row2c1')}</td>
                                        <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--slate-100)' }}>{t.t('step1.sheet.row2c2')}</td>
                                        <td style={{ padding: '10px 16px', borderBottom: '1px solid var(--slate-100)', textAlign: 'center' }}>
                                            <span style={{ display: 'inline-block', width: 22, height: 22, border: '1.5px solid var(--slate-300)', borderRadius: 5 }}></span>
                                        </td>
                                        <td style={{ ...DATA, padding: '10px 16px', borderBottom: '1px solid var(--slate-100)', color: 'var(--fg3)' }}>{t.t('step1.sheet.row2c4')}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '10px 16px', fontWeight: 600 }}>{t.t('step1.sheet.row3c1')}</td>
                                        <td style={{ padding: '10px 16px' }}>{t.t('step1.sheet.row3c2')}</td>
                                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                                            <span style={{ display: 'inline-block', width: 22, height: 22, border: '1.5px solid var(--slate-300)', borderRadius: 5 }}></span>
                                        </td>
                                        <td style={{ ...DATA, padding: '10px 16px', color: 'var(--fg3)' }}>{t.t('step1.sheet.row3c4')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ÉTAPE 2 */}
                <section style={{ marginBottom: 64 }}>
                    <UFStep n="2" title={t.t('step2.title')} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
                        <div className="umd-card" style={{ padding: '20px 22px', background: 'var(--slate-50)', boxShadow: 'none' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <Info style={{ width: 18, height: 18, color: 'var(--indigo-600)' }} />{t.t('step2.card1Title')}
                            </h3>
                            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg2)', margin: 0 }}>
                                {t.t('step2.card1P1')}<strong>{t.t('step2.card1Bold1')}</strong>{t.t('step2.card1P2')}<strong>{t.t('step2.card1Bold2')}</strong>{t.t('step2.card1P3')}
                            </p>
                        </div>
                        <div className="umd-card" style={{ padding: '20px 22px', background: 'var(--slate-50)', boxShadow: 'none' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <Eye style={{ width: 18, height: 18, color: 'var(--indigo-600)' }} />{t.t('step2.card2Title')}
                            </h3>
                            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg2)', margin: 0 }}>
                                {t.t('step2.card2P1')}<strong>{t.t('step2.card2Bold')}</strong>{t.t('step2.card2P2')}
                            </p>
                        </div>
                    </div>

                    <div style={{ background: 'var(--red-50)', border: '1px solid var(--red-200)', borderRadius: 'var(--umd-radius-lg)', padding: '22px 24px' }}>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--red-700)', display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
                            <AlertTriangle style={{ width: 18, height: 18 }} />{t.t('step2.statsTitle')}
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, textAlign: 'center' }}>
                            {[['41 %', t.t('step2.statL1')], ['740 €', t.t('step2.statL2')], ['915 €', t.t('step2.statL3')]].map(([v, l]) => (
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
                    <UFStep icon={<BookOpenText style={{ width: 22, height: 22 }} />} title={t.t('pirate.title')} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div className="umd-card" style={{ padding: '20px 22px', background: 'var(--slate-50)', boxShadow: 'none' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, marginBottom: 12 }}>{t.t('pirate.stepsTitle')}</h3>
                            <ol style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingLeft: 0 }}>
                                {pirateSteps.map((txt, i) => (
                                    <li key={i} style={UF_LI}>
                                        <span style={{ ...DATA, width: 21, height: 21, borderRadius: '50%', background: 'var(--indigo-100)', color: 'var(--indigo-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                        <span>{txt}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div className="umd-card" style={{ padding: '20px 22px', background: 'var(--slate-50)', boxShadow: 'none' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, marginBottom: 12 }}>{t.t('pirate.dangerTitle')}</h3>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                                {pirateDanger.map((txt, i) => (
                                    <li key={i} style={UF_LI}>
                                        <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--green-600)', flexShrink: 0, marginTop: 1 }} />
                                        <span>{txt}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ÉTAPE 3 — CHECKLIST */}
                <section style={{ marginBottom: 56 }}>
                    <UFStep n="3" title={t.t('step3.title')} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                        <UFAcc icon={<Lock style={{ width: 21, height: 21 }} />} title={t.t('step3.acc1.title')} open={isOpen(0)} onToggle={() => toggle(0)}>
                            <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                                <li style={UF_LI}><span style={{ ...DATA, color: 'var(--indigo-700)', fontWeight: 700 }}>1.</span>{t.t('step3.acc1.ol1')}</li>
                                <li style={UF_LI}>
                                    <span style={{ ...DATA, color: '#c2570a', fontWeight: 700 }}>2.</span>
                                    <span>
                                        <strong style={{ color: '#c2570a', textTransform: 'uppercase', fontSize: 12.5, letterSpacing: '.03em' }}>{t.t('step3.acc1.ol2Bold')}</strong><br />
                                        {t.t('step3.acc1.ol2Text')}
                                    </span>
                                </li>
                            </ol>

                            {/* Astuce mot de passe oublié + mockup */}
                            <div style={{ background: 'var(--slate-50)', borderRadius: 'var(--umd-radius-md)', border: '1px solid var(--slate-200)', padding: '18px 20px', marginBottom: 16 }}>
                                <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                    <MousePointerClick style={{ width: 17, height: 17, color: 'var(--indigo-600)' }} />{t.t('step3.acc1.tipTitle')}
                                </h5>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 24, alignItems: 'center' }}>
                                    <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg2)' }}>
                                        <p style={{ margin: '0 0 8px' }}>{t.t('step3.acc1.tipP1')}<strong>{t.t('step3.acc1.tipBold1')}</strong>{t.t('step3.acc1.tipP2')}<strong>{t.t('step3.acc1.tipBold2')}</strong>{t.t('step3.acc1.tipP3')}</p>
                                        <ol style={{ display: 'flex', flexDirection: 'column', gap: 4, color: 'var(--fg2)' }}>
                                            {tipOl.map((txt, i) => (
                                                <li key={i}>{txt}</li>
                                            ))}
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
                                            <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 13.5, marginBottom: 12, fontFamily: 'var(--font-display)' }}>{t.t('step3.acc1.mockTitle')}</div>
                                            <input className="umd-input" disabled placeholder={t.t('step3.acc1.mockEmail')} style={{ padding: '8px 10px', fontSize: 12.5, marginBottom: 7 }} />
                                            <input className="umd-input" disabled type="password" placeholder="••••••••" style={{ padding: '8px 10px', fontSize: 12.5, marginBottom: 7 }} />
                                            <button className="umd-btn umd-btn-primary umd-btn-sm" style={{ width: '100%', marginBottom: 9 }}>{t.t('step3.acc1.mockBtn')}</button>
                                            <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--indigo-600)', fontWeight: 700, textDecoration: 'underline' }}>{t.t('step3.acc1.mockForgot')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gestionnaire de mots de passe */}
                            <div style={{ background: 'var(--indigo-50)', borderRadius: 'var(--umd-radius-md)', border: '1px solid var(--indigo-200)', padding: '18px 20px', marginBottom: 16 }}>
                                <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, color: 'var(--indigo-800)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                    <Key style={{ width: 17, height: 17 }} />{t.t('step3.acc1.pmTitle')}
                                </h5>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'center' }}>
                                    <div style={{ background: '#fff', borderRadius: 'var(--umd-radius-md)', padding: '16px 14px', textAlign: 'center', border: '1px solid var(--indigo-100)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                                                <User style={{ width: 26, height: 26, color: 'var(--fg1)' }} />
                                                <span style={{ fontSize: 11, fontWeight: 700 }}>{t.t('step3.acc1.pmYou')}</span>
                                            </div>
                                            <ArrowRight style={{ width: 15, height: 15, color: 'var(--slate-400)' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 12px', background: 'var(--indigo-800)', color: '#fff', borderRadius: 'var(--umd-radius-md)' }}>
                                                <Lock style={{ width: 20, height: 20 }} />
                                                <span style={{ fontSize: 10.5, fontWeight: 700, lineHeight: 1.2 }}>{t.t('step3.acc1.pmVault')}<br />{t.t('step3.acc1.pmVaultSub')}</span>
                                            </div>
                                            <ArrowRight style={{ width: 15, height: 15, color: 'var(--slate-400)' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                {['Facebook', 'Gmail', 'Amazon'].map((s) => (
                                                    <span key={s} className="umd-chip umd-chip-neutral" style={{ fontSize: 10, padding: '2px 8px', background: '#fff', justifyContent: 'center' }}>{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ fontSize: 11.5, fontStyle: 'italic', color: 'var(--fg3)', margin: 0, lineHeight: 1.5 }}>
                                            {t.t('step3.acc1.pmCap1')}<strong>{t.t('step3.acc1.pmCapBold')}</strong>{t.t('step3.acc1.pmCap2')}
                                        </p>
                                    </div>
                                    <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg2)' }}>
                                        <p style={{ fontWeight: 700, margin: '0 0 8px', color: 'var(--fg1)' }}>{t.t('step3.acc1.pmWhyTitle')}</p>
                                        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <li style={UF_LI}><Check style={{ width: 15, height: 15, color: 'var(--green-600)', flexShrink: 0, marginTop: 2 }} />{t.t('step3.acc1.pmWhy1')}</li>
                                            <li style={UF_LI}><Check style={{ width: 15, height: 15, color: 'var(--green-600)', flexShrink: 0, marginTop: 2 }} /><span>{t.t('step3.acc1.pmWhy2a')}<code style={{ ...DATA, background: 'var(--slate-100)', padding: '1px 5px', borderRadius: 4 }}>Xy9#mP2$vL</code>{t.t('step3.acc1.pmWhy2b')}</span></li>
                                            <li style={UF_LI}><Check style={{ width: 15, height: 15, color: 'var(--green-600)', flexShrink: 0, marginTop: 2 }} />{t.t('step3.acc1.pmWhy3')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Stockage navigateur */}
                            <UFNote tone="amber">
                                <strong style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, fontSize: 14 }}><Globe style={{ width: 16, height: 16 }} />{t.t('step3.acc1.brTitle')}</strong>
                                <p style={{ margin: '0 0 12px' }}>{t.t('step3.acc1.brP')}</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--umd-radius-md)', padding: '12px 14px' }}>
                                        <div style={{ fontSize: 10.5, color: 'var(--red-600)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>{t.t('step3.acc1.brRisksLabel')}</div>
                                        <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--fg2)', lineHeight: 1.5 }}>
                                            <li>{t.t('step3.acc1.brRisk1a')}<strong>{t.t('step3.acc1.brRisk1Bold')}</strong>{t.t('step3.acc1.brRisk1b')}</li>
                                            <li>{t.t('step3.acc1.brRisk2a')}<strong>{t.t('step3.acc1.brRisk2Bold')}</strong>{t.t('step3.acc1.brRisk2b')}</li>
                                            <li>{t.t('step3.acc1.brRisk3')}</li>
                                            <li>{t.t('step3.acc1.brRisk4')}</li>
                                        </ul>
                                    </div>
                                    <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--umd-radius-md)', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--indigo-700)', marginBottom: 6, fontSize: 13 }}>{t.t('step3.acc1.brBriefTitle')}</div>
                                        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg2)', lineHeight: 1.55 }}>{t.t('step3.acc1.brBrief')}</p>
                                    </div>
                                </div>
                            </UFNote>
                        </UFAcc>

                        <UFAcc icon={<Lock style={{ width: 21, height: 21 }} />} title={t.t('step3.acc2.title')} open={isOpen(1)} onToggle={() => toggle(1)}>
                            <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                                <li style={UF_LI}><span style={{ ...DATA, color: 'var(--indigo-700)', fontWeight: 700 }}>1.</span><span><strong>{t.t('step3.acc2.ol1Bold')}</strong>{t.t('step3.acc2.ol1Text')}</span></li>
                                <li style={UF_LI}><span style={{ ...DATA, color: 'var(--indigo-700)', fontWeight: 700 }}>2.</span><span><strong>{t.t('step3.acc2.ol2Bold')}</strong>{t.t('step3.acc2.ol2Text')}</span></li>
                            </ol>
                            <div style={{ border: '1px solid var(--slate-200)', borderRadius: 'var(--umd-radius-md)', padding: '14px 16px' }}>
                                <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{t.t('step3.acc2.listTitle')}</h5>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--fg2)', lineHeight: 1.5 }}>
                                    <li><strong>{t.t('step3.acc2.li1Label')}</strong>{t.t('step3.acc2.li1Rest')}</li>
                                    <li><strong>{t.t('step3.acc2.li2Label')}</strong>{t.t('step3.acc2.li2Rest')}</li>
                                    <li><strong>{t.t('step3.acc2.li3Label')}</strong>{t.t('step3.acc2.li3Rest')}</li>
                                    <li><strong>{t.t('step3.acc2.li4Label')}</strong>{t.t('step3.acc2.li4Rest')}</li>
                                    <li><strong>{t.t('step3.acc2.li5Label')}</strong>{t.t('step3.acc2.li5Rest')}</li>
                                    <li><strong>{t.t('step3.acc2.li6Label')}</strong>{t.t('step3.acc2.li6Rest')}</li>
                                </ul>
                                <p style={{ ...MUTED, fontSize: 12.5, margin: '10px 0 0' }}>{t.t('step3.acc2.note')}</p>
                            </div>
                        </UFAcc>

                        <UFAcc icon={<Eye style={{ width: 21, height: 21 }} />} title={t.t('step3.acc3.title')} open={isOpen(2)} onToggle={() => toggle(2)}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div>
                                    <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>{t.t('step3.acc3.bankTitle')}</h5>
                                    <p style={{ ...MUTED, fontSize: 13.5, margin: 0, lineHeight: 1.55 }}>{t.t('step3.acc3.bankP1')}<strong style={{ color: 'var(--red-600)' }}>{t.t('step3.acc3.bankBold')}</strong>{t.t('step3.acc3.bankP2')}</p>
                                </div>
                                <div style={{ height: 1, background: 'var(--slate-200)' }}></div>
                                <div>
                                    <h5 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>{t.t('step3.acc3.suspTitle')}</h5>
                                    <p style={{ ...MUTED, fontSize: 13.5, margin: 0, lineHeight: 1.55 }}>{t.t('step3.acc3.suspP')}</p>
                                </div>
                            </div>
                        </UFAcc>

                        <UFAcc icon={<ShieldAlert style={{ width: 21, height: 21 }} />} title={t.t('step3.acc4.title')} open={isOpen(3)} onToggle={() => toggle(3)}>
                            <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.6, margin: '0 0 14px' }}>
                                {t.t('step3.acc4.p')}
                            </p>
                            <UFNote tone="amber">
                                <span style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                                    <AlertTriangle style={{ width: 17, height: 17, flexShrink: 0, marginTop: 1 }} />
                                    <span>{t.t('step3.acc4.note1')}<strong>{t.t('step3.acc4.noteBold')}</strong>{t.t('step3.acc4.note2')}</span>
                                </span>
                            </UFNote>
                        </UFAcc>

                        <UFAcc icon={<ExternalLink style={{ width: 21, height: 21 }} />} title={t.t('step3.acc5.title')} open={isOpen(4)} onToggle={() => toggle(4)}>
                            <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.6, margin: '0 0 16px' }}>
                                {t.t('step3.acc5.p')}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                                <p style={{ ...MUTED, flex: 1, minWidth: 240, fontSize: 13, margin: 0, lineHeight: 1.55 }}>
                                    {t.t('step3.acc5.p2')}
                                </p>
                                <Link href={reportHref} className="umd-btn umd-btn-safe"><AlertTriangle />{t.t('step3.acc5.btn')}</Link>
                            </div>
                        </UFAcc>
                    </div>
                </section>
            </div>

            {/* KIT DE SURVIE — section indigo pleine largeur */}
            <section style={{ background: 'var(--indigo-800)', color: '#fff', padding: '64px 0', borderRadius: '28px 28px 0 0', marginTop: 12 }}>
                <div className="mx-auto" style={{ maxWidth: 900, padding: '0 24px' }}>
                    <h2 className="umd-heading-2" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <ShieldCheck style={{ width: 30, height: 30 }} />{t.t('kit.title')}
                    </h2>
                    <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--indigo-100)', margin: '0 0 36px', maxWidth: 620 }}>
                        {t.t('kit.lead')}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="umd-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column' }}>
                            <h3 className="umd-heading-3" style={{ fontSize: 17, marginBottom: 6 }}>{t.t('kit.c1Title')}</h3>
                            <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.55, margin: '0 0 14px' }}>{t.t('kit.c1P1')}<strong>{t.t('kit.c1Bold')}</strong>{t.t('kit.c1P2')}</p>
                            <a href="https://filigrane.beta.gouv.fr/" target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-primary umd-btn-sm" style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>{t.t('kit.c1Btn')}<ExternalLink style={{ width: 15, height: 15 }} /></a>
                        </div>
                        <div className="umd-card" style={{ padding: '20px 22px' }}>
                            <h3 className="umd-heading-3" style={{ fontSize: 17, marginBottom: 6 }}>{t.t('kit.c2Title')}</h3>
                            <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.55, margin: '0 0 12px' }}>{t.t('kit.c2P')}</p>
                            <div style={{ display: 'flex', gap: 7 }}>
                                <span className="umd-chip umd-chip-neutral" style={{ fontSize: 12, background: '#fff' }}>KeePass</span>
                                <span className="umd-chip umd-chip-neutral" style={{ fontSize: 12, background: '#fff' }}>LockPass</span>
                            </div>
                        </div>
                        <div className="umd-card" style={{ padding: '20px 22px' }}>
                            <h3 className="umd-heading-3" style={{ fontSize: 17, marginBottom: 6 }}>{t.t('kit.c3Title')}</h3>
                            <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>{t.t('kit.c3P1')}<strong>{t.t('kit.c3Bold')}</strong>{t.t('kit.c3P2')}</p>
                        </div>
                        <div className="umd-card" style={{ padding: '20px 22px' }}>
                            <h3 className="umd-heading-3" style={{ fontSize: 17, marginBottom: 6 }}>{t.t('kit.c4Title')}</h3>
                            <p style={{ ...MUTED, fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>{t.t('kit.c4P')}</p>
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
                            <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{t.t('sources.toggle')}</span>
                            {sourcesOpen ? (
                                <ChevronUp style={{ width: 18, height: 18, color: 'var(--fg3)' }} />
                            ) : (
                                <ChevronDown style={{ width: 18, height: 18, color: 'var(--fg3)' }} />
                            )}
                        </button>
                        {sourcesOpen && (
                            <div style={{ padding: '6px 20px 22px', paddingTop: 12, borderTop: '1px solid var(--slate-100)' }}>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5, color: 'var(--fg2)', lineHeight: 1.5 }}>
                                    {sourcesLi.map((txt, i) => (
                                        <li key={i}>{txt}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
