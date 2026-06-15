import Link from 'next/link';
import { ArrowRight, CheckCircle, Code, FileUp, MessageSquare, Users, Github, Play, Heart, Sparkles, Target, ListTodo, ShieldAlert, AlertTriangle, Bug } from 'lucide-react';
import apercu from "../../public/preview-video.webp"
import Image from 'next/image';

const ContribuerPage = () => {
    return (
        <div className="bg-white text-umd-slate-900">
            {/* Hero */}
            <section className="bg-gradient-to-b from-umd-indigo-50 to-white border-b border-umd-slate-200 text-center">
                <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
                    <span className="umd-pill umd-pill-indigo mb-6">
                        <Heart className="fill-current" aria-hidden="true" />
                        Rejoignez le mouvement
                    </span>
                    <h1 className="umd-h-hero mb-6">
                        Rendez <span className="text-umd-indigo-600">transparentes</span><br />
                        les plateformes numériques
                    </h1>
                    <p className="umd-lead-text mx-auto mb-10 max-w-3xl">
                        Aidez des milliers de citoyens à reprendre le contrôle de leurs données personnelles.
                        Votre contribution, quelle que soit sa taille, a un impact direct.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a href="#ways-to-contribute" className="umd-btn umd-btn-primary umd-btn-lg">
                            Commencer à contribuer
                            <ArrowRight className="h-5 w-5" aria-hidden="true" />
                        </a>
                        <a href="#nouveau" className="umd-btn umd-btn-ghost umd-btn-lg">
                            <Play className="h-5 w-5" aria-hidden="true" />
                            Voir comment faire
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {[
                            { icon: FileUp, value: "50+", label: "Services analysés" },
                            { icon: Users, value: "20+", label: "Contributeurs actifs" },
                            { icon: Code, value: "100%", label: "Open Source" },
                        ].map(({ icon: Ic, value, label }) => (
                            <div key={label} className="umd-card flex flex-col items-center p-8 text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-umd-indigo-50 text-umd-indigo-700">
                                    <Ic className="h-6 w-6" aria-hidden="true" />
                                </div>
                                <div className="data text-4xl font-bold text-umd-slate-900">{value}</div>
                                <div className="text-lg font-medium text-umd-slate-600">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ways to contribute */}
            <section id="ways-to-contribute" className="bg-umd-slate-50 py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="umd-heading-2 mb-6">Comment vous pouvez aider</h2>
                        <p className="umd-lead-text mx-auto max-w-2xl">
                            Que vous soyez un expert en protection des données ou un débutant curieux, il existe une place pour vous.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Missions */}
                        <div className="umd-card umd-card-hover relative overflow-hidden p-10">
                            <span className="umd-pill umd-pill-gold absolute right-4 top-4">Nouveau</span>
                            <div className="mb-6 flex items-start gap-6">
                                <div className="rounded-2xl bg-umd-indigo-50 p-4 text-umd-indigo-700">
                                    <Target className="h-8 w-8" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="umd-heading-3 mb-2 text-2xl">Missions</h3>
                                    <p className="text-umd-slate-500">Rejoignez une mission ciblée.</p>
                                </div>
                            </div>
                            <p className="mb-8 text-lg leading-relaxed text-umd-slate-600">
                                Nous avons identifié des services prioritaires à analyser. Choisissez une mission et aidez-nous à compléter l'annuaire !
                            </p>
                            <Link href="/contribuer/missions" className="umd-btn umd-btn-primary umd-btn-lg w-full">
                                <ListTodo className="h-5 w-5" aria-hidden="true" />
                                Voir les missions
                            </Link>
                        </div>

                        {/* Report security issue */}
                        <div className="umd-card umd-card-hover relative overflow-hidden p-10">
                            <span className="umd-chip umd-chip-danger absolute right-4 top-4">Sécurité</span>
                            <div className="mb-6 flex items-start gap-6">
                                <div className="rounded-2xl bg-umd-red-50 p-4 text-umd-red-600">
                                    <ShieldAlert className="h-8 w-8" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="umd-heading-3 mb-2 text-2xl">Signaler un problème</h3>
                                    <p className="text-umd-slate-500">Fuite ou Vulnérabilité ?</p>
                                </div>
                            </div>
                            <p className="mb-8 text-lg leading-relaxed text-umd-slate-600">
                                Alertez la communauté en signalant une fuite de données ou une vulnérabilité de sécurité. Protégeons nos données ensemble.
                            </p>
                            <div className="flex flex-col gap-3">
                                <Link href="/contribuer/signaler-fuite" className="umd-btn umd-btn-danger w-full">
                                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                                    Signaler une fuite
                                </Link>
                                <Link href="/contribuer/signaler-vulnerabilite" className="umd-btn umd-btn-danger w-full">
                                    <Bug className="h-5 w-5" aria-hidden="true" />
                                    Signaler une vulnérabilité
                                </Link>
                            </div>
                        </div>

                        {/* Add a new service */}
                        <div className="umd-card umd-card-hover relative overflow-hidden p-10">
                            <span className="umd-pill umd-pill-indigo absolute right-4 top-4">Recommandé</span>
                            <div className="mb-6 flex items-start gap-6">
                                <div className="rounded-2xl bg-umd-indigo-800 p-4 text-white">
                                    <FileUp className="h-8 w-8" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="umd-heading-3 mb-2 text-2xl">Ajouter un service</h3>
                                    <p className="text-umd-slate-500">Un service manque ? Ajoutez sa fiche.</p>
                                </div>
                            </div>
                            <p className="mb-8 text-lg leading-relaxed text-umd-slate-600">
                                Aidez la communauté à découvrir comment de nouveaux services utilisent leurs données. C'est la contribution la plus directe et la plus impactante !
                            </p>
                            <Link href="/contribuer/nouvelle-fiche" className="umd-btn umd-btn-primary umd-btn-lg w-full">
                                <Sparkles className="h-5 w-5" aria-hidden="true" />
                                Créer une fiche
                            </Link>
                        </div>

                        {/* Update a service */}
                        <div className="umd-card umd-card-hover p-10">
                            <div className="mb-6 flex items-start gap-6">
                                <div className="rounded-2xl bg-umd-indigo-50 p-4 text-umd-indigo-700">
                                    <CheckCircle className="h-8 w-8" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="umd-heading-3 mb-2 text-2xl">Mettre à jour une fiche</h3>
                                    <p className="text-umd-slate-500">Les politiques de confidentialité évoluent.</p>
                                </div>
                            </div>
                            <p className="mb-8 text-lg leading-relaxed text-umd-slate-600">
                                Assurez-vous que nos informations restent exactes et à jour. Votre vigilance est essentielle pour maintenir la pertinence de la base de données.
                            </p>
                            <Link href="/contribuer/modifier-fiche" className="umd-btn umd-btn-outline umd-btn-lg w-full">
                                Mettre à jour une fiche
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community & developers */}
            <section className="py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="umd-heading-2 mb-6">Rejoignez l'équipe</h2>
                        <p className="umd-lead-text mx-auto max-w-2xl">
                            La collaboration est au cœur de notre projet.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="umd-card flex flex-col items-center bg-umd-slate-50 p-10 text-center">
                            <div className="mb-6 rounded-full bg-umd-indigo-50 p-5 text-umd-indigo-700">
                                <MessageSquare className="h-10 w-10" aria-hidden="true" />
                            </div>
                            <h3 className="umd-heading-3 mb-4">Communauté de contributeurs</h3>
                            <p className="mb-8 max-w-sm text-umd-slate-600">
                                Échangez avec d'autres membres, posez des questions et partagez vos découvertes sur notre Framateam.
                            </p>
                            <a href="https://framateam.org/signup_user_complete/?id=6a6dmngyhpri8qsewowg4mrt6r&md=link&sbr=su" target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-primary">
                                Rejoindre la discussion
                            </a>
                        </div>

                        <div className="umd-card flex flex-col items-center bg-umd-slate-50 p-10 text-center">
                            <div className="mb-6 rounded-full bg-umd-indigo-50 p-5 text-umd-indigo-700">
                                <Github className="h-10 w-10" aria-hidden="true" />
                            </div>
                            <h3 className="umd-heading-3 mb-4">Développeurs Open Source</h3>
                            <p className="mb-8 max-w-sm text-umd-slate-600">
                                Le projet est sur GitHub. Proposez des améliorations, corrigez des bugs ou ajoutez de nouvelles fonctionnalités.
                            </p>
                            <a href="https://github.com/les-enovateurs/unlock-my-data" target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-outline">
                                Contribuer sur GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Learning */}
            <section className="bg-umd-slate-50 py-24" id="nouveau">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="mb-16 text-center">
                        <h2 className="umd-heading-2 mb-6">Nouveau ici ? Pas de problème.</h2>
                        <p className="umd-lead-text mx-auto max-w-2xl">
                            Nous avons préparé des ressources pour vous aider à démarrer.
                        </p>
                    </div>

                    <div className="umd-card overflow-hidden lg:flex">
                        <figure className="relative min-h-[300px] lg:w-1/2">
                            <a href="https://youtu.be/54ySrr1ciu4" target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                                <Image src={apercu} alt="Tutoriel vidéo" fill className="object-cover" />
                                <span className="absolute inset-0 flex items-center justify-center bg-umd-indigo-950/40">
                                    <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/50 bg-white/20">
                                        <Play className="ml-1 h-8 w-8 fill-white text-white" aria-hidden="true" />
                                    </span>
                                </span>
                            </a>
                        </figure>
                        <div className="p-10 lg:w-1/2">
                            <span className="umd-pill umd-pill-indigo mb-4">Tutoriel vidéo</span>
                            <h3 className="umd-heading-3 mb-4 text-3xl">Guide du contributeur</h3>
                            <p className="mb-6 text-lg text-umd-slate-600">
                                20 minutes pour vous guider pas à pas dans le processus d'analyse d'un service. C'est le meilleur moyen de commencer !
                            </p>
                            <ul className="mb-8 space-y-4 text-umd-slate-700">
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 shrink-0 text-umd-green-600" aria-hidden="true" /> Comprendre les droits RGPD</li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 shrink-0 text-umd-green-600" aria-hidden="true" /> Analyser une politique de confidentialité</li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 shrink-0 text-umd-green-600" aria-hidden="true" /> Soumettre une fiche sur la plateforme</li>
                            </ul>
                            <a href="https://youtu.be/54ySrr1ciu4" target="_blank" rel="noopener noreferrer" className="umd-btn umd-btn-primary">
                                Regarder le tutoriel (Youtube)
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-umd-indigo-900 py-24 text-center text-white">
                <div className="mx-auto max-w-3xl px-6">
                    <h2 className="umd-heading-2 mb-6 text-white">Prêt à faire la différence ?</h2>
                    <p className="mx-auto mb-10 max-w-2xl text-xl text-white/80">
                        Rejoignez notre communauté de contributeurs et aidez-nous à construire un web plus transparent.
                    </p>
                    <Link href="/contribuer/nouvelle-fiche" className="umd-btn umd-btn-lg bg-white text-umd-indigo-800 hover:bg-umd-indigo-50">
                        <Sparkles className="h-5 w-5 text-umd-gold-500" aria-hidden="true" />
                        Je contribue maintenant
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default ContribuerPage;
