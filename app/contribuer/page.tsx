import Link from 'next/link';
import {
    HeartHandshake, Compass, FilePlus2, Target, Map, ArrowUpRight, ListTodo,
    ShieldCheck, FileSearch, FilePen, BookOpen, ArrowRight, ShieldAlert,
    AlertTriangle, Bug, MessagesSquare, Github, Trophy, Award,
} from 'lucide-react';

const ONBOARDING_URL = "https://onboarding.les-enovateurs.com/";
const FRAMATEAM_URL = "https://framateam.org/signup_user_complete/?id=6a6dmngyhpri8qsewowg4mrt6r&md=link&sbr=su";
const GITHUB_URL = "https://github.com/les-enovateurs/unlock-my-data";

const CONTRIB_ACTIONS = [
    {
        Ic: FilePlus2, t: "Nouvelle fiche", pts: "+10 pts", tag: "Recommandé", to: "/contribuer/nouvelle-fiche",
        d: "Analyser un service absent de l'annuaire — la contribution la plus impactante.",
    },
    {
        Ic: FileSearch, t: "Fiches à revoir", pts: "+5 pts", tag: "3 en attente", to: "/contribuer/fiches-a-revoir",
        d: "Relire les fiches proposées avant publication : la qualité de l'annuaire, c'est vous.",
    },
    {
        Ic: FilePen, t: "Modifier une fiche", pts: "+3 pts", tag: null, to: "/contribuer/modifier-fiche",
        d: "Les politiques évoluent — corrigez ou complétez une fiche existante.",
    },
    {
        Ic: BookOpen, t: "Mettre à jour les guides", pts: "+3 pts", tag: null, to: "/contribuer/modifier-guides",
        d: "Vérifier que les guides de suppression de compte correspondent toujours aux interfaces.",
    },
];

const CONTRIB_SECURITY = [
    {
        Ic: AlertTriangle, t: "Signaler une fuite", to: "/contribuer/signaler-fuite",
        d: "Une base de données exposée, un incident documenté : alertez les personnes concernées.",
    },
    {
        Ic: Bug, t: "Signaler une vulnérabilité", to: "/contribuer/signaler-vulnerabilite",
        d: "Divulgation responsable d'une faille de sécurité, en privé, coordonnée avec le service.",
    },
];

const CONTRIB_STEPS = [
    { n: "1", t: "Suivez l'onboarding", Ic: Compass, d: "Le parcours en ligne de l'association présente le projet, les outils et votre première contribution pas à pas." },
    { n: "2", t: "Choisissez votre contribution", Ic: ListTodo, d: "Une mission ciblée, une nouvelle fiche ou la mise à jour d'une fiche existante — selon votre temps." },
    { n: "3", t: "Soumettez, on relit ensemble", Ic: ShieldCheck, d: "Chaque fiche est relue par un membre expérimenté avant publication. Vous marquez des points au passage." },
];

const ContribuerPage = () => {
    return (
        <div className="bg-white text-umd-slate-900">
            {/* Hero */}
            <section className="bg-gradient-to-b from-umd-indigo-50 to-white border-b border-umd-slate-200">
                <div className="mx-auto max-w-5xl px-6 py-14 text-center">
                    <span className="umd-pill umd-pill-indigo mb-[18px]">
                        <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                        Rejoignez le mouvement
                    </span>
                    <h1 className="umd-h-hero mx-auto mb-4 max-w-[740px]">
                        Rendez <span className="text-umd-indigo-600">transparentes</span> les plateformes numériques
                    </h1>
                    <p className="umd-lead-text mx-auto mb-[26px] max-w-[620px]">
                        Votre contribution, quelle que soit sa taille, a un impact direct : chaque fiche aide
                        des milliers de citoyens à reprendre le contrôle de leurs données.
                    </p>
                    <div className="flex flex-wrap justify-center gap-[14px]">
                        <a href={ONBOARDING_URL} target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-primary umd-btn-lg">
                            <Compass className="h-5 w-5" aria-hidden="true" />
                            Démarrer l&apos;onboarding
                        </a>
                        <Link href="/contribuer/nouvelle-fiche" className="umd-btn umd-btn-outline umd-btn-lg">
                            <FilePlus2 className="h-5 w-5" aria-hidden="true" />
                            Créer une fiche
                        </Link>
                        <Link href="/contribuer/missions" className="umd-btn umd-btn-outline umd-btn-lg">
                            <Target className="h-5 w-5" aria-hidden="true" />
                            Voir les missions
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
                            <h2 className="mb-1 text-[19px] font-bold font-display">Nouveau ? L&apos;association vous accompagne.</h2>
                            <p className="m-0 text-[14.5px] leading-[1.55] text-umd-slate-500">
                                Le parcours d&apos;onboarding des e-novateurs couvre tout : découverte du projet, prise en
                                main des outils, première fiche relue ensemble. Comptez une petite heure, à votre rythme.
                            </p>
                        </div>
                        <a href={ONBOARDING_URL} target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-primary max-md:mx-auto">
                            onboarding.les-enovateurs.com
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-4 max-md:grid-cols-1">
                        {CONTRIB_STEPS.map(({ n, t, Ic, d }) => (
                            <div key={n} className="umd-card px-[22px] pt-[22px] pb-5">
                                <div className="mb-3 flex items-center gap-3">
                                    <span className="data text-[30px] font-bold leading-none text-umd-indigo-300">{n}</span>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-umd-indigo-50 text-umd-indigo-700">
                                        <Ic className="h-[18px] w-[18px]" aria-hidden="true" />
                                    </span>
                                </div>
                                <h3 className="mb-[6px] text-[16.5px] font-bold">{t}</h3>
                                <p className="m-0 text-[13.5px] leading-[1.6] text-umd-slate-500">{d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Actions de contribution */}
            <section className="border-y border-umd-slate-200 bg-umd-slate-50">
                <div className="mx-auto max-w-6xl px-6 py-14">
                    <h2 className="umd-heading-2 mb-2 text-center">Actions de contribution</h2>
                    <p className="mb-8 text-center text-umd-slate-500">
                        Expert RGPD ou débutant curieux : chaque action est guidée et relue.
                    </p>
                    <div className="grid grid-cols-2 gap-[14px] max-md:grid-cols-1">
                        {CONTRIB_ACTIONS.map(({ Ic, t, pts, tag, to, d }) => (
                            <Link key={t} href={to} className="umd-card umd-card-hover flex items-start gap-4 px-[22px] py-5 text-left">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-umd-indigo-800 text-white">
                                    <Ic className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex flex-wrap items-center gap-[10px]">
                                        <span className="text-[16.5px] font-bold font-display">{t}</span>
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
                            Sécurité
                        </h3>
                        <span className="h-px flex-1 bg-umd-slate-200" />
                        <span className="text-[12.5px] text-umd-slate-500">Traité en priorité par l&apos;équipe</span>
                    </div>
                    <div className="grid grid-cols-2 gap-[14px] max-md:grid-cols-1">
                        {CONTRIB_SECURITY.map(({ Ic, t, to, d }) => (
                            <Link key={t} href={to} className="umd-card umd-card-hover flex items-start gap-4 border-umd-red-200 px-[22px] py-[18px] text-left">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-umd-red-50 text-umd-red-600">
                                    <Ic className="h-[19px] w-[19px]" aria-hidden="true" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="text-[15.5px] font-bold font-display">{t}</span>
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
                            <h3 className="mb-[6px] text-[17px] font-bold">Communauté Framateam</h3>
                            <p className="mb-3 mt-0 text-[14px] leading-[1.6] text-umd-slate-500">
                                Échangez avec les autres membres, posez vos questions, partagez vos découvertes.
                            </p>
                            <a href={FRAMATEAM_URL} target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-ghost">
                                Rejoindre la discussion
                                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                    <div className="umd-card flex items-start gap-[18px] px-[26px] py-6">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-umd-indigo-50 text-umd-indigo-700">
                            <Github className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                            <h3 className="mb-[6px] text-[17px] font-bold">Développeurs open source</h3>
                            <p className="mb-3 mt-0 text-[14px] leading-[1.6] text-umd-slate-500">
                                Le projet est sur GitHub (licence MIT) : améliorations, corrections, nouvelles fonctionnalités.
                            </p>
                            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-ghost">
                                Contribuer sur GitHub
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
                            <h2 className="umd-heading-2 mb-[10px] text-white">Prêt à faire la différence ?</h2>
                            <p className="m-0 text-[16px] leading-[1.6] text-white/80">
                                Chaque contribution compte — et vaut des points au classement, ainsi qu&apos;une
                                attestation d&apos;engagement pour les étudiants et bénévoles.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/contributeurs" className="umd-btn umd-btn-lg border-white/35 bg-transparent text-white">
                                <Trophy className="h-5 w-5" aria-hidden="true" />
                                Le classement
                            </Link>
                            <Link href="/contribuer/attestation-engagement" className="umd-btn umd-btn-lg bg-white text-umd-indigo-900">
                                <Award className="h-5 w-5" aria-hidden="true" />
                                Mon attestation
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ContribuerPage;
