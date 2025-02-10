"use client";
import React, { forwardRef, useEffect, useState } from "react";

const rosepale: string = "#f9e8e0";

interface Props {
  rose?: boolean;
  icone?: boolean;
  rref?: HTMLDivElement | HTMLLIElement | null;
  cookie?: boolean;
  ttype?: string;
  seed?: number;
  idparent?: string;
}
export default function Border({
  ttype = "",
  rose = false,
  icone = false,
  cookie = false,
  rref,
  seed = 42,
  idparent = "",
}: Props) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  seed = seed * Math.random();
  useEffect(() => {
    const updateDimensions = () => {

      if (idparent) {
        const el = document.getElementById(idparent);
        if (el) {
          setDimensions({
            width: el.clientWidth,
            height: el.clientHeight,
          });
        }
      } else if (rref) {
        setDimensions({
          width: (rref as HTMLElement).clientWidth,
          height: (rref as HTMLElement).clientHeight,
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Add event listener
    window.addEventListener("resize", updateDimensions);

    // Cleanup
    return () => window.removeEventListener("resize", updateDimensions);
  }, [rref]);

  if (!rref && !idparent) {
    return null;
  }

  const { width, height } = dimensions;

  if (cookie) {
    // console.log(width, height);
  }

  

  // Fonction de pseudo-random basée sur une seed
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Génère les 4 points du quadrilatère
  // chacun a un angle et un rayon aléatoire autour d'une position centrale
  const angle1 = seededRandom(seed + 1) * 2 * Math.PI;
  const angle2 = seededRandom(seed + 2) * 2 * Math.PI;
  const angle3 = seededRandom(seed + 3) * 2 * Math.PI;
  const angle4 = seededRandom(seed + 4) * 2 * Math.PI;

  let rayon1 = seededRandom(seed + 5) * 10;
  let rayon2 = seededRandom(seed + 6) * 10;
  let rayon3 = seededRandom(seed + 7) * 10;
  let rayon4 = seededRandom(seed + 8) * 10;

  if (ttype !== "bouton") {
    rayon1 = rayon1 * 0.5;
    rayon2 = rayon2 * 0.5;
    rayon3 = rayon3 * 0.5;
    rayon4 = rayon4 * 0.5;
  }

  const decalageWidth = cookie ? -10 : 5;
  const decalageHeight = cookie ? -10 : 5;

  const p1 = `${0 + rayon1 * Math.cos(angle1)},${
    0 + rayon1 * Math.sin(angle1)
  }`;
  const p2 = `${dimensions.width - decalageWidth + rayon2 * Math.cos(angle2)},${
    0 + rayon2 * Math.sin(angle2)
  }`;
  const p3 = `${
    dimensions.width - decalageHeight + rayon3 * Math.cos(angle3)
  },${dimensions.height - 3 + rayon3 * Math.sin(angle3)}`;
  const p4 = `${0 + rayon4 * Math.cos(angle4)},${
    dimensions.height - 3 + rayon4 * Math.sin(angle4)
  }`;

  const XPointHautGauche = p1.substring(0, p1.indexOf(","));
  const YPointHautGauche = p1.substring(p1.indexOf(",") + 1, p1.length);

  // if (ttype == "decor") {q
    // console.log(ttype,p1,p2,p3,p4);
  // }

  return (
    <svg
      width="100%"
      height="100%"
      className="absolute inset-0 text-red-500/20 fill-current h-full z-1"
    >
      <defs>
        <pattern
          id="diagonalLines"
          width="2"
          height="2"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-10)"
        >
          <line x1="0" y1="0" x2="0" y2="2" stroke="#FF7F50" strokeWidth="1" />
        </pattern>
      </defs>
      {ttype === "" && (
        <polygon
          points={`${p1} ${p2} ${p3} ${p4}`}
          fill={rose ? rosepale : "#d2402d"}
          stroke={rose ? rosepale : "#d2402d"}
          strokeWidth="3"
        />
      )}

      {ttype === "bouton" && (
        <polygon
          points={`${p1} ${p2} ${p3} ${p4}`}
          fill={"#d2402d"}
          stroke={"#ffe5bd"}
          strokeWidth="3"
        />
      )}
      {/* {rose && ( */}
      <polygon
        points={`${p1} ${p2} ${p3} ${p4}`}
        fill="#ff634d"
        stroke="#ff634d"
        strokeWidth="3"
        transform="translate(4, 4)"
        opacity="0.3"
      />
      {/* )} */}
      {!icone && !rose && (
        <rect
          width="30%"
          height="30%"
          transform="translate(10, 10)"
          fill="url(#diagonalLines)"
        />
      )}
      {/* //ajout pour image */}
      {icone && !rose && (
        <rect
          width="70px"
          height="70px"
          transform={`translate(${XPointHautGauche + 4}, ${
            YPointHautGauche + 4
          })`}
          fill="url(#diagonalLines)"
        />
      )}
    </svg>
  );
}

// export default Border;
