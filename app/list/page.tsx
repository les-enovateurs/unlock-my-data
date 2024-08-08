"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Card from "../../components/Card";
import CookiesExplain from "@/components/CookiesExplain";
import { Data } from "./ListPageProps";
import SearchBar from "@/components/SearchBar";

const dataScores = [-1, 0, 1, 2, 3, 4, 5];

export default function List() {
  const [isReverseOrder, setIsReverseOrder] = useState(false);
  const [datasServices, setDatasServices] = useState<Data[]>([]);
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
      return isReverseOrder ? -order : order;
    });

  return (
    <section className="my-5 mx-4">
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
      <SearchBar />
      <div className="flex items-center gap-4 text-lg mt-4">
        <div className="flex gap-1">
          <Image width={45} height={45} src="/images/filter.svg" alt="filtre" />
        </div>
        <button
          onClick={toggleOrder}
          className={`font-semibold px-3 rounded-md ${
            isReverseOrder
              ? "text-blue underline underline-offset-4"
              : "text-black"
          }`}
        >
          Du meilleur score au plus mauvais
        </button>
        <button
          onClick={toggleOrder}
          className={`font-semibold px-3 rounded-md ${
            !isReverseOrder
              ? "text-blue underline underline-offset-4"
              : "text-black"
          }`}
        >
          Du plus mauvais score au meilleur
        </button>
      </div>
      <div className="flex flex-col items-center my-4 gap-4 md:flex-row md:flex-wrap">
        {sortedData.map((obj) => (
          <Card key={obj.id} {...obj} />
        ))}
      </div>
    </section>
  );
}
