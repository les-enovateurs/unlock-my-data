"use client";

import Image from "next/image";
import logo from "../public/logo.webp";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'

const Navs = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname()

  return (
    <>
      <header role="banner" className="flex items-center p-2 w-full">
        <Link href="/">
          <Image src={logo} unoptimized={false} alt={"logo Unlock My Data"} />
        </Link>

        <nav
          role="navigation"
          id="menu-de-navigation"
          aria-label="menu principal"
          className="flex flex-col items-center ml-auto"
        >
          <button
            aria-expanded={isNavOpen}
            aria-controls="menu-principal"
            className="flex items-center text-blue border-2 border-blue rounded-md md:hidden"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 cursor-pointer"
                fill="none"
                focusable={false}
                tabIndex={0}
                viewBox="0 0 24 24"
                aria-label={"fermer"}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                focusable={false}
                className="h-10 w-10 cursor-pointer"
                fill="none"
                aria-label={"ouvrir"}
                tabIndex={0}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
          <ul
            id="menu-principal"
            className={`my-6 text-blue font-bold flex flex-col gap-y-2 md:flex md:flex-row md:my-4 md:gap-x-5 items-center md:w-full md:px-10 ${isNavOpen ? "" : "hidden"}`}
          >
            <li>
              <Link href={"/list"} className={`${pathname === "/list" ? "underline underline-offset-4" : ""} hover:underline hover:underline-offset-4`}>
                Annuaire
              </Link>
            </li>
            <li>
              <Link href={"/discord"} className={`${pathname === "/discord" ? "underline underline-offset-4" : ""} hover:underline hover:underline-offset-4`}>
                Etude sur Discord
              </Link>
            </li>
            <li>
              <Link href={"/google"} className={`${pathname === "/google" ? "underline underline-offset-4" : ""} hover:underline hover:underline-offset-4`}>
                Etude sur Google
              </Link>
            </li>
            <li>
              <Link href={"/instagram"} className={`${pathname === "/instagram" ? "underline underline-offset-4" : ""} hover:underline hover:underline-offset-4`}>
                Etude sur Instagram
              </Link>
            </li>
            <li>
              <Link href={"/twitch"} className={`${pathname === "/twitch" ? "underline underline-offset-4" : ""} hover:underline hover:underline-offset-4`}>
                Etude sur Twitch
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Navs;
