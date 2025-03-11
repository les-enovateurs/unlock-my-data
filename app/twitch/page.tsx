import Image from "next/image"
import Link from "next/link";

export default function Twitch() {
  return (
    <>
      <section className="flex flex-col py-16 items-center bg-gradient-to-br from-[#9146FF] to-[#6441A4] text-white lg:flex-row lg:justify-center lg:min-h-96 lg:gap-x-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-between gap-12">
            <div className="lg:w-1/3">
              <Image 
                src="/twitch-logo.svg" 
                alt="Logo de Twitch" 
                width={120} 
                height={120}
                className="filter brightness-0 invert mx-auto"
              />
            </div>
            <div className="lg:w-2/3">
              <h1 className="text-2xl lg:text-4xl font-bold leading-tight text-center lg:text-left">
                Comment protéger vos données personnelles sur Twitch ?
              </h1>
              <p className="mt-4 text-white/90 text-center lg:text-left">
                <span className="font-medium">Groupe :</span> Amazon Corporation
                <span className="ml-4">
                  <Image src='/usa-flag.webp' alt="Drapeau américain" width={24} height={24} className="inline-block mr-2"/>
                  Américaine
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto">
            <div className="text-xl lg:text-3xl text-center mb-8">
              <h2 className="leading-snug font-bold">Quelles données sont collectées par Twitch ?</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-purple-50 p-6 rounded-lg shadow-lg border-t-4 border-[#9146FF]">
                <h3 className="text-xl font-semibold mb-4 text-[#9146FF] text-center">Données fournies par l'utilisateur</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <ul className="space-y-2 text-gray-700 md:w-1/2">
                    <li>Votre nom et prénom</li>
                    <li>Votre adresse postale</li>  
                    <li>Votre email</li>
                    <li>Votre identifiant Twitch</li>
                  </ul>
                  <ul className="space-y-2 text-gray-700 md:w-1/2">
                    <li className="text-red-500 font-semibold">Votre voix</li>
                    <li className="text-red-500 font-semibold">Votre image</li>
                    <li>Votre numéro de téléphone</li>
                    <li className="text-red-500 font-semibold">Vos informations de facturation</li> 
                  </ul>
                </div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg shadow-lg border-t-4 border-[#9146FF]">
                <h3 className="text-xl font-semibold mb-4 text-[#9146FF] text-center">Données collectées automatiquement</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Votre adresse IP</li>
                  <li>Votre appareil</li>
                  <li className="text-red-500 font-semibold">Votre utilisation des services</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg shadow-lg border-t-4 border-[#9146FF]">
                <h3 className="text-xl font-semibold mb-4 text-[#9146FF] text-center">Données d'autres sources</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Provenant d'annonceurs et réseaux sociaux</li>
                  <li>Provenant de services comme Riot ou Steam</li>
                </ul>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-red-50 p-6 rounded-lg shadow-lg border-l-4 border-red-500">
                <h3 className="text-xl font-semibold mb-3 text-red-600">Votre voix et image</h3>
                <p className="text-gray-700">
                  Dans le cas où vous avez déjà proposer du contenu vidéo sur la plateforme, Twitch se permet de pouvoir utiliser votre image et votre voix.
                  Ces données peuvent être utilisées pour entraîner une IA par exemple.
                </p>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg shadow-lg border-l-4 border-red-500">
                <h3 className="text-xl font-semibold mb-3 text-red-600">Vos informations de facturation</h3>
                <p className="text-gray-700">
                  En cas de fuite de données, vos informations bancaires pourraient se retrouver en ligne. Il est donc fortement recommandé 
                  de ne pas enregistrer ses coordonnées sur la plateforme.
                </p>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg shadow-lg border-l-4 border-red-500">
                <h3 className="text-xl font-semibold mb-3 text-red-600">Votre utilisation des services</h3>
                <p className="text-gray-700">
                  En traçant toute votre activité sur le site ou l'application, Twitch (et Amazon) peut établir un profil complet 
                  de vous pour vous envoyer des pubs ciblées.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-xl lg:text-3xl text-center mb-8">
              <h2 className="leading-snug font-bold">Pourquoi le pays d'origine de Twitch pose problème ?</h2>
            </div>
            
            <p className="text-gray-700 mb-6">
              Twitch est une société américaine soumise aux lois américaines.
              Bien qu'elle soit censée respecté le RGPD européen, les règles américaines sont beaucoup moins protectrices des utilisateurs et de leurs données.
              Le gouvernement américain peut facilement accéder aux données détenues par Twitch s'ils le demandent par exemple.
              De plus, les informations détenues par Twitch peuvent être partagées avec tout le groupe Amazon et donc constituer une base de données énorme sur vous.
            </p>
            
            <blockquote className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#9146FF] text-gray-700 mb-4">
              <svg className="w-8 h-8 text-[#9146FF]/60 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
              </svg>
              <p className="italic text-lg mb-2">
                "Les informations collectées par Twitch peuvent être stockées et traitées dans votre région, aux États-Unis 
                (par exemple dans nos principaux centres de données), ou dans tout autre pays où Twitch ou ses sociétés affiliées, 
                filiales, partenaires ou fournisseurs de services sont situés ou maintiennent des installations."
              </p>
              <Link className="text-[#9146FF] hover:text-[#6441A4] transition-colors duration-300"
                href={'https://www.twitch.tv/p/fr-fr/legal/privacy-notice/20220719'} 
                target="_blank"
              >
                - Politique de confidentialité Twitch
              </Link>
            </blockquote>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gradient-to-br from-[#9146FF]/90 to-[#6441A4]/90 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-xl lg:text-3xl text-center mb-8">
              <h2 className="leading-snug font-bold">Comment paramétrer Twitch pour réduire son impact sur les données ?</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/90 backdrop-blur p-6 rounded-lg shadow-lg text-gray-800">
                <div className="w-12 h-12 rounded-full bg-[#9146FF] text-white text-xl flex items-center justify-center mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-4 text-center">Récupérer vos données</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Se connecter à votre compte</li>
                  <li>Accéder aux paramètres</li>
                  <li>Se rendre dans l'onglet sécurité et confidentialité</li>
                  <li>Descendre jusqu'à la section Télécharger vos données</li>
                  <li>Cliquer sur <b>Demander une copie de vos données</b></li>
                </ol>
              </div>
              
              <div className="bg-white/90 backdrop-blur p-6 rounded-lg shadow-lg text-gray-800">
                <div className="w-12 h-12 rounded-full bg-[#9146FF] text-white text-xl flex items-center justify-center mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-4 text-center">Limiter les données collectées</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Se connecter à votre compte</li>
                  <li>Accéder aux paramètres</li>
                  <li>Se rendre dans l'onglet sécurité et confidentialité</li>
                  <li>Descendre jusqu'à la section Cookies et choix publicitaires</li>
                  <li>Cliquer sur <b>Gérer les préférences de consentement</b></li>
                  <li>Décocher toutes les cases</li>
                </ol>
              </div>
              
              <div className="bg-white/90 backdrop-blur p-6 rounded-lg shadow-lg text-gray-800">
                <div className="w-12 h-12 rounded-full bg-[#9146FF] text-white text-xl flex items-center justify-center mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-4 text-center">Limiter les services tiers</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Se connecter à votre compte</li>
                  <li>Accéder aux paramètres</li>
                  <li>Se rendre dans l'onglet Connexions</li>
                  <li>Déconnectez tous les services précédemment liés</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-xl lg:text-3xl text-center mb-8">
              <h2 className="leading-snug font-bold">Comment supprimer son compte Twitch ?</h2>
            </div>
            <p className="text-gray-700 text-center mb-10">Twitch permet seulement de désactiver son compte et non de le supprimer depuis les paramètres du compte. Il faut donc accéder à une page cachée.</p>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#9146FF] text-white text-2xl flex items-center justify-center mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Se connecter à votre compte</h3>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#9146FF] text-white text-2xl flex items-center justify-center mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Se rendre à cette adresse</h3>
                <Link 
                  href={'https://www.twitch.tv/user/delete-account'} 
                  target="_blank" 
                  className="text-[#9146FF] hover:text-[#6441A4] transition-colors duration-300"
                >
                  https://www.twitch.tv/user/delete-account
                </Link>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#9146FF] text-white text-2xl flex items-center justify-center mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Cliquer sur "Supprimer le compte"</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
