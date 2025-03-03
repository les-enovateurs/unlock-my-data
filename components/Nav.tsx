"use client";

import Link from "next/link";
import Container from "./ui/Container";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Border from "./ui/Border";
import Image from "next/image";
import titre from "/public/logoUMD.webp";

const navItems = [
  {
    pathName: "/",
    label: "Accueil",
  },
  {
    pathName: "/list",
    label: "Annuaire",
  },
  [
    {
      pathName: "/comparatif_reseaux_sociaux",
      label: "Comparatif des réseaux sociaux",
    },
    {
      pathName: "/comparatif_applications",
      label: "Comparatif des applications",
    },
  ],
];

export default function Nav() {
  const targetRef = useRef<HTMLLIElement>(null);
  const targetRef2 = useRef<HTMLLIElement>(null);
  const targetRef3 = useRef<HTMLLIElement>(null);
  const targetRef4 = useRef<HTMLDivElement>(null);

  const [refsLoaded, setRefsLoaded] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setRefsLoaded(true);
  }, [targetRef, targetRef2, targetRef3, targetRef4]);

  return (
    <header className="bg-color1 shadow-sm  w-screen  py-1 ">
      <div className="relative flex flex-row  justify-between container  mx-auto">
        <Link href="/" className="flex bg-color1 px-1 items-center gap-2 w-1/2">
          <Image
            src={titre}
            // unoptimized={true}
            alt={"logo Unlock My Data"}
          />
        </Link>

        <nav className="   items-stretch hidden md:block w-full pl-6 align-stretch  py-1">
          <ul className="flex  items-center  h-[10vh] w-full">
            <li
              ref={targetRef}
              className="mx-1 w-1/2 border-2 border-color4 rounded-xl relative bg-color1 text-center min-h-[10vh] flex items-center justify-center"
            >
              <Link
                href="/"
                className="flex bg-color1 items-center justify-center text-color4  transition-colors duration-200 w-full h-full"
              >
                <span className="align-middle z-10">Accueil</span>
              </Link>
              {/* <Border rref={targetRef.current} /> */}
            </li>

            <li
              ref={targetRef2}
              className="w-1/2 border-2 border-color4 rounded-xl relative bg-color1 text-center min-h-[10vh] flex items-center justify-center"
            >
              <Link
                href="/list"
                className="mx-1 flex bg-color1 items-center justify-center text-color4  transition-colors duration-200 w-full h-full"
              >
                <span className="align-middle z-10">Annuaire</span>
              </Link>
              {/* <Border rref={targetRef2.current} /> */}
            </li>

            <li
              ref={targetRef3}
              className="mx-1 w-1/2 border-2 border-color4 rounded-xl relative bg-color1 text-center min-h-[10vh] flex items-center justify-center"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="flex bg-color1 items-center justify-center text-color4  transition-colors duration-200 w-full h-full">
                <span className="align-middle z-10">Comparatifs</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-color1 shadow-lg z-20">
                  <Link
                    href="/comparatif_reseaux_sociaux"
                    className="block p-4 text-color4  transition-colors duration-200"
                  >
                    Comparatif des réseaux sociaux
                  </Link>
                  <Link
                    href="/comparatif_appli"
                    className="block p-4 text-color4  transition-colors duration-200"
                  >
                    Comparatif des applications
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
