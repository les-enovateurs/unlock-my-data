import Image from "next/image";
import Container from "./ui/Container";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import { MdPhishing } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import Border from "./ui/Border";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
export default function QuelquesChiffres() {
  const chiffres = [
    {
      chiffre: "7600",
      subtext:
        "cas de phishing signalés par les utilisateurs au cours du dernier trimestre.",
      description:
        "Le phishing expose les utilisateurs au risque de vol d'informations sensibles telles que les identifiants de connexion et les données financières, pouvant entraîner des conséquences financières et une violation de la vie privée.",
    },
    {
      chiffre: "32",
      description: "millions d'utilisateurs protègent leurs mots de passe",
    },
    {
      chiffre: "15%",
      description:
        "personnes vérifient les politiques de confidentialité avant de partager des données",
    },
  ];
  const targetRef = useRef<HTMLDivElement>(null);
  const targetRef2 = useRef<HTMLDivElement>(null);
  const targetRef3 = useRef<HTMLDivElement>(null);
  const targetRef4 = useRef<HTMLDivElement>(null);
  const targetRef5 = useRef<HTMLDivElement>(null);
  const targetRef6 = useRef<HTMLDivElement>(null);

  return (
    <>
      <section id="qqchiffres" className="min-h-150">
        <Container>
          <div className="mb-8 pt-2 h-full flex flex-col">
         
            <div className="h-1/4 flex justify-center items-center">
              <h2 className="title-section">Quelques chiffres</h2>
            </div>
            <div className="h-1/2">
              <div className="flex flex-col md:flex-row justify-center gap-4 ">
                <div
                  ref={targetRef}
                  className="relative bg-color1  shadow-md shadow-gray-300 md:w-1/2 w-full p-4 flex flex-col justify-center items-center"
                >
                  <span className="text-4xl text-color4 md:text-5xl text-blue font-bold pb-2 z-20">
                    7600
                  </span>
                  <p className="text-lg md:text-xl  text-center text-color4 z-20">

                    cas de phishing signalés par les utilisateurs au cours du
                    dernier trimestre.
                  </p>
                  {/* <Border rref={targetRef.current} /> */}
                </div>
                <div
                  ref={targetRef2}
                  className="relative bg-color1  shadow-md shadow-gray-300 md:w-1/2 w-full p-4 flex flex-col justify-center items-center"
                >
                  <div className="text-base md:text-xl flex items-start gap-2 mb-3 leading-tight">
                    <MdPhishing

                      className="text-color4 flex-shrink-0 z-20"
                      size={50}
                    />
                    <span className="pl-4 flex-1 z-20 text-color4">
                      Le phishing expose les utilisateurs au risque de vol
                      d'informations sensibles telles que les identifiants de
                      connexion et les données financières, pouvant entraîner
                      des conséquences financières et une violation de la vie
                      privée.

                    </span>
                  </div>
                  {/* <Border icone={true} rref={targetRef2.current} /> */}
                </div>
              </div>
              <div className="h-6 w-6 md:hidden mx-auto my-4 rounded-full bg-blue"></div>
              <div className="flex flex-col md:flex-row  justify-center gap-4 mt-6">
                <div
                  ref={targetRef3}
                  className="relative bg-color1   shadow-md shadow-gray-300 w-full p-3 flex flex-col justify-center items-center"
                >
                  <span className="text-color4 text-5xl text-blue font-bold pb-2 z-20">
                    32
                  </span>
                  <p className="text-xl text-center text-color4 z-20">

                    millions d'utilisateurs protègent leurs mots de passe
                  </p>
                  {/* <Border rref={targetRef3.current} /> */}
                </div>
                <div
                  ref={targetRef4}
                  className="relative bg-color1    shadow-md shadow-gray-300 w-full p-3 flex flex-col justify-center items-center"
                >
                  <div className="md:text-xl  flex items-start gap-2 mb-3 text-color4 z-20">
                    <RiLockPasswordLine
                      className="text-color4 flex-shrink-0"
                      size={50}

                    />
                    <span className="pl-4 flex-1  text-color4">
                      Utilisez des mots de passe forts et uniques pour chaque
                      compte en ligne, et envisagez d'activer l'authentification
                      à deux facteurs pour une sécurité supplémentaire.

                    </span>
                  </div>
                  {/* <Border icone={true} rref={targetRef4.current} /> */}
                </div>
              </div>
              <div className="h-6 w-6 md:hidden mx-auto my-4 rounded-full bg-blue"></div>
              <div className="flex flex-col md:flex-row  justify-center gap-4 mt-6">
                <div
                  ref={targetRef5}
                  className="relative bg-color1  border-blue shadow-md shadow-gray-300 w-full p-3 flex flex-col justify-center items-center"
                >
                  <span className="text-5xl text-color4  font-bold pb-2 z-20">
                    15 %
                  </span>
                  <p className="text-xl text-center text-color4 z-20">
                    personnes vérifient les politiques de confidentialité avant
                    de partager des données
                  </p>
                  {/* <Border rref={targetRef5.current} /> */}
                </div>
                <div
                  ref={targetRef6}
                  className="relative bg-color1  shadow-md shadow-gray-300 w-full p-3 flex flex-col justify-center items-center"
                >
                  <div className="md:text-xl flex items-start gap-2 mb-3 text-blue z-20">
                    <MdOutlineSecurity
                      className="text-color4 flex-shrink-0"
                      size={50}
                    />
                    <p className="px-4">
                      <span className="pl-4 flex-1 text-color4 text-4">
                        Évitez de partager des informations sensibles, telles
                        que votre numéro de sécurité sociale, votre mot de passe
                        ou vos données bancaires, sur des sites Web non
                        sécurisés ou avec des personnes non autorisées.
                      </span>
                    </p>
                  </div>
                  {/* <Border rref={targetRef6.current} icone={true} /> */}
                </div>
              </div>
            </div>
            {/* <section className="flex gap-4 mt-6"></section> */}
          </div>
        </Container>
      </section>
    </>
  );
}
interface LoupeProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
}
function Loupe({
  size = 24,
  strokeWidth = 2,
  color = "currentColor",
}: LoupeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cercle de la loupe */}
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Manche de la loupe */}
      <line
        x1="16.4142"
        y1="16.4142"
        x2="20.6569"
        y2="20.6569"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
