"use client";

import React, { useState } from "react";
import CookieType from "./CookieType";
import Image from "next/image";

const arrayCookiesType = [
  "Cookies de session : Temporaires, ils disparaissent lorsque vous fermez votre navigateur. Ils sont souvent utilisés pour maintenir votre connexion pendant que vous naviguez sur le site.",
  "Cookies persistants : Ces cookies restent sur votre appareil après la fermeture du navigateur et aident à mémoriser vos préférences pour vos prochaines visites.",
  "Cookies propriétaires : Créés par le site web que vous visitez, ils stockent des informations utiles pour ce site.",
  "Cookies tiers : Créés par d'autres sites, souvent pour des publicités ou des analyses.",
  "Cookies nécessaires : Indispensables au fonctionnement du site, ils vous permettent de naviguer et d'utiliser les fonctionnalités de base.",
  "Cookies de performance : Ils collectent des informations sur la manière dont vous utilisez le site pour aider à améliorer ses performances.",
  "Cookies de fonctionnalité : Ils se souviennent de vos choix (comme la langue ou la région) pour offrir une expérience personnalisée.",
  "Cookies publicitaires : Utilisés pour diffuser des annonces pertinentes en fonction de vos intérêts.",
];

export default function CookiesExplain() {
  const [isVisible, setIsVisble] = useState(false);
  const toggleText = () => {
    setIsVisble(!isVisible)
  }
  return (
    <div className="mt-4 pt-2 border-t-2 border-blue">
      <div>
        <p>
          Un <span className="text-blue font-semibold">cookie</span> est un
          petit fichier texte placé sur votre appareil par les sites web que
          vous visitez. Ils sont utilisés pour faire fonctionner les sites web
          de manière plus efficace et pour fournir des informations aux
          propriétaires du site. Il existe différents types de cookies :
        </p>
        <div className="flex justify-end" onClick={toggleText}>
          <Image
            width={20}
            height={20}
            src="/circle-chevron-down-solid.svg"
            alt="flèche pour ouvrir une liste"
          />
        </div>
      </div>
      <ul className={`list-inside list-decimal flex flex-col ${isVisible ? "flex": "hidden"}`}>
        {arrayCookiesType.map((cookie: string, index: number) => (
          <CookieType key={index} text={cookie} />
        ))}
      </ul>
    </div>
  );
}
