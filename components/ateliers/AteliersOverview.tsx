import Link from 'next/link';
import {
    ShieldAlert,
    Smartphone,
    Search,
    Scale,
    ArrowRight,
    Lightbulb,
    CheckCircle2,
    Target,
    Mail,
    Filter,
    Briefcase
} from 'lucide-react';
import Translator from '@/components/tools/t';
import dict from '@/i18n/Ateliers.json';

type Workshop = {
    icon: typeof ShieldAlert;
    title: string;
    desc: string;
    items: string[];
    available?: boolean;
};

export default function AteliersOverview({ lang }: { lang: string }) {
    const t = new Translator(dict, lang);
    const isFr = lang === 'fr';

    const leakHref = isFr ? '/ateliers/urgence-fuite' : '/workshops/data-leak-emergency';
    const ctaHref = isFr ? '/proteger-mes-donnees' : '/protect-my-data';

    const WORKSHOPS: Workshop[] = [
        {
            icon: Smartphone,
            title: t.t('workshop0Title'),
            desc: t.t('workshop0Desc'),
            items: [t.t('workshop0Item0'), t.t('workshop0Item1'), t.t('workshop0Item2')],
        },
        {
            icon: Search,
            title: t.t('workshop1Title'),
            desc: t.t('workshop1Desc'),
            items: [t.t('workshop1Item0'), t.t('workshop1Item1'), t.t('workshop1Item2')],
        },
        {
            icon: Scale,
            title: t.t('workshop2Title'),
            desc: t.t('workshop2Desc'),
            items: [t.t('workshop2Item0'), t.t('workshop2Item1'), t.t('workshop2Item2')],
        },
        {
            icon: Mail,
            title: t.t('workshop3Title'),
            desc: t.t('workshop3Desc'),
            items: [t.t('workshop3Item0'), t.t('workshop3Item1'), t.t('workshop3Item2')],
        },
        {
            icon: Filter,
            title: t.t('workshop4Title'),
            desc: t.t('workshop4Desc'),
            items: [t.t('workshop4Item0'), t.t('workshop4Item1'), t.t('workshop4Item2')],
        },
        {
            icon: Briefcase,
            title: t.t('workshop5Title'),
            desc: t.t('workshop5Desc'),
            items: [t.t('workshop5Item0'), t.t('workshop5Item1'), t.t('workshop5Item2')],
        },
    ];

    return (
        <div className="bg-white text-umd-slate-900 font-sans">
            {/* Hero */}
            <section className="bg-gradient-to-b from-umd-indigo-50 to-white border-b border-umd-slate-200 text-center">
                <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
                    <span className="umd-pill umd-pill-indigo mb-6">
                        <Lightbulb aria-hidden="true" />
                        {t.t('heroPill')}
                    </span>
                    <h1 className="umd-h-hero mb-5">
                        {t.t('heroTitleLine1')}<br />
                        <span className="text-umd-indigo-600">{t.t('heroTitleLine2')}</span>
                    </h1>
                    <p className="umd-lead-text mx-auto max-w-2xl">
                        {t.t('heroLead')}
                    </p>
                </div>
            </section>

            {/* Why workshops */}
            <section className="border-b border-umd-slate-200 py-12">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="flex flex-col items-center justify-center gap-6 text-center md:flex-row md:text-left">
                        <div className="rounded-full bg-umd-indigo-50 p-4 text-umd-indigo-700">
                            <Target className="h-8 w-8" aria-hidden="true" />
                        </div>
                        <div>
                            <h2 className="umd-heading-3 mb-2">{t.t('whyHeading')}</h2>
                            <p className="text-umd-slate-600">
                                {t.t('whyBodyStart')}
                                <span className="font-semibold text-umd-indigo-700"> {t.t('whyBodyHighlight')}</span>
                                {t.t('whyBodyEnd')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workshops grid */}
            <section className="bg-umd-slate-50 py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">

                        {/* Active workshop: leak / crisis */}
                        <div className="umd-card umd-card-hover flex h-full flex-col p-6 md:p-8">
                            <div className="mb-6 flex items-start justify-between">
                                <div className="rounded-xl bg-umd-red-50 p-4 text-umd-red-600">
                                    <ShieldAlert className="h-8 w-8" aria-hidden="true" />
                                </div>
                                <span className="umd-chip umd-chip-danger">{t.t('leakChip')}</span>
                            </div>
                            <h2 className="umd-heading-3 mb-4 text-2xl">{t.t('leakTitle')}</h2>
                            <p className="mb-6 min-h-14 text-lg text-umd-slate-600">
                                {t.t('leakDesc')}
                            </p>
                            <div className="mb-8 rounded-xl bg-umd-slate-50 p-5">
                                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-umd-slate-400">{t.t('inThisWorkshop')}</p>
                                <ul className="space-y-2 text-sm text-umd-slate-700">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-umd-green-600" aria-hidden="true" /> {t.t('leakItem1')}</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-umd-green-600" aria-hidden="true" /> {t.t('leakItem2')}</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-umd-green-600" aria-hidden="true" /> {t.t('leakItem3')}</li>
                                </ul>
                            </div>
                            <Link href={leakHref} className="umd-btn umd-btn-primary mt-auto w-full">
                                {t.t('leakButton')}
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </div>

                        {/* Upcoming workshops */}
                        {WORKSHOPS.map((w) => {
                            const Ic = w.icon;
                            return (
                                <div key={w.title} className="umd-card flex h-full flex-col p-6 md:p-8">
                                    <div className="mb-6 flex items-start justify-between">
                                        <div className="rounded-xl bg-umd-slate-100 p-4 text-umd-slate-400">
                                            <Ic className="h-8 w-8" aria-hidden="true" />
                                        </div>
                                        <span className="umd-chip umd-chip-neutral">{t.t('comingSoon')}</span>
                                    </div>
                                    <h2 className="umd-heading-3 mb-4 text-2xl text-umd-slate-600">{w.title}</h2>
                                    <p className="mb-6 min-h-14 text-umd-slate-500">{w.desc}</p>
                                    <div className="mb-8 rounded-xl bg-umd-slate-50 p-5">
                                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-umd-slate-400">{t.t('inThisWorkshop')}</p>
                                        <ul className="space-y-2 text-sm text-umd-slate-500">
                                            {w.items.map((it) => (
                                                <li key={it} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-umd-slate-400" aria-hidden="true" /> {it}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button disabled className="umd-btn umd-btn-outline mt-auto w-full cursor-not-allowed opacity-60">
                                        {t.t('unavailable')}
                                    </button>
                                </div>
                            );
                        })}

                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-20 text-center">
                <div className="mx-auto max-w-3xl px-6">
                    <h2 className="umd-heading-2 mb-6">{t.t('ctaHeading')}</h2>
                    <p className="umd-lead-text mx-auto mb-8 max-w-2xl">
                        {t.t('ctaLead')}
                    </p>
                    <Link href={ctaHref} className="umd-btn umd-btn-outline umd-btn-lg">
                        {t.t('ctaButton')}
                    </Link>
                </div>
            </section>
        </div>
    );
}
