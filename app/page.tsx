"use client";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Nouvelle mention en haut de page */}
      <div className="w-full bg-info-100 border-b border-info-300 py-4 px-2 text-center">
        <p className="text-info-900 text-base md:text-lg font-medium">
          <span className="font-bold">Nouveau :</span> Vous explorez la nouvelle version d’Unlock, enrichie avec de nouvelles données et fonctionnalités. 
          L’ancienne version reste accessible ici :{" "}
          <a 
            href="https://app.unlock-my-data.com/login" 
            className="underline text-info-800 hover:text-info-600 font-semibold" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            https://app.unlock-my-data.com/login
          </a>
        </p>
      </div>

      <div className="hero bg-base-200 p-12">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold">Des données en conscience</h1>
            <p className="py-6">
              Le web est un monde de données, entre les comptes crée en un rien de temps, les informations que nous partageons, les traces que nous laissons...
            </p>
            <p>
              Unlock My data vous permet de comparer des services similaires et de choisir celui qui vous correspond le mieux.
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
                  <p className="text-gray-700">La tendance la plus préoccupante est celle d'une recrudescence de violations de très grande ampleur. Le nombre de violations touchant plus d'un million de personnes a doublé en un an.</p>
                  <p className="text-sm text-gray-500 italic">Source : <a href="https://www.cnil.fr/fr/violations-massives-de-donnees-en-2024-quels-sont-les-principaux-enseignements-mesures-a-prendre" className="underline hover:text-red-600" target="_blank" rel="noopener noreferrer">CNIL - Janvier 2025</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Pourquoi comparer les services ?</h2>
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
              <div className="mt-12">
                <a href="/comparatif/" className="btn btn-primary btn-lg">Découvrir nos comparatifs</a>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      <div className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Contribuez au projet</h2>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="space-y-6">
                <p className="text-lg text-gray-700">
                  Unlock My Data est un projet open source porté par une équipe de bénévoles passionnés. 
                  Nous nous appuyons sur des projets communautaires comme 
                  <a href="https://tosdr.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 mx-1">ToSDR</a> 
                  et 
                  <a href="https://exodus-privacy.eu.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 mx-1">Exodus Privacy</a> 
                  pour construire une base de données transparente sur l'utilisation de nos données personnelles.
                </p>

                <div className="flex flex-col items-center gap-4 mt-8">
                  <p className="text-lg font-medium">Rejoignez-nous dans cette aventure !</p>
                  <a 
                    href="https://github.com/UnlockMyData/reboot" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    Contribuer sur GitHub
                  </a>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">🔍 Analyser</h3>
                    <p className="text-sm text-gray-600">Aidez-nous à analyser les services numérique</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">📝 Documenter</h3>
                    <p className="text-sm text-gray-600">Participez à la documentation des pratiques de confidentialité</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">💻 Développer</h3>
                    <p className="text-sm text-gray-600">Contribuez au développement de la plateforme</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <span className="text-2xl">❤️</span>
              <h2 className="text-3xl font-bold">Made with love</h2>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 shadow-lg">
              <div className="space-y-6">
                <div className="flex justify-center mb-8">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Les e-novateurs</h3>
                    <p className="text-gray-600 italic">Média associatif français</p>
                  </div>
                </div>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Notre mission est de sensibiliser le grand public à l'impact du numérique sur l'environnement et la société. 
                  À travers nos contenus et nos outils, nous souhaitons promouvoir un usage plus conscient et responsable des technologies.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <div className="bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-primary-600"><Link href="https://les-enovateurs.com/category/sobriete/1" className="hover:text-primary-800 transition-colors duration-300 flex items-center gap-2">🌱 <span className="hover:underline">Sobre</span></Link></span>
                  </div>
                  <div className="bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-primary-600"><Link href="https://les-enovateurs.com/category/ethique/1" className="hover:text-primary-800 transition-colors duration-300 flex items-center gap-2">🤝 <span className="hover:underline">Ethique</span></Link></span>
                  </div>
                  <div className="bg-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-primary-600"><Link href="https://les-enovateurs.com/category/inclusion/1" className="hover:text-primary-800 transition-colors duration-300 flex items-center gap-2">💡 <span className="hover:underline">Inclusive</span></Link></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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