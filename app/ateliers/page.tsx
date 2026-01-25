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
            <section className="relative py-24 md:py-32 bg-gradient-to-br from-base-100 via-base-200 to-primary/10 overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-8">
                        <Lightbulb className="w-4 h-4" />
                        <span className="font-bold text-sm uppercase tracking-wide">Apprendre par la pratique</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                        Reprenez le pouvoir sur <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">votre vie numérique</span>
                    </h1>

                    <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Des ateliers interactifs step-by-step pour comprendre, sécuriser et maîtriser vos données personnelles. Ne subissez plus, agissez.
                    </p>
                </div>
            </section>

            {/* Introduction / Why Workshops */}
            <section className="py-12 bg-base-100 border-b border-base-200">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center text-center md:text-left">
                        <div className="bg-base-200 p-4 rounded-full">
                            <Target className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Pourquoi ces ateliers ?</h3>
                            <p className="text-base-content/70">
                                La protection des données peut sembler complexe. Nous avons découpé les problèmes concrets en
                                <span className="font-semibold text-primary"> missions simples et guidées</span>.
                                Choisissez votre point de départ.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workshops Grid */}
            <section className="py-20 bg-base-200/50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                        {/* WORKSHOP 1: REACTIVE / CRISIS */}
                        {/* Concept: "Etre guidé sur j'ai reçu un sms ou un mail..." */}
                        <div className="card bg-base-100 shadow-xl border-t-4 border-t-red-500 hover:shadow-2xl transition-all duration-300 group">
                            <div className="card-body p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-red-500/10 text-red-500 p-4 rounded-xl group-hover:scale-110 transition-transform">
                                        <ShieldAlert className="w-8 h-8" />
                                    </div>
                                    <div className="badge badge-error gap-2 text-white font-bold">Urgence</div>
                                </div>

                                <h2 className="card-title text-3xl mb-4">Mes données ont fuité ?</h2>
                                <p className="text-base-content/70 mb-6 text-lg min-h-[3.5rem]">
                                    &quot;J&apos;ai reçu une alerte par mail ou SMS...&quot; Pas de panique. Vérifiez s&apos;il s&apos;agit d&apos;une vraie fuite et sécurisez vos comptes critiques.
                                </p>

                                <div className="bg-base-200/50 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/50 mb-3">Dans cet atelier :</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Vérification de la source (Phishing vs Réel)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Sécurisation du compte touché
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Nettoyage des comptes &quot;zombies&quot;
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <Link href="/ateliers/urgence-fuite" className="btn btn-error w-full text-white shadow-lg shadow-red-500/20">
                                        J&apos;ai reçu une alerte
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* WORKSHOP 2: PROACTIVE / AUDIT */}
                        {/* Concept: "Faire le point sur ces données, les services qu'on utilise..." */}
                        <div className="card bg-base-100 shadow-xl border-t-4 border-t-blue-500 hover:shadow-2xl transition-all duration-300 group">
                            <div className="card-body p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-blue-500/10 text-blue-500 p-4 rounded-xl group-hover:scale-110 transition-transform">
                                        <Smartphone className="w-8 h-8" />
                                    </div>
                                    <div className="badge badge-info gap-2 text-white font-bold">Prévention</div>
                                </div>

                                <h2 className="card-title text-3xl mb-4">Mon Bilan Numérique</h2>
                                <p className="text-base-content/70 mb-6 text-lg min-h-[3.5rem]">
                                    On entend parler de fuites tous les jours. Faites le point sur votre situation : analysez vos usages et faites le tri dans vos services.
                                </p>

                                <div className="bg-base-200/50 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/50 mb-3">Dans cet atelier :</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Inventaire des apps principales
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Carte des transferts de données
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Stratégie de suppression
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <Link href="/ateliers/mon-bilan" className="btn btn-info w-full text-white shadow-lg shadow-blue-500/20">
                                        Faire mon audit
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* WORKSHOP 3: INVESTIGATION / EDUCATION */}
                        {/* Concept: "Mieux comprendre les enjeux... en jouant les enqueteurs" */}
                        <div className="card bg-base-100 shadow-xl border-t-4 border-t-purple-500 hover:shadow-2xl transition-all duration-300 group">
                            <div className="card-body p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-purple-500/10 text-purple-500 p-4 rounded-xl group-hover:scale-110 transition-transform">
                                        <Search className="w-8 h-8" />
                                    </div>
                                    <div className="badge badge-secondary gap-2 text-white font-bold">Éducation</div>
                                </div>

                                <h2 className="card-title text-3xl mb-4">Mission Transparence</h2>
                                <p className="text-base-content/70 mb-6 text-lg min-h-[3.5rem]">
                                    Passez de l&apos;autre côté du miroir. Analysez une application inconnue et apprenez à déchiffrer ce qu&apos;elles cachent.
                                </p>

                                <div className="bg-base-200/50 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/50 mb-3">Dans cet atelier :</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Comprendre les Conditions d&apos;Utilisation
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Identifier les données collectées
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Contribuer à la base de données
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <Link href="/ateliers/enqueteur" className="btn btn-secondary w-full text-white shadow-lg shadow-purple-500/20">
                                        Démarrer l&apos;enquête
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* WORKSHOP 4: DECISION / TOOLS */}
                        {/* Concept: "Prendre de meilleur decision sur la création de nouveau compte..." */}
                        <div className="card bg-base-100 shadow-xl border-t-4 border-t-emerald-500 hover:shadow-2xl transition-all duration-300 group">
                            <div className="card-body p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-xl group-hover:scale-110 transition-transform">
                                        <Scale className="w-8 h-8" />
                                    </div>
                                    <div className="badge badge-accent gap-2 text-white font-bold">Action</div>
                                </div>

                                <h2 className="card-title text-3xl mb-4">Le Choix Éclairé</h2>
                                <p className="text-base-content/70 mb-6 text-lg min-h-[3.5rem]">
                                    Avant de créer un compte, posez-vous les bonnes questions. Apprenez à comparer les services sur des critères éthiques.
                                </p>

                                <div className="bg-base-200/50 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/50 mb-3">Dans cet atelier :</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Définir mes critères de confidentialité
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Utiliser le comparateur
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Découvrir des alternatives éthiques
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <Link href="/ateliers/comparateur" className="btn btn-accent w-full text-white shadow-lg shadow-emerald-500/20">
                                        Choisir le bon outil
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* WORKSHOP 5: RIGHTS / SIGNALEMENT */}
                        {/* Concept: "Publicité abusives et signalement CNIL" */}
                        <div className="card bg-base-100 shadow-xl border-t-4 border-t-orange-500 hover:shadow-2xl transition-all duration-300 group md:col-span-2 lg:col-span-1">
                            <div className="card-body p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-orange-500/10 text-orange-500 p-4 rounded-xl group-hover:scale-110 transition-transform">
                                        <Mail className="w-8 h-8" />
                                    </div>
                                    <div className="badge badge-warning gap-2 text-white font-bold">Droits</div>
                                </div>

                                <h2 className="card-title text-3xl mb-4">Stop Pub Abusive</h2>
                                <p className="text-base-content/70 mb-6 text-lg min-h-14">
                                    Publicité non sollicitée par courrier ou email ? Ce n&apos;est pas une fatalité. Apprenez à exercer vos droits et à signaler les abus à la CNIL.
                                </p>

                                <div className="bg-base-200/50 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/50 mb-3">Dans cet atelier :</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Signaler un abus à la CNIL (Guidé)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Modèles de courriers de refus
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Stopper les sollicitations
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <Link href="/ateliers/stop-pub" className="btn btn-warning w-full text-white shadow-lg shadow-orange-500/20">
                                        Faire valoir mes droits
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* WORKSHOP 6: SOCIAL BUBBLES / ALGOS */}
                        {/* Concept: "Les réseaux sociaux nous enferment dans notre bulle..." */}
                        <div className="card bg-base-100 shadow-xl border-t-4 border-t-pink-500 hover:shadow-2xl transition-all duration-300 group">
                            <div className="card-body p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-pink-500/10 text-pink-500 p-4 rounded-xl group-hover:scale-110 transition-transform">
                                        <Filter className="w-8 h-8" />
                                    </div>
                                    <div className="badge badge-error gap-2 text-white font-bold bg-pink-500 border-pink-500">Conscience</div>
                                </div>

                                <h2 className="card-title text-3xl mb-4">Sortir de sa Bulle</h2>
                                <p className="text-base-content/70 mb-6 text-lg min-h-14">
                                    Les algorithmes décident de ce que vous voyez. Comprenez comment ils fonctionnent pour percer la bulle de filtre et reprendre le contrôle de votre attention.
                                </p>

                                <div className="bg-base-200/50 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/50 mb-3">Dans cet atelier :</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Comprendre les algorithmes
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Paramétrer ses préférences
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Diversifier son flux d&apos;info
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <Link href="/ateliers/bulles-filtres" className="btn btn-primary w-full text-white shadow-lg shadow-pink-500/20 bg-pink-500 hover:bg-pink-600 border-pink-500">
                                        Ouvrir mes horizons
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* WORKSHOP 7: REPUTATION / JOB */}
                        {/* Concept: "Impact sur l'emploi, profils privés..." */}
                        <div className="card bg-base-100 shadow-xl border-t-4 border-t-slate-600 hover:shadow-2xl transition-all duration-300 group">
                            <div className="card-body p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-slate-500/10 text-slate-600 p-4 rounded-xl group-hover:scale-110 transition-transform">
                                        <Briefcase className="w-8 h-8" />
                                    </div>
                                    <div className="badge badge-neutral gap-2 text-white font-bold">Carrière</div>
                                </div>

                                <h2 className="card-title text-3xl mb-4">Ma E-Réputation Pro</h2>
                                <p className="text-base-content/70 mb-6 text-lg min-h-14">
                                    Recruteurs et collègues vous cherchent en ligne. Que trouvent-ils ? Apprenez à verrouiller vos profils pour séparer strictement vie pro et perso.
                                </p>

                                <div className="bg-base-200/50 rounded-lg p-5 mb-8">
                                    <p className="font-bold text-sm uppercase text-base-content/50 mb-3">Dans cet atelier :</p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Audit de visibilité publique
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Passage des comptes en &quot;Privé&quot;
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Nettoyage de l&apos;empreinte
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-actions mt-auto">
                                    <Link href="/ateliers/e-reputation" className="btn btn-neutral w-full text-white shadow-lg shadow-slate-500/20">
                                        Soigner mon image
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

             {/* Footer Call to Action */}
             <section className="py-24 relative overflow-hidden text-center">
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-3xl font-bold mb-6">Vous ne savez pas par où commencer ?</h2>
                    <p className="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
                        Le plus important est de faire le premier pas. L&apos;audit de sécurité est souvent un excellent point de départ.
                    </p>
                    <Link href="/ateliers/mon-bilan" className="btn btn-outline btn-primary btn-lg">
                        Je commence par mon bilan
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AteliersPage;

