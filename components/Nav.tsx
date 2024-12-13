"use client";

import Link from "next/link";
import Container from "./ui/Container";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Border from "./ui/Border";
import Image from "next/image";
// import logo from "../public/logo.webp";
import titre from "/public/titre.png";

export default function Nav() {
  const targetRef = useRef<HTMLLIElement>(null);
  const targetRef2 = useRef<HTMLLIElement>(null);
  const targetRef3 = useRef<HTMLLIElement>(null);
  const targetRef4 = useRef<HTMLDivElement>(null);
  // const [dimensions, setDimensions] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // const [dimensions2, setDimensions2] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // const [dimensions3, setDimensions3] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // const [dimensions4, setDimensions4] = useState({
  //   width: 0,
  //   height: 0,
  // });
  useEffect(() => {
    // function handleResize() {
    //   // Update the state or perform any other actions when the
    //   // browser is resized
    //   if (targetRef.current) {
    //     console.log(
    //       "targetRef",
    //       targetRef.current.offsetWidth,
    //       targetRef.current.offsetWidth
    //     );
    //     setDimensions({
    //       width: targetRef.current.offsetWidth,
    //       height: targetRef.current.offsetHeight,
    //     });
    //   }
    //   if (targetRef2.current) {
    //     setDimensions2({
    //       width: targetRef2.current.offsetWidth,
    //       height: targetRef2.current.offsetHeight,
    //     });
    //   }
    //   if (targetRef3.current) {
    //     setDimensions3({
    //       width: targetRef3.current.offsetWidth,
    //       height: targetRef3.current.offsetHeight,
    //     });
    //   }
    // }

    // Attach the event listener to the window object
    // window.addEventListener("resize", handleResize);

    // Remove the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  // useLayoutEffect(() => {
  //   if (targetRef.current) {
  //     console.log(
  //       "targetRef",
  //       targetRef.current.offsetWidth,
  //       targetRef.current.offsetWidth
  //     );
  //     setDimensions({
  //       width: targetRef.current.offsetWidth,
  //       height: targetRef.current.offsetHeight,
  //     });
  //   }
  //   if (targetRef2.current) {
  //     setDimensions2({
  //       width: targetRef2.current.offsetWidth,
  //       height: targetRef2.current.offsetHeight,
  //     });
  //   }
  //   if (targetRef3.current) {
  //     setDimensions3({
  //       width: targetRef3.current.offsetWidth,
  //       height: targetRef3.current.offsetHeight,
  //     });
  //   }

  //   if (targetRef4.current) {
  //     setDimensions4({
  //       width: targetRef4.current.offsetWidth,
  //       height: targetRef4.current.offsetHeight,
  //     });
  //   }
  }, []);
  return (
    <header className="bg-[#ffe5bd] shadow-sm h-[10vh] w-full py-3">
      <div className=" relative flex flex-row items-stretch justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 w-1/2">
          <Image
            src={titre}
            unoptimized={true}
            alt={"logo Unlock My Data"}
          />
        </Link>

        <nav className=" min-h-[10vh] items-stretch hidden md:block w-full pl-6 align-stretch h-full">
          <ul className="flex  items-center  h-[10vh] w-full">
            <li
              ref={targetRef}
              className="w-1/2 relative text-center min-h-[10vh]"
            >
              <Link
                href="/"
                className="flex flex-col items-center justify-center text-gray-600 hover:text-red-500 transition-colors duration-200 text-center align-middle"
              >
                <span className="align-middle z-10 text-texteBlack">
                  Accueil
                </span>
              </Link>
              <Border rref={targetRef.current} />
            </li>

            <li
              ref={targetRef2}
              className="w-1/2 relative text-center min-h-[10vh]"
            >
              <Link
                href="/"
                className="flex flex-col items-center justify-center text-gray-600 hover:text-red-500 transition-colors duration-200 text-center align-middle"
              >
                <span className="align-middle z-10 text-texteBlack">
                  Accueil
                </span>
              </Link>
              <Border rref={targetRef2.current} />
            </li>

            <li
              ref={targetRef3}
              className="w-1/2 relative text-center min-h-[10vh]"
            >
              <Link
                href="/"
                className="flex flex-col items-center justify-center text-gray-600 hover:text-red-500 transition-colors duration-200 text-center align-middle"
              >
                <span className="align-middle z-10 text-texteBlack">
                  Accueil
                </span>
              </Link>
              <Border rref={targetRef3.current} />
            </li>
          </ul>
        </nav>
        {/* carre rose */}
        <div className="flex absolute right-0 top-0 translate-x-full ml-4 h-[20vh]">
          <div ref={targetRef4} className="w-[50px] h-full">
            <Border
              rref={targetRef4.current}
              rose={true}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
