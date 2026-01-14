import Link from 'next/link';
import {
    ArrowRight, CheckCircle, Code, FileUp, MessageSquare, Users, Github, Play, Heart, Sparkles, Target, ListTodo,
    ShieldAlert, AlertTriangle
} from 'lucide-react';
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
                        <span className="font-bold text-sm tracking-wide uppercase">Join the movement</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-base-content tracking-tight leading-tight">
                        Make digital platforms<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">transparent</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-base-content/70 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Help thousands of citizens take back control of their personal data.
                        Your contribution, no matter how small, has a direct impact.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href="#ways-to-contribute" className="btn btn-primary btn-lg shadow-lg hover:shadow-primary/50 transition-all duration-300 group">
                            Start contributing
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#nouveau" className="btn btn-ghost btn-lg group">
                            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            See how it works
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
                                <div className="text-lg font-medium text-base-content/60">Services analyzed</div>
                            </div>
                        </div>
                        <div className="card bg-base-100 shadow-xl border border-base-200 hover:border-success/30 transition-all duration-300">
                            <div className="card-body items-center text-center p-8">
                                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4 text-success">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div className="text-4xl font-bold text-base-content">20+</div>
                                <div className="text-lg font-medium text-base-content/60">Active contributors</div>
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
                        <h2 className="text-4xl font-bold text-base-content mb-6">How you can help</h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            Whether you&apos;re a data protection expert or a curious beginner, there&apos;s a place for you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Card: Missions */}
                        <div className="card bg-base-100 shadow-xl border-2 border-accent/20 hover:border-accent hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-accent text-accent-content text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                NEW
                            </div>
                            <div className="card-body p-10">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="bg-accent text-accent-content p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="card-title text-2xl mb-2">Missions</h3>
                                        <p className="text-base-content/60">Join a targeted mission.</p>
                                    </div>
                                </div>
                                <p className="text-base-content/70 mb-8 text-lg leading-relaxed">
                                    We&apos;ve identified priority services to analyze. Choose a mission and help us complete the directory!
                                </p>
                                <div className="card-actions mt-auto">
                                    <Link href="/contribute/missions" className="btn btn-accent btn-lg w-full shadow-md group-hover:shadow-accent/50 text-white">
                                        <ListTodo className="w-5 h-5 mr-2" />
                                        View missions
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 1: Add a new service - Featured */}
                        <div className="card bg-base-100 shadow-xl border-2 border-primary/20 hover:border-primary hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-primary text-primary-content text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                RECOMMENDED
                            </div>
                            <div className="card-body p-10">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="bg-primary text-primary-content p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <FileUp className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="card-title text-2xl mb-2">Add a service</h3>
                                        <p className="text-base-content/60">A service is missing? Add its profile.</p>
                                    </div>
                                </div>
                                <p className="text-base-content/70 mb-8 text-lg leading-relaxed">
                                    Help the community discover how new services use their data. This is the most direct and impactful contribution!
                                </p>
                                <div className="card-actions mt-auto">
                                    <Link href="/contribute/new-form" className="btn btn-primary btn-lg w-full shadow-md group-hover:shadow-primary/50">
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Create a profile
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card: Report Leak */}
                        <div className="card bg-base-100 shadow-xl border-2 border-red-500/20 hover:border-red-500 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                Security
                            </div>
                            <div className="card-body p-10">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <ShieldAlert className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="card-title text-2xl mb-2">Report a leak</h3>
                                        <p className="text-base-content/60">Data leak detected?</p>
                                    </div>
                                </div>
                                <p className="text-base-content/70 mb-8 text-lg leading-relaxed">
                                    Alert the community by reporting a data leak with proof. Let&apos;s protect our data together.
                                </p>
                                <div className="card-actions mt-auto">
                                    <Link href="/contribute/report-leak" className="btn btn-error btn-outline btn-lg w-full shadow-md group-hover:shadow-red-500/50">
                                        <AlertTriangle className="w-5 h-5 mr-2" />
                                        Report
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
                                        <h3 className="card-title text-2xl mb-2">Update a profile</h3>
                                        <p className="text-base-content/60">Privacy policies evolve.</p>
                                    </div>
                                </div>
                                <p className="text-base-content/70 mb-8 text-lg leading-relaxed">
                                    Make sure our information stays accurate and up to date. Your vigilance is essential to maintain the relevance of the database.
                                </p>
                                <div className="card-actions mt-auto">
                                    <Link href="/contribute/update-form" className="btn btn-outline btn-secondary btn-lg w-full hover:text-white">
                                        Update a profile
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
                        <h2 className="text-4xl font-bold text-base-content mb-6">Join the team</h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            Collaboration is at the heart of our project.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Community Card */}
                        <div className="card bg-base-200/30 hover:bg-base-200 transition-colors duration-300 border border-base-200">
                            <div className="card-body items-center text-center p-10">
                                <div className="bg-accent/10 text-accent p-5 rounded-full mb-6">
                                    <MessageSquare className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Contributor community</h3>
                                <p className="text-base-content/70 mb-8 max-w-sm">
                                    Connect with other members, ask questions, and share your discoveries on our Framateam.
                                </p>
                                <a href="https://framateam.org/signup_user_complete/?id=6a6dmngyhpri8qsewowg4mrt6r&md=link&sbr=su" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-wide">
                                    Join the discussion
                                </a>
                            </div>
                        </div>

                        {/* Developer Card */}
                        <div className="card bg-base-200/30 hover:bg-base-200 transition-colors duration-300 border border-base-200">
                            <div className="card-body items-center text-center p-10">
                                <div className="bg-neutral/10 text-neutral p-5 rounded-full mb-6">
                                    <Github className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Open Source developers</h3>
                                <p className="text-base-content/70 mb-8 max-w-sm">
                                    The project is on GitHub. Suggest improvements, fix bugs, or add new features.
                                </p>
                                <a href="https://github.com/les-enovateurs/unlock-my-data" target="_blank" rel="noopener noreferrer" className="btn btn-neutral btn-wide">
                                    Contribute on GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Learning Section */}
            {/*<section className="py-24 bg-base-200/50" id="nouveau">*/}
            {/*    <div className="container mx-auto px-6 max-w-5xl">*/}
            {/*        <div className="text-center mb-16">*/}
            {/*            <h2 className="text-4xl font-bold text-base-content mb-6">New here? No problem.</h2>*/}
            {/*            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">*/}
            {/*                We&apos;ve prepared resources to help you get started.*/}
            {/*            </p>*/}
            {/*        </div>*/}

            {/*        <div className="card lg:card-side bg-base-100 shadow-xl overflow-hidden border border-base-200">*/}
            {/*            <figure className="lg:w-1/2 relative min-h-[300px]">*/}
            {/*                <a href="https://youtu.be/54ySrr1ciu4" target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group">*/}
            {/*                    <Image src={apercu} alt="Video tutorial" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />*/}
            {/*                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all flex items-center justify-center">*/}
            {/*                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-white/50">*/}
            {/*                            <Play className="w-8 h-8 text-white fill-white ml-1" />*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </a>*/}
            {/*            </figure>*/}
            {/*            <div className="card-body lg:w-1/2 p-10">*/}
            {/*                <div className="badge badge-primary mb-4">Video Tutorial</div>*/}
            {/*                <h3 className="card-title text-3xl mb-4">Contributor guide</h3>*/}
            {/*                <p className="text-base-content/70 mb-6 text-lg">*/}
            {/*                    20 minutes to guide you step by step through the process of analyzing a service. It&apos;s the best way to get started!*/}
            {/*                </p>*/}
            {/*                <ul className="space-y-4 text-base-content/80 mb-8">*/}
            {/*                    <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success flex-shrink-0" /> Understand GDPR rights</li>*/}
            {/*                    <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success flex-shrink-0" /> Analyze a privacy policy</li>*/}
            {/*                    <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-success flex-shrink-0" /> Submit a profile on the platform</li>*/}
            {/*                </ul>*/}
            {/*                <div className="card-actions">*/}
            {/*                    <a href="https://youtu.be/54ySrr1ciu4" target="_blank" rel="noopener noreferrer" className="btn btn-primary">*/}
            {/*                        Watch the tutorial (YouTube)*/}
            {/*                    </a>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

                <div className="container mx-auto px-6 text-center relative z-10 text-primary-content">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to make a difference?</h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                        Join our community of contributors and help us build a more transparent web.
                    </p>
                    <Link href="/contribute/new-form" className="btn btn-lg bg-white text-primary hover:bg-base-100 border-none shadow-xl hover:scale-105 transition-transform">
                        <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                        I contribute now
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default ContribuerPage;
