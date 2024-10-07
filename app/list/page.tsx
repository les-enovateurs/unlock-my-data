"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Card from "../../components/Card";
import { Data } from "./ListPageProps";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import ListSitefound from "@/components/ListSitefound";

const dataScores = [-1, 0, 1, 2, 3, 4, 5];

export default function List() {
  const [nameSite, setNameSite] = useState("");
  const [isReverseOrder, setIsReverseOrder] = useState(false);
  const [datasServices, setDatasServices] = useState<Data[]>([]);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [errorMessage, setErrorMessage] = useState(false);
  const [sitesfound, setSitesFound] = useState<Data[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9; 

  const toggleOrder = () => {
    setIsReverseOrder(!isReverseOrder);
  };

  const sortedData = datasServices
    .filter((data) => dataScores.includes(data.score))
    .sort((a, b) => {
      const order = dataScores.indexOf(a.score) - dataScores.indexOf(b.score);
      return isReverseOrder ? order : -order;
    });

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const displayedCards = sortedData.slice(startIndex, endIndex);

  useEffect(() => {
    fetch("/data/services.json")
      .then((response) => response.json())
      .then((data) => {
        setDatasServices(data);
      });
  }, []);

  const getPageForSite = (siteId: number) => {
    const index = sortedData.findIndex((data) => data.id === siteId);
    if (index === -1) return 1;
    return Math.floor(index / cardsPerPage) + 1;
  };

  const findsite = (nameSite: string) => {
    if (nameSite.length < 3) {
      setSitesFound([]);
      setErrorMessage(false);
      return;
    }

    const nameSiteCapitalize = nameSite.toLowerCase();

    const isMatch = (siteName: string, searchQuery: string) => {
      return siteName.toLowerCase().includes(searchQuery.toLowerCase());
    };

    const matchedSite = sortedData.filter((data) =>
      isMatch(data.name, nameSiteCapitalize)
    );

    setSitesFound(matchedSite);

    if (!matchedSite || matchedSite.length === 0) {
      setErrorMessage(true);
    }
  };
  return (
    <section className="my-6 px-4">
      <SearchBar
        nameSite={nameSite}
        setNameSite={setNameSite}
        findSite={findsite}
      />
      <ListSitefound
        sitesfound={sitesfound}
        getPageForSite={getPageForSite}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cardRefs={cardRefs}
        setNameSite={setNameSite}
        setSitesFound={setSitesFound}
        setErrorMessage={setErrorMessage}
      />
      {errorMessage && <div className="text-red-500">Site non référencé.</div>}
      <div className="flex items-center gap-2 text-lg pt-8 md:gap-4">
        <div className="flex gap-1">
          <Image width={30} height={30} src="/icons/filter.svg" alt="filtre" />
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
      <div className="flex flex-col items-center my-16 gap-6 md:flex-row md:flex-wrap md:justify-center md:gap-10 md:px-auto md:my-8">
        {displayedCards.map((obj) => (
          <div key={obj.id} ref={(el) => (cardRefs.current[obj.id] = el)}>
            <Card key={obj.id} {...obj} />
          </div>
        ))}
      </div>
      <Pagination
        totalCards={sortedData}
        cardsPerPage={cardsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </section>
  );
}
