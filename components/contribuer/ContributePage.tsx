import Link from 'next/link';
import {
    HeartHandshake, Compass, FilePlus2, Target, Map, ArrowUpRight, ListTodo,
    ShieldCheck, FileSearch, FilePen, BookOpen, ArrowRight, ShieldAlert,
    AlertTriangle, Bug, MessagesSquare, Github, Trophy, Award,
} from 'lucide-react';
import Translator from '@/components/tools/t';
import dict from '@/i18n/Contribute.json';

const ONBOARDING_URL = "https://onboarding.les-enovateurs.com/";
const FRAMATEAM_URL = "https://framateam.org/signup_user_complete/?id=6a6dmngyhpri8qsewowg4mrt6r&md=link&sbr=su";
const GITHUB_URL = "https://github.com/les-enovateurs/unlock-my-data";

export default function ContributePage({ lang }: { lang: string }) {
    const t = new Translator(dict, lang);
    const isFr = lang === 'fr';

    const r = {
        newForm: isFr ? '/contribuer/nouvelle-fiche' : '/contribute/new-form',
        review: isFr ? '/contribuer/fiches-a-revoir' : '/contribute/forms-to-review',
        editForm: isFr ? '/contribuer/modifier-fiche' : '/contribute/update-form',
        guides: isFr ? '/contribuer/modifier-guides' : '/contribute/update-guides',
        guide: isFr ? '/contribuer/guide' : '/contribute/guide',
        missions: isFr ? '/contribuer/missions' : '/contribute/missions',
        leak: isFr ? '/contribuer/signaler-fuite' : '/contribute/report-leak',
        vuln: isFr ? '/contribuer/signaler-vulnerabilite' : '/contribute/report-vulnerability',
        leaderboard: isFr ? '/contributeurs' : '/contributors',
        certificate: isFr ? '/contribuer/attestation-engagement' : '/contribute/engagement-certificate',
    };

    const actions = [
        { Ic: FilePlus2, t: t.t('action0Title'), pts: "+10 pts", tag: t.t('action0Tag'), to: r.newForm, d: t.t('action0Desc') },
        { Ic: FileSearch, t: t.t('action1Title'), pts: "+5 pts", tag: t.t('action1Tag'), to: r.review, d: t.t('action1Desc') },
        { Ic: FilePen, t: t.t('action2Title'), pts: "+3 pts", tag: null, to: r.editForm, d: t.t('action2Desc') },
        { Ic: BookOpen, t: t.t('action3Title'), pts: "+3 pts", tag: null, to: r.guides, d: t.t('action3Desc') },
    ];

    const security = [
        { Ic: AlertTriangle, t: t.t('security0Title'), to: r.leak, d: t.t('security0Desc') },
        { Ic: Bug, t: t.t('security1Title'), to: r.vuln, d: t.t('security1Desc') },
    ];

    const steps = [
        { n: "1", t: t.t('step1Title'), Ic: Compass, d: t.t('step1Desc') },
        { n: "2", t: t.t('step2Title'), Ic: ListTodo, d: t.t('step2Desc') },
        { n: "3", t: t.t('step3Title'), Ic: ShieldCheck, d: t.t('step3Desc') },
    ];

    return (
        <div className="bg-white text-umd-slate-900">
            {/* Hero */}
            <section className="bg-gradient-to-b from-umd-indigo-50 to-white border-b border-umd-slate-200">
                <div className="mx-auto max-w-5xl px-6 py-14 text-center">
                    <span className="umd-pill umd-pill-indigo mb-[18px]">
                        <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                        {t.t('heroPill')}
                    </span>
                    <h1 className="umd-h-hero mx-auto mb-4 max-w-[740px]">
                        {t.t('heroTitlePre')} <span className="text-umd-indigo-600">{t.t('heroTitleEm')}</span> {t.t('heroTitlePost')}
                    </h1>
                    <p className="umd-lead-text mx-auto mb-[26px] max-w-[620px]">
                        {t.t('heroLead')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-[14px]">
                        <a href={ONBOARDING_URL} target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-primary umd-btn-lg">
                            <Compass className="h-5 w-5" aria-hidden="true" />
                            {t.t('heroCtaOnboarding')}
                        </a>
                        <Link href={r.newForm} className="umd-btn umd-btn-outline umd-btn-lg">
                            <FilePlus2 className="h-5 w-5" aria-hidden="true" />
                            {t.t('heroCtaNewForm')}
                        </Link>
                        <Link href={r.guide} className="umd-btn umd-btn-outline umd-btn-lg">
                            <BookOpen className="h-5 w-5" aria-hidden="true" />
                            {t.t('heroCtaGuide')}
                        </Link>
                        <Link href={r.missions} className="umd-btn umd-btn-outline umd-btn-lg">
                            <Target className="h-5 w-5" aria-hidden="true" />
                            {t.t('heroCtaMissions')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Onboarding callout + steps */}
            <section className="py-14">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="umd-card grid grid-cols-[auto_1fr_auto] items-center gap-[22px] border-2 border-umd-indigo-200 bg-umd-indigo-50 px-[26px] py-[22px] shadow-none max-md:grid-cols-1 max-md:text-center">
                        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-umd-indigo-800 text-white max-md:mx-auto">
                            <Map className="h-[26px] w-[26px]" aria-hidden="true" />
                        </span>
                        <div>
                            <h2 className="mb-1 text-[19px] font-bold font-display">{t.t('onboardingTitle')}</h2>
                            <p className="m-0 text-[14.5px] leading-[1.55] text-umd-slate-500">
                                {t.t('onboardingBody')}
                            </p>
                        </div>
                        <a href={ONBOARDING_URL} target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-primary max-md:mx-auto">
                            {t.t('onboardingLink')}
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-4 max-md:grid-cols-1">
                        {steps.map(({ n, t: title, Ic, d }) => (
                            <div key={n} className="umd-card px-[22px] pt-[22px] pb-5">
                                <div className="mb-3 flex items-center gap-3">
                                    <span className="data text-[30px] font-bold leading-none text-umd-indigo-300">{n}</span>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-umd-indigo-50 text-umd-indigo-700">
                                        <Ic className="h-[18px] w-[18px]" aria-hidden="true" />
                                    </span>
                                </div>
                                <h3 className="mb-[6px] text-[16.5px] font-bold">{title}</h3>
                                <p className="m-0 text-[13.5px] leading-[1.6] text-umd-slate-500">{d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Actions */}
            <section className="border-y border-umd-slate-200 bg-umd-slate-50">
                <div className="mx-auto max-w-6xl px-6 py-14">
                    <h2 className="umd-heading-2 mb-2 text-center">{t.t('actionsHeading')}</h2>
                    <p className="mb-8 text-center text-umd-slate-500">
                        {t.t('actionsSubtitle')}
                    </p>
                    <div className="grid grid-cols-2 gap-[14px] max-md:grid-cols-1">
                        {actions.map(({ Ic, t: title, pts, tag, to, d }) => (
                            <Link key={title} href={to} className="umd-card umd-card-hover flex items-start gap-4 px-[22px] py-5 text-left">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-umd-indigo-800 text-white">
                                    <Ic className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex flex-wrap items-center gap-[10px]">
                                        <span className="text-[16.5px] font-bold font-display">{title}</span>
                                        <span className="umd-pill umd-pill-gold px-[10px] py-[3px] text-[11px]">{pts}</span>
                                        {tag && <span className="umd-pill umd-pill-indigo px-[10px] py-[3px] text-[11px]">{tag}</span>}
                                    </span>
                                    <span className="mt-[6px] block text-[13.5px] leading-[1.55] text-umd-slate-500">{d}</span>
                                </span>
                                <ArrowRight className="mt-1 h-[17px] w-[17px] shrink-0 text-umd-indigo-400" aria-hidden="true" />
                            </Link>
                        ))}
                    </div>

                    <div className="my-[36px] mb-[18px] flex items-center gap-[14px]">
                        <h3 className="flex items-center gap-[9px] text-[18px] font-bold font-display">
                            <ShieldAlert className="h-[18px] w-[18px] text-umd-red-600" aria-hidden="true" />
                            {t.t('securityHeading')}
                        </h3>
                        <span className="h-px flex-1 bg-umd-slate-200" />
                        <span className="text-[12.5px] text-umd-slate-500">{t.t('securityNote')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-[14px] max-md:grid-cols-1">
                        {security.map(({ Ic, t: title, to, d }) => (
                            <Link key={title} href={to} className="umd-card umd-card-hover flex items-start gap-4 border-umd-red-200 px-[22px] py-[18px] text-left">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-umd-red-50 text-umd-red-600">
                                    <Ic className="h-[19px] w-[19px]" aria-hidden="true" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="text-[15.5px] font-bold font-display">{title}</span>
                                    <span className="mt-[5px] block text-[13px] leading-[1.55] text-umd-slate-500">{d}</span>
                                </span>
                                <ArrowRight className="mt-1 h-[17px] w-[17px] shrink-0 text-umd-red-200" aria-hidden="true" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community & developers */}
            <section className="py-14">
                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 max-md:grid-cols-1">
                    <div className="umd-card flex items-start gap-[18px] px-[26px] py-6">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-umd-indigo-50 text-umd-indigo-700">
                            <MessagesSquare className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                            <h3 className="mb-[6px] text-[17px] font-bold">{t.t('framateamTitle')}</h3>
                            <p className="mb-3 mt-0 text-[14px] leading-[1.6] text-umd-slate-500">
                                {t.t('framateamBody')}
                            </p>
                            <a href={FRAMATEAM_URL} target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-ghost">
                                {t.t('framateamLink')}
                                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                    <div className="umd-card flex items-start gap-[18px] px-[26px] py-6">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-umd-indigo-50 text-umd-indigo-700">
                            <Github className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                            <h3 className="mb-[6px] text-[17px] font-bold">{t.t('githubTitle')}</h3>
                            <p className="mb-3 mt-0 text-[14px] leading-[1.6] text-umd-slate-500">
                                {t.t('githubBody')}
                            </p>
                            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-ghost">
                                {t.t('githubLink')}
                                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="pb-[72px]">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="flex flex-wrap items-center justify-between gap-7 rounded-3xl bg-umd-indigo-950 px-11 py-10 text-white">
                        <div className="max-w-[560px]">
                            <h2 className="umd-heading-2 mb-[10px] text-white">{t.t('ctaTitle')}</h2>
                            <p className="m-0 text-[16px] leading-[1.6] text-white/80">
                                {t.t('ctaBody')}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href={r.leaderboard} className="umd-btn umd-btn-lg border-white/35 bg-transparent text-white">
                                <Trophy className="h-5 w-5" aria-hidden="true" />
                                {t.t('ctaLeaderboard')}
                            </Link>
                            <Link href={r.certificate} className="umd-btn umd-btn-lg bg-white text-umd-indigo-900">
                                <Award className="h-5 w-5" aria-hidden="true" />
                                {t.t('ctaCertificate')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
