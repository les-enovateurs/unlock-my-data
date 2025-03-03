"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import CookiesExplain from "@/components/CookiesExplain";
import Hero from "@/components/Hero";
import News from "@/components/News";

import QuelquesChiffres from "@/components/QuelquesChiffres";
import Transition1 from "@/components/Transition1";
// import News from "@/components/News";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <>
      <div
        id="wrapper_main  "
        className={`md:pb-12 transition-all duration-2000 ease-in-out transform ${
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-[10]"
        }`}
        suppressHydrationWarning
      >
        <Hero />
        {/* <Transition1 /> */}
        <News />
        <QuelquesChiffres />
        <CookiesExplain />
        {/* <Accroche/> */}
        {/* <Stats /> */}
        {/*   <Concept/>*/}
        {/* <Features/> */}
        {/* <Score/>  */}
        {/* <FAQ/>  */}
      </div>
      {/* // </div> */}
    </>
  );
}
