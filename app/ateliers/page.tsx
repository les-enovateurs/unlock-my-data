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

type Workshop = {
    icon: typeof ShieldAlert;
    title: string;
    desc: string;
    items: string[];
    available?: boolean;
};

const WORKSHOPS: Workshop[] = [
    {
        icon: Smartphone,
        title: "Mon bilan numérique",
        desc: "Faites le point sur votre situation : analysez vos usages et faites le tri dans vos services.",
        items: ["Inventaire des apps principales", "Carte des transferts de données", "Stratégie de suppression"],
    },
    {
        icon: Search,
        title: "Mission transparence",
        desc: "Passez de l'autre côté du miroir : analysez une application inconnue et apprenez à déchiffrer ce qu'elle cache.",
        items: ["Comprendre les CGU", "Identifier les données collectées", "Contribuer à la base"],
    },
    {
        icon: Scale,
        title: "Le choix éclairé",
        desc: "Avant de créer un compte, posez-vous les bonnes questions. Apprenez à comparer les services.",
        items: ["Critères de confidentialité", "Utiliser le comparateur", "Alternatives éthiques"],
    },
    {
        icon: Mail,
        title: "Stop pub abusive",
        desc: "Encore une publicité non sollicitée ? Apprenez à exercer vos droits et à signaler les abus.",
        items: ["Signaler un abus (CNIL)", "Modèles de courriers", "Stopper les sollicitations"],
    },
    {
        icon: Filter,
        title: "Sortir de ma bulle",
        desc: "Comprenez comment les algorithmes fonctionnent pour percer la bulle de filtre.",
        items: ["Comprendre les algorithmes", "Paramétrer ses préférences", "Diversifier son flux"],
    },
    {
        icon: Briefcase,
        title: "Mon e-réputation professionnelle",
        desc: "Recruteurs et collègues vous cherchent en ligne. Apprenez à verrouiller vos profils.",
        items: ["Audit de visibilité", "Comptes en « Privé »", "Nettoyage des empreintes"],
    },
];

const AteliersPage = () => {
    return (
        <div className="bg-white text-umd-slate-900 font-sans">
            {/* Hero */}
            <section className="bg-gradient-to-b from-umd-indigo-50 to-white border-b border-umd-slate-200 text-center">
                <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
                    <span className="umd-pill umd-pill-indigo mb-6">
                        <Lightbulb aria-hidden="true" />
                        Apprendre par la pratique
                    </span>
                    <h1 className="umd-h-hero mb-5">
                        Reprenez le pouvoir<br />
                        <span className="text-umd-indigo-600">sur votre vie numérique</span>
                    </h1>
                    <p className="umd-lead-text mx-auto max-w-2xl">
                        Des ateliers interactifs étape par étape pour comprendre, sécuriser et maîtriser vos données
                        personnelles.
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
                            <h2 className="umd-heading-3 mb-2">Pourquoi ces ateliers ?</h2>
                            <p className="text-umd-slate-600">
                                La protection des données peut sembler complexe. Nous avons découpé les problèmes concrets en
                                <span className="font-semibold text-umd-indigo-700"> missions simples et guidées</span>.
                                Choisissez votre point de départ.
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
                                <span className="umd-chip umd-chip-danger">Anticiper</span>
                            </div>
                            <h2 className="umd-heading-3 mb-4 text-2xl">Mes données ont fuité</h2>
                            <p className="mb-6 min-h-14 text-lg text-umd-slate-600">
                                « J'ai reçu une alerte par mail ou SMS... » Pas de panique. Vérifiez s'il s'agit d'une
                                vraie fuite et sécurisez vos comptes critiques.
                            </p>
                            <div className="mb-8 rounded-xl bg-umd-slate-50 p-5">
                                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-umd-slate-400">Dans cet atelier :</p>
                                <ul className="space-y-2 text-sm text-umd-slate-700">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-umd-green-600" aria-hidden="true" /> Vérification de la source (phishing ou réel ?)</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-umd-green-600" aria-hidden="true" /> Sécurisation du compte touché</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-umd-green-600" aria-hidden="true" /> Nettoyage des comptes « zombies »</li>
                                </ul>
                            </div>
                            <Link href="/ateliers/urgence-fuite" className="umd-btn umd-btn-primary mt-auto w-full">
                                J'ai reçu une alerte
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
                                        <span className="umd-chip umd-chip-neutral">Bientôt</span>
                                    </div>
                                    <h2 className="umd-heading-3 mb-4 text-2xl text-umd-slate-600">{w.title}</h2>
                                    <p className="mb-6 min-h-14 text-umd-slate-500">{w.desc}</p>
                                    <div className="mb-8 rounded-xl bg-umd-slate-50 p-5">
                                        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-umd-slate-400">Dans cet atelier :</p>
                                        <ul className="space-y-2 text-sm text-umd-slate-500">
                                            {w.items.map((it) => (
                                                <li key={it} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-umd-slate-400" aria-hidden="true" /> {it}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button disabled className="umd-btn umd-btn-outline mt-auto w-full cursor-not-allowed opacity-60">
                                        Non disponible
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
                    <h2 className="umd-heading-2 mb-6">Vous ne savez pas par où commencer ?</h2>
                    <p className="umd-lead-text mx-auto mb-8 max-w-2xl">
                        Le plus important est de faire le premier pas. L'audit de sécurité est souvent un excellent point de départ.
                    </p>
                    <Link href="/ateliers/urgence-fuite" className="umd-btn umd-btn-outline umd-btn-lg">
                        Je commence par mon bilan
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AteliersPage;
