import Link from "next/link";
import Image from 'next/image';
import logoDiscord from '/public/pictures/Discord-logo.svg';
import logoJustice from '/public/pictures/justice.svg';
import logoMenottes from '/public/pictures/cuffs.svg';

export default function Discord() {
  return (
    <>
      <section className="flex flex-col py-16 items-center bg-gradient-to-br from-[#5d66f6] to-[#4850c9] text-white lg:flex-row lg:justify-center lg:min-h-96 lg:gap-x-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-between gap-12">
              <Image 
                alt="Logo de Discord" 
                src={logoDiscord}
                className="filter brightness-0 invert w-48 lg:w-64"
              />
              <h1 className="text-2xl lg:text-4xl font-bold leading-tight text-center">
                Comment protéger vos données personnelles sur Discord ?
              </h1>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-xl lg:text-3xl text-center mb-8">
              <h2 className={"leading-snug font-bold"}>Quelles sont les données collectées par Discord ?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-base-200 p-6 rounded-lg shadow-lg">
                <h3 className={"text-xl lg:text-2xl font-semibold mb-3"}>Données liées au compte</h3>
                <p className="text-gray-600">
                  Email, pseudo, date de naissance, liste d&apos;amis, adresse IP, type d&apos;appareil, ...
                </p>
              </div>
              
              <div className="bg-base-200 p-6 rounded-lg shadow-lg">
                <h3 className={"text-xl lg:text-2xl font-semibold mb-3"}>Données d&apos;activités</h3>
                <p className="text-gray-600">
                  Abonnement Nitro, navigation dans l&apos;application, comptes de jeux liés, ...
                </p>
              </div>

              <div className="bg-base-200 p-6 rounded-lg shadow-lg">
                <h3 className={"text-xl lg:text-2xl font-semibold mb-3"}>Données de conversations</h3>
                <p className="text-gray-600">
                  Vos messages envoyés et visibles sur les serveurs, groupes ou discussions privées
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-xl lg:text-3xl text-center mb-8">
              <h2 className={"leading-snug font-bold"}>Pour quelles usages ?</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-indigo-50 p-6 rounded-lg shadow-lg">
                Permettre l&apos;utilisation et le fonctionnement de l&apos;application
              </div>
              <div className="bg-indigo-50 p-6 rounded-lg shadow-lg">
                Améliorer continuellement les fonctionnalités de l&apos;application
              </div>
              <div className="bg-indigo-50 p-6 rounded-lg shadow-lg">
                Personnaliser l&apos;expérience utilisateur pour correspondre à ses besoins
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-y-6 justify-center items-center py-8 bg-gradient-to-br from-[#5d66f6] to-[#4850c9] text-black lg:py-12 lg:gap-x-20 lg:flex-row">
        <div className={"w-11/12 text-center rounded-xl font-extrabold text-white text-xl px-3 lg:text-4xl lg:w-5/12"}>
          Quelles démarches pouvez-vous entâmer pour vous&nbsp;protéger&nbsp;?
        </div>
        <div className="flex flex-col gap-y-4 w-5/6 lg:w-1/3">
          <div className={"bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg"}>
            <h3 className="text-lg lg:text-2xl font-semibold">Faites le tri !</h3>
            <p className="text-base lg:text-lg mt-2">Faites un tour dans vos serveurs, conversations et groupes et supprimez les messages datant de 1 ou 2 ans. Vous pouvez aussi quitter les groupes et serveurs inactifs.</p>
          </div>
          <div className={"bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg"}>
           <h3 className="text-lg lg:text-2xl font-semibold">Demander un &quot;pack de données&quot;</h3>
           <p className="text-base lg:text-lg mt-2">Rendez vous dans les paramètres de confidentialité du logiciel et faites une demande pour voir les données que Discord possède sur vous</p>
          </div>
          <div className={"bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg"}>
           <h3 className="text-lg lg:text-2xl font-semibold">Désactiver les collectes facultatives</h3>
           <p className="text-base lg:text-lg mt-2">Allez dans les paramètres de confidentialité du logiciel et décochez les options de collecte de personnalisation et d&apos;amélioration</p>
          </div>        
        </div>
      </section>

      <section className="flex flex-col justify-evenly items-center py-16 gap-y-6 bg-rose-50 text-black">
        <div className={"text-xl text-center lg:text-3xl lg:w-5/6"}>
          <div className="w-max mx-auto border-4 border-red-500 rounded-full p-4">
            <Image alt="Logo de la justice" src={logoJustice} width={60} height={60} />
          </div>
          <h2 className={"leading-snug font-semibold mt-2 mx-3"}>Discord a-t-il déjà été sanctionné par la justice concernant le RGPD ?</h2>
        </div>

        <div className="flex flex-col-reverse gap-y-6 justify-center items-center pt-4 text-black lg:py-8 lg:gap-x-20 lg:flex-row">
          <div className="flex flex-col gap-y-4 w-5/6 lg:w-1/3">
            <div className={"bg-white rounded-xl p-4 outline outline-red-500 -outline-offset-8"}>
              <p className="text-lg lg:text-2xl font-semibold">Durée et sécurité de la conservation des données illicites</p>
            </div>
            <div className={"bg-white rounded-xl p-4 outline outline-red-500 -outline-offset-8"}>
              <p className="text-lg lg:text-2xl font-semibold">Application ne respectant pas le &quot;Privacy By Design&quot;</p>
            </div>
            <div className={"bg-white rounded-xl p-4 outline outline-red-500 -outline-offset-8"}>
              <p className="text-lg lg:text-2xl font-semibold">Utilisateurs mal informés concernant l&apos;utilisation de leurs données</p>
            </div>
          </div>
          <div className={"w-11/12 lg:w-1/4 text-center rounded-xl bg-white py-4 outline outline-red-500 -outline-offset-8"}>
            <div className="w-max mx-auto border-2 border-red-500 rounded-full p-3">
              <Image alt="Logo de menottes" src={logoMenottes} width={40} height={40} />
            </div>
            <h2 className={"text-2xl lg:text-5xl leading-snug px-3"}>2022</h2>
          </div>
        </div>
        <div className={"text-center lg:w-5/6"}>
          <p className="text-lg lg:text-2xl leading-snug font-semibold">
            Pour ces infractions, Discord s&apos;est vu infliger une amende de 800 000€ 
          </p>
          <p className="text-base mt-2 font-semibold lg:text-lg">
            Plus d&apos;informations sur <Link href={"https://www.lemonde.fr/pixels/article/2022/11/17/la-cnil-inflige-a-discord-une-amende-de-800-000-euros_6150300_4408996.html"} prefetch={false} target="_blank" className="text-red-500">le site de la CNIL</Link>
          </p>
        </div>
      </section>
    </>
  );
}