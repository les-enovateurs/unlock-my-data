"use client";
import React, { forwardRef } from "react";

const rosepale: string = "#f9e8e0";

interface Props {
  rose?: boolean;
  icone?: boolean;
  rref?: HTMLDivElement | HTMLLIElement | null;
  cookie?: boolean;
  ttype?: string;
}
export default function Border({
  ttype = "",
  rose = false,
  icone = false,
  cookie = false,
  rref,
}: Props) {
  if (!rref) return null;
  const width = (rref as HTMLElement).clientWidth;
  const height = (rref as HTMLElement).clientHeight;

  // Génère les 4 points du quadrilatère
  // chacun a un angle et un rayon aléatoire autour d'une position centrale
  const angle1 = Math.random() * 2 * Math.PI;
  const angle2 = Math.random() * 2 * Math.PI;
  const angle3 = Math.random() * 2 * Math.PI;
  const angle4 = Math.random() * 2 * Math.PI;

  const rayon1 = Math.random() * 10;
  const rayon2 = Math.random() * 10;
  const rayon3 = Math.random() * 10;
  const rayon4 = Math.random() * 10;

  const decalageWidth = cookie ? -10 : 5;
  const decalageHeight = cookie ? -10 : 5;

  const p1 = `${0 + rayon1 * Math.cos(angle1)},${
    0 + rayon1 * Math.sin(angle1)
  }`;
  const p2 = `${width - decalageWidth + rayon2 * Math.cos(angle2)},${
    0 + rayon2 * Math.sin(angle2)
  }`;
  const p3 = `${width - decalageHeight + rayon3 * Math.cos(angle3)},${
    height - 3 + rayon3 * Math.sin(angle3)
  }`;
  const p4 = `${0 + rayon4 * Math.cos(angle4)},${
    height - 3 + rayon4 * Math.sin(angle4)
  }`;

  const XPointHautGauche = p1.substring(0, p1.indexOf(","));
  const YPointHautGauche = p1.substring(p1.indexOf(",") + 1, p1.length);

  return (
    <svg
      width="100%"
      height="100%"
      className="absolute h-[10vh] inset-0 text-red-500/20 fill-current h-full z-1"
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
      { ttype === "" && (
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
