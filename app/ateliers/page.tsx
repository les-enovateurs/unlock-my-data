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

const AteliersPage = () => {
    return (
        <div className="bg-base-100 text-base-content overflow-hidden font-sans">
            {/* Hero Section */}
            <section
                className="relative py-24 md:py-32 bg-linear-to-br from-base-100 via-base-200 to-primary/10 overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-pulse"></div>
                    <div
                        className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-8">
                        <Lightbulb className="w-4 h-4"/>
                        <span className="font-bold text-sm uppercase tracking-wide">Apprendre par la pratique</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                        Reprenez le pouvoir<br/>
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">sur votre vie numérique</span>
                    </h1>

                    <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Des ateliers interactifs étape par étape pour comprendre, sécuriser et maîtriser vos données
                        personnelles.
                    </p>
                </div>
            </section>

            {/* Introduction / Why Workshops */}
            <section className="py-12 bg-base-100 border-b border-base-200">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div
                        className="flex flex-col md:flex-row gap-8 items-center justify-center text-center md:text-left">
                        <div className="bg-base-200 p-4 rounded-full">
                            <Target className="w-8 h-8 text-primary"/>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Pourquoi ces ateliers ?</h3>
                            <p className="text-base-content/70">
                                La protection des données peut sembler complexe. Nous avons découpé les problèmes
                                concrets en
                                <span className="font-semibold text-primary"> missions simples et guidées</span>.
                                Choisissez votre point de départ.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workshops Grid */}
            <section className="py-20 bg-base-200/50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                        {/* WORKSHOP 1: REACTIVE / CRISIS */}
                        {/* Concept: "Etre guidé sur j'ai reçu un sms ou un mail..." */}
                        <div
                            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group h-full">
                            <div className="card-body p-6 md:p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div
                                        className="bg-red-500/10 text-red-500 p-4 rounded-xl group-hover:scale-110 transition-transform">
                                        <ShieldAlert className="w-8 h-8"/>
                                    </div>
                                    <div className="badge badge-error gap-2 text-white font-bold">Anticiper</div>
                                </div>

                                <h2 className="card-title text-3xl mb-4">Mes données ont fuité</h2>
                                <p className="text-base-content/70 mb-6 text-lg min-h-14">
                                    &quot;J&apos;ai reçu une alerte par mail ou SMS...&quot; Pas de panique. Vérifiez
                                    s&apos;il s&apos;agit d&apos;une vraie fuite et sécurisez vos comptes critiques.
                                </p>

                                <div className="bg-base-200/50 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/50 mb-3">Dans cet
                                        atelier :</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500"/> Vérification de la source
                                            (phishing ou réel ?)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500"/> Sécurisation du compte
                                            touché
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500"/> Nettoyage des
                                            comptes &quot;zombies&quot;
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <Link href="/ateliers/urgence-fuite"
                                          className="btn btn-error w-full text-white shadow-lg shadow-red-500/20">
                                        J&apos;ai reçu une alerte
                                        <ArrowRight className="w-4 h-4 ml-2"/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* WORKSHOP 2: PROACTIVE / AUDIT */}
                        <div className="card bg-base-100 shadow-lg border border-base-200 group h-full">
                            <div className="card-body p-6 md:p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-base-200 text-base-content/50 p-4 rounded-xl">
                                        <Smartphone className="w-8 h-8"/>
                                    </div>
                                    <div className="badge badge-ghost">Bientôt</div>
                                </div>

                                <h2 className="card-title text-2xl mb-4 text-base-content/80">Mon bilan numérique</h2>
                                <p className="text-base-content/60 mb-6 min-h-14">
                                    Faites le point sur votre situation : analysez vos usages et faites le tri dans vos
                                    services.
                                </p>

                                <div className="bg-base-200/30 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/40 mb-3">Dans cet
                                        atelier :</p>
                                    <ul className="space-y-2 text-sm text-base-content/50">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Inventaire des apps principales
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Carte des transferts de données
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Stratégie de suppression
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <button disabled
                                            className="btn btn-ghost bg-base-200 w-full text-base-content/40 cursor-not-allowed">
                                        Non disponible
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* WORKSHOP 3: INVESTIGATION / EDUCATION */}
                        <div className="card bg-base-100 shadow-lg border border-base-200 group h-full">
                            <div className="card-body p-6 md:p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-base-200 text-base-content/50 p-4 rounded-xl">
                                        <Search className="w-8 h-8"/>
                                    </div>
                                    <div className="badge badge-ghost">Bientôt</div>
                                </div>

                                <h2 className="card-title text-2xl mb-4 text-base-content/80">Mission transparence</h2>
                                <p className="text-base-content/60 mb-6 min-h-14">
                                    Passez de l&apos;autre côté du miroir :analysez une application inconnue et apprenez
                                    à déchiffrer ce qu&apos;elle cache.
                                </p>

                                <div className="bg-base-200/30 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/40 mb-3">Dans cet
                                        atelier :</p>
                                    <ul className="space-y-2 text-sm text-base-content/50">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Comprendre les CGU
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Identifier les données collectées
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Contribuer à la base
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <button disabled
                                            className="btn btn-ghost bg-base-200 w-full text-base-content/40 cursor-not-allowed">
                                        Non disponible
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* WORKSHOP 4: DECISION / TOOLS */}
                        <div className="card bg-base-100 shadow-lg border border-base-200 group h-full">
                            <div className="card-body p-6 md:p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-base-200 text-base-content/50 p-4 rounded-xl">
                                        <Scale className="w-8 h-8"/>
                                    </div>
                                    <div className="badge badge-ghost">Bientôt</div>
                                </div>

                                <h2 className="card-title text-2xl mb-4 text-base-content/80">Le choix éclairé</h2>
                                <p className="text-base-content/60 mb-6 min-h-14">
                                    Avant de créer un compte, posez-vous les bonnes questions. Apprenez à comparer les
                                    services.
                                </p>

                                <div className="bg-base-200/30 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/40 mb-3">Dans cet
                                        atelier :</p>
                                    <ul className="space-y-2 text-sm text-base-content/50">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Critères de confidentialité
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Utiliser le comparateur
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Alternatives éthiques
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <button disabled
                                            className="btn btn-ghost bg-base-200 w-full text-base-content/40 cursor-not-allowed">
                                        Non disponible
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* WORKSHOP 5: RIGHTS / SIGNALEMENT */}
                        <div
                            className="card bg-base-100 shadow-lg border border-base-200 group md:col-span-2 lg:col-span-1 h-full">
                            <div className="card-body p-6 md:p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-base-200 text-base-content/50 p-4 rounded-xl">
                                        <Mail className="w-8 h-8"/>
                                    </div>
                                    <div className="badge badge-ghost">Bientôt</div>
                                </div>

                                <h2 className="card-title text-2xl mb-4 text-base-content/80">Stop pub abusive</h2>
                                <p className="text-base-content/60 mb-6 min-h-14">
                                    Encore une publicité non sollicitée ? Apprenez à exercer vos droits et à signaler les abus.
                                </p>

                                <div className="bg-base-200/30 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/40 mb-3">Dans cet
                                        atelier :</p>
                                    <ul className="space-y-2 text-sm text-base-content/50">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Signaler un abus (CNIL)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Modèles de courriers
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Stopper les sollicitations
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <button disabled
                                            className="btn btn-ghost bg-base-200 w-full text-base-content/40 cursor-not-allowed">
                                        Non disponible
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* WORKSHOP 6: SOCIAL BUBBLES / ALGOS */}
                        <div className="card bg-base-100 shadow-lg border border-base-200 group h-full">
                            <div className="card-body p-6 md:p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-base-200 text-base-content/50 p-4 rounded-xl">
                                        <Filter className="w-8 h-8"/>
                                    </div>
                                    <div className="badge badge-ghost">Bientôt</div>
                                </div>

                                <h2 className="card-title text-2xl mb-4 text-base-content/80">Sortir de ma bulle</h2>
                                <p className="text-base-content/60 mb-6 min-h-14">
                                    Comprenez comment les algorithmes fonctionnent pour percer la bulle de filtre.
                                </p>

                                <div className="bg-base-200/30 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/40 mb-3">Dans cet
                                        atelier :</p>
                                    <ul className="space-y-2 text-sm text-base-content/50">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Comprendre les algorithmes
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Paramétrer ses préférences
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Diversifier son flux
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <button disabled
                                            className="btn btn-ghost bg-base-200 w-full text-base-content/40 cursor-not-allowed">
                                        Non disponible
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* WORKSHOP 7: REPUTATION / JOB */}
                        <div className="card bg-base-100 shadow-lg border border-base-200 group h-full">
                            <div className="card-body p-6 md:p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-base-200 text-base-content/50 p-4 rounded-xl">
                                        <Briefcase className="w-8 h-8"/>
                                    </div>
                                    <div className="badge badge-ghost">Bientôt</div>
                                </div>

                                <h2 className="card-title text-2xl mb-4 text-base-content/80">Mon e-réputation professionnelle</h2>
                                <p className="text-base-content/60 mb-6 min-h-14">
                                    Recruteurs et collègues vous cherchent en ligne. Apprenez à verrouiller vos profils.
                                </p>

                                <div className="bg-base-200/30 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/40 mb-3">Dans cet
                                        atelier :</p>
                                    <ul className="space-y-2 text-sm text-base-content/50">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Audit de visibilité
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Comptes en &quot;Privé&quot;
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4"/> Nettoyage des empreintes
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <button disabled
                                            className="btn btn-ghost bg-base-200 w-full text-base-content/40 cursor-not-allowed">
                                        Non disponible
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* Footer Call to Action */
            }
            <section className="py-24 relative overflow-hidden text-center">
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl font-bold mb-6">Vous ne savez pas par où commencer ?</h2>
                    <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
                        Le plus important est de faire le premier pas. L&apos;audit de sécurité est souvent un excellent
                        point
                        de départ.
                    </p>
                    <Link href="/ateliers/mon-bilan" className="btn btn-outline btn-primary btn-lg">
                        Je commence par mon bilan
                    </Link>
                </div>
            </section>
        </div>
    )
        ;
};

export default AteliersPage;

