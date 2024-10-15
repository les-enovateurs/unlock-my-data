"use client";

// import Accroche from "@/components/Accroche";
// import Concept from "@/components/Concept";
// import FAQ from "@/components/Faq";
// import Features from "@/components/Features";
// import Score from "@/components/Score";
// import Stats from "@/components/Stats";
import Image from "next/image";
import { useEffect, useState } from "react";
import datas_picture from "/public/pictures/datas_picture.png";
import CookiesExplain from "@/components/CookiesExplain";
import Sheet from "@/components/Sheet";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <section className="my-6 px-4">
      <div
        className={`md:flex md:flex-row md:pb-12 transition-all duration-2000 ease-in-out transform ${
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-[10]"
        }`}
      >
        <div className="flex flex-col justify-center md:w-1/2">
          <h2 className="text-blue font-semibold text-3xl mb-5 md:text-4xl">
            Retrouvez votre e-liberté
          </h2>
          <p className="md:text-xl">
            L’Union Européenne a rendu le pouvoir aux internautes avec le RGPD
            (Règlement Général sur la Protection des Données). C’est le moment
            de s’en servir.
            <br />
            <br />
            Nous mettons ce pouvoir entre vos mains. Notre plateforme vous guide
            pas à pas pour récupérer, exporter et supprimer vos données
            personnelles auprès des entreprises qui les détiennent. Il est temps
            de dire adieu à la surveillance de masse, aux publicités ciblées
            intrusives et aux risques de sécurité liés à la dispersion de vos
            informations personnelles.
          </p>
        </div>
        <div className="md:flex md:items-center md:w-1/2">
          <Image
            src={datas_picture}
            alt="Illustration"
            className={`mx-auto transition-all duration-2000 ease-in-out transform ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col justify-center mb-6">
        <h2 className="text-blue font-semibold text-3xl mb-5 md:text-4xl">
          Unlock My Data vous montre le bon côté du RGPD.
        </h2>
        <p className="md:text-xl">
          Récupérez vos données facilement Vous avez accès à différentes
          informations, comme une note d’accessibilité de vos données allant de
          1 à 5. 5 étant la meilleure note. Ou les adresses mail et page du site
          pour accéder à vos données: les récupérer ou faire une demande de
          suppression.
          <br />
          Pour quelles raisons ?
          <br />
          Les données sont les nouvelles pépites d'or. Elles permettent
          d'apprendre énormément de choses sur vous :
        </p>
      </div>
      <Sheet />
      <div>
        <h2 className="text-blue font-semibold text-3xl my-5 md:text-4xl">
          Quelques chiffres
        </h2>
        <div className="flex justify-center gap-4">
          <div className="border-2 border-gray-400 shadow-md shadow-gray-300 w-1/3 p-3 flex flex-col justify-center items-center">
            <span className="text-5xl text-blue font-bold animate-pulse">
              7600
            </span>
            <p className="text-xl text-center">
              cas de phishing signalés par les utilisateurs au cours du dernier
              trimestre.
            </p>
          </div>
          <div className="border-2 border-gray-400 shadow-md shadow-gray-300 w-1/3 p-3 flex flex-col justify-center items-center">
            <p className="md:text-xl flex items-start gap-2 mb-3">
              <Image
                src="/icons/phishing_blue.png"
                alt="phishing"
                width={60}
                height={70}
                className="rounded-full"
              />
              Le phishing expose les utilisateurs au risque de vol
              d'informations sensibles telles que les identifiants de connexion
              et les données financières, pouvant entraîner des conséquences
              financières et une violation de la vie privée.
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <div className="border-2 border-gray-400 shadow-md shadow-gray-300 w-1/3 p-3 flex flex-col justify-center items-center">
            <span className="text-5xl text-blue font-bold animate-pulse">
              32
            </span>
            <p className="text-xl text-center">
              millions d'utilisateurs protègent leurs mots de passe
            </p>
          </div>
          <div className="border-2 border-gray-400 shadow-md shadow-gray-300 w-1/3 p-3 flex flex-col justify-center items-center">
            <p className="md:text-xl flex items-start gap-2 mb-3">
              <Image
                src="/icons/password_blue.png"
                alt="password"
                width={60}
                height={70}
                className="rounded-full"
              />
              Utilisez des mots de passe forts et uniques pour chaque compte en
              ligne, et envisagez d'activer l'authentification à deux facteurs
              pour une sécurité supplémentaire.
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <div className="border-2 border-gray-400 shadow-md shadow-gray-300 w-1/3 p-3 flex flex-col justify-center items-center">
            <span className="text-5xl text-blue font-bold animate-pulse">
              15 %
            </span>
            <p className="text-xl text-center">
              personnes vérifient les politiques de confidentialité avant de
              partager des données
            </p>
          </div>
          <div className="border-2 border-gray-400 shadow-md shadow-gray-300 w-1/3 p-3 flex flex-col justify-center items-center">
            <p className="md:text-xl flex items-start gap-2 mb-3">
              <Image
                src="/icons/datas.png"
                alt="datas"
                width={60}
                height={70}
                className="rounded-full"
              />
              Évitez de partager des informations sensibles, telles que votre
              numéro de sécurité sociale, votre mot de passe ou vos données
              bancaires, sur des sites Web non sécurisés ou avec des personnes
              non autorisées.
            </p>
          </div>
        </div>
        <section className="flex gap-4 mt-6"></section>
      </div>
      <CookiesExplain />
      {/* <Accroche/> */}
      {/* <Stats /> */}
      {/*   <Concept/>*/}
      {/* <Features/> */}
      {/* <Score/>  */}
      {/* <FAQ/>  */}
    </section>
  );
}
