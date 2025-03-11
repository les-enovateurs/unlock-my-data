'use client';
import Image from "next/image";
import Link from "next/link";

export default function GmailPrivacy() {
  return (
    <>
      <section className="flex flex-col py-16 items-center bg-gradient-to-br from-[#4285F4] to-[#0F9D58] text-white lg:flex-row lg:justify-center lg:min-h-96 lg:gap-x-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="p-4 rounded-full bg-white">
              <Image 
                src="/G.svg" 
                alt="Logo de Gmail" 
                width={120} 
                height={120} 
                className="mx-auto"
              />
            </div>
            <div className="lg:w-2/3">
              <h1 className="text-2xl lg:text-4xl font-bold leading-tight text-center lg:text-left">
                Comment protéger vos données personnelles sur les services Google ?
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-xl lg:text-3xl text-center mb-8">
              <h2 className="leading-snug font-bold">Quelles sont les données collectées par Google</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl lg:text-2xl font-semibold mb-3 text-[#4285F4]">Données de compte</h3>
                <ul className="text-gray-600 list-disc pl-5 space-y-2">
                  <li>Adresse email</li>
                  <li>Contacts</li>
                  <li>Paramètres de compte</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl lg:text-2xl font-semibold mb-3 text-[#4285F4]">Données d'activité</h3>
                <ul className="text-gray-600 list-disc pl-5 space-y-2">
                  <li>Utilisation des services</li>
                  <li>Historique de recherche</li>
                  <li>Interactions avec les emails</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl lg:text-2xl font-semibold mb-3 text-[#4285F4]">Données de localisation</h3>
                <ul className="text-gray-600 list-disc pl-5 space-y-2">
                  <li>Localisation (si activée)</li>
                  <li>Adresse IP</li>
                  <li>Appareils utilisés</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-[#EA4335] to-[#FBBC05] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-xl lg:text-3xl text-center mb-8">
              <h2 className="leading-snug font-bold">Protection de votre vie privée</h2>
            </div>
            <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-6">
              <div className="bg-white/90 backdrop-blur p-5 rounded-lg shadow-lg text-gray-800">
                <h3 className="text-lg lg:text-2xl font-semibold mb-3">Paramètres de confidentialité</h3>
                <p className="text-base lg:text-lg">
                  Utilisez les paramètres de confidentialité pour limiter la collecte de données.
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur p-5 rounded-lg shadow-lg text-gray-800">
                <h3 className="text-lg lg:text-2xl font-semibold mb-3">Gestion des données</h3>
                <p className="text-base lg:text-lg">
                  Réinitialisez, supprimez ou modifiez vos données personnelles via les paramètres de votre compte.
                </p>
              </div>
              <div className="bg-white/90 backdrop-blur p-5 rounded-lg shadow-lg text-gray-800">
                <h3 className="text-lg lg:text-2xl font-semibold mb-3">Navigation privée</h3>
                <p className="text-base lg:text-lg">
                  Utilisez des outils de navigation privée pour limiter le suivi en ligne.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-xl lg:text-3xl text-center mb-8">
              <h2 className="leading-snug font-bold">Comment gérer vos données</h2>
            </div>
            
      

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-[#4285F4]">Réinitialiser vos données</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Accédez à votre compte Google</li>
                  <li>Cliquez sur "Données et vie privée" à gauche</li>
                  <li>Faites défiler jusqu'à "Données des applis et services"</li>
                  <li>Sous "Télécharger ou supprimer", cliquez sur "Supprimer un service Google"</li>
                  <li>À côté de Gmail, cliquez sur "Supprimer"</li>
                  <li>Saisissez une adresse e-mail pour la validation</li>
                  <li>Validez votre nouvelle adresse en cliquant sur le lien reçu</li>
                </ol>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl lg:text-2xl font-semibold mb-4 text-[#4285F4]">Modifier vos données</h3>
                <p className="text-gray-700 mb-4">
                  Pour modifier vos données Gmail, accédez à votre compte Google et explorez les options disponibles dans la section "Données et vie privée".
                </p>
                <p className="text-gray-700 font-medium">
                  Conseils supplémentaires:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 mt-2">
                  <li>Vérifiez régulièrement vos autorisations d'applications</li>
                  <li>Désactivez la personnalisation des annonces</li>
                  <li>Supprimez votre historique de navigation périodiquement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
