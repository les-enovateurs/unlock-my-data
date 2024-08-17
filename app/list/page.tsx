"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Card from "../../components/Card";
import CookiesExplain from "@/components/CookiesExplain";
import { Data } from "./ListPageProps";
import SearchBar from "@/components/SearchBar";

const dataScores = [-1, 0, 1, 2, 3, 4, 5];

export default function List() {
  const [nameSite, setNameSite] = useState("");
  const [isReverseOrder, setIsReverseOrder] = useState(false);
  const [datasServices, setDatasServices] = useState<Data[]>([]);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [errorMessage, setErrorMessage] = useState(false);

  const toggleOrder = () => {
    setIsReverseOrder(!isReverseOrder);
  };

  useEffect(() => {
    fetch("/data/services.json")
      .then((response) => response.json())
      .then((data) => {
        setDatasServices(data);
      });
  }, []);

  const sortedData = datasServices
    .filter((data) => dataScores.includes(data.score))
    .sort((a, b) => {
      const order = dataScores.indexOf(a.score) - dataScores.indexOf(b.score);
      return isReverseOrder ? order : -order;
    });

  const findsite = () => {
    const nameSiteCapitalize = nameSite.toLowerCase();

    const matchedSite = sortedData.filter((data) =>
      data.name.toLowerCase().includes(nameSiteCapitalize)
    );

    if (
      !matchedSite ||
      matchedSite.length === 0 ||
      !cardRefs.current[matchedSite[0].id]
    ) {
      setErrorMessage(true);
      setTimeout(() => {
        setErrorMessage(false);
      }, 4000);
    } else if (matchedSite && cardRefs.current[matchedSite[0].id]) {
      cardRefs.current[matchedSite[0].id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        // inline: "nearest"
      });
      setNameSite("");
    }
  };
  return (
    <section className="my-6 px-4">
      <div>
        <h2 className="text-blue font-semibold text-3xl mb-5 md:text-5xl lg:w-4/5">
          Informations sur la Protection et l'Accessibilité des Données
        </h2>
        <div className="flex flex-col justify-center md:flex-row md:gap-8">
          <p className="my-auto md:text-xl">
            Découvrez des informations clés sur la protection et l'accessibilité
            des données de chaque site, y compris la situation géographique, des
            scores de sécurité et d'accessibilité, les contacts pour la
            suppression de données, les dernières violations, et l'utilisation
            des cookies.
          </p>
          <Image
            width={300}
            height={300}
            src="/images/datas_picture.png"
            alt="Illustration"
            className="mx-auto"
          />
        </div>
      </div>
      <CookiesExplain />
      <SearchBar
        nameSite={nameSite}
        setNameSite={setNameSite}
        findSite={findsite}
      />
      {errorMessage && (
        <p className="text-xl text-red-500 font-semibold">Site non référencé</p>
      )}
      <div className="flex items-center gap-2 text-lg pt-4 md:gap-4">
        <div className="flex gap-1">
          <Image width={35} height={35} src="/images/filter.svg" alt="filtre" />
        </div>
        <button
          onClick={toggleOrder}
          className={`font-semibold text-lg px-1 rounded-md md:text-xl ${
            !isReverseOrder
              ? "text-blue underline underline-offset-4"
              : "text-black"
          }`}
        >
          Du meilleur score au plus mauvais
        </button>
        <button
          onClick={toggleOrder}
          className={`font-semibold text-lg px-1 rounded-md md:text-xl ${
            isReverseOrder
              ? "text-blue underline underline-offset-4"
              : "text-black"
          }`}
        >
          Du plus mauvais score au meilleur
        </button>
      </div>
      <div className="flex flex-col items-center my-16 gap-4 md:flex-row md:flex-wrap md:justify-center md:px-auto md:my-8">
        {sortedData.map((obj) => (
          <div key={obj.id} ref={(el) => (cardRefs.current[obj.id] = el)}>
            <Card key={obj.id} {...obj} />
          </div>
        ))}
      </div>
    </section>
  );
}
