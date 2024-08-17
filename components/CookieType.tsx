import React from "react";

type CookieList = {
  keyText: string,
  valueText: string,
}

export default function CookieType({ keyText, valueText }: CookieList) {
  return (
    <li className=" md:text-xl">
      <strong>{keyText}:</strong> {valueText}
    </li>
  );
}
