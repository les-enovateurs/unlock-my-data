import Image from "next/image";
import Container from "./ui/Container";

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
  return (
    <section id="qqchiffres" className="min-h-screen">
    <Container>
      <div id="qqchiffres" className="flex flex-col h-full ">
        <div className="h-40vh flex justify-center items-center">
          <h2 className="title-section-blue ">Quelques chiffres</h2>
        </div>
        <div className="h-1/2">
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <div className="border-2 border-gray-400 shadow-md shadow-gray-300 md:w-1/2 w-full p-4 flex flex-col justify-center items-center">
            <span className="text-4xl md:text-5xl text-blue font-bold ">
              7600
            </span>
            <p className="text-lg md:text-xl text-center">
              cas de phishing signalés par les utilisateurs au cours du dernier
              trimestre.
            </p>
          </div>
          <div className="border-2 border-gray-400 shadow-md shadow-gray-300 md:w-1/2 w-full p-4 flex flex-col justify-center items-center">
            <p className="text-base md:text-xl flex items-start gap-2 mb-3 leading-tight">
              <Image
                src="/icons/phishing_blue.png"
                alt="phishing"
                width={50}
                height={50}
                className="rounded-full flex-shrink-0"
              />
              <span className="flex-1">
                Le phishing expose les utilisateurs au risque de vol
                d'informations sensibles telles que les identifiants de connexion
                et les données financières, pouvant entraîner des conséquences
                financières et une violation de la vie privée.
              </span>
            </p>
          </div>
        </div>
        <div className="h-6 w-6 md:hidden mx-auto my-4 rounded-full bg-blue"></div>
        <div className="flex flex-col md:flex-row  justify-center gap-4 mt-6">
          <div className="border-2 border-gray-400 shadow-md shadow-gray-300 w-full p-3 flex flex-col justify-center items-center">
            <span className="text-5xl text-blue font-bold ">
              32
            </span>
            <p className="text-xl text-center">
              millions d'utilisateurs protègent leurs mots de passe
            </p>
          </div>
          <div className="border-2 border-gray-400 shadow-md shadow-gray-300 w-full p-3 flex flex-col justify-center items-center">
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
        <div className="h-6 w-6 md:hidden mx-auto my-4 rounded-full bg-blue"></div>
        <div className="flex flex-col md:flex-row  justify-center gap-4 mt-6">
          <div className="border-2 border-gray-400 shadow-md shadow-gray-300 w-full p-3 flex flex-col justify-center items-center">
            <span className="text-5xl text-blue font-bold ">
              15 %
            </span>
            <p className="text-xl text-center">
              personnes vérifient les politiques de confidentialité avant de
              partager des données
            </p>
          </div>
          <div className="border-2 border-gray-400 shadow-md shadow-gray-300 w-full p-3 flex flex-col justify-center items-center">
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
        </div>
        {/* <section className="flex gap-4 mt-6"></section> */}
      </div>
      </Container>
    </section>
  );
}
