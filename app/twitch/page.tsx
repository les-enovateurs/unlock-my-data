import Image from "next/image"
import Link from "next/link";

export default function Home() {
  return (
    <>
        <section className="container mx-auto max-w-screen-xl">
          <div className="flex flex-col md:flex-row gap-10 justify-center p-6 items-center">
            <Image src={'/twitch_logo.svg'} alt="Logo de Twitch" width={400} height={250} sizes="(max-with: 768px) 100%, 45%" className="md:w-1/3"/>
            <div className="md:w-1/2">
              <h1 className="font-bold text-4xl text-blue-800">Twitch</h1>
              <h2 className="text-xl italic mb-3">La plateforme de streaming d&apos;Amazon</h2>
              <p className="mb-2"><span className="font-medium">Groupe :</span> Amazon Corporation</p>
              <Image src={'/usa_flag.webp'} alt="Drapeau américain" width={32} height={32} className="inline-block mr-2"/>
              <span className="inline-block">Américaine</span>
            </div>
          </div>
        </section>
        <section className="bg-blue-800 py-10 px-6">
          <div className="container mx-auto max-w-screen-xl">
            <h2 className="font-bold text-2xl text-white mb-2">Quelles sont les données collectées par Twitch ?</h2>
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="border-t-4 border-blue-400 md:w-1/2 rounded shadow-lg bg-white px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-center">Données fournies par l&apos;utilisateur</h3>
                <div className="flex flex-col md:flex-row">
                  <ul className="md:w-1/2 md:inline-block">
                    <li>Votre nom et prénom</li>
                    <li>Votre adresse postale</li>  
                    <li>Votre email</li>
                    <li>Votre identifiant Twitch</li>  
                  </ul>
                  <ul className="md:w-1/2 md:inline-block"> 
                    <li className="text-red-500 font-semibold">Votre voix</li>
                    <li className="text-red-500 font-semibold">Votre image</li>
                    <li>Votre numéro de téléphone</li>
                    <li className="text-red-500 font-semibold">Vos informations de facturation</li>  
                  </ul>
                </div>
              </div>
              <div className="border-t-4 border-blue-400 md:w-1/4 rounded shadow-lg bg-white px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-center">Données collectées automatiquement</h3>
                <ul>
                  <li>Votre adresse IP</li>
                  <li>Votre appareil</li>
                  <li className="text-red-500 font-semibold">Votre utilisation des services</li>
                </ul>
              </div>
              <div className="border-t-4 border-blue-400 md:w-1/4 rounded shadow-lg bg-white px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-center">Données d&apos;autres sources</h3>
                <ul>
                  <li>Provenant d&apos;annonceurs et réseaux sociaux</li>
                  <li>Provenant de services comme Riot ou Steam</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="border-l-4 border-red-600 md:w-1/3 rounded shadow-lg bg-red-50 px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-red-600">Votre voix et image</h3>
                <p>Dans le cas où vous avez déjà proposer du contenu vidéo sur la plateforme, Twitch se permet de pouvoir utiliser votre image et votre voix.
                  Ces données peuvent être utilisées pour entraîner une IA par exemple.
                </p>
              </div>
              <div className="border-l-4 border-red-600 md:w-1/3 rounded shadow-lg bg-red-50 px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-red-600">Vos informations de facturation</h3>
                <p>En cas de fuite de données, vos informations bancaires pourraient se retrouver en ligne. Il est donc fortement recommandé 
                  de ne pas enregistrer ses coordonnées sur la plateforme.
                </p>
              </div>
              <div className="border-l-4 border-red-600 md:w-1/3 rounded shadow-lg bg-red-50 px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-red-600">Votre utilisation des services</h3>
                <p>En traçant toute votre activité sur le site ou l'application, Twitch (et Amazon) peut établir un profil complet 
                  de vous pour vous envoyer des pubs ciblées.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto max-w-screen-xl p-6 py-10">
          <h2 className="font-bold text-2xl">Pourquoi le pays d&apos;origine de Twitch pose problème ?</h2>
          <p>Twitch est une société américaine soumise aux lois américaines.
            Bien qu&apos;elle soit censée respecté le RGPD européen, les règles américaines sont beaucoup moins protectrices des utilisateurs et de leurs données.
            Le gouvernement américain peut facilement accéder aux données détenues par Twitch s&apos;ils le demandent par exemple.
            De plus, les informations détenues par Twitch peuvent être partagées avec tout le groupe Amazon et donc constituer une base de données énorme sur vous.</p>
            <blockquote cite="https://www.twitch.tv/p/fr-fr/legal/privacy-notice/20220719" className="text-xl italic text-gray-900 border-blue-800 border-l-4 px-4 py-2 bg-gray-100 mt-4 rounded transition-all hover:bg-white">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
            </svg>
            <p>&quot;Les informations collectées par Twitch peuvent être stockées et traitées dans votre région, aux États-Unis 
            (par exemple dans nos principaux centres de données), ou dans tout autre pays où Twitch ou ses sociétés affiliées, 
            filiales, partenaires ou fournisseurs de services sont situés ou maintiennent des installations.&quot;</p>
            <Link className="mt-2 block italic text-base" href={'https://www.twitch.tv/p/fr-fr/legal/privacy-notice/20220719'} target="_blank">- https://www.twitch.tv/p/fr-fr/legal/privacy-notice/20220719</Link>
          </blockquote>
        </section>
        <section className="bg-blue-800 py-10 px-6">
          <div className="container mx-auto max-w-screen-xl">
            <h2 className="font-bold text-2xl text-white mb-2">Comment paramétrer Twitch pour réduire son impact sur les données ?</h2>
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="border-t-4 border-blue-400 md:w-1/3 rounded shadow-lg bg-white px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-center">Récupérer vos données</h3>
                <ol className="list-decimal pl-4">
                  <li>Se connecter à votre compte</li>
                  <li>Accéder aux paramètres</li>
                  <li>Se rendre dans l&apos;onglet sécurité et confidentialité</li>
                  <li>Descendre jusqu&apos;à la section Télécharger vos données</li>
                  <li>Cliquer sur <b>Demander une copie de vos données</b></li>
                </ol>
                
              </div>
              <div className="border-t-4 border-blue-400 md:w-1/3 rounded shadow-lg bg-white px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-center">Limiter les données collectées</h3>
                <ol className="list-decimal pl-4">
                  <li>Se connecter à votre compte</li>
                  <li>Accéder aux paramètres</li>
                  <li>Se rendre dans l&apos;onglet sécurité et confidentialité</li>
                  <li>Descendre jusqu&apos;à la section Cookies et choix publicitaires</li>
                  <li>Cliquer sur <b>Gérer les préférences de consentement</b></li>
                  <li>Décocher toutes les cases</li>
                </ol>
              </div>
              <div className="border-t-4 border-blue-400 md:w-1/3 rounded shadow-lg bg-white px-4 py-5 flex flex-col content-center my-2 gap-2">
                <h3 className="font-medium text-lg text-center">Limiter les services tiers</h3>
                <ol className="list-decimal pl-4">
                  <li>Se connecter à votre compte</li>
                  <li>Accéder aux paramètres</li>
                  <li>Se rendre dans l&apos;onglet Connexions</li>
                  <li>Déconnectez tous les services précédemment liés</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto max-w-screen-xl py-10 px-6 mb-4">
          <h2 className="font-bold text-2xl">Comment supprimer son compte Twitch ?</h2>
          <p className="mb-5">Twitch permet seulement de désactiver son compte et non de le supprimer depuis les paramètres du compte. Il faut donc accéder à une page cachée.</p>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 text-center mb-8">
              <div><span className="block text-4xl font-bold bg-blue-800 text-white mx-auto rounded-full w-12 h-12">1</span></div>
              <h3 className="mt-3 font-medium text-xl">Se connecter à votre compte</h3>
            </div>
            <div className="md:w-1/3 text-center mb-8">
              <div><span className="block text-4xl font-bold bg-blue-800 text-white mx-auto rounded-full w-12 h-12">2</span></div>
              <h3 className="mt-3 font-medium text-xl">Se rendre à cette adresse</h3>
              <Link href={'https://www.twitch.tv/user/delete-account'} target="_blank" className="italic text-sm">https://www.twitch.tv/user/delete-account</Link>
            </div>
            <div className="md:w-1/3 text-center mb-8">
              <div><span className="block text-4xl font-bold bg-blue-800 text-white mx-auto rounded-full w-12 h-12">3</span></div>
              <h3 className="mt-3 font-medium text-xl">Cliquer sur &quot;Supprimer le compte&quot;</h3>
            </div>
          </div>
        </section>
    </>
  );
}
