"use client";

import Link from "next/link";
import Container from "./ui/Container";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Border from "./ui/Border";
import Image from "next/image";
import titre from "/public/logoUMD.webp";

export default function Nav() {
  const targetRef = useRef<HTMLLIElement>(null);
  const targetRef2 = useRef<HTMLLIElement>(null);
  const targetRef3 = useRef<HTMLLIElement>(null);
  const targetRef4 = useRef<HTMLDivElement>(null);

  const [refsLoaded, setRefsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setRefsLoaded(true);
  }, [targetRef, targetRef2, targetRef3, targetRef4]);

  return (
    <header className=" shadow-sm h-[10vh] w-full py-3">
      <div className="relative flex flex-row items-stretch justify-between max-w-6xl mx-auto">
        <Link
          href="/"
          className="flex bg-color1 justify-center items-center gap-2 w-1/2"
        >
          <Image
            src={titre}
            // unoptimized={true}
            alt={"logo Unlock My Data"}
          />
        </Link>

        <nav className="   items-stretch hidden md:block w-full pl-6 align-stretch h-full">
          <ul className="flex  items-center  h-[10vh] w-full">
            <li
              ref={targetRef}
              className="w-1/2 relative bg-color1 text-center min-h-[10vh] flex items-center justify-center"
            >
              <Link
                href="/"
                className="flex bg-color1 items-center justify-center text-gray-600 hover:text-red-500 transition-colors duration-200 text-center w-full h-full"
              >
                <span className="align-middle z-10 text-color4">
                  Accueil
                </span>
              </Link>
              {/* <Border rref={targetRef.current} /> */}
            </li>

            <li
              ref={targetRef2}
              className="w-1/2 relative bg-color1 text-center min-h-[10vh] flex items-center justify-center"
            >
              <Link
                href="/"
                className="flex flex-col items-center justify-center  hover:text-red-500 transition-colors duration-200 text-center align-middle"
              >
                <span className="align-middle z-10 text-color4">
                  Accueil
                </span>
              </Link>
              {/* <Border rref={targetRef2.current} /> */}
            </li>

            <li
              ref={targetRef3}
              className="w-1/2 relative bg-color1 text-center min-h-[10vh] flex items-center justify-center"
            >
              <Link
                href="/"
                className="flex flex-col items-center justify-center text-gray-600 hover:text-red-500 transition-colors duration-200 text-center align-middle"
              >
                <span className="align-middle z-10 text-color4">
                  Accueil
                </span>
              </Link>
              {/* <Border rref={targetRef3.current} /> */}
            </li>
          </ul>
        </nav>
        {/* carre rose */}
        <div className="flex absolute right-0 top-0 translate-x-full ml-4 h-[20vh]">
          <div ref={targetRef4} className="w-[50px] h-full">
            {/* <Border
              rref={targetRef4.current}
              rose={true}
            /> */}
          </div>
        </div>
      </div>
    </header>
  );
}
