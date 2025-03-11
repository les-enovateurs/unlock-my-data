import Image from "next/image";
import Link from "next/link";

export default function Instagram() {
    return (
        <>
        <section className="flex flex-col py-16 items-center bg-gradient-to-br from-[#833AB4] to-[#E1306C] text-white lg:flex-row lg:justify-center lg:min-h-96 lg:gap-x-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/3">
                <Image 
                  src="/pictures/Instagram-logo.svg" 
                  alt="Logo Instagram" 
                  width={120} 
                  height={120}
                  className="mx-auto" 
                />
              </div>
              <div className="lg:w-2/3">
                <h1 className="text-2xl lg:text-4xl font-bold leading-tight text-center lg:text-left">
                  Comment protéger vos données personnelles sur Instagram ?
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-xl lg:text-3xl text-center mb-8">
                <h2 className="leading-snug font-bold">Quelles données sont collectées ?</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-purple-50 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl lg:text-2xl font-semibold mb-3 text-[#833AB4]">Information de l'utilisateur</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>Nom et prénom</li>
                    <li>Date de naissance</li>  
                    <li>Adresse e-mail</li>
                    <li>Numéro de téléphone</li>
                    <li>Photo de profil</li>  
                    <li>Biographie</li>  
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl lg:text-2xl font-semibold mb-3 text-[#833AB4]">Données techniques</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>L'adresse IP de votre appareil</li>
                    <li>Le type d'appareil que vous utilisez</li>
                    <li>Le système d'exploitation</li>
                    <li>Les navigateurs web utilisés</li>
                    <li>Votre activité sur d'autres apps Meta</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl lg:text-2xl font-semibold mb-3 text-[#833AB4]">Données d'utilisation</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>Vos centres d'intérêt</li>
                    <li>Votre localisation géographique</li>
                    <li>Vos interactions avec les publicités</li>
                    <li>Vos contacts téléphoniques</li>
                  </ul>
                </div>
              </div>

              <div className="text-xl lg:text-3xl text-center mb-8">
                <h2 className="leading-snug font-bold">Comment contrôler vos données sur Instagram ?</h2>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg shadow-lg text-gray-800">
                <p className="text-base lg:text-lg mb-4">Pour garantir votre contrôle sur vos données, Instagram propose plusieurs options :</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Vous pouvez accéder à vos données et les télécharger à tout moment.</li>
                  <li>Vous pouvez choisir de ne pas partager certaines de vos données.</li>
                  <li>Vous pouvez désactiver la collecte de certaines données, comme votre localisation.</li>
                  <li>Vous pouvez supprimer votre compte Instagram.</li>
                </ul>
                <p className="text-base lg:text-lg mt-4">Pour obtenir davantage d'informations sur la manière dont Instagram collecte et utilise vos données, veuillez consulter sa politique de confidentialité.</p>
                <div className="mt-4">
                  <Link 
                    href={'https://www.clubic.com/tutoriels/article-893215-1-comment-connaitre-donnees-instagram-recoltees-profil.html'} 
                    prefetch={false} 
                    target="_blank" 
                    className="text-[#833AB4] hover:text-[#E1306C] transition-colors duration-300"
                  >
                    En savoir plus
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-[#FBAD50] to-[#E1306C] text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-xl lg:text-3xl text-center mb-8">
                <h2 className="leading-snug font-bold">Comment supprimer son compte Instagram ?</h2>
              </div>
              
              <div className="bg-white/90 backdrop-blur p-6 rounded-lg shadow-lg text-gray-800 mb-10 border-l-8 border-red-500">
                <div className="flex items-start">
                  <div className="mr-4 flex-shrink-0">
                    <Image
                      src="/pictures/danger.svg"
                      height={40}
                      width={40}
                      alt="Attention"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-xl text-red-500 mb-2">Attention : Action irréversible</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Toutes vos photos, vidéos, stories et messages seront définitivement supprimés.</li>
                      <li>Vous ne pourrez plus vous connecter à votre compte ou récupérer vos données.</li>
                      <li>Vos abonnements et relations avec d'autres utilisateurs seront perdus.</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {/* Vertical line for timeline */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-white/50 transform md:translate-x-[-50%] hidden md:block"></div>
                
                <div className="space-y-12 relative">
                  <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                    <div className="md:text-right mb-6 md:mb-0 md:pr-12">
                      <h3 className="text-xl font-bold mb-2">1. Se connecter</h3>
                      <p className="text-white/90">Rendez-vous sur la page de connexion d'Instagram et accédez à votre compte avec vos identifiants.</p>
                      <Link 
                        href={'https://www.instagram.com/'} 
                        prefetch={false} 
                        target="_blank" 
                        className="inline-block mt-2 py-1 px-3 bg-white/20 backdrop-blur rounded text-white hover:bg-white/30 transition-colors"
                      >
                        Accéder à Instagram
                      </Link>
                    </div>
                    <div className="md:pl-12 flex items-center">
                      <span className="hidden md:flex w-8 h-8 rounded-full bg-white text-[#E1306C] text-lg font-bold items-center justify-center absolute left-1/2 transform -translate-x-1/2 z-10">1</span>
                      <div className="bg-white/20 backdrop-blur p-4 rounded-lg w-full">
                        <p className="font-medium">Utilisez votre navigateur plutôt que l'application pour accéder aux paramètres de suppression.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                    <div className="md:pl-12 flex items-center order-2 md:order-1">
                      <span className="hidden md:flex w-8 h-8 rounded-full bg-white text-[#E1306C] text-lg font-bold items-center justify-center absolute left-1/2 transform -translate-x-1/2 z-10">2</span>
                      <div className="bg-white/20 backdrop-blur p-4 rounded-lg w-full">
                        <p className="font-medium">L'icône de profil se trouve en haut à droite sur les ordinateurs de bureau ou en bas à droite sur les appareils mobiles.</p>
                      </div>
                    </div>
                    <div className="md:text-right mb-6 md:mb-0 md:pr-12 order-1 md:order-2">
                      <h3 className="text-xl font-bold mb-2">2. Accéder aux paramètres</h3>
                      <p className="text-white/90">Cliquez sur votre photo de profil, puis sur "Paramètres" ou "Réglages".</p>
                    </div>
                  </div>
                  
                  <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                    <div className="md:text-right mb-6 md:mb-0 md:pr-12">
                      <h3 className="text-xl font-bold mb-2">3. Centre de comptes</h3>
                      <p className="text-white/90">Sélectionnez "Centre de comptes" puis "Informations personnelles".</p>
                    </div>
                    <div className="md:pl-12 flex items-center">
                      <span className="hidden md:flex w-8 h-8 rounded-full bg-white text-[#E1306C] text-lg font-bold items-center justify-center absolute left-1/2 transform -translate-x-1/2 z-10">3</span>
                      <div className="bg-white/20 backdrop-blur p-4 rounded-lg w-full">
                        <p className="font-medium">Instagram a récemment modifié son interface, ces options peuvent se trouver dans "Compte" puis "Confidentialité".</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                    <div className="md:pl-12 flex items-center order-2 md:order-1">
                      <span className="hidden md:flex w-8 h-8 rounded-full bg-white text-[#E1306C] text-lg font-bold items-center justify-center absolute left-1/2 transform -translate-x-1/2 z-10">4</span>
                      <div className="bg-white/20 backdrop-blur p-4 rounded-lg w-full">
                        <p className="font-medium">N'oubliez pas d'enregistrer ou d'exporter vos données avant de procéder à la suppression.</p>
                      </div>
                    </div>
                    <div className="md:text-right mb-6 md:mb-0 md:pr-12 order-1 md:order-2">
                      <h3 className="text-xl font-bold mb-2">4. Propriété et contrôle</h3>
                      <p className="text-white/90">Naviguez vers "Désactivation ou suppression de compte".</p>
                    </div>
                  </div>
                  
                  <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                    <div className="md:text-right mb-6 md:mb-0 md:pr-12">
                      <h3 className="text-xl font-bold mb-2">5. Suppression définitive</h3>
                      <p className="text-white/90">Sélectionnez "Supprimer le compte" et confirmez votre choix.</p>
                    </div>
                    <div className="md:pl-12 flex items-center">
                      <span className="hidden md:flex w-8 h-8 rounded-full bg-white text-[#E1306C] text-lg font-bold items-center justify-center absolute left-1/2 transform -translate-x-1/2 z-10">5</span>
                      <div className="bg-white/20 backdrop-blur p-4 rounded-lg w-full">
                        <p className="font-medium">Instagram vous proposera de désactiver temporairement votre compte au lieu de le supprimer. Pour la suppression complète, insistez sur cette option.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 p-6 bg-white/20 backdrop-blur rounded-lg text-center">
                <p className="font-semibold">
                  Vous préférez un contrôle sans suppression ? Explorez les 
                  <Link href="#" className="mx-1 underline decoration-dotted hover:text-yellow-200 transition-colors">
                    paramètres de confidentialité
                  </Link>
                  pour limiter ce que Meta peut collecter sur vous.
                </p>
              </div>
            </div>
          </div>
        </section>

    

        </>
    );
}