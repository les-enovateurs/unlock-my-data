"use client"
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {

    const { setLang } = useLanguage();
    setLang('en')
    return (
        <>
            <div className="hero bg-base-200 p-12">
                <div className="hero-content text-center">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl font-bold">Unlock your data</h1>
                        <p className="py-6">
                            The Web is a world of data: accounts created in no time, personal information shared by the hundreds... our online traces are multiplying.
                        </p>
                        <p>
                            Unlock My Data allows you to compare similar digital services and choose the one that best respects your privacy.
                        </p>
                    </div>
                </div>
            </div>

            <div className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-red-50 rounded-xl p-8 shadow-lg">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-red-800">CNIL Alert 2024</h2>
                                    <div className="text-4xl font-bold text-red-600">5,629</div>
                                    <div className="text-xl text-red-800">personal data breaches</div>
                                    <div className="text-lg font-semibold text-red-700">+20% compared to 2023</div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-gray-700">The most worrying trend? A rise in very large-scale data breaches. The number of breaches affecting more than one million people has doubled in one year.</p>
                                    <p className="text-sm text-gray-500 italic">Source: <a href="https://www.cnil.fr/fr/violations-massives-de-donnees-en-2024-quels-sont-les-principaux-enseignements-mesures-a-prendre" className="underline hover:text-red-600" target="_blank" rel="noopener noreferrer">CNIL - January 2025</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">In personal data news</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <a
                                href="https://les-enovateurs.com/online-dating-love-stories-become-profitable"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                            >
                                <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                                    <Image className={"h-48"}  alt={""} height={270} width={480} src={"https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frencontres-en-ligne-histoires-amour-deviennent-lucratives.882c8d5e.webp&w=3840&q=75"} />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2">Online Dating</h3>
                                    <p className="text-gray-600 text-sm">When Love Stories Become Profitable</p>
                                </div>
                            </a>

                            <a
                                href="https://les-enovateurs.com/online-dating-love-stories-become-profitable"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                            >
                                <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                                    <Image className={"h-48"} alt={""} height={270} width={480} src={"https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fia-selectionne-candidats-cnil-rappelle-limites.68027f8d.webp&w=3840&q=75"} />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2">When AI Selects Candidates</h3>
                                    <p className="text-gray-600 text-sm">The CNIL Draws the Line</p>
                                </div>
                            </a>

                            <a
                                href="https://les-enovateurs.com/how-to-export-personal-data-for-online-privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                            >
                                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                    <Image className={"h-48"}  alt={""} height={270} width={480} src={"https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F4-bonnes-raisons-exporter-donnees-personnelles.2d8cb7dc.jpg&w=3840&q=75"} />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2">Protect Your Online Privacy by Exporting Personal Data</h3>
                                    <p className="text-gray-600 text-sm">4 Reasons Why it's Important</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-8">Compare digital services</h2>
                        <h3 className={"text-xl font-semibold mb-9"}>To choose a tool that respects your privacy</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="text-3xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                                <p className="text-gray-600">Understand how each service actually uses your data</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="text-3xl mb-4">⚖️</div>
                                <h3 className="text-xl font-semibold mb-3">Informed choice</h3>
                                <p className="text-gray-600">Compare privacy practices and choose the service that best respects your data</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="text-3xl mb-4">🛡️</div>
                                <h3 className="text-xl font-semibold mb-3">Protection</h3>
                                <p className="text-gray-600">Protect your privacy by avoiding services that do not respect your data</p>
                            </div>
                            <div className="mt-12 flex flex-row gap-4 items-center">
                                <a href="/compare" className="btn btn-primary btn-lg">Compare now</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-8">Catalog of analyzed services</h2>
                        <h3 className="text-xl font-semibold mb-9">Discover in detail how your personal data is used</h3>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 shadow-lg mb-8">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4 text-left">
                                    <div className="text-4xl mb-4">📊</div>
                                    <h4 className="text-2xl font-bold text-gray-800">Detailed analyses</h4>
                                    <p className="text-gray-700">
                                        Every digital service listed in our catalog is thoroughly analyzed:
                                        data collection, sharing with third parties, geolocation, targeted advertising,
                                        data retention periods...
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 text-left">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">Terms of use decoded</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-left">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">Privacy policy analyzed</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-left">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">Trackers and permissions detailed</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-left">
                                        <span className="text-green-500 text-xl">✓</span>
                                        <span className="text-gray-700">Privacy rating</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="text-3xl mb-4">🔍</div>
                                <h4 className="text-lg font-semibold mb-3">Easy search</h4>
                                <p className="text-gray-600 text-sm">Quickly find information about your favorite services</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="text-3xl mb-4">📈</div>
                                <h4 className="text-lg font-semibold mb-3">Regular updates</h4>
                                <p className="text-gray-600 text-sm">Our analyses follow changes in privacy policies</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="text-3xl mb-4">🎯</div>
                                <h4 className="text-lg font-semibold mb-3">Clear information</h4>
                                <p className="text-gray-600 text-sm">Accessible explanations, whatever your digital comfort level</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/list-app" className="btn btn-primary btn-lg">
                                Browse the catalog
                            </Link>
                            <Link href="/compare" className="btn btn-outline btn-lg">
                                Compare services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-8">Contribute to the project</h2>
                        <div className="bg-white rounded-xl p-8 shadow-lg">
                            <div className="space-y-6">
                                <p className="text-lg text-gray-700">
                                    Unlock My Data is an open source project run by a team of passionate volunteers.
                                    We rely on community projects like
                                    <a href="https://tosdr.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 mx-1">ToS;DR</a>
                                    and
                                    <a href="https://exodus-privacy.eu.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 mx-1">Exodus Privacy</a>
                                    to build a transparent database about the reuse of our personal data online.
                                </p>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                    <div className="p-6 border-2 rounded-2xl">
                                        <div className="text-3xl mb-3">🔍</div>
                                        <h3 className="font-bold text-lg mb-3 text-primary-600">Analyze services</h3>
                                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                            Help us analyze digital services and document how personal data is used.
                                        </p>
                                        <Link
                                            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-900 font-semibold text-sm underline hover:no-underline transition-colors duration-200"
                                            href="https://github.com/les-enovateurs/unlock-my-data/blob/master/CONTRIBUTING.md"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span>📖</span>
                                            Get started contributing
                                        </Link>
                                    </div>

                                    <div className="p-6 border-2 rounded-2xl">
                                        <div className="text-3xl mb-3">💻</div>
                                        <h3 className="font-bold text-lg mb-3">Develop the platform</h3>
                                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                            Contribute to the source code, improve the UI and add new features.
                                        </p>
                                        <Link
                                            className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold text-sm underline hover:no-underline transition-colors duration-200"
                                            href="https://github.com/les-enovateurs/unlock-my-data/blob/master/README.md"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span>⚡</span>
                                            Start developing
                                        </Link>
                                    </div>

                                    <div className="p-6 border-2 rounded-2xl">
                                        <div className="text-3xl mb-3">📢</div>
                                        <h3 className="font-bold text-lg mb-3 text-purple-800">Spread the word</h3>
                                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                            Share the project with your network and raise awareness about protecting their data.
                                        </p>
                                        <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm">
                                            <span>💬</span>
                                            Share on your networks
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-4">❤️ Made with love</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-2">Les e-novateurs</h3>
                            <p className="text-gray-600 text-sm italic mb-4">French associative media</p>
                            <p className="text-gray-700 mb-6">
                                Our mission: raise awareness among citizens about the impacts of digital technology on the environment and society.
                            </p>
                            <div className="flex justify-center gap-6 text-sm">
                                <Link href="https://les-enovateurs.com/categories/frugality/1" className="text-primary-600 hover:text-primary-800 underline hover:no-underline">
                                    🌱 Digital ecology
                                </Link>
                                <Link href="https://les-enovateurs.com/categories/ethics/1" className="text-primary-600 hover:text-primary-800 underline hover:no-underline">
                                    🤝 Ethics
                                </Link>
                                <Link href="https://les-enovateurs.com/categories/inclusive/1" className="text-primary-600 hover:text-primary-800 underline hover:no-underline">
                                    💡 Inclusive
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
