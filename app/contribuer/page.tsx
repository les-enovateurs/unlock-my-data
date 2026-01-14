import Link from 'next/link';
import { ArrowRight, CheckCircle, Code, FileUp, MessageSquare, Users, Github, Play, Heart, Sparkles, Target, ListTodo, ShieldAlert, AlertTriangle } from 'lucide-react';
import apercu from "../../public/preview-video.webp"
import Image from 'next/image';

const ContribuerPage = () => {
    return (
        <div className="bg-base-100 text-base-content overflow-hidden">
            {/* Hero Section with animated background */}
            <section className="relative text-center py-24 md:py-32 bg-gradient-to-br from-base-100 via-base-200 to-primary/10 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>

                <div className="container mx-auto px-6 max-w-5xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 animate-fade-in-up">
                        <Heart className="w-4 h-4 fill-current" />
                        <span className="font-bold text-sm tracking-wide uppercase">Rejoignez le mouvement</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-base-content tracking-tight leading-tight">
                        Rendez <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">transparentes</span><br />
                        les plateformes numériques
                    </h1>

                    <p className="text-xl md:text-2xl text-base-content/70 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Aidez des milliers de citoyens à reprendre le contrôle de leurs données personnelles.
                        Votre contribution, quelle que soit sa taille, a un impact direct.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href="#ways-to-contribute" className="btn btn-primary btn-lg shadow-lg hover:shadow-primary/50 transition-all duration-300 group">
                            Commencer à contribuer
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#nouveau" className="btn btn-ghost btn-lg group">
                            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Voir comment faire
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats Section with Cards */}
            <section className="py-16 bg-base-100 relative -mt-10 z-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card bg-base-100 shadow-xl border border-base-200 hover:border-primary/30 transition-all duration-300">
                            <div className="card-body items-center text-center p-8">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <FileUp className="w-6 h-6" />
                                </div>
                                <div className="text-4xl font-bold text-base-content">50+</div>
                                <div className="text-lg font-medium text-base-content/60">Services analysés</div>
                            </div>
                        </div>
                        <div className="card bg-base-100 shadow-xl border border-base-200 hover:border-success/30 transition-all duration-300">
                            <div className="card-body items-center text-center p-8">
                                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4 text-success">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div className="text-4xl font-bold text-base-content">20+</div>
                                <div className="text-lg font-medium text-base-content/60">Contributeurs actifs</div>
                            </div>
                        </div>
                        <div className="card bg-base-100 shadow-xl border border-base-200 hover:border-accent/30 transition-all duration-300">
                            <div className="card-body items-center text-center p-8">
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 text-accent">
                                    <Code className="w-6 h-6" />
                                </div>
                                <div className="text-4xl font-bold text-base-content">100%</div>
                                <div className="text-lg font-medium text-base-content/60">Open Source</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ways to Contribute Section */}
            <section id="ways-to-contribute" className="py-24 bg-base-200/50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-base-content mb-6">Comment vous pouvez aider</h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            Que vous soyez un expert en protection des données ou un débutant curieux, il existe une place pour vous.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Card: Missions */}
                        <div className="card bg-base-100 shadow-xl border-2 border-accent/20 hover:border-accent hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-accent text-accent-content text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                NOUVEAU
                            </div>
                            <div className="card-body p-10">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="bg-accent text-accent-content p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="card-title text-2xl mb-2">Missions</h3>
                                        <p className="text-base-content/60">Rejoignez une mission ciblée.</p>
                                    </div>
                                </div>
                                <p className="text-base-content/70 mb-8 text-lg leading-relaxed">
                                    Nous avons identifié des services prioritaires à analyser. Choisissez une mission et aidez-nous à compléter l&apos;annuaire !
                                </p>
                                <div className="card-actions mt-auto">
                                    <Link href="/contribuer/missions" className="btn btn-accent btn-lg w-full shadow-md group-hover:shadow-accent/50 text-white">
                                        <ListTodo className="w-5 h-5 mr-2" />
                                        Voir les missions
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card: Report Leak */}
                        <div className="card bg-base-100 shadow-xl border-2 border-red-500/20 hover:border-red-500 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                SÉCURITÉ
                            </div>
                            <div className="card-body p-10">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <ShieldAlert className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="card-title text-2xl mb-2">Signaler une fuite</h3>
                                        <p className="text-base-content/60">Une fuite de données détectée ?</p>
                                    </div>
                                </div>
                                <p className="text-base-content/70 mb-8 text-lg leading-relaxed">
                                    Alertez la communauté en signalant une fuite de données avec preuve. Protégeons nos données ensemble.
                                </p>
                                <div className="card-actions mt-auto">
                                    <Link href="/contribuer/signaler-fuite" className="btn btn-error btn-outline btn-lg w-full shadow-md group-hover:shadow-red-500/50">
                                        <AlertTriangle className="w-5 h-5 mr-2" />
                                        Signaler
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 1: Add a new service - Featured */}
                        <div className="card bg-base-100 shadow-xl border-2 border-primary/20 hover:border-primary hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-primary text-primary-content text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                RECOMMANDÉ
                            </div>
                            <div className="card-body p-10">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="bg-primary text-primary-content p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <FileUp className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="card-title text-2xl mb-2">Ajouter un service</h3>
                                        <p className="text-base-content/60">Un service manque ? Ajoutez sa fiche.</p>
                                    </div>
                                </div>
                                <p className="text-base-content/70 mb-8 text-lg leading-relaxed">
                                    Aidez la communauté à découvrir comment de nouveaux services utilisent leurs données. C&apos;est la contribution la plus directe et la plus impactante !
                                </p>
                                <div className="card-actions mt-auto">
                                    <Link href="/contribuer/nouvelle-fiche" className="btn btn-primary btn-lg w-full shadow-md group-hover:shadow-primary/50">
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Créer une fiche
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Update a service */}
                        <div className="card bg-base-100 shadow-lg border border-base-200 hover:border-secondary/50 hover:shadow-xl transition-all duration-300 group">
                            <div className="card-body p-10">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="bg-secondary/10 text-secondary p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="card-title text-2xl mb-2">Mettre à jour une fiche</h3>
                                        <p className="text-base-content/60">Les politiques de confidentialité évoluent.</p>
                                    </div>
                                </div>
                                <p className="text-base-content/70 mb-8 text-lg leading-relaxed">
                                    Assurez-vous que nos informations restent exactes et à jour. Votre vigilance est essentielle pour maintenir la pertinence de la base de données.
                                </p>
                                <div className="card-actions mt-auto">
                                    <Link href="/contribuer/modifier-fiche" className="btn btn-outline btn-secondary btn-lg w-full hover:text-white">
                                        Mettre à jour une fiche
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community & Developers Section */}
            <section className="py-24 bg-base-100">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-base-content mb-6">Rejoignez l&apos;équipe</h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            La collaboration est au cœur de notre projet.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Community Card */}
                        <div className="card bg-base-200/30 hover:bg-base-200 transition-colors duration-300 border border-base-200">
                            <div className="card-body items-center text-center p-10">
                                <div className="bg-accent/10 text-accent p-5 rounded-full mb-6">
                                    <MessageSquare className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Communauté de contributeurs</h3>
                                <p className="text-base-content/70 mb-8 max-w-sm">
                                    Échangez avec d&apos;autres membres, posez des questions et partagez vos découvertes sur notre Framateam.
                                </p>
                                <a href="https://framateam.org/signup_user_complete/?id=6a6dmngyhpri8qsewowg4mrt6r&md=link&sbr=su" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-wide">
                                    Rejoindre la discussion
                                </a>
                            </div>
                        </div>

                        {/* Developer Card */}
                        <div className="card bg-base-200/30 hover:bg-base-200 transition-colors duration-300 border border-base-200">
                            <div className="card-body items-center text-center p-10">
                                <div className="bg-neutral/10 text-neutral p-5 rounded-full mb-6">
                                    <Github className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Développeurs Open Source</h3>
                                <p className="text-base-content/70 mb-8 max-w-sm">
                                    Le projet est sur GitHub. Proposez des améliorations, corrigez des bugs ou ajoutez de nouvelles fonctionnalités.
                                </p>
                                <a href="https://github.com/les-enovateurs/unlock-my-data" target="_blank" rel="noopener noreferrer" className="btn btn-neutral btn-wide">
                                    Contribuer sur GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Learning Section */}
            <section className="py-24 bg-base-200/50" id="nouveau">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-base-content mb-6">Nouveau ici ? Pas de problème.</h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            Nous avons préparé des ressources pour vous aider à démarrer.
                        </p>
                    </div>

                    <div className="card lg:card-side bg-base-100 shadow-xl overflow-hidden border border-base-200">
                        <figure className="lg:w-1/2 relative min-h-[300px]">
                            <a href="https://youtu.be/54ySrr1ciu4" target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group">
                                <Image src={apercu} alt="Tutoriel vidéo" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-white/50">
                                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                                    </div>
                                </div>
                            </a>
                        </figure>
                        <div className="card-body lg:w-1/2 p-10">
                            <div className="badge badge-primary mb-4">Tutoriel Vidéo</div>
                            <h3 className="card-title text-3xl mb-4">Guide du contributeur</h3>
                            <p className="text-base-content/70 mb-6 text-lg">
                                20 minutes pour vous guider pas à pas dans le processus d&apos;analyse d&apos;un service. C&apos;est le meilleur moyen de commencer !
                            </p>
                            <ul className="space-y-4 text-base-content/80 mb-8">
                                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success flex-shrink-0" /> Comprendre les droits RGPD</li>
                                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success flex-shrink-0" /> Analyser une politique de confidentialité</li>
                                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success flex-shrink-0" /> Soumettre une fiche sur la plateforme</li>
                            </ul>
                            <div className="card-actions">
                                <a href="https://youtu.be/54ySrr1ciu4" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    Regarder le tutoriel (Youtube)
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

                <div className="container mx-auto px-6 text-center relative z-10 text-primary-content">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt à faire la différence ?</h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                        Rejoignez notre communauté de contributeurs et aidez-nous à construire un web plus transparent.
                    </p>
                    <Link href="/contribuer/nouvelle-fiche" className="btn btn-lg bg-white text-primary hover:bg-base-100 border-none shadow-xl hover:scale-105 transition-transform">
                        <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                        Je contribue maintenant
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default ContribuerPage;
