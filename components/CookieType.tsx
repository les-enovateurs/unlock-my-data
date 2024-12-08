import React from "react";
import Image from "next/image";

type CookieList = {
  keyText: string;
  valueText: string;
};

export default function CookieType({ obj }: any) {
  return (
    <article className="mb-6 mr-5 md:mr-2">
      <div className="flex items-start content-center items-center">
        <Image
          src={obj.img}
          width={50}
          height={50}
          alt="icone"
          className=""
        />
        <h3 className="pl-2 text-xl h-full align-middle text-white leading-2">{obj.title}</h3>
      </div>
      <div className="w-1/2 border-1 border-white my-2"></div>
      <p className="text-white">{obj.text}</p>
    </article>
  );
}
