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
  // const [dimensions, setDimensions] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // const [dimensions2, setDimensions2] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // const [dimensions3, setDimensions3] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // useEffect(() => {
  //   function handleResize() {
  //     // Update the state or perform any other actions when the
  //     // browser is resized
  //     if (targetRef.current) {
  //       console.log(
  //         "targetRef",
  //         targetRef.current.offsetWidth,
  //         targetRef.current.offsetWidth
  //       );
  //       setDimensions({
  //         width: targetRef.current.offsetWidth,
  //         height: targetRef.current.offsetHeight,
  //       });
  //     }
  //     if (targetRef2.current) {
  //       setDimensions2({
  //         width: targetRef2.current.offsetWidth,
  //         height: targetRef2.current.offsetHeight,
  //       });
  //     }
  //     if (targetRef3.current) {
  //       setDimensions3({
  //         width: targetRef3.current.offsetWidth,
  //         height: targetRef3.current.offsetHeight,
  //       });
  //     }
  //   }

  //   // Attach the event listener to the window object
  //   window.addEventListener("resize", handleResize);

  //   // Remove the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  // useLayoutEffect(() => {
  //   if (targetRef.current) {
  //     console.log(
  //       "targetRef",
  //       targetRef.current.offsetWidth,
  //       targetRef.current.offsetWidth
  //     );
  //     setDimensions({
  //       width: targetRef.current.offsetWidth,
  //       height: targetRef.current.offsetHeight,
  //     });
  //   }
  //   if (targetRef2.current) {
  //     setDimensions2({
  //       width: targetRef2.current.offsetWidth,
  //       height: targetRef2.current.offsetHeight,
  //     });
  //   }
  //   if (targetRef3.current) {
  //     setDimensions3({
  //       width: targetRef3.current.offsetWidth,
  //       height: targetRef3.current.offsetHeight,
  //     });
  //   }
  // }, []);

  return (
    <>
      <section id="qqchiffres" className="min-h-150">
        <Container>
          <div className="mb-8 pt-12 h-full flex flex-col">
            {/* <div className="h-40vh flex justify-center items-center">
          <h2 className="title-section-blue ">Quelques chiffres</h2>
        </div> */}
            <div className="h-1/3 flex justify-center items-center">
              <h2 className="title-section-blue">Quelques chiffres</h2>
            </div>
            <div className="h-1/2">
              <div className="flex flex-col md:flex-row justify-center gap-4 ">
                <div
                  ref={targetRef}
                  className="relative rounded-lg   shadow-md shadow-gray-300 md:w-1/2 w-full p-4 flex flex-col justify-center items-center"
                >
                  <span className="text-4xl text-texteBlack md:text-5xl text-blue font-bold pb-2 z-20">
                    7600
                  </span>
                  <p className="text-lg md:text-xl text-center text-beige z-20">
                    cas de phishing signalés par les utilisateurs au cours du
                    dernier trimestre.
                  </p>
                  <Border rref={targetRef.current} />
                </div>
                <div className="relative rounded-lg  shadow-md shadow-gray-300 md:w-1/2 w-full p-4 flex flex-col justify-center items-center">
                  <p className="text-base md:text-xl flex items-start gap-2 mb-3 leading-tight">
                    <MdPhishing
                      className="text-beige flex-shrink-0 z-20"
                      size={50}
                    />
                    <span className="pl-4 flex-1 text-blue z-20 text-texteBlack">
                      Le phishing expose les utilisateurs au risque de vol
                      d'informations sensibles telles que les identifiants de
                      connexion et les données financières, pouvant entraîner
                      des conséquences financières et une violation de la vie
                      privée.
                    </span>
                  </p>
                  <Border
                    icone={true}
                    rref={targetRef.current}
                  />
                </div>
              </div>
              <div className="h-6 w-6 md:hidden mx-auto my-4 rounded-full bg-blue"></div>
              <div className="flex flex-col md:flex-row  justify-center gap-4 mt-6">
                <div
                  ref={targetRef2}
                  className="relative  rounded-lg  shadow-md shadow-gray-300 w-full p-3 flex flex-col justify-center items-center"
                >
                  <span className="text-texteBlack text-5xl text-blue font-bold pb-2 z-20">
                    32
                  </span>
                  <p className="text-xl text-center text-beige z-20">
                    millions d'utilisateurs protègent leurs mots de passe
                  </p>
                  <Border rref={targetRef2.current} />
                </div>
                <div className="relative  rounded-lg  shadow-md shadow-gray-300 w-full p-3 flex flex-col justify-center items-center">
                  <p className="md:text-xl flex items-start gap-2 mb-3 text-blue z-20">
                    <RiLockPasswordLine
                      className="text-beige flex-shrink-0"
                      size={50}
                    />
                    <span className="pl-4 flex-1 text-blue text-texteBlack">
                      Utilisez des mots de passe forts et uniques pour chaque
                      compte en ligne, et envisagez d'activer l'authentification
                      à deux facteurs pour une sécurité supplémentaire.
                    </span>
                  </p>
                  <Border
                    icone={true}
                    rref={targetRef2.current}
                  />
                </div>
              </div>
              <div className="h-6 w-6 md:hidden mx-auto my-4 rounded-full bg-blue"></div>
              <div className="flex flex-col md:flex-row  justify-center gap-4 mt-6">
                <div
                  ref={targetRef3}
                  className="relative  border-blue shadow-md shadow-gray-300 w-full p-3 flex flex-col justify-center items-center"
                >
                  <span className="text-5xl text-texteBlack font-bold pb-2 z-20">
                    15 %
                  </span>
                  <p className="text-xl text-center text-beige z-20">
                    personnes vérifient les politiques de confidentialité avant
                    de partager des données
                  </p>
                  <Border rref={targetRef3.current} />
                </div>
                <div className="relative   rounded-lg border-blue shadow-md shadow-gray-300 w-full p-3 flex flex-col justify-center items-center">
                  <p className="md:text-xl flex items-start gap-2 mb-3 text-blue z-20">
                    <MdOutlineSecurity
                      className="text-beige flex-shrink-0"
                      size={50}
                    />
                    <p className="px-4">
                      <span className="pl-4 flex-1 text-blue text-texteBlack">
                        Évitez de partager des informations sensibles, telles
                        que votre numéro de sécurité sociale, votre mot de passe
                        ou vos données bancaires, sur des sites Web non
                        sécurisés ou avec des personnes non autorisées.
                      </span>
                    </p>
                  </p>
                  <Border rref={targetRef3.current} icone={true} />
                  
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
