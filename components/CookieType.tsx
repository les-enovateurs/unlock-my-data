"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Border from "./ui/Border";

type CookieList = {
  keyText: string;
  valueText: string;
};

export default function CookieType({ obj,index }: any) {
  const targetRef = useRef<HTMLDivElement>(null);
  return (
    <article ref={targetRef} className="pt-3 bg-color1 relative pb-6 pr-5 md:pr-2 z-20 ">
      <div className="flex items-start content-center items-center z-20 ">
        <Image
          src={obj.img}
          width={50}
          height={50}
          alt="icone"
          className="z-20 mx-2"
        />
        <h3 className="m-2 pl-2 text-xl h-full align-middle text-color4 leading-2 z-20">{obj.title}</h3>
      </div>
      <div className="relative flex w-1/2 border-1 border-color4 m-2 z-20"></div>
      <p className="relative text-color4 z-20 mx-2">{obj.text}</p>
      {/* {index >= 0 && <Border rref={targetRef.current} cookie={true} />} */}
    </article>
  );
}
