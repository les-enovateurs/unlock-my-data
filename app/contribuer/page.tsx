import Link from 'next/link';
import { ArrowRight, CheckCircle, Code, FileUp, MessageSquare } from 'lucide-react';
import apercu from "../../public/preview-video.webp"
import Image from 'next/image';

const ContribuerPage = () => {
    return (
        <div className="bg-base-100 text-base-content">
            {/* New Hero Section */}
            <section className="relative text-center py-20 md:py-32 bg-gradient-to-b from-base-100 to-base-200">
                <div className="container mx-auto px-6 max-w-4xl">
                    <span className="badge badge-lg badge-primary text-white font-semibold mb-4">
                        Rejoignez le mouvement
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
                        Rendez transparentes les plateformes numériques
                    </h1>
                    <p className="text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto">
                        Aidez des milliers de citoyens à reprendre le contrôle de leurs données personnelles. Votre contribution, quelle que soit sa taille, a un impact direct.
                    </p>
                    <div className="mt-10">
                        <a href="#ways-to-contribute" className="btn btn-primary btn-lg">
                            Commencer à contribuer
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-base-200">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="text-5xl font-bold text-primary">50+</div>
                            <div className="mt-2 text-lg font-semibold text-base-content/80">Services analysés</div>
                            <p className="text-sm text-base-content/60">Grâce à notre communauté</p>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl font-bold text-success">20+</div>
                            <div className="mt-2 text-lg font-semibold text-base-content/80">Contributeurs actifs</div>
                            <p className="text-sm text-base-content/60">Une communauté engagée</p>
                        </div>
                        <div className="p-6">
                            <div className="text-5xl font-bold text-accent">100%</div>
                            <div className="mt-2 text-lg font-semibold text-base-content/80">Open Source</div>
                            <p className="text-sm text-base-content/60">La transparence avant tout</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ways to Contribute Section */}
            <section id="ways-to-contribute" className="py-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-primary mb-4">Comment vous pouvez aider</h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            Que vous soyez un expert en protection des données ou un débutant curieux, il existe une place pour vous.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Card 1: Add a new service */}
                        <div className="card bg-base-200/50 border border-base-300/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                            <div className="card-body p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                        <FileUp className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="card-title text-2xl">Ajouter un service</h3>
                                        <p className="text-base-content/60">Un service manque ? Ajoutez sa fiche.</p>
                                    </div>
                                </div>
                                <p className="text-base-content/70 mb-6">
                                    Aidez la communauté à découvrir comment de nouveaux services utilisent leurs données. C'est la contribution la plus directe !
                                </p>
                                <div className="card-actions">
                                    <Link href="/contribuer/nouvelle-fiche" className="btn btn-primary w-full">
                                        Créer une nouvelle fiche
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Update a service */}
                        <div className="card bg-base-200/50 border border-base-300/50 hover:border-secondary/50 hover:shadow-lg transition-all duration-300">
                            <div className="card-body p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-secondary p-3 rounded-lg">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="card-title text-2xl">Mettre à jour une fiche</h3>
                                        <p className="text-base-content/60">Les politiques de confidentialité évoluent.</p>
                                    </div>
                                </div>
                                <p className="text-base-content/70 mb-6">
                                    Assurez-vous que nos informations restent exactes et à jour. Votre vigilance est essentielle pour maintenir la pertinence de la base de données.
                                </p>
                                <div className="card-actions">
                                    <Link href="/contribuer/modifier-fiche" className="btn btn-secondary text-white w-full">
                                        Mettre à jour une fiche
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community & Developers Section */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-primary mb-4">Rejoignez l'équipe</h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            La collaboration est au cœur de notre projet.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Community Card */}
                        <div className="flex flex-col items-center text-center p-8">
                            <div className="bg-accent/10 text-accent p-4 rounded-full mb-4">
                                <MessageSquare className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Communauté de contributeurs</h3>
                            <p className="text-base-content/70 mb-4 max-w-sm">
                                Échangez avec d'autres membres, posez des questions et partagez vos découvertes sur notre Framateam (Equipe Les e-novateurs).
                            </p>
                            <a href="https://framateam.org/" target="_blank" rel="noopener noreferrer" className="btn btn-accent">
                                Rejoindre la discussion
                            </a>
                        </div>

                        {/* Developer Card */}
                        <div className="flex flex-col items-center text-center p-8">
                            <div className="bg-info/10 text-info p-4 rounded-full mb-4">
                                <Code className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Développeurs Open Source</h3>
                            <p className="text-base-content/70 mb-4 max-w-sm">
                                Le projet est sur GitHub. Proposez des améliorations, corrigez des bugs ou ajoutez de nouvelles fonctionnalités.
                            </p>
                            <a href="https://github.com/les-enovateurs/unlock-my-data" target="_blank" rel="noopener noreferrer" className="btn btn-info">
                                Contribuer sur GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Learning Section */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-primary mb-4">Nouveau ici ? Pas de problème.</h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            Nous avons préparé des ressources pour vous aider à démarrer.
                        </p>
                    </div>

                    <div className="card lg:card-side bg-base-200/50 border border-base-300/50 shadow-lg">
                        <figure className="lg:w-1/2">
                            <a href="https://youtu.be/54ySrr1ciu4" target="_blank" rel="noopener noreferrer" className="block relative group">
                                <Image src={apercu} alt="Tutoriel vidéo" className="object-cover w-full h-full" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </a>
                        </figure>
                        <div className="card-body lg:w-1/2">
                            <h3 className="card-title text-2xl mb-4">Guide du contributeur</h3>
                            <p className="text-base-content/70 mb-6">
                                20 minutes pour vous guider pas à pas dans le processus d'analyse d'un service. C'est le meilleur moyen de commencer !
                            </p>
                            <ul className="space-y-3 text-base-content/80">
                                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success" /> Comprendre les droits RGPD</li>
                                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success" /> Analyser une politique de confidentialité</li>
                                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success" /> Soumettre une fiche sur la plateforme</li>
                            </ul>
                            <div className="card-actions mt-8">
                                <a href="https://youtu.be/54ySrr1ciu4" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    Regarder le tutoriel (Youtube)
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-r from-primary to-success text-primary-content">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-4">Prêt à faire la différence ?</h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        Chaque contribution nous rapproche d'un internet plus transparent et respectueux de la vie privée.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/contribuer/nouvelle-fiche" className="btn btn-lg btn-light">
                            ✨ Créer une fiche
                        </Link>
                        <a href="https://framateam.org/" target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-outline-light">
                            💬 Rejoindre la communauté
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContribuerPage;
