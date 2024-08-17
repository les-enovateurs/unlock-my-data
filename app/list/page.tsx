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

  const toggleOrder = () => {
    setIsReverseOrder(!isReverseOrder);
  };

  useEffect(() => {
    fetch("/data/services.json")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
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
    const nameSiteCapitalize =
      nameSite.charAt(0).toUpperCase() + nameSite.slice(1);
    const matchedSite = sortedData.filter((data) =>
      data.name.includes(nameSiteCapitalize)
    );

    if (matchedSite && cardRefs.current[matchedSite[0].id]) {
      cardRefs.current[matchedSite[0].id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        // inline: "nearest"
      });
    }
  };
  return (
    <section className="my-6 px-4">
      <div>
        <div>
          <h2 className="text-blue font-semibold text-3xl mb-2">
            Informations sur la Protection et l'Accessibilité des Données
          </h2>
          <p className="text-lg">
            Découvrez des informations clés sur la protection et l'accessibilité
            des données de chaque site, y compris la situation géographique, des
            scores de sécurité et d'accessibilité, les contacts pour la
            suppression de données, les dernières violations, et l'utilisation
            des cookies.
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            width={300}
            height={300}
            src="/images/datas_picture.png"
            alt="Illustration"
          />
        </div>
      </div>
      <CookiesExplain />
      <SearchBar
        nameSite={nameSite}
        setNameSite={setNameSite}
        findSite={findsite}
      />
      <div className="flex items-center gap-2 text-lg mt-4 md:gap-4">
        <div className="flex gap-1">
          <Image width={45} height={45} src="/images/filter.svg" alt="filtre" />
        </div>
        <button
          onClick={toggleOrder}
          className={`font-semibold px-1 rounded-md ${
            !isReverseOrder
              ? "text-blue underline underline-offset-4"
              : "text-black"
          }`}
        >
          Du meilleur score au plus mauvais
        </button>
        <button
          onClick={toggleOrder}
          className={`font-semibold px-1 rounded-md ${
            isReverseOrder
              ? "text-blue underline underline-offset-4"
              : "text-black"
          }`}
        >
          Du plus mauvais score au meilleur
        </button>
      </div>
      <div className="flex flex-col items-center my-8 gap-4 md:flex-row md:flex-wrap">
        {sortedData.map((obj) => (
          <div key={obj.id} ref={(el) => (cardRefs.current[obj.id] = el)}>
            <Card key={obj.id} {...obj} />
          </div>
        ))}
      </div>
    </section>
  );
}
