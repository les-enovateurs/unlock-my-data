'use client'

import Accroche from "@/components/Accroche";
// import Concept from "@/components/Concept";
import FAQ from "@/components/Faq";
// import Features from "@/components/Features";
// import Score from "@/components/Score";
// import Stats from "@/components/Stats";
import Image from "next/image";
import { useEffect, useState } from "react";
import datas_picture from "/public/pictures/datas_picture.png";
import CookiesExplain from "@/components/CookiesExplain";

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
            Informations sur la Protection et l'Accessibilité des Données
          </h2>
          <p className="md:text-xl">
            Les données sont les nouvelles pépites d'or. Elles permettent
            d'apprendre énormément de choses sur vous.
            <br />
            L'Union Européenne a rendu le pouvoir aux internautes avec le RGPD.
            C'est le moment ou jamais de s'en servir !
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
      
      <CookiesExplain />
        <Accroche/>
        {/*  <Stats/>
        <Concept/>
        <Features/>
        <Score/> */}
        <FAQ/> 
    </section>
  );
}
