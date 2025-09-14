"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>

      <div className="hero bg-base-200 p-12">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold">Débloquez vos données</h1>
            <p className="py-6">
              Le Web est un monde de données : comptes créés en un rien de temps, informations personnelles partagées par centaines... nos traces en ligne sont de plus en plus nombreuses.
            </p>
            <p>
              Unlock My data vous permet de comparer des services numériques similaires, et de choisir le plus respectueux de votre vie privée.
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
                  <h2 className="text-3xl font-bold text-red-800">Alerte CNIL 2024</h2>
                  <div className="text-4xl font-bold text-red-600">5 629</div>
                  <div className="text-xl text-red-800">violations de données personnelles</div>
                  <div className="text-lg font-semibold text-red-700">+20% par rapport à 2023</div>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700">La tendance la plus préoccupante ? Une recrudescence de violations de données de très grande ampleur. Le nombre de violations touchant plus d'un million de personnes a doublé en un an.</p>
                  <p className="text-sm text-gray-500 italic">Source : <a href="https://www.cnil.fr/fr/violations-massives-de-donnees-en-2024-quels-sont-les-principaux-enseignements-mesures-a-prendre" className="underline hover:text-red-600" target="_blank" rel="noopener noreferrer">CNIL - Janvier 2025</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Dans l'actualité des données personnelles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <a
                  href="https://les-enovateurs.com/si-gratuit-toi-produit-comment-economie-numerique-engloutit-donnees"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <Image alt={""} height={270} width={480} src={"https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsi-gratuit-toi-produit-comment-economie-numerique-engloutit-donnees.a3b6fb20.webp&w=1200&q=75"} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Si c'est gratuit, c'est toi le produit</h3>
                  <p className="text-gray-600 text-sm">Comment l'économie numérique engloutit nos données</p>
                </div>
              </a>

              <a
                  href="https://les-enovateurs.com/dites-non-pillage-donnees-personnelles-entrainer-ia-meta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <Image alt={""} height={270} width={480} src={"https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdites-non-pillage-donnees-personnelles-entrainer-ia-meta.07c7c19c.webp&w=1200&q=75"} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Dites non au pillage de vos données</h3>
                  <p className="text-gray-600 text-sm">Comment Meta utilise vos données personnelles pour entraîner son IA</p>
                </div>
              </a>

              <a
                  href="https://les-enovateurs.com/hacks/passe-numerique-retrouvez-supprimez-donnees"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <Image alt={""} height={270} width={480} src={"https://les-enovateurs.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpasse-numerique-retrouvez-supprimez-donnees.84a9c4ab.webp&w=1920&q=75"} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Passé numérique</h3>
                  <p className="text-gray-600 text-sm">Retrouvez et supprimez vos données</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Comparez les services numériques</h2>
            <h3 className={"text-xl font-semibold mb-9"}>Pour choisir un outil qui respecte votre vie privée</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-3">Transparence</h3>
                <p className="text-gray-600">Comprenez comment vos données sont réellement utilisées par chaque service</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl mb-4">⚖️</div>
                <h3 className="text-xl font-semibold mb-3">Choix éclairé</h3>
                <p className="text-gray-600">Comparez les pratiques de confidentialité et choisissez le service qui respecte le mieux vos données</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl mb-4">🛡️</div>
                <h3 className="text-xl font-semibold mb-3">Protection</h3>
                <p className="text-gray-600">Protégez votre vie privée en évitant les services qui ne respectent pas vos données</p>
              </div>
              <div className="mt-12 flex flex-row gap-4 items-center">
                <a href="/comparer/" className="btn btn-primary btn-lg">Comparez maintenant</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Catalogue de services analysés</h2>
            <h3 className="text-xl font-semibold mb-9">Découvrez en détail comment vos données personnelles sont utilisées</h3>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 shadow-lg mb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4 text-left">
                  <div className="text-4xl mb-4">📊</div>
                  <h4 className="text-2xl font-bold text-gray-800">Analyses détaillées</h4>
                  <p className="text-gray-700">
                    Chaque service numérique listé dans notre catalogue fait l'objet d'une analyse approfondie :
                    collecte de données, partage avec des tiers, géolocalisation, publicité ciblée,
                    durée de conservation des données...
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-left">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Conditions d'utilisation décryptées</span>
                  </div>
                  <div className="flex items-center space-x-3 text-left">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Politique de confidentialité analysée</span>
                  </div>
                  <div className="flex items-center space-x-3 text-left">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Trackers et permissions détaillés</span>
                  </div>
                  <div className="flex items-center space-x-3 text-left">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Note de respect de la vie privée</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl mb-4">🔍</div>
                <h4 className="text-lg font-semibold mb-3">Recherche facile</h4>
                <p className="text-gray-600 text-sm">Trouvez rapidement les informations sur vos services préférés</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl mb-4">📈</div>
                <h4 className="text-lg font-semibold mb-3">Mises à jour régulières</h4>
                <p className="text-gray-600 text-sm">Nos analyses suivent les changements de politique de confidentialité</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl mb-4">🎯</div>
                <h4 className="text-lg font-semibold mb-3">Informations claires</h4>
                <p className="text-gray-600 text-sm">Des explications accessibles, quelle que soit votre aisance avec le numérique</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/liste-applications" className="btn btn-primary btn-lg">
                Consultez le catalogue
              </Link>
              <Link href="/comparer" className="btn btn-outline btn-lg">
                Comparez les services
              </Link>
            </div>
          </div>
        </div>
      </div>
     
      <div className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Contribuez au projet</h2>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="space-y-6">
                <p className="text-lg text-gray-700">
                  Unlock My Data est un projet open source porté par une équipe de bénévoles passionnés. 
                  Nous nous appuyons sur des projets communautaires comme 
                  <a href="https://tosdr.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 mx-1">ToSDR</a> 
                  et 
                  <a href="https://exodus-privacy.eu.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 mx-1">Exodus Privacy</a> 
                  pour construire une base de données transparente sur la réutilisation de nos données personnelles en ligne.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  <div className="p-6 border-2 rounded-2xl">
                    <div className="text-3xl mb-3">🔍</div>
                    <h3 className="font-bold text-lg mb-3 text-primary-600">Analysez les services</h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Aidez-nous à analyser les services numériques et à documenter l'usage des données personnelles.
                    </p>
                    <Link
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-900 font-semibold text-sm underline hover:no-underline transition-colors duration-200"
                        href="https://github.com/les-enovateurs/unlock-my-data/blob/master/CONTRIBUTING_FR.md"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                      <span>📖</span>
                     Commencez à contribuer simplement
                    </Link>
                  </div>

                  <div className="p-6 border-2 rounded-2xl">
                    <div className="text-3xl mb-3">💻</div>
                    <h3 className="font-bold text-lg mb-3">Développez la plateforme</h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Contribuez au code source, améliorez l'interface utilisateur et ajoutez de nouvelles fonctionnalités.
                    </p>
                    <Link
                        className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold text-sm underline hover:no-underline transition-colors duration-200"
                        href="https://github.com/les-enovateurs/unlock-my-data/blob/master/README_FR.md"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                      <span>⚡</span>
                      Commencez à développer
                    </Link>
                  </div>

                  <div className="p-6 border-2 rounded-2xl">
                    <div className="text-3xl mb-3">📢</div>
                    <h3 className="font-bold text-lg mb-3 text-purple-800">Faites connaître</h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Partagez le projet autour de vous et sensibilisez votre entourage à la protection de leurs données.
                    </p>
                    <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm">
                      <span>💬</span>
                      Partagez sur vos réseaux
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
              <p className="text-gray-600 text-sm italic mb-4">Média associatif français</p>
              <p className="text-gray-700 mb-6">
                Notre mission : sensibiliser les citoyens aux impacts du numérique sur l'environnement et la société.
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <Link href="https://les-enovateurs.com/category/sobriete/1" className="text-primary-600 hover:text-primary-800 underline hover:no-underline">
                  🌱 Ecologie numérique
                </Link>
                <Link href="https://les-enovateurs.com/category/ethique/1" className="text-primary-600 hover:text-primary-800 underline hover:no-underline">
                  🤝 Ethique
                </Link>
                <Link href="https://les-enovateurs.com/category/inclusion/1" className="text-primary-600 hover:text-primary-800 underline hover:no-underline">
                  💡 Inclusion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notice about old version */}
      <div className="bg-blue-50 border-t border-blue-200 py-3 px-4 text-center">
        <p className="text-blue-800 text-sm">
          Pour retrouver l'ancienne version :
          <a
              href="https://app.unlock-my-data.com/login"
              className="underline hover:no-underline font-medium ml-1"
              target="_blank"
              rel="noopener noreferrer"
          >
            app.unlock-my-data.com
          </a>
        </p>
      </div>


      {/* <Accroche/> */}
      {/* <Stats /> */}
      {/*   <Concept/>*/}
      {/* <Features/> */}
      {/* <Score/>  */}
      {/* <FAQ/>  */}
  
      {/* // </div> */}
    </>
  );
}