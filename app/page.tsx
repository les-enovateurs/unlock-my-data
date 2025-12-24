"use client";
import Link from "next/link";
import Image from "next/image";
import {useLanguage} from "@/context/LanguageContext";
import ShareButton from "@/components/ShareButton";

export default function Home() {
    const { setLang } = useLanguage();
    setLang('fr')
  return (
    <>
      {/* Hero Section - Lighter and more focused */}
      <div className="hero min-h-[70vh] bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
          {/* Abstract background shapes for "lightness" */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-100 blur-3xl opacity-50"></div>

        <div className="hero-content text-center relative z-10">
          <div className="max-w-4xl">
              <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                  👋 Reprenez le pouvoir sur votre vie numérique
              </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
              Vos données, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">vos règles.</span>
            </h1>
            <p className="py-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Unlock My Data est la plateforme citoyenne pour <strong>analyser</strong> vos services, <strong>comparer</strong> les alternatives éthiques et <strong>supprimer</strong> massivement vos traces en ligne.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/liste-applications" className="btn btn-primary btn-lg rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                    🔍 Analyser mes services
                </Link>
                <Link href="/supprimer-mes-donnees" className="btn btn-outline btn-lg rounded-full px-8 bg-white hover:bg-gray-50">
                    🗑️ Nettoyer mes données
                </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features - The 3 Pillars (Analyze, Compare, Delete) */}
      <div className="py-24 bg-white">
          <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-12">
                  {/* Feature 1: Analyze */}
                  <Link href="/liste-applications" prefetch={false} className="group p-8 rounded-3xl bg-gray-50 hover:bg-blue-50 transition-colors duration-300 border border-gray-100">
                      <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                          📊
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Analysez</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                          Découvrez la face cachée de vos applications préférées. Traceurs, permissions, politique de confidentialité : nous décryptons tout pour vous.
                      </p>
                      <button className=" cursor-pointer text-blue-600 font-semibold  flex items-center gap-2">
                          Explorer le catalogue <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                  </Link>

                  {/* Feature 2: Compare */}
                  <Link href="/comparer" className="group p-8 rounded-3xl bg-gray-50 hover:bg-purple-50 transition-colors duration-300 border border-gray-100">
                      <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                          ⚖️
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Comparez</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                          Ne choisissez plus au hasard. Comparez les services numériques sur des critères éthiques et trouvez l&apos;alternative qui vous respecte.
                      </p>
                      <button className="cursor-pointer text-purple-600 font-semibold flex items-center gap-2">
                          Lancer un comparatif <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                  </Link>

                  {/* Feature 3: Delete */}
                  <Link href="/supprimer-mes-donnees" className="group p-8 rounded-3xl bg-gray-50 hover:bg-red-50 transition-colors duration-300 border border-gray-100">
                      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                          🗑️
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Supprimez</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                          Faites le ménage dans votre passé numérique. Générez automatiquement vos demandes de suppression de compte (GDPR) pour des dizaines de services.
                      </p>
                      <button className="cursor-pointer text-red-600 font-semibold flex items-center gap-2">
                          Supprimer mes comptes <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                  </Link>
              </div>
          </div>
      </div>

      {/* Context Section - Redesigned "CNIL Alert" to be cleaner */}
      <div className="py-20 bg-gray-900 text-white rounded-t-[3rem] mt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-red-400 uppercase border border-red-400 rounded-full">
                        Contexte 2025
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                        Pourquoi protéger vos données est devenu <span className="text-red-400">urgent</span> ?
                    </h2>
                    <p className="text-gray-400 text-lg mb-6">
                        Les violations de données massives ne sont plus l&apos;exception, mais la norme. En 2024, la CNIL a enregistré une augmentation record des incidents.
                    </p>
                    <a href="https://www.cnil.fr/fr/violations-massives-de-donnees-en-2024-quels-sont-les-principaux-enseignements-mesures-a-prendre"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-white underline decoration-red-400 underline-offset-4 hover:text-red-400 transition-colors">
                        Lire le rapport de la CNIL
                    </a>
                </div>
                <div className="md:w-1/2 w-full">
                    <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-500 blur-3xl opacity-20"></div>
                        <div className="grid grid-cols-2 gap-6 text-center">
                            <div>
                                <div className="text-4xl font-bold text-white mb-2">5 629</div>
                                <div className="text-sm text-gray-400">Violations signalées</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-red-400 mb-2">+20%</div>
                                <div className="text-sm text-gray-400">Par rapport à 2023</div>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-700">
                            <p className="text-sm text-gray-300 italic">
                                &quot;Le nombre de violations touchant plus d&apos;un million de personnes a doublé en un an.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Section - Simplified */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900">S&apos;informer pour mieux agir</h2>
                <p className="text-gray-600 mt-4">Les dernières actualités sur vos droits numériques</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <a
                  href="https://les-enovateurs.com/rien-a-cacher-5-bonnes-raison-proteger-donnees-en-ligne"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <Image
                      alt="Rien à cacher"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      src={"https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frien-a-cacher-5-bonnes-raison-proteger-donnees-en-ligne.4e24c6b2.webp&w=3840&q=75"}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Rien à cacher ?</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">5 bonnes raisons de protéger vos données, même si vous pensez n&apos;avoir rien à cacher.</p>
                  <span className="text-blue-600 text-sm font-semibold">Lire l&apos;article</span>
                </div>
              </a>

              <a
                  href="https://les-enovateurs.com/mort-numerique-quand-donnees-nous-survivent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <Image
                      alt="Mort numérique"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      src={"https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmort-numerique-quand-donnees-nous-survivent.e65b8b72.webp&w=3840&q=75"}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Mort numérique</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">Que deviennent vos données après vous ? Anticiper sa succession numérique.</p>
                  <span className="text-blue-600 text-sm font-semibold">Lire l&apos;article</span>
                </div>
              </a>

              <a
                  href="https://les-enovateurs.com/hacks/passe-numerique-retrouvez-supprimez-donnees"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <Image
                      alt="Passé numérique"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      src={"https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpasse-numerique-retrouvez-supprimez-donnees.84a9c4ab.webp&w=1920&q=75"}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Passé numérique</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">Le guide complet pour retrouver et supprimer vos anciennes données.</p>
                  <span className="text-blue-600 text-sm font-semibold">Lire l&apos;article</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contribute Section - Clean & Impactful */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4"><div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-white text-center shadow-2xl relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-20 -mt-20"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mb-20"></div>

                <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Un projet Open Source & Citoyen</h2>
                <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                  Unlock My Data est construit par une communauté de bénévoles. Nous nous appuyons sur l&apos;intelligence collective pour documenter les pratiques des géants du web.
                </p>

                <div className="grid md:grid-cols-3 gap-6 relative z-10">
                    <a href="/contribuer"
                       target="_blank" rel="noopener noreferrer"
                       className="bg-white/10 backdrop-blur-sm hover:bg-white/20 p-6 rounded-xl transition-colors border border-white/20">
                        <div className="text-3xl mb-3">🔍</div>
                        <div className="font-bold mb-1">Analysez</div>
                        <div className="text-sm text-blue-100">Aidez-nous à décrypter les services</div>
                    </a>
                    <a href="https://github.com/les-enovateurs/unlock-my-data"
                       target="_blank" rel="noopener noreferrer"
                       className="bg-white/10 backdrop-blur-sm hover:bg-white/20 p-6 rounded-xl transition-colors border border-white/20">
                        <div className="text-3xl mb-3">💻</div>
                        <div className="font-bold mb-1">Codez</div>
                        <div className="text-sm text-blue-100">Améliorez la plateforme</div>
                    </a>
                    <ShareButton label={"Partager"} text={"Découvrez les petits secrets de confidentialités de vos services préférés"} url={""} lang={"fr"}/>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Made with love */}
      <div className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm mb-4">
                Made with ❤️ by <a href="https://les-enovateurs.com" className="text-blue-600 hover:underline font-medium">Les e-novateurs</a>
            </p>
            <div className="flex justify-center gap-6 text-sm text-gray-500">
                <Link href="https://les-enovateurs.com/category/sobriete/1" className="hover:text-blue-600 transition-colors">🌱 Ecologie numérique</Link>
                <Link href="https://les-enovateurs.com/category/ethique/1" className="hover:text-blue-600 transition-colors">🤝 Ethique</Link>
                <Link href="https://les-enovateurs.com/category/inclusion/1" className="hover:text-blue-600 transition-colors">💡 Inclusion</Link>
            </div>
            <div className="mt-8 text-xs text-gray-400">
                <a href="https://app.unlock-my-data.com/login" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">
                    Accéder à l&apos;ancienne version
                </a>
            </div>
        </div>
      </div>
    </>
  );
}