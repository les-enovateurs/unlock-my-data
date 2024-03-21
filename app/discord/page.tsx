import Link from "next/link";
import Image from 'next/image';
import logoDiscord from '/public/images/Discord_logo.svg';
import logoJustice from '/public/images/justice.svg';
import logoMenottes from '/public/images/cuffs.svg';

export default function Discord() {
  return (
    <>
      <section className="flex flex-col py-8 lg:flex-row lg:justify-center items-center lg:h-96 lg:gap-x-20 bg-slate-100 text-black">
        <Image alt="Logo de Discord" src={logoDiscord} />
        <div className={"w-full text-3xl lg:text-5xl lg:w-1/3 text-center rounded-xl bg-white py-6 outline outline-[#5d66f6] -outline-offset-8"}>
          <h1 className={"leading-snug"}>Comment protéger vos données personnelles sur l&apos;application Discord ?</h1>
        </div>
      </section>

      <section className="flex flex-col justify-evenly items-center py-6 gap-y-6 lg:py-0 lg:h-96 bg-[#5d66f6]">
        <div className={"text-2xl text-center text-white lg:text-5xl lg:w-2/3"}>
          <h2 className={"leading-snug font-semibold"}>Quelles sont les données collectées par Discord ?</h2>
        </div>
        <div className="flex flex-col items-center justify-center gap-y-6 lg:flex-row lg:gap-x-6 lg:items-stretch text-center">
          <div className="flex flex-col h-36 w-11/12 justify-evenly border-slate-400 bg-slate-100 rounded-lg px-4 text-black lg:w-1/4 lg:h-52">
            <h3 className={"text-xl lg:text-3xl font-semibold"}>Données liées au compte</h3>
            <div className="text-lg rounded-lg lg:text-2xl">
              Email, pseudo, date de naissance, liste d&apos;amis, adresse IP, type d&apos;appareil, ...
            </div>
          </div>

          <div className="flex flex-col h-36 w-11/12 justify-evenly border-slate-400 bg-slate-100 rounded-lg px-4 text-black lg:w-1/4 lg:h-52">
            <h3 className={"text-xl lg:text-3xl font-semibold"}>Données d&apos;activités</h3>
            <div className="text-lg rounded-lg lg:text-2xl">
              Abonnement Nitro, navigation dans l&apos;application, comptes de jeux liés, ...
            </div>
          </div>

          <div className="flex flex-col h-36 w-11/12 justify-evenly border-slate-400 bg-slate-100 rounded-lg px-4 text-black lg:w-1/4 lg:h-52">
            <h3 className={"text-xl lg:text-3xl font-semibold"}>Données de conversations</h3>
            <div className="text-lg rounded-lg lg:text-2xl">
              Vos messages envoyés et visibles sur les serveurs, groupes ou discussions privées
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-evenly items-center py-6 gap-y-6 lg:py-0 lg:h-96 bg-slate-100 text-black">
        <div className={"text-2xl text-center lg:text-5xl lg:w-2/3 text-[#5d66f6]"}>
          <h2 className={"leading-snug font-semibold"}>Quelles sont les finalités de cette collecte de données ?</h2>
        </div>
        <div className="flex flex-col items-center justify-center text-lg text-center gap-y-6 lg:flex-row lg:gap-x-6">
          <div className="w-11/12 text-lg py-8 px-4 my-auto border-slate-400 bg-indigo-100 rounded-lg lg:w-1/4 lg:text-2xl">
            Permettre l&apos;utilisation et le fonctionnement de l&apos;application
          </div>
          <div className="w-11/12 text-lg py-8 px-4 my-auto border-slate-400 bg-indigo-100 rounded-lg lg:w-1/4 lg:text-2xl">
            Améliorer continuellement les fonctionnalités de l&apos;application
          </div>
          <div className="w-11/12 text-lg py-8 px-4 my-auto border-slate-400 bg-indigo-100 rounded-lg lg:w-1/4 lg:text-2xl">
            Personnaliser l&apos;expérience utilisateur pour correspondre à ses besoins
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-y-6 justify-center items-center py-8 bg-[#5d66f6] text-black lg:py-12 lg:gap-x-20 lg:flex-row">
        <div className={"w-11/12 lg:w-1/3 text-center rounded-xl bg-white py-6 outline outline-[#5d66f6] -outline-offset-8"}>
          <h2 className={"text-2xl lg:text-5xl leading-snug px-3"}>Quelles démarches pouvez-vous entâmer pour vous protéger ?</h2>
        </div>
        <div className="flex flex-col gap-y-4 w-5/6 lg:w-1/3">
          <div className={"bg-white rounded-xl p-6 outline outline-[#5d66f6] -outline-offset-8"}>
            <h3 className="text-xl lg:text-4xl font-semibold">Faites le tri !</h3>
            <p className="text-lg lg:text-xl mt-3">Faites un tour dans vos serveurs, conversations et groupes et supprimez les messages datant de 1 ou 2 ans. Vous pouvez aussi quitter les groupes et serveurs inactifs.</p>
          </div>
          <div className={"bg-white rounded-xl p-6 outline outline-[#5d66f6] -outline-offset-8"}>
           <h3 className="text-xl lg:text-4xl font-semibold">Demander un &quot;pack de données&quot;</h3>
           <p className="text-lg lg:text-xl mt-3">Rendez vous dans les paramètres de confidentialité du logiciel et faites une demande pour voir les données que Discord possède sur vous</p>
          </div>
          <div className={"bg-white rounded-xl p-6 outline outline-[#5d66f6] -outline-offset-8"}>
           <h3 className="text-xl lg:text-4xl font-semibold">Désactiver les collectes facultatives</h3>
           <p className="text-lg lg:text-xl mt-3">Allez dans les paramètres de confidentialité du logiciel et décochez les options de collecte de personnalisation et d&apos;amélioration</p>
          </div>        
        </div>
      </section>

      <section className="flex flex-col justify-evenly items-center py-6 gap-y-6 bg-rose-50 text-black">
        <div className={"text-2xl text-center lg:text-5xl lg:w-5/6"}>
          <div className="w-max mx-auto border-4 border-red-500 rounded-full p-4">
            <Image alt="Logo de la justice" src={logoJustice} width={80} height={80} />
          </div>
          <h2 className={"leading-snug font-semibold mt-2"}>Discord a-t-il déjà été sanctionné par la justice concernant le RGPD ?</h2>
        </div>

        <div className="flex flex-col-reverse gap-y-6 justify-center items-center pt-4 text-black lg:py-12 lg:gap-x-20 lg:flex-row">
          <div className="flex flex-col gap-y-4 w-5/6 lg:w-1/3">
            <div className={"bg-white rounded-xl p-6 outline outline-red-500 -outline-offset-8"}>
              <p className="text-xl lg:text-3xl font-semibold">Durée et sécurité de la conservation des données illicites</p>
            </div>
            <div className={"bg-white rounded-xl p-6 outline outline-red-500 -outline-offset-8"}>
              <p className="text-xl lg:text-3xl font-semibold">Application ne respectant pas le &quot;Privacy By Design&quot;</p>
            </div>
            <div className={"bg-white rounded-xl p-6 outline outline-red-500 -outline-offset-8"}>
              <p className="text-xl lg:text-3xl font-semibold">Utilisateurs mal informés concernant l&apos;utilisation de leurs données</p>
            </div>
          </div>
          <div className={"w-11/12 lg:w-1/4 text-center rounded-xl bg-white py-6 outline outline-red-500 -outline-offset-8"}>
            <div className="w-max mx-auto border-2 border-red-500 rounded-full p-4">
              <Image alt="Logo de menottes" src={logoMenottes} width={60} height={60} />
            </div>
            <h2 className={"text-2xl lg:text-7xl leading-snug px-3"}>2022</h2>
          </div>
        </div>
        <div className={"text-center lg:w-5/6"}>
          <p className="text-xl leading-snug font-semibold lg:text-4xl">
            Pour ces infractions, Discord s&apos;est vu infliger une amende de 800 000€ 
          </p>
          <p className="text-lg mt-2 font-semibold lg:text-2xl">
            Plus d&apos;informations sur <Link href={"https://www.cnil.fr/fr/sanction-de-800-000-euros-lencontre-de-la-societe-discord-inc"} prefetch={false} target="_blank" className="text-red-500">le site de la CNIL</Link>
          </p>
        </div>
      </section>
    </>
  );
}